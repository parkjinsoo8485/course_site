const fs = require('fs');
const har = JSON.parse(fs.readFileSync('C:\\Myproject\\course\\course_site\\www.dbdbschool.kr.har', 'utf8'));

const entries = har.log.entries;
for (const entry of entries) {
  const url = entry.request.url;
  if (url === 'https://www.dbdbschool.kr/af/ad_app/copy/p/1/sn/3267/sld/10/sof/sbh/sot/asc') {
    fs.writeFileSync('C:\\Myproject\\course\\course_site\\scratch\\copy_page.html', entry.response.content.text);
    console.log('Saved copy_page.html');
  }
}
