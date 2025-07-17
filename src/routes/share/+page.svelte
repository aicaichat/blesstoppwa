<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { userSession, trackEvent } from '$lib/stores/appState.js';

	// 安全的状态订阅，防止SSR错误
	let session = {
		calmScore: null,
		duration: null,
		chatHistory: [],
		certificateData: null
	};

	// 只在浏览器环境中订阅store
	$: if (browser) {
		try {
			session = $userSession;
		} catch (e) {
			console.warn('Store access error:', e);
		}
	}

	let posterCanvas;
	let isGenerating = false;
	let posterUrl = '';
	let shareText = '';

	onMount(() => {
		if (browser) {
			trackEvent('page_view', { page: 'share' });
			generatePoster();
			generateShareText();
		}
	});

	function generateShareText() {
		const score = session.calmScore || 75;
		const duration = session.duration || 60;
		
		const templates = [
			`刚刚体验了${duration}秒神仙朋友，平静指数提升到${score}/100！推荐给大家🙏`,
			`与千年沉香之灵对话，内心获得了前所未有的宁静✨ 平静指数：${score}/100`,
			`30秒生成AI神仙伴侣，${duration}秒情绪急救太治愈了！得分${score}分💫`,
			`遇见了我的专属神仙朋友，心灵得到了净化和指引🌸 推荐体验！`
		];
		
		shareText = templates[Math.floor(Math.random() * templates.length)];
	}

	async function generatePoster() {
		if (!posterCanvas) return;
		
		isGenerating = true;
		
		try {
			const canvas = posterCanvas;
			const ctx = canvas.getContext('2d');
			
			// 设置canvas尺寸
			canvas.width = 540;
			canvas.height = 960;
			
			// 背景渐变
			const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
			gradient.addColorStop(0, '#1a1a1a');
			gradient.addColorStop(0.5, '#0f0f0f');
			gradient.addColorStop(1, '#1a1a1a');
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			// 金色装饰边框
			ctx.strokeStyle = '#FFD700';
			ctx.lineWidth = 4;
			ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
			
			// 标题
			ctx.fillStyle = '#FFD700';
			ctx.font = 'bold 48px "Noto Serif SC", serif';
			ctx.textAlign = 'center';
			ctx.fillText('交个神仙朋友', canvas.width / 2, 120);
			
			// 副标题
			ctx.fillStyle = '#FFF8DC';
			ctx.font = '24px "Noto Serif SC", serif';
			ctx.fillText('千年古寺开光沉香手串', canvas.width / 2, 160);
			
			// AI神仙头像（简化版）
			const avatarSize = 200;
			const avatarX = (canvas.width - avatarSize) / 2;
			const avatarY = 220;
			
			// 圆形背景
			ctx.beginPath();
			ctx.arc(canvas.width / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, 2 * Math.PI);
			const avatarGradient = ctx.createRadialGradient(
				canvas.width / 2, avatarY + avatarSize / 2, 0,
				canvas.width / 2, avatarY + avatarSize / 2, avatarSize / 2
			);
			avatarGradient.addColorStop(0, '#FFD700');
			avatarGradient.addColorStop(1, '#DAA520');
			ctx.fillStyle = avatarGradient;
			ctx.fill();
			
			// 神仙字符
			ctx.fillStyle = '#000';
			ctx.font = 'bold 120px "Noto Serif SC", serif';
			ctx.fillText('仙', canvas.width / 2, avatarY + avatarSize / 2 + 40);
			
			// 体验数据
			const score = session.calmScore || 75;
			const duration = session.duration || 60;
			
			ctx.fillStyle = '#FFF8DC';
			ctx.font = '28px "Noto Serif SC", serif';
			ctx.fillText(`${duration}秒情绪急救`, canvas.width / 2, 480);
			
			ctx.fillStyle = '#90EE90';
			ctx.font = 'bold 36px "Noto Serif SC", serif';
			ctx.fillText(`平静指数 ${score}/100`, canvas.width / 2, 530);
			
			// 功能介绍
			const features = [
				'🎯 30秒极速情绪急救',
				'🤖 AI神仙个性化指导',
				'📱 离线可用随时陪伴'
			];
			
			ctx.fillStyle = '#FFF8DC';
			ctx.font = '20px "Noto Serif SC", serif';
			features.forEach((feature, index) => {
				ctx.fillText(feature, canvas.width / 2, 600 + index * 40);
			});
			
			// 底部信息
			ctx.fillStyle = '#FFD700';
			ctx.font = '18px "Noto Serif SC", serif';
			ctx.fillText('扫码体验', canvas.width / 2, 800);
			
			// 简化的二维码（实际应用中使用真实二维码）
			const qrSize = 120;
			const qrX = (canvas.width - qrSize) / 2;
			const qrY = 820;
			
			ctx.fillStyle = '#FFF';
			ctx.fillRect(qrX, qrY, qrSize, qrSize);
			ctx.fillStyle = '#000';
			// 简化的二维码图案
			for (let i = 0; i < 10; i++) {
				for (let j = 0; j < 10; j++) {
					if ((i + j) % 2 === 0) {
						ctx.fillRect(qrX + i * 12, qrY + j * 12, 12, 12);
					}
				}
			}
			
			// 转换为图片URL
			posterUrl = canvas.toDataURL('image/png', 0.9);
			
		} catch (error) {
			console.error('Poster generation failed:', error);
		} finally {
			isGenerating = false;
		}
	}

	async function shareImage() {
		if (!posterUrl) return;
		
		try {
			if (navigator.share && navigator.canShare) {
				// Web Share API
				const response = await fetch(posterUrl);
				const blob = await response.blob();
				const file = new File([blob], 'shenxian-poster.png', { type: 'image/png' });
				
				await navigator.share({
					title: '交个神仙朋友',
					text: shareText,
					files: [file]
				});
				
				trackEvent('share_success', { method: 'web_share_api' });
			} else {
				// 降级到复制链接
				copyLink();
			}
		} catch (error) {
			console.error('Share failed:', error);
			trackEvent('share_error', { error: error.message });
			copyLink();
		}
	}

	function copyLink() {
		const link = `${window.location.origin}/?ref=${Math.random().toString(36).substr(2, 9)}`;
		
		if (navigator.clipboard) {
			navigator.clipboard.writeText(`${shareText} ${link}`);
			alert('分享链接已复制到剪贴板！');
			trackEvent('share_success', { method: 'copy_link' });
		} else {
			// 降级方案
			const textArea = document.createElement('textarea');
			textArea.value = `${shareText} ${link}`;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);
			alert('分享链接已复制！');
			trackEvent('share_success', { method: 'copy_fallback' });
		}
	}

	function downloadPoster() {
		if (!posterUrl) return;
		
		const link = document.createElement('a');
		link.download = '神仙朋友分享海报.png';
		link.href = posterUrl;
		link.click();
		
		trackEvent('poster_download');
	}

	function restartExperience() {
		// 清除会话数据
		userSession.set({
			duration: null,
			calmScore: null,
			chatHistory: [],
			donationAmount: 36,
			breatheStartTime: null,
			fingerprintHash: null,
			nfcId: null,
			certificateData: null
		});
		
		trackEvent('restart_experience');
		goto('/');
	}

	function exploreMore() {
		trackEvent('explore_more');
		// 这里可以跳转到功德系统或其他功能
		alert('更多功能敬请期待！');
	}
