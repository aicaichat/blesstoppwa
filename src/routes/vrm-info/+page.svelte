<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let vrmInfo = null;
	let loading = false;
	let error = null;

	onMount(async () => {
		if (browser) {
			await checkVRMInfo();
		}
	});

	async function checkVRMInfo() {
		loading = true;
		error = null;
		vrmInfo = null;

		try {
			// 首先检查文件是否存在
			const response = await fetch('/god.vrm', { method: 'HEAD' });
			if (!response.ok) {
				throw new Error('VRM文件不存在或无法访问');
			}

			// 获取文件大小
			const contentLength = response.headers.get('content-length');
			const fileSize = contentLength ? `${(parseInt(contentLength) / 1024 / 1024).toFixed(1)}MB` : '未知';

			// 尝试加载VRM文件进行基本检查
			const arrayBuffer = await fetch('/god.vrm').then(res => res.arrayBuffer());
			
			// 检查文件头，确认是VRM文件
			const header = new Uint8Array(arrayBuffer.slice(0, 4));
			const isGLTF = String.fromCharCode(...header) === 'glTF';
			
			if (!isGLTF) {
				throw new Error('文件不是有效的GLTF/VRM格式');
			}

			// 基本VRM信息
			vrmInfo = {
				fileSize: fileSize,
				fileType: 'VRM/GLTF',
				animationCount: 0, // 默认值，实际需要解析文件
				hasExpressions: false, // 默认值
				modelInfo: {
					hasHumanoid: true, // VRM通常有人形骨骼
					hasSpringBone: false,
					hasLookAt: false,
					hasFirstPerson: false
				},
				status: '文件存在且格式正确，但需要客户端解析获取详细信息'
			};

			console.log('✅ VRM文件基本检查完成');
		} catch (err) {
			console.error('❌ VRM文件检查失败:', err);
			error = err.message;
		} finally {
			loading = false;
		}
	}

	async function performDetailedCheck() {
		if (!browser) return;
		
		loading = true;
		error = null;

		try {
			// 动态导入Three.js和VRM加载器
			const THREE = await import('three');
			const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
			const { VRMLoaderPlugin } = await import('@pixiv/three-vrm');

			const loader = new GLTFLoader();
			loader.register((parser) => {
				return new VRMLoaderPlugin(parser);
			});

			console.log('🔍 开始详细VRM分析...');
			const gltf = await loader.loadAsync('/god.vrm');
			const vrm = gltf.userData.vrm;

			if (!vrm) {
				throw new Error('VRM数据未找到');
			}

			// 更新详细信息
			vrmInfo = {
				...vrmInfo,
				animations: gltf.animations || [],
				animationCount: gltf.animations ? gltf.animations.length : 0,
				animationNames: gltf.animations ? gltf.animations.map((clip, index) => ({
					name: clip.name || `Animation_${index}`,
					duration: clip.duration,
					tracks: clip.tracks.length
				})) : [],
				hasExpressions: !!vrm.expressionManager,
				expressionNames: vrm.expressionManager ? 
					Object.keys(vrm.expressionManager._expressions || {}) : [],
				modelInfo: {
					hasHumanoid: !!vrm.humanoid,
					hasSpringBone: !!vrm.springBoneManager,
					hasLookAt: !!vrm.lookAt,
					hasFirstPerson: !!vrm.firstPerson
				},
				status: '详细分析完成'
			};

			console.log('✅ VRM详细分析完成:', vrmInfo);
		} catch (err) {
			console.error('❌ VRM详细分析失败:', err);
			error = err.message;
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>VRM文件信息</title>
</svelte:head>

<div class="vrm-info-container">
	<h1>VRM文件信息检查</h1>

	<div class="controls">
		<button on:click={checkVRMInfo} disabled={loading}>
			{loading ? '检查中...' : '基本检查'}
		</button>
		<button on:click={performDetailedCheck} disabled={loading || !vrmInfo}>
			{loading ? '分析中...' : '详细分析'}
		</button>
	</div>

	{#if loading}
		<div class="loading">
			<div class="spinner"></div>
			<p>正在检查VRM文件信息...</p>
		</div>
	{:else if error}
		<div class="error">
			<h3>❌ 错误</h3>
			<p>{error}</p>
		</div>
	{:else if vrmInfo}
		<div class="info-grid">
			<div class="info-card">
				<h3>📊 基本信息</h3>
				<ul>
					<li><strong>文件大小:</strong> {vrmInfo.fileSize}</li>
					<li><strong>文件类型:</strong> {vrmInfo.fileType}</li>
					<li><strong>动画数量:</strong> {vrmInfo.animationCount}</li>
					<li><strong>表情支持:</strong> {vrmInfo.hasExpressions ? '✅ 是' : '❌ 否'}</li>
					<li><strong>状态:</strong> {vrmInfo.status}</li>
				</ul>
			</div>

			<div class="info-card">
				<h3>🎭 模型功能</h3>
				<ul>
					<li><strong>人形骨骼:</strong> {vrmInfo.modelInfo.hasHumanoid ? '✅ 是' : '❌ 否'}</li>
					<li><strong>弹簧骨骼:</strong> {vrmInfo.modelInfo.hasSpringBone ? '✅ 是' : '❌ 否'}</li>
					<li><strong>视线追踪:</strong> {vrmInfo.modelInfo.hasLookAt ? '✅ 是' : '❌ 否'}</li>
					<li><strong>第一人称:</strong> {vrmInfo.modelInfo.hasFirstPerson ? '✅ 是' : '❌ 否'}</li>
				</ul>
			</div>

			{#if vrmInfo.animationCount > 0}
				<div class="info-card">
					<h3>🎬 动画列表</h3>
					<ul>
						{#each vrmInfo.animationNames as animation}
							<li>
								<strong>{animation.name}</strong>
								<br>
								<span class="animation-details">
									时长: {animation.duration.toFixed(2)}s | 
									轨道: {animation.tracks}
								</span>
							</li>
						{/each}
					</ul>
				</div>
			{:else if vrmInfo.animationNames}
				<div class="info-card">
					<h3>⚠️ 动画信息</h3>
					<p>此VRM模型没有内置动画数据。</p>
					<p>系统将自动创建默认的呼吸和摆动动画。</p>
				</div>
			{/if}

			{#if vrmInfo.expressionNames && vrmInfo.expressionNames.length > 0}
				<div class="info-card">
					<h3>😊 表情列表</h3>
					<ul>
						{#each vrmInfo.expressionNames as expression}
							<li>{expression}</li>
						{/each}
					</ul>
				</div>
			{:else if vrmInfo.hasExpressions !== undefined}
				<div class="info-card">
					<h3>😊 表情信息</h3>
					<p>此VRM模型没有表情数据。</p>
				</div>
			{/if}
		</div>

		<div class="recommendations">
			<h3>💡 建议</h3>
			<ul>
				{#if vrmInfo.animationCount === 0}
					<li>考虑下载带有动画的VRM模型，或使用VRoid Studio创建动画</li>
				{/if}
				{#if vrmInfo.hasExpressions === false}
					<li>考虑使用带有表情的VRM模型以获得更好的交互体验</li>
				{/if}
				<li>当前系统会自动创建默认动画，确保模型有基本的动态效果</li>
				<li>点击"详细分析"按钮获取完整的VRM信息</li>
			</ul>
		</div>
	{/if}
</div>

<style>
	.vrm-info-container {
		padding: 20px;
		max-width: 1200px;
		margin: 0 auto;
	}

	h1 {
		text-align: center;
		color: #ffd700;
		margin-bottom: 30px;
	}

	.controls {
		text-align: center;
		margin-bottom: 30px;
		display: flex;
		gap: 10px;
		justify-content: center;
		flex-wrap: wrap;
	}

	.controls button {
		padding: 12px 24px;
		background: linear-gradient(135deg, #ffd700, #ffed4e);
		border: none;
		border-radius: 25px;
		color: #000;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.controls button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
	}

	.controls button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.loading {
		text-align: center;
		padding: 40px;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid rgba(255, 215, 0, 0.3);
		border-top: 4px solid #ffd700;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 20px;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.error {
		background: rgba(255, 0, 0, 0.1);
		border: 1px solid #ff0000;
		border-radius: 10px;
		padding: 20px;
		margin: 20px 0;
		color: #ff6666;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 20px;
		margin-bottom: 30px;
	}

	.info-card {
		background: rgba(0, 0, 0, 0.1);
		border: 1px solid #333;
		border-radius: 10px;
		padding: 20px;
	}

	.info-card h3 {
		color: #ffd700;
		margin-bottom: 15px;
		border-bottom: 1px solid #333;
		padding-bottom: 10px;
	}

	.info-card ul {
		list-style: none;
		padding: 0;
	}

	.info-card li {
		margin-bottom: 10px;
		color: #ccc;
	}

	.info-card strong {
		color: #ffd700;
	}

	.animation-details {
		font-size: 0.9em;
		color: #999;
		margin-left: 10px;
	}

	.recommendations {
		background: rgba(255, 215, 0, 0.1);
		border: 1px solid #ffd700;
		border-radius: 10px;
		padding: 20px;
		margin-top: 20px;
	}

	.recommendations h3 {
		color: #ffd700;
		margin-bottom: 15px;
	}

	.recommendations ul {
		color: #ccc;
		line-height: 1.6;
	}

	.recommendations li {
		margin-bottom: 8px;
	}
</style> 