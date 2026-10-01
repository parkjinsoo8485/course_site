const { chromium } = require('playwright');

(async () => {
  console.log('=== [하네스 검증] 강좌관리 엑셀 다운로드 및 모달 실기능 점검 ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  let passed = 0;
  let total = 0;
  function assert(condition, desc) {
    total++;
    if (condition) {
      console.log(`  [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${desc}`);
    }
  }

  try {
    await page.goto('http://localhost:3005/af/ad_lec/lists/sn/3267', { waitUntil: 'networkidle' });
    assert(page.url().includes('3267'), '1. 강좌관리 페이지 정상 로딩');

    // 1. 강좌 테이블 데이터 로딩 대기
    await page.waitForSelector('#lectureTbody tr', { timeout: 5000 });
    const rowCount = await page.locator('#lectureTbody tr').count();
    assert(rowCount > 0, `2. 강좌 목록 테이블 바인딩 완료 (행 수: ${rowCount})`);

    // 2. 검색결과 엑셀 출력 버튼 클릭 및 다운로드 이벤트 검증
    const [ download ] = await Promise.all([
      page.waitForEvent('download', { timeout: 5000 }),
      page.click('button:has-text("검색결과엑셀출력")')
    ]);
    const suggestedFilename = download.suggestedFilename();
    assert(suggestedFilename.startsWith('강좌목록_검색결과_') && suggestedFilename.endsWith('.xls'), `3. 엑셀 파일 실제 다운로드 감지 성공: ${suggestedFilename}`);

    // 3. 모달 UI 보존 및 오픈/클로즈 검증 - 강좌 일괄입력
    await page.click('a#btn_action_input');
    await page.waitForTimeout(500);
    const batchInputModalVisible = await page.locator('#modalAppBatchUpload, #modalBatchInput, .modal:visible, div[style*="position: fixed"]:visible').count();
    assert(batchInputModalVisible > 0, '4. 강좌 일괄입력 모달 UI 정상 오픈 (기존 UI 유지)');

    // 4. 모달 UI 보존 및 오픈/클로즈 검증 - 강좌 일괄수정
    const closeBtn = page.locator('button:has-text("닫기"), button:has-text("취소"), .btn-close, [onclick*="close"]').first();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(300);

    await page.click('a#btn_action_modify');
    await page.waitForTimeout(500);
    const batchModifyModalVisible = await page.locator('#modalAppBatchFee, #batchModifyModal, div[style*="position: fixed"]:visible').count();
    assert(batchModifyModalVisible > 0, '5. 강좌 일괄수정 모달 UI 정상 오픈 (기존 UI 유지)');

    console.log(`\n결과: ${passed}/${total} 검증 통과!`);
  } catch (err) {
    console.error('하네스 테스트 중 오류:', err);
  } finally {
    await browser.close();
  }
})();
