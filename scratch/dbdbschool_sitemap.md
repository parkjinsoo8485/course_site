# dbdbschool (학교코드: 3267) 전체 페이지 URL 및 클론 라우트 매핑 맵

> 조사 기준 URL: `https://www.dbdbschool.kr/af/ad_faq/main/sn/3267`
> 조사 완료 일시: 2026-08-15

---

## 1. 헤더 & 시스템 공통 URL

| 메뉴 / 기능 | 원본 URL 경로 | Next.js App Router 파일 경로 | 비고 / 권한 |
|---|---|---|---|
| 학교 메인 / 대시보드 | `/af/ad_lec/lists/sn/3267` | `app/af/ad_lec/lists/sn/[school_id]/page.tsx` | 기본 홈 / 강좌 목록 |
| 알림 목록 (Notification) | `/af/notification/lists/sn/3267` | `app/af/notification/lists/sn/[school_id]/page.tsx` | 공통 알림함 |
| 회원 정보 수정 | `/member/modify/sn/3267` | `app/member/modify/sn/[school_id]/page.tsx` | 내 정보 수정 |
| 로그아웃 | `/member/logout/sn/3267` | `app/api/auth/logout/route.ts` | 인증 해제 API/액션 |
| 고객지원 Q&A 게시판 | `/af/qanda/lists/sn/3267` | `app/af/qanda/lists/sn/[school_id]/page.tsx` | 1:1 문의 / 고객센터 |
| 매뉴얼 & FAQ (현재) | `/af/ad_faq/main/sn/3267` | `app/af/ad_faq/main/sn/[school_id]/page.tsx` | 도움말 / 사용설명서 |

---

## 2. 관리자(School Admin) & LMS 핵심 메뉴 URL

| 대분류 | 메뉴명 | 원본 URL 경로 | Next.js App Router 경로 | 기능 설명 |
|---|---|---|---|---|
| **학교관리** | 서비스 관리 | `/sczigi/service/lists/sn/3267` | `app/sczigi/service/lists/sn/[school_id]/page.tsx` | 학교 기본설정 및 서비스 관리 |
| **강좌관리** | 강좌 목록 | `/af/ad_lec/lists/sn/3267` | `app/af/ad_lec/lists/sn/[school_id]/page.tsx` | 개설 강좌 조회 및 검색 |
| **강좌관리** | 신규 강좌등록 | `/af/ad_lec/write/sn/3267` | `app/af/ad_lec/write/sn/[school_id]/page.tsx` | 강좌 등록 폼 (시간/정원/강사) |
| **신청자관리** | 수강 신청자 목록 | `/af/ad_app/lists/sn/3267` | `app/af/ad_app/lists/sn/[school_id]/page.tsx` | 강좌별 신청 학생 관리 & 상태 변경 |
| **대기자관리** | 대기자 목록 / 추첨 | `/af/ad_wait/lists/sn/3267` | `app/af/ad_wait/lists/sn/[school_id]/page.tsx` | 정원 초과 대기자 관리 및 추첨 처리 |
| **출석부관리** | 출석 현황 통계 | `/af/ad_att/stat/sn/3267` | `app/af/ad_att/stat/sn/[school_id]/page.tsx` | 강좌/일자별 학생 출결 현황 |
| **환불/취소** | 환불/취소 내역 | `/af/ad_ref/lists/sn/3267` | `app/af/ad_ref/lists/sn/[school_id]/page.tsx` | 중도 취소 및 환불금액 산출 |
| **지원금관리** | 대상자관리 | `/af/ad_free2_stu/lists/sn/3267` | `app/af/ad_free2_stu/lists/sn/[school_id]/page.tsx` | 자유수강권 등 지원 대상 학생 목록 |
| **지원금관리** | 수강자관리 | `/af/ad_free2_app/lists/sn/3267` | `app/af/ad_free2_app/lists/sn/[school_id]/page.tsx` | 지원금 수혜 학생 강좌 매칭 |
| **지원금관리** | 지원금설정 | `/af/ad_free2_cfg/main/sn/3267` | `app/af/ad_free2_cfg/main/sn/[school_id]/page.tsx` | 학기별 지원 한도액 설정 |
| **지원금관리** | 순위구분설정 | `/af/ad_free2_cfg/free1/sn/3267` | `app/af/ad_free2_cfg/free1/sn/[school_id]/page.tsx` | 1/2/3순위 대상자 기준 설정 |
| **결석/귀가** | 결석 및 귀가신청 | `/af/ad_abs/lists/sn/3267` | `app/af/ad_abs/lists/sn/[school_id]/page.tsx` | 학부모 결석계 & 안심귀가 신청 |
| **강사관리** | 강사 목록 및 배정 | `/af/ad_tea/lists/sn/3267` | `app/af/ad_tea/lists/sn/[school_id]/page.tsx` | 방과후 강사 프로필 & 권한 부여 |
| **설문관리** | 설문조사 목록 | `/af/ad_sur/lists/sn/3267` | `app/af/ad_sur/lists/sn/[school_id]/page.tsx` | 만족도 설문 생성 및 결과 통계 |

