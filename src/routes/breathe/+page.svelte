<script>
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { breatheState, userSession, trackEvent } from '$lib/stores/appState.js';

	// 安全的状态订阅，防止SSR错误
	let state = {
		status: 'idle',
		duration: null,
		startTime: null,
		endTime: null,
		calmScore: null
	};

	// 只在浏览器环境中订阅store
	$: if (browser) {
		try {
			state = $breatheState;
		} catch (e) {
			console.warn('Store access error:', e);
		}
	}

	let timeRemaining = 0;
	let progress = 0;
	let timer = null;
	let breatheRingSize = 100;
	let audioContext = null;
	let narrationText = '';
	let showSkipButton = false;

	const phrases = {
		30: [
			{ time: 0, text: "深呼吸，放下一切焦虑" },
			{ time: 8, text: "感受内心的宁静" },
			{ time: 15, text: "让平静充满身心" },
			{ time: 25, text: "体验圆满的安宁" }
		],
		60: [
			{ time: 0, text: "欢迎来到心灵净土" },
			{ time: 15, text: "跟随呼吸的节奏" },
			{ time: 30, text: "感受金色光芒的护佑" },
			{ time: 45, text: "让慈悲之光净化心灵" },
			{ time: 55, text: "体验完整的宁静" }
		],
		90: [
			{ time: 0, text: "观音无畏布施，护佑众生" },
			{ time: 25, text: "呼吸之间，万法皆空" },
			{ time: 50, text: "金刚般若，智慧现前" },
			{ time: 70, text: "慈悲喜舍，四无量心" },
			{ time: 85, text: "圆满功德，回向众生" }
		]
	};

	onMount(() => {
		if (browser) {
			// 安全地获取 duration
			let duration;
			try {
				duration = $userSession.duration;
			} catch (e) {
				console.warn('Failed to get duration from userSession:', e);
				goto('/awake');
				return;
			}
			
			if (!duration) {
				goto('/awake');
				return;
			}

			trackEvent('page_view', { page: 'breathe', duration });
			startBreathing(duration);
			
			// 3秒后显示跳过按钮
			setTimeout(() => {
				showSkipButton = true;
			}, 3000);
		}
	});

	onDestroy(() => {
		if (timer) {
			clearInterval(timer);
		}
		if (audioContext) {
			audioContext.close();
		}
	});

	function startBreathing(duration) {
		if (browser) {
			try {
				breatheState.update(s => ({ 
					...s, 
					status: 'preparing',
					duration,
					startTime: Date.now()
				}));
			} catch (e) {
				console.warn('Store update error:', e);
			}
		}

		// 模拟资产加载
		setTimeout(() => {
			if (browser) {
				try {
					breatheState.update(s => ({ ...s, status: 'playing' }));
				} catch (e) {
					console.warn('Store update error:', e);
				}
			}
			startTimer(duration);
			startBreathingAnimation();
		}, 1000);
	}

	function startTimer(duration) {
		timeRemaining = duration;
		const startTime = Date.now();
		
		timer = setInterval(() => {
			const elapsed = (Date.now() - startTime) / 1000;
			timeRemaining = Math.max(0, duration - elapsed);
			progress = (elapsed / duration) * 100;
			
			// 更新文案
			updateNarration(elapsed, duration);
			
			if (timeRemaining <= 0) {
				completeBreathing();
			}
		}, 100);
	}

	function updateNarration(elapsed, duration) {
		const currentPhrases = phrases[duration] || phrases[60];
		const currentPhrase = currentPhrases
			.reverse()
			.find(phrase => elapsed >= phrase.time);
		
		if (currentPhrase && currentPhrase.text !== narrationText) {
			narrationText = currentPhrase.text;
			
			// 简化的语音合成
			if ('speechSynthesis' in window) {
				const utterance = new SpeechSynthesisUtterance(currentPhrase.text);
				utterance.lang = 'zh-CN';
				utterance.rate = 0.8;
				utterance.pitch = 0.9;
				speechSynthesis.speak(utterance);
			}
		}
	}

	function startBreathingAnimation() {
		const breatheInterval = setInterval(() => {
			if (state.status !== 'playing') {
				clearInterval(breatheInterval);
				return;
			}
			
			// 呼吸环动画
			const time = Date.now() * 0.001;
			breatheRingSize = 100 + 30 * Math.sin(time * 0.5);
		}, 16);
	}

	function completeBreathing() {
		if (timer) {
			clearInterval(timer);
		}
		
		if (browser) {
			try {
				breatheState.update(s => ({ 
					...s, 
					status: 'completed',
					endTime: Date.now()
				}));

				let duration;
				try {
					duration = $userSession.duration || 30;
				} catch (e) {
					duration = 30;
				}

				trackEvent('breathe_complete', {
					duration: duration,
					actualDuration: (Date.now() - state.startTime) / 1000
				});
			} catch (e) {
				console.warn('Store update error:', e);
			}
		}

		// 简单的效果评估
		setTimeout(showCalmScoreDialog, 1000);
	}

	function showCalmScoreDialog() {
		// 简化的评分对话
		const score = Math.floor(Math.random() * 40) + 60; // 60-100分
		
		if (browser) {
			try {
				breatheState.update(s => ({ 
					...s, 
					status: 'evaluated',
					calmScore: score
				}));

				userSession.update(session => ({
					...session,
					calmScore: score
				}));
			} catch (e) {
				console.warn('Store update error:', e);
			}
		}

		setTimeout(() => {
			goto('/mirror');
		}, 2000);
	}

	function skipBreathing() {
		let currentDuration;
		try {
			if (browser) {
				currentDuration = $userSession.duration;
			}
		} catch (e) {
			currentDuration = 30; // 默认值
		}
		
		if (browser) {
			trackEvent('breathe_early_exit', { 
				duration: currentDuration,
				timeRemaining
			});
		}
		
		completeBreathing();
	}

	function emergencyExit() {
		if (browser) {
			trackEvent('breathe_emergency_exit');
		}
		goto('/');
	}
