const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const lines = content.split('\n');

// Line 742 부근의 여분 </div> 확인
console.log('Line 739:', lines[738]);
console.log('Line 740:', lines[739]);
console.log('Line 741:', lines[740]);
console.log('Line 742:', lines[741]);
console.log('Line 743:', lines[742]);
console.log('Line 744:', lines[743]);

// 여분의 </div> 1개 삭제
// 738번째 인덱스부터 742번째 인덱스까지 확인하여 </div> 하나를 제거
lines.splice(741, 1); // 742번째 줄 (인덱스 741) 삭제

content = lines.join('\n');
fs.writeFileSync(indexPath, content, 'utf8');
console.log('Successfully deleted the extra </div> at line 742!');
