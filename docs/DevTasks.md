# 🗂️ Dev Task List – BlessTop PWA (Frontend)

> 每条任务配套可直接投喂 ChatGPT 的 Prompt。先复制 **系统提示**，再复制对应“生成代码 Prompt”。

| ID | Module | Story / Task | Est. SP | Prompt |
|----|--------|--------------|---------|--------|
| T1 | Init   | 初始化 Vite + React18 + Tailwind + SW 脚手架 | 3 | ```txt
Generate a Vite + React 18 template named "bless-top-pwa" with Tailwind and Workbox registration. Include npm scripts: dev, build, preview. ``` |
| T2 | Routing| 配置 React-Router v6 基础路由 (/, /blessing, /blessing/eval, /blessing/gift, /bracelet) | 2 | ```txt
Create routes per PRD using React-Router v6 inside src/App.jsx. Provide lazy-loaded pages placeholders with h1 headings.``` |
| T3 | Global  | 注入 Google Fonts & Tailwind primary color (#F6AD55) | 1 | ```txt
Extend tailwind.config.js: add primary color #F6AD55 and glass shadow. Import Nunito + Ma Shan Zheng in index.html, set default font family.``` |
| T4 | Hook    | 实现 useBraceletProfile(chipId) + MSW 单测 | 3 | ```txt
Write hook useBraceletProfile as described in Prompt section 2️⃣, plus Jest + msw test file.``` |
| T5 | Video   | <BlessingVideo theme language> 组件 + long-press skip | 5 | ```txt
Implement component per Prompt 3️⃣. Include BreathCircle sub-component cycles=2, bpm=7 with SVG animation.``` |
| T6 | Eval    | Effect evaluation page含有效/无效按钮 & DonationSlider | 3 | ```txt
Build EvalPage per Prompt 4️⃣. DonationSlider range 0-108, return selected amount via callback.``` |
| T7 | Slider  | DonationSlider 组件整合 Stripe & mock WeChat JS-SDK | 5 | ```txt
Create DonationSlider component; on submit call fake stripeCheckout() promise; fallbacks to ¥0 opt-in if cancelled.``` |
| T8 | Gift    | Gift canvas生成 util + /blessing/gift 页面 | 4 | ```txt
Implement createGiftCanvas util (theme,vow,relayId) returning GIF<1MB. Build GiftPage preview + copy link buttons.``` |
| T9 | Relay   | 深链参数解析 + POST /relay/join hook | 2 | ```txt
Create useRelayJoin(relayId, uid) hook that POSTs join and returns {ok}. Auto-join on Gift link open.``` |
| T10| 3D      | BraceletPage with three.js LOD + Chip banner | 5 | ```txt
Build BraceletPage per Prompt 6️⃣. Use drei OrbitControls; load LOD0 then LOD1. Show meritPoints animation.``` |
| T11| SW      | Workbox precache & runtime, offline fallback | 3 | ```txt
Generate workbox-config as in Prompt 7️⃣. Add donation BackgroundSyncQueue.``` |
| T12| Analytics| track util 集成 Umami | 1 | ```txt
Implement track(event,props) util and add to main pages (open_pwa, video_done …).``` |
| T13| A11y    | A11yProvider：reduce-motion, color-blind toggle | 2 | ```txt
Create context provider reading prefers-reduced-motion; add toggle button for high-contrast.``` |
| T14| Build   | GitHub Action CI + Lighthouse budget gate | 2 | ```txt
Set up GitHub Actions workflow: npm ci, npm run build, lighthouse-ci with LCP<1800ms assertion.``` |

_Last update: 2024-07-09_ 