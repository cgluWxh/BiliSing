let socket;
let currentRoom = null;
let currentUser = null;
let currentUserType = null;

let triggeredJoin = false; // 用于防止重复加入房间
function joinRoom() {
    if (triggeredJoin) return;
    const roomId = document.getElementById('room-id').value.trim();
    const userName = document.getElementById('user-name').value.trim();
    const userType = document.getElementById('user-type').value;
    
    if (!roomId || !userName) {
        showError('请填写房间ID和用户名');
        return;
    }

    triggeredJoin = true; // 设置为true，防止重复加入

    localStorage.setItem('lastRoomInfo', JSON.stringify({
        roomId: roomId,
        userName: userName,
        userType: userType
    }));

    if (userType === 'master') {
        if (window.__BILISING_USERSCRIPT_ENABLED__) {
            location.href = `https://bilibili.com/?bilising-room-id=${roomId}`;
            return;
        } else {
            if (confirm("您没有安装BiliSing用户脚本，可能出现无法正常播放视频的问题，是否安装用户脚本？")) {
                location.href = "/static/bilising.user.js";
                return;
            }
        }
    }
    
    // 初始化Socket.IO连接
    socket = io();
    
    // 设置事件监听器
    setupSocketListeners();
    
    // 加入房间
    socket.emit('join_room', {
        room_id: roomId,
        user_name: userName,
        user_type: userType
    });
    
    currentRoom = roomId;
    currentUser = userName;
    currentUserType = userType;
}

function setupSocketListeners() {
    socket.on('room_joined', function(data) {
        document.getElementById('join-section').style.display = 'none';
        document.getElementById('room-section').style.display = 'block';
        const roomTitleEle = document.createElement('span');
        roomTitleEle.id = 'room-title';
        
        if (currentUserType === 'master') {
            document.querySelector('.container').classList.add('player');
            document.getElementById('master-view').style.display = 'block';
            document.getElementById('masterInfo').prepend(roomTitleEle)
        } else {
            document.getElementById('slave-view').style.display = 'flex';
            document.getElementById('basicInfo').prepend(roomTitleEle)
        }
        roomTitleEle.innerHTML = `
            <p>房间: ${currentRoom} <span id="bilising-toggle-text">单击展示点歌二维码</span></p>
            <div id="bilising-qr-code" style="display: none; text-align: center;">
                <canvas id="bilising-qr-image"></canvas>
                <p>扫码加入房间</p>
            </div>
        `;
        roomTitleEle.addEventListener('click', function() {
            const qrCodeSection = document.getElementById('bilising-qr-code');
            const toggleText = document.getElementById('bilising-toggle-text');
            if (qrCodeSection.style.display === 'none') {
                qrCodeSection.style.display = 'block';
                toggleText.textContent = '单击隐藏点歌二维码';
                const maxWidth = 480 / (window.devicePixelRatio || 1);
                const rect = qrCodeSection.getBoundingClientRect();
                const width = Math.min(maxWidth, rect.width * 0.8);
                QRCode.toCanvas(document.getElementById('bilising-qr-image'), `${location.origin}/?bilising-room-id=${currentRoom}`, {
                    width: width,
                    margin: 1,
                    errorCorrectionLevel: 'H'
                })
            } else {
                toggleText.textContent = '单击展示点歌二维码';
                qrCodeSection.style.display = 'none';
            }
        });

        updateCurrentPlaying(data.current_playing);
        
        updatePlaylist(data.play_list);
        updatePlayedSongs(data.played_songs || []);
        updateChatMessages(data.messages || []);
    });
    
    socket.on('now_playing', function(data) {
        updateCurrentPlaying(data.current_playing);
    });
    
    socket.on('playlist_updated', function(data) {
        updatePlaylist(data.play_list);
        updatePlayedSongs(data.played_songs || []);
    });
    
    socket.on('error', function(data) {
        triggeredJoin = false; // 重置触发状态
        showError(data.message);
    });
    
    socket.on('new_message', function(data) {
        if (data.message) {
            // 单条新消息
            appendSingleMessage(data.message);
        } else if (data.messages) {
            // 多条消息（用于初始化）
            updateChatMessages(data.messages);
        }
    });
}

