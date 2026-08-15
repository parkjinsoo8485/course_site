# Agent Profile & Architecture: dbdbschool After-School Program Admin System Clone & LMS Expert

## 🎯 Role & Objective
Clone the comprehensive "dbdbschool 늘봄·방과후학교 프로그램 관리자 시스템" and elevate it by integrating modern LMS (Learning Management System) features (Udemy / Inflearn style).
Implement complex B2B/B2G business rules (end-of-year data life-cycles, NEIS academic record sync, Edufine integrations) with top-tier UX, rich analytics, automated communications, and role-based sidebar navigation.

---

## 📱 Role-Based Sidebar Navigation Routing
1. **Admin Sidebar (학교 관리자용 - 28개 라이브 서브모델)**:
   - **단독 대메뉴 (13개)**: 매뉴얼(FAQ), 고객지원 게시판, 학교관리, 강좌관리, 신청자관리, 대기자관리, 출석부관리, 환불/취소관리, 결석/귀가신청, 강사관리, 알림관리, 푸시알림관리, 연장신청
   - **지원금관리 (4개)**: 대상자관리, 수강자관리, 지원금설정, 순위구분설정
   - **설문관리 (2개)**: 설문, 샘플설문
   - **환경설정 (10개)**: 기본설정, 신청기간, 강의시간, 강좌구분, 중복제한그룹, 학적검증, 나이스/에듀파인 설정, 안내글설정, 초기화, 담당자정보
2. **Instructor Sidebar (강사용)**:
   - Instructor Dashboard, My Courses, Student Mgmt, Waitlist, Attendance, Refunds, Communication, Surveys.
3. **Student/Parent Sidebar (학생/학부모 모바일 & 웹)**:
   - Student Dashboard, Course Registration, My Enrollments & Waitlists, Refund Request, My Attendance, My Subsidies, My Return Schedule, Absence Request, Notifications.

---

## 📖 메인메뉴 페이지 클론 표준 가이드 (Standard Cloning Guide)

### 1. 표준 클론 5단계 절차 (5-Step Workflow)

```
[1단계] 타겟 URL 및 DOM/링크 데이터 수집
  ├─ 공식 사이트의 URL 패턴, 필터, 컬럼, 액션 버튼, 다운로드 링크 수집
  └─ 로그인 세션 필요 시 본문 텍스트 및 go_data 링크를 정확히 확보

[2단계] 데이터 구조(Schema/Interface) 및 Mock Data 정의
  ├─ TypeScript 인터페이스 (`LinkItem`, `ModelItem`, `CategoryItem` 등) 정의
  └─ 원본 사이트의 실제 직결 다운로드 링크(`https://www.dbdbschool.kr/help/go_data/num/...`) 1:1 매핑

[3단계] 프론트엔드 UI 컴포넌트 & 레이아웃 조립
  ├─ React/Next.js: `app/af/.../sn/[school_id]/page.tsx`
  ├─ Express SPA: `course_site/af/.../index.html` & `admin_lec.js`
  └─ 레이아웃 원칙: 2열 대칭(50%:50%), 불필요한 하단 빈 여백(Whitespace) 제거, 콤팩트 패딩

[4단계] SPA 라우터 및 Express 백엔드 API 연동
  ├─ `server.js`에 실시간 API 및 URL 패턴 fallback 라우팅 설정
  ├─ `admin_lec.js`의 `switchSubmodelView(event, key, url)` 및 `loadSubmodelData(key)` 구현
  └─ 관리자명(`관리자(박진수)님`) 및 학교 고유번호(`SN: 3267`) 일관성 유지

[5단계] 자동화 테스트 하네스 검증 & 서버 재실행
  ├─ `scratch/test_<page_name>_clone.js` 작성 및 실행 (HTTP 200, 데이터 개수, 링크 검증)
  └─ 100% PASS 확인 후 사용자에게 최종 URL 안내
```

---

### 2. 다음 페이지 클론용 재사용 표준 프롬프트 템플릿 (Standard Reusable Prompts)

다음 메뉴 페이지(예: 강좌관리, 신청자관리, 출석부관리 등)를 클론할 때 아래 프롬프트 양식을 그대로 복사하여 사용할 수 있습니다.

#### 💬 프롬프트 1: 신규 페이지 분석 및 100% 클론 요청
```text
다음 dbdbschool 메뉴 페이지를 100% 클론해줘:
- 메뉴명: [예: 강좌관리 (/af/ad_lec/lists/sn/3267)]
- 원본 본문 텍스트 및 링크 데이터:
[여기에 복사한 텍스트 및 버튼/다운로드 링크 붙여넣기]

