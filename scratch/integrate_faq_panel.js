const fs = require('fs');

const indexHtmlPath = 'course_site/af/ad_lec/lists/sn/index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const faqContents = fs.readFileSync('scratch/faq_contents_only.html', 'utf8');

// 1. 사이드바 홈으로 버튼에 onclick switchSubmodelView 적용
const homeTarget = '<li class="btn01"><a href="/af/ad_faq/main/sn/3267">홈으로</a></li>';
const homeReplacement = '<li class="btn01"><a href="/af/ad_faq/main/sn/3267" onclick="switchSubmodelView(event, \'ad_faq_main\', \'/af/ad_faq/main/sn/3267\')">홈으로</a></li>';
if (indexHtml.includes(homeTarget)) {
  indexHtml = indexHtml.replace(homeTarget, homeReplacement);
  console.log('Updated home button in index.html');
}

// 2. 사이드바 매뉴얼 항목에 onclick switchSubmodelView 적용
const manualTarget = `<li id="sub_ad_faq_main">
          <a href="/af/ad_faq/main/sn/3267">
            <i class="fa fa-download"></i><strong>매뉴얼</strong>
          </a>
        </li>`;
const manualReplacement = `<li id="sub_ad_faq_main">
          <a href="/af/ad_faq/main/sn/3267" onclick="switchSubmodelView(event, 'ad_faq_main', '/af/ad_faq/main/sn/3267')">
            <i class="fa fa-download"></i><strong>매뉴얼</strong>
          </a>
        </li>`;

if (indexHtml.includes(manualTarget)) {
  indexHtml = indexHtml.replace(manualTarget, manualReplacement);
  console.log('Updated manual menu link in index.html');
} else {
  // Normalize whitespace
  indexHtml = indexHtml.replace(/<li id="sub_ad_faq_main">[\s\S]*?<a href="\/af\/ad_faq\/main\/sn\/3267"[\s\S]*?<\/li>/, manualReplacement);
  console.log('Updated manual menu link via regex');
}

// 3. #panel_ad_faq_main 패널 삽입 (강좌관리 패널 바로 위에)
const panelAdLecTarget = '<!-- ==================== 1. 강좌관리 (/af/ad_lec/lists) ==================== -->';
const panelFaqHtml = `<!-- ==================== 0. 매뉴얼 & FAQ (/af/ad_faq/main) ==================== -->
      <div class="submodel-panel" id="panel_ad_faq_main" style="display: none;">
        ${faqContents}
      </div>

      <!-- ==================== 1. 강좌관리 (/af/ad_lec/lists) ==================== -->`;

if (indexHtml.includes(panelAdLecTarget) && !indexHtml.includes('id="panel_ad_faq_main"')) {
  indexHtml = indexHtml.replace(panelAdLecTarget, panelFaqHtml);
  console.log('Successfully inserted #panel_ad_faq_main');
} else if (indexHtml.includes('id="panel_ad_faq_main"')) {
  console.log('#panel_ad_faq_main already exists');
}

fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('index.html update complete');
