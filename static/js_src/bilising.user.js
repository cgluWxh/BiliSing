// ==UserScript==
// @name         BiliSing Master - 哔哩哔哩远程播放控制播放端
// @namespace    https://github.com/cgluWxh
// @version      1.0.0
// @description  在哔哩哔哩页面上添加远程播放控制支持
// @author       BiliSing
// @match        https://www.bilibili.com/video/*
// @match        https://bilibili.com/video/*
// @match        https://www.bilibili.com/audio/*
// @match        https://bilibili.com/audio/*
// @match        https://www.bilibili.com/festival/*
// @match        https://bilibili.com/festival/*
// @match        https://www.bilibili.com/blackboard/*
// @match        https://bilibili.com/blackboard/*
// @match        https://www.bilibili.com/?*
// @match        https://bilibili.com/?*
// @match        https://bilibili.com/
// @match        https://www.bilibili.com/
// @match        https://sing.bilibiili.com/*
// @match        https://sing.831.moe/*
// @match        http://localhost:11817/*
// @grant        none
// ==/UserScript==

let lastRoomId, myURL;

(function(){
    const headerContentController = {
        originalText: '',
        temporaryContentTimer: null,
        setOriginalText: function (content) {
            this.originalText = content;
            if (this.temporaryContentTimer === null) {
                const el = document.getElementById('bilising-header-content');
                if (el) el.textContent = content;
            }
        },
        setTemporaryText: function (content, duration = 5000) {
            if (this.temporaryContentTimer) {
                clearTimeout(this.temporaryContentTimer);
            }
            const el = document.getElementById('bilising-header-content');
            if (el) el.textContent = content;
            this.temporaryContentTimer = setTimeout(() => {
                this.temporaryContentTimer = null;
                const el = document.getElementById('bilising-header-content');
                if (el) el.textContent = this.originalText;
            }, duration);
        }
    }

    function fadeVolume(video, from, to, duration) {
        if (!video) return;
        const steps = 20;
        const interval = duration / steps;
        const delta = (to - from) / steps;
        let current = from;
        let count = 0;
        
        const timer = setInterval(() => {
            count++;
            current += delta;
            video.volume = Math.max(0, Math.min(1, current));
            if (count >= steps) clearInterval(timer);
        }, interval);
    }

    function untilElement(selector) {
        return new Promise(resolve => {
            let timer = setTimeout(() => {
                if (document.querySelector(selector)) {
                    resolve();
                    return;
                }
                timer = setTimeout(() => resolve(untilElement(selector)), 1000);
            }, 500);
        });
    }

    function batchAddToFavList(bvList) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const favTitle = `BiliSing ${year}${month}${day}`;
        const favIntro = `BiliSing 自动添加收藏夹 - ${year}-${month}-${day} ${hour}:${minute}`;
        const favPrivacy = 1; // 0: 公开, 1: 自己可见

        // 🍪 获取 csrf_token
        function getCsrf() {
            return document.cookie.match(/bili_jct=([^;]+)/)?.[1] ?? '';
        }

        // 🔧 通用 fetch 请求封装（自动附带 Cookie）
        async function doPost(url, bodyObj) {
            const body = new URLSearchParams(bodyObj);
            const res = await fetch(url, {
                method: 'POST',
                credentials: 'include', // 🚨 关键：带上 Cookie
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': 'https://www.bilibili.com/',
                },
                body: body.toString()
            });
            return await res.json();
        }

        // 🛠 创建收藏夹
        async function createFavFolder(title, intro, privacy) {
            const csrf = getCsrf();
            if (!csrf) throw new Error('未获取到 csrf，可能未登录');
            const res = await doPost('https://api.bilibili.com/x/v3/fav/folder/add', {
                title,
                intro,
                privacy: String(privacy),
                csrf
            });
            if (res.code === 0) {
                headerContentController.setTemporaryText(`✅ 收藏夹创建成功: ${title}, 待添加视频`, 60000);
                return res.data.id;
            } else {
                throw new Error(`❌ 创建失败: ${res.message}`);
            }
        }

        // 🔄 BV号转aid
        async function bv2aid(bv) {
            const res = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bv}`, {
                credentials: 'include'
            });
            const json = await res.json();
            if (json.code !== 0) throw new Error(`❌ 无法解析BV号: ${bv}`);
            return json.data.aid;
        }

        // ➕ 添加视频到收藏夹
        async function addToFav(aid, favId) {
            const csrf = getCsrf();
            const res = await doPost('https://api.bilibili.com/x/v3/fav/resource/deal', {
                rid: aid,
                type: '2',
                add_media_ids: favId,
                csrf
            });
            if (res.code === 0) {
                headerContentController.setTemporaryText(`✅ 成功添加 aid=${aid}`, 60000);
            } else {
                headerContentController.setTemporaryText(`❌ 添加失败 aid=${aid}: ${res.message}`, 60000);
            }
        }

        // 🚀 主程序
        (async function () {
            try {
                headerContentController.setTemporaryText(`🔄 开始批量收藏 ${bvList.length} 个视频...`, 60000);
                const favId = await createFavFolder(favTitle, favIntro, favPrivacy);
                for (const bv of bvList) {
                    try {
                        const aid = await bv2aid(bv);
                        await addToFav(aid, favId);
                        await new Promise(r => setTimeout(r, 100)); // 防止触发风控
                    } catch (e) {
                        console.error(`处理 BV ${bv} 时出错:`, e);
                        headerContentController.setTemporaryText(`❌ 处理 BV ${bv} 失败: ${e.message}`, 60000);
                    }
                }
                headerContentController.setTemporaryText('🎉 完成所有添加任务', 5000);
            } catch (e) {
                console.error('批量添加收藏夹出错:', e);
                headerContentController.setTemporaryText('❌ 出错且无法继续执行:', 60000);
            }
        })();
    }

    let socket;
    let currentRoom = null;
    let currentUser = '播放设备';
    let currentUserType = 'master';
    let isConnected = false;
    let currentPlaying = null;
    let played_songs = [];
    let play_list = [];
    let nextSong = null;

    // TTS朗读队列管理
    const ttsQueue = {
        queue: [],
        isPlaying: false,
        audioElement: null,
        enabled: true, // 朗读功能开关

        // 保存队列到 sessionStorage
        saveQueue: function() {
            try {
                sessionStorage.setItem('bilising-tts-queue', JSON.stringify(this.queue));
            } catch (e) {
                console.warn('保存朗读队列失败:', e);
            }
        },

        // 从 sessionStorage 加载队列
        loadQueue: function() {
            try {
                const saved = sessionStorage.getItem('bilising-tts-queue');
                if (saved) {
                    this.queue = JSON.parse(saved);
                    console.log('恢复朗读队列:', this.queue.length, '条');
                }
            } catch (e) {
                console.warn('加载朗读队列失败:', e);
                this.queue = [];
            }
        },

        // 切换朗读功能
        toggle: function() {
            this.enabled = !this.enabled;
            if (!this.enabled) {
                this.clear();
            }
            // 保存设置
            sessionStorage.setItem('bilising-tts-enabled', this.enabled ? '1' : '0');
            return this.enabled;
        },

        // 初始化音频元素
        init: function() {
            if (!this.audioElement) {
                this.audioElement = new Audio();
                this.audioElement.addEventListener('ended', () => {
                    this.isPlaying = false;
                    this.playNext();
                });
            }
        },

        // 添加到队列
        add: function(text) {
            if (!this.enabled) return; // 朗读功能关闭时不添加
            if (!text || text.trim().length === 0) return;
            this.queue.push(text);
            this.saveQueue(); // 保存队列
            if (!this.isPlaying) {
                this.playNext();
            }
        },

        // 播放下一个
        playNext: function() {
            if (this.queue.length === 0) {
                this.isPlaying = false;
                this.saveQueue(); // 保存空队列
                return;
            }

            this.isPlaying = true;
            const text = this.queue.shift();
            this.saveQueue(); // 保存队列
            this.speak(text);
        },

        // 调用TTS API
        speak: async function(text) {
            try {
                const params = new URLSearchParams({
                    input: text,
                    voice: 'zh-CN-XiaoxiaoNeural',
                    speed: '1.0',
                    volume: '1',
                    pitch: '0',
                    style: 'general'
                });

                const audioUrl = myURL + '/v1/audio/speech?input=' + encodeURIComponent(text) + '&voice=zh-CN-XiaoxiaoNeural&speed=1.0&volume=1&pitch=0&style=general';
                
                this.init();
                this.audioElement.src = audioUrl;
                
                this.audioElement.volume = 1;

                const isWebplayer = window.__BILISING_WEBPLAYER__;
                const video = isWebplayer ? document.getElementById('videoElement') : document.querySelector("#bilibili-player video");
                const transitionDuration = 1; // 音量变化持续时间（秒）

                // 淡出视频音量
                await this.audioElement.play();

                fadeVolume(video, video ? video.volume : 1, 0.15, transitionDuration);
                
                this.audioElement.onended = () => {
                    // 淡回视频音量
                    fadeVolume(video, video ? video.volume : 0.15, 1.0, transitionDuration);
                }

            } catch (error) {
                console.warn('TTS朗读失败:', error, error.message);
                const video = (window.__BILISING_WEBPLAYER__) ? document.getElementById('videoElement') : document.querySelector("#bilibili-player video");
                if (video) video.volume = 1.0;
                this.isPlaying = false;
                this.playNext();
            }
        },

        // 清空队列
        clear: function() {
            this.queue = [];
            this.saveQueue(); // 保存空队列
            if (this.audioElement) {
                this.audioElement.pause();
                this.audioElement.src = '';
            }
            this.isPlaying = false;
        }
    };

    async function playFromStart() {
        try { window.player.setHandoff(window.nano.HandoffKind.Abort); } catch (e) { console.warn('设置手动播放失败:', e); }
        try { await window.player.setAutoplay(false); } catch (e) { console.warn('设置自动播放失败:', e); }
        try { await window.player.seek(0); } catch (e) { console.warn('设置播放位置失败:', e); }
        try { await window.player.setPlaybackRate(1); } catch (e) { console.warn('设置播放速度失败:', e); }
        try { await window.player.setLoop(true); } catch (e) { console.warn('设置循环播放失败:', e); }
        try { await window.player.setMuted(false); } catch (e) { console.warn('设置静音失败:', e); }
        try { await window.player.play(); } catch (e) { console.warn('播放失败:', e); }
        try { if (!document.querySelector("#bilibili-player").classList.contains("mode-webscreen")) document.querySelector(".bpx-player-ctrl-btn.bpx-player-ctrl-web").click(); } catch (e) { console.warn('全屏失败:', e); }
    }

    // 创建浮窗HTML
    async function createFloatingWindow() {
        const isWebplayer = window.__BILISING_WEBPLAYER__;
        if (!location.href.includes('bilibili.com') && !isWebplayer) return;

        function restoreTTSQueue() {
            try {
                if (ttsQueue.enabled && !ttsQueue.isPlaying && ttsQueue.queue.length === 0) {
                    ttsQueue.loadQueue();
                    if (ttsQueue.queue.length > 0) {
                        console.log('检测到未完成的朗读队列，继续播放');
                        setTimeout(() => {
                            ttsQueue.playNext();
                        }, 1000); 
                    }
                }
            } catch (e) {
                console.warn('恢复朗读队列失败:', e);
            }
        }

        // 恢复上次的房间ID
        function setCookie(name, value, maxAgeSeconds) {
            const domain = ".bilibili.com";
            document.cookie = `${name}=${encodeURIComponent(value)}; domain=${domain}; path=/; max-age=${maxAgeSeconds}`;
        }

        function getCookie(name) {
            const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? decodeURIComponent(match[2]) : null;
        }

        function deleteCookie(name) {
            // 立即过期
            document.cookie = `${name}=; path=/; max-age=0`;
        }

        if (!isWebplayer) {
            // patch: 无刷切换视频有可能会导致问题页面崩溃
            const desc = Object.getOwnPropertyDescriptor(Node.prototype, 'parentNode');

            // 一个假的 node，只有 removeChild 空方法
            const fakeNode = {
                removeChild: function () {
                    console.warn("截获 removeChild 调用")
                    return null;
                },
                appendChild: function () {
                    console.warn("截获 appendChild 调用")
                    return null;
                }
            };

            Object.defineProperty(Node.prototype, 'parentNode', {
                get: function () {
                    const val = desc.get.call(this);
                    const stack = new Error().stack || '';
                    if (
                        val === null &&
                        (stack.includes('_removeScrollBars') || stack.includes('Reaction'))
                    ) {
                        return fakeNode; // 返回假节点，防止 null.removeChild 报错
                    }
                    return val; // 正常返回
                }
            });

            // 判断是否为m.版本
            if (location.hostname.startsWith("m.")) {
                // ... browser 对象可能不存在报错，因此增加判定或忽略
                const isMobile = typeof browser !== 'undefined' && browser.isMobile;
                if (isMobile) {
                    // 准备要传递的 roomId 和 server
                    let roomId = new URLSearchParams(window.location.search).get('bilising-room-id') || sessionStorage.getItem('bilising-room-id');
                    let server = new URLSearchParams(window.location.search).get("bilising-server") || sessionStorage.getItem("bilising-server");

                    if (roomId) setCookie('bilising-room-id', roomId, 600);
                    if (server) setCookie('bilising-server', server, 600);
                    alert("请打开“请求桌面版网站”选项");
                } else {
                    location.href = location.protocol + "//www.bilibili.com" + location.pathname + location.search;
                }
                return;
            }

            // www 版页面加载时，优先从 cookie 读取数据
            lastRoomId = new URLSearchParams(window.location.search).get('bilising-room-id') || sessionStorage.getItem('bilising-room-id') || getCookie('bilising-room-id');
            if (lastRoomId) {
                sessionStorage.setItem('bilising-room-id', lastRoomId);
                deleteCookie('bilising-room-id');
            }

            myURL = new URLSearchParams(window.location.search).get("bilising-server") || sessionStorage.getItem("bilising-server") || getCookie("bilising-server");
            if (myURL) {
                sessionStorage.setItem('bilising-server', myURL);
                deleteCookie('bilising-server');
            }
        } else {
            // webplayer 环境
            lastRoomId = window.__BILISING_ROOM_ID__ || new URLSearchParams(window.location.search).get('bilising-room-id') || sessionStorage.getItem('bilising-room-id');
            myURL = location.origin;
        }

        if (!lastRoomId) return;
        if (!myURL) return;

        if (!/^http/.test(myURL)) {
            myURL = "https://" + myURL;
        }

        if (isWebplayer) {
            const video = document.getElementById('videoElement');
            if (video) {
                video.onended = () => {
                    document.getElementById('bilising-play-next')?.click();
                };
                restoreTTSQueue();
            }
        } else if (location.href.includes('/video/') || location.href.includes('/festival/')) {
            await untilElement("#bilibili-player video");
            const video = document.querySelector("#bilibili-player video");
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            video.onended = () => {
                document.getElementById('bilising-play-next').click();
            };
            await untilElement(".bpx-player-ctrl-btn.bpx-player-ctrl-web");
            await playFromStart();
            
            restoreTTSQueue();
        }

        const floatingWindow = document.createElement('div');
        floatingWindow.id = 'bilising-float';
        floatingWindow.classList.add("bilising-collapsed");
        floatingWindow.setAttribute('data-size', 'large'); // 添加尺寸属性
        floatingWindow.style.opacity = '0.8';
        floatingWindow.innerHTML = `
    <div id="bilising-header" class="header">
        <span id="bilising-header-content">🎤 BiliSing</span>
        <div class="header-controls">
            <button id="bilising-size-control" title="切换大小">📐</button>
            <button id="bilising-toggle">+</button>
        </div>
    </div>
    <div id="bilising-content">
        <div id="bilising-roomInfo">
            <div id="bilising-connection">
                <input type="text" id="bilising-room-id" placeholder="房间ID" value="">
                <button id="bilising-connect">连接</button>
                <span id="bilising-status">未连接</span>
            </div>
            <div id="bilising-controls" style="display: none;">
                <div id="bilising-current">
                    <strong>正在播放：</strong>
                    <div id="bilising-current-song">暂无歌曲</div>
                </div>
                <div id="bilising-next">
                    <strong>下一首：</strong>
                    <div id="bilising-next-song">暂无歌曲</div>
                </div>
                <button id="bilising-play-next">切歌</button>
                ${window.__BILISING_WEBPLAYER__ ? 
                  '<button id="bilising-play-mode">🌍 播放模式: 从源加载</button>' : 
                  '<button id="bilising-batch-add-fav">批量添加收藏夹</button>'}
                <button id="bilising-tts-toggle" class="bilising-tts-enabled">🔊 朗读已开启</button>
            </div>
        </div>
        <div id="bilising-roomQR-section">
            <strong id="bilising-noqr-text">二维码未生成，请先连接到一个房间。</strong>
            <div id="bilising-qr-code" style="display: none;">
                <canvas id="bilising-qr-image" alt="房间二维码"></canvas>
                <p>扫码点播</p>
            </div>
        </div>
    </div>
    `;

        // 添加样式
        const style = document.createElement('style');
        const sup = CSS.supports('width', 'clamp(1px,1vw,2px)');

        style.textContent = `
    :root {
        --bilising-base-font-size: ${sup ? 'clamp(10px, 2.5vw, 14px)' : '13px'};
        --bilising-padding-sm: ${sup ? 'clamp(4px, 1vw, 8px)' : '6px'};
        --bilising-padding-md: ${sup ? 'clamp(8px, 2vw, 12px)' : '10px'};
        --bilising-padding-lg: ${sup ? 'clamp(12px, 3vw, 16px)' : '14px'};
        --bilising-border-radius: ${sup ? 'clamp(4px, 1vw, 8px)' : '6px'};
    }

    #bilising-float {
        position: fixed;
        top: 10px;
        left: 10px;
        width: calc(100vw - 20px);
        max-width: none;
        min-width: none;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        border-radius: var(--bilising-border-radius);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: var(--bilising-base-font-size);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    #bilising-float[data-size="small"] {
        --bilising-base-font-size: ${sup ? 'clamp(8px, 2vw, 10px)' : '9px'};
        --bilising-padding-sm: ${sup ? 'clamp(2px, 0.5vw, 4px)' : '3px'};
        --bilising-padding-md: ${sup ? 'clamp(4px, 1vw, 6px)' : '5px'};
        --bilising-padding-lg: ${sup ? 'clamp(6px, 1.5vw, 8px)' : '7px'};
    }

    #bilising-float[data-size="large"] {
        --bilising-base-font-size: ${sup ? 'clamp(14px, 3.5vw, 18px)' : '16px'};
        --bilising-padding-sm: ${sup ? 'clamp(6px, 1.5vw, 12px)' : '9px'};
        --bilising-padding-md: ${sup ? 'clamp(12px, 3vw, 18px)' : '15px'};
        --bilising-padding-lg: ${sup ? 'clamp(18px, 4.5vw, 24px)' : '21px'};
    }

    @media (max-width: 768px) {
        #bilising-float {
            width: calc(100vw - 20px);
        }
    }

    #bilising-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--bilising-padding-sm) var(--bilising-padding-md);
        background: rgba(0, 174, 236, 0.8);
        border-radius: var(--bilising-border-radius);
        cursor: move;
        font-weight: bold;
    }

    .header-controls {
        display: flex;
        align-items: center;
    }
    .header-controls > *:not(:last-child) {
        margin-right: var(--bilising-padding-sm);
    }

    #bilising-toggle, #bilising-size-control {
        background: none;
        border: none;
        color: white;
        font-size: ${sup ? 'calc(var(--bilising-base-font-size) + 2px)' : '15px'};
        cursor: pointer;
        padding: 2px;
        width: ${sup ? 'calc(var(--bilising-base-font-size) + 8px)' : '21px'};
        height: ${sup ? 'calc(var(--bilising-base-font-size) + 8px)' : '21px'};
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 2px;
        transition: background-color 0.2s;
    }

    #bilising-toggle:hover, #bilising-size-control:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    #bilising-content {
        padding: var(--bilising-padding-md);
        display: flex;
        flex-direction: column;
    }
    #bilising-content > *:not(:last-child) {
        margin-bottom: var(--bilising-padding-md);
    }

    @media (min-width: 600px) {
        #bilising-content {
            flex-direction: row;
        }
        #bilising-content > div {
            flex: 1;
            margin-bottom: 0;
        }
        #bilising-content > div:not(:last-child) {
            margin-right: var(--bilising-padding-md);
        }
    }

    #bilising-connection {
        margin-bottom: var(--bilising-padding-md);
    }

    #bilising-connection input {
        width: 100%;
        max-width: 150px;
        padding: var(--bilising-padding-sm) ${sup ? 'calc(var(--bilising-padding-sm) + 2px)' : '8px'};
        border: 1px solid #ccc;
        border-radius: ${sup ? 'calc(var(--bilising-border-radius) / 2)' : '3px'};
        margin-right: ${sup ? 'calc(var(--bilising-padding-sm) + 2px)' : '8px'};
        margin-bottom: var(--bilising-padding-sm);
        font-size: ${sup ? 'calc(var(--bilising-base-font-size) - 1px)' : '12px'};
        color: black;
    }

    #bilising-connection button {
        padding: var(--bilising-padding-sm) var(--bilising-padding-md);
        background: #00aeec;
        color: white;
        border: none;
        border-radius: ${sup ? 'calc(var(--bilising-border-radius) / 2)' : '3px'};
        cursor: pointer;
        font-size: ${sup ? 'calc(var(--bilising-base-font-size) - 1px)' : '12px'};
        min-width: 60px;
    }

    #bilising-connection button:hover {
        background: #0099d4;
    }

    #bilising-status {
        display: block;
        margin-top: ${sup ? 'calc(var(--bilising-padding-sm) + 2px)' : '8px'};
        font-size: ${sup ? 'calc(var(--bilising-base-font-size) - 2px)' : '11px'};
        color: #ccc;
    }

    #bilising-controls div {
        margin-bottom: var(--bilising-padding-sm);
        padding: ${sup ? 'calc(var(--bilising-padding-sm) + 2px)' : '8px'};
        background: rgba(255, 255, 255, 0.1);
        border-radius: ${sup ? 'calc(var(--bilising-border-radius) / 2)' : '3px'};
    }

    #bilising-controls strong {
        display: block;
        margin-bottom: var(--bilising-padding-sm);
        color: #00aeec;
        font-size: ${sup ? 'calc(var(--bilising-base-font-size) - 1px)' : '12px'};
    }

    #bilising-current-song, #bilising-next-song {
        font-size: ${sup ? 'calc(var(--bilising-base-font-size) - 2px)' : '11px'};
        line-height: 1.3;
        color: #fff;
        word-break: break-word;
    }

    #bilising-play-next, #bilising-batch-add-fav {
        width: 100%;
        padding: var(--bilising-padding-sm);
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: ${sup ? 'calc(var(--bilising-border-radius) / 2)' : '3px'};
        cursor: pointer;
        font-size: ${sup ? 'calc(var(--bilising-base-font-size) - 1px)' : '12px'};
        font-weight: bold;
        margin-bottom: var(--bilising-padding-sm);
    }

    #bilising-play-next:hover, #bilising-batch-add-fav:hover {
        background: #ff5252;
    }

    #bilising-play-next:disabled, #bilising-batch-add-fav:disabled {
        background: #666;
        cursor: not-allowed;
    }

    #bilising-tts-toggle, #bilising-play-mode {
        width: 100%;
        padding: var(--bilising-padding-sm);
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: ${sup ? 'calc(var(--bilising-border-radius) / 2)' : '3px'};
        cursor: pointer;
        font-size: ${sup ? 'calc(var(--bilising-base-font-size) - 1px)' : '12px'};
        font-weight: bold;
        margin-bottom: var(--bilising-padding-sm);
    }

    #bilising-tts-toggle:hover, #bilising-play-mode:hover {
        background: #45a049;
    }

    #bilising-tts-toggle.bilising-tts-disabled {
        background: #9e9e9e;
    }

    #bilising-tts-toggle.bilising-tts-disabled:hover {
        background: #757575;
    }

    div#bilising-roomQR-section {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-align: center;
    }

    div#bilising-qr-code, div#bilising-qr-code2 {
        text-align: center;
    }

    div#bilising-qr-code canvas, div#bilising-qr-code2 canvas {
        max-width: 100%;
        height: auto;
    }

    .bilising-collapsed #bilising-content {
        display: none;
    }

    #bilising-qr-code-float {
        background: rgba(0, 0, 0, 0.8) !important;
        border-radius: var(--bilising-border-radius) !important;
        padding: var(--bilising-padding-md) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
    }

    #bilising-qr-code-float p {
        font-size: ${sup ? 'calc(var(--bilising-base-font-size) + 2px)' : '15px'} !important;
        margin: var(--bilising-padding-sm) 0 !important;
    }

    #bilising-qr-close {
        position: absolute !important;
        top: 0 !important;
        right: 0 !important;
        font-size: 20px !important;
        width: 30px !important;
        height: 30px !important;
        line-height: 30px !important;
        text-align: center !important;
        color: rgba(255, 255, 255, 0.8) !important;
        cursor: pointer !important;
        background: rgba(0, 0, 0, 0.3) !important;
        border-radius: 50% !important;
        padding: 0 !important;
        margin: 0 !important;
        transition: all 0.2s ease !important;
        z-index: 10002 !important;
        transform: translate(50%, -50%) !important;
    }

    #bilising-qr-close:hover {
        background: rgba(0, 0, 0, 0.6) !important;
        color: #fff !important;
    }
        `;

        document.head.appendChild(style);
        document.body.appendChild(floatingWindow);

        const qrCodeGlobal = document.createElement('div');
        qrCodeGlobal.id = 'bilising-qr-code-float';
        qrCodeGlobal.innerHTML = `
            <div id="bilising-qr-close" title="关闭">×</div>
            <div id="bilising-qr-code2">
                <canvas id="bilising-qr-image2" alt="房间二维码"></canvas>
                <p style="color:white; font-size: 1.5em; text-align: center;">扫码点播</p>
            </div>
        `;
        qrCodeGlobal.style.display = 'none';
        qrCodeGlobal.style.position = 'fixed';
        const mainRect = floatingWindow.getBoundingClientRect();
        qrCodeGlobal.style.top = mainRect.bottom + 10 + 'px';
        qrCodeGlobal.style.left = '10px';
        qrCodeGlobal.style.zIndex = '2147483646';
        qrCodeGlobal.style.background = "rgba(0, 0, 0, 0.8)";
        qrCodeGlobal.style.opacity = '0.8';
        
        // 添加响应式定位更新函数
        function updateQRPosition() {
            const mainRect = floatingWindow.getBoundingClientRect();
            qrCodeGlobal.style.top = mainRect.bottom + 10 + 'px';
            qrCodeGlobal.style.left = mainRect.left + 'px';
            qrCodeGlobal.style.maxWidth = mainRect.width + 'px';
        }
        
        // 监听窗口大小变化和浮窗移动
        window.addEventListener('resize', updateQRPosition);
        floatingWindow.addEventListener('DOMSubtreeModified', updateQRPosition);
        
        document.body.appendChild(qrCodeGlobal);

        // 添加拖拽功能
        makeDraggable(floatingWindow);
        makeDraggable(qrCodeGlobal);

        // 添加事件监听器
        setupEventListeners(floatingWindow, qrCodeGlobal);

        if (lastRoomId) {
            document.getElementById('bilising-room-id').value = lastRoomId;
            document.getElementById('bilising-connect').click();
        }
    }

    // 设置事件监听器
    function setupEventListeners(floatingWindow, qrCodeGlobal) {
        document.getElementById('bilising-qr-close').addEventListener('click', function () {
            qrCodeGlobal.style.display = 'none';
        });
        
        // 尺寸控制按钮
        document.getElementById('bilising-size-control').addEventListener('click', function () {
            const floatWindow = floatingWindow;
            const currentSize = floatWindow.getAttribute('data-size') || 'large';
            let nextSize;
            
            switch (currentSize) {
                case 'large':
                    nextSize = 'normal';
                    break;
                case 'normal':
                    nextSize = 'small';
                    break;
                case 'small':
                    nextSize = 'large';
                    break;
                default:
                    nextSize = 'small';
            }
            
            floatWindow.setAttribute('data-size', nextSize);
            
            // 重新生成二维码以适应新尺寸
            if (isConnected && currentRoom) {
                setTimeout(() => {
                    generateQRCodes();
                }, 100); // 短暂延迟以等待尺寸变化
            }
            
            // 保存尺寸设置
            sessionStorage.setItem('bilising-size', nextSize);
        });
        
        // 折叠/展开
        document.getElementById('bilising-toggle').addEventListener('click', function () {
            const floatWindow = floatingWindow;
            floatWindow.classList.toggle('bilising-collapsed');
            if (floatWindow.classList.contains('bilising-collapsed')) {
                this.textContent = '+';
                qrCodeGlobal.style.display = 'block';
            } else {
                this.textContent = '−';
                qrCodeGlobal.style.display = 'none';
            }
        });

        // 连接按钮
        document.getElementById('bilising-connect').addEventListener('click', function () {
            const roomId = document.getElementById('bilising-room-id').value.trim();
            if (!roomId) {
                alert('请输入房间ID');
                return;
            }

            if (isConnected) {
                disconnectSocket();
            } else {
                connectToRoom(roomId);
            }
        });

        // 播放下一首按钮
        document.getElementById('bilising-play-next').addEventListener('click', function () {
            if (socket && isConnected && currentRoom) {
                socket.emit('next_song', {
                    room_id: currentRoom,
                    user_name: currentUser
                });
            }
        });
        const addFavBtn = document.getElementById('bilising-batch-add-fav');
        if (addFavBtn) {
            addFavBtn.addEventListener('click', function () {
                const listAll = played_songs.concat(play_list);
                if (listAll.length > 0) {
                    const uniqueBvList = [...listAll.map(song => extractBVId(song.url)).filter(bv => bv)];
                    if (uniqueBvList.length > 0) {
                        batchAddToFavList(uniqueBvList);
                        return;
                    }
                }
                headerContentController.setTemporaryText('没有可添加的歌曲', 5000);
            });
        }
        
        const playModeBtn = document.getElementById('bilising-play-mode');
        if (playModeBtn) {
            let mode = localStorage.getItem('bilising-play-mode') || 'redirect';
            const updatePlayModeText = () => {
                playModeBtn.textContent = mode === 'proxy' ? '🌍 播放模式: 代理' : '🌍 播放模式: 从源加载';
            };
            updatePlayModeText();
            playModeBtn.addEventListener('click', function () {
                mode = mode === 'proxy' ? 'redirect' : 'proxy';
                localStorage.setItem('bilising-play-mode', mode);
                updatePlayModeText();
                if (currentPlaying) navigateToVideoIfNeeded(currentPlaying.url);
            });
        }

        // 回车键连接
        document.getElementById('bilising-room-id').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                document.getElementById('bilising-connect').click();
            }
        });

        // 朗读开关按钮
        document.getElementById('bilising-tts-toggle').addEventListener('click', function () {
            const enabled = ttsQueue.toggle();
            if (enabled) {
                this.textContent = '🔊 朗读已开启';
                this.classList.remove('bilising-tts-disabled');
                this.classList.add('bilising-tts-enabled');
            } else {
                this.textContent = '🔇 朗读已关闭';
                this.classList.remove('bilising-tts-enabled');
                this.classList.add('bilising-tts-disabled');
            }
        });

        // 恢复上次保存的尺寸设置
        const savedSize = sessionStorage.getItem('bilising-size') || 'large';
        if (savedSize && ['small', 'normal', 'large'].includes(savedSize)) {
            document.getElementById('bilising-float').setAttribute('data-size', savedSize);
        }

        // 恢复朗读功能设置
        const savedTtsEnabled = sessionStorage.getItem('bilising-tts-enabled');
        if (savedTtsEnabled === '0') {
            ttsQueue.enabled = false;
            const ttsButton = document.getElementById('bilising-tts-toggle');
            ttsButton.textContent = '🔇 朗读已关闭';
            ttsButton.classList.remove('bilising-tts-enabled');
            ttsButton.classList.add('bilising-tts-disabled');
        }
    }

    // 生成二维码的独立函数
    function generateQRCodes() {
        if (!currentRoom || !myURL) return;
        
        const floatWindow = document.getElementById('bilising-float');
        const currentSize = floatWindow.getAttribute('data-size') || 'normal';
        
        // 根据当前尺寸和屏幕大小动态计算二维码尺寸
        let sizeMultiplier = 1;
        switch (currentSize) {
            case 'small':
                sizeMultiplier = 0.6;
                break;
            case 'large':
                sizeMultiplier = 1.4;
                break;
            default:
                sizeMultiplier = 1;
        }
        
        const baseSize = 180;
        const maxSize = Math.min(
            (window.visualViewport ? window.visualViewport.width : window.innerWidth) * 0.3,
            (window.visualViewport ? window.visualViewport.height : window.innerHeight) * 0.25
        );
        const qrSize = Math.max(80, Math.min(maxSize, baseSize * sizeMultiplier));
        
        const qrOptions = {
            width: qrSize,
            margin: 1,
            errorCorrectionLevel: 'H',
        };
        
        const qrUrl = `${myURL}/?bilising-room-id=${currentRoom}`;
        
        try {
            QRCode.toCanvas(document.getElementById('bilising-qr-image'), qrUrl, qrOptions);
            QRCode.toCanvas(document.getElementById('bilising-qr-image2'), qrUrl, qrOptions);
        } catch (e) {
            console.warn('生成二维码失败:', e);
        }
    }

    // 连接到房间
    function connectToRoom(roomId) {
        try {
            // 保存房间ID
            sessionStorage.setItem('bilising-room-id', roomId);

            // 初始化Socket.IO连接
            socket = io(myURL);

            // 设置Socket事件监听器
            setupSocketListeners();

            // 更新状态
            updateStatus('连接中...');

            // 加入房间
            socket.emit('join_room', {
                room_id: roomId,
                user_name: currentUser,
                user_type: currentUserType
            });

            currentRoom = roomId;

        } catch (error) {
            console.error('连接失败:', error);
            updateStatus('连接失败');
        }
    }

    // 断开连接
    function disconnectSocket() {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
        isConnected = false;
        currentRoom = null;
        updateStatus('未连接');
        document.getElementById('bilising-connect').textContent = '连接';
        document.getElementById('bilising-controls').style.display = 'none';
        document.getElementById('bilising-noqr-text').style.display = 'block';
        document.getElementById('bilising-qr-code').style.display = 'none';
        document.getElementById('bilising-qr-code-float').style.display = 'none';
        sessionStorage.removeItem('bilising-room-id');
    }

    // 设置Socket事件监听器
    function setupSocketListeners() {
        socket.on('connect', function () {
            console.log('Socket.IO连接成功');
        });

        socket.on('room_joined', function (data) {
            isConnected = true;
            updateStatus(`已连接到房间: ${currentRoom}`);
            document.getElementById('bilising-noqr-text').style.display = 'none';
            document.getElementById('bilising-qr-code').style.display = 'block';
            document.getElementById('bilising-qr-code-float').style.display = 'block';

            // 使用新的二维码生成函数
            generateQRCodes();

            document.getElementById('bilising-connect').textContent = '断开';
            document.getElementById('bilising-controls').style.display = 'block';

            // 更新当前播放和下一首
            updateCurrentPlaying(data.current_playing);
            updateNextSong(data.play_list);
            played_songs = data.played_songs || [];
        });

        socket.on('now_playing', function (data) {
            updateCurrentPlaying(data.current_playing);
        });

        socket.on('playlist_updated', function (data) {
            updateNextSong(data.play_list);
            played_songs = data.played_songs || [];
            console.warn('播放列表已更新:', played_songs);
        });

        socket.on('error', function (data) {
            console.error('Socket错误:', data.message);
            updateStatus('错误: ' + data.message);
        });

        socket.on('disconnect', function () {
            isConnected = false;
            updateStatus('连接断开');
            document.getElementById('bilising-connect').textContent = '连接';
            document.getElementById('bilising-controls').style.display = 'none';
        });

        socket.on('new_message', function (data) {
            if (!data.message) return;
            const message = data.message;
            let msgText;
            if (message.message_type === "system") {
                msgText = `${message.user_name} ${message.content}`;
            } else {
                msgText = `${message.user_name} 说: ${message.content}`;
                // 非系统消息，添加到朗读队列
                ttsQueue.add(`${message.user_name}说，${message.content}`);
            }
            headerContentController.setTemporaryText(msgText);
        });

        socket.on('playback_control', function (data) {
            const isWebplayer = !!window.__BILISING_WEBPLAYER__;
            const video = isWebplayer ? document.getElementById('videoElement') : document.querySelector("#bilibili-player video");
            if (data.action === 'play_from_start') {
                if (isWebplayer) {
                    if (video) {
                        video.currentTime = 0;
                        video.play();
                    }
                } else if (window.player && window.player.seek) {
                    window.player.seek(0);
                    window.player.play();
                }
            } else if (data.action === 'volume_up') {
                if (!video) return;
                const current = video.volume;
                video.volume = Math.min(1, current + 0.1);
                headerContentController.setTemporaryText(`音量: ${Math.round(video.volume * 100)}%`);
            } else if (data.action === 'volume_down') {
                if (!video) return;
                const current = video.volume;
                video.volume = Math.max(0, current - 0.1);
                headerContentController.setTemporaryText(`音量: ${Math.round(video.volume * 100)}%`);
            } else if (data.action === 'play_pause') {
                if (!video) return;
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        });
    }

    // 更新状态显示
    function updateStatus(status) {
        document.getElementById('bilising-status').textContent = status;
    }

    // 更新当前播放
    async function updateCurrentPlaying(song) {
        currentPlaying = song;
        const currentSongElement = document.getElementById('bilising-current-song');

        if (song && song.title) {
            currentSongElement.innerHTML = `
        <div>${song.title}</div>
        <div style="color: #ccc; font-size: 10px;">UP主: ${song.producer}</div>
    `;

            navigateToVideoIfNeeded(song.url);
        } else {
            currentSongElement.textContent = '暂无歌曲';
            headerContentController.setOriginalText('已播放完所有歌曲，正在重复播放最后一首，请扫码点播');
            return;
        }
        // MARK: append
    }

    // 更新下一首歌曲
    function updateNextSong(playlist) {
        play_list = playlist || [];
        const nextSongElement = document.getElementById('bilising-next-song');
        const playNextButton = document.getElementById('bilising-play-next');

        if (playlist && playlist.length > 0) {
            nextSong = playlist[0];
            nextSongElement.innerHTML = `
        <div>${nextSong.title}</div>
        <div style="color: #ccc; font-size: 10px;">UP主: ${nextSong.producer}</div>
    `;
            headerContentController.setOriginalText(`下一首: ${nextSong.title}; 正播放: ${currentPlaying ? currentPlaying.title : '暂无歌曲'}`);
        } else {
            nextSong = null;
            nextSongElement.textContent = '暂无歌曲';
            headerContentController.setOriginalText('已是最后一首歌曲; 正播放: ' + (currentPlaying ? currentPlaying.title : '暂无歌曲'));
        }
    }

    // 提取BV号
    function extractBVId(url) {
        const match = url.match(/BV[\w]+/);
        return match ? match[0] : null;
    }

    // 导航到视频
    async function navigateToVideoIfNeeded(url) {
        if (window.__BILISING_WEBPLAYER__) {
            const video = document.getElementById('videoElement');
            if (video) {
                const mode = localStorage.getItem('bilising-play-mode') || 'proxy';
                video.src = `/v/${currentRoom}?t=${mode}`;
                video.play().catch(e => {
                    video.style.display = 'none';
                    const btn = document.createElement('button');
                    btn.textContent = '点击允许播放';
                    btn.style = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        padding: 10px 20px;
                        font-size: 16px;
                        z-index: 2147483647;
                        border-radius: 1em;
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        border: none;
                        z-index: 2147483647;
                    `
                    btn.style.zIndex = '2147483647';
                    btn.onclick = () => {
                        ttsQueue.init();
                        ttsQueue.audioElement.play();
                        video.play();
                        video.volume = 0.1;
                        document.body.removeChild(btn);
                        video.style.display = 'block';
                    }
                    document.body.appendChild(btn);
                });
            }
            return;
        }

        if ((location.href.includes('/video/') || location.href.includes('/festival/')) && window.player && window.player.reload) {
            // 以下为内部API，可能失效
            const manifest = window.player.getManifest();
            const pRegex = /[?&]p=(\d+)/;
            const bvId = extractBVId(url);
            const pMatch = url.match(pRegex);
            let p = 1;
            if (pMatch) {
                p = parseInt(pMatch[1]);
            }
            if (bvId && (bvId !== manifest.bvid || p !== manifest.p)) {
                window.player.reload({ bvid: bvId, p: p });
                window.player.once(window.nano.EventType.Player_Play, async (e) => { await playFromStart(); });
            }
        } else {
            if (!window.location.href.includes(extractBVId(url)))
                location.href = url;
        }

    }

    // 使浮窗可拖拽
    function makeDraggable(element) {
        let header = element.querySelector('.header');
        if (!header) header = element;
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
        header.addEventListener('touchstart', dragStart);
        document.addEventListener('touchmove', dragMove, { passive: false });
        document.addEventListener('touchend', dragEnd, { passive: false });

        function dragStart(e) {
            if (e.target.id === 'bilising-toggle') return;

            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            initialX = clientX - xOffset;
            initialY = clientY - yOffset;

            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
            }
        }

        function dragMove(e) {
            if (isDragging) {
                e.preventDefault();
                const clientX = e.clientX || e.touches[0].clientX;
                const clientY = e.clientY || e.touches[0].clientY;

                currentX = clientX - initialX;
                currentY = clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                element.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    }

    // 页面加载完成后创建浮窗
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingWindow);
    } else {
        createFloatingWindow();
    }
})();

if (typeof GM_info !== "undefined" && location.hostname !== "bilibili.com") {
    window.__BILISING_USERSCRIPT_ENABLED__ = true;
}