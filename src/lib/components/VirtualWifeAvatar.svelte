<script>
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { DivineTTS } from '$lib/utils/divineTTS.js';
	import { divineScripts } from '$lib/utils/divineScripts.js';

	// Props
	export let divineType = 'guanyin'; // guanyin, buddha, immortal
	export let emotion = 'gentle'; // gentle, happy, serious, peaceful
	export let isSpeaking = false;
	export let showControls = false;
	export let autoPlay = true;

	// 内部状态
	let container;
	let scene, camera, renderer, controls;
	let divineModel, mixer, currentAnimation;
	let clock = new THREE.Clock();
	let isInitialized = false;
	let tts = new DivineTTS();
	let chatHistory = [];
	let isListening = false;
	let recognition;

	// 千手观音图像配置
	const divineImageConfig = {
		guanyin: {
			url: 'https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%8D%83%E6%89%8B%E8%A7%82%E9%9F%B3.jpg',
			name: '千手观音',
			scale: 2.0,
			position: { x: 0, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 }
		},
		buddha: {
			url: 'https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%8D%83%E6%89%8B%E8%A7%82%E9%9F%B3.jpg',
			name: '佛陀',
			scale: 2.2,
			position: { x: 0, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 }
		},
		immortal: {
			url: 'https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%8D%83%E6%89%8B%E8%A7%82%E9%9F%B3.jpg',
			name: '神仙',
			scale: 1.8,
			position: { x: 0, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 }
		}
	};

	// 表情映射（用于颜色和发光效果）
	const emotionEffects = {
		gentle: { color: 0xffd700, glow: 0.3, intensity: 1.2 },
		happy: { color: 0xffaa00, glow: 0.5, intensity: 1.5 },
		serious: { color: 0x9966cc, glow: 0.2, intensity: 1.0 },
		peaceful: { color: 0x66ccff, glow: 0.4, intensity: 1.1 }
	};

	onMount(async () => {
		await initializeScene();
		await loadDivineModel();
		setupSpeechRecognition();
		animate();

		if (autoPlay) {
			startAutoConversation();
		}
	});

	onDestroy(() => {
		if (recognition) {
			recognition.stop();
		}
		if (mixer) {
			mixer.stopAllAction();
		}
	});

	/**
	 * 初始化Three.js场景
	 */
	async function initializeScene() {
		// 创建场景
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x0a0a0a);

		// 创建相机
		const aspect = container.clientWidth / container.clientHeight;
		camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
		camera.position.set(0, 0, 5);

		// 创建渲染器
		renderer = new THREE.WebGLRenderer({ 
			antialias: true,
			alpha: true
		});
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		container.appendChild(renderer.domElement);

		// 创建控制器
		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.maxPolarAngle = Math.PI;
		controls.minDistance = 2;
		controls.maxDistance = 10;
		controls.enablePan = false;

		// 添加光源
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(2, 4, 2);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.width = 2048;
		directionalLight.shadow.mapSize.height = 2048;
		scene.add(directionalLight);

		// 添加点光源营造神圣氛围
		const pointLight = new THREE.PointLight(0xffd700, 0.5, 10);
		pointLight.position.set(0, 2, 2);
		scene.add(pointLight);

		// 监听窗口大小变化
		window.addEventListener('resize', onWindowResize);
	}

	/**
	 * 加载千手观音3D模型
	 */
	async function loadDivineModel() {
		try {
			const config = divineImageConfig[divineType];
			
			// 创建纹理加载器
			const textureLoader = new THREE.TextureLoader();
			const texture = await new Promise((resolve, reject) => {
				textureLoader.load(
					config.url,
					resolve,
					undefined,
					reject
				);
			});

			// 创建平面几何体作为背景
			const planeGeometry = new THREE.PlaneGeometry(4, 6);
			const planeMaterial = new THREE.MeshBasicMaterial({
				map: texture,
				transparent: true,
				opacity: 0.9
			});
			const plane = new THREE.Mesh(planeGeometry, planeMaterial);
			plane.position.z = -1;

			// 创建主要的3D形象 - 使用立体几何
			const geometry = new THREE.CylinderGeometry(0.8, 1.2, 3, 8);
			const material = new THREE.MeshPhongMaterial({
				map: texture,
				transparent: true,
				opacity: 0.8,
				emissive: new THREE.Color(0x333333)
			});

			const divineBody = new THREE.Mesh(geometry, material);
			divineBody.position.set(0, 0, 0);
			divineBody.castShadow = true;
			divineBody.receiveShadow = true;

			// 创建光环
			const haloGeometry = new THREE.RingGeometry(1.5, 2.0, 32);
			const haloMaterial = new THREE.MeshBasicMaterial({
				color: 0xffd700,
				transparent: true,
				opacity: 0.3,
				side: THREE.DoubleSide
			});
			const halo = new THREE.Mesh(haloGeometry, haloMaterial);
			halo.position.set(0, 2, 0);
			halo.rotation.x = Math.PI / 2;

			// 创建手臂（表示千手）
			const arms = [];
			for (let i = 0; i < 8; i++) {
				const armGeometry = new THREE.CapsuleGeometry(0.1, 1.5, 4, 8);
				const armMaterial = new THREE.MeshPhongMaterial({
					color: 0xffd700,
					transparent: true,
					opacity: 0.6
				});
				const arm = new THREE.Mesh(armGeometry, armMaterial);
				
				const angle = (i / 8) * Math.PI * 2;
				arm.position.set(
					Math.cos(angle) * 1.2,
					0.5 + Math.sin(i * 0.5) * 0.3,
					Math.sin(angle) * 1.2
				);
				arm.rotation.z = angle;
				arms.push(arm);
			}

			// 组合所有元素
			divineModel = new THREE.Group();
			divineModel.add(plane);
			divineModel.add(divineBody);
			divineModel.add(halo);
			arms.forEach(arm => divineModel.add(arm));

			// 设置模型属性
			divineModel.scale.setScalar(config.scale);
			divineModel.position.set(
				config.position.x,
				config.position.y,
				config.position.z
			);
			divineModel.rotation.set(
				config.rotation.x,
				config.rotation.y,
				config.rotation.z
			);

			// 创建动画混合器
			mixer = new THREE.AnimationMixer(divineModel);

			// 创建呼吸动画
			createBreathingAnimation();

			// 创建手臂动画
			createArmsAnimation(arms);

			// 创建光环动画
			createHaloAnimation(halo);

			// 设置初始表情效果
			updateEmotionEffects();

			scene.add(divineModel);
			isInitialized = true;

			console.log('✅ 千手观音3D模型加载完成');

		} catch (error) {
			console.error('❌ 千手观音模型加载失败:', error);
			// 创建占位符模型
			createPlaceholderModel();
		}
	}

	/**
	 * 创建呼吸动画
	 */
	function createBreathingAnimation() {
		if (!divineModel) return;

		const times = [0, 2, 4];
		const values = [1, 1.05, 1];

		const scaleTrack = new THREE.VectorKeyframeTrack(
			'.scale',
			times,
			values.flatMap(v => [v, v, v])
		);

		const breathingClip = new THREE.AnimationClip('breathing', 4, [scaleTrack]);
		const breathingAction = mixer.clipAction(breathingClip);
		breathingAction.loop = THREE.LoopRepeat;
		breathingAction.play();
	}

	/**
	 * 创建手臂动画
	 */
	function createArmsAnimation(arms) {
		arms.forEach((arm, index) => {
			const times = [0, 1, 2];
			const rotationValues = [
				arm.rotation.z,
				arm.rotation.z + Math.sin(index) * 0.2,
				arm.rotation.z
			];

			const rotationTrack = new THREE.NumberKeyframeTrack(
				arm.name + '.rotation[z]',
				times,
				rotationValues
			);

			const armClip = new THREE.AnimationClip(`arm_${index}`, 2, [rotationTrack]);
			const armAction = mixer.clipAction(armClip);
			armAction.loop = THREE.LoopRepeat;
			armAction.timeScale = 0.5 + Math.random() * 0.5;
			armAction.play();
		});
	}

	/**
	 * 创建光环动画
	 */
	function createHaloAnimation(halo) {
		const times = [0, 5];
		const rotationValues = [0, Math.PI * 2];

		const rotationTrack = new THREE.NumberKeyframeTrack(
			halo.name + '.rotation[z]',
			times,
			rotationValues
		);

		const haloClip = new THREE.AnimationClip('halo_rotation', 5, [rotationTrack]);
		const haloAction = mixer.clipAction(haloClip);
		haloAction.loop = THREE.LoopRepeat;
		haloAction.play();
	}

	/**
	 * 创建占位符模型
	 */
	function createPlaceholderModel() {
		// 创建一个简单的几何体作为占位符
		const geometry = new THREE.SphereGeometry(1, 32, 32);
		const material = new THREE.MeshPhongMaterial({ 
			color: 0xffd700,
			emissive: 0x333333,
			transparent: true,
			opacity: 0.8
		});
		
		divineModel = new THREE.Mesh(geometry, material);
		divineModel.position.set(0, 0, 0);
		divineModel.castShadow = true;
		divineModel.receiveShadow = true;

		// 添加简单的旋转动画
		divineModel.userData.rotateAnimation = () => {
			divineModel.rotation.y += 0.01;
		};

		scene.add(divineModel);
		isInitialized = true;
	}

	/**
	 * 更新情绪效果
	 */
	function updateEmotionEffects() {
		if (!divineModel) return;

		const effects = emotionEffects[emotion];
		if (!effects) return;

		// 更新光环颜色
		const halo = divineModel.children.find(child => 
			child.geometry && child.geometry.type === 'RingGeometry'
		);
		if (halo) {
			halo.material.color.setHex(effects.color);
			halo.material.opacity = effects.glow;
		}

		// 更新点光源
		scene.traverse((object) => {
			if (object.type === 'PointLight') {
				object.color.setHex(effects.color);
				object.intensity = effects.intensity;
			}
		});
	}

	/**
	 * 设置语音识别
	 */
	function setupSpeechRecognition() {
		if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
			const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
			recognition = new SpeechRecognition();
			recognition.continuous = false;
			recognition.interimResults = false;
			recognition.lang = 'zh-CN';

			recognition.onstart = () => {
				isListening = true;
				console.log('🎤 开始语音识别');
			};

			recognition.onresult = (event) => {
				const transcript = event.results[0][0].transcript;
				console.log('🎤 识别结果:', transcript);
				handleUserInput(transcript);
			};

			recognition.onerror = (event) => {
				console.error('🎤 语音识别错误:', event.error);
				isListening = false;
			};

			recognition.onend = () => {
				isListening = false;
				console.log('🎤 语音识别结束');
			};
		}
	}

	/**
	 * 处理用户输入
	 */
	async function handleUserInput(input) {
		// 添加到聊天历史
		chatHistory.push({ role: 'user', content: input });

		// 生成AI回复
		const response = await generateAIResponse(input);
		chatHistory.push({ role: 'assistant', content: response });

		// 播放语音
		await speakResponse(response);
	}

	/**
	 * 生成AI回复
	 */
	async function generateAIResponse(userInput) {
		const responses = {
			guanyin: [
				'慈悲为怀，愿你心静如水。',
				'观音菩萨闻声救苦，愿你得到内心的平静。',
				'千手千眼，护佑众生。愿你的烦恼如云烟般消散。',
				'心中有佛，处处是净土。',
				'放下执念，随缘而行。'
			],
			buddha: [
				'一切有为法，如梦幻泡影。',
				'菩提本无树，明镜亦非台。',
				'万法皆空，因果不空。',
				'心若清净，世界清净。',
				'佛陀教导我们，要放下执着。'
			],
			immortal: [
				'道法自然，无为而治。',
				'逍遥自在，无拘无束。',
				'神仙之道，在于超脱。',
				'大道至简，返璞归真。',
				'天地与我并生，万物与我为一。'
			]
		};

		const typeResponses = responses[divineType];
		return typeResponses[Math.floor(Math.random() * typeResponses.length)];
	}

	/**
	 * 播放语音回复
	 */
	async function speakResponse(text) {
		try {
			isSpeaking = true;
			updateEmotionEffects(); // 说话时更新效果
			
			if (tts) {
				await tts.speak(text, divineType, emotion);
			}
		} catch (error) {
			console.error('语音播放失败:', error);
		} finally {
			isSpeaking = false;
		}
	}

	/**
	 * 开始自动对话
	 */
	async function startAutoConversation() {
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		const scripts = divineScripts.getScripts(divineType, emotion);
		const welcomeScript = scripts[Math.floor(Math.random() * scripts.length)];
		
		chatHistory.push({
			role: 'assistant',
			content: welcomeScript,
			timestamp: new Date()
		});

		await speakResponse(welcomeScript);
	}

	/**
	 * 启动语音识别
	 */
	function startListening() {
		if (recognition && !isListening) {
			recognition.start();
		}
	}

	/**
	 * 窗口大小变化处理
	 */
	function onWindowResize() {
		if (camera && renderer && container) {
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
		}
	}

	/**
	 * 动画循环
	 */
	function animate() {
		requestAnimationFrame(animate);

		const delta = clock.getDelta();

		// 更新动画混合器
		if (mixer) {
			mixer.update(delta);
		}

		// 更新占位符动画
		if (divineModel && divineModel.userData.rotateAnimation) {
			divineModel.userData.rotateAnimation();
		}

		// 更新控制器
		if (controls) {
			controls.update();
		}

		// 渲染场景
		if (renderer && scene && camera) {
			renderer.render(scene, camera);
		}
	}

	// 监听属性变化
	$: if (divineType && isInitialized) {
		loadDivineModel();
	}

	$: if (emotion && isInitialized) {
		updateEmotionEffects();
	}

	// 导出方法供父组件调用
	export function playAnimation(animationName) {
		console.log(`播放动画: ${animationName}`);
		// 根据动画名称调整效果
		if (animationName === 'speaking') {
			isSpeaking = true;
		} else if (animationName === 'idle') {
			isSpeaking = false;
		}
		updateEmotionEffects();
	}
