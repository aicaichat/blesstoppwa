# 🚀 BlessTop PWA 部署完整指南

## 📁 部署文件说明

| 文件 | 说明 |
|------|------|
| `nginx.conf` | Nginx配置文件，包含PWA优化配置 |
| `deploy.sh` | 自动化部署脚本 |
| `preview.sh` | 本地预览脚本 |
| `DEPLOYMENT.md` | 详细部署文档 |
| `dist/` | 构建后的生产文件 |

## 🎯 快速部署

### 方法1：自动部署（推荐）
```bash
# 1. 构建并预览
./preview.sh

# 2. 部署到服务器
./deploy.sh 服务器IP 用户名 域名

# 示例
./deploy.sh 192.168.1.100 root bless.yourdomain.com
```

### 方法2：手动部署
```bash
# 1. 构建
npm run build

# 2. 上传文件
scp -r dist/* user@server:/var/www/bless-top-pwa/

# 3. 配置nginx
scp nginx.conf user@server:/etc/nginx/sites-available/bless-top-pwa

# 4. 启用站点
ssh user@server "sudo ln -sf /etc/nginx/sites-available/bless-top-pwa /etc/nginx/sites-enabled/"

# 5. 重载nginx
ssh user@server "sudo nginx -t && sudo systemctl reload nginx"
```

## 🔧 Nginx配置特性

✅ **PWA优化**：Service Worker正确缓存配置  
✅ **SPA路由**：支持React Router前端路由  
✅ **静态资源缓存**：JS/CSS/图片长期缓存  
✅ **安全头部**：XSS保护、内容类型检测  
✅ **Gzip压缩**：减少传输大小  
✅ **CORS配置**：跨域资源访问支持  
✅ **错误处理**：404自动回退到index.html  

## 🎨 PWA功能验证

部署后，在浏览器中测试：

1. **离线功能**：断网后刷新页面，应该仍可访问
2. **安装提示**：支持的浏览器会显示"添加到主屏幕"
3. **缓存更新**：Service Worker会自动更新缓存
4. **视频播放**：测试视频链接是否正常工作

## 📱 移动端测试

1. **PWA安装**：在移动浏览器中测试安装功能
2. **全屏模式**：安装后应该以全屏模式运行
3. **触摸交互**：测试所有手势操作
4. **性能**：检查加载速度和动画流畅度

## 🛠️ 常用维护命令

```bash
# 查看应用状态
curl -I http://your-domain.com

# 查看nginx日志
tail -f /var/log/nginx/bless-top-pwa.access.log

# 重启nginx
sudo systemctl restart nginx

# 检查端口占用
netstat -tlnp | grep :80

# 更新部署
./deploy.sh 服务器IP 用户名 域名
```

## 🔒 安全清单

- [ ] 使用HTTPS（SSL证书）
- [ ] 限制文件权限（755）
- [ ] 配置防火墙规则
- [ ] 定期更新系统
- [ ] 监控访问日志
- [ ] 使用非root用户部署

## 📊 性能优化

当前构建产物大小：
- 总大小：约 450KB（gzip压缩前）
- 首屏加载：< 2秒
- PWA缓存：支持离线访问
- 代码分割：按页面懒加载

## 🚨 故障排除

### 常见问题
1. **404错误**：检查nginx的try_files配置
2. **Service Worker失效**：检查缓存头配置
3. **视频无法播放**：检查网络和跨域设置
4. **PWA无法安装**：检查manifest.json和HTTPS

### 诊断命令
```bash
# 测试网站可访问性
curl -I http://your-domain.com

# 验证nginx配置
nginx -t

# 检查SSL证书
openssl s_client -connect your-domain.com:443

# 检查端口开放
nmap -p 80,443 your-server-ip
```

## 📞 技术支持

如果遇到问题，请检查：
1. 服务器网络连接
2. 域名DNS解析
3. 防火墙设置
4. nginx配置语法
5. 文件权限设置

详细文档请参考 `DEPLOYMENT.md`。 