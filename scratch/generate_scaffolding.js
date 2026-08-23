import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [
  // 1. 단독 대메뉴
  // 매뉴얼 (FAQ)
  { path: 'course_site/app/af/ad_faq/main/sn/[school_id]/page.tsx', title: '매뉴얼 (FAQ) 메인 페이지' },
  { path: 'course_site/app/af/ad_faq/view/[id]/sn/[school_id]/page.tsx', title: '매뉴얼 상세 지침 조회' },
  { path: 'course_site/app/af/ad_faq/write/sn/[school_id]/page.tsx', title: '매뉴얼/FAQ 항목 신규 등록' },

  // 고객지원 게시판
  { path: 'course_site/app/af/qanda/lists/sn/[school_id]/page.tsx', title: '고객지원 Q&A 게시판 목록' },
  { path: 'course_site/app/af/qanda/write/sn/[school_id]/page.tsx', title: '고객지원 문의 등록' },
  { path: 'course_site/app/af/qanda/view/[id]/sn/[school_id]/page.tsx', title: '고객지원 문의 상세 및 답변' },
  { path: 'course_site/app/af/qanda/edit/[id]/sn/[school_id]/page.tsx', title: '고객지원 문의 수정' },

  // 학교관리
  { path: 'course_site/app/sczigi/service/lists/sn/[school_id]/page.tsx', title: '학교관리 및 서비스 플랜 목록' },
  { path: 'course_site/app/sczigi/service/edit/sn/[school_id]/page.tsx', title: '학교 정보 및 계약 수정' },

  // 강좌관리
  { path: 'course_site/app/af/ad_lec/lists/sn/[school_id]/page.tsx', title: '강좌관리 목록' },
  { path: 'course_site/app/af/ad_lec/write/sn/[school_id]/page.tsx', title: '강좌 신규 등록' },
  { path: 'course_site/app/af/ad_lec/batch-upload/sn/[school_id]/page.tsx', title: '23개 표준 컬럼 강좌 일괄등록' },
  { path: 'course_site/app/af/ad_lec/batch-copy/sn/[school_id]/page.tsx', title: '이전 분기 강좌 일괄복사' },
  { path: 'course_site/app/af/ad_lec/copy/[id]/sn/[school_id]/page.tsx', title: '단일 강좌 복제' },
  { path: 'course_site/app/af/ad_lec/edit/[id]/sn/[school_id]/page.tsx', title: '강좌 정보 수정' },
  { path: 'course_site/app/af/ad_lec/view/[id]/sn/[school_id]/page.tsx', title: '강좌 상세 조회' },
  { path: 'course_site/app/af/ad_lec/stats/sn/[school_id]/page.tsx', title: '강좌별 통계 현황' },

  // 신청자관리
  { path: 'course_site/app/af/ad_app/lists/sn/[school_id]/page.tsx', title: '수강 신청자 목록' },
  { path: 'course_site/app/af/ad_app/write/sn/[school_id]/page.tsx', title: '수강 신청자 개별 등록' },
  { path: 'course_site/app/af/ad_app/batch-upload/sn/[school_id]/page.tsx', title: '신청자 명단 엑셀 일괄입력' },
  { path: 'course_site/app/af/ad_app/batch-fee/sn/[school_id]/page.tsx', title: '수강료/수용비/재료비 일괄입력' },
  { path: 'course_site/app/af/ad_app/copy/sn/[school_id]/page.tsx', title: '신청자 데이터 일괄 복사' },
  { path: 'course_site/app/af/ad_app/edit/[id]/sn/[school_id]/page.tsx', title: '신청자 정보 수정' },
  { path: 'course_site/app/af/ad_app/view/[id]/sn/[school_id]/page.tsx', title: '신청자 상세 및 납부 내역' },

  // 대기자관리
  { path: 'course_site/app/af/ad_wait/lists/sn/[school_id]/page.tsx', title: '대기자 목록 및 순위' },
  { path: 'course_site/app/af/ad_wait/write/sn/[school_id]/page.tsx', title: '대기자 개별 등록' },
  { path: 'course_site/app/af/ad_wait/batch-upload/sn/[school_id]/page.tsx', title: '대기자 엑셀 일괄입력' },
  { path: 'course_site/app/af/ad_wait/copy/sn/[school_id]/page.tsx', title: '대기자 데이터 복사' },
  { path: 'course_site/app/af/ad_wait/edit/[id]/sn/[school_id]/page.tsx', title: '대기자 정보 및 순번 수정' },

  // 출석부관리
  { path: 'course_site/app/af/ad_att/stat/sn/[school_id]/page.tsx', title: '출석부관리 일일현황' },
  { path: 'course_site/app/af/ad_att/course/[id]/sn/[school_id]/page.tsx', title: '강좌별 월간 출석부 기록' },
  { path: 'course_site/app/af/ad_att/print/sn/[school_id]/page.tsx', title: '출석부 및 교육일지 인쇄' },

  // 환불/취소관리
  { path: 'course_site/app/af/ad_ref/lists/sn/[school_id]/page.tsx', title: '환불 및 취소 신청자 목록' },
  { path: 'course_site/app/af/ad_ref/write/sn/[school_id]/page.tsx', title: '환불/취소자 등록 및 환불 계산기' },
  { path: 'course_site/app/af/ad_ref/batch-upload/sn/[school_id]/page.tsx', title: '환불/취소 데이터 일괄등록' },
  { path: 'course_site/app/af/ad_ref/view/[id]/sn/[school_id]/page.tsx', title: '환불 영수증 상세 내역' },

  // 결석/귀가신청
  { path: 'course_site/app/af/ad_abs/lists/sn/[school_id]/page.tsx', title: '결석/귀가 신청 목록' },
  { path: 'course_site/app/af/ad_abs/write/sn/[school_id]/page.tsx', title: '결석/귀가 신청서 등록' },
  { path: 'course_site/app/af/ad_abs/edit/[id]/sn/[school_id]/page.tsx', title: '결석/귀가 신청 처리 및 수정' },

  // 강사관리
  { path: 'course_site/app/af/ad_tea/lists/sn/[school_id]/page.tsx', title: '강사관리 목록' },
  { path: 'course_site/app/af/ad_tea/write/sn/[school_id]/page.tsx', title: '강사 신규 등록' },
  { path: 'course_site/app/af/ad_tea/batch-upload/sn/[school_id]/page.tsx', title: '강사 명단 엑셀 일괄입력' },
  { path: 'course_site/app/af/ad_tea/edit/[id]/sn/[school_id]/page.tsx', title: '강사 프로필 및 권한 수정' },
  { path: 'course_site/app/af/ad_tea/view/[id]/sn/[school_id]/page.tsx', title: '강사 상세 배정 정보' },

  // 알림관리
  { path: 'course_site/app/af/notification/lists/sn/[school_id]/page.tsx', title: '알림관리 발송 이력 목록' },
  { path: 'course_site/app/af/notification/write/sn/[school_id]/page.tsx', title: '신규 알림/공지 등록' },
  { path: 'course_site/app/af/notification/view/[id]/sn/[school_id]/page.tsx', title: '알림 상세 내용 및 수신자 확인' },

  // 푸시알림관리
  { path: 'course_site/app/af/spush/lists/sn/[school_id]/page.tsx', title: '푸시알림관리 목록' },
  { path: 'course_site/app/af/spush/write/sn/[school_id]/page.tsx', title: '타겟팅 푸시 알림 전송' },
  { path: 'course_site/app/af/spush/view/[id]/sn/[school_id]/page.tsx', title: '푸시 전송 결과 보고서' },

  // 연장신청
  { path: 'course_site/app/af/ad_extension/lists/sn/[school_id]/page.tsx', title: '서비스 연장신청 목록' },
  { path: 'course_site/app/af/ad_extension/write/sn/[school_id]/page.tsx', title: '연장신청 및 견적서 다운로드' },

  // 2. 지원금관리
  { path: 'course_site/app/af/ad_free2_stu/lists/sn/[school_id]/page.tsx', title: '지원금관리 > 대상자관리 목록' },
  { path: 'course_site/app/af/ad_free2_stu/write/sn/[school_id]/page.tsx', title: '지원금 대상자 개별 등록' },
  { path: 'course_site/app/af/ad_free2_stu/batch-upload/sn/[school_id]/page.tsx', title: '지원금 대상자 엑셀 일괄입력' },
  { path: 'course_site/app/af/ad_free2_stu/edit/[id]/sn/[school_id]/page.tsx', title: '지원금 대상자 정보 수정' },

  { path: 'course_site/app/af/ad_free2_app/lists/sn/[school_id]/page.tsx', title: '지원금관리 > 수강자관리 차감 내역' },
  { path: 'course_site/app/af/ad_free2_app/view/[id]/sn/[school_id]/page.tsx', title: '수강자 지원금 차감 영수증' },

  { path: 'course_site/app/af/ad_free2_cfg/main/sn/[school_id]/page.tsx', title: '지원금관리 > 지원금설정' },

  { path: 'course_site/app/af/ad_free2_cfg/free1/sn/[school_id]/page.tsx', title: '지원금관리 > 순위구분설정' },
  { path: 'course_site/app/af/ad_free2_cfg/free1/write/sn/[school_id]/page.tsx', title: '순위 구분 코드 등록' },

  // 3. 설문관리
  { path: 'course_site/app/af/ad_sur/lists/sn/[school_id]/page.tsx', title: '설문관리 > 설문 목록' },
  { path: 'course_site/app/af/ad_sur/write/sn/[school_id]/page.tsx', title: '신규 설문지 등록' },
  { path: 'course_site/app/af/ad_sur/edit/[id]/sn/[school_id]/page.tsx', title: '설문 정보 수정' },
  { path: 'course_site/app/af/ad_sur/view/[id]/sn/[school_id]/page.tsx', title: '설문 응답 결과 통계' },

  { path: 'course_site/app/af/ad_surs/lists/sn/[school_id]/page.tsx', title: '설문관리 > 샘플설문 템플릿' },
  { path: 'course_site/app/af/ad_surs/view/[id]/sn/[school_id]/page.tsx', title: '샘플설문 템플릿 상세 및 복제' },

  // 4. 환경설정
  { path: 'course_site/app/af/ad_cfg/main/sn/[school_id]/page.tsx', title: '환경설정 > 기본설정' },

  { path: 'course_site/app/af/ad_time/lists/sn/[school_id]/page.tsx', title: '환경설정 > 신청기간 목록' },
  { path: 'course_site/app/af/ad_time/write/sn/[school_id]/page.tsx', title: '신규 신청기간 등록' },
  { path: 'course_site/app/af/ad_time/edit/[id]/sn/[school_id]/page.tsx', title: '신청기간 수정' },

  { path: 'course_site/app/af/ad_cfg/period/sn/[school_id]/page.tsx', title: '환경설정 > 강의시간 설정' },
  { path: 'course_site/app/af/ad_cfg/afDiv/sn/[school_id]/page.tsx', title: '환경설정 > 강좌구분 설정' },
  { path: 'course_site/app/af/ad_cfg/appLiGrp/sn/[school_id]/page.tsx', title: '환경설정 > 중복제한그룹 설정' },
  { path: 'course_site/app/af/ad_verify/main/sn/[school_id]/page.tsx', title: '환경설정 > 학적검증 도구' },
  { path: 'course_site/app/af/ad_neis_edufine/lists/sn/[school_id]/page.tsx', title: '환경설정 > 나이스/에듀파인 설정 목록' },
  { path: 'course_site/app/af/ad_neis_edufine/edit/[id]/sn/[school_id]/page.tsx', title: '환경설정 > 나이스/에듀파인 매핑 수정' },
  { path: 'course_site/app/af/ad_cfg/message/sn/[school_id]/page.tsx', title: '환경설정 > 안내글설정' },
  { path: 'course_site/app/af/ad_cfg/clear/sn/[school_id]/page.tsx', title: '환경설정 > 데이터 초기화' },
  { path: 'course_site/app/af/ad_info/modify/sn/[school_id]/page.tsx', title: '환경설정 > 담당자정보 수정' }
];