</script>

<svelte:head>
	<title>情绪急救中 - 交个神仙朋友</title>
	<meta name="description" content="正在进行个性化情绪急救，请保持专注" />
</svelte:head>

<div class="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
	<!-- 准备状态 -->
	{#if state.status === 'preparing'}
		<div class="text-center">
			<div class="relative mb-8">
				<!-- 神性加载环 -->
				<div class="w-32 h-32 mx-auto relative">
					<div class="absolute inset-0 rounded-full border-4 border-divine-aurora/30"></div>
					<div class="absolute inset-0 rounded-full border-4 border-transparent border-t-divine-aurora animate-spin"></div>
					<div class="absolute inset-2 rounded-full border-2 border-divine-ethereal/50 animate-spin" style="animation-direction: reverse; animation-duration: 3s;"></div>
					
					<!-- 中心图标 -->
					<div class="absolute inset-0 flex items-center justify-center">
						<span class="text-4xl animate-cosmic-pulse">🔮</span>
					</div>
				</div>
				
				<!-- 准备状态粒子 -->
				<div class="absolute inset-0 pointer-events-none">
					{#each Array(8) as _, i}
						<div 
							class="absolute w-1 h-1 bg-divine-radiance rounded-full opacity-60 animate-divine-float"
							style="
								top: {50 + Math.sin((i * 45) * Math.PI / 180) * 60}%;
								left: {50 + Math.cos((i * 45) * Math.PI / 180) * 60}%;
								animation-delay: {i * 0.3}s;
							"
						></div>
					{/each}
				</div>
			</div>
			
			<div class="card-mystic p-8 max-w-md mx-auto preparing-glow">
				<h2 class="text-ethereal-title mb-6 animate-mystic-glow">正在准备您的专属体验</h2>
				<div class="space-y-4">
					<div class="flex items-center gap-3 text-radiant-body">
						<span class="text-xl animate-divine-float">✨</span>
						<span>调用古寺开光加持...</span>
					</div>
					<div class="flex items-center gap-3 text-radiant-body opacity-80">
						<span class="text-xl animate-cosmic-pulse">🙏</span>
						<span>连接千年沉香之力...</span>
					</div>
					<div class="flex items-center gap-3 text-radiant-body opacity-60">
						<span class="text-xl animate-ethereal-spin">⚡</span>
						<span>生成专属神仙引导...</span>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- 进行中状态 -->
	{#if state.status === 'playing'}
		<div class="text-center relative">
			<!-- 进度环 -->
			<div class="relative mb-12">
				<svg class="progress-ring w-80 h-80" width="320" height="320" viewBox="0 0 320 320">
					<!-- 背景环 -->
					<circle
						cx="160"
						cy="160"
						r="140"
						stroke="rgba(255, 0, 110, 0.1)"
						stroke-width="6"
						fill="none"
					/>
					<!-- 进度环 */
					<circle
						class="progress-circle"
						cx="160"
						cy="160"
						r="140"
						stroke="url(#progressGradient)"
						stroke-width="6"
						fill="none"
						stroke-dasharray="879.2"
						stroke-dashoffset={879.2 - (progress / 100) * 879.2}
						transform="rotate(-90 160 160)"
					/>
					<!-- SVG 渐变定义 -->
					<defs>
						<linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" style="stop-color: var(--divine-aurora); stop-opacity: 1" />
							<stop offset="25%" style="stop-color: var(--divine-cosmos); stop-opacity: 1" />
							<stop offset="50%" style="stop-color: var(--divine-celestial); stop-opacity: 1" />
							<stop offset="75%" style="stop-color: var(--divine-ethereal); stop-opacity: 1" />
							<stop offset="100%" style="stop-color: var(--divine-radiance); stop-opacity: 1" />
						</linearGradient>
						<filter id="glow">
							<feGaussianBlur stdDeviation="3" result="coloredBlur"/>
							<feMerge> 
								<feMergeNode in="coloredBlur"/>
								<feMergeNode in="SourceGraphic"/>
							</feMerge>
						</filter>
					</defs>
				</svg>
				
				<!-- 呼吸环 - 多层神性光环 -->
				<div class="absolute inset-0 flex items-center justify-center">
					<!-- 主呼吸环 -->
					<div 
						class="breathing-ring-main shadow-divine"
						style="
							width: {breatheRingSize}px;
							height: {breatheRingSize}px;
						"
					></div>
					
					<!-- 神性光环层 -->
					<div 
						class="breathing-ring-aura-1"
						style="
							width: {breatheRingSize * 1.2}px;
							height: {breatheRingSize * 1.2}px;
						"
					></div>
					<div 
						class="breathing-ring-aura-2"
						style="
							width: {breatheRingSize * 1.4}px;
							height: {breatheRingSize * 1.4}px;
						"
					></div>
				</div>
				
				<!-- 时间显示 -->
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="text-center card-divine p-8 rounded-full w-40 h-40 flex flex-col items-center justify-center">
						<div class="text-cosmic-hero text-divine-radiance mb-2">
							{Math.ceil(timeRemaining)}
						</div>
						<div class="text-celestial-subtitle text-divine-ethereal opacity-80">秒</div>
					</div>
				</div>

				<!-- 神性粒子效果 -->
				<div class="absolute inset-0 pointer-events-none">
					{#each Array(12) as _, i}
						<div 
							class="absolute w-2 h-2 bg-divine-radiance rounded-full opacity-60 animate-divine-float"
							style="
								top: {20 + Math.sin((i * 30) * Math.PI / 180) * 120 + Math.random() * 20}px;
								left: {20 + Math.cos((i * 30) * Math.PI / 180) * 120 + Math.random() * 20}px;
								animation-delay: {i * 0.5}s;
								animation-duration: {3 + Math.random() * 2}s;
							"
						></div>
					{/each}
				</div>
			</div>

			<!-- 引导文案 -->
			{#if narrationText}
				<div class="mb-12">
					<div class="card-mystic p-8 mx-auto max-w-2xl hover-divine">
						<p class="text-ethereal-title font-medium text-center animate-mystic-glow">
							{narrationText}
						</p>
					</div>
				</div>
			{/if}

			<!-- 呼吸指导 -->
			<div class="mb-12">
				<div class="inline-flex items-center gap-4 px-8 py-4 glass-divine rounded-2xl">
					<span class="text-3xl animate-cosmic-pulse">🫁</span>
					<p class="text-radiant-body opacity-90">
						跟随圆环的节奏，深深地呼吸
					</p>
					<span class="text-2xl animate-divine-float">✨</span>
				</div>
			</div>
		</div>
	{/if}

	<!-- 完成状态 -->
	{#if state.status === 'completed' || state.status === 'evaluated'}
		<div class="text-center completion-celebration">
			<!-- 庆祝图标群 -->
			<div class="relative mb-8">
				<div class="text-8xl mb-4 animate-mystic-glow">🙏</div>
				
				<!-- 庆祝粒子爆发 -->
				<div class="absolute inset-0 pointer-events-none">
					{#each Array(16) as _, i}
						<div 
							class="absolute w-1.5 h-1.5 rounded-full opacity-80 animate-divine-float"
							class:bg-divine-aurora={i % 4 === 0}
							class:bg-divine-ethereal={i % 4 === 1}
							class:bg-divine-radiance={i % 4 === 2}
							class:bg-divine-cosmos={i % 4 === 3}
							style="
								top: {30 + Math.sin((i * 22.5) * Math.PI / 180) * 80 + Math.random() * 40}%;
								left: {30 + Math.cos((i * 22.5) * Math.PI / 180) * 80 + Math.random() * 40}%;
								animation-delay: {i * 0.1}s;
								animation-duration: {2 + Math.random() * 2}s;
							"
						></div>
					{/each}
				</div>
			</div>
			
			<h2 class="text-cosmic-hero mb-8 animate-aurora-dance">体验完成</h2>
			
			{#if state.calmScore}
				<!-- 平静指数卡片 -->
				<div class="card-divine max-w-md mx-auto mb-12 brand-glow group">
					<div class="text-center">
						<p class="text-ethereal-title mb-6 group-hover:text-divine-aurora transition-colors duration-500">
							您的平静指数
						</p>
						
						<!-- 分数显示 -->
						<div class="relative mb-6">
							<div class="text-6xl font-bold text-divine-radiance mb-2 animate-cosmic-pulse">
								{state.calmScore}
							</div>
							<div class="text-3xl text-divine-ethereal opacity-80">/100</div>
							
							<!-- 分数光环 -->
							<div class="absolute inset-0 flex items-center justify-center -z-10">
								<div class="w-32 h-32 rounded-full border-2 border-divine-radiance/30 animate-ethereal-spin"></div>
							</div>
						</div>
						
						<!-- 建议文本 -->
						<div class="card-mystic p-6">
							<p class="text-radiant-body opacity-90 leading-relaxed">
								{state.calmScore >= 80 ? '🌟 效果卓越！内心已达到深度宁静状态' : state.calmScore >= 65 ? '✨ 效果良好，身心得到很好的放松' : '🌱 轻微改善，建议继续练习以获得更佳效果'}
							</p>
						</div>
					</div>
				</div>
				
				<!-- 成就徽章 -->
				<div class="mb-8 flex justify-center gap-6 flex-wrap">
					<div class="inline-flex items-center gap-2 px-4 py-2 glass-divine rounded-full">
						<span class="text-divine-radiance animate-mystic-glow">⭐</span>
						<span class="text-divine-ethereal text-sm">深度放松达成</span>
					</div>
					<div class="inline-flex items-center gap-2 px-4 py-2 glass-mystic rounded-full">
						<span class="text-element-wood animate-divine-float">🌿</span>
						<span class="text-radiant-body text-sm">内心平静获得</span>
					</div>
				</div>
			{/if}

			<!-- 连接提示 -->
			<div class="card-mystic p-6 max-w-lg mx-auto mb-8">
				<div class="flex items-center gap-4 justify-center">
					<div class="w-8 h-8 border-2 border-divine-aurora border-t-transparent rounded-full animate-spin"></div>
					<p class="text-ethereal-title animate-mystic-glow">
						正在为您连接AI神仙伴侣...
					</p>
					<span class="text-2xl animate-divine-float">🔮</span>
				</div>
			</div>
		</div>
	{/if}

	<!-- 控制按钮 -->
	{#if state.status === 'playing'}
		<div class="fixed bottom-6 left-0 right-0 flex justify-center gap-4 px-6">
			{#if showSkipButton}
				<button
					on:click={skipBreathing}
					class="px-6 py-3 bg-gray-600/80 text-white rounded-xl hover:bg-gray-500/80 transition-colors"
				>
					跳过 →
				</button>
			{/if}
			
			<button
				on:click={emergencyExit}
				class="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-500/80 transition-colors text-sm"
			>
				紧急退出
			</button>
		</div>
	{/if}

	<!-- 背景效果 -->
	<div class="background-glow"></div>
</div>

<style>
	.progress-circle {
		transition: stroke-dashoffset 0.6s var(--ease-ethereal-float);
		filter: url(#glow);
	}

	.breathing-ring-main {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: 4px solid var(--divine-aurora);
		border-radius: 50%;
		transition: all 0.8s var(--ease-ethereal-float);
		box-shadow: var(--shadow-divine-glow);
		background: radial-gradient(circle, 
			rgba(255, 0, 110, 0.1) 0%, 
			rgba(131, 56, 236, 0.05) 50%, 
			transparent 100%);
	}

	.breathing-ring-aura-1 {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: 2px solid var(--divine-ethereal);
		border-radius: 50%;
		opacity: 0.6;
		animation: divine-pulse-1 4s var(--ease-celestial-pulse) infinite;
	}

	.breathing-ring-aura-2 {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: 1px solid var(--divine-cosmos);
		border-radius: 50%;
		opacity: 0.4;
		animation: divine-pulse-2 6s var(--ease-ethereal-float) infinite;
	}

	@keyframes divine-pulse-1 {
		0%, 100% { 
			transform: translate(-50%, -50%) scale(1);
			opacity: 0.6;
		}
		50% { 
			transform: translate(-50%, -50%) scale(1.1);
			opacity: 0.8;
		}
	}

	@keyframes divine-pulse-2 {
		0%, 100% { 
			transform: translate(-50%, -50%) scale(1);
			opacity: 0.4;
		}
		33% { 
			transform: translate(-50%, -50%) scale(1.15);
			opacity: 0.6;
		}
		66% { 
			transform: translate(-50%, -50%) scale(0.95);
			opacity: 0.3;
		}
	}

	.background-glow {
		position: fixed;
		top: 50%;
		left: 50%;
		width: 600px;
		height: 600px;
		background: var(--gradient-ethereal-mist);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		animation: cosmic-glow-pulse 8s ease-in-out infinite;
		z-index: -2;
		filter: blur(40px);
	}

	@keyframes cosmic-glow-pulse {
		0%, 100% { 
			transform: translate(-50%, -50%) scale(1) rotate(0deg);
			opacity: 0.3;
		}
		33% { 
			transform: translate(-50%, -50%) scale(1.2) rotate(120deg);
			opacity: 0.5;
		}
		66% { 
			transform: translate(-50%, -50%) scale(0.8) rotate(240deg);
			opacity: 0.4;
		}
	}

	/* 呼吸准备状态的特殊效果 */
	.preparing-glow {
		animation: preparing-shimmer 2s ease-in-out infinite;
	}

	@keyframes preparing-shimmer {
		0%, 100% { 
			box-shadow: var(--shadow-cosmic-depth);
		}
		50% { 
			box-shadow: var(--shadow-divine-glow);
		}
	}

	/* 完成状态的庆祝效果 */
	.completion-celebration {
		animation: completion-burst 1.5s var(--ease-mystic-bounce) both;
	}

	@keyframes completion-burst {
		0% { 
			transform: scale(0.8);
			opacity: 0;
		}
		50% { 
			transform: scale(1.1);
			opacity: 1;
		}
		100% { 
			transform: scale(1);
			opacity: 1;
		}
	}

	/* 移动端优化 */
	@media (max-width: 768px) {
		.progress-ring {
			width: 280px !important;
			height: 280px !important;
		}
		
		.breathing-ring-main,
		.breathing-ring-aura-1,
		.breathing-ring-aura-2 {
			border-width: 2px;
		}
		
		.background-glow {
			width: 400px;
			height: 400px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.animate-spin,
		.breathing-ring-main,
		.breathing-ring-aura-1,
		.breathing-ring-aura-2,
		.background-glow,
		.animate-divine-float,
		.animate-cosmic-pulse,
		.animate-mystic-glow {
			animation: none !important;
		}
		
		.progress-circle {
			transition: stroke-dashoffset 0.2s ease;
		}
	}
</style> 