const BASE_URL = 'http://localhost:3005';

function log(msg, ok = true) {
  const status = ok ? '\x1b[32m PASS \x1b[0m' : '\x1b[31m FAIL \x1b[0m';
  console.log(`[${status}] ${msg}`);
}

async function runTests() {
  let allPassed = true;
  console.log('='.repeat(60));
  console.log(' 3. 순위구분설정 (/af/ad_free2_cfg/free1/sn/3267) 종합 테스트 시작');
  console.log('='.repeat(60));

  // 1. API: 순위 목록 조회
  try {
    const res = await fetch(`${BASE_URL}/api/af/ad_free2_cfg/free1`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.ranks)) throw new Error('data.ranks missing');
    log(`API: /api/af/ad_free2_cfg/free1 조회 성공 (${data.ranks.length}개 순위 코드 반환)`, true);
  } catch (e) {
    log(`API: 순위 목록 조회 에러: ${e.message}`, false);
    allPassed = false;
  }

  // 2. API: 신규 순위 등록 (POST), 수정 (PUT), 삭제 (DELETE) CRUD
  let createdId = null;
  try {
    // POST
    const createPayload = {
      rankNumber: 1,
      name: '하네스테스트용 국민기초생활수급자',
      limitAmount: 600000,
      isPriority: true,
      used: '사용',
      note: '자동화 테스트용 코드'
    };
    const postRes = await fetch(`${BASE_URL}/api/af/ad_free2_cfg/free1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createPayload)
    });
    const postData = await postRes.json();
    if (!postData.success || !postData.rank) throw new Error('Create failed');
    createdId = postData.rank.id;
    log(`API: 순위 코드 생성 (POST) 성공 (ID: ${createdId})`, true);

    // PUT
    const updatePayload = {
      rankNumber: 1,
      name: '하네스테스트용 국민기초생활수급자 (수정됨)',
      limitAmount: 700000,
      isPriority: true,
      used: '사용',
      note: '수정 확인'
    };
    const putRes = await fetch(`${BASE_URL}/api/af/ad_free2_cfg/free1/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });
    const putData = await putRes.json();
    if (!putData.success || putData.rank.name !== '하네스테스트용 국민기초생활수급자 (수정됨)') throw new Error('Update failed');
    log('API: 순위 코드 수정 (PUT) 성공', true);

    // DELETE
    const delRes = await fetch(`${BASE_URL}/api/af/ad_free2_cfg/free1/${createdId}`, {
      method: 'DELETE'
    });
    const delData = await delRes.json();
    if (!delData.success) throw new Error('Delete failed');
    log('API: 순위 코드 삭제 (DELETE) 성공', true);
  } catch (e) {
    log(`API: 순위 CRUD 에러: ${e.message}`, false);
    allPassed = false;
  }

  // 3. HTML DOM 검증
  try {
    const res = await fetch(`${BASE_URL}/af/ad_free2_cfg/free1/sn/3267`);
    const html = await res.text();

    if (!html.includes('id="panel_ad_free2_cfg_free1"')) throw new Error('panel_ad_free2_cfg_free1 missing');

    const cols = ['연번', '순위', '사용여부', '순위 구분 코드명', '지원한도', '우선배정', '순서', '비고', '관리'];
    for (const col of cols) {
      if (!html.includes(col)) throw new Error(`Table column [${col}] missing`);
    }
    log('DOM: 9열 테이블 컬럼 완비 확인', true);

    const tabs = ['tab_rank_all', 'tab_rank_1', 'tab_rank_2', 'tab_rank_3', 'tab_rank_4', 'tab_rank_5'];
    for (const t of tabs) {
      if (!html.includes(`id="${t}"`)) throw new Error(`Tab #${t} missing`);
    }
    log('DOM: 순위 필터 탭 6종 완비 확인', true);

    if (!html.includes('openCreateSubsidyRankModal()')) throw new Error('openCreateSubsidyRankModal button missing');
    if (!html.includes('id="modal_subsidy_rank_form"')) throw new Error('modal_subsidy_rank_form missing');

    const mMatch = html.match(/<div[^>]*id="modal_subsidy_rank_form"[^>]*style="([^"]*)"/);
    if (!mMatch) throw new Error('modal style tag not matched');
    const style = mMatch[1];
    if (!style.includes('position: fixed') && !style.includes('position:fixed')) throw new Error('missing position: fixed');
    if (!style.includes('justify-content: center') && !style.includes('justify-content:center')) throw new Error('missing justify-content: center');
    if (!style.includes('align-items: center') && !style.includes('align-items:center')) throw new Error('missing align-items: center');
    log('DOM: 모달 [#modal_subsidy_rank_form] 정중앙 표준 규격 확인', true);
  } catch (e) {
    log(`DOM: 순위구분설정 페이지 검증 에러: ${e.message}`, false);
    allPassed = false;
  }

  console.log('='.repeat(60));
  if (allPassed) {
    console.log('\x1b[32m>>> 순위구분설정 (/af/ad_free2_cfg/free1) 100% 매핑 및 테스트 통과! <<<\x1b[0m');
  } else {
    console.log('\x1b[31m>>> 순위구분설정 테스트 실패 발생! <<<\x1b[0m');
  }
  console.log('='.repeat(60));
  process.exit(allPassed ? 0 : 1);
}

runTests();
