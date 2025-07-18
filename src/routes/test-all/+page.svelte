<script>
	import { onMount } from 'svelte';

	let testResults = {
		vrmFile: false,
		iconFile: false,
		imageProxy: false,
		serverPort: null
	};

	onMount(async () => {
		console.log('🧪 开始全面测试...');
		
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

		// 测试图标文件
		try {
			const iconResponse = await fetch('/icon-192x192.png');
			testResults.iconFile = iconResponse.ok;
			console.log('✅ 图标文件测试:', iconResponse.ok ? '成功' : '失败');
		} catch (error) {
			console.error('❌ 图标文件测试失败:', error);
		}

		// 测试图片代理
		try {
			const imageResponse = await fetch('/api/image?url=https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%8D%83%E6%89%8B%E8%A7%82%E9%9F%B3.jpg');
			testResults.imageProxy = imageResponse.ok;
			console.log('✅ 图片代理测试:', imageResponse.ok ? '成功' : '失败');
		} catch (error) {
			console.error('❌ 图片代理测试失败:', error);
		}

		console.log('📋 测试结果:', testResults);
	});

	function openMirror() {
		window.open('/mirror', '_blank');
	}

	function openMirrorTest() {
		window.open('/mirror-test', '_blank');
	}

	function openDebug() {
		window.open('/debug', '_blank');
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
	<title>全面测试页面</title>
</svelte:head>

<div class="test-container">
	<h1>🧪 全面功能测试</h1>
	
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
			
			<div class="result-item {testResults.iconFile ? 'success' : 'error'}">
				<span class="status">{testResults.iconFile ? '✅' : '❌'}</span>
				<div class="result-content">
					<strong>PWA图标</strong>
					<small>{testResults.iconFile ? '成功' : '失败'}</small>
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

	<div class="quick-links">
		<h2>🔗 快速链接</h2>
		<div class="link-grid">
			<button class="link-btn" on:click={openMirror}>
				🎭 Mirror页面
			</button>
			<button class="link-btn" on:click={openMirrorTest}>
				🧪 Mirror测试
			</button>
			<button class="link-btn" on:click={openDebug}>
				🔧 调试页面
			</button>
			<button class="link-btn" on:click={clearCache}>
				🗑️ 清除缓存
			</button>
		</div>
	</div>

	<div class="troubleshooting">
		<h2>🔧 故障排除</h2>
		<div class="trouble-list">
			<div class="trouble-item">
				<h3>❌ VRM文件404错误</h3>
				<p>如果VRM文件测试失败，请检查：</p>
				<ul>
					<li>开发服务器是否在正确的端口运行</li>
					<li>VRM文件是否存在于public目录</li>
					<li>服务器路由是否正确配置</li>
				</ul>
			</div>
			
			<div class="trouble-item">
				<h3>❌ 图标下载错误</h3>
				<p>如果图标测试失败，请检查：</p>
				<ul>
					<li>图标文件是否存在于public目录</li>
					<li>manifest.json中的路径是否正确</li>
					<li>浏览器缓存是否需要清除</li>
				</ul>
			</div>
			
			<div class="trouble-item">
				<h3>❌ CORS错误</h3>
				<p>如果图片代理测试失败，请检查：</p>
				<ul>
					<li>图片代理API是否正确配置</li>
					<li>外部图片URL是否可访问</li>
					<li>网络连接是否正常</li>
				</ul>
			</div>
		</div>
	</div>

	<div class="manual-test">
		<h2>🔍 手动测试</h2>
		<div class="test-links">
			<a href="/god.vrm" target="_blank" class="test-link">
				🎭 直接访问VRM文件
			</a>
			<a href="/icon-192x192.png" target="_blank" class="test-link">
				🖼️ 直接访问图标文件
			</a>
			<a href="/api/image?url=https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%8D%83%E6%89%8B%E8%A7%82%E9%9F%B3.jpg" target="_blank" class="test-link">
				🖼️ 测试图片代理
			</a>
		</div>
	</div>
</div>

<style>
	.test-container {
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

	h3 {
		color: #ffd700;
		margin-bottom: 10px;
		font-size: 1.2rem;
	}

	.server-info, .test-results, .quick-links, .troubleshooting, .manual-test {
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

	.link-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 15px;
	}

	.link-btn {
		padding: 15px 20px;
		background: rgba(255, 215, 0, 0.2);
		border: 1px solid rgba(255, 215, 0, 0.3);
		border-radius: 8px;
		color: #ffd700;
		cursor: pointer;
		transition: all 0.3s ease;
		font-size: 16px;
		font-weight: 500;
	}

	.link-btn:hover {
		background: rgba(255, 215, 0, 0.3);
		border-color: rgba(255, 215, 0, 0.5);
		transform: translateY(-2px);
	}

	.trouble-list {
		display: grid;
		gap: 20px;
	}

	.trouble-item {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 15px;
		border-left: 3px solid #ff6b6b;
	}

	.trouble-item ul {
		margin: 10px 0 0 0;
		padding-left: 20px;
	}

	.trouble-item li {
		margin-bottom: 5px;
		opacity: 0.8;
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

	@media (max-width: 768px) {
		.test-container {
			padding: 12px;
		}

		h1 {
			font-size: 1.5rem;
		}

		.link-grid {
			grid-template-columns: 1fr;
		}
	}
</style> 