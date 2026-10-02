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

---

## 2. 다음 즉시 실행할 작업 대상: [Sprint 4] 환경설정 파트 B (운영 규칙 및 연동)

사용자가 **"이어서 계속해"**를 입력하면, AI는 즉시 아래 1번 타깃부터 파이프라인을 가동한다:

### 타깃 목록:
1. **신청기간 설정** (`https://www.dbdbschool.kr/af/ad_time/lists/sn/3267` ➔ 로컬: `/af/ad_time/lists/sn/3267`)
   * 학년별(1~6학년) 수강신청 시작일시 ~ 종료일시 Date/Time Picker, 취소/정정 기간, 저장 API
2. **강의시간 설정** (`https://www.dbdbschool.kr/af/ad_cfg/period/sn/3267` ➔ 로컬: `/af/ad_cfg/period/sn/3267`)
   * 교시 목록 그리드 (1교시~N교시: 시작~종료), 순서 변경(▲/▽), 추가/삭제/일괄생성 모달
3. **강좌구분 설정** (`https://www.dbdbschool.kr/af/ad_cfg/afDiv/sn/3267` ➔ 로컬: `/af/ad_cfg/afDiv/sn/3267`)
   * 강좌 구분 코드 그리드 (구분코드, 구분명, 사용여부), 추가/수정/삭제/일괄저장
4. **중복제한그룹 설정** (`https://www.dbdbschool.kr/af/ad_cfg/appLiGrp/sn/3267` ➔ 로컬: `/af/ad_cfg/appLiGrp/sn/3267`)
   * 그룹 목록, 그룹추가 모달, 강좌선택 체크박스 모달, 저장 API
5. **학적검증** (`https://www.dbdbschool.kr/af/ad_verify/main/sn/3267` ➔ 로컬: `/af/ad_verify/main/sn/3267`)
   * 학적 불일치 대조 그리드, 검증 실행, 엑셀 출력 (`/af/ad_verify/excel`), 동기화 API
6. **나이스/에듀파인 설정** (`https://www.dbdbschool.kr/af/ad_neis_edufine/lists/sn/3267` ➔ 로컬: `/af/ad_neis_edufine/lists/sn/3267`)
   * 과목/강좌 코드 매핑, 엑셀 양식 다운로드, 엑셀 일괄 업로드, 매핑 저장
7. **안내글설정, 초기화, 담당자정보** (`/af/ad_cfg/message`, `/af/ad_cfg/clear`, `/af/ad_info/modify`)

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
