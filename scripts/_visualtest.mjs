// Visual test: render the REAL front-of-pack panel in a headless browser (via the
// dev server's own module), then wrap it through several mockup formats so we can
// eyeball that per-format prompts + clean design produce good results.
// Run: $env:GEMINI_API_KEY="..."; node scripts/_visualtest.mjs [port]
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '_vis');
fs.mkdirSync(OUT, { recursive: true });
const PORT = process.argv[2] || '5175';
const BASE = `http://localhost:${PORT}`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(BASE, { waitUntil: 'networkidle' });

// Render the front-of-pack design using the app's own renderer module.
const designDataUrl = await page.evaluate(async () => {
  const mod = await import('/src/utils/frontPanelRenderer.js');
  const c = document.createElement('canvas');
  await mod.drawFrontPanel(c, {
    productName: 'Dried Spicy Mango',
    productNameKh: 'ស្វាយសម្ងួតហឹរ',
    weight: '100g',
    tagline: 'GUT FRIENDLY · 100% ORGANIC',
    theme: 'amber',
  });
  return c.toDataURL('image/png');
});
fs.writeFileSync(path.join(OUT, '_design.png'), Buffer.from(designDataUrl.split(',')[1], 'base64'));
console.log('✅ front-of-pack design rendered -> _vis/_design.png');

const designPng = designDataUrl.split(',')[1];
const formats = ['pouch-lifestyle', 'pouch-front-back', 'pouch-isometric', 'jar-front', 'box-isometric'];

for (const id of formats) {
  const r = await page.evaluate(async ({ id, designPng }) => {
    const res = await fetch('/api/mockup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mockupId: id, designPng, userPrompt: '' }),
    });
    const j = await res.json();
    return { status: res.status, image: j.image || null, err: j.error || null };
  }, { id, designPng });
  if (r.image) {
    fs.writeFileSync(path.join(OUT, `${id}.png`), Buffer.from(r.image.split(',')[1], 'base64'));
    console.log(`✅ ${id} -> _vis/${id}.png`);
  } else {
    console.log(`❌ ${id} status=${r.status} err=${r.err}`);
  }
}

await browser.close();
console.log('Done.');
