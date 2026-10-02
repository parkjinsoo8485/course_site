const fs = require('fs');
const html = fs.readFileSync('scratch/target_ad_sur_lists.html', 'utf8');

// Find table in ad_sur_lists
const tables = [...html.matchAll(/<table\b([^>]*)>([\s\S]*?)<\/table>/gis)];
console.log('ad_sur_lists Tables count:', tables.length);
tables.forEach((t, i) => {
  const ths = [...t[2].matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gis)].map(th => th[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' '));
  console.log(`Table[${i}] THs:`, ths);
  const trs = [...t[2].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gis)];
  console.log(`Table[${i}] total rows:`, trs.length);
  for (let j = 1; j < Math.min(trs.length, 6); j++) {
    const tds = [...trs[j][1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gis)].map(td => td[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' '));
    console.log(`  Row ${j} TDs:`, tds);
  }
});

// Also check buttons around the table
const btns = [...html.matchAll(/<(a|button|input)\b([^>]*)>(.*?)<\/\1>|<(input)\b([^>]*)>/gis)]
  .map(match => {
    const tag = match[1] || match[4];
    const attrs = match[2] || match[5] || '';
    const text = (match[3] || '').replace(/<[^>]+>/g, '').trim();
    const val = (attrs.match(/value=['"]([^'"]*)['"]/i) || [])[1] || '';
    const href = (attrs.match(/href=['"]([^'"]*)['"]/i) || [])[1] || '';
    const onclick = (attrs.match(/onclick=['"]([^'"]*)['"]/i) || [])[1] || '';
    return { tag, label: text || val, href, onclick };
  })
  .filter(b => b.label && (b.label.includes('등록') || b.label.includes('설문') || b.label.includes('출력') || b.label.includes('엑셀') || b.label.includes('HWP') || b.label.includes('검색')));

console.log('Relevant Buttons:');
btns.forEach(b => console.log(`  [${b.tag}] "${b.label}" href="${b.href}" onclick="${b.onclick}"`));
