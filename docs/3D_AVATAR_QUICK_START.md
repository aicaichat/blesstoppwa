# 🚀 3D神仙人物快速使用指南

> 5分钟上手3D神仙人物系统

## 📋 目录
- [快速开始](#快速开始)
- [基础使用](#基础使用)
- [高级功能](#高级功能)
- [常见问题](#常见问题)

---

## 🚀 快速开始

### 1. 访问演示页面
```
http://localhost:5175/avatar-demo
```

### 2. 基础操作
1. **选择神仙类型**：点击"观音菩萨"、"佛陀"或"神仙"
2. **选择情绪**：点击"温柔"、"智慧"、"空灵"或"庄严"
3. **播放动画**：点击"待机"、"说话"、"祝福"或"冥想"
4. **体验语音**：点击"播放演示"听神仙说话

### 3. 在代码中使用

```svelte
<script>
    import DivineAvatar from '$lib/components/DivineAvatar.svelte';
    
    let divineType = 'guanyin';
    let emotion = 'gentle';
    let isSpeaking = false;
</script>

<DivineAvatar 
    {divineType}
    {emotion}
    {isSpeaking}
    autoRotate={true}
    showControls={false}
/>
```

---

## 🎯 基础使用

### 神仙类型配置

```javascript
const divineConfig = {
    guanyin: {
        modelUrl: '/models/guanyin.vrm',
        scale: 1.0,
        position: { x: 0, y: -1, z: 0 },
        animations: {
            idle: 'idle',
            speaking: 'speaking',
            blessing: 'blessing',
            meditation: 'meditation'
        }
    },
    buddha: {
        modelUrl: '/models/buddha.vrm',
        scale: 1.2,
        position: { x: 0, y: -1.2, z: 0 },
        animations: {
            idle: 'idle',
            speaking: 'speaking',
            blessing: 'blessing',
            meditation: 'meditation'
        }
    },
    immortal: {
        modelUrl: '/models/immortal.vrm',
        scale: 0.9,
        position: { x: 0, y: -0.8, z: 0 },
        animations: {
            idle: 'idle',
            speaking: 'speaking',
            blessing: 'blessing',
            meditation: 'meditation'
        }
    }
};
```

### 情绪表情配置

```javascript
const emotionMorphs = {
    gentle: { A: 0.3, I: 0.2, U: 0.1, E: 0.2, O: 0.2 },
    wise: { A: 0.1, I: 0.4, U: 0.3, E: 0.1, O: 0.1 },
    ethereal: { A: 0.2, I: 0.1, U: 0.2, E: 0.3, O: 0.2 },
    serious: { A: 0.1, I: 0.5, U: 0.2, E: 0.1, O: 0.1 }
};
```

### 组件属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `divineType` | string | 'guanyin' | 神仙类型：guanyin/buddha/immortal |
| `emotion` | string | 'gentle' | 情绪：gentle/wise/ethereal/serious |
| `isSpeaking` | boolean | false | 是否正在说话 |
| `autoRotate` | boolean | true | 是否自动旋转 |
| `showControls` | boolean | false | 是否显示控制按钮 |

---

## 🎬 高级功能

### 1. 动画控制

```javascript
// 播放特定动画
avatarComponent.playAnimation('blessing');

// 停止当前动画
avatarComponent.playAnimation('idle');

// 循环播放动画
function playLoopAnimation(animationName, duration = 5000) {
    avatarComponent.playAnimation(animationName);
    setTimeout(() => {
        avatarComponent.playAnimation('idle');
    }, duration);
}
```

### 2. 语音与动画同步

```javascript
async function speakWithAnimation(text, animation = 'speaking') {
    // 开始动画
    avatarComponent.playAnimation(animation);
    isSpeaking = true;
    
    // 播放语音
    await speakUnified(text, divineType);
    
    // 结束动画
    isSpeaking = false;
    avatarComponent.playAnimation('idle');
}
```

### 3. 情绪切换

```javascript
function updateAvatarEmotion(newEmotion) {
    emotion = newEmotion;
}

// 根据对话内容自动调整表情
function autoUpdateEmotion(text) {
    if (text.includes('慈悲') || text.includes('关怀')) {
        emotion = 'gentle';
    } else if (text.includes('智慧') || text.includes('开示')) {
        emotion = 'wise';
    } else if (text.includes('神仙') || text.includes('超然')) {
        emotion = 'ethereal';
    } else if (text.includes('功德') || text.includes('庄严')) {
        emotion = 'serious';
    }
}
```

### 4. 在页面中使用

```svelte
<!-- 在 /mirror 页面中使用 -->
<script>
    import DivineAvatar from '$lib/components/DivineAvatar.svelte';
    import { speakUnified } from '$lib/utils/unifiedTTS.js';
    
    let avatarComponent;
    let divineType = 'guanyin';
    let emotion = 'gentle';
    let isSpeaking = false;
    
    async function handleUserMessage(message) {
        // 开始说话
        isSpeaking = true;
        emotion = 'gentle';
        
        // 播放说话动画
        if (avatarComponent) {
            avatarComponent.playAnimation('speaking');
        }
        
        // 生成AI回复
        const response = await generateAIResponse(message);
        
        // 播放语音
        await speakUnified(response.text, divineType);
        
        // 更新表情
        emotion = response.emotion || 'gentle';
        
        // 停止说话
        isSpeaking = false;
        
        // 回到待机
        if (avatarComponent) {
            avatarComponent.playAnimation('idle');
        }
    }
</script>

<div class="mirror-page">
    <div class="avatar-section">
        <DivineAvatar 
            bind:this={avatarComponent}
            {divineType}
            {emotion}
            {isSpeaking}
            autoRotate={true}
            showControls={false}
        />
    </div>
    
    <div class="conversation-section">
        <!-- 对话界面 -->
    </div>
</div>
```

---

## 🔧 常见问题

### Q1: 模型加载失败怎么办？
**A**: 系统会自动使用占位符模型，无需真实VRM文件即可体验。

### Q2: 如何添加新的神仙类型？
**A**: 在 `divineConfig` 中添加新配置，并在占位符系统中创建对应的几何体。

### Q3: 如何自定义动画？
**A**: 修改 `avatarPlaceholder.js` 中的动画创建函数，或添加新的VRM动画文件。

### Q4: 性能优化建议？
**A**: 
- 使用模型缓存
- 降低移动端模型质量
- 优化动画帧率
- 使用LOD（细节层次）

### Q5: 如何集成到现有页面？
**A**: 
1. 导入 `DivineAvatar` 组件
2. 设置必要的属性
3. 绑定组件引用
4. 调用动画和语音方法

---

## 📱 移动端优化

```javascript
// 响应式设计
function setupResponsiveAvatar() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // 降低模型质量
        avatar.scale.setScalar(0.8);
        
        // 简化动画
        useSimpleAnimations();
        
        // 优化光照
        optimizeLighting();
    }
}
```

---

## 🎯 最佳实践

1. **性能优先**：使用占位符系统进行开发测试
2. **用户体验**：平滑的动画过渡和情绪切换
3. **错误处理**：优雅的降级和错误提示
4. **响应式设计**：适配各种设备尺寸
5. **可访问性**：提供键盘和屏幕阅读器支持

---

*最后更新：2025-01-17*
*版本：v1.0* 