# API 使用示例 - BlessTop PWA

这个文档展示了如何在实际的 Svelte 页面中使用 API 进行通讯。

## 🏃‍♂️ 快速开始

### 1. 启动开发服务器

```bash
cd bless-top-pwa
npm run dev
```

访问：http://localhost:5173

### 2. 测试现有 API

打开浏览器开发者工具，访问以下 URL 测试 API：

```
http://localhost:5173/api/cert/12345678
```

## 📋 实际使用示例

### 示例 1: 在页面中调用内部 API

```svelte
<!-- src/routes/test-api/+page.svelte -->
<script>
	import { onMount } from 'svelte';

	let loading = false;
	let data = null;
	let error = null;

	async function testAPI() {
		loading = true;
		error = null;

		try {
			// 调用内部 API
			const response = await fetch('/api/cert/12345678');
			
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			data = await response.json();
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		testAPI();
	});
</script>

<div class="p-6 max-w-2xl mx-auto">
	<h1 class="text-2xl font-bold mb-4">API 测试页面</h1>

	<button 
		on:click={testAPI}
		disabled={loading}
		class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
	>
		{loading ? '加载中...' : '测试 API'}
	</button>

	{#if error}
		<div class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
			错误: {error}
		</div>
	{/if}

	{#if data}
		<div class="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
			<h3 class="font-bold">API 响应:</h3>
			<pre class="mt-2 text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
		</div>
	{/if}
</div>
```

### 示例 2: 使用外部 API

```svelte
<!-- src/routes/external-api/+page.svelte -->
<script>
	import { onMount } from 'svelte';

	let braceletData = null;
	let loading = false;
	let error = null;

	async function fetchBraceletInfo(braceletId) {
		loading = true;
		error = null;

		try {
			// 直接调用外部 API
			const response = await fetch(`https://bless.top/wp-json/bracelet-info/v1/bracelet/${braceletId}`, {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('网络请求失败');
			}

			braceletData = await response.json();
		} catch (err) {
			error = err.message;
			console.error('API Error:', err);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		// 从 URL 参数获取 braceletId
		const urlParams = new URLSearchParams(window.location.search);
		const braceletId = urlParams.get('braceletId') || 'default';
		fetchBraceletInfo(braceletId);
	});
</script>

<div class="p-6">
	<h1 class="text-xl font-bold mb-4">手串信息</h1>

	{#if loading}
		<div class="text-center py-8">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
			<p class="mt-4 text-gray-600">加载中...</p>
		</div>
	{:else if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
			<strong>错误:</strong> {error}
		</div>
	{:else if braceletData}
		<div class="bg-white rounded-lg shadow-lg p-6">
			<h2 class="text-lg font-semibold mb-4">{braceletData.owner || '默认手串'}</h2>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<span class="font-medium">材质:</span>
					{braceletData.material || '未知'}
				</div>
				<div>
					<span class="font-medium">珠子数:</span>
					{braceletData.beadCount || 108}
				</div>
				<div>
					<span class="font-medium">等级:</span>
					{braceletData.level || '普通'}
				</div>
				<div>
					<span class="font-medium">功德点:</span>
					{braceletData.meritPoints || 0}
				</div>
			</div>
		</div>
	{/if}
</div>
```

### 示例 3: 带错误处理和重试的 API 调用

```svelte
<!-- src/routes/robust-api/+page.svelte -->
<script>
	let status = 'idle'; // idle, loading, success, error
	let data = null;
	let error = null;
	let retryCount = 0;
	const MAX_RETRIES = 3;

	// 带重试的 API 调用
	async function callAPIWithRetry(url, options = {}, maxRetries = MAX_RETRIES) {
		for (let i = 0; i <= maxRetries; i++) {
			try {
				const response = await fetch(url, {
					...options,
					signal: AbortSignal.timeout(10000) // 10秒超时
				});

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}

				return await response.json();
			} catch (err) {
				retryCount = i;
				
				if (i === maxRetries) {
					throw err;
				}

				// 指数退避延迟
				const delay = Math.pow(2, i) * 1000;
				await new Promise(resolve => setTimeout(resolve, delay));
			}
		}
	}

	async function testRobustAPI() {
		status = 'loading';
		error = null;
		retryCount = 0;

		try {
			data = await callAPIWithRetry('/api/cert/87654321');
			status = 'success';
		} catch (err) {
			error = err.message;
			status = 'error';
		}
	}

	// 错误恢复
	function handleRetry() {
		testRobustAPI();
	}
</script>

<div class="p-6 max-w-xl mx-auto">
	<h1 class="text-2xl font-bold mb-6">健壮的 API 调用</h1>

	<button 
		on:click={testRobustAPI}
		disabled={status === 'loading'}
		class="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 mb-4"
	>
		{#if status === 'loading'}
			调用中... (重试次数: {retryCount})
		{:else}
			开始 API 调用
		{/if}
	</button>

	{#if status === 'loading'}
		<div class="text-center">
			<div class="animate-pulse bg-gray-200 h-4 rounded mb-2"></div>
			<div class="animate-pulse bg-gray-200 h-4 rounded w-3/4 mx-auto mb-2"></div>
			<div class="animate-pulse bg-gray-200 h-4 rounded w-1/2 mx-auto"></div>
		</div>
	{:else if status === 'error'}
		<div class="bg-red-50 border border-red-200 rounded-lg p-4">
			<h3 class="text-red-800 font-semibold mb-2">请求失败</h3>
			<p class="text-red-600 text-sm mb-3">{error}</p>
			<p class="text-gray-600 text-xs mb-3">已重试 {retryCount} 次</p>
			<button 
				on:click={handleRetry}
				class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
			>
				重试
			</button>
		</div>
	{:else if status === 'success' && data}
		<div class="bg-green-50 border border-green-200 rounded-lg p-4">
			<h3 class="text-green-800 font-semibold mb-2">请求成功!</h3>
			<div class="text-sm space-y-1">
				<p><span class="font-medium">证书 ID:</span> {data.id}</p>
				<p><span class="font-medium">哈希值:</span> {data.hash}</p>
				<p><span class="font-medium">签名:</span> {data.sign}</p>
				<p><span class="font-medium">寺院:</span> {data.templeName}</p>
			</div>
		</div>
	{/if}
</div>
```

### 示例 4: 流式 API (Server-Sent Events)

```svelte
<!-- src/routes/stream-api/+page.svelte -->
<script>
	import { onMount, onDestroy } from 'svelte';

	let messages = [];
	let inputMessage = '';
	let isStreaming = false;
	let eventSource = null;

	async function sendMessage() {
		if (!inputMessage.trim() || isStreaming) return;

		const userMessage = inputMessage.trim();
		inputMessage = '';
		
		// 添加用户消息
		messages = [...messages, { type: 'user', content: userMessage }];
		
		isStreaming = true;
		let aiResponse = '';

		try {
			// 使用流式 API
			const response = await fetch('/api/gpt-stream', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					messages: [{ role: 'user', content: userMessage }],
					fingerprint: 'test-user-123'
				})
			});

			if (!response.ok) {
				throw new Error('Stream failed');
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			// 添加 AI 响应占位符
			messages = [...messages, { type: 'ai', content: '' }];

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value);
				const lines = chunk.split('\n').filter(line => line.trim());

				for (const line of lines) {
					if (line.startsWith('data: ')) {
						try {
							const data = JSON.parse(line.slice(6));
							
							if (data.type === 'content') {
								aiResponse += data.content;
								// 更新最后一条消息
								messages = messages.map((msg, index) => 
									index === messages.length - 1 
										? { ...msg, content: aiResponse }
										: msg
								);
							} else if (data.type === 'done') {
								isStreaming = false;
								return;
							}
						} catch (e) {
							// 忽略解析错误
						}
					}
				}
			}
		} catch (error) {
			console.error('Stream error:', error);
			messages = [...messages, { type: 'error', content: `错误: ${error.message}` }];
		} finally {
			isStreaming = false;
		}
	}

	onDestroy(() => {
		if (eventSource) {
			eventSource.close();
		}
	});
