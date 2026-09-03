const fs = require('fs');
const html = fs.readFileSync('course_site/af/ad_faq/main/sn/3267/index.html', 'utf8');

const startIdx = html.indexOf('<div id="contents">');
console.log('startIdx:', startIdx);

let depth = 0;
let endIdx = -1;
for (let i = startIdx; i < html.length; i++) {
  if (html.startsWith('<div', i)) {
    depth++;
  } else if (html.startsWith('</div>', i)) {
    depth--;
    if (depth === 0) {
      endIdx = i + 6;
      break;
    }
  }
}
console.log('endIdx:', endIdx, 'length:', endIdx - startIdx);
if (startIdx !== -1 && endIdx !== -1) {
  const contents = html.substring(startIdx, endIdx);
  fs.writeFileSync('scratch/faq_contents_only.html', contents, 'utf8');
  console.log('Successfully saved scratch/faq_contents_only.html, bytes:', contents.length);
}
