# API 通讯指南 - BlessTop PWA

本指南详细介绍如何在 SvelteKit PWA 项目中与后端 API 进行通讯，包括认证、错误处理、离线缓存等最佳实践。

## 📁 项目架构概览

```
bless-top-pwa/
├── src/
│   ├── routes/
│   │   ├── api/                 # SvelteKit API Routes (服务端)
│   │   │   └── cert/[id]/+server.js
│   │   ├── sanctify/+page.svelte # 页面组件 (客户端)
│   │   └── ...
│   ├── lib/
│   │   ├── stores/appState.js   # 状态管理
│   │   ├── utils/api.js         # API 工具函数
│   │   └── services/           # 业务服务层
│   └── app.html
├── nginx.conf                   # 反向代理配置
└── package.json
```

## 🔗 API 通讯方式

### 1. SvelteKit API Routes (推荐)

SvelteKit 提供了 **服务端 API Routes**，这是最佳的 API 实现方式：

#### 创建 API 端点

```javascript
// src/routes/api/cert/[id]/+server.js
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, url, request }) {
	const { id } = params;
	
	try {
		// 验证参数
		if (!id || id.length < 8) {
			return json(
				{ error: '手串编号格式不正确' },
				{ status: 400 }
			);
		}

		// 模拟网络延迟
		await new Promise(resolve => setTimeout(resolve, 800));

		// 业务逻辑
		const certificateData = await fetchCertificateFromDB(id);

		// 设置缓存头
		const headers = {
			'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
			'Content-Type': 'application/json'
		};

		return json(certificateData, { headers });

	} catch (error) {
		console.error('Certificate fetch failed:', error);
		return json(
			{ error: '服务器内部错误' },
			{ status: 500 }
		);
	}
}

// POST 请求处理
export async function POST({ request, params }) {
	const data = await request.json();
	
	// 处理 POST 数据
	const result = await processCertificateUpdate(params.id, data);
	
	return json(result);
}
```

#### 客户端调用 API

```javascript
// src/routes/sanctify/+page.svelte
<script>
	import { onMount } from 'svelte';

	let certificateData = null;
	let loading = false;
	let error = null;

	async function fetchCertificate(id) {
		loading = true;
		error = null;

		try {
			const response = await fetch(`/api/cert/${id}`);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			certificateData = await response.json();
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		const id = new URLSearchParams(window.location.search).get('id');
		if (id) {
			fetchCertificate(id);
		}
	});
</script>
```

### 2. 外部 API 调用

#### 创建 API 工具函数

```javascript
// src/lib/utils/api.js
const API_BASE_URL = 'https://bless.top/wp-json';
const API_TIMEOUT = 10000; // 10 秒超时

class ApiError extends Error {
	constructor(message, status, response) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.response = response;
	}
}

// 通用 fetch 包装器
export async function apiRequest(endpoint, options = {}) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

	const config = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			...options.headers
		},
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

		if (error.name === 'AbortError') {
			throw new ApiError('Request timeout', 408);
		}

		throw error;
	}
}

// 具体 API 方法
export const api = {
	// 获取手串信息
	async getBraceletInfo(braceletId) {
		return apiRequest(`/bracelet-info/v1/bracelet/${braceletId}`);
	},

	// 提交随喜功德
	async submitDonation(data) {
		return apiRequest('/donations/v1/submit', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	},

	// 获取运势信息
	async getFortune(fingerprintHash) {
		return apiRequest(`/fortune/v1/predict`, {
			method: 'POST',
			body: JSON.stringify({ fingerprint: fingerprintHash })
		});
	},

	// GPT 流式对话
	async streamChat(messages) {
		const response = await fetch('/api/gpt-stream', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ messages })
		});

		if (!response.ok) {
			throw new ApiError('Chat stream failed', response.status);
		}

		return response; // 返回流式响应
	}
};
```

#### 在组件中使用 API

