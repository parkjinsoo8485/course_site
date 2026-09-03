const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// FAQ 운영 절차 데이터
const FAQ_PROCEDURES = [
  { num: 1,  title: '학교홈페이지 배너 등록',     doc: '/help/go_data/num/239/data/link2' },
  { num: 2,  title: '학생 이용 동의서 받기',       doc: '/help/go_data/num/182/data/link2' },
  { num: 3,  title: '가정통신문 발송',             doc: '/help/go_data/num/183/data/link2' },
  { num: 4,  title: '학생등록',                   doc: '/help/go_data/num/71/data/link2',  video: '/help/go_data/num/71/data/link1' },
  { num: 5,  title: '강사등록',                   doc: '/help/go_data/num/185/data/link2', video: '/help/go_data/num/72/data/link1' },
  { num: 6,  title: '환경설정',                   doc: '/help/go_data/num/73/data/link2',  video: '/help/go_data/num/73/data/link1' },
  { num: 7,  title: '강좌등록',                   doc: '/help/go_data/num/74/data/link2',  video: '/help/go_data/num/74/data/link1' },
  { num: 8,  title: '수강신청 기간 설정',          doc: '/help/go_data/num/75/data/link2',  video: '/help/go_data/num/75/data/link1' },
  { num: 9,  title: '수강신청 테스트',             doc: '/help/go_data/num/76/data/link2',  video: '/help/go_data/num/76/data/link1' },
  { num: 10, title: '대기자 관리',                 doc: '/help/go_data/num/77/data/link2',  video: '/help/go_data/num/77/data/link1' },
  { num: 11, title: '추첨하기',                   doc: '/help/go_data/num/78/data/link2',  video: '/help/go_data/num/78/data/link1' },
  { num: 12, title: '신청결과 조회',               doc: '/help/go_data/num/186/data/link2' },
  { num: 13, title: '출석부 관리',                 doc: '/help/go_data/num/237/data/link2' },
  { num: 14, title: '수강료 산출',                 doc: '/help/go_data/num/80/data/link2',  video: '/help/go_data/num/80/data/link1' },
  { num: 15, title: '강사마감',                   doc: '/help/go_data/num/81/data/link2',  video: '/help/go_data/num/81/data/link1' },
  { num: 16, title: '지원금 관리',                 doc: '/help/go_data/num/255/data/link2' },
  { num: 17, title: '자유수강권자 관리',            doc: '/help/go_data/num/187/data/link2', video: '/help/go_data/num/82/data/link1' },
  { num: 18, title: '스쿨뱅킹 파일 다운로드',       doc: '/help/go_data/num/84/data/link2',  video: '/help/go_data/num/84/data/link1' },
  { num: 19, title: '다음달 수강신청 준비',         doc: '/help/go_data/num/188/data/link2' },
  { num: 20, title: '환불자 관리',                 doc: '/help/go_data/num/85/data/link2',  video: '/help/go_data/num/85/data/link1' },
  { num: 21, title: '데이터 백업 및 초기화',        doc: '/help/go_data/num/190/data/link2', video: '/help/go_data/num/86/data/link1' },
  { num: 22, title: '설문조사 가정통신문',          doc: '/help/go_data/num/191/data/link2' },
  { num: 23, title: '설문조사 관리',               doc: '/help/go_data/num/45/data/link2',  video: '/help/go_data/num/45/data/link1' },
];

const FAQ_TEMPLATES = [
  { title: '배너 / 팝업 이미지', links: [
    { label: '배너 문서', href: '/help/go_data/num/177/data/link2', type: 'doc' },
    { label: '팝업 이미지 문서', href: '/help/go_data/num/178/data/link2', type: 'doc' }
  ]},
  { title: '학생 수강신청 안내 동영상', links: [
    { label: '동영상', href: '/help/go_data/num/88/data/link1', type: 'video' },
    { label: '다운로드', href: '/help/go_data/num/168/data/link2', type: 'doc' }
  ]},
  { title: '모바일 앱 이용 방법', links: [
    { label: '문서', href: '/help/go_data/num/181/data/link2', type: 'doc' }
  ]},
];

