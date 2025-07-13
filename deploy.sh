#!/bin/bash

# BWA应用部署脚本
# 使用方法: ./deploy.sh [服务器IP] [用户名] [域名]

set -e  # 遇到错误时退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量
SERVER_IP=${1:-"your-server-ip"}
USERNAME=${2:-"root"}
DOMAIN=${3:-"your-domain.com"}
REMOTE_PATH="/var/www/bless-top-pwa"
NGINX_CONFIG_PATH="/etc/nginx/sites-available/bless-top-pwa"
NGINX_ENABLED_PATH="/etc/nginx/sites-enabled/bless-top-pwa"

echo -e "${GREEN}开始部署 BlessTop PWA...${NC}"

# 检查参数
if [ "$SERVER_IP" = "your-server-ip" ]; then
    echo -e "${RED}错误: 请提供服务器IP地址${NC}"
    echo "使用方法: ./deploy.sh [服务器IP] [用户名] [域名]"
    exit 1
fi

# 1. 构建生产版本
echo -e "${YELLOW}1. 构建生产版本...${NC}"
npm run build

# 2. 创建部署目录结构
echo -e "${YELLOW}2. 准备部署文件...${NC}"
mkdir -p deploy-temp
cp -r dist/* deploy-temp/
cp nginx.conf deploy-temp/

# 3. 修改nginx配置文件中的域名
echo -e "${YELLOW}3. 配置nginx...${NC}"
sed -i.bak "s/your-domain.com/$DOMAIN/g" deploy-temp/nginx.conf

# 4. 上传文件到服务器
echo -e "${YELLOW}4. 上传文件到服务器...${NC}"

# 创建远程目录
ssh $USERNAME@$SERVER_IP "mkdir -p $REMOTE_PATH"

# 上传网站文件
echo "上传网站文件..."
scp -r deploy-temp/* $USERNAME@$SERVER_IP:$REMOTE_PATH/

# 5. 配置nginx
echo -e "${YELLOW}5. 配置nginx服务器...${NC}"
ssh $USERNAME@$SERVER_IP << EOF
    # 备份原有nginx配置
    if [ -f $NGINX_CONFIG_PATH ]; then
        cp $NGINX_CONFIG_PATH $NGINX_CONFIG_PATH.backup.\$(date +%Y%m%d_%H%M%S)
    fi
    
    # 复制新配置
    cp $REMOTE_PATH/nginx.conf $NGINX_CONFIG_PATH
    
    # 启用站点
    ln -sf $NGINX_CONFIG_PATH $NGINX_ENABLED_PATH
    
    # 测试nginx配置
    nginx -t
    
    # 重载nginx
    systemctl reload nginx
    
    # 删除临时nginx配置文件
    rm -f $REMOTE_PATH/nginx.conf
    
    echo "nginx配置完成"
EOF

# 6. 设置文件权限
echo -e "${YELLOW}6. 设置文件权限...${NC}"
ssh $USERNAME@$SERVER_IP << EOF
    chown -R www-data:www-data $REMOTE_PATH
    chmod -R 755 $REMOTE_PATH
    echo "文件权限设置完成"
EOF

# 7. 清理临时文件
echo -e "${YELLOW}7. 清理临时文件...${NC}"
rm -rf deploy-temp

# 8. 验证部署
echo -e "${YELLOW}8. 验证部署...${NC}"
HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" http://$DOMAIN || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ 部署成功！${NC}"
    echo -e "${GREEN}网站地址: http://$DOMAIN${NC}"
    echo -e "${GREEN}PWA manifest: http://$DOMAIN/manifest.webmanifest${NC}"
else
    echo -e "${RED}❌ 部署可能存在问题，HTTP状态码: $HTTP_STATUS${NC}"
    echo "请检查："
    echo "1. 域名DNS解析是否正确"
    echo "2. 服务器防火墙设置"
    echo "3. nginx配置是否正确"
fi

echo -e "${GREEN}部署完成！${NC}"
echo ""
echo "后续步骤："
echo "1. 配置SSL证书（推荐使用Let's Encrypt）"
echo "2. 测试PWA功能"
echo "3. 监控应用性能"
echo ""
echo "常用命令："
echo "  查看nginx状态: systemctl status nginx"
echo "  重新加载nginx: systemctl reload nginx"
echo "  查看nginx日志: tail -f /var/log/nginx/bless-top-pwa.access.log" 