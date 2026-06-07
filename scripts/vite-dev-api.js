// Dev-only Vite plugin: run the Vercel-style serverless handlers in api/ during
// `npm run dev`, so /api/generate, /api/logo, /api/mockup, /api/login work locally
// exactly like on Vercel (Vite alone does NOT execute api/ functions).
import path from 'path';
import { pathToFileURL } from 'url';
import fs from 'fs';

export function devApiPlugin() {
  const apiDir = path.resolve(process.cwd(), 'api');

  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next();

        const name = req.url.split('?')[0].replace(/^\/api\//, '').replace(/\/$/, '');
        // Allowlist the handler name so a crafted URL (e.g. /api/../../evil) can't
        // escape apiDir and execute an arbitrary local .js file.
        if (!/^[a-zA-Z0-9_-]+$/.test(name)) return next();
        const file = path.join(apiDir, `${name}.js`);
        if (!fs.existsSync(file)) return next();

        // Collect and JSON-parse the request body (Vercel hands handlers a parsed body).
        let raw = '';
        for await (const chunk of req) raw += chunk;
        try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = raw; }

        // Minimal Vercel-compatible res shim over the Node ServerResponse.
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (obj) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(obj));
          return res;
        };

        try {
          // Cache-bust so handler edits are picked up without restarting the server.
          const mod = await server.ssrLoadModule(pathToFileURL(file).href).catch(
            () => import(`${pathToFileURL(file).href}?t=${Date.now()}`)
          );
          const handler = mod.default || mod.handler;
          await handler(req, res);
        } catch (err) {
          console.error(`[dev-api] ${name} threw:`, err);
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'dev-api handler crashed', details: String(err?.message || err) }));
          }
        }
      });
    },
  };
}
