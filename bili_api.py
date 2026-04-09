"""
哔哩哔哩 API 服务
1. 搜索建议 (search_suggest)
2. UGC视频搜索 (search_video)
3. b23短链解析 (convert_b23)
4. 视频详情查询 (get_video_info)
5. 链接解析+视频信息 (extract_bilibili_info)
"""

import hashlib
import time
import re
import urllib.parse
from functools import reduce

import requests

# ==================== WBI 签名 ====================

MIXIN_KEY_ENC_TAB = [
    46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35,
    27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13,
]

CHR_FILTER = re.compile(r"[!'\(\)\*]")

# 缓存 mixin_key
_cached_mixin_key: str | None = None
_cached_date: str | None = None


def _get_mixin_key(orig: str) -> str:
    return reduce(lambda s, i: s + orig[i], MIXIN_KEY_ENC_TAB, "")


def _get_filename(url: str) -> str:
    """从 URL 中提取不带扩展名的文件名"""
    name = url.rsplit("/", 1)[-1]
    return name.split(".")[0]


def _fetch_wbi_keys() -> str:
    """从 bilibili API 获取 wbi keys 并计算 mixin_key（无需登录）"""
    resp = requests.get(
        "https://api.bilibili.com/x/web-interface/nav",
        headers=BASE_HEADERS,
    )
    data = resp.json()
    # 未登录时 code=-101，但 data.wbi_img 仍然存在
    wbi_img = data.get("data", {}).get("wbi_img", {})
    img_key = _get_filename(wbi_img["img_url"])
    sub_key = _get_filename(wbi_img["sub_url"])
    return _get_mixin_key(img_key + sub_key)


def get_mixin_key() -> str:
    """获取 mixin_key，每天缓存一次"""
    global _cached_mixin_key, _cached_date
    today = time.strftime("%Y-%m-%d")
    if _cached_date == today and _cached_mixin_key:
        return _cached_mixin_key
    _cached_mixin_key = _fetch_wbi_keys()
    _cached_date = today
    return _cached_mixin_key


def wbi_sign(params: dict) -> dict:
    """对请求参数进行 WBI 签名，添加 wts 和 w_rid"""
    mixin_key = get_mixin_key()
    params["wts"] = int(time.time())
    # 按 key 排序
    sorted_keys = sorted(params.keys())
    query_str = "&".join(
        f"{urllib.parse.quote(k)}={urllib.parse.quote(CHR_FILTER.sub('', str(v)))}"
        for k, v in ((k, params[k]) for k in sorted_keys)
    )
    params["w_rid"] = hashlib.md5((query_str + mixin_key).encode()).hexdigest()
    return params


# ==================== 通用请求 headers ====================

BASE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://www.bilibili.com",
}


# ==================== 1. 搜索建议 ====================

def search_suggest(term: str) -> list[dict]:
    """
    搜索关键词补全建议

    参数:
        term: 搜索关键词

    返回:
        list of { "term": str, "name": str }
    """
    resp = requests.get(
        "https://s.search.bilibili.com/main/suggest",
        params={
            "term": term,
            "main_ver": "v1",
            "highlight": term,
        },
        headers=BASE_HEADERS,
    )
    data = resp.json()
    if data.get("code") != 0:
        return []
    result = data.get("result")
    if not isinstance(result, dict):
        return []
    tags = result.get("tag", [])
    return [{"term": item.get("term", ""), "name": item.get("name", "")} for item in tags]


# ==================== 2. 视频搜索 ====================

