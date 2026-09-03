const fs = require('fs');

const har = JSON.parse(fs.readFileSync('www.dbdbschool.kr.har', 'utf8'));
const entries = har.log.entries;
console.log('Total entries:', entries.length);

entries.forEach((e, idx) => {
  console.log(`[${idx}] ${e.request.method} ${e.request.url} -> Status: ${e.response.status} (mime: ${e.response.content.mimeType}, size: ${e.response.content.size})`);
});
