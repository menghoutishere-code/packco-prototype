import { chromium } from 'playwright';
import path from 'path';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
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

  console.log('Image dimensions check:');
  for (const img of images) {
    const url = `https://prototype-app-pearl.vercel.app/mockup/${img}`;
    await page.goto(url);
    const dims = await page.evaluate(() => {
      const imgEl = document.querySelector('img');
      if (imgEl) {
        return { w: imgEl.naturalWidth, h: imgEl.naturalHeight };
      }
      return null;
    });
    console.log(`${img}: ${dims ? `${dims.w}x${dims.h}` : 'failed to load'}`);
  }

  await browser.close();
}

run().catch(console.error);
