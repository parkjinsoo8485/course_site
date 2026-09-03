const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'admin_lec.js');
let content = fs.readFileSync(jsPath, 'utf8');

// FAQ_PROCEDURES, FAQ_TEMPLATES, FAQ_MANUALS, FAQ_CATEGORIES 데이터의
// 'https://www.dbdbschool.kr/help/go_data/' 를 '/help/go_data/' 로 교체
const before = content.split('https://www.dbdbschool.kr/help/go_data/').length - 1;
content = content.replace(/https:\/\/www\.dbdbschool\.kr\/help\/go_data\//g, '/help/go_data/');
const after = content.split('/help/go_data/').length - 1;

fs.writeFileSync(jsPath, content, 'utf8');
console.log(`Replaced ${before} occurrences of external dbdbschool help URL with local /help/go_data/`);
