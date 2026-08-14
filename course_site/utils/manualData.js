/**
 * utils/manualData.js
 * Comprehensive Dataset for dbdbschool Manual, Operations, Forms, and FAQ System
 */

const OPERATIONS_STEPS = [
  {
    num: 1,
    title: '학교홈페이지 배너 등록',
    docId: 239,
    videoUrl: null,
    summary: '학교 홈페이지에 방과후학교/늘봄학교 전용 배너와 링크(SN: 3267)를 등록하여 학부모가 원클릭으로 접속할 수 있도록 설정합니다.',
    content: `
### 1. 학교홈페이지 배너 등록 절차
- **목적**: 학교 대표 홈페이지 메인 화면에 방과후학교/늘봄학교 신청 배너를 설치하여 학생 및 학부모의 접근성을 극대화합니다.
- **설정 방법**:
  1. 학교 홈페이지 관리자 모드로 접속합니다.
  2. 팝업존 또는 메인 배너 관리 메뉴로 이동합니다.
  3. 제공된 표준 배너 이미지(가로형/세로형)를 업로드합니다.
  4. 링크 URL에 학교 고유 주소(\`https://www.dbdbschool.kr/af/ad_lec/lists/sn/3267\`)를 입력하고 새 창 열기로 설정합니다.
    `
  },
  {
    num: 2,
    title: '학생 이용 동의서 받기',
    docId: 182,
    videoUrl: null,
    summary: '개인정보보호법에 의거하여 방과후학교 온라인 수강신청 시스템 이용에 대한 학부모 동의서를 수합합니다.',
    content: `
### 2. 학생 이용 동의서 수합 가이드
- **필수 고지 항목**: 수집 항목(학번, 성명, 보호자 연락처), 수집 목적(수강신청 및 출결 관리, 스쿨뱅킹 수납), 보유 기간(해당 학년도 종료 시까지).
- **동의 방법**:
  - 온라인 로그인 시 최초 1회 전자 약관 동의 처리
  - 서면 동의서 양식 출력 후 학급별 수합 및 5년간 보관
    `
  },
  {
    num: 3,
    title: '가정통신문 발송',
    docId: 183,
    videoUrl: null,
    summary: '학기별/분기별 수강신청 일정, 접속 주소, 초기 비밀번호 및 유의사항이 담긴 가정통신문을 발송합니다.',
    content: `
### 3. 가정통신문 표준 양식 및 발송 안내
- **발송 시기**: 수강신청 시작일 최소 5일 전 발송 권장.
- **핵심 안내 사항**:
  - 수강신청 기간 (시작 일시 ~ 마감 일시)
  - 초기 비밀번호 안내 (기본: 학년반번호 또는 1234)
  - 1인당 최대 신청 가능 강좌 수 제한 안내
  - 환불 규정 및 교육비 지원금 신청 안내
    `
  },
  {
    num: 4,
    title: '학생등록',
    docId: 71,
    videoUrl: 'https://www.youtube.com/watch?v=71_student_reg',
    summary: '신학기 진급생 및 신입생 명단을 나이스 엑셀 양식으로 일괄 등록하거나 개별 등록합니다.',
    content: `
### 4. 학생 명단 일괄 등록 가이드
1. 나이스(NEIS) 학적 메뉴에서 [학적/학생기본정보] 엑셀 다운로드.
2. 디비디비스쿨 [학생관리 > 학생 일괄등록]에서 엑셀 파일 업로드.
3. 학년, 반, 번호, 성명, 학부모 연락처 매핑 확인 후 [등록 완료].
    `
  },
  {
    num: 5,
    title: '강사등록',
    docId: 185,
    videoUrl: 'https://www.youtube.com/watch?v=72_teacher_reg',
    summary: '방과후학교 및 늘봄학교 강사 계정을 생성하고 강좌 권한 및 출석부 권한을 부여합니다.',
    content: `
### 5. 강사 등록 및 권한 설정
- 강사 아이디, 성명, 휴대전화번호, 은행 계좌정보 입력.
- 출석부 작성 및 강사료 산출 권한 부여.
- 2단계 인증 및 개인정보 취급 서약 전자 동의 진행.
    `
  },
  {
    num: 6,
    title: '환경설정',
    docId: 73,
    videoUrl: 'https://www.youtube.com/watch?v=73_config_setup',
    summary: '학교 기본정보, 서비스명(늘봄학교), 교시별 강의시간, 중복제한그룹을 설정합니다.',
    content: `
### 6. 환경설정 마스터 가이드
- **기본설정**: 서비스명 선택(늘봄학교/방과후학교), 서비스 관리자 지정.
- **강의시간**: 1교시(13:20~14:10), 2교시(14:20~15:10) 등 표준 교시 시간 등록.
- **중복제한그룹**: 동일 시간대 또는 동종 프로그램(돌봄 1부~4부) 간 중복 신청 방지.
    `
  },
  {
    num: 7,
    title: '강좌등록',
    docId: 74,
    videoUrl: 'https://www.youtube.com/watch?v=74_course_reg',
    summary: '23개 표준 컬럼 양식을 활용하여 분기별 개설 강좌를 일괄 등록하거나 개별 등록합니다.',
    content: `
### 7. 강좌 등록 및 23컬럼 양식
- **주요 입력 항목**: 강좌명, 강사ID, 정원, 대기정원, 수강료, 강사료, 수용비, 교재비, 재료비, 강의요일, 강의시간, 대상학년.
- **강좌명 인덱싱**: (월) 바둑 1부, (금) 로봇 등 요일과 번호로 정렬 구성.
    `
  },
  {
    num: 8,
    title: '수강신청 기간 설정',
    docId: 75,
    videoUrl: 'https://www.youtube.com/watch?v=75_period_setup',
    summary: '학년별/구분별로 수강신청 시작일시(초단위)와 종료일시를 설정합니다.',
    content: `
### 8. 수강신청 기간 설정
- **서버 트래픽 분산**: 학년별 시작 시간 분산 (예: 1~2학년 09:00, 3~4학년 09:30).
- **시작 전 카운트다운**: 시작 전까지 학생 화면에 '신청 대기' 카운트다운 타이머 자동 작동.
    `
  },
  {
    num: 9,
    title: '수강신청 테스트',
    docId: 76,
    videoUrl: 'https://www.youtube.com/watch?v=76_apply_test',
    summary: '학부모 오픈 전 관리자 테스트 계정으로 시간표 중복 체크 및 인원 카운팅을 점검합니다.',
    content: `
### 9. 수강신청 테스트 모드 점검
- 가상 학생 계정으로 로그인하여 신청 클릭.
- 정원 초과 시 대기자 전환 동작 확인.
- 시간 중복 강좌 신청 시 알림창 차단 확인.
    `
  },
  {
    num: 10,
    title: '대기자 관리',
    docId: 77,
    videoUrl: 'https://www.youtube.com/watch?v=77_waitlist_mgmt',
    summary: '정원 초과로 대기 등록된 학생의 순번 관리 및 취소자 발생 시 정규 수강생 승격 처리.',
    content: `
### 10. 대기자 관리 및 승격
- 신청 접수순으로 1, 2, 3... 실시간 대기 순번 부여.
- 정규 수강생 취소 시 대기 1순위 학부모에게 자동 알림톡 발송 및 [신청] 승격 버튼 활성화.
    `
  },
  {
    num: 11,
    title: '추첨하기',
    docId: 78,
    videoUrl: 'https://www.youtube.com/watch?v=78_lottery_run',
    summary: '선착순이 아닌 추첨제 운영 시 1~4순위 법정 우선순위 가중치를 적용한 무작위 난수 추첨 실행.',
    content: `
### 11. 공정 무작위 추첨 엔진
- 법정 1순위(기초수급/차상위/한부모), 2순위(다자녀), 3순위(일반) 자동 그룹핑.
- 암호학적 난수 생성기를 통한 실시간 추첨 및 결과 당첨/탈락/대기번호 자동 부여.
    `
  },
  {
    num: 12,
    title: '신청결과 조회',
    docId: 186,
    videoUrl: null,
    summary: '강좌별/학급별 수강생 명단 및 고지서, 시간표를 종합 출력하고 엑셀로 다운로드합니다.',
    content: `
### 12. 신청결과 조회 및 통계
- 강좌별 정원 대비 신청률, 폐강 대상 강좌 식별.
- 학생별 개인 시간표 및 납부 고지서 일괄 출력.
    `
  },
  {
    num: 13,
    title: '출석부 관리',
    docId: 237,
    videoUrl: null,
    summary: '강사가 입력한 일일 출석부를 점검하고 학교장 직인 전자 날인 및 교육일지를 인쇄합니다.',
    content: `
### 13. 온라인 출석부 및 교육일지
- 출석(○), 지각/조퇴(△), 결석(×) 실시간 집계.
- 수업일수 및 출석률에 따른 환불 규정 연동.
- 교육일지 및 월간 출석부 전자 서명 및 문서 출력.
    `
  },
  {
    num: 14,
    title: '수강료 산출',
    docId: 80,
    videoUrl: 'https://www.youtube.com/watch?v=80_fee_calc',
    summary: '학생 수, 총시수, 수용비 비율(예: 5%)을 바탕으로 강사료와 수강료를 자동 산출합니다.',
    content: `
### 14. 수강료 & 강사료 자동 산출
- 수강료 = 강사료 + 수용비 + 교재비 + 재료비.
- 에듀파인 80:20 또는 지정 비율에 따른 수용비 분리 자동 계산.
    `
  },
  {
    num: 15,
    title: '강사마감',
    docId: 81,
    videoUrl: 'https://www.youtube.com/watch?v=81_teacher_lock',
    summary: '강사의 수강생 임의 변경을 방지하기 위해 강좌 수정 권한을 마감(Lock)합니다.',
    content: `
### 15. 강사 마감(Lock) 처리
- 마감(Y) 설정 시 강사는 출석 체크만 가능하며 수강생 추가/삭제/수강료 수정 불가.
    `
  },
  {
    num: 16,
    title: '지원금 관리',
    docId: 255,
    videoUrl: null,
    summary: '늘봄 1·3학년 지원금 및 지자체 바우처 대상자의 월별 지원 한도와 잔액을 관리합니다.',
    content: `
### 16. 늘봄 지원금 관리
- 월 최대 72만원(또는 학기별 지원액) 한도 내에서 수강료 자동 차감.
- 본인 부담금 0원 처리 및 교육청 정산 파일 생성.
    `
  },
  {
    num: 17,
    title: '자유수강권자 관리',
    docId: 187,
    videoUrl: 'https://www.youtube.com/watch?v=82_freesub_mgmt',
    summary: '저소득층 자유수강권(연 60만원 한도) 대상자의 수강료 우선 차감 및 잔액 관리.',
    content: `
### 17. 자유수강권 관리
- 1~4순위 법정 자격 등록.
- 연간 600,000원 한도 내에서 강좌 수강료, 교재비 순차 차감.
    `
  },
  {
    num: 18,
    title: '스쿨뱅킹 파일 다운로드',
    docId: 84,
    videoUrl: 'https://www.youtube.com/watch?v=84_school_banking',
    summary: '농협, 신한, 국민 등 시중 은행 스쿨뱅킹 CMS 펌뱅킹 텍스트(TXT/CSV) 파일을 생성합니다.',
    content: `
### 18. 스쿨뱅킹 CMS 연동 파일
- 학생별 스쿨뱅킹 계좌번호, 예금주, 청구 금액 매핑.
- 시중 은행 표준 80바이트 CMS 파일 원클릭 다운로드.
    `
  },
  {
    num: 19,
    title: '다음달 수강신청 준비',
    docId: 188,
    videoUrl: null,
    summary: '기존 수강생 자동 연장(재수강 우선권) 및 차기월 강좌 복사 절차를 진행합니다.',
    content: `
### 19. 다음달/다음분기 이관 및 강좌 일괄복사
- [강좌 일괄복사]를 통해 시간표 및 수강료 세팅 유지한 채 9월/2분기 개설.
- 기존 수강생 재등록 기간 선오픈 설정.
    `
  },
  {
    num: 20,
    title: '환불자 관리',
    docId: 85,
    videoUrl: 'https://www.youtube.com/watch?v=85_refund_mgmt',
    summary: '수업 개시 전 전액 환불, 1/3 경과 전 2/3 환불, 1/2 경과 전 1/2 환불 규정 자동 정산.',
    content: `
### 20. 환불/취소 관리 규정
- **수업 시작 전**: 수강료, 교재비, 재료비 전액(100%) 환불.
- **총 수업시간 1/3 경과 전**: 수강료의 2/3 환불.
- **총 수업시간 1/2 경과 전**: 수강료의 1/2 환불.
- **총 수업시간 1/2 경과 후**: 반환하지 아니함.
    `
  },
  {
    num: 21,
    title: '데이터 백업 및 초기화',
    docId: 190,
    videoUrl: 'https://www.youtube.com/watch?v=86_data_backup',
    summary: '학년도 마감 시 전체 데이터 암호화 백업 및 신학년도 맞이 데이터 초기화 실행.',
    content: `
### 21. 신학년도 데이터 초기화 & 백업
- 전체 수강생 명부, 출석부, 회계 결산 엑셀 전체 압축 다운로드.
- 신학기 진급을 위한 학생/강좌 데이터 초기화.
    `
  },
  {
    num: 22,
    title: '설문조사 가정통신문',
    docId: 191,
    videoUrl: null,
    summary: '학부모/학생 만족도 조사를 위한 설문조사 안내문 및 QR코드 생성.',
    content: `
### 22. 설문조사 가정통신문
- 모바일 QR코드 및 전용 단축 URL 자동 생성.
- 비밀번호 설정으로 재학생만 참여 가능.
    `
  },
  {
    num: 23,
    title: '설문조사 관리',
    docId: 45,
    videoUrl: 'https://www.youtube.com/watch?v=45_survey_mgmt',
    summary: '5점 척도 및 주관식 문항 설문지 작성, 실시간 응답 집계 및 교육청 보고용 통계 그래프 생성.',
    content: `
### 23. 만족도 설문조사 관리
- 객관식(5점 리커트 척도), 주관식 문항 지원.
- 강좌별 만족도 점수(평균/표준편차) 자동 집계 및 보고서 출력.
    `
  }
];

