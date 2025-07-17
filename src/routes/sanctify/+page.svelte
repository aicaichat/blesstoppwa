<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { sanctifyState, trackEvent, userSession } from '$lib/stores/appState.js';

	let nfcId = '';
	let videoElement;
	let certificateRef;
	let isVideoLoaded = false;

	// 安全的状态订阅，防止SSR错误
	let state = {
		status: 'idle',
		nfcId: null,
		certificateData: null,
		pdfBlob: null,
		error: null
	};

	// 只在浏览器环境中订阅store
	$: if (browser) {
		try {
			state = $sanctifyState;
		} catch (e) {
			console.warn('Store access error:', e);
		}
	}

	// 从 URL 参数获取 ID
	onMount(() => {
		if (browser) {
			nfcId = $page.url.searchParams.get('id') || '';
			
			if (nfcId) {
				// 自动开始验证流程
				try {
					sanctifyState.update(s => ({ ...s, status: 'scanning', nfcId }));
				} catch (e) {
					console.warn('Store update error:', e);
				}
				fetchCertificate(nfcId);
			}

			trackEvent('page_view', { page: 'sanctify', nfcId });
		}
	});

	async function fetchCertificate(id) {
		if (browser) {
			try {
				sanctifyState.update(s => ({ ...s, status: 'fetching' }));
			} catch (e) {
				console.warn('Store update error:', e);
			}
		}

		try {
			const response = await fetch(`/api/cert/${id}`);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();
			
			if (browser) {
				try {
					sanctifyState.update(s => ({ 
						...s, 
						status: 'fetched',
						certificateData: data
					}));
				} catch (e) {
					console.warn('Store update error:', e);
				}
			}

		} catch (error) {
			console.error('Certificate fetch failed:', error);
			if (browser) {
				try {
					sanctifyState.update(s => ({ 
						...s, 
						status: 'error',
						error: error.message || '无法验证手串真伪，请检查网络连接'
					}));
				} catch (e) {
					console.warn('Store update error:', e);
				}
			}
		}
	}

	function onVideoLoaded() {
		isVideoLoaded = true;
		if (videoElement) {
			videoElement.play().catch(console.error);
		}
	}

	async function generatePDF() {
		if (browser) {
			try {
				sanctifyState.update(s => ({ ...s, status: 'generating_pdf' }));
			} catch (e) {
				console.warn('Store update error:', e);
			}
		}
		trackEvent('pdf_generate_start');

		try {
			// 简化的PDF生成 - 实际环境中可以使用html2canvas + jspdf
			const pdfBlob = new Blob(['Mock PDF content'], { type: 'application/pdf' });
			
			if (browser) {
				try {
					sanctifyState.update(s => ({ 
						...s, 
						status: 'pdf_ready',
						pdfBlob
					}));
				} catch (e) {
					console.warn('Store update error:', e);
				}
			}

			trackEvent('pdf_generate_success');

		} catch (error) {
			console.error('PDF generation failed:', error);
			if (browser) {
				try {
					sanctifyState.update(s => ({ 
						...s, 
						status: 'error',
						error: error.message || 'PDF生成失败'
					}));
				} catch (e) {
					console.warn('Store update error:', e);
				}
			}
			
			trackEvent('pdf_generate_error', { error: error.message });
		}
	}

	function downloadPDF() {
		const blob = state.pdfBlob;
		if (!blob) return;

		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `古寺开光证书_${state.certificateData?.hash || 'unknown'}.pdf`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		trackEvent('pdf_download', { hash: state.certificateData?.hash });
	}

	function continueToExperience() {
		// 保存证书数据到用户会话
		userSession.update(session => ({
			...session,
			certificateData: state.certificateData
		}));

		goto('/awake');
	}

	function retry() {
		if (browser) {
			try {
				sanctifyState.update(s => ({ ...s, status: 'idle', error: null }));
			} catch (e) {
				console.warn('Store update error:', e);
			}
		}
		if (nfcId) {
			fetchCertificate(nfcId);
		}
	}

	function continueAnyway() {
		goto('/awake');
	}
</script>

<svelte:head>
	<title>验真开光证书 - 交个神仙朋友</title>
	<meta name="description" content="验证您的沉香手串开光证书，确保来源正宗" />
</svelte:head>

