<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let checks = {
		browser: false,
		favicon: false,
		manifest: false,
		stores: false,
		api: false
	};

	let details = {};

	onMount(async () => {
		if (browser) {
			// 检查浏览器支持
			checks.browser = true;

			// 检查 favicon
			try {
				const faviconResponse = await fetch('/favicon.png');
				checks.favicon = faviconResponse.ok;
				details.favicon = `状态: ${faviconResponse.status}`;
			} catch (e) {
				details.favicon = `错误: ${e.message}`;
			}

			// 检查 manifest
			try {
				const manifestResponse = await fetch('/manifest.json');
				checks.manifest = manifestResponse.ok;
				if (manifestResponse.ok) {
					const manifestData = await manifestResponse.json();
					details.manifest = `名称: ${manifestData.name}`;
				}
			} catch (e) {
				details.manifest = `错误: ${e.message}`;
			}

			// 检查 stores
			try {
				const { userSession } = await import('$lib/stores/appState.js');
				userSession.subscribe(() => {});
				checks.stores = true;
				details.stores = '状态管理正常';
			} catch (e) {
				details.stores = `错误: ${e.message}`;
			}

			// 检查 API
			try {
				const apiResponse = await fetch('/api/cert/12345678');
				checks.api = apiResponse.ok;
				if (apiResponse.ok) {
					const apiData = await apiResponse.json();
					details.api = `证书 ID: ${apiData.id}`;
				}
			} catch (e) {
				details.api = `错误: ${e.message}`;
			}
		}
	});

	function getStatusIcon(check) {
		return checks[check] ? '✅' : '❌';
	}

	function getStatusColor(check) {
		return checks[check] ? 'text-green-400' : 'text-red-400';
	}
</script>

<svelte:head>
	<title>系统状态 - BlessTop PWA</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white">
	<div class="container mx-auto px-4 py-8 max-w-4xl">
		<h1 class="text-3xl font-bold mb-8 text-center">
			🔍 系统状态检查
		</h1>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- 核心功能检查 -->
			<div class="bg-gray-800 rounded-lg p-6">
				<h2 class="text-xl font-semibold mb-4">核心功能</h2>
				
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<span>浏览器支持</span>
						<span class="{getStatusColor('browser')}">
							{getStatusIcon('browser')} {checks.browser ? '正常' : '异常'}
						</span>
					</div>

					<div class="flex items-center justify-between">
						<span>状态管理</span>
						<span class="{getStatusColor('stores')}">
							{getStatusIcon('stores')} {checks.stores ? '正常' : '异常'}
						</span>
					</div>
					{#if details.stores}
						<p class="text-sm text-gray-400 ml-4">{details.stores}</p>
					{/if}

					<div class="flex items-center justify-between">
						<span>API 通讯</span>
						<span class="{getStatusColor('api')}">
							{getStatusIcon('api')} {checks.api ? '正常' : '异常'}
						</span>
					</div>
					{#if details.api}
						<p class="text-sm text-gray-400 ml-4">{details.api}</p>
					{/if}
				</div>
			</div>

			<!-- PWA 功能检查 -->
			<div class="bg-gray-800 rounded-lg p-6">
				<h2 class="text-xl font-semibold mb-4">PWA 功能</h2>
				
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<span>图标文件</span>
						<span class="{getStatusColor('favicon')}">
							{getStatusIcon('favicon')} {checks.favicon ? '正常' : '异常'}
						</span>
					</div>
					{#if details.favicon}
						<p class="text-sm text-gray-400 ml-4">{details.favicon}</p>
					{/if}

					<div class="flex items-center justify-between">
						<span>应用清单</span>
						<span class="{getStatusColor('manifest')}">
							{getStatusIcon('manifest')} {checks.manifest ? '正常' : '异常'}
						</span>
					</div>
					{#if details.manifest}
						<p class="text-sm text-gray-400 ml-4">{details.manifest}</p>
					{/if}

					<div class="flex items-center justify-between">
						<span>离线支持</span>
						<span class="text-yellow-400">
							⚠️ 待实现
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 功能测试链接 -->
		<div class="mt-8 bg-gray-800 rounded-lg p-6">
			<h2 class="text-xl font-semibold mb-4">功能测试</h2>
			
			<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
				<a href="/test-api" class="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg text-center transition-colors">
					🔗 API 测试
				</a>
				
				<a href="/sanctify?id=12345678" class="bg-orange-600 hover:bg-orange-700 px-4 py-3 rounded-lg text-center transition-colors">
					📿 证书验证
				</a>
				
				<a href="/awake" class="bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg text-center transition-colors">
					⏰ 时长选择
				</a>
				
				<a href="/breathe" class="bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-lg text-center transition-colors">
					🫁 呼吸练习
				</a>
				
				<a href="/mirror" class="bg-pink-600 hover:bg-pink-700 px-4 py-3 rounded-lg text-center transition-colors">
					🪞 神仙对话
				</a>
				
				<a href="/share" class="bg-yellow-600 hover:bg-yellow-700 px-4 py-3 rounded-lg text-center transition-colors">
					📤 分享海报
				</a>
			</div>
		</div>

		<!-- 浏览器信息 -->
		{#if browser}
			<div class="mt-8 bg-gray-800 rounded-lg p-6">
				<h2 class="text-xl font-semibold mb-4">浏览器信息</h2>
				
				<div class="text-sm space-y-2">
					<div>
						<span class="text-gray-400">User Agent:</span>
						<span class="break-all">{navigator.userAgent}</span>
					</div>
					<div>
						<span class="text-gray-400">Language:</span>
						<span>{navigator.language}</span>
					</div>
					<div>
						<span class="text-gray-400">Platform:</span>
						<span>{navigator.platform}</span>
					</div>
					<div>
						<span class="text-gray-400">Online:</span>
						<span class="{navigator.onLine ? 'text-green-400' : 'text-red-400'}">
							{navigator.onLine ? '在线' : '离线'}
						</span>
					</div>
				</div>
			</div>
		{/if}

		<!-- 返回首页 -->
		<div class="mt-8 text-center">
			<a href="/" class="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
				🏠 返回首页
			</a>
		</div>
	</div>
</div> 