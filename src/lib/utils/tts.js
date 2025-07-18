/**
 * 神仙朋友专用TTS语音合成工具
 * 实现古风、禅意、慈悲的语音效果
 */

class DivineTTS {
	constructor() {
		this.voices = [];
		this.currentVoice = null;
		this.isInitialized = false;
		this.audioContext = null;
		this.backgroundMusic = null;
		this.isSpeaking = false;
		this.speechQueue = [];
		this.currentUtterance = null;
		this.lastSpokenText = '';
		this.speechCooldown = 2000; // 2秒冷却时间
		this.lastSpeechTime = 0;
		
		// 神仙语音配置
		this.divineConfig = {
			// 观音菩萨音色配置
			guanyin: {
				rate: 0.7,        // 语速稍慢，体现慈悲
				pitch: 1.1,       // 音调略高，体现神圣
				volume: 0.9,      // 音量适中
				lang: 'zh-CN',
				voice: 'zh-CN-XiaoyiNeural' // 微软小艺，温柔女声
			},
			// 佛陀音色配置
			buddha: {
				rate: 0.6,        // 更慢的语速，体现智慧
				pitch: 0.9,       // 较低音调，体现沉稳
				volume: 0.85,
				lang: 'zh-CN',
				voice: 'zh-CN-YunjianNeural' // 云健，成熟男声
			},
			// 神仙音色配置
			immortal: {
				rate: 0.75,
				pitch: 1.05,
				volume: 0.9,
				lang: 'zh-CN',
				voice: 'zh-CN-XiaoxiaoNeural' // 小晓，清亮女声
			}
		};
		
		// 禅意背景音效
		this.backgroundSounds = {
			meditation: 'https://example.com/sounds/meditation-bell.mp3',
			forest: 'https://example.com/sounds/forest-ambient.mp3',
			temple: 'https://example.com/sounds/temple-bells.mp3'
		};
	}

	/**
	 * 初始化TTS系统
	 */
	async init() {
		if (this.isInitialized) return;
		
		try {
			// 等待语音列表加载
			await this.loadVoices();
			
			// 初始化音频上下文
			if ('AudioContext' in window || 'webkitAudioContext' in window) {
				this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
			}
			
			this.isInitialized = true;
			console.log('🎵 神仙TTS系统已初始化');
		} catch (error) {
			console.error('TTS初始化失败:', error);
		}
	}

	/**
	 * 加载可用语音
	 */
	async loadVoices() {
		return new Promise((resolve) => {
			if (typeof speechSynthesis !== 'undefined') {
				if (speechSynthesis.getVoices().length > 0) {
					this.voices = speechSynthesis.getVoices();
					resolve();
				} else {
					speechSynthesis.onvoiceschanged = () => {
						this.voices = speechSynthesis.getVoices();
						resolve();
					};
				}
			} else {
				// SSR 环境下直接解析
				resolve();
			}
		});
	}

	/**
	 * 获取最适合的语音
	 */
	getBestVoice(type = 'guanyin') {
		const config = this.divineConfig[type];
		if (!config) return null;
		
		// 优先选择指定语音
		let voice = this.voices.find(v => v.name === config.voice);
		
		// 如果没有找到，选择中文语音
		if (!voice) {
			voice = this.voices.find(v => v.lang.startsWith('zh'));
		}
		
		// 最后选择默认语音
		if (!voice) {
			voice = this.voices[0];
		}
		
		return voice;
	}

	/**
	 * 检查是否可以播放语音
	 */
	canSpeak(text) {
		const now = Date.now();
		
		// 检查冷却时间
		if (now - this.lastSpeechTime < this.speechCooldown) {
			return false;
		}
		
		// 检查是否正在播放
		if (this.isSpeaking) {
			return false;
		}
		
		// 检查是否重复播放相同文本
		if (text === this.lastSpokenText) {
			return false;
		}
		
		return true;
	}