<div class="min-h-screen flex flex-col items-center justify-center p-6">
	<!-- 加载状态 -->
	{#if state.status === 'scanning' || state.status === 'fetching'}
		<div class="text-center">
			<div class="w-20 h-20 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
			<h2 class="text-2xl font-semibold text-yellow-100 mb-4">正在验证手串真伪</h2>
			<p class="text-yellow-200">请稍候，正在连接古寺数据库...</p>
		</div>
	{/if}

	<!-- 验证成功 - 显示证书和视频 -->
	{#if state.status === 'fetched' || state.status === 'generating_pdf' || state.status === 'pdf_ready'}
		<div class="w-full max-w-4xl">
			<!-- 开光视频 -->
			{#if state.certificateData?.videoUrl}
				<div class="mb-8 text-center">
					<div class="relative inline-block rounded-2xl overflow-hidden max-w-2xl">
						<video
							bind:this={videoElement}
							src={state.certificateData.videoUrl}
							on:loadeddata={onVideoLoaded}
							autoplay
							muted
							loop
							playsInline
							class="w-full h-auto"
							poster="/images/blessing-poster.jpg"
						>
							<track kind="captions" src="/videos/blessing-captions.vtt" srclang="zh" label="中文字幕" />
						</video>
						
						{#if !isVideoLoaded}
							<div class="absolute inset-0 bg-black flex items-center justify-center">
								<div class="text-yellow-500">加载中...</div>
							</div>
						{/if}
					</div>
					<p class="mt-4 text-yellow-200 text-lg">🙏 开光仪式视频</p>
				</div>
			{/if}

			<!-- 证书卡片 -->
			<div 
				bind:this={certificateRef}
				class="backdrop-blur-subtle rounded-2xl p-8 border-2 border-yellow-500/50 mb-8"
			>
				<div class="text-center mb-6">
					<h1 class="text-3xl font-bold gradient-text mb-2">开光证书</h1>
					<p class="text-yellow-200">千年古寺认证</p>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-yellow-300 mb-1">手串编号</label>
							<div class="text-yellow-100 font-mono text-lg">{nfcId}</div>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-yellow-300 mb-1">区块链哈希</label>
							<div class="text-yellow-100 font-mono text-sm break-all">
								{state.certificateData?.hash}
							</div>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-yellow-300 mb-1">开光法师</label>
							<div class="text-yellow-100">{state.certificateData?.sign}</div>
						</div>
					</div>

					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-yellow-300 mb-1">认证寺院</label>
							<div class="text-yellow-100">{state.certificateData?.templeName}</div>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-yellow-300 mb-1">开光时间</label>
							<div class="text-yellow-100">
								{state.certificateData?.mintedAt ? new Date(state.certificateData.mintedAt).toLocaleDateString('zh-CN') : ''}
							</div>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-yellow-300 mb-1">验证状态</label>
							<div class="flex items-center gap-2">
								<span class="w-3 h-3 bg-green-500 rounded-full"></span>
								<span class="text-green-400 font-medium">已认证</span>
							</div>
						</div>
					</div>
				</div>

				<!-- 开光印章 -->
				<div class="mt-8 text-center">
					<div class="inline-block p-4 border-2 border-yellow-500 rounded-full">
						<div class="text-2xl text-yellow-500">⚡</div>
					</div>
					<p class="mt-2 text-yellow-300 text-sm">开光认证印章</p>
				</div>
			</div>

			<!-- 操作按钮 -->
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<button
					on:click={generatePDF}
					disabled={state.status === 'generating_pdf'}
					class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if state.status === 'generating_pdf'}
						<span class="flex items-center gap-2">
							<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
							生成中...
						</span>
					{:else}
						📄 生成PDF证书
					{/if}
				</button>

				{#if state.status === 'pdf_ready'}
					<button
						on:click={downloadPDF}
						class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-300"
					>
						💾 下载证书
					</button>
				{/if}

				<button
					on:click={continueToExperience}
					class="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-semibold rounded-xl hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300"
				>
					继续体验 →
				</button>
			</div>
		</div>
	{/if}

	<!-- 错误状态 -->
	{#if state.status === 'error'}
		<div class="text-center max-w-md">
			<div class="text-6xl mb-4">⚠️</div>
			<h2 class="text-2xl font-semibold text-red-400 mb-4">验证失败</h2>
			<p class="text-red-300 mb-6">{state.error}</p>
			
			<div class="flex flex-col sm:flex-row gap-4">
				<button
					on:click={retry}
					class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-300"
				>
					重试验证
				</button>
				
				<button
					on:click={continueAnyway}
					class="px-6 py-3 border-2 border-yellow-500 text-yellow-500 font-semibold rounded-xl hover:bg-yellow-500 hover:text-black transition-all duration-300"
				>
					跳过验证
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.gradient-text {
		background: linear-gradient(135deg, #FFD700 0%, #FFF8DC 50%, #DAA520 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.backdrop-blur-subtle {
		backdrop-filter: blur(12px);
		background: rgba(0, 0, 0, 0.4);
	}
</style> 