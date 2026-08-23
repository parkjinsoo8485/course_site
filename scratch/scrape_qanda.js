import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// 쿠키 파일 경로 (scratch/cookies.json)
const COOKIE_PATH = path.resolve('scratch/cookies.json');
const TARGET_BASE = 'https://www.dbdbschool.kr';
const TARGET_LIST_URL = 'https://www.dbdbschool.kr/af/qanda/lists/sn/3267';

async function scrapeQnaSystem() {
  console.log('🚀 Launching Playwright Chromium Headless/Headed...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  // 쿠키가 존재하면 컨텍스트에 주입
  if (fs.existsSync(COOKIE_PATH)) {
    try {
      const cookieData = JSON.parse(fs.readFileSync(COOKIE_PATH, 'utf8'));
      if (Array.isArray(cookieData)) {
        await context.addCookies(cookieData);
        console.log(`🍪 Successfully loaded ${cookieData.length} cookies from ${COOKIE_PATH}`);
      } else if (typeof cookieData === 'object') {
        const cookiesFormatted = Object.entries(cookieData).map(([name, value]) => ({
          name,
          value: String(value),
          domain: '.dbdbschool.kr',
          path: '/',
        }));
        await context.addCookies(cookiesFormatted);
        console.log(`🍪 Successfully formatted and loaded object cookies.`);
      }
    } catch (e) {
      console.warn('⚠️ Could not parse cookies.json:', e.message);
    }
  } else {
    console.log('ℹ️ No scratch/cookies.json found. Proceeding with public access or waiting for session injection.');
  }

  const page = await context.newPage();

  // 네트워크 요청/응답 리스너 (XHR / Fetch 감지)
  const networkLogs = [];
  page.on('response', async (res) => {
    const url = res.url();
    const status = res.status();
    const contentType = res.headers()['content-type'] || '';

    if (contentType.includes('application/json') || url.includes('/qanda') || url.includes('/api/')) {
      let bodyText = '';
      try {
        bodyText = await res.text();
      } catch (err) {}
      networkLogs.push({ url, status, contentType, bodyText: bodyText.slice(0, 500) });
      console.log(`📡 [Network Response] ${status} ${url}`);
    }
  });

  try {
    console.log(`🌐 Navigating to ${TARGET_LIST_URL}...`);
    const response = await page.goto(TARGET_LIST_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log(`📄 Page Loaded. Status: ${response ? response.status() : 'N/A'}`);

    // 현재 URL 확인 (로그인 페이지로 리다이렉트 되었는지 확인)
    const currentUrl = page.url();
    console.log(`📍 Current Page URL: ${currentUrl}`);

    // 스크린샷 저장
    await page.screenshot({ path: 'scratch/qanda_lists_screenshot.png', fullPage: true });

    // HTML DOM 및 핵심 데이터 추출
    const pageHtml = await page.content();
    fs.writeFileSync('scratch/qanda_lists_raw.html', pageHtml, 'utf8');

    // DOM 정보 분석
    const extractedData = await page.evaluate(() => {
      const title = document.title;
      const h1 = document.querySelector('h1')?.innerText || '';
      const tables = Array.from(document.querySelectorAll('table')).map(t => ({
        headers: Array.from(t.querySelectorAll('th')).map(th => th.innerText.trim()),
        rowCount: t.querySelectorAll('tbody tr').length,
        sampleRow: Array.from(t.querySelectorAll('tbody tr:first-child td')).map(td => td.innerText.trim())
      }));
      const buttons = Array.from(document.querySelectorAll('button, a.btn, input[type="button"], input[type="submit"]')).map(b => ({
        tag: b.tagName,
        text: (b.innerText || b.value || '').trim(),
        href: b.href || '',
        classes: b.className
      }));

      return { title, h1, tables, buttons, bodyClass: document.body.className };
    });

    console.log('📊 Extracted Summary:', JSON.stringify(extractedData, null, 2));

    fs.writeFileSync('scratch/qanda_analysis_report.json', JSON.stringify({
      currentUrl,
      isLoggedIn: !currentUrl.includes('/login'),
      extractedData,
      networkLogs
    }, null, 2), 'utf8');

    console.log('✅ Phase 1 initial capture completed! Results saved in scratch/');
  } catch (err) {
    console.error('❌ Error during scrape:', err);
  } finally {
    await browser.close();
  }
}

scrapeQnaSystem();
