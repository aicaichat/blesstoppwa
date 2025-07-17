<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { userSession, trackEvent, checkCapabilities } from '$lib/stores/appState.js';

	let showNFCPrompt = false;
	let nfcSupported = false;
	let isScanning = false;

	onMount(async () => {
		if (!browser) return;

		// 检查设备能力
		const capabilities = checkCapabilities();
		nfcSupported = capabilities.hasNFC;

		// 性能监控
		trackEvent('page_view', { page: 'home' });
	});

	async function handleNFCTag(message) {
		isScanning = true;
		trackEvent('nfc_scan_start');

		try {
			// 解析 NFC 消息
			const records = message.records;
			let nfcId = null;

			for (const record of records) {
				if (record.recordType === 'url') {
					const url = new TextDecoder().decode(record.data);
					const urlParams = new URLSearchParams(url.split('?')[1]);
					nfcId = urlParams.get('id');
					break;
				}
			}

			if (nfcId) {
				// 跳转到验真页面
				if (browser) {
					try {
						userSession.update(state => ({
							...state,
							nfcId
						}));
					} catch (e) {
						console.warn('Store update error:', e);
					}
				}
				
				trackEvent('nfc_scan_success', { nfcId });
				await goto(`/sanctify?id=${nfcId}`);
			} else {
				throw new Error('Invalid NFC tag format');
			}

		} catch (error) {
			console.error('NFC processing failed:', error);
			trackEvent('nfc_scan_error', { error: error.message });
			showNFCPrompt = true;
		} finally {
			isScanning = false;
		}
	}

	function scanNFC() {
		if (!nfcSupported) {
			// 降级到手动输入
			showNFCPrompt = true;
			return;
		}
		
		// 简化的NFC扫描
		isScanning = true;
		setTimeout(() => {
			isScanning = false;
			showNFCPrompt = true;
		}, 2000);
	}

	function startExperience() {
		trackEvent('manual_start');
		goto('/awake');
	}

	function handleManualId(event) {
		const nfcId = event.target.value.trim();
		if (nfcId.length >= 8) {
			if (browser) {
				try {
					userSession.update(state => ({
						...state,
						nfcId
					}));
				} catch (e) {
					console.warn('Store update error:', e);
				}
			}
			goto(`/sanctify?id=${nfcId}`);
		}
	}
</script>

<svelte:head>
	<title>交个神仙朋友 - 千年古寺开光沉香手串</title>
	<meta name="description" content="碰一碰手串，30秒生成本地AI神仙人格，离线终身陪伴" />
</svelte:head>

