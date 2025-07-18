<!-- 新的极简主页设计 -->
<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { userSession, trackEvent } from '$lib/stores/appState.js';

	let isReady = false;
	let currentTime = '';
	let greeting = '';

	onMount(() => {
		if (browser) {
			isReady = true;
			updateTime();
			setInterval(updateTime, 1000);
			generateGreeting();

			// 预加载关键资源
			preloadAssets();
		}
	});

	function updateTime() {
		const now = new Date();
		currentTime = now.toLocaleTimeString('zh-CN', { 
			hour: '2-digit', 
			minute: '2-digit' 
		});
	}

	function generateGreeting() {
		const hour = new Date().getHours();
		if (hour < 6) greeting = '夜深了，愿你安眠';
		else if (hour < 12) greeting = '愿你有个美好的上午';
		else if (hour < 18) greeting = '愿午后时光温暖如春';
		else greeting = '愿晚霞为你带来宁静';
	}

	async function preloadAssets() {
		// 预加载关键页面
		const pages = ['/awake', '/breathe', '/mirror'];
		pages.forEach(page => {
			const link = document.createElement('link');
			link.rel = 'prefetch';
			link.href = page;
			document.head.appendChild(link);
		});
	}

	// 主要入口 - 开始体验
	function startExperience() {
		trackEvent('experience_start', { 
			time: new Date().toISOString(),
			source: 'homepage'
		});
		
		// 直接进入时长选择
		goto('/awake');
	}

	// NFC 扫描入口
	function scanBracelet() {
		trackEvent('nfc_scan_attempt', { source: 'homepage' });
		goto('/sanctify');
	}

	// 快速情绪急救
	function quickRescue() {
		userSession.update(session => ({ ...session, duration: 30 }));
		trackEvent('quick_rescue', { duration: 30 });
		goto('/breathe');
	}

	// 太极演示
	function goToTaichiDemo() {
		trackEvent('taichi_demo_click', { source: 'homepage' });
		goto('/taichi-demo');
	}
</script>

<svelte:head>
	<title>交个神仙朋友 - 千年古寺开光沉香手串</title>
	<meta name="description" content="30秒生成AI神仙人格，离线终身陪伴。一条开光手串，一位专属神仙。" />
</svelte:head>

