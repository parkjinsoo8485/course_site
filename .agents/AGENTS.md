# Project Rules: dbdbschool Clone & LMS Expert

- All features must support 3 distinct roles: `school_admin`, `teacher` (instructor), and `parent` (student/parent).
- Frontend layout must render dynamic Role-Based Access Control (RBAC) sidebar navigation matching the official manual.
- Data structures must support Edufine grouping, lottery priorities, auto-renewal, fractional refunds, time-slot conflict detection, safety schedules, and class Q&A channels.
- Run automated test harness scripts (`scratch/test_*.js`) for every phase before claiming success.

## Error Prevention & Code Quality Guidelines (Learned Lessons)
- **HTML DOM Structure Integrity**: When modifying HTML files, always verify that parent/child boundaries, `<form>`, `<aside>`, and `<div>` tags are strictly closed and not inadvertently merged into attribute values or truncated.
- **Server Process & Route Synchronization**: Whenever new API routes are added or modified in `server.js`, restart the active background server process (PORT 3005) and execute automated validation before finishing.
- **UI Button Alignment Standard**: Action buttons (`[취소]`, `[엑셀 출력]`, etc.) must use unified height (`height: 30px`), padding (`0 14px`), and flex centering (`display: inline-flex; align-items: center; justify-content: center; line-height: 1;`) to prevent vertical baseline drift.
- **Select Dropdown `<select>` Vertical Alignment Standard**:
  - Never apply numeric/pixel `line-height` (e.g. `line-height: 28px`) to `<select>` elements; in Chromium/WebKit engines, it causes the font baseline to drift below the box bottom, clipping the lower half of option text.
  - Always use `line-height: normal !important;`, `box-sizing: border-box !important;`, `height: 30px;`, balanced horizontal padding (`padding: 0 24px 0 10px;`), and `vertical-align: middle;`.
  - For paired select & input groups (e.g., classroom selection `#add_lec_room_sel` and `#add_lec_room`), wrap them in an inline-flex container (`display: inline-flex; align-items: center; gap: 6px;`) with matching 30px height and aligned baselines.
