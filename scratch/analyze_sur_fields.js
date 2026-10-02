const fs = require('fs');
const spec = JSON.parse(fs.readFileSync('scratch/spec_ad_sur.json', 'utf8'));

console.log('=== 1. ad_sur lists ===');
console.log('Inputs:', spec.lists.inputs.map(i => `${i.type}[${i.name || i.id || i.value}]`).filter(x => !x.includes('csrf') && !x.includes('date_use') && !x.includes('login_') && !x.includes('otp_')));
console.log('Selects:', spec.lists.selects.map(s => s.name || s.id));
console.log('TH Headers:', spec.lists.thHeaders);
console.log('Key Actions:', spec.lists.actions.map(a => `[${a.tag}] ${a.label} (${a.href || a.onclick})`).filter(x => x.length > 5 && !x.includes('xmecca') && !x.includes('dbdbschool.kr/af/ad_rsch') && !x.includes('login') && !x.includes('auth2')).slice(0, 20));

console.log('\n=== 2. ad_sur write ===');
console.log('Inputs:', spec.write.inputs.map(i => `${i.type}[${i.name || i.id || i.value}]`).filter(x => !x.includes('csrf') && !x.includes('date_use') && !x.includes('login_') && !x.includes('otp_')));
console.log('Selects:', spec.write.selects.map(s => s.name || s.id));
console.log('Textareas:', spec.write.textareas.map(t => t.name || t.id));
console.log('TH Headers:', spec.write.thHeaders);

console.log('\n=== 3. ad_sur que (문항관리) ===');
console.log('Inputs:', spec.que.inputs.map(i => `${i.type}[${i.name || i.id || i.value}]`).filter(x => !x.includes('csrf') && !x.includes('date_use') && !x.includes('login_') && !x.includes('otp_')));
console.log('Selects:', spec.que.selects.map(s => s.name || s.id));
console.log('Textareas:', spec.que.textareas.map(t => t.name || t.id));
console.log('TH Headers:', spec.que.thHeaders);
console.log('Key Actions:', spec.que.actions.map(a => `[${a.tag}] ${a.label} (${a.href || a.onclick})`).filter(x => x.length > 5 && !x.includes('login') && !x.includes('auth2')).slice(0, 15));

console.log('\n=== 4. ad_sur ans (결과보기) ===');
console.log('Inputs:', spec.ans.inputs.map(i => `${i.type}[${i.name || i.id || i.value}]`).filter(x => !x.includes('csrf') && !x.includes('date_use') && !x.includes('login_') && !x.includes('otp_')));
console.log('Selects:', spec.ans.selects.map(s => s.name || s.id));
console.log('TH Headers:', spec.ans.thHeaders);
console.log('Key Actions:', spec.ans.actions.map(a => `[${a.tag}] ${a.label} (${a.href || a.onclick})`).filter(x => x.length > 5 && !x.includes('login') && !x.includes('auth2')).slice(0, 15));

console.log('\n=== 5. ad_surs lists (샘플설문) ===');
console.log('Inputs:', spec.surs_lists.inputs.map(i => `${i.type}[${i.name || i.id || i.value}]`).filter(x => !x.includes('csrf') && !x.includes('date_use') && !x.includes('login_') && !x.includes('otp_')));
console.log('TH Headers:', spec.surs_lists.thHeaders);
console.log('Key Actions:', spec.surs_lists.actions.map(a => `[${a.tag}] ${a.label} (${a.href || a.onclick})`).filter(x => x.length > 5 && !x.includes('login') && !x.includes('auth2')).slice(0, 15));
