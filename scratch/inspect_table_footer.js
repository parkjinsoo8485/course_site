const fs = require('fs');
const html = fs.readFileSync('scratch/ad_pay_edit_response.html', 'utf8');

const tStart = html.indexOf('<form action="https://www.dbdbschool.kr/af/ad_pay/edit/sn/3267/sld/10/sln/1552375" name="fm_edit"');
const tEnd = html.indexOf('</form>', tStart);
const afterForm = html.substring(tStart, tEnd + 1000);
console.log('=== FORM EDIT & CONTROLS ===\n', afterForm.substring(afterForm.length - 2500));