def search_video(
    keyword: str,
    page: int = 1,
    order: str | None = None,
    duration: int | None = None,
    tids: int | None = None,
    order_sort: int | None = None,
    pub_begin: int | None = None,
    pub_end: int | None = None,
) -> dict:
    """
    搜索UGC视频

    参数:
        keyword:    搜索关键词
        page:       页码，从1开始
        order:      排序方式 (如 "totalrank", "click", "pubdate", "dm", "stow")
        duration:   时长筛选 (1: <10min, 2: 10-30min, 3: 30-60min, 4: >60min)
        tids:       分区筛选 tid
        order_sort: 排序方向 (0: 由高到低, 1: 由低到高)
        pub_begin:  发布时间起始 (Unix时间戳)
        pub_end:    发布时间结束 (Unix时间戳)

    返回:
        {
            "num_results": int,
            "videos": [
                {
                    "aid": int,
                    "bvid": str,
                    "title": str,
                    "description": str,
                    "cover": str,
                    "duration": str,
                    "pubdate": int,
                    "owner": { "mid": ..., "name": ... },
                    "stat": { "view": ..., "danmaku": ..., "like": ... },
                    ...
                },
                ...
            ]
        }
    """
    params: dict = {
        "search_type": "video",
        "keyword": keyword,
        "page": page,
        "page_size": 20,
        "platform": "pc",
        "web_location": 1430654,
    }
    if order:
        params["order"] = order
    if duration is not None:
        params["duration"] = duration
    if tids is not None:
        params["tids"] = tids
    if order_sort is not None:
        params["order_sort"] = order_sort
    if pub_begin is not None:
        params["pubtime_begin_s"] = pub_begin
    if pub_end is not None:
        params["pubtime_end_s"] = pub_end

    params = wbi_sign(params)

    resp = requests.get(
        "https://api.bilibili.com/x/web-interface/wbi/search/type",
        params=params,
        headers={
            **BASE_HEADERS,
            "Origin": "https://search.bilibili.com",
            "Referer": f"https://search.bilibili.com/video?keyword={urllib.parse.quote(keyword)}",
        },
    )
    data = resp.json()
    if data.get("code") != 0:
        return {"error": data.get("message", "请求失败"), "num_results": 0, "videos": []}

    result_data = data.get("data", {})
    num_results = result_data.get("numResults", 0)
    raw_list = result_data.get("result", [])

    videos = []
    for item in raw_list:
        # 清理标题中的 <em> 高亮标签
        raw_title = item.get("title", "")
        clean_title = re.sub(r"</?em[^>]*>", "", raw_title)

        cover = item.get("pic", "")
        if cover.startswith("//"):
            cover = "https:" + cover

        videos.append({
            "aid": item.get("aid"),
            "bvid": item.get("bvid"),
            "title": clean_title,
            "description": item.get("description", ""),
            "cover": cover,
            "duration": item.get("duration", ""),
            "pubdate": item.get("pubdate"),
            "owner": {
                "mid": item.get("mid"),
                "name": item.get("author", ""),
                "face": item.get("upic", ""),
            },
            "stat": {
                "view": item.get("play"),
                "danmaku": item.get("danmaku"),
                "like": item.get("like"),
                "favorites": item.get("favorites"),
            },
            "is_union_video": item.get("is_union_video"),
            "tag": item.get("tag", ""),
        })

    return {"num_results": num_results, "videos": videos}


# ==================== 3. b23短链解析 ====================

def convert_b23(b23_url: str) -> str:
    """
    解析 b23.tv 短链，返回重定向后的完整 URL

    参数:
        b23_url: b23.tv 短链接

    返回:
        重定向后的完整 URL
    """
    try:
        resp = requests.get(
            b23_url,
            allow_redirects=False,
            headers=BASE_HEADERS,
        )
    except requests.RequestException as e:
        raise RuntimeError(f"Request failed: {e}")

    if resp.status_code in [301, 302]:
        location = resp.headers.get("Location")
        if not location:
            raise ValueError("No redirect location found in response.")
        return location

    return b23_url


# ==================== 4. 视频详情查询 ====================

def get_video_info(bvid: str) -> dict | None:
    """
    通过 BV号 获取视频详情

    参数:
        bvid: 视频 BV号

    返回:
        视频详情 dict（API原始 data 字段），失败返回 None
    """
    resp = requests.get(
        "https://api.bilibili.com/x/web-interface/view",
        params={"bvid": bvid},
        headers={
            **BASE_HEADERS,
            "Accept": "application/json, text/plain, */*",
        },
    )
    if resp.status_code != 200:
        return None
    data = resp.json()
    if data.get("code") != 0:
        return None
    return data["data"]


# ==================== 5. 链接解析+视频信息 ====================

def extract_bilibili_info(url: str) -> dict | None:
    """
    从哔哩哔哩链接中提取视频信息（支持 BV 链接和 b23 短链）

    参数:
        url: 哔哩哔哩视频链接

    返回:
        { "title": str, "producer": str, "duration": int, "url": str }
        或 None（无法解析时）
    """
    # 如果是 b23 短链，先解析
    if "b23.tv" in url:
        try:
            url = convert_b23(url)
        except Exception:
            return None

    bv_match = re.search(r'BV[\w]+', url)
    if not bv_match:
        return None

    bv_id = bv_match.group()
    p_match = re.search(r'[?&]p=(\d+)', url)

    video_data = get_video_info(bv_id)
    if not video_data:
        return {
            "title": f"视频标题 {bv_id}",
            "producer": "未知UP主",
            "duration": 0,
            "url": url,
        }

    duration = video_data.get("duration", 0)
    title = video_data.get("title", "")

    try:
        pages = video_data.get("pages", [])
        if p_match:
            p_index = int(p_match.group(1)) - 1
            if 0 <= p_index < len(pages):
                part_name = pages[p_index].get("part", "")
                if part_name and part_name != title:
                    title += f" - {part_name}"
                duration = pages[p_index].get("duration", duration)
        else:
            if pages:
                part_name = pages[0].get("part", "")
                if part_name and part_name != title:
                    title += f" - {part_name}"
                duration = pages[0].get("duration", duration)
    except Exception:
        if not duration:
            duration = 0

    return {
        "title": title,
        "producer": video_data.get("owner", {}).get("name", "未知UP主"),
        "duration": duration,
        "url": f"https://www.bilibili.com/video/{bv_id}",
    }


