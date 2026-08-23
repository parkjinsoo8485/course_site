import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const COOKIE_PATH = path.resolve('scratch/cookies.json');

const ACTION_BUTTON_URLS = [
  // 1. 교직원 관련 버튼 페이지
  { name: 'teacher_write', url: 'https://www.dbdbschool.kr/sczigi/teacher/write/p/1/sn/3267', title: '교직원 등록 폼' },
  { name: 'teacher_input', url: 'https://www.dbdbschool.kr/sczigi/teacher/input/p/1/sn/3267', title: '교직원 일괄입력 엑셀업로드' },
  { name: 'teacher_modify', url: 'https://www.dbdbschool.kr/sczigi/teacher/modify/num/134763/p/1/sn/3267', title: '교직원 정보 수정' },
  // 2. 학생 관련 버튼 페이지
  { name: 'student_write', url: 'https://www.dbdbschool.kr/sczigi/student/write/p/1/sn/3267/sof/grade/sot/asc', title: '학생 등록 폼' },
  { name: 'student_input', url: 'https://www.dbdbschool.kr/sczigi/student/input/p/1/sn/3267/sof/grade/sot/asc', title: '학생 일괄입력 엑셀업로드' },
  { name: 'student_up', url: 'https://www.dbdbschool.kr/sczigi/student/up/p/1/sn/3267/sof/grade/sot/asc', title: '학생 진급처리(학적변경)' },
  { name: 'student_modify', url: 'https://www.dbdbschool.kr/sczigi/student/modify/num/4841970/p/1/sn/3267/sof/grade/sot/asc', title: '학생 정보 수정' },
  // 3. 문자 관련 버튼 페이지
  { name: 'sms_tel_help', url: 'https://www.dbdbschool.kr/sczigi/sms_tel/help/p/1/sn/3267', title: '발신번호 등록 안내 및 서식' },
];

async function scrapeButtonPages() {
  console.log('🚀 Launching Playwright to capture all action button linked pages...');
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
  const results = [];

  for (let i = 0; i < ACTION_BUTTON_URLS.length; i++) {
    const item = ACTION_BUTTON_URLS[i];
    console.log(`\n📸 [${i + 1}/${ACTION_BUTTON_URLS.length}] Capturing ${item.name} (${item.title}): ${item.url}`);
    try {
      const res = await page.goto(item.url, { waitUntil: 'networkidle', timeout: 25000 });
      const currentUrl = page.url();
      console.log(`   📍 Landed at: ${currentUrl} (${res?.status()})`);

      const screenshotPath = `scratch/btn_page_${item.name}.png`;
      const htmlPath = `scratch/btn_page_${item.name}.html`;

      await page.screenshot({ path: screenshotPath, fullPage: true });
      const contentHtml = await page.content();
      fs.writeFileSync(htmlPath, contentHtml, 'utf8');

      const domSummary = await page.evaluate(() => {
        return {
          title: document.title,
          h1: document.querySelector('h1')?.innerText?.trim(),
          heading: document.querySelector('.panel-heading, #contents_title, h2, h3')?.innerText?.trim(),
          formInputs: Array.from(document.querySelectorAll('form input, form select, form textarea')).map(el => ({
            tag: el.tagName,
            type: el.type,
            name: el.name,
            id: el.id,
            placeholder: el.placeholder,
            value: el.value,
            options: el.tagName === 'SELECT' ? Array.from(el.options).map(o => ({ value: o.value, text: o.text })) : undefined
          })),
          buttons: Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"], a.btn')).map(b => ({
            text: (b.innerText || b.value || '').trim(),
            className: b.className
          }))
        };
      });

      results.push({
        ...item,
        currentUrl,
        screenshotPath,
        domSummary
      });
      console.log(`   ✅ Saved screenshot and DOM for ${item.name}`);
    } catch (err) {
      console.error(`   ❌ Failed to capture ${item.name}:`, err.message);
    }
  }

  fs.writeFileSync('scratch/sczigi_button_pages_analysis.json', JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n🎉 Button pages analysis saved to scratch/sczigi_button_pages_analysis.json`);
  await browser.close();
}

scrapeButtonPages();
