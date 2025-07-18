# 神仙朋友 TTS 语音合成使用指南

> 版本：v2.1 | 更新：2025-01-17 | 状态：✅ 已修复中断问题

## 📋 目录
- [概述](#概述)
- [语音类型](#语音类型)
- [使用方法](#使用方法)
- [最佳实践](#最佳实践)
- [故障排除](#故障排除)
- [技术实现](#技术实现)

---

## 🎵 概述

神仙朋友 TTS 系统专为「交个神仙朋友」项目设计，提供古风、禅意、慈悲的语音合成体验。系统支持三种神仙音色，具备智能队列管理和防中断机制。

### ✨ 核心特性
- **三种神仙音色**：观音菩萨、佛陀、神仙
- **智能防中断**：2秒冷却时间，防止重复播放
- **禅意音效**：回音、低频、空灵效果
- **降级方案**：Web Speech API 基础语音
- **离线支持**：完全本地化，无需网络

---

## 🗣️ 语音类型

### 1. 观音菩萨音色 (guanyin)
**特点**：慈悲温柔，体现观音大慈大悲
- 语速：0.7（稍慢）
- 音调：1.1（略高）
- 音量：0.9
- 效果：温和回音
- 适用：开场引导、慈悲关怀

### 2. 佛陀音色 (buddha)
**特点**：智慧沉稳，体现佛陀大智慧
- 语速：0.6（更慢）
- 音调：0.9（较低）
- 音量：0.85
- 效果：深沉低频
- 适用：智慧开示、深度冥想

### 3. 神仙音色 (immortal)
**特点**：飘逸空灵，体现神仙超然
- 语速：0.75
- 音调：1.05
- 音量：0.9
- 效果：空灵高频
- 适用：神仙对话、飘逸引导

---

## 🚀 使用方法

### 基础使用

```javascript
import { speakDivine, stopTTS, resetTTS } from '$lib/utils/tts.js';

// 初始化
const { divineTTS } = await import('$lib/utils/tts.js');
await divineTTS.init();
resetTTS(); // 重置状态

// 播放语音
await speakDivine('阿弥陀佛，施主', 'guanyin', {
    volume: 0.85,
    rate: 0.75
});

// 停止语音
stopTTS();
```

### 高级使用

```javascript
// 语音序列播放
const phrases = [
    '欢迎来到心灵净土',
    '跟随呼吸的节奏',
    '感受金色光芒的护佑'
];

await speakSequence(phrases, 'guanyin', 2000);

// 自定义配置
await speakDivine(text, 'buddha', {
    rate: 0.5,      // 更慢语速
    pitch: 0.8,     // 更低音调
    volume: 0.9     // 更高音量
});
```

---

## ✅ 最佳实践

### 1. 防中断机制
```javascript
// ✅ 正确：使用冷却时间
let lastSpeechTime = 0;
const cooldown = 2000; // 2秒冷却

function playSpeech(text) {
    const now = Date.now();
    if (now - lastSpeechTime < cooldown) {
        return; // 跳过重复请求
    }
    
    speakDivine(text, 'guanyin');
    lastSpeechTime = now;
}
```

### 2. 错误处理
```javascript
try {
    await speakDivine(text, 'guanyin');
} catch (error) {
    console.warn('神仙TTS失败，使用基础语音:', error);
    // 降级到基础语音
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    }
}
```

### 3. 状态管理
```javascript
// 页面加载时初始化
onMount(async () => {
    const { divineTTS } = await import('$lib/utils/tts.js');
    await divineTTS.init();
    resetTTS(); // 重置状态
});

// 页面卸载时清理
onDestroy(() => {
    stopTTS();
});
```

### 4. 文案生成
```javascript
import { generateTimedScripts } from '$lib/utils/divineScripts.js';

const userState = {
    duration: 60,
    calmScore: 75,
    stressLevel: 'medium',
    userType: 'general'
};

const scriptConfig = generateTimedScripts(60, userState);
// 返回：{ type: 'guanyin', phrases: [...] }
```

---

## 🔧 故障排除

### 常见问题

#### 1. TTS 中断错误
**症状**：`SpeechSynthesisErrorEvent { error: 'interrupted' }`

**原因**：
- 多个语音请求同时发起
- 浏览器语音队列被中断
- 页面切换导致语音停止

**解决方案**：
```javascript
// ✅ 已修复：添加防中断机制
- 2秒冷却时间防止重复播放
- 智能队列管理
- 状态跟踪和重置
```

#### 2. 语音不播放
**检查项**：
- 浏览器是否支持 Web Speech API
- 是否有可用的中文语音
- 用户是否允许了语音权限

**调试代码**：
```javascript
// 检查语音支持
console.log('SpeechSynthesis支持:', 'speechSynthesis' in window);
console.log('可用语音:', speechSynthesis.getVoices());

// 检查TTS状态
console.log('TTS状态:', divineTTS.isSpeaking);
console.log('最后播放时间:', divineTTS.lastSpeechTime);
```

#### 3. 语音质量差
**优化方案**：
- 使用高质量语音引擎
- 调整语速和音调参数
- 添加音效处理

### 调试工具

```javascript
// 启用详细日志
divineTTS.debug = true;

// 检查语音配置
console.log('当前语音配置:', divineTTS.divineConfig);

// 测试语音播放
await speakDivine('测试语音', 'guanyin');
```

---

## 🛠️ 技术实现

### 核心架构

```javascript
class DivineTTS {
    constructor() {
        this.isSpeaking = false;           // 播放状态
        this.currentUtterance = null;      // 当前语音对象
        this.lastSpokenText = '';          // 最后播放文本
        this.speechCooldown = 2000;        // 冷却时间
        this.lastSpeechTime = 0;           // 最后播放时间
    }
    
    canSpeak(text) {
        // 检查是否可以播放
        const now = Date.now();
        
        // 冷却时间检查
        if (now - this.lastSpeechTime < this.speechCooldown) {
            return false;
        }
        
        // 播放状态检查
        if (this.isSpeaking) {
            return false;
        }
        
        // 重复文本检查
        if (text === this.lastSpokenText) {
            return false;
        }
        
        return true;
    }
}
```

### 防中断机制

1. **冷却时间**：2秒内不重复播放
2. **状态跟踪**：实时监控播放状态
3. **队列管理**：智能处理多个请求
4. **错误恢复**：自动降级到基础语音

### 音效处理

```javascript
addDivineEffects(utterance, type) {
    switch (type) {
        case 'guanyin':
            // 温和回音效果
            utterance.pitch *= 1.1;
            utterance.rate *= 0.9;
            break;
        case 'buddha':
            // 深沉低频效果
            utterance.pitch *= 0.8;
            utterance.volume *= 1.1;
            break;
        case 'immortal':
            // 空灵高频效果
            utterance.pitch *= 1.15;
            utterance.rate *= 0.9;
            break;
    }
}
```

---

## 📊 性能指标

### 目标指标
- **响应时间**：≤ 500ms
- **成功率**：≥ 95%
- **中断率**：≤ 2%
- **内存占用**：≤ 5MB

### 监控事件
```javascript
// 播放开始
trackEvent('tts_start', { type: 'guanyin', text: '...' });

// 播放完成
trackEvent('tts_complete', { duration: 2000 });

// 播放失败
trackEvent('tts_error', { error: 'interrupted' });
```

---

## 🎯 使用场景

### 1. 呼吸引导 (/breathe)
```javascript
// 定时播放引导文案
const phrases = [
    { time: 0, text: "深呼吸，放下一切焦虑" },
    { time: 8, text: "感受内心的宁静" },
    { time: 15, text: "让平静充满身心" }
];

// 使用冷却机制防止重复
let lastNarrationTime = 0;
const cooldown = 3000;

function updateNarration(elapsed) {
    const phrase = phrases.find(p => elapsed >= p.time);
    if (phrase && Date.now() - lastNarrationTime > cooldown) {
        speakDivine(phrase.text, 'guanyin');
        lastNarrationTime = Date.now();
    }
}
```

### 2. 神仙对话 (/mirror)
```javascript
// 动态语音类型选择
function selectVoiceType(calmScore) {
    if (calmScore >= 80) return 'buddha';
    if (calmScore >= 60) return 'guanyin';
    return 'immortal';
}

// 个性化语音播放
const voiceType = selectVoiceType(userCalmScore);
await speakDivine(response, voiceType);
```

### 3. 功德引导 (/seed)
```javascript
// 慈悲引导语音
const blessingText = `随喜功德，护寺千年。
愿以此功德，庄严佛净土。
上报四重恩，下济三途苦。`;

await speakDivine(blessingText, 'guanyin', {
    rate: 0.6,  // 更慢语速
    volume: 0.9
});
```

---

## 🔄 更新日志

### v2.1 (2025-01-17)
- ✅ **修复中断问题**：添加防中断机制
- ✅ **智能队列管理**：防止重复播放
- ✅ **状态跟踪**：实时监控播放状态
- ✅ **冷却时间**：2秒冷却防止重复
- ✅ **错误恢复**：自动降级到基础语音

### v2.0 (2025-01-16)
- 🎵 **三种神仙音色**：观音、佛陀、神仙
- 🎵 **禅意音效**：回音、低频、空灵效果
- 🎵 **智能文案生成**：基于用户状态
- 🎵 **离线支持**：完全本地化

### v1.0 (2025-01-15)
- 🎵 **基础TTS**：Web Speech API
- 🎵 **中文语音**：支持中文语音合成
- 🎵 **简单配置**：语速、音调、音量

---

## 📞 技术支持

如有问题，请检查：
1. 浏览器控制台错误信息
2. TTS 状态和配置
3. 网络连接和权限设置
4. 语音引擎可用性

**联系方式**：
- 项目仓库：`bless-top-pwa`
- 文档路径：`docs/TTS_GUIDE.md`
- 更新频率：每周检查

---

*最后更新：2025-01-17*
*版本：v2.1* 