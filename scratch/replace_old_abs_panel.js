const fs = require('fs');

let indexHtml = fs.readFileSync('course_site/af/ad_lec/lists/sn/index.html', 'utf8');
const newPanelHtml = fs.readFileSync('scratch/panel_ad_abs_lists.html', 'utf8');

const startMarker = '<!-- ==================== 6. 결석/귀가신청 (/af/ad_abs/lists) ==================== -->';
const endMarker = '<!-- ==================== 7. 강사관리 (/af/ad_tea/lists) ==================== -->';

const startIndex = indexHtml.indexOf(startMarker);
const endIndex = indexHtml.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  indexHtml = indexHtml.substring(0, startIndex) + newPanelHtml + '\n\n      ' + indexHtml.substring(endIndex);
  fs.writeFileSync('course_site/af/ad_lec/lists/sn/index.html', indexHtml, 'utf8');
  console.log('Successfully replaced old panel_ad_abs_lists with authentic 1:1 panel!');
} else {
  console.error('Markers not found!', { startIndex, endIndex });
}
