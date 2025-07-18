<script>
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { userSession, trackEvent } from '$lib/stores/appState.js';
	import { speakUnified, stopUnified } from '$lib/utils/unifiedTTS.js';
	import DivineAvatar from '$lib/components/DivineAvatar.svelte';

	// 3D 人物相关
	let avatarComponent;
	let divineType = 'guanyin';
	let emotion = 'gentle';
	let isSpeaking = false;
	let showControls = false;

	// 对话相关
	let userMessage = '';
	let conversationHistory = [];
	let isListening = false;
	let currentResponse = '';

	// 页面状态
	let pageStatus = 'loading'; // loading, ready, error

	onMount(async () => {
		if (browser) {
			try {
				// 获取用户状态
				let userState;
				try {
					userState = $userSession;
				} catch (e) {
					console.warn('Failed to get userSession:', e);
					userState = { calmScore: 70, duration: 60 };
				}

				// 根据用户状态选择神仙类型
				divineType = selectDivineType(userState.calmScore);
				emotion = selectEmotion(userState.calmScore);

				// 记录页面访问
				trackEvent('page_view', { 
					page: 'mirror', 
					divineType,
					emotion 
				});

				pageStatus = 'ready';

				// 播放欢迎语音
				setTimeout(async () => {
					await speakWelcome();
				}, 1000);

			} catch (error) {
				console.error('页面初始化失败:', error);
				pageStatus = 'error';
			}
		}
	});

	onDestroy(() => {
		stopUnified();
	});

	/**
	 * 根据用户状态选择神仙类型
	 */
	function selectDivineType(calmScore) {
		if (calmScore >= 80) return 'buddha';
		if (calmScore >= 60) return 'guanyin';
		return 'immortal';
	}

	/**
	 * 根据用户状态选择情绪
	 */
	function selectEmotion(calmScore) {
		if (calmScore >= 80) return 'wise';
		if (calmScore >= 60) return 'gentle';
		return 'ethereal';
	}

	/**
	 * 播放欢迎语音
	 */
	async function speakWelcome() {
		const welcomeMessages = {
			guanyin: '阿弥陀佛，施主。我是观音菩萨，愿以慈悲之心护佑于你。',
			buddha: '南无阿弥陀佛。我是佛陀，愿以智慧之光指引你。',
			immortal: '道友，我是千年神仙，愿与你分享长生之道。'
		};

		const message = welcomeMessages[divineType];
		await speakWithAvatar(message, 'gentle');
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

			// 更新对话历史
			conversationHistory.push({
				type: 'ai',
				text: text,
				emotion: targetEmotion,
				timestamp: Date.now()
			});

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
	 * 处理用户消息
	 */
	async function handleUserMessage() {
		if (!userMessage.trim()) return;

		const message = userMessage.trim();
		userMessage = '';

		// 添加用户消息到历史
		conversationHistory.push({
			type: 'user',
			text: message,
			timestamp: Date.now()
		});

		// 生成AI回复
		const response = await generateAIResponse(message);
		
		// 播放回复
		await speakWithAvatar(response.text, response.emotion);
	}

	/**
	 * 生成AI回复
	 */
	async function generateAIResponse(userMessage) {
		// 简化的AI回复逻辑
		const responses = {
			guanyin: {
				gentle: [
					'心如止水，方能照见真相。',
					'慈悲为怀，普度众生。',
					'放下执着，获得自在。'
				],
				wise: [
					'金刚般若，智慧现前。',
					'诸法因缘生，诸法因缘灭。',
					'色即是空，空即是色。'
				]
			},
			buddha: {
				wise: [
					'一切有为法，如梦幻泡影。',
					'菩提本无树，明镜亦非台。',
					'本来无一物，何处惹尘埃。'
				],
				serious: [
					'庄严佛净土，上报四重恩。',
					'愿以此功德，庄严佛净土。',
					'上报四重恩，下济三途苦。'
				]
			},
			immortal: {
				ethereal: [
					'道法自然，无为而治。',
					'心如止水，神如明镜。',
					'吐纳天地之气，感受仙道玄机。'
				],
				gentle: [
					'道友，长生不老之道在于心。',
					'仙道贵生，慈悲济世。',
					'逍遥自在，无拘无束。'
				]
			}
		};

		const divineResponses = responses[divineType] || responses.guanyin;
		const emotionResponses = divineResponses[emotion] || divineResponses.gentle;
		const randomResponse = emotionResponses[Math.floor(Math.random() * emotionResponses.length)];

		return {
			text: randomResponse,
			emotion: emotion
		};
	}

	/**
	 * 切换神仙类型
	 */
	function switchDivineType(newType) {
		divineType = newType;
		emotion = 'gentle';
		
		// 播放切换语音
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
	 * 播放祝福动画
	 */
	async function playBlessing() {
		if (avatarComponent) {
			avatarComponent.playAnimation('blessing');
		}
		
		await speakWithAvatar('愿你得神仙护佑，内心常驻慈悲。', 'serious');
	}

	/**
	 * 播放冥想动画
	 */
	async function playMeditation() {
		if (avatarComponent) {
			avatarComponent.playAnimation('meditation');
		}
		
		await speakWithAvatar('静心冥想，感受内心的宁静。', 'ethereal');
	}

	/**
	 * 播放太极云手动画
	 */
	async function playTaichiCloudHands() {
		if (avatarComponent) {
			avatarComponent.playAnimation('taichi_cloud_hands');
		}
		
		await speakWithAvatar('如行云流水，双手缓缓推移，阴阳调和。', 'ethereal');
	}

	/**
	 * 播放太极单鞭动画
	 */
	async function playTaichiSingleWhip() {
		if (avatarComponent) {
			avatarComponent.playAnimation('taichi_single_whip');
		}
		
		await speakWithAvatar('单鞭如长虹饮涧，一手勾，一手推，刚柔并济。', 'wise');
	}

	/**
	 * 播放太极白鹤亮翅动画
	 */
	async function playTaichiWhiteCrane() {
		if (avatarComponent) {
			avatarComponent.playAnimation('taichi_white_crane');
		}
		
		await speakWithAvatar('白鹤展翅，轻灵飘逸，如仙鹤临水照影。', 'gentle');
	}
</script>

<svelte:head>
	<title>神仙对话 - 交个神仙朋友</title>
	<meta name="description" content="与3D神仙进行深度对话，体验沉浸式神仙陪伴" />
</svelte:head>

<div class="mirror-page">
	<!-- 加载状态 -->
	{#if pageStatus === 'loading'}
		<div class="loading-container">
			<div class="loading-spinner">
				<div class="spinner-ring"></div>
				<div class="spinner-text">正在召唤神仙...</div>
			</div>
		</div>
	{:else if pageStatus === 'error'}
		<div class="error-container">
			<div class="error-message">
				<h2>召唤失败</h2>
				<p>神仙暂时无法降临，请稍后再试。</p>
				<button on:click={() => goto('/')}>返回首页</button>
			</div>
		</div>
	{:else}
		<!-- 主要内容 -->
		<div class="mirror-content">
			<!-- 3D神仙区域 -->
			<div class="avatar-section">
				<DivineAvatar 
					bind:this={avatarComponent}
					{divineType}
					{emotion}
					{isSpeaking}
					autoRotate={true}
					showControls={showControls}
					useVRM={true}
				/>
			</div>

			<!-- 控制面板 -->
			<div class="control-panel">
				<!-- 神仙类型选择 -->
				<div class="divine-type-selector">
					<h3>选择神仙</h3>
					<div class="type-buttons">
						<button 
							class="type-btn {divineType === 'guanyin' ? 'active' : ''}"
							on:click={() => switchDivineType('guanyin')}
						>
							<span class="icon">🙏</span>
							<span class="name">观音菩萨</span>
						</button>
						<button 
							class="type-btn {divineType === 'buddha' ? 'active' : ''}"
							on:click={() => switchDivineType('buddha')}
						>
							<span class="icon">🕉️</span>
							<span class="name">佛陀</span>
						</button>
						<button 
							class="type-btn {divineType === 'immortal' ? 'active' : ''}"
							on:click={() => switchDivineType('immortal')}
						>
							<span class="icon">🧘</span>
							<span class="name">神仙</span>
						</button>
					</div>
				</div>

				<!-- 情绪选择 -->
				<div class="emotion-selector">
					<h3>选择情绪</h3>
					<div class="emotion-buttons">
						<button 
							class="emotion-btn {emotion === 'gentle' ? 'active' : ''}"
							on:click={() => switchEmotion('gentle')}
						>
							温柔
						</button>
						<button 
							class="emotion-btn {emotion === 'wise' ? 'active' : ''}"
							on:click={() => switchEmotion('wise')}
						>
							智慧
						</button>
						<button 
							class="emotion-btn {emotion === 'ethereal' ? 'active' : ''}"
							on:click={() => switchEmotion('ethereal')}
						>
							空灵
						</button>
						<button 
							class="emotion-btn {emotion === 'serious' ? 'active' : ''}"
							on:click={() => switchEmotion('serious')}
						>
							庄严
						</button>
					</div>
				</div>

				<!-- 特殊动作 -->
				<div class="special-actions">
					<h3>特殊动作</h3>
					<div class="action-buttons">
						<button class="action-btn" on:click={playBlessing}>
							<span class="icon">✨</span>
							祝福
						</button>
						<button class="action-btn" on:click={playMeditation}>
							<span class="icon">🧘</span>
							冥想
						</button>
						<button class="action-btn" on:click={() => showControls = !showControls}>
							<span class="icon">🎮</span>
							控制
						</button>
					</div>
					
					<!-- 太极动作 -->
					<h3>太极演示</h3>
					<div class="taichi-buttons">
						<button class="taichi-btn" on:click={playTaichiCloudHands}>
							<span class="icon">☁️</span>
							云手
						</button>
						<button class="taichi-btn" on:click={playTaichiSingleWhip}>
							<span class="icon">🥋</span>
							单鞭
						</button>
						<button class="taichi-btn" on:click={playTaichiWhiteCrane}>
							<span class="icon">🕊️</span>
							白鹤亮翅
						</button>
					</div>
				</div>
			</div>

			<!-- 对话区域 -->
			<div class="conversation-section">
				<div class="conversation-history">
					{#each conversationHistory as message}
						<div class="message {message.type}">
							<div class="message-content">
								{message.text}
							</div>
							<div class="message-time">
								{new Date(message.timestamp).toLocaleTimeString()}
							</div>
						</div>
					{/each}
				</div>

				<div class="message-input">
					<input 
						type="text" 
						bind:value={userMessage}
						placeholder="输入您想说的话..."
						on:keydown={(e) => e.key === 'Enter' && handleUserMessage()}
					/>
					<button on:click={handleUserMessage} disabled={!userMessage.trim()}>
						发送
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.mirror-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
		display: flex;
		flex-direction: column;
	}

	.loading-container,
	.error-container {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading-spinner {
		text-align: center;
		color: #ffd700;
	}

	.spinner-ring {
		width: 80px;
		height: 80px;
		border: 4px solid rgba(255, 215, 0, 0.3);
		border-top: 4px solid #ffd700;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 20px;
	}

	.spinner-text {
		font-size: 18px;
		font-weight: 500;
		opacity: 0.8;
	}

	.error-message {
		text-align: center;
		color: #ffd700;
	}

	.error-message h2 {
		margin-bottom: 16px;
		font-size: 24px;
	}

	.error-message button {
		margin-top: 20px;
		padding: 12px 24px;
		background: rgba(255, 215, 0, 0.2);
		border: 1px solid rgba(255, 215, 0, 0.3);
		border-radius: 8px;
		color: #ffd700;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.error-message button:hover {
		background: rgba(255, 215, 0, 0.3);
	}

	.mirror-content {
		flex: 1;
		display: grid;
		grid-template-columns: 1fr 300px;
		grid-template-rows: 1fr auto;
		gap: 20px;
		padding: 20px;
		max-width: 1400px;
		margin: 0 auto;
		width: 100%;
	}

	.avatar-section {
		grid-row: 1 / 3;
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

	.divine-type-selector,
	.emotion-selector,
	.special-actions {
		background: rgba(255, 215, 0, 0.05);
		border-radius: 12px;
		padding: 16px;
		border: 1px solid rgba(255, 215, 0, 0.1);
	}

	.divine-type-selector h3,
	.emotion-selector h3,
	.special-actions h3 {
		color: #ffd700;
		font-size: 16px;
		margin-bottom: 12px;
		font-weight: 500;
	}

	.type-buttons,
	.emotion-buttons,
	.action-buttons {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.type-btn,
	.emotion-btn,
	.action-btn {
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

	.type-btn:hover,
	.emotion-btn:hover,
	.action-btn:hover {
		background: rgba(255, 215, 0, 0.2);
		border-color: rgba(255, 215, 0, 0.4);
	}

	.type-btn.active,
	.emotion-btn.active {
		background: rgba(255, 215, 0, 0.3);
		border-color: rgba(255, 215, 0, 0.6);
	}

	.type-btn .icon {
		font-size: 18px;
	}

	.type-btn .name {
		font-weight: 500;
	}

	/* 太极按钮样式 */
	.taichi-buttons {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
		margin-top: 8px;
	}

	.taichi-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 10px 6px;
		background: linear-gradient(135deg, #8B4513, #CD853F);
		border: none;
		border-radius: 10px;
		color: #fff;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		text-align: center;
		box-shadow: 0 2px 8px rgba(139, 69, 19, 0.3);
	}

	.taichi-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(139, 69, 19, 0.4);
		background: linear-gradient(135deg, #A0522D, #DEB887);
	}

	.taichi-btn .icon {
		font-size: 1.1rem;
	}

	.conversation-section {
		background: rgba(255, 215, 0, 0.05);
		border-radius: 12px;
		border: 1px solid rgba(255, 215, 0, 0.1);
		display: flex;
		flex-direction: column;
	}

	.conversation-history {
		flex: 1;
		padding: 16px;
		overflow-y: auto;
		max-height: 300px;
	}

	.message {
		margin-bottom: 12px;
		padding: 12px;
		border-radius: 8px;
		background: rgba(255, 215, 0, 0.1);
		border: 1px solid rgba(255, 215, 0, 0.2);
	}

	.message.user {
		background: rgba(255, 215, 0, 0.15);
		border-color: rgba(255, 215, 0, 0.3);
	}

	.message.ai {
		background: rgba(255, 215, 0, 0.1);
		border-color: rgba(255, 215, 0, 0.2);
	}

	.message-content {
		color: #ffd700;
		font-size: 14px;
		line-height: 1.5;
		margin-bottom: 4px;
	}

	.message-time {
		color: rgba(255, 215, 0, 0.6);
		font-size: 12px;
	}

	.message-input {
		display: flex;
		gap: 8px;
		padding: 16px;
		border-top: 1px solid rgba(255, 215, 0, 0.1);
	}

	.message-input input {
		flex: 1;
		padding: 10px 12px;
		background: rgba(255, 215, 0, 0.1);
		border: 1px solid rgba(255, 215, 0, 0.2);
		border-radius: 8px;
		color: #ffd700;
		font-size: 14px;
	}

	.message-input input::placeholder {
		color: rgba(255, 215, 0, 0.5);
	}

	.message-input button {
		padding: 10px 16px;
		background: rgba(255, 215, 0, 0.2);
		border: 1px solid rgba(255, 215, 0, 0.3);
		border-radius: 8px;
		color: #ffd700;
		cursor: pointer;
		transition: all 0.3s ease;
		font-size: 14px;
	}

	.message-input button:hover:not(:disabled) {
		background: rgba(255, 215, 0, 0.3);
		border-color: rgba(255, 215, 0, 0.5);
	}

	.message-input button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	/* 响应式设计 */
	@media (max-width: 1024px) {
		.mirror-content {
			grid-template-columns: 1fr;
			grid-template-rows: auto 1fr auto;
		}

		.avatar-section {
			grid-row: 1;
			height: 400px;
		}

		.control-panel {
			grid-row: 2;
			flex-direction: row;
			overflow-x: auto;
		}

		.conversation-section {
			grid-row: 3;
		}
	}

	@media (max-width: 768px) {
		.mirror-content {
			padding: 12px;
			gap: 12px;
		}

		.avatar-section {
			height: 300px;
		}

		.control-panel {
			flex-direction: column;
		}

		.type-buttons,
		.emotion-buttons {
			flex-direction: row;
			overflow-x: auto;
		}

		.type-btn,
		.emotion-btn {
			flex-shrink: 0;
		}
	}
</style> 