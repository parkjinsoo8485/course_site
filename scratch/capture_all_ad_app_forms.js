import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const COOKIE_PATH = path.resolve('scratch/cookies.json');
const BASE_URL = 'https://www.dbdbschool.kr';

async function captureAllFormsAndButtons() {
  console.log('🚀 Launching Playwright to capture every single button, page, and input form on ad_app...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  if (fs.existsSync(COOKIE_PATH)) {
    const cookies = JSON.parse(fs.readFileSync(COOKIE_PATH, 'utf8'));
    await context.addCookies(cookies);
  }

  const results = {};

  // Helper to capture and analyze a page
  async function capturePage(name, url, actions = null) {
    console.log(`\n📸 Capturing: ${name} (${url})`);
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
      if (actions) {
        await actions(page);
      }
      
      const screenshotPath = `scratch/cap_${name}.png`;
      const htmlPath = `scratch/cap_${name}.html`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      const html = await page.content();
      fs.writeFileSync(htmlPath, html, 'utf8');

      // Analyze forms, inputs, tables, buttons on this page
      const analysis = await page.evaluate(() => {
        const pageTitle = document.title;
        const heading = document.querySelector('.panel-heading, h1, h2, h3, .title')?.innerText?.trim();
        const forms = Array.from(document.querySelectorAll('form')).map(f => ({
          name: f.name,
          id: f.id,
          action: f.action,
          method: f.method,
          fields: Array.from(f.querySelectorAll('input, select, textarea')).map(el => ({
            tagName: el.tagName,
            type: el.type,
            name: el.name,
            id: el.id,
            value: el.value,
            placeholder: el.placeholder || '',
            options: el.tagName === 'SELECT' ? Array.from(el.options).slice(0, 15).map(o => ({ text: o.text, value: o.value, selected: o.selected })) : undefined
          }))
        }));

        const buttons = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], a.btn, .btn, .btn-primary, .btn-default, .btn-success, .btn-danger, .btn-warning, .btn-info')).map(b => ({
          text: b.innerText?.trim() || b.value || '',
          id: b.id,
          className: b.className,
          href: b.getAttribute('href'),
          onclick: b.getAttribute('onclick')
        }));

        const tableHeaders = Array.from(document.querySelectorAll('table th')).map(th => th.innerText.trim());

        return {
          pageTitle,
          heading,
          forms,
          buttons,
          tableHeaders
        };
      });

      results[name] = {
        url,
        screenshotPath,
        htmlPath,
        analysis
      };
      console.log(`✅ Completed ${name}: found ${analysis.forms.length} forms, ${analysis.buttons.length} buttons`);
    } catch (err) {
      console.error(`❌ Failed ${name}:`, err.message);
    } finally {
      await page.close();
    }
  }

  // 1. Main List Page with Detailed Search Box Open
  await capturePage('01_ad_app_lists_search_open', 'https://www.dbdbschool.kr/af/ad_app/lists/sn/3267', async (page) => {
    // Open detailed search if not open
    const searchBox = page.locator('#main_control_box_search');
    if (!(await searchBox.isVisible())) {
      await page.click('#main_control_box_btn01');
      await page.waitForTimeout(500);
    }
  });

  // 2. Main List Page with Additional Features Dropdown Open
  await capturePage('02_ad_app_lists_extra_menu_open', 'https://www.dbdbschool.kr/af/ad_app/lists/sn/3267', async (page) => {
    await page.click('#main_control_box_btn02');
    await page.waitForTimeout(500);
  });

  // 3. Contact Edit Modal (show_stu_hp)
  await capturePage('03_ad_app_contact_edit_modal', 'https://www.dbdbschool.kr/af/ad_app/lists/sn/3267', async (page) => {
    // Click on the first contact edit icon
    const editBtn = page.locator('a[onclick*="show_stu_hp"]').first();
    if (await editBtn.count()) {
      await editBtn.click();
      await page.waitForTimeout(800);
    }
  });

  // 4. Student Schedule Modal (open_stu_schedule)
  await capturePage('04_ad_app_student_schedule_modal', 'https://www.dbdbschool.kr/af/ad_app/lists/sn/3267', async (page) => {
    const schedBtn = page.locator('a[onclick*="open_stu_schedule"]').first();
    if (await schedBtn.count()) {
      await schedBtn.click();
      await page.waitForTimeout(800);
    }
  });

  // 5. Student Single Registration (신청자 등록 빈 양식)
  await capturePage('05_ad_app_sin_empty', 'https://www.dbdbschool.kr/af/ad_app/sin/p/1/sn/3267/sld/10');

  // 6. Student Search Popup (학생 검색 팝업)
  await capturePage('06_student_search_popup', 'https://www.dbdbschool.kr/student/search/tn/af_ad_sin/sn/3267');

  // 7. Student Single Registration with Student Selected (학생 선택 후 강좌 신청 목록)
  await capturePage('07_ad_app_sin_student_selected', 'https://www.dbdbschool.kr/af/ad_app/sin/p/1/sn/3267/sld/10/sof/sbh/sot/asc/sld1/10/mem_num/4841988');

  // 8. Batch Input Page (신청자 일괄입력)
  await capturePage('08_ad_app_batch_input', 'https://www.dbdbschool.kr/af/ad_app/input/p/1/sn/3267/sld/10');

  // 9. Fee Management Page (수강료 입력)
  await capturePage('09_ad_pay_edit', 'https://www.dbdbschool.kr/af/ad_pay/edit/p/1/sn/3267/sld/10');

  // 10. Copy Applicants Page (신청자 복사)
  await capturePage('10_ad_app_copy', 'https://www.dbdbschool.kr/af/ad_app/copy/p/1/sn/3267/sld/10');

  // 11. Add/Cancel History Log Page (추가/취소자 조회)
  await capturePage('11_ad_app_history_com', 'https://www.dbdbschool.kr/af/ad_app/com/p/1/sn/3267/sld/10');

  // 12. Non-Applicant List Page (미신청자 목록)
  await capturePage('12_ad_app_unapplied_list1', 'https://www.dbdbschool.kr/af/ad_app/list1/p/1/sn/3267/sld/10');

  // 13. Excel Export Page (신청결과 엑셀출력)
  await capturePage('13_ad_app_excel_export', 'https://www.dbdbschool.kr/af/ad_app/excel/p/1/sn/3267/sld/10');

  // 14. Application Form PDF Print Page (수강신청서 출력)
  await capturePage('14_ad_app_pdf_print', 'https://www.dbdbschool.kr/af/ad_app/pdf/p/1/sn/3267/sld/10');

  // 15. Tuition Notice Bill PDF Print Page (고지서 출력)
  await capturePage('15_ad_app_pdf1_bill_print', 'https://www.dbdbschool.kr/af/ad_app/pdf1/p/1/sn/3267/sld/10');

  // 16. Timetable PDF Print Page (시간표 출력)
  await capturePage('16_ad_app_pdf2_timetable_print', 'https://www.dbdbschool.kr/af/ad_app/pdf2/p/1/sn/3267/sld/10');

  // 17. Waitlist Management Page (대기자 목록)
  await capturePage('17_ad_wait_lists', 'https://www.dbdbschool.kr/af/ad_wait/lists/sn/3267');

  fs.writeFileSync('scratch/all_forms_and_buttons_analysis.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\n🌟 All 17 pages, popups, and forms captured and analyzed successfully!');
  await browser.close();
}

captureAllFormsAndButtons().catch(console.error);
