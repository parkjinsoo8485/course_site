/**
 * =========================================================================================
 * [Automated Test Harness] 귀가일정표 (ad_rsch) 1:1 완벽 매핑 & 무결성 자동화 검증
 * - Field Diff Test: missing == 0 ?
 * - Modal Trigger & Elements Test
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
  console.log('🚀 [Test Harness] 귀가일정표 (/af/ad_rsch) 1:1 무결성 검증 시작');
  console.log('=================================================================');

  let passed = true;

  // 1. 로컬 index.html 파일 무결성 및 패널/모달 존재 검증
  console.log('\n[Step 1] 로컬 DOM 구조 및 필수 요소 검증...');
  const indexHtml = fs.readFileSync('course_site/af/ad_lec/lists/sn/index.html', 'utf8');

  const requiredIds = [
    'panel_ad_rsch_lists',
    'rschMainTable',
    'rsch_sgr',
    'rsch_scl',
    'rsch_s_word',
    'modal_ad_rsch_write',
    'modal_ad_rsch_input',
    'modal_ad_rsch_stu_schedule',
    'modal_ad_rsch_search_student',
    'mem_info',
    'mem_num',
    'time1_hour',
    'time1_min',
    'yoil1_guardian',
    'yoil1_tel_1',
    'yoil1_tel_2',
    'yoil1_tel_3',
    'time5_hour',
    'time5_min',
    'yoil5_guardian',
    'yoil5_tel_1',
    'yoil5_tel_2',
    'yoil5_tel_3',
    'userfile'
  ];

  const missingIds = [];
  requiredIds.forEach(id => {
    if (!indexHtml.includes(`id="${id}"`)) {
      missingIds.push(id);
    }
  });

  if (missingIds.length === 0) {
    console.log('  ✔ 필수 DOM ID 24종 전수 존재 확인 완료! (missing: [])');
  } else {
    console.error('  ❌ 누락된 DOM ID 발견:', missingIds);
    passed = false;
  }

  // 2. Field-List Diff Test (타깃 spec_ad_rsch.json 과 대조)
  console.log('\n[Step 2] 타깃 인벤토리 스펙 1:1 Diff 검증...');
  const spec = JSON.parse(fs.readFileSync('scratch/spec_ad_rsch.json', 'utf8'));

  // 타깃 write 폼의 필수 요일 필드 매핑 검증
  const targetWriteNames = spec.write.inputs.map(i => i.name).filter(Boolean);
  const targetWriteSelects = spec.write.selects.map(s => s.name).filter(Boolean);
  const targetAllWriteFields = [...new Set([...targetWriteNames, ...targetWriteSelects])];

  const writeMissing = [];
  targetAllWriteFields.forEach(name => {
    if (name.startsWith('csrf_') || name.startsWith('form_open_')) return;
    if (['login_id', 'login_passwd', 'otp_num', 'submit'].includes(name)) return;
    if (!indexHtml.includes(`name="${name}"`)) {
      writeMissing.push(name);
    }
  });

  if (writeMissing.length === 0) {
    console.log(`  ✔ 타깃 write 폼 전수 필드 (${targetAllWriteFields.length}개 중 시스템 토큰 제외) 100% 매핑 완료! (missing: [])`);
  } else {
    console.error('  ❌ 타깃 write 폼 필드 누락:', writeMissing);
    passed = false;
  }

  // 3. 로컬 서버 엔드포인트 및 엑셀 출력 검증
  console.log('\n[Step 3] 서버 엔드포인트 및 프리미엄 엑셀 출력 검증 (PORT 3005)...');
  try {
    // 3-1: 메인 HTML 라우트
    const pageRes = await httpGet('http://localhost:3005/af/ad_rsch/lists/sn/3267');
    if (pageRes.statusCode === 200 && pageRes.body.includes('panel_ad_rsch_lists')) {
      console.log('  ✔ GET /af/ad_rsch/lists/sn/3267 -> HTTP 200 OK (패널 포함 확인)');
    } else {
      console.error(`  ❌ GET /af/ad_rsch/lists/sn/3267 실패 (Status: ${pageRes.statusCode})`);
      passed = false;
    }

    // 3-2: 엑셀 다운로드 라우트
    const excelRes = await httpGet('http://localhost:3005/af/ad_rsch/excel/sn/3267');
    if (excelRes.statusCode === 200 && excelRes.headers['content-type'].includes('ms-excel')) {
      const hasHeroTitle = excelRes.body.includes('hero-title');
      const hasTotalRow = excelRes.body.includes('total-row');
      console.log(`  ✔ GET /af/ad_rsch/excel/sn/3267 -> HTTP 200 OK (MIME: ms-excel, Hero Title: ${hasHeroTitle}, Total Row: ${hasTotalRow})`);
    } else {
      console.error(`  ❌ GET /af/ad_rsch/excel/sn/3267 실패 (Status: ${excelRes.statusCode})`);
      passed = false;
    }

    // 3-3: 샘플 서식 다운로드 라우트
    const sampleRes = await httpGet('http://localhost:3005/af/ad_rsch/sample_excel');
    if (sampleRes.statusCode === 200 && (sampleRes.headers['content-type'].includes('csv') || sampleRes.body.includes('귀가동행자'))) {
      console.log('  ✔ GET /af/ad_rsch/sample_excel -> HTTP 200 OK (샘플 CSV 파일 확인)');
    } else {
      console.error(`  ❌ GET /af/ad_rsch/sample_excel 실패 (Status: ${sampleRes.statusCode})`);
      passed = false;
    }

    // 3-4: JS 로직 파일 제공 검증
    const jsRes = await httpGet('http://localhost:3005/af/ad_lec/lists/sn/rsch_logic.js');
    if (jsRes.statusCode === 200 && jsRes.body.includes('openRschWriteModal')) {
      console.log('  ✔ GET /af/ad_lec/lists/sn/rsch_logic.js -> HTTP 200 OK');
    } else {
      console.error(`  ❌ GET rsch_logic.js 실패 (Status: ${jsRes.statusCode})`);
      passed = false;
    }

  } catch (err) {
    console.error('  ❌ 서버 통신 오류 (서버 재기동 필요 여부 확인):', err.message);
    passed = false;
  }

  console.log('\n=================================================================');
  if (passed) {
    console.log('🎉 [Test Harness Result] 귀가일정표 (/af/ad_rsch) 1:1 완벽 매핑 검증 ALL PASS!');
  } else {
    console.log('⚠️ [Test Harness Result] 일부 검증 항목 미달 (위 로그 참조)');
  }
  console.log('=================================================================\n');

  return passed;
}

runHarness().then(success => {
  process.exit(success ? 0 : 1);
});