```javascript
// src/lib/services/braceletService.js
import { api } from '$lib/utils/api.js';
import { userSession } from '$lib/stores/appState.js';

export class BraceletService {
	static async loadBraceletProfile(chipId) {
		try {
			const data = await api.getBraceletInfo(chipId);
			
			// 更新用户会话
			userSession.update(state => ({
				...state,
				braceletData: data,
				fingerprintHash: this.generateFingerprint(data)
			}));

			return data;
		} catch (error) {
			console.error('Failed to load bracelet profile:', error);
			throw error;
		}
	}

	static generateFingerprint(data) {
		// 生成八字指纹
		const combined = `${data.birthDate}-${data.birthTime}-${data.material}`;
		return btoa(combined).slice(0, 32);
	}

	static async submitMeritDonation(amount, message) {
		try {
			const result = await api.submitDonation({
				amount,
				message,
				timestamp: new Date().toISOString()
			});

			// 更新本地状态
			userSession.update(state => ({
				...state,
				donationAmount: amount,
				lastDonation: result
			}));

			return result;
		} catch (error) {
			console.error('Donation failed:', error);
			throw error;
		}
	}
}
```

### 3. 流式 API (SSE/WebSocket)

#### 流式聊天实现

```javascript
// src/routes/api/gpt-stream/+server.js
export async function POST({ request }) {
	const { messages, fingerprint } = await request.json();

	// 创建流式响应
	const stream = new ReadableStream({
		start(controller) {
			streamGPTResponse(messages, fingerprint, controller);
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		}
	});
}

async function streamGPTResponse(messages, fingerprint, controller) {
	try {
		// 调用 OpenAI API
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'gpt-4',
				messages: [
					{ role: 'system', content: getPersonalityPrompt(fingerprint) },
					...messages
				],
				stream: true
			})
		});

		const reader = response.body.getReader();
		const decoder = new TextDecoder();

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			const chunk = decoder.decode(value);
			const lines = chunk.split('\n').filter(line => line.trim());

			for (const line of lines) {
				if (line.startsWith('data: ')) {
					const data = line.slice(6);
					if (data === '[DONE]') break;

					try {
						const parsed = JSON.parse(data);
						const content = parsed.choices[0]?.delta?.content;
						
						if (content) {
							controller.enqueue(`data: ${JSON.stringify({
								type: 'content',
								content
							})}\n\n`);
						}
					} catch (e) {
						// 忽略解析错误
					}
				}
			}
		}

		controller.enqueue(`data: ${JSON.stringify({
			type: 'done'
		})}\n\n`);
	} catch (error) {
		controller.enqueue(`data: ${JSON.stringify({
			type: 'error',
			error: error.message
		})}\n\n`);
	} finally {
		controller.close();
	}
}
```

#### 客户端使用流式 API

```javascript
// src/routes/mirror/+page.svelte
<script>
	import { mirrorState } from '$lib/stores/appState.js';

	async function sendMessage(message) {
		mirrorState.update(s => ({ ...s, status: 'streaming' }));

		try {
			const response = await fetch('/api/gpt-stream', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					messages: [{ role: 'user', content: message }],
					fingerprint: $userSession.fingerprintHash
				})
			});

			if (!response.ok) {
				throw new Error('Stream failed');
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let aiResponse = '';

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value);
				const lines = chunk.split('\n').filter(line => line.trim());

				for (const line of lines) {
					if (line.startsWith('data: ')) {
						const data = JSON.parse(line.slice(6));
						
						if (data.type === 'content') {
							aiResponse += data.content;
							mirrorState.update(s => ({ 
								...s, 
								aiResponse 
							}));
						} else if (data.type === 'done') {
							mirrorState.update(s => ({ 
								...s, 
								status: 'idle',
								chatHistory: [...s.chatHistory, {
									user: message,
									ai: aiResponse,
									timestamp: Date.now()
								}]
							}));
						}
					}
				}
			}
		} catch (error) {
			mirrorState.update(s => ({ 
				...s, 
				status: 'error', 
				error: error.message 
			}));
		}
	}
</script>
```

## 🔐 认证与安全

### JWT Token 管理

```javascript
// src/lib/utils/auth.js
import { writable } from 'svelte/store';

export const authStore = writable({
	token: null,
	user: null,
	isAuthenticated: false
});

class AuthService {
	static TOKEN_KEY = 'bless_top_token';

	static async login(credentials) {
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(credentials)
			});

			const data = await response.json();

			if (response.ok) {
				this.setToken(data.token);
				authStore.set({
					token: data.token,
					user: data.user,
					isAuthenticated: true
				});
			}

			return data;
		} catch (error) {
			throw new Error('Login failed');
		}
	}

	static setToken(token) {
		localStorage.setItem(this.TOKEN_KEY, token);
	}

	static getToken() {
		return localStorage.getItem(this.TOKEN_KEY);
	}

	static logout() {
		localStorage.removeItem(this.TOKEN_KEY);
		authStore.set({
			token: null,
			user: null,
			isAuthenticated: false
		});
	}

	static getAuthHeaders() {
		const token = this.getToken();
		return token ? { 'Authorization': `Bearer ${token}` } : {};
	}
}

export { AuthService };
```

