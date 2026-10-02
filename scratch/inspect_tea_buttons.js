const fs = require('fs');
const html = fs.readFileSync('scratch/target_ad_tea_lists.html', 'utf8');

const regex = /<(a|button|input)\b([^>]*)>(.*?)<\/\1>|<(input)\b([^>]*)>/gis;
let match;
while ((match = regex.exec(html)) !== null) {
  const tag = match[1] || match[4];
  const attrs = match[2] || match[5] || '';
  const text = (match[3] || '').replace(/<[^>]+>/g, '').trim();
  const valMatch = attrs.match(/value=['"]([^'"]*)['"]/i);
  const hrefMatch = attrs.match(/href=['"]([^'"]*)['"]/i);
  const onclickMatch = attrs.match(/onclick=['"]([^'"]*)['"]/i);
  const idMatch = attrs.match(/id=['"]([^'"]*)['"]/i);
  const nameMatch = attrs.match(/name=['"]([^'"]*)['"]/i);

  const val = valMatch ? valMatch[1] : '';
  const href = hrefMatch ? hrefMatch[1] : '';
  const onclick = onclickMatch ? onclickMatch[1] : '';
  const id = idMatch ? idMatch[1] : '';
  const name = nameMatch ? nameMatch[1] : '';
  const label = text || val;

  if (label || href || onclick) {
    console.log(`[${tag}] label: "${label}" | id: "${id}" | name: "${name}" | href: "${href}" | onclick: "${onclick}"`);
  }
}
