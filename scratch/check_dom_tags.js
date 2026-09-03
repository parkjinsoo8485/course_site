const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
const content = fs.readFileSync(indexPath, 'utf8');

console.log('Includes <main class="main-content">:', content.includes('<main class="main-content">'));
console.log('Includes </main>:', content.includes('</main>'));
console.log('Includes <div id="container">:', content.includes('<div id="container">'));

// container와 main이 닫히는 위치를 찾아보자
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('<main') || line.includes('</main>') || line.includes('id="container"')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
