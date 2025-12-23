from flask import Flask, render_template, request, Response, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
import uuid
import re
import time
import requests
from urllib.parse import urlparse, parse_qs, urlunparse
from concurrent.futures import ThreadPoolExecutor
import tts_server

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
    def __init__(self, title, producer, url, duration=0, by='游客'):
        self.title = title
        self.producer = producer
        self.url = url
        self.duration = duration  # 以秒为单位
        self.by = by  # 点播者

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
        self.played_songs = []
        self.messages = []  # 存储聊天消息
        self.last_activity = time.time()  # 记录最后活跃时间

def convert_b23(b23_url):
    try:
        # 不允许自动重定向，以便手动检查 Location 头
        resp = requests.get(b23_url, allow_redirects=False, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Referer': 'https://www.bilibili.com/'})
    except requests.RequestException as e:
        raise RuntimeError(f"Request failed: {e}")

    if resp.status_code in [301, 302]:
        location = resp.headers.get("Location")
        if not location:
            raise ValueError("No redirect location found in response.")
    else:
        location = b23_url

    return location

def extract_bilibili_info(url):
    """从哔哩哔哩链接中提取视频信息"""
    bv_match = re.search(r'BV[\w]+', url) 
    p_match = re.search(r'[?&]p=(\d+)', url)
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
                duration = video_data['duration']
                # 如果指定了分P，尝试获取对应分P的时长
                try:
                    if p_match:
                        p_index = int(p_match.group(1)) - 1
                        if 0 <= p_index < len(video_data['pages']):
                            duration = video_data['pages'][p_index]['duration']
                    else:
                        if 'pages' in video_data and len(video_data['pages']) > 0:
                            duration = video_data['pages'][0]['duration']
                except:
                    if not duration:
                        duration = 0
                return {
                    'title': video_data['title'],
                    'producer': video_data['owner']['name'],
                    'duration': duration,
                    'url': f'https://www.bilibili.com/video/{bv_id}',
                }
        # 如果API调用失败或数据不完整，返回默认信息
        return {
            'title': f'视频标题 {bv_id}',
            'producer': '未知UP主',
            'duration': 0,
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
        
        # 更新房间活跃时间
        update_room_activity(room_id)
        
        # 返回格式化的消息对象
        return {
            'user_name': message.user_name,
            'content': message.content,
            'message_type': message.message_type,
            'timestamp': message.timestamp
        }
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

def update_room_activity(room_id):
    """更新房间的最后活跃时间"""
    if room_id in rooms:
        rooms[room_id].last_activity = time.time()

def is_room_expired(room_id):
    """检查房间是否已过期（超过2小时未活跃）"""
    if room_id not in rooms:
        return False
    
    current_time = time.time()
    last_activity = rooms[room_id].last_activity
    # 2小时 = 2 * 60 * 60 = 7200秒
    return (current_time - last_activity) > 7200

def clear_expired_room(room_id):
    """清除过期房间的数据"""
    if room_id in rooms:
        del rooms[room_id]
        return True
    return False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/v1/audio/speech', methods=['POST', 'OPTIONS'])
def audio_speech():
    if request.method == 'OPTIONS':
        return Response(status=204, headers=tts_server.make_cors_headers())

    try:
        text = ""
        voice = "zh-CN-XiaoxiaoNeural"
        speed = '1.0'
        volume = '0'
        pitch = '0'
        style = "general"

        if request.content_type and 'multipart/form-data' in request.content_type:
            # Handle file upload
            file = request.files.get('file')
            if not file:
                return jsonify({"error": {"message": "No file"}}), 400
            
            text = file.read().decode('utf-8')
            voice = request.form.get('voice', voice)
            speed = request.form.get('speed', speed)
            volume = request.form.get('volume', volume)
            pitch = request.form.get('pitch', pitch)
            style = request.form.get('style', style)
        else:
            # Handle JSON
            data = request.get_json()
            if not data:
                 return jsonify({"error": {"message": "Invalid JSON"}}), 400
            text = data.get('input')
            voice = data.get('voice', voice)
            speed = data.get('speed', speed)
            volume = data.get('volume', volume)
            pitch = data.get('pitch', pitch)
            style = data.get('style', style)

        if not text:
             return jsonify({"error": {"message": "No input text"}}), 400

        # Format parameters
        rate_val = int((float(speed) - 1.0) * 100)
        rate = f"+{rate_val}%" if rate_val >= 0 else f"{rate_val}%"
        
        vol_val = int(float(volume) * 100)
        vol = f"+{vol_val}%" if vol_val >= 0 else f"{vol_val}%"
        
        pitch_val = int(pitch)
        pitch_str = f"+{pitch_val}Hz" if pitch_val >= 0 else f"{pitch_val}Hz"
        
        output_format = "audio-24khz-48kbitrate-mono-mp3"

        # Process
        clean_text = text.strip()
        if len(clean_text) <= 1500:
            audio_data = tts_server.get_audio_chunk(clean_text, voice, rate, pitch_str, vol, style, output_format)
            headers = tts_server.make_cors_headers()
            headers["Content-Type"] = "audio/mpeg"
            return Response(audio_data, headers=headers)
        
        chunks = tts_server.optimized_text_split(clean_text, 1500)
        if len(chunks) > 40:
             return jsonify({"error": {"message": "Text too long"}}), 400
             
        # Batch processing
        final_audio = b""
        batch_size = 3
        
        # Using ThreadPoolExecutor for concurrent requests
        with ThreadPoolExecutor(max_workers=batch_size) as executor:
            for i in range(0, len(chunks), batch_size):
                batch = chunks[i:i + batch_size]
                futures = []
                for idx, chunk in enumerate(batch):
                    if idx > 0:
                        time.sleep(0.2 * idx)
                    futures.append(executor.submit(tts_server.get_audio_chunk, chunk, voice, rate, pitch_str, vol, style, output_format))
                
                for future in futures:
                    final_audio += future.result()
                
                if i + batch_size < len(chunks):
                    time.sleep(0.8) # 800ms delay between batches

        headers = tts_server.make_cors_headers()
        headers["Content-Type"] = "audio/mpeg"
        return Response(final_audio, headers=headers)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": {"message": str(e)}}), 500

@socketio.on('join_room')
def on_join_room(data):
    room_id = data['room_id']
    user_name = data['user_name']
    user_type = data['user_type']
    
    # 创建用户
    user = User(user_name, user_type)
    
    # 检查房间是否存在且是否过期
    room_exists = room_id in rooms
    room_expired = is_room_expired(room_id) if room_exists else False
    
    # 如果房间过期，清除数据
    if room_expired:
        clear_expired_room(room_id)
        room_exists = False
    
    # 如果房间不存在且用户是master，则创建房间
    if not room_exists:
        if user_type == 'master':
            rooms[room_id] = RoomInfo(room_id)
        else:
            emit('error', {'message': '房间不存在，请等待主设备创建房间'})
            return
    
    # 更新房间活跃时间
    update_room_activity(room_id)
    
    # 加入房间
    join_room(room_id)
    
    # 发送当前房间状态
    room_info = rooms[room_id]
    tmp_data = {
        'user_uuid': user.uuid,
        'room_id': room_id,
        'current_playing': {
            'title': room_info.current_playing.title if room_info.current_playing else None,
            'producer': room_info.current_playing.producer if room_info.current_playing else None,
            'url': room_info.current_playing.url if room_info.current_playing else None,
            'duration': room_info.current_playing.duration if room_info.current_playing else None,
            'by': room_info.current_playing.by if room_info.current_playing else None,
        } if room_info.current_playing else None,
        'play_list': [{
            'title': song.title,
            'producer': song.producer,
            'url': song.url,
            'duration': song.duration,
            'by': song.by,
        } for song in room_info.play_list],
        'played_songs': [{
            'title': song.title,
            'producer': song.producer,
            'url': song.url,
            'duration': song.duration,
        } for song in room_info.played_songs]
    }
    if user_type == 'slave':
        tmp_data['messages'] = get_messages_for_room(room_id)
    emit('room_joined', tmp_data)
    
    # 添加系统消息并广播给其他用户
    if user.name != "播放设备":
        new_message = add_message_to_room(room_id, user.name, f'加入了房间', 'system')
        if new_message:
            emit('new_message', {'message': new_message}, room=room_id)

@socketio.on('add_song')
def on_add_song(data):
    room_id = data['room_id']
    bilibili_url = convert_b23(data['url'])
    user_name = data.get('user_name', '未知用户')
    
    if room_id not in rooms:
        emit('error', {'message': '房间不存在'})
        return
    
    # 更新房间活跃时间
    update_room_activity(room_id)
    
    # 提取哔哩哔哩视频信息
    video_info = extract_bilibili_info(bilibili_url)
    if not video_info:
        emit('error', {'message': '无效的哔哩哔哩链接'})
        return
    video_info['by'] = user_name  # 记录点播者
    
    # 创建歌曲对象并添加到播放列表
    song = Song(video_info['title'], video_info['producer'], bilibili_url, video_info['duration'], video_info['by'])
    rooms[room_id].play_list.append(song)
    
    # 添加系统消息
    new_message = add_message_to_room(room_id, user_name, f'点播了歌曲：{song.title}', 'system')
    
    # 广播播放列表更新
    emit('playlist_updated', {
        'play_list': [{
            'title': song.title,
            'producer': song.producer,
            'url': song.url,
            'duration': song.duration,
            'by': song.by
        } for song in rooms[room_id].play_list],
        'played_songs': [{
            'title': song.title,
            'producer': song.producer,
            'url': song.url,
            'duration': song.duration,
        } for song in rooms[room_id].played_songs]
    }, room=room_id)
    
    # 广播新消息
    if new_message:
        emit('new_message', {'message': new_message}, room=room_id)
    
    if not rooms[room_id].current_playing:
        # 如果当前没有播放歌曲，立即播放新添加的歌曲
        on_next_song({'room_id': room_id, 'user_name': "播放设备"})
        
        
@socketio.on('request_playlist_update')
def on_request_playlist_update(data):
    room_id = data['room_id']
    
    if room_id not in rooms:
        emit('error', {'message': '房间不存在'})
        return

    # 更新房间活跃时间
    update_room_activity(room_id)
    
    emit('now_playing', {
        'current_playing': {
            'title': rooms[room_id].current_playing.title,
            'producer': rooms[room_id].current_playing.producer,
            'url': rooms[room_id].current_playing.url,
            'duration': rooms[room_id].current_playing.duration,
            'by': rooms[room_id].current_playing.by
        }
    })

    emit('playlist_updated', {
        'play_list': [{
            'title': song.title,
            'producer': song.producer,
            'url': song.url,
            'duration': song.duration,
            'by': song.by
        } for song in rooms[room_id].play_list],
        'played_songs': [{
            'title': song.title,
            'producer': song.producer,
            'url': song.url,
            'duration': song.duration,
        } for song in rooms[room_id].played_songs]
    })
    
    return

@socketio.on('remove_song')
def on_remove_song(data):
    room_id = data['room_id']
    song_index = data['index']
    user_name = data.get('user_name', '未知用户')
    
    if room_id not in rooms:
        emit('error', {'message': '房间不存在'})
        return
    
    # 更新房间活跃时间
    update_room_activity(room_id)
    
    room = rooms[room_id]
    if 0 <= song_index < len(room.play_list):
        removed_song = room.play_list.pop(song_index)
        
        # 添加系统消息
        new_message = add_message_to_room(room_id, user_name, f'删除了歌曲：{removed_song.title}', 'system')
        
        # 广播播放列表更新
        emit('playlist_updated', {
            'play_list': [{
                'title': song.title,
                'producer': song.producer,
                'url': song.url,
                'duration': song.duration,
                'by': song.by
            } for song in room.play_list],
            'played_songs': [{
                'title': song.title,
                'producer': song.producer,
                'url': song.url,
                'duration': song.duration,
            } for song in room.played_songs]
        }, room=room_id)
        
        # 广播新消息
        if new_message:
            emit('new_message', {'message': new_message}, room=room_id)

@socketio.on('reorder_songs')
def on_reorder_songs(data):
    room_id = data['room_id']
    from_index = data['from_index']
    to_index = data['to_index']
    
    if room_id not in rooms:
        emit('error', {'message': '房间不存在'})
        return
    
    # 更新房间活跃时间
    update_room_activity(room_id)
    
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
                'url': song.url,
                'duration': song.duration,
                'by': song.by
            } for song in room.play_list],
            'played_songs': [{
                'title': song.title,
                'producer': song.producer,
                'url': song.url,
                'duration': song.duration,
            } for song in room.played_songs]
        }, room=room_id)

