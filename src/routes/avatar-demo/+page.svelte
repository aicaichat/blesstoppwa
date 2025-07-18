<script>
	import { onMount } from 'svelte';
	import DivineAvatar from '$lib/components/DivineAvatar.svelte';
	import { speakUnified } from '$lib/utils/unifiedTTS.js';

	// 3D 人物相关
	let avatarComponent;
	let divineType = 'guanyin';
	let emotion = 'gentle';
	let isSpeaking = false;
	let showControls = true;

	// 演示相关
	let demoMessages = [
		'阿弥陀佛，施主。我是观音菩萨，愿以慈悲之心护佑于你。',
		'心如止水，方能照见真相。',
		'慈悲为怀，普度众生。',
		'放下执着，获得自在。'
	];

	let currentMessageIndex = 0;

	onMount(() => {
		console.log('🎭 3D神仙人物演示页面已加载');
	});

	/**
	 * 切换神仙类型
	 */
	function switchDivineType(newType) {
		divineType = newType;
		emotion = 'gentle';
		
		const switchMessages = {
			guanyin: '我是观音菩萨，愿以慈悲之心护佑于你。',
			buddha: '我是佛陀，愿以智慧之光指引你。',
			immortal: '我是千年神仙，愿与你分享长生之道。'
		};

		speakWithAvatar(switchMessages[newType], 'gentle');
	}

	/**
	 * 切换情绪
	 */
	function switchEmotion(newEmotion) {
		emotion = newEmotion;
		
		const emotionMessages = {
			gentle: '慈悲为怀，普度众生。',
			wise: '智慧之光，照亮前路。',
			ethereal: '仙风道骨，超然物外。',
			serious: '庄严神圣，功德无量。'
		};

		speakWithAvatar(emotionMessages[newEmotion], newEmotion);
	}

	/**
	 * 播放演示消息
	 */
	async function playDemoMessage() {
		const message = demoMessages[currentMessageIndex];
		await speakWithAvatar(message, emotion);
		
		currentMessageIndex = (currentMessageIndex + 1) % demoMessages.length;
	}

	/**
	 * 与3D人物对话
	 */
	async function speakWithAvatar(text, targetEmotion = 'gentle') {
		try {
			// 更新状态
			isSpeaking = true;
			emotion = targetEmotion;

			// 播放说话动画
			if (avatarComponent) {
				avatarComponent.playAnimation('speaking');
			}

			// 播放语音
			await speakUnified(text, divineType);

			// 停止说话
			isSpeaking = false;

			// 回到待机动画
			if (avatarComponent) {
				avatarComponent.playAnimation('idle');
			}

		} catch (error) {
			console.error('语音播放失败:', error);
			isSpeaking = false;
		}
	}

	/**
	 * 播放特定动画
	 */
	function playAnimation(animationName) {
		if (avatarComponent) {
			avatarComponent.playAnimation(animationName);
		}
	}
</script>

<svelte:head>
	<title>3D神仙人物演示 - 交个神仙朋友</title>
	<meta name="description" content="体验3D神仙人物系统，与神仙进行互动对话" />
</svelte:head>

