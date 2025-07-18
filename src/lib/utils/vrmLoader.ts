import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRM, VRMLoaderPlugin } from '@pixiv/three-vrm';
import { AnimationManager, MIXAMO_ANIMATIONS } from './mixamoAnimationLoader.js';

interface VRMConfig {
	scale?: number;
	position?: { x: number; y: number; z: number };
	rotation?: { x: number; y: number; z: number };
	enableShadows?: boolean;
	enableAnimations?: boolean;
	loadMixamoAnimations?: boolean; // 是否加载Mixamo动画
}

/**
 * VRM加载器工具类
 */
export class VRMLoader {
	private loader: GLTFLoader;

	constructor() {
		this.loader = new GLTFLoader();
		this.loader.register((parser: any) => {
			return new VRMLoaderPlugin(parser);
		});
	}

	/**
	 * 加载VRM模型
	 * @param {string} url - VRM文件URL
	 * @param {VRMConfig} options - 加载选项
	 * @returns {Promise<{vrm: VRM, scene: THREE.Group, mixer?: THREE.AnimationMixer, animations?: THREE.AnimationClip[], animationManager?: AnimationManager}>} 加载的VRM模型
	 */
	async loadVRM(url: string, options: VRMConfig = {}): Promise<{vrm: VRM, scene: THREE.Group, mixer?: THREE.AnimationMixer, animations?: THREE.AnimationClip[], animationManager?: AnimationManager}> {
		try {
			console.log('🎭 开始加载VRM模型:', url);
			
			const gltf = await this.loader.loadAsync(url);
			const vrm = gltf.userData.vrm;
			
			if (!vrm) {
				throw new Error('VRM数据未找到');
			}

			// 保存动画数据到场景的userData中
			vrm.scene.userData.gltf = gltf;
			vrm.scene.userData.animations = gltf.animations || [];

			// 创建动画混合器
			let mixer: THREE.AnimationMixer | undefined;
			let animationManager: AnimationManager | undefined;
			
			if (gltf.animations && gltf.animations.length > 0) {
				mixer = new THREE.AnimationMixer(vrm.scene);
				console.log('✅ 找到VRM内置动画数据:', gltf.animations.length, '个动画');
			} else {
				console.warn('⚠️ VRM模型没有内置动画数据');
			}

			// 如果启用Mixamo动画加载
			if (options.loadMixamoAnimations && mixer) {
				animationManager = new AnimationManager(vrm, mixer);
				await this.loadMixamoAnimations(animationManager);
			}

			console.log('✅ VRM模型加载成功');
			return { vrm, scene: vrm.scene, mixer, animations: gltf.animations, animationManager };
		} catch (error) {
			console.error('❌ VRM模型加载失败:', error);
			throw error;
		}
	}

	/**
	 * 加载Mixamo动画
	 */
	private async loadMixamoAnimations(animationManager: AnimationManager): Promise<void> {
		try {
			console.log('🎬 开始加载Mixamo动画...');
			
			// 加载基础动画
			const basicAnimations = [
				{ name: 'idle_01', url: MIXAMO_ANIMATIONS.idle_01 },
				{ name: 'idle_02', url: MIXAMO_ANIMATIONS.idle_02 },
				{ name: 'idle_03', url: MIXAMO_ANIMATIONS.idle_03 },
				{ name: 'idle_happy_01', url: MIXAMO_ANIMATIONS.idle_happy_01 },
				{ name: 'standing_greeting', url: MIXAMO_ANIMATIONS.standing_greeting },
				{ name: 'thinking', url: MIXAMO_ANIMATIONS.thinking },
				{ name: 'talking_01', url: MIXAMO_ANIMATIONS.talking_01 },
				{ name: 'talking_02', url: MIXAMO_ANIMATIONS.talking_02 },
				{ name: 'excited', url: MIXAMO_ANIMATIONS.excited }
			];

			// 并行加载动画
			const loadPromises = basicAnimations.map(async ({ name, url }) => {
				try {
					await animationManager.loadAnimation(name, url);
				} catch (error) {
					console.warn(`⚠️ 动画加载失败: ${name}`, error);
				}
			});

			await Promise.all(loadPromises);
			console.log('✅ Mixamo动画加载完成');
			
		} catch (error) {
			console.error('❌ Mixamo动画加载失败:', error);
		}
	}