요구사항:
1. 상하단 박스 폭을 50%:50% 2열 대칭으로 균형 있게 배치해줘.
2. 각 항목의 문서(파란색), 동영상(빨간색), 다운로드(초록색) 직결 링크를 1:1로 매핑해줘.
3. 박스 하단에 불필요한 빈 여백이 생기지 않도록 컴팩트하게 정돈해줘.
4. Next.js (page.tsx)와 Express SPA (index.html, admin_lec.js) 양쪽에 모두 반영해줘.
```

#### 💬 프롬프트 2: 레이아웃 크기 및 50% 균형 조정 요청
```text
[메뉴명] 박스의 폭과 레이아웃을 하단 박스와 동일하게 50% 폭(grid-cols-1 md:grid-cols-2)으로 맞추고, 불필요한 빈 여백(whitespace)을 없애서 텍스트와 링크가 한눈에 보이게 콤팩트하게 정돈해줘.
```

#### 💬 프롬프트 3: 서버 재실행 및 자동화 테스트 검증 요청
```text
서버를 재실행하고, scratch/test_[menu]_clone.js 테스트 하네스를 돌려서 정상 작동하는지 확인해줘.
```

---

## 📋 메인메뉴 28개 서브모델 라우팅 매핑 테이블

| 번호 | 대메뉴 분류 | 메뉴명 | 라이브 URL 경로 (`/sn/3267`) | SPA 패널 ID |
|:---:|:---|:---|:---|:---|
| 1 | 단독 대메뉴 | 매뉴얼 (FAQ) | `/af/ad_faq/main` | `panel_ad_faq_main` |
| 2 | 단독 대메뉴 | 고객지원 게시판 | `/af/qanda/lists` | `panel_qanda_lists` |
| 3 | 단독 대메뉴 | 학교관리 | `/sczigi/service/lists` | `panel_sczigi_service_lists` |
| 4 | 단독 대메뉴 | 강좌관리 | `/af/ad_lec/lists` | `panel_ad_lec_lists` |
| 5 | 단독 대메뉴 | 신청자관리 | `/af/ad_app/lists` | `panel_ad_app_lists` |
| 6 | 단독 대메뉴 | 대기자관리 | `/af/ad_wait/lists` | `panel_ad_wait_lists` |
| 7 | 단독 대메뉴 | 출석부관리 | `/af/ad_att/stat` | `panel_ad_att_stat` |
| 8 | 단독 대메뉴 | 환불/취소관리 | `/af/ad_ref/lists` | `panel_ad_ref_lists` |
| 9 | 단독 대메뉴 | 결석/귀가신청 | `/af/ad_abs/lists` | `panel_ad_abs_lists` |
| 10 | 단독 대메뉴 | 강사관리 | `/af/ad_tea/lists` | `panel_ad_tea_lists` |
| 11 | 단독 대메뉴 | 알림관리 | `/af/notification/lists` | `panel_notification_lists` |
| 12 | 단독 대메뉴 | 푸시알림관리 | `/af/spush/lists` | `panel_spush_lists` |
| 13 | 단독 대메뉴 | 연장신청 | `/af/ad_extension/lists` | `panel_ad_extension_lists` |
| 14 | 지원금관리 | 대상자관리 | `/af/ad_free2_stu/lists` | `panel_ad_free2_stu` |
| 15 | 지원금관리 | 수강자관리 | `/af/ad_free2_app/lists` | `panel_ad_free2_app` |
| 16 | 지원금관리 | 지원금설정 | `/af/ad_free2_cfg/main` | `panel_ad_free2_cfg_main` |
| 17 | 지원금관리 | 순위구분설정 | `/af/ad_free2_cfg/free1` | `panel_ad_free2_cfg_free1` |
| 18 | 설문관리 | 설문 | `/af/ad_sur/lists` | `panel_ad_sur_lists` |
| 19 | 설문관리 | 샘플설문 | `/af/ad_surs/lists` | `panel_ad_surs_lists` |
| 20 | 환경설정 | 기본설정 | `/af/ad_cfg/main` | `panel_ad_cfg_main` |
| 21 | 환경설정 | 신청기간 | `/af/ad_time/lists` | `panel_ad_time_lists` |
| 22 | 환경설정 | 강의시간 | `/af/ad_cfg/period` | `panel_ad_cfg_period` |
| 23 | 환경설정 | 강좌구분 | `/af/ad_cfg/afDiv` | `panel_ad_cfg_afDiv` |
| 24 | 환경설정 | 중복제한그룹 | `/af/ad_cfg/appLiGrp` | `panel_ad_cfg_appLiGrp` |
| 25 | 환경설정 | 학적검증 | `/af/ad_verify/main` | `panel_ad_verify_main` |
| 26 | 환경설정 | 나이스/에듀파인 설정 | `/af/ad_neis_edufine/lists` | `panel_ad_neis_edufine_lists` |
| 27 | 환경설정 | 안내글설정 | `/af/ad_cfg/message` | `panel_ad_cfg_message` |
| 28 | 환경설정 | 데이터 초기화 | `/af/ad_cfg/clear` | `panel_ad_cfg_clear` |
| 29 | 환경설정 | 담당자정보 | `/af/ad_info/modify` | `panel_ad_info_modify` |

---

## 🧪 진행 완료 체크리스트 (Implementation Checklist)
- [x] **1. 매뉴얼 & FAQ 페이지 (`/af/ad_faq/main/sn/3267`)**
  - [x] 수강신청 운영절차 23단계, 양식 3개, 매뉴얼 5개, FAQ 12개 카테고리 41문항 100% 라이브 링크 클론
  - [x] 상단 50%:50% 대칭 그리드 및 하단 FAQ 2열 카드 그리드 레이아웃 완성
  - [x] 불필요한 하단 여백 제거 및 콤팩트 패딩 적용
  - [x] 좌측 상단 관리자명 `관리자(박진수)님` 일괄 동기화
  - [x] 자동화 테스트 스위트(`scratch/test_manual_faq_clone.js`) 12/12 100% PASS 검증