---

## 3. 학부모 / 학생(Parent/Student) 포털 URL

| 메뉴 / 기능 | 원본 URL 경로 | Next.js App Router 파일 경로 |
|---|---|---|
| 학부모 메인 홈 | `/af/main/index/sn/3267` | `app/af/main/index/sn/[school_id]/page.tsx` |
| 온라인 수강신청 | `/af/af_sub_app/main/sn/3267` | `app/af/af_sub_app/main/sn/[school_id]/page.tsx` |
| 학교 공지사항 | `/af/ad_notice/main/sn/3267` | `app/af/ad_notice/main/sn/[school_id]/page.tsx` |
| 질의응답 (Q&A) | `/af/ad_qna/main/sn/3267` | `app/af/ad_qna/main/sn/[school_id]/page.tsx` |
| 활동 갤러리 | `/af/ad_gallery/main/sn/3267` | `app/af/ad_gallery/main/sn/[school_id]/page.tsx` |
| 학부모 로그인 | `/af/login/login/sn/3267` | `app/af/login/login/sn/[school_id]/page.tsx` |
| 회원가입 / 학생등록 | `/af/join/index/sn/3267` | `app/af/join/index/sn/[school_id]/page.tsx` |

---

## 4. 강사(Teacher) 전용 포털 URL

| 메뉴 / 기능 | 원본 URL 경로 | Next.js App Router 파일 경로 |
|---|---|---|
| 강사 출석부 입력 | `/af/tc_attend/main/sn/3267` | `app/af/tc_attend/main/sn/[school_id]/page.tsx` |
| 강의계획 및 수업일지 | `/af/tc_lesson/main/sn/3267` | `app/af/tc_lesson/main/sn/[school_id]/page.tsx` |
| 교육일지 (Diary) | `/af/tc_diary/main/sn/3267` | `app/af/tc_diary/main/sn/[school_id]/page.tsx` |
| 강사료 및 정산 마감 | `/af/tc_salary/main/sn/3267` | `app/af/tc_salary/main/sn/[school_id]/page.tsx` |

---

## 5. 정산 / 행정 / 에듀파인 연동 URL

| 기능명 | 원본 URL 경로 | Next.js App Router 파일 경로 |
|---|---|---|
| 수강료 산출 & 수납 | `/af/ad_accounting/main/sn/3267` | `app/af/ad_accounting/main/sn/[school_id]/page.tsx` |
| 방과후 통계 분석 | `/af/ad_stats/main/sn/3267` | `app/af/ad_stats/main/sn/[school_id]/page.tsx` |
| 알림톡 / SMS 전송 | `/af/ad_sms/main/sn/3267` | `app/af/ad_sms/main/sn/[school_id]/page.tsx` |
| 환경설정 / 신청기간 제어 | `/af/ad_config/main/sn/3267` | `app/af/ad_config/main/sn/[school_id]/page.tsx` |
