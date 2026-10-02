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

- [x] **2. 지원금관리 > 수강자관리 페이지 (`/af/ad_free2_app/lists/sn/3267`)**
  - [x] 9종 모달(수강자등록, 수강자검색, 일괄입력, 일괄수정, 일괄복사, 분기별수강자복사, 일괄삭제, 문자전송, 입금일입력) 정중앙 팝업 연결 완료
  - [x] 수강자 등록 모달: 3,000px+ 단일 세로 스크롤을 5열x6행 실시간 비교 매트릭스 그리드로 가독성 혁신 (원본 41개 필드 ID/이벤트 100% 보존)
  - [x] 6대 엑셀 엔드포인트(검색결과, 전체징수, 월별현황, 스쿨뱅킹, 행정실용, 나이스용) 1:1 매핑 및 프리미엄 5대 디자인 원칙 적용
  - [x] 자동화 테스트 스위트(`scratch/test_all_6_excels.py`, `scratch/test_ad_free2_app_complete.py`) 100% ALL PASS

---

## 🛡️ Target 1:1 Complete Extraction & Zero-Omission Standard (누락 원천 방지 영구 규칙)
새 페이지나 모달을 작업할 때 누락 없이 1:1 완벽 매칭을 보장하기 위해 반드시 아래 원칙을 준수한다:
1. **타깃 전체 DOM(outerHTML) 전수 덤프**: 부분 스크린샷이나 뷰포트에 의존하지 않고, 전체 컨테이너의 `outerHTML`을 `scratch/*.html`로 100% 저장 후 필드를 파악한다.
2. **필드 전수 자동화 대조 검증 (Automated Field-List Diff)**: 타깃 DOM의 모든 `input, select, textarea, button`의 `id` 및 `name` 목록을 스크립트로 추출하여 로컬 구현과 비교하고, `missing: []`임을 자동화 테스트 하네스에서 검증 완료해야 한다.
3. **단일 모달 보장 (중복 ID 방지)**: 모달 수정/교체 시 파일 내 기존 동일 ID 모달이 남아있지 않도록 시작/종료 주석 경계를 완전 교체한다.
4. **타깃 원본 속성 및 계산식 100% 이식**: 타깃의 ID, name, class, 인라인 이벤트(`chkFreeMoney`, `chkSumFreeMoney`, `chkMoney` 등)를 원형 그대로 유지하여 누락을 구조적으로 방지한다.
5. **사이드바 레이아웃 보존**: 외부 페이지 이동 없이 항상 좌측 사이드바를 유지한 상태에서 정중앙 모달 팝업으로 연결한다.

---

## 🎨 모달 가독성 극대화 표준 (Modal Ergonomics Standard)
타깃 페이지의 세로 스크롤 지옥을 해소하고 사용성과 심미성을 극대화하기 위해 새 모달 작성 시 다음 표준을 필수 적용한다:
1. **테마 일체화**: `#337ab7` 부트스트랩 프라이머리 블루 헤더 + 화이트 볼드 타이틀 + FontAwesome 아이콘 + 우측 상단 `&times;` 화이트 닫기 버튼.
2. **상단 2열 정보 요약 카드 (50%:50%)**:
   - 좌측: 수강기준월/구분 옵션 셀렉터
   - 우측: 대상 학생명, 학적 배지(학년/반/번호), 신청 강좌명, [학생 검색] 버튼
3. **비용/차감 비교 매트릭스 그리드 (Matrix Grid Layout)**:
   - 3,000px+ 세로 나열 대신 `6행 x 5열` 구조로 실시간 가로 대조:
     - 행(Row): 수강료, 강사료, 수용비, 교재비, 재료비, 합계
     - 열(Col): 신청비용(A) | 지원금1(B1) | 지원금2(B2) | 지원금3(B3) | 최종 징수액(A-ΣB)
   - 파스텔 컬러 블록으로 구분: 신청(하늘색), 지원금(연파랑), 징수액(연주황/오렌지 강조).
4. **보조 입력란 2열 대칭 분할**:
   - 비고(Remark)와 변경/수정 로그(Log)를 좌우 2열로 배치하여 수직 스크롤 80% 단축.
5. **타깃 원본 필드 무손실 보존**:
   - 레이아웃을 반응형 매트릭스로 재편하더라도 타깃 원본의 ID, name, 인라인 연산 이벤트(`onkeyup="chkMoney(this)"` 등)는 100% 보존.

---

## 📊 엑셀 1:1 매핑 및 프리미엄 가독성 5대 원칙 (Excel Export Standard)
타깃 페이지의 모든 엑셀 내보내기 버튼은 실무자가 출력 및 보고서로 즉시 사용할 수 있도록 고품격 디자인으로 1:1 매핑한다:
1. **원칙 1: 대제목 타이틀 (Hero Title)**
   - 16~17pt bold + 각 리포트 성격에 맞는 딥 테마 컬러 (검색결과: `#1e40af` 블루, 전체징수: `#047857` 에메랄드, 월별현황: `#3730a3` 인디고, 스쿨뱅킹: `#9a3412` 브론즈, 행정실용: `#831843` 와인, 나이스용: `#0f766e` 틸 등).
2. **원칙 2: 메타 정보 요약 배너 (Metadata Summary Bar)**
   - 학교명, 출력일시, 기준 월/검색조건, 총 대상 인원수, 총 징수/지원금 금액 합계를 상단 요약 카드로 명시.
3. **원칙 3: 헤더 영역별 파스텔 컬러 코딩 (Header Color-Coding)**
   - 기본 인적사항(`background: #f1f5f9; color: #334155;`)
   - 신청/산출비용(`background: #e0f2fe; color: #0369a1;`)
   - 지원금 차감내역(`background: #dbeafe; color: #1d4ed8;`)
   - 최종 징수액/결과(`background: #ffedd5; color: #c2410c; font-weight: bold;`)
4. **원칙 4: 숫자 셀 천단위 포맷 및 지브라 행 (Data Readability)**
   - 홀수/짝수 행 배경 교차(`background: #ffffff;` / `background: #f8fafc;`)
   - 모든 금액/수량 셀에 엑셀 전용 천단위 콤마 서식(`mso-number-format: "#,##0"; text-align: right;`) 적용
   - 번호, 학년, 반, 번호, 상태, 은행명 등 식별자는 중앙 정렬(`text-align: center;`)
5. **원칙 5: 하단 총 결산 합계 행 (Total Summary Row)**
   - 리포트 최하단에 `총 결산 합계 (Total)` 행 필수 배치 (`background: #fef3c7; border-top: 2px solid #f59e0b; border-bottom: 2px solid #f59e0b; font-weight: bold;`)
   - 전체 수강료 총합, 지원금 총합, 실징수액 총합을 완벽 집계.


