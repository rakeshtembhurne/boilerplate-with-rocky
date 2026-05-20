const { chromium } = require('@playwright/test');

async function e2eTest() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  
  const errors = [];
  page.on('pageerror', err => errors.push(`PAGE ERROR: ${err.message}`));
  page.on('console', msg => { 
    if (msg.type() === 'error') errors.push(`CONSOLE ERROR: ${msg.text()}`);
  });
  
  console.log('=== BrandSome E2E Test ===\n');

  try {
    // 1. Homepage - Click Get Started
    console.log('1. Testing Homepage...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/e2e-1-home.png' });
    
    // Find and click "Get Started" button
    const getStartedBtn = page.locator('a:has-text("Get Started"), button:has-text("Get Started")').first();
    if (await getStartedBtn.isVisible()) {
      await getStartedBtn.click();
      await page.waitForTimeout(2000);
      console.log('   ✓ Clicked Get Started');
      await page.screenshot({ path: '/tmp/e2e-1b-after-click.png' });
    } else {
      console.log('   ⚠ No Get Started button found');
    }
    
    // 2. Create Page - Fill form and generate
    console.log('\n2. Testing Create Page...');
    console.log('   URL:', page.url());
    await page.waitForTimeout(1000);
    
    // Check if we need to sign in
    const signInPrompt = await page.locator('text=/sign in|log in/i').count();
    if (signInPrompt > 0) {
      console.log('   ⚠ Sign in required - clicking Sign In link');
      await page.locator('a:has-text("Sign In"), a:has-text("Log In")').first().click();
      await page.waitForTimeout(2000);
      console.log('   URL:', page.url());
    }
    
    // If on create page, try to generate logo
    if (page.url().includes('create')) {
      const input = page.locator('input[placeholder*="does" i], input[placeholder*="brand" i]').first();
      if (await input.isVisible({ timeout: 3000 }).catch(() => false)) {
        await input.fill('A modern tech startup building AI tools');
        console.log('   ✓ Filled prompt');
        
        const genBtn = page.locator('button:has-text("Generate")');
        if (await genBtn.isEnabled({ timeout: 2000 }).catch(() => false)) {
          await genBtn.click();
          await page.waitForTimeout(3000);
          console.log('   ✓ Clicked Generate');
          await page.screenshot({ path: '/tmp/e2e-2-create-result.png' });
        }
      }
    }
    
    // 3. Sign In Page - Fill and submit
    console.log('\n3. Testing Sign In Page...');
    await page.goto('http://localhost:3000/auth/sign-in', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/e2e-3-signin.png' });
    
    // Check for form fields
    const emailField = page.locator('#email, input[type="email"], input[placeholder*="email" i]').first();
    const passwordField = page.locator('#password, input[type="password"]').first();
    
    if (await emailField.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('   ✓ Email field found');
      await emailField.fill('test@example.com');
      await passwordField.fill('TestPassword123!');
      console.log('   ✓ Filled credentials');
      
      await page.screenshot({ path: '/tmp/e2e-3b-filled.png' });
      
      // Submit
      const submitBtn = page.locator('button:has-text("Sign In"), button:has-text("Log In"), button:has-text("Continue")').first();
      await submitBtn.click();
      await page.waitForTimeout(3000);
      
      console.log('   URL after submit:', page.url());
      await page.screenshot({ path: '/tmp/e2e-3c-after-submit.png' });
    } else {
      console.log('   ✗ Email field NOT found');
      console.log('   Page content:', (await page.textContent('body'))?.substring(0, 300));
    }
    
    // 4. Sign Up Page - Fill and submit
    console.log('\n4. Testing Sign Up Page...');
    await page.goto('http://localhost:3000/auth/sign-up', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/e2e-4-signup.png' });
    
    const nameField = page.locator('#name, input[placeholder*="name" i]').first();
    const signupEmailField = page.locator('#email, input[type="email"]').first();
    const signupPasswordField = page.locator('#password, input[type="password"]').first();
    
    if (await signupEmailField.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('   ✓ Form fields found');
      if (await nameField.isVisible({ timeout: 1000 }).catch(() => false)) {
        await nameField.fill('Test User');
      }
      await signupEmailField.fill('newuser@example.com');
      await signupPasswordField.fill('NewPassword123!');
      console.log('   ✓ Filled form');
      
      await page.screenshot({ path: '/tmp/e2e-4b-filled.png' });
      
      // Submit
      const submitBtn = page.locator('button:has-text("Create Account"), button:has-text("Sign Up"), button:has-text("Continue")').first();
      await submitBtn.click();
      await page.waitForTimeout(3000);
      
      console.log('   URL after submit:', page.url());
      await page.screenshot({ path: '/tmp/e2e-4c-after-submit.png' });
    } else {
      console.log('   ✗ Form NOT visible');
    }
    
    // 5. Pricing Page - Check buttons
    console.log('\n5. Testing Pricing Page...');
    await page.goto('http://localhost:3000/pricing', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/e2e-5-pricing.png' });
    
    const upgradeBtn = page.locator('button:has-text("Get Started"), button:has-text("Upgrade"), button:has-text("Choose")').first();
    if (await upgradeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await upgradeBtn.click();
      await page.waitForTimeout(2000);
      console.log('   ✓ Clicked upgrade button');
      await page.screenshot({ path: '/tmp/e2e-5b-after-upgrade.png' });
    }
    
    // 6. Create Page - Final test with prompt
    console.log('\n6. Final Create Page Test...');
    await page.goto('http://localhost:3000/create', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/e2e-6-create-final.png' });
    
    // Report errors
    console.log('\n=== Errors Found ===');
    if (errors.length === 0) {
      console.log('No errors!');
    } else {
      errors.forEach(e => console.log(e.substring(0, 150)));
    }
    
    console.log('\n=== Screenshots ===');
    console.log('/tmp/e2e-*.png');
    
  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
    await page.screenshot({ path: '/tmp/e2e-error.png' });
  }
  
  console.log('\n⏸️  Browser open for 60s...');
  await page.waitForTimeout(60000);
  await browser.close();
}

e2eTest().catch(console.error);
