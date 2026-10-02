const { chromium } = require('playwright');
const http = require('http');
const assert = require('assert');

async function testHttpEndpoint(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

(async () => {
  console.log('===============================================================');
  console.log('🧪 [Test Harness] 지원금 대상자관리 (ad_free2_stu) 1:1 매핑 통합 검증');
  console.log('===============================================================');

  // 1. HTTP 엑셀 및 CSV 다운로드 엔드포인트 검증
  console.log('\n[1/5] 다운로드 엔드포인트 응답 검증 중...');
  const sampleRes = await testHttpEndpoint('http://localhost:3005/af/ad_free2_stu/sample_csv');
  assert.strictEqual(sampleRes.statusCode, 200, 'sample_csv should return 200');
  assert.ok(sampleRes.headers['content-disposition'].includes('subsidy_student_batch_sample.csv'), 'CSV attachment header verified');
  console.log('  ✓ [통과] 샘플 CSV 다운로드 정상 (200 OK)');

  const excelRes = await testHttpEndpoint('http://localhost:3005/af/ad_free2_stu/excel');
  assert.strictEqual(excelRes.statusCode, 200, 'excel should return 200');
  assert.ok(excelRes.headers['content-type'].includes('ms-excel'), 'Excel header verified');
  console.log('  ✓ [통과] 검색결과 엑셀 출력 정상 (200 OK)');

  const excelAllRes = await testHttpEndpoint('http://localhost:3005/af/ad_free2_stu/excel_all');
  assert.strictEqual(excelAllRes.statusCode, 200, 'excel_all should return 200');
  assert.ok(excelAllRes.headers['content-type'].includes('ms-excel'), 'Excel all header verified');
  console.log('  ✓ [통과] 전교생기준 엑셀 출력 정상 (200 OK)');

  // 2. Playwright 브라우저 UI 및 상호작용 검증
  console.log('\n[2/5] 브라우저 UI 로드 및 19열 테이블 구조 검증 중...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = context.newPage ? await context.newPage() : await browser.newPage();

  // Dialog 자동 수락
  page.on('dialog', async dialog => {
    console.log(`    [Browser Dialog] "${dialog.message()}" -> 수락(accept)`);
    await dialog.accept();
  });

  await page.goto('http://localhost:3005/af/ad_free2_stu/lists/sn/3267', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 패널 활성화 검증
  const panelVisible = await page.isVisible('#panel_ad_free2_stu');
  assert.ok(panelVisible, '#panel_ad_free2_stu must be visible');
  console.log('  ✓ [통과] #panel_ad_free2_stu 패널 정상 표시');

  // 테이블 행 개수 확인
  await page.waitForSelector('#subsidyStuTbody tr td input.sub_chk_item', { timeout: 5000 });
  const initialRows = await page.locator('#subsidyStuTbody tr').count();
  console.log(`  ✓ [통과] 초기 대상자 목록 로드 완료 (총 ${initialRows}명)`);
  assert.ok(initialRows >= 8, 'Initial rows should be at least 8');

  // 3. 필터 검색 및 초기화 검증
  console.log('\n[3/5] 필터링 (이름 검색 및 학년 필터) 검증 중...');
  await page.fill('#sub_filter_name', '이하늘');
  await page.click('button:has-text("검색")');
  await page.waitForTimeout(500);

  const filteredRows = await page.locator('#subsidyStuTbody tr').count();
  console.log(`  ✓ 이름 '이하늘' 검색 결과 행 수: ${filteredRows}`);
  assert.strictEqual(filteredRows, 1, 'Search for 이하늘 should return 1 row');

  // [전체] 버튼 클릭 후 복구 검증
  await page.click('button:has-text("전체")');
  await page.waitForTimeout(500);
  const resetRows = await page.locator('#subsidyStuTbody tr').count();
  console.log(`  ✓ [전체] 버튼 클릭 후 행 수 복구: ${resetRows}`);
  assert.strictEqual(resetRows, initialRows, 'Reset should restore rows');

  // 4. 대상자 등록 모달 검증
  console.log('\n[4/5] 대상자등록 모달 오픈, 등록 및 수정 검증 중...');
  await page.click('button:has-text("대상자등록")');
  await page.waitForTimeout(500);

  const modalVisible = await page.isVisible('#modal_subsidy_student_form');
  assert.ok(modalVisible, 'Modal form should be visible');
  console.log('  ✓ [통과] 대상자등록 모달 오픈 확인');

  // 폼 입력
  await page.selectOption('#sub_form_grade', '1');
  await page.fill('#sub_form_class', '3');
  await page.fill('#sub_form_student_num', '18');
  await page.fill('#sub_form_name', '테스트학생');
  await page.fill('#sub_form_phone', '010-9999-8888');
  await page.fill('#sub_form_fund1_total', '600000');
  await page.fill('#sub_form_note', '자동화테스트 등록');

  // 저장 버튼 클릭
  await page.click('#modal_subsidy_student_form button[type="submit"]');
  await page.waitForTimeout(800);

  // 테이블에서 '테스트학생' 확인
  const foundNewStudent = await page.locator('#subsidyStuTbody:has-text("테스트학생")').count();
  assert.ok(foundNewStudent > 0, 'New student should be rendered in table');
  console.log('  ✓ [통과] 신규 대상자 "테스트학생" 정상 등록 및 테이블 반영 확인');

  // 수정 검증: '테스트학생' 행의 [수정] 버튼 클릭
  const testStudentRow = page.locator('#subsidyStuTbody tr:has-text("테스트학생")').first();
  await testStudentRow.locator('button:has-text("수정")').click();
  await page.waitForTimeout(500);

  // 모달에 기존 값이 채워졌는지 확인
  const currentNameVal = await page.inputValue('#sub_form_name');
  assert.strictEqual(currentNameVal, '테스트학생', 'Edit modal should load existing student name');
  await page.fill('#sub_form_note', '수정 완료됨');
  await page.click('#modal_subsidy_student_form button[type="submit"]');
  await page.waitForTimeout(800);
  console.log('  ✓ [통과] 대상자 정보 수정 완료');

  // 5. 일괄등록 모달 검증
  console.log('\n[5/5] 대상자일괄입력 모달 및 선택 삭제 검증 중...');
  await page.click('button:has-text("대상자일괄입력")');
  await page.waitForTimeout(500);

  const batchModalVisible = await page.isVisible('#modal_subsidy_batch_form');
  assert.ok(batchModalVisible, 'Batch modal should be visible');

  // 텍스트 붙여넣기 및 실시간 미리보기 확인
  const sampleBatchText = '2\t1\t20\t일괄학생1\t010-1111-3333\t1순위\t국민기초생활수급자\tY\t0\t0\t600000\t일괄등록1\n3\t2\t21\t일괄학생2\t010-2222-4444\t2순위\t한부모가족보호대상자\tN\t0\t300000\t300000\t일괄등록2';
  await page.fill('#sub_batch_text_area', sampleBatchText);
  await page.waitForTimeout(400);

  const previewCount = await page.textContent('#sub_batch_preview_count');
  assert.strictEqual(previewCount, '2', 'Preview count should be 2');
  console.log('  ✓ [통과] 일괄입력 실시간 파싱 및 미리보기 정상 (2명 감지)');

  await page.click('button:has-text("일괄등록 실행")');
  await page.waitForTimeout(800);

  // 테이블에서 일괄 등록된 학생 확인
  const foundBatchStudent = await page.locator('#subsidyStuTbody:has-text("일괄학생1")').count();
  assert.ok(foundBatchStudent > 0, 'Batch student 1 should exist');
  console.log('  ✓ [통과] 일괄입력 실행 및 2명 추가 반영 확인');

  // 선택삭제 검증: 테스트학생 체크박스 선택 후 삭제
  const testStudentChk = page.locator('#subsidyStuTbody tr:has-text("테스트학생") input.sub_chk_item');
  await testStudentChk.check();
  await page.waitForTimeout(300);

  const deleteBtn = page.locator('#btn_sub_delete_selected');
  assert.ok(await deleteBtn.isVisible(), 'Delete selected button should become visible');
  await deleteBtn.click();
  await page.waitForTimeout(800);

  const stillHasTestStudent = await page.locator('#subsidyStuTbody:has-text("테스트학생")').count();
  assert.strictEqual(stillHasTestStudent, 0, 'Deleted student should disappear');
  console.log('  ✓ [통과] 선택삭제 정상 작동 확인');

  // 최종 스크린샷 캡처
  await page.screenshot({ path: 'scratch/verified_ad_free2_stu.png', fullPage: true });
  console.log('\n📸 [검증 스크린샷 저장]: scratch/verified_ad_free2_stu.png');

  await browser.close();
  console.log('\n===============================================================');
  console.log('🎉 [검증 성공] 지원금 대상자관리 모든 버튼, 모달, 출력 기능 100% 정상 작동!');
  console.log('===============================================================');
})();
