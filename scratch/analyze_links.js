const fs = require('fs');
const html = fs.readFileSync('scratch/entry0.html', 'utf8');

const hrefs = [];
const hrefRegex = /href=["']([^"']+)["']/g;
let match;
while ((match = hrefRegex.exec(html)) !== null) {
  hrefs.push(match[1]);
}

const onclicks = [];
const onclickRegex = /onclick=["']([^"']+)["']/g;
while ((match = onclickRegex.exec(html)) !== null) {
  onclicks.push(match[1]);
}

console.log('Total hrefs:', hrefs.length);
console.log('Unique hrefs:', [...new Set(hrefs)]);

console.log('\n--- Onclicks ---');
console.log('Total onclicks:', onclicks.length);
[...new Set(onclicks)].forEach(o => console.log('ONCLICK:', o));
