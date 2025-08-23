// dev-proxy.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = process.env.PORT || 5000;
const app = express();

const VITE = 'http://127.0.0.1:5173';
const API  = 'http://127.0.0.1:8000';

// پروکسی API
app.use('/api', createProxyMiddleware({
  target: API,
  changeOrigin: true,
  xfwd: true,
}));

// پروکسی Vite (هم HTTP هم WebSocket برای HMR)
const viteProxy = createProxyMiddleware({
  target: VITE,
  changeOrigin: true,
  ws: true,
  xfwd: true,
  onProxyReq(proxyReq) {
    // مطمئن شو Host برای Vite قابل قبول باشه
    proxyReq.setHeader('Host', '127.0.0.1:5173');
  },
});

// همه مسیرهای دیگر به Vite
app.use('/', viteProxy);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Dev proxy running on http://0.0.0.0:${PORT}`);
});

// WebSocket upgrade برای HMR
server.on('upgrade', viteProxy.upgrade);