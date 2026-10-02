const BASE_URL = 'http://localhost:3005';

function log(msg, ok = true) {
  const status = ok ? '\x1b[32m PASS \x1b[0m' : '\x1b[31m FAIL \x1b[0m';
  console.log(`[${status}] ${msg}`);
}

async function runTests() {
  let allPassed = true;
  console.log('='.repeat(60));
  console.log(' 4. 귀가일정표 (/af/ad_rsch/lists/sn/3267) 종합 테스트 시작');
  console.log('='.repeat(60));

  // 1. 엑셀 다운로드 (5대 원칙 프리미엄 서식)
  try {
    const res = await fetch(`${BASE_URL}/af/ad_rsch/excel/sn/3267`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    if (buf.byteLength < 500) throw new Error('Excel buffer too small');
    const ct = res.headers.get('content-type') || '';
    const text = new TextDecoder().decode(buf);
    
    // 5대 원칙 검증
    if (!text.includes('광주풍향초등학교 늘봄학교 귀가일정표')) throw new Error('Hero title missing');
    if (!text.includes('출력일시') || !text.includes('총 등록 인원')) throw new Error('Metadata summary bar missing');
    if (!text.includes('header-basic') || !text.includes('header-day')) throw new Error('Header color blocks missing');
    if (!text.includes('cell-zebra') || !text.includes('유다은')) throw new Error('Zebra data rows missing');
    if (!text.includes('총 귀가 인원 집계 (합계)')) throw new Error('Total summary row missing');

    log(`EXCEL: 귀가일정표 프리미엄 엑셀 5대 원칙 완비 확인 (크기: ${buf.byteLength} bytes)`, true);
  } catch (e) {
    log(`EXCEL: 귀가일정표 엑셀 다운로드 에러: ${e.message}`, false);
    allPassed = false;
  }

  // 2. 샘플 서식 다운로드
  try {
    const res = await fetch(`${BASE_URL}/af/ad_rsch/sample_excel`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (!text.includes('학년,반,번호,이름,요일,시간,귀가동행자,연락처,비고')) throw new Error('Sample CSV header missing');
    if (!text.includes('유다은')) throw new Error('Sample data row missing');
    log(`SAMPLE: 귀가일정 일괄입력 샘플 양식 (/af/ad_rsch/sample_excel) 확인`, true);
  } catch (e) {
    log(`SAMPLE: 샘플 다운로드 에러: ${e.message}`, false);
    allPassed = false;
  }

  // 3. HTML DOM 검증
  try {
    const res = await fetch(`${BASE_URL}/af/ad_rsch/lists/sn/3267`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    // 사이드바 메뉴 확인
    if (!html.includes('id="sub_ad_rsch_lists"')) throw new Error('Sidebar sub_ad_rsch_lists missing');
    if (!html.includes('귀가일정표')) throw new Error('Sidebar link text missing');
    log('DOM: 좌측 사이드바 [귀가일정표] 메뉴 및 라우팅 연결 확인', true);

    // 메인 패널 확인
    if (!html.includes('id="panel_ad_rsch_lists"')) throw new Error('panel_ad_rsch_lists missing');
    log('DOM: 귀가일정표 메인 패널 (#panel_ad_rsch_lists) 확인', true);

    // 검색 폼 컨트롤 확인
    const searchControls = ['rsch_sgr', 'rsch_scl', 'rsch_s_word', 'fm_rsch_search'];
    for (const sc of searchControls) {
      if (!html.includes(`id="${sc}"`)) throw new Error(`Search control #${sc} missing`);
    }
    log('DOM: 학년/반/이름 검색 폼 컨트롤 4종 확인', true);

    // 3대 주요 액션 버튼 확인
    const actionBtns = ['검색결과출력', '등록', '일괄입력'];
    for (const ab of actionBtns) {
      if (!html.includes(ab)) throw new Error(`Action button [${ab}] missing`);
      log(`DOM: 주요 액션 버튼 [${ab}] 확인`, true);
    }

    // 13열 메인 테이블 헤더 확인
    if (!html.includes('id="rschMainTable"') || !html.includes('id="rschTableTbody"')) {
      throw new Error('rschMainTable or rschTableTbody missing');
    }
    const days = ['월요일', '화요일', '수요일', '목요일', '금요일'];
    for (const d of days) {
      if (!html.includes(d)) throw new Error(`Table day header [${d}] missing`);
    }
    log('DOM: 메인 귀가일정표 13열 테이블 및 요일 헤더 확인', true);

    // 4대 모달 및 정중앙 CSS 규격 확인
    const modals = [
      ['modal_ad_rsch_write', '귀가일정 등록/수정 모달'],
      ['modal_ad_rsch_input', '귀가일정 일괄입력 모달'],
      ['modal_ad_rsch_stu_schedule', '학생 주간 시간표 상세 모달'],
      ['modal_ad_rsch_search_student', '학생 검색 모달']
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

    // 클라이언트 스크립트 연결 확인
    if (!html.includes('src="/af/ad_lec/lists/sn/rsch_logic.js"')) {
      throw new Error('rsch_logic.js script tag missing in HTML');
    }
    log('DOM: 클라이언트 스크립트 (rsch_logic.js) 로드 확인', true);

  } catch (e) {
    log(`DOM: 귀가일정표 페이지 검증 에러: ${e.message}`, false);
    allPassed = false;
  }

  console.log('='.repeat(60));
  if (allPassed) {
    console.log('\x1b[32m>>> 귀가일정표 (/af/ad_rsch) 100% 매핑 및 테스트 통과! <<<\x1b[0m');
  } else {
    console.log('\x1b[31m>>> 귀가일정표 테스트 실패 발생! <<<\x1b[0m');
  }
  console.log('='.repeat(60));
  process.exit(allPassed ? 0 : 1);
}

runTests();
