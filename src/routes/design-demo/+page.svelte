<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let currentView = 'overview';

	const designComponents = [
		{
			id: 'buttons',
			title: '按钮组件',
			description: '各种状态和样式的按钮',
			color: '#ffd700'
		},
		{
			id: 'cards',
			title: '卡片组件',
			description: '选择卡片和信息卡片',
			color: '#22c55e'
		},
		{
			id: 'inputs',
			title: '输入组件',
			description: '表单输入和交互元素',
			color: '#3b82f6'
		},
		{
			id: 'layouts',
			title: '布局组件',
			description: '页面布局和结构',
			color: '#8b5cf6'
		}
	];

	onMount(() => {
		if (browser) {
			console.log('🎨 设计系统演示页面加载完成');
		}
	});

	function switchView(viewId) {
		currentView = viewId;
	}

	function testAnimation() {
		alert('动画效果测试');
	}
</script>

<svelte:head>
	<title>设计系统演示 - 交个神仙朋友</title>
	<meta name="description" content="展示新的UI设计系统和组件库" />
</svelte:head>

<div class="design-demo">
	<!-- 页面头部 -->
	<header class="demo-header">
		<div class="header-content">
			<h1 class="demo-title">🎨 设计系统演示</h1>
			<p class="demo-subtitle">展示极简流畅的用户界面设计</p>
		</div>
	</header>

	<!-- 导航菜单 -->
	<nav class="demo-nav">
		<div class="nav-items">
			<button 
				class="nav-item {currentView === 'overview' ? 'active' : ''}"
				on:click={() => switchView('overview')}
			>
				总览
			</button>
			{#each designComponents as component}
				<button 
					class="nav-item {currentView === component.id ? 'active' : ''}"
					on:click={() => switchView(component.id)}
				>
					{component.title}
				</button>
			{/each}
		</div>
	</nav>

	<!-- 主内容区 -->
	<main class="demo-content">
		{#if currentView === 'overview'}
			<!-- 总览页面 -->
			<section class="overview-section">
				<h2 class="section-title">设计原则</h2>
				<div class="principles-grid">
					<div class="principle-card">
						<div class="principle-icon">✨</div>
						<h3>极简至上</h3>
						<p>移除一切不必要的元素，专注核心功能</p>
					</div>
					<div class="principle-card">
						<div class="principle-icon">🎯</div>
						<h3>目标导向</h3>
						<p>每个界面都有清晰的用户目标和行动路径</p>
					</div>
					<div class="principle-card">
						<div class="principle-icon">🌊</div>
						<h3>流畅体验</h3>
						<p>丝滑的动画和过渡，给用户愉悦感</p>
					</div>
					<div class="principle-card">
						<div class="principle-icon">♿</div>
						<h3>无障碍友好</h3>
						<p>支持键盘导航、屏幕阅读器和动效控制</p>
					</div>
				</div>

				<h2 class="section-title">颜色系统</h2>
				<div class="color-palette">
					<div class="color-item">
						<div class="color-swatch primary"></div>
						<span class="color-name">主色调</span>
						<span class="color-value">#ffd700</span>
					</div>
					<div class="color-item">
						<div class="color-swatch success"></div>
						<span class="color-name">成功</span>
						<span class="color-value">#22c55e</span>
					</div>
					<div class="color-item">
						<div class="color-swatch warning"></div>
						<span class="color-name">警告</span>
						<span class="color-value">#f59e0b</span>
					</div>
					<div class="color-item">
						<div class="color-swatch error"></div>
						<span class="color-name">错误</span>
						<span class="color-value">#ef4444</span>
					</div>
				</div>
			</section>

		{:else if currentView === 'buttons'}
			<!-- 按钮组件演示 -->
			<section class="component-section">
				<h2 class="section-title">按钮组件</h2>
				
				<div class="component-group">
					<h3>主要按钮</h3>
					<div class="button-demos">
						<button class="btn-primary">开始体验</button>
						<button class="btn-primary" disabled>禁用状态</button>
						<button class="btn-primary loading">加载中...</button>
					</div>
				</div>

				<div class="component-group">
					<h3>次要按钮</h3>
					<div class="button-demos">
						<button class="btn-secondary">次要操作</button>
						<button class="btn-secondary" disabled>禁用状态</button>
					</div>
				</div>

				<div class="component-group">
					<h3>图标按钮</h3>
					<div class="button-demos">
						<button class="btn-icon">🏠</button>
						<button class="btn-icon">⚙️</button>
						<button class="btn-icon">❤️</button>
					</div>
				</div>
			</section>

		{:else if currentView === 'cards'}
			<!-- 卡片组件演示 -->
			<section class="component-section">
				<h2 class="section-title">卡片组件</h2>
				
				<div class="component-group">
					<h3>选择卡片</h3>
					<div class="card-demos">
						<div class="selection-card recommended">
							<div class="card-badge">推荐</div>
							<div class="card-icon">🌸</div>
							<div class="card-number">60s</div>
							<h4>深度放松</h4>
							<p>平衡效果与时间</p>
							<div class="card-features">
								<span class="feature-tag">深度疗愈</span>
								<span class="feature-tag">最受欢迎</span>
							</div>
						</div>

						<div class="selection-card">
							<div class="card-icon">⚡</div>
							<div class="card-number">30s</div>
							<h4>快速急救</h4>
							<p>适合忙碌时刻</p>
							<div class="card-features">
								<span class="feature-tag">即时效果</span>
								<span class="feature-tag">随时可用</span>
							</div>
						</div>
					</div>
				</div>

				<div class="component-group">
					<h3>信息卡片</h3>
					<div class="info-card">
						<div class="info-icon">💡</div>
						<div class="info-content">
							<h4>小贴士</h4>
							<p>体验结束后可重新选择时长</p>
						</div>
					</div>
				</div>
			</section>

		{:else if currentView === 'inputs'}
			<!-- 输入组件演示 -->
			<section class="component-section">
				<h2 class="section-title">输入组件</h2>
				
				<div class="component-group">
					<h3>文本输入</h3>
					<div class="input-demos">
						<input type="text" class="text-input" placeholder="请输入内容" />
						<input type="text" class="text-input" value="已填写内容" />
						<input type="text" class="text-input error" placeholder="错误状态" />
					</div>
				</div>

				<div class="component-group">
					<h3>选择器</h3>
					<div class="selector-demos">
						<select class="select-input">
							<option>选项一</option>
							<option>选项二</option>
							<option>选项三</option>
						</select>
					</div>
				</div>
			</section>

		{:else if currentView === 'layouts'}
			<!-- 布局组件演示 -->
			<section class="component-section">
				<h2 class="section-title">布局组件</h2>
				
				<div class="component-group">
					<h3>页面结构</h3>
					<div class="layout-demo">
						<div class="layout-header">页面头部</div>
						<div class="layout-nav">导航区域</div>
						<div class="layout-main">主内容区</div>
						<div class="layout-footer">页面底部</div>
					</div>
				</div>
			</section>
		{/if}
	</main>

	<!-- 返回首页 -->
	<div class="demo-footer">
		<button class="btn-home" on:click={() => goto('/')}>
			<span class="btn-icon">🏠</span>
			<span class="btn-text">返回首页</span>
		</button>
	</div>
</div>

<style>
	.design-demo {
		min-height: 100vh;
		background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
		color: white;
		overflow-x: hidden;
	}

	/* 页面头部 */
	.demo-header {
		padding: 2rem 1rem;
		text-align: center;
		background: rgba(255, 215, 0, 0.05);
		border-bottom: 1px solid rgba(255, 215, 0, 0.1);
	}

	.header-content {
		max-width: 800px;
		margin: 0 auto;
	}

	.demo-title {
		font-size: 2.5rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
		background: linear-gradient(135deg, #ffd700, #ffed4a);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.demo-subtitle {
		font-size: 1.1rem;
		color: rgba(255, 255, 255, 0.7);
		margin: 0;
	}

	/* 导航菜单 */
	.demo-nav {
		padding: 1rem;
		background: rgba(0, 0, 0, 0.3);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		overflow-x: auto;
	}

	.nav-items {
		display: flex;
		gap: 0.5rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.nav-item {
		padding: 0.75rem 1.5rem;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		color: white;
		cursor: pointer;
		transition: all 0.3s ease;
		white-space: nowrap;
	}

	.nav-item:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.nav-item.active {
		background: rgba(255, 215, 0, 0.2);
		border-color: rgba(255, 215, 0, 0.5);
		color: #ffd700;
	}

	/* 主内容区 */
	.demo-content {
		padding: 2rem 1rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.section-title {
		font-size: 1.8rem;
		font-weight: 600;
		color: #ffd700;
		margin: 0 0 2rem 0;
	}

	/* 总览页面 */
	.overview-section {
		space: 3rem 0;
	}

	.principles-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.principle-card {
		padding: 2rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		text-align: center;
		backdrop-filter: blur(10px);
	}

	.principle-icon {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.principle-card h3 {
		font-size: 1.2rem;
		color: #ffd700;
		margin: 0 0 1rem 0;
	}

	.principle-card p {
		color: rgba(255, 255, 255, 0.7);
		line-height: 1.5;
		margin: 0;
	}

	/* 颜色系统 */
	.color-palette {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
	}

	.color-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.color-swatch {
		width: 60px;
		height: 60px;
		border-radius: 12px;
		border: 2px solid rgba(255, 255, 255, 0.2);
	}

	.color-swatch.primary { background: #ffd700; }
	.color-swatch.success { background: #22c55e; }
	.color-swatch.warning { background: #f59e0b; }
	.color-swatch.error { background: #ef4444; }

	.color-name {
		font-weight: 500;
		color: white;
	}

	.color-value {
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.6);
		font-family: monospace;
	}

	/* 组件演示 */
	.component-section {
		space: 2rem 0;
	}

	.component-group {
		margin-bottom: 3rem;
	}

	.component-group h3 {
		font-size: 1.3rem;
		color: white;
		margin: 0 0 1rem 0;
	}

	/* 按钮演示 */
	.button-demos {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.btn-primary {
		padding: 1rem 2rem;
		background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1));
		border: 1px solid rgba(255, 215, 0, 0.5);
		border-radius: 12px;
		color: white;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	.btn-primary.loading {
		position: relative;
		color: transparent;
	}

	.btn-primary.loading::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 20px;
		height: 20px;
		margin: -10px 0 0 -10px;
		border: 2px solid transparent;
		border-top: 2px solid #ffd700;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.btn-secondary {
		padding: 1rem 2rem;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 12px;
		color: white;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.btn-icon {
		width: 50px;
		height: 50px;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-icon:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: scale(1.1);
	}

	/* 卡片演示 */
	.card-demos {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.selection-card {
		position: relative;
		padding: 2rem 1.5rem;
		background: rgba(0, 0, 0, 0.4);
		border: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: 20px;
		text-align: center;
		transition: all 0.3s ease;
		backdrop-filter: blur(10px);
	}

	.selection-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
	}

	.selection-card.recommended {
		border-color: rgba(255, 215, 0, 0.5);
		background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
	}

	.card-badge {
		position: absolute;
		top: -8px;
		right: 1rem;
		background: linear-gradient(135deg, #ffd700, #ffed4a);
		color: #000;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.card-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.card-number {
		font-size: 2.5rem;
		font-weight: 700;
		color: #ffd700;
		margin-bottom: 0.5rem;
	}

	.selection-card h4 {
		font-size: 1.25rem;
		color: white;
		margin: 0 0 0.5rem 0;
	}

	.selection-card p {
		color: rgba(255, 255, 255, 0.7);
		margin: 0 0 1rem 0;
	}

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

	/* 信息卡片 */
	.info-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		background: rgba(34, 197, 94, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.3);
		border-radius: 12px;
	}

	.info-icon {
		font-size: 1.5rem;
		flex-shrink: 0;
	}

	.info-content h4 {
		color: #22c55e;
		margin: 0 0 0.5rem 0;
	}

	.info-content p {
		color: rgba(255, 255, 255, 0.8);
		margin: 0;
	}

	/* 输入组件 */
	.input-demos {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 400px;
	}

	.text-input {
		padding: 1rem;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 12px;
		color: white;
		font-size: 1rem;
		transition: all 0.3s ease;
	}

	.text-input:focus {
		outline: none;
		border-color: #ffd700;
		box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
	}

	.text-input.error {
		border-color: #ef4444;
	}

	.text-input::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.selector-demos {
		max-width: 300px;
	}

	.select-input {
		width: 100%;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 12px;
		color: white;
		font-size: 1rem;
	}

	/* 布局演示 */
	.layout-demo {
		display: grid;
		grid-template-areas: 
			"header header"
			"nav main"
			"footer footer";
		grid-template-rows: 60px 200px 60px;
		grid-template-columns: 200px 1fr;
		gap: 1px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		overflow: hidden;
	}

	.layout-header {
		grid-area: header;
		background: rgba(255, 215, 0, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffd700;
		font-weight: 600;
	}

	.layout-nav {
		grid-area: nav;
		background: rgba(255, 255, 255, 0.05);
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.7);
	}

	.layout-main {
		grid-area: main;
		background: rgba(255, 255, 255, 0.02);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
	}

	.layout-footer {
		grid-area: footer;
		background: rgba(255, 255, 255, 0.05);
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.7);
	}

	/* 底部返回按钮 */
	.demo-footer {
		padding: 2rem;
		text-align: center;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.btn-home {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 2rem;
		background: rgba(255, 215, 0, 0.2);
		border: 1px solid rgba(255, 215, 0, 0.5);
		border-radius: 12px;
		color: white;
		text-decoration: none;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-home:hover {
		background: rgba(255, 215, 0, 0.3);
		transform: translateY(-2px);
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.demo-title {
			font-size: 2rem;
		}

		.principles-grid {
			grid-template-columns: 1fr;
		}

		.card-demos {
			grid-template-columns: 1fr;
		}

		.layout-demo {
			grid-template-areas: 
				"header"
				"nav"
				"main"
				"footer";
			grid-template-columns: 1fr;
			grid-template-rows: 60px 60px 120px 60px;
		}
	}

	@media (max-width: 480px) {
		.demo-header {
			padding: 1.5rem 1rem;
		}

		.demo-title {
			font-size: 1.75rem;
		}

		.nav-items {
			flex-wrap: nowrap;
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
		}

		.principle-card {
			padding: 1.5rem;
		}
	}
</style> 