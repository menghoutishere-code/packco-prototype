// Screenshot each label template from the running dev server for visual review.
// Run: node scripts/_labelshots.mjs [port]
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
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });

// Bypass the login gate (App just checks localStorage for a token).
await page.addInitScript(() => localStorage.setItem('packco-token', 'visualtest'));
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

const templates = ['✨ Modern Minimal', '🔥 Vibrant Market', '🍊 Pouch Label', '🌾 Premium Kraft', '📜 Back Panel'];
const slugs = ['label-modern', 'label-vibrant', 'label-pouch', 'label-kraft', 'label-panel'];

for (let i = 0; i < templates.length; i++) {
  await page.getByText(templates[i], { exact: false }).first().click();
  await page.waitForTimeout(700); // allow barcode + render
  const el = page.locator('.label-print-container').first();
  await el.screenshot({ path: path.join(OUT, `${slugs[i]}.png`) });
  console.log(`✅ ${slugs[i]}.png`);
}

await browser.close();
console.log('Done.');
