let socket;
let currentRoom = null;
let currentUser = null;
let currentUserType = null;
let currentPlaying = null;

let triggeredJoin = false; // 用于防止重复加入房间
function joinRoom(defaultuser = false, masterMode = null) {
    if (triggeredJoin) return;
    const roomId = document.getElementById('room-id').value.trim();
    const userName = document.getElementById('user-name').value.trim() || (defaultuser ? '游客' : '');
    const userType = document.getElementById('user-type').value;
    
    if (!roomId) {
        showError('❌ 请填写房间ID');
        return;
    }

    if (!userName && userType !== 'master') {
        showError('❌ 请填写用户名');
        return;
    }

    localStorage.setItem('lastRoomInfo', JSON.stringify({
        roomId: roomId,
        userName: userName,
        userType: userType
    }));

    if (userType === 'master') {
        if (masterMode === 'plugin' || (!masterMode && window.__BILISING_USERSCRIPT_ENABLED__)) {
            if (window.__BILISING_USERSCRIPT_ENABLED__) {
                location.href = `https://bilibili.com/?bilising-room-id=${roomId}&bilising-server=${location.protocol}//${location.host}`;
            } else {
                alert("⚠️ 您需要先安装浏览器插件才能正常使用！")
            }
        } else if (masterMode === 'web') {
            location.href = `/v/${roomId}`;
        }
        return;
    }

    triggeredJoin = true; // 设置为true，防止重复加入
    
    // 初始化Socket.IO连接
    socket = io();
    
    // 设置事件监听器
    setupSocketListeners();
    
    currentRoom = roomId;
    currentUser = userName;
    currentUserType = userType;
}