const FAQ_MANUALS = [
  { title: '관리자 수강신청 관리 매뉴얼', links: [{ label: '문서', href: '/help/go_data/num/161/data/link2', type: 'doc' }] },
  { title: '강사 매뉴얼', links: [
    { label: '동영상', href: '/help/go_data/num/101/data/link1', type: 'video' },
    { label: '초등학교 문서', href: '/help/go_data/num/162/data/link2', type: 'doc' },
    { label: '중고등학교 문서', href: '/help/go_data/num/163/data/link2', type: 'doc' }
  ]},
  { title: '담임 매뉴얼', links: [{ label: '문서', href: '/help/go_data/num/166/data/link2', type: 'doc' }] },
  { title: '수강신청 전 필수 점검사항', links: [{ label: '문서', href: '/help/go_data/num/164/data/link2', type: 'doc' }] },
  { title: '월별 마감 및 다음 달 수강신청 준비 절차', isHighlight: true, links: [{ label: '문서', href: '/help/go_data/num/165/data/link2', type: 'doc' }] },
];

const FAQ_CATEGORIES = [
  { category: '학생관리', items: [
    { title: '학생 비밀번호를 초기화하고 싶어요', doc: '/help/go_data/num/89/data/link2', video: '/help/go_data/num/89/data/link1' },
    { title: '로그인 화면에 번호가 다 출력되지 않아요', doc: '/help/go_data/num/154/data/link2' },
    { title: '학생 진급 처리는 어떻게 하나요?', doc: '/help/go_data/num/61/data/link2', video: '/help/go_data/num/90/data/link1' },
    { title: '1학년 학적이 나오지 않아 가학적으로 받고 싶어요', doc: '/help/go_data/num/62/data/link2', video: '/help/go_data/num/62/data/link1' },
    { title: '학생 학적이 중간에 변경되었는데 어떻게 반영하나요?', doc: '/help/go_data/num/134/data/link2' },
    { title: '학생 학적을 일괄변경하고 싶어요', doc: '/help/go_data/num/135/data/link2' },
    { title: '다자녀 기능은 어떻게 활용하나요?', doc: '/help/go_data/num/155/data/link2' },
    { title: '학생 성별 일괄 업데이트 방법', doc: '/help/go_data/num/156/data/link2' },
  ]},
  { category: '교직원관리', items: [
    { title: '추가로 서비스 관리자를 지정하고 싶어요', doc: '/help/go_data/num/70/data/link2', video: '/help/go_data/num/70/data/link1' },
  ]},
  { category: '강사관리', items: [
    { title: '강사권한 설정(수강생 등록, 삭제, 수강료 입력)', doc: '/help/go_data/num/150/data/link2', video: '/help/go_data/num/95/data/link1' },
    { title: '강사에게 강좌 등록 권한을 주고 싶어요', doc: '/help/go_data/num/146/data/link2' },
    { title: '강사에게 전체 강좌 조회 권한을 주고 싶어요', doc: '/help/go_data/num/149/data/link2' },
    { title: '강사가 바뀌었어요', doc: '/help/go_data/num/148/data/link2' },
    { title: '강사 모바일 출결 문자 발송 기능 이용 안내', doc: '/help/go_data/num/151/data/link2', video: '/help/go_data/num/151/data/link1' },
  ]},
  { category: '강좌관리', items: [
    { title: '강좌 일괄 입력', doc: '/help/go_data/num/92/data/link2', video: '/help/go_data/num/92/data/link1' },
    { title: '강좌 일괄 수정 - 엑셀로 강좌 정보를 일괄수정하고 싶어요', doc: '/help/go_data/num/138/data/link2' },
    { title: '강좌 일괄 삭제 - 강좌를 한꺼번에 지우고 싶어요', doc: '/help/go_data/num/158/data/link2' },
    { title: '강좌 통계 기능 활용하기', doc: '/help/go_data/num/93/data/link2', video: '/help/go_data/num/93/data/link1' },
    { title: '강좌 상태 "출력, 종료, 대기" 이해하기', doc: '/help/go_data/num/159/data/link2' },
    { title: '수강료를 강사료와 수용비로 나눠 관리하고 싶어요', doc: '/help/go_data/num/44/data/link2' },
  ]},
  { category: '신청자 관리', items: [
    { title: '수강신청 테스트 하고 싶어요', doc: '/help/go_data/num/76/data/link2', video: '/help/go_data/num/96/data/link1' },
    { title: '신청자 등록 / 신청자를 미리 입력해 놓고 싶어요', doc: '/help/go_data/num/171/data/link2' },
    { title: '신청자 삭제 / 특정 강좌의 신청자를 모두 삭제하고 싶어요', doc: '/help/go_data/num/172/data/link2' },
    { title: '신청자 이동 / 신청자를 다른 강좌로 옮기고 싶어요', doc: '/help/go_data/num/174/data/link2' },
    { title: '신청자 복사 / 신청자를 다른 강좌로 복사하고 싶어요', doc: '/help/go_data/num/175/data/link2' },
    { title: '방과후학교를 수강한 학생수(단수)를 어디에서 확인하나요?', doc: '/help/go_data/num/58/data/link2' },
    { title: '학생화면에 이전 강좌구분을 출력하지 않게하는 방법', doc: '/help/go_data/num/176/data/link2' },
  ]},
  { category: '자유수강권자 관리', items: [
    { title: '자유수강권자를 추가하고 개별 처리하는 방법', doc: '/help/go_data/num/94/data/link2', video: '/help/go_data/num/94/data/link1' },
    { title: '자유수강권자를 환불하고 개별 처리하는 방법', doc: '/help/go_data/num/192/data/link2' },
    { title: '학생 자유수강권 잔액 조회 기능 활성화', doc: '/help/go_data/num/193/data/link2' },
  ]},
  { category: '스쿨뱅킹 &amp; 나이스', items: [
    { title: '에듀파인 감면자 일괄입력 파일 다운로드', doc: '/help/go_data/num/169/data/link2' },
    { title: '에듀파인 개인부담금반환 입력용 파일 다운로드', doc: '/help/go_data/num/170/data/link2' },
    { title: '분기 접수, 월별 징수 처리 방법', doc: '/help/go_data/num/126/data/link2' },
    { title: '나이스 방과후학교 수강생, 수강료 일괄입력 파일 다운로드', doc: '/help/go_data/num/97/data/link2', video: '/help/go_data/num/97/data/link1' },
  ]},
  { category: '환경설정', items: [
    { title: '학생 최대 신청 강좌수를 제한할 수 있나요?', doc: '/help/go_data/num/194/data/link2' },
    { title: '안내글 설정', doc: '/help/go_data/num/100/data/link2' },
  ]},
  { category: '알림관리', items: [
    { title: '알림 관리', doc: '/help/go_data/num/195/data/link2' },
  ]},
  { category: '모바일앱', items: [
    { title: '모바일 푸시 알림은 어떻게 등록하나요?', doc: '/help/go_data/num/167/data/link2' },
  ]},
  { category: '계약', items: [
    { title: '계약을 연장하고 싶어요', doc: '/help/go_data/num/160/data/link2' },
  ]},
  { category: '설문관리', items: [
    { title: '설문 참여율을 높이는 설문참여 안내 문자 발송하는 법', doc: '/help/go_data/num/47/data/link2' },
  ]},
];

