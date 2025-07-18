# Mirror页面VRM模型加载指南

## 概述

本指南说明如何在mirror页面中成功加载和使用VRM模型。

## 配置步骤

### 1. 更新DivineAvatar组件调用

在mirror页面中，DivineAvatar组件需要添加`useVRM={true}`属性：

```svelte
<DivineAvatar 
    bind:this={avatarComponent}
    {divineType}
    {emotion}
    {isSpeaking}
    autoRotate={true}
    showControls={showControls}
    useVRM={true}  <!-- 启用VRM模式 -->
/>
```

### 2. VRM文件配置

VRM文件路径在`divineConfig`中配置：

```javascript
const divineConfig = {
    guanyin: {
        vrmUrl: '/god.vrm', // VRM模型路径
        // ... 其他配置
    }
};
```

### 3. 服务器路由

确保VRM文件可以通过服务器路由访问：

```javascript
// src/routes/god.vrm/+server.js
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
    try {
        const filePath = join(process.cwd(), 'public', 'god.vrm');
        const fileBuffer = await readFile(filePath);
        
        return new Response(fileBuffer, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Length': fileBuffer.length.toString(),
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=31536000'
            }
        });
    } catch (error) {
        console.error('Error serving VRM file:', error);
        return new Response('VRM file not found', { status: 404 });
    }
}
```

## 功能特性

### 1. VRM模型加载

- 自动加载`/god.vrm`文件
- 支持模型缩放、位置和旋转配置
- 启用阴影和动画

### 2. 表情系统

支持多种情绪表情：

```javascript
const expressions = {
    gentle: 'happy',
    wise: 'neutral', 
    ethereal: 'awe',
    serious: 'serious'
};
```

### 3. 动画系统

支持多种动画：

```javascript
const animations = {
    idle: 'idle',
    speaking: 'speaking',
    blessing: 'blessing',
    meditation: 'meditation'
};
```

## 测试方法

### 1. 访问测试页面

访问 `http://localhost:5173/mirror-test` 进行VRM模型测试。

### 2. 控制台日志

打开浏览器控制台查看详细日志：

- VRM加载状态
- 错误信息
- 动画播放状态

### 3. 功能测试

- ✅ VRM文件访问测试
- ✅ 模型加载测试
- ✅ 表情切换测试
- ✅ 动画播放测试

## 故障排除

### 1. VRM文件404错误

**问题**: `GET http://localhost:5173/god.vrm 404 (Not Found)`

**解决方案**: 
- 确保VRM文件存在于`public/god.vrm`
- 检查服务器路由是否正确配置

### 2. CORS错误

**问题**: 外部资源访问被阻止

**解决方案**: 
- 使用图片代理API: `/api/image?url=...`
- 确保所有API都设置了正确的CORS头

### 3. VRM加载失败

**问题**: VRM模型无法加载

**解决方案**:
- 检查VRM文件格式是否正确
- 确保`@pixiv/three-vrm`依赖已安装
- 查看控制台错误信息

## 文件结构

```
bless-top-pwa/
├── src/routes/
│   ├── mirror/+page.svelte           # Mirror主页面
│   ├── mirror-test/+page.svelte      # Mirror测试页面
│   └── god.vrm/+server.js            # VRM文件服务器
├── src/lib/
│   ├── components/DivineAvatar.svelte # 3D头像组件
│   └── utils/vrmLoader.ts            # VRM加载器
├── public/
│   └── god.vrm                       # VRM模型文件
└── MIRROR_VRM_GUIDE.md              # 本文档
```

## 使用示例

### 基本使用

```svelte
<script>
    import DivineAvatar from '$lib/components/DivineAvatar.svelte';
    
    let divineType = 'guanyin';
    let emotion = 'gentle';
    let isSpeaking = false;
    let useVRM = true;
</script>

<DivineAvatar 
    {divineType}
    {emotion}
    {isSpeaking}
    {useVRM}
    autoRotate={true}
    showControls={true}
/>
```

### 动态切换

```svelte
<script>
    function switchToVRM() {
        useVRM = true;
    }
    
    function switchToImage() {
        useVRM = false;
    }
</script>

<button on:click={switchToVRM}>启用VRM</button>
<button on:click={switchToImage}>使用图像</button>
```

## 性能优化

### 1. 文件大小

- VRM文件较大(26MB)，建议进行优化
- 考虑使用压缩的VRM格式
- 实现渐进式加载

### 2. 缓存策略

- VRM文件设置了长期缓存(1年)
- 图片代理缓存1小时
- 使用浏览器缓存减少重复下载

### 3. 错误处理

- VRM加载失败时自动回退到图像模式
- 提供用户友好的错误提示
- 记录详细错误日志

## 总结

现在mirror页面已经成功配置为加载VRM模型：

✅ **VRM文件访问**: 通过`/god.vrm`路由正常提供  
✅ **组件配置**: DivineAvatar组件支持`useVRM`属性  
✅ **错误处理**: 加载失败时自动回退到图像模式  
✅ **测试页面**: 提供完整的测试功能  

访问 `http://localhost:5173/mirror` 即可体验VRM模型加载功能！ 