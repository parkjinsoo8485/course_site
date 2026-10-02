const fs = require('fs');

const panelHtml = fs.readFileSync('scratch/panel_ad_tea_lists.html', 'utf8');

function cleanFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. 하단에 추가되었던 중복 블록 제거
  const targetSurMarker = '<!-- ==================== 16. 설문관리 > 설문 (/af/ad_sur/lists) ==================== -->';
  const startCloneMarker = '<!-- ==================== 15.7 강사관리 (/af/ad_tea/lists) 1:1 Target Clone ==================== -->';
  
  if (content.includes(startCloneMarker)) {
    const sIdx = content.indexOf(startCloneMarker);
    const eIdx = content.indexOf(targetSurMarker);
    if (sIdx !== -1 && eIdx !== -1 && sIdx < eIdx) {
      content = content.substring(0, sIdx) + content.substring(eIdx);
      console.log(`Removed lower duplicate clone from ${filePath}`);
    }
  }

  // 2. 구버전 강사관리 플레이스홀더 블록을 최신 1:1 패널로 교체
  const oldStart = '<!-- ==================== 7. 강사관리 (/af/ad_tea/lists) ==================== -->';
  const oldEnd = '<!-- ==================== 8. 알림관리 (/af/notification/lists) ==================== -->';

  const oldStartIdx = content.indexOf(oldStart);
  const oldEndIdx = content.indexOf(oldEnd);

  if (oldStartIdx !== -1 && oldEndIdx !== -1) {
    content = content.substring(0, oldStartIdx) + panelHtml + '\n\n      ' + content.substring(oldEndIdx);
    console.log(`Replaced old placeholder with authentic 1:1 panel in ${filePath}`);
  } else {
    console.error(`Could not find old markers in ${filePath}!`);
  }

  fs.writeFileSync(filePath, content, 'utf8');

  // 중복 검증
  const matches = [...content.matchAll(/id=["']panel_ad_tea_lists["']/g)];
  console.log(`${filePath} final panel_ad_tea_lists count: ${matches.length}`);
}

cleanFile('course_site/af/ad_lec/lists/sn/index.html');
cleanFile('course_site/af/ad_lec/lists/sn/3267/index.html');
