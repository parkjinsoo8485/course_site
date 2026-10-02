/**
 * =========================================================================================
 * [Automated Test Harness] Sprint 3 환경설정 파트 A (ad_cfg) 1:1 완벽 매핑 & 무결성 자동화 검증
 * - Field Diff Test: missing == 0 ?
 * - Tab Navigation & Modal Elements Check
 * - Client Script (cfg_logic.js) Functions Check
 * - Server API Endpoints (GET & POST 4 tabs) HTTP 200 Verification
 * =========================================================================================
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

async function runTest() {
  console.log('='.repeat(80));
  console.log('🚀 [Test Harness] Sprint 3 환경설정 (ad_cfg: main, tea, att, sms) 1:1 무결성 검증');
  console.log('='.repeat(80));

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  const htmlPath = path.resolve('course_site/af/ad_lec/lists/sn/index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // 1. 패널 및 탭 컨테이너 무결성 검증
  console.log('\n[1] 패널 및 4개 서브탭 컨테이너 구조 검증:');
  assert(html.includes('id="panel_ad_cfg_main"'), '통합 패널 (#panel_ad_cfg_main) 존재');
  assert(html.includes('id="cfg_pane_main"'), '기본설정 탭 패널 (#cfg_pane_main) 존재');
  assert(html.includes('id="cfg_pane_tea"'), '강사권한 탭 패널 (#cfg_pane_tea) 존재');
  assert(html.includes('id="cfg_pane_att"'), '출석부옵션 탭 패널 (#cfg_pane_att) 존재');
  assert(html.includes('id="cfg_pane_sms"'), '문자설정 탭 패널 (#cfg_pane_sms) 존재');

  // 2. 모달 검증
  console.log('\n[2] 서명 패드 및 관리자 검색 모달 검증:');
  assert(html.includes('id="modal_sign_pad"'), '서명 패드 모달 (#modal_sign_pad) 존재');
  assert(html.includes('id="sign_canvas"'), '서명 캔버스 (#sign_canvas) 존재');
  assert(html.includes('id="modal_admin_search"'), '교직원 검색 모달 (#modal_admin_search) 존재');
  assert(html.includes('id="admin_search_tbody"'), '교직원 검색 테이블 바디 (#admin_search_tbody) 존재');

  // 3. 타깃 1:1 필수 필드 전수 Diff 검증 (Zero-Omission Standard)
  console.log('\n[3] 타깃 1:1 원본 폼 및 필수 속성 전수 매핑 검증:');
  const requiredFields = [
    // main
    'titleNum_0', 'titleNum_1', 'titleNum_2', 'titleNum_3',
    'addAdminList', 'defLecDiv', 'defLecProType',
    'useRtnSch_Y', 'useRtnSch_N', 'useRtnSchT',
    'useAbs_Y', 'useAbs_N', 'useAbsType2', 'useAbsT',
    // tea
    'allowViWaitLec_Y', 'allowViWaitLec_N',
    'allowWrLec_Y', 'allowWrLec_N',
    'allowViAllLec_Y', 'allowViAllLec_N',
    'allowWrSin_Y', 'allowWrSin_N', 'allowWrSin1', 'allowWrSin2',
    'allowDelSin_Y', 'allowDelSin_N',
    'allowMoveSin_Y', 'allowMoveSin_N',
    'allowPayModify_Y', 'allowPayModify_N',
    'allowHpView_Y', 'allowHpView_N', 'allowHpEdit',
    // att
    'attApp1', 'sign_data1', 'sign_preview1',
    'attApp2', 'sign_data2', 'sign_preview2',
    'attApp3', 'sign_data3', 'sign_preview3',
    'attApp4', 'sign_data4', 'sign_preview4',
    // sms
    'smsUse_Y', 'smsUse_N',
    'smsBoTxt', 'smsDefNum', 'smsAmHour', 'smsPmHour',
    'smsAlTeaAt_Y', 'smsAlTeaAt_N', 'smsAlTeaLec_Y', 'smsAlTeaLec_N'
  ];

  const missingFields = requiredFields.filter(f => !html.includes(f));
  assert(missingFields.length === 0, `모든 48개 타깃 필수 필드 완벽 매핑 (missing: [${missingFields.join(', ')}])`);

  // 4. 클라이언트 스크립트 (cfg_logic.js) 로드 및 함수 검증
  console.log('\n[4] 클라이언트 스크립트 (cfg_logic.js) 함수 바인딩 검증:');
  assert(html.includes('src="/af/ad_lec/lists/sn/cfg_logic.js"'), 'index.html 내 cfg_logic.js 로드 태그 확인');

  const jsPath = path.resolve('course_site/af/ad_lec/lists/sn/cfg_logic.js');
  const jsContent = fs.readFileSync(jsPath, 'utf8');
  const expectedFns = [
    'switchCfgTab',
    'chk_wr_sin1',
    'chk_hp_view',
    'chk_allow_tea',
    'show_sign_modal',
    'closeSignModal',
    'applySignFromCanvas',
    'clear_sign',
    'cancel_sign',
    'openMemWin',
    'searchTeachersForAdmin',
    'addSelectedTeacherToAdmin',
    'delAddMem',
    'submitCfgForm',
    'checkInitialCfgRoute'
  ];

  const missingFns = expectedFns.filter(fn => !jsContent.includes(fn));
  assert(missingFns.length === 0, `모든 15개 클라이언트 함수 구현 완료 (missing: [${missingFns.join(', ')}])`);

  // 5. 서버 API 엔드포인트 HTTP 검증
  console.log('\n[5] 서버 API 엔드포인트 HTTP 200 및 기능 검증:');

  function requestHttp(method, path, body = null) {
    return new Promise((resolve) => {
      const options = {
        hostname: 'localhost',
        port: 3005,
        path: path,
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          let json = null;
          try { json = JSON.parse(data); } catch(e) {}
          resolve({ status: res.statusCode, data, json });
        });
      });

      req.on('error', (e) => resolve({ status: 500, error: e.message }));
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }

  // GET 설정 조회
  const rGet = await requestHttp('GET', '/api/ad_cfg/data/sn/3267');
  assert(rGet.status === 200 && rGet.json && rGet.json.success, 'GET /api/ad_cfg/data/sn/3267 정상 응답');

  // POST 기본설정 저장
  const rMain = await requestHttp('POST', '/api/ad_cfg/save/main', { titleNum: '1', div1_sel: '26년 8월' });
  assert(rMain.status === 200 && rMain.json && rMain.json.tabName === '기본설정', 'POST /api/ad_cfg/save/main 정상 저장');

  // POST 강사권한 저장
  const rTea = await requestHttp('POST', '/api/ad_cfg/save/tea', { allowWrLec: 'Y', allowHpView: 'Y' });
  assert(rTea.status === 200 && rTea.json && rTea.json.tabName === '강사권한', 'POST /api/ad_cfg/save/tea 정상 저장');

  // POST 출석부옵션 저장
  const rAtt = await requestHttp('POST', '/api/ad_cfg/save/att', { attApp1: '교무부장', attApp2: '교감' });
  assert(rAtt.status === 200 && rAtt.json && rAtt.json.tabName === '출석부옵션', 'POST /api/ad_cfg/save/att 정상 저장');

  // POST 문자설정 저장
  const rSms = await requestHttp('POST', '/api/ad_cfg/save/sms', { smsUse: 'Y', smsBoTxt: '광주풍향초등학교 늘봄학교' });
  assert(rSms.status === 200 && rSms.json && rSms.json.tabName === '문자설정', 'POST /api/ad_cfg/save/sms 정상 저장');

  console.log('\n' + '='.repeat(80));
  if (passedTests === totalTests) {
    console.log(`🎉 [SUCCESS] 모든 테스트 통과! (${passedTests}/${totalTests} PASS)`);
    console.log('Sprint 3 환경설정 파트 A (기본설정, 강사권한, 출석부옵션, 문자설정) 100% 무결성 검증 완료!');
    console.log('='.repeat(80));
    process.exit(0);
  } else {
    console.error(`⚠️ [FAILED] 일부 테스트 실패 (${passedTests}/${totalTests} PASS)`);
    console.log('='.repeat(80));
    process.exit(1);
  }
}

runTest();
