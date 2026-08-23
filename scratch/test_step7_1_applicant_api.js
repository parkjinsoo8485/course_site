/**
 * test_step7_1_applicant_api.js
 * Phase 7 - Step 7-1: 신청자관리 REST API 엔드포인트 전수 검증
 */

const BASE = 'http://localhost:3005/api';
let PASSED = 0;
let FAILED = 0;

async function check(name, fn) {
  try {
    const result = await fn();
    if (result) {
      console.log(`  ✅ PASS: ${name}`);
      PASSED++;
    } else {
      console.log(`  ❌ FAIL: ${name}`);
      FAILED++;
    }
  } catch (e) {
    console.log(`  ❌ ERROR: ${name} → ${e.message}`);
    FAILED++;
  }
}

async function api(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  return res.json();
}

(async () => {
  console.log('\n======================================================');
  console.log('🧪 Step 7-1: 신청자관리(/af/ad_app) 백엔드 REST API 전수 검증');
  console.log('======================================================\n');

  // 1. 목록 및 통계 조회
  console.log('[Test 1] 신청자 목록 및 통계 조회 API');
  let listData = null;
  await check('GET /af/ad_app/lists/sn/3267 → items[] & stats 정상 반환', async () => {
    listData = await api('/af/ad_app/lists/sn/3267');
    return listData.success && Array.isArray(listData.items) && listData.items.length >= 4 && listData.stats.totalCount >= 4;
  });

  // 2. 단일 신청자 상세 조회
  console.log('\n[Test 2] 단일 신청자 상세 조회 API');
  const firstId = listData?.items?.[0]?.id || 'app_1';
  await check(`GET /af/ad_app/view/${firstId} → 상세 데이터 정상 반환`, async () => {
    const res = await api(`/af/ad_app/view/${firstId}`);
    return res.success && res.item.id === firstId && !!res.item.studentName;
  });

  // 3. 신규 신청자 등록 (Create)
  console.log('\n[Test 3] 신규 신청자 수동 등록 API');
  let createdId = null;
  await check('POST /af/ad_app/create → 학생 등록 및 수강료/수용비 자동계산', async () => {
    const res = await api('/af/ad_app/create', {
      method: 'POST',
      body: JSON.stringify({
        schoolId: 'sch_1',
        studentName: '홍길동',
        gradeClass: '2학년 3반',
        studentNum: '15',
        parentPhone: '010-9999-8888',
        courseId: 'crs_3',
        courseTitle: '[특기적성] 창의 로봇교실 A반',
        instructorName: '김로봇 강사',
        subsidyType: '일반 자부담',
        tuitionFee: 40000,
        materialFee: 10000,
        paymentStatus: '결제완료',
        status: '승인',
        bankName: 'KB국민',
        schoolBankingAccount: '123-456-789012',
        depositorName: '홍길동부',
        memo: '자동테스트 신규 신청'
      })
    });
    if (res.success && res.item) {
      createdId = res.item.id;
      // instructorFee should be 80% (32000), facilityFee 20% (8000), totalFee 50000
      const isFeeCorrect = res.item.instructorFee === 32000 && res.item.facilityFee === 8000 && res.item.totalFee === 50000;
      return isFeeCorrect;
    }
    return false;
  });

  // 4. 신청자 정보 수정 (Update)
  console.log('\n[Test 4] 신청자 정보 수정 API');
  await check('POST /af/ad_app/update → 결제상태 및 메모 변경', async () => {
    if (!createdId) return false;
    const res = await api('/af/ad_app/update', {
      method: 'POST',
      body: JSON.stringify({
        id: createdId,
        paymentStatus: '환불완료',
        status: '환불',
        memo: '환불 처리 완료'
      })
    });
    return res.success && res.item.paymentStatus === '환불완료' && res.item.status === '환불';
  });

  // 5. 엑셀 일괄입력 (Batch Upload)
  console.log('\n[Test 5] 엑셀 명단 일괄입력 API');
  let batchIds = [];
  await check('POST /af/ad_app/batch-upload → 복수 학생 일괄 등록', async () => {
    const res = await api('/af/ad_app/batch-upload', {
      method: 'POST',
      body: JSON.stringify({
        schoolId: 'sch_1',
        items: [
          {
            studentName: '일괄학생A',
            gradeClass: '1학년 1반',
            studentNum: '01',
            parentPhone: '010-1111-2222',
            courseId: 'crs_3',
            courseTitle: '[특기적성] 창의 로봇교실 A반',
            tuitionFee: 35000,
            materialFee: 15000
          },
          {
            studentName: '일괄학생B',
            gradeClass: '1학년 1반',
            studentNum: '02',
            parentPhone: '010-3333-4444',
            courseId: 'crs_3',
            courseTitle: '[특기적성] 창의 로봇교실 A반',
            tuitionFee: 35000,
            materialFee: 15000
          }
        ]
      })
    });
    if (res.success && res.count === 2) {
      batchIds = res.items.map(i => i.id);
      return true;
    }
    return false;
  });

  // 6. 수강료 일괄설정 (Batch Fee Update)
  console.log('\n[Test 6] 수강료/재료비 일괄설정 API');
  await check('POST /af/ad_app/batch-fee → 특정 강좌 수강생 수강료 일괄 업데이트', async () => {
    const res = await api('/af/ad_app/batch-fee', {
      method: 'POST',
      body: JSON.stringify({
        schoolId: 'sch_1',
        courseId: 'crs_3',
        tuitionFee: 36000,
        materialFee: 16000
      })
    });
    return res.success && res.updatedCount >= 2;
  });

  // 7. 스쿨뱅킹 CSV 다운로드 API
  console.log('\n[Test 7] 스쿨뱅킹 CSV 내보내기 API');
  await check('GET /af/ad_app/school-banking/csv/sn/3267 → CSV 텍스트 및 헤더 확인', async () => {
    const res = await fetch(`${BASE}/af/ad_app/school-banking/csv/sn/3267`);
    const text = await res.text();
    return res.status === 200 && text.includes('연번') && text.includes('학생명') && text.includes('계좌번호');
  });

  // 8. 신청자 삭제 (Delete)
  console.log('\n[Test 8] 테스트 데이터 정리 (Delete)');
  await check('POST /af/ad_app/delete → 생성된 테스트 신청자 삭제', async () => {
    let allDeleted = true;
    const idsToDelete = [createdId, ...batchIds].filter(Boolean);
    for (const id of idsToDelete) {
      const res = await api('/af/ad_app/delete', { method: 'POST', body: JSON.stringify({ id }) });
      if (!res.success) allDeleted = false;
    }
    return allDeleted;
  });

  console.log('\n======================================================');
  console.log(`🏁 Step 7-1 테스트 결과: ${PASSED}/${PASSED + FAILED} 통과`);
  if (FAILED === 0) console.log('🎉 Step 7-1 전체 REST API 검증 100% PASS!');
  else console.log(`⚠️ ${FAILED}개 실패`);
  console.log('======================================================\n');
  process.exit(FAILED > 0 ? 1 : 0);
})();
