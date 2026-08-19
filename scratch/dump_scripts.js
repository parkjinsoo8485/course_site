const fs = require('fs');
const html = fs.readFileSync('scratch/ad_pay_edit_response.html', 'utf8');

const scriptMatches = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];

scriptMatches.forEach((m, idx) => {
  const content = m[1].trim();
  if (content.length > 0) {
    console.log(`\n================ SCRIPT #${idx} ================\n`);
    console.log(content);
  }
});
