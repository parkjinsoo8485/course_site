const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const tabs = [
  { name: 'main', url: 'https://www.dbdbschool.kr/af/ad_cfg/main/sn/3267' },
  { name: 'tea',  url: 'https://www.dbdbschool.kr/af/ad_cfg/tea/sn/3267' },
  { name: 'att',  url: 'https://www.dbdbschool.kr/af/ad_cfg/att/sn/3267' },
  { name: 'sms',  url: 'https://www.dbdbschool.kr/af/ad_cfg/sms/sn/3267' }
];

async function dumpAll() {
  console.log('Connecting to Chrome on port 9222...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const contexts = browser.contexts();
  let targetPage = null;

  for (const ctx of contexts) {
    for (const p of ctx.pages()) {
      if (p.url().includes('dbdbschool.kr')) {
        targetPage = p;
        break;
      }
    }
    if (targetPage) break;
  }

  if (!targetPage) {
    console.error('❌ dbdbschool 탭을 찾지 못했습니다.');
    process.exit(1);
  }

  for (const tab of tabs) {
    console.log(`[*] 이동 중: ${tab.name} (${tab.url})`);
    await targetPage.goto(tab.url, { waitUntil: 'domcontentloaded' });
    await targetPage.waitForTimeout(1500);

    const html = await targetPage.evaluate(() => {
      const box = document.querySelector('#contents_box') || document.querySelector('#contents') || document.body;
      return box.outerHTML;
    });

    const outFile = path.join(__dirname, `target_ad_cfg_${tab.name}.html`);
    fs.writeFileSync(outFile, html, 'utf8');
    console.log(`✅ 저장 완료: ${outFile} (${(html.length / 1024).toFixed(1)} KB)`);
  }

  console.log('🎉 모든 Sprint 3 환경설정 탭 DOM 덤프 완료!');
}

dumpAll().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
