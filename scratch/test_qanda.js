/**
 * test_qanda.js — Q&A 고객지원 게시판 API 테스트 harness
 * AGENTS.md 룰에 따라 자동 테스트 실행
 */

const BASE = 'http://localhost:3005/api';
let PASSED = 0;
let FAILED = 0;
let createdId = null;

async function check(testName, fn) {
  try {
    const result = await fn();
    if (result) {
      console.log(`  ✅ PASS: ${testName}`);
      PASSED++;
    } else {
      console.log(`  ❌ FAIL: ${testName}`);
      FAILED++;
    }
  } catch (e) {
    console.log(`  ❌ ERROR: ${testName} → ${e.message}`);
    FAILED++;
  }
}

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  return res.json();
}

(async () => {
  console.log('\n========================================');
  console.log('🧪 Q&A 고객지원 게시판 API 테스트 시작');
  console.log('========================================\n');

  // ── Test 1: 목록 조회 (전체) ──
  console.log('[Test 1] 목록 조회 (sn/3267, as=all)');
  await check('GET /af/qanda/lists/sn/3267 — 200 & items 배열', async () => {
    const data = await apiFetch('/af/qanda/lists/sn/3267');
    return data.success === true && Array.isArray(data.items);
  });

  // ── Test 2: 목록 조회 — 진행상태 필터 ──
  console.log('\n[Test 2] 목록 조회 — 진행상태 필터 (as=2 완료)');
  await check('GET ?as=2 → statusText="완료" 인 항목만 반환', async () => {
    const data = await apiFetch('/af/qanda/lists/sn/3267?as=2');
    return data.success && data.items.every(i => i.status === '2');
  });

  // ── Test 3: 목록 조회 — 키워드 검색 ──
  console.log('\n[Test 3] 목록 조회 — 키워드 검색 (sw=스쿨뱅킹)');
  await check('GET ?sw=스쿨뱅킹 → 관련 항목 포함', async () => {
    const data = await apiFetch('/af/qanda/lists/sn/3267?st=sub_con&sw=%EC%8A%A4%EC%BF%A8%EB%B1%85%ED%82%B9');
    return data.success && data.items.length >= 1 && data.items[0].subject.includes('스쿨뱅킹');
  });

  // ── Test 4: 신규 문의 등록 ──
  console.log('\n[Test 4] 신규 문의 등록 (POST /af/qanda/create)');
  await check('POST /af/qanda/create — 새 문의글 생성', async () => {
    const data = await apiFetch('/af/qanda/create', {
      method: 'POST',
      body: JSON.stringify({
        school_id: 'sch_1',
        authorName: '홍길동',
        hp1: '010', hp2: '1234', hp3: '5678',
        phone: '02-9999-8888',
        email: 'test@test.com',
        subject: '[테스트] API 자동 테스트 문의',
        contents: '자동 테스트 harness 에서 생성된 문의입니다.',
        files: []
      })
    });
    if (data.success && data.item && data.item.id) {
      createdId = data.item.id;
      console.log(`     → 생성된 ID: ${createdId}`);
    }
    return data.success === true && data.item?.subject?.includes('테스트');
  });

  // ── Test 5: 상세 조회 ──
  console.log('\n[Test 5] 상세 조회 (GET /af/qanda/view/qna_8806)');
  await check('GET /af/qanda/view/qna_8806 — 데이터 반환', async () => {
    const data = await apiFetch('/af/qanda/view/qna_8806');
    return data.success && data.item?.subject?.includes('만족도');
  });

  // ── Test 6: 관리자 답변 등록/수정 ──
  console.log('\n[Test 6] 관리자 답변 등록 (POST /af/qanda/reply)');
  await check('POST /af/qanda/reply — 상태=3(답변완료) 업데이트', async () => {
    const data = await apiFetch('/af/qanda/reply', {
      method: 'POST',
      body: JSON.stringify({
        id: 'qna_3356',
        replyContent: '안녕하세요. 스쿨뱅킹 현황 데이터를 확인하여 별도 파일로 발송해드렸습니다. 확인 바랍니다.',
        status: '3'
      })
    });
    return data.success && data.item?.status === '3' && data.item?.statusText === '답변완료';
  });

  // ── Test 7: 삭제 ──
  console.log('\n[Test 7] 문의글 삭제 (POST /af/qanda/delete)');
  await check('POST /af/qanda/delete — 생성된 테스트 항목 삭제', async () => {
    if (!createdId) return false;
    const data = await apiFetch('/af/qanda/delete', {
      method: 'POST',
      body: JSON.stringify({ id: createdId })
    });
    return data.success === true;
  });

  // ── Test 8: 삭제 후 목록에서 제거 확인 ──
  console.log('\n[Test 8] 삭제 후 목록 재확인');
  await check('목록 재조회 시 삭제된 항목 미포함', async () => {
    if (!createdId) return true; // skip
    const data = await apiFetch('/af/qanda/lists/sn/3267');
    return data.success && !data.items.some(i => i.id === createdId);
  });

  // ── 최종 결과 ──
  console.log('\n========================================');
  console.log(`🏁 테스트 결과: ${PASSED}/${PASSED + FAILED} 통과`);
  if (FAILED === 0) {
    console.log('🎉 모든 테스트 PASS! Q&A API 완벽 검증 완료.');
  } else {
    console.log(`⚠️  ${FAILED}개 실패. 위 로그를 확인하세요.`);
  }
  console.log('========================================\n');
  process.exit(FAILED > 0 ? 1 : 0);
})();
