const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// panel_ad_faq_main 이 display:none에서 display:block으로 바뀐 직후 loadFaqList가 실행되는지 확인
// 방법: switchSubmodelView의 panel show 로직 뒤에서 loadFaqList를 강제 재호출
// 더 간단한 방법: panel_ad_faq_main의 style="display:none"을 제거하고
// CSS로 숨김 처리 (display:none이 아닌 opacity:0; pointer-events:none; position:absolute)

// 사실 진짜 문제 파악: loadFaqList가 호출되면 operationsListContainer가 있어야 하는데
// 혹시 DOMContentLoaded 이벤트 내에서 loadFaqList가 호출될 때 
// admin_lec.js의 const들이 아직 초기화 안된 상태가 될 수 있음
// -> admin_lec.js는 body 끝에 defer 없이 로드되므로 스크립트 실행 완료 후 DOMContentLoaded 핸들러가 실행됨

// 가장 확실한 해결책: FAQ 데이터를 HTML에 정적으로 렌더링
// loadFaqList()를 서버에서 미리 실행해 HTML에 embed

// 임시 해결책: panel_ad_faq_main 에 MutationObserver 또는 visibility 변경 감지 대신
// switchSubmodelView override로 faq panel show 시 loadFaqList 강제 호출

// 가장 안전한 방법: index.html body 끝에 onload 인라인 스크립트 추가
// 직접 loadFaqList 호출을 확실히 보장

const adminLecTag = '<script src="/af/ad_lec/lists/sn/admin_lec.js"></script>';
const insertAfter = adminLecTag + '\n<script>\n// FAQ 패널 초기화 보장\ndocument.addEventListener("DOMContentLoaded", function() {\n  requestAnimationFrame(function() {\n    if (typeof loadFaqList === "function") {\n      try { loadFaqList(); } catch(e) { console.warn("loadFaqList error:", e); }\n    }\n  });\n});\n</script>';

if (!content.includes(adminLecTag)) {
  console.log('ERROR: admin_lec.js script tag not found');
  process.exit(1);
}

// 이미 추가된 경우 skip
if (content.includes('FAQ 패널 초기화 보장')) {
  console.log('Already patched');
  process.exit(0);
}

content = content.replace(adminLecTag, insertAfter);
fs.writeFileSync(indexPath, content, 'utf8');
console.log('SUCCESS: FAQ init script inserted after admin_lec.js');
