import { chromium } from 'playwright';

(async () => {
  console.log('🔍 Launching Chromium to inspect https://www.dbdbschool.kr/af/ad_app/lists/sn/3267...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.dbdbschool.kr/af/ad_app/lists/sn/3267', { waitUntil: 'networkidle', timeout: 15000 });
    console.log('Page title:', await page.title());

    // Inspect buttons
    const buttons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button, a.btn, input[type="button"]')).map(el => ({
        text: el.innerText.trim(),
        onclick: el.getAttribute('onclick'),
        class: el.className,
        id: el.id
      }));
    });
    console.log('Buttons found on live page:', buttons);

    // Inspect modal dialogs in DOM if present
    const modals = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.modal, .modal-box, .dialog, [id*="modal"], [id*="pop"]')).map(el => ({
        id: el.id,
        class: el.className,
        html: el.outerHTML.substring(0, 300)
      }));
    });
    console.log('Modals found on live page:', modals);

  } catch (err) {
    console.error('Error fetching page:', err.message);
  } finally {
    await browser.close();
  }
})();
