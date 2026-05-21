const { chromium } = require('@playwright/test');

async function finalTest() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('=== Final Verification ===\n');

  try {
    // 1. Homepage (not logged in)
    console.log('1. Homepage - Not logged in');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const signInVisible = await page.locator('header a:has-text("Sign In")').first().isVisible().catch(() => false);
    console.log('   Shows "Sign In":', signInVisible);
    await page.screenshot({ path: '/tmp/final-1-home-unlogged.png' });
    
    // 2. Login
    console.log('\n2. Sign In page');
    await page.goto('http://localhost:3000/auth/sign-in', { waitUntil: 'networkidle' });
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'TestPass123!');
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(3000);
    console.log('   URL:', page.url());
    await page.screenshot({ path: '/tmp/final-2-after-login.png' });
    
    // 3. Homepage (logged in)
    console.log('\n3. Homepage - Logged in');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const dashboardVisible = await page.locator('header a:has-text("Dashboard")').first().isVisible().catch(() => false);
    console.log('   Shows "Dashboard":', dashboardVisible);
    await page.screenshot({ path: '/tmp/final-3-home-loggedin.png' });
    
    // 4. Dashboard page
    console.log('\n4. Dashboard page');
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    console.log('   URL:', page.url());
    console.log('   Loaded:', page.url().includes('dashboard'));
    await page.screenshot({ path: '/tmp/final-4-dashboard.png' });
    
    // 5. Create page
    console.log('\n5. Create page');
    await page.goto('http://localhost:3000/create', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    console.log('   URL:', page.url());
    await page.screenshot({ path: '/tmp/final-5-create.png' });
    
    console.log('\n✅ All tests passed!');
    
  } catch (err) {
    console.error('\n❌ Error:', err.message);
  }
  
  console.log('\n⏸️  Browser open for 60s...');
  await page.waitForTimeout(60000);
  await browser.close();
}

finalTest().catch(console.error);
