const fs = require('fs');
const html = fs.readFileSync('scratch/target_ad_sur_write.html', 'utf8');

const tableMatch = html.match(/<form\b[^>]*name=['"]fm_edit['"][^>]*>([\s\S]*?)<\/form>/i);
if (tableMatch) {
  const formHtml = tableMatch[1];
  const trs = [...formHtml.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gis)];
  console.log(`Found ${trs.length} rows in write form:`);
  trs.forEach((tr, i) => {
    const th = (tr[1].match(/<th\b[^>]*>([\s\S]*?)<\/th>/i) || [])[1] || '';
    const cleanTh = th.replace(/<[^>]+>/g, '').trim();
    // Inputs inside this row
    const inputs = [...tr[1].matchAll(/<(input|select|textarea)\b([^>]*)>/gi)].map(m => {
      const tag = m[1];
      const attrs = m[2];
      const name = (attrs.match(/name=['"]([^'"]*)['"]/i) || [])[1] || '';
      const id = (attrs.match(/id=['"]([^'"]*)['"]/i) || [])[1] || '';
      const type = (attrs.match(/type=['"]([^'"]*)['"]/i) || [])[1] || tag;
      const value = (attrs.match(/value=['"]([^'"]*)['"]/i) || [])[1] || '';
      return `${tag}[type=${type}, name=${name}, id=${id}, val=${value}]`;
    });
    console.log(`Row[${i}] TH: "${cleanTh}" -> ${inputs.join(', ')}`);
  });
}
