const fs = require('fs');
const html = fs.readFileSync('scratch/target_ad_sur_ans.html', 'utf8');

const idx = html.indexOf('id="contents"');
if (idx !== -1) {
  console.log('Snippet around id="contents" in ans:\n', html.slice(idx, idx + 2500));
}
