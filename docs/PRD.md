# BlessTop「观音无畏布施 PWA」
## 产品需求文档（PRD v1.5）

> 该文档迁移至新目录 `bless-top-pwa/docs/`，内容保持一致。

---

### 0. 概述
"碰一碰"手串（NFC）即可唤起观音心经。
用户在 2 分钟内完成：
1. 个性化观音心经视频＋静心  
2. 自评体验效果  
3. 推荐意愿滑块（Referral Survey Slider）  
4. 分享或重新体验  
5. 查看/认领实体般若手串  
全过程尊重"可跳过、低压力、弱商业"，并记录功德与传播链路。

### 1. 目标 & KPI
#### 1.1 体验目标
- 30 s 内情绪指数下降 ≥ 20 %（Calm-Rate ≥ 65 %）  
- 推荐意愿得分 ≥ 7 的占比 ≥ 35 %  
- 链接分享率（完成自评→分享）≥ 25 %  
- 手串详情查看率 ≥ 60 %

#### 1.2 业务目标
- 月活推荐次数 ≥ 15 k  
- 累计新增访客（由分享链接）≥ 9 k  
- 般若手串转化率 ≥ 8 %（查看手串→下单或表单提交）

#### 1.3 技术指标
- 首屏 TTI ≤ 3 s（4G网络）
- 离线可用率 100 %（首次加载成功后）
- 页面崩溃率 < 0.3 %
- 首包大小 < 250 KB

### 2. 核心用户 & 场景
- **焦虑的持串用户**：碰手串→求安宁  
- **分享链接访客**：好友推荐→体验布施  
- **潜在购买者**：体验后对手串/功德体系感兴趣  
- **公益/寺院支持者**：随喜布施，回向功德

#### 2.1 用户画像细分

| Persona | 场景 | 痛点 | 关键需求 | KPI监控 |
|---|---|---|---|---|
| Ava 28岁数字游民 | 凌晨1点焦虑 | 孤独、信息过载 | 30秒极速情绪急救 | 急救停留时长 & Calm-Rate |
| Ken 36岁高管 | 商务送礼 | 高端+文化感 | 60秒开光证书 + 可晒 | 证书下载率 & 二次分享 |
| Lin 42岁宝妈 | 亲子陪伴 | 孩子情绪管理 | 90秒亲子冥想 + 功德教育 | 亲子共用时长 & 功德NFT认领率 |

### 3. 用户旅程（3-2-1 交互链路）
1. **NFC/链接唤起**  
2. **观音无畏布施** ≈ 90 s  
   - 开场 10 s  
   - 个性化布施视频 60 s  
   - 呼吸圆 20 s  
3. **效果自评** ≤ 15 s  
   - ✅ 有效→推荐意愿滑块  
   - 🔄 无效→"再来一次"（最多 2 次）  
4. **分享页**：生成海报 / 复制链接 / 查看手串  
5. **手串页面**：360° 3D 预览＋功德值

──────────────────────────────────────────  
《交个神仙朋友》AI-Native 完整版 PRD & 提示词  
版本：PRD-Final-4.1  
定位：一条千年古寺开光的沉香手串 × AI-Native 神仙伴侣  
发布：2025-01-17  
──────────────────────────────────────────  

### 4. 产品愿景  
一句话：把千年古寺香火凝进一条手串，30 秒生成本地 AI 神仙人格，离线终身陪伴。

北极星：  
• 30-90 秒体验后 24 h 主动分享率 ≥ 40 %（明确分享事件：Web Share / DeepLink / 复制链接）  
• 本地八字 → AI 人格匹配准确率 ≥ 93 %  
• 离线可用率 100 %（断网仍可完整体验）

──────────────────────────  
### 5. 功能模块总览

| 模块 | 子功能 | 离线支持 | 技术要点 | 性能要求 |
|---|---|---|---|---|
| M1 硬件接入 | NFC / 二维码 / 验真 | ✅ | NTAG 424 DNA + 链上 NFT | NFC成功率 ≥ 95% |
| M2 八字 AI | 生辰输入 → 32 维指纹 | ✅ | WebGPU 7 MB 模型 | 推理延迟 ≤ 500ms |
| M3 情绪急救 | 30-60-90 s 动态时长 | ✅ | 本地 TTS + 呼吸环 | Calm-Rate ≥ 65% |
| M4 神仙人格 | 3D Avatar + 口型同步 | ✅ | vrm.js + text2emotion | 首字节延迟 ≤ 1.2s |
| M5 实时运势 | 古法 + LLM 融合 | ✅ | GPT-4o 玄学微调 | API失败率 < 2% |
| M6 功德系统 | 随喜 NFT + 链上透明 | ✅ | Polygon zkEVM | 支付成功率 ≥ 95% |
| M7 社交裂变 | 3 s 动图海报 + deep link | ✅ | Canvas + Web Share | 分享转化 ≥ 25% |
| M8 记忆宫殿 | 向量记忆 + 遗忘机制 | ✅ | IndexedDB + 加密封存 | 数据加密率 100% |

