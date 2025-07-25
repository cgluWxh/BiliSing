from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room
import uuid
import re
import time
import requests
from urllib.parse import urlparse, parse_qs, urlunparse

app = Flask(__name__)
app.config['SECRET_KEY'] = 'bilising_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*")

# 全局变量存储房间信息
rooms = {}

class User:
    def __init__(self, name, user_type):
        self.name = name
        self.uuid = str(uuid.uuid4())
        self.type = user_type  # 'master' or 'slave'

class Song:
    def __init__(self, title, producer, url):
        self.title = title
        self.producer = producer
        self.url = url

class Message:
    def __init__(self, user_name, content, message_type='user', timestamp=None):
        self.user_name = user_name
        self.content = content
        self.message_type = message_type  # 'user' or 'system'
        self.timestamp = timestamp or time.time()

class RoomInfo:
    def __init__(self, room_id):
        self.room_id = room_id
        self.play_list = []
        self.current_playing = None
        self.users = []
        self.played_songs = []
        self.messages = []  # 存储聊天消息

def convert_b23(b23_url):
    try:
        # 不允许自动重定向，以便手动检查 Location 头
        resp = requests.get(b23_url, allow_redirects=False, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Referer': 'https://www.bilibili.com/'})
    except requests.RequestException as e:
        raise RuntimeError(f"Request failed: {e}")

    if resp.status_code not in [301, 302, 200]:
        try:
            data = resp.json()
            message = data.get("message", "unknown error")
        except ValueError:
            message = "unknown error (not JSON response)"
        raise ValueError(f"Invalid b23 link (status code: {resp.status_code}, message: {message})")

    if resp.status_code == 200:
        location = b23_url  # 如果状态码是200，直接返回原始链接
    else:
        location = resp.headers.get("Location")
        if not location:
            raise ValueError("No redirect location found in response.")

    return location

def extract_bilibili_info(url):
    """从哔哩哔哩链接中提取视频信息"""
    # 这里是一个简化的实现，实际项目中可能需要调用哔哩哔哩API
    # 目前返回一个模拟的信息
    bv_match = re.search(r'BV[\w]+', url) 
    if bv_match:
        bv_id = bv_match.group()
        apiurl = f'https://api.bilibili.com/x/web-interface/view?bvid={bv_id}'
        resp = requests.get(apiurl, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Referer': 'https://www.bilibili.com/',
            'Accept': 'application/json, text/plain, */*'})
        if resp.status_code == 200:
            data = resp.json()
            if data['code'] == 0:
                video_data = data['data']
                return {
                    'title': video_data['title'],
                    'producer': video_data['owner']['name'],
                    'url': f'https://www.bilibili.com/video/{bv_id}'
                }
        # 如果API调用失败或数据不完整，返回默认信息
        return {
            'title': f'视频标题 {bv_id}',
            'producer': '未知UP主',
            'url': url
        }
    return None

def add_message_to_room(room_id, user_name, content, message_type='user'):
    """向房间添加消息"""
    if room_id in rooms:
        room = rooms[room_id]
        message = Message(user_name, content, message_type)
        room.messages.append(message)
        
        # 保持最近100条消息
        if len(room.messages) > 100:
            room.messages = room.messages[-100:]
        
        return message
    return None