function setupSocketListeners() {
    // 监听重连事件
    socket.on('connect', function() {
        // 如果已经在房间中，自动重新加入房间
        if (currentRoom && currentUser && currentUserType) {
            console.log('检测到重连，自动重新加入房间:', currentRoom);
            socket.emit('join_room', {
                room_id: currentRoom,
                user_name: currentUser,
                user_type: currentUserType
            });
        }
    });

    socket.on('room_joined', function(data) {
        // 防止重复创建UI元素
        if (document.getElementById('room-section').style.display !== 'block') {
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
                
                // 创建移动端底部 tab 切换器
                createMobileTabSwitcher();
            }
            roomTitleEle.innerHTML = `
                <p>🏠 房间: ${currentRoom}<br /><span id="bilising-toggle-text">📱 单击展示点歌二维码</span></p>
                <div id="bilising-qr-code" style="display: none; text-align: center;">
                    <canvas id="bilising-qr-image"></canvas>
                    <p>📱 扫码加入房间</p>
                </div>
            `;
            roomTitleEle.addEventListener('click', function() {
                const qrCodeSection = document.getElementById('bilising-qr-code');
                const toggleText = document.getElementById('bilising-toggle-text');
                if (qrCodeSection.style.display === 'none') {
                    qrCodeSection.style.display = 'block';
                    toggleText.textContent = '🙈 单击隐藏点歌二维码';
                    const maxWidth = 480 / (window.devicePixelRatio || 1);
                    const rect = qrCodeSection.getBoundingClientRect();
                    const width = Math.min(maxWidth, rect.width * 0.8);
                    QRCode.toCanvas(document.getElementById('bilising-qr-image'), `${location.origin}/?bilising-room-id=${currentRoom}`, {
                        width: width,
                        margin: 1,
                        errorCorrectionLevel: 'H'
                    })
                } else {
                    toggleText.textContent = '📱 单击展示点歌二维码';
                    qrCodeSection.style.display = 'none';
                }
            });
        }

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
    currentPlaying = song;
    if (currentUserType === 'slave') {
        const curSongContent = document.getElementById('current-song-content');
        if (song && song.title) {
            curSongContent.innerHTML = `
                <div class="song-title">${song.title}</div>
                <div class="song-producer">UP主: ${song.producer} 时长: ${formatDuration(song.duration)} 点播者: ${song.by}</div>
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

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    if (hours > 0) {
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updatePlaylist(playlist) {
    const container = document.getElementById('playlist-container');
    const nextSongContent = document.getElementById('next-song-content');
    
    if (playlist.length === 0) {
        container.innerHTML = '<p>暂无歌曲</p>';
        if (nextSongContent) {
            nextSongContent.innerHTML = '暂无歌曲';
        }
        // 处理总时长
        const estimatedDurationEle = document.getElementById('estimated-duration');
        // 获取当前播放歌曲时长
        let totalDuration = currentPlaying ? (currentPlaying.duration || 0) : 0;
        if (estimatedDurationEle) {
            estimatedDurationEle.textContent = `(总时长 ${formatDuration(totalDuration)})`;
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
    let totalDuration = 0;
    playlist.forEach((song, index) => {
        totalDuration += song.duration || 0;
        html += `
            <div class="song-item">
                <div class="song-info">
                    <div class="song-title">${index + 1}. ${song.title}</div>
                    <div class="song-producer">UP主: ${song.producer} 时长: ${formatDuration(song.duration)} 点播者: ${song.by}</div>
                </div>
                ${currentUserType === 'slave' ? `
                <div class="song-actions">
                <button class="move-up" onclick="moveSong(${index}, 0)" ${index === 0 ? 'disabled' : ''}>⏫</button>
                    <button class="move-up" onclick="moveSong(${index}, ${index - 1})" ${index === 0 ? 'disabled' : ''}>⬆️</button>
                    <button class="move-down" onclick="moveSong(${index}, ${index + 1})" ${index === playlist.length - 1 ? 'disabled' : ''}>⬇️</button>
                    <button class="remove" onclick="removeSong(${index})">❎</button>
                </div>
                ` : ''}
            </div>
        `;
    });
    totalDuration += currentPlaying.duration || 0;
    const estimatedDurationEle = document.getElementById('estimated-duration');
    if (estimatedDurationEle) {
        estimatedDurationEle.textContent = `(总时长 ${formatDuration(totalDuration)})`;
    }
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
                    <div class="song-producer">UP主: ${song.producer} 时长: ${formatDuration(song.duration)}</div>
                </div>
                ${currentUserType === 'slave' ? `
                <div class="song-actions">
                    <button class="replay-btn" onclick="replaySong(${index})">🔄</button>
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
    const addSongBtn = document.getElementById('add-song-btn');
    const url = document.getElementById('bilibili-url').value.trim();
    
    if (!url) {
        showError('❌ 请输入哔哩哔哩链接');
        return;
    }
    
    if (!url.includes('bilibili.com') && !url.includes('b23.tv') && !url.includes('bili2233.cn')) {
        showError('❌ 请输入有效的哔哩哔哩链接');
        return;
    }

    const matchedUrl = /https?:\/\/[^\s"'<>()]+/.exec(url);
    if (!matchedUrl) {
        showError('❌ 请输入有效的哔哩哔哩链接');
        return;
    }

    addSongBtn.innerHTML = "✅";
    addSongBtn.disabled = true; // 禁用按钮，防止重复提交
    
    socket.emit('add_song', {
        room_id: currentRoom,
        url: matchedUrl[0],
        user_name: currentUser
    });

    document.getElementById('bilibili-url').value = '';
    setTimeout(() => {
        addSongBtn.innerHTML = "➕";
        addSongBtn.disabled = false;
    }, 300);
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

let nextSongTimer = null;
function playNextSong() {
    const ele = document.querySelector('.next-song-btn');
    if (ele.innerHTML == "⏭️ 播放下一首") {
        ele.innerHTML = "⏭️ 确认切歌";
        nextSongTimer = setTimeout(() => {
            ele.innerHTML = "⏭️ 播放下一首";
        }, 1500);
        return;
    } else if (ele.innerHTML == "⏭️ 确认切歌") {
        clearTimeout(nextSongTimer);
        socket.emit('next_song', {
            room_id: currentRoom,
            user_name: currentUser
        });
        ele.innerHTML = "✅ 已提交";
        ele.setAttribute("disabled", "true");
        setTimeout(() => {
            ele.innerHTML = "⏭️ 播放下一首";
            ele.removeAttribute("disabled");
        }, 300);
    }
    
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
// 增加 compositionstart/end 监听，确保输入法状态准确
let isComposing = false;
document.addEventListener('compositionstart', function() {
    isComposing = true;
});
document.addEventListener('compositionend', function() {
    isComposing = false;
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        if (isComposing || e.isComposing || e.keyCode === 229) return; // 如果正在输入法组合，不触发提交
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
        const masterOptions = document.querySelectorAll('.master-options');
        const normalOptions = document.querySelectorAll('.normal-options');
        
        if (currentUserType === 'master') {
            userNameInput.value = '播放设备';
            userNameInput.style.display = 'none';
            if (masterOptions) masterOptions.forEach(option => option.style.display = 'block');
            if (normalOptions) normalOptions.forEach(option => option.style.display = 'none');
        } else {
            if (['播放设备', '游客'].includes(userNameInput.value)) userNameInput.value = '';
            userNameInput.style.display = 'block';
            if (masterOptions) masterOptions.forEach(option => option.style.display = 'none');
            if (normalOptions) normalOptions.forEach(option => option.style.display = 'block');
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
        roomIdInput.style.display = 'none';
        userTypeSelect.style.display = 'none';
        if (['播放设备', '游客'].includes(userNameInput.value)) userNameInput.value = '';
    }
    userTypeSelect.dispatchEvent(new Event('change'));
});

function requestPlaylistUpdate() {
    socket.emit('request_playlist_update', { room_id: currentRoom });
}

// 创建移动端底部 tab 切换器
function createMobileTabSwitcher() {
    // 检查是否已经存在 tab 切换器，避免重复创建
    if (document.getElementById('mobile-tab-switcher')) {
        return;
    }
    
    const tabSwitcher = document.createElement('div');
    tabSwitcher.id = 'mobile-tab-switcher';
    tabSwitcher.className = 'mobile-tab-switcher';
    
    tabSwitcher.innerHTML = `
        <div class="tab-buttons">
            <button class="tab-button active" onclick="switchMobileTab('basicInfo')">
                <div class="tab-label">点歌</div>
            </button>
            <button class="tab-button" onclick="switchMobileTab('playlist')">
                <div class="tab-label">已播放</div>
            </button>
            <button class="tab-button" onclick="switchMobileTab('chat')">
                <div class="tab-label">消息</div>
            </button>
        </div>
    `;
    
    document.body.appendChild(tabSwitcher);
    
    // 初始化显示第一个 tab
    switchMobileTab('basicInfo');
}

// 切换移动端 tab
function switchMobileTab(tabName) {
    // 移除所有 tab 按钮的 active 状态
    const tabButtons = document.querySelectorAll('.mobile-tab-switcher .tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));
    
    // 隐藏所有内容区域
    const basicInfo = document.getElementById('basicInfo');
    const playlistSection = document.querySelector('#extraInfo .playlist');
    const chatSection = document.querySelector('#extraInfo .chat-section');
    
    if (basicInfo) basicInfo.classList.remove('active');
    if (playlistSection) playlistSection.classList.remove('active');
    if (chatSection) chatSection.classList.remove('active');
    
    // 根据选中的 tab 显示对应内容并激活按钮
    switch(tabName) {
        case 'basicInfo':
            if (basicInfo) basicInfo.classList.add('active');
            tabButtons[0].classList.add('active');
            break;
        case 'playlist':
            if (playlistSection) playlistSection.classList.add('active');
            tabButtons[1].classList.add('active');
            break;
        case 'chat':
            if (chatSection) chatSection.classList.add('active');
            tabButtons[2].classList.add('active');
            // 滚动到底部显示最新消息
            const chatMessages = document.getElementById('chat-messages');
            if (chatMessages) {
                setTimeout(() => {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 0);
            }
            break;
    }
}

// document.addEventListener('visibilitychange', requestPlaylistUpdate);

// ==================== 哔哩哔哩搜索 Modal ====================

let _suggestTimer = null;
let _searchPage = 1;
let _searchKeyword = '';
let _pendingAddUrl = null;
let _partsCache = { title: '', bvid: '', pages: [] };

function openSearchModal() {
    document.getElementById('bili-search-modal').style.display = 'flex';
    setTimeout(() => document.getElementById('bili-search-input').focus(), 50);
}

function closeSearchModal() {
    document.getElementById('bili-search-modal').style.display = 'none';
    document.getElementById('bili-search-input').value = '';
    document.getElementById('bili-search-results').innerHTML = '';
    document.getElementById('bili-detail-panel').style.display = 'none';
    hideSuggest();
    _searchKeyword = '';
    _searchPage = 1;
    _pendingAddUrl = null;
}

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('bili-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
        const term = this.value.trim();
        clearTimeout(_suggestTimer);
        if (!term) { hideSuggest(); return; }
        _suggestTimer = setTimeout(() => fetchSuggest(term), 280);
    });

    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            if (isComposing || e.isComposing || e.keyCode === 229) return; // 如果正在输入法组合，不触发提交
            e.stopPropagation();
            hideSuggest();
            doSearch();
        } else if (e.key === 'Escape') {
            e.stopPropagation();
            closeSearchModal();
        }
    });

    document.getElementById('bili-suggest-list').addEventListener('click', function (e) {
        const item = e.target.closest('.suggest-item');
        if (!item) return;
        document.getElementById('bili-search-input').value = item.dataset.term;
        hideSuggest();
        doSearch();
    });

    document.getElementById('bili-search-modal').addEventListener('click', function (e) {
        if (e.target === this) closeSearchModal();
    });

    // Close suggest when clicking outside the input area
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.search-input-wrap')) hideSuggest();
    }, true);
});

