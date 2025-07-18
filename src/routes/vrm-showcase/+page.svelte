<script>
	import { onMount } from 'svelte';
	import DivineAvatar from '$lib/components/DivineAvatar.svelte';

	let selectedVRM = 'aili.vrm';
	let divineType = 'guanyin';
	let emotion = 'gentle';
	let isSpeaking = false;
	let showControls = true;
	let useVRM = true;

	// 可用的VRM模型列表
	const availableVRMs = [
		{ name: 'Aili', file: 'aili.vrm', description: '可爱少女模型' },
		{ name: 'Hailey', file: 'hailey.vrm', description: '活力少女模型' },
		{ name: '后藤仁', file: '后藤仁.vrm', description: '日系少女模型' },
		{ name: '活力少女', file: '活力少女.vrm', description: '运动风格模型' },
		{ name: 'わたあめ_02', file: 'わたあめ_02.vrm', description: '棉花糖系列模型' },
		{ name: 'わたあめ_03', file: 'わたあめ_03.vrm', description: '棉花糖系列模型' },
		{ name: 'G2', file: 'g2.vrm', description: '高质量模型' },
		{ name: 'God', file: 'god.vrm', description: '神仙模型' }
	];

	// 神仙类型
	const divineTypes = [
		{ value: 'guanyin', label: '千手观音' },
		{ value: 'buddha', label: '佛陀' },
		{ value: 'immortal', label: '神仙' }
	];

	// 情绪类型
	const emotions = [
		{ value: 'gentle', label: '温和' },
		{ value: 'wise', label: '智慧' },
		{ value: 'ethereal', label: '空灵' },
		{ value: 'serious', label: '严肃' }
	];

	// 自动切换模型演示
	let currentModelIndex = 0;
	let autoSwitch = false;

	onMount(() => {
		// 开始自动切换演示
		startAutoDemo();
	});

	function startAutoDemo() {
		autoSwitch = true;
		switchModel();
	}

	function switchModel() {
		if (!autoSwitch) return;
		
		selectedVRM = availableVRMs[currentModelIndex].file;
		currentModelIndex = (currentModelIndex + 1) % availableVRMs.length;
		
		setTimeout(() => {
			switchModel();
		}, 5000); // 每5秒切换一次
	}

	function stopAutoDemo() {
		autoSwitch = false;
	}

	function playAnimation(animation) {
		// 这里可以添加动画播放逻辑
		console.log('播放动画:', animation);
	}
</script>

<svelte:head>
	<title>VRM模型展示</title>
</svelte:head>

