const fs = require('fs');
const html = fs.readFileSync('scratch/ad_pay_edit_response.html', 'utf8');

const scriptMatches = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];

scriptMatches.forEach((m, idx) => {
  const content = m[1].trim();
  if (content.includes('chkLecPay') || content.includes('chk_apply') || content.includes('fm_edit_check') || content.includes('all_check') || content.includes('apply_all')) {
    console.log(`\n================ SCRIPT WITH PAGE LOGIC #${idx} ================\n`);
    console.log(content);
  }
});
