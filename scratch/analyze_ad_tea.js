const fs = require('fs');

function extractInfo(file) {
  if (!fs.existsSync(file)) return;
  const html = fs.readFileSync(file, 'utf8');
  console.log('==============================');
  console.log('=== ' + file + ' ===');

  // title
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  console.log('Title:', titleMatch ? titleMatch[1].trim() : 'N/A');

  // forms
  const formMatches = [...html.matchAll(/<form\b([^>]*)>/gi)];
  console.log('Forms count:', formMatches.length);
  formMatches.forEach((m, i) => {
    const attrs = m[1];
    const name = (attrs.match(/name=["']([^"']*)["']/i) || [])[1];
    const id = (attrs.match(/id=["']([^"']*)["']/i) || [])[1];
    const action = (attrs.match(/action=["']([^"']*)["']/i) || [])[1];
    console.log(`  Form[${i}] name=${name} id=${id} action=${action}`);
  });

  // inputs & selects & textareas
  const inputs = [...html.matchAll(/<input\b([^>]*)>/gi)].map(m => {
    const attrs = m[1];
    const type = (attrs.match(/type=["']([^"']*)["']/i) || [])[1] || 'text';
    const name = (attrs.match(/name=["']([^"']*)["']/i) || [])[1] || '';
    const id = (attrs.match(/id=["']([^"']*)["']/i) || [])[1] || '';
    const value = (attrs.match(/value=["']([^"']*)["']/i) || [])[1] || '';
    return { type, name, id, value };
  });

  const selects = [...html.matchAll(/<select\b([^>]*)>/gi)].map(m => {
    const attrs = m[1];
    const name = (attrs.match(/name=["']([^"']*)["']/i) || [])[1] || '';
    const id = (attrs.match(/id=["']([^"']*)["']/i) || [])[1] || '';
    return { name, id };
  });

  console.log(`Inputs: ${inputs.length}, Selects: ${selects.length}`);
  console.log('Key Inputs (non-hidden):', inputs.filter(i => i.type !== 'hidden').map(i => `${i.type}[${i.name || i.id || i.value}]`));

  // buttons & action links
  const buttons = [...html.matchAll(/<(button|a|input)\b([^>]*)>(.*?)<\/\1>/gis)].concat(
    inputs.filter(i => ['button', 'submit'].includes(i.type)).map(i => ({ val: i.value }))
  );
  
  // Extract th headers
  const ths = [...html.matchAll(/<th\b[^>]*>(.*?)<\/th>/gis)].map(m => m[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' '));
  console.log('Table TH headers:', ths);
}

extractInfo('scratch/target_ad_tea_lists.html');
extractInfo('scratch/target_ad_tea_write.html');
extractInfo('scratch/target_ad_tea_input.html');
