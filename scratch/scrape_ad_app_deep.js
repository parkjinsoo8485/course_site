import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const COOKIE_PATH = path.resolve('scratch/cookies.json');
const TARGET_URL = 'https://www.dbdbschool.kr/af/ad_app/lists/sn/3267';

async function scrapeAdAppDeep() {
  console.log('🚀 Launching Playwright to deeply inspect ad_app...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  if (fs.existsSync(COOKIE_PATH)) {
    const cookieData = JSON.parse(fs.readFileSync(COOKIE_PATH, 'utf8'));
    await context.addCookies(cookieData);
  }

  const page = await context.newPage();
  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });

  // 1. Analyze structure
  const pageData = await page.evaluate(() => {
    // Collect tabs, breadcrumb, buttons, table headers, rows, inputs, selects, scripts
    const title = document.title;
    const pageHeader = document.querySelector('h1, h2, h3, .title, .sub_title')?.innerText?.trim();
    const lnb = Array.from(document.querySelectorAll('.lnb a, .snb a, aside a, .left_menu a, #sidebar a')).map(a => ({
      text: a.innerText.trim(),
      href: a.href
    }));

    const tabs = Array.from(document.querySelectorAll('.tab a, .tabs a, .nav-tabs a, ul.tab li a, .sub_tab a')).map(a => ({
      text: a.innerText.trim(),
      href: a.href,
      active: a.classList.contains('active') || a.parentElement?.classList.contains('active') || a.parentElement?.classList.contains('on')
    }));

    const buttons = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], a.btn, a.button, .btn_area a, .btn, .btn-primary, .btn-default, .btn-success, .btn-danger, .btn-warning, .btn-info')).map(b => ({
      text: b.innerText?.trim() || b.value || '',
      id: b.id,
      className: b.className,
      onclick: b.getAttribute('onclick'),
      href: b.getAttribute('href'),
      tag: b.tagName
    }));

    const searchForm = Array.from(document.querySelectorAll('form, .search_box, .search_area, .search_wrap, .filter_box')).map(f => {
      const inputs = Array.from(f.querySelectorAll('input, select, textarea')).map(el => ({
        tagName: el.tagName,
        type: el.type,
        name: el.name,
        id: el.id,
        value: el.value,
        placeholder: el.placeholder,
        options: el.tagName === 'SELECT' ? Array.from(el.options).map(o => ({ text: o.text, value: o.value, selected: o.selected })) : undefined
      }));
      return {
        action: f.action,
        method: f.method,
        id: f.id,
        className: f.className,
        inputs
      };
    });

    const tables = Array.from(document.querySelectorAll('table')).map((t, idx) => {
      const headers = Array.from(t.querySelectorAll('th')).map(th => ({
        text: th.innerText.trim(),
        colspan: th.colSpan,
        rowspan: th.rowSpan
      }));
      const rows = Array.from(t.querySelectorAll('tbody tr')).slice(0, 10).map(tr => {
        return Array.from(tr.querySelectorAll('td')).map(td => ({
          text: td.innerText.trim(),
          html: td.innerHTML.trim().slice(0, 300),
          links: Array.from(td.querySelectorAll('a, button')).map(el => ({
            text: el.innerText.trim(),
            href: el.getAttribute('href'),
            onclick: el.getAttribute('onclick')
          }))
        }));
      });
      return {
        tableIndex: idx,
        className: t.className,
        id: t.id,
        headers,
        rowCount: t.querySelectorAll('tbody tr').length,
        sampleRows: rows
      };
    });

    const pagination = Array.from(document.querySelectorAll('.pagination a, .paginate a, .paging a, .page a')).map(a => ({
      text: a.innerText.trim(),
      href: a.href,
      onclick: a.getAttribute('onclick')
    }));

    return {
      title,
      pageHeader,
      lnb,
      tabs,
      buttons,
      searchForm,
      tables,
      pagination
    };
  });

  fs.writeFileSync('scratch/ad_app_structure.json', JSON.stringify(pageData, null, 2), 'utf8');
  console.log('Saved scratch/ad_app_structure.json');

  // Let's also check if there are links or buttons that open popups/subpages or modify pages
  // Let's inspect all unique links on this page
  const internalLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href], button[onclick]')).map(el => {
      return {
        text: el.innerText.trim(),
        href: el.getAttribute('href'),
        onclick: el.getAttribute('onclick'),
        tag: el.tagName
      };
    }).filter(x => (x.href && (x.href.includes('/af/') || x.href.includes('javascript:') || x.href.startsWith('#'))) || x.onclick);
  });

  fs.writeFileSync('scratch/ad_app_links.json', JSON.stringify(internalLinks, null, 2), 'utf8');
  console.log(`Found ${internalLinks.length} links/buttons`);

  // Let's also explore related subpages of /af/ad_app/ (like input, modify, write, view, popup, etc.)
  const candidateUrls = [
    'https://www.dbdbschool.kr/af/ad_app/lists/sn/3267',
    'https://www.dbdbschool.kr/af/ad_app/write/sn/3267',
    'https://www.dbdbschool.kr/af/ad_app/input/sn/3267',
    'https://www.dbdbschool.kr/af/ad_app/modify/sn/3267',
    'https://www.dbdbschool.kr/af/ad_app/excel/sn/3267',
    'https://www.dbdbschool.kr/af/ad_app/up/sn/3267',
    'https://www.dbdbschool.kr/af/ad_lec/lists/sn/3267',
    'https://www.dbdbschool.kr/af/ad_lec/write/sn/3267',
    'https://www.dbdbschool.kr/af/ad_lec/input/sn/3267',
    'https://www.dbdbschool.kr/af/ad_lec/modify/sn/3267',
  ];

  for (const url of candidateUrls) {
    try {
      const subPage = await context.newPage();
      const res = await subPage.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      const status = res ? res.status() : 0;
      const finalUrl = subPage.url();
      console.log(`Visited: ${url} -> Status: ${status}, Landed: ${finalUrl}`);
      
      const cleanName = url.replace('https://www.dbdbschool.kr/', '').replace(/[^a-zA-Z0-9]/g, '_');
      await subPage.screenshot({ path: `scratch/page_${cleanName}.png`, fullPage: true });
      fs.writeFileSync(`scratch/page_${cleanName}.html`, await subPage.content(), 'utf8');
      await subPage.close();
    } catch (err) {
      console.log(`Failed visiting ${url}:`, err.message);
    }
  }

  await browser.close();
  console.log('✅ ad_app deep scrape complete!');
}

scrapeAdAppDeep().catch(console.error);
