# BlessTop PWA 部署指南

## 🚀 自动部署（推荐）

### 1. 准备工作
```bash
# 给部署脚本执行权限
chmod +x deploy.sh

# 确保可以SSH到服务器
ssh-copy-id your-username@your-server-ip
```

### 2. 执行部署
```bash
# 基本用法
./deploy.sh 服务器IP 用户名 域名

# 示例
./deploy.sh 192.168.1.100 root bless.yourdomain.com
```

---

## 📋 手动部署

### 1. 服务器环境准备

#### 更新系统
```bash
sudo apt update && sudo apt upgrade -y
```

#### 安装nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 安装Node.js（用于构建）
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. 构建应用

在本地项目目录中：
```bash
# 安装依赖
npm install

# 构建生产版本
npm run build
```

### 3. 上传文件

#### 方法1：使用scp
```bash
# 创建目标目录
ssh user@server "sudo mkdir -p /var/www/bless-top-pwa"

# 上传构建文件
scp -r dist/* user@server:/var/www/bless-top-pwa/
```

#### 方法2：使用rsync
```bash
rsync -avz dist/ user@server:/var/www/bless-top-pwa/
```

### 4. 配置nginx

#### 复制配置文件
```bash
# 上传nginx配置
scp nginx.conf user@server:/etc/nginx/sites-available/bless-top-pwa

# 启用站点
ssh user@server "sudo ln -sf /etc/nginx/sites-available/bless-top-pwa /etc/nginx/sites-enabled/"

# 删除默认站点（如果需要）
ssh user@server "sudo rm -f /etc/nginx/sites-enabled/default"
```

#### 修改配置文件
```bash
ssh user@server "sudo nano /etc/nginx/sites-available/bless-top-pwa"
```

修改以下内容：
- `server_name` 改为你的域名
- 如果有SSL证书，取消注释SSL相关配置

#### 测试并重载nginx
```bash
ssh user@server "sudo nginx -t && sudo systemctl reload nginx"
```

### 5. 设置权限
```bash
ssh user@server "sudo chown -R www-data:www-data /var/www/bless-top-pwa"
ssh user@server "sudo chmod -R 755 /var/www/bless-top-pwa"
```

---

## 🔒 SSL/HTTPS 配置

### 使用Let's Encrypt（推荐）
```bash
# 安装certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取SSL证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo systemctl enable certbot.timer
```

### 手动配置SSL
修改nginx配置文件，取消注释SSL相关行：
```nginx
listen 443 ssl;
ssl_certificate /path/to/your/certificate.crt;
ssl_certificate_key /path/to/your/private.key;
```

---

## 🗂️ 目录结构

部署后的服务器目录结构：
```
/var/www/bless-top-pwa/
├── index.html
├── manifest.webmanifest
├── sw.js
├── registerSW.js
├── workbox-*.js
├── assets/
│   ├── *.css
│   └── *.js
└── public/
    ├── icon-192x192.png
    └── icon-512x512.png
```

---

## 🔧 常见问题解决

### 1. 404错误
检查nginx配置中的`try_files`指令：
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 2. Service Worker不工作
确保`sw.js`没有被缓存：
```nginx
location /sw.js {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### 3. API跨域问题
在nginx配置中添加CORS头：
```nginx
add_header Access-Control-Allow-Origin "*";
add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
```

### 4. 视频播放问题
确保视频文件可以访问：
```bash
curl -I https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/676.mp4
```

---

## 📊 监控与维护

### 查看日志
```bash
# nginx访问日志
tail -f /var/log/nginx/bless-top-pwa.access.log

# nginx错误日志
tail -f /var/log/nginx/bless-top-pwa.error.log

# 系统日志
journalctl -u nginx -f
```

### 性能监控
```bash
# 检查nginx状态
systemctl status nginx

# 检查端口监听
netstat -tlnp | grep :80
netstat -tlnp | grep :443

# 检查内存使用
free -h

# 检查磁盘使用
df -h
```

### 更新部署
```bash
# 重新构建并部署
npm run build
./deploy.sh 服务器IP 用户名 域名
```

---

## 🔐 安全建议

1. **使用非root用户**
2. **配置防火墙**
3. **定期更新系统**
4. **使用SSL证书**
5. **限制文件权限**
6. **监控访问日志**

---

## 📞 支持

如果遇到问题，请检查：
1. 网络连接
2. 域名解析
3. 服务器防火墙设置
4. nginx配置语法
5. 文件权限设置

常用诊断命令：
```bash
# 测试网站可访问性
curl -I http://your-domain.com

# 验证nginx配置
nginx -t

# 检查端口开放
nmap -p 80,443 your-server-ip
``` 