const TEMPLATE_DOWNLOADS = [
  {
    id: 177,
    title: '배너 / 팝업 이미지',
    types: [
      { name: '배너', url: '/api/manual/download/banner' },
      { name: '팝업', url: '/api/manual/download/popup' }
    ]
  },
  {
    id: 88,
    title: '학생 수강신청 안내 동영상',
    types: [
      { name: '동영상', url: 'https://www.youtube.com/watch?v=student_guide_video', isVideo: true },
      { name: '다운로드', url: '/api/manual/download/student_guide_mp4' }
    ]
  },
  {
    id: 181,
    title: '모바일 앱 이용 방법',
    types: [
      { name: '문서', url: '/api/manual/doc/181' }
    ]
  }
];

const MANUAL_DOWNLOADS = [
  {
    id: 161,
    title: '관리자 수강신청 관리 매뉴얼',
    types: [{ name: '문서', url: '/api/manual/doc/161' }]
  },
  {
    id: 101,
    title: '강사 매뉴얼',
    types: [
      { name: '동영상', url: 'https://www.youtube.com/watch?v=teacher_manual', isVideo: true },
      { name: '초등', url: '/api/manual/doc/162' },
      { name: '중고등', url: '/api/manual/doc/163' }
    ]
  },
  {
    id: 166,
    title: '담임 매뉴얼',
    types: [{ name: '문서', url: '/api/manual/doc/166' }]
  },
  {
    id: 164,
    title: '수강신청 전 필수 점검사항',
    types: [{ name: '문서', url: '/api/manual/doc/164' }]
  },
  {
    id: 165,
    title: '★ 월별 마감 및 다음 달 수강신청 준비 절차 ★',
    isHighlight: true,
    types: [{ name: '문서', url: '/api/manual/doc/165' }]
  }
];

