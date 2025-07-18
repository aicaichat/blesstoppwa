/**
 * 神仙TTS工具类
 * 提供文本转语音功能
 */

class DivineTTS {
	constructor() {
		this.synthesis = null;
		this.utterance = null;
		this.isSupported = false;
		this.isSpeaking = false;
		
		// 检查浏览器支持
		if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
			this.synthesis = window.speechSynthesis;
			this.isSupported = true;
		}
	}

	/**
	 * 播放语音
	 * @param {string} text - 要播放的文本
	 * @param {Object} options - 播放选项
	 */
	speak(text, options = {}) {
		if (!this.isSupported || !this.synthesis) {
			console.warn('❌ 浏览器不支持语音合成');
			return Promise.reject(new Error('浏览器不支持语音合成'));
		}

		return new Promise((resolve, reject) => {
			try {
				// 停止当前播放
				this.stop();

				// 创建新的语音合成
				this.utterance = new SpeechSynthesisUtterance(text);
				
				// 设置默认选项
				const defaultOptions = {
					lang: 'zh-CN',
					rate: 0.8,
					pitch: 1.0,
					volume: 1.0,
					voice: null
				};

				// 合并选项
				const finalOptions = { ...defaultOptions, ...options };
				
				// 应用选项
				this.utterance.lang = finalOptions.lang;
				this.utterance.rate = finalOptions.rate;
				this.utterance.pitch = finalOptions.pitch;
				this.utterance.volume = finalOptions.volume;

				// 设置语音
				if (finalOptions.voice) {
					this.utterance.voice = finalOptions.voice;
				}

				// 事件处理
				this.utterance.onstart = () => {
					this.isSpeaking = true;
					console.log('🎤 开始播放语音:', text);
				};

				this.utterance.onend = () => {
					this.isSpeaking = false;
					console.log('✅ 语音播放完成');
					resolve();
				};

				this.utterance.onerror = (event) => {
					this.isSpeaking = false;
					console.error('❌ 语音播放错误:', event.error);
					reject(new Error(`语音播放错误: ${event.error}`));
				};

				// 开始播放
				this.synthesis.speak(this.utterance);

			} catch (error) {
				console.error('❌ 语音合成失败:', error);
				reject(error);
			}
		});
	}

	/**
	 * 停止播放
	 */
	stop() {
		if (this.synthesis) {
			this.synthesis.cancel();
		}
		if (this.utterance) {
			this.utterance = null;
		}
		this.isSpeaking = false;
		console.log('⏹️ 停止语音播放');
	}

	/**
	 * 暂停播放
	 */
	pause() {
		if (this.synthesis) {
			this.synthesis.pause();
		}
		console.log('⏸️ 暂停语音播放');
	}

	/**
	 * 恢复播放
	 */
	resume() {
		if (this.synthesis) {
			this.synthesis.resume();
		}
		console.log('▶️ 恢复语音播放');
	}

	/**
	 * 获取可用的语音列表
	 */
	getVoices() {
		if (!this.isSupported) {
			return [];
		}

		return new Promise((resolve) => {
			let voices = this.synthesis.getVoices();
			
			if (voices.length === 0) {
				// 如果语音列表为空，等待加载
				this.synthesis.onvoiceschanged = () => {
					voices = this.synthesis.getVoices();
					resolve(voices);
				};
			} else {
				resolve(voices);
			}
		});
	}

	/**
	 * 获取中文语音
	 */
	async getChineseVoice() {
		const voices = await this.getVoices();
		return voices.find(voice => 
			voice.lang.includes('zh') || 
			voice.lang.includes('cmn') ||
			voice.name.includes('Chinese')
		) || voices[0];
	}

	/**
	 * 检查是否正在播放
	 */
	get speaking() {
		return this.isSpeaking;
	}

	/**
	 * 检查是否支持
	 */
	get supported() {
		return this.isSupported;
	}
}

// 创建单例实例
const divineTTS = new DivineTTS();

// 导出
export default divineTTS;
export { DivineTTS }; 