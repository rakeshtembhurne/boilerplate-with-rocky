const { chromium } = require('@playwright/test');

async function testCookie() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('=== Cookie Test ===\n');

  try {
    // Login
    console.log('1. Login');
    await page.goto('http://localhost:3000/auth/sign-in', { waitUntil: 'networkidle' });
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'TestPass123!');
    await page.click('button:has-text("Sign In")');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard**', { timeout: 10000 }).catch(() => {});
    console.log('   URL:', page.url());
    
    // Check localStorage
    const localStorage = await page.evaluate(() => {
      return window.localStorage.getItem('brandsome_session');
    });
    console.log('   localStorage:', localStorage ? 'SET' : 'NOT SET');
    
    // Check cookies
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(c => c.name === 'brandsome_session');
    console.log('   Cookie:', sessionCookie ? `SET (${sessionCookie.value.substring(0, 30)}...)` : 'NOT SET');
    
    // Go to homepage
    console.log('\n2. Navigate to Homepage');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Check localStorage again
    const localStorage2 = await page.evaluate(() => {
      return window.localStorage.getItem('brandsome_session');
    });
    console.log('   localStorage:', localStorage2 ? 'SET' : 'NOT SET');
    
    // Check cookies again
    const cookies2 = await page.context().cookies();
    const sessionCookie2 = cookies2.find(c => c.name === 'brandsome_session');
    console.log('   Cookie:', sessionCookie2 ? 'SET' : 'NOT SET');
    
    // Take screenshot
    await page.screenshot({ path: '/tmp/cookie-test.png', fullPage: true });
    
  } catch (err) {
    console.error('Error:', err.message);
  }
  
  await page.waitForTimeout(60000);
  await browser.close();
}

testCookie().catch(console.error);
