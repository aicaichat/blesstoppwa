<script>
	import { onMount } from 'svelte';
	import VirtualWifeAvatar from '$lib/components/VirtualWifeAvatar.svelte';
	import { DivineTTS } from '$lib/utils/divineTTS.js';
	import { divineScripts } from '$lib/utils/divineScripts.js';

	// 页面状态
	let divineType = 'guanyin'; // guanyin, buddha, immortal
	let emotion = 'gentle'; // gentle, happy, serious, peaceful
	let showControls = true;
	let isInitialized = false;
	let tts = new DivineTTS();
	let chatHistory = [];
	let isListening = false;
	let currentMessage = '';

	// 角色配置
	const divineConfig = {
		guanyin: {
			name: '观音菩萨',
			description: '慈悲为怀，普度众生',
			color: '#ffd700'
		},
		buddha: {
			name: '佛陀',
			description: '智慧圆满，觉悟人生',
			color: '#ff6b35'
		},
		immortal: {
			name: '神仙',
			description: '逍遥自在，无拘无束',
			color: '#4ecdc4'
		}
	};

	onMount(async () => {
		// 初始化TTS
		await tts.init();
		isInitialized = true;

		// 自动播放欢迎语
		setTimeout(() => {
			playWelcomeMessage();
		}, 2000);
	});

	/**
	 * 播放欢迎语
	 */
	async function playWelcomeMessage() {
		const scripts = divineScripts.getScripts(divineType, emotion);
		const welcomeScript = scripts[Math.floor(Math.random() * scripts.length)];
		
		// 添加到聊天历史
		chatHistory = [...chatHistory, {
			role: 'assistant',
			content: welcomeScript,
			timestamp: new Date()
		}];

		// 播放语音
		await tts.speak(welcomeScript, divineType, emotion);
	}

	/**
	 * 处理用户输入
	 */
	async function handleUserInput(input) {
		if (!input.trim()) return;

		// 添加用户消息到历史
		chatHistory = [...chatHistory, {
			role: 'user',
			content: input,
			timestamp: new Date()
		}];

		// 生成AI回复
		const response = await generateAIResponse(input);
		
		// 添加AI回复到历史
		chatHistory = [...chatHistory, {
			role: 'assistant',
			content: response,
			timestamp: new Date()
		}];

		// 播放语音
		await tts.speak(response, divineType, emotion);
	}

	/**
	 * 生成AI回复
	 */
	async function generateAIResponse(userInput) {
		// 这里可以集成不同的AI模型
		// 目前使用简单的规则回复
		const responses = {
			guanyin: [
				'慈悲为怀，愿你心静如水。放下执念，随缘而行。',
				'心中有佛，处处是净土。愿你的烦恼如云烟般消散。',
				'一切皆空，因果不空。善有善报，恶有恶报。',
				'慈悲喜舍，四无量心。愿众生离苦得乐。',
				'观音菩萨慈悲救苦，愿你得到内心的平静。'
			],
			buddha: [
				'一切有为法，如梦幻泡影。如露亦如电，应作如是观。',
				'菩提本无树，明镜亦非台。本来无一物，何处惹尘埃。',
				'万法皆空，因果不空。种善因得善果。',
				'心若清净，世界清净。心若污浊，世界污浊。',
				'佛陀教导我们，要放下执着，获得真正的自由。'
			],
			immortal: [
				'道法自然，无为而治。顺其自然，随遇而安。',
				'逍遥自在，无拘无束。天地与我并生，万物与我为一。',
				'神仙之道，在于超脱。不为物役，不为情困。',
				'大道至简，返璞归真。回归本心，方得自在。',
				'神仙逍遥，不受世俗束缚。愿你也能获得内心的自由。'
			]
		};

		const typeResponses = responses[divineType];
		const randomResponse = typeResponses[Math.floor(Math.random() * typeResponses.length)];
		
		return randomResponse;
	}

	/**
	 * 切换神仙类型
	 */
	async function switchDivineType(type) {
		divineType = type;
		
		// 播放切换提示
		const config = divineConfig[type];
		const message = `我是${config.name}，${config.description}`;
		
		chatHistory = [...chatHistory, {
			role: 'assistant',
			content: message,
			timestamp: new Date()
		}];

		await tts.speak(message, divineType, emotion);
	}

	/**
	 * 切换情绪
	 */
	async function switchEmotion(newEmotion) {
		emotion = newEmotion;
		
		const emotionTexts = {
			gentle: '我以温柔之心与你对话',
			happy: '我以欢喜之心与你对话',
			serious: '我以庄严之心与你对话',
			peaceful: '我以平静之心与你对话'
		};

		const message = emotionTexts[emotion];
		chatHistory = [...chatHistory, {
			role: 'assistant',
			content: message,
			timestamp: new Date()
		}];

		await tts.speak(message, divineType, emotion);
	}

	/**
	 * 发送消息
	 */
	function sendMessage() {
		if (currentMessage.trim()) {
			handleUserInput(currentMessage);
			currentMessage = '';
		}
	}

	/**
	 * 清空聊天记录
	 */
	function clearChat() {
		chatHistory = [];
	}