let created = 0;
let skipped = 0;

for (const r of routes) {
  const fullPath = path.resolve(r.path);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // If ad_faq/main already has the rich 570-line implementation, skip overwriting it
  if (r.path.includes('ad_faq/main/sn') && fs.existsSync(fullPath)) {
    console.log('Preserved existing rich page:', r.path);
    skipped++;
    continue;
  }

  const code = `'use client';

import React from 'react';
import Link from 'next/link';

interface PageProps {
  params: {
    school_id: string;
    id?: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #3b82f6', paddingBottom: '12px' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            ${r.title}
          </h1>
          <span style={{ fontSize: '0.85rem', color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '4px' }}>
            학교 SN: {params?.school_id || '3267'} {params?.id ? \` | ID: \${params.id}\` : ''}
          </span>
        </div>

        <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '24px' }}>
          본 페이지는 디비디비스쿨 방과후학교 관리자 시스템 <strong>${r.title}</strong> 전용 서브 페이지 스캐폴딩입니다.
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#475569',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            ← 뒤로가기
          </button>
          <Link
            href={\`/af/ad_lec/lists/sn/\${params?.school_id || '3267'}\`}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'inline-block'
            }}
          >
            강좌관리 메인으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
`;

  fs.writeFileSync(fullPath, code, 'utf8');
  created++;
}

console.log(`Successfully generated ${created} page.tsx scaffolding files! (Preserved ${skipped})`);
