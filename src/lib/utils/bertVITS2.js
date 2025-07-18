/**
 * Bert-VITS2 AI 驱动语音合成
 * 提供最先进的 AI 神仙语音体验
 */

class BertVITS2TTS {
	constructor() {
		this.baseUrl = 'https://api.bert-vits2.com';
		this.models = {
			// 观音菩萨 - 慈悲温柔
			guanyin: {
				modelId: 'guanyin_v1',
				speakerId: 0,
				emotion: 'gentle',
				speed: 1.0,
				topK: 3,
				topP: 0.7,
				temperature: 0.8
			},
			// 佛陀 - 智慧深沉
			buddha: {
				modelId: 'buddha_v1',
				speakerId: 1,
				emotion: 'wise',
				speed: 0.9,
				topK: 3,
				topP: 0.7,
				temperature: 0.7
			},
			// 神仙 - 飘逸空灵
			immortal: {
				modelId: 'immortal_v1',
				speakerId: 2,
				emotion: 'ethereal',
				speed: 1.1,
				topK: 3,
				topP: 0.7,
				temperature: 0.9
			},
			// 古风 - 传统韵味
			ancient: {
				modelId: 'ancient_v1',
				speakerId: 3,
				emotion: 'traditional',
				speed: 0.8,
				topK: 3,
				topP: 0.7,
				temperature: 0.6
			}
		};
		
		this.audioContext = null;
		this.isInitialized = false;
		this.currentAudio = null;
	}

	/**
	 * 初始化 Bert-VITS2 TTS
	 */
	async init() {
		if (this.isInitialized) return;
		
		try {
			// 初始化音频上下文
			if ('AudioContext' in window || 'webkitAudioContext' in window) {
				this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
			}
			
			this.isInitialized = true;
			console.log('🎵 Bert-VITS2 TTS 系统已初始化');
		} catch (error) {
			console.error('Bert-VITS2 TTS 初始化失败:', error);
		}
	}

	/**
	 * 生成 Bert-VITS2 请求参数
	 */
	generateRequestParams(text, voiceType = 'guanyin') {
		const model = this.models[voiceType];
		if (!model) {
			console.warn(`未找到语音类型: ${voiceType}，使用默认`);
			model = this.models.guanyin;
		}

		return {
			text: text,
			model_id: model.modelId,
			speaker_id: model.speakerId,
			emotion: model.emotion,
			speed: model.speed,
			top_k: model.topK,
			top_p: model.topP,
			temperature: model.temperature,
			language: 'zh'
		};
	}

	/**
	 * 播放 Bert-VITS2 语音
	 */
	async speak(text, voiceType = 'guanyin', options = {}) {
		if (!this.isInitialized) {
			await this.init();
		}

		return new Promise(async (resolve, reject) => {
			try {
				// 停止当前播放
				if (this.currentAudio) {
					this.currentAudio.pause();
					this.currentAudio = null;
				}

				const params = this.generateRequestParams(text, voiceType);
				console.log('🎵 Bert-VITS2 请求参数:', params);

				const response = await fetch(`${this.baseUrl}/api/tts`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(params)
				});

				if (!response.ok) {
					throw new Error(`Bert-VITS2 请求失败: ${response.status}`);
				}

				const audioBlob = await response.blob();
				const audioUrl = URL.createObjectURL(audioBlob);
				
				const audio = new Audio(audioUrl);
				this.currentAudio = audio;
				
				// 应用自定义选项
				if (options.volume !== undefined) {
					audio.volume = options.volume;
				}
				if (options.rate !== undefined) {
					audio.playbackRate = options.rate;
				}

				audio.onended = () => {
					URL.revokeObjectURL(audioUrl);
					this.currentAudio = null;
					console.log('🎵 Bert-VITS2 播放完成');
					resolve();
				};

				audio.onerror = (error) => {
					URL.revokeObjectURL(audioUrl);
					this.currentAudio = null;
					console.error('🎵 Bert-VITS2 播放错误:', error);
					reject(error);
				};

				await audio.play();
				console.log('🎵 Bert-VITS2 开始播放:', text);

			} catch (error) {
				console.error('Bert-VITS2 播放失败:', error);
				reject(error);
			}
		});
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
		if (this.currentAudio) {
			this.currentAudio.pause();
			this.currentAudio = null;
		}
		console.log('🎵 Bert-VITS2 停止播放');
	}

	/**
	 * 获取可用模型列表
	 */
	async getAvailableModels() {
		try {
			const response = await fetch(`${this.baseUrl}/api/models`);
			if (response.ok) {
				const models = await response.json();
				console.log('🎵 可用模型:', models);
				return models;
			}
		} catch (error) {
			console.error('获取模型列表失败:', error);
		}
		return [];
	}
}

// 创建全局实例
export const bertVITS2TTS = new BertVITS2TTS();

// 导出便捷方法
export const speakBertVITS2 = (text, voiceType, options) => bertVITS2TTS.speak(text, voiceType, options);
export const speakBertVITS2Sequence = (phrases, voiceType, interval) => bertVITS2TTS.speakSequence(phrases, voiceType, interval);
export const stopBertVITS2 = () => bertVITS2TTS.stop();

export default bertVITS2TTS; 