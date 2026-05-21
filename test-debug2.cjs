const { chromium } = require('@playwright/test');

async function debug() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Loading auth/sign-in...');
  await page.goto('http://localhost:3000/auth/sign-in', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(8000);
  
  console.log('\nURL:', page.url());
  console.log('Title:', await page.title());
  
  const html = await page.content();
  console.log('\nHTML length:', html.length);
  console.log('Has SignInForm:', html.includes('SignInForm'));
  console.log('Has email input:', html.includes('id="email"'));
  console.log('Has form:', html.includes('<form'));
  
  // Check what elements are visible
  const inputs = await page.locator('input').all();
  console.log('\nInput count:', inputs.length);
  for (const inp of inputs) {
    const id = await inp.getAttribute('id');
    const type = await inp.getAttribute('type');
    console.log('  - id:', id, 'type:', type);
  }
  
  const buttons = await page.locator('button').all();
  console.log('\nButton count:', buttons.length);
  for (const btn of buttons) {
    const text = await btn.textContent();
    console.log('  -', text?.trim().substring(0, 30));
  }
  
  await page.screenshot({ path: '/tmp/debug-signin.png', fullPage: true });
  console.log('\nScreenshot: /tmp/debug-signin.png');
  
  await page.waitForTimeout(60000);
  await browser.close();
}

debug().catch(console.error);
