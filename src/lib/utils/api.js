// @ts-check
const API_BASE_URL = 'https://bless.top/wp-json';
const API_TIMEOUT = 10000; // 10 秒超时

/**
 * 自定义 API 错误类
 */
class ApiError extends Error {
	/**
	 * @param {string} message 
	 * @param {number} status 
	 * @param {Response} [response] 
	 */
	constructor(message, status, response) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.response = response;
	}
}

/**
 * 自动重试机制
 * @param {() => Promise<any>} fn 
 * @param {number} [maxRetries=3] 
 * @param {number} [delay=1000] 
 * @returns {Promise<any>}
 */
async function withRetry(fn, maxRetries = 3, delay = 1000) {
	let lastError;

	for (let i = 0; i <= maxRetries; i++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;
			
			if (i === maxRetries) {
				throw error;
			}

			// 指数退避策略
			const waitTime = delay * Math.pow(2, i);
			await new Promise(resolve => setTimeout(resolve, waitTime));
		}
	}
}

/**
 * 通用 fetch 包装器
 * @param {string} endpoint 
 * @param {RequestInit} [options={}] 
 * @returns {Promise<any>}
 */
export async function apiRequest(endpoint, options = {}) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

	const defaultHeaders = {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	};

	const config = {
		method: 'GET',
		headers: { ...defaultHeaders, ...(options.headers || {}) },
		signal: controller.signal,
		...options
	};

	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

		clearTimeout(timeoutId);

		if (!response.ok) {
			throw new ApiError(
				`API request failed: ${response.statusText}`,
				response.status,
				response
			);
		}

		return await response.json();
	} catch (error) {
		clearTimeout(timeoutId);

		if (error instanceof Error && error.name === 'AbortError') {
			throw new ApiError('Request timeout', 408);
		}

		throw error;
	}
}

/**
 * 带重试的 fetch
 * @param {string} endpoint 
 * @param {RequestInit} [options={}] 
 * @returns {Promise<any>}
 */
export async function fetchWithRetry(endpoint, options = {}) {
	return withRetry(async () => {
		return apiRequest(endpoint, options);
	});
}

/**
 * API 方法集合
 */
export const api = {
	/**
	 * 获取手串信息
	 * @param {string} braceletId 
	 */
	async getBraceletInfo(braceletId) {
		return fetchWithRetry(`/bracelet-info/v1/bracelet/${braceletId}`);
	},

	/**
	 * 验证证书
	 * @param {string} certificateId 
	 */
	async verifyCertificate(certificateId) {
		return fetchWithRetry(`/cert/v1/verify/${certificateId}`);
	},

	/**
	 * 提交随喜功德
	 * @param {object} data 
	 */
	async submitDonation(data) {
		return fetchWithRetry('/donations/v1/submit', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	},

	/**
	 * 获取功德进度
	 */
	async getDonationProgress() {
		return fetchWithRetry('/donations/v1/progress');
	},

	/**
	 * 获取运势信息
	 * @param {string} fingerprintHash 
	 */
	async getFortune(fingerprintHash) {
		return fetchWithRetry('/fortune/v1/predict', {
			method: 'POST',
			body: JSON.stringify({ fingerprint: fingerprintHash })
		});
	},

	/**
	 * 提交体验评估
	 * @param {object} evaluationData 
	 */
	async submitEvaluation(evaluationData) {
		return fetchWithRetry('/evaluation/v1/submit', {
			method: 'POST',
			body: JSON.stringify(evaluationData)
		});
	},

	/**
	 * 创建分享链接
	 * @param {object} shareData 
	 */
	async createShareLink(shareData) {
		return fetchWithRetry('/share/v1/create', {
			method: 'POST',
			body: JSON.stringify(shareData)
		});
	},

	/**
	 * 上报埋点数据
	 * @param {object} eventData 
	 */
	async trackEvent(eventData) {
		try {
			// 使用 sendBeacon 优先
			if (navigator.sendBeacon) {
				return navigator.sendBeacon('/api/metrics', JSON.stringify(eventData));
			}

			// 回退到 fetch
			return fetch('/api/metrics', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(eventData),
				keepalive: true
			});
		} catch (error) {
			console.error('Track event failed:', error);
		}
	}
};

/**
 * 流式 API 助手
 */
export class StreamAPI {
	/**
	 * GPT 流式聊天
	 * @param {Array<any>} messages 
	 * @param {string} fingerprint 
	 * @param {(content: string) => void} onData 
	 * @param {(error: Error) => void} onError 
	 * @param {() => void} onComplete 
	 */
	static async streamChat(messages, fingerprint, onData, onError, onComplete) {
		try {
			const response = await fetch('/api/gpt-stream', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages, fingerprint })
			});

			if (!response.ok) {
				throw new ApiError('Chat stream failed', response.status);
			}

			const reader = response.body?.getReader();
			if (!reader) {
				throw new Error('Response body is not readable');
			}

			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value);
				const lines = chunk.split('\n').filter(line => line.trim());

				for (const line of lines) {
					if (line.startsWith('data: ')) {
						try {
							const data = JSON.parse(line.slice(6));
							
							if (data.type === 'content') {
								onData(data.content);
							} else if (data.type === 'done') {
								onComplete();
								return;
							} else if (data.type === 'error') {
								onError(new Error(data.error));
								return;
							}
						} catch (e) {
							// 忽略解析错误
						}
					}
				}
			}
		} catch (error) {
			onError(error);
		}
	}

	/**
	 * Server-Sent Events 通用处理
	 * @param {string} url 
	 * @param {Function} onMessage 
	 * @param {Function} onError 
	 * @param {Function} [onOpen] 
	 */
	static createEventSource(url, onMessage, onError, onOpen) {
		const eventSource = new EventSource(url);

		if (onOpen) eventSource.onopen = onOpen;
		eventSource.onmessage = onMessage;
		eventSource.onerror = onError;

		return eventSource;
	}
}