async function fetchSuggest(term) {
    try {
        const resp = await fetch(`/api/bili/suggest?term=${encodeURIComponent(term)}`);
        const items = await resp.json();
        renderSuggest(items);
    } catch (e) { hideSuggest(); }
}

function _positionSuggestList() {
    const input = document.getElementById('bili-search-input');
    const list = document.getElementById('bili-suggest-list');
    if (!input || !list) return;
    const rect = input.getBoundingClientRect();
    list.style.top = (rect.bottom + 4) + 'px';
    list.style.left = rect.left + 'px';
    list.style.width = rect.width + 'px';
}

function renderSuggest(items) {
    const list = document.getElementById('bili-suggest-list');
    if (!items || items.length === 0) { hideSuggest(); return; }
    list.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'suggest-item';
        div.dataset.term = item.term;
        div.innerHTML = item.name || escapeHtml(item.term);
        list.appendChild(div);
    });
    _positionSuggestList();
    list.style.display = 'block';
}

function hideSuggest() {
    const list = document.getElementById('bili-suggest-list');
    if (list) list.style.display = 'none';
    if (_suggestTimer) {
        clearTimeout(_suggestTimer);
        _suggestTimer = null;
    }
}

async function doSearch(page = 1) {
    const keyword = document.getElementById('bili-search-input').value.trim();
    if (!keyword) return;
    _searchKeyword = keyword;
    _searchPage = page;

    const resultsEl = document.getElementById('bili-search-results');
    resultsEl.innerHTML = '<div class="bili-loading">搜索中...</div>';
    resultsEl.style.display = 'block';
    document.getElementById('bili-detail-panel').style.display = 'none';

    try {
        const resp = await fetch('/api/bili/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyword, page })
        });
        const data = await resp.json();
        renderSearchResults(data);
    } catch (e) {
        resultsEl.innerHTML = '<div class="bili-loading">搜索失败，请重试</div>';
    }
}