	/**
	 * 神仙语音合成
	 */
	speakDivine(text, type = 'guanyin', options = {}) {
		if (!this.isInitialized) {
			console.warn('TTS未初始化，使用基础语音');
			return this.speakBasic(text);
		}

		// 检查是否可以播放
		if (!this.canSpeak(text)) {
			console.log('🎵 跳过重复或冷却中的语音:', text);
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			try {
				// 停止当前语音
				this.stop();
				
				const utterance = new SpeechSynthesisUtterance(text);
				const config = { ...this.divineConfig[type], ...options };
				const voice = this.getBestVoice(type);
				
				// 设置语音参数
				utterance.voice = voice;
				utterance.lang = config.lang;
				utterance.rate = config.rate;
				utterance.pitch = config.pitch;
				utterance.volume = config.volume;
				
				// 添加禅意效果
				this.addDivineEffects(utterance, type);
				
				// 更新状态
				this.isSpeaking = true;
				this.currentUtterance = utterance;
				this.lastSpokenText = text;
				this.lastSpeechTime = Date.now();
				
				// 事件处理
				utterance.onstart = () => {
					console.log('🎵 神仙语音开始播放:', text);
					this.playBackgroundSound(type);
				};
				
				utterance.onend = () => {
					console.log('🎵 神仙语音播放完成');
					this.isSpeaking = false;
					this.currentUtterance = null;
					this.stopBackgroundSound();
					resolve();
				};
				
				utterance.onerror = (error) => {
					console.error('TTS错误:', error);
					this.isSpeaking = false;
					this.currentUtterance = null;
					reject(error);
				};
				
				utterance.onpause = () => {
					console.log('🎵 神仙语音暂停');
				};
				
				utterance.onresume = () => {
					console.log('🎵 神仙语音恢复');
				};
				
				// 开始播放
				if (typeof speechSynthesis !== 'undefined') {
					speechSynthesis.speak(utterance);
				}
				
			} catch (error) {
				console.error('TTS播放失败:', error);
				this.isSpeaking = false;
				this.currentUtterance = null;
				reject(error);
			}
		});
	}

	/**
	 * 添加神仙语音特效
	 */
	addDivineEffects(utterance, type) {
		// 根据神仙类型添加不同效果
		switch (type) {
			case 'guanyin':
				// 观音慈悲音效 - 添加温和的回音
				this.addReverbEffect(utterance, 0.3);
				break;
			case 'buddha':
				// 佛陀智慧音效 - 添加深沉的低频
				this.addBassEffect(utterance, 0.4);
				break;
			case 'immortal':
				// 神仙飘逸音效 - 添加空灵的高频
				this.addEtherealEffect(utterance, 0.5);
				break;
		}
	}

	/**
	 * 添加回音效果
	 */
	addReverbEffect(utterance, intensity = 0.3) {
		// 这里可以集成Web Audio API实现回音效果
		// 简化实现：调整音调和语速模拟回音
		utterance.pitch *= (1 + intensity * 0.1);
		utterance.rate *= (1 - intensity * 0.1);
	}

	/**
	 * 添加低频效果
	 */
	addBassEffect(utterance, intensity = 0.4) {
		utterance.pitch *= (1 - intensity * 0.2);
		utterance.volume *= (1 + intensity * 0.1);
	}

	/**
	 * 添加空灵效果
	 */
	addEtherealEffect(utterance, intensity = 0.5) {
		utterance.pitch *= (1 + intensity * 0.15);
		utterance.rate *= (1 - intensity * 0.1);
	}

	/**
	 * 播放背景音效
	 */
	playBackgroundSound(type) {
		if (!this.audioContext) return;
		
		try {
			const soundUrl = this.backgroundSounds.meditation;
			// 这里可以加载和播放背景音效
			console.log('🎵 播放背景音效:', type);
		} catch (error) {
			console.warn('背景音效播放失败:', error);
		}
	}

	/**
	 * 停止背景音效
	 */
	stopBackgroundSound() {
		if (this.backgroundMusic) {
			this.backgroundMusic.pause();
			this.backgroundMusic = null;
		}
	}

	/**
	 * 基础语音合成（降级方案）
	 */
	speakBasic(text) {
		// 检查是否可以播放
		if (!this.canSpeak(text)) {
			return Promise.resolve();
		}

		return new Promise((resolve) => {
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = 'zh-CN';
			utterance.rate = 0.8;
			utterance.pitch = 0.9;
			utterance.volume = 0.8;
			
			this.isSpeaking = true;
			this.currentUtterance = utterance;
			this.lastSpokenText = text;
			this.lastSpeechTime = Date.now();
			
			utterance.onend = () => {
				this.isSpeaking = false;
				this.currentUtterance = null;
				resolve();
			};
			
			utterance.onerror = () => {
				this.isSpeaking = false;
				this.currentUtterance = null;
				resolve();
			};
			
			if (typeof speechSynthesis !== 'undefined') {
				speechSynthesis.speak(utterance);
			} else {
				// SSR 环境下直接解析
				resolve();
			}
		});
	}

	/**
	 * 禅意语音序列播放
	 */
	async speakSequence(phrases, type = 'guanyin', interval = 2000) {
		for (let i = 0; i < phrases.length; i++) {
			await this.speakDivine(phrases[i], type);
			if (i < phrases.length - 1) {
				await new Promise(resolve => setTimeout(resolve, interval));
			}
		}
	}

	/**
	 * 停止所有语音
	 */
	stop() {
		if (typeof speechSynthesis !== 'undefined') {
			speechSynthesis.cancel();
		}
		this.isSpeaking = false;
		this.currentUtterance = null;
		this.stopBackgroundSound();
	}

	/**
	 * 暂停语音
	 */
	pause() {
		if (typeof speechSynthesis !== 'undefined') {
			speechSynthesis.pause();
		}
	}

	/**
	 * 恢复语音
	 */
	resume() {
		if (typeof speechSynthesis !== 'undefined') {
			speechSynthesis.resume();
		}
	}

	/**
	 * 重置语音状态
	 */
	reset() {
		this.isSpeaking = false;
		this.currentUtterance = null;
		this.lastSpokenText = '';
		this.lastSpeechTime = 0;
		this.speechQueue = [];
	}
}

// 创建全局TTS实例
export const divineTTS = new DivineTTS();

// 导出便捷方法
export const speakDivine = (text, type, options) => divineTTS.speakDivine(text, type, options);
export const speakSequence = (phrases, type, interval) => divineTTS.speakSequence(phrases, type, interval);
export const stopTTS = () => divineTTS.stop();
export const pauseTTS = () => divineTTS.pause();
export const resumeTTS = () => divineTTS.resume();
export const resetTTS = () => divineTTS.reset();

export default divineTTS; 