const BASE_URL = 'http://localhost:3005';

function log(msg, ok = true) {
  const status = ok ? '\x1b[32m PASS \x1b[0m' : '\x1b[31m FAIL \x1b[0m';
  console.log(`[${status}] ${msg}`);
}

async function runTests() {
  let allPassed = true;
  console.log('='.repeat(60));
  console.log(' 2. 지원금설정 (/af/ad_free2_cfg/main/sn/3267) 종합 테스트 시작');
  console.log('='.repeat(60));

  // 1. API: 설정 조회
  try {
    const res = await fetch(`${BASE_URL}/api/af/ad_free2_cfg/main`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('data.success !== true');
    if (!data.configs || !data.configs.fund_1 || !data.configs.fund_3 || !data.configs.fund_free) throw new Error('configs incomplete');
    if (!Array.isArray(data.order)) throw new Error('order is not array');
    log('API: /api/af/ad_free2_cfg/main 조회 성공 (3종 지원금 설정 및 차감 순서 반환)', true);
  } catch (e) {
    log(`API: 지원금 설정 조회 에러: ${e.message}`, false);
    allPassed = false;
  }

  // 2. API: 설정 저장 (PUT)
  try {
    const payload = {
      fundKey: 'fund_1',
      configData: {
        name: '1학년 지원금 (하네스테스트)',
        used: '사용',
        deductMode: '잔여 금액에서 차감',
        months: ['3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월', '1월', '2월'],
        items: { tuition: true, noTuitionFee: false, textbook: true, material: true },
        monthlyLimit: 720000,
        annualLimit: 720000,
        priority: 2
      }
    };
    const res = await fetch(`${BASE_URL}/api/af/ad_free2_cfg/main`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const putRes = await res.json();
    if (!putRes.success || putRes.config.name !== '1학년 지원금 (하네스테스트)') throw new Error('PUT failed');
    log('API: /api/af/ad_free2_cfg/main PUT 저장 성공', true);

    // 복구
    payload.configData.name = '1학년 지원금';
    await fetch(`${BASE_URL}/api/af/ad_free2_cfg/main`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    log(`API: 설정 저장 에러: ${e.message}`, false);
    allPassed = false;
  }

  // 3. API: 차감 순서 변경 (POST)
  try {
    const newOrder = [
      { id: 'fund_free', name: '자유수강권', order: 1 },
      { id: 'fund_1', name: '1학년 지원금', order: 2 },
      { id: 'fund_3', name: '3학년 지원금', order: 3 }
    ];
    const res = await fetch(`${BASE_URL}/api/af/ad_free2_cfg/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderList: newOrder })
    });
    const postRes = await res.json();
    if (!postRes.success) throw new Error('Order update failed');
    log('API: /api/af/ad_free2_cfg/order POST 차감순서 저장 성공', true);
  } catch (e) {
    log(`API: 차감 순서 저장 에러: ${e.message}`, false);
    allPassed = false;
  }

  // 4. HTML DOM 검증
  try {
    const res = await fetch(`${BASE_URL}/af/ad_free2_cfg/main/sn/3267`);
    const html = await res.text();

    if (!html.includes('id="panel_ad_free2_cfg_main"')) throw new Error('panel_ad_free2_cfg_main missing');
    if (!html.includes('id="tab_fund_1"') || !html.includes('id="tab_fund_3"') || !html.includes('id="tab_fund_free"')) {
      throw new Error('3 subsidy tabs missing');
    }
    log('DOM: 3개 지원금 탭 버튼 배치 확인', true);

    const formElements = [
      'id="sub_cfg_name"',
      'id="sub_cfg_used_y"',
      'id="sub_cfg_used_n"',
      'id="sub_cfg_mode_rem"',
      'id="sub_cfg_mode_fix"',
      'id="sub_cfg_item_tuition"',
      'id="sub_cfg_item_nofee"',
      'id="sub_cfg_item_textbook"',
      'id="sub_cfg_item_material"',
      'id="sub_cfg_month_limit"',
      'id="sub_cfg_annual_limit"',
      'id="sub_cfg_priority"'
    ];
    for (const fe of formElements) {
      if (!html.includes(fe)) throw new Error(`Form element ${fe} missing`);
    }
    log('DOM: 지원금 상세 설정 폼 필드 12종 완비 확인', true);

    if (!html.includes('openSubsidyOrderModal()')) throw new Error('openSubsidyOrderModal missing');
    if (!html.includes('id="modal_subsidy_order_change"')) throw new Error('modal_subsidy_order_change missing');

    const mMatch = html.match(/<div[^>]*id="modal_subsidy_order_change"[^>]*style="([^"]*)"/);
    if (!mMatch) throw new Error('modal style tag not matched');
    const style = mMatch[1];
    if (!style.includes('position: fixed') && !style.includes('position:fixed')) throw new Error('missing position: fixed');
    if (!style.includes('justify-content: center') && !style.includes('justify-content:center')) throw new Error('missing justify-content: center');
    if (!style.includes('align-items: center') && !style.includes('align-items:center')) throw new Error('missing align-items: center');
    log('DOM: 모달 [#modal_subsidy_order_change] 정중앙 표준 규격 확인', true);

    if (!html.includes('height:30px') && !html.includes('height: 30px')) throw new Error('missing height: 30px');
    log('DOM: 부트스트랩 버튼 표준 규격 (height:30px) 확인', true);
  } catch (e) {
    log(`DOM: 지원금설정 페이지 검증 에러: ${e.message}`, false);
    allPassed = false;
  }

  console.log('='.repeat(60));
  if (allPassed) {
    console.log('\x1b[32m>>> 지원금설정 (/af/ad_free2_cfg/main) 100% 매핑 및 테스트 통과! <<<\x1b[0m');
  } else {
    console.log('\x1b[31m>>> 지원금설정 테스트 실패 발생! <<<\x1b[0m');
  }
  console.log('='.repeat(60));
  process.exit(allPassed ? 0 : 1);
}

runTests();
