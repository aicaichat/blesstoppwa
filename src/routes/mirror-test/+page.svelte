<script>
	import DivineAvatar from '$lib/components/DivineAvatar.svelte';
	import { onMount } from 'svelte';

	let avatarComponent;
	let divineType = 'guanyin';
	let emotion = 'gentle';
	let isSpeaking = false;
	let useVRM = true;
	let showControls = true;

	onMount(() => {
		console.log('🎭 Mirror测试页面已加载');
		console.log('📋 配置:', { divineType, emotion, useVRM });
	});

	function testVRMLoading() {
		console.log('🧪 测试VRM加载...');
		if (avatarComponent) {
			avatarComponent.playAnimation('idle');
		}
	}

	function testEmotionChange() {
		emotion = emotion === 'gentle' ? 'wise' : 'gentle';
		console.log('😊 切换情绪:', emotion);
	}

	function testSpeaking() {
		isSpeaking = !isSpeaking;
		console.log('🗣️ 切换说话状态:', isSpeaking);
	}
</script>

<svelte:head>
	<title>Mirror VRM测试</title>
</svelte:head>

<div class="test-container">
	<h1>🎭 Mirror VRM测试页面</h1>
	
	<div class="test-info">
		<h2>📋 当前配置</h2>
		<ul>
			<li><strong>神仙类型:</strong> {divineType}</li>
			<li><strong>情绪:</strong> {emotion}</li>
			<li><strong>VRM模式:</strong> {useVRM ? '启用' : '禁用'}</li>
			<li><strong>说话状态:</strong> {isSpeaking ? '是' : '否'}</li>
		</ul>
	</div>

	<div class="avatar-section">
		<h2>🎭 VRM模型测试</h2>
		<div class="avatar-container">
			<DivineAvatar 
				bind:this={avatarComponent}
				{divineType}
				{emotion}
				{isSpeaking}
				{useVRM}
				{showControls}
				autoRotate={true}
			/>
		</div>
	</div>

	<div class="test-controls">
		<h2>🧪 测试控制</h2>
		<div class="control-buttons">
			<button on:click={testVRMLoading}>
				🎬 测试VRM加载
			</button>
			<button on:click={testEmotionChange}>
				😊 切换情绪
			</button>
			<button on:click={testSpeaking}>
				🗣️ 切换说话状态
			</button>
			<button on:click={() => useVRM = !useVRM}>
				🔄 切换VRM模式
			</button>
		</div>
	</div>

	<div class="debug-info">
		<h2>🔍 调试信息</h2>
		<p>打开浏览器控制台查看详细日志</p>
		<p>VRM文件URL: <code>/god.vrm</code></p>
		<p>图片代理URL: <code>/api/image?url=...</code></p>
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

	.test-info, .avatar-section, .test-controls, .debug-info {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		padding: 20px;
		margin-bottom: 20px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.test-info ul {
		list-style: none;
		padding: 0;
	}

	.test-info li {
		margin-bottom: 8px;
		padding: 8px;
		background: rgba(255, 215, 0, 0.1);
		border-radius: 6px;
		border-left: 3px solid #ffd700;
	}

	.avatar-container {
		width: 100%;
		height: 500px;
		border-radius: 12px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 215, 0, 0.3);
	}

	.control-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.control-buttons button {
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

	.control-buttons button:hover {
		background: rgba(255, 215, 0, 0.3);
		border-color: rgba(255, 215, 0, 0.5);
		transform: translateY(-2px);
	}

	.debug-info p {
		margin-bottom: 8px;
		color: rgba(255, 255, 255, 0.8);
	}

	.debug-info code {
		background: rgba(255, 215, 0, 0.2);
		padding: 4px 8px;
		border-radius: 4px;
		color: #ffd700;
		font-family: 'Courier New', monospace;
	}

	@media (max-width: 768px) {
		.test-container {
			padding: 12px;
		}

		h1 {
			font-size: 1.5rem;
		}

		.control-buttons {
			flex-direction: column;
		}

		.avatar-container {
			height: 300px;
		}
	}
</style> 