# ==================== 6. TV端播放直链获取 ====================

APPKEY_TV = "dfca71928277209b"
APPSEC_TV = "b5475a8825547a4fc26c7d518eaaa02e"

USER_AGENT_TV = (
    "Mozilla/5.0 BiliDroid/2.0.1 (bbcallen@gmail.com) "
    "os/android model/android_hd mobi_app/android_hd "
    "build/2001100 channel/master innerVer/2001100 osVer/15 network/2"
)

BASE_HEADERS_TV = {
    "User-Agent": USER_AGENT_TV,
    "env": "prod",
    "app-key": "android64",
    "x-bili-aurora-zone": "sh001",
}


def _app_sign(params: dict) -> dict:
    params = dict(params)
    params["appkey"] = APPKEY_TV
    params["ts"] = str(int(time.time()))
    sorted_items = sorted(params.items(), key=lambda x: x[0])
    parts = []
    for k, v in sorted_items:
        if v is None:
            continue
        parts.append(
            f"{urllib.parse.quote(str(k), safe='')}={urllib.parse.quote(str(v), safe='')}"
        )
    query = "&".join(parts)
    params["sign"] = hashlib.md5((query + APPSEC_TV).encode("utf-8")).hexdigest()
    return params


def parse_bilibili_input(raw: str) -> tuple:
    """
    从各种形式的输入中提取 bvid 和 page

    返回: (bvid, page)  page 从 1 开始
    """
    if "b23.tv" in raw:
        try:
            raw = convert_b23(raw)
        except Exception:
            pass

    raw = raw.strip()

    # 通用提取 BV号 和 p 参数
    bv_match = re.search(r"BV[\w]+", raw, re.IGNORECASE)
    if not bv_match:
        raise ValueError(f"输入中找不到BV号: {raw}")
    
    bvid = bv_match.group()

    p_match = re.search(r"[?&]p=(\d+)", raw)
    page = int(p_match.group(1)) if p_match else 1

    return bvid, page


def tv_playurl(aid: int, cid: int, qn: int = 80, access_key: str = None) -> dict:
    """复刻 PiliPlus VideoHttp.tvPlayUrl"""
    params = {
        "actionKey": "appkey",
        "cid": cid,
        "fourk": 1,
        "is_proj": 1,
        "mobi_app": "android",
        "object_id": aid,
        "platform": "android",
        "playurl_type": 1,
        "protocol": 0,
        "qn": qn,
    }
    if access_key:
        params["access_key"] = access_key
        params["mobile_access_key"] = access_key
    params = _app_sign(params)
    resp = requests.get(
        "https://api.bilibili.com/x/tv/playurl",
        params=params,
        headers=BASE_HEADERS_TV,
    )
    return resp.json()


def get_direct_play_url(url: str, qn: int = 80) -> str | None:
    """
    通过 B站 URL 获取直链播放地址 (音视频合一)
    """
    try:
        bvid, page = parse_bilibili_input(url)
    except ValueError:
        return None

    info = get_video_info(bvid)
    if not info:
        return None
    aid = info["aid"]
    pages = info.get("pages", [])

    if page < 1 or page > len(pages):
        return None
    
    cid = pages[page - 1]["cid"]

    result = tv_playurl(aid=aid, cid=cid, qn=qn)
    if result["code"] != 0:
        # fallback
        for fq in [64, 32, 16]:
            if fq >= qn:
                continue
            result = tv_playurl(aid=aid, cid=cid, qn=fq)
            if result["code"] == 0:
                break
        
        if result["code"] != 0:
            return None

    data = result.get("data") or result.get("result")
    if not data:
        return None
    
    durls = data.get("durl", [])
    if not durls:
        return None
    
    return durls[0].get("url")
