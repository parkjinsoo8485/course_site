/**
 * =========================================================================================
 * [Automated Test Harness] Sprint 4 환경설정 파트 B 1:1 완벽 매핑 & 무결성 자동화 검증
 * - Field Diff Test: missing == 0 ?
 * - 7 Submodel Panels & 4 Sub-Modals Structure Check
 * - Client Script (cfg_part_b_logic.js) Functions Check
 * - Server API Endpoints (GET & POST 16 endpoints + Excel) HTTP 200 Verification
 * =========================================================================================
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

async function runTest() {
  console.log('='.repeat(85));
  console.log('🚀 [Test Harness] Sprint 4 환경설정 파트 B (운영 규칙 및 연동 7종) 1:1 무결성 검증');
  console.log('='.repeat(85));

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

  // 1. 7개 서브모델 패널 컨테이너 검증
  console.log('\n[1] 7개 서브모델 패널 컨테이너 구조 검증:');
  assert(html.includes('id="panel_ad_time_lists"'), '1. 신청기간 설정 패널 (#panel_ad_time_lists) 존재');
  assert(html.includes('id="panel_ad_cfg_period"'), '2. 강의시간 설정 패널 (#panel_ad_cfg_period) 존재');
  assert(html.includes('id="panel_ad_cfg_afDiv"'), '3. 강좌구분 설정 패널 (#panel_ad_cfg_afDiv) 존재');
  assert(html.includes('id="panel_ad_cfg_appLiGrp"'), '4. 중복제한그룹 설정 패널 (#panel_ad_cfg_appLiGrp) 존재');
  assert(html.includes('id="panel_ad_verify_main"'), '5. 학적검증 패널 (#panel_ad_verify_main) 존재');
  assert(html.includes('id="panel_ad_neis_edufine_lists"'), '6. 나이스/에듀파인 설정 패널 (#panel_ad_neis_edufine_lists) 존재');
  assert(html.includes('id="panel_ad_cfg_message"'), '7. 안내글설정 패널 (#panel_ad_cfg_message) 존재');
  assert(html.includes('id="panel_ad_cfg_clear"'), '8. 데이터 초기화 패널 (#panel_ad_cfg_clear) 존재');
  assert(html.includes('id="panel_ad_info_modify"'), '9. 담당자정보 패널 (#panel_ad_info_modify) 존재');

  // 2. 4개 서브 모달 검증
  console.log('\n[2] 전용 팝업 모달 4종 검증:');
  assert(html.includes('id="modal_period_edit"'), '교시 등록/수정 모달 (#modal_period_edit) 존재');
  assert(html.includes('id="modal_afdiv_edit"'), '강좌구분 등록/수정 모달 (#modal_afdiv_edit) 존재');
  assert(html.includes('id="modal_appligrp_edit"'), '중복제한그룹 등록/수정 모달 (#modal_appligrp_edit) 존재');
  assert(html.includes('id="modal_appligrp_courses"'), '소속 강좌 매핑 모달 (#modal_appligrp_courses) 존재');

  // 3. 타깃 1:1 필수 필드 전수 Diff 검증 (Zero-Omission Standard)
  console.log('\n[3] 타깃 1:1 필수 입력/선택 필드 전수 매핑 검증:');
  const requiredFields = [
    // 1. time
    'time_div1_sel', 'time_app_start', 'time_app_end', 'time_cancel_start', 'time_cancel_end', 'time_max_apply', 'time_grade_tbody',
    // 2. period
    'period_list_tbody', 'period_name', 'period_start_time', 'period_end_time', 'period_duration',
    // 3. afdiv
    'afdiv_list_tbody', 'afdiv_code', 'afdiv_name',
    // 4. appligrp
    'appligrp_list_tbody', 'appligrp_code', 'appligrp_name', 'appligrp_max', 'assign_courses_tbody',
    // 5. verify
    'verify_stat_total', 'verify_stat_apps', 'verify_stat_matched', 'verify_stat_mismatched', 'verify_list_tbody', 'btn_run_verify',
    // 6. neis & edufine
    'neis_mapping_tbody', 'edufine_year', 'edufine_org_code', 'edufine_income_code', 'edufine_bank_code', 'edufine_term_round',
    // 7. message, clear, info
    'msg_apply_top', 'msg_refund_guide', 'msg_abs_guide', 'msg_mobile_push',
    'clear_confirm_text',
    'info_dept_name', 'info_manager_name', 'info_tel_office', 'info_tel_hp', 'info_email', 'info_work_hours'
  ];

  const missingFields = requiredFields.filter(f => !html.includes(f));
  assert(missingFields.length === 0, `모든 38개 타깃 필수 필드 완벽 매핑 (missing: [${missingFields.join(', ')}])`);

  // 4. 클라이언트 스크립트 (cfg_part_b_logic.js) 로드 및 함수 검증
  console.log('\n[4] 클라이언트 스크립트 (cfg_part_b_logic.js) 함수 바인딩 검증:');
  assert(html.includes('src="/af/ad_lec/lists/sn/cfg_part_b_logic.js"'), 'index.html 내 cfg_part_b_logic.js 로드 태그 확인');

  const jsPath = path.resolve('course_site/af/ad_lec/lists/sn/cfg_part_b_logic.js');
  const jsContent = fs.readFileSync(jsPath, 'utf8');
  const expectedFns = [
    'loadApplyPeriods', 'saveApplyPeriods',
    'loadPeriods', 'savePeriodForm', 'deletePeriod', 'batchGenerateDefaultPeriods',
    'loadAfDivisions', 'saveAfDivForm', 'deleteAfDiv',
    'loadRestrictionGroups', 'saveAppLiGrpForm', 'deleteAppLiGrp', 'openAssignCoursesModal', 'saveAssignedCourses',
    'loadAcademicVerification', 'runAcademicVerification', 'syncSelectedVerifyStudents', 'exportVerifyExcel',
    'loadNeisEdufineSettings', 'saveNeisMapping', 'saveEdufineSettings', 'switchNeisTab',
    'loadNoticeSettings', 'saveNoticeSettings',
    'loadManagerInfo', 'saveManagerInfo', 'executeSystemDataClear'
  ];

  const missingFns = expectedFns.filter(fn => !jsContent.includes(fn));
  assert(missingFns.length === 0, `모든 26개 클라이언트 함수 구현 완료 (missing: [${missingFns.join(', ')}])`);

  // 5. 서버 API 엔드포인트 HTTP 검증
  console.log('\n[5] 서버 API 엔드포인트 HTTP 200 및 기능 검증:');

  function requestHttp(method, reqPath, body = null) {
    return new Promise((resolve) => {
      const options = {
        hostname: 'localhost',
        port: 3005,
        path: reqPath,
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
          resolve({ status: res.statusCode, data, json, headers: res.headers });
        });
      });

      req.on('error', (e) => resolve({ status: 500, error: e.message }));
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }

  // 1. 신청기간
  const rTimeGet = await requestHttp('GET', '/api/ad_time/data/sn/3267');
  assert(rTimeGet.status === 200 && rTimeGet.json && rTimeGet.json.success, 'GET /api/ad_time/data/sn/3267 정상 응답');
  const rTimeSave = await requestHttp('POST', '/api/ad_time/save', { semester: '2026-1', maxApplyCount: 4 });
  assert(rTimeSave.status === 200 && rTimeSave.json && rTimeSave.json.success, 'POST /api/ad_time/save 정상 저장');

  // 2. 강의시간
  const rPeriodGet = await requestHttp('GET', '/api/ad_cfg/period/data/sn/3267');
  assert(rPeriodGet.status === 200 && rPeriodGet.json && rPeriodGet.json.data.length > 0, 'GET /api/ad_cfg/period/data/sn/3267 정상 응답');
  const rPeriodSave = await requestHttp('POST', '/api/ad_cfg/period/save', { name: '테스트교시', startTime: '17:10', endTime: '17:50' });
  assert(rPeriodSave.status === 200 && rPeriodSave.json && rPeriodSave.json.success, 'POST /api/ad_cfg/period/save 정상 저장');

  // 3. 강좌구분
  const rAfDivGet = await requestHttp('GET', '/api/ad_cfg/afdiv/data/sn/3267');
  assert(rAfDivGet.status === 200 && rAfDivGet.json && rAfDivGet.json.data.length > 0, 'GET /api/ad_cfg/afdiv/data/sn/3267 정상 응답');
  const rAfDivSave = await requestHttp('POST', '/api/ad_cfg/afdiv/save', { code: '99', name: '특별체험과정', isUsed: 'Y' });
  assert(rAfDivSave.status === 200 && rAfDivSave.json && rAfDivSave.json.success, 'POST /api/ad_cfg/afdiv/save 정상 저장');

  // 4. 중복제한그룹
  const rGrpGet = await requestHttp('GET', '/api/ad_cfg/appligrp/data/sn/3267');
  assert(rGrpGet.status === 200 && rGrpGet.json && rGrpGet.json.data.length > 0, 'GET /api/ad_cfg/appligrp/data/sn/3267 정상 응답');
  const rGrpAssign = await requestHttp('POST', '/api/ad_cfg/appligrp/assign_courses', { grpId: 1, courseIds: [101, 102, 103] });
  assert(rGrpAssign.status === 200 && rGrpAssign.json && rGrpAssign.json.success, 'POST /api/ad_cfg/appligrp/assign_courses 정상 매핑');

  // 5. 학적검증 & 엑셀
  const rVerifyGet = await requestHttp('GET', '/api/ad_verify/data/sn/3267');
  assert(rVerifyGet.status === 200 && rVerifyGet.json && rVerifyGet.json.stats, 'GET /api/ad_verify/data/sn/3267 정상 통계 응답');
  const rVerifyRun = await requestHttp('POST', '/api/ad_verify/run', { sn: '3267' });
  assert(rVerifyRun.status === 200 && rVerifyRun.json && rVerifyRun.json.checkedCount > 0, 'POST /api/ad_verify/run 정상 검증 완료');
  const rVerifyExcel = await requestHttp('GET', '/af/ad_verify/excel/sn/3267');
  assert(rVerifyExcel.status === 200 && rVerifyExcel.headers['content-type'].includes('ms-excel') && rVerifyExcel.data.includes('학적검증 리포트'), 'GET /af/ad_verify/excel/sn/3267 프리미엄 엑셀 출력 검증');

  // 6. 나이스/에듀파인 설정
  const rNeisGet = await requestHttp('GET', '/api/ad_neis_edufine/data/sn/3267');
  assert(rNeisGet.status === 200 && rNeisGet.json && rNeisGet.json.data.neisList, 'GET /api/ad_neis_edufine/data/sn/3267 정상 응답');
  const rNeisSave = await requestHttp('POST', '/api/ad_neis_edufine/save_mapping', { mappings: [{ id: 101, neisCode: 'NEIS_2026_01', neisName: '창의과학(로봇)' }] });
  assert(rNeisSave.status === 200 && rNeisSave.json && rNeisSave.json.success, 'POST /api/ad_neis_edufine/save_mapping 정상 저장');
  const rEdufineSave = await requestHttp('POST', '/api/ad_neis_edufine/save_edufine', { fiscalYear: '2026', orgCode: 'G100003267' });
  assert(rEdufineSave.status === 200 && rEdufineSave.json && rEdufineSave.json.success, 'POST /api/ad_neis_edufine/save_edufine 정상 저장');

  // 7. 안내글, 초기화, 담당자정보
  const rMsgGet = await requestHttp('GET', '/api/ad_cfg/message/data/sn/3267');
  assert(rMsgGet.status === 200 && rMsgGet.json && rMsgGet.json.data, 'GET /api/ad_cfg/message/data/sn/3267 정상 응답');
  const rMsgSave = await requestHttp('POST', '/api/ad_cfg/message/save', { applyTop: '2026학년도 1학기 늘봄학교 공지' });
  assert(rMsgSave.status === 200 && rMsgSave.json && rMsgSave.json.success, 'POST /api/ad_cfg/message/save 정상 저장');
  const rInfoGet = await requestHttp('GET', '/api/ad_info/data/sn/3267');
  assert(rInfoGet.status === 200 && rInfoGet.json && rInfoGet.json.data.managerName, 'GET /api/ad_info/data/sn/3267 정상 응답');
  const rInfoSave = await requestHttp('POST', '/api/ad_info/save', { managerName: '박진수', deptName: '늘봄지원센터' });
  assert(rInfoSave.status === 200 && rInfoSave.json && rInfoSave.json.success, 'POST /api/ad_info/save 정상 저장');

  console.log('\n' + '='.repeat(85));
  if (passedTests === totalTests) {
    console.log(`🎉 [SUCCESS] 모든 테스트 통과! (${passedTests}/${totalTests} PASS)`);
    console.log('Sprint 4 환경설정 파트 B (신청기간, 강의시간, 강좌구분, 중복제한그룹, 학적검증, 나이스/에듀파인, 안내글, 초기화, 담당자) 100% 무결성 검증 완료!');
    console.log('='.repeat(85));
    process.exit(0);
  } else {
    console.error(`⚠️ [FAILED] 일부 테스트 실패 (${passedTests}/${totalTests} PASS)`);
    console.log('='.repeat(85));
    process.exit(1);
  }
}

runTest();
