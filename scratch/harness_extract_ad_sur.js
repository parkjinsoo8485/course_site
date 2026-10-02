const fs = require('fs');

function extractFormFields(html) {
  const forms = [];
  const formRegex = /<form\b([^>]*)>(.*?)<\/form>/gis;
  let formMatch;

  while ((formMatch = formRegex.exec(html)) !== null) {
    const formAttr = formMatch[1];
    const formBody = formMatch[2];
    const nameMatch = formAttr.match(/name=['"]([^'"]*)['"]/i);
    const idMatch = formAttr.match(/id=['"]([^'"]*)['"]/i);
    const actionMatch = formAttr.match(/action=['"]([^'"]*)['"]/i);
    const methodMatch = formAttr.match(/method=['"]([^'"]*)['"]/i);

    forms.push({
      name: nameMatch ? nameMatch[1] : '',
      id: idMatch ? idMatch[1] : '',
      action: actionMatch ? actionMatch[1] : '',
      method: methodMatch ? methodMatch[1] : 'get'
    });
  }

  // Extract all inputs
  const inputs = [];
  const inputRegex = /<input\b([^>]*)>/gi;
  let inputMatch;
  while ((inputMatch = inputRegex.exec(html)) !== null) {
    const attrs = inputMatch[1];
    const type = (attrs.match(/type=['"]([^'"]*)['"]/i) || [])[1] || 'text';
    const name = (attrs.match(/name=['"]([^'"]*)['"]/i) || [])[1] || '';
    const id = (attrs.match(/id=['"]([^'"]*)['"]/i) || [])[1] || '';
    const value = (attrs.match(/value=['"]([^'"]*)['"]/i) || [])[1] || '';
    inputs.push({ type, name, id, value });
  }

  // Extract all selects
  const selects = [];
  const selectRegex = /<select\b([^>]*)>(.*?)<\/select>/gis;
  let selectMatch;
  while ((selectMatch = selectRegex.exec(html)) !== null) {
    const attrs = selectMatch[1];
    const name = (attrs.match(/name=['"]([^'"]*)['"]/i) || [])[1] || '';
    const id = (attrs.match(/id=['"]([^'"]*)['"]/i) || [])[1] || '';
    const options = [...selectMatch[2].matchAll(/<option\b[^>]*value=['"]([^'"]*)['"][^>]*>(.*?)<\/option>/gis)].map(o => ({
      val: o[1],
      text: o[2].trim()
    }));
    selects.push({ name, id, options });
  }

  // Extract all textareas
  const textareas = [];
  const textareaRegex = /<textarea\b([^>]*)>(.*?)<\/textarea>/gis;
  let textareaMatch;
  while ((textareaMatch = textareaRegex.exec(html)) !== null) {
    const attrs = textareaMatch[1];
    const name = (attrs.match(/name=['"]([^'"]*)['"]/i) || [])[1] || '';
    const id = (attrs.match(/id=['"]([^'"]*)['"]/i) || [])[1] || '';
    textareas.push({ name, id });
  }

  // Extract all buttons and action links
  const actions = [];
  const actionRegex = /<(a|button|input)\b([^>]*)>(.*?)<\/\1>|<(input)\b([^>]*)>/gis;
  let actionMatch;
  while ((actionMatch = actionRegex.exec(html)) !== null) {
    const tag = actionMatch[1] || actionMatch[4];
    const attrs = actionMatch[2] || actionMatch[5] || '';
    const text = (actionMatch[3] || '').replace(/<[^>]+>/g, '').trim();
    const val = (attrs.match(/value=['"]([^'"]*)['"]/i) || [])[1] || '';
    const href = (attrs.match(/href=['"]([^'"]*)['"]/i) || [])[1] || '';
    const onclick = (attrs.match(/onclick=['"]([^'"]*)['"]/i) || [])[1] || '';
    const id = (attrs.match(/id=['"]([^'"]*)['"]/i) || [])[1] || '';
    const name = (attrs.match(/name=['"]([^'"]*)['"]/i) || [])[1] || '';
    const label = text || val;

    if (label || href || onclick) {
      actions.push({ tag, label, id, name, href, onclick });
    }
  }

  // Extract table headers
  const thHeaders = [...html.matchAll(/<th\b[^>]*>(.*?)<\/th>/gis)].map(m => m[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ')).filter(Boolean);

  return { forms, inputs, selects, textareas, actions, thHeaders };
}

function processSpec() {
  const spec = {};
  const files = [
    { key: 'lists', path: 'scratch/target_ad_sur_lists.html' },
    { key: 'write', path: 'scratch/target_ad_sur_write.html' },
    { key: 'modify', path: 'scratch/target_ad_sur_modify.html' },
    { key: 'que', path: 'scratch/target_ad_sur_que.html' },
    { key: 'ans', path: 'scratch/target_ad_sur_ans.html' },
    { key: 'surs_lists', path: 'scratch/target_ad_surs_lists.html' }
  ];

  files.forEach(f => {
    if (fs.existsSync(f.path)) {
      const html = fs.readFileSync(f.path, 'utf8');
      spec[f.key] = extractFormFields(html);
      console.log(`[Spec] ${f.key}: inputs=${spec[f.key].inputs.length}, selects=${spec[f.key].selects.length}, textareas=${spec[f.key].textareas.length}, actions=${spec[f.key].actions.length}, thHeaders=${spec[f.key].thHeaders.length}`);
    }
  });

  fs.writeFileSync('scratch/spec_ad_sur.json', JSON.stringify(spec, null, 2), 'utf8');
  console.log('✔ Wrote scratch/spec_ad_sur.json');
}

processSpec();
