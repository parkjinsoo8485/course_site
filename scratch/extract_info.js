const fs = require('fs');
const html = fs.readFileSync('scratch/ad_pay_edit_response.html', 'utf8');

// Find all script tags
const scriptMatches = [...html.matchAll(/<script[\s\S]*?<\/script>/gi)].map(m => m[0]);
console.log('Total scripts found:', scriptMatches.length);

scriptMatches.forEach((s, idx) => {
  console.log(`=== Script #${idx} ===`);
  console.log(s);
});

// Extract form
const formMatch = html.match(/<form[\s\S]*?<\/form>/gi);
if (formMatch) {
  formMatch.forEach((f, idx) => {
    console.log(`=== Form #${idx} ===`);
    console.log(f.substring(0, 3000));
  });
}
