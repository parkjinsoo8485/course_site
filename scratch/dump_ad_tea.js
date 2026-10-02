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
  if (!targetTab) targetTab = tabs.find(t => t.id === '8681F10386AE09E462677534A4962AAE');

  console.log('Navigating to', url);
  await cdp(targetTab.webSocketDebuggerUrl, 'Page.navigate', { url });
  await new Promise(r => setTimeout(r, 2500));

  const res = await cdp(targetTab.webSocketDebuggerUrl, 'Runtime.evaluate', {
    expression: 'document.documentElement.outerHTML',
    returnByValue: true
  });
  fs.writeFileSync(savePath, res.result.value, 'utf8');
  console.log('Saved', savePath, 'size:', res.result.value.length);
  return res.result.value;
}

async function run() {
  const html = await dumpPage('https://www.dbdbschool.kr/af/ad_tea/lists/sn/3267', 'scratch/target_ad_tea_lists.html');
  
  const subLinks = [...html.matchAll(/href=["']([^"']*ad_tea[^"']*)["']/g)].map(m => m[1]);
  console.log('Found ad_tea links:', [...new Set(subLinks)]);
  
  const onclicks = [...html.matchAll(/onclick=["']([^"']*)["']/g)].map(m => m[1]);
  console.log('Found onclicks (first 10):', onclicks.slice(0, 10));

  // 만약 등록/수정 링크가 있다면 그것도 덤프
  for (const link of [...new Set(subLinks)]) {
    if (link.includes('write')) {
      const fullUrl = link.startsWith('http') ? link : `https://www.dbdbschool.kr${link}`;
      await dumpPage(fullUrl, 'scratch/target_ad_tea_write.html');
    }
  }
}

run().catch(console.error);
