import { chromium } from 'playwright';
import path from 'path';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const artifactDir = 'C:/Users/Admin/.gemini/antigravity/brain/a4b108ed-33d9-4d8f-8537-c5bcb17ebe7b';

  const images = [
    'pouch-front-back-blank.jpg',
    'pouch-isometric-blank.jpg',
    'pouch-lifestyle-blank.jpg',
    'jar-front-blank.jpg',
    'jar-lifestyle-blank.jpg',
    'box-isometric-blank.jpg',
    'box-lifestyle-blank.jpg',
    'tube-front-blank.jpg',
    'tub-front-blank.jpg'
  ];

  for (const img of images) {
    const url = `https://prototype-app-pearl.vercel.app/mockup/${img}`;
    await page.goto(url);
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const imgEl = document.querySelector('img');
      if (!imgEl) return;

      const canvas = document.createElement('canvas');
      canvas.width = imgEl.naturalWidth;
      canvas.height = imgEl.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgEl, 0, 0);

      const w = canvas.width;
      const h = canvas.height;

      // Draw horizontal grid lines
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.lineWidth = 1;
      ctx.fillStyle = 'red';
      ctx.font = '12px Arial';

      for (let y = 50; y < h; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
        ctx.fillText(y.toString(), 10, y - 2);
      }

      // Draw vertical grid lines
      for (let x = 50; x < w; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
        ctx.fillText(x.toString(), x + 2, 15);
      }

      // Replace document body with canvas
      document.body.innerHTML = '';
      document.body.appendChild(canvas);
      document.body.style.margin = '0';
      document.body.style.padding = '0';
    });

    const outName = `grid_${img.replace('-blank.jpg', '')}.png`;
    await page.screenshot({ path: path.join(artifactDir, outName) });
    console.log(`Saved grid overlay for ${img} as ${outName}`);
  }

  await browser.close();
}

run().catch(console.error);