function updateCurrentPlaying(song) {
    // 如果是slave则只显示文字
    if (currentUserType === 'slave') {
        const curSongContent = document.getElementById('current-song-content');
        if (song && song.title) {
            curSongContent.innerHTML = `
                <div class="song-title">${song.title}</div>
                <div class="song-producer">UP主: ${song.producer}</div>
            `;
        } else {
            curSongContent.innerHTML = '暂无正在播放的歌曲';
        }
        return;
    }
    const videoPlayer = document.getElementById('video-player');
    
    if (song && song.url) {
        // 从哔哩哔哩URL提取视频ID并创建嵌入链接
        const bvMatch = song.url.match(/BV[\w]+/);
        if (bvMatch) {
            const bvId = bvMatch[0];
            const embedUrl = `https://player.bilibili.com/player.html?bvid=${bvId}&autoplay=1&muted=0&danmaku=0`;
            videoPlayer.innerHTML = `<iframe src="${embedUrl}" allowfullscreen sandbox="allow-scripts allow-same-origin" allow="fullscreen;autoplay"></iframe>`;
        } else {
            videoPlayer.innerHTML = '<div class="no-video">无法播放该视频</div>';
        }
    } else {
        videoPlayer.innerHTML = '<div class="no-video">暂无正在播放的歌曲</div>';
    }
}

function updatePlaylist(playlist) {
    const container = document.getElementById('playlist-container');
    const nextSongContent = document.getElementById('next-song-content');
    
    if (playlist.length === 0) {
        container.innerHTML = '<p>暂无歌曲</p>';
        if (nextSongContent) {
            nextSongContent.innerHTML = '暂无歌曲';
        }
        return;
    }
    
    // 更新下一首歌曲信息（Master视图）
    if (nextSongContent && playlist.length > 0) {
        const nextSong = playlist[0];
        nextSongContent.innerHTML = `
            <span class="song-title">${nextSong.title}</span>
        `;
    }
    
    // 更新播放列表
    let html = '';
    playlist.forEach((song, index) => {
        html += `
            <div class="song-item">
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-producer">UP主: ${song.producer}</div>
                </div>
                ${currentUserType === 'slave' ? `
                <div class="song-actions">
                <button class="move-up" onclick="moveSong(${index}, 0)" ${index === 0 ? 'disabled' : ''}>顶</button>
                    <button class="move-up" onclick="moveSong(${index}, ${index - 1})" ${index === 0 ? 'disabled' : ''}>上</button>
                    <button class="move-down" onclick="moveSong(${index}, ${index + 1})" ${index === playlist.length - 1 ? 'disabled' : ''}>下</button>
                    <button class="remove" onclick="removeSong(${index})">删</button>
                </div>
                ` : ''}
            </div>
        `;
    });
    container.innerHTML = html;
}

function updatePlayedSongs(playedSongs) {
    const container = document.getElementById('played-songs-container');
    
    if (playedSongs.length === 0) {
        container.innerHTML = '<p>暂无已播放歌曲</p>';
        return;
    }
    
    let html = '';
    playedSongs.forEach((song, index) => {
        html += `
            <div class="song-item">
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-producer">UP主: ${song.producer}</div>
                </div>
                ${currentUserType === 'slave' ? `
                <div class="song-actions">
                    <button class="replay-btn" onclick="replaySong(${index})">重播</button>
                </div>
                ` : ''}
            </div>
        `;
    });
    container.innerHTML = html;
}

