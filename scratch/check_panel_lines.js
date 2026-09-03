const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
const content = fs.readFileSync(indexPath, 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('id="panel_')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
