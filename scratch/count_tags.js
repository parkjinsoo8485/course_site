const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
const content = fs.readFileSync(indexPath, 'utf8');

const lines = content.split('\n');
let d = 0;
for (let i = 687; i <= 742; i++) {
  const line = lines[i];
  const opens = (line.match(/<div(\s|>)/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  d += (opens - closes);
  console.log(`Line ${i + 1}: [opens: ${opens}, closes: ${closes}, current depth: ${d}] ${line.substring(0, 80).trim()}`);
}
