// server.js
import express from 'express';
import routes from './routes';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Proxy middleware
app.use('/api', createProxyMiddleware({ 
  target: 'https://hotelapi.loyalty.dev',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // rewrite path
  },
}));

// Routes
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));