</script>

<svelte:head>
	<title>分享体验 - 交个神仙朋友</title>
	<meta name="description" content="分享您的神仙朋友体验，传递内心的平静" />
</svelte:head>

<div class="min-h-screen p-6">
	<div class="max-w-4xl mx-auto">
		<!-- 标题 -->
		<div class="text-center mb-8">
			<h1 class="text-3xl md:text-4xl font-bold gradient-text mb-4">
				体验完成！
			</h1>
			<p class="text-lg text-yellow-200">
				将这份平静与更多人分享
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- 海报预览 -->
			<div class="text-center">
				<h2 class="text-xl font-semibold text-yellow-100 mb-4">分享海报</h2>
				
				<div class="relative inline-block">
					<canvas
						bind:this={posterCanvas}
						class="max-w-full h-auto rounded-lg shadow-lg border-2 border-yellow-500/30"
						style="max-height: 500px;"
					></canvas>
					
					{#if isGenerating}
						<div class="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
							<div class="text-center">
								<div class="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
								<p class="text-yellow-200 text-sm">生成中...</p>
							</div>
						</div>
					{/if}
				</div>

				<!-- 海报操作按钮 -->
				<div class="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
					<button
						on:click={shareImage}
						disabled={isGenerating || !posterUrl}
						class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-300 disabled:opacity-50"
					>
						📱 分享到社交媒体
					</button>
					
					<button
						on:click={downloadPoster}
						disabled={isGenerating || !posterUrl}
						class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-300 disabled:opacity-50"
					>
						💾 下载海报
					</button>
				</div>
			</div>

			<!-- 体验总结 -->
			<div class="space-y-6">
				<div class="backdrop-blur-subtle rounded-2xl p-6 border border-yellow-500/30">
					<h3 class="text-xl font-semibold text-yellow-100 mb-4">您的体验总结</h3>
					
					<div class="space-y-4">
						<div class="flex justify-between">
							<span class="text-yellow-200">体验时长：</span>
							<span class="text-yellow-100 font-medium">{session.duration || 60} 秒</span>
						</div>
						
						<div class="flex justify-between">
							<span class="text-yellow-200">平静指数：</span>
							<span class="text-green-400 font-bold">{session.calmScore || 75}/100</span>
						</div>
						
						<div class="flex justify-between">
							<span class="text-yellow-200">对话轮次：</span>
							<span class="text-yellow-100 font-medium">{session.chatHistory?.length || 0} 轮</span>
						</div>
						
						{#if session.certificateData}
							<div class="flex justify-between">
								<span class="text-yellow-200">验真状态：</span>
								<span class="text-green-400 font-medium">✅ 已认证</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- 分享文案 -->
				<div class="backdrop-blur-subtle rounded-2xl p-6 border border-yellow-500/30">
					<h3 class="text-xl font-semibold text-yellow-100 mb-4">分享文案</h3>
					<textarea
						bind:value={shareText}
						class="w-full h-24 bg-black/50 border border-yellow-500/50 rounded-xl text-yellow-100 placeholder-yellow-500/50 p-3 resize-none focus:border-yellow-500 focus:outline-none"
						placeholder="编辑您的分享文案..."
					></textarea>
					
					<button
						on:click={copyLink}
						class="mt-3 w-full px-4 py-2 bg-yellow-600/20 text-yellow-300 border border-yellow-500/30 rounded-xl hover:bg-yellow-600/30 transition-colors"
					>
						📋 复制分享文案
					</button>
				</div>

				<!-- 继续体验 -->
				<div class="backdrop-blur-subtle rounded-2xl p-6 border border-yellow-500/30">
					<h3 class="text-xl font-semibold text-yellow-100 mb-4">继续探索</h3>
					
					<div class="space-y-3">
						<button
							on:click={restartExperience}
							class="w-full px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-semibold rounded-xl hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300"
						>
							🔄 再次体验
						</button>
						
						<button
							on:click={exploreMore}
							class="w-full px-6 py-3 border-2 border-yellow-500 text-yellow-500 font-semibold rounded-xl hover:bg-yellow-500 hover:text-black transition-all duration-300"
						>
							🎯 探索更多功能
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- 底部推荐 -->
		<div class="mt-12 text-center">
			<h3 class="text-2xl font-semibold text-yellow-100 mb-4">
				传递善缘，功德无量
			</h3>
			<p class="text-yellow-200/80 max-w-2xl mx-auto">
				每一次分享都是慈悲的延续，愿更多人在快节奏的生活中找到内心的宁静。
				您的分享可能正是某个人此刻最需要的温暖。
			</p>
		</div>
	</div>
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
		background: rgba(0, 0, 0, 0.3);
	}
</style> 