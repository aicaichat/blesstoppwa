<script>
	import { onMount } from 'svelte';
	import DivineAvatar from '$lib/components/DivineAvatar.svelte';

	let testResults = {
		vrmFile: false,
		svgFile: false,
		imageProxy: false,
		serverPort: null
	};

	let showAvatar = false;
	let useVRM = false;

	onMount(async () => {
		console.log('🔧 开始调试测试...');
		
		// 检测服务器端口
		testResults.serverPort = window.location.port || '80';
		
		// 测试VRM文件
		try {
			const vrmResponse = await fetch('/god.vrm');
			testResults.vrmFile = vrmResponse.ok;
			console.log('✅ VRM文件测试:', vrmResponse.ok ? '成功' : '失败');
		} catch (error) {
			console.error('❌ VRM文件测试失败:', error);
		}

		// 测试SVG文件
		try {
			const svgResponse = await fetch('/guanyin-avatar.svg');
			testResults.svgFile = svgResponse.ok;
			console.log('✅ SVG文件测试:', svgResponse.ok ? '成功' : '失败');
		} catch (error) {
			console.error('❌ SVG文件测试失败:', error);
		}

		// 测试图片代理
		try {
			const imageResponse = await fetch('/api/image?url=https://example.com/test.jpg');
			testResults.imageProxy = imageResponse.ok;
			console.log('✅ 图片代理测试:', imageResponse.ok ? '成功' : '失败');
		} catch (error) {
			console.error('❌ 图片代理测试失败:', error);
		}

		console.log('📋 测试结果:', testResults);
	});

	function toggleAvatar() {
		showAvatar = !showAvatar;
	}

	function toggleVRM() {
		useVRM = !useVRM;
	}

	function clearCache() {
		if ('caches' in window) {
			caches.keys().then(names => {
				names.forEach(name => {
					caches.delete(name);
				});
			});
		}
		location.reload();
	}
</script>

<svelte:head>
	<title>调试页面</title>
</svelte:head>