──────────────────────────  
### 6. 页面级功能规格

#### 6.1 /sanctify — 扫珠验真  

**工作流：**
1. 进入页面 → 触发 Web NFC
2. 读取 Tag (NDEF ID) 成功 → 调 `GET /api/cert/{id}`
3. 渲染 5 s 静音开光视频（glb ≤ 1 MB）+ 链上证书卡
4. 用户点击「下载 PDF」→ 生成并保存
5. 点击「继续」→ 跳转 /awake

**主要组件：**
- NfcScannerButton（带呼吸圈等待动画）
- SanctifyVideo (autoPlay muted loop playsInline)
- CertCard（哈希 + 僧团签名 + 链上状态）
- PdfDownloadFab (Floating Action Button)
- ErrorModal（读卡失败 / 网络离线）

**状态机：**
idle → scanning → fetched → pdfGenerating → pdfReady → completed
error: nfcDenied | tagNotFound | apiFail | pdfFail

**API & 数据：**
- `GET /api/cert/{id}` → { videoURL, hash, sign, mintedAt }
- `POST /metrics` 事件：`nfc_scan_start/ok/fail`, `pdf_download`
- IndexedDB: 证书缓存 (key=id, ttl=7d) 供离线模式

**监控指标：**
TTI ≤ 1.5 s；NFC 成功率 ≥ 95 %；PDF 成功率 ≥ 98 %

**提示词（前端）**  
```
你是 SvelteKit 前端：  
1. 监听 Web NFC → 调 /api/cert/{id} → 返回 {videoURL,hash,sign}  
2. 5 s <video autoPlay muted loop playsInline/> 占屏 60 %  
3. PDF 生成：html2canvas + jspdf，文件名「古寺开光证书_{hash}.pdf」
4. 添加权限提示与回退 UI
5. 确保 HTTPS & 用户手势触发
```

#### 6.2 /awake — 时长选择  

**工作流：**
1. 首屏先加载沉香烟雾粒子 (≈ 50 个)
2. 显示 3 张卡（30/60/90 s）带浮层动效
3. 用户点击卡片 → 将时长写入 `sessionStorage.duration`
4. 跳转 /breathe

**主要组件：**
- SmokeParticlesCanvas (WebGL/WebGPU fallback)
- DurationCard (prop: seconds) × 3
- AccessibilityToggle (prefers-reduced-motion)

**状态机：**
loading → ready → selected → exit

**API & 数据：**
- 无网络请求；记录 `duration_select_{30|60|90}` 埋点

**监控指标：**
FMP ≤ 1.2 s；卡片点击转化率 ≥ 95 %

**提示词（UI）**  
```
你是 UI 设计师：  
- 主色 #0F0F0F + 金色描边 + 沉香烟雾粒子 < 50 个  
- 30/60/90 卡片悬浮动效，支持 `prefers-reduced-motion`
- 设置锚点默认值，减少决策负荷
- 添加字幕/文字切换选项
```

#### 6.3 /breathe — 情绪急救  

**工作流：**
1. 读取 `duration`；若缺失 → 回 /awake
2. 调本地八字模型 + 心率 API → 生成文案 & 动作
3. 按时长切换 UI：
   - 30 s：静帧 + 8 s 旁白 + 22 s 静音
   - 60 s：15 s 旁白 + 45 s 呼吸环
   - 90 s：25 s 冥想引导 + 65 s 背景视频
4. 结束后自动跳 /mirror

**主要组件：**
- BreatheNarration (WebSpeech / 本地 TTS)
- BreathRing (SVG + easing)
- HeartRateSync (Web BLE optional)
- SkipButton（debug & accessibility）

**状态机：**
init → preparing (loading model/assets) → playing → completed
error: ttsFail | assetFail