- **Optimal Cloning Workflow (Quota & Accuracy Standard)**:
  - When cloning specific pages or modals, avoid parsing heavy HAR files (1MB+) or guessing CSS from screenshots. Always request or use extracted live `outerHTML` (`scratch/*.html`) for exact structural fidelity.
  - Separate cloning into 2 isolated steps: Step 1 (pure DOM/CSS layout placement without JS side effects) -> Step 2 (JS dynamic binding & backend API integration). Full guide documented in [docs/OPTIMAL_CLONING_WORKFLOW_GUIDE.md](file:///c:/Users/user/My%20project/course/course_site/docs/OPTIMAL_CLONING_WORKFLOW_GUIDE.md).
- **User UX Preference: Page Navigation vs Modal Connection Standard**:
  - **Do NOT navigate away to external standalone pages** when connecting sub-action features (e.g. '강좌 일괄입력', '일괄수정', '일괄복사' 등).
  - **Always keep the existing left sidebar and layout 100% intact**, and connect the target feature/form as a centered in-page modal popup.
- **Target 1:1 Complete Extraction & Zero-Omission Standard (타깃 페이지/모달 1:1 완벽 매칭 및 누락 원천 방지 규칙)**:
  - **누락 발생 근본 원인 (반드시 방지)**:
    1. **뷰포트 부분 캡처 의존**: 스크롤이 긴(3,000px+) 페이지/모달을 상단 화면만 보고 작업하면 하단 섹션(지원금별 분할, 징수금액, 비고, 로그, 도움말 등)이 대거 누락됨.
    2. **임의 ID/구조 축약**: 타깃의 원본 속성(`app_lec_pay`, `free2_lec_pay`, `co_amount_lec_pay` 등) 대신 임의의 변수명으로 단순화하면서 계산식과 서브 필드가 생략됨.
    3. **파일 부분 치환 시 구버전 모달 잔존 (중복 ID 충돌)**: 새 모달을 삽입할 때 기존 모달 범위를 완전히 교체하지 않아 하단에 구버전 모달이 남아 오동작 유발.
    4. **전수 필드 Diff 검증 미실시**: 타깃 DOM의 모든 입력/선택/버튼 요소를 스크립트로 전수 추출하여 1:1 대조하지 않고 육안으로만 판단.
  - **영구 방지 행동 지침 (필수 준수)**:
    1. **타깃 전체 DOM(outerHTML) 전수 덤프**: 타깃 페이지/모달 접근 시 스크린샷에 의존하지 않고 CDP/브라우저 스크립트를 통해 전체 컨테이너의 `outerHTML`을 `scratch/*.html`로 100% 저장 후 분석한다.
    2. **필드 전수 자동화 대조 검증 (Automated Field-List Diff)**: 타깃 DOM의 모든 `input, select, textarea, button`의 `id` 및 `name` 목록을 스크립트로 추출하여 로컬 구현과 비교하고, `missing: []`임을 자동화 테스트 하네스에서 검증 완료해야 한다.
    3. **단일 모달 보장 (중복 ID 방지)**: 모달 수정/교체 시 파일 내 기존 동일 ID 모달이 남아있지 않도록 시작/종료 주석 경계를 완전 교체한다.
    4. **타깃 원본 속성 및 계산식 100% 이식**: 타깃의 ID, name, class, 인라인 이벤트(`chkFreeMoney`, `chkSumFreeMoney`, `chkMoney` 등)를 원형 그대로 유지하여 누락을 구조적으로 방지한다.
- **Modal Readability & Ergonomics Standard (모달 가독성 극대화 표준)**:
  - **3,000px+ 단일 세로 스크롤 지옥 금지**: 타깃 사이트가 긴 단일 테이블로 되어 있더라도, 모달 뷰에서는 스크롤을 80% 이상 단축하는 고효율 반응형 레이아웃으로 개선한다.
  - **헤더 통일**: 로컬 디자인 테마인 `#337ab7` 블루 헤더, 화이트 텍스트, FontAwesome 아이콘, 화이트 닫기(`&times;`) 버튼을 기본 적용한다.
  - **상단 2열 정보 요약 카드**: 대상 월/옵션(좌측) + 학생명/학적(학년/반/번호 배지)/강좌명/검색 버튼(우측) 50%:50% 대칭 배치.
  - **비용/차감 비교 매트릭스 그리드 (Matrix Grid Layout)**: 수강료, 강사료, 수용비, 교재비, 재료비, 합계 6행 x 구분 열(신청, 지원금1, 지원금2, 지원금3, 최종 징수액)로 가로 대조 배치하여 한눈에 모든 차감 및 계산식을 파악할 수 있도록 한다.
  - **하단 보조 입력란 2열 분할**: 비고와 변경로그를 나란히 2열로 배치하여 수직 낭비를 최소화한다.
  - **타깃 원본 1:1 필드 및 계산식 100% 보존**: 가독성을 높여 레이아웃을 재구성하더라도 타깃 원본의 41개 이상 필수 `id`, `name`, `chkMoney`, `chkFreeMoney`, `chkSumFreeMoney` 등 연산 로직과 이벤트 핸들러는 1글자도 누락 없이 100% 유지한다.
- **Excel 1:1 Mapping & Premium Styling Standard (엑셀 1:1 매핑 및 프리미엄 가독성 5대 원칙)**:
  - 타깃 페이지의 모든 엑셀 다운로드 버튼(검색결과, 전체징수, 월별현황, 스쿨뱅킹, 행정실용, 나이스용, 정산 등)과 1:1 대응하는 전용 엔드포인트를 구현한다.
  - 단순 흑백 텍스트 테이블이 아닌, 실무자가 즉시 보고용으로 사용할 수 있는 고품격 5대 디자인 원칙을 필수로 적용한다:
    1. **원칙 1: 대제목 타이틀 (Hero Title)**: 상단에 16~17pt bold + 리포트 성격에 맞는 딥 테마 컬러 (`#1e40af` 블루, `#047857` 그린, `#3730a3` 인디고, `#9a3412` 오렌지, `#831843` 와인 등).
    2. **원칙 2: 메타 정보 배너 (Metadata Summary Bar)**: 상단에 학교명, 출력일시, 기준 월/조건, 총 대상 인원, 총 금액 합계를 요약 카드로 명시.
    3. **원칙 3: 헤더 영역별 파스텔 컬러 블록 (Header Color-Coding)**: 기본정보(`f1f5f9`), 신청/산출(`e0f2fe`), 지원금 차감(`dbeafe`), 실징수액/결과(`ffedd5`/`fed7aa`) 등 데이터 성격에 따라 명확히 색상 구분.
    4. **원칙 4: 숫자 셀 천단위 포맷 및 지브라 행 (Data Readability)**: 홀/짝수 행 배경 교차(`f8fafc`/`ffffff`), 금액/수량 셀에 엑셀 전용 천단위 콤마 포맷(`mso-number-format: "#,##0"`) 적용 및 우측 정렬, 식별자 중앙 정렬.
    5. **원칙 5: 하단 총 결산 합계 행 (Total Summary Row)**: 최하단에 `총 결산 합계 (Total)` 행 필수 배치 (`background: #fef3c7`, 상하 2px 앰버 테두리, 수강총액/지원금총액/실징수액 최종 집계).
- **Next Session Auto-Resume Directive (사용자가 "이어서 계속해" 입력 시 즉각 실행 지침)**:
  - 사용자가 **"이어서 계속해"**, **"계속 진행해"**, **"다음 작업 진행해"** 등 간단한 재개 프롬프트만 입력하면, 다른 질문이나 확인 절차 없이 즉시 [docs/NEXT_SESSION_AUTO_RESUME.md](file:///c:/Users/user/My%20project/course/course_site/docs/NEXT_SESSION_AUTO_RESUME.md)를 로드하여 다음 대기 작업(Sprint 4: 환경설정 파트 B)을 아래 5단계 하네스 파이프라인으로 전자동 실행한다:
    1. **CDP 실시간 DOM 덤프**: 타깃 URL (`/af/ad_time/lists`, `/af/ad_cfg/period`, `/af/ad_cfg/afDiv`, `/af/ad_cfg/appLiGrp`, `/af/ad_verify/main`, `/af/ad_neis_edufine/lists` 등)의 `contents_box` outerHTML 덤프.
    2. **스펙 추출 및 자동 필드 Diff**: 모든 input, select, textarea, button 추출 및 `missing: []` 검증 준비.
    3. **1:1 패널 및 모달 구현**: 기존 사이드바 100% 유지 + 로컬 테마(`#337ab7`) 적용 + 전수 속성/이벤트 이식.
    4. **무결성 자동화 하네스 실행 (`scratch/test_verify_*.js`)**: 100% PASS 확인.
    5. **서버(PORT 3005) 재기동 및 브라우저 스모크 검증 완료**.