@socketio.on('next_song')
def on_next_song(data):
    room_id = data['room_id']
    user_name = data.get('user_name', '未知用户')
    
    if room_id not in rooms:
        emit('error', {'message': '房间不存在'})
        return
    
    # 更新房间活跃时间
    update_room_activity(room_id)
    
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
        if user_name == '播放设备':
            new_message = None
        else:
            new_message = add_message_to_room(room_id, user_name, f'播放下一首：{room.current_playing.title}', 'system')
        
        # 广播当前播放和播放列表更新
        emit('now_playing', {
            'current_playing': {
                'title': room.current_playing.title,
                'producer': room.current_playing.producer,
                'url': room.current_playing.url,
                'duration': room.current_playing.duration,
                'by': room.current_playing.by
            }
        }, room=room_id)
        
        emit('playlist_updated', {
            'play_list': [{
                'title': song.title,
                'producer': song.producer,
                'url': song.url,
                'duration': song.duration,
                'by': song.by
            } for song in room.play_list],
            'played_songs': [{
                'title': song.title,
                'producer': song.producer,
                'url': song.url,
                'duration': song.duration,
            } for song in room.played_songs]
        }, room=room_id)
        
        # 广播新消息
        if new_message:
            emit('new_message', {'message': new_message}, room=room_id)
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
    
    # 更新房间活跃时间
    update_room_activity(room_id)
    
    room = rooms[room_id]
    if 0 <= song_index < len(room.played_songs):
        # 从已播放列表中获取歌曲并添加到播放列表
        song_to_replay = Song(
            room.played_songs[song_index].title,
            room.played_songs[song_index].producer,
            room.played_songs[song_index].url,
            room.played_songs[song_index].duration,
            user_name
        )
        room.play_list.append(song_to_replay)
        
        # 添加系统消息
        new_message = add_message_to_room(room_id, user_name, f'重播了歌曲：{song_to_replay.title}', 'system')
        
        # 广播播放列表更新
        emit('playlist_updated', {
            'play_list': [{
                'title': song.title,
                'producer': song.producer,
                'url': song.url,
                'duration': song.duration,
                'by': song.by
            } for song in room.play_list],
            'played_songs': [{
                'title': song.title,
                'producer': song.producer,
                'url': song.url,
                'duration': song.duration,
            } for song in room.played_songs]
        }, room=room_id)
        
        # 广播新消息
        if new_message:
            emit('new_message', {'message': new_message}, room=room_id)
        
        if not rooms[room_id].current_playing:
            # 如果当前没有播放歌曲，立即播放新添加的歌曲
            on_next_song({'room_id': room_id, 'user_name': "播放设备"})

@socketio.on('send_message')
def on_send_message(data):
    room_id = data['room_id']
    user_name = data['user_name']
    message_content = data['message']
    
    if room_id not in rooms:
        emit('error', {'message': '房间不存在'})
        return
    
    # 更新房间活跃时间
    update_room_activity(room_id)
    
    # 添加用户消息
    new_message = add_message_to_room(room_id, user_name, message_content, 'user')
    if new_message:
        emit('new_message', {'message': new_message}, room=room_id)

@socketio.on('disconnect')
def on_disconnect():
    # 处理用户断开连接
    pass

if __name__ == '__main__':
    socketio.run(app, debug=False, host='0.0.0.0', port=11817)
