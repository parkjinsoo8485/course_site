const fs = require('fs');

async function cdp(wsUrl, method, params = {}) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const id = 1;
    ws.onopen = () => ws.send(JSON.stringify({ id, method, params }));
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
  const targetTab = tabs.find(t => t.url && t.url.includes('dbdbschool.kr')) || tabs.find(t => t.id === '8681F10386AE09E462677534A4962AAE');

  console.log('Navigating to', url);
  await cdp(targetTab.webSocketDebuggerUrl, 'Page.navigate', { url });
  await new Promise(r => setTimeout(r, 2500));

  const res = await cdp(targetTab.webSocketDebuggerUrl, 'Runtime.evaluate', {
    expression: 'document.documentElement.outerHTML',
    returnByValue: true
  });
  fs.writeFileSync(savePath, res.result.value, 'utf8');
  console.log('Saved', savePath, 'size:', res.result.value.length);
}

async function run() {
  await dumpPage('https://www.dbdbschool.kr/af/ad_tea/input/sn/3267', 'scratch/target_ad_tea_input.html');
  await dumpPage('https://www.dbdbschool.kr/af/ad_tea/schedule/p/1/sn/3267', 'scratch/target_ad_tea_schedule.html');
  console.log('All additional ad_tea subpages dumped!');
}

run().catch(console.error);