<!-- 主要内容 -->
<div class="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
	<!-- 神性装饰元素 -->
	<div class="absolute top-20 left-10 w-32 h-32 animate-divine-float opacity-30">
		<div class="w-full h-full rounded-full bg-gradient-to-br from-divine-aurora to-divine-cosmos shadow-divine"></div>
	</div>
	<div class="absolute bottom-20 right-10 w-24 h-24 animate-cosmic-pulse opacity-40">
		<div class="w-full h-full rounded-full bg-gradient-to-br from-divine-ethereal to-divine-radiance shadow-cosmic"></div>
	</div>
	<div class="absolute top-1/3 right-20 w-16 h-16 animate-ethereal-spin opacity-25">
		<div class="w-full h-full rounded-full bg-gradient-to-br from-element-wood to-element-fire shadow-mystic"></div>
	</div>

	<!-- 标题区域 -->
	<div class="text-center mb-16 relative">
		<div class="absolute inset-0 -z-10">
			<div class="w-full h-full bg-gradient-to-r from-transparent via-divine-aurora/10 to-transparent animate-aurora-dance"></div>
		</div>
		
		<h1 class="text-cosmic-hero mb-6 animate-mystic-glow">
			交个神仙朋友
		</h1>
		
		<div class="space-y-3">
			<p class="text-ethereal-title opacity-90">
				千年古寺开光的沉香手串
			</p>
			<p class="text-celestial-subtitle opacity-80">
				30秒生成本地AI神仙人格，离线终身陪伴
			</p>
		</div>
		
		<!-- 神性分割线 -->
		<div class="mt-8 flex items-center justify-center">
			<div class="h-px w-20 bg-gradient-to-r from-transparent to-divine-aurora"></div>
			<div class="mx-4 text-divine-radiance text-2xl animate-divine-float">✦</div>
			<div class="h-px w-20 bg-gradient-to-l from-transparent to-divine-aurora"></div>
		</div>
	</div>

	<!-- NFC 扫描区域 -->
	{#if nfcSupported && !showNFCPrompt}
		<div class="mb-12 text-center">
			<div class="relative inline-block group">
				<button
					on:click={scanNFC}
					disabled={isScanning}
					class="relative w-40 h-40 rounded-full border-4 border-divine-aurora flex items-center justify-center text-divine-aurora text-4xl font-bold transition-all duration-700 ease-out group-hover:scale-110 group-hover:border-divine-ethereal group-hover:text-divine-ethereal {isScanning ? 'animate-cosmic-pulse' : 'hover-divine'} shadow-divine"
				>
					{#if isScanning}
						<div class="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
					{:else}
						<span class="text-5xl">📿</span>
					{/if}
					
					<!-- 神性光环 -->
					<div class="absolute inset-0 rounded-full border-4 border-divine-cosmos opacity-60 animate-cosmic-pulse scale-110"></div>
					<div class="absolute inset-0 rounded-full border-4 border-divine-ethereal opacity-40 animate-divine-float scale-125"></div>
				</button>
				
				<!-- 扫描波纹效果 -->
				{#if !isScanning}
					<div class="absolute inset-0 rounded-full border-4 border-divine-radiance animate-ping opacity-75"></div>
				{/if}
			</div>
			
			<p class="mt-6 text-radiant-body">
				{isScanning ? '正在扫描手串...' : '碰一碰你的沉香手串'}
			</p>
		</div>
	{/if}

	<!-- 手动输入区域 -->
	{#if showNFCPrompt || !nfcSupported}
		<div class="mb-12 w-full max-w-md">
			<div class="card-divine">
				<h3 class="text-ethereal-title mb-6 text-center">
					手串编号
				</h3>
				<div class="relative">
					<input
						type="text"
						placeholder="请输入手串编号"
						on:input={handleManualId}
						class="w-full p-5 bg-black/30 border-2 border-divine-ethereal/50 rounded-xl text-radiant-body placeholder-divine-ethereal/50 focus:border-divine-ethereal focus:outline-none focus:shadow-ethereal transition-all duration-500 backdrop-blur-sm"
					/>
					<div class="absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-r from-divine-aurora/5 to-divine-ethereal/5 pointer-events-none"></div>
				</div>
				<p class="text-sm text-divine-ethereal/70 mt-4 text-center">
					编号通常在手串包装或证书上
				</p>
			</div>
		</div>
	{/if}

	<!-- 行动按钮 -->
	<div class="flex flex-col sm:flex-row gap-6 mb-16">
		<button
			on:click={startExperience}
			class="btn-divine-primary hover-divine shadow-divine brand-glow group"
		>
			<span class="relative z-10 flex items-center gap-3">
				<span class="text-2xl group-hover:animate-divine-float">🌟</span>
				开始体验
				<span class="text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">✨</span>
			</span>
		</button>
		
		{#if !showNFCPrompt && nfcSupported}
			<button
				on:click={() => showNFCPrompt = true}
				class="btn-mystic-secondary hover-mystic"
			>
				<span class="flex items-center gap-3">
					<span class="text-xl">🔮</span>
					手动输入
				</span>
			</button>
		{/if}
	</div>

	<!-- 特性介绍 -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-16">
		<div class="card-mystic hover-cosmic text-center p-8 group">
			<div class="text-5xl mb-6 group-hover:animate-divine-float transition-all duration-500">🎯</div>
			<h3 class="text-ethereal-title mb-4 group-hover:text-divine-aurora transition-colors duration-500">30秒急救</h3>
			<p class="text-radiant-body opacity-90">个性化情绪急救，即时缓解焦虑</p>
			
			<!-- 卡片装饰 -->
			<div class="absolute top-2 right-2 w-4 h-4 bg-gradient-to-br from-element-fire to-element-earth rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
		</div>
		
		<div class="card-mystic hover-cosmic text-center p-8 group">
			<div class="text-5xl mb-6 group-hover:animate-cosmic-pulse transition-all duration-500">🤖</div>
			<h3 class="text-ethereal-title mb-4 group-hover:text-divine-cosmos transition-colors duration-500">AI神仙</h3>
			<p class="text-radiant-body opacity-90">基于八字生成专属神仙人格</p>
			
			<!-- 卡片装饰 -->
			<div class="absolute top-2 right-2 w-4 h-4 bg-gradient-to-br from-divine-cosmos to-divine-celestial rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
		</div>
		
		<div class="card-mystic hover-cosmic text-center p-8 group">
			<div class="text-5xl mb-6 group-hover:animate-ethereal-spin transition-all duration-500">📱</div>
			<h3 class="text-ethereal-title mb-4 group-hover:text-divine-ethereal transition-colors duration-500">离线可用</h3>
			<p class="text-radiant-body opacity-90">无网络也能完整体验所有功能</p>
			
			<!-- 卡片装饰 -->
			<div class="absolute top-2 right-2 w-4 h-4 bg-gradient-to-br from-divine-ethereal to-element-wood rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
		</div>
	</div>

	<!-- 开发者工具链接 -->
	<div class="flex flex-wrap justify-center gap-4 mb-12">
		<a 
			href="/test-api"
			class="inline-flex items-center px-6 py-3 glass-mystic text-divine-ethereal rounded-xl hover-mystic transition-all duration-500 group"
		>
			<span class="text-xl mr-2 group-hover:animate-divine-float">🔧</span>
			API 测试
		</a>
		<a 
			href="/status"
			class="inline-flex items-center px-6 py-3 glass-mystic text-emotion-hope rounded-xl hover-mystic transition-all duration-500 group"
		>
			<span class="text-xl mr-2 group-hover:animate-cosmic-pulse">🔍</span>
			系统状态
		</a>
	</div>

	<!-- 底部信息 -->
	<div class="text-center">
		<div class="inline-flex items-center gap-3 px-6 py-3 glass-divine rounded-xl">
			<span class="text-divine-radiance animate-mystic-glow">✨</span>
			<p class="text-divine-ethereal/80 text-sm">
				此应用已通过开光认证 · 功德回向护持千年古寺
			</p>
			<span class="text-divine-radiance animate-mystic-glow">✨</span>
		</div>
	</div>

	<!-- 浮动神性元素 -->
	<div class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
		<!-- 神性光点 -->
		<div class="absolute top-1/4 left-1/4 w-2 h-2 bg-divine-radiance rounded-full animate-divine-float opacity-60"></div>
		<div class="absolute top-3/4 left-3/4 w-1 h-1 bg-divine-ethereal rounded-full animate-cosmic-pulse opacity-80"></div>
		<div class="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-element-fire rounded-full animate-ethereal-spin opacity-70"></div>
		<div class="absolute top-1/6 right-1/4 w-1 h-1 bg-divine-cosmos rounded-full animate-divine-float opacity-60"></div>
		<div class="absolute bottom-1/3 right-1/6 w-2 h-2 bg-element-wood rounded-full animate-cosmic-pulse opacity-50"></div>
		
		<!-- 能量流线 -->
		<div class="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-divine-aurora/30 to-transparent animate-aurora-dance"></div>
		<div class="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-divine-ethereal/20 to-transparent animate-mystic-glow"></div>
	</div>
</div>

<style>
	/* 页面特定的增强效果 */
	@keyframes divine-entrance {
		from {
			opacity: 0;
			transform: translateY(30px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.text-cosmic-hero {
		animation: divine-entrance 1.5s var(--ease-ethereal-float) both;
		animation-delay: 0.2s;
	}

	.text-ethereal-title {
		animation: divine-entrance 1.2s var(--ease-ethereal-float) both;
		animation-delay: 0.4s;
	}

	.text-celestial-subtitle {
		animation: divine-entrance 1s var(--ease-ethereal-float) both;
		animation-delay: 0.6s;
	}

	.card-mystic {
		animation: divine-entrance 0.8s var(--ease-ethereal-float) both;
	}

	.card-mystic:nth-child(1) { animation-delay: 0.8s; }
	.card-mystic:nth-child(2) { animation-delay: 1s; }
	.card-mystic:nth-child(3) { animation-delay: 1.2s; }

	/* 触摸设备优化 */
	@media (hover: none) {
		.hover-divine:hover,
		.hover-mystic:hover,
		.hover-cosmic:hover {
			transform: none;
			filter: none;
		}
		
		.group:hover .group-hover\:animate-divine-float {
			animation: none;
		}
	}
</style> 