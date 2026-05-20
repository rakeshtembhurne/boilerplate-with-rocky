const { chromium } = require('@playwright/test');

async function testCorrected() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('=== Corrected Auth Flow Test ===\n');

  try {
    // 1. Homepage (not logged in)
    console.log('1. Homepage (not logged in)');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const signInVisible = await page.locator('header a:has-text("Sign In")').first().isVisible().catch(() => false);
    console.log('   Sign In visible:', signInVisible);
    await page.screenshot({ path: '/tmp/corrected-1-home.png' });
    
    // 2. Login
    console.log('\n2. Login');
    await page.goto('http://localhost:3000/auth/sign-in', { waitUntil: 'networkidle' });
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'TestPass123!');
    await page.click('button:has-text("Sign In")');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard**', { timeout: 10000 }).catch(() => {});
    console.log('   URL:', page.url());
    await page.screenshot({ path: '/tmp/corrected-2-dashboard.png' });
    
    // 3. Homepage (logged in)
    console.log('\n3. Homepage (logged in)');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const dashboardInHeader = await page.locator('header a:has-text("Dashboard")').first().isVisible().catch(() => false);
    console.log('   Dashboard in header:', dashboardInHeader);
    await page.screenshot({ path: '/tmp/corrected-3-home-loggedin.png' });
    
    // 4. Click Dashboard
    console.log('\n4. Click Dashboard');
    await page.locator('header a:has-text("Dashboard")').click();
    await page.waitForTimeout(3000);
    console.log('   URL:', page.url());
    await page.screenshot({ path: '/tmp/corrected-4-dashboard-click.png' });
    
    // 5. Verify dashboard loaded
    if (page.url().includes('dashboard')) {
      console.log('   ✓ Dashboard page loaded!');
    } else {
      console.log('   ✗ Failed to load dashboard');
    }
    
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    await page.screenshot({ path: '/tmp/corrected-error.png' });
  }
  
  console.log('\n✅ Test complete!');
  await page.waitForTimeout(60000);
  await browser.close();
}

testCorrected().catch(console.error);