function renderSearchResults(data) {
    const resultsEl = document.getElementById('bili-search-results');
    if (!data.videos || data.videos.length === 0) {
        resultsEl.innerHTML = '<div class="bili-loading">暂无结果</div>';
        return;
    }
    let html = `<div class="bili-result-count">共 ${data.num_results} 条结果</div>`;
    data.videos.forEach(v => {
        html += `
            <div class="bili-result-item" onclick="onVideoResultClick('${escapeHtml(v.bvid)}')">
                <img class="bili-cover" src="${escapeHtml(v.cover)}" alt="" loading="lazy">
                <div class="bili-result-info">
                    <div class="bili-result-title">${escapeHtml(v.title)}</div>
                    <div class="bili-result-meta">UP主: ${escapeHtml(v.owner.name)} · 时长: ${escapeHtml(v.duration || '')}</div>
                </div>
            </div>`;
    });
    html += `
        <div class="bili-pagination">
            ${_searchPage > 1 ? `<button onclick="doSearch(${_searchPage - 1})">上一页</button>` : ''}
            <span>第 ${_searchPage} 页</span>
            <button onclick="doSearch(${_searchPage + 1})">下一页</button>
        </div>`;
    resultsEl.innerHTML = html;
}

async function onVideoResultClick(bvid) {
    const detailPanel = document.getElementById('bili-detail-panel');
    const resultsEl = document.getElementById('bili-search-results');
    
    if (resultsEl) resultsEl.style.display = 'none';
    detailPanel.innerHTML = '<div class="bili-loading">获取视频信息中...</div>';
    detailPanel.style.display = 'block';

    try {
        const resp = await fetch(`/api/bili/pages?bvid=${encodeURIComponent(bvid)}`);
        const data = await resp.json();
        if (data.error) {
            detailPanel.innerHTML = `<div class="bili-loading">获取失败：${escapeHtml(data.error)}</div>`;
            return;
        }
        if (data.pages && data.pages.length > 1) {
            _partsCache = { title: data.title, bvid, pages: data.pages };
            showPartsPanel();
        } else {
            showConfirmPanel(data.title, `https://www.bilibili.com/video/${bvid}`);
        }
    } catch (e) {
        detailPanel.innerHTML = '<div class="bili-loading">获取失败，请重试</div>';
    }
}

