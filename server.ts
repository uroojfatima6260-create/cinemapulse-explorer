import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'CinemaPulse API Proxy',
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/tvmaze/*', async (req, res) => {
    try {
      const pathSuffix = req.params[0] || '';
      const queryString = new URLSearchParams(req.query as Record<string, string>).toString();
      const targetUrl = `https://api.tvmaze.com/${pathSuffix}${queryString ? '?' + queryString : ''}`;

      const response = await fetch(targetUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CinemaPulse-Explorer/1.0'
        }
      });

      if (!response.ok) {
        return res.status(response.status).json({
          error: `TVMaze API error: ${response.statusText}`,
          statusCode: response.status
        });
      }

      const data = await response.json();
      return res.json(data);
    } catch (err) {
      console.error('TVMaze Proxy Error:', err);
      return res.status(502).json({
        error: 'Failed to communicate with TVMaze API',
        details: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