<div class="demo-page">
	<div class="demo-header">
		<h1>🎭 3D神仙人物演示</h1>
		<p>体验沉浸式神仙对话系统</p>
	</div>

	<div class="demo-content">
		<!-- 3D神仙区域 -->
		<div class="avatar-section">
			<DivineAvatar 
				bind:this={avatarComponent}
				{divineType}
				{emotion}
				{isSpeaking}
				autoRotate={true}
				showControls={showControls}
			/>
		</div>

		<!-- 控制面板 -->
		<div class="control-panel">
			<!-- 神仙类型选择 -->
			<div class="control-section">
				<h3>选择神仙</h3>
				<div class="button-group">
					<button 
						class="control-btn {divineType === 'guanyin' ? 'active' : ''}"
						on:click={() => switchDivineType('guanyin')}
					>
						<span class="icon">🙏</span>
						观音菩萨
					</button>
					<button 
						class="control-btn {divineType === 'buddha' ? 'active' : ''}"
						on:click={() => switchDivineType('buddha')}
					>
						<span class="icon">🕉️</span>
						佛陀
					</button>
					<button 
						class="control-btn {divineType === 'immortal' ? 'active' : ''}"
						on:click={() => switchDivineType('immortal')}
					>
						<span class="icon">🧘</span>
						神仙
					</button>
				</div>
			</div>

			<!-- 情绪选择 -->
			<div class="control-section">
				<h3>选择情绪</h3>
				<div class="button-group">
					<button 
						class="control-btn {emotion === 'gentle' ? 'active' : ''}"
						on:click={() => switchEmotion('gentle')}
					>
						温柔
					</button>
					<button 
						class="control-btn {emotion === 'wise' ? 'active' : ''}"
						on:click={() => switchEmotion('wise')}
					>
						智慧
					</button>
					<button 
						class="control-btn {emotion === 'ethereal' ? 'active' : ''}"
						on:click={() => switchEmotion('ethereal')}
					>
						空灵
					</button>
					<button 
						class="control-btn {emotion === 'serious' ? 'active' : ''}"
						on:click={() => switchEmotion('serious')}
					>
						庄严
					</button>
				</div>
			</div>

			<!-- 动画控制 -->
			<div class="control-section">
				<h3>动画控制</h3>
				<div class="button-group">
					<button class="control-btn" on:click={() => playAnimation('idle')}>
						<span class="icon">🔄</span>
						待机
					</button>
					<button class="control-btn" on:click={() => playAnimation('speaking')}>
						<span class="icon">💬</span>
						说话
					</button>
					<button class="control-btn" on:click={() => playAnimation('blessing')}>
						<span class="icon">✨</span>
						祝福
					</button>
					<button class="control-btn" on:click={() => playAnimation('meditation')}>
						<span class="icon">🧘</span>
						冥想
					</button>
				</div>
			</div>

			<!-- 演示功能 -->
			<div class="control-section">
				<h3>演示功能</h3>
				<div class="button-group">
					<button class="control-btn demo-btn" on:click={playDemoMessage}>
						<span class="icon">🎭</span>
						播放演示
					</button>
					<button class="control-btn" on:click={() => showControls = !showControls}>
						<span class="icon">🎮</span>
						切换控制
					</button>
				</div>
			</div>

			<!-- 状态信息 -->
			<div class="status-section">
				<h3>当前状态</h3>
				<div class="status-info">
					<div class="status-item">
						<span class="label">神仙类型:</span>
						<span class="value">{divineType}</span>
					</div>
					<div class="status-item">
						<span class="label">情绪状态:</span>
						<span class="value">{emotion}</span>
					</div>
					<div class="status-item">
						<span class="label">说话状态:</span>
						<span class="value">{isSpeaking ? '说话中' : '待机中'}</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- 说明文档 -->
	<div class="documentation">
		<h2>使用说明</h2>
		<div class="doc-content">
			<h3>🎭 3D神仙人物系统</h3>
			<p>本系统提供了完整的3D神仙人物体验，包括：</p>
			<ul>
				<li><strong>三种神仙类型</strong>：观音菩萨、佛陀、神仙</li>
				<li><strong>四种情绪状态</strong>：温柔、智慧、空灵、庄严</li>
				<li><strong>四种动画效果</strong>：待机、说话、祝福、冥想</li>
				<li><strong>语音合成</strong>：支持多种TTS引擎</li>
			</ul>

			<h3>🚀 技术特性</h3>
			<ul>
				<li><strong>Three.js渲染</strong>：高性能3D渲染</li>
				<li><strong>占位符系统</strong>：无需真实模型即可体验</li>
				<li><strong>动画系统</strong>：流畅的动画过渡</li>
				<li><strong>响应式设计</strong>：支持各种设备</li>
			</ul>

			<h3>📱 使用方法</h3>
			<ol>
				<li>选择神仙类型（观音菩萨/佛陀/神仙）</li>
				<li>选择情绪状态（温柔/智慧/空灵/庄严）</li>
				<li>点击动画控制按钮查看不同动画</li>
				<li>点击"播放演示"体验语音对话</li>
			</ol>
		</div>
	</div>
</div>

