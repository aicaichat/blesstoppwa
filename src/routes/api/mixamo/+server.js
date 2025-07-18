import { json } from '@sveltejs/kit';

// Mixamo动画文件的基础URL（这里使用示例URL，实际应该指向真实的动画文件）
const MIXAMO_BASE_URL = 'https://example.com/mixamo-animations/';

// 预定义的动画文件映射
const ANIMATION_FILES = {
	'idle_01.fbx': 'https://example.com/mixamo-animations/idle_01.fbx',
	'idle_02.fbx': 'https://example.com/mixamo-animations/idle_02.fbx',
	'idle_03.fbx': 'https://example.com/mixamo-animations/idle_03.fbx',
	'idle_happy_01.fbx': 'https://example.com/mixamo-animations/idle_happy_01.fbx',
	'idle_happy_02.fbx': 'https://example.com/mixamo-animations/idle_happy_02.fbx',
	'idle_happy_03.fbx': 'https://example.com/mixamo-animations/idle_happy_03.fbx',
	'standing_greeting.fbx': 'https://example.com/mixamo-animations/standing_greeting.fbx',
	'thinking.fbx': 'https://example.com/mixamo-animations/thinking.fbx',
	'excited.fbx': 'https://example.com/mixamo-animations/excited.fbx',
	'blessing.fbx': 'https://example.com/mixamo-animations/blessing.fbx',
	'meditation.fbx': 'https://example.com/mixamo-animations/meditation.fbx'
};

export async function GET({ url }) {
	const filename = url.searchParams.get('file');
	
	if (!filename) {
		return json({ error: 'Missing file parameter' }, { status: 400 });
	}

	const animationUrl = ANIMATION_FILES[filename];
	if (!animationUrl) {
		return json({ error: 'Animation file not found' }, { status: 404 });
	}

	try {
		// 这里应该返回实际的动画文件
		// 由于我们没有真实的动画文件，返回一个占位符响应
		return new Response('Animation file placeholder', {
			headers: {
				'Content-Type': 'application/octet-stream',
				'Content-Disposition': `attachment; filename="${filename}"`
			}
		});
	} catch (error) {
		console.error('Error serving animation file:', error);
		return json({ error: 'Failed to serve animation file' }, { status: 500 });
	}
}

// 处理特定动画文件的请求
export async function POST({ request }) {
	const { filename } = await request.json();
	
	if (!filename) {
		return json({ error: 'Missing filename' }, { status: 400 });
	}

	const animationUrl = ANIMATION_FILES[filename];
	if (!animationUrl) {
		return json({ error: 'Animation file not found' }, { status: 404 });
	}

	return json({ 
		url: animationUrl,
		filename: filename,
		status: 'available'
	});
} 