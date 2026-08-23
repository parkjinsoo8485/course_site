const fs = require('fs');

const courses59 = JSON.parse(fs.readFileSync('scratch/courses_59.json', 'utf8'));

const newApplicantDbCode = `let applicantDb = [
  { id: '21016254', seq: 19, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 1, studentNum: 10, gradeClass: '1학년 1반', studentName: '오하율', parentPhone: '010-1234-5670', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:28:38', bankName: '농협', schoolBankingAccount: '302-1234-5678-01', depositorName: '오태양', memo: '' },
  { id: '21016237', seq: 18, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 1, studentNum: 11, gradeClass: '1학년 1반', studentName: '이소윤', parentPhone: '010-3718-3500', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:26:54', bankName: '국민은행', schoolBankingAccount: '648201-01-234567', depositorName: '이진수', memo: '' },
  { id: '21016247', seq: 17, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 1, studentNum: 13, gradeClass: '1학년 1반', studentName: '이채린', parentPhone: '010-2345-6781', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:27:53', bankName: '신한은행', schoolBankingAccount: '110-234-567890', depositorName: '이동현', memo: '' },
  { id: '21016260', seq: 16, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 1, studentNum: 14, gradeClass: '1학년 1반', studentName: '장희준', parentPhone: '010-5334-7217', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:29:29', bankName: '카카오뱅크', schoolBankingAccount: '3333-01-9876543', depositorName: '장성식', memo: '' },
  { id: '21016240', seq: 15, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 1, studentNum: 17, gradeClass: '1학년 1반', studentName: '최다연', parentPhone: '010-5219-2196', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '늘봄 지원금', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 15:27:16', bankName: '우리은행', schoolBankingAccount: '1002-123-456789', depositorName: '최병서', memo: '' },
  { id: '21016242', seq: 14, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 1, studentNum: 18, gradeClass: '1학년 1반', studentName: '최연우', parentPhone: '010-3456-7892', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '일반 자부담', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 15:27:36', bankName: '농협', schoolBankingAccount: '351-0123-4567-89', depositorName: '최민수', memo: '' },
  { id: '21016276', seq: 13, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 1, studentNum: 19, gradeClass: '1학년 1반', studentName: '최유나', parentPhone: '010-3373-3683', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '일반 자부담', paymentStatus: '결제대기', status: '신청대기', appliedAt: '2026-07-10 15:31:04', bankName: '하나은행', schoolBankingAccount: '123-910111-12131', depositorName: '최광철', memo: '' },
  { id: '21016252', seq: 12, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 2, studentNum: 2, gradeClass: '1학년 2반', studentName: '김은성', parentPhone: '010-9073-5302', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:28:24', bankName: '기업은행', schoolBankingAccount: '010-9073-5302', depositorName: '김성태', memo: '' },
  { id: '21016250', seq: 11, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 2, studentNum: 5, gradeClass: '1학년 2반', studentName: '노슬찬', parentPhone: '010-5445-0930', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:28:20', bankName: '농협', schoolBankingAccount: '301-4455-6677-88', depositorName: '노철웅', memo: '' },
  { id: '21016257', seq: 10, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 2, studentNum: 7, gradeClass: '1학년 2반', studentName: '배지안', parentPhone: '010-4567-8901', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:29:10', bankName: '국민은행', schoolBankingAccount: '445501-01-334455', depositorName: '배영호', memo: '' },
  { id: '21016266', seq: 9, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 2, studentNum: 8, gradeClass: '1학년 2반', studentName: '소하윤', parentPhone: '010-5678-9012', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:29:45', bankName: '신한은행', schoolBankingAccount: '110-345-678901', depositorName: '소진우', memo: '' },
  { id: '21016262', seq: 8, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 2, studentNum: 14, gradeClass: '1학년 2반', studentName: '임지유', parentPhone: '010-6789-0123', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:30:12', bankName: '우리은행', schoolBankingAccount: '1002-345-678901', depositorName: '임태훈', memo: '' },
  { id: '21016290', seq: 7, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 2, classNum: 1, studentNum: 12, gradeClass: '2학년 1반', studentName: '장무재', parentPhone: '010-7890-1234', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:30:40', bankName: '하나은행', schoolBankingAccount: '123-456789-01234', depositorName: '장호진', memo: '' },
  { id: '21016282', seq: 6, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 2, classNum: 2, studentNum: 3, gradeClass: '2학년 2반', studentName: '국민준', parentPhone: '010-8901-2345', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:31:05', bankName: '농협', schoolBankingAccount: '302-3456-7890-12', depositorName: '국동현', memo: '' },
  { id: '21016288', seq: 5, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 2, classNum: 2, studentNum: 5, gradeClass: '2학년 2반', studentName: '김도아', parentPhone: '010-9012-3456', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:31:30', bankName: '카카오뱅크', schoolBankingAccount: '3333-02-1234567', depositorName: '김상우', memo: '' },
  { id: '21016279', seq: 4, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 2, classNum: 2, studentNum: 13, gradeClass: '2학년 2반', studentName: '홍은재', parentPhone: '010-0123-4567', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:32:00', bankName: '기업은행', schoolBankingAccount: '010-0123-4567', depositorName: '홍성민', memo: '' },
  { id: '21016318', seq: 3, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 2, classNum: 3, studentNum: 2, gradeClass: '2학년 3반', studentName: '김지민', parentPhone: '010-1234-9876', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:32:25', bankName: '신한은행', schoolBankingAccount: '110-456-789012', depositorName: '김병철', memo: '' },
  { id: '21016286', seq: 2, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 2, classNum: 3, studentNum: 6, gradeClass: '2학년 3반', studentName: '이서린', parentPhone: '010-2345-8765', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:32:50', bankName: '국민은행', schoolBankingAccount: '556601-01-445566', depositorName: '이재혁', memo: '' },
  { id: '21016297', seq: 1, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 2, classNum: 3, studentNum: 9, gradeClass: '2학년 3반', studentName: '이용준', parentPhone: '010-3456-7654', tuitionFee: 0, accommodationFee: 0, teacherFee: 0, bookFee: 0, materialFee: 0, totalFee: 0, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:33:15', bankName: '농협', schoolBankingAccount: '302-5678-9012-34', depositorName: '이광수', memo: '' }
];

let payCoursesList = ${JSON.stringify(courses59, null, 2)};
`;

