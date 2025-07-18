<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	
	// 不需要导航栏的页面
	const noNavPages = ['/', '/awake', '/breathe'];
	
	// 判断是否显示导航栏
	$: showNav = !noNavPages.includes($page.route.id);

	// 获取页面标题
	$: pageTitle = getPageTitle($page.route.id);

	function getPageTitle(routeId) {
		const titles = {
			'/mirror': '神仙对话',
			'/share': '分享体验',
			'/sanctify': '扫珠验真',
			'/virtual-wife': '虚拟伴侣',
			'/vrm-showcase': '模型展示',
			'/animation-test': '动画测试',
			'/status': '系统状态',
			'/debug': '调试工具'
		};
		return titles[routeId] || '神仙朋友';
	}

	// Global error handler
	function handleError(event) {
		console.error('Global error:', event.error);
	}

	// Attach global error handler
	onMount(() => {
		if (browser) {
			window.addEventListener('error', handleError);
			window.addEventListener('unhandledrejection', (event) => {
				handleError({ error: event.reason });
			});
		}
	});
</script>

<svelte:head>
	<title>{$page.data?.title || '交个神仙朋友'}</title>
	<meta name="description" content={$page.data?.description || '千年古寺开光的沉香手串 × AI-Native 神仙伴侣'} />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
	<meta name="theme-color" content="#ffd700" />
</svelte:head>

<!-- Navigation -->
{#if showNav}
	<nav class="app-nav">
		<div class="nav-content">
			<a href="/" class="nav-home" aria-label="返回首页">
				<span class="nav-icon">🏠</span>
			</a>
			
			<div class="nav-title">
				<span class="page-name">{pageTitle}</span>
			</div>
			
			<div class="nav-spacer"></div>
		</div>
	</nav>
{/if}

<!-- Main Content -->
<main class="app-main" class:with-nav={showNav}>
	<slot />
</main>

<style>
	:global(body) {
		overflow-x: hidden;
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: #0a0a0a;
		color: white;
	}
	
	:global(*) {
		box-sizing: border-box;
	}

	/* 导航栏 */
	.app-nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(255, 215, 0, 0.1);
		height: 60px;
	}

	.nav-content {
		display: flex;
		align-items: center;
		height: 100%;
		padding: 0 1rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.nav-home {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		background: rgba(255, 215, 0, 0.1);
		border: 1px solid rgba(255, 215, 0, 0.3);
		border-radius: 12px;
		text-decoration: none;
		transition: all 0.3s ease;
		color: #ffd700;
	}

	.nav-home:hover {
		background: rgba(255, 215, 0, 0.2);
		border-color: rgba(255, 215, 0, 0.5);
		transform: translateY(-1px);
	}

	.nav-icon {
		font-size: 1.2rem;
	}

	.nav-title {
		flex: 1;
		text-align: center;
		margin: 0 1rem;
	}

	.page-name {
		font-size: 1rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.9);
	}

	.nav-spacer {
		width: 44px;
	}

	/* 主内容区域 */
	.app-main {
		min-height: 100vh;
		position: relative;
	}

	.app-main.with-nav {
		padding-top: 60px;
	}

	/* 响应式设计 */
	@media (max-width: 480px) {
		.nav-content {
			padding: 0 0.75rem;
		}

		.page-name {
			font-size: 0.9rem;
		}

		.nav-home {
			width: 40px;
			height: 40px;
		}

		.nav-spacer {
			width: 40px;
		}
	}

	/* 无障碍支持 */
	@media (prefers-reduced-motion: reduce) {
		.nav-home {
			transition: none;
		}

		.nav-home:hover {
			transform: none;
		}
	}

	/* 键盘导航 */
	.nav-home:focus {
		outline: 2px solid #ffd700;
		outline-offset: 2px;
	}
</style> 