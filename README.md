# BlessTop PWA - 无畏布施

Buddhist fearless giving PWA for anxiety relief

## ✅ 完成的任务 (Completed Tasks)

### T1: 初始化 Vite + React18 + Tailwind + SW 脚手架 ✅
- ✅ Vite + React 18 配置
- ✅ Tailwind CSS 集成
- ✅ PWA 配置 (vite-plugin-pwa)
- ✅ Service Worker 自动注册
- ✅ 基础构建脚本

### T2: 配置 React-Router v6 基础路由 ✅
- ✅ 路由配置 (/, /blessing, /blessing/eval, /blessing/gift, /bracelet)
- ✅ 懒加载页面组件
- ✅ 加载状态组件

### T3: 注入 Google Fonts & Tailwind primary color ✅
- ✅ Google Fonts (Nunito + Ma Shan Zheng)
- ✅ 主色调 #F6AD55 配置
- ✅ 玻璃态效果样式
- ✅ 中文字体类

### T4: 实现 useBraceletProfile(chipId) + MSW 单测 ✅
- ✅ Hook 实现 (API 获取 + setMood 更新)
- ✅ Jest + MSW 测试配置
- ✅ 完整测试覆盖

### T5: <BlessingVideo theme language> 组件 + long-press skip ✅
- ✅ HLS 视频播放支持
- ✅ 长按 400ms 跳过功能
- ✅ BreathCircle 呼吸练习组件
- ✅ 个性化主题/语言支持

### T6: Effect evaluation page含有效/无效按钮 & DonationSlider ✅
- ✅ 效果评估页面
- ✅ 重试机制 (最多3次)
- ✅ DonationSlider 组件 (¥0-108)
- ✅ 模拟 Stripe 支付集成

## 🚧 待完成任务 (TODO)

### T7: Slider 组件整合 Stripe & mock WeChat JS-SDK
- ⏳ 真实 Stripe 集成
- ⏳ 微信支付 JS-SDK 集成

### T8: Gift canvas生成 util + /blessing/gift 页面
- ⏳ createGiftCanvas 工具函数
- ⏳ GIF 生成 (<1MB)
- ⏳ 深链参数解析

### T9: 深链参数解析 + POST /relay/join hook
- ⏳ useRelayJoin hook
- ⏳ 病毒式传播机制

### T10: BraceletPage with three.js LOD + Chip banner
- ⏳ Three.js 3D 模型加载
- ⏳ LOD (Level of Detail) 优化
- ⏳ 功德积分动画

### T11: Workbox precache & runtime, offline fallback
- ⏳ 高级缓存策略
- ⏳ 离线回退页面
- ⏳ 后台同步队列

### T12: Analytics track util 集成 Umami
- ⏳ 埋点工具函数
- ⏳ Umami 集成

### T13: A11y Provider：reduce-motion, color-blind toggle
- ⏳ 无障碍功能
- ⏳ 动画减少选项
- ⏳ 色盲友好模式

### T14: GitHub Action CI + Lighthouse budget gate
- ⏳ CI/CD 配置
- ⏳ 性能预算检查

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm test
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── BlessingVideo.jsx
│   ├── BreathCircle.jsx
│   ├── DonationSlider.jsx
│   └── ...
├── hooks/              # 自定义 Hooks
│   └── useBraceletProfile.js
├── pages/              # 页面组件
│   ├── IntroPage.jsx
│   ├── BlessingPage.jsx
│   ├── EvalPage.jsx
│   ├── GiftPage.jsx
│   └── BraceletPage.jsx
├── App.jsx             # 主应用组件
├── main.jsx            # 入口文件
└── index.css           # 全局样式
```

## 🎯 性能目标

- LCP ≤ 1.8s (slow-3G)
- Bundle ≤ 180kB gzipped
- 离线可用
- PWA 安装支持

## 📝 开发说明

项目使用 DevTasks.md 中定义的任务进行开发，每个任务都有对应的 ChatGPT Prompt 可以直接使用。

当前版本已完成基础框架和核心功能，可以运行和测试基本的用户流程。 