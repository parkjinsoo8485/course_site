# dbdbschool (sn/3267) 전체 URL 및 라우트 매핑 마스터 파일

> **최종 수집 일시**: 2026-08-15  
> **기준 타깃 사이트**: `https://www.dbdbschool.kr/af/ad_faq/main/sn/3267`  
> **수집 도메인 / 학교 ID**: `www.dbdbschool.kr` / `sn/3267`

---

## 1. 전체 URL 및 Next.js App Router 파일 매핑 목록

### [1] 관리자(School Admin) & LMS 핵심 모듈

| 분류 | 메뉴/화면명 | 원본 URL | Next.js App Router 파일 경로 | 비고 / 주요 기능 |
|---|---|---|---|---|
| **학교관리** | 서비스 관리 | `/sczigi/service/lists/sn/3267` | `app/sczigi/service/lists/sn/[school_id]/page.tsx` | 학교 기본설정 및 사용 서비스 관리 |
| **강좌관리** | 강좌 목록 (대시보드) | `/af/ad_lec/lists/sn/3267` | `app/af/ad_lec/lists/sn/[school_id]/page.tsx` | 개설 강좌 검색, 정원/강사 현황 조회 |
| **강좌관리** | 신규 강좌등록 | `/af/ad_lec/write/sn/3267` | `app/af/ad_lec/write/sn/[school_id]/page.tsx` | 강좌 개설 폼 (시간표, 강의실, 수강료 설정) |
| **신청자관리** | 수강 신청자 목록 | `/af/ad_app/lists/sn/3267` | `app/af/ad_app/lists/sn/[school_id]/page.tsx` | 강좌별 신청 학생 목록 및 승인/취소 상태 변경 |
| **대기자관리** | 대기자 목록 및 추첨 | `/af/ad_wait/lists/sn/3267` | `app/af/ad_wait/lists/sn/[school_id]/page.tsx` | 정원 초과 대기자 관리, 1/2/3순위 자동 추첨 |
| **출석부관리** | 출석 통계/현황 | `/af/ad_att/stat/sn/3267` | `app/af/ad_att/stat/sn/[school_id]/page.tsx` | 강좌/일자별 학생 출결 현황 조회 및 엑셀 다운 |
| **환불/취소** | 환불 및 수강취소 | `/af/ad_ref/lists/sn/3267` | `app/af/ad_ref/lists/sn/[school_id]/page.tsx` | 중도 수강포기 접수, 일할/잔여차시 환불금 산출 |
| **지원금관리** | 대상자관리 (자유수강권) | `/af/ad_free2_stu/lists/sn/3267` | `app/af/ad_free2_stu/lists/sn/[school_id]/page.tsx` | 교육지원 대상 학생 등록 및 바우처 한도 관리 |
| **지원금관리** | 수강자 지원금 매칭 | `/af/ad_free2_app/lists/sn/3267` | `app/af/ad_free2_app/lists/sn/[school_id]/page.tsx` | 학생별 수강 강좌에 지원금 차감 적용 |
| **지원금관리** | 지원금 기본설정 | `/af/ad_free2_cfg/main/sn/3267` | `app/af/ad_free2_cfg/main/sn/[school_id]/page.tsx` | 학기별 지원 한도액 및 적용 정책 설정 |
| **지원금관리** | 순위구분 설정 | `/af/ad_free2_cfg/free1/sn/3267` | `app/af/ad_free2_cfg/free1/sn/[school_id]/page.tsx` | 1순위(기초수급), 2순위(차상위) 기준 설정 |
| **결석/귀가** | 결석 및 안심귀가 | `/af/ad_abs/lists/sn/3267` | `app/af/ad_abs/lists/sn/[school_id]/page.tsx` | 결석 사유서 접수, 안심 알림 동행 확인 |
| **강사관리** | 강사 목록 및 배정 | `/af/ad_tea/lists/sn/3267` | `app/af/ad_tea/lists/sn/[school_id]/page.tsx` | 강사 프로필, 계약 현황 및 강좌 배정 |
| **설문관리** | 만족도 설문조사 | `/af/ad_sur/lists/sn/3267` | `app/af/ad_sur/lists/sn/[school_id]/page.tsx` | 학부모/학생 대상 방과후 만족도 조사 |
| **고객센터** | Q&A 문의게시판 | `/af/qanda/lists/sn/3267` | `app/af/qanda/lists/sn/[school_id]/page.tsx` | 1:1 온라인 문의 및 답변 |
| **안내&FAQ** | 안내 & FAQ 매뉴얼 | `/af/ad_faq/main/sn/3267` | `app/af/ad_faq/main/sn/[school_id]/page.tsx` | 시스템 사용설명서, 동영상 튜토리얼 |

