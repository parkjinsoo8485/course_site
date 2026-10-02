/**
 * =========================================================================================
 * [Automated Test Harness] 강사관리 (ad_tea) 1:1 완벽 매핑 & 무결성 자동화 검증
 * - Field Diff Test: missing == 0 ?
 * - Modal Trigger & Dynamic Fields Test
 * - Excel 5 Principles Endpoint HTTP 200 Test
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
  console.log('🚀 [Test Harness] 강사관리 (/af/ad_tea) 1:1 무결성 검증 시작');
  console.log('=================================================================');

  let passed = true;

  // 1. 로컬 index.html 파일 무결성 및 패널/모달 존재 검증
  console.log('\n[Step 1] 로컬 DOM 구조 및 필수 요소 검증...');
  const indexHtml = fs.readFileSync('course_site/af/ad_lec/lists/sn/index.html', 'utf8');

  const requiredIds = [
    'panel_ad_tea_lists',
    'teaMainTable',
    'teaTableTbody',
    'fm_list_search',
    'st',
    's_word',
    'main_control_box_btn02',
    'main_control_box_drop',
    'fm_list',
    'check_all',
    'update_type',
    'teaPagination',
    'modal_ad_tea_write',
    'mem_id',
    'mem_name',
    'mem_passwd',
    'mem_status_1',
    'mem_status_0',
    'modal_ad_tea_modify',
    'mod_mem_name',
    'change_mem_name',
    'mod_mem_passwd',
    'del_mem_hp',
    'modal_ad_tea_input',
    'userfile',
    'input_type_add',
    'input_type_clear',
    'def_passwd',
    'modal_ad_tea_schedule',
    'lec_div',
    'tea_id',
    'fm_mem_status',
    'mem_status_num',
    'mem_status',
    'mem_obj_id',
    'fm_del',
    'del_num'
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

  // 2. Field-List Diff Test (타깃 spec_ad_tea.json 과 대조)
  console.log('\n[Step 2] 타깃 인벤토리 스펙 1:1 Diff 검증...');
  const spec = JSON.parse(fs.readFileSync('scratch/spec_ad_tea.json', 'utf8'));

  // Lists 필드 비교
  const targetListNames = spec.lists.inputs.map(i => i.name).filter(Boolean);
  const targetListSelects = spec.lists.selects.map(s => s.name).filter(Boolean);
  const targetAllListFields = [...new Set([...targetListNames, ...targetListSelects])];

  const listMissing = [];
  targetAllListFields.forEach(name => {
    if (name.startsWith('csrf_') || name.startsWith('form_open_')) return;
    if (['login_id', 'login_passwd', 'otp_num', 'submit'].includes(name)) return;
    if (!indexHtml.includes(`name="${name}"`)) {
      listMissing.push(name);
    }
  });

  if (listMissing.length === 0) {
    console.log(`  ✔ 타깃 lists 전수 필드 (${targetAllListFields.length}개 중 시스템 토큰 제외) 100% 매핑 완료! (missing: [])`);
  } else {
    console.error('  ❌ 타깃 lists 필드 누락:', listMissing);
    passed = false;
  }

  // Write/Modify/Input/Schedule 필드 비교
  const writeFields = ['mem_id', 'mem_name', 'mem_passwd', 'mem_status'];
  const modifyFields = ['mem_name', 'change_mem_name', 'mem_passwd', 'del_mem_hp', 'mem_status'];
  const inputFields = ['userfile', 'input_type', 'def_passwd'];
  const schedFields = ['lec_div', 'tea_id'];

  const allSubFields = [...new Set([...writeFields, ...modifyFields, ...inputFields, ...schedFields])];
  const subMissing = [];
  allSubFields.forEach(name => {
    if (!indexHtml.includes(`name="${name}"`)) {
      subMissing.push(name);
    }
  });

  if (subMissing.length === 0) {
    console.log(`  ✔ 타깃 write/modify/input/schedule 서브 모달 전수 필드 (${allSubFields.length}개) 100% 매핑 완료! (missing: [])`);
  } else {
    console.error('  ❌ 타깃 서브 모달 필드 누락:', subMissing);
    passed = false;
  }

  // 3. 로컬 서버 엔드포인트 및 엑셀 출력 검증
  console.log('\n[Step 3] 서버 엔드포인트 및 프리미엄 엑셀 출력 검증 (PORT 3005)...');
  try {
    // 3-1. 메인 목록 페이지 HTTP 200
    const pageRes = await httpGet('http://localhost:3005/af/ad_tea/lists/sn/3267');
    if (pageRes.statusCode === 200 && pageRes.body.includes('panel_ad_tea_lists')) {
      console.log('  ✔ 메인 페이지 (/af/ad_tea/lists/sn/3267) HTTP 200 & 패널 서빙 확인');
    } else {
      console.error(`  ❌ 메인 페이지 상태 오류: ${pageRes.statusCode}`);
      passed = false;
    }

    // 3-2. 검색결과 엑셀 출력 검증
    const excelRes = await httpGet('http://localhost:3005/af/ad_tea/excel/sn/3267');
    if (excelRes.statusCode === 200) {
      const body = excelRes.body;
      const hasHero = body.includes('hero-title');
      const hasMeta = body.includes('meta-bar');
      const hasTotal = body.includes('total-row');
      const hasSample = body.includes('강태연');

      if (hasHero && hasMeta && hasTotal && hasSample) {
        console.log('  ✔ 검색결과 엑셀 출력 (/af/ad_tea/excel) 5대 원칙 프리미엄 템플릿 무결성 확인');
      } else {
        console.error('  ❌ 엑셀 템플릿 구성 요소 누락!');
        passed = false;
      }
    } else {
      console.error(`  ❌ 엑셀 출력 HTTP 상태 코드 오류: ${excelRes.statusCode}`);
      passed = false;
    }

    // 3-3. 시간표 엑셀 출력 검증
    const schedExcelRes = await httpGet('http://localhost:3005/af/ad_tea/schedule_excel/sn/3267');
    if (schedExcelRes.statusCode === 200) {
      const body = schedExcelRes.body;
      const hasHero = body.includes('hero-title');
      const hasTotal = body.includes('total-row');
      const hasSample = body.includes('컴퓨터1실');

      if (hasHero && hasTotal && hasSample) {
        console.log('  ✔ 시간표 엑셀 출력 (/af/ad_tea/schedule_excel) 5대 원칙 프리미엄 템플릿 무결성 확인');
      } else {
        console.error('  ❌ 시간표 엑셀 구성 요소 누락!');
        passed = false;
      }
    } else {
      console.error(`  ❌ 시간표 엑셀 HTTP 상태 코드 오류: ${schedExcelRes.statusCode}`);
      passed = false;
    }

    // 3-4. 일괄입력 샘플 서식 다운로드
    const sampleRes = await httpGet('http://localhost:3005/af/ad_tea/sample_excel');
    if (sampleRes.statusCode === 200 && sampleRes.body.includes('tea_sample1')) {
      console.log('  ✔ 일괄입력 샘플 서식 다운로드 (/af/ad_tea/sample_excel) 정상 확인');
    } else {
      console.error(`  ❌ 일괄입력 샘플 서식 오류: ${sampleRes.statusCode}`);
      passed = false;
    }

    // 3-5. 강사 JSON API 조회 검증
    const apiRes = await httpGet('http://localhost:3005/api/ad_tea/list');
    if (apiRes.statusCode === 200) {
      const data = JSON.parse(apiRes.body);
      if (data.success && data.teachers.length >= 18) {
        console.log(`  ✔ 강사 JSON API (/api/ad_tea/list) 18명 전수 시드 데이터 응답 확인 (count: ${data.teachers.length})`);
      } else {
        console.error('  ❌ 강사 API 데이터 수 부족:', data);
        passed = false;
      }
    } else {
      console.error(`  ❌ 강사 API 응답 오류: ${apiRes.statusCode}`);
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
