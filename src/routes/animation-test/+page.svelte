<script>
	import { onMount } from 'svelte';
	import DivineAvatar from '$lib/components/DivineAvatar.svelte';
	
	let divineType = 'guanyin';
	let emotion = 'gentle';
	let isSpeaking = false;
	let useVRM = true;
	let selectedVRM = 'aili.vrm';
	let showControls = true;
	
	// 动画控制
	let currentAnimation = 'idle_01';
	let animationList = [
		{ name: 'idle_01', label: '待机动画1' },
		{ name: 'idle_02', label: '待机动画2' },
		{ name: 'idle_03', label: '待机动画3' },
		{ name: 'idle_happy_01', label: '开心待机1' },
		{ name: 'idle_happy_02', label: '开心待机2' },
		{ name: 'idle_happy_03', label: '开心待机3' },
		{ name: 'talking_01', label: '说话动画1' },
		{ name: 'talking_02', label: '说话动画2' },
		{ name: 'standing_greeting', label: '问候动画' },
		{ name: 'thinking', label: '思考动画' },
		{ name: 'excited', label: '兴奋动画' },
		{ name: 'angry', label: '愤怒动画' },
		{ name: 'sitting', label: '坐姿动画' },
		{ name: 'kiss', label: '飞吻动画' },
		
		// 太极动画
		{ name: 'taichi_cloud_hands', label: '🥋 太极云手' },
		{ name: 'taichi_single_whip', label: '🥋 太极单鞭' },
		{ name: 'taichi_white_crane', label: '🥋 白鹤亮翅' }
	];
	
	// 自动切换动画
	let autoSwitch = false;
	let autoSwitchInterval;
	
	onMount(() => {
		// 清理定时器
		return () => {
			if (autoSwitchInterval) {
				clearInterval(autoSwitchInterval);
			}
		};
	});
	
	// 监听自动切换
	$: if (autoSwitch) {
		if (autoSwitchInterval) {
			clearInterval(autoSwitchInterval);
		}
		autoSwitchInterval = setInterval(() => {
			const randomIndex = Math.floor(Math.random() * animationList.length);
			currentAnimation = animationList[randomIndex].name;
			// 触发动画播放
			playCurrentAnimation();
		}, 5000);
	} else {
		if (autoSwitchInterval) {
			clearInterval(autoSwitchInterval);
		}
	}
	
	// 监听动画选择变化
	$: if (currentAnimation) {
		playCurrentAnimation();
	}
	
	// 播放当前选择的动画
	function playCurrentAnimation() {
		// 这里可以添加直接控制VRM模型播放动画的代码
		console.log('播放动画:', currentAnimation);
	}
	
	// 模拟说话状态
	function toggleSpeaking() {
		isSpeaking = !isSpeaking;
	}
	
	// 切换情绪
	function cycleEmotion() {
		const emotions = ['gentle', 'wise', 'ethereal', 'serious'];
		const currentIndex = emotions.indexOf(emotion);
		const nextIndex = (currentIndex + 1) % emotions.length;
		emotion = emotions[nextIndex];
	}
</script>

<svelte:head>
	<title>动画系统测试 - Bless Top PWA</title>
</svelte:head>

