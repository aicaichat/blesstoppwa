# VRM模型集成指南

## 概述

本项目已成功集成VRM（Virtual Reality Model）技术，支持加载和显示3D神仙模型。VRM是一种用于虚拟现实和增强现实的3D模型格式，特别适合用于虚拟角色。

## 文件结构

```
bless-top-pwa/
├── public/
│   └── god.vrm          # VRM模型文件 (26MB)
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   └── DivineAvatar.svelte    # 神仙头像组件
│   │   └── utils/
│   │       └── vrmLoader.ts           # VRM加载器工具
│   └── routes/
│       ├── vrm-demo/
│       │   └── +page.svelte           # VRM演示页面
│       └── test-vrm/
│           └── +page.svelte           # VRM测试页面
```

## 功能特性

### 1. VRM模型加载
- 支持加载 `.vrm` 格式的3D模型
- 自动处理模型缩放、位置和旋转
- 启用阴影和动画效果

### 2. 表情系统
- 支持多种情绪表情：温和、智慧、空灵、严肃
- 实时表情切换
- 基于VRM morph targets的表情控制

### 3. 动画系统
- 支持待机、说话、祝福、冥想等动画
- 动画混合和过渡
- 说话状态检测

### 4. 双模式支持
- **VRM模式**：加载真实的3D模型
- **图像模式**：使用图像纹理创建3D效果
- 自动回退机制

## 使用方法

### 1. 基本使用

```svelte
<script>
  import DivineAvatar from '$lib/components/DivineAvatar.svelte';
</script>

<DivineAvatar 
  divineType="guanyin"
  emotion="gentle"
  isSpeaking={false}
  useVRM={true}
  showControls={true}
  autoRotate={true}
/>
```

### 2. 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `divineType` | string | 'guanyin' | 神仙类型：guanyin, buddha, immortal |
| `emotion` | string | 'gentle' | 情绪：gentle, wise, ethereal, serious |
| `isSpeaking` | boolean | false | 是否正在说话 |
| `useVRM` | boolean | false | 是否使用VRM模型 |
| `showControls` | boolean | false | 是否显示控制面板 |
| `autoRotate` | boolean | true | 是否自动旋转 |

### 3. 添加新的VRM模型

1. 将VRM文件放置在 `public/` 目录中
2. 在 `DivineAvatar.svelte` 中更新配置：

```javascript
const divineConfig = {
  yourType: {
    imageUrl: 'your-image-url',
    vrmUrl: '/your-model.vrm',  // 新的VRM文件路径
    name: '你的神仙',
    scale: 1.0,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  }
};
```

## 技术实现

### VRM加载器 (`vrmLoader.ts`)

```typescript
import { VRMLoader } from '$lib/utils/vrmLoader.ts';

// 加载VRM模型
const vrm = await vrmLoader.loadVRM('/god.vrm');

// 配置模型
vrmLoader.configureVRM(vrm, {
  scale: 1.0,
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  enableShadows: true,
  enableAnimations: true
});

// 设置表情
vrmLoader.setVRMEmotion(vrm, 'gentle');

// 播放动画
vrmLoader.playVRMAnimation(vrm, 'idle');
```

### 组件集成

`DivineAvatar.svelte` 组件支持两种模式：

1. **VRM模式** (`useVRM={true}`)：
   - 加载真实的3D模型
   - 支持VRM表情和动画
   - 更好的视觉效果

2. **图像模式** (`useVRM={false}`)：
   - 使用图像纹理创建3D效果
   - 更轻量级
   - 兼容性更好

## 测试页面

### 1. VRM演示页面
访问 `/vrm-demo` 查看完整的VRM功能演示，包括：
- 神仙类型切换
- 情绪表情控制
- 动画播放
- 模式切换

### 2. VRM测试页面
访问 `/test-vrm` 进行基本的VRM模型测试。

## 依赖项

```json
{
  "dependencies": {
    "@pixiv/three-vrm": "^3.4.2",
    "three": "^0.178.0"
  }
}
```

## 故障排除

### 1. 模型加载失败
- 检查VRM文件路径是否正确
- 确认文件格式是否为有效的VRM格式
- 查看浏览器控制台的错误信息

### 2. 性能问题
- 考虑压缩VRM文件大小
- 使用LOD（细节层次）技术
- 优化纹理分辨率

### 3. 兼容性问题
- 确保浏览器支持WebGL
- 检查Three.js版本兼容性
- 验证@pixiv/three-vrm版本

## 开发建议

### 1. 模型优化
- 使用适当的模型复杂度
- 优化纹理大小和格式
- 考虑使用压缩的VRM格式

### 2. 性能监控
- 监控帧率（FPS）
- 检查内存使用情况
- 优化渲染管线

### 3. 用户体验
- 添加加载进度指示器
- 提供模型加载失败的回退方案
- 优化移动设备性能

## 示例代码

### 完整的VRM集成示例

```svelte
<script>
  import DivineAvatar from '$lib/components/DivineAvatar.svelte';
  
  let divineType = 'guanyin';
  let emotion = 'gentle';
  let isSpeaking = false;
  let useVRM = true;
</script>

<div class="avatar-container">
  <DivineAvatar 
    {divineType}
    {emotion}
    {isSpeaking}
    {useVRM}
    showControls={true}
    autoRotate={true}
  />
</div>

<div class="controls">
  <button on:click={() => emotion = 'gentle'}>温和</button>
  <button on:click={() => emotion = 'wise'}>智慧</button>
  <button on:click={() => isSpeaking = !isSpeaking}>
    {isSpeaking ? '停止说话' : '开始说话'}
  </button>
</div>
```

## 更新日志

- **v1.0.0**: 初始VRM集成
  - 支持基本的VRM模型加载
  - 实现表情和动画系统
  - 添加双模式支持

## 许可证

本项目使用MIT许可证。VRM模型的使用请遵守相应的许可证要求。 