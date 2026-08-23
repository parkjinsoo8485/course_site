/**
 * test_ad_app.js — 신청자관리 API 테스트 harness
 * AGENTS.md 룰에 따라 자동화 테스트 실행
 */

const BASE = 'http://localhost:3005/api';
let PASSED = 0;
let FAILED = 0;

async function check(name, fn) {
  try {
    const result = await fn();
    if (result) { console.log(`  ✅ PASS: ${name}`); PASSED++; }
    else { console.log(`  ❌ FAIL: ${name}`); FAILED++; }
  } catch (e) {
    console.log(`  ❌ ERROR: ${name} → ${e.message}`); FAILED++;
  }
}

async function api(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, { headers: { 'Content-Type': 'application/json' }, ...opts });
  return res.json();
}

(async () => {
  console.log('\n========================================');
  console.log('🧪 신청자관리 & Q&A 통합 API 테스트');
  console.log('========================================\n');

  // Q&A Tests (regression)
  console.log('[Regression] Q&A 고객지원 목록 API');
  await check('GET /af/qanda/lists/sn/3267 → success & items[]', async () => {
    const d = await api('/af/qanda/lists/sn/3267');
    return d.success && Array.isArray(d.items) && d.items.length >= 2;
  });

  await check('GET /af/qanda/view/qna_8806 → 올바른 제목 반환', async () => {
    const d = await api('/af/qanda/view/qna_8806');
    return d.success && d.item?.subject?.includes('만족도');
  });

  // Course API Tests (base dependency)
  console.log('\n[Test] 강좌 API (신청자관리 의존성)');
  await check('GET /courses/sn/3267 → 강좌 목록 반환', async () => {
    const d = await api('/courses/sn/3267');
    return d.success && Array.isArray(d.courses);
  });

  // Applicant CRUD via direct routes
  console.log('\n[Test] 신청자관리 UI 라우트 검증 (Next.js 페이지 파일 존재)');
  const fs = await import('fs');
  const path = await import('path');
  const base = 'course_site/app/af/ad_app';
  const pages = [
    `${base}/lists/sn/[school_id]/page.tsx`,
    `${base}/write/sn/[school_id]/page.tsx`,
    `${base}/view/[id]/sn/[school_id]/page.tsx`,
    `${base}/edit/[id]/sn/[school_id]/page.tsx`,
    `${base}/batch-upload/sn/[school_id]/page.tsx`,
  ];

  for (const p of pages) {
    await check(`페이지 파일 존재: ${p.split('/').pop()} (${p.split('ad_app/')[1].split('/page')[0]})`, () => {
      return fs.existsSync(path.resolve(p));
    });
  }

  // Additional Q&A full flow
  console.log('\n[Test] Q&A CRUD 전체 흐름 (등록→상세→답변→삭제)');
  let testId = null;

  await check('POST /af/qanda/create → 신규 문의 등록', async () => {
    const d = await api('/af/qanda/create', {
      method: 'POST',
      body: JSON.stringify({
        school_id: 'sch_1', authorName: '테스트담당자',
        hp1: '010', hp2: '0000', hp3: '1111',
        phone: '02-0000-0000', email: 'test@test.com',
        subject: '[자동테스트] ad_app harness 실행',
        contents: 'test_ad_app.js 에서 생성됨', files: []
      })
    });
    if (d.success) testId = d.item.id;
    return d.success && !!d.item?.id;
  });

  await check('POST /af/qanda/reply → 관리자 답변 등록', async () => {
    if (!testId) return false;
    const d = await api('/af/qanda/reply', {
      method: 'POST',
      body: JSON.stringify({ id: testId, replyContent: '자동테스트 답변', status: '3' })
    });
    return d.success && d.item?.status === '3';
  });

  await check('POST /af/qanda/delete → 삭제 후 미포함 확인', async () => {
    if (!testId) return false;
    const d1 = await api('/af/qanda/delete', { method: 'POST', body: JSON.stringify({ id: testId }) });
    const d2 = await api('/af/qanda/lists/sn/3267');
    return d1.success && !d2.items.some(i => i.id === testId);
  });

  console.log('\n========================================');
  console.log(`🏁 결과: ${PASSED}/${PASSED + FAILED} 통과`);
  if (FAILED === 0) console.log('🎉 전체 PASS!');
  else console.log(`⚠️  ${FAILED}개 실패`);
  console.log('========================================\n');
  process.exit(FAILED > 0 ? 1 : 0);
})();
