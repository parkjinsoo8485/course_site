const fs = require('fs');

async function cdp(wsUrl, method, params = {}) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const id = 1;
    ws.onopen = () => {
      ws.send(JSON.stringify({ id, method, params }));
    };
    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id === id) {
        ws.close();
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    ws.onerror = reject;
    setTimeout(() => { ws.close(); reject(new Error('timeout')); }, 10000);
  });
}

async function dumpPage(url, savePath) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  let targetTab = tabs.find(t => t.url && t.url.includes('dbdbschool.kr'));
  if (!targetTab) targetTab = tabs[0];

  console.log(`[CDP Dump] Navigating to: ${url}`);
  await cdp(targetTab.webSocketDebuggerUrl, 'Page.navigate', { url });
  await new Promise(r => setTimeout(r, 2500));

  const res = await cdp(targetTab.webSocketDebuggerUrl, 'Runtime.evaluate', {
    expression: 'document.documentElement.outerHTML',
    returnByValue: true
  });
  const html = res.result.value || '';
  fs.writeFileSync(savePath, html, 'utf8');
  console.log(`  ✔ Saved ${savePath} (${html.length.toLocaleString()} bytes)`);
  return html;
}

async function run() {
  console.log('🚀 Starting CDP Dump for ad_sur & ad_surs...');

  // 1. 설문관리 > 설문 목록
  const surListsHtml = await dumpPage('https://www.dbdbschool.kr/af/ad_sur/lists/sn/3267', 'scratch/target_ad_sur_lists.html');

  // 설문 목록 내 모든 링크 탐색
  const surLinks = [...surListsHtml.matchAll(/href=["']([^"']*(?:ad_sur|sur_idx)[^"']*)["']/g)].map(m => m[1]);
  console.log('Discovered ad_sur links count:', surLinks.length);
  const uniqueLinks = [...new Set(surLinks)];
  console.log('Unique ad_sur links:', uniqueLinks);

  // 2. 설문등록
  await dumpPage('https://www.dbdbschool.kr/af/ad_sur/write/sn/3267', 'scratch/target_ad_sur_write.html');

  // 3. 설문 목록 내 문항관리, 결과보기, 수정 등 세부 URL 덤프
  for (const link of uniqueLinks) {
    const fullUrl = link.startsWith('http') ? link : `https://www.dbdbschool.kr${link}`;
    if (link.includes('ad_sur_que') || link.includes('que')) {
      await dumpPage(fullUrl, 'scratch/target_ad_sur_que.html');
      break;
    }
  }

  for (const link of uniqueLinks) {
    const fullUrl = link.startsWith('http') ? link : `https://www.dbdbschool.kr${link}`;
    if (link.includes('ad_sur_ans') || link.includes('ans')) {
      await dumpPage(fullUrl, 'scratch/target_ad_sur_ans.html');
      break;
    }
  }

  for (const link of uniqueLinks) {
    const fullUrl = link.startsWith('http') ? link : `https://www.dbdbschool.kr${link}`;
    if (link.includes('modify')) {
      await dumpPage(fullUrl, 'scratch/target_ad_sur_modify.html');
      break;
    }
  }

  // 4. 설문관리 > 샘플설문 목록
  const sursListsHtml = await dumpPage('https://www.dbdbschool.kr/af/ad_surs/lists/sn/3267', 'scratch/target_ad_surs_lists.html');
  const sursLinks = [...sursListsHtml.matchAll(/href=["']([^"']*(?:ad_surs|surs)[^"']*)["']/g)].map(m => m[1]);
  console.log('Unique ad_surs links:', [...new Set(sursLinks)]);

  console.log('✅ CDP Dump completed successfully!');
}

run().catch(console.error);
