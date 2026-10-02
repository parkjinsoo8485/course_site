const fs = require('fs');
const path = require('path');

const tabs = ['main', 'tea', 'att', 'sms'];
const result = {};

tabs.forEach(tab => {
  const filePath = path.join(__dirname, `target_ad_cfg_${tab}.html`);
  if (!fs.existsSync(filePath)) return;

  const html = fs.readFileSync(filePath, 'utf8');

  // Forms
  const forms = [];
  const formRegex = /<form\b([^>]*)>(.*?)<\/form>/gis;
  let fm;
  while ((fm = formRegex.exec(html)) !== null) {
    const attr = fm[1];
    const name = (attr.match(/name=['"]([^'"]*)['"]/i) || [])[1] || '';
    const id = (attr.match(/id=['"]([^'"]*)['"]/i) || [])[1] || '';
    const action = (attr.match(/action=['"]([^'"]*)['"]/i) || [])[1] || '';
    const method = (attr.match(/method=['"]([^'"]*)['"]/i) || [])[1] || 'get';
    forms.push({ name, id, action, method });
  }

  // Inputs
  const inputs = [];
  const inputRegex = /<input\b([^>]*)>/gi;
  let im;
  while ((im = inputRegex.exec(html)) !== null) {
    const attr = im[1];
    const type = (attr.match(/type=['"]([^'"]*)['"]/i) || [])[1] || 'text';
    const name = (attr.match(/name=['"]([^'"]*)['"]/i) || [])[1] || '';
    const id = (attr.match(/id=['"]([^'"]*)['"]/i) || [])[1] || '';
    const value = (attr.match(/value=['"]([^'"]*)['"]/i) || [])[1] || '';
    const checked = /checked\b/i.test(attr);
    inputs.push({ type, name, id, value, checked });
  }

  // Selects
  const selects = [];
  const selectRegex = /<select\b([^>]*)>(.*?)<\/select>/gis;
  let sm;
  while ((sm = selectRegex.exec(html)) !== null) {
    const attr = sm[1];
    const name = (attr.match(/name=['"]([^'"]*)['"]/i) || [])[1] || '';
    const id = (attr.match(/id=['"]([^'"]*)['"]/i) || [])[1] || '';
    const options = [...sm[2].matchAll(/<option\b[^>]*value=['"]([^'"]*)['"][^>]*>(.*?)<\/option>/gis)].map(o => ({
      val: o[1],
      text: o[2].trim()
    }));
    selects.push({ name, id, options });
  }

  // Textareas
  const textareas = [];
  const tmRegex = /<textarea\b([^>]*)>(.*?)<\/textarea>/gis;
  let tm;
  while ((tm = tmRegex.exec(html)) !== null) {
    const attr = tm[1];
    const name = (attr.match(/name=['"]([^'"]*)['"]/i) || [])[1] || '';
    const id = (attr.match(/id=['"]([^'"]*)['"]/i) || [])[1] || '';
    textareas.push({ name, id });
  }

  // Buttons & Clickables
  const buttons = [];
  const btnRegex = /<(button|a|input type=['"]button['"]|input type=['"]submit['"])\b([^>]*)>(.*?)<\/\1>/gis;
  let bm;
  while ((bm = btnRegex.exec(html)) !== null) {
    const tag = bm[1];
    const attr = bm[2];
    const text = bm[3].replace(/<[^>]*>/g, '').trim();
    const onclick = (attr.match(/onclick=['"]([^'"]*)['"]/i) || [])[1] || '';
    const id = (attr.match(/id=['"]([^'"]*)['"]/i) || [])[1] || '';
    if (onclick || id || /btn/i.test(attr)) {
      buttons.push({ tag, id, onclick, text: text.substring(0, 30) });
    }
  }

  result[tab] = {
    forms,
    inputCount: inputs.length,
    inputs,
    selectCount: selects.length,
    selects,
    textareaCount: textareas.length,
    textareas,
    buttonCount: buttons.length,
    buttons
  };
});

fs.writeFileSync(path.join(__dirname, 'spec_ad_cfg_sprint3.json'), JSON.stringify(result, null, 2), 'utf8');
console.log('✅ spec_ad_cfg_sprint3.json 생성 완료!');
tabs.forEach(t => {
  if (result[t]) {
    console.log(`- [${t}] forms:${result[t].forms.length}, inputs:${result[t].inputCount}, selects:${result[t].selectCount}, textareas:${result[t].textareaCount}, buttons:${result[t].buttonCount}`);
  }
});