---

### [2] 학부모 / 학생 (Parent & Student) 포털 모듈

| 분류 | 메뉴/화면명 | 원본 URL | Next.js App Router 파일 경로 |
|---|---|---|---|
| **메인 홈** | 학부모 대표 홈 | `/af/main/index/sn/3267` | `app/af/main/index/sn/[school_id]/page.tsx` |
| **수강신청** | 온라인 수강신청 | `/af/af_sub_app/main/sn/3267` | `app/af/af_sub_app/main/sn/[school_id]/page.tsx` |
| **공지사항** | 학교 방과후 공지사항 | `/af/ad_notice/main/sn/3267` | `app/af/ad_notice/main/sn/[school_id]/page.tsx` |
| **문의하기** | 학교 질의응답 (Q&A) | `/af/ad_qna/main/sn/3267` | `app/af/ad_qna/main/sn/[school_id]/page.tsx` |
| **갤러리** | 활동 사진/갤러리 | `/af/ad_gallery/main/sn/3267` | `app/af/ad_gallery/main/sn/[school_id]/page.tsx` |
| **인증** | 학부모 로그인 | `/af/login/login/sn/3267` | `app/af/login/login/sn/[school_id]/page.tsx` |
| **인증** | 회원가입 / 학생등록 | `/af/join/index/sn/3267` | `app/af/join/index/sn/[school_id]/page.tsx` |

---

### [3] 강사 (Teacher) 전용 포털 모듈

| 분류 | 메뉴/화면명 | 원본 URL | Next.js App Router 파일 경로 |
|---|---|---|---|
| **출결입력** | 모바일 출석부 | `/af/tc_attend/main/sn/3267` | `app/af/tc_attend/main/sn/[school_id]/page.tsx` |
| **수업관리** | 강의계획 & 수업일지 | `/af/tc_lesson/main/sn/3267` | `app/af/tc_lesson/main/sn/[school_id]/page.tsx` |
| **활동기록** | 교육활동 일지 | `/af/tc_diary/main/sn/3267` | `app/af/tc_diary/main/sn/[school_id]/page.tsx` |
| **정산확인** | 강사료 정산 및 마감 | `/af/tc_salary/main/sn/3267` | `app/af/tc_salary/main/sn/[school_id]/page.tsx` |

---

### [4] 행정 / 통계 / 에듀파인 연동 모듈

| 분류 | 메뉴/화면명 | 원본 URL | Next.js App Router 파일 경로 |
|---|---|---|---|
| **정산회계** | 수강료 산출 및 수납 | `/af/ad_accounting/main/sn/3267` | `app/af/ad_accounting/main/sn/[school_id]/page.tsx` |
| **통계분석** | 방과후 통계 분석 | `/af/ad_stats/main/sn/3267` | `app/af/ad_stats/main/sn/[school_id]/page.tsx` |
| **메시지** | 문자 / 알림톡 발송 | `/af/ad_sms/main/sn/3267` | `app/af/ad_sms/main/sn/[school_id]/page.tsx` |
| **시스템설정** | 환경설정 / 신청기간 제어 | `/af/ad_config/main/sn/3267` | `app/af/ad_config/main/sn/[school_id]/page.tsx` |
| **공통** | 전체 알림 목록 | `/af/notification/lists/sn/3267` | `app/af/notification/lists/sn/[school_id]/page.tsx` |
| **공통** | 회원 정보 수정 | `/member/modify/sn/3267` | `app/member/modify/sn/[school_id]/page.tsx` |
| **공통** | 로그아웃 | `/member/logout/sn/3267` | `app/api/auth/logout/route.ts` |
