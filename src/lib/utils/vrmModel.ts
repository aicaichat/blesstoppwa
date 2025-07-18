import * as THREE from 'three';
import { VRM, VRMLoaderPlugin } from '@pixiv/three-vrm';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadMixamoAnimation, MIXAMO_ANIMATIONS } from './mixamoAnimationLoader.js';

/**
 * VRM模型管理器，参考VirtualWife的Model类
 */
export class VRMModel {
	public vrm?: VRM | null;
	public mixer?: THREE.AnimationMixer;
	public clipMap: Map<string, THREE.AnimationClip> = new Map();
	public currentAction?: THREE.AnimationAction;
	public blendTime: number = 0.5;
	
	private loader: GLTFLoader;

	constructor() {
		this.loader = new GLTFLoader();
		this.loader.register((parser: any) => {
			return new VRMLoaderPlugin(parser);
		});
	}

	/**
	 * 加载VRM模型
	 */
	async loadVRM(url: string): Promise<void> {
		try {
			console.log('🎭 VRMModel: 开始加载VRM模型:', url);
			
			const gltf = await this.loader.loadAsync(url);
			const vrm = gltf.userData.vrm;
			
			if (!vrm) {
				throw new Error('VRM数据未找到');
			}

			this.vrm = vrm;
			vrm.scene.name = 'VRMRoot';

			// 创建动画混合器
			this.mixer = new THREE.AnimationMixer(vrm.scene);

			console.log('✅ VRMModel: VRM模型加载成功');
			
		} catch (error) {
			console.error('❌ VRMModel: VRM模型加载失败:', error);
			throw error;
		}
	}

	/**
	 * 加载Mixamo动画
	 */
	async loadAnimations(): Promise<void> {
		if (!this.vrm || !this.mixer) {
			throw new Error('VRM模型未加载');
		}

		try {
			console.log('🎬 VRMModel: 开始加载Mixamo动画...');
			
			// 加载基础动画
			const animationsToLoad = [
				{ name: 'idle_01', url: MIXAMO_ANIMATIONS.idle_01 },
				{ name: 'idle_02', url: MIXAMO_ANIMATIONS.idle_02 },
				{ name: 'idle_03', url: MIXAMO_ANIMATIONS.idle_03 },
				{ name: 'idle_happy_01', url: MIXAMO_ANIMATIONS.idle_happy_01 },
				{ name: 'standing_greeting', url: MIXAMO_ANIMATIONS.standing_greeting },
				{ name: 'thinking', url: MIXAMO_ANIMATIONS.thinking },
				{ name: 'talking_01', url: MIXAMO_ANIMATIONS.talking_01 },
				{ name: 'talking_02', url: MIXAMO_ANIMATIONS.talking_02 },
				{ name: 'excited', url: MIXAMO_ANIMATIONS.excited },
				
				// 太极动画
				{ name: 'taichi_cloud_hands', url: MIXAMO_ANIMATIONS.taichi_cloud_hands },
				{ name: 'taichi_single_whip', url: MIXAMO_ANIMATIONS.taichi_single_whip },
				{ name: 'taichi_white_crane', url: MIXAMO_ANIMATIONS.taichi_white_crane }
			];

			// 并行加载动画
			const loadPromises = animationsToLoad.map(async ({ name, url }) => {
				try {
					const clip = await loadMixamoAnimation(url, this.vrm!);
					this.clipMap.set(name, clip);
					console.log(`✅ VRMModel: 动画加载成功: ${name}`);
				} catch (error) {
					console.warn(`⚠️ VRMModel: 动画加载失败: ${name}`, error);
				}
			});

			await Promise.all(loadPromises);
			
			// 播放默认动画
			this.playAnimation('idle_01');
			
			console.log('✅ VRMModel: Mixamo动画加载完成');
			
		} catch (error) {
			console.error('❌ VRMModel: 动画加载失败:', error);
		}
	}

	/**
	 * 播放动画
	 */
	playAnimation(animationName: string): void {
		if (!this.mixer) {
			console.warn('⚠️ VRMModel: 动画混合器未初始化');
			return;
		}

		const clip = this.clipMap.get(animationName);
		if (!clip) {
			console.warn(`⚠️ VRMModel: 动画不存在: ${animationName}`);
			return;
		}

		const newAction = this.mixer.clipAction(clip);
		
		if (this.currentAction) {
			// 交叉淡入淡出
			this.currentAction.fadeOut(this.blendTime);
			newAction.reset().fadeIn(this.blendTime).play();
		} else {
			newAction.play();
		}

		// 设置循环模式
		newAction.setLoop(THREE.LoopRepeat);
		this.currentAction = newAction;
		
		console.log(`🎬 VRMModel: 播放动画: ${animationName}`);
	}

	/**
	 * 停止所有动画
	 */
	stopAllAnimations(): void {
		if (this.mixer) {
			this.mixer.stopAllAction();
			this.currentAction = undefined;
		}
	}

	/**
	 * 更新动画
	 */
	update(delta: number): void {
		if (this.mixer) {
			this.mixer.update(delta);
		}
		
		if (this.vrm) {
			this.vrm.update(delta);
		}
	}

	/**
	 * 销毁模型
	 */
	dispose(): void {
		this.stopAllAnimations();
		this.clipMap.clear();
		this.vrm = null;
		this.mixer = undefined;
		this.currentAction = undefined;
	}
} 