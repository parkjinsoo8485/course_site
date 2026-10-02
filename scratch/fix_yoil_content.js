const fs = require('fs');

// 1. index.html 수정
let idxHtml = fs.readFileSync('course_site/af/ad_lec/lists/sn/index.html', 'utf8');
for (let i = 1; i <= 5; i++) {
  idxHtml = idxHtml.split('yoil' + i + '_memo').join('yoil' + i + '_content');
}
fs.writeFileSync('course_site/af/ad_lec/lists/sn/index.html', idxHtml, 'utf8');
console.log('index.html updated with yoil_content!');

// 2. rsch_logic.js 수정
let jsTxt = fs.readFileSync('course_site/af/ad_lec/lists/sn/rsch_logic.js', 'utf8');
for (let i = 1; i <= 5; i++) {
  jsTxt = jsTxt.split('yoil' + i + '_memo').join('yoil' + i + '_content');
  jsTxt = jsTxt.split('memo:').join('content:');
  jsTxt = jsTxt.split('.memo').join('.content');
}
fs.writeFileSync('course_site/af/ad_lec/lists/sn/rsch_logic.js', jsTxt, 'utf8');
console.log('rsch_logic.js updated with yoil_content!');
