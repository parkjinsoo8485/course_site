/**
 * =========================================================================================
 * 결석/귀가신청 (/af/ad_abs/lists/sn/3267) 종합 자동화 테스트 하네스
 * 1. 엑셀 다운로드 엔드포인트 5대 원칙 프리미엄 검증 (/af/ad_abs/excel/sn/3267)
 * 2. 사이드바 메뉴 및 메인 패널 (#panel_ad_abs_lists) 검증
 * 3. 학년/반/신청유형/이름 검색 폼 컨트롤 검증
 * 4. 주요 액션 버튼 [검색결과출력], [등록] 규격 검증
 * 5. 메인 결석/귀가신청 13열 테이블 헤더 검증
 * 6. 등록/수정 모달 (#modal_ad_abs_write) 정중앙 데드센터 CSS 및 폼 필드 7종 검증
 * 7. 클라이언트 스크립트 (abs_logic.js) 로드 검증
 * =========================================================================================
 */

const BASE_URL = 'http://localhost:3005';

function log(msg, pass = true) {
  const badge = pass ? '\x1b[32m[ PASS ]\x1b[0m' : '\x1b[31m[ FAIL ]\x1b[0m';
  console.log(`${badge} ${msg}`);
}

async function runTests() {
  console.log('='.repeat(60));
  console.log(' 5. 결석/귀가신청 (/af/ad_abs/lists/sn/3267) 종합 테스트 시작');
  console.log('='.repeat(60));

  let allPassed = true;

  // 1. 엑셀 다운로드 엔드포인트 5대 원칙 프리미엄 검증
  try {
    const res = await fetch(`${BASE_URL}/af/ad_abs/excel/sn/3267`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const excelText = await res.text();
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/vnd.ms-excel') && !contentType.includes('html')) {
      throw new Error(`Invalid content-type: ${contentType}`);
    }

    // 5대 원칙 키워드 검증
    const principles = [
      ['hero-title', '원칙 1: Hero Title (대제목 타이틀)'],
      ['meta-bar', '원칙 2: Metadata Summary Bar (메타 요약 배너)'],
      ['header-type', '원칙 3: Header Color-Coding (유형별 파스텔 헤더)'],
      ['cell-zebra', '원칙 4: Data Readability (지브라 스트라이프)'],
      ['total-row', '원칙 5: Total Summary Row (하단 총 결산 행)']
    ];

    for (const [kw, desc] of principles) {
      if (!excelText.includes(kw)) throw new Error(`${desc} missing in Excel template`);
    }
    log(`EXCEL: 결석/귀가신청 프리미엄 엑셀 5대 원칙 완비 확인 (크기: ${excelText.length} bytes)`, true);

  } catch (e) {
    log(`EXCEL: 엔드포인트 검증 실패: ${e.message}`, false);
    allPassed = false;
  }

  // 2. 메인 페이지 DOM 구조 및 요소 정밀 검증
  try {
    const res = await fetch(`${BASE_URL}/af/ad_abs/lists/sn/3267`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    // 사이드바 메뉴 확인
    if (!html.includes('id="sub_ad_abs_lists"')) throw new Error('Sidebar sub_ad_abs_lists missing');
    if (!html.includes('결석/귀가신청')) throw new Error('Sidebar link text missing');
    log('DOM: 좌측 사이드바 [결석/귀가신청] 메뉴 및 라우팅 연결 확인', true);

    // 메인 패널 확인
    if (!html.includes('id="panel_ad_abs_lists"')) throw new Error('panel_ad_abs_lists missing');
    log('DOM: 결석/귀가신청 메인 패널 (#panel_ad_abs_lists) 확인', true);

    // 검색 폼 컨트롤 확인
    const searchControls = ['abs_sgr', 'abs_scl', 'abs_sin_type', 'abs_s_word', 'fm_abs_search'];
    for (const sc of searchControls) {
      if (!html.includes(`id="${sc}"`)) throw new Error(`Search control #${sc} missing`);
    }
    log('DOM: 학년/반/신청유형/이름 검색 폼 컨트롤 5종 확인', true);

    // 주요 액션 버튼 확인
    const actionBtns = ['검색결과출력', '등록'];
    for (const ab of actionBtns) {
      if (!html.includes(ab)) throw new Error(`Action button [${ab}] missing`);
      log(`DOM: 주요 액션 버튼 [${ab}] 확인`, true);
    }

    // 13열 메인 테이블 헤더 확인
    if (!html.includes('id="absMainTable"') || !html.includes('id="absTableTbody"')) {
      throw new Error('absMainTable or absTableTbody missing');
    }
    const thHeaders = ['연번', '수정', '학년', '반', '번호', '이름', '신청유형', '일자(시간)', '사유', '귀가 동행자', '연락처', '등록일자', '삭제'];
    for (const th of thHeaders) {
      if (!html.includes(th)) throw new Error(`Table column header [${th}] missing`);
    }
    log('DOM: 메인 결석/귀가신청 13열 테이블 컬럼 전수 확인', true);

    // 모달 및 정중앙 CSS 규격 확인
    const mid = 'modal_ad_abs_write';
    if (!html.includes(`id="${mid}"`)) throw new Error(`Modal #${mid} missing in HTML`);
    const regex = new RegExp(`<div[^>]*id="${mid}"[^>]*style="([^"]*)"`);
    const match = html.match(regex);
    if (!match) throw new Error(`Modal #${mid} style tag not matched`);
    const style = match[1];
    if (!style.includes('position: fixed') && !style.includes('position:fixed')) throw new Error(`#{mid} missing position: fixed`);
    if (!style.includes('justify-content: center') && !style.includes('justify-content:center')) throw new Error(`#{mid} missing justify-content: center`);
    if (!style.includes('align-items: center') && !style.includes('align-items:center')) throw new Error(`#{mid} missing align-items: center`);
    log(`DOM: 모달 [#${mid}] (결석/귀가신청 등록/수정 모달) 정중앙 데드센터 표준 규격 확인`, true);

    // 모달 내부 필수 폼 필드 확인
    const modalFields = [
      'abs_mem_info', 'abs_mem_num', 'sin_type_1', 'sin_type_2', 'sin_date',
      'sin_time_hour', 'sin_time_min', 'sin_content', 'guardian', 'guardian_tel_1'
    ];
    for (const mf of modalFields) {
      if (!html.includes(`id="${mf}"`)) throw new Error(`Modal field #${mf} missing`);
    }
    log('DOM: 모달 내부 신청유형/학생정보/일자/시간/사유/동행자 필드 전수 확인', true);

    // 클라이언트 스크립트 연결 확인
    if (!html.includes('src="/af/ad_lec/lists/sn/abs_logic.js"')) {
      throw new Error('abs_logic.js script tag missing in HTML');
    }
    log('DOM: 클라이언트 스크립트 (abs_logic.js) 로드 확인', true);

  } catch (e) {
    log(`DOM: 결석/귀가신청 페이지 검증 에러: ${e.message}`, false);
    allPassed = false;
  }

  console.log('='.repeat(60));
  if (allPassed) {
    console.log('\x1b[32m>>> 결석/귀가신청 (/af/ad_abs) 100% 매핑 및 테스트 통과! <<<\x1b[0m');
  } else {
    console.log('\x1b[31m>>> 결석/귀가신청 테스트 실패 발생! <<<\x1b[0m');
  }
  console.log('='.repeat(60));
  process.exit(allPassed ? 0 : 1);
}

runTests();
