import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { initDatabase } from './server/db.ts';
import apiRouter from './server/routes/api.ts';

async function startServer() {
  initDatabase();

  const app = express();
  const isProd = process.env.NODE_ENV === 'production';
  const port = Number(process.env.PORT || process.env.SERVER_PORT || 3000);

  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: '256kb' }));

  const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again shortly.' },
  });

  const writeLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Submission rate limit reached. Please wait a moment.' },
  });

  app.use('/api', apiLimiter);
  app.use('/api/checkout', writeLimiter);
  app.use('/api/newsletter', writeLimiter);
  app.use('/api/contact', writeLimiter);

  app.use('/api', apiRouter);

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    const publicDir = path.resolve(process.cwd(), 'public');
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir, { maxAge: '7d', index: false }));
    }
    if (fs.existsSync(publicDir)) {
      app.use(express.static(publicDir, { maxAge: '7d', index: false }));
    }
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(err?.status || 500).json({
      error: isProd ? 'An unexpected error occurred.' : err?.message || 'Internal server error',
    });
  });

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`PLATINUM X server listening on http://0.0.0.0:${port} (${isProd ? 'production' : 'development'})`);
  });

  const shutdown = (signal: string) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 8000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer().catch((err) => {
  console.error('Failed to start PLATINUM X server:', err);
  process.exit(1);
});
