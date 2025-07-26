// ==UserScript==
// @name         Bilibili 创建收藏夹并批量添加视频
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动创建一个收藏夹并将多个视频加入其中
// @author       You
// @match        *://www.bilibili.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // 📌 设置你的收藏夹属性
    const favTitle = '批量收藏测试';
    const favIntro = '测试测试';
    const favPrivacy = 0; // 0:公开，1:自己可见

    // 📌 视频 BV 号列表（可以改成你要收藏的视频）
    const bvList = [
        'BV1AM4y1p7Fu',
        'BV1q1bCzkEwM',
        'BV1k68Kz5EPd'
    ];

    // 获取 CSRF token（从 Cookie 中读取）
    function getCsrf() {
        return document.cookie.match(/bili_jct=([^;]+)/)?.[1] ?? '';
    }

    // 创建一个新的收藏夹
    async function createFavFolder(title, intro, privacy) {
        const params = new URLSearchParams();
        params.append('title', title);
        params.append('intro', intro);
        params.append('public', String(privacy));
        params.append('csrf', getCsrf());

        const res = await fetch('https://api.bilibili.com/x/v3/fav/folder/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://www.bilibili.com/',
            },
            body: params
        });

        const json = await res.json();
        if (json.code === 0) {
            const favId = json.data.id;
            console.log(`✅ 收藏夹创建成功，ID=${favId}`);
            return favId;
        } else {
            throw new Error('收藏夹创建失败: ' + json.message);
        }
    }

    // 获取视频 aid
    async function bv2aid(bv) {
        const res = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bv}`);
        const json = await res.json();
        return json.data.aid;
    }

    // 添加视频到收藏夹
    async function addToFav(aid, favId) {
        const params = new URLSearchParams();
        params.append('rid', aid);
        params.append('type', '2');
        params.append('add_media_ids', favId);
        params.append('csrf', getCsrf());

        const res = await fetch('https://api.bilibili.com/x/v3/fav/resource/deal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://www.bilibili.com/',
            },
            body: params
        });

        const json = await res.json();
        if (json.code === 0) {
            console.log(`✅ 添加成功: aid=${aid}`);
        } else {
            console.warn(`❌ 添加失败: aid=${aid}`, json.message);
        }
    }

    // 主逻辑
    (async function () {
        try {
            const favId = await createFavFolder(favTitle, favIntro, favPrivacy);

            for (const bv of bvList) {
                try {
                    const aid = await bv2aid(bv);
                    await addToFav(aid, favId);
                    await new Promise(r => setTimeout(r, 1000)); // 限速
                } catch (err) {
                    console.error(`添加 ${bv} 失败:`, err);
                }
            }

            console.log('🎉 所有视频已尝试添加');
        } catch (e) {
            console.error('初始化失败：', e);
        }
    })();

})();