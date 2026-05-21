const { chromium } = require('@playwright/test');

async function testAll() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const pages = [
    { url: '/', name: 'Homepage' },
    { url: '/create', name: 'Create Logo' },
    { url: '/pricing', name: 'Pricing' },
    { url: '/auth/sign-up', name: 'Sign Up' },
    { url: '/auth/sign-in', name: 'Sign In' },
  ];
  
  console.log('=== BrandSome Page Tests ===\n');
  
  for (const p of pages) {
    try {
      await page.goto(`http://localhost:3000${p.url}`, { waitUntil: 'networkidle', timeout: 15000 });
      const status = await page.evaluate(() => document.readyState);
      const errors = [];
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      console.log(`✓ ${p.name}: ${status}`);
    } catch (err) {
      console.log(`✗ ${p.name}: ${err.message}`);
    }
  }
  
  // Test logo generation flow
  console.log('\n=== Logo Generation Test ===\n');
  
  await page.goto('http://localhost:3000/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Fill prompt
  await page.locator('input').first().fill('Tech startup AI company');
  console.log('✓ Filled prompt');
  
  // Click generate
  await page.locator('button:has-text("Generate")').click();
  await page.waitForTimeout(3000);
  
  // Check images
  const imgCount = await page.locator('img').count();
  console.log(`✓ Generated logos: ${imgCount} images`);
  
  // Take final screenshot
  await page.screenshot({ path: '/tmp/test-final.png', fullPage: true });
  console.log('✓ Screenshot saved to /tmp/test-final.png');
  
  console.log('\n=== All Tests Complete ===');
  
  await page.waitForTimeout(30000);
  await browser.close();
}

testAll().catch(console.error);