**API & 数据：**
- 本地推理：八字模型 wasm/onnx 7 MB
- 可选 `GET /api/heart-rate` 蓝牙同步
- 埋点：`breathe_start`, `breathe_complete`, `early_exit`

**监控指标：**
Calm-Rate 计算成功率 ≥ 90 %；崩溃率 < 0.3 %

**提示词（AI 文案）**  
```
你是玄学文案师：  
输入：八字 + 今日黄历 + 当前心率  
输出 8 字一句 + 关键动作一句，共 20 字以内  
示例：「乙木得令，上午 9-11 点签约最吉」
预设三档脚本模板（急救、放松、冥想）避免风格漂移
```

#### 6.4 /mirror — 神仙对话  

**工作流：**
1. 第一句 AI 主动问候（基于上页 calm-score）
2. 用户语音输入 → Whisper 本地 or Edge API 转文本
3. 将上下文 + 八字指纹 发 GPT-4o（流式 SSE）
4. 文本流到达 → VRM 口型同步 & 情绪表情
5. 用户可继续追问（loop），或点击「继续」→ /seed

**主要组件：**
- AvatarCanvas (vrm.js)
- SpeechInputButton (hold-to-talk)
- ChatBubbleList
- EmotionMeter (解析 JSON.emotion)

**状态机：**
idle → listening → transcribing → streaming → speaking → idle
error: micDenied | transcribeFail | gptFail

**API & 数据：**
- `POST /api/gpt-stream` with {fingerprint, history[]}
- IndexedDB 缓存最近 3 轮对话 (for /share)
- 数据留存 TTL 7天，提供「忘记我」入口

**监控指标：**
首字节延迟 ≤ 1.2 s；用户平均轮次 ≥ 2；GPT 失败率 < 2 %

**提示词（AI 人格）**  
```
你是心音，千年沉香之灵。  
规则：  
1. 永远用第一人称「我」。  
2. 每句 ≤ 20 字，引用《径山寺藏经》一句。  
3. 先共鸣再给解法。  
4. 输出 JSON: {"text":"...","emotion":"温柔","action":"喝温水"}
5. 遵循 GDPR/CCPA 数据保护规则
```

#### 6.5 /seed — 功德随喜  

**工作流：**
1. 显示滑块 0-108¥ 默认 36¥；实时显示「已筹 x %」
2. 用户调整 → 动态更新 NFT 预览 (hash preview.svg)
3. 点击「随喜功德」→ 调支付 (Apple/WeChat/Stripe)
4. 支付成功 → 调 `/api/mint` 铸造 Soulbound NFT
5. 铸造回执 → Toast + 「查看证书」链接 → /sanctify?bid=xxx

**主要组件：**
- DonationSlider (min, max, preset anchors: 12/36/108)
- ProgressBar (总目标 10800¥)
- PaymentModal (多渠道聚合)
- MintStatusToast (pending / success / fail)

**状态机：**
ready → paying → paid → minting → minted
error: payFail | mintFail | timeout

**API & 数据：**
- `GET /api/progress` → {percent}
- `POST /api/pay` → payUrl
- `POST /api/mint` → {txHash,nftUrl}
- Gas 费上限控制，支持批量铸造
- 埋点：`donate_click`, `donate_success`, `mint_success`

**监控指标：**
支付成功率 ≥ 95 %；Mint 平均 < 30 s；Gas 超标报警

**提示词（运营）**  
```
你是古寺运营：  
- 按钮文案「随喜功德，护寺千年」  
- 滑块旁实时显示「已筹 12 %」
- 设置锚点定价策略，减少决策负荷
- 添加离线凭证暂存机制
```

#### 6.6 /share — 福签海报  

**工作流：**
1. 读取上一页对话/功德数据 → 生成海报 Canvas
2. 导出 3 s APNG / WebM 动图 (< 500 KB)
3. 显示预览 + 系统分享按钮 (Web Share API)
4. 用户分享成功 → 写链路 `deepLink?ref=uid`
5. 点击「再体验一次」→ 回 /awake

**主要组件：**
- PosterCanvas (OffscreenCanvas + requestAnimationFrame)
- ShareButton (fallback: CopyLink)
- ReplayButton

**状态机：**
rendering → ready → sharing → shared → replay / exit
error: canvasFail | shareDenied

**API & 数据：**
- 无后端生成；分享埋点：`share_tap`, `share_success`, `copy_link`

**监控指标：**
渲染 ≤ 1.5 s；文件大小均值 < 400 KB；分享转化 ≥ 25 %

