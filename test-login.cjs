const { chromium } = require('@playwright/test');

async function testLogin() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('=== Testing Sign In ===\n');

  try {
    // Go to sign in page
    console.log('1. Loading sign-in page...');
    await page.goto('http://localhost:3000/auth/sign-in', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000); // Wait for React hydration
    await page.screenshot({ path: '/tmp/signin-1.png' });
    
    // Check for form
    const emailInput = page.locator('#email');
    const passwordInput = page.locator('#password');
    
    if (await emailInput.isVisible()) {
      console.log('✓ Form visible');
      
      // Fill credentials
      await emailInput.fill('test@example.com');
      await passwordInput.fill('TestPass123!');
      console.log('✓ Filled credentials');
      
      await page.screenshot({ path: '/tmp/signin-2-filled.png' });
      
      // Click sign in
      await page.locator('button:has-text("Sign In")').click();
      console.log('✓ Clicked Sign In');
      
      await page.waitForTimeout(3000);
      console.log('   URL:', page.url());
      await page.screenshot({ path: '/tmp/signin-3-after.png' });
      
      // Check for success/toast
      const url = page.url();
      if (url.includes('dashboard') || url === 'http://localhost:3000/') {
        console.log('✓ Login successful!');
      } else {
        console.log('⚠ URL:', url);
      }
    } else {
      console.log('✗ Form not visible');
      // Try waiting for it
      try {
        await page.waitForSelector('#email', { timeout: 10000 });
        console.log('✓ Form appeared after wait');
        
        await emailInput.fill('test@example.com');
        await passwordInput.fill('TestPass123!');
        await page.locator('button:has-text("Sign In")').click();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: '/tmp/signin-2-filled.png' });
      } catch (e) {
        console.log('Form never appeared');
      }
    }
    
    // Test sign up
    console.log('\n=== Testing Sign Up ===\n');
    await page.goto('http://localhost:3000/auth/sign-up', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: '/tmp/signup-1.png' });
    
    const nameInput = page.locator('#name');
    const signupEmail = page.locator('#email');
    const signupPassword = page.locator('#password');
    
    if (await nameInput.isVisible()) {
      console.log('✓ Sign up form visible');
      await nameInput.fill('New User');
      await signupEmail.fill('newuser@test.com');
      await signupPassword.fill('NewPass123!');
      console.log('✓ Filled form');
      
      await page.screenshot({ path: '/tmp/signup-2-filled.png' });
      
      await page.locator('button:has-text("Create Account")').click();
      console.log('✓ Clicked Create Account');
      
      await page.waitForTimeout(3000);
      console.log('   URL:', page.url());
      await page.screenshot({ path: '/tmp/signup-3-after.png' });
    } else {
      console.log('✗ Sign up form not visible');
    }
    
    // Test homepage
    console.log('\n=== Testing Homepage ===\n');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/home-1.png' });
    
    console.log('✓ Homepage loaded');
    
  } catch (err) {
    console.error('Error:', err.message);
    await page.screenshot({ path: '/tmp/error.png' });
  }
  
  console.log('\n⏸️  Browser open for 60s...');
  await page.waitForTimeout(60000);
  await browser.close();
}

testLogin().catch(console.error);
