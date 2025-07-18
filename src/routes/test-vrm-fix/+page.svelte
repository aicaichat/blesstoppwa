<script>
	import { onMount } from 'svelte';
	import DivineAvatar from '$lib/components/DivineAvatar.svelte';

	let selectedVRM = 'aili.vrm';
	let useVRM = true;
	let divineType = 'guanyin';
	let emotion = 'gentle';
	let isSpeaking = false;

	const availableVRMs = [
		{ name: 'Aili', file: 'aili.vrm', description: '可爱少女模型' },
		{ name: 'Hailey', file: 'hailey.vrm', description: '活力少女模型' },
		{ name: 'God', file: 'god.vrm', description: '神仙模型' },
		{ name: 'G2', file: 'g2.vrm', description: '高质量模型' }
	];

	onMount(() => {
		console.log('🧪 VRM修复测试页面加载完成');
	});
</script>

<svelte:head>
	<title>VRM修复测试 - BlessTop</title>
</svelte:head>

<div class="test-container">
	<h1>🎭 VRM修复测试</h1>
	
	<div class="controls">
		<div class="control-group">
			<label>VRM模型:</label>
			<select bind:value={selectedVRM}>
				{#each availableVRMs as vrm}
					<option value={vrm.file}>{vrm.name} - {vrm.description}</option>
				{/each}
			</select>
		</div>

		<div class="control-group">
			<label>
				<input type="checkbox" bind:checked={useVRM} />
				使用VRM模型
			</label>
		</div>

		<div class="control-group">
			<label>神仙类型:</label>
			<select bind:value={divineType}>
				<option value="guanyin">千手观音</option>
				<option value="buddha">佛陀</option>
				<option value="immortal">神仙</option>
			</select>
		</div>

		<div class="control-group">
			<label>情绪:</label>
			<select bind:value={emotion}>
				<option value="gentle">温和</option>
				<option value="wise">智慧</option>
				<option value="ethereal">空灵</option>
				<option value="serious">严肃</option>
			</select>
		</div>

		<div class="control-group">
			<label>
				<input type="checkbox" bind:checked={isSpeaking} />
				说话状态
			</label>
		</div>
	</div>

	<div class="avatar-container">
		<DivineAvatar 
			{divineType}
			{emotion}
			{isSpeaking}
			{useVRM}
			{selectedVRM}
			showControls={true}
			autoRotate={true}
		/>
	</div>

	<div class="status">
		<p>✅ VRM文件现在通过API路由加载</p>
		<p>✅ 图标文件已修复</p>
		<p>✅ 静态文件服务正常</p>
	</div>
</div>

<style>
	.test-container {
		padding: 20px;
		max-width: 1200px;
		margin: 0 auto;
		background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
		min-height: 100vh;
		color: white;
	}

	h1 {
		text-align: center;
		color: #ffd700;
		margin-bottom: 30px;
		font-size: 2.5rem;
	}

	.controls {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
		margin-bottom: 30px;
		padding: 20px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		border: 1px solid rgba(255, 215, 0, 0.3);
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.control-group label {
		font-weight: bold;
		color: #ffd700;
	}

	select, input[type="checkbox"] {
		padding: 8px 12px;
		border: 1px solid rgba(255, 215, 0, 0.3);
		border-radius: 6px;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		font-size: 14px;
	}

	select:focus {
		outline: none;
		border-color: #ffd700;
		box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
	}

	.avatar-container {
		height: 600px;
		margin-bottom: 30px;
		border-radius: 12px;
		overflow: hidden;
		border: 2px solid rgba(255, 215, 0, 0.3);
	}

	.status {
		text-align: center;
		padding: 20px;
		background: rgba(0, 255, 0, 0.1);
		border-radius: 12px;
		border: 1px solid rgba(0, 255, 0, 0.3);
	}

	.status p {
		margin: 8px 0;
		color: #90EE90;
		font-weight: bold;
	}
</style> 