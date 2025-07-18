// @ts-nocheck
/**
 * 统一 TTS 管理器
 * 自动选择最佳的语音合成方案
 */

import { divineTTS } from './tts.js';
import { edgeTTS } from './edgeTTS.js';
import { bertVITS2TTS } from './bertVITS2.js';

// ===== 可配置的远端服务地址 =====
// 可通过「VITE_EDGE_TTS_BASE」/「VITE_BERT_VITS2_BASE」环境变量覆盖
const EDGE_TTS_BASE = import.meta.env?.VITE_EDGE_TTS_BASE || 'https://tts.travisvn.com';
const BERT_TTS_BASE = import.meta.env?.VITE_BERT_VITS2_BASE || 'https://api.bert-vits2.com';

class UnifiedTTS {
	constructor() {
		this.availableEngines = [];
		this.currentEngine = null;
		this.enginePriority = [
			'bert-vits2',  // 最高质量
			'edge-tts',    // 高质量
			'divine-tts'   // 基础质量
		];
		this.isInitialized = false;
	}

	/**
	 * 初始化统一 TTS 系统
	 */
	async init() {
		if (this.isInitialized) return;
		
		try {
			console.log('🎵 初始化统一 TTS 系统...');
			
			// 检测可用的 TTS 引擎
			await this.detectAvailableEngines();
			
			// 选择最佳引擎
			this.selectBestEngine();
			
			this.isInitialized = true;
			console.log('🎵 统一 TTS 系统已初始化，使用引擎:', this.currentEngine);
		} catch (error) {
			console.error('统一 TTS 初始化失败:', error);
		}
	}

	/**
	 * 检测可用的 TTS 引擎
	 */
	async detectAvailableEngines() {
		this.availableEngines = [];

		// 检测 Bert-VITS2
		try {
			const resBert = await fetch(`${BERT_TTS_BASE}/health`);
			if (resBert.ok) {
				this.availableEngines.push('bert-vits2');
				console.log('✅ Bert-VITS2 可用');
			}
		} catch (error) {
			console.log('❌ Bert-VITS2 不可用:', error.message);
		}

		// 检测 Edge TTS
		try {
			let edgeOk = false;
			// 1) 先试新版 /health
			const resHealth = await fetch(`${EDGE_TTS_BASE}/health`);
			if (resHealth.ok) edgeOk = true;

			// 2) 若 404 或网络错误则尝试 /v1/models（OpenAI 兼容端点）
			if (!edgeOk) {
				try {
					const resModels = await fetch(`${EDGE_TTS_BASE}/v1/models`);
					if (resModels.ok) edgeOk = true;
				} catch (_) { /* 忽略嵌套错误 */ }
			}

			if (edgeOk) {
				this.availableEngines.push('edge-tts');
				console.log('✅ Edge TTS 可用');
			} else {
				console.log('❌ Edge TTS 不可用: 健康检查未通过');
			}
		} catch (error) {
			console.log('❌ Edge TTS 不可用:', error.message);
		}

		// 检测 Divine TTS (本地)
		if ('speechSynthesis' in window) {
			this.availableEngines.push('divine-tts');
			console.log('✅ Divine TTS 可用');
		}

		console.log('🎵 可用引擎:', this.availableEngines);
	}

	/**
	 * 选择最佳 TTS 引擎
	 */
	selectBestEngine() {
		for (const engine of this.enginePriority) {
			if (this.availableEngines.includes(engine)) {
				this.currentEngine = engine;
				return;
			}
		}
		
		// 如果没有找到任何引擎，使用默认
		this.currentEngine = 'divine-tts';
		console.warn('⚠️ 未找到可用引擎，使用默认 Divine TTS');
	}

	/**
	 * 播放语音
	 */
	async speak(text, voiceType = 'guanyin', options = {}) {
		if (!this.isInitialized) {
			await this.init();
		}

		try {
			switch (this.currentEngine) {
				case 'bert-vits2':
					return await bertVITS2TTS.speak(text, voiceType, options);
				case 'edge-tts':
					return await edgeTTS.speak(text, voiceType, options);
				case 'divine-tts':
				default:
					return await divineTTS.speakDivine(text, voiceType, options);
			}
		} catch (error) {
			console.error(`🎵 ${this.currentEngine} 播放失败，尝试降级:`, error);
			
			// 降级到下一个可用引擎
			await this.fallbackToNextEngine();
			return await this.speak(text, voiceType, options);
		}
	}

	/**
	 * 降级到下一个可用引擎
	 */
	async fallbackToNextEngine() {
		const currentIndex = this.enginePriority.indexOf(this.currentEngine);
		const nextEngines = this.enginePriority.slice(currentIndex + 1);
		
		for (const engine of nextEngines) {
			if (this.availableEngines.includes(engine)) {
				this.currentEngine = engine;
				console.log(`🔄 降级到引擎: ${engine}`);
				return;
			}
		}
		
		// 如果所有引擎都不可用，使用基础 TTS
		this.currentEngine = 'divine-tts';
		console.warn('⚠️ 所有引擎都不可用，使用基础 TTS');
	}

	/**
	 * 播放语音序列
	 */
	async speakSequence(phrases, voiceType = 'guanyin', interval = 2000) {
		for (let i = 0; i < phrases.length; i++) {
			await this.speak(phrases[i], voiceType);
			if (i < phrases.length - 1) {
				await new Promise(resolve => setTimeout(resolve, interval));
			}
		}
	}

	/**
	 * 停止所有语音
	 */
	stop() {
		switch (this.currentEngine) {
			case 'bert-vits2':
				bertVITS2TTS.stop();
				break;
			case 'edge-tts':
				edgeTTS.stop();
				break;
			case 'divine-tts':
			default:
				divineTTS.stop();
				break;
		}
	}

	/**
	 * 获取当前引擎信息
	 */
	getCurrentEngine() {
		return {
			name: this.currentEngine,
			quality: this.getEngineQuality(this.currentEngine),
			available: this.availableEngines
		};
	}

	/**
	 * 获取引擎质量等级
	 */
	getEngineQuality(engine) {
		const qualityMap = {
			'bert-vits2': 'excellent',
			'edge-tts': 'high',
			'divine-tts': 'good'
		};
		return qualityMap[engine] || 'unknown';
	}

	/**
	 * 手动切换引擎
	 */
	async switchEngine(engineName) {
		if (this.availableEngines.includes(engineName)) {
			this.currentEngine = engineName;
			console.log(`🔄 手动切换到引擎: ${engineName}`);
			return true;
		} else {
			console.warn(`❌ 引擎 ${engineName} 不可用`);
			return false;
		}
	}
}

// 创建全局实例
export const unifiedTTS = new UnifiedTTS();

// 导出便捷方法
export const speakUnified = (text, voiceType, options) => unifiedTTS.speak(text, voiceType, options);
export const speakUnifiedSequence = (phrases, voiceType, interval) => unifiedTTS.speakSequence(phrases, voiceType, interval);
export const stopUnified = () => unifiedTTS.stop();
export const getCurrentEngine = () => unifiedTTS.getCurrentEngine();
export const switchEngine = (engineName) => unifiedTTS.switchEngine(engineName);

export default unifiedTTS; 