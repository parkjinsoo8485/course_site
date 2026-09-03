const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'admin_lec.js');
let content = fs.readFileSync(filePath, 'utf8');

// makeBadge 함수 교체
const oldMakeBadge = `function makeBadge(type, href, label) {
  if (type === 'doc') {
    return \`<a href="\${href}" target="_blank" rel="noreferrer" style="display:inline-flex;align-items:center;gap:3px;padding:2px 7px;background:#2563eb;color:#fff;border-radius:3px;font-size:0.72rem;font-weight:700;text-decoration:none;transition:background 0.15s;" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'"><i class="fa-solid fa-file-lines"></i> \${label || '문서'}</a>\`;
  }
  if (type === 'video') {
    return \`<a href="\${href}" target="_blank" rel="noreferrer" style="display:inline-flex;align-items:center;gap:3px;padding:2px 7px;background:#ef4444;color:#fff;border-radius:3px;font-size:0.72rem;font-weight:700;text-decoration:none;transition:background 0.15s;" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'"><i class="fa-brands fa-youtube"></i> \${label || '동영상'}</a>\`;
  }
  return \`<a href="\${href}" target="_blank" rel="noreferrer" style="display:inline-flex;align-items:center;gap:3px;padding:2px 7px;background:#16a34a;color:#fff;border-radius:3px;font-size:0.72rem;font-weight:700;text-decoration:none;transition:background 0.15s;" onmouseover="this.style.background='#15803d'" onmouseout="this.style.background='#16a34a'"><i class="fa-solid fa-download"></i> \${label || '다운로드'}</a>\`;
}`;

const newMakeBadge = `function makeBadge(type, href, label) {
  if (type === 'doc') {
    return \`<a href="\${href}" target="_blank" rel="noreferrer" class="manual_btn"><i class="fa fa-download"></i> \${label || '문서'}</a>\`;
  }
  if (type === 'video') {
    return \`<a href="\${href}" target="_blank" rel="noreferrer" class="manual_btn" style="color:#c0392b;"><i class="fa fa-youtube-play"></i> <span class="txt">\${label || '동영상'}</span></a>\`;
  }
  return \`<a href="\${href}" target="_blank" rel="noreferrer" class="manual_btn"><i class="fa fa-download"></i> \${label || '다운로드'}</a>\`;
}`;

// 줄바꿈 정규화 후 매칭
content = content.replace(/\r\n/g, '\n');
const normOld = oldMakeBadge.replace(/\r\n/g, '\n');

if (content.includes(normOld)) {
  content = content.replace(normOld, newMakeBadge);
  console.log('makeBadge updated successfully');
} else {
  console.log('oldMakeBadge not matched directly, checking substring');
}

// loadFaqList 보호 조건 추가: 이미 내용이 렌더링되어 있으면 덮어쓰지 않음
const oldLoadFaq = `function loadFaqList() {
  // 1. 수강신청 운영 절차 (1 ~ 23)
  const opsContainer = document.getElementById('operationsListContainer');
  if (opsContainer) {`;

const newLoadFaq = `function loadFaqList() {
  // 1. 수강신청 운영 절차 (1 ~ 23)
  const opsContainer = document.getElementById('operationsListContainer');
  if (opsContainer && (!opsContainer.children.length || opsContainer.innerText.includes('로딩'))) {`;

if (content.includes(oldLoadFaq)) {
  content = content.replace(oldLoadFaq, newLoadFaq);
  console.log('loadFaqList guard condition added');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('admin_lec.js updated');
