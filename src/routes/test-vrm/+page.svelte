<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let status = '准备测试...';
	let vrmLoaded = false;
	let animationWorking = false;
	let error = null;

	onMount(async () => {
		if (browser) {
			await testVRM();
		}
	});

	async function testVRM() {
		status = '开始测试VRM...';
		error = null;

		try {
			// 检查文件是否存在
			const response = await fetch('/god.vrm', { method: 'HEAD' });
			if (!response.ok) {
				throw new Error('VRM文件不存在');
			}

			status = 'VRM文件存在，正在加载...';
			vrmLoaded = true;

			// 尝试加载VRM
			const THREE = await import('three');
			const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
			const { VRMLoaderPlugin } = await import('@pixiv/three-vrm');

			const loader = new GLTFLoader();
			loader.register((parser) => {
				return new VRMLoaderPlugin(parser);
			});

			const gltf = await loader.loadAsync('/god.vrm');
			const vrm = gltf.userData.vrm;

			if (!vrm) {
				throw new Error('VRM数据未找到');
			}

			// 检查动画
			const hasAnimations = gltf.animations && gltf.animations.length > 0;
			animationWorking = hasAnimations;

			status = hasAnimations 
				? `✅ VRM加载成功，找到 ${gltf.animations.length} 个动画`
				: '✅ VRM加载成功，但没有内置动画（将使用默认动画）';

		} catch (err) {
			console.error('VRM测试失败:', err);
			error = err.message;
			status = '❌ VRM测试失败';
		}
	}
</script>

<svelte:head>
	<title>VRM测试</title>
</svelte:head>

<div class="test-container">
	<h1>VRM动画测试</h1>

	<div class="status-card">
		<h3>测试状态</h3>
		<p class="status">{status}</p>
		
		{#if error}
			<div class="error">
				<strong>错误:</strong> {error}
			</div>
		{/if}

		<div class="results">
			<div class="result-item">
				<span class="label">VRM加载:</span>
				<span class="value {vrmLoaded ? 'success' : 'pending'}">
					{vrmLoaded ? '✅ 成功' : '⏳ 等待'}
				</span>
			</div>
			
			<div class="result-item">
				<span class="label">动画支持:</span>
				<span class="value {animationWorking ? 'success' : 'warning'}">
					{animationWorking ? '✅ 有动画' : '⚠️ 无动画（使用默认）'}
				</span>
			</div>
		</div>
	</div>

	<div class="actions">
		<button on:click={testVRM}>重新测试</button>
		<a href="/vrm-test" class="button">完整测试页面</a>
		<a href="/vrm-info" class="button">VRM信息页面</a>
	</div>

	<div class="info">
		<h3>说明</h3>
		<ul>
			<li>如果VRM模型有动画数据，会自动播放</li>
			<li>如果没有动画，系统会创建默认的呼吸和摆动动画</li>
			<li>访问完整测试页面可以手动控制动画</li>
		</ul>
	</div>
</div>

<style>
	.test-container {
		padding: 20px;
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		text-align: center;
		color: #ffd700;
		margin-bottom: 30px;
	}

	.status-card {
		background: rgba(0, 0, 0, 0.1);
		border: 1px solid #333;
		border-radius: 10px;
		padding: 20px;
		margin-bottom: 30px;
	}

	.status-card h3 {
		color: #ffd700;
		margin-bottom: 15px;
	}

	.status {
		font-size: 1.1em;
		color: #ccc;
		margin-bottom: 20px;
	}

	.error {
		background: rgba(255, 0, 0, 0.1);
		border: 1px solid #ff0000;
		border-radius: 5px;
		padding: 10px;
		margin: 10px 0;
		color: #ff6666;
	}

	.results {
		display: grid;
		gap: 10px;
	}

	.result-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 5px;
	}

	.label {
		font-weight: bold;
		color: #ffd700;
	}

	.value {
		font-weight: bold;
	}

	.value.success {
		color: #4ade80;
	}

	.value.warning {
		color: #fbbf24;
	}

	.value.pending {
		color: #9ca3af;
	}

	.actions {
		display: flex;
		gap: 10px;
		justify-content: center;
		margin-bottom: 30px;
		flex-wrap: wrap;
	}

	.button {
		padding: 12px 24px;
		background: linear-gradient(135deg, #ffd700, #ffed4e);
		border: none;
		border-radius: 25px;
		color: #000;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
		text-decoration: none;
		display: inline-block;
	}

	.button:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
	}

	.info {
		background: rgba(255, 215, 0, 0.1);
		border: 1px solid #ffd700;
		border-radius: 10px;
		padding: 20px;
	}

	.info h3 {
		color: #ffd700;
		margin-bottom: 15px;
	}

	.info ul {
		color: #ccc;
		line-height: 1.6;
	}

	.info li {
		margin-bottom: 8px;
	}
</style> 