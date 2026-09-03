const fs = require('fs');

const indexHtmlPath = 'course_site/af/ad_lec/lists/sn/index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const faqContents = fs.readFileSync('scratch/faq_contents_only.html', 'utf8');

const targetStr = '<div class="submodel-panel active" id="panel_ad_lec_lists">';
if (indexHtml.includes(targetStr)) {
  const panelFaqHtml = `<!-- ==================== 0. 매뉴얼 & FAQ (/af/ad_faq/main) ==================== -->
      <div class="submodel-panel" id="panel_ad_faq_main" style="display: none;">
        ${faqContents}
      </div>

      ` + targetStr;

  indexHtml = indexHtml.replace(targetStr, panelFaqHtml);
  fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
  console.log('Successfully inserted #panel_ad_faq_main before #panel_ad_lec_lists');
} else {
  console.log('Target panel_ad_lec_lists not found');
}
