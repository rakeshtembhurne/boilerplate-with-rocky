const { chromium } = require('@playwright/test');

async function debugSession() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('=== Session Debug ===\n');

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
    
    // Now go to homepage
    console.log('\n2. Navigate to Homepage');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Get full navbar content
    const header = await page.locator('header').first();
    const headerHtml = await header.innerHTML();
    console.log('   Header HTML length:', headerHtml.length);
    console.log('   Header contains Dashboard:', headerHtml.includes('Dashboard'));
    console.log('   Header contains Sign In:', headerHtml.includes('Sign In'));
    
    // Find the sign-in related links
    const allLinks = await page.locator('header a').all();
    console.log('   Header links count:', allLinks.length);
    for (const link of allLinks) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      const visible = await link.isVisible();
      console.log(`   - "${text?.trim()}" -> ${href} (visible: ${visible})`);
    }
    
    // Check what's visible
    const visibleSignIn = await page.locator('a:has-text("Sign In")').first().isVisible().catch(() => false);
    const visibleDash = await page.locator('a:has-text("Dashboard")').first().isVisible().catch(() => false);
    console.log('   "Sign In" visible:', visibleSignIn);
    console.log('   "Dashboard" visible:', visibleDash);
    
    await page.screenshot({ path: '/tmp/session-debug.png', fullPage: true });
    
  } catch (err) {
    console.error('Error:', err.message);
    await page.screenshot({ path: '/tmp/session-error.png' });
  }
  
  await page.waitForTimeout(60000);
  await browser.close();
}

debugSession().catch(console.error);
