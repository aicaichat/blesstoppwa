import { j as json } from "../../../../../chunks/index.js";
const mockCertificates = {
  "12345678": {
    id: "12345678",
    videoUrl: "/videos/sanctify-blessing.mp4",
    hash: "A1B2C3D4E5F67890",
    sign: "Master Huineng",
    mintedAt: "2024-01-15T10:30:00Z",
    templeId: "JingShan001",
    templeName: "径山寺",
    material: "天然沉香",
    beadCount: 108,
    blessing: "观音无畏布施",
    isValid: true
  },
  "87654321": {
    id: "87654321",
    videoUrl: "/videos/sanctify-blessing-2.mp4",
    hash: "F5E4D3C2B1A09876",
    sign: "Master Xuanzang",
    mintedAt: "2024-01-10T14:45:00Z",
    templeId: "FaYun002",
    templeName: "法云寺",
    material: "沉香木",
    beadCount: 18,
    blessing: "文殊智慧加持",
    isValid: true
  }
};
function generateHash(id) {
  const timestamp = Date.now().toString();
  const combined = `${id}-${timestamp}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, "0").toUpperCase();
}
async function GET({ params, url }) {
  const { id } = params;
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));
  if (!id || id.length < 8) {
    return json(
      { error: "手串编号格式不正确" },
      { status: 400 }
    );
  }
  let certificateData = mockCertificates[id];
  if (!certificateData) {
    const isValid = Math.random() > 0.1;
    if (!isValid) {
      return json(
        { error: "此手串编号未在数据库中找到，请检查编号是否正确" },
        { status: 404 }
      );
    }
    certificateData = {
      id,
      videoUrl: "/videos/sanctify-blessing.mp4",
      hash: generateHash(id),
      sign: ["Master Huineng", "Master Xuanzang", "Master Jianzhen"][Math.floor(Math.random() * 3)],
      mintedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1e3).toISOString(),
      templeId: `Temple${Math.floor(Math.random() * 1e3).toString().padStart(3, "0")}`,
      templeName: ["径山寺", "法云寺", "灵隐寺", "净慈寺"][Math.floor(Math.random() * 4)],
      material: ["天然沉香", "沉香木", "檀香木"][Math.floor(Math.random() * 3)],
      beadCount: [18, 27, 54, 108][Math.floor(Math.random() * 4)],
      blessing: ["观音无畏布施", "文殊智慧加持", "普贤行愿护持", "地藏愿力庇佑"][Math.floor(Math.random() * 4)],
      isValid: true
    };
  }
  const response = {
    ...certificateData,
    verifiedAt: (/* @__PURE__ */ new Date()).toISOString(),
    chainStatus: "confirmed",
    blockHeight: 1234567 + Math.floor(Math.random() * 1e4),
    gasUsed: "0.00123 ETH",
    confirmations: 15 + Math.floor(Math.random() * 100)
  };
  const headers = {
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    "Content-Type": "application/json"
  };
  return json(response, { headers });
}
async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept"
    }
  });
}
export {
  GET,
  OPTIONS
};
