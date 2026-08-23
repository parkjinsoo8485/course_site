const fs = require('fs');
const html = fs.readFileSync('har_page.html', 'utf8');

// 실제 왼쪽 메뉴 전체 추출
const leftMenuStart = html.indexOf('id="left_menu"');
const leftMenuEnd = html.indexOf('id="container_r"');
const sidebarHtml = html.substring(leftMenuStart, leftMenuEnd);

console.log('=== 사이드바 전체 HTML 구조 ===');
// li 단위로 추출
const liRe = /<li[^>]*>([\s\S]*?)<\/li>/g;
let m;
while ((m = liRe.exec(sidebarHtml)) !== null) {
  // li 내의 a 태그
  const aMatch = m[1].match(/href="([^"]+)"[^>]*>([\s\S]{1,60})<\/a>/);
  if (aMatch) {
    const href = aMatch[1].replace('https://www.dbdbschool.kr', '');
    const text = aMatch[2].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
    if (text) console.log(`  [${text}] => ${href}`);
  }
}

// 수강료 관리 페이지 구조 파악 (현재 har_page는 수강료입력 페이지)
console.log('\n=== 수강료입력 페이지 주요 폼 구조 ===');
const formStart = html.indexOf('<form');
const formEnd = html.indexOf('</form>');
if (formStart > -1) {
  const formHtml = html.substring(formStart, formEnd + 7);
  console.log(formHtml.substring(0, 3000));
}
