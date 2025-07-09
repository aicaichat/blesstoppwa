## Prompt Design Rules (开发用 AI Prompt 规范)

1. **角色声明**：每次生成代码时的 System Prompt 固定为：
   ```txt
   You are a senior full-stack engineer. Stack: React 18 + Vite + Tailwind + Workbox. Target LCP ≤ 1.8 s on slow-3G. Reply ONLY with code blocks and concise comments.
   ```

2. **指令格式**：
   - 标题写明模块编号，例如 `1️⃣ 初始化 & 路由骨架`。
   - 正文使用英文指令，条目式，动词开头 (Generate / Create / Build)。
   - 列出期望文件路径、组件名称、依赖库。

3. **输出约束**：
   - 代码优先，少量 `//` 内联注释。
   - 禁止输出解释性文字；如需说明，放在代码块注释顶部。
   - 多文件时使用多段代码块，每段前写 `// filepath` 注释。

4. **性能提示**：任何涉及资源应提醒：
   - Poster ≤ 25 kB WebP
   - GLB LOD0 ≤ 150 kB

5. **安全与隐私**：不得在 Prompt 要求中写明真实密钥；使用 `process.env.*` 占位符。

6. **可测试性**：如生成 Hook 或组件，应同时要求 Jest/React-Testing-Library 或 MSW 测试示例。

---

# AI Prompt Library

本文件收录快速召唤 ChatGPT/Copilot 生成代码、脚本与文档的提示词，覆盖 PWA 各功能模块。请在“系统提示”后粘贴对应片段。

---

## 通用系统提示
```txt
You are a senior full-stack engineer.
Stack: React 18 + Vite + Tailwind + Workbox.
Target LCP ≤ 1.8 s (slow-3G). Reply only with code blocks.
```

## 1️⃣ 初始化 & 路由骨架
```txt
Generate a Vite + React 18 skeleton named "bless-top-pwa".
Create routes:
  /               → Intro
  /blessing       → Main flow container
  /blessing/eval  → Effect evaluation
  /blessing/gift  → Gift page
  /bracelet       → Bracelet 3D page
Integrate React-Router v6, Tailwind, Service-Worker.
```

## 2️⃣ 个性化引擎 Hook
```txt
Write hook useBraceletProfile(chipId) that fetches
GET https://bless.top/wp-json/bracelet-info/v2/{chipId}
returns {theme, language, mood, goalTag, owner, material, meritPoints}
and exposes setMood(). Test with msw.
```

## 3️⃣ 开场 + 布施视频
```txt
Create <BlessingVideo theme language>:
• poster fallback `${theme}/poster.webp`
• HLS stream `${theme}/${language}/index.m3u8`
• long-press 400 ms to skip
• on complete → <BreathCircle cycles=2 bpm=7>
```

## 4️⃣ 效果评估 + 随喜滑块
```txt
Build EvalPage:
✔️ 有效 / 🔄 仍烦躁 buttons.
On ✔️ show DonationSlider 0-108 ¥, integrate Stripe & WeChat stubs.
On 🔄 show confirm: 再来 / 稍后. After 2 fails advise rest.
```

## 5️⃣ 回向礼物 & 分享
```txt
Utility createGiftCanvas({theme,vow,relayId}) -> GIF <1 MB.
/gift page: preview + [Save] [Copy Link].
Deep-link bless.top/hb?r={relay}&u={uid}. POST /relay/join then redirect.
```

## 6️⃣ 手串 3D & 功德
```txt
BraceletPage:
• dynamic import('three').
• Load GLB LOD0(150kb) then swap higher LODs.
• Chip banner ✔️ 已绑定 Chip-{id}.
• GET /donations summary → animate meritPoints.
• Button [认领同款] link to shop SKU.
```

## 7️⃣ Workbox 配置
```txt
Precache shell & assets. Runtime SWR for API, Cache-First for media.
Add BackgroundSyncQueue 'donation-queue'.
```

## 8️⃣ 埋点
```txt
Implement track(event, props) sending to Umami.
Events: open_pwa, video_done, calm_success, calm_fail, donate_amt …
```

---
使用示例：
1. 复制“系统提示”置于 ChatGPT 的 system。  
2. 将模块 prompt 粘至 user，即可获得完整代码片段。 

## 📋 Project Task-Tracking Prompts

### Sprint Breakdown
```txt
Generate a table of user-stories and tasks for BlessTop PWA sprint <SPRINT-NO> (2 weeks). 
Columns: ID, As a…, I want…, Acceptance Criteria, Estimation (SP), Owner(placeholder).
Only include features listed in PRD sections F-1 to F-<RANGE>. Return in GitHub-Markdown table.
```

### Jira JSON Import
```txt
Create Jira import JSON for the following tasks:
<PASTE table from previous prompt>
Use project key BT, map Estimation → storyPoints, Owner → assignee.
Return a single JSON array.
```

### Daily Stand-up Summary
```txt
You are Scrum-bot. Summarise yesterday’s progress, today’s plan, blockers for each team member from the following raw notes:
<PASTE raw notes>
Return Markdown list grouped by member.
```

### Burndown Health Check
```txt
Given this Sprint backlog CSV (ID,SP,status), and today’s date <YYYY-MM-DD>, plot a burndown metrics summary: 
• Ideal vs Actual story points remaining
• % completed, projected end-date.  Return concise Markdown with Mermaid chart.
``` 