</script>

<div class="flex flex-col h-screen max-w-2xl mx-auto">
	<div class="bg-gray-100 p-4 border-b">
		<h1 class="text-xl font-bold">流式对话 API 测试</h1>
	</div>

	<div class="flex-1 overflow-y-auto p-4 space-y-4">
		{#each messages as message}
			<div class="flex {message.type === 'user' ? 'justify-end' : 'justify-start'}">
				<div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg {
					message.type === 'user' 
						? 'bg-blue-500 text-white' 
						: message.type === 'error'
						? 'bg-red-100 text-red-800'
						: 'bg-gray-200 text-gray-800'
				}">
					{message.content}
				</div>
			</div>
		{/each}

		{#if isStreaming}
			<div class="flex justify-start">
				<div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
					<div class="flex items-center space-x-1">
						<div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
						<div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
						<div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<form on:submit|preventDefault={sendMessage} class="p-4 border-t">
		<div class="flex space-x-2">
			<input 
				bind:value={inputMessage}
				disabled={isStreaming}
				placeholder="输入消息..."
				class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<button 
				type="submit"
				disabled={isStreaming || !inputMessage.trim()}
				class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
			>
				发送
			</button>
		</div>
	</form>
</div>
```

## 🎯 在现有页面中集成 API

### 修改 sanctify 页面使用 API

```svelte
<!-- src/routes/sanctify/+page.svelte 的修改示例 -->
<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let certificateData = null;
	let loading = false;
	let error = null;

	async function fetchCertificate(id) {
		loading = true;
		error = null;

		try {
			// 使用内部 API 路由
			const response = await fetch(`/api/cert/${id}`);

			if (!response.ok) {
				throw new Error(`验证失败: ${response.statusText}`);
			}

			certificateData = await response.json();
		} catch (err) {
			error = err.message;
			console.error('Certificate fetch failed:', err);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		const nfcId = $page.url.searchParams.get('id');
		if (nfcId) {
			fetchCertificate(nfcId);
		}
	});

	function continueToNext() {
		goto('/awake');
	}
</script>

<!-- UI 部分保持不变，只需要绑定数据 -->
```

## 🔧 API 调试技巧

### 1. 使用浏览器开发者工具

- **Network 面板**: 查看所有 HTTP 请求
- **Console 面板**: 查看 console.log 输出
- **Application 面板**: 查看 localStorage 缓存

### 2. API 响应模拟

```javascript
// 在控制台中测试 API
fetch('/api/cert/12345678')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 3. 网络状况模拟

- 开发者工具 → Network → Throttling
- 选择 "Slow 3G" 测试慢网络
- 选择 "Offline" 测试离线场景

## 📱 移动端测试

### 在手机上测试

1. 确保手机和电脑在同一网络
2. 获取电脑 IP 地址
3. 手机浏览器访问: `http://YOUR_IP:5173`

### NFC 功能测试

```javascript
// 检查 NFC 支持
if ('nfc' in navigator) {
  console.log('NFC supported');
} else {
  console.log('NFC not supported');
}
```

## 🚀 生产环境部署

### 构建项目

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

### 环境变量配置

```bash
# .env.local
VITE_API_BASE_URL=https://your-api-domain.com
VITE_OPENAI_API_KEY=your_openai_key
```

---

*这些示例展示了如何在 SvelteKit PWA 项目中进行各种类型的 API 通讯。您可以根据具体需求选择合适的方式。* 