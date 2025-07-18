/**
 * 头像占位符工具
 * 当VRM模型加载失败时提供备选方案
 */

import * as THREE from 'three';

/**
 * 创建占位符头像
 * @param {THREE.Scene} scene - 3D场景
 * @param {string} divineType - 神仙类型
 * @returns {Object} 包含avatar和mixer的对象
 */
export function createPlaceholderAvatar(scene, divineType = 'guanyin') {
	// 创建简单的几何体作为占位符
	const geometry = new THREE.CylinderGeometry(0.5, 1, 2, 8);
	const material = new THREE.MeshPhongMaterial({
		color: 0xffd700,
		transparent: true,
		opacity: 0.8,
		emissive: new THREE.Color(0x222222)
	});

	const avatar = new THREE.Mesh(geometry, material);
	avatar.castShadow = true;
	avatar.receiveShadow = true;

	// 创建动画混合器
	const mixer = new THREE.AnimationMixer(avatar);

	// 创建简单的呼吸动画
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

	// 创建占位符对象
	const placeholder = {
		mixer,
		setEmotion: (emotion) => {
			// 根据情绪改变颜色
			const colors = {
				gentle: 0xffd700,
				wise: 0x9966cc,
				ethereal: 0x66ccff,
				serious: 0xcc6666
			};
			material.color.setHex(colors[emotion] || 0xffd700);
		},
		playAnimation: (animationName) => {
			// 简单的动画切换
			if (animationName === 'speaking') {
				breathingAction.timeScale = 2;
			} else {
				breathingAction.timeScale = 1;
			}
		},
		update: (delta) => {
			mixer.update(delta);
		}
	};

	return { avatar, placeholder };
} 