<style>
	.demo-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
		padding: 20px;
	}

	.demo-header {
		text-align: center;
		margin-bottom: 30px;
	}

	.demo-header h1 {
		color: #ffd700;
		font-size: 32px;
		margin-bottom: 8px;
		font-weight: bold;
	}

	.demo-header p {
		color: rgba(255, 215, 0, 0.7);
		font-size: 16px;
	}

	.demo-content {
		display: grid;
		grid-template-columns: 1fr 350px;
		gap: 30px;
		max-width: 1400px;
		margin: 0 auto;
		margin-bottom: 40px;
	}

	.avatar-section {
		height: 600px;
		background: rgba(255, 215, 0, 0.05);
		border-radius: 16px;
		border: 1px solid rgba(255, 215, 0, 0.1);
		overflow: hidden;
	}

	.control-panel {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.control-section {
		background: rgba(255, 215, 0, 0.05);
		border-radius: 12px;
		padding: 16px;
		border: 1px solid rgba(255, 215, 0, 0.1);
	}

	.control-section h3 {
		color: #ffd700;
		font-size: 16px;
		margin-bottom: 12px;
		font-weight: 500;
	}

	.button-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.control-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 12px;
		background: rgba(255, 215, 0, 0.1);
		border: 1px solid rgba(255, 215, 0, 0.2);
		border-radius: 8px;
		color: #ffd700;
		cursor: pointer;
		transition: all 0.3s ease;
		font-size: 14px;
	}

	.control-btn:hover {
		background: rgba(255, 215, 0, 0.2);
		border-color: rgba(255, 215, 0, 0.4);
	}

	.control-btn.active {
		background: rgba(255, 215, 0, 0.3);
		border-color: rgba(255, 215, 0, 0.6);
	}

	.control-btn .icon {
		font-size: 16px;
	}

	.demo-btn {
		background: rgba(255, 215, 0, 0.2);
		border-color: rgba(255, 215, 0, 0.4);
		font-weight: 500;
	}

	.status-section {
		background: rgba(255, 215, 0, 0.05);
		border-radius: 12px;
		padding: 16px;
		border: 1px solid rgba(255, 215, 0, 0.1);
	}

	.status-info {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.status-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 0;
		border-bottom: 1px solid rgba(255, 215, 0, 0.1);
	}

	.status-item:last-child {
		border-bottom: none;
	}

	.status-item .label {
		color: rgba(255, 215, 0, 0.7);
		font-size: 14px;
	}

	.status-item .value {
		color: #ffd700;
		font-size: 14px;
		font-weight: 500;
	}

	.documentation {
		max-width: 1400px;
		margin: 0 auto;
		background: rgba(255, 215, 0, 0.05);
		border-radius: 16px;
		padding: 30px;
		border: 1px solid rgba(255, 215, 0, 0.1);
	}

	.documentation h2 {
		color: #ffd700;
		font-size: 24px;
		margin-bottom: 20px;
		font-weight: bold;
	}

	.doc-content h3 {
		color: #ffd700;
		font-size: 18px;
		margin: 20px 0 10px 0;
		font-weight: 500;
	}

	.doc-content p {
		color: rgba(255, 215, 0, 0.8);
		font-size: 16px;
		line-height: 1.6;
		margin-bottom: 15px;
	}

	.doc-content ul,
	.doc-content ol {
		color: rgba(255, 215, 0, 0.8);
		font-size: 16px;
		line-height: 1.6;
		margin-bottom: 15px;
		padding-left: 20px;
	}

	.doc-content li {
		margin-bottom: 8px;
	}

	.doc-content strong {
		color: #ffd700;
		font-weight: 500;
	}

	/* 响应式设计 */
	@media (max-width: 1024px) {
		.demo-content {
			grid-template-columns: 1fr;
			grid-template-rows: auto 1fr;
		}

		.avatar-section {
			height: 400px;
		}

		.control-panel {
			grid-row: 2;
			flex-direction: row;
			overflow-x: auto;
		}
	}

	@media (max-width: 768px) {
		.demo-page {
			padding: 12px;
		}

		.demo-header h1 {
			font-size: 24px;
		}

		.avatar-section {
			height: 300px;
		}

		.control-panel {
			flex-direction: column;
		}

		.button-group {
			flex-direction: row;
			overflow-x: auto;
		}

		.control-btn {
			flex-shrink: 0;
		}

		.documentation {
			padding: 20px;
		}
	}
</style> 