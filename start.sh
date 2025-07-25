#!/bin/bash

# BiliSing 启动脚本

echo "正在启动 BiliSing 卡拉OK点歌系统..."

# 获取脚本所在目录
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

# 检查虚拟环境是否存在
if [ ! -d ".venv" ]; then
    echo "创建虚拟环境..."
    python3 -m venv .venv
fi

# 激活虚拟环境
echo "激活虚拟环境..."
source .venv/bin/activate

# 安装依赖
echo "安装依赖包..."
pip install -r requirements.txt

# 启动应用
echo "正在启动应用..."
echo "应用将在 http://localhost:5000 运行"
echo "按 Ctrl+C 停止应用"
echo ""
python app.py
