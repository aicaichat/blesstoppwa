import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { VRM, VRMHumanBoneName } from '@pixiv/three-vrm';

// Mixamo到VRM的骨骼映射（来自VirtualWife项目）
const mixamoVRMRigMap: Record<string, string> = {
	mixamorigHips: 'hips',
	mixamorigSpine: 'spine',
	mixamorigSpine1: 'chest',
	mixamorigSpine2: 'upperChest',
	mixamorigNeck: 'neck',
	mixamorigHead: 'head',
	mixamorigLeftShoulder: 'leftShoulder',
	mixamorigLeftArm: 'leftUpperArm',
	mixamorigLeftForeArm: 'leftLowerArm',
	mixamorigLeftHand: 'leftHand',
	mixamorigLeftHandThumb1: 'leftThumbMetacarpal',
	mixamorigLeftHandThumb2: 'leftThumbProximal',
	mixamorigLeftHandThumb3: 'leftThumbDistal',
	mixamorigLeftHandIndex1: 'leftIndexProximal',
	mixamorigLeftHandIndex2: 'leftIndexIntermediate',
	mixamorigLeftHandIndex3: 'leftIndexDistal',
	mixamorigLeftHandMiddle1: 'leftMiddleProximal',
	mixamorigLeftHandMiddle2: 'leftMiddleIntermediate',
	mixamorigLeftHandMiddle3: 'leftMiddleDistal',
	mixamorigLeftHandRing1: 'leftRingProximal',
	mixamorigLeftHandRing2: 'leftRingIntermediate',
	mixamorigLeftHandRing3: 'leftRingDistal',
	mixamorigLeftHandPinky1: 'leftLittleProximal',
	mixamorigLeftHandPinky2: 'leftLittleIntermediate',
	mixamorigLeftHandPinky3: 'leftLittleDistal',
	mixamorigRightShoulder: 'rightShoulder',
	mixamorigRightArm: 'rightUpperArm',
	mixamorigRightForeArm: 'rightLowerArm',
	mixamorigRightHand: 'rightHand',
	mixamorigRightHandPinky1: 'rightLittleProximal',
	mixamorigRightHandPinky2: 'rightLittleIntermediate',
	mixamorigRightHandPinky3: 'rightLittleDistal',
	mixamorigRightHandRing1: 'rightRingProximal',
	mixamorigRightHandRing2: 'rightRingIntermediate',
	mixamorigRightHandRing3: 'rightRingDistal',
	mixamorigRightHandMiddle1: 'rightMiddleProximal',
	mixamorigRightHandMiddle2: 'rightMiddleIntermediate',
	mixamorigRightHandMiddle3: 'rightMiddleDistal',
	mixamorigRightHandIndex1: 'rightIndexProximal',
	mixamorigRightHandIndex2: 'rightIndexIntermediate',
	mixamorigRightHandIndex3: 'rightIndexDistal',
	mixamorigRightHandThumb1: 'rightThumbMetacarpal',
	mixamorigRightHandThumb2: 'rightThumbProximal',
	mixamorigRightHandThumb3: 'rightThumbDistal',
	mixamorigLeftUpLeg: 'leftUpperLeg',
	mixamorigLeftLeg: 'leftLowerLeg',
	mixamorigLeftFoot: 'leftFoot',
	mixamorigLeftToeBase: 'leftToes',
	mixamorigRightUpLeg: 'rightUpperLeg',
	mixamorigRightLeg: 'rightLowerLeg',
	mixamorigRightFoot: 'rightFoot',
	mixamorigRightToeBase: 'rightToes'
};

/**
 * 加载Mixamo动画并转换为VRM兼容格式
 * @param {string} url - FBX动画文件URL
 * @param {VRM} vrm - VRM实例
 * @returns {Promise<THREE.AnimationClip>} 转换后的动画剪辑
 */
