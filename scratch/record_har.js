const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const COOKIE_PATH = path.resolve(__dirname, 'cookies.json');
const HAR_PATH = path.resolve(__dirname, 'network.har');
const TARGET_URL = 'https://www.dbdbschool.kr/af/ad_app/lists/sn/3267';

async function recordHar() {
  console.log('🚀 Starting HAR recording with Playwright (headless: false)...');
  console.log(`🎯 Target URL: ${TARGET_URL}`);
  console.log(`💾 Output HAR: ${HAR_PATH}`);

  const browser = await chromium.launch({
    headless: false
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    recordHar: {
      path: HAR_PATH,
      content: 'embed',
      mode: 'full'
    }
  });

  if (fs.existsSync(COOKIE_PATH)) {
    try {
      const cookies = JSON.parse(fs.readFileSync(COOKIE_PATH, 'utf8'));
      await context.addCookies(cookies);
      console.log(`🍪 Loaded ${cookies.length} cookies from ${COOKIE_PATH}`);
    } catch (err) {
      console.warn('⚠️ Failed to load cookies:', err.message);
    }
  }

  const page = await context.newPage();

  console.log('🌐 Navigating to target page...');
  try {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 45000 });
  } catch (e) {
    console.log(`⚠️ Navigation note: ${e.message}, continuing...`);
  }

  // Wait for rendering and any asynchronous API requests
  console.log('⏳ Waiting for full DOM rendering and API traffic...');
  await page.waitForTimeout(5000);

  // Optional: trigger interactions if available to capture dynamic states
  try {
    const isSearchBoxVisible = await page.isVisible('.search_box, #search_form, .btn_search, table');
    console.log(`📊 Page elements detected: ${isSearchBoxVisible ? 'YES' : 'NO'}`);
  } catch (_) {}

  await page.waitForTimeout(3000);

  console.log('📦 Finalizing HAR recording...');
  await context.close();
  await browser.close();

  if (fs.existsSync(HAR_PATH)) {
    const stats = fs.statSync(HAR_PATH);
    console.log(`✅ HAR recorded successfully! File size: ${(stats.size / 1024).toFixed(2)} KB`);
  } else {
    console.error('❌ HAR file was not created.');
  }
}

recordHar().catch((err) => {
  console.error('❌ Fatal error recording HAR:', err);
  process.exit(1);
});
