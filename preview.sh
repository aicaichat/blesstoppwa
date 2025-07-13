#!/bin/bash

# 本地预览脚本
# 用于在部署前测试构建结果

echo "🔨 构建生产版本..."
npm run build

echo "🌐 启动本地预览服务器..."
echo "预览地址: http://localhost:4173"
echo "按 Ctrl+C 停止服务"

npm run preview 