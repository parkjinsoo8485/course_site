const fs = require('fs');
const html = fs.readFileSync('course_site/af/ad_lec/lists/sn/index.html', 'utf8');
const pStart = html.indexOf('id="panel_ad_faq_main"');
const pEnd = html.indexOf('<!-- ==================== 1.', pStart);
const panelHtml = html.substring(pStart, pEnd !== -1 ? pEnd : pStart + 5000);
console.log('Panel length:', panelHtml.length);
const ids = panelHtml.match(/id="[^"]+"/g);
console.log('IDs in panel_ad_faq_main:', ids);
fs.writeFileSync('scratch/faq_panel_content.html', panelHtml, 'utf8');
