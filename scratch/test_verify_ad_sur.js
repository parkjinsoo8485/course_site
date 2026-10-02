/**
 * =========================================================================================
 * [Automated Test Harness] 설문관리 (ad_sur) 1:1 완벽 매핑 & 무결성 자동화 검증
 * - Field Diff Test: missing == 0 ?
 * - Modal Trigger & DOM IDs Test
 * - Excel 5 Principles Endpoint HTTP 200 Test
 * - JSON API 시드 데이터 응답 테스트
 * =========================================================================================
 */

const fs = require('fs');
const http = require('http');

async function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function runHarness() {
  console.log('=================================================================');
  console.log('🚀 [Test Harness] 설문관리 (/af/ad_sur) 1:1 무결성 검증 시작');
  console.log('=================================================================');

  let passed = true;

  // 1. 로컬 index.html 파일 무결성 및 필수 DOM ID 검증
  console.log('\n[Step 1] 로컬 DOM 구조 및 필수 요소 검증...');
  const indexHtml = fs.readFileSync('course_site/af/ad_lec/lists/sn/index.html', 'utf8');

  const requiredIds = [
    // 목록 패널
    'panel_ad_sur_lists',
    'surMainTable',
    'surTableTbody',
    'fm_list',
    'check_all',
    'update_type',
    'surPagination',
    'fm_del',
    'del_num',
    'btn_sur_write',
    // 샘플설문 패널
    'panel_ad_surs_lists',
    'sampleSurveyTbody',
    // write 모달
    'modal_ad_sur_write',
    'sur_title',
    'sur_type_1',
    'sur_type_2',
    'sur_type_3',
    'lec_div_5',
    'ans_grp_2',
    'ans_grp_102',
    'ans_grp_4',
    'ans_grp_1',
    'ans_grade_1',
    'use_open_pwd',
    'sur_sdate',
    'sur_edate',
    'sur_content',
    // modify 모달
    'modal_ad_sur_modify',
    'mod_sur_title',
    'mod_sur_num',
    // que 모달
    'modal_ad_sur_que',
    'sur_que_sel',
    'sur_que_list_area',
    // ans 모달
    'modal_ad_sur_ans',
    'sur_ans_title',
    'sur_ans_list_tbody'
  ];

  const missingIds = [];
  requiredIds.forEach(id => {
    if (!indexHtml.includes(`id="${id}"`)) {
      missingIds.push(id);
    }
  });

  if (missingIds.length === 0) {
    console.log(`  ✔ 필수 DOM ID ${requiredIds.length}종 전수 존재 확인 완료! (missing: [])`);
  } else {
    console.error('  ❌ 누락된 DOM ID 발견:', missingIds);
    passed = false;
  }

  // 2. 타깃 스펙 1:1 Diff 검증
  console.log('\n[Step 2] 타깃 인벤토리 스펙 1:1 Diff 검증...');
  
  // 핵심 name 속성 검증 (타깃에서 추출)
  const targetNames = [
    'check_all', 'data_checked[]', 'update_type', 'csrf_test_name',
    'sur_title', 'sur_type', 'lec_div[]', 'lec_pro_type_all', 'lec_pro_type_list[]',
    'ans_grp', 'ans_grade[]', 'use_open_pwd', 'sur_sdate', 'sur_edate', 'sur_content',
    's_sur_num', 'sur_num'
  ];

  const nameMissing = [];
  targetNames.forEach(name => {
    if (!indexHtml.includes(`name="${name}"`)) {
      nameMissing.push(name);
    }
  });

  if (nameMissing.length === 0) {
    console.log(`  ✔ 타깃 name 속성 전수 필드 (${targetNames.length}개) 100% 매핑 완료! (missing: [])`);
  } else {
    console.error('  ❌ 타깃 name 필드 누락:', nameMissing);
    passed = false;
  }

  // 3. JS 로직 파일 존재 확인
  console.log('\n[Step 3] sur_logic.js 존재 및 필수 함수 검증...');
  const surLogicPath = 'course_site/af/ad_lec/lists/sn/sur_logic.js';
  if (fs.existsSync(surLogicPath)) {
    const logicJs = fs.readFileSync(surLogicPath, 'utf8');
    const requiredFns = [
      'loadSurList', 'openSurWriteModal', 'openSurModifyModal',
      'openSurQueModal', 'openSurAnsModal', 'closeSurModal',
      'surChkType', 'surChkAnsGrp', 'surWriteSubmit', 'surModifySubmit',
      'surChkDel', 'surBulkAction', 'loadSampleSurList'
    ];
    const missingFns = requiredFns.filter(fn => !logicJs.includes(`function ${fn}`));
    if (missingFns.length === 0) {
      console.log(`  ✔ sur_logic.js 필수 함수 ${requiredFns.length}종 전수 확인 완료! (missing: [])`);
    } else {
      console.error('  ❌ 누락된 함수:', missingFns);
      passed = false;
    }

    // 스크립트 태그 포함 여부
    if (indexHtml.includes('sur_logic.js')) {
      console.log('  ✔ index.html에 sur_logic.js 스크립트 태그 포함 확인');
    } else {
      console.error('  ❌ index.html에 sur_logic.js 스크립트 태그 없음!');
      passed = false;
    }
  } else {
    console.error('  ❌ sur_logic.js 파일 없음!');
    passed = false;
  }

  // 4. 서버 엔드포인트 및 엑셀 출력 검증
  console.log('\n[Step 4] 서버 엔드포인트 및 프리미엄 엑셀 출력 검증 (PORT 3005)...');
  try {
    // 4-1. 메인 목록 페이지 HTTP 200 + 패널 존재
    const pageRes = await httpGet('http://localhost:3005/af/ad_sur/lists/sn/3267');
    if (pageRes.statusCode === 200 && pageRes.body.includes('panel_ad_sur_lists')) {
      console.log('  ✔ 메인 페이지 (/af/ad_sur/lists/sn/3267) HTTP 200 & 패널 서빙 확인');
    } else {
      console.error(`  ❌ 메인 페이지 오류: ${pageRes.statusCode}`);
      passed = false;
    }

    // 4-2. JSON API 검증
    const apiRes = await httpGet('http://localhost:3005/api/ad_sur/list');
    if (apiRes.statusCode === 200) {
      const data = JSON.parse(apiRes.body);
      if (data.success && data.surveys && data.surveys.length >= 4) {
        console.log(`  ✔ 설문 JSON API (/api/ad_sur/list) 4건 시드 데이터 응답 확인 (count: ${data.surveys.length})`);
      } else {
        console.error('  ❌ 설문 API 데이터 부족:', data);
        passed = false;
      }
    } else {
      console.error(`  ❌ 설문 API 응답 오류: ${apiRes.statusCode}`);
      passed = false;
    }

    // 4-3. 검색결과 엑셀 5대 원칙 검증
    const excelRes = await httpGet('http://localhost:3005/af/ad_sur/excel/sn/3267');
    if (excelRes.statusCode === 200) {
      const body = excelRes.body;
      const hasHero = body.includes('hero-title');
      const hasMeta = body.includes('meta-bar');
      const hasTotal = body.includes('total-row');
      const hasSample = body.includes('늘봄학교');
      const hasZebra = body.includes('zebra');

      if (hasHero && hasMeta && hasTotal && hasSample && hasZebra) {
        console.log('  ✔ 검색결과 엑셀 (/af/ad_sur/excel) 5대 원칙 프리미엄 템플릿 무결성 확인');
      } else {
        console.error('  ❌ 엑셀 템플릿 구성 요소 누락!', { hasHero, hasMeta, hasTotal, hasSample, hasZebra });
        passed = false;
      }
    } else {
      console.error(`  ❌ 검색결과 엑셀 HTTP 오류: ${excelRes.statusCode}`);
      passed = false;
    }

    // 4-4. 설문결과 엑셀 검증
    const ansExcelRes = await httpGet('http://localhost:3005/af/ad_sur/ans_excel/sn/3267');
    if (ansExcelRes.statusCode === 200) {
      const body = ansExcelRes.body;
      const hasHero = body.includes('hero-title');
      const hasTotal = body.includes('total-row');
      const hasContent = body.includes('늘봄학교');

      if (hasHero && hasTotal && hasContent) {
        console.log('  ✔ 설문결과 엑셀 (/af/ad_sur/ans_excel) 5대 원칙 프리미엄 템플릿 무결성 확인');
      } else {
        console.error('  ❌ 설문결과 엑셀 템플릿 구성 요소 누락!', { hasHero, hasTotal, hasContent });
        passed = false;
      }
    } else {
      console.error(`  ❌ 설문결과 엑셀 HTTP 오류: ${ansExcelRes.statusCode}`);
      passed = false;
    }

    // 4-5. 샘플설문 패널 라우트 검증
    const sursRes = await httpGet('http://localhost:3005/af/ad_surs/lists/sn/3267');
    if (sursRes.statusCode === 200 && sursRes.body.includes('panel_ad_surs_lists')) {
      console.log('  ✔ 샘플설문 페이지 (/af/ad_surs/lists/sn/3267) HTTP 200 & 패널 확인');
    } else {
      console.error(`  ❌ 샘플설문 페이지 오류: ${sursRes.statusCode}`);
      passed = false;
    }

  } catch (err) {
    console.error('  ❌ 서버 연결 실패:', err.message);
    passed = false;
  }

  console.log('\n=================================================================');
  if (passed) {
    console.log('🎉 [Test Harness] 모든 1:1 완벽 매칭 및 무결성 테스트 ALL PASS! (100% 무결성 완료)');
  } else {
    console.log('💥 [Test Harness] 일부 테스트가 실패하였습니다. 상세 로그를 확인하세요.');
  }
  console.log('=================================================================\n');

  process.exit(passed ? 0 : 1);
}

runHarness();
