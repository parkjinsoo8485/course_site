# [Auto-Resume Directive] "이어서 계속해" 트리거 시 즉시 실행 가이드

> **본 문서는 사용자가 집(또는 다음 세션)에서 "이어서 계속해"라고만 입력했을 때, AI 어시스턴트가 다른 질문 없이 즉각 다음 작업을 전속력으로 자동 실행하기 위한 실행 예약 지침서입니다.**

---

## 1. 현재까지 완료된 작업 상태 (Ground Truth)

* ✅ **Sprint 1 (학생 연계 핵심 일정)**: 
  * 귀가일정표 (`/af/ad_rsch/lists/sn/3267`) 및 서브 모달 3종 100% 완료
  * 결석/귀가신청 (`/af/ad_abs/lists/sn/3267`) 및 신청/수정 모달 100% 완료
* ✅ **Sprint 2 (강사 및 설문 관리)**:
  * 강사관리 (`/af/ad_tea/lists/sn/3267`) 및 강사 등록/수정/일괄입력/시간표 모달 100% 완료
  * 설문관리 (`/af/ad_sur/lists/sn/3267`, `/af/ad_surs/lists/sn/3267`) 및 4개 모달 100% 완료
* ✅ **Sprint 3 (환경설정 파트 A - 기본설정군)**:
  * 기본설정, 강사권한, 출석부옵션, 문자설정 4개 서브탭 1:1 완벽 패널 통합
  * 전자 서명 캔버스 패드 모달 (`#modal_sign_pad`) 및 교직원 관리자 검색 모달 (`#modal_admin_search`) 탑재
  * `cfg_logic.js` 및 서버 API 5종 (`/api/ad_cfg/*`), 자동화 하네스 (`test_verify_ad_cfg.js`) 17/17 PASS
* ✅ **Sprint 4 (환경설정 파트 B - 운영 규칙 및 연동)**:
  * 신청기간, 강의시간, 강좌구분, 중복제한그룹, 학적검증, 나이스/에듀파인, 안내글, 초기화, 담당자정보 7개 서브모델 & 4종 모달 완벽 탑재
  * `cfg_part_b_logic.js` 26개 클라이언트 함수 및 서버 REST API 16종 + 프리미엄 학적검증 엑셀 리포트 구현
  * 자동화 테스트 하네스 (`test_verify_ad_cfg_part_b.js`) 34/34 100% ALL PASS

---

## 2. 다음 즉시 실행할 작업 대상: [Sprint 5] 알림관리 / 푸시알림관리 / 연장신청 및 학부모·강사 포털

사용자가 **"이어서 계속해"**를 입력하면, AI는 즉시 아래 1번 타깃부터 파이프라인을 가동한다:

### 타깃 목록:
1. **알림관리 (SMS/알림톡)** (`/af/notification/lists/sn/3267` ➔ `panel_notification_lists`)
   - 발송 내역 조회, 신규 알림 작성 모달, 수신자 선택 모달, 발송 예약, 충전/잔여건수 연동
   - *(사양서: [docs/NOTIFICATION_PUSH_MESSAGING_SPEC.md](file:///c:/My_Project/course/course_site/docs/NOTIFICATION_PUSH_MESSAGING_SPEC.md) 참조)*
2. **푸시알림관리 (Smart Push)** (`/af/spush/lists/sn/3267` ➔ `panel_spush_lists`)
   - 100% 무료 스마트 웹 푸시(Web Push) 엔진 + 무료 테스트(Mock)/실제 SMS 듀얼 발송 모달 (`#modal_spush_send`)
   - 학년/반/강좌별 타겟팅 필터링, 치환 변수(`#{학생명}` 등) 원클릭 삽입, 즉시/예약 발송
   - *(사양서: [docs/NOTIFICATION_PUSH_MESSAGING_SPEC.md](file:///c:/My_Project/course/course_site/docs/NOTIFICATION_PUSH_MESSAGING_SPEC.md) 참조)*
3. **연장신청 (SaaS 구독 갱신)** (`/af/ad_extension/lists/sn/3267` ➔ `panel_ad_extension_lists`)
   - 학교 서비스 이용 기간 연장 신청, 요금제 선택, 결제/계좌이체 요청 모달
4. **학부모 포털 (Parent LMS)** (`/af/main/index/sn/3267`, `/af/af_sub_app/main/sn/3267`)
   - 온라인 수강신청, 내 자녀 수강/대기 현황, 결석/귀가 온라인 신청, 실시간 출결 알림
5. **강사 포털 (Teacher Portal)** (`/af/tc_attend/main/sn/3267`, `/af/tc_lesson/main/sn/3267`)
   - 모바일 출석체크 웹앱, 차시별 교육일지 작성, 강사료 정산 명세서 조회

---

## 3. 실행 단계 파이프라인 (5-Step Execution Pipeline)

1. **[Step 1] CDP 실시간 원본 덤프**:
   * 타깃 크롬 브라우저(포트 9222)에 접속하여 대상 URL들의 `contents_box` outerHTML을 `scratch/target_*.html`로 100% 덤프.
2. **[Step 2] 스펙 추출 (Automated Field Inventory)**:
   * 모든 폼, input, select, textarea, button을 JSON 스펙으로 추출.
3. **[Step 3] 1:1 완벽 패널 및 모달 구현 (Zero-Omission Standard)**:
   * 기존 사이드바 100% 유지 + 로컬 테마(`#337ab7`) 적용 + 버튼 30px flex 통일 + 타깃 원본 속성/계산식 100% 바인딩.
4. **[Step 4] 무결성 자동화 하네스 검증**:
   * `scratch/test_verify_{menu}.js` 작성 및 실행하여 `missing: []` 및 HTTP 200 검증 100% PASS 확인.
5. **[Step 5] 서버 동기화 & 브라우저 스모크 검증**:
   * `server.js` 프로세스(PORT 3005) 재기동 및 브라우저 서브에이전트로 UI 확인.

---

## 4. 특수 지침: 사용자가 "누락 방지 md 파일"을 제공하는 경우

사용자가 특정 md 파일(인벤토리)의 경로를 주거나 내용을 붙여넣는 경우:
1. 최우선으로 해당 md 파일 내의 모든 버튼명, 모달 ID, 엑셀 출력 버튼, 폼 필드를 스크립트로 자동 파싱.
2. 현재 구현체와 1:1 Diff 검증을 돌려 누락된 항목을 즉시 도출하고,
3. 누락된 모든 요소를 최우선으로 100% 완벽 보완(`missing: []`)한 후 다음 단계로 전진할 것!
