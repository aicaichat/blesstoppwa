import { readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function GET() {
	try {
		console.log('🎭 请求aili.vrm文件');

		// 读取VRM文件
		const vrmPath = join(__dirname, '../../../../../public/aili.vrm');
		const vrmData = await readFile(vrmPath);
		
		console.log('✅ VRM文件加载成功: aili.vrm', vrmData.length, 'bytes');

		return new Response(vrmData, {
			headers: {
				'Content-Type': 'application/octet-stream',
				'Content-Length': vrmData.length.toString(),
				'Cache-Control': 'public, max-age=31536000',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET',
				'Access-Control-Allow-Headers': 'Content-Type'
			}
		});
	} catch (error) {
		console.error('❌ VRM文件读取失败:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return new Response(`VRM file not found: ${errorMessage}`, { status: 404 });
	}
} 