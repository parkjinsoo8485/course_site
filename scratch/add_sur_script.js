const fs = require('fs');
const path = 'course_site/af/ad_lec/lists/sn/index.html';
let html = fs.readFileSync(path, 'utf8');
const marker = '<script src="/af/ad_lec/lists/sn/abs_logic.js"></script>';
const newTag = '<script src="/af/ad_lec/lists/sn/sur_logic.js"></script>';

if (!html.includes('sur_logic.js')) {
  html = html.replace(marker, marker + '\n  ' + newTag);
  fs.writeFileSync(path, html, 'utf8');
  console.log('✅ sur_logic.js 스크립트 태그 추가 완료');
} else {
  console.log('✅ 이미 존재함');
}
