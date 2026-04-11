from flask import Flask, render_template, request, Response, jsonify, redirect
from flask_socketio import SocketIO, emit, join_room, leave_room
import uuid
import re
import time
import requests
from urllib.parse import urlparse, parse_qs, urlunparse
from concurrent.futures import ThreadPoolExecutor
from bili_api import extract_bilibili_info, convert_b23, search_suggest, search_video, get_video_info, get_direct_play_url, BASE_HEADERS_TV
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

@app.route('/v1/audio/speech', methods=['POST', 'OPTIONS', 'GET'])
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

        if request.method == 'POST':
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
        else:
            text = request.args.get('input', '')
            voice = request.args.get('voice', voice)
            speed = request.args.get('speed', speed)
            volume = request.args.get('volume', volume)
            pitch = request.args.get('pitch', pitch)
            style = request.args.get('style', style)
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
    
@app.route("/api/bili/suggest", methods=["GET"])
def bili_suggest():
    term = request.args.get("term", "").strip()
    if not term:
        return jsonify([])
    return jsonify(search_suggest(term))


@app.route("/api/bili/search", methods=["POST"])
def search_bili():
    data = request.get_json() or {}
    keyword = data.get("keyword", "").strip()
    if not keyword:
        return jsonify({"error": "keyword is required", "num_results": 0, "videos": []}), 400
    result = search_video(
        keyword=keyword,
        page=data.get("page", 1),
        order=data.get("order"),
        duration=data.get("duration"),
        tids=data.get("tids"),
        order_sort=data.get("order_sort"),
        pub_begin=data.get("pub_begin"),
        pub_end=data.get("pub_end"),
    )
    return jsonify(result)


@app.route("/api/bili/pages", methods=["GET"])
def bili_pages():
    bvid = request.args.get("bvid", "").strip()
    if not bvid:
        return jsonify({"error": "bvid is required"}), 400
    data = get_video_info(bvid)
    if not data:
        return jsonify({"error": "无法获取视频信息"}), 400
    return jsonify({
        "title": data.get("title", ""),
        "owner": data.get("owner", {}),
        "duration": data.get("duration", 0),
        "pages": [
            {"page": p.get("page"), "part": p.get("part", ""), "duration": p.get("duration", 0)}
            for p in data.get("pages", [])
        ],
    })
    
@app.route("/v/<room_id>")
def video_room(room_id):
    query_type = request.args.get('t', 'inline')
    
    if query_type == 'inline':
        return render_template('webplayer.html', room_id=room_id)
    
    room = rooms.get(room_id)
    
    if not room:
        return "房间不存在", 404

    cur = room.current_playing
    if not cur:
        return "当前没有播放视频", 404
    
    url = get_direct_play_url(cur.url)
    if url:
        if query_type == 'redirect':
            return redirect(url)
        elif query_type == 'link':
            return "<a href='{}'>点击这里播放</a>".format(url)
        elif query_type == 'proxy':
            try:
                req_headers = dict(BASE_HEADERS_TV)
                # 转发客户端的 Range 头，用于支持进度条拖动和断点续传
                range_header = request.headers.get('Range', None)
                if range_header:
                    req_headers['Range'] = range_header

                resp = requests.get(url, stream=True, headers=req_headers)
                
                response = Response(resp.iter_content(chunk_size=8192), 
                                    status=resp.status_code, 
                                    content_type=resp.headers.get('Content-Type', 'application/octet-stream'))
                
                # 透传关键响应头，使浏览器知道支持 Range 并且获取正确的长度和范围
                for header in ['Content-Length', 'Content-Range', 'Accept-Ranges']:
                    if header in resp.headers:
                        response.headers[header] = resp.headers[header]
                        
                return response
            except Exception as e:
                print(f"Error proxying audio: {e}")
                return "无法获取播放地址", 500
    else:
        return "无法获取播放地址", 500
    


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
    new_message = add_message_to_room(room_id, user_name, f'点播：{song.title}', 'system')
    
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
        new_message = add_message_to_room(room_id, user_name, f'删除：{removed_song.title}', 'system')
        
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
            new_message = add_message_to_room(room_id, user_name, f'播放下一个：{room.current_playing.title}', 'system')
        
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
        new_message = add_message_to_room(room_id, user_name, f'重播：{song_to_replay.title}', 'system')
        
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

@socketio.on('playback_control')
def on_playback_control(data):
    room_id = data['room_id']
    action = data['action']
    
    if room_id not in rooms:
        emit('error', {'message': '房间不存在'})
        return
    
    # 更新房间活跃时间
    update_room_activity(room_id)
    
    # 广播播放控制指令给所有用户
    emit('playback_control', {'action': action}, room=room_id)
    

@socketio.on('disconnect')
def on_disconnect():
    # 处理用户断开连接
    pass

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='BiliSing Server')
    parser.add_argument('--local', '-l', action='store_true', help='Listen on 127.0.0.1 instead of 0.0.0.0')
    parser.add_argument('--debug', '-d', action='store_true', help='Enable debug mode')
    args = parser.parse_args()

    host = '127.0.0.1' if args.local else '0.0.0.0'
    socketio.run(app, debug=args.debug, host=host, port=11817)
