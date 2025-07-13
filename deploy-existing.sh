#!/bin/bash

# PWA应用部署脚本 - 适用于现有WordPress+nginx环境
# 使用方法: ./deploy-existing.sh [服务器IP] [用户名]

set -e  # 遇到错误时退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量
SERVER_IP=${1:-"your-server-ip"}
USERNAME=${2:-"root"}
REMOTE_PATH="/var/www/bless-top-pwa"
NGINX_CONFIG_PATH="/etc/nginx/conf.d/bless.top.conf"

echo -e "${GREEN}开始部署 BlessTop PWA 到现有环境...${NC}"

# 检查参数
if [ "$SERVER_IP" = "your-server-ip" ]; then
    echo -e "${RED}错误: 请提供服务器IP地址${NC}"
    echo "使用方法: ./deploy-existing.sh [服务器IP] [用户名]"
    exit 1
fi

# 1. 构建生产版本
echo -e "${YELLOW}1. 构建生产版本...${NC}"
npm run build

# 2. 创建部署目录结构
echo -e "${YELLOW}2. 准备部署文件...${NC}"
mkdir -p deploy-temp
cp -r dist/* deploy-temp/

# 3. 上传文件到服务器
echo -e "${YELLOW}3. 上传文件到服务器...${NC}"

# 创建远程目录
ssh $USERNAME@$SERVER_IP "mkdir -p $REMOTE_PATH"

# 上传网站文件
echo "上传PWA应用文件..."
scp -r deploy-temp/* $USERNAME@$SERVER_IP:$REMOTE_PATH/

# 4. 备份并更新nginx配置
echo -e "${YELLOW}4. 更新nginx配置...${NC}"
ssh $USERNAME@$SERVER_IP << 'EOF'
    NGINX_CONFIG="/etc/nginx/conf.d/bless.top.conf"
    
    # 备份原有配置
    cp $NGINX_CONFIG $NGINX_CONFIG.backup.$(date +%Y%m%d_%H%M%S)
    
    # 检查是否已经有PWA配置
    if grep -q "location /pwa/" $NGINX_CONFIG; then
        echo "PWA配置已存在，跳过添加"
    else
        echo "添加PWA配置到nginx..."
        
        # 在 location / { 之前插入PWA配置
        PWA_CONFIG='
    # PWA应用路径 - 访问 https://bless.top/pwa/
    location /pwa/ {
        alias /var/www/bless-top-pwa/;
        try_files $uri $uri/ /pwa/index.html;
        
        # PWA Manifest
        location ~ /pwa/manifest\.webmanifest$ {
            add_header Content-Type application/manifest+json;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Service Worker - 不缓存
        location ~ /pwa/sw\.js$ {
            add_header Content-Type application/javascript;
            expires 0;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
        }
        
        # 注册Service Worker - 不缓存
        location ~ /pwa/registerSW\.js$ {
            add_header Content-Type application/javascript;
            expires 0;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
        
        # Workbox文件 - 长期缓存
        location ~ /pwa/workbox-.*\.js$ {
            add_header Content-Type application/javascript;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # 静态资源缓存
        location ~ /pwa/.*\.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # HTML文件不缓存
        location ~ /pwa/.*\.html$ {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
        }
    }
    
    # 确保访问 /pwa（无尾斜杠）时重定向到 /pwa/
    location = /pwa {
        return 301 /pwa/;
    }
'
        
        # 创建临时文件
        awk -v pwa="$PWA_CONFIG" '/location \/ \{/ {print pwa} {print}' $NGINX_CONFIG > $NGINX_CONFIG.tmp
        mv $NGINX_CONFIG.tmp $NGINX_CONFIG
    fi
    
    # 测试nginx配置
    nginx -t
    
    # 重载nginx
    systemctl reload nginx
    
    echo "nginx配置完成"
EOF

# 5. 设置文件权限
echo -e "${YELLOW}5. 设置文件权限...${NC}"
ssh $USERNAME@$SERVER_IP << EOF
    chown -R www-data:www-data $REMOTE_PATH
    chmod -R 755 $REMOTE_PATH
    echo "文件权限设置完成"
EOF

# 6. 清理临时文件
echo -e "${YELLOW}6. 清理临时文件...${NC}"
rm -rf deploy-temp

# 7. 验证部署
echo -e "${YELLOW}7. 验证部署...${NC}"
HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" https://bless.top/pwa/ || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ 部署成功！${NC}"
    echo -e "${GREEN}PWA地址: https://bless.top/pwa/${NC}"
    echo -e "${GREEN}WordPress继续正常运行: https://bless.top/${NC}"
else
    echo -e "${RED}❌ 部署可能存在问题，HTTP状态码: $HTTP_STATUS${NC}"
    echo "请检查nginx配置和文件权限"
fi

echo -e "${GREEN}部署完成！${NC}"
echo ""
echo "访问地址："
echo "  PWA应用: https://bless.top/pwa/"
echo "  WordPress: https://bless.top/"
echo "  现有功能: https://bless.top/bjt/"
echo ""
echo "常用命令："
echo "  查看nginx配置: cat /etc/nginx/conf.d/bless.top.conf"
echo "  重新加载nginx: systemctl reload nginx"
echo "  查看PWA日志: tail -f /var/log/nginx/access.log | grep '/pwa/'" 