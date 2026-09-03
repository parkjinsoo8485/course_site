const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
const content = fs.readFileSync(indexPath, 'utf8');

const mainStart = content.indexOf('<main class="main-content">');
const mainEnd = content.indexOf('</main>');
const qnaIdx = content.indexOf('id="panel_qanda_lists"');

console.log('mainStart position:', mainStart);
console.log('mainEnd position:', mainEnd);
console.log('qnaIdx position:', qnaIdx);

if (qnaIdx > mainStart && qnaIdx < mainEnd) {
  console.log('panel_qanda_lists is INSIDE <main>');
} else if (qnaIdx > mainEnd) {
  console.log('CRITICAL BUG: panel_qanda_lists is OUTSIDE <main> (AFTER </main>)!');
} else {
  console.log('CRITICAL BUG: panel_qanda_lists is BEFORE <main>!');
}
