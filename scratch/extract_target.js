const fs = require('fs');

const raw = fs.readFileSync('scratch/page_af_ad_app_lists_sn_3267.html', 'utf8');
const contentsStart = raw.indexOf('<div id="contents"');
const footerStart = raw.indexOf('<div id="footer"');
let contentsHtml = '';
if (contentsStart !== -1) {
  if (footerStart !== -1) {
    contentsHtml = raw.substring(contentsStart, footerStart);
  } else {
    contentsHtml = raw.substring(contentsStart);
  }
}
fs.writeFileSync('scratch/target.html', contentsHtml, 'utf8');
console.log('Extracted scratch/target.html successfully. Length:', contentsHtml.length);