	/**
	 * 配置VRM模型
	 * @param {VRM} vrm - VRM实例
	 * @param {VRMConfig} config - 配置选项
	 */
	configureVRM(vrm: VRM, config: VRMConfig = {}): VRM {
		const {
			scale = 1.0,
			position = { x: 0, y: 0, z: 0 },
			rotation = { x: 0, y: 0, z: 0 },
			enableShadows = true,
			enableAnimations = true
		} = config;

		// 设置缩放
		vrm.scene.scale.setScalar(scale);

		// 设置位置
		vrm.scene.position.set(position.x, position.y, position.z);

		// 设置旋转
		vrm.scene.rotation.set(rotation.x, rotation.y, rotation.z);

		// 启用阴影
		if (enableShadows) {
			vrm.scene.traverse((child) => {
				if (child && typeof child === 'object' && 'isMesh' in child && child.isMesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});
		}

		return vrm;
	}

	/**
	 * 设置VRM表情
	 * @param {VRM} vrm - VRM实例
	 * @param {string} emotion - 表情类型
	 */
	setVRMEmotion(vrm: VRM, emotion: string): void {
		try {
			// 尝试使用VRM的表情系统
			if ((vrm as any).expressionManager) {
				const expressions: Record<string, string> = {
					gentle: 'happy',
					wise: 'neutral',
					ethereal: 'awe',
					serious: 'serious'
				};

				const expressionName = expressions[emotion] || 'neutral';
				(vrm as any).expressionManager.setValue(expressionName, 1.0);
			} else {
				console.warn('VRM模型没有表情管理器');
			}
		} catch (error) {
			console.warn('表情设置失败:', error);
		}
	}

	/**
	 * 播放VRM动画
	 * @param {VRM} vrm - VRM实例
	 * @param {string} animationName - 动画名称
	 * @param {THREE.AnimationMixer} mixer - 动画混合器
	 * @param {THREE.AnimationClip[]} animations - 动画剪辑数组
	 * @param {AnimationManager} animationManager - 动画管理器
	 */
	playVRMAnimation(vrm: VRM, animationName: string, mixer?: THREE.AnimationMixer, animations?: THREE.AnimationClip[], animationManager?: AnimationManager): void {
		// 优先使用动画管理器
		if (animationManager) {
			animationManager.playAnimation(animationName);
			return;
		}

		if (!mixer || !animations || animations.length === 0) {
			console.warn('没有可用的动画数据');
			return;
		}

		try {
			// 停止当前动画
			mixer.stopAllAction();

			// 根据动画名称选择动画
			let animationClip: THREE.AnimationClip | undefined;
			
			switch (animationName) {
				case 'idle':
					animationClip = animations[0]; // 第一个动画通常是idle
					break;
				case 'speaking':
					animationClip = animations[1] || animations[0]; // 第二个动画或回退到第一个
					break;
				case 'blessing':
					animationClip = animations[2] || animations[0];
					break;
				case 'meditation':
					animationClip = animations[3] || animations[0];
					break;
				default:
					animationClip = animations[0];
			}

			if (animationClip) {
				const action = mixer.clipAction(animationClip);
				action.setLoop(THREE.LoopRepeat);
				action.play();
				console.log('✅ 播放动画:', animationName);
			} else {
				console.warn('未找到动画:', animationName);
			}
		} catch (error) {
			console.warn('动画播放失败:', error);
		}
	}

	/**
	 * 创建默认动画（当VRM没有动画时）
	 * @param {THREE.Group} scene - VRM场景
	 * @returns {THREE.AnimationMixer} 动画混合器
	 */
	createDefaultAnimations(scene: THREE.Group): THREE.AnimationMixer {
		const mixer = new THREE.AnimationMixer(scene);
		
		// 创建简单的旋转动画
		const times = [0, 3, 6];
		const values = [0, Math.PI, 0];
		
		// 使用正确的轨道名称格式
		const track = new THREE.NumberKeyframeTrack('rotation.y', times, values);
		const clip = new THREE.AnimationClip('rotation', 6, [track]);
		
		const action = mixer.clipAction(clip);
		action.setLoop(THREE.LoopRepeat);
		action.play();

		return mixer;
	}
}

/**
 * 创建VRM加载器实例
 */
export const vrmLoader = new VRMLoader(); 