const newRoutesCode = `
// Tuition Pay Entry Page (/af/ad_pay/edit/...)
app.get([
  '/af/ad_pay/edit/sn/:sn',
  '/af/ad_pay/edit/sn/:sn/sld/:sld/sln/:sln',
  '/af/ad_pay/edit/p/:p/sn/:sn/sld/:sld/sof/:sof/sot/:sot',
  '/af/ad_pay/edit/p/:p/sn/:sn/sld/:sld/sln/:sln',
  '/af/ad_pay/edit/*'
], (req, res) => {
  return res.sendFile(path.join(__dirname, 'af', 'ad_pay', 'edit', 'sn', '3267', 'index.html'));
});

// GET /api/af/ad_pay/data/sn/3267
app.get('/api/af/ad_pay/data/sn/:sn', (req, res) => {
  const { sld, sln } = req.query;
  const currentSld = sld || '10';
  const currentSln = sln || '1552375';

  // Filter or return students for the selected course
  // In demo mode, if the course is default 1552375 or matched, return all 19 students
  let students = applicantDb.filter(a => String(a.courseId) === String(currentSln));
  if (students.length === 0) {
    // If selecting another course from list, map sample students for rich experience
    students = applicantDb;
  }

  return res.json({
    success: true,
    schoolName: '광주풍향초등학교',
    currentSld,
    currentSln,
    courses: payCoursesList,
    students
  });
});

// POST /api/af/ad_pay/update-single
app.post('/api/af/ad_pay/update-single', (req, res) => {
  const { id, lec_num, lec_pay, lec_use_cost, lec_pay_item, lec_pay_book, add_date } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, message: '학생 식별자가 없습니다.' });
  }

  const student = applicantDb.find(a => String(a.id) === String(id));
  if (!student) {
    return res.status(404).json({ success: false, message: '해당 학생 정보를 찾을 수 없습니다.' });
  }

  const pay = parseInt(lec_pay) || 0;
  const useCost = parseInt(lec_use_cost) || 0;
  const book = parseInt(lec_pay_book) || 0;
  const item = parseInt(lec_pay_item) || 0;

  if (useCost > pay) {
    return res.status(400).json({ success: false, message: '수용비는 수강료보다 클 수 없습니다.' });
  }

  student.tuitionFee = pay;
  student.accommodationFee = useCost;
  student.teacherFee = pay - useCost;
  student.bookFee = book;
  student.materialFee = item;
  student.addDate = add_date || '';
  student.totalFee = pay + book + item;

  return res.json({
    success: true,
    message: '수정되었습니다.',
    student
  });
});

// POST /api/af/ad_pay/update-bulk
app.post('/api/af/ad_pay/update-bulk', (req, res) => {
  const { lec_num, students } = req.body;
  if (!students || !Array.isArray(students)) {
    return res.status(400).json({ success: false, message: '업데이트할 학생 데이터가 올바르지 않습니다.' });
  }

  let updatedCount = 0;
  for (const st of students) {
    const target = applicantDb.find(a => String(a.id) === String(st.id));
    if (target) {
      const pay = parseInt(st.lec_pay) || 0;
      const useCost = parseInt(st.lec_use_cost) || 0;
      const book = parseInt(st.lec_pay_book) || 0;
      const item = parseInt(st.lec_pay_item) || 0;

      target.tuitionFee = pay;
      target.accommodationFee = useCost;
      target.teacherFee = Math.max(0, pay - useCost);
      target.bookFee = book;
      target.materialFee = item;
      target.addDate = st.add_date || '';
      target.totalFee = pay + book + item;
      updatedCount++;
    }
  }

  return res.json({
    success: true,
    updatedCount,
    message: '수정되었습니다.'
  });
});
`;

let serverContent = fs.readFileSync('course_site/server.js', 'utf8');

// Replace applicantDb declaration up to availableCoursesList
const startIdx = serverContent.indexOf('let applicantDb = [');
const endIdx = serverContent.indexOf('let availableCoursesList = [');

if (startIdx !== -1 && endIdx !== -1) {
  serverContent = serverContent.substring(0, startIdx) + newApplicantDbCode + '\n' + serverContent.substring(endIdx);
  console.log('Replaced applicantDb');
} else {
  console.log('Indices not found for applicantDb');
}

// Insert new routes right after app.get(['/af/ad_app/lists/sn/3267'
const routeInsertIdx = serverContent.indexOf("app.get(['/af/ad_app/lists/sn/3267'");
if (routeInsertIdx !== -1) {
  serverContent = serverContent.substring(0, routeInsertIdx) + newRoutesCode + '\n' + serverContent.substring(routeInsertIdx);
  console.log('Inserted new routes and APIs');
} else {
  console.log('Indices not found for routes');
}

fs.writeFileSync('course_site/server.js', serverContent, 'utf8');
console.log('Successfully updated course_site/server.js');
