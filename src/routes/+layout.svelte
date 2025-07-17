<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	
	// 是否显示导航栏
	$: showNav = $page.route.id !== '/';

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
</svelte:head>

<!-- Navigation -->
{#if showNav}
	<nav class="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-yellow-500/20">
		<div class="container mx-auto px-4 py-3 flex items-center justify-between">
			<a href="/" class="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors">
				<span class="text-xl">🏠</span>
				<span class="font-medium">返回首页</span>
			</a>
			<div class="text-yellow-300/60 text-sm">
				{$page.route.id?.replace('/', '') || '页面'}
			</div>
		</div>
	</nav>
{/if}

<!-- Main Content -->
<main class="min-h-screen relative overflow-hidden {showNav ? 'pt-16' : ''}">
	<!-- Page Content -->
	<div class="relative z-10">
		<slot />
	</div>
</main>

<style>
	:global(body) {
		overflow-x: hidden;
	}
	
	main {
		font-family: var(--font-serif);
		background: radial-gradient(ellipse at center, #1a1a1a 0%, #0f0f0f 100%);
	}
</style> 