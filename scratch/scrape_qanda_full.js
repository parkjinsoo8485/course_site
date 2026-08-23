import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const COOKIE_PATH = path.resolve('scratch/cookies.json');
const TARGET_LIST_URL = 'https://www.dbdbschool.kr/af/qanda/lists/sn/3267';

async function scrapeFullQna() {
  console.log('🚀 Launching Playwright Chromium...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  if (fs.existsSync(COOKIE_PATH)) {
    const cookieData = JSON.parse(fs.readFileSync(COOKIE_PATH, 'utf8'));
    await context.addCookies(cookieData);
    console.log(`🍪 Successfully loaded ${cookieData.length} cookies.`);
  }

  const page = await context.newPage();

  const networkRequests = [];
  page.on('response', async (res) => {
    const url = res.url();
    const status = res.status();
    const contentType = res.headers()['content-type'] || '';
    let body = '';
    try {
      body = await res.text();
    } catch (e) {}
    networkRequests.push({ url, status, contentType, bodyLength: body.length, sample: body.slice(0, 300) });
  });

  try {
    // 1. 목록 페이지 접근 (/af/qanda/lists/sn/3267)
    console.log(`\n========================================`);
    console.log(`🌐 1. Navigating to LIST page: ${TARGET_LIST_URL}`);
    const listRes = await page.goto(TARGET_LIST_URL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`📍 Current URL: ${page.url()}`);
    console.log(`📄 Status: ${listRes ? listRes.status() : 'N/A'}`);

    await page.screenshot({ path: 'scratch/qanda_list_page.png', fullPage: true });
    const listHtml = await page.content();
    fs.writeFileSync('scratch/qanda_list_page.html', listHtml, 'utf8');

    // 목록 페이지 DOM 심층 분석
    const listAnalysis = await page.evaluate(() => {
      const pageTitle = document.title;
      const mainHeader = document.querySelector('h1, .page-title, .title')?.innerText || '';
      
      // 테이블 구조 및 헤더 추출
      const tables = Array.from(document.querySelectorAll('table')).map(t => {
        const headers = Array.from(t.querySelectorAll('th')).map(th => ({
          text: th.innerText.trim(),
          classes: th.className,
          style: th.getAttribute('style') || '',
          width: th.getAttribute('width') || th.style.width || ''
        }));
        const rows = Array.from(t.querySelectorAll('tbody tr')).map(tr => {
          return Array.from(tr.querySelectorAll('td')).map(td => ({
            text: td.innerText.trim(),
            html: td.innerHTML.trim(),
            classes: td.className,
            style: td.getAttribute('style') || ''
          }));
        });
        return { headers, rowCount: rows.length, rows };
      });

      // 버튼 및 액션 링크 추출
      const actionButtons = Array.from(document.querySelectorAll('a, button, input[type="button"], input[type="submit"]')).map(el => ({
        tag: el.tagName,
        text: (el.innerText || el.value || '').trim(),
        href: el.href || '',
        classes: el.className,
        style: el.getAttribute('style') || ''
      })).filter(b => b.text.length > 0 || (b.href && (b.href.includes('write') || b.href.includes('view'))));

      // 필터 및 셀렉트 박스
      const filters = Array.from(document.querySelectorAll('select, input[type="text"]')).map(el => ({
        tag: el.tagName,
        id: el.id,
        name: el.name || '',
        placeholder: el.placeholder || '',
        options: el.tagName === 'SELECT' ? Array.from(el.options).map(o => ({ value: o.value, text: o.text })) : undefined
      }));

      return { pageTitle, mainHeader, tables, actionButtons, filters };
    });

    console.log(`📊 List Page Analysis Summary:`);
    console.log(`- Title: ${listAnalysis.pageTitle}`);
    console.log(`- Table Headers:`, listAnalysis.tables[0]?.headers.map(h => h.text));
    console.log(`- Table Rows Count:`, listAnalysis.tables[0]?.rowCount);
    console.log(`- Action Buttons Count:`, listAnalysis.actionButtons.length);

    // 2. 글쓰기 버튼 또는 URL 탐색 (/af/qanda/write/sn/3267)
    console.log(`\n========================================`);
    console.log(`🌐 2. Navigating to WRITE page...`);
    const writeUrl = 'https://www.dbdbschool.kr/af/qanda/write/sn/3267';
    await page.goto(writeUrl, { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`📍 Write URL: ${page.url()}`);
    await page.screenshot({ path: 'scratch/qanda_write_page.png', fullPage: true });
    const writeHtml = await page.content();
    fs.writeFileSync('scratch/qanda_write_page.html', writeHtml, 'utf8');

    const writeAnalysis = await page.evaluate(() => {
      const form = document.querySelector('form');
      const inputs = Array.from(document.querySelectorAll('input, select, textarea')).map(el => ({
        tag: el.tagName,
        type: el.type || '',
        name: el.name || '',
        id: el.id,
        placeholder: el.placeholder || '',
        required: el.required || false
      }));
      const tableStructure = Array.from(document.querySelectorAll('table tr')).map(tr => ({
        label: tr.querySelector('th, td:first-child')?.innerText?.trim() || '',
        contentHtml: tr.querySelector('td:last-child')?.innerHTML?.trim() || ''
      }));
      return { formAction: form?.action || '', formMethod: form?.method || '', inputs, tableStructure };
    });

    // 3. 상세 조회 페이지
    let viewAnalysis = null;
    const firstViewLink = listAnalysis.actionButtons.find(b => b.href && (b.href.includes('/view') || b.href.includes('view/sn/3267')));
    const targetViewUrl = firstViewLink ? firstViewLink.href : 'https://www.dbdbschool.kr/af/qanda/view/sn/3267/num/1';
    
    console.log(`\n========================================`);
    console.log(`🌐 3. Navigating to VIEW page: ${targetViewUrl}`);
    try {
      await page.goto(targetViewUrl, { waitUntil: 'networkidle', timeout: 15000 });
      console.log(`📍 View URL: ${page.url()}`);
      await page.screenshot({ path: 'scratch/qanda_view_page.png', fullPage: true });
      const viewHtml = await page.content();
      fs.writeFileSync('scratch/qanda_view_page.html', viewHtml, 'utf8');

      viewAnalysis = await page.evaluate(() => {
        const title = document.title;
        const details = Array.from(document.querySelectorAll('table tr')).map(tr => ({
          label: tr.querySelector('th, td:first-child')?.innerText?.trim() || '',
          value: tr.querySelector('td:last-child')?.innerText?.trim() || ''
        }));
        const replyBox = document.querySelector('.reply-box, textarea, .answer-area')?.innerHTML || '';
        return { title, details, hasReplyArea: !!replyBox };
      });
    } catch (e) {
      console.log(`ℹ️ View page direct navigation skipped: ${e.message}`);
    }

    // 종합 분석 리포트 저장
    const comprehensiveReport = {
      timestamp: new Date().toISOString(),
      listUrl: TARGET_LIST_URL,
      listAnalysis,
      writeAnalysis,
      viewAnalysis,
      networkRequests
    };

    fs.writeFileSync('scratch/qanda_comprehensive_report.json', JSON.stringify(comprehensiveReport, null, 2), 'utf8');
    console.log(`\n✅ Playwright Full DOM & Network Extraction Finished!`);
  } catch (err) {
    console.error('❌ Scrape execution error:', err);
  } finally {
    await browser.close();
  }
}

scrapeFullQna();
