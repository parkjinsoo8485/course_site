const fs = require('fs');
const path = require('path');

const partBHtmlPath = path.resolve('course_site/../scratch/panel_ad_cfg_part_b.html');
const partBHtml = fs.readFileSync(partBHtmlPath, 'utf8');

const targetFiles = [
  path.resolve('course_site/af/ad_lec/lists/sn/index.html'),
  path.resolve('course_site/af/ad_lec/lists/sn/3267/index.html')
];

targetFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. 기존 panel_ad_time_lists 시작부터 panel_ad_info_modify 끝까지의 구형 스캐폴딩 블록 찾기
  const startMarker = '<!-- ==================== 19. 환경설정 > 신청기간 (/af/ad_time/lists) ==================== -->';
  const endMarker = '<!-- ==================== 28. 고객지원 게시판 (/af/qanda/lists) ==================== -->';

  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);

  if (startIndex !== -1 && endIndex !== -1) {
    console.log(`Replacing Part B scaffolding panels in ${filePath}...`);
    content = content.substring(0, startIndex) + partBHtml + '\n\n      ' + content.substring(endIndex);
  } else {
    console.log(`Markers not directly matched, trying alternative marker in ${filePath}...`);
    // 대체 매칭: panel_ad_time_lists ~ panel_qanda_lists
    const timeIdx = content.indexOf('id="panel_ad_time_lists"');
    const qandaIdx = content.indexOf('id="panel_qanda_lists"');
    if (timeIdx !== -1 && qandaIdx !== -1) {
      const prevDiv = content.lastIndexOf('<div class="submodel-panel"', timeIdx);
      const nextDiv = content.lastIndexOf('<div class="submodel-panel"', qandaIdx);
      content = content.substring(0, prevDiv) + partBHtml + '\n\n      ' + content.substring(nextDiv);
    }
  }

  // 2. 스크립트 태그 확인 및 추가
  const scriptTags = `
  <script src="/af/ad_lec/lists/sn/admin_lec.js"></script>
  <script src="/af/ad_lec/lists/sn/cfg_logic.js"></script>
  <script src="/af/ad_lec/lists/sn/cfg_part_b_logic.js"></script>
</body>`;

  if (!content.includes('src="/af/ad_lec/lists/sn/cfg_part_b_logic.js"')) {
    content = content.replace('</body>', scriptTags);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Successfully updated ${filePath}`);
});