def get_messages_for_room(room_id):
    """获取房间的消息列表"""
    if room_id in rooms:
        room = rooms[room_id]
        return [{
            'user_name': msg.user_name,
            'content': msg.content,
            'message_type': msg.message_type,
            'timestamp': msg.timestamp
        } for msg in room.messages[-100:]]  # 返回最近100条
    return []

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('join_room')
def on_join_room(data):
    room_id = data['room_id']
    user_name = data['user_name']
    user_type = data['user_type']
    
    # 创建用户
    user = User(user_name, user_type)
    
    # 如果房间不存在且用户是master，则创建房间
    if room_id not in rooms:
        if user_type == 'master':
            rooms[room_id] = RoomInfo(room_id)
        else:
            emit('error', {'message': '房间不存在，请等待主播创建房间'})
            return
    
    # 加入房间
    join_room(room_id)
    rooms[room_id].users.append(user)
    
    # 添加系统消息
    if user.name != "播放设备":
        add_message_to_room(room_id, user.name, f'加入了房间', 'system')
    
    # 发送当前房间状态
    room_info = rooms[room_id]
    emit('room_joined', {
        'user_uuid': user.uuid,
        'room_id': room_id,
        'current_playing': {
            'title': room_info.current_playing.title if room_info.current_playing else None,
            'producer': room_info.current_playing.producer if room_info.current_playing else None,
            'url': room_info.current_playing.url if room_info.current_playing else None
        } if room_info.current_playing else None,
        'play_list': [{
            'title': song.title,
            'producer': song.producer,
            'url': song.url
        } for song in room_info.play_list],
        'played_songs': [{
            'title': song.title,
            'producer': song.producer,
            'url': song.url
        } for song in room_info.played_songs],
        'messages': get_messages_for_room(room_id)
    })
    
    # 广播用户加入信息
    emit('user_joined', {
        'user_name': user.name,
        'user_type': user.type
    }, room=room_id)

@socketio.on('add_song')
def on_add_song(data):
    room_id = data['room_id']
    bilibili_url = convert_b23(data['url'])
    user_name = data.get('user_name', '未知用户')
    
    if room_id not in rooms:
        emit('error', {'message': '房间不存在'})
        return
    
    # 提取哔哩哔哩视频信息
    video_info = extract_bilibili_info(bilibili_url)
    if not video_info:
        emit('error', {'message': '无效的哔哩哔哩链接'})
        return
    
    # 创建歌曲对象并添加到播放列表
    song = Song(video_info['title'], video_info['producer'], bilibili_url)
    rooms[room_id].play_list.append(song)
    
    # 添加系统消息
    add_message_to_room(room_id, user_name, f'点播了歌曲：{song.title}', 'system')
    
    # 广播播放列表更新
    emit('playlist_updated', {
        'play_list': [{
            'title': song.title,
            'producer': song.producer,
            'url': song.url
        } for song in rooms[room_id].play_list],
        'played_songs': [{
            'title': song.title,
            'producer': song.producer,
            'url': song.url
        } for song in rooms[room_id].played_songs]
    }, room=room_id)
    
    # 广播新消息
    emit('new_message', {
        'messages': get_messages_for_room(room_id)
    }, room=room_id)
    
    if not rooms[room_id].current_playing:
        # 如果当前没有播放歌曲，立即播放新添加的歌曲
        on_next_song({'room_id': room_id, 'user_name': user_name})

@socketio.on('remove_song')
def on_remove_song(data):
    room_id = data['room_id']
    song_index = data['index']
    user_name = data.get('user_name', '未知用户')
    
    if room_id not in rooms:
        emit('error', {'message': '房间不存在'})
        return
    
    room = rooms[room_id]
    if 0 <= song_index < len(room.play_list):
        removed_song = room.play_list.pop(song_index)
        
        # 添加系统消息
        add_message_to_room(room_id, user_name, f'删除了歌曲：{removed_song.title}', 'system')
        
        # 广播播放列表更新
        emit('playlist_updated', {
            'play_list': [{
                'title': song.title,
                'producer': song.producer,
                'url': song.url
            } for song in room.play_list],
            'played_songs': [{
                'title': song.title,
                'producer': song.producer,
                'url': song.url
            } for song in room.played_songs]
        }, room=room_id)
        
        # 广播新消息
        emit('new_message', {
            'messages': get_messages_for_room(room_id)
        }, room=room_id)

