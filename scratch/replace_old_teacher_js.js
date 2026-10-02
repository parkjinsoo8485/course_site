const fs = require('fs');

const jsPath = 'course_site/af/ad_lec/lists/sn/admin_lec.js';
let content = fs.readFileSync(jsPath, 'utf8');

const newLogic = fs.readFileSync('scratch/ad_tea_logic.js', 'utf8');

// 1. 라인 3700 부근의 구버전 loadTeachers 블록을 새 로직으로 교체
const oldStart = '// ==================== 7. 강사관리 (/af/ad_tea/lists) ====================';
const oldEnd = '// ==================== 8. 알림관리 (/af/notification/lists) ====================';

const sIdx = content.indexOf(oldStart);
const eIdx = content.indexOf(oldEnd);

if (sIdx !== -1 && eIdx !== -1) {
  content = content.substring(0, sIdx) + newLogic + '\n\n' + content.substring(eIdx);
  console.log('Replaced old loadTeachers with authentic 1:1 logic at section 7!');
} else {
  console.error('Could not find old loadTeachers section markers!');
}

// 2. 맨 아래쪽에 중복으로 추가되었던 로직이 있다면 정리
const bottomMarker = '// ==================== [Sprint 2] 강사관리 (/af/ad_tea) 1:1 Authentic Logic ====================';
const lastIdx = content.lastIndexOf(bottomMarker);
if (lastIdx !== -1 && lastIdx > sIdx + 100) {
  content = content.substring(0, lastIdx);
  console.log('Trimmed duplicate bottom ad_tea logic!');
}

fs.writeFileSync(jsPath, content, 'utf8');
console.log('admin_lec.js cleaned and updated!');
