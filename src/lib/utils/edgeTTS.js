// @ts-nocheck
/**
 * 微软 Edge TTS 高级语音合成
 * 提供更优质的中文神仙语音体验
 */

class EdgeTTS {
	constructor() {
		// 备选服务器列表（按优先级）
		this.servers = [
			{
				base: import.meta.env?.VITE_EDGE_TTS_BASE || 'https://tts.travisvn.com',
				speakPath: '/v1/audio/speech',
				healthPaths: ['/health', '/v1/models']
			},
			{
				base: 'https://api.edge-tts.com',
				speakPath: '/api/tts',
				healthPaths: ['/api/health', '/health']
			}
		];

		this.activeServer = this.servers[0];
		this.voices = {
			// 观音菩萨 - 温柔慈悲
			guanyin: {
				name: 'zh-CN-XiaoyiNeural',
				style: 'gentle',
				rate: '+0%',
				volume: '+0%',
				pitch: '+0%'
			},
			// 佛陀 - 智慧深沉
			buddha: {
				name: 'zh-CN-YunjianNeural',
				style: 'calm',
				rate: '-10%',
				volume: '+0%',
				pitch: '-10%'
			},
			// 神仙 - 飘逸空灵
			immortal: {
				name: 'zh-CN-XiaoxiaoNeural',
				style: 'cheerful',
				rate: '+0%',
				volume: '+0%',
				pitch: '+5%'
			},
			// 古风 - 传统韵味
			ancient: {
				name: 'zh-CN-YunxiNeural',
				style: 'serious',
				rate: '-15%',
				volume: '+0%',
				pitch: '-5%'
			}
		};
		
		this.audioContext = null;
		this.isInitialized = false;
	}

	/**
	 * 初始化 Edge TTS
	 */
	async init() {
		if (this.isInitialized) return;
		
		try {
			// 初始化音频上下文
			if ('AudioContext' in window || 'webkitAudioContext' in window) {
				this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
			}
			
			this.isInitialized = true;
			console.log('🎵 Edge TTS 系统已初始化');
		} catch (error) {
			console.error('Edge TTS 初始化失败:', error);
		}
	}

	//================ 健康检查 & URL 生成 =================

	async pickHealthyServer() {
		for (const srv of this.servers) {
			for (const hp of srv.healthPaths) {
				try {
					const res = await fetch(srv.base + hp, { method: 'GET' });
					if (res.ok) {
						this.activeServer = srv;
						console.log('✅ Edge TTS 选用服务器:', srv.base);
						return;
					}
				} catch (_) { /* ignore */ }
			}
		}
		// 如果全部失败则保持默认
		console.warn('⚠️ Edge TTS 无可用服务器，仍尝试使用默认:', this.activeServer.base);
	}

	/**
	 * 生成 Edge TTS 请求配置
	 */
	buildSpeakRequest(text, voiceType = 'guanyin') {
		let v = this.voices[voiceType] || this.voices.guanyin;

		// 两种 API 形态：openai 样式 /v1/audio/speech (POST json) 或老式 /api/tts (GET query)
		const { base, speakPath } = this.activeServer;
		if (speakPath.startsWith('/v1')) {
			// OpenAI 兼容
			return {
				url: base + speakPath,
				init: {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', Authorization: 'Bearer edge-key' },
					body: JSON.stringify({ input: text, voice: v.name, response_format: 'mp3' })
				}
			};
		} else {
			// 旧 GET query
			const params = new URLSearchParams({
				text, voice: v.name, style: v.style, rate: v.rate, volume: v.volume, pitch: v.pitch
			});
			return { url: `${base}${speakPath}?${params.toString()}`, init: {} };
		}
	}

	/**
	 * 播放 Edge TTS 语音
	 */
	async speak(text, voiceType = 'guanyin', options = {}) {
		if (!this.isInitialized) {
			await this.init();
		}

		return new Promise(async (resolve, reject) => {
			try {
				const { url, init } = this.buildSpeakRequest(text, voiceType);
				console.log('🎵 Edge TTS 请求:', url);

				const response = await fetch(url, init);
				if (!response.ok) {
					throw new Error(`Edge TTS 请求失败: ${response.status}`);
				}

				const audioBlob = await response.blob();
				const audioUrl = URL.createObjectURL(audioBlob);
				
				const audio = new Audio(audioUrl);
				
				// 应用自定义选项
				if (options.volume !== undefined) {
					audio.volume = options.volume;
				}
				if (options.rate !== undefined) {
					audio.playbackRate = options.rate;
				}

				audio.onended = () => {
					URL.revokeObjectURL(audioUrl);
					console.log('🎵 Edge TTS 播放完成');
					resolve();
				};

				audio.onerror = (error) => {
					URL.revokeObjectURL(audioUrl);
					console.error('🎵 Edge TTS 播放错误:', error);
					reject(error);
				};

				await audio.play();
				console.log('🎵 Edge TTS 开始播放:', text);

			} catch (error) {
				console.error('Edge TTS 播放失败:', error);
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
		// Edge TTS 通过 Audio 对象控制，这里可以添加停止逻辑
		console.log('🎵 Edge TTS 停止播放');
	}
}

// 创建全局实例
export const edgeTTS = new EdgeTTS();

// 导出便捷方法
export const speakEdgeTTS = (text, voiceType, options) => edgeTTS.speak(text, voiceType, options);
export const speakEdgeSequence = (phrases, voiceType, interval) => edgeTTS.speakSequence(phrases, voiceType, interval);
export const stopEdgeTTS = () => edgeTTS.stop();

export default edgeTTS; 