function docBadge(href, label) {
  return `<a href="${href}" target="_blank" class="manual_btn"><i class="fa fa-download"></i> ${label || '문서'}</a>`;
}
function videoBadge(href) {
  return `<a href="${href}" target="_blank" class="manual_btn" style="color:#c0392b;"><i class="fa fa-youtube-play"></i> <span class="txt">동영상</span></a>`;
}

// 운영 절차 HTML - grid 2열
let opsItems = FAQ_PROCEDURES.map(item => {
  let badges = '';
  if (item.doc) badges += docBadge(item.doc, '문서') + ' ';
  if (item.video) badges += videoBadge(item.video);
  return `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 2px;border-bottom:1px solid #f3f4f6;font-size:0.83rem;"><div style="display:flex;align-items:center;gap:5px;"><span style="display:inline-flex;align-items:center;justify-content:center;width:19px;height:19px;background:#2563eb;color:#fff;border-radius:50%;font-size:0.67rem;font-weight:700;">${item.num}</span><span style="color:#1e293b;">${item.title}</span></div><div style="display:flex;gap:3px;flex-shrink:0;">${badges}</div></div>`;
});
const opsHtml = opsItems.join('');

// 양식 다운로드
const tmplHtml = FAQ_TEMPLATES.map(item => {
  const badges = item.links.map(lk => lk.type === 'video' ? videoBadge(lk.href) : docBadge(lk.href, lk.label)).join(' ');
  return `<div style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:0.85rem;"><span style="font-weight:600;color:#1e293b;">${item.title}</span> ${badges}</div>`;
}).join('');

