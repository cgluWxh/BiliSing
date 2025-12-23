import json
import time
import uuid
import hmac
import hashlib
import base64
import requests
import re
from datetime import datetime

# Constants
TOKEN_REFRESH_BEFORE_EXPIRY = 3 * 60
SECRET_KEY_B64 = "oik6PdDdMnOXemTbwvMn9de/h9lFnfBaCWbGMMZqqoSaQaqUOqjVGm5NqsmjcBI1x+sS9ugjB55HEJWRiFXYFw=="

# Global token cache
token_info = {
    "endpoint": None,
    "token": None,
    "expired_at": None
}

def make_cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-key",
        "Access-Control-Max-Age": "86400"
    }

def date_format():
    return datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S GMT").lower()

def sign(url_str):
    url = url_str.split("://")[1]
    # encodeURIComponent equivalent
    from urllib.parse import quote
    encoded_url = quote(url, safe='')
    
    uuid_str = str(uuid.uuid4()).replace("-", "")
    formatted_date = date_format()
    bytes_to_sign = f"MSTranslatorAndroidApp{encoded_url}{formatted_date}{uuid_str}".lower().encode('utf-8')
    
    key = base64.b64decode(SECRET_KEY_B64)
    signature = hmac.new(key, bytes_to_sign, hashlib.sha256).digest()
    sign_base64 = base64.b64encode(signature).decode('utf-8')
    
    return f"MSTranslatorAndroidApp::{sign_base64}::{formatted_date}::{uuid_str}"

def get_endpoint():
    global token_info
    now = time.time()
    
    if token_info["token"] and token_info["expired_at"] and now < token_info["expired_at"] - TOKEN_REFRESH_BEFORE_EXPIRY:
        return token_info["endpoint"]
        
    endpoint_url = "https://dev.microsofttranslator.com/apps/endpoint?api-version=1.0"
    client_id = str(uuid.uuid4()).replace("-", "")
    
    headers = {
        "Accept-Language": "zh-Hans",
        "X-ClientVersion": "4.0.530a 5fe1dc6c",
        "X-UserId": "0f04d16a175c411e",
        "X-HomeGeographicRegion": "zh-Hans-CN",
        "X-ClientTraceId": client_id,
        "X-MT-Signature": sign(endpoint_url),
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": "0",
        "Accept-Encoding": "gzip"
    }
    
    try:
        response = requests.post(endpoint_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        jwt_token = data["t"].split(".")[1]
        # Add padding if needed for base64 decoding
        jwt_token += "=" * ((4 - len(jwt_token) % 4) % 4)
        decoded_jwt = json.loads(base64.urlsafe_b64decode(jwt_token).decode('utf-8'))
        
        token_info = {
            "endpoint": data,
            "token": data["t"],
            "expired_at": decoded_jwt["exp"]
        }
        return data
    except Exception as e:
        print(f"Failed to get endpoint: {e}")
        if token_info["token"]:
            print("Using expired cached token")
            return token_info["endpoint"]
        raise e

def escape_xml_text(text):
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace("'", '&apos;')

def get_ssml(text, voice_name, rate, pitch, volume, style, slien=0):
    escaped_text = escape_xml_text(text)
    slien_str = f'<break time="{slien}ms" />' if slien > 0 else ''
    
    return f"""<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" version="1.0" xml:lang="zh-CN"> 
                <voice name="{voice_name}"> 
                    <mstts:express-as style="{style}"  styledegree="2.0" role="default" > 
                        <prosody rate="{rate}" pitch="{pitch}" volume="{volume}">{escaped_text}</prosody> 
                    </mstts:express-as> 
                    {slien_str}
                </voice> 
            </speak>"""

def get_audio_chunk(text, voice_name, rate, pitch, volume, style, output_format='audio-24khz-48kbitrate-mono-mp3', max_retries=3):
    retry_delay = 0.5
    
    for attempt in range(max_retries + 1):
        try:
            endpoint_data = get_endpoint()
            url = f"https://{endpoint_data['r']}.tts.speech.microsoft.com/cognitiveservices/v1"
            
            # Handle delay marker [123]
            m = re.search(r'\[(\d+)\]\s*?$', text)
            slien = 0
            if m:
                slien = int(m.group(1))
                text = text.replace(m.group(0), '')
            
            if not text.strip():
                raise ValueError("Text chunk is empty")
            
            if len(text) > 2000:
                raise ValueError(f"Text chunk too long: {len(text)} chars")
                
            headers = {
                "Authorization": endpoint_data['t'],
                "Content-Type": "application/ssml+xml",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
                "X-Microsoft-OutputFormat": output_format
            }
            
            ssml = get_ssml(text, voice_name, rate, pitch, volume, style, slien)
            response = requests.post(url, headers=headers, data=ssml.encode('utf-8'))
            
            if not response.ok:
                if response.status_code == 429:
                    if attempt < max_retries:
                        time.sleep(retry_delay * (attempt + 1))
                        continue
                    raise Exception("Rate limited")
                elif response.status_code >= 500:
                    if attempt < max_retries:
                        time.sleep(retry_delay * (attempt + 1))
                        continue
                    raise Exception(f"Server error: {response.status_code}")
                else:
                    raise Exception(f"Client error: {response.status_code} {response.text}")
            
            return response.content
            
        except Exception as e:
            if attempt == max_retries:
                raise e
            if "network" in str(e).lower() or "connection" in str(e).lower():
                time.sleep(retry_delay * (attempt + 1))
                continue
            raise e

def optimized_text_split(text, max_chunk_size=1500):
    chunks = []
    # Split by delimiters but keep them
    parts = re.split(r'([。！？\n])', text)
    
    # Reconstruct sentences with delimiters
    sentences = []
    current_sentence = ""
    for part in parts:
        if re.match(r'[。！？\n]', part):
            current_sentence += part
            sentences.append(current_sentence)
            current_sentence = ""
        else:
            if current_sentence:
                sentences.append(current_sentence)
            current_sentence = part
    if current_sentence:
        sentences.append(current_sentence)
        
    current_chunk = ''
    
    for sentence in sentences:
        trimmed_sentence = sentence.strip()
        if not trimmed_sentence:
            continue
            
        if len(trimmed_sentence) > max_chunk_size:
            if current_chunk:
                chunks.append(current_chunk.strip())
                current_chunk = ''
            
            for i in range(0, len(trimmed_sentence), max_chunk_size):
                chunks.append(trimmed_sentence[i:i + max_chunk_size])
        elif len(current_chunk) + len(trimmed_sentence) > max_chunk_size:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = trimmed_sentence
        else:
            current_chunk += trimmed_sentence
            
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
        
    return chunks
