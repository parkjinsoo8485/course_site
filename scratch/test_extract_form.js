const fs = require('fs');
const path = require('path');

// target html 4개 로드
const mainHtml = fs.readFileSync(path.join(__dirname, 'target_ad_cfg_main.html'), 'utf8');
const teaHtml = fs.readFileSync(path.join(__dirname, 'target_ad_cfg_tea.html'), 'utf8');
const attHtml = fs.readFileSync(path.join(__dirname, 'target_ad_cfg_att.html'), 'utf8');
const smsHtml = fs.readFileSync(path.join(__dirname, 'target_ad_cfg_sms.html'), 'utf8');

// contents 내부 추출 헬퍼
function extractFormBody(html) {
  const formMatch = html.match(/<form\b[^>]*>(.*?)<\/form>/is);
  return formMatch ? formMatch[1] : '';
}

const mainFormBody = extractFormBody(mainHtml);
const teaFormBody = extractFormBody(teaHtml);
const attFormBody = extractFormBody(attHtml);
const smsFormBody = extractFormBody(smsHtml);

console.log('main form size:', mainFormBody.length);
console.log('tea form size:', teaFormBody.length);
console.log('att form size:', attFormBody.length);
console.log('sms form size:', smsFormBody.length);
