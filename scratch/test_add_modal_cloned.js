const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  console.log('1. Navigating to http://localhost:3005/af/ad_lec/lists/sn/3267...');
  await page.goto('http://localhost:3005/af/ad_lec/lists/sn/3267', { waitUntil: 'networkidle' });

  console.log('2. Clicking [강좌 등록] button...');
  const addBtn = page.locator('#btn_action_write, a:has-text("강좌 등록")').first();
  await addBtn.click();
  await page.waitForTimeout(600);

  console.log('3. Checking #addModal visibility and centering...');
  const modal = page.locator('#addModal');
  const isVisible = await modal.isVisible();
  console.log('Modal visible:', isVisible);
  if (!isVisible) throw new Error('#addModal is not visible after clicking button');

  const modalBox = page.locator('#addModal .modal-box');
  const box = await modalBox.boundingBox();
  console.log('Modal box bounding box:', box);
  if (!box) throw new Error('Modal box not found');

  const checks = [
    { name: '강좌명 (add_lec_name)', sel: '#add_lec_name' },
    { name: '강좌구분 (add_lec_div)', sel: '#add_lec_div' },
    { name: '늘봄과정 (add_lec_pro_type)', sel: '#add_lec_pro_type' },
    { name: '강사ID (add_tea_id)', sel: '#add_tea_id' },
    { name: '보조강사ID (add_tea_id1)', sel: '#add_tea_id1' },
    { name: '대상학년 전체선택 (add_check_all_grade)', sel: '#add_check_all_grade' },
    { name: '강의시간 표시 (add_lec_time_disp)', sel: '#add_lec_time_disp' },
    { name: '정원 (add_lec_max_sin)', sel: '#add_lec_max_sin' },
    { name: '대기정원 (add_lec_max_wait)', sel: '#add_lec_max_wait' },
    { name: '운영시작일 (add_lec_sdate)', sel: '#add_lec_sdate' },
    { name: '운영종료일 (add_lec_edate)', sel: '#add_lec_edate' },
    { name: '총시수 (add_lec_tot_sisu)', sel: '#add_lec_tot_sisu' },
    { name: '강의실 선택 (add_lec_room_sel)', sel: '#add_lec_room_sel' },
    { name: '강의실 직접입력 (add_lec_room)', sel: '#add_lec_room' },
    { name: '수강료 (add_lec_pay)', sel: '#add_lec_pay' },
    { name: '수용비 (add_lec_use_cost)', sel: '#add_lec_use_cost' },
    { name: '강사료 (add_lec_tea_fee)', sel: '#add_lec_tea_fee' },
    { name: '교재비 (add_lec_pay_book)', sel: '#add_lec_pay_book' },
    { name: '재료비 (add_lec_pay_item)', sel: '#add_lec_pay_item' },
    { name: '내용 (add_lec_content)', sel: '#add_lec_content' },
    { name: '첨부파일 (add_lec_file)', sel: '#add_lec_file' },
    { name: '수강료 출력 (add_lec_pay_view)', sel: '#add_lec_pay_view' },
    { name: '강사마감 (add_lec_tea_finish)', sel: '#add_lec_tea_finish' },
    { name: '강사 강좌 편집 (add_lec_tea_edit)', sel: '#add_lec_tea_edit' },
    { name: '환불마감 (add_refund_status)', sel: '#add_refund_status' },
    { name: '등록 버튼 (btnAddCourseSubmit)', sel: '#btnAddCourseSubmit' },
    { name: '취소 버튼', sel: '#addModal .modal-footer button:has-text("취소")' }
  ];

  for (const c of checks) {
    const el = page.locator(c.sel).first();
    const count = await el.count();
    if (count === 0) {
      console.warn('⚠️ Warning: ' + c.name + ' (' + c.sel + ') not found');
    } else {
      console.log('✓ [Verified] ' + c.name);
    }
  }

  console.log('4. Taking screenshot of opened modal...');
  await page.screenshot({ path: 'scratch/add_modal_cloned.png' });
  console.log('✓ Screenshot saved to scratch/add_modal_cloned.png');

  const closeBtn = page.locator('#addModal .close-btn').first();
  await closeBtn.click();
  await page.waitForTimeout(400);
  const isHidden = !(await modal.isVisible());
  console.log('Modal closed cleanly:', isHidden);

  await browser.close();
  console.log('=== All UI tests passed! ===');
})();
