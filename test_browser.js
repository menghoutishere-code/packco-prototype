import { chromium } from 'playwright';
import path from 'path';

async function run() {
  const artifactDir = 'C:/Users/Admin/.gemini/antigravity/brain/a4b108ed-33d9-4d8f-8537-c5bcb17ebe7b';
  
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  
  page.on('console', msg => {
    console.log(`PAGE LOG [${msg.type()}]:`, msg.text());
  });
  page.on('pageerror', err => {
    console.error('PAGE ERROR:', err.message);
  });

  console.log('Navigating to live vercel app...');
  await page.goto('https://prototype-app-pearl.vercel.app');
  await page.waitForTimeout(2000);

  console.log('Entering demo...');
  const launchBtn = page.locator('text=Launch Operational Demo');
  if (await launchBtn.count() > 0) {
    await launchBtn.click();
  } else {
    await page.locator('text=Enter Demo').first().click();
  }
  await page.waitForTimeout(1000);

  console.log('Logging in...');
  await page.locator('input[type="text"]').fill('admin');
  await page.locator('input[type="password"]').fill('packco2026');
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(3000);

  console.log('Taking screenshot 1: Dashboard (Label Studio)...');
  await page.screenshot({ path: path.join(artifactDir, '1_dashboard.png') });

  console.log('Navigating to Brand Logo Studio...');
  await page.locator('button:has-text("BRAND LOGO STUDIO")').click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(artifactDir, '2_brand_logo_studio.png') });

  console.log('Generating AI logo...');
  await page.locator('button:has-text("AI Generate Logo")').click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(artifactDir, '3_generated_logo.png') });

  console.log('Applying logo to label...');
  await page.locator('button:has-text("Apply Logo to Active Label")').click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(artifactDir, '4_applied_logo.png') });

  console.log('Navigating to 3D Mockup Studio...');
  await page.locator('button:has-text("3D MOCKUP STUDIO")').click();
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(artifactDir, '5_3d_mockup_studio.png') });

  console.log('Closing browser...');
  await browser.close();
  console.log('Browser test run successfully completed!');
}

run().catch(err => {
  console.error('Browser test failed:', err);
  process.exit(1);
});
