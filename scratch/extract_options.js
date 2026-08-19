const fs = require('fs');
const html = fs.readFileSync('scratch/ad_pay_edit_response.html', 'utf8');

const sldMatch = html.match(/<select[^>]*name="sld"[^>]*>([\s\S]*?)<\/select>/i);
const slnMatch = html.match(/<select[^>]*name="sln"[^>]*>([\s\S]*?)<\/select>/i);

console.log('--- SLD OPTIONS ---');
console.log(sldMatch ? sldMatch[1] : 'none');

console.log('--- SLN OPTIONS (first 10) ---');
if (slnMatch) {
  const options = [...slnMatch[1].matchAll(/<option[^>]*value="([^"]*)"[^>]*>([\s\S]*?)<\/option>/gi)].map(m => ({
    value: m[1],
    text: m[2].trim()
  }));
  console.log('Total course options:', options.length);
  console.log(options.slice(0, 15));
}
