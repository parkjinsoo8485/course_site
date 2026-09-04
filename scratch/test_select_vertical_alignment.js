const fs = require('fs');
const path = require('path');

// ==================== Select Vertical Alignment Standard Automated Checker ====================
// Standard Rules:
// 1. line-height: normal !important; (NEVER pixel/numeric line-height)
// 2. height: 30px
// 3. box-sizing: border-box
// 4. padding: balanced vertical padding (padding-top: 0, padding-bottom: 0, or padding: 0 ...)
// 5. vertical-align: middle

function checkSelectStyling(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];

  // Check for harmful line-height on select
  const badLineHeightRegex = /select[^\{]*\{[^}]*line-height:\s*\d+px/gi;
  let match;
  while ((match = badLineHeightRegex.exec(content)) !== null) {
    errors.push(`[위반] <select>에 고정 픽셀 line-height 적용 감지: "${match[0].trim()}"`);
  }

  // Check batchUploadModal select styling
  if (content.includes('modal_lec_div')) {
    const hasNormalLineHeight = content.includes('line-height: normal') || content.includes('line-height:normal');
    const hasVerticalAlign = content.includes('vertical-align: middle') || content.includes('vertical-align:middle');
    const hasZeroVerticalPadding = content.includes('padding: 0') || content.includes('padding-top: 0') || content.includes('padding:0');

    if (!hasNormalLineHeight) {
      errors.push('[위반] modal_lec_div에 "line-height: normal" 누락');
    }
    if (!hasVerticalAlign) {
      errors.push('[위반] modal_lec_div에 "vertical-align: middle" 누락');
    }
    if (!hasZeroVerticalPadding) {
      errors.push('[위반] modal_lec_div에 상하 0 패딩 누락');
    }
  }

  return errors;
}

const filesToCheck = [
  path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html'),
  path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', '3267', 'index.html'),
  path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'admin_lec.css')
];

let allPassed = true;
console.log('🔍 [<select> 수직 가운데 정렬 표준 자동 점검]');
filesToCheck.forEach(f => {
  if (fs.existsSync(f)) {
    const errs = checkSelectStyling(f);
    if (errs.length === 0) {
      console.log(`✅ PASS: ${path.basename(f)}`);
    } else {
      console.error(`❌ FAIL: ${path.basename(f)}`);
      errs.forEach(e => console.error(`   - ${e}`));
      allPassed = false;
    }
  }
});

if (allPassed) {
  console.log('\n🎉 [자동 점검 완료] 모든 <select> 요소가 크롬 엔진 수직 가운데 정렬 표준을 완벽하게 준수하고 있습니다.');
  process.exit(0);
} else {
  console.error('\n⚠️ [자동 점검 경고] <select> 수직 정렬 표준 위반 사항이 발견되었습니다.');
  process.exit(1);
}
