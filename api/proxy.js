module.exports = async (req, res) => {
  // 1. 优先设置CORS头（所有请求都需要）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 2. 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. 获取目标URL
  const { url, ...queryParams } = req.query;
  if (!url) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    // 4. 解析并拼接目标URL
    const targetUrl = new URL(url);
    Object.keys(queryParams).forEach(key => {
      targetUrl.searchParams.append(key, queryParams[key]);
    });

    // 5. 转发请求（过滤不必要的头）
    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Authorization': req.headers['authorization'] || ''
      },
      body: req.method !== 'GET' ? req.body : undefined
    });

    // 6. 转发响应（非流式处理，兼容Vercel）
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).send(`Proxy failed: ${error.message}`);
  }
};
