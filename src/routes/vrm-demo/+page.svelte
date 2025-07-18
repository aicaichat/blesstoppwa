<script>
	import DivineAvatar from '$lib/components/DivineAvatar.svelte';
	import { onMount } from 'svelte';

	let divineType = 'guanyin';
	let emotion = 'gentle';
	let isSpeaking = false;
	let useVRM = true;
	let showControls = true;

	// 情绪选项
	const emotions = [
		{ value: 'gentle', label: '温和' },
		{ value: 'wise', label: '智慧' },
		{ value: 'ethereal', label: '空灵' },
		{ value: 'serious', label: '严肃' }
	];

	// 神仙类型选项
	const divineTypes = [
		{ value: 'guanyin', label: '观音' },
		{ value: 'buddha', label: '佛陀' },
		{ value: 'immortal', label: '神仙' }
	];

	// 模拟说话
	function toggleSpeaking() {
		isSpeaking = !isSpeaking;
	}

	// 切换VRM模式
	function toggleVRM() {
		useVRM = !useVRM;
	}
</script>

<svelte:head>
	<title>VRM神仙模型演示</title>
</svelte:head>

<div class="vrm-demo-container">
	<header class="demo-header">
		<h1>🎭 VRM神仙模型演示</h1>
		<p>体验3D神仙模型的交互效果</p>
	</header>

	<div class="demo-content">
		<div class="avatar-section">
			<div class="avatar-container">
				<DivineAvatar 
					{divineType}
					{emotion}
					{isSpeaking}
					{useVRM}
					{showControls}
					autoRotate={true}
				/>
			</div>
		</div>

		<div class="controls-section">
			<div class="control-group">
				<h3>🎭 神仙类型</h3>
				<div class="button-group">
					{#each divineTypes as type}
						<button 
							class="control-btn {divineType === type.value ? 'active' : ''}"
							on:click={() => divineType = type.value}
						>
							{type.label}
						</button>
					{/each}
				</div>
			</div>

			<div class="control-group">
				<h3>😊 情绪表情</h3>
				<div class="button-group">
					{#each emotions as emotionOption}
						<button 
							class="control-btn {emotion === emotionOption.value ? 'active' : ''}"
							on:click={() => emotion = emotionOption.value}
						>
							{emotionOption.label}
						</button>
					{/each}
				</div>
			</div>

			<div class="control-group">
				<h3>🎬 动画控制</h3>
				<div class="button-group">
					<button 
						class="control-btn {isSpeaking ? 'active' : ''}"
						on:click={toggleSpeaking}
					>
						{isSpeaking ? '停止说话' : '开始说话'}
					</button>
				</div>
			</div>

			<div class="control-group">
				<h3>🔧 模式设置</h3>
				<div class="button-group">
					<button 
						class="control-btn {useVRM ? 'active' : ''}"
						on:click={toggleVRM}
					>
						{useVRM ? 'VRM模式' : '图像模式'}
					</button>
				</div>
			</div>

			<div class="info-panel">
				<h3>ℹ️ 使用说明</h3>
				<ul>
					<li><strong>VRM模式：</strong>加载真实的3D模型，支持表情和动画</li>
					<li><strong>图像模式：</strong>使用图像纹理创建3D效果</li>
					<li><strong>情绪控制：</strong>改变神仙的表情和氛围</li>
					<li><strong>说话动画：</strong>模拟说话时的动画效果</li>
				</ul>
			</div>
		</div>
	</div>
</div>

<style>
	.vrm-demo-container {
		min-height: 100vh;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
		padding: 20px;
		font-family: 'Arial', sans-serif;
	}

	.demo-header {
		text-align: center;
		margin-bottom: 30px;
		color: #fff;
	}

	.demo-header h1 {
		font-size: 2.5rem;
		margin-bottom: 10px;
		background: linear-gradient(45deg, #ffd700, #ffed4e);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.demo-header p {
		font-size: 1.1rem;
		opacity: 0.8;
	}

	.demo-content {
		display: grid;
		grid-template-columns: 1fr 400px;
		gap: 30px;
		max-width: 1400px;
		margin: 0 auto;
	}

	.avatar-section {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 15px;
		padding: 20px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.avatar-container {
		width: 100%;
		height: 600px;
		border-radius: 12px;
		overflow: hidden;
	}

	.controls-section {
		display: flex;
		flex-direction: column;
		gap: 25px;
	}

	.control-group {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		padding: 20px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.control-group h3 {
		color: #ffd700;
		margin-bottom: 15px;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.button-group {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.control-btn {
		padding: 10px 16px;
		background: rgba(255, 215, 0, 0.1);
		border: 1px solid rgba(255, 215, 0, 0.3);
		border-radius: 8px;
		color: #ffd700;
		font-size: 14px;
		cursor: pointer;
		transition: all 0.3s ease;
		font-weight: 500;
	}

	.control-btn:hover {
		background: rgba(255, 215, 0, 0.2);
		border-color: rgba(255, 215, 0, 0.6);
		transform: translateY(-2px);
	}

	.control-btn.active {
		background: rgba(255, 215, 0, 0.3);
		border-color: rgba(255, 215, 0, 0.8);
		box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
	}

	.info-panel {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		padding: 20px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.info-panel h3 {
		color: #ffd700;
		margin-bottom: 15px;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.info-panel ul {
		color: #fff;
		opacity: 0.9;
		line-height: 1.6;
	}

	.info-panel li {
		margin-bottom: 8px;
	}

	.info-panel strong {
		color: #ffd700;
	}

	/* 响应式设计 */
	@media (max-width: 1200px) {
		.demo-content {
			grid-template-columns: 1fr;
			gap: 20px;
		}

		.avatar-container {
			height: 500px;
		}
	}

	@media (max-width: 768px) {
		.demo-header h1 {
			font-size: 2rem;
		}

		.avatar-container {
			height: 400px;
		}

		.control-group {
			padding: 15px;
		}

		.button-group {
			gap: 8px;
		}

		.control-btn {
			padding: 8px 12px;
			font-size: 13px;
		}
	}
</style> 