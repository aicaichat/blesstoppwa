<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { awakeState, userSession, trackEvent } from '$lib/stores/appState.js';

	// 安全的状态订阅，防止SSR错误
	let state = {
		status: 'loading',
		particlesLoaded: false,
		selectedDuration: null
	};

	// 只在浏览器环境中订阅store
	$: if (browser) {
		try {
			state = $awakeState;
		} catch (e) {
			console.warn('Store access error:', e);
		}
	}

	let selectedDuration = null;
	let particles = [];

	onMount(() => {
		if (browser) {
			trackEvent('page_view', { page: 'awake' });
			
			// 简化的粒子效果
			initParticles();
			
			try {
				awakeState.update(s => ({ ...s, status: 'ready', particlesLoaded: true }));
			} catch (e) {
				console.warn('Store update error:', e);
			}
		}
	});

	function initParticles() {
		// 创建简单的CSS动画粒子
		for (let i = 0; i < 20; i++) {
			particles.push({
				id: i,
				x: Math.random() * 100,
				y: Math.random() * 100,
				delay: Math.random() * 4,
				duration: 3 + Math.random() * 2
			});
		}
	}

	function selectDuration(duration) {
		selectedDuration = duration;
		
		if (browser) {
			try {
				awakeState.update(s => ({ ...s, status: 'selected', selectedDuration: duration }));
				
				// 保存到用户会话
				userSession.update(session => ({
					...session,
					duration
				}));

				trackEvent('duration_select', { duration });
			} catch (e) {
				console.warn('Store update error:', e);
			}
		}
		
		// 延迟跳转，给用户确认感
		setTimeout(() => {
			goto('/breathe');
		}, 500);
	}
</script>

<svelte:head>
	<title>选择体验时长 - 交个神仙朋友</title>
	<meta name="description" content="选择您的情绪急救体验时长：30秒、60秒或90秒" />
</svelte:head>

