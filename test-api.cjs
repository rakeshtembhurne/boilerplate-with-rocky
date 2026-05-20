const { chromium } = require('@playwright/test');

async function testAPI() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Go directly to create page
    console.log('Loading create page...');
    await page.goto('http://localhost:3000/create', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Fill prompt
    console.log('Filling prompt...');
    await page.locator('input').first().fill('A modern tech startup');
    
    // Intercept the API call
    const [response] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/logo/generate')),
      page.locator('button:has-text("Generate")').click()
    ]);
    
    const status = response.status();
    const body = await response.json();
    
    console.log('\n=== API Response ===');
    console.log('Status:', status);
    console.log('Success:', body.success);
    console.log('Logos count:', body.logos?.length);
    console.log('Error:', body.error);
    
    if (body.logos?.length > 0) {
      console.log('\nFirst logo:');
      console.log('  URL:', body.logos[0].imageUrl?.substring(0, 100) + '...');
      console.log('  Provider:', body.logos[0].provider);
    }
    
    // Check page state
    await page.waitForTimeout(2000);
    const imgCount = await page.locator('img').count();
    console.log('\nImages on page:', imgCount);
    
    await page.screenshot({ path: '/tmp/test-api-result.png' });
    
  } catch (err) {
    console.error('Error:', err.message);
  }
  
  await page.waitForTimeout(30000);
  await browser.close();
}

testAPI().catch(console.error);
