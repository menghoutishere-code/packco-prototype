import { chromium } from 'playwright';

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

  console.log('Analyzing mockup images bounding boxes...');

  for (const img of images) {
    const url = `https://prototype-app-pearl.vercel.app/mockup/${img}`;
    await page.goto(url);
    await page.waitForTimeout(500);

    const analysis = await page.evaluate(() => {
      const imgEl = document.querySelector('img');
      if (!imgEl) return null;

      const canvas = document.createElement('canvas');
      canvas.width = imgEl.naturalWidth;
      canvas.height = imgEl.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgEl, 0, 0);
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const w = canvas.width;
      const h = canvas.height;

      // The background is light gray. Let's sample the top-left pixel as the background color.
      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];

      const threshold = 15; // Difference threshold to detect package
      
      // Let's find columns and rows that contain non-background pixels
      const nonBgCols = new Array(w).fill(false);
      const nonBgRows = new Array(h).fill(false);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const r = data[idx];
          const g = data[idx+1];
          const b = data[idx+2];
          
          const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
          if (diff > threshold) {
            nonBgCols[x] = true;
            nonBgRows[y] = true;
          }
        }
      }

      // Find continuous segments of columns (representing packages)
      const segments = [];
      let inSegment = false;
      let start = 0;
      for (let x = 0; x < w; x++) {
        if (nonBgCols[x] && !inSegment) {
          start = x;
          inSegment = true;
        } else if (!nonBgCols[x] && inSegment) {
          if (x - start > 20) { // filter noise
            segments.push({ start, end: x - 1 });
          }
          inSegment = false;
        }
      }
      if (inSegment) {
        segments.push({ start, end: w - 1 });
      }

      // Find top and bottom bounds of the packages in each segment
      const packages = segments.map(seg => {
        let top = h;
        let bottom = 0;
        for (let y = 0; y < h; y++) {
          let hasPackagePixel = false;
          for (let x = seg.start; x <= seg.end; x++) {
            const idx = (y * w + x) * 4;
            const r = data[idx];
            const g = data[idx+1];
            const b = data[idx+2];
            const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
            if (diff > threshold) {
              hasPackagePixel = true;
              break;
            }
          }
          if (hasPackagePixel) {
            if (y < top) top = y;
            if (y > bottom) bottom = y;
          }
        }
        return { start: seg.start, end: seg.end, top, bottom };
      });

      return { w, h, packages };
    });

    console.log(`Image: ${img} (${analysis.w}x${analysis.h})`);
    if (analysis && analysis.packages.length > 0) {
      analysis.packages.forEach((pkg, index) => {
        console.log(`  Package ${index + 1}: x=[${pkg.start}, ${pkg.end}], y=[${pkg.top}, ${pkg.bottom}]`);
      });
    } else {
      console.log('  No packages detected');
    }
  }

  await browser.close();
}

run().catch(console.error);
