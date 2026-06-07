// Pre-bake "hero" marketing mockups as STAGE INSURANCE.
// MockupStudio shows /hero/<packageType>.jpg if the live /api/mockup call fails or
// the network dies during the pitch — so the demo never visibly breaks.
//
// Run:  $env:GEMINI_API_KEY="..."; node scripts/build-heroes.mjs
// Optional: $env:GEMINI_IMAGE_MODEL="gemini-3-pro-image"  (higher quality for slides)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');           // Unipreneur/
const APP = path.resolve(__dirname, '..');                  // prototype-app/
const OUT_DIR = path.join(APP, 'public', 'hero');

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error('No GEMINI_API_KEY in env'); process.exit(1); }
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image';

const b64 = p => fs.readFileSync(p).toString('base64');
const BLANKS = path.join(APP, 'public', 'mockup');
// Brand mark used as the design seed for the hero label.
const EMBLEM = path.join(ROOT, 'pictures-templates', 'logo', 'Mango-emblem-seals.jpg');

// One hero per packageType that MockupStudio can fall back to.
const HEROES = [
  { type: 'pouch', blank: 'pouch-lifestyle-blank.jpg' },
  { type: 'jar', blank: 'jar-lifestyle-blank.jpg' },
  { type: 'box', blank: 'box-lifestyle-blank.jpg' },
];

const PROMPT = `You are a professional product packaging photographer.
Image 1 is a blank, unlabeled package on a surface with real-world lighting.
Image 2 is a mango brand emblem.
Design and print a premium retail food label onto the front panel of the package in image 1, using
the emblem from image 2 as the brand mark. The label must include the product name "Dried Spicy Mango"
in English with the Khmer "ស្វាយសម្ងួតហឹរ" below it, and a small "Net 100g" line.
Wrap the label naturally onto the package surface following its shape, curvature, and any clear window.
Match the existing warm lighting, soft shadows, and material texture of image 1. Keep all text sharp
and legible. Do not change the background, surface, or props. Output one photorealistic product photograph.`;

async function bake({ type, blank }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [
        { text: PROMPT },
        { inlineData: { mimeType: 'image/jpeg', data: b64(path.join(BLANKS, blank)) } },
        { inlineData: { mimeType: 'image/jpeg', data: b64(EMBLEM) } },
      ]}],
      generationConfig: { responseModalities: ['IMAGE'] },
    }),
  });
  const txt = await r.text();
  if (!r.ok) { console.log(`  ❌ ${type} [${MODEL}] HTTP ${r.status}: ${txt.slice(0, 300)}`); return false; }
  const data = JSON.parse(txt);
  const part = (data?.candidates?.[0]?.content?.parts || []).find(p => p.inlineData || p.inline_data);
  if (!part) { console.log(`  ⚠️ ${type} no image. finish=${data?.candidates?.[0]?.finishReason}`); return false; }
  const buf = Buffer.from((part.inlineData || part.inline_data).data, 'base64');
  fs.writeFileSync(path.join(OUT_DIR, `${type}.jpg`), buf);
  console.log(`  ✅ ${type}.jpg  ${Math.round(buf.length / 1024)}KB`);
  return true;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
console.log(`Baking heroes with ${MODEL} -> ${OUT_DIR}`);
for (const h of HEROES) await bake(h);
console.log('Done.');