<div class="animation-test-page">
	<div class="header">
		<h1>🎬 VRM动画系统测试</h1>
		<p>测试新的Mixamo动画系统和VRM模型加载</p>
	</div>
	
	<div class="content">
		<div class="avatar-container">
			<DivineAvatar 
				{divineType}
				{emotion}
				{isSpeaking}
				{useVRM}
				{selectedVRM}
				{showControls}
			/>
		</div>
		
		<div class="controls">
			<div class="control-section">
				<h3>🎭 模型控制</h3>
				<div class="control-group">
					<label>神仙类型:</label>
					<select bind:value={divineType}>
						<option value="guanyin">千手观音</option>
						<option value="buddha">佛陀</option>
						<option value="immortal">神仙</option>
					</select>
				</div>
				
				<div class="control-group">
					<label>VRM模型:</label>
					<select bind:value={selectedVRM}>
						<option value="aili.vrm">Aili</option>
						<option value="hailey.vrm">Hailey</option>
						<option value="后藤仁.vrm">后藤仁</option>
						<option value="活力少女.vrm">活力少女</option>
						<option value="わたあめ_02.vrm">わたあめ_02</option>
						<option value="わたあめ_03.vrm">わたあめ_03</option>
						<option value="g2.vrm">G2</option>
						<option value="god.vrm">God</option>
					</select>
				</div>
			</div>
			
			<div class="control-section">
				<h3>😊 情绪控制</h3>
				<div class="control-group">
					<label>情绪:</label>
					<select bind:value={emotion}>
						<option value="gentle">温和</option>
						<option value="wise">智慧</option>
						<option value="ethereal">空灵</option>
						<option value="serious">严肃</option>
					</select>
				</div>
				
				<button on:click={cycleEmotion} class="btn-secondary">
					🔄 循环切换情绪
				</button>
			</div>
			
			<div class="control-section">
				<h3>🎬 动画控制</h3>
				<div class="control-group">
					<label>当前动画:</label>
					<select bind:value={currentAnimation}>
						{#each animationList as animation}
							<option value={animation.name}>{animation.label}</option>
						{/each}
					</select>
				</div>
				
				<div class="control-group">
					<label>
						<input type="checkbox" bind:checked={autoSwitch}>
						自动切换动画 (5秒间隔)
					</label>
				</div>
				
				<button on:click={toggleSpeaking} class="btn-primary">
					{isSpeaking ? '🔇 停止说话' : '🗣️ 开始说话'}
				</button>
			</div>
			
			<div class="control-section">
				<h3>ℹ️ 系统信息</h3>
				<div class="info-item">
					<strong>VRM模式:</strong> {useVRM ? '启用' : '禁用'}
				</div>
				<div class="info-item">
					<strong>当前模型:</strong> {selectedVRM}
				</div>
				<div class="info-item">
					<strong>当前情绪:</strong> {emotion}
				</div>
				<div class="info-item">
					<strong>说话状态:</strong> {isSpeaking ? '是' : '否'}
				</div>
				<div class="info-item">
					<strong>自动切换:</strong> {autoSwitch ? '启用' : '禁用'}
				</div>
			</div>
		</div>
	</div>
	
	<div class="footer">
		<p>💡 提示：</p>
		<ul>
			<li>VRM模型需要加载时间，请耐心等待</li>
			<li>Mixamo动画系统会自动加载基础动画</li>
			<li>说话状态会触发相应的动画切换</li>
			<li>情绪变化会影响模型的表情</li>
		</ul>
	</div>
</div>

<style>
	.animation-test-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
		color: #fff;
		padding: 20px;
	}
	
	.header {
		text-align: center;
		margin-bottom: 30px;
	}
	
	.header h1 {
		font-size: 2.5rem;
		margin-bottom: 10px;
		background: linear-gradient(45deg, #ffd700, #ffed4e);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.header p {
		font-size: 1.1rem;
		opacity: 0.8;
	}
	
	.content {
		display: grid;
		grid-template-columns: 1fr 400px;
		gap: 30px;
		max-width: 1400px;
		margin: 0 auto;
	}
	
	.avatar-container {
		height: 600px;
		border-radius: 15px;
		overflow: hidden;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
	}
	
	.controls {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	
	.control-section {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		padding: 20px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}
	
	.control-section h3 {
		margin: 0 0 15px 0;
		font-size: 1.2rem;
		color: #ffd700;
	}
	
	.control-group {
		margin-bottom: 15px;
	}
	
	.control-group label {
		display: block;
		margin-bottom: 5px;
		font-weight: 500;
	}
	
	select, input[type="checkbox"] {
		width: 100%;
		padding: 8px 12px;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 6px;
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
		font-size: 14px;
	}
	
	select option {
		background: #1a1a2e;
		color: #fff;
	}
	
	.btn-primary, .btn-secondary {
		width: 100%;
		padding: 12px;
		border: none;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		margin-bottom: 10px;
	}
	
	.btn-primary {
		background: linear-gradient(45deg, #ffd700, #ffed4e);
		color: #1a1a2e;
	}
	
	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
	}
	
	.btn-secondary {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}
	
	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.2);
	}
	
	.info-item {
		margin-bottom: 8px;
		font-size: 14px;
	}
	
	.info-item strong {
		color: #ffd700;
	}
	
	.footer {
		margin-top: 30px;
		padding: 20px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.footer p {
		margin: 0 0 10px 0;
		font-weight: 500;
		color: #ffd700;
	}
	
	.footer ul {
		margin: 0;
		padding-left: 20px;
		opacity: 0.8;
	}
	
	.footer li {
		margin-bottom: 5px;
	}
	
	@media (max-width: 768px) {
		.content {
			grid-template-columns: 1fr;
		}
		
		.avatar-container {
			height: 400px;
		}
		
		.header h1 {
			font-size: 2rem;
		}
	}
</style> 