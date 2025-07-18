<script>
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { VRMModel } from '$lib/utils/vrmModel.ts';

	// Props
	export let divineType = 'guanyin'; // guanyin, buddha, immortal
	export let emotion = 'gentle'; // gentle, wise, ethereal, serious
	export let isSpeaking = false;
	export let autoRotate = true;
	export let showControls = false;
	export let useVRM = false; // 是否使用VRM模型
	export let selectedVRM = 'aili.vrm'; // 选择的VRM模型

	// 3D 场景相关
	let container;
	let scene, camera, renderer, controls;
	let avatar, mixer, clock;
	let currentAnimation = null;
	let isInitialized = false;
	let vrmModel = null;

	// 可用的VRM模型列表
	const availableVRMs = [
		{ name: 'Aili', file: 'aili.vrm', description: '可爱少女模型', route: '/api/vrm/aili' },
		{ name: 'Hailey', file: 'hailey.vrm', description: '活力少女模型', route: '/api/vrm/hailey' },
		{ name: '后藤仁', file: '后藤仁.vrm', description: '日系少女模型', route: '/api/vrm/houtouren' },
		{ name: '活力少女', file: '活力少女.vrm', description: '运动风格模型', route: '/api/vrm/huoli' },
		{ name: 'わたあめ_02', file: 'わたあめ_02.vrm', description: '棉花糖系列模型', route: '/api/vrm/wataame02' },
		{ name: 'わたあめ_03', file: 'わたあめ_03.vrm', description: '棉花糖系列模型', route: '/api/vrm/wataame03' },
		{ name: 'G2', file: 'g2.vrm', description: '高质量模型', route: '/api/vrm/g2' },
		{ name: 'God', file: 'god.vrm', description: '神仙模型', route: '/api/vrm/god' }
	];

	// 千手观音图像配置
	const divineConfig = {
		guanyin: {
			imageUrl: '/api/image?url=https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%8D%83%E6%89%8B%E8%A7%82%E9%9F%B3.jpg',
			localImageUrl: '/guanyin-avatar.svg', // 本地备选图片
			vrmUrl: getVRMRoute(selectedVRM), // 使用API路由加载VRM模型
			name: '千手观音',
			scale: 1.5,
			position: { x: 0, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
			animations: {
				idle: 'idle',
				speaking: 'speaking',
				blessing: 'blessing',
				meditation: 'meditation'
			}
		},
		buddha: {
			imageUrl: '/api/image?url=https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%8D%83%E6%89%8B%E8%A7%82%E9%9F%B3.jpg',
			localImageUrl: '/buddha-avatar.svg',
			vrmUrl: getVRMRoute(selectedVRM),
			name: '佛陀',
			scale: 1.7,
			position: { x: 0, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
			animations: {
				idle: 'idle',
				speaking: 'speaking',
				blessing: 'blessing',
				meditation: 'meditation'
			}
		},
		immortal: {
			imageUrl: '/api/image?url=https://ssswork.oss-cn-hangzhou.aliyuncs.com/jss/%E5%8D%83%E6%89%8B%E8%A7%82%E9%9F%B3.jpg',
			localImageUrl: '/immortal-avatar.svg',
			vrmUrl: getVRMRoute(selectedVRM),
			name: '神仙',
			scale: 1.3,
			position: { x: 0, y: -0.8, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
			animations: {
				idle: 'idle',
				speaking: 'speaking',
				blessing: 'blessing',
				meditation: 'meditation'
			}
		}
	};

	// 获取VRM路由的函数
	function getVRMRoute(filename) {
		const vrm = availableVRMs.find(v => v.file === filename);
		return vrm ? vrm.route : '/api/vrm/aili'; // 默认使用aili
	}

	// 情绪效果映射（用于颜色和光照效果）
	const emotionEffects = {
		gentle: { 
			color: 0xffd700, 
			intensity: 1.2, 
			glow: 0.4,
			haloOpacity: 0.4
		},
		wise: { 
			color: 0x9966cc, 
			intensity: 1.0, 
			glow: 0.3,
			haloOpacity: 0.5
		},
		ethereal: { 
			color: 0x66ccff, 
			intensity: 1.3, 
			glow: 0.5,
			haloOpacity: 0.3
		},
		serious: { 
			color: 0xcc6666, 
			intensity: 0.9, 
			glow: 0.2,
			haloOpacity: 0.6
		}
	};

	onMount(async () => {
		await initScene();
		await loadAvatar();
		setupAnimations();
		animate();
	});

	onDestroy(() => {
		if (renderer) {
			renderer.dispose();
		}
		if (container) {
			container.innerHTML = '';
		}
		if (vrmModel) {
			// 清理VRM模型
			vrmModel.dispose();
			vrmModel = null;
		}
	});

	// 监听属性变化
	$: if (isInitialized && divineType) {
		updateAvatarType();
	}

	$: if (isInitialized && emotion) {
		updateEmotion();
	}

	$: if (isInitialized && isSpeaking) {
		updateSpeakingState();
	}

	/**
	 * 初始化3D场景
	 */
	async function initScene() {
		// 创建场景
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x000000);

		// 创建相机
		camera = new THREE.PerspectiveCamera(
			75,
			container.clientWidth / container.clientHeight,
			0.1,
			1000
		);
		camera.position.set(0, 1.5, 3);

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
		if (showControls) {
			controls = new OrbitControls(camera, renderer.domElement);
			controls.enableDamping = true;
			controls.dampingFactor = 0.05;
			controls.autoRotate = autoRotate;
			controls.autoRotateSpeed = 0.5;
		}

		// 添加光源
		setupLighting();

		// 创建时钟
		clock = new THREE.Clock();

		// 监听窗口大小变化
		window.addEventListener('resize', onWindowResize);
	}

	/**
	 * 设置光照
	 */
	function setupLighting() {
		// 环境光
		const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
		scene.add(ambientLight);

		// 主光源
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(5, 5, 5);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.width = 2048;
		directionalLight.shadow.mapSize.height = 2048;
		scene.add(directionalLight);

		// 补光
		const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
		fillLight.position.set(-5, 3, -5);
		scene.add(fillLight);

		// 神仙光环效果
		const divineLight = new THREE.PointLight(0xffd700, 0.5, 10);
		divineLight.position.set(0, 2, 0);
		scene.add(divineLight);
	}

	/**
	 * 加载千手观音3D形象
	 */
	async function loadAvatar() {
		try {
			const config = divineConfig[divineType];
			
			// 如果启用VRM模式，尝试加载VRM模型
			if (useVRM && config.vrmUrl) {
				await loadVRM();
			} else {
				await loadImageBasedModel(config);
			}
			
		} catch (error) {
			console.error('❌ 神仙形象加载失败:', error);
			// 创建占位符
			await createPlaceholder();
		}
	}

	/**
	 * 加载VRM模型
	 */
	async function loadVRM() {
		try {
			const config = divineConfig[divineType];
			const vrmUrl = config.vrmUrl;
			
			console.log('🎭 开始加载VRM模型:', vrmUrl);
			
			// 创建新的VRM模型实例
			vrmModel = new VRMModel();
			
			// 加载VRM模型
			await vrmModel.loadVRM(vrmUrl);
			
			if (!vrmModel.vrm) {
				throw new Error('VRM模型加载失败');
			}
			
			// 设置模型属性
			avatar = vrmModel.vrm.scene;
			mixer = vrmModel.mixer;
			
			// 配置模型位置和缩放
			avatar.scale.setScalar(config.scale);
			avatar.position.set(config.position.x, config.position.y, config.position.z);
			avatar.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);
			
			// 启用阴影
			avatar.traverse((child) => {
				if (child && typeof child === 'object' && 'isMesh' in child && child.isMesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});
			
			// 保存VRM模型引用
			avatar.userData.vrmModel = vrmModel;
			
			scene.add(avatar);
			
			// 加载动画
			await vrmModel.loadAnimations();
			
			isInitialized = true;
			console.log('✅ VRM模型加载完成');
			
		} catch (error) {
			console.error('❌ VRM模型加载失败:', error);
			// 创建占位符
			createPlaceholder();
		}
	}

	/**
	 * 加载基于图像的3D模型
	 */
	async function loadImageBasedModel(config) {
		console.log('🎭 加载图像模型:', config.localImageUrl);
		
		// 创建纹理加载器
		const textureLoader = new THREE.TextureLoader();
		const texture = await new Promise((resolve, reject) => {
			textureLoader.load(
				config.localImageUrl,
				resolve,
				undefined,
				reject
			);
		});

		// 创建平面几何体作为背景
		const planeGeometry = new THREE.PlaneGeometry(3, 4);
		const planeMaterial = new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true,
			opacity: 0.9
		});
		const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		plane.position.z = -0.5;

		// 创建主要的3D形象 - 使用立体几何
		const bodyGeometry = new THREE.CylinderGeometry(0.6, 1.0, 2.5, 8);
		const bodyMaterial = new THREE.MeshPhongMaterial({
			map: texture,
			transparent: true,
			opacity: 0.7,
			emissive: new THREE.Color(0x222222)
		});

		const divineBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
		divineBody.position.set(0, 0, 0);
		divineBody.castShadow = true;
		divineBody.receiveShadow = true;

		// 创建光环
		const haloGeometry = new THREE.RingGeometry(1.2, 1.6, 32);
		const haloMaterial = new THREE.MeshBasicMaterial({
			color: 0xffd700,
			transparent: true,
			opacity: 0.4,
			side: THREE.DoubleSide
		});
		const halo = new THREE.Mesh(haloGeometry, haloMaterial);
		halo.position.set(0, 1.8, 0);
		halo.rotation.x = Math.PI / 2;

		// 创建手臂（表示千手）
		const arms = [];
		for (let i = 0; i < 6; i++) {
			const armGeometry = new THREE.CapsuleGeometry(0.08, 1.2, 4, 8);
			const armMaterial = new THREE.MeshPhongMaterial({
				color: 0xffd700,
				transparent: true,
				opacity: 0.5
			});
			const arm = new THREE.Mesh(armGeometry, armMaterial);
			
			const angle = (i / 6) * Math.PI * 2;
			arm.position.set(
				Math.cos(angle) * 1.0,
				0.3 + Math.sin(i * 0.7) * 0.2,
				Math.sin(angle) * 1.0
			);
			arm.rotation.z = angle;
			arms.push(arm);
		}

		// 组合所有元素
		avatar = new THREE.Group();
		avatar.add(plane);
		avatar.add(divineBody);
		avatar.add(halo);
		arms.forEach(arm => avatar.add(arm));

		// 设置模型属性
		avatar.scale.setScalar(config.scale);
		avatar.position.set(
			config.position.x,
			config.position.y,
			config.position.z
		);
		avatar.rotation.set(
			config.rotation.x,
			config.rotation.y,
			config.rotation.z
		);

		// 创建动画混合器
		mixer = new THREE.AnimationMixer(avatar);

		// 创建呼吸动画
		createBreathingAnimation();

		// 创建手臂动画
		createArmsAnimation(arms);

		// 创建光环动画
		createHaloAnimation(halo);

		// 设置表情效果
		updateEmotion();
		
		scene.add(avatar);
		
		isInitialized = true;
		console.log('✅ 图像模型加载完成');
	}

	/**
	 * 创建呼吸动画
	 */
	function createBreathingAnimation() {
		if (!avatar) return;

		const times = [0, 2, 4];
		const values = [1, 1.03, 1];

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
			const times = [0, 1.5, 3];
			const rotationValues = [
				arm.rotation.z,
				arm.rotation.z + Math.sin(index) * 0.15,
				arm.rotation.z
			];

			const rotationTrack = new THREE.NumberKeyframeTrack(
				arm.name + '.rotation[z]',
				times,
				rotationValues
			);

			const armClip = new THREE.AnimationClip(`arm_${index}`, 3, [rotationTrack]);
			const armAction = mixer.clipAction(armClip);
			armAction.loop = THREE.LoopRepeat;
			armAction.timeScale = 0.6 + Math.random() * 0.4;
			armAction.play();
		});
	}

	/**
	 * 创建光环动画
	 */
	function createHaloAnimation(halo) {
		const times = [0, 8];
		const rotationValues = [0, Math.PI * 2];

		const rotationTrack = new THREE.NumberKeyframeTrack(
			halo.name + '.rotation[z]',
			times,
			rotationValues
		);

		const haloClip = new THREE.AnimationClip('halo_rotation', 8, [rotationTrack]);
		const haloAction = mixer.clipAction(haloClip);
		haloAction.loop = THREE.LoopRepeat;
		haloAction.play();
	}

	/**
	 * 创建占位符模型
	 */
	async function createPlaceholder() {
		// 使用占位符系统
		const { createPlaceholderAvatar } = await import('$lib/utils/avatarPlaceholder.js');
		const { avatar: placeholderAvatar, placeholder } = createPlaceholderAvatar(scene, divineType);
		
		avatar = placeholderAvatar;
		mixer = placeholder.mixer;
		
		// 设置位置和缩放
		const config = divineConfig[divineType];
		avatar.scale.setScalar(config.scale);
		avatar.position.set(
			config.position.x,
			config.position.y,
			config.position.z
		);
		avatar.rotation.set(
			config.rotation.x,
			config.rotation.y,
			config.rotation.z
		);
		
		avatar.castShadow = true;
		avatar.receiveShadow = true;
		
		scene.add(avatar);
		isInitialized = true;
		
		// 保存占位符引用
		avatar.userData.placeholder = placeholder;
	}

	/**
	 * 设置动画
	 */
	function setupAnimations() {
		if (!avatar) return;

		// 如果是VRM模型，使用VRM动画
		if (vrmModel) {
			// VRM动画由VRM加载器处理
			return;
		}

		// 原有的动画逻辑保持不变
		if (!avatar.userData.vrm) return;

		const vrm = avatar.userData.vrm;
		const animations = vrm.animations;

		// 设置默认动画
		if (animations && animations.length > 0) {
			const idleAction = mixer.clipAction(animations[0]);
			idleAction.play();
			currentAnimation = idleAction;
		}
	}

	/**
	 * 更新神仙类型
	 */
	async function updateAvatarType() {
		if (avatar) {
			scene.remove(avatar);
		}
		await loadAvatar();
		setupAnimations();
	}

	/**
	 * 更新情绪表情
	 */
	function updateEmotion() {
		if (!avatar) return;

		// 检查是否有占位符
		if (avatar.userData.placeholder) {
			avatar.userData.placeholder.setEmotion(emotion);
			return;
		}

		// VRM表情暂时跳过，专注动画系统
		console.log('情绪更新:', emotion);
	}

	/**
	 * 更新说话状态
	 */
	function updateSpeakingState() {
		if (!avatar) return;

		// 如果是VRM模型，使用VRM动画系统
		if (vrmModel) {
			const animationName = isSpeaking ? 'talking_01' : 'idle_01';
			vrmModel.playAnimation(animationName);
			return;
		}

		// 检查是否有占位符
		if (avatar.userData.placeholder) {
			avatar.userData.placeholder.setSpeaking(isSpeaking);
			return;
		}

		// 原有的VRM动画逻辑
		if (!avatar.userData.vrm) return;

		const vrm = avatar.userData.vrm;
		const animations = vrm.animations;

		if (isSpeaking && animations && animations.length > 1) {
			// 播放说话动画
			const speakAction = mixer.clipAction(animations[1]);
			if (currentAnimation) {
				currentAnimation.stop();
			}
			speakAction.play();
			currentAnimation = speakAction;
		} else if (!isSpeaking && animations && animations.length > 0) {
			// 回到待机动画
			const idleAction = mixer.clipAction(animations[0]);
			if (currentAnimation) {
				currentAnimation.stop();
			}
			idleAction.play();
			currentAnimation = idleAction;
		}
	}

	/**
	 * 播放特定动画
	 */
	function playAnimation(animationName) {
		if (!avatar) return;

		// 如果是VRM模型，使用VRM动画系统
		if (vrmModel) {
			vrmModel.playAnimation(animationName);
			return;
		}

		// 检查是否有占位符
		if (avatar.userData.placeholder) {
			avatar.userData.placeholder.playAnimation(animationName);
			return;
		}

		// 原有的VRM动画逻辑
		if (!avatar.userData.vrm) return;

		const vrm = avatar.userData.vrm;
		const animations = vrm.animations;
		const config = divineConfig[divineType];

		const animationIndex = Object.values(config.animations).indexOf(animationName);
		if (animationIndex >= 0 && animations[animationIndex]) {
			const action = mixer.clipAction(animations[animationIndex]);
			if (currentAnimation) {
				currentAnimation.stop();
			}
			action.play();
			currentAnimation = action;
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

		// 更新VRM模型
		if (vrmModel) {
			vrmModel.update(delta);
		}

		// 更新占位符动画
		if (avatar && avatar.userData.placeholder) {
			avatar.userData.placeholder.update(delta);
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

	// 导出方法供父组件调用
	export { playAnimation };
</script>

<div class="divine-avatar-container" bind:this={container}>
	<!-- 加载状态 -->
	{#if !isInitialized}
		<div class="loading-overlay">
			<div class="loading-spinner">
				<div class="spinner-ring"></div>
				<div class="spinner-text">正在召唤 神仙...</div>
			</div>
		</div>
	{/if}
	
	<!-- 控制面板 -->
	{#if showControls}
		<div class="avatar-controls">
			<div class="control-section">
				<h4>动画控制</h4>
				<div class="button-group">
					<button on:click={() => playAnimation('idle')}>待机</button>
					<button on:click={() => playAnimation('speaking')}>说话</button>
					<button on:click={() => playAnimation('blessing')}>祝福</button>
					<button on:click={() => playAnimation('meditation')}>冥想</button>
				</div>
			</div>
			
			{#if useVRM}
				<div class="control-section">
					<h4>VRM模型</h4>
					<select bind:value={selectedVRM} on:change={() => updateAvatarType()}>
						{#each availableVRMs as vrm}
							<option value={vrm.file}>{vrm.name} - {vrm.description}</option>
						{/each}
					</select>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.divine-avatar-container {
		position: relative;
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
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
		background: rgba(0, 0, 0, 0.8);
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

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.spinner-text {
		font-size: 16px;
		font-weight: 500;
		text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
	}

	.avatar-controls {
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		gap: 15px;
		z-index: 5;
		background: rgba(0, 0, 0, 0.8);
		padding: 15px;
		border-radius: 10px;
		border: 1px solid rgba(255, 215, 0, 0.3);
	}

	.control-section {
		text-align: center;
	}

	.control-section h4 {
		color: #ffd700;
		margin: 0 0 10px 0;
		font-size: 14px;
		font-weight: 600;
	}

	.button-group {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		justify-content: center;
	}

	.avatar-controls button {
		padding: 6px 12px;
		background: rgba(255, 215, 0, 0.2);
		border: 1px solid rgba(255, 215, 0, 0.5);
		border-radius: 4px;
		color: #ffd700;
		font-size: 11px;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.avatar-controls button:hover {
		background: rgba(255, 215, 0, 0.3);
		border-color: rgba(255, 215, 0, 0.8);
		transform: translateY(-1px);
	}

	.avatar-controls select {
		padding: 6px 10px;
		background: rgba(255, 215, 0, 0.1);
		border: 1px solid rgba(255, 215, 0, 0.5);
		border-radius: 4px;
		color: #ffd700;
		font-size: 11px;
		cursor: pointer;
		min-width: 200px;
	}

	.avatar-controls select option {
		background: #1a1a1a;
		color: #ffd700;
	}
</style> 