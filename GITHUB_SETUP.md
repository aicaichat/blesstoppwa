# GitHub 仓库设置指导

## 方式一：在GitHub网站上创建仓库（推荐）

### 1. 登录GitHub
访问 https://github.com 并登录您的账户

### 2. 创建新仓库
- 点击右上角的 "+" 号
- 选择 "New repository"
- 仓库名称：`bless-top-pwa` 或 `bless-top`
- 描述：`BlessTop PWA - 无畏布施佛教PWA应用`
- 选择 "Public" 或 "Private"
- **不要**勾选 "Initialize this repository with a README"
- 点击 "Create repository"

### 3. 获取仓库URL
创建后，GitHub会显示仓库URL，类似：
```
https://github.com/your-username/bless-top-pwa.git
```

### 4. 配置远程仓库
在终端中运行：
```bash
git remote add origin https://github.com/your-username/bless-top-pwa.git
git branch -M main
git push -u origin main
```

## 方式二：使用GitHub CLI（如果已安装）

### 1. 安装GitHub CLI
```bash
brew install gh
```

### 2. 登录GitHub
```bash
gh auth login
```

### 3. 创建仓库并推送
```bash
gh repo create bless-top-pwa --public --description "BlessTop PWA - 无畏布施佛教PWA应用"
git remote add origin https://github.com/$(gh api user --jq .login)/bless-top-pwa.git
git branch -M main
git push -u origin main
```

## 方式三：如果您已有GitHub仓库

只需要告诉我您的仓库URL，我会帮您配置：
```bash
git remote add origin YOUR_REPO_URL
git branch -M main
git push -u origin main
```

## 推荐的仓库配置

### 仓库名称建议：
- `bless-top-pwa`
- `bless-top`
- `blessed-giving-pwa`

### 仓库描述：
```
BlessTop PWA - 无畏布施佛教PWA应用，提供祝福视频、呼吸练习、效果评估等功能
```

### 标签建议：
- `pwa`
- `react`
- `buddhism`
- `meditation`
- `vite`
- `tailwindcss`

## 下一步
创建仓库后，请告诉我您的仓库URL，我会立即帮您完成推送配置！ 