const { chromium } = require('@playwright/test');

async function testFullFlow() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('=== Full Auth Flow Test ===\n');

  try {
    // 1. Go to homepage
    console.log('1. Homepage');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/flow-1-home.png' });
    
    // 2. Click Sign In button in navbar (use the header one)
    console.log('\n2. Click Sign In');
    const signInLinks = await page.locator('a[href*="sign-in"]').all();
    console.log('   Found', signInLinks.length, 'sign-in links');
    
    // Click the one in the header (first one visible)
    await page.locator('header a[href*="sign-in"]').first().click();
    await page.waitForTimeout(3000);
    console.log('   URL:', page.url());
    await page.screenshot({ path: '/tmp/flow-2-signin.png' });
    
    // 3. Fill and submit login form
    console.log('\n3. Login with test credentials');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'TestPass123!');
    await page.click('button:has-text("Sign In")');
    
    console.log('   Waiting for redirect...');
    await page.waitForTimeout(5000);
    console.log('   URL:', page.url());
    await page.screenshot({ path: '/tmp/flow-3-after-login.png' });
    
    // 4. Check if on dashboard
    if (page.url().includes('dashboard')) {
      console.log('   ✓ Redirected to dashboard!');
    } else {
      console.log('   ⚠ Still on:', page.url());
    }
    
    // 5. Go to homepage and check navbar
    console.log('\n4. Back to Homepage');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/tmp/flow-4-home-after-login.png' });
    
    console.log('   URL:', page.url());
    
    // Check for Dashboard button
    const dashboardBtn = await page.locator('a:has-text("Dashboard")').first();
    if (await dashboardBtn.isVisible()) {
      console.log('   ✓ Homepage shows "Dashboard" (logged in!)');
    } else {
      console.log('   ✗ Homepage shows "Sign In" (auth not persisting)');
    }
    
    // 6. Click Dashboard button
    console.log('\n5. Click Dashboard');
    await page.locator('a:has-text("Dashboard")').first().click();
    await page.waitForTimeout(3000);
    console.log('   URL:', page.url());
    await page.screenshot({ path: '/tmp/flow-5-dashboard.png' });
    
    if (page.url().includes('dashboard')) {
      console.log('   ✓ Dashboard page loaded!');
    } else {
      console.log('   ⚠ Did not reach dashboard:', page.url());
    }
    
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    await page.screenshot({ path: '/tmp/flow-error.png' });
  }
  
  console.log('\n⏸️  Browser open for 60s...');
  await page.waitForTimeout(60000);
  await browser.close();
}

testFullFlow().catch(console.error);
