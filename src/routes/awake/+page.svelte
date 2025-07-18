<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { userSession, trackEvent } from '$lib/stores/appState.js';

	let selectedDuration = null;
	let isAnimating = false;

	// 推荐的时长配置
	const durations = [
		{
			value: 30,
			title: '快速急救',
			subtitle: '忙碌时刻',
			description: '8秒引导 + 22秒静心',
			icon: '⚡',
			color: 'emergency',
			features: ['极速缓解', '即时效果', '随时可用']
		},
		{
			value: 60,
			title: '深度放松',
			subtitle: '黄金时长',
			description: '15秒引导 + 45秒呼吸',
			icon: '🌸',
			color: 'recommended',
			isRecommended: true,
			features: ['平衡效果', '深度疗愈', '最受欢迎']
		},
		{
			value: 90,
			title: '完整冥想',
			subtitle: '充分体验',
			description: '25秒引导 + 65秒冥想',
			icon: '🧘',
			color: 'premium',
			features: ['全面净化', '深层疗愈', '心灵重塑']
		}
	];

	onMount(() => {
		if (browser) {
			trackEvent('page_view', { page: 'awake' });
		}
	});

	function selectDuration(duration) {
		if (isAnimating) return;
		
		selectedDuration = duration;
		isAnimating = true;
		
		if (browser) {
			// 保存选择到用户会话
			userSession.update(session => ({
				...session,
				duration
			}));

			trackEvent('duration_select', { 
				duration,
				timestamp: Date.now()
			});
		}
		
		// 给用户视觉反馈后跳转
		setTimeout(() => {
			goto('/breathe');
		}, 800);
	}

	function goBack() {
		goto('/');
	}
</script>

<svelte:head>
	<title>选择体验时长 - 交个神仙朋友</title>
	<meta name="description" content="选择您的情绪急救体验时长：30秒极速急救、60秒深度放松或90秒完整冥想" />
</svelte:head>

