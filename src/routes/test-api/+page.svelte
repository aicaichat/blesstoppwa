<script>
	import { onMount } from 'svelte';

	let loading = false;
	let data = null;
	let error = null;
	let selectedApi = 'cert';
	let customId = '12345678';

	// API 测试选项
	const apiOptions = [
		{ value: 'cert', label: '证书验证 API', endpoint: id => `/api/cert/${id}` },
		{ value: 'external', label: '外部手串 API', endpoint: id => `https://bless.top/wp-json/bracelet-info/v1/bracelet/${id}` }
	];

	async function testAPI() {
		loading = true;
		error = null;
		data = null;

		try {
			const selectedOption = apiOptions.find(opt => opt.value === selectedApi);
			const endpoint = selectedOption.endpoint(customId);

			console.log('Testing API:', endpoint);

			const response = await fetch(endpoint, {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			});
			
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			data = await response.json();
			console.log('API Response:', data);
		} catch (err) {
			error = err.message;
			console.error('API Error:', err);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		console.log('API Test Page loaded');
	});
</script>

<svelte:head>
	<title>API 测试 - BlessTop PWA</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white">
	<div class="container mx-auto px-4 py-8 max-w-4xl">
		<h1 class="text-3xl font-bold mb-8 text-center">
			🔗 API 通讯测试
		</h1>

		<!-- API 选择和配置 -->
		<div class="bg-gray-800 rounded-lg p-6 mb-6">
			<h2 class="text-xl font-semibold mb-4">选择 API 类型</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				{#each apiOptions as option}
					<label class="flex items-center space-x-3 p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors">
						<input 
							type="radio" 
							bind:group={selectedApi} 
							value={option.value}
							class="text-orange-500"
						/>
						<span>{option.label}</span>
					</label>
				{/each}
			</div>

			<div class="mb-4">
				<label for="api-id-input" class="block text-sm font-medium mb-2">
					{selectedApi === 'cert' ? '证书 ID' : '手串 ID'}
				</label>
				<input 
					id="api-id-input"
					bind:value={customId}
					placeholder="输入 ID (如: 12345678)"
					class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
				/>
			</div>

			<button 
				on:click={testAPI}
				disabled={loading || !customId.trim()}
				class="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				{#if loading}
					<span class="flex items-center justify-center">
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						测试中...
					</span>
				{:else}
					🚀 开始 API 测试
				{/if}
			</button>
		</div>

		<!-- 结果显示 -->
		{#if error}
			<div class="bg-red-900 border border-red-700 rounded-lg p-6 mb-6">
				<h3 class="text-red-400 font-semibold mb-2 flex items-center">
					❌ 请求失败
				</h3>
				<p class="text-red-300 mb-4">{error}</p>
				<details class="text-sm">
					<summary class="cursor-pointer text-red-400 hover:text-red-300">
						调试信息
					</summary>
					<div class="mt-2 text-red-200">
						<p><strong>API 类型:</strong> {selectedApi}</p>
						<p><strong>请求 ID:</strong> {customId}</p>
						<p><strong>时间:</strong> {new Date().toLocaleString()}</p>
					</div>
				</details>
			</div>
		{/if}

		{#if data}
			<div class="bg-green-900 border border-green-700 rounded-lg p-6 mb-6">
				<h3 class="text-green-400 font-semibold mb-4 flex items-center">
					✅ API 响应成功
				</h3>
				
				<!-- 格式化显示数据 -->
				{#if selectedApi === 'cert'}
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<span class="text-green-300 font-medium">证书 ID:</span>
							<span class="text-white">{data.id || 'N/A'}</span>
						</div>
						<div>
							<span class="text-green-300 font-medium">哈希值:</span>
							<span class="text-white font-mono text-sm">{data.hash || 'N/A'}</span>
						</div>
						<div>
							<span class="text-green-300 font-medium">签名:</span>
							<span class="text-white">{data.sign || 'N/A'}</span>
						</div>
						<div>
							<span class="text-green-300 font-medium">寺院:</span>
							<span class="text-white">{data.templeName || 'N/A'}</span>
						</div>
						<div>
							<span class="text-green-300 font-medium">材质:</span>
							<span class="text-white">{data.material || 'N/A'}</span>
						</div>
						<div>
							<span class="text-green-300 font-medium">珠数:</span>
							<span class="text-white">{data.beadCount || 'N/A'}</span>
						</div>
					</div>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<span class="text-green-300 font-medium">所有者:</span>
							<span class="text-white">{data.owner || 'N/A'}</span>
						</div>
						<div>
							<span class="text-green-300 font-medium">芯片 ID:</span>
							<span class="text-white">{data.chipId || 'N/A'}</span>
						</div>
						<div>
							<span class="text-green-300 font-medium">材质:</span>
							<span class="text-white">{data.material || 'N/A'}</span>
						</div>
						<div>
							<span class="text-green-300 font-medium">功德点:</span>
							<span class="text-white">{data.meritPoints || 0}</span>
						</div>
					</div>
				{/if}

				<!-- 原始 JSON 数据 -->
				<details class="mt-4">
					<summary class="cursor-pointer text-green-400 hover:text-green-300 font-medium">
						查看原始 JSON 响应
					</summary>
					<pre class="mt-2 text-xs bg-gray-900 p-4 rounded overflow-auto text-gray-300">{JSON.stringify(data, null, 2)}</pre>
				</details>
			</div>
		{/if}

		<!-- 使用指南 -->
		<div class="bg-gray-800 rounded-lg p-6">
			<h3 class="text-lg font-semibold mb-4">📚 API 使用指南</h3>
			
			<div class="space-y-3 text-sm text-gray-300">
				<div>
					<strong class="text-white">内部 API:</strong> 
					使用 SvelteKit 的 API Routes，路径为 <code class="bg-gray-700 px-1 rounded">/api/cert/&#123;id&#125;</code>
				</div>
				<div>
					<strong class="text-white">外部 API:</strong> 
					直接调用外部服务，支持 CORS 跨域请求
				</div>
				<div>
					<strong class="text-white">错误处理:</strong> 
					包含网络超时、HTTP 状态码、JSON 解析等错误处理
				</div>
				<div>
					<strong class="text-white">开发者工具:</strong> 
					打开浏览器开发者工具的 Network 面板查看详细请求信息
				</div>
			</div>

			<div class="mt-4 p-3 bg-blue-900 rounded">
				<p class="text-blue-200 text-sm">
					💡 <strong>提示:</strong> 在实际应用中，建议使用我们提供的 API 工具函数 
					(<code>src/lib/utils/api.js</code>) 来获得更好的错误处理和重试机制。
				</p>
			</div>
		</div>
	</div>
</div> 