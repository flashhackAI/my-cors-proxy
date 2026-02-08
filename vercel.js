{
  "version": 2,
  "builds": [
    {
      "src": "api/proxy.js",
      "use": "@vercel/node@20.x"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/proxy.js"
    }
  ]
}
