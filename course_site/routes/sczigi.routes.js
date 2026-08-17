const express = require('express');
const router = express.Router();

// Mock store for sczigi in memory
let services = [
  {
    id: 'srv_3267_1',
    serviceName: '늘봄학교',
    serviceUrl: 'https://www.dbdbschool.kr/go/ai/0hc5dFL',
    period: '2025-05-09 ~ 2027-02-28',
    status: 'active',
  },
];

let teachers = [
  {
    id: 't_3',
    seq: 3,
    userId: '김혜련',
    name: '김혜련',
    phone: '010-2494-1479',
    note: '관리자',
    homeroom: '',
    position: '늘봄실무사',
    lastLogin: '2026-08-17 11:32:00',
    tempPassword: 'Y',
    identityVerified: 'Y',
    twoFactorAuth: 'N',
    termsAgreedDate: '-',
    status: '사용',
  },
  {
    id: 't_2',
    seq: 2,
    userId: '박진수',
    name: '박진수',
    phone: '010-9876-5432',
    note: '실장',
    homeroom: '',
    position: '늘봄지원실장',
    lastLogin: '2025-09-11 14:29:19',
    tempPassword: 'N',
    identityVerified: 'Y',
    twoFactorAuth: 'Y',
    termsAgreedDate: '2025-09-11',
    status: '사용',
  },
  {
    id: 't_1',
    seq: 1,
    userId: '풍향초',
    name: '풍향초',
    phone: '062-609-1182',
    note: '',
    homeroom: '1학년 1반',
    position: '교직원',
    lastLogin: '2026-04-24 11:40:16',
    tempPassword: 'N',
    identityVerified: 'N',
    twoFactorAuth: 'N',
    termsAgreedDate: '2026-04-24',
    status: '사용',
  },
];

let teacherFieldConfig = {
  phone: true,
  position: true,
  birthdate: false,
  neisNumber: true,
};

let positionCodes = [
  { id: 'pos_1', seq: 1, use: true, codeName: '교장', displayOrder: 1 },
  { id: 'pos_2', seq: 2, use: true, codeName: '교감', displayOrder: 2 },
  { id: 'pos_3', seq: 3, use: true, codeName: '늘봄지원실장', displayOrder: 3 },
  { id: 'pos_4', seq: 4, use: true, codeName: '늘봄실무사', displayOrder: 4 },
  { id: 'pos_5', seq: 5, use: true, codeName: '교직원', displayOrder: 5 },
  { id: 'pos_6', seq: 6, use: true, codeName: '방과후강사', displayOrder: 6 },
];

let students = [
  {
    id: 's_1',
    seq: 1,
    grade: 1,
    classNum: 1,
    studentNum: 1,
    name: '김민준',
    gender: '남',
    phone: '010-1234-5678',
    note: '보호자: 김철수 (010-1111-2222)',
    previousAcademicRecord: '신입학',
    lastModified: '2026-03-02 09:00:00',
    lastLogin: '2026-08-16 17:20:10',
    tempPassword: 'N',
    termsAgreedDate: '2026-03-02',
    status: '사용',
  },
  {
    id: 's_2',
    seq: 2,
    grade: 1,
    classNum: 1,
    studentNum: 2,
    name: '이서아',
    gender: '여',
    phone: '010-2345-6789',
    note: '보호자: 이미영 (010-3333-4444)',
    previousAcademicRecord: '신입학',
    lastModified: '2026-03-02 09:10:00',
    lastLogin: '2026-08-15 14:12:30',
    tempPassword: 'N',
    termsAgreedDate: '2026-03-02',
    status: '사용',
  },
];

let studentBasicConfig = {
  multiChildLoginShare: true,
  maxGrade: 6,
  maxClass: 10,
  maxStudentNum: 35,
};

let studentFieldConfig = {
  studentPhone: { display: true, required: false },
  guardianName: { display: true, required: true },
  guardianPhone: { display: true, required: true },
  gender: { display: true, required: true },
};

let studentCourseCodes = [
  { id: 'sc_1', seq: 1, use: true, codeName: '일반과정', displayOrder: 1 },
  { id: 'sc_2', seq: 2, use: true, codeName: '특수교육대상', displayOrder: 2 },
  { id: 'sc_3', seq: 3, use: true, codeName: '늘봄연계과정', displayOrder: 3 },
];

let smsSenders = [
  {
    id: 'sms_1',
    seq: 1,
    senderNumber: '062-609-1182',
    ownerName: '광주풍향초등학교',
    authMethod: '통신사 증명서',
    category: '대표번호',
    note: '행정실 대표 발신번호',
    status: '승인완료',
    approvedDate: '2025-05-10',
  },
];

let smsChargeRequests = [
  {
    id: 'req_1',
    seq: 1,
    amount: 100000,
    count: 5000,
    approvalStatus: '품의완료',
    status: '충전완료',
    requestDate: '2026-05-10',
  },
];

let smsDailyReports = [
  {
    id: 'rep_1',
    seq: 1,
    sendDate: '2026-08-16',
    sms: { success: 120, fail: 2, total: 122 },
    lms: { success: 45, fail: 0, total: 45 },
    deduction: { deducted: 165, recharged: 2, total: 167 },
  },
];

let adminAuthPermissions = [
  {
    id: 'auth_1',
    serviceName: '늘봄학교',
    adminId: '김혜련',
    adminName: '김혜련',
    canManageTeachers: true,
    canManageStudents: true,
    canManageSms: true,
  },
];

