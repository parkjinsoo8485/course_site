const fs = require('fs');
const path = require('path');

const harPath = path.join(__dirname, '..', 'www.dbdbschool.kr(강좌등록).har');
const content = fs.readFileSync(harPath, 'utf8');
const har = JSON.parse(content);

console.log('HAR entries count:', har.log.entries.length);

// HTML 응답 찾기
for (let entry of har.log.entries) {
  const url = entry.request.url;
  const mimeType = entry.response.content.mimeType || '';
  if (mimeType.includes('html') || url.includes('/af/ad_lec/write')) {
    console.log('Found URL:', url);
    const text = entry.response.content.text;
    if (text) {
      console.log('HTML length:', text.length);
      fs.writeFileSync('scratch/crawled_write_page.html', text, 'utf8');
      console.log('Saved HTML to scratch/crawled_write_page.html');
      break;
    }
  }
}
