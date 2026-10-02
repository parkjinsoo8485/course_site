const fs = require('fs');
const spec = JSON.parse(fs.readFileSync('scratch/spec_ad_cfg_sprint3.json', 'utf8'));

console.log('main selects:');
console.log(spec.main.selects.map(s => ({ name: s.name, id: s.id })));

console.log('main inputs sample:');
console.log(spec.main.inputs.map(i => ({ name: i.name, id: i.id })).slice(0, 20));

console.log('sms inputs:');
console.log(spec.sms.inputs.map(i => ({ name: i.name, id: i.id })));
