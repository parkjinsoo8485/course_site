const BASE_URL = 'http://localhost:3005';

function log(msg, ok = true) {
  const status = ok ? '\x1b[32m PASS \x1b[0m' : '\x1b[31m FAIL \x1b[0m';
  console.log(`[${status}] ${msg}`);
}

async function runTests() {
  let allPassed = true;
  console.log('='.repeat(60));
  console.log(' 1. 수강자관리 (/af/ad_free2_app/lists/sn/3267) 종합 테스트 시작');
  console.log('='.repeat(60));

  // 1. API: 목록 조회
  try {
    const res = await fetch(`${BASE_URL}/api/af/ad_free2_app/lists`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('data.success !== true');
    if (!Array.isArray(data.applicants)) throw new Error('data.applicants is not array');
    if (!data.summary || data.summary.totalFee === undefined) throw new Error('data.summary missing');
    log(`API: /api/af/ad_free2_app/lists 조회 성공 (${data.applicants.length}명, 합계: ${data.summary.totalFee.toLocaleString()}원)`, true);
  } catch (e) {
    log(`API: /api/af/ad_free2_app/lists 에러: ${e.message}`, false);
    allPassed = false;
  }

  // 2. API: 허용 월 GET & POST
  try {
    const getRes = await fetch(`${BASE_URL}/api/af/ad_free2_app/allowed_months`);
    const getData = await getRes.json();
    if (!getData.success || !Array.isArray(getData.allowedMonths)) throw new Error('Invalid allowedMonths data');

    const monthsPayload = ['3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월'];
    const postRes = await fetch(`${BASE_URL}/api/af/ad_free2_app/allowed_months`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allowedMonths: monthsPayload })
    });
    const postData = await postRes.json();
    if (!postData.success || postData.allowedMonths.length !== monthsPayload.length) throw new Error('POST allowedMonths failed');
    log('API: /api/af/ad_free2_app/allowed_months (GET & POST) 성공', true);
  } catch (e) {
    log(`API: 허용 월 에러: ${e.message}`, false);
    allPassed = false;
  }

  // 3. API: 학생 검색 팝업
  try {
    const res = await fetch(`${BASE_URL}/api/af/ad_free2_app/applicant_search?name=%EA%B9%80`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.applicants)) throw new Error('Search failed');
    log(`API: /api/af/ad_free2_app/applicant_search 학생검색 성공 (${data.applicants.length}건 검색됨)`, true);
  } catch (e) {
    log(`API: 학생검색 에러: ${e.message}`, false);
    allPassed = false;
  }

  // 3-1. API: 수강자 가져오기 (늘봄과정 필터링)
  try {
    const importPayload = {
      targetMonth: '3월',
      maxAmount: 0,
      neulbomTypes: ['방과후', '맞춤형', '돌봄'],
      courseDivs: ['3월', '방과후 1기'],
      subsidyTypes: ['자유수강권', '1학년 지원금']
    };
    const importRes = await fetch(`${BASE_URL}/api/af/ad_free2_app/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(importPayload)
    });
    const importData = await importRes.json();
    if (!importData.success || typeof importData.count !== 'number') throw new Error('Import failed');
    log(`API: /api/af/ad_free2_app/import 늘봄과정 연동 수강자 가져오기 성공 (${importData.count}건 생성)`, true);
  } catch (e) {
    log(`API: 수강자 가져오기 에러: ${e.message}`, false);
    allPassed = false;
  }

  // 4. API: 엑셀 다운로드 6종 검증
  const excelEndpoints = [
    ['/af/ad_free2_app/excel', '검색결과출력 (BIN002D)'],
    ['/af/ad_free2_app/excel_all_collect', '전체징수현황출력'],
    ['/af/ad_free2_app/excel_monthly?month=3월', '월별현황출력 (BIN002C)'],
    ['/af/ad_free2_app/excel_banking?month=3월', '스쿨뱅킹현황출력 (BIN002A)'],
    ['/af/ad_free2_app/excel_admin?month=3월', '행정실용출력 (BIN0023)'],
    ['/af/ad_free2_app/excel_neis?month=3월', '나이스용출력']
  ];
  for (const [ep, desc] of excelEndpoints) {
    try {
      const res = await fetch(`${BASE_URL}${ep}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.arrayBuffer();
      if (buf.byteLength < 100) throw new Error('Buffer too small');
      const ct = res.headers.get('content-type') || '';
      const cd = res.headers.get('content-disposition') || '';
      log(`EXCEL: ${desc} (${ep}) 다운로드 확인 (크기: ${buf.byteLength} bytes)`, true);
    } catch (e) {
      log(`EXCEL: ${desc} 에러: ${e.message}`, false);
      allPassed = false;
    }
  }

  // 5. HTML DOM 검증
  try {
    const res = await fetch(`${BASE_URL}/af/ad_free2_app/lists/sn/3267`);
    const html = await res.text();

    if (!html.includes('id="panel_ad_free2_app"')) throw new Error('panel_ad_free2_app missing');
    if (!html.includes('sub_app_chk_all')) throw new Error('sub_app_chk_all missing');
    if (!html.includes('수강료') || !html.includes('징수금액') || !html.includes('지원금액')) throw new Error('18-col header missing');

    const btnTargets = [
      '지원금 내역 조회 허용',
      '수강자등록',
      '수강자 가져오기',
      '검색결과출력',
      '전체징수현황',
      '월별현황',
      '스쿨뱅킹현황',
      '행정실용',
      '나이스용',
      '선택삭제'
    ];
    for (const bName of btnTargets) {
      if (!html.includes(bName)) throw new Error(`Button [${bName}] missing in HTML`);
      log(`DOM: 공식 부트스트랩 버튼 [${bName}] 배치 확인`, true);
    }

    const modals = [
      ['modal_sub_app_allow_months', '지원금 조회 허용 월 설정'],
      ['modal_sub_app_register', '수강자 등록'],
      ['modal_sub_app_search_student', '수강자 검색 팝업'],
      ['modal_sub_app_import', '수강자 가져오기'],
      ['modal_sub_app_monthly_status', '월별 지원금 정산'],
      ['modal_sub_app_schoolbanking', '스쿨뱅킹 파일 출력'],
      ['modal_sub_app_admin_office', '행정실용 파일 출력'],
      ['modal_sub_app_neis', '나이스용 파일 출력'],
      ['modal_sub_app_edit_row', '단건 수강료/지원금 수정']
    ];
    for (const [mid, mtitle] of modals) {
      if (!html.includes(`id="${mid}"`)) throw new Error(`Modal #${mid} missing in HTML`);
      const regex = new RegExp(`<div[^>]*id="${mid}"[^>]*style="([^"]*)"`);
      const match = html.match(regex);
      if (!match) throw new Error(`Modal #${mid} style tag not matched`);
      const style = match[1];
      if (!style.includes('position: fixed') && !style.includes('position:fixed')) throw new Error(`#{mid} missing position: fixed`);
      if (!style.includes('justify-content: center') && !style.includes('justify-content:center')) throw new Error(`#{mid} missing justify-content: center`);
      if (!style.includes('align-items: center') && !style.includes('align-items:center')) throw new Error(`#{mid} missing align-items: center`);
      log(`DOM: 모달 [#{mid}] (${mtitle}) 정중앙 표준 규격 확인`, true);
    }

    // 신규 수강자 가져오기 모달 필드 검증 (늘봄과정, 강좌구분, 정산지원금)
    const newFields = [
      ['sub_app_import_div_all', '강좌구분 전체선택'],
      ['sub_app_import_neulbom_all', '늘봄과정 전체선택'],
      ['sub_app_import_fund_all', '정산 지원금 전체선택']
    ];
    for (const [fid, fdesc] of newFields) {
      if (!html.includes(`id="${fid}"`)) throw new Error(`Import field #${fid} (${fdesc}) missing`);
      log(`DOM: 수강자 가져오기 [${fdesc}] 필드 확인`, true);
    }
  } catch (e) {
    log(`DOM: 수강자관리 페이지 검증 에러: ${e.message}`, false);
    allPassed = false;
  }

  console.log('='.repeat(60));
  if (allPassed) {
    console.log('\x1b[32m>>> 수강자관리 (/af/ad_free2_app) 100% 매핑 및 테스트 통과! <<<\x1b[0m');
  } else {
    console.log('\x1b[31m>>> 수강자관리 테스트 실패 발생! <<<\x1b[0m');
  }
  console.log('='.repeat(60));
  process.exit(allPassed ? 0 : 1);
}

runTests();