function showConfirmPanel(title, url) {
    _pendingAddUrl = url;
    document.getElementById('bili-detail-panel').innerHTML = `
        <div class="bili-confirm">
            <p>确认添加：</p>
            <p class="bili-confirm-title">${escapeHtml(title)}</p>
            <div class="bili-confirm-actions">
                <button onclick="confirmAddSong()">✅ 确认添加</button>
                <button class="btn-cancel" onclick="hideDetailPanel()">✕ 取消</button>
            </div>
        </div>`;
}

function showPartsPanel() {
    const { title, pages } = _partsCache;
    let html = `
        <div class="bili-parts-header">
            <button class="btn-back" onclick="hideDetailPanel()">← 返回</button>
            <span>选择分P · ${escapeHtml(title)}</span>
        </div>
        <div class="bili-parts-list">`;
    pages.forEach((p, i) => {
        html += `
            <div class="bili-part-item" onclick="selectPart(${i})">
                <span class="bili-part-num">P${p.page}</span>
                <span class="bili-part-name">${escapeHtml(p.part)}</span>
                <span class="bili-part-dur">${formatDuration(p.duration)}</span>
            </div>`;
    });
    html += '</div>';
    const detailPanel = document.getElementById('bili-detail-panel');
    detailPanel.innerHTML = html;
    detailPanel.style.display = 'block';
}

function selectPart(index) {
    const p = _partsCache.pages[index];
    const url = `https://www.bilibili.com/video/${_partsCache.bvid}?p=${p.page}`;
    const partTitle = `${_partsCache.title} - P${p.page}: ${p.part}`;
    showConfirmPanel(partTitle, url);
}

function hideDetailPanel() {
    document.getElementById('bili-detail-panel').style.display = 'none';
    const resultsEl = document.getElementById('bili-search-results');
    if (resultsEl) resultsEl.style.display = 'block';
}

function confirmAddSong() {
    if (!_pendingAddUrl || !socket) return;
    socket.emit('add_song', {
        room_id: currentRoom,
        url: _pendingAddUrl,
        user_name: currentUser
    });
    closeSearchModal();
}