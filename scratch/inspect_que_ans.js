const fs = require('fs');

function inspectQue() {
  const html = fs.readFileSync('scratch/target_ad_sur_que.html', 'utf8');
  console.log('=== QUE (문항관리) ===');
  // Look for questions list
  const m = html.match(/<div class="contents_box"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i)
         || html.match(/<div id="content"[^>]*>([\s\S]*?)<!--\s*#content/i);
  const block = m ? m[1] : html;

  // Buttons in que
  const btns = [...block.matchAll(/<(a|button|input)\b([^>]*)>(.*?)<\/\1>|<(input)\b([^>]*)>/gis)]
    .map(match => {
      const tag = match[1] || match[4];
      const attrs = match[2] || match[5] || '';
      const text = (match[3] || '').replace(/<[^>]+>/g, '').trim();
      const val = (attrs.match(/value=['"]([^'"]*)['"]/i) || [])[1] || '';
      const href = (attrs.match(/href=['"]([^'"]*)['"]/i) || [])[1] || '';
      const onclick = (attrs.match(/onclick=['"]([^'"]*)['"]/i) || [])[1] || '';
      return { tag, label: text || val, href, onclick };
    })
    .filter(b => b.label && (b.label.includes('추가') || b.label.includes('삭제') || b.label.includes('수정') || b.label.includes('목록') || b.label.includes('문항') || b.label.includes('인쇄')));
  console.log('Que Buttons:', btns);

  // Extract question items
  const questions = [...block.matchAll(/<div class="que_title"[^>]*>([\s\S]*?)<\/div>/gis)]
    .concat([...block.matchAll(/<p class="que_title"[^>]*>([\s\S]*?)<\/p>/gis)])
    .map(q => q[1].replace(/<[^>]+>/g, '').trim());
  console.log('Sample Questions count:', questions.length, questions.slice(0, 5));
}

function inspectAns() {
  const html = fs.readFileSync('scratch/target_ad_sur_ans.html', 'utf8');
  console.log('\n=== ANS (결과보기) ===');
  // Find result buttons (excel export, print, etc.)
  const btns = [...html.matchAll(/<(a|button|input)\b([^>]*)>(.*?)<\/\1>|<(input)\b([^>]*)>/gis)]
    .map(match => {
      const tag = match[1] || match[4];
      const attrs = match[2] || match[5] || '';
      const text = (match[3] || '').replace(/<[^>]+>/g, '').trim();
      const val = (attrs.match(/value=['"]([^'"]*)['"]/i) || [])[1] || '';
      const href = (attrs.match(/href=['"]([^'"]*)['"]/i) || [])[1] || '';
      const onclick = (attrs.match(/onclick=['"]([^'"]*)['"]/i) || [])[1] || '';
      return { tag, label: text || val, href, onclick };
    })
    .filter(b => b.label && (b.label.includes('엑셀') || b.label.includes('출력') || b.label.includes('결과') || b.label.includes('검색')));
  console.log('Ans Buttons:', btns);
}

inspectQue();
inspectAns();
