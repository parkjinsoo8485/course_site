const fs = require('fs');
const html = fs.readFileSync('har_page.html', 'utf8');

// 강좌 select 옵션 추출 (실제 광주풍향초 데이터)
const optRe = /<option value="(\d+)"[^>]*>\s*([^<]+)<\/option>/g;
let m;
const courses = [];
while ((m = optRe.exec(html)) !== null) {
  const id = m[1];
  const text = m[2].trim();
  // 강좌명 파싱: [26년 8월] 강좌명 (강사,N명)
  const parsed = text.match(/\[([^\]]+)\]\s+(.+?)\(([^,]+),(\d+)명\)/);
  if (parsed) {
    courses.push({
      id: parseInt(id),
      period: parsed[1].trim(),
      name: parsed[2].trim(),
      teacher: parsed[3].trim(),
      studentCount: parseInt(parsed[4])
    });
  }
}

console.log(`총 ${courses.length}개 강좌 발견`);
console.log('\n=== 실제 강좌 목록 (광주풍향초등학교 26년 8월) ===');
courses.forEach((c, i) => {
  console.log(`${String(i+1).padStart(3)}. [${c.period}] ${c.name} | 강사: ${c.teacher} | 신청: ${c.studentCount}명 | ID: ${c.id}`);
});

// JSON으로 저장
fs.writeFileSync('scratch/actual_courses_3267.json', JSON.stringify(courses, null, 2), 'utf8');
console.log('\n=> scratch/actual_courses_3267.json 저장 완료');