<div class="vrm-showcase">
	<header class="showcase-header">
		<h1>🎭 VRM模型展示</h1>
		<p>展示所有可用的VRM模型和动画效果</p>
	</header>

	<div class="controls-panel">
		<div class="control-group">
			<label>VRM模型:</label>
			<select bind:value={selectedVRM}>
				{#each availableVRMs as vrm}
					<option value={vrm.file}>{vrm.name} - {vrm.description}</option>
				{/each}
			</select>
		</div>

		<div class="control-group">
			<label>神仙类型:</label>
			<select bind:value={divineType}>
				{#each divineTypes as type}
					<option value={type.value}>{type.label}</option>
				{/each}
			</select>
		</div>

		<div class="control-group">
			<label>情绪:</label>
			<select bind:value={emotion}>
				{#each emotions as emo}
					<option value={emo.value}>{emo.label}</option>
				{/each}
			</select>
		</div>

		<div class="control-group">
			<label>
				<input type="checkbox" bind:checked={isSpeaking} />
				说话状态
			</label>
		</div>

		<div class="control-group">
			<label>
				<input type="checkbox" bind:checked={showControls} />
				显示控制面板
			</label>
		</div>

		<div class="control-group">
			<label>
				<input type="checkbox" bind:checked={useVRM} />
				使用VRM模型
			</label>
		</div>

		<div class="demo-controls">
			<button on:click={startAutoDemo} disabled={autoSwitch}>
				开始自动演示
			</button>
			<button on:click={stopAutoDemo} disabled={!autoSwitch}>
				停止演示
			</button>
		</div>
	</div>

	<div class="avatar-container">
		<DivineAvatar 
			{divineType}
			{emotion}
			{isSpeaking}
			{showControls}
			{useVRM}
			{selectedVRM}
			autoRotate={true}
		/>
	</div>

	<div class="model-info">
		<h3>当前模型信息</h3>
		{#if availableVRMs.find(vrm => vrm.file === selectedVRM)}
			{@const currentModel = availableVRMs.find(vrm => vrm.file === selectedVRM)}
			<div class="info-card">
				<h4>{currentModel.name}</h4>
				<p><strong>描述:</strong> {currentModel.description}</p>
				<p><strong>文件:</strong> {currentModel.file}</p>
				<p><strong>神仙类型:</strong> {divineTypes.find(t => t.value === divineType)?.label}</p>
				<p><strong>情绪:</strong> {emotions.find(e => e.value === emotion)?.label}</p>
				<p><strong>状态:</strong> {isSpeaking ? '说话中' : '待机'}</p>
			</div>
		{/if}
	</div>

	<div class="animation-controls">
		<h3>动画控制</h3>
		<div class="animation-buttons">
			<button on:click={() => playAnimation('idle')}>待机</button>
			<button on:click={() => playAnimation('speaking')}>说话</button>
			<button on:click={() => playAnimation('blessing')}>祝福</button>
			<button on:click={() => playAnimation('meditation')}>冥想</button>
		</div>
	</div>
</div>

<style>
	.vrm-showcase {
		min-height: 100vh;
		background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
		padding: 20px;
		color: #fff;
	}

	.showcase-header {
		text-align: center;
		margin-bottom: 30px;
	}

	.showcase-header h1 {
		color: #ffd700;
		font-size: 2.5rem;
		margin-bottom: 10px;
		text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
	}

	.showcase-header p {
		color: #ccc;
		font-size: 1.1rem;
	}

	.controls-panel {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 215, 0, 0.3);
		border-radius: 12px;
		padding: 20px;
		margin-bottom: 30px;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.control-group label {
		color: #ffd700;
		font-weight: 600;
		font-size: 14px;
	}

	.control-group select {
		padding: 8px 12px;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 215, 0, 0.5);
		border-radius: 6px;
		color: #fff;
		font-size: 14px;
	}

	.control-group select option {
		background: #1a1a1a;
		color: #fff;
	}

	.control-group input[type="checkbox"] {
		margin-right: 8px;
	}

	.demo-controls {
		grid-column: 1 / -1;
		display: flex;
		gap: 10px;
		justify-content: center;
	}

	.demo-controls button {
		padding: 10px 20px;
		background: linear-gradient(135deg, #ffd700, #ffed4e);
		border: none;
		border-radius: 6px;
		color: #000;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.demo-controls button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
	}

	.demo-controls button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.avatar-container {
		height: 500px;
		margin-bottom: 30px;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
	}

	.model-info {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 215, 0, 0.3);
		border-radius: 12px;
		padding: 20px;
		margin-bottom: 20px;
	}

	.model-info h3 {
		color: #ffd700;
		margin-bottom: 15px;
		border-bottom: 1px solid rgba(255, 215, 0, 0.3);
		padding-bottom: 10px;
	}

	.info-card {
		background: rgba(255, 215, 0, 0.1);
		border-radius: 8px;
		padding: 15px;
	}

	.info-card h4 {
		color: #ffd700;
		margin-bottom: 10px;
		font-size: 1.2rem;
	}

	.info-card p {
		margin-bottom: 8px;
		color: #ccc;
	}

	.info-card strong {
		color: #ffd700;
	}

	.animation-controls {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 215, 0, 0.3);
		border-radius: 12px;
		padding: 20px;
		text-align: center;
	}

	.animation-controls h3 {
		color: #ffd700;
		margin-bottom: 15px;
	}

	.animation-buttons {
		display: flex;
		gap: 10px;
		justify-content: center;
		flex-wrap: wrap;
	}

	.animation-buttons button {
		padding: 10px 20px;
		background: rgba(255, 215, 0, 0.2);
		border: 1px solid rgba(255, 215, 0, 0.5);
		border-radius: 6px;
		color: #ffd700;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.animation-buttons button:hover {
		background: rgba(255, 215, 0, 0.3);
		border-color: rgba(255, 215, 0, 0.8);
		transform: translateY(-2px);
	}

	@media (max-width: 768px) {
		.controls-panel {
			grid-template-columns: 1fr;
		}

		.avatar-container {
			height: 400px;
		}

		.animation-buttons {
			flex-direction: column;
			align-items: center;
		}
	}
</style> 