const FAQ_CATEGORIES = [
  {
    category: '학생관리',
    column: 'left',
    items: [
      { q: '학생 비밀번호를 초기화하고 싶어요', docId: 89, videoUrl: 'https://www.youtube.com/watch?v=faq_reset_pw' },
      { q: '로그인 화면에 번호가 다 출력되지 않아요', docId: 154 },
      { q: '학생 진급 처리는 어떻게 하나요?', docId: 61, videoUrl: 'https://www.youtube.com/watch?v=faq_promotion' },
      { q: '1학년 학적이 나오지 않아 가학적으로 받고 싶어요', docId: 62, videoUrl: 'https://www.youtube.com/watch?v=faq_temp_grade' },
      { q: '학생 학적이 중간에 변경되었는데 어떻게 반영하나요?', docId: 134 },
      { q: '학생 학적을 일괄변경하고 싶어요', docId: 135 },
      { q: '다자녀 기능은 어떻게 활용하나요?', docId: 155 },
      { q: '학생 성별 일괄 업데이트 방법', docId: 156 }
    ]
  },
  {
    category: '강좌관리',
    column: 'left',
    items: [
      { q: '강좌 일괄 입력', docId: 92, videoUrl: 'https://www.youtube.com/watch?v=faq_batch_courses' },
      { q: '강좌 일괄 수정 (엑셀로 강좌 정보를 일괄수정하고 싶어요)', docId: 138 },
      { q: '강좌 일괄 삭제 (강좌를 한꺼번에 지우고 싶어요)', docId: 158 },
      { q: '강좌 통계 기능 (강좌 마감 상태 확인)', docId: 93, videoUrl: 'https://www.youtube.com/watch?v=faq_course_stats' },
      { q: '강좌 상태 "출력, 종료, 대기" 이해하기', docId: 159 },
      { q: '정확한 강의시간 중복 체크 방법', docId: 'hwp_duplicate_time' },
      { q: '수강료를 강사료와 수용비로 나눠 관리하고 싶어요', docId: 44 }
    ]
  },
  {
    category: '자유수강권자 관리',
    column: 'left',
    items: [
      { q: '자유수강권자를 추가하고 개별 처리하는 방법', docId: 94, videoUrl: 'https://www.youtube.com/watch?v=faq_freesub_add' },
      { q: '자유수강권자를 환불하고 개별 처리하는 방법', docId: 192 },
      { q: '학생 자유수강권 잔액 조회 기능 활성화', docId: 193 }
    ]
  },
  {
    category: '나이스 방과후학교',
    column: 'left',
    items: [
      { q: '나이스 방과후학교 수강생, 수강료 일괄입력 파일 다운로드', docId: 97, videoUrl: 'https://www.youtube.com/watch?v=faq_neis_export' }
    ]
  },
  {
    category: '환경설정',
    column: 'left',
    items: [
      { q: '학생 최대 신청 강좌수를 제한할 수 있나요?', docId: 194 },
      { q: '안내글 설정', docId: 100 }
    ]
  },
  {
    category: '알림관리',
    column: 'left',
    items: [
      { q: '알림 관리', docId: 195 }
    ]
  },
  {
    category: '계약',
    column: 'left',
    items: [
      { q: '계약을 연장하고 싶어요', docId: 160 }
    ]
  },
  {
    category: '교직원관리',
    column: 'right',
    items: [
      { q: '강사 아이디를 등록하고 권한을 부여하는 방법', docId: 95, videoUrl: 'https://www.youtube.com/watch?v=faq_teacher_auth' },
      { q: '강사가 직접 출석부를 작성하게 하려면 어떻게 하나요?', docId: 196 }
    ]
  },
  {
    category: '수강신청관리',
    column: 'right',
    items: [
      { q: '수강신청 시작 시간 설정 및 카운트다운', docId: 96, videoUrl: 'https://www.youtube.com/watch?v=faq_time_countdown' },
      { q: '수강신청 테스트 모드 사용법', docId: 197 },
      { q: '추첨식 수강신청 방법', docId: 98, videoUrl: 'https://www.youtube.com/watch?v=faq_lottery' },
      { q: '대기자 등록 및 승격 처리', docId: 99, videoUrl: 'https://www.youtube.com/watch?v=faq_wait_promo' },
      { q: '스쿨뱅킹용 수강료 엑셀 다운로드', docId: 198 },
      { q: '수강신청서 및 고지서 출력', docId: 199 },
      { q: '수강신청 취소 및 환불 처리', docId: 200 },
      { q: '신청 마감 후 수강생 추가 등록 방법', docId: 201 }
    ]
  },
  {
    category: '출석부관리',
    column: 'right',
    items: [
      { q: '출석부 일일 현황 조회 및 마감', docId: 202 },
      { q: '출석부 엑셀 파일 출력 및 양식 설정', docId: 203 },
      { q: '출결 통계 및 학생 안전 비고란 관리', docId: 204 },
      { q: '교육일지 출력 및 학교장 날인', docId: 205 }
    ]
  },
  {
    category: '에듀파인',
    column: 'right',
    items: [
      { q: '에듀파인 감면자 입력용 엑셀 파일 출력', docId: 206 }
    ]
  },
  {
    category: '설문관리',
    column: 'right',
    items: [
      { q: '방과후학교 만족도 설문조사 등록 및 결과 집계', docId: 207 }
    ]
  },
  {
    category: '결석/조기귀가',
    column: 'right',
    items: [
      { q: '결석 및 조기귀가 신청 온라인 접수 및 승인', docId: 208 }
    ]
  }
];

module.exports = {
  OPERATIONS_STEPS,
  TEMPLATE_DOWNLOADS,
  MANUAL_DOWNLOADS,
  FAQ_CATEGORIES
};
