# BiliSing Changelog

## v1.7 - 2025-12-23
- Feat: 朗读开始时视频音量由突变变为平滑过渡，提升用户体验。

## v1.6 - 2025-12-23
- Feat: 增加了朗读功能，在用户发送消息时自动朗读消息内容，提升互动体验。(TTS API 来自 Microsoft Edge TTS (由 https://github.com/wangwangit/tts/blob/master/index.js 重写为 Python) )
- Fix: 修复了移动端消息浏览时无法自动滚动到底部的问题，确保用户能看到最新消息。
- Fix: 修复了无法正确获取多P视频中第1P时长的问题，确保播放列表显示准确的总时长。
- Fix: 修复了进入房间时会重复发送加入房间请求的问题。

## v1.5 - 2025-12-21
- Fix: 修复无法解析 https://www.bilibili.com/video/BV1xxxxxx 链接而只能解析 b23.tv 短链接的问题。
- Fix: 修复了播放多P视频时，无法正确获取到视频时长的问题。