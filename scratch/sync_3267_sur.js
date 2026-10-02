/**
 * 3267/index.html에도 sur 패널 및 로직 반영 (index.html과 동기화)
 */
const fs = require('fs');
const path = require('path');

const SRC = 'course_site/af/ad_lec/lists/sn/index.html';
const DST = 'course_site/af/ad_lec/lists/sn/3267/index.html';

// 3267/index.html이 없으면 복사하여 생성
if (!fs.existsSync(DST)) {
  fs.mkdirSync(path.dirname(DST), { recursive: true });
  fs.copyFileSync(SRC, DST);
  console.log('✅ 3267/index.html 새로 복사 생성 완료!');
  process.exit(0);
}

let srcHtml = fs.readFileSync(SRC, 'utf8');
let dstHtml = fs.readFileSync(DST, 'utf8');

// 3267 파일도 같은 구조인지 확인
if (dstHtml.includes('panel_ad_sur_lists') && dstHtml.includes('modal_ad_sur_write')) {
  console.log('✅ 3267/index.html도 이미 최신 상태입니다.');
  process.exit(0);
}

// 16번 패널부터 18번 환경설정 직전까지 교체
const startMarker = '<!-- ==================== 16. 설문관리 > 설문 (/af/ad_sur/lists) ====================';
const endMarker = '<!-- ==================== 18. 환경설정 > 기본설정 (/af/ad_cfg/main) ====================';

const srcStart = srcHtml.indexOf(startMarker);
const srcEnd = srcHtml.indexOf(endMarker);
const dstStart = dstHtml.indexOf(startMarker);
const dstEnd = dstHtml.indexOf(endMarker);

if (srcStart === -1 || srcEnd === -1) {
  console.error('❌ SRC 마커를 찾을 수 없습니다!');
  process.exit(1);
}

if (dstStart === -1 || dstEnd === -1) {
  console.error('❌ DST 마커를 찾을 수 없습니다!');
  process.exit(1);
}

const srcBlock = srcHtml.substring(srcStart, srcEnd);
const newDstHtml = dstHtml.substring(0, dstStart) + srcBlock + dstHtml.substring(dstEnd);
fs.writeFileSync(DST, newDstHtml, 'utf8');
console.log('✅ 3267/index.html 설문관리 패널 동기화 완료!');

// 스크립트 태그도 추가
let dstUpdated = fs.readFileSync(DST, 'utf8');
if (!dstUpdated.includes('sur_logic.js')) {
  const marker = 'abs_logic.js"></script>';
  dstUpdated = dstUpdated.replace(marker, marker + '\n  <script src="/af/ad_lec/lists/sn/sur_logic.js"></script>');
  fs.writeFileSync(DST, dstUpdated, 'utf8');
  console.log('✅ 3267/index.html sur_logic.js 스크립트 태그 추가 완료!');
}

// 검증
const finalHtml = fs.readFileSync(DST, 'utf8');
const checkIds = ['modal_ad_sur_write', 'modal_ad_sur_modify', 'modal_ad_sur_que', 'modal_ad_sur_ans', 'sur_logic.js'];
const missing = checkIds.filter(id => !finalHtml.includes(id));
if (missing.length === 0) {
  console.log('✅ 3267/index.html 전수 검증 완료! (missing: [])');
} else {
  console.error('❌ 3267/index.html 누락 항목:', missing);
}
