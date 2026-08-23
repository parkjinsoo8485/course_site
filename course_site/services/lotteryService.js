// 추첨 및 우선순위 자동 배치 서비스
function executeLottery(schoolId, courseId, db) {
  const course = db.findCourseById(courseId);
  if (!course) return { error: '강좌를 찾을 수 없습니다.' };

  const applicants = db.data.applicants.filter(a => a.schoolId === schoolId && a.courseId === courseId);
  if (applicants.length === 0) return { error: '신청자가 없습니다.' };

  // Priority logic: Rank 1 (기초수급/늘봄우선 100) -> Rank 2 (다자녀 50) -> General (10)
  const scored = applicants.map(app => {
    let score = 10;
    if (app.subsidyType === '자유수강권' || app.subsidyType === '국민기초생활수급자') score = 100;
    else if (app.subsidyType === '한부모가족' || app.subsidyType === '다자녀') score = 50;
    return {
      ...app,
      score,
      randomSeed: Math.random()
    };
  });

  // Sort by Score descending, then randomSeed descending
  scored.sort((a, b) => b.score - a.score || b.randomSeed - a.randomSeed);

  const capacity = course.capacity || 20;
  const winners = scored.slice(0, capacity);
  const waitlistees = scored.slice(capacity);

  // Update records
  winners.forEach(w => {
    const orig = db.data.applicants.find(a => a.id === w.id);
    if (orig) orig.status = '승인';
  });

  waitlistees.forEach((wl, idx) => {
    const orig = db.data.applicants.find(a => a.id === wl.id);
    if (orig) orig.status = '대기';

    if (!db.data.waitlist) db.data.waitlist = [];
    if (!db.data.waitlist.some(item => item.studentName === wl.studentName && item.courseId === courseId)) {
      db.data.waitlist.push({
        id: `wait_${Date.now()}_${idx}`,
        schoolId,
        courseId,
        studentName: wl.studentName,
        parentPhone: wl.parentPhone,
        gradeClass: wl.gradeClass,
        waitNumber: idx + 1,
        createdAt: new Date().toISOString()
      });
    }
  });

  db.saveData();

  return {
    success: true,
    totalApplicants: applicants.length,
    capacity,
    winnerCount: winners.length,
    waitlistCount: waitlistees.length,
    message: `🎉 추첨 완료: ${winners.length}명 당첨(승인), ${waitlistees.length}명 대기자 배치가 완료되었습니다.`
  };
}

module.exports = {
  executeLottery
};