</script>

<svelte:head>
	<title>神仙伴侣 - VirtualWife</title>
	<meta name="description" content="与神仙伴侣进行语音对话，获得心灵的慰藉和智慧的指引" />
</svelte:head>

<div class="virtual-wife-page">
	<!-- 头部 -->
	<div class="header">
		<div class="title">
			<h1>神仙伴侣</h1>
			<p>与神仙对话，获得心灵的慰藉</p>
		</div>
		
		<div class="controls">
			<div class="divine-type-selector">
				<label for="divine-type-select">选择神仙：</label>
				<select id="divine-type-select" bind:value={divineType} on:change={() => switchDivineType(divineType)}>
					<option value="guanyin">观音菩萨</option>
					<option value="buddha">佛陀</option>
					<option value="immortal">神仙</option>
				</select>
			</div>
			
			<div class="emotion-selector">
				<label for="emotion-select">情绪：</label>
				<select id="emotion-select" bind:value={emotion} on:change={() => switchEmotion(emotion)}>
					<option value="gentle">温柔</option>
					<option value="happy">开心</option>
					<option value="serious">严肃</option>
					<option value="peaceful">平静</option>
				</select>
			</div>
		</div>
	</div>

	<!-- 主要内容区域 -->
	<div class="main-content">
		<!-- 3D模型区域 -->
		<div class="avatar-section">
			<VirtualWifeAvatar 
				{divineType}
				{emotion}
				{showControls}
				autoPlay={true}
			/>
		</div>

		<!-- 聊天区域 -->
		<div class="chat-section">
			<div class="chat-header">
				<h3>{divineConfig[divineType].name}</h3>
				<p>{divineConfig[divineType].description}</p>
			</div>

			<!-- 聊天历史 -->
			<div class="chat-history">
				{#each chatHistory as message}
					<div class="message {message.role}">
						<div class="message-content">
							{message.content}
						</div>
						<div class="message-time">
							{message.timestamp.toLocaleTimeString()}
						</div>
					</div>
				{/each}
			</div>

			<!-- 输入区域 -->
			<div class="chat-input">
				<div class="input-container">
					<input 
						type="text" 
						bind:value={currentMessage}
						placeholder="输入你想说的话..."
						on:keydown={(e) => e.key === 'Enter' && sendMessage()}
					/>
					<button on:click={sendMessage} disabled={!currentMessage.trim()}>
						发送
					</button>
				</div>
				
				<div class="quick-actions">
					<button on:click={() => handleUserInput('我想寻求内心的平静')}>
						寻求平静
					</button>
					<button on:click={() => handleUserInput('我有很多烦恼')}>
						倾诉烦恼
					</button>
					<button on:click={() => handleUserInput('请给我一些建议')}>
						寻求建议
					</button>
					<button on:click={clearChat}>
						清空记录
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- 功能说明 -->
	<div class="features">
		<div class="feature-card">
			<h4>🎭 3D神仙模型</h4>
			<p>逼真的3D神仙模型，支持表情和动作变化</p>
		</div>
		<div class="feature-card">
			<h4>🗣️ 语音对话</h4>
			<p>支持语音识别和语音合成，自然流畅的对话体验</p>
		</div>
		<div class="feature-card">
			<h4>🧠 智能回复</h4>
			<p>基于不同神仙角色的智能回复系统</p>
		</div>
		<div class="feature-card">
			<h4>💫 情绪调节</h4>
			<p>多种情绪模式，适应不同的对话场景</p>
		</div>
	</div>
</div>

<style>
	.virtual-wife-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
		color: #ffffff;
		padding: 20px;
	}

	.header {
		text-align: center;
		margin-bottom: 30px;
	}

	.title h1 {
		font-size: 2.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-bottom: 10px;
	}

	.title p {
		font-size: 1.1rem;
		color: #cccccc;
		margin: 0;
	}

	.controls {
		display: flex;
		justify-content: center;
		gap: 30px;
		margin-top: 20px;
	}

	.divine-type-selector,
	.emotion-selector {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.controls label {
		font-size: 14px;
		color: #ffd700;
	}

	.controls select {
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 215, 0, 0.3);
		border-radius: 8px;
		padding: 8px 12px;
		color: #ffffff;
		font-size: 14px;
		cursor: pointer;
	}

	.controls select:focus {
		outline: none;
		border-color: #ffd700;
	}

	.main-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 30px;
		margin-bottom: 40px;
	}

	.avatar-section {
		height: 500px;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.chat-section {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		height: 500px;
	}

	.chat-header {
		text-align: center;
		margin-bottom: 20px;
		padding-bottom: 15px;
		border-bottom: 1px solid rgba(255, 215, 0, 0.2);
	}

	.chat-header h3 {
		font-size: 1.5rem;
		color: #ffd700;
		margin: 0 0 5px 0;
	}

	.chat-header p {
		font-size: 0.9rem;
		color: #cccccc;
		margin: 0;
	}

	.chat-history {
		flex: 1;
		overflow-y: auto;
		margin-bottom: 20px;
		padding-right: 10px;
	}

	.message {
		margin-bottom: 15px;
		padding: 12px 16px;
		border-radius: 12px;
		max-width: 85%;
		word-wrap: break-word;
	}

	.message.user {
		background: rgba(255, 215, 0, 0.2);
		color: #ffd700;
		margin-left: auto;
		text-align: right;
	}

	.message.assistant {
		background: rgba(255, 255, 255, 0.1);
		color: #ffffff;
		margin-right: auto;
	}

	.message-content {
		font-size: 14px;
		line-height: 1.5;
		margin-bottom: 5px;
	}

	.message-time {
		font-size: 11px;
		opacity: 0.6;
	}

	.chat-input {
		border-top: 1px solid rgba(255, 215, 0, 0.2);
		padding-top: 15px;
	}

	.input-container {
		display: flex;
		gap: 10px;
		margin-bottom: 15px;
	}

	.input-container input {
		flex: 1;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 215, 0, 0.3);
		border-radius: 8px;
		padding: 12px 16px;
		color: #ffffff;
		font-size: 14px;
	}

	.input-container input:focus {
		outline: none;
		border-color: #ffd700;
	}

	.input-container input::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.input-container button {
		background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
		border: none;
		border-radius: 8px;
		padding: 12px 20px;
		color: #0f0f0f;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.input-container button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
	}

	.input-container button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.quick-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.quick-actions button {
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 215, 0, 0.3);
		border-radius: 6px;
		padding: 6px 12px;
		color: #ffd700;
		font-size: 12px;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.quick-actions button:hover {
		background: rgba(255, 215, 0, 0.2);
		border-color: #ffd700;
	}

	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
		margin-top: 40px;
	}

	.feature-card {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 215, 0, 0.2);
		border-radius: 12px;
		padding: 20px;
		text-align: center;
		transition: all 0.3s ease;
	}

	.feature-card:hover {
		transform: translateY(-5px);
		border-color: #ffd700;
		box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2);
	}

	.feature-card h4 {
		font-size: 1.2rem;
		color: #ffd700;
		margin: 0 0 10px 0;
	}

	.feature-card p {
		font-size: 0.9rem;
		color: #cccccc;
		margin: 0;
		line-height: 1.4;
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.main-content {
			grid-template-columns: 1fr;
			gap: 20px;
		}

		.avatar-section {
			height: 300px;
		}

		.chat-section {
			height: 400px;
		}

		.controls {
			flex-direction: column;
			gap: 15px;
		}

		.title h1 {
			font-size: 2rem;
		}

		.features {
			grid-template-columns: 1fr;
		}
	}

	/* 滚动条样式 */
	.chat-history::-webkit-scrollbar {
		width: 6px;
	}

	.chat-history::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 3px;
	}

	.chat-history::-webkit-scrollbar-thumb {
		background: rgba(255, 215, 0, 0.3);
		border-radius: 3px;
	}

	.chat-history::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 215, 0, 0.5);
	}
</style> 