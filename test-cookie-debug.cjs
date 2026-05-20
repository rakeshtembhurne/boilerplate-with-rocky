const { chromium } = require('@playwright/test');

async function debugCookie() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('=== Cookie Debug ===\n');

  try {
    // Login
    console.log('1. Login');
    await page.goto('http://localhost:3000/auth/sign-in', { waitUntil: 'networkidle' });
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'TestPass123!');
    await page.click('button:has-text("Sign In")');
    
    // Wait for dashboard
    await page.waitForURL('**/dashboard**', { timeout: 10000 }).catch(() => {});
    console.log('   URL:', page.url());
    
    // Check cookies
    const cookies = await page.context().cookies();
    console.log('   All cookies:');
    cookies.forEach(c => console.log(`     ${c.name}=${c.value.substring(0, 30)}...`));
    
    // Check if cookie is sent with request
    console.log('\n2. Check cookie in requests');
    const response = await page.evaluate(async () => {
      const res = await fetch('/api/auth/session', {
        credentials: 'include'
      });
      return {
        status: res.status,
        cookies: res.headers.get('set-cookie'),
        body: await res.text()
      };
    });
    console.log('   /api/auth/session response:', JSON.stringify(response));
    
    // Navigate and check cookies sent
    console.log('\n3. Navigate to homepage');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    
    // Check request headers for dashboard
    console.log('\n4. Check cookies sent to dashboard');
    await page.route('**/dashboard**', async route => {
      const request = route.request();
      const cookies = request.headers()['cookie'];
      console.log('   Cookie header:', cookies?.substring(0, 100) || 'NONE');
      await route.continue();
    });
    
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
    console.log('   Final URL:', page.url());
    
  } catch (err) {
    console.error('Error:', err.message);
  }
  
  await page.waitForTimeout(60000);
  await browser.close();
}

debugCookie().catch(console.error);