</script>

<div class="virtual-wife-avatar-container" bind:this={container}>
	<!-- 加载状态 -->
	{#if !isInitialized}
		<div class="loading-overlay">
			<div class="loading-spinner">
				<div class="spinner-ring"></div>
				<div class="spinner-text">正在召唤千手观音...</div>
			</div>
		</div>
	{/if}
	
	<!-- 控制面板 -->
	{#if showControls && isInitialized}
		<div class="avatar-controls">
			<div class="control-group">
				<label>神仙类型：</label>
				<select bind:value={divineType}>
					<option value="guanyin">观音菩萨</option>
					<option value="buddha">佛陀</option>
					<option value="immortal">神仙</option>
				</select>
			</div>
			
			<div class="control-group">
				<label>情绪状态：</label>
				<select bind:value={emotion}>
					<option value="gentle">温柔</option>
					<option value="happy">喜悦</option>
					<option value="serious">庄严</option>
					<option value="peaceful">平静</option>
				</select>
			</div>
			
			<div class="control-group">
				<button on:click={startListening} disabled={isListening}>
					{isListening ? '正在聆听...' : '开始对话'}
				</button>
			</div>
		</div>
	{/if}

	<!-- 聊天历史 -->
	{#if chatHistory.length > 0}
		<div class="chat-history">
			{#each chatHistory as message}
				<div class="message {message.role}">
					<div class="message-content">{message.content}</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.virtual-wife-avatar-container {
		position: relative;
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
		border-radius: 12px;
		overflow: hidden;
	}

	.loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.9);
		z-index: 10;
	}

	.loading-spinner {
		text-align: center;
		color: #ffd700;
	}

	.spinner-ring {
		width: 60px;
		height: 60px;
		border: 3px solid rgba(255, 215, 0, 0.3);
		border-top: 3px solid #ffd700;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 20px;
	}

	.spinner-text {
		font-size: 16px;
		font-weight: 500;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.avatar-controls {
		position: absolute;
		top: 20px;
		left: 20px;
		background: rgba(0, 0, 0, 0.8);
		padding: 20px;
		border-radius: 12px;
		backdrop-filter: blur(10px);
		z-index: 5;
		border: 1px solid rgba(255, 215, 0, 0.3);
	}

	.control-group {
		margin-bottom: 15px;
	}

	.control-group label {
		display: block;
		color: #ffd700;
		font-size: 14px;
		margin-bottom: 5px;
		font-weight: 500;
	}

	.control-group select {
		width: 100%;
		padding: 8px 12px;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 215, 0, 0.3);
		border-radius: 6px;
		color: #ffd700;
		font-size: 14px;
	}

	.control-group button {
		width: 100%;
		padding: 10px 15px;
		background: linear-gradient(45deg, #ffd700, #ffaa00);
		border: none;
		border-radius: 6px;
		color: #000;
		font-weight: 600;
		font-size: 14px;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.control-group button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
	}

	.control-group button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.chat-history {
		position: absolute;
		bottom: 20px;
		left: 20px;
		right: 20px;
		max-height: 200px;
		overflow-y: auto;
		background: rgba(0, 0, 0, 0.8);
		padding: 15px;
		border-radius: 12px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 215, 0, 0.3);
	}

	.message {
		margin-bottom: 10px;
		padding: 8px 12px;
		border-radius: 8px;
		font-size: 14px;
		line-height: 1.4;
	}

	.message.user {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
		margin-left: 20px;
	}

	.message.assistant {
		background: rgba(255, 215, 0, 0.1);
		color: #ffd700;
		margin-right: 20px;
	}

	.message-content {
		word-wrap: break-word;
	}
</style> 