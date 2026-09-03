const fs = require('fs');

const indexHtmlPath = 'course_site/af/ad_lec/lists/sn/index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. Link /css/af/content.css
if (!indexHtml.includes('/css/af/content.css')) {
  indexHtml = indexHtml.replace('<link href="/css/content.css" rel="stylesheet" type="text/css" />',
    '<link href="/css/content.css" rel="stylesheet" type="text/css" />\n  <link href="/css/af/content.css" rel="stylesheet" type="text/css" />');
}

// 2. Update home button
indexHtml = indexHtml.replace(
  '<li class="btn01"><a href="/af/ad_faq/main/sn/3267">홈으로</a></li>',
  '<li class="btn01"><a href="/af/ad_faq/main/sn/3267" onclick="switchSubmodelView(event, \'ad_faq_main\', \'/af/ad_faq/main/sn/3267\')">홈으로</a></li>'
);

// 3. Update manual link
indexHtml = indexHtml.replace(
  '<li id="sub_ad_faq_main">\n          <a href="/af/ad_faq/main/sn/3267">',
  '<li id="sub_ad_faq_main">\n          <a href="/af/ad_faq/main/sn/3267" onclick="switchSubmodelView(event, \'ad_faq_main\', \'/af/ad_faq/main/sn/3267\')">'
);

// 4. Update school admin link
indexHtml = indexHtml.replace(
  '<li class="admin" id="sub_sczigi_service_lists">\n          <a href="/sczigi/service/lists/sn/3267">',
  '<li class="admin" id="sub_sczigi_service_lists">\n          <a href="/sczigi/service/lists/sn/3267" onclick="switchSubmodelView(event, \'sczigi_service_lists\', \'/sczigi/service/lists/sn/3267\')">'
);

// 5. Insert #panel_ad_faq_main
if (!indexHtml.includes('id="panel_ad_faq_main"')) {
  const faqContents = fs.readFileSync('scratch/faq_contents_only.html', 'utf8');
  const targetTag = '<div class="submodel-panel active" id="panel_ad_lec_lists">';
  const panelFaq = `<!-- ==================== 0. 매뉴얼 & FAQ (/af/ad_faq/main) ==================== -->
      <div class="submodel-panel" id="panel_ad_faq_main" style="display: none;">
        ${faqContents}
      </div>

      ` + targetTag;
  indexHtml = indexHtml.replace(targetTag, panelFaq);
}

fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
fs.copyFileSync(indexHtmlPath, 'course_site/af/ad_lec/lists/sn/3267/index.html');
console.log('Successfully updated index.html and 3267/index.html');