let privacyLogs = [
  {
    id: 'log_1',
    seq: 1,
    service: '학교관리',
    userId: '김혜련',
    userGroup: '최고관리자',
    ipAddress: '121.134.88.201',
    accessTime: '2026-08-17 13:28:10',
    action: '교직원 목록 및 학생 목록 조회',
  },
];

// Routes - GET
router.get('/sczigi/services', (req, res) => res.json({ success: true, services }));
router.get('/sczigi/teachers', (req, res) => res.json({ success: true, teachers }));
router.get('/sczigi/teacher/fields', (req, res) => res.json({ success: true, teacherFieldConfig }));
router.get('/sczigi/teacher/levels', (req, res) => res.json({ success: true, positionCodes }));
router.get('/sczigi/students', (req, res) => res.json({ success: true, students }));
router.get('/sczigi/student/basic', (req, res) => res.json({ success: true, studentBasicConfig }));
router.get('/sczigi/student/fields', (req, res) => res.json({ success: true, studentFieldConfig }));
router.get('/sczigi/student/courses', (req, res) => res.json({ success: true, studentCourseCodes }));
router.get('/sczigi/sms/senders', (req, res) => res.json({ success: true, smsSenders }));
router.get('/sczigi/sms/charges', (req, res) => res.json({ success: true, smsChargeRequests }));
router.get('/sczigi/sms/reports', (req, res) => res.json({ success: true, smsDailyReports }));
router.get('/sczigi/auth/permissions', (req, res) => res.json({ success: true, adminAuthPermissions }));
router.get('/sczigi/privacy/logs', (req, res) => res.json({ success: true, privacyLogs }));

// Routes - Teacher CRUD
router.post('/sczigi/teachers', (req, res) => {
  const newSeq = teachers.length > 0 ? Math.max(...teachers.map((t) => t.seq)) + 1 : 1;
  const newTeacher = {
    id: `t_${Date.now()}`,
    seq: newSeq,
    userId: req.body.userId || 'teacher_' + newSeq,
    name: req.body.name || '신규교직원',
    phone: req.body.phone || '010-0000-0000',
    note: req.body.note || '',
    homeroom: req.body.homeroom || '',
    position: req.body.position || '교직원',
    lastLogin: '-',
    tempPassword: 'Y',
    identityVerified: 'N',
    twoFactorAuth: 'N',
    termsAgreedDate: '-',
    status: req.body.status || '사용',
  };
  teachers.unshift(newTeacher);
  return res.json({ success: true, teacher: newTeacher });
});

router.put('/sczigi/teachers/:id', (req, res) => {
  const { id } = req.params;
  const teacher = teachers.find((t) => t.id === id);
  if (!teacher) return res.status(404).json({ success: false, message: '교직원을 찾을 수 없습니다.' });
  Object.assign(teacher, req.body);
  return res.json({ success: true, teacher });
});

router.delete('/sczigi/teachers/:id', (req, res) => {
  const { id } = req.params;
  teachers = teachers.filter((t) => t.id !== id);
  return res.json({ success: true, message: '삭제되었습니다.' });
});

// Routes - Student CRUD
router.post('/sczigi/students', (req, res) => {
  const newSeq = students.length > 0 ? Math.max(...students.map((s) => s.seq)) + 1 : 1;
  const newStudent = {
    id: `s_${Date.now()}`,
    seq: newSeq,
    grade: Number(req.body.grade) || 1,
    classNum: Number(req.body.classNum) || 1,
    studentNum: Number(req.body.studentNum) || 1,
    name: req.body.name || '신규학생',
    gender: req.body.gender || '남',
    phone: req.body.phone || '',
    note: req.body.note || '',
    previousAcademicRecord: req.body.previousAcademicRecord || '신입학',
    lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
    lastLogin: '-',
    tempPassword: 'Y',
    termsAgreedDate: '-',
    status: req.body.status || '사용',
  };
  students.unshift(newStudent);
  return res.json({ success: true, student: newStudent });
});

router.put('/sczigi/students/:id', (req, res) => {
  const { id } = req.params;
  const student = students.find((s) => s.id === id);
  if (!student) return res.status(404).json({ success: false, message: '학생을 찾을 수 없습니다.' });
  Object.assign(student, req.body, { lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19) });
  return res.json({ success: true, student });
});

router.delete('/sczigi/students/:id', (req, res) => {
  const { id } = req.params;
  students = students.filter((s) => s.id !== id);
  return res.json({ success: true, message: '삭제되었습니다.' });
});

// Routes - SMS Sender
router.post('/sczigi/sms/senders', (req, res) => {
  const newSeq = smsSenders.length > 0 ? Math.max(...smsSenders.map((s) => s.seq)) + 1 : 1;
  const newSender = {
    id: `sms_${Date.now()}`,
    seq: newSeq,
    senderNumber: req.body.senderNumber,
    ownerName: req.body.ownerName || '광주풍향초등학교',
    authMethod: req.body.authMethod || '통신사 증명서',
    category: req.body.category || '대표번호',
    note: req.body.note || '',
    status: '승인대기',
    approvedDate: '-',
  };
  smsSenders.push(newSender);
  return res.json({ success: true, sender: newSender });
});

router.delete('/sczigi/sms/senders/:id', (req, res) => {
  const { id } = req.params;
  smsSenders = smsSenders.filter((s) => s.id !== id);
  return res.json({ success: true, message: '삭제되었습니다.' });
});

module.exports = router;

