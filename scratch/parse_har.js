const fs = require('fs');
const har = JSON.parse(fs.readFileSync('C:\\Myproject\\course\\course_site\\www.dbdbschool.kr.har', 'utf8'));

const entries = har.log.entries;
for (const entry of entries) {
  const url = entry.request.url;
  if (url.includes('.html') || url.includes('/af/') || entry.response.content.mimeType.includes('text/html')) {
    console.log(`URL: ${url}`);
    console.log(`MimeType: ${entry.response.content.mimeType}`);
    // console.log(`Text: ${entry.response.content.text ? entry.response.content.text.substring(0, 100) : 'no text'}`);
  }
}