<!-- 粒子背景 -->
<div class="particles-container">
	{#each particles as particle}
		<div 
			class="particle"
			style="
				left: {particle.x}%;
				top: {particle.y}%;
				animation-delay: {particle.delay}s;
				animation-duration: {particle.duration}s;
			"
		></div>
	{/each}
</div>

<div class="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
	<!-- 顶部标题 -->
	<div class="text-center mb-12">
		<h1 class="text-3xl md:text-5xl font-bold gradient-text mb-4">
			选择体验时长
		</h1>
		<p class="text-lg text-yellow-200 opacity-80">
			根据您的需求选择适合的时长
		</p>
	</div>

	<!-- 加载状态 -->
	{#if state.status === 'loading'}
		<div class="text-center">
			<div class="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
			<p class="text-yellow-200">正在准备体验环境...</p>
		</div>
	{/if}

	<!-- 时长选择卡片 -->
	{#if state.status === 'ready' || state.status === 'selected'}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8">
			<!-- 30秒卡片 -->
			<button
				on:click={() => selectDuration(30)}
				disabled={selectedDuration !== null}
				class="duration-card {selectedDuration === 30 ? 'selected' : ''}"
			>
				<div class="duration-number">30s</div>
				<h3 class="text-xl font-semibold text-yellow-100 mb-2">快速急救</h3>
				<p class="text-yellow-200/80 text-sm mb-4">
					适合忙碌时刻，快速缓解焦虑情绪
				</p>
				<div class="features">
					<div class="feature">✨ 8秒引导</div>
					<div class="feature">🧘 22秒静心</div>
					<div class="feature">⚡ 即时效果</div>
				</div>
			</button>

			<!-- 60秒卡片 -->
			<button
				on:click={() => selectDuration(60)}
				disabled={selectedDuration !== null}
				class="duration-card recommended {selectedDuration === 60 ? 'selected' : ''}"
			>
				<div class="recommended-badge">推荐</div>
				<div class="duration-number">60s</div>
				<h3 class="text-xl font-semibold text-yellow-100 mb-2">深度放松</h3>
				<p class="text-yellow-200/80 text-sm mb-4">
					平衡效果与时间，最受欢迎的选择
				</p>
				<div class="features">
					<div class="feature">🎵 15秒引导</div>
					<div class="feature">🌸 45秒呼吸环</div>
					<div class="feature">💫 深度疗愈</div>
				</div>
			</button>

			<!-- 90秒卡片 -->
			<button
				on:click={() => selectDuration(90)}
				disabled={selectedDuration !== null}
				class="duration-card {selectedDuration === 90 ? 'selected' : ''}"
			>
				<div class="duration-number">90s</div>
				<h3 class="text-xl font-semibold text-yellow-100 mb-2">完整冥想</h3>
				<p class="text-yellow-200/80 text-sm mb-4">
					充分的时间，获得最佳的疗愈效果
				</p>
				<div class="features">
					<div class="feature">🔮 25秒引导</div>
					<div class="feature">🌊 65秒冥想</div>
					<div class="feature">🏔️ 完整体验</div>
				</div>
			</button>
		</div>

		<!-- 确认状态 -->
		{#if selectedDuration}
			<div class="text-center">
				<div class="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/50 rounded-full">
					<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
					<span class="text-green-400 font-medium">已选择 {selectedDuration} 秒体验</span>
				</div>
				<p class="text-yellow-300/70 text-sm mt-2">正在准备您的专属体验...</p>
			</div>
		{/if}
	{/if}

	<!-- 底部提示 -->
	<div class="mt-12 text-center text-yellow-300/60 text-sm max-w-2xl">
		<p class="mb-2">💡 小贴士：初次体验建议选择60秒，可以获得更好的效果</p>
		<p>所有体验都支持中途退出，请根据您的时间安排自由选择</p>
	</div>
</div>

<style>
	.gradient-text {
		background: linear-gradient(135deg, #FFD700 0%, #FFF8DC 50%, #DAA520 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.particles-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}

	.particle {
		position: absolute;
		width: 4px;
		height: 4px;
		background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%);
		border-radius: 50%;
		animation: float 4s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% { 
			transform: translateY(0) scale(1);
			opacity: 0.3;
		}
		50% { 
			transform: translateY(-20px) scale(1.2);
			opacity: 0.8;
		}
	}

	.duration-card {
		position: relative;
		backdrop-filter: blur(12px);
		background: rgba(0, 0, 0, 0.4);
		border: 2px solid rgba(255, 215, 0, 0.3);
		border-radius: 1.5rem;
		padding: 2rem;
		text-align: center;
		transition: all 0.3s ease;
		transform: translateY(0);
		cursor: pointer;
	}

	.duration-card:hover:not(:disabled) {
		transform: translateY(-8px);
		border-color: rgba(255, 215, 0, 0.6);
		box-shadow: 0 20px 40px rgba(255, 215, 0, 0.2);
	}

	.duration-card:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.duration-card.selected {
		border-color: #FFD700;
		background: rgba(255, 215, 0, 0.1);
		transform: translateY(-8px) scale(1.02);
		box-shadow: 0 20px 40px rgba(255, 215, 0, 0.3);
	}

	.duration-card.recommended {
		border-color: rgba(255, 215, 0, 0.6);
		background: rgba(255, 215, 0, 0.05);
	}

	.recommended-badge {
		position: absolute;
		top: -10px;
		left: 50%;
		transform: translateX(-50%);
		background: linear-gradient(135deg, #FFD700 0%, #DAA520 100%);
		color: #000;
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 12px;
		font-weight: 600;
	}

	.duration-number {
		font-size: 3rem;
		font-weight: 700;
		background: linear-gradient(135deg, #FFD700 0%, #FFF8DC 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 1rem;
	}

	.features {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.feature {
		padding: 0.5rem;
		background: rgba(255, 215, 0, 0.1);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		color: rgba(255, 248, 220, 0.9);
	}

	@media (prefers-reduced-motion: reduce) {
		.particle,
		.animate-pulse,
		.animate-spin {
			animation: none;
		}
		
		.duration-card {
			transform: none !important;
		}
		
		.duration-card:hover:not(:disabled) {
			transform: none !important;
		}
	}
</style> 