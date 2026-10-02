const fs = require('fs');

const panelHtml = fs.readFileSync('scratch/panel_ad_tea_lists.html', 'utf8');

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return;
  }
  let indexHtml = fs.readFileSync(filePath, 'utf8');

  // 중복 삽입 방지: 이미 panel_ad_tea_lists 가 있으면 기존 블록 교체
  if (indexHtml.includes('id="panel_ad_tea_lists"')) {
    console.log(`Replacing existing panel_ad_tea_lists in ${filePath}...`);
    const startMarker = '<!-- ==================== 15.7 강사관리 (/af/ad_tea/lists) 1:1 Target Clone ==================== -->';
    const endMarker = '<!-- ==================== 16. 설문관리 > 설문 (/af/ad_sur/lists) ==================== -->';
    const startIdx = indexHtml.indexOf(startMarker);
    const endIdx = indexHtml.indexOf(endMarker);
    if (startIdx !== -1 && endIdx !== -1) {
      indexHtml = indexHtml.substring(0, startIdx) + panelHtml + '\n\n      ' + indexHtml.substring(endIdx);
      fs.writeFileSync(filePath, indexHtml, 'utf8');
      console.log(`Successfully replaced panel_ad_tea_lists in ${filePath}`);
      return;
    }
  }

  const targetSurMarker = '<!-- ==================== 16. 설문관리 > 설문 (/af/ad_sur/lists) ==================== -->';
  if (indexHtml.includes(targetSurMarker)) {
    indexHtml = indexHtml.replace(targetSurMarker, panelHtml + '\n\n      ' + targetSurMarker);
    fs.writeFileSync(filePath, indexHtml, 'utf8');
    console.log(`Successfully inserted panel_ad_tea_lists in ${filePath}`);
  } else {
    console.error(`Target marker not found in ${filePath}!`);
  }
}

updateFile('course_site/af/ad_lec/lists/sn/index.html');
updateFile('course_site/af/ad_lec/lists/sn/3267/index.html');
