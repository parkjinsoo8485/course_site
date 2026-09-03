const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
const content = fs.readFileSync(indexPath, 'utf8');

// HTML 태그 파서로 <main> 안의 div 균형을 추적
const lines = content.split('\n');
let insideMain = false;
let depth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('<main class="main-content">')) {
    insideMain = true;
    console.log(`Line ${i + 1}: <main> opened, depth = ${depth}`);
    continue;
  }
  if (line.includes('</main>')) {
    console.log(`Line ${i + 1}: </main> closed, depth = ${depth}`);
    insideMain = false;
    continue;
  }

  if (insideMain) {
    if (line.includes('id="panel_')) {
      const match = line.match(/id="(panel_[^"]+)"/);
      console.log(`Line ${i + 1}: [${match ? match[1] : ''}] depth = ${depth}`);
    }

    // 간단한 div 카운트
    const openDivs = (line.match(/<div(\s|>)/g) || []).length;
    const closeDivs = (line.match(/<\/div>/g) || []).length;
    depth += (openDivs - closeDivs);

    if (depth < 0) {
      console.log(`CRITICAL: Line ${i + 1}: depth went below 0! (depth = ${depth})`);
      console.log(`Line content: ${line.trim()}`);
      break;
    }
  }
}
