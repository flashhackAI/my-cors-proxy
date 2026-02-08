module.exports = async (req, res) => {
  const { url, ...queryParams } = req.query

  if (!url) {
    return res.status(400).send('Missing url parameter')
  }

  try {
    const targetUrl = new URL(url)
    // 将其他查询参数添加到目标URL
    Object.keys(queryParams).forEach(key => targetUrl.searchParams.append(key, queryParams[key]))

    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: {
        ...req.headers,
        host: targetUrl.host
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined
    })

    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', '*')

    // 如果是预检请求，直接返回
    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    // 将目标响应头复制到响应中
    response.headers.forEach((value, key) => {
      if (key !== 'content-encoding') { // 避免压缩问题
        res.setHeader(key, value)
      }
    })

    response.body.pipe(res)
  } catch (error) {
    res.status(500).send(error.message)
  }
}
