const fs = require('fs');
const path = require('path');

const indexPath = 'course_site/af/ad_lec/lists/sn/index.html';
const panelPath = 'scratch/panel_ad_cfg_integrated.html';

let indexHtml = fs.readFileSync(indexPath, 'utf8');
const newPanel = fs.readFileSync(panelPath, 'utf8');

const startMarker = '<!-- ==================== 18. 환경설정 > 기본설정 (/af/ad_cfg/main) ==================== -->';
const endMarker = '<!-- ==================== 19. 환경설정 > 신청기간 (/af/ad_time/lists) ==================== -->';

const startIndex = indexHtml.indexOf(startMarker);
const endIndex = indexHtml.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('❌ 마커를 찾을 수 없습니다! startIndex:', startIndex, 'endIndex:', endIndex);
  process.exit(1);
}

const updatedHtml = indexHtml.substring(0, startIndex) + newPanel.trim() + '\n\n      ' + indexHtml.substring(endIndex);

fs.writeFileSync(indexPath, updatedHtml, 'utf8');
console.log('✅ index.html 환경설정 패널 교체 완료!');

// 검증
const verifyHtml = fs.readFileSync(indexPath, 'utf8');
const checkIds = [
  'panel_ad_cfg_main',
  'cfg_pane_main',
  'cfg_pane_tea',
  'cfg_pane_att',
  'cfg_pane_sms',
  'modal_sign_pad',
  'modal_admin_search',
  'titleNum_1',
  'allowWrLec_Y',
  'attApp1',
  'smsUse_N'
];

const missing = checkIds.filter(id => !verifyHtml.includes(id));
if (missing.length === 0) {
  console.log('🎉 핵심 DOM ID 검증 100% 통과! (missing: [])');
} else {
  console.error('❌ 누락된 ID 발견:', missing);
  process.exit(1);
}