export async function loadMixamoAnimation(url: string, vrm: VRM): Promise<THREE.AnimationClip> {
	try {
		console.log('🎭 开始加载Mixamo动画:', url);
		
		const loader = new FBXLoader();
		const asset = await loader.loadAsync(url);
		
		// 提取动画剪辑
		const clip = THREE.AnimationClip.findByName(asset.animations, 'mixamo.com');
		if (!clip) {
			throw new Error('未找到mixamo.com动画剪辑');
		}

		const tracks: THREE.KeyframeTrack[] = [];
		const restRotationInverse = new THREE.Quaternion();
		const parentRestWorldRotation = new THREE.Quaternion();
		const _quatA = new THREE.Quaternion();
		const _vec3 = new THREE.Vector3();

		// 调整臀部高度
		let motionHipsHeight = asset.getObjectByName('mixamorigHips')?.position.y || 1;
		let vrmHipsY = vrm.humanoid?.getNormalizedBoneNode('hips')?.getWorldPosition(_vec3).y || 1;
		const vrmRootY = vrm.scene?.getWorldPosition(_vec3).y || 0;
		const vrmHipsHeight = Math.abs(vrmHipsY - vrmRootY);
		const hipsPositionScale = vrmHipsHeight / motionHipsHeight;

		// 处理每个动画轨道
		clip.tracks.forEach((track) => {
			const trackSplitted = track.name.split('.');
			const mixamoRigName = trackSplitted[0];
			const vrmBoneName = mixamoVRMRigMap[mixamoRigName];
			const vrmNodeName = vrm.humanoid?.getNormalizedBoneNode(vrmBoneName as VRMHumanBoneName)?.name;
			const mixamoRigNode = asset.getObjectByName(mixamoRigName);

			if (vrmNodeName && mixamoRigNode) {
				const propertyName = trackSplitted[1];

				// 存储静止姿态的旋转
				mixamoRigNode.getWorldQuaternion(restRotationInverse).invert();
				mixamoRigNode.parent?.getWorldQuaternion(parentRestWorldRotation);

				if (track instanceof THREE.QuaternionKeyframeTrack) {
					// 重定向Mixamo旋转到VRM骨骼
					for (let i = 0; i < track.values.length; i += 4) {
						const flatQuaternion = track.values.slice(i, i + 4);
						_quatA.fromArray(flatQuaternion);

						// 应用重定向变换
						_quatA
							.premultiply(parentRestWorldRotation)
							.multiply(restRotationInverse);

						_quatA.toArray(flatQuaternion);
						flatQuaternion.forEach((v, index) => {
							track.values[index + i] = v;
						});
					}

					tracks.push(
						new THREE.QuaternionKeyframeTrack(
							`${vrmNodeName}.${propertyName}`,
							track.times,
							track.values.map((v, i) => (vrm.meta?.metaVersion === '0' && i % 2 === 0 ? -v : v))
						)
					);
				} else if (track instanceof THREE.VectorKeyframeTrack) {
					const value = track.values.map((v, i) => 
						(vrm.meta?.metaVersion === '0' && i % 3 !== 1 ? -v : v) * hipsPositionScale
					);
					tracks.push(new THREE.VectorKeyframeTrack(`${vrmNodeName}.${propertyName}`, track.times, value));
				}
			}
		});

		const convertedClip = new THREE.AnimationClip('vrmAnimation', clip.duration, tracks);
		console.log('✅ Mixamo动画转换完成');
		return convertedClip;
		
	} catch (error) {
		console.error('❌ Mixamo动画加载失败:', error);
		throw error;
	}
}

/**
 * 预定义的动画URL列表
 */
export const MIXAMO_ANIMATIONS = {
	idle_01: '/animations/daily/idle_01.fbx',
	idle_02: '/animations/daily/idle_02.fbx',
	idle_03: '/animations/daily/idle_03.fbx',
	idle_happy_01: '/animations/daily/idle_happy_01.fbx',
	idle_happy_02: '/animations/daily/idle_happy_02.fbx',
	idle_happy_03: '/animations/daily/idle_happy_03.fbx',
	standing_greeting: '/animations/daily/standing_greeting.fbx',
	thinking: '/animations/daily/thinking.fbx',
	talking_01: '/animations/daily/talking_01.fbx',
	talking_02: '/animations/daily/talking_02.fbx',
	excited: '/animations/emote/excited.fbx',
	angry: '/animations/emote/angry.fbx',
	sitting: '/animations/daily/sitting.fbx',
	kiss: '/animations/daily/kiss_01.fbx',
	
	// 太极动画
	taichi_cloud_hands: '/animations/daily/taichi_cloud_hands.fbx',
	taichi_single_whip: '/animations/daily/taichi_single_whip.fbx',
	taichi_white_crane: '/animations/daily/taichi_white_crane.fbx'
};

/**
 * 动画管理器类
 */
export class AnimationManager {
	private mixer?: THREE.AnimationMixer;
	private clipMap: Map<string, THREE.AnimationClip> = new Map();
	private currentAction?: THREE.AnimationAction;
	private vrm?: VRM;

	constructor(vrm: VRM, mixer: THREE.AnimationMixer) {
		this.vrm = vrm;
		this.mixer = mixer;
	}

	/**
	 * 加载动画
	 */
	async loadAnimation(name: string, url: string): Promise<void> {
		try {
			const clip = await loadMixamoAnimation(url, this.vrm!);
			this.clipMap.set(name, clip);
			console.log(`✅ 动画加载成功: ${name}`);
		} catch (error) {
			console.error(`❌ 动画加载失败: ${name}`, error);
		}
	}

	/**
	 * 播放动画
	 */
	playAnimation(name: string, crossFadeDuration: number = 0.5): void {
		const clip = this.clipMap.get(name);
		if (!clip || !this.mixer) {
			console.warn(`⚠️ 动画不存在: ${name}`);
			return;
		}

		const newAction = this.mixer.clipAction(clip);
		
		if (this.currentAction) {
			// 交叉淡入淡出
			this.currentAction.fadeOut(crossFadeDuration);
			newAction.reset().fadeIn(crossFadeDuration).play();
		} else {
			newAction.play();
		}

		this.currentAction = newAction;
		console.log(`🎬 播放动画: ${name}`);
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
	 * 更新动画混合器
	 */
	update(delta: number): void {
		if (this.mixer) {
			this.mixer.update(delta);
		}
	}
} 