## 📱 离线缓存策略

### Service Worker 配置

```javascript
// src/lib/utils/cacheService.js
const CACHE_NAME = 'bless-top-v1';
const API_CACHE_NAME = 'bless-top-api-v1';

export class CacheService {
	static async cacheFirst(request) {
		const cache = await caches.open(CACHE_NAME);
		const cachedResponse = await cache.match(request);
		
		if (cachedResponse) {
			return cachedResponse;
		}

		try {
			const networkResponse = await fetch(request);
			cache.put(request, networkResponse.clone());
			return networkResponse;
		} catch (error) {
			// 返回离线页面
			return cache.match('/offline.html');
		}
	}

	static async networkFirst(request) {
		try {
			const networkResponse = await fetch(request);
			const cache = await caches.open(API_CACHE_NAME);
			cache.put(request, networkResponse.clone());
			return networkResponse;
		} catch (error) {
			const cache = await caches.open(API_CACHE_NAME);
			return cache.match(request);
		}
	}

	static async staleWhileRevalidate(request) {
		const cache = await caches.open(API_CACHE_NAME);
		const cachedResponse = await cache.match(request);

		const fetchPromise = fetch(request).then(networkResponse => {
			cache.put(request, networkResponse.clone());
			return networkResponse;
		});

		return cachedResponse || fetchPromise;
	}
}
```

### IndexedDB 数据持久化

```javascript
// src/lib/utils/storage.js
class LocalStorage {
	static DB_NAME = 'BlessTopDB';
	static DB_VERSION = 1;

	static async openDB() {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve(request.result);

			request.onupgradeneeded = (event) => {
				const db = event.target.result;
				
				// 创建对象存储
				if (!db.objectStoreNames.contains('certificates')) {
					const store = db.createObjectStore('certificates', { keyPath: 'id' });
					store.createIndex('timestamp', 'timestamp');
				}

				if (!db.objectStoreNames.contains('chatHistory')) {
					db.createObjectStore('chatHistory', { keyPath: 'sessionId' });
				}
			};
		});
	}

	static async saveCertificate(certificate) {
		const db = await this.openDB();
		const transaction = db.transaction(['certificates'], 'readwrite');
		const store = transaction.objectStore('certificates');
		
		await store.put({
			...certificate,
			timestamp: Date.now(),
			ttl: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7天过期
		});
	}

	static async getCertificate(id) {
		const db = await this.openDB();
		const transaction = db.transaction(['certificates'], 'readonly');
		const store = transaction.objectStore('certificates');
		
		const result = await store.get(id);
		
		// 检查是否过期
		if (result && result.ttl < Date.now()) {
			this.deleteCertificate(id);
			return null;
		}

		return result;
	}

	static async deleteCertificate(id) {
		const db = await this.openDB();
		const transaction = db.transaction(['certificates'], 'readwrite');
		const store = transaction.objectStore('certificates');
		
		await store.delete(id);
	}
}

export { LocalStorage };
```

## 🛠️ 错误处理和重试机制

### 统一错误处理

