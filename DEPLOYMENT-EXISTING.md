# 🚀 现有环境部署指南（WordPress + nginx）

## 📋 部署概述

您的PWA应用将部署为 **子路径方式**，不会影响现有的WordPress网站功能：

- **WordPress主站**：`https://bless.top/`
- **PWA应用**：`https://bless.top/pwa/`
- **现有功能**：`https://bless.top/bjt/`、`https://bless.top/screenshot/`

## 🎯 一键部署

### 快速部署命令
```bash
# 部署到生产服务器
./deploy-existing.sh 服务器IP 用户名

# 示例
./deploy-existing.sh 192.168.1.100 root
```

## 📁 部署文件说明

| 文件 | 用途 |
|------|------|
| `deploy-existing.sh` | 现有环境专用部署脚本 |
| `nginx-location-pwa.conf` | nginx location配置片段 |
| `vite.config.js` | 已配置 `base: '/pwa/'` |

## 🔧 nginx配置变更

脚本会自动在您的 `/etc/nginx/conf.d/bless.top.conf` 中添加：

```nginx
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
    
    # 静态资源缓存
    location ~ /pwa/.*\.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# 确保访问 /pwa（无尾斜杠）时重定向到 /pwa/
location = /pwa {
    return 301 /pwa/;
}
```

## 📂 目录结构

```
/var/www/
├── bless.top/              # WordPress主站
│   ├── wp-content/
│   ├── wp-admin/
│   └── bjt/               # 现有功能
└── bless-top-pwa/         # PWA应用（新增）
    ├── index.html
    ├── manifest.webmanifest
    ├── sw.js
    └── assets/
```

## 🛡️ 安全保障

### 1. 配置备份
- 自动备份现有nginx配置
- 格式：`bless.top.conf.backup.YYYYMMDD_HHMMSS`

### 2. 检测重复配置
- 检查是否已存在PWA配置
- 避免重复添加导致冲突

### 3. 配置验证
- 自动运行 `nginx -t` 验证配置
- 只有验证通过才会重载nginx

## 🔍 验证部署

### 1. 访问测试
```bash
# PWA应用
curl -I https://bless.top/pwa/

# WordPress主站（确保正常）
curl -I https://bless.top/

# 现有功能（确保正常）
curl -I https://bless.top/bjt/
```

### 2. 功能检查
- [ ] PWA应用正常加载
- [ ] Service Worker注册成功
- [ ] PWA安装提示显示
- [ ] WordPress功能正常
- [ ] 现有子路径功能正常

## 🚨 故障排除

### 常见问题

**1. 404错误**
```bash
# 检查文件权限
ls -la /var/www/bless-top-pwa/

# 检查nginx配置
nginx -t
```

**2. PWA功能异常**
```bash
# 检查Service Worker
curl -I https://bless.top/pwa/sw.js

# 检查Manifest
curl -I https://bless.top/pwa/manifest.webmanifest
```

**3. WordPress受影响**
```bash
# 恢复备份配置
cp /etc/nginx/conf.d/bless.top.conf.backup.* /etc/nginx/conf.d/bless.top.conf
systemctl reload nginx
```

### 诊断命令
```bash
# 查看nginx配置
cat /etc/nginx/conf.d/bless.top.conf

# 查看访问日志
tail -f /var/log/nginx/access.log | grep '/pwa/'

# 查看错误日志
tail -f /var/log/nginx/error.log

# 检查进程
ps aux | grep nginx
```

## 🔄 更新部署

```bash
# 1. 本地更新代码
git pull

# 2. 重新部署
./deploy-existing.sh 服务器IP 用户名

# 3. 清除浏览器缓存测试
# Chrome: F12 → Application → Storage → Clear storage
```

## 📊 监控与维护

### 日志监控
```bash
# 实时查看PWA访问
tail -f /var/log/nginx/access.log | grep '/pwa/'

# 查看错误
tail -f /var/log/nginx/error.log
```

### 性能监控
```bash
# 检查磁盘使用
du -sh /var/www/bless-top-pwa/

# 检查内存使用
free -h

# 检查nginx状态
systemctl status nginx
```

## 📞 技术支持

如果遇到问题：

1. **检查配置**：确保nginx配置正确
2. **查看日志**：检查访问和错误日志
3. **验证权限**：确保文件权限正确设置
4. **测试访问**：使用curl验证各个路径

### 回滚方案
```bash
# 删除PWA配置（如需要）
sudo nano /etc/nginx/conf.d/bless.top.conf
# 删除 location /pwa/ 相关配置

# 重载nginx
sudo systemctl reload nginx

# 删除PWA文件
sudo rm -rf /var/www/bless-top-pwa/
```

---

✅ **部署完成后，您将拥有：**
- WordPress网站继续正常运行
- PWA应用在子路径正常访问
- 所有现有功能保持不变
- 完整的SSL证书支持 