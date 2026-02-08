import fetch from 'node-fetch';

export default async function handler(req, res) {
  // 1. 设置 CORS 响应头（允许所有域名，生产环境可指定具体域名）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 2. 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 3. 获取目标请求地址（从 URL 路径中解析）
    const targetUrl = decodeURIComponent(req.url.slice(1)); // 去掉开头的 /
    if (!targetUrl) {
      return res.status(400).json({ error: '请传入目标 URL，例如：https://你的代理域名/https://api.example.com' });
    }

    // 4. 转发请求到目标地址
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' ? req.body : undefined,
    });

    // 5. 转发响应到前端
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: '代理请求失败', message: error.message });
  }
}

// 解决 node-fetch 依赖问题（Vercel 环境需要）
export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};