@socketio.on('reorder_songs')
def on_reorder_songs(data):
    room_id = data['room_id']
    from_index = data['from_index']
    to_index = data['to_index']
    
    if room_id not in rooms:
        emit('error', {'message': '房间不存在'})
        return
    
    room = rooms[room_id]
    if 0 <= from_index < len(room.play_list) and 0 <= to_index < len(room.play_list):
        # 移动歌曲
        song = room.play_list.pop(from_index)
        room.play_list.insert(to_index, song)
        
        # 广播播放列表更新
        emit('playlist_updated', {
            'play_list': [{
                'title': song.title,
                'producer': song.producer,
                'url': song.url
            } for song in room.play_list],
            'played_songs': [{
                'title': song.title,
                'producer': song.producer,
                'url': song.url
            } for song in room.played_songs]
        }, room=room_id)

@socketio.on('next_song')
def on_next_song(data):
    room_id = data['room_id']
    user_name = data.get('user_name', '未知用户')
    
    if room_id not in rooms:
        emit('error', {'message': '房间不存在'})
        return
    
    room = rooms[room_id]
    
    # 如果播放列表有歌曲，播放下一首
    if room.play_list:
        room.current_playing = room.play_list.pop(0)
        
        # 添加到已播放列表（去重）
        if room.current_playing and not any(
            song.url == room.current_playing.url for song in room.played_songs
        ):
            room.played_songs.append(room.current_playing)
        
        # 添加系统消息
        add_message_to_room(room_id, user_name, f'播放下一首：{room.current_playing.title}', 'system')
        
        # 广播当前播放和播放列表更新
        emit('now_playing', {
            'current_playing': {
                'title': room.current_playing.title,
                'producer': room.current_playing.producer,
                'url': room.current_playing.url
            }
        }, room=room_id)
        
        emit('playlist_updated', {
            'play_list': [{
                'title': song.title,
                'producer': song.producer,
                'url': song.url
            } for song in room.play_list],
            'played_songs': [{
                'title': song.title,
                'producer': song.producer,
                'url': song.url
            } for song in room.played_songs]
        }, room=room_id)
        
        # 广播新消息
        emit('new_message', {
            'messages': get_messages_for_room(room_id)
        }, room=room_id)
    else:
        room.current_playing = None
        emit('now_playing', {'current_playing': None}, room=room_id)

@socketio.on('replay_song')
def on_replay_song(data):
    room_id = data['room_id']
    song_index = data['index']
    user_name = data.get('user_name', '未知用户')
    
    if room_id not in rooms:
        emit('error', {'message': '房间不存在'})
        return
    
    room = rooms[room_id]
    if 0 <= song_index < len(room.played_songs):
        # 从已播放列表中获取歌曲并添加到播放列表
        song_to_replay = room.played_songs[song_index]
        room.play_list.append(song_to_replay)
        
        # 添加系统消息
        add_message_to_room(room_id, user_name, f'重播了歌曲：{song_to_replay.title}', 'system')
        
        # 广播播放列表更新
        emit('playlist_updated', {
            'play_list': [{
                'title': song.title,
                'producer': song.producer,
                'url': song.url
            } for song in room.play_list],
            'played_songs': [{
                'title': song.title,
                'producer': song.producer,
                'url': song.url
            } for song in room.played_songs]
        }, room=room_id)
        
        # 广播新消息
        emit('new_message', {
            'messages': get_messages_for_room(room_id)
        }, room=room_id)

@socketio.on('send_message')
def on_send_message(data):
    room_id = data['room_id']
    user_name = data['user_name']
    message_content = data['message']
    
    if room_id not in rooms:
        emit('error', {'message': '房间不存在'})
        return
    
    # 添加用户消息
    add_message_to_room(room_id, user_name, message_content, 'user')
    
    # 广播新消息
    emit('new_message', {
        'messages': get_messages_for_room(room_id)
    }, room=room_id)

@socketio.on('disconnect')
def on_disconnect():
    # 处理用户断开连接
    pass

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=11817)
