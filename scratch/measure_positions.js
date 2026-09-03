const puppeteer = require('puppeteer');

async function testPositions() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto('http://localhost:3005/af/qanda/lists/sn/3267', { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    const leftMenu = document.getElementById('left_menu');
    const mainContent = document.querySelector('.main-content');
    const qnaPanel = document.getElementById('panel_qanda_lists');
    const pageTitle = document.querySelector('.page-title-box');

    const getBox = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, bottom: r.bottom };
    };

    return {
      leftMenu: getBox(leftMenu),
      mainContent: getBox(mainContent),
      qnaPanel: getBox(qnaPanel),
      pageTitle: getBox(pageTitle)
    };
  });

  console.log('--- ELEMENT POSITIONS ---');
  console.log('leftMenu:', data.leftMenu);
  console.log('mainContent:', data.mainContent);
  console.log('pageTitle:', data.pageTitle);
  console.log('qnaPanel:', data.qnaPanel);

  await page.screenshot({ path: 'scratch/screenshot_qna.png', fullPage: true });
  console.log('Screenshot saved to scratch/screenshot_qna.png');

  await browser.close();
}

testPositions().catch(console.error);