<div class="debug-container">
	<h1>🔧 调试页面</h1>
	
	<div class="server-info">
		<h2>📡 服务器信息</h2>
		<div class="info-grid">
			<div class="info-item">
				<strong>当前URL:</strong> {window.location.href}
			</div>
			<div class="info-item">
				<strong>服务器端口:</strong> {testResults.serverPort}
			</div>
			<div class="info-item">
				<strong>协议:</strong> {window.location.protocol}
			</div>
		</div>
	</div>

	<div class="test-results">
		<h2>📋 测试结果</h2>
		<div class="results-grid">
			<div class="result-item {testResults.vrmFile ? 'success' : 'error'}">
				<span class="status">{testResults.vrmFile ? '✅' : '❌'}</span>
				<div class="result-content">
					<strong>VRM文件访问</strong>
					<small>{testResults.vrmFile ? '成功' : '失败'}</small>
				</div>
			</div>
			
			<div class="result-item {testResults.svgFile ? 'success' : 'error'}">
				<span class="status">{testResults.svgFile ? '✅' : '❌'}</span>
				<div class="result-content">
					<strong>SVG文件访问</strong>
					<small>{testResults.svgFile ? '成功' : '失败'}</small>
				</div>
			</div>
			
			<div class="result-item {testResults.imageProxy ? 'success' : 'error'}">
				<span class="status">{testResults.imageProxy ? '✅' : '❌'}</span>
				<div class="result-content">
					<strong>图片代理API</strong>
					<small>{testResults.imageProxy ? '成功' : '失败'}</small>
				</div>
			</div>
		</div>
	</div>

	<div class="avatar-test">
		<h2>🎭 头像测试</h2>
		<div class="controls">
			<button class="control-btn" on:click={toggleAvatar}>
				{showAvatar ? '隐藏' : '显示'} 头像
			</button>
			<button class="control-btn" on:click={toggleVRM}>
				{useVRM ? '使用图像' : '使用VRM'}
			</button>
			<button class="control-btn" on:click={clearCache}>
				清除缓存
			</button>
		</div>
		
		{#if showAvatar}
			<div class="avatar-container">
				<DivineAvatar 
					divineType="guanyin"
					emotion="gentle"
					{useVRM}
					showControls={true}
					autoRotate={true}
				/>
			</div>
		{/if}
	</div>

	<div class="manual-test">
		<h2>🔍 手动测试链接</h2>
		<div class="test-links">
			<a href="/god.vrm" target="_blank" class="test-link">
				🎭 直接访问VRM文件
			</a>
			<a href="/guanyin-avatar.svg" target="_blank" class="test-link">
				🖼️ 直接访问SVG文件
			</a>
			<a href="/api/image?url=https://example.com/test.jpg" target="_blank" class="test-link">
				🖼️ 测试图片代理
			</a>
			<a href="/test-all" class="test-link">
				🧪 全面测试页面
			</a>
		</div>
	</div>

	<div class="console-log">
		<h2>📝 控制台日志</h2>
		<div class="log-container">
			<p>请打开浏览器开发者工具查看详细日志</p>
			<p>快捷键: F12 或 Cmd+Option+I (Mac)</p>
		</div>
	</div>
</div>

<style>
	.debug-container {
		min-height: 100vh;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
		padding: 20px;
		color: #fff;
		font-family: 'Arial', sans-serif;
	}

	h1 {
		text-align: center;
		color: #ffd700;
		margin-bottom: 30px;
		font-size: 2rem;
	}

	h2 {
		color: #ffd700;
		margin-bottom: 15px;
		font-size: 1.5rem;
	}

	.server-info, .test-results, .avatar-test, .manual-test, .console-log {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		padding: 20px;
		margin-bottom: 20px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.info-grid {
		display: grid;
		gap: 10px;
	}

	.info-item {
		padding: 10px;
		background: rgba(255, 215, 0, 0.1);
		border-radius: 8px;
		border-left: 3px solid #ffd700;
	}

	.results-grid {
		display: grid;
		gap: 15px;
	}

	.result-item {
		display: flex;
		align-items: center;
		gap: 15px;
		padding: 15px;
		border-radius: 8px;
		font-weight: 500;
	}

	.result-item.success {
		background: rgba(34, 197, 94, 0.2);
		border: 1px solid rgba(34, 197, 94, 0.5);
	}

	.result-item.error {
		background: rgba(239, 68, 68, 0.2);
		border: 1px solid rgba(239, 68, 68, 0.5);
	}

	.status {
		font-size: 1.5rem;
	}

	.result-content {
		flex: 1;
	}

	.result-content small {
		display: block;
		opacity: 0.7;
		font-size: 0.9rem;
	}

	.controls {
		display: flex;
		gap: 15px;
		margin-bottom: 20px;
		flex-wrap: wrap;
	}

	.control-btn {
		padding: 12px 20px;
		background: rgba(255, 215, 0, 0.2);
		border: 1px solid rgba(255, 215, 0, 0.3);
		border-radius: 8px;
		color: #ffd700;
		cursor: pointer;
		transition: all 0.3s ease;
		font-size: 14px;
		font-weight: 500;
	}

	.control-btn:hover {
		background: rgba(255, 215, 0, 0.3);
		border-color: rgba(255, 215, 0, 0.5);
		transform: translateY(-2px);
	}

	.avatar-container {
		height: 400px;
		border-radius: 12px;
		overflow: hidden;
		background: rgba(0, 0, 0, 0.3);
	}

	.test-links {
		display: grid;
		gap: 10px;
	}

	.test-link {
		display: inline-block;
		padding: 12px 16px;
		background: rgba(255, 215, 0, 0.2);
		border: 1px solid rgba(255, 215, 0, 0.3);
		border-radius: 8px;
		color: #ffd700;
		text-decoration: none;
		transition: all 0.3s ease;
		font-weight: 500;
	}

	.test-link:hover {
		background: rgba(255, 215, 0, 0.3);
		border-color: rgba(255, 215, 0, 0.5);
		transform: translateY(-2px);
	}

	.log-container {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 8px;
		padding: 15px;
		border-left: 3px solid #ffd700;
	}

	.log-container p {
		margin: 5px 0;
		opacity: 0.8;
	}

	@media (max-width: 768px) {
		.debug-container {
			padding: 12px;
		}

		h1 {
			font-size: 1.5rem;
		}

		.controls {
			flex-direction: column;
		}

		.avatar-container {
			height: 300px;
		}
	}
</style> 