function updateChatMessages(messages) {
    const container = document.getElementById('chat-messages');
    
    if (messages.length === 0) {
        container.innerHTML = '<p>暂无消息</p>';
        return;
    }
    
    let html = '';
    messages.forEach(message => {
        const messageTime = new Date(message.timestamp * 1000).toLocaleTimeString();
        const messageClass = message.message_type === 'user' ? 'user' : 'system';
        
        html += `
            <div class="chat-message ${messageClass}">
                <div class="message-user">${message.user_name}</div>
                <div class="message-content">${escapeHtml(message.content)}</div>
                <div class="message-time">${messageTime}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // 滚动到底部
    container.scrollTop = container.scrollHeight;
}

function appendSingleMessage(message) {
    const container = document.getElementById('chat-messages');
    
    // 如果容器显示"暂无消息"，先清空
    if (container.innerHTML.includes('暂无消息')) {
        container.innerHTML = '';
    }
    
    const messageTime = new Date(message.timestamp * 1000).toLocaleTimeString();
    const messageClass = message.message_type === 'user' ? 'user' : 'system';
    
    const messageHtml = `
        <div class="chat-message ${messageClass}">
            <div class="message-user">${message.user_name}</div>
            <div class="message-content">${escapeHtml(message.content)}</div>
            <div class="message-time">${messageTime}</div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', messageHtml);
    
    // 滚动到底部
    container.scrollTop = container.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addSong() {
    const url = document.getElementById('bilibili-url').value.trim();
    
    if (!url) {
        showError('请输入哔哩哔哩链接');
        return;
    }
    
    if (!url.includes('bilibili.com') && !url.includes('b23.tv') && !url.includes('bili2233.cn')) {
        showError('请输入有效的哔哩哔哩链接');
        return;
    }

    const matchedUrl = /https?:\/\/[^\s"'<>()]+/.exec(url);
    if (!matchedUrl) {
        showError('请输入有效的哔哩哔哩链接');
        return;
    }
    
    socket.emit('add_song', {
        room_id: currentRoom,
        url: matchedUrl[0],
        user_name: currentUser
    });
    
    document.getElementById('bilibili-url').value = '';
}

function removeSong(index) {
    socket.emit('remove_song', {
        room_id: currentRoom,
        index: index,
        user_name: currentUser
    });
}

function moveSong(fromIndex, toIndex) {
    if (toIndex < 0) return;
    
    socket.emit('reorder_songs', {
        room_id: currentRoom,
        from_index: fromIndex,
        to_index: toIndex
    });
}

function playNextSong() {
    socket.emit('next_song', {
        room_id: currentRoom,
        user_name: currentUser
    });
}

function replaySong(index) {
    socket.emit('replay_song', {
        room_id: currentRoom,
        index: index,
        user_name: currentUser
    });
}

function sendMessage() {
    const messageInput = document.getElementById('chat-message-input');
    const message = messageInput.value.trim();
    
    if (!message) {
        return;
    }
    
    socket.emit('send_message', {
        room_id: currentRoom,
        user_name: currentUser,
        message: message
    });
    
    messageInput.value = '';
}

function showError(message) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.innerHTML = `<div class="error">${message}</div>`;
    setTimeout(() => {
        errorContainer.innerHTML = '';
    }, 5000);
}

// 按Enter键提交
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (document.getElementById('join-section').style.display !== 'none') {
            joinRoom();
        } else if (document.activeElement.id === 'bilibili-url') {
            addSong();
        } else if (document.activeElement.id === 'chat-message-input') {
            sendMessage();
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const userTypeSelect = document.getElementById('user-type');
    const userNameInput = document.getElementById('user-name');
    const roomIdInput = document.getElementById('room-id');
    userTypeSelect.addEventListener('change', function() {
        currentUserType = userTypeSelect.value;
        if (currentUserType === 'master') {
            userNameInput.value = '播放设备';
            userNameInput.style.display = 'none';
        } else {
            if (userNameInput.value == '播放设备') userNameInput.value = '';
            userNameInput.style.display = 'block';
        }
    });
    const lastInfo = localStorage.getItem('lastRoomInfo');
    if (lastInfo) {
        const { roomId, userName, userType } = JSON.parse(lastInfo);
        roomIdInput.value = roomId || '';
        userTypeSelect.value = userType || 'slave';
        userNameInput.value = userName || '';
    }
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('bilising-room-id');
    if (roomId) {
        roomIdInput.value = roomId;
        userTypeSelect.value = 'slave';
        if (userNameInput.value == '播放设备') userNameInput.value = '';
    }
    userTypeSelect.dispatchEvent(new Event('change'));
});