<!-- 主容器 -->
<div class="home-container">
	<!-- 背景粒子效果 -->
	<div class="particles" aria-hidden="true">
		{#each Array(12) as _, i}
			<div class="particle" style="--delay: {i * 0.8}s; --duration: {8 + i}s;"></div>
		{/each}
	</div>

	<!-- 主内容 -->
	<main class="main-content">
		<!-- 头部时间和问候 -->
		<header class="app-header">
			<div class="time-display" class:visible={isReady}>
				<span class="time">{currentTime}</span>
			</div>
			<h1 class="greeting" class:visible={isReady}>
				{greeting}
			</h1>
		</header>

		<!-- 核心标题 -->
		<div class="hero-section">
			<div class="app-icon">🌟</div>
			<h2 class="app-title">交个神仙朋友</h2>
			<p class="app-subtitle">千年古寺开光的沉香手串<br/>30秒生成专属AI神仙人格</p>
		</div>

		<!-- 主要操作按钮 -->
		<div class="action-section">
			<!-- 主要入口 -->
			<button class="primary-action" on:click={startExperience}>
				<div class="action-icon">✨</div>
				<div class="action-content">
					<span class="action-title">开始体验</span>
					<span class="action-desc">选择时长，开启心灵之旅</span>
				</div>
				<div class="action-arrow">→</div>
			</button>

			<!-- 快捷操作 -->
			<div class="quick-actions">
				<button class="quick-action emergency" on:click={quickRescue}>
					<span class="quick-icon">⚡</span>
					<span class="quick-text">30秒<br/>急救</span>
				</button>

				<button class="quick-action scan" on:click={scanBracelet}>
					<span class="quick-icon">📿</span>
					<span class="quick-text">扫码<br/>验真</span>
				</button>
			</div>
		</div>

		<!-- 特色说明 -->
		<div class="features-hint">
			<div class="feature-item">
				<span class="feature-icon">🎭</span>
				<span class="feature-text">3D神仙形象</span>
			</div>
			<div class="feature-item">
				<span class="feature-icon">🗣️</span>
				<span class="feature-text">智能语音对话</span>
			</div>
			<div class="feature-item">
				<span class="feature-icon">💫</span>
				<span class="feature-text">情绪急救疗愈</span>
			</div>
		</div>

		<!-- 太极演示入口 -->
		<div class="taichi-entry">
			<button class="taichi-demo-btn" on:click={goToTaichiDemo}>
				<span class="taichi-icon">🥋</span>
				<span class="taichi-text">太极演示</span>
				<span class="taichi-desc">观神仙打太极</span>
			</button>
		</div>

		<!-- 底部说明 -->
		<footer class="app-footer">
			<p class="footer-text">
				离线可用 · 隐私保护 · 永久免费
			</p>
		</footer>
	</main>
</div>

<style>
	.home-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background: radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 100%);
		position: relative;
		overflow: hidden;
	}

	/* 背景粒子 */
	.particles {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.particle {
		position: absolute;
		width: 2px;
		height: 2px;
		background: rgba(255, 215, 0, 0.3);
		border-radius: 50%;
		animation: float var(--duration, 10s) infinite ease-in-out;
		animation-delay: var(--delay, 0s);
	}

	.particle:nth-child(odd) {
		left: 20%;
		background: rgba(255, 215, 0, 0.2);
	}

	.particle:nth-child(even) {
		right: 20%;
		background: rgba(255, 255, 255, 0.1);
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(100vh) scale(0);
			opacity: 0;
		}
		50% {
			transform: translateY(50vh) scale(1);
			opacity: 1;
		}
	}

	/* 主内容 */
	.main-content {
		max-width: 400px;
		width: 100%;
		text-align: center;
		z-index: 1;
	}

	/* 头部 */
	.app-header {
		margin-bottom: 2rem;
	}

	.time-display {
		opacity: 0;
		transform: translateY(-10px);
		transition: all 0.6s ease;
		margin-bottom: 0.5rem;
	}

	.time-display.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.time {
		font-size: 1.5rem;
		font-weight: 300;
		color: rgba(255, 215, 0, 0.8);
		font-family: 'SF Mono', 'Monaco', monospace;
	}

	.greeting {
		font-size: 1rem;
		font-weight: 300;
		color: rgba(255, 255, 255, 0.6);
		margin: 0;
		opacity: 0;
		transform: translateY(-10px);
		transition: all 0.8s ease 0.2s;
	}

	.greeting.visible {
		opacity: 1;
		transform: translateY(0);
	}

	/* 英雄区域 */
	.hero-section {
		margin-bottom: 3rem;
	}

	.app-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		animation: glow 3s ease-in-out infinite alternate;
	}

	@keyframes glow {
		from {
			filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3));
		}
		to {
			filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6));
		}
	}

	.app-title {
		font-size: 2rem;
		font-weight: 600;
		color: #ffd700;
		margin: 0 0 1rem 0;
		background: linear-gradient(135deg, #ffd700, #ffed4a);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.app-subtitle {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.7);
		line-height: 1.5;
		margin: 0;
	}

	/* 操作区域 */
	.action-section {
		margin-bottom: 3rem;
	}

	.primary-action {
		width: 100%;
		display: flex;
		align-items: center;
		padding: 1.25rem 1.5rem;
		background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
		border: 1px solid rgba(255, 215, 0, 0.3);
		border-radius: 16px;
		color: white;
		margin-bottom: 1.5rem;
		transition: all 0.3s ease;
		cursor: pointer;
		backdrop-filter: blur(10px);
	}

	.primary-action:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2);
		border-color: rgba(255, 215, 0, 0.5);
	}

	.primary-action:active {
		transform: translateY(0);
	}

	.action-icon {
		font-size: 1.5rem;
		margin-right: 1rem;
	}

	.action-content {
		flex: 1;
		text-align: left;
	}

	.action-title {
		display: block;
		font-size: 1.1rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.action-desc {
		display: block;
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.6);
	}

	.action-arrow {
		font-size: 1.2rem;
		color: rgba(255, 215, 0, 0.7);
	}

	/* 快捷操作 */
	.quick-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.quick-action {
		padding: 1rem;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.05);
		color: white;
		transition: all 0.3s ease;
		cursor: pointer;
		backdrop-filter: blur(5px);
	}

	.quick-action:hover {
		transform: translateY(-2px);
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.quick-action.emergency {
		border-color: rgba(239, 68, 68, 0.3);
		background: rgba(239, 68, 68, 0.1);
	}

	.quick-action.emergency:hover {
		border-color: rgba(239, 68, 68, 0.5);
		background: rgba(239, 68, 68, 0.15);
	}

	.quick-action.scan {
		border-color: rgba(34, 197, 94, 0.3);
		background: rgba(34, 197, 94, 0.1);
	}

	.quick-action.scan:hover {
		border-color: rgba(34, 197, 94, 0.5);
		background: rgba(34, 197, 94, 0.15);
	}

	.quick-icon {
		display: block;
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.quick-text {
		font-size: 0.8rem;
		line-height: 1.2;
	}

	/* 特色说明 */
	.features-hint {
		display: flex;
		justify-content: space-around;
		margin-bottom: 2rem;
		opacity: 0.7;
	}

	.feature-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.feature-icon {
		font-size: 1.2rem;
	}

	.feature-text {
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.6);
	}

	/* 太极演示入口 */
	.taichi-entry {
		margin: 1.5rem 0;
		display: flex;
		justify-content: center;
	}

	.taichi-demo-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 1.5rem;
		background: linear-gradient(135deg, #8B4513, #CD853F);
		border: none;
		border-radius: 12px;
		color: #fff;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
	}

	.taichi-demo-btn:hover {
		transform: translateY(-3px);
		box-shadow: 0 6px 20px rgba(139, 69, 19, 0.4);
		background: linear-gradient(135deg, #A0522D, #DEB887);
	}

	.taichi-icon {
		font-size: 1.5rem;
	}

	.taichi-text {
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
	}

	.taichi-desc {
		font-size: 0.8rem;
		opacity: 0.9;
		margin: 0;
	}

	/* 底部 */
	.app-footer {
		opacity: 0.5;
	}

	.footer-text {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.5);
		margin: 0;
	}

	/* 响应式设计 */
	@media (max-width: 480px) {
		.home-container {
			padding: 0.5rem;
		}

		.app-title {
			font-size: 1.75rem;
		}

		.app-subtitle {
			font-size: 0.85rem;
		}

		.primary-action {
			padding: 1rem 1.25rem;
		}

		.features-hint {
			flex-direction: column;
			gap: 0.5rem;
			align-items: center;
		}

		.feature-item {
			flex-direction: row;
			gap: 0.5rem;
		}
	}

	/* 无障碍支持 */
	@media (prefers-reduced-motion: reduce) {
		.particle {
			animation: none;
		}

		.app-icon {
			animation: none;
		}

		.time-display,
		.greeting {
			transition: none;
		}
	}

	/* 暗色主题适配 */
	@media (prefers-color-scheme: light) {
		.home-container {
			background: radial-gradient(ellipse at center, #f8fafc 0%, #e2e8f0 100%);
		}

		.time {
			color: rgba(180, 83, 9, 0.8);
		}

		.greeting {
			color: rgba(0, 0, 0, 0.6);
		}

		.app-title {
			background: linear-gradient(135deg, #d97706, #f59e0b);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}

		.app-subtitle {
			color: rgba(0, 0, 0, 0.7);
		}

		.primary-action {
			background: linear-gradient(135deg, rgba(180, 83, 9, 0.1), rgba(180, 83, 9, 0.05));
			border-color: rgba(180, 83, 9, 0.3);
			color: #1f2937;
		}

		.action-desc {
			color: rgba(0, 0, 0, 0.6);
		}

		.quick-action {
			background: rgba(0, 0, 0, 0.05);
			border-color: rgba(0, 0, 0, 0.1);
			color: #1f2937;
		}

		.footer-text {
			color: rgba(0, 0, 0, 0.5);
		}
	}
</style> 