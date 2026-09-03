const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
const content = fs.readFileSync(indexPath, 'utf8');

const lines = content.split('\n');
let insideMain = false;
let depth = 0;
let errors = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('<main class="main-content">')) {
    insideMain = true;
    console.log(`Line ${i + 1}: <main> opened`);
    continue;
  }
  if (line.includes('</main>')) {
    console.log(`Line ${i + 1}: </main> reached with depth = ${depth}`);
    insideMain = false;
    continue;
  }

  if (insideMain) {
    if (line.includes('id="panel_')) {
      const match = line.match(/id="(panel_[^"]+)"/);
      // 각 패널의 시작 시점 depth는 정확히 0이어야 함! (main 바로 아래 직계 자식)
      if (depth !== 0) {
        errors.push(`Line ${i + 1}: [${match ? match[1] : ''}] starts at unexpected depth = ${depth}`);
      }
    }

    const openDivs = (line.match(/<div(\s|>)/g) || []).length;
    const closeDivs = (line.match(/<\/div>/g) || []).length;
    depth += (openDivs - closeDivs);

    if (depth < 0) {
      errors.push(`Line ${i + 1}: depth < 0! (depth = ${depth}, content: ${line.trim()})`);
      break;
    }
  }
}

if (errors.length === 0 && depth === 0) {
  console.log('🎉 PERFECT! All panels inside <main> start at depth 0, and depth ends at exactly 0 before </main>!');
} else {
  console.log('Errors found:', errors);
}
