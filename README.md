# BiliSing 卡拉OK点歌系统

BiliSing 是一个基于哔哩哔哩视频的卡拉OK点歌系统。用户可以通过分享哔哩哔哩视频链接来点歌，支持多设备协同使用。

## 功能特点

- 🎵 支持哔哩哔哩视频点歌
- 📱 分离式设计：播放设备和点歌设备分开
- 🔄 实时同步：使用 Socket.IO 实现实时数据同步
- 📝 播放列表管理：支持删除歌曲和调整播放顺序
- 🎮 简单易用：无需数据库，所有数据存储在内存中

## 系统架构

### 后端
- **语言**: Python
- **框架**: Flask + Flask-SocketIO
- **通信**: Socket.IO 实现实时双向通信
- **存储**: 内存存储（无数据库）

### 前端
- **技术**: 原生 HTML + CSS + JavaScript
- **依赖**: Socket.IO 客户端库（通过CDN引入）
- **特点**: 响应式设计，支持移动设备

## 项目结构

```
BiliSing/
├── app.py                 # Flask 后端应用
├── requirements.txt       # Python 依赖
├── start.sh              # 启动脚本
├── startup.md            # 项目需求文档
├── README.md             # 项目说明
└── templates/
    └── index.html        # 前端页面
```

## 安装和运行

### 方法一：使用启动脚本（推荐）

```bash
# 直接运行启动脚本
./start.sh
```

### 方法二：手动安装

```bash
# 1. 安装 Python 依赖
pip3 install -r requirements.txt

# 2. 启动应用
python3 app.py
```

### 访问应用

启动成功后，在浏览器中打开：
```
http://localhost:11817
```

## 使用说明

### 1. 创建房间

1. 选择"播放设备"类型
2. 输入房间ID和用户名
3. 点击"加入房间"创建新房间

### 2. 加入房间点歌

1. 选择"点歌设备"类型
2. 输入相同的房间ID和用户名
3. 点击"加入房间"

### 3. 点歌操作

在点歌设备上：
- 复制哔哩哔哩视频分享链接
- 粘贴到输入框中
- 点击"点歌"按钮

### 4. 播放控制

在播放设备上：
- 自动播放当前歌曲
- 查看下一首歌曲信息
- 点击"播放下一首"切换歌曲

### 5. 播放列表管理

在点歌设备上可以：
- 上移/下移歌曲调整播放顺序
- 删除不需要的歌曲

## 数据结构

### RoomInfo（房间信息）
```javascript
{
    room_id: String,        // 房间ID
    play_list: Song[],      // 播放列表
    current_playing: Song,  // 当前播放歌曲
    users: User[]          // 房间用户列表
}
```

### User（用户信息）
```javascript
{
    name: String,          // 用户名
    uuid: String,          // 用户唯一标识
    type: String          // 用户类型：'master' 或 'slave'
}
```

### Song（歌曲信息）
```javascript
{
    title: String,         // 视频标题
    producer: String,      // UP主名称
    url: String           // 哔哩哔哩播放链接
}
```

## Socket.IO 事件

### 客户端发送事件

- `join_room`: 加入房间
- `add_song`: 添加歌曲
- `remove_song`: 删除歌曲
- `reorder_songs`: 调整歌曲顺序
- `next_song`: 播放下一首

### 服务端发送事件

- `room_joined`: 成功加入房间
- `now_playing`: 当前播放歌曲更新
- `playlist_updated`: 播放列表更新
- `user_joined`: 用户加入通知
- `error`: 错误信息

## 技术细节

### 哔哩哔哩视频嵌入

系统会自动解析哔哩哔哩链接中的BV号，并生成嵌入式播放器：
```javascript
const embedUrl = `https://player.bilibili.com/player.html?bvid=${bvId}&autoplay=1`;
```

### 实时同步机制

使用 Socket.IO 的房间功能实现多设备实时同步：
- 所有同房间用户自动接收播放列表更新
- 播放设备实时接收当前播放歌曲信息
- 点歌设备实时看到播放列表变化

## 开发说明

### 扩展功能建议

1. **视频信息获取**: 集成哔哩哔哩API获取真实的视频标题和UP主信息
2. **用户权限**: 增加房间管理员功能
3. **历史记录**: 添加播放历史功能
4. **多房间管理**: 支持用户同时管理多个房间
5. **移动端优化**: 进一步优化移动设备体验

### 部署注意事项

1. **端口配置**: 默认使用5000端口，可在 `app.py` 中修改
2. **跨域设置**: 已配置 `cors_allowed_origins="*"`，生产环境建议限制域名
3. **内存使用**: 所有数据存储在内存中，服务重启后数据会丢失

## 许可证

本项目仅供学习交流使用。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！
