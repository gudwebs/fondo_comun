import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// 1. Blocked AI crawlers, scrapers, and vulnerability scanners
const BLOCKED_UA_PATTERN =
  /gptbot|chatgpt-user|oai-searchbot|claudebot|claude-web|anthropic-ai|google-extended|ccbot|perplexitybot|bytespider|amazonbot|applebot-extended|meta-externalagent|facebookbot|diffbot|cohere-ai|sqlmap|nikto|nmap|masscan|scrapy|zgrab/i;

// 2. Application-level WAF patterns (probes, path traversal, SQLi/XSS signatures)
const BLOCKED_PATH_PATTERN =
  /(\.\.|\/\.env|\/\.git|\/wp-admin|\/wp-login|\/phpmyadmin|\/xmlrpc\.php|\/cgi-bin|\/etc\/passwd)/i;

const BLOCKED_QUERY_PATTERN =
  /(<script|%3cscript|javascript:|union\s+select|drop\s+table|or\s+1=1|\.\.\/)/i;

// 3. In-memory Rate Limiter per IP (120 requests / 60s window)
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 120;

interface RateBucket {
  count: number;
  resetAt: number;
}

const rateBuckets = new Map<string, RateBucket>();

const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of rateBuckets.entries()) {
    if (now >= bucket.resetAt) {
      rateBuckets.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW_MS);
cleanupTimer.unref();

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function securityHeadersMiddleware(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader(
    'X-Robots-Tag',
    'noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai'
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  next();
}

function wafMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Always serve robots.txt cleanly even to crawlers so they receive Disallow: /
  if (req.path === '/robots.txt') {
    next();
    return;
  }

  // Only GET and HEAD are needed for this 100% client-side game
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  // Explicitly block any /api/* requests (no AI or paid API exists on this app)
  if (req.path.startsWith('/api/') || req.path === '/api') {
    res.status(403).json({
      error: 'Sin endpoints de API ni IA activos en esta aplicación.',
    });
    return;
  }

  const userAgent = String(req.headers['user-agent'] ?? '');
  if (BLOCKED_UA_PATTERN.test(userAgent)) {
    res.status(403).type('text/plain').send('Acceso bloqueado para rastreadores automatizados.');
    return;
  }

  const rawUrl = req.originalUrl || req.url || '';
  if (BLOCKED_PATH_PATTERN.test(req.path) || BLOCKED_QUERY_PATTERN.test(rawUrl)) {
    res.status(403).type('text/plain').send('Solicitud bloqueada por el filtro de seguridad.');
    return;
  }

  next();
}

function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const ip = getClientIp(req);
  const now = Date.now();
  let bucket = rateBuckets.get(ip);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateBuckets.set(ip, bucket);
  } else {
    bucket.count += 1;
  }

  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - bucket.count);
  res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS));
  res.setHeader('X-RateLimit-Remaining', String(remaining));

  if (bucket.count > RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    res.setHeader('Retry-After', String(retryAfterSec));
    res.status(429).type('text/plain').send('Demasiadas solicitudes. Intenta de nuevo en un momento.');
    return;
  }

  next();
}

async function startServer(): Promise<void> {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(securityHeadersMiddleware);
  app.use(rateLimitMiddleware);
  app.use(wafMiddleware);

  // Explicit robots.txt route for dev and production
  const robotsPath = path.resolve(__dirname, 'public', 'robots.txt');
  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain');
    if (fs.existsSync(robotsPath)) {
      res.sendFile(robotsPath);
    } else {
      res.send('User-agent: *\nDisallow: /\n');
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir, { index: 'index.html' }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fondo Común server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
