<script>
	import { onMount } from 'svelte';
	import DivineAvatar from '$lib/components/DivineAvatar.svelte';

	let avatarComponent;
	let divineType = 'guanyin';
	let emotion = 'ethereal';
	let isSpeaking = false;
	let useVRM = true;
	let showControls = true;
	let selectedVRM = 'aili.vrm';

	// 太极动作列表
	const taichiMoves = [
		{
			name: 'taichi_cloud_hands',
			label: '云手',
			description: '如行云流水，双手缓缓推移，阴阳调和',
			icon: '☁️',
			philosophy: '云手动作体现了太极中的连绵不断，如云朵在天空中自然流动，柔中带刚，刚中有柔。'
		},
		{
			name: 'taichi_single_whip',
			label: '单鞭',
			description: '一手勾，一手推，刚柔并济',
			icon: '🥋',
			philosophy: '单鞭如长虹饮涧，展现了太极中攻防一体的理念，一手防守，一手进攻，阴阳平衡。'
		},
		{
			name: 'taichi_white_crane',
			label: '白鹤亮翅',
			description: '轻灵飘逸，如仙鹤临水照影',
			icon: '🕊️',
			philosophy: '白鹤展翅象征着超然脱俗，轻灵优雅，体现了太极追求的天人合一境界。'
		}
	];

	let currentMove = null;
	let isAutoPlay = false;
	let autoPlayInterval = null;

	onMount(() => {
		// 清理定时器
		return () => {
			if (autoPlayInterval) {
				clearInterval(autoPlayInterval);
			}
		};
	});

	/**
	 * 播放指定的太极动作
	 */
	async function playTaichiMove(move) {
		currentMove = move;
		
		if (avatarComponent) {
			avatarComponent.playAnimation(move.name);
		}
		
		// 显示动作描述
		console.log(`🥋 正在演示: ${move.label} - ${move.description}`);
	}

	/**
	 * 开始自动演示
	 */
	function startAutoDemo() {
		if (isAutoPlay) return;
		
		isAutoPlay = true;
		let currentIndex = 0;
		
		// 立即播放第一个动作
		playTaichiMove(taichiMoves[currentIndex]);
		
		autoPlayInterval = setInterval(() => {
			currentIndex = (currentIndex + 1) % taichiMoves.length;
			playTaichiMove(taichiMoves[currentIndex]);
		}, 8000); // 每8秒切换一个动作
	}

	/**
	 * 停止自动演示
	 */
	function stopAutoDemo() {
		isAutoPlay = false;
		if (autoPlayInterval) {
			clearInterval(autoPlayInterval);
			autoPlayInterval = null;
		}
		currentMove = null;
	}
</script>

<svelte:head>
	<title>太极演示 - 交个神仙朋友</title>
	<meta name="description" content="体验传统太极拳动作，感受中华武术的魅力" />
</svelte:head>

