const fs = require('fs');
const html = fs.readFileSync('scratch/ad_pay_edit_response.html', 'utf8');

const tStart = html.indexOf('<div class="panel_main panel-default_main">');
const tEnd = html.indexOf('<!-- //footer -->');

console.log('Main body length:', tEnd - tStart);
const mainHtml = html.substring(tStart, tEnd);
fs.writeFileSync('scratch/exact_ad_pay_main.html', mainHtml);
console.log('Saved exact_ad_pay_main.html');