// 매뉴얼 다운로드
const manHtml = FAQ_MANUALS.map(item => {
  const badges = item.links.map(lk => lk.type === 'video' ? videoBadge(lk.href) : docBadge(lk.href, lk.label)).join(' ');
  const color = item.isHighlight ? '#dc2626' : '#1e293b';
  return `<div style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:0.85rem;"><span style="font-weight:600;color:${color};">${item.title}</span> ${badges}</div>`;
}).join('');

// FAQ 카테고리 그리드
function renderCats(cats) {
  return cats.map(cat => {
    const rows = cat.items.map(item => {
      let badges = '';
      if (item.doc) badges += docBadge(item.doc, '문서') + ' ';
      if (item.video) badges += videoBadge(item.video);
      return `<div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f8fafc;font-size:0.82rem;"><span style="color:#334155;">${item.title}</span><div style="display:flex;gap:3px;flex-shrink:0;">${badges}</div></div>`;
    }).join('');
    return `<div style="border:1px solid #e2e8f0;border-radius:6px;background:#fff;overflow:hidden;margin-bottom:10px;"><div style="background:#f8fafc;padding:8px 12px;font-weight:700;color:#1e293b;border-bottom:1px solid #e2e8f0;font-size:0.88rem;">${cat.category} <span style="font-size:0.75rem;font-weight:400;color:#64748b;">(${cat.items.length})</span></div><div style="padding:4px 12px;">${rows}</div></div>`;
  }).join('');
}
const half = Math.ceil(FAQ_CATEGORIES.length / 2);
const leftHtml = renderCats(FAQ_CATEGORIES.slice(0, half));
const rightHtml = renderCats(FAQ_CATEGORIES.slice(half));

// 정규식으로 각 container 내부를 교체
let changed = 0;

// operationsListContainer 내부 교체
content = content.replace(
  /(<div id="operationsListContainer"[^>]*>)[\s\S]*?(<\/div>(?=\r?\n\s*<\/div>\r?\n\s*<\/div>))/,
  (match, open) => { changed++; return open + opsHtml + '</div>'; }
);

// templateDownloadsContainer 내부 교체
content = content.replace(
  /(<div id="templateDownloadsContainer">)[\s\S]*?(<\/div>(?=\r?\n\s*<\/div>))/,
  (match, open) => { changed++; return open + tmplHtml + '</div>'; }
);

// manualDownloadsContainer 내부 교체
content = content.replace(
  /(<div id="manualDownloadsContainer">)[\s\S]*?(<\/div>(?=\r?\n\s*<\/div>))/,
  (match, open) => { changed++; return open + manHtml + '</div>'; }
);

// faqColLeft 내부 교체
content = content.replace(
  /(<div id="faqColLeft"[^>]*>)[\s\S]*?(<\/div>(?=\r?\n\s*<div id="faqColRight"))/,
  (match, open) => { changed++; return open + leftHtml + '</div>'; }
);

// faqColRight 내부 교체
content = content.replace(
  /(<div id="faqColRight"[^>]*>)[\s\S]*?(<\/div>(?=\r?\n\s*<\/div>\r?\n\s*<\/div>\r?\n\s*<\/div>\r?\n\s*<\/div>\r?\n\s*<\/div>))/,
  (match, open) => { changed++; return open + rightHtml + '</div>'; }
);

fs.writeFileSync(indexPath, content, 'utf8');
console.log(`Done. ${changed}/5 containers replaced with static FAQ content.`);

// 검증
const result = fs.readFileSync(indexPath, 'utf8');
console.log('Has doc link 239:', result.includes('/help/go_data/num/239/data/link2'));
console.log('Has video link 71:', result.includes('/help/go_data/num/71/data/link1'));
console.log('Has 로딩 중 in faq panel:', result.indexOf('로딩 중') > result.indexOf('panel_ad_faq_main'));
