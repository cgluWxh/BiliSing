# BiliSing
BiliSing 是一个卡拉ok点歌系统。后端由Python+Flask实现，前端由原生js实现。该项目没有任何数据库部分，所有运行时数据保存在内存中。
后端需要维护一个以下类型的房间列表和房间信息。
typedef RoomList = RoomInfo[]
typedef RoomInfo = {
    playList: Song[];
    currentPlaying: Song[];
    roomId: String;
    users: User;
}
typedef User = {
    name: String;
    uuid: String; // 随机生成
    type: 'master' | 'slave'; // master代表播放设备，slave代表点歌设备
}
typedef Song = {
    title: String; // 视频标题
    producer: String; // 尝试解析哔哩哔哩的视频up主名称
    url: String; // 该视频的哔哩哔哩播放链接
}

前端需要在输入一个房间id和当前设备类型后加入一个房间，若该id不存在且当前设备身份为master则创建，无需使一个房间只有一个master。
前端与后端通过socket.io连接。
若当前设备为master，前端需把currentPlaying的Song通过iframe的方式嵌入并播放哔哩哔哩视频；若没有currentPlaying，展示暂无正在播放歌曲。master界面同时需要展示下一首播放的歌曲。
若当前设备为slave，前端需允许通过粘贴哔哩哔哩分享链接的方式点歌，同时允许在播放列表中删除歌曲和调整歌曲顺序。

**注：歌曲即为哔哩哔哩的一个视频。**