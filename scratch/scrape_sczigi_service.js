import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const COOKIE_PATH = path.resolve('scratch/cookies.json');
const TARGET_LIST_URL = 'https://www.dbdbschool.kr/sczigi/service/lists/sn/3267';

async function scrapeSczigiService() {
  console.log('🚀 Launching Playwright Chromium for Sczigi Service...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  if (fs.existsSync(COOKIE_PATH)) {
    const cookieData = JSON.parse(fs.readFileSync(COOKIE_PATH, 'utf8'));
    await context.addCookies(cookieData);
    console.log(`🍪 Loaded ${cookieData.length} cookies.`);
  }

  const page = await context.newPage();

  try {
    console.log(`\n========================================`);
    console.log(`🌐 Navigating to TARGET_LIST_URL: ${TARGET_LIST_URL}`);
    const res = await page.goto(TARGET_LIST_URL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`📍 Landed URL: ${page.url()}`);
    console.log(`📄 Response Status: ${res ? res.status() : 'N/A'}`);

    await page.screenshot({ path: 'scratch/sczigi_service_main.png', fullPage: true });
    const mainHtml = await page.content();
    fs.writeFileSync('scratch/sczigi_service_main.html', mainHtml, 'utf8');

    // 1. Analyze LNB (Left Navigation Bar / Side Menu)
    const lnbMenu = await page.evaluate(() => {
      const menuItems = [];
      const sideNav = document.querySelector('.lnb, .left_menu, #left_menu, nav, aside, .sidebar, #sidebar, .snb, #snb') || document.body;
      
      const links = Array.from(document.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.href,
        pathname: a.pathname,
        className: a.className,
        parentTag: a.parentElement?.tagName,
        parentClass: a.parentElement?.className
      })).filter(l => l.text.length > 0 && (l.href.includes('/sczigi/') || l.href.includes('/service/')));

      const allNavLinks = Array.from(document.querySelectorAll('aside a, .lnb a, .snb a, .left_menu a, #sidebar a, #left a, .menu a, ul.nav a')).map(a => ({
        text: a.innerText.trim(),
        href: a.href,
        pathname: a.pathname,
        className: a.className
      }));

      return {
        title: document.title,
        headerText: document.querySelector('h1, h2, h3, .title, .sub_title')?.innerText?.trim(),
        links,
        allNavLinks
      };
    });

    console.log('📋 LNB & Header Analysis:', JSON.stringify(lnbMenu, null, 2));
    fs.writeFileSync('scratch/sczigi_lnb_analysis.json', JSON.stringify(lnbMenu, null, 2), 'utf8');

    // 2. Full DOM analysis of main page
    const mainDomAnalysis = await page.evaluate(() => {
      const title = document.title;
      const h1 = document.querySelector('h1')?.innerText?.trim();
      const h2 = document.querySelector('h2')?.innerText?.trim();
      const h3 = document.querySelector('h3')?.innerText?.trim();

      const tables = Array.from(document.querySelectorAll('table')).map((t, idx) => ({
        index: idx,
        className: t.className,
        headers: Array.from(t.querySelectorAll('th')).map(th => ({
          text: th.innerText.trim(),
          colspan: th.getAttribute('colspan') || 1,
          rowspan: th.getAttribute('rowspan') || 1,
          width: th.getAttribute('width') || th.style.width || '',
          style: th.getAttribute('style') || ''
        })),
        rows: Array.from(t.querySelectorAll('tbody tr, tr:not(:first-child)')).map(tr => 
          Array.from(tr.querySelectorAll('td')).map(td => ({
            text: td.innerText.trim(),
            html: td.innerHTML.trim(),
            colspan: td.getAttribute('colspan') || 1,
            rowspan: td.getAttribute('rowspan') || 1,
            className: td.className
          }))
        )
      }));

      const buttons = Array.from(document.querySelectorAll('button, a.btn, input[type="button"], input[type="submit"], .btn')).map(b => ({
        tag: b.tagName,
        text: (b.innerText || b.value || '').trim(),
        href: b.href || '',
        className: b.className,
        style: b.getAttribute('style') || ''
      }));

      const forms = Array.from(document.querySelectorAll('form')).map(f => ({
        action: f.action,
        method: f.method,
        inputs: Array.from(f.querySelectorAll('input, select, textarea')).map(i => ({
          tag: i.tagName,
          type: i.type || '',
          name: i.name || '',
          id: i.id || '',
          value: i.value || '',
          placeholder: i.placeholder || '',
          options: i.tagName === 'SELECT' ? Array.from(i.options).map(o => ({ value: o.value, text: o.text, selected: o.selected })) : undefined
        }))
      }));

      const tabs = Array.from(document.querySelectorAll('.tab, .tabs, .nav-tabs, ul.tab li, .tab_menu li')).map(t => ({
        text: t.innerText.trim(),
        href: t.querySelector('a')?.href || '',
        active: t.classList.contains('on') || t.classList.contains('active') || t.classList.contains('selected')
      }));

      return {
        title,
        h1,
        h2,
        h3,
        tables,
        buttons,
        forms,
        tabs
      };
    });

    fs.writeFileSync('scratch/sczigi_main_dom.json', JSON.stringify(mainDomAnalysis, null, 2), 'utf8');
    console.log('✅ Main DOM Analysis saved to scratch/sczigi_main_dom.json');

    // 3. Loop over all subpages found in LNB or related URLs
    const subpages = [
      ...new Set([
        ...lnbMenu.links.map(l => l.href),
        ...lnbMenu.allNavLinks.map(l => l.href)
      ])
    ].filter(url => url && url.startsWith('http'));

    console.log(`\n🔍 Found ${subpages.length} subpages to inspect:`, subpages);

    const subpageResults = [];
    for (let i = 0; i < subpages.length; i++) {
      const subUrl = subpages[i];
      const safeName = subUrl.replace(/https?:\/\/[^\/]+\//, '').replace(/[^a-zA-Z0-9_]/g, '_');
      console.log(`\n🌐 [${i + 1}/${subpages.length}] Visiting: ${subUrl}`);
      try {
        const subRes = await page.goto(subUrl, { waitUntil: 'networkidle', timeout: 20000 });
        const currentUrl = page.url();
        console.log(`   📍 Landed at: ${currentUrl} (${subRes?.status()})`);
        
        await page.screenshot({ path: `scratch/subpage_${safeName}.png`, fullPage: true });
        const subHtml = await page.content();
        fs.writeFileSync(`scratch/subpage_${safeName}.html`, subHtml, 'utf8');

        const subDom = await page.evaluate(() => {
          return {
            title: document.title,
            h1: document.querySelector('h1')?.innerText?.trim(),
            h2: document.querySelector('h2')?.innerText?.trim(),
            h3: document.querySelector('h3')?.innerText?.trim(),
            contentTitle: document.querySelector('.title, .sub_title, .page-header, .page_title')?.innerText?.trim(),
            tables: Array.from(document.querySelectorAll('table')).map((t, idx) => ({
              index: idx,
              headers: Array.from(t.querySelectorAll('th')).map(th => th.innerText.trim()),
              rowCount: t.querySelectorAll('tbody tr, tr:not(:first-child)').length,
              sampleRows: Array.from(t.querySelectorAll('tbody tr, tr:not(:first-child)')).slice(0, 5).map(tr => 
                Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim())
              )
            })),
            forms: Array.from(document.querySelectorAll('form')).map(f => ({
              action: f.action,
              method: f.method,
              inputs: Array.from(f.querySelectorAll('input, select, textarea')).map(i => ({
                tag: i.tagName,
                type: i.type,
                name: i.name,
                placeholder: i.placeholder,
                options: i.tagName === 'SELECT' ? Array.from(i.options).map(o => ({ value: o.value, text: o.text })) : undefined
              }))
            })),
            buttons: Array.from(document.querySelectorAll('button, a.btn, input[type="button"], input[type="submit"], .btn')).map(b => ({
              text: (b.innerText || b.value || '').trim(),
              href: b.href || ''
            }))
          };
        });

        subpageResults.push({
          url: subUrl,
          landedUrl: currentUrl,
          safeName,
          subDom
        });
      } catch (err) {
        console.error(`❌ Failed to scrape ${subUrl}:`, err.message);
      }
    }

    fs.writeFileSync('scratch/sczigi_subpages_analysis.json', JSON.stringify(subpageResults, null, 2), 'utf8');
    console.log(`\n🎉 All done! Saved analysis to scratch/sczigi_subpages_analysis.json`);

  } catch (err) {
    console.error('❌ Error during scrape:', err);
  } finally {
    await browser.close();
  }
}

scrapeSczigiService();
