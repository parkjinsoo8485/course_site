const fs = require('fs');

const serverJsPath = 'course_site/server.js';
let content = fs.readFileSync(serverJsPath, 'utf8');

// 1. 하단에 추가되었던 ad_tea 블록 추출 및 제거
const startMarker = '// ==================== [Sprint 2] 강사관리 (/af/ad_tea) 엑셀 5대 원칙 프리미엄 출력 및 API ====================';
const endMarker = '// dbdbschool Page Routing Middleware: 관리자 사이드바 전체 경로를 통일된 SPA 마스터 파일로 서빙';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

let teaBlock = '';
if (startIdx !== -1 && endIdx !== -1) {
  teaBlock = content.substring(startIdx, endIdx);
  content = content.substring(0, startIdx) + content.substring(endIdx);
  console.log('Extracted ad_tea block from bottom!');
}

// 2. ad_abs 엑셀 엔드포인트 바로 뒤에 배치
// ad_abs 엔드포인트가 끝나는 부분 찾기
const absMarker = 'const filename = `결석귀가신청목록_${new Date().toISOString().split(\'T\')[0]}.xls`;';
const absEndIdx = content.indexOf(absMarker);

if (absEndIdx !== -1) {
  const insertIdx = content.indexOf('});', absEndIdx) + 3;
  content = content.substring(0, insertIdx) + '\n\n' + teaBlock + '\n' + content.substring(insertIdx);
  console.log('Inserted ad_tea block right after ad_abs routes!');
} else {
  console.error('Could not find absMarker!');
}

fs.writeFileSync(serverJsPath, content, 'utf8');
console.log('Successfully moved ad_tea routes above SPA router in server.js!');