<div class="awake-container">
	<!-- 背景装饰 -->
	<div class="bg-decoration" aria-hidden="true">
		<div class="floating-element" style="--delay: 0s; --x: 20%; --y: 30%;"></div>
		<div class="floating-element" style="--delay: 2s; --x: 80%; --y: 70%;"></div>
		<div class="floating-element" style="--delay: 4s; --x: 60%; --y: 20%;"></div>
	</div>

	<!-- 主内容 -->
	<main class="main-content">
		<!-- 返回按钮 -->
		<button class="back-button" on:click={goBack} aria-label="返回首页">
			<span class="back-icon">←</span>
		</button>

		<!-- 页面标题 -->
		<header class="page-header">
			<h1 class="page-title">选择体验时长</h1>
			<p class="page-subtitle">
				根据您的时间安排，选择最适合的神仙陪伴时长
			</p>
		</header>

		<!-- 时长选择卡片 -->
		<div class="duration-cards">
			{#each durations as duration, index}
				<button 
					class="duration-card {duration.color} {selectedDuration === duration.value ? 'selected' : ''}"
					class:disabled={isAnimating}
					on:click={() => selectDuration(duration.value)}
					style="--animation-delay: {index * 0.1}s"
				>
					<!-- 推荐标识 -->
					{#if duration.isRecommended}
						<div class="recommended-badge">
							<span class="badge-text">推荐</span>
						</div>
					{/if}

					<!-- 卡片内容 -->
					<div class="card-icon">{duration.icon}</div>
					
					<div class="card-header">
						<div class="duration-number">{duration.value}s</div>
						<h3 class="card-title">{duration.title}</h3>
						<p class="card-subtitle">{duration.subtitle}</p>
					</div>

					<div class="card-description">
						<p class="description-text">{duration.description}</p>
					</div>

					<div class="card-features">
						{#each duration.features as feature}
							<span class="feature-tag">{feature}</span>
						{/each}
					</div>

					<!-- 选择状态指示 -->
					{#if selectedDuration === duration.value}
						<div class="selection-indicator">
							<span class="check-icon">✓</span>
						</div>
					{/if}
				</button>
			{/each}
		</div>

		<!-- 底部说明 -->
		<footer class="page-footer">
			<p class="footer-text">
				💡 体验结束后可重新选择时长
			</p>
		</footer>
	</main>
</div>

<style>
	.awake-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
		position: relative;
		overflow: hidden;
	}

	/* 背景装饰 */
	.bg-decoration {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.floating-element {
		position: absolute;
		width: 100px;
		height: 100px;
		background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
		border-radius: 50%;
		left: var(--x);
		top: var(--y);
		animation: floating 6s ease-in-out infinite;
		animation-delay: var(--delay);
	}

	@keyframes floating {
		0%, 100% {
			transform: translate(0, 0) scale(1);
			opacity: 0.3;
		}
		50% {
			transform: translate(-20px, -30px) scale(1.1);
			opacity: 0.6;
		}
	}

	/* 主内容 */
	.main-content {
		max-width: 800px;
		width: 100%;
		position: relative;
		z-index: 1;
	}

	/* 返回按钮 */
	.back-button {
		position: absolute;
		top: -60px;
		left: 0;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		padding: 0.75rem 1rem;
		color: rgba(255, 255, 255, 0.8);
		cursor: pointer;
		transition: all 0.3s ease;
		backdrop-filter: blur(10px);
	}

	.back-button:hover {
		background: rgba(255, 255, 255, 0.15);
		transform: translateX(-2px);
	}

	.back-icon {
		font-size: 1.2rem;
		font-weight: bold;
	}

	/* 页面标题 */
	.page-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.page-title {
		font-size: 2.5rem;
		font-weight: 600;
		color: #ffd700;
		margin: 0 0 1rem 0;
		background: linear-gradient(135deg, #ffd700, #ffed4a);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.page-subtitle {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.7);
		margin: 0;
		line-height: 1.5;
	}

	/* 时长卡片 */
	.duration-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.duration-card {
		position: relative;
		padding: 2rem 1.5rem;
		background: rgba(0, 0, 0, 0.4);
		border: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: 20px;
		cursor: pointer;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		text-align: center;
		backdrop-filter: blur(10px);
		animation: cardSlideIn 0.6s ease-out forwards;
		animation-delay: var(--animation-delay);
		opacity: 0;
		transform: translateY(30px);
	}

	@keyframes cardSlideIn {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.duration-card:hover {
		transform: translateY(-8px) scale(1.02);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
	}

	.duration-card.selected {
		transform: translateY(-8px) scale(1.05);
		animation: pulse 0.8s ease-in-out;
	}

	@keyframes pulse {
		0%, 100% {
			box-shadow: 0 20px 40px rgba(255, 215, 0, 0.3);
		}
		50% {
			box-shadow: 0 25px 50px rgba(255, 215, 0, 0.5);
		}
	}

	.duration-card.disabled {
		pointer-events: none;
		opacity: 0.7;
	}

	/* 紧急模式样式 */
	.duration-card.emergency:hover {
		border-color: rgba(239, 68, 68, 0.6);
		box-shadow: 0 20px 40px rgba(239, 68, 68, 0.2);
	}

	.duration-card.emergency.selected {
		border-color: rgba(239, 68, 68, 0.8);
		box-shadow: 0 25px 50px rgba(239, 68, 68, 0.4);
	}

	/* 推荐模式样式 */
	.duration-card.recommended {
		border-color: rgba(255, 215, 0, 0.4);
		background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
	}

	.duration-card.recommended:hover {
		border-color: rgba(255, 215, 0, 0.7);
		box-shadow: 0 20px 40px rgba(255, 215, 0, 0.3);
	}

	.duration-card.recommended.selected {
		border-color: rgba(255, 215, 0, 0.9);
		box-shadow: 0 25px 50px rgba(255, 215, 0, 0.5);
	}

	/* 高级模式样式 */
	.duration-card.premium:hover {
		border-color: rgba(147, 51, 234, 0.6);
		box-shadow: 0 20px 40px rgba(147, 51, 234, 0.2);
	}

	.duration-card.premium.selected {
		border-color: rgba(147, 51, 234, 0.8);
		box-shadow: 0 25px 50px rgba(147, 51, 234, 0.4);
	}

	/* 推荐标识 */
	.recommended-badge {
		position: absolute;
		top: -8px;
		right: 1rem;
		background: linear-gradient(135deg, #ffd700, #ffed4a);
		color: #000;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
		box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
	}

	/* 卡片内容 */
	.card-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
	}

	.card-header {
		margin-bottom: 1.5rem;
	}

	.duration-number {
		font-size: 2.5rem;
		font-weight: 700;
		color: #ffd700;
		margin-bottom: 0.5rem;
		font-family: 'SF Mono', 'Monaco', monospace;
	}

	.card-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: white;
		margin: 0 0 0.25rem 0;
	}

	.card-subtitle {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.6);
		margin: 0;
	}

	.card-description {
		margin-bottom: 1.5rem;
	}

	.description-text {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.7);
		line-height: 1.4;
		margin: 0;
	}

	/* 特性标签 */
	.card-features {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
	}

	.feature-tag {
		font-size: 0.7rem;
		padding: 0.25rem 0.5rem;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 8px;
		color: rgba(255, 255, 255, 0.8);
	}

	/* 选择指示器 */
	.selection-indicator {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 32px;
		height: 32px;
		background: #ffd700;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: checkAppear 0.3s ease-out;
	}

	@keyframes checkAppear {
		from {
			transform: scale(0);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.check-icon {
		color: #000;
		font-weight: bold;
		font-size: 1rem;
	}

	/* 页面底部 */
	.page-footer {
		text-align: center;
		opacity: 0.7;
	}

	.footer-text {
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.6);
		margin: 0;
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.duration-cards {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.page-title {
			font-size: 2rem;
		}

		.duration-card {
			padding: 1.5rem 1rem;
		}

		.back-button {
			top: -50px;
		}
	}

	@media (max-width: 480px) {
		.awake-container {
			padding: 0.5rem;
		}

		.page-title {
			font-size: 1.75rem;
		}

		.page-subtitle {
			font-size: 0.9rem;
		}

		.duration-card {
			padding: 1.25rem 1rem;
		}

		.card-icon {
			font-size: 2.5rem;
		}

		.duration-number {
			font-size: 2rem;
		}
	}

	/* 无障碍支持 */
	@media (prefers-reduced-motion: reduce) {
		.floating-element {
			animation: none;
		}

		.duration-card {
			animation: none;
			opacity: 1;
			transform: translateY(0);
		}

		.duration-card:hover {
			transform: none;
		}
	}

	/* 键盘导航支持 */
	.duration-card:focus {
		outline: 2px solid #ffd700;
		outline-offset: 2px;
	}
</style> 