**提示词（设计）**  
```
你是设计师：  
- 画布 1080×1920，背景沉香木纹  
- 动图循环 3 s，文件 < 500 KB  
- 含二维码：扫码直达 /sanctify?bid=xxx
- 优化压缩算法，确保视觉质量
```

──────────────────────────  
### 7. 技术栈 & 架构

#### 7.1 前端技术栈
- 框架：SvelteKit-Native（WebGPU first）
- AI：WebGPU + ONNX Runtime Web
- 状态管理：XState
- 3D渲染：vrm.js + three.js
- PWA：Workbox + Service Worker

#### 7.2 后端 & 基础设施
- 部署：Cloudflare Pages + Durable Objects
- 链上：Polygon zkEVM + ERC-5192 Soulbound NFT
- 存储：IndexedDB (离线) + R2 (资产)
- 监控：Sentry + Workers Analytics

#### 7.3 兼容性与降级
- WebGPU 不支持时：WebGL / WASM Fallback
- 整体离线缓存上限：≤ 20 MB
- capability-check：首屏检测，不满足切云端推理

### 8. 安全与合规

#### 8.1 数据保护
- 生辰八字本地加密存储，明文不出端侧
- 数据留存 TTL 7天，提供手动删除
- 遵循 GDPR/CCPA 规定

#### 8.2 权限管理
- Web NFC 需 HTTPS + 用户手势
- 麦克风权限提示与回退
- VRM 头像商业授权确认

#### 8.3 内容合规
- 《径山寺藏经》版权核实
- 宗教内容审核机制
- 功德系统透明化

### 9. 可观测性与监控

#### 9.1 核心指标监控
```json
{
  "performance": {
    "ttfb": "< 800ms",
    "fcp": "< 1.2s", 
    "lcp": "< 2.5s",
    "cls": "< 0.1"
  },
  "business": {
    "nfc_success_rate": ">= 95%",
    "calm_rate": ">= 65%", 
    "share_conversion": ">= 25%",
    "payment_success": ">= 95%"
  },
  "technical": {
    "crash_rate": "< 0.3%",
    "api_error_rate": "< 2%",
    "offline_availability": "100%"
  }
}
```

#### 9.2 埋点事件
- 页面级：page_view, page_exit, ttl
- 交互级：nfc_scan, duration_select, breathe_complete
- 业务级：share_success, donate_success, mint_success

### 10. 开发里程碑

#### 10.1 Sprint 规划（6周）
| Sprint | 交付目标 | 关键里程碑 |
|--------|----------|------------|
| Sprint 0 | 基础架构 | NFC 通路 + PWA Shell |
| Sprint 1 | 核心体验 | 八字模型 + 30s 急救 |
| Sprint 2 | 链上集成 | NFT 合约 + 离线缓存 |
| Sprint 3 | 社交裂变 | 分享海报 + 3D Avatar |
| Sprint 4 | 性能优化 | 离线优化 + 监控接入 |
| Sprint 5 | 合规上线 | 安全审核 + 压测 |

#### 10.2 风险与备份方案
- WebGPU 覆盖率低 → 云端推理 Fallback
- NFT Gas 暴涨 → 延迟上链 + 后补铸造  
- 首包过大 → 分包策略 + Skeleton UI
- API 限流 → 本地缓存 + 降级体验

### 11. 48 小时快速启动

```bash
git clone git@github.com:your-org/shenxian-ai-native
cd shenxian-ai-native
npm i
npm run dev
# 访问 http://localhost:5173
```

**Day 1 关键任务**  
- [x] 八字本地模型编译与WebGPU集成
- [x] 开光 NFT 合约部署到测试网
- [x] NFC 扫描与证书验真流程
- [x] 基础 PWA 离线缓存策略

**Day 2 关键任务**  
- [x] 30/60/90s 离线体验完整跑通
- [x] 神仙对话 AI 人格调试
- [x] 功德系统支付集成测试
- [x] 分享海报生成与优化

### 12. 团队协作规范

#### 12.1 提示词版本管理
- 独立 `/prompts` 目录管理四层提示词
- 语义化版本号：v1.0.0 (major.minor.patch)
- Git hooks 确保提示词与代码同步

#### 12.2 评审机制  
- Design-Dev Review：UI/UX 与技术可行性
- 离线包复测：断网环境完整功能验证
- 安全评审：数据保护与权限管理

完成 ✅

---

_Last update: 2025-01-17_
_Version: PRD-Final-4.1_