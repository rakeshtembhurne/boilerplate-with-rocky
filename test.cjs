const { chromium } = require('@playwright/test');

async function test() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  const responses = [];
  
  page.on('console', msg => { 
    if (msg.type() === 'error') errors.push(msg.text()); 
  });
  page.on('response', r => {
    if (r.url().includes('/api/')) responses.push({ url: r.url(), status: r.status() });
  });
  
  try {
    console.log('1. Loading Create page...');
    await page.goto('http://localhost:3000/create', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/test-1-create.png' });
    
    console.log('2. Filling prompt...');
    const input = page.locator('input').first();
    await input.fill('A modern tech startup building AI tools');
    await page.screenshot({ path: '/tmp/test-2-filled.png' });
    
    console.log('3. Clicking Generate...');
    await page.locator('button:has-text("Generate")').click();
    
    // Wait for API response
    await page.waitForTimeout(10000);
    await page.screenshot({ path: '/tmp/test-3-result.png' });
    
    console.log('\n=== API Responses ===');
    responses.forEach(r => console.log(`${r.status}: ${r.url}`));
    
    console.log('\n=== Console Errors ===');
    errors.forEach(e => console.log(e.substring(0, 200)));
    
    // Check if logos appeared
    const images = await page.locator('img').all();
    console.log(`\n=== Images on page: ${images.length} ===`);
    
  } catch (err) {
    console.error('Error:', err.message);
    await page.screenshot({ path: '/tmp/test-error.png' });
  }
  
  await page.waitForTimeout(60000);
  await browser.close();
}

test().catch(console.error);