```javascript
// src/lib/utils/errorHandler.js
export class ErrorHandler {
	static async handleApiError(error, context = {}) {
		console.error('API Error:', error, context);

		// 根据错误类型进行不同处理
		if (error.status === 401) {
			// 重新登录
			AuthService.logout();
			window.location.href = '/login';
			return;
		}

		if (error.status === 429) {
			// 请求频率限制
			this.showRetryDialog('请求过于频繁，请稍后重试');
			return;
		}

		if (error.status >= 500) {
			// 服务器错误
			this.showRetryDialog('服务器暂时不可用，请稍后重试');
			return;
		}

		// 网络错误
		if (!navigator.onLine) {
			this.showOfflineMessage();
			return;
		}

		// 通用错误提示
		this.showErrorMessage(error.message || '请求失败');
	}

	static showRetryDialog(message) {
		// 显示重试对话框
		const dialog = document.createElement('dialog');
		dialog.innerHTML = `
			<div class="p-6 bg-white rounded-lg shadow-xl">
				<h3 class="text-lg font-semibold mb-4">网络错误</h3>
				<p class="mb-4">${message}</p>
				<div class="flex justify-end space-x-2">
					<button class="px-4 py-2 bg-gray-200 rounded" onclick="this.closest('dialog').close()">
						取消
					</button>
					<button class="px-4 py-2 bg-orange-500 text-white rounded" onclick="window.location.reload()">
						重试
					</button>
				</div>
			</div>
		`;
		document.body.appendChild(dialog);
		dialog.showModal();
	}

	static showOfflineMessage() {
		// 显示离线提示
		const toast = document.createElement('div');
		toast.className = 'fixed top-4 right-4 bg-yellow-500 text-white p-4 rounded-lg shadow-lg z-50';
		toast.textContent = '当前处于离线模式，部分功能可能受限';
		document.body.appendChild(toast);
		
		setTimeout(() => {
			document.body.removeChild(toast);
		}, 5000);
	}
}
```

### 自动重试机制

```javascript
// src/lib/utils/retry.js
export async function withRetry(fn, maxRetries = 3, delay = 1000) {
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

// 使用示例
export async function fetchWithRetry(url, options) {
	return withRetry(async () => {
		const response = await fetch(url, options);
		if (!response.ok) {
			throw new ApiError(`HTTP ${response.status}`, response.status);
		}
		return response.json();
	});
}
```

## 🌐 反向代理配置

### Nginx 配置示例

```nginx
# nginx.conf 片段
location /api/ {
    proxy_pass https://bless.top/wp-json/bracelet-info/v1/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # CORS headers
    add_header Access-Control-Allow-Origin "*";
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
    add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range";
    
    if ($request_method = 'OPTIONS') {
        return 204;
    }
    
    # 缓存策略
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_valid 404 1m;
}
```

## 📊 监控和分析

### API 性能监控

```javascript
// src/lib/utils/monitor.js
export class APIMonitor {
	static trackRequest(url, method, startTime, endTime, status) {
		const duration = endTime - startTime;
		
		// 发送监控数据
		this.sendMetrics({
			type: 'api_request',
			url,
			method,
			duration,
			status,
			timestamp: Date.now()
		});

		// 性能预警
		if (duration > 3000) {
			console.warn(`Slow API: ${url} took ${duration}ms`);
		}

		if (status >= 400) {
			console.error(`API Error: ${url} returned ${status}`);
		}
	}

	static sendMetrics(data) {
		// 发送到分析服务
		if (navigator.sendBeacon) {
			navigator.sendBeacon('/api/metrics', JSON.stringify(data));
		} else {
			fetch('/api/metrics', {
				method: 'POST',
				body: JSON.stringify(data),
				keepalive: true
			}).catch(() => {
				// 静默失败
			});
		}
	}
}
```

## 🚀 最佳实践总结

### 1. API 设计原则
- ✅ 使用 SvelteKit API Routes 作为主要后端接口
- ✅ 实现统一的错误处理和响应格式
- ✅ 添加适当的缓存策略
- ✅ 支持离线场景和降级体验

### 2. 性能优化
- ✅ 实现请求去重和防抖
- ✅ 使用流式响应处理大数据
- ✅ 配置适当的超时时间
- ✅ 监控 API 性能指标

### 3. 安全考虑
- ✅ 使用 HTTPS 和安全头
- ✅ 实现 JWT 认证机制
- ✅ 添加请求频率限制
- ✅ 验证和清理用户输入

### 4. 用户体验
- ✅ 提供加载状态和进度指示
- ✅ 优雅处理网络错误
- ✅ 支持离线场景
- ✅ 实现自动重试机制

---

## 🎯 快速开始

1. **启动开发服务器**
```bash
cd bless-top-pwa
npm run dev
```

2. **测试 API 调用**
```bash
curl http://localhost:5173/api/cert/12345678
```

3. **检查网络面板**
打开浏览器开发者工具 → Network 标签页，观察 API 请求和响应。

---

*最后更新：2025-01-17*
*版本：v1.0* 