<div class="taichi-demo-page">
	<header class="demo-header">
		<h1>🥋 太极演示</h1>
		<p>体验传统太极拳的优雅与哲学</p>
	</header>

	<div class="demo-content">
		<!-- 3D演示区域 -->
		<div class="avatar-section">
			<div class="avatar-container">
				<DivineAvatar 
					bind:this={avatarComponent}
					{divineType}
					{emotion}
					{isSpeaking}
					{useVRM}
					{selectedVRM}
					{showControls}
					autoRotate={false}
				/>
			</div>
			
			<!-- 当前动作信息 -->
			{#if currentMove}
				<div class="current-move-info">
					<div class="move-title">
						<span class="move-icon">{currentMove.icon}</span>
						<span class="move-name">{currentMove.label}</span>
					</div>
					<p class="move-description">{currentMove.description}</p>
				</div>
			{/if}
		</div>

		<!-- 控制面板 -->
		<div class="controls-panel">
			<!-- 自动演示控制 -->
			<div class="auto-control">
				<h3>自动演示</h3>
				<button 
					class="auto-btn {isAutoPlay ? 'stop' : 'start'}"
					on:click={isAutoPlay ? stopAutoDemo : startAutoDemo}
				>
					{isAutoPlay ? '停止演示' : '开始演示'}
				</button>
			</div>

			<!-- 太极动作选择 -->
			<div class="moves-selection">
				<h3>太极动作</h3>
				<div class="moves-grid">
					{#each taichiMoves as move}
						<button 
							class="move-card {currentMove?.name === move.name ? 'active' : ''}"
							on:click={() => playTaichiMove(move)}
						>
							<div class="move-header">
								<span class="move-icon">{move.icon}</span>
								<span class="move-label">{move.label}</span>
							</div>
							<p class="move-desc">{move.description}</p>
						</button>
					{/each}
				</div>
			</div>

			<!-- 太极哲学 -->
			{#if currentMove}
				<div class="philosophy-section">
					<h3>动作内涵</h3>
					<div class="philosophy-card">
						<p>{currentMove.philosophy}</p>
					</div>
				</div>
			{/if}

			<!-- 模型设置 -->
			<div class="model-settings">
				<h3>模型设置</h3>
				<div class="setting-group">
					<label>VRM模型:</label>
					<select bind:value={selectedVRM}>
						<option value="aili.vrm">Aili</option>
						<option value="hailey.vrm">Hailey</option>
						<option value="god.vrm">神仙</option>
					</select>
				</div>
			</div>
		</div>
	</div>

	<!-- 太极介绍 -->
	<div class="taichi-intro">
		<h2>太极拳简介</h2>
		<div class="intro-content">
			<p>太极拳是中华武术的瑰宝，以柔克刚，以静制动，体现了中国古代哲学中的阴阳学说。</p>
			<p>每个动作都蕴含着深刻的哲理，不仅能强身健体，更能修身养性，达到身心和谐的境界。</p>
		</div>
	</div>
</div>

<style>
	.taichi-demo-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #2C1810 0%, #4A2C20 50%, #6B4226 100%);
		color: #fff;
		padding: 20px;
	}

	.demo-header {
		text-align: center;
		margin-bottom: 30px;
	}

	.demo-header h1 {
		font-size: 2.5rem;
		margin-bottom: 10px;
		background: linear-gradient(45deg, #D4AF37, #FFD700);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.demo-header p {
		font-size: 1.1rem;
		opacity: 0.9;
	}

	.demo-content {
		display: grid;
		grid-template-columns: 1fr 400px;
		gap: 30px;
		max-width: 1400px;
		margin: 0 auto;
	}

	.avatar-section {
		position: relative;
	}

	.avatar-container {
		height: 600px;
		border-radius: 15px;
		overflow: hidden;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
		border: 2px solid rgba(212, 175, 55, 0.3);
	}

	.current-move-info {
		position: absolute;
		bottom: 20px;
		left: 20px;
		right: 20px;
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(10px);
		border-radius: 12px;
		padding: 15px;
		border: 1px solid rgba(212, 175, 55, 0.3);
	}

	.move-title {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 8px;
	}

	.move-icon {
		font-size: 1.5rem;
	}

	.move-name {
		font-size: 1.2rem;
		font-weight: 600;
		color: #D4AF37;
	}

	.move-description {
		font-size: 0.9rem;
		opacity: 0.9;
		margin: 0;
	}

	.controls-panel {
		display: flex;
		flex-direction: column;
		gap: 25px;
	}

	.auto-control, .moves-selection, .philosophy-section, .model-settings {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		padding: 20px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.auto-control h3, .moves-selection h3, .philosophy-section h3, .model-settings h3 {
		margin: 0 0 15px 0;
		font-size: 1.1rem;
		color: #D4AF37;
	}

	.auto-btn {
		width: 100%;
		padding: 12px;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.auto-btn.start {
		background: linear-gradient(135deg, #4CAF50, #45a049);
		color: white;
	}

	.auto-btn.stop {
		background: linear-gradient(135deg, #f44336, #da190b);
		color: white;
	}

	.auto-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
	}

	.moves-grid {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.move-card {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(212, 175, 55, 0.2);
		border-radius: 10px;
		padding: 15px;
		cursor: pointer;
		transition: all 0.3s ease;
		text-align: left;
	}

	.move-card:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(212, 175, 55, 0.4);
		transform: translateY(-2px);
	}

	.move-card.active {
		background: rgba(212, 175, 55, 0.2);
		border-color: rgba(212, 175, 55, 0.6);
	}

	.move-header {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 8px;
	}

	.move-label {
		font-weight: 600;
		color: #D4AF37;
	}

	.move-desc {
		font-size: 0.9rem;
		opacity: 0.8;
		margin: 0;
	}

	.philosophy-card {
		background: rgba(212, 175, 55, 0.1);
		border-radius: 8px;
		padding: 15px;
		border-left: 4px solid #D4AF37;
	}

	.philosophy-card p {
		margin: 0;
		font-style: italic;
		line-height: 1.5;
	}

	.setting-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.setting-group label {
		font-weight: 500;
		color: #D4AF37;
	}

	.setting-group select {
		padding: 8px 12px;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 6px;
		background: rgba(0, 0, 0, 0.3);
		color: #fff;
		font-size: 14px;
	}

	.taichi-intro {
		max-width: 800px;
		margin: 50px auto 0;
		text-align: center;
	}

	.taichi-intro h2 {
		font-size: 2rem;
		color: #D4AF37;
		margin-bottom: 20px;
	}

	.intro-content {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		padding: 25px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.intro-content p {
		font-size: 1.1rem;
		line-height: 1.6;
		margin-bottom: 15px;
		opacity: 0.9;
	}

	.intro-content p:last-child {
		margin-bottom: 0;
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.demo-content {
			grid-template-columns: 1fr;
			gap: 20px;
		}

		.avatar-container {
			height: 400px;
		}

		.demo-header h1 {
			font-size: 2rem;
		}
	}
</style> 