/**
 * 缓存管理
 */
export class APICache {
	static CACHE_PREFIX = 'api_cache_';
	static DEFAULT_TTL = 5 * 60 * 1000; // 5分钟

	/**
	 * @param {string} key 
	 * @param {any} data 
	 * @param {number} [ttl] 
	 */
	static set(key, data, ttl = this.DEFAULT_TTL) {
		const item = {
			data,
			timestamp: Date.now(),
			ttl
		};
		try {
			localStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify(item));
		} catch (e) {
			console.warn('Failed to cache data:', e);
		}
	}

	/**
	 * @param {string} key 
	 * @returns {any}
	 */
	static get(key) {
		try {
			const item = localStorage.getItem(this.CACHE_PREFIX + key);
			if (!item) return null;

			const parsed = JSON.parse(item);
			
			// 检查是否过期
			if (Date.now() - parsed.timestamp > parsed.ttl) {
				this.delete(key);
				return null;
			}

			return parsed.data;
		} catch (e) {
			return null;
		}
	}

	/**
	 * @param {string} key 
	 */
	static delete(key) {
		localStorage.removeItem(this.CACHE_PREFIX + key);
	}

	/**
	 * 清除所有缓存
	 */
	static clear() {
		Object.keys(localStorage)
			.filter(key => key.startsWith(this.CACHE_PREFIX))
			.forEach(key => localStorage.removeItem(key));
	}
}

/**
 * 带缓存的 API 请求
 * @param {string} endpoint 
 * @param {RequestInit} [options={}] 
 * @param {string} [cacheKey] 
 * @param {number} [ttl] 
 */
export async function cachedApiRequest(endpoint, options = {}, cacheKey, ttl) {
	const key = cacheKey || `${options.method || 'GET'}_${endpoint}`;
	
	// 尝试从缓存获取
	const cached = APICache.get(key);
	if (cached) {
		return cached;
	}

	// 发起请求
	const data = await apiRequest(endpoint, options);
	
	// 缓存结果（仅缓存 GET 请求）
	if ((options.method || 'GET') === 'GET') {
		APICache.set(key, data, ttl);
	}

	return data;
}

/**
 * 错误处理助手
 */
export class ErrorHandler {
	/**
	 * @param {Error | ApiError} error 
	 * @param {object} [context={}] 
	 */
	static async handleApiError(error, context = {}) {
		console.error('API Error:', error, context);

		const status = error.status || 0;

		// 根据错误类型进行不同处理
		switch (status) {
			case 401:
				this.showErrorToast('请重新登录');
				break;
			case 403:
				this.showErrorToast('权限不足');
				break;
			case 404:
				this.showErrorToast('请求的资源不存在');
				break;
			case 408:
				this.showErrorToast('请求超时，请重试');
				break;
			case 429:
				this.showErrorToast('请求过于频繁，请稍后重试');
				break;
			case 500:
			case 502:
			case 503:
			case 504:
				this.showErrorToast('服务器暂时不可用，请稍后重试');
				break;
			default:
				if (!navigator.onLine) {
					this.showErrorToast('当前处于离线模式');
				} else {
					this.showErrorToast(error.message || '网络请求失败');
				}
		}
	}

	/**
	 * @param {string} message 
	 */
	static showErrorToast(message) {
		const toast = document.createElement('div');
		toast.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
		toast.textContent = message;
		
		document.body.appendChild(toast);
		
		setTimeout(() => {
			if (document.body.contains(toast)) {
				document.body.removeChild(toast);
			}
		}, 3000);
	}

	/**
	 * @param {string} message 
	 */
	static showSuccessToast(message) {
		const toast = document.createElement('div');
		toast.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
		toast.textContent = message;
		
		document.body.appendChild(toast);
		
		setTimeout(() => {
			if (document.body.contains(toast)) {
				document.body.removeChild(toast);
			}
		}, 3000);
	}
}

/**
 * API 性能监控
 */
export class APIMonitor {
	static trackRequest(url, method, startTime, endTime, status, error = null) {
		const duration = endTime - startTime;
		
		const metrics = {
			type: 'api_request',
			url,
			method,
			duration,
			status,
			error: error?.message,
			timestamp: Date.now(),
			userAgent: navigator.userAgent,
			connectionType: navigator.connection?.effectiveType
		};

		// 发送监控数据
		api.trackEvent(metrics);

		// 性能预警
		if (duration > 3000) {
			console.warn(`Slow API: ${url} took ${duration}ms`);
		}

		if (status >= 400) {
			console.error(`API Error: ${url} returned ${status}`);
		}
	}

	static wrapRequest(originalFetch) {
		return async function(...args) {
			const startTime = Date.now();
			const url = args[0];
			const options = args[1] || {};
			const method = options.method || 'GET';

			try {
				const response = await originalFetch(...args);
				const endTime = Date.now();
				
				APIMonitor.trackRequest(url, method, startTime, endTime, response.status);
				
				return response;
			} catch (error) {
				const endTime = Date.now();
				
				APIMonitor.trackRequest(url, method, startTime, endTime, 0, error);
				
				throw error;
			}
		};
	}
}

// 导出错误类
export { ApiError }; 