// Integration dry-run: invoke the REAL Vercel handlers with mock req/res against the
// live Gemini API, exactly as the client calls them. Proves production code paths run.
// Run: $env:GEMINI_API_KEY="..."; node scripts/_endpoint_test.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import generateHandler from '../api/generate.js';
import logoHandler from '../api/logo.js';
import mockupHandler from '../api/mockup.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(__dirname, '..');

function mockRes() {
  return {
    statusCode: 200,
    _json: null,
    status(c) { this.statusCode = c; return this; },
    json(o) { this._json = o; return this; },
  };
}
const run = (h, body) => { const res = mockRes(); return h({ method: 'POST', body }, res).then(() => res); };

// A real PNG to stand in for the rendered label (the client sends canvas PNG base64).
const labelPng = fs.readFileSync(
  path.resolve(APP, '..', 'claude-solutions', '_test_gemini-3-pro-image.png')
).toString('base64');

console.log('== 1. /api/generate (label compliance JSON) ==');
{
  const res = await run(generateHandler, { rawInput: 'Product: Dried Spicy Mango, Ingredients: Ripe Mango 85%, Sugar 12%, Chili 3%, Weight: 100g', inputLanguage: 'en' });
  const ok = res.statusCode === 200 && res._json?.productNameKh && Array.isArray(res._json?.ingredients);
  console.log(`  status=${res.statusCode} productNameKh=${res._json?.productNameKh || '(none)'} ingredients=${res._json?.ingredients?.length} -> ${ok ? '✅' : '❌ ' + JSON.stringify(res._json).slice(0,200)}`);
}

console.log('== 2. /api/logo (raster PNG logo) ==');
{
  const res = await run(logoHandler, { userPrompt: 'mango emblem', brandName: 'Agri Khmer', estYear: '2026', primaryColor: '#f59e0b', secondaryColor: '#1e293b' });
  const img = res._json?.image;
  const ok = res.statusCode === 200 && typeof img === 'string' && img.startsWith('data:image/png;base64,');
  if (ok) fs.writeFileSync(path.join(APP, 'scripts', '_test_logo_endpoint.png'), Buffer.from(img.split(',')[1], 'base64'));
  console.log(`  status=${res.statusCode} key=image=${!!img} -> ${ok ? '✅ saved _test_logo_endpoint.png' : '❌ ' + JSON.stringify(res._json).slice(0,200)}`);
}

console.log('== 3. /api/mockup (image-to-image wrap) ==');
{
  const res = await run(mockupHandler, { mockupId: 'pouch-lifestyle', labelPng, userPrompt: 'wrap naturally onto the pouch' });
  const img = res._json?.image;
  const ok = res.statusCode === 200 && typeof img === 'string' && img.startsWith('data:image/png;base64,');
  if (ok) fs.writeFileSync(path.join(APP, 'scripts', '_test_mockup_endpoint.png'), Buffer.from(img.split(',')[1], 'base64'));
  console.log(`  status=${res.statusCode} key=image=${!!img} -> ${ok ? '✅ saved _test_mockup_endpoint.png' : '❌ ' + JSON.stringify(res._json).slice(0,200)}`);
}

console.log('== 4. /api/mockup guard (missing labelPng -> 400) ==');
{
  const res = await run(mockupHandler, { mockupId: 'pouch-lifestyle' });
  console.log(`  status=${res.statusCode} -> ${res.statusCode === 400 ? '✅' : '❌'} ${JSON.stringify(res._json)}`);
}
console.log('\nDone.');
