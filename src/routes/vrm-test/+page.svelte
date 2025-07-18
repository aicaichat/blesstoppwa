<script>
	import DivineAvatar from '$lib/components/DivineAvatar.svelte';
	import { onMount } from 'svelte';

	let divineType = 'guanyin';
	let emotion = 'gentle';
	let isSpeaking = false;
	let useVRM = true;
	let showControls = true;

	let avatarComponent;

	onMount(() => {
		// 自动切换说话状态来测试动画
		setInterval(() => {
			isSpeaking = !isSpeaking;
		}, 3000);
	});

	function playAnimation(animationName) {
		if (avatarComponent) {
			avatarComponent.playAnimation(animationName);
		}
	}

	function toggleVRM() {
		useVRM = !useVRM;
	}
</script>

<svelte:head>
	<title>VRM动画测试</title>
</svelte:head>

<div class="vrm-test-container">
	<h1>VRM动画测试</h1>
	
	<div class="controls">
		<div class="control-group">
			<label>神仙类型:</label>
			<select bind:value={divineType}>
				<option value="guanyin">观音</option>
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
				<input type="checkbox" bind:checked={useVRM} />
				使用VRM模型
			</label>
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
	</div>

	<div class="animation-buttons">
		<button on:click={() => playAnimation('idle')}>待机</button>
		<button on:click={() => playAnimation('speaking')}>说话</button>
		<button on:click={() => playAnimation('blessing')}>祝福</button>
		<button on:click={() => playAnimation('meditation')}>冥想</button>
	</div>

	<div class="avatar-container">
		<DivineAvatar 
			bind:this={avatarComponent}
			{divineType}
			{emotion}
			{isSpeaking}
			{useVRM}
			{showControls}
			autoRotate={false}
		/>
	</div>

	<div class="info">
		<h3>测试说明:</h3>
		<ul>
			<li>如果VRM模型有动画数据，会自动播放动画</li>
			<li>如果没有动画数据，会创建默认的呼吸和摆动动画</li>
			<li>说话状态会自动切换来测试动画</li>
			<li>可以手动点击按钮测试不同动画</li>
		</ul>
	</div>
</div>

<style>
	.vrm-test-container {
		padding: 20px;
		max-width: 1200px;
		margin: 0 auto;
	}

	h1 {
		text-align: center;
		color: #ffd700;
		margin-bottom: 30px;
	}

	.controls {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 20px;
		margin-bottom: 30px;
		padding: 20px;
		background: rgba(0, 0, 0, 0.1);
		border-radius: 10px;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.control-group label {
		font-weight: bold;
		color: #ffd700;
	}

	.control-group select,
	.control-group input[type="checkbox"] {
		padding: 8px;
		border: 1px solid #333;
		border-radius: 5px;
		background: #1a1a1a;
		color: white;
	}

	.animation-buttons {
		display: flex;
		gap: 10px;
		margin-bottom: 30px;
		justify-content: center;
		flex-wrap: wrap;
	}

	.animation-buttons button {
		padding: 10px 20px;
		background: linear-gradient(135deg, #ffd700, #ffed4e);
		border: none;
		border-radius: 25px;
		color: #000;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.animation-buttons button:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
	}

	.avatar-container {
		height: 600px;
		margin-bottom: 30px;
		border: 2px solid #ffd700;
		border-radius: 15px;
		overflow: hidden;
	}

	.info {
		background: rgba(255, 215, 0, 0.1);
		padding: 20px;
		border-radius: 10px;
		border-left: 4px solid #ffd700;
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