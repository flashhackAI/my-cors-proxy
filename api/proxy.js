export default async function handler(req, res) {
  // 1. 配置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. 仅支持 GET 请求（先简化逻辑，避免复杂请求的问题）
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '仅支持 GET 请求' });
  }

  try {
    // 4. 解析目标 URL（严格校验格式）
    const targetUrl = decodeURIComponent(req.url.slice(1));
    if (!targetUrl.startsWith('http')) {
      return res.status(400).json({ error: '目标 URL 必须以 http/https 开头' });
    }

    // 5. 转发请求（去掉自定义请求头，避免格式错误）
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 6. 转发响应
    const data = await response.json().catch(() => response.text());
    res.status(response.status).send(data);
  } catch (error) {
    // 捕获并返回错误信息（方便排查）
    res.status(500).json({ 
      error: '代理失败', 
      detail: error.message 
    });
  }
}

export const config = {
  api: {
    bodyParser: true
  }
};
