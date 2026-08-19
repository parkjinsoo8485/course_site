require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const db = require('./utils/db');
const sczigiRoutes = require('./routes/sczigi.routes');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'neulbom_saas_super_secret_jwt_key_2026';

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tuition Pay Entry Page (/af/ad_pay/edit/...)
app.get(/^\/af\/ad_pay\/edit/, (req, res) => {
  return res.sendFile(path.join(__dirname, 'af', 'ad_pay', 'edit', 'sn', '3267', 'index.html'));
});

// GET /api/af/ad_pay/data/sn/3267
app.get('/api/af/ad_pay/data/sn/:sn', (req, res) => {
  const { sld, sln } = req.query;
  const currentSld = sld || '10';
  const currentSln = sln || '1552375';

  let students = applicantDb.filter(a => String(a.courseId) === String(currentSln));
  if (students.length === 0) {
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
  const { applicantId, tuitionFee, accommodationFee, bookFee, materialFee } = req.body;
  const applicant = applicantDb.find(a => a.id === applicantId);
  if (!applicant) {
    return res.status(404).json({ success: false, message: '학생을 찾을 수 없습니다.' });
  }

  applicant.tuitionFee = Number(tuitionFee) || 0;
  applicant.accommodationFee = Number(accommodationFee) || 0;
  applicant.bookFee = Number(bookFee) || 0;
  applicant.materialFee = Number(materialFee) || 0;
  applicant.totalFee = applicant.tuitionFee + applicant.accommodationFee + applicant.bookFee + applicant.materialFee;
  applicant.teacherFee = Math.floor(applicant.tuitionFee * 0.7);

  return res.json({ success: true, applicant });
});

// POST /api/af/ad_pay/update-bulk
app.post('/api/af/ad_pay/update-bulk', (req, res) => {
  const { lec_num, students } = req.body;
  
  if (!students || !Array.isArray(students)) {
    return res.status(400).json({ success: false, message: '잘못된 요청입니다.' });
  }

  students.forEach(updateData => {
    const applicant = applicantDb.find(a => a.id === updateData.id);
    if (applicant) {
      applicant.tuitionFee = Number(updateData.tuitionFee) || 0;
      applicant.accommodationFee = Number(updateData.accommodationFee) || 0;
      applicant.bookFee = Number(updateData.bookFee) || 0;
      applicant.materialFee = Number(updateData.materialFee) || 0;
      applicant.totalFee = applicant.tuitionFee + applicant.accommodationFee + applicant.bookFee + applicant.materialFee;
      applicant.teacherFee = Math.floor(applicant.tuitionFee * 0.7);
    }
  });

  return res.json({ success: true, message: '일괄 저장되었습니다.' });
});

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false // Allow loading inline scripts & cdn resources for smooth developer demo
}));
app.use(express.json());

app.use('/api', sczigiRoutes);

// Auth Limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: '요청 시도가 너무 많습니다. 15분 후 다시 시도해 주세요.' }
});

// JWT Verification Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: '인증 토큰이 없습니다. 다시 로그인해 주세요.' });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(403).json({ success: false, message: '유효하지 않은 토큰이거나 만료되었습니다.' });
    }
    req.user = userPayload;
    next();
  });
};


app.get(['/login', '/login/', '/af/login/login/sn/3267', '/af/login/login/sn/3267/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'af', 'ad_lec', 'lists', 'sn', '3267', 'index.html'));
});

// ==================== SUPER ADMIN (MASTER) ROUTES ====================
app.get(['/superadmin', '/superadmin/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'superadmin', 'index.html'));
});
app.get(['/superadmin/schools', '/superadmin/schools/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'superadmin', 'schools.html'));
});
app.get(['/superadmin/qna', '/superadmin/qna/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'superadmin', 'qna.html'));
});
app.get(['/admin', '/admin/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});
app.get(['/admin/qanda', '/admin/qanda/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'qanda', 'index.html'));
});
app.get(['/admin/qanda/view', '/admin/qanda/view/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'qanda', 'view.html'));
});
app.get(['/admin/schools', '/admin/schools/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'schools', 'index.html'));
});

// ==================== AUTH APIs ====================

// POST /api/auth/login
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: '아이디와 비밀번호를 모두 입력해주세요.' });
    }

    const user = db.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ success: false, message: '존재하지 않는 사용자이거나 비밀번호가 틀립니다.' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, message: '존재하지 않는 사용자이거나 비밀번호가 틀립니다.' });
    }

    const school = db.findSchoolById(user.schoolId);

    // Calculate days remaining
    let daysLeft = 0;
    if (school && school.expireDate) {
      const diffMs = new Date(school.expireDate) - new Date();
      daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }

    const payload = {
      userId: user.id,
      schoolId: user.schoolId,
      schoolName: school ? school.name : '미소속 학교',
      username: user.username,
      name: user.name,
      role: user.role,
      plan: school ? school.plan : 'free'
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        schoolName: school ? school.name : '',
        plan: school ? school.plan : 'free',
        daysLeft: daysLeft > 0 ? daysLeft : 0,
        isExpired: daysLeft <= 0
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ success: false, message: '서버 내부 오류가 발생했습니다.' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.findUserById(req.user.userId);
  if (!user) return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });

  const school = db.findSchoolById(user.schoolId);
  let daysLeft = 0;
  if (school && school.expireDate) {
    const diffMs = new Date(school.expireDate) - new Date();
    daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      schoolId: school ? school.id : null,
      schoolName: school ? school.name : '',
      schoolCode: school ? school.code : '',
      plan: school ? school.plan : 'basic',
      daysLeft: daysLeft > 0 ? daysLeft : 0,
      isExpired: daysLeft <= 0
    }
  });
});

// GET /api/schools/verify-code
app.get('/api/schools/verify-code', (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ success: false, message: '학교 코드를 입력하세요.' });

  const school = db.findSchoolByCode(code);
  if (!school) {
    return res.status(404).json({ success: false, message: '해당 학교 코드를 가진 등록된 학교가 없습니다.' });
  }

  return res.json({
    success: true,
    school: {
      id: school.id,
      name: school.name,
      plan: school.plan,
      status: school.status
    }
  });
});

// GET /api/schools/all (Super Admin SaaS Multi-Tenant School List)
let superAdminSchoolsList = [
  {
    id: '3267',
    code: 'PUNGHYANG3267',
    name: '광주풍향초등학교',
    slug: 'punghyang',
    plan: 'Premium',
    status: '정상운영',
    expireDate: '2026-12-31',
    adminName: '김혜련 (늘봄실무사)',
    adminEmail: 'khh147979@naver.com',
    phone: '010-2494-1479',
    courses: 18,
    students: 450,
    createdAt: '2025-03-01'
  },
  {
    id: '1001',
    code: 'SEOUL1001',
    name: '서울초등학교',
    slug: 'seoul',
    plan: 'Standard',
    status: '정상운영',
    expireDate: '2026-11-30',
    adminName: '박상현',
    adminEmail: 'park1001@seoul.es.kr',
    phone: '010-9876-5432',
    courses: 14,
    students: 320,
    createdAt: '2025-04-15'
  },
  {
    id: '1002',
    code: 'BUSAN1002',
    name: '부산초등학교',
    slug: 'busan',
    plan: 'Standard',
    status: '정상운영',
    expireDate: '2026-10-15',
    adminName: '이동현',
    adminEmail: 'lee1002@busan.es.kr',
    phone: '010-5555-1234',
    courses: 12,
    students: 280,
    createdAt: '2025-05-20'
  },
  {
    id: '1003',
    code: 'DAEGU1003',
    name: '대구초등학교',
    slug: 'daegu',
    plan: 'Basic',
    status: '정상운영',
    expireDate: '2026-09-30',
    adminName: '정수진',
    adminEmail: 'jung1003@daegu.es.kr',
    phone: '010-7777-8888',
    courses: 14,
    students: 370,
    createdAt: '2025-06-10'
  }
];

app.get('/api/schools/all', (req, res) => {
  return res.json({ success: true, schools: superAdminSchoolsList });
});

// POST /api/schools/update-plan (Super Admin Plan & Status Update)
app.post('/api/schools/update-plan', (req, res) => {
  const { id, plan, status, expireDate } = req.body;
  const school = superAdminSchoolsList.find(s => s.id === id || s.code === id);
  if (!school) {
    return res.status(404).json({ success: false, message: '학교를 찾을 수 없습니다.' });
  }
  if (plan) school.plan = plan;
  if (status) school.status = status;
  if (expireDate) school.expireDate = expireDate;
  return res.json({ success: true, message: '학교 서비스 설정이 업데이트되었습니다.', school });
});

// POST /api/auth/register-teacher
app.post('/api/auth/register-teacher', authLimiter, async (req, res) => {
  try {
    const { schoolCode, username, password, name, email, phone } = req.body;

    if (!schoolCode || !username || !password || !name || !email) {
      return res.status(400).json({ success: false, message: '필수 정보를 모두 입력해주세요.' });
    }

    const school = db.findSchoolByCode(schoolCode);
    if (!school) {
      return res.status(400).json({ success: false, message: '유효하지 않은 학교 코드입니다.' });
    }

    if (db.findUserByUsername(username)) {
      return res.status(409).json({ success: false, message: '이미 사용중인 아이디입니다.' });
    }

    const newUser = await db.createUser({
      schoolId: school.id,
      username,
      password,
      name,
      email,
      phone,
      role: 'teacher'
    });

    return res.json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      username: newUser.username
    });
  } catch (err) {
    console.error('Teacher Signup Error:', err);
    return res.status(500).json({ success: false, message: '회원가입 중 오류가 발생했습니다.' });
  }
});

// POST /api/auth/register-school (학교 유료 최초 등록 및 구독 플랜)
app.post('/api/auth/register-school', authLimiter, async (req, res) => {
  try {
    const { schoolName, schoolCode, adminUsername, adminPassword, adminName, email, phone, plan } = req.body;

    if (!schoolName || !schoolCode || !adminUsername || !adminPassword || !adminName || !email) {
      return res.status(400).json({ success: false, message: '필수 정보를 모두 입력해주세요.' });
    }

    if (db.findSchoolByCode(schoolCode)) {
      return res.status(409).json({ success: false, message: '이미 존재하는 학교 코드입니다. 다른 코드를 입력해주세요.' });
    }

    if (db.findUserByUsername(adminUsername)) {
      return res.status(409).json({ success: false, message: '이미 사용 중인 관리자 아이디입니다.' });
    }

    // Set expiration 1 year from now
    const expDate = new Date();
    expDate.setFullYear(expDate.getFullYear() + 1);

    const newSchool = db.createSchool({
      code: schoolCode.toUpperCase(),
      name: schoolName,
      plan: plan || 'standard',
      expireDate: expDate.toISOString().split('T')[0]
    });

    const adminUser = await db.createUser({
      schoolId: newSchool.id,
      username: adminUsername,
      password: adminPassword,
      name: adminName,
      email: email,
      phone: phone,
      role: 'school_admin'
    });

    superAdminSchoolsList.push({
      id: String(newSchool.id),
      code: newSchool.code,
      name: newSchool.name,
      slug: newSchool.code.toLowerCase(),
      plan: (plan || 'Standard').charAt(0).toUpperCase() + (plan || 'Standard').slice(1),
      status: '정상운영',
      expireDate: expDate.toISOString().split('T')[0],
      adminName: adminName,
      adminEmail: email,
      phone: phone || '-',
      courses: 0,
      students: 0,
      createdAt: new Date().toISOString().split('T')[0]
    });

    return res.json({
      success: true,
      message: '학교 등록 및 구독 가입이 성공적으로 완료되었습니다!',
      schoolCode: newSchool.code,
      schoolName: newSchool.name
    });
  } catch (err) {
    console.error('School Register Error:', err);
    return res.status(500).json({ success: false, message: '학교 등록 중 오류가 발생했습니다.' });
  }
});

// ==================== COURSE APIs ====================

// GET /api/courses
app.get('/api/courses', authenticateToken, (req, res) => {
  const courses = db.getCoursesBySchool(req.user.schoolId);
  return res.json({ success: true, courses });
});

// POST /api/courses
app.post('/api/courses', authenticateToken, (req, res) => {
  try {
    const { title, category, teacherName, capacity, waitingCapacity, grade, period, schedule, fee } = req.body;

    if (!title || !category || !teacherName) {
      return res.status(400).json({ success: false, message: '강좌명, 구분, 강사명을 입력하세요.' });
    }

    const newCourse = db.createCourse({
      schoolId: req.user.schoolId,
      category,
      title,
      teacherName,
      capacity: parseInt(capacity) || 20,
      waitingCapacity: parseInt(waitingCapacity) || 5,
      grade: grade || '전학년',
      period: period || '2026-03-01~2026-06-30',
      schedule: schedule || '월,수:14:00~14:50',
      fee: parseInt(fee) || 0,
      materialFee: parseInt(req.body.materialFee) || 0,
      autoRenew: req.body.autoRenew || 'Y',
      status: '모집중'
    });

    return res.json({ success: true, course: newCourse, message: '새로운 강좌가 성공적으로 등록되었습니다.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: '강좌 등록 중 오류가 발생했습니다.' });
  }
});

// POST /api/courses/auto-renew (수강 자동 연장)
app.post('/api/courses/auto-renew', authenticateToken, (req, res) => {
  const renewed = db.autoRenewCourses(req.user.schoolId);
  return res.json({ success: true, message: `월별 수강 자동 연장이 완료되었습니다. (총 ${renewed}건 연장)` });
});

// ==================== dbdbschool (/af/ad_lec/lists/sn/[school_id]) CLONE APIs ====================

// Helper to resolve school ID or SN code
const resolveSchoolId = (schoolIdParam) => {
  if (!schoolIdParam || schoolIdParam === '3267' || schoolIdParam === 'default') {
    return 'sch_1';
  }
  const foundByCode = db.findSchoolByCode(schoolIdParam.toUpperCase());
  if (foundByCode) return foundByCode.id;
  const foundById = db.findSchoolById(schoolIdParam);
  if (foundById) return foundById.id;
  return 'sch_1';
};

// GET /api/af/ad_lec/lists/sn/:school_id (강좌 목록 조회)
app.get('/api/af/ad_lec/lists/sn/:school_id', (req, res) => {
  try {
    const schoolId = resolveSchoolId(req.params.school_id);
    const { category, status, keyword } = req.query;

    const lectures = db.getLecturesBySchool(schoolId, { category, status, keyword });
    const school = db.findSchoolById(schoolId);

    return res.json({
      success: true,
      sn: req.params.school_id,
      school: school ? { id: school.id, name: school.name, code: school.code } : { id: 'sch_1', name: '운천초등학교', code: 'UNCHON2025' },
      totalCount: lectures.length,
      lectures
    });
  } catch (err) {
    console.error('dbdbschool API Error:', err);
    return res.status(500).json({ success: false, message: '강좌 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_lec/create (강좌 신규 등록)
app.post('/api/af/ad_lec/create', (req, res) => {
  try {
    const { schoolId, category, title, instructor, targetGrade, capacity, waitingCapacity, tuitionFee, materialFee, dayOfWeek, scheduleTime, location } = req.body;
    const targetSchoolId = resolveSchoolId(schoolId);

    if (!title || !instructor) {
      return res.status(400).json({ success: false, message: '강좌명과 강사명은 필수 항목입니다.' });
    }

    const newCourse = db.createCourse({
      schoolId: targetSchoolId,
      category: category || '2026년 1분기',
      title,
      instructor,
      teacherName: instructor,
      targetGrade: targetGrade || '전학년',
      capacity: parseInt(capacity) || 20,
      waitingCapacity: parseInt(waitingCapacity) || 5,
      tuitionFee: parseInt(tuitionFee) || 0,
      fee: parseInt(tuitionFee) || 0,
      materialFee: parseInt(materialFee) || 0,
      dayOfWeek: dayOfWeek || '월',
      scheduleTime: scheduleTime || '14:00~14:50',
      schedule: `${dayOfWeek || '월'}:${scheduleTime || '14:00~14:50'}`,
      location: location || '방과후 교실',
      status: 'OUTPUT'
    });

    return res.json({ success: true, lecture: newCourse, message: `'${title}' 강좌가 성공적으로 등록되었습니다.` });
  } catch (err) {
    console.error('Create Lecture Error:', err);
    return res.status(500).json({ success: false, message: '강좌 등록 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_lec/batch-copy (이전 분기/월 강좌 및 수강료 일괄 복사)
app.post('/api/af/ad_lec/batch-copy', (req, res) => {
  try {
    const { schoolId, sourceCategory, targetCategory, copyFees } = req.body;
    const targetSchoolId = resolveSchoolId(schoolId);

    if (!sourceCategory || !targetCategory) {
      return res.status(400).json({ success: false, message: '원본 구분과 대상 구분을 모두 입력하세요.' });
    }

    const copied = db.batchCopyLectures(targetSchoolId, sourceCategory, targetCategory, copyFees !== false);
    return res.json({
      success: true,
      copiedCount: copied.length,
      message: `'${sourceCategory}'의 ${copied.length}개 강좌가 '${targetCategory}'(으)로 일괄 복사되었습니다.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: '일괄 복사 중 오류가 발생했습니다.' });
  }
});

// PATCH /api/af/ad_lec/status (강좌 상태 일괄 변경: OUTPUT / CLOSED / WAITING)
app.patch('/api/af/ad_lec/status', (req, res) => {
  try {
    const { schoolId, courseIds, status } = req.body;
    const targetSchoolId = resolveSchoolId(schoolId);

    if (!courseIds || !Array.isArray(courseIds) || !status) {
      return res.status(400).json({ success: false, message: '변경할 강좌 ID 목록과 상태 값을 전달하세요.' });
    }

    const updatedCount = db.updateLectureStatusBatch(targetSchoolId, courseIds, status);
    return res.json({
      success: true,
      updatedCount,
      message: `${updatedCount}개 강좌의 상태가 '${status}'(으)로 일괄 변경되었습니다.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: '강좌 상태 변경 중 오류가 발생했습니다.' });
  }
});

// PATCH /api/af/ad_lec/instructor-close (강사 마감 여부 토글)
app.patch('/api/af/ad_lec/instructor-close', (req, res) => {
  try {
    const { schoolId, courseId } = req.body;
    const targetSchoolId = resolveSchoolId(schoolId);

    const result = db.toggleInstructorClosed(targetSchoolId, courseId);
    if (!result) return res.status(404).json({ success: false, message: '해당 강좌를 찾을 수 없습니다.' });

    return res.json({
      success: true,
      instructorClosed: result.instructorClosed,
      message: `강사 마감 상태가 변경되었습니다.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: '강사 마감 상태 처리 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_lec/copy (3.2 단일 강좌 복사)
app.post('/api/af/ad_lec/copy', (req, res) => {
  try {
    const { schoolId, courseId, overrides } = req.body;
    const targetSchoolId = resolveSchoolId(schoolId);

    if (!courseId) {
      return res.status(400).json({ success: false, message: '복사할 강좌 ID를 전달하세요.' });
    }

    const copied = db.copyCourse(targetSchoolId, courseId, overrides || {});
    if (!copied) return res.status(404).json({ success: false, message: '원본 강좌를 찾을 수 없습니다.' });

    return res.json({
      success: true,
      course: copied,
      message: `'${copied.title}' 강좌가 성공적으로 복사 생성되었습니다.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: '강좌 복사 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_lec/batch-upload (3.3 23개 컬럼 강좌 일괄등록 파서)
app.post('/api/af/ad_lec/batch-upload', (req, res) => {
  try {
    const { schoolId, rows } = req.body;
    const targetSchoolId = resolveSchoolId(schoolId);

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, message: '업로드할 강좌 데이터 행이 없습니다.' });
    }

    const result = db.batchUploadCourses(targetSchoolId, rows);
    return res.json({
      success: true,
      count: result.count,
      courses: result.courses,
      message: `총 ${result.count}개 강좌가 성공적으로 일괄 등록되었습니다.`
    });
  } catch (err) {
    console.error('Batch upload error:', err);
    return res.status(500).json({ success: false, message: '강좌 일괄 등록 중 오류가 발생했습니다.' });
  }
});

// GET /api/af/ad_lec/stats (3.4 강좌 통계)
app.get('/api/af/ad_lec/stats', (req, res) => {
  try {
    const schoolId = resolveSchoolId(req.query.schoolId);
    const stats = db.getCourseStatistics(schoolId);
    return res.json({ success: true, stats });
  } catch (err) {
    return res.status(500).json({ success: false, message: '강좌 통계를 불러오는 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_lec/apply-facility-fee (3.9 강좌 수용비 신청자 일괄 적용)
app.post('/api/af/ad_lec/apply-facility-fee', (req, res) => {
  try {
    const { schoolId, category } = req.body;
    const targetSchoolId = resolveSchoolId(schoolId);

    const updatedCount = db.applyFacilityFeeToApplicants(targetSchoolId, category);
    return res.json({
      success: true,
      updatedCount,
      message: `총 ${updatedCount}명의 신청자에게 강좌 수용비가 성공적으로 일괄 적용되었습니다.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: '수용비 일괄 적용 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_lec/batch-teacher-lock (2.8 & 3.4 강사마감 일괄 설정)
app.post('/api/af/ad_lec/batch-teacher-lock', (req, res) => {
  try {
    const { schoolId, courseIds, lockState } = req.body;
    const targetSchoolId = resolveSchoolId(schoolId);

    const updatedCount = db.toggleTeacherLockBatch(targetSchoolId, courseIds || 'ALL', lockState);
    return res.json({
      success: true,
      updatedCount,
      message: `${updatedCount}개 강좌의 강사 마감 상태가 '${lockState ? '마감(Y)' : '해제(N)'}'(으)로 일괄 변경되었습니다.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: '강사 마감 일괄 처리 중 오류가 발생했습니다.' });
  }
});

// GET /api/af/ad_lec/export-neis (3.11 나이스 연계 강사기준 엑셀 데이터)
app.get('/api/af/ad_lec/export-neis', (req, res) => {
  try {
    const schoolId = resolveSchoolId(req.query.schoolId);
    const category = req.query.category;
    const rows = db.getNeisExportData(schoolId, category);
    return res.json({ success: true, count: rows.length, rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: '나이스 데이터 추출 중 오류가 발생했습니다.' });
  }
});

// GET /api/af/ad_lec/export-edufine (3.12 에듀파인 수납 집계 엑셀 데이터)
app.get('/api/af/ad_lec/export-edufine', (req, res) => {
  try {
    const schoolId = resolveSchoolId(req.query.schoolId);
    const category = req.query.category;
    const rows = db.getEdufineExportData(schoolId, category);
    return res.json({ success: true, count: rows.length, rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: '에듀파인 데이터 추출 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_lec/lottery (추첨 실행)
app.post('/api/af/ad_lec/lottery', (req, res) => {
  try {
    const { schoolId, courseId } = req.body;
    const targetSchoolId = resolveSchoolId(schoolId);

    const result = db.executeLottery(targetSchoolId, courseId);
    if (result.error) return res.status(400).json({ success: false, message: result.error });

    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, message: '추첨 실행 중 오류가 발생했습니다.' });
  }
});

// POST /api/courses/check-conflict (시간표 수강신청 중복 감지 API)
app.post('/api/courses/check-conflict', (req, res) => {
  try {
    const { studentName, parentPhone, dayOfWeek, scheduleTime, schoolId } = req.body;
    const targetSchoolId = resolveSchoolId(schoolId);

    const cleanPhone = (parentPhone || '').replace(/[^0-9]/g, '');
    const applicants = db.getApplicantsBySchool(targetSchoolId).filter(a => {
      const p = (a.parentPhone || '').replace(/[^0-9]/g, '');
      return a.studentName === studentName && p === cleanPhone && a.status === '승인';
    });

    let conflictFound = false;
    let conflictCourseTitle = '';

    applicants.forEach(app => {
      const course = db.getCoursesBySchool(targetSchoolId).find(c => c.id === app.courseId);
      if (course && course.schedule) {
        const [cDays] = course.schedule.split(':');
        if (dayOfWeek && cDays && dayOfWeek.split(',').some(d => cDays.includes(d))) {
          conflictFound = true;
          conflictCourseTitle = course.title;
        }
      }
    });

    if (conflictFound) {
      return res.json({
        hasConflict: true,
        message: `시간표 중복 경고: 이미 동일 요일에 '${conflictCourseTitle}' 강좌가 신청되어 있습니다.`
      });
    }

    return res.json({ hasConflict: false, message: '수강 가능한 시간대입니다.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: '시간표 검사 중 오류가 발생했습니다.' });
  }
});

// POST /api/refunds/calculate (일할/주할 분할 환불 금액 계산 API)
app.post('/api/refunds/calculate', (req, res) => {
  try {
    const { tuitionFee, totalDays, attendedDays } = req.body;
    const refundAmount = db.calculateRefundAmount(tuitionFee, totalDays, attendedDays);
    return res.json({
      success: true,
      tuitionFee: parseInt(tuitionFee) || 0,
      totalDays: parseInt(totalDays) || 20,
      attendedDays: parseInt(attendedDays) || 0,
      refundAmount,
      message: `전체 ${totalDays}일 중 ${attendedDays}일 수강 후 예상 환불액: ${refundAmount.toLocaleString()}원`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: '환불 금액 계산 중 오류가 발생했습니다.' });
  }
});
// GET /api/af/ad_stu/lists/sn/:school_id (수강 신청자 명단)
app.get('/api/af/ad_stu/lists/sn/:school_id', (req, res) => {
  const schoolId = resolveSchoolId(req.params.school_id);
  const applicants = db.getApplicantsBySchool(schoolId);
  const waitlist = db.data.waitlist ? db.data.waitlist.filter(w => w.schoolId === schoolId) : [];
  return res.json({ success: true, applicants, waitlist });
});

// PATCH /api/af/ad_stu/approval (수강 승인 / 강제 취소)
app.patch('/api/af/ad_stu/approval', (req, res) => {
  const { schoolId, applicantId, status } = req.body;
  const targetSchoolId = resolveSchoolId(schoolId);
  const updated = db.updateApplicantStatus(targetSchoolId, applicantId, status || '승인');
  if (!updated) return res.status(404).json({ success: false, message: '신청 내역을 찾을 수 없습니다.' });
  return res.json({ success: true, applicant: updated, message: `수강 상태가 '${status}'(으)로 변경되었습니다.` });
});

// POST /api/af/ad_stu/transfer (학생 학적 일괄 이관)
app.post('/api/af/ad_stu/transfer', (req, res) => {
  const { schoolId, fromGrade, toGrade } = req.body;
  const targetSchoolId = resolveSchoolId(schoolId);
  const count = db.transferGradeClass(targetSchoolId, fromGrade || '1학년', toGrade || '2학년');
  return res.json({ success: true, transferredCount: count, message: `${count}명의 학생 학적이 '${toGrade}'(으)로 이관되었습니다.` });
});

// GET /api/af/ad_sms/templates (알림톡 템플릿 목록)
app.get('/api/af/ad_sms/templates', (req, res) => {
  const templates = db.getSmsTemplates();
  return res.json({ success: true, templates });
});

// POST /api/af/ad_sms/send (카카오 알림톡 / SMS 단체 발송)
app.post('/api/af/ad_sms/send', (req, res) => {
  const { schoolId, recipientCount, templateId, message } = req.body;
  const targetSchoolId = resolveSchoolId(schoolId);
  const log = db.sendBulkSms(targetSchoolId, { recipientCount, templateId, message });
  return res.json({ success: true, log, message: `${log.recipientCount}명에게 카카오 알림톡 발송이 완료되었습니다.` });
});

// GET /api/af/ad_sms/history/sn/:school_id (발송 이력)
app.get('/api/af/ad_sms/history/sn/:school_id', (req, res) => {
  const schoolId = resolveSchoolId(req.params.school_id);
  const logs = db.getSmsHistory(schoolId);
  return res.json({ success: true, logs });
});

// PATCH /api/af/ad_safety/absence/approve (결석/조퇴 승인 처리)
app.patch('/api/af/ad_safety/absence/approve', (req, res) => {
  const { id, status } = req.body;
  const updated = db.approveAbsenceRequest(id, status || '승인완료');
  if (!updated) return res.status(404).json({ success: false, message: '결석 신청건을 찾을 수 없습니다.' });
  return res.json({ success: true, absence: updated, message: '결석/조퇴 신청이 승인 처리되었습니다.' });
});

// GET /api/af/ad_faq/main (FAQ 및 매뉴얼 가이드 목록)
app.get('/api/af/ad_faq/main', (req, res) => {
  const faqs = db.getFaqList();
  return res.json({ success: true, faqs });
});

// GET /api/settings/basic (기본설정 - 매뉴얼 2.7)
app.get('/api/settings/basic', (req, res) => {
  const settings = db.getBasicSettings();
  return res.json({ success: true, settings });
});

// POST /api/settings/basic (기본설정 저장)
app.post('/api/settings/basic', (req, res) => {
  const settings = db.updateBasicSettings(req.body);
  return res.json({ success: true, settings, message: '기본 설정이 성공적으로 저장되었습니다.' });
});

// GET /api/settings/instructor-permissions (강사권한 - 매뉴얼 2.8)
app.get('/api/settings/instructor-permissions', (req, res) => {
  const permissions = db.getInstructorPermissions();
  return res.json({ success: true, permissions });
});

// POST /api/settings/instructor-permissions (강사권한 저장)
app.post('/api/settings/instructor-permissions', (req, res) => {
  const permissions = db.updateInstructorPermissions(req.body);
  return res.json({ success: true, permissions, message: '강사 권한 옵션이 저극 반영되었습니다.' });
});

// GET /api/settings/attendance-options (출석부옵션 - 매뉴얼 2.9)
app.get('/api/settings/attendance-options', (req, res) => {
  const options = db.getAttendanceOptions();
  return res.json({ success: true, options });
});

// POST /api/settings/attendance-options (출석부옵션 저장)
app.post('/api/settings/attendance-options', (req, res) => {
  const options = db.updateAttendanceOptions(req.body);
  return res.json({ success: true, options, message: '출석부 설정이 저장되었습니다.' });
});




// ==================== PARENT PORTAL APIs (공공/학부모 전용) ====================

// GET /api/parent/courses?schoolCode=UNCHON2025
app.get('/api/parent/courses', (req, res) => {
  const schoolCode = (req.query.schoolCode || 'UNCHON2025').trim().toUpperCase();
  const school = db.findSchoolByCode(schoolCode);
  if (!school) return res.status(404).json({ success: false, message: '학교를 찾을 수 없습니다.' });

  const courses = db.getCoursesBySchool(school.id);
  return res.json({ success: true, schoolName: school.name, schoolId: school.id, courses });
});

// GET /api/parent/lookup?phone=010-1234-5678&schoolCode=UNCHON2025
app.get('/api/parent/lookup', (req, res) => {
  const { phone, schoolCode } = req.query;
  if (!phone) return res.status(400).json({ success: false, message: '보호자 연락처를 입력하세요.' });

  const school = db.findSchoolByCode((schoolCode || 'UNCHON2025').toUpperCase());
  const schoolId = school ? school.id : null;

  const data = db.getApplicantsByParentPhone(phone, schoolId);
  return res.json({ success: true, ...data });
});

// POST /api/parent/apply (시간표 겹침 방지 검증 포함 수강신청)
app.post('/api/parent/apply', (req, res) => {
  const { schoolCode, studentName, gradeClass, parentPhone, courseId, subsidyType } = req.body;
  if (!studentName || !parentPhone || !courseId) {
    return res.status(400).json({ success: false, message: '학생명, 연락처, 강좌를 모두 입력하세요.' });
  }

  const school = db.findSchoolByCode((schoolCode || 'UNCHON2025').toUpperCase());
  if (!school) return res.status(404).json({ success: false, message: '학교 코드가 유효하지 않습니다.' });

  const result = db.applyCourseParent(school.id, {
    studentName,
    gradeClass,
    parentPhone,
    courseId,
    subsidyType
  });

  if (result.error) {
    return res.status(400).json({ success: false, message: result.error });
  }

  return res.json(result);
});

// POST /api/parent/cancel (학부모 원클릭 수강/대기 취소)
app.post('/api/parent/cancel', (req, res) => {
  const { applicantId, waitlistId, parentPhone } = req.body;
  if (!parentPhone) {
    return res.status(400).json({ success: false, message: '보호자 연락처가 필요합니다.' });
  }

  if (applicantId) {
    const canceled = db.cancelApplicantParent(applicantId, parentPhone);
    if (!canceled) return res.status(404).json({ success: false, message: '신청 정보를 찾을 수 없습니다.' });
    return res.json({ success: true, message: '수강 신청이 정상적으로 취소(환불 신청)되었습니다.' });
  }

  if (waitlistId) {
    const canceled = db.cancelWaitlistParent(waitlistId, parentPhone);
    if (!canceled) return res.status(404).json({ success: false, message: '대기 정보를 찾을 수 없습니다.' });
    return res.json({ success: true, message: '대기자 신청이 취소 처리되었습니다.' });
  }

  return res.status(400).json({ success: false, message: '취소할 대상 항목이 선택되지 않았습니다.' });
});


// DELETE /api/courses/:id
app.delete('/api/courses/:id', authenticateToken, (req, res) => {
  const courseId = req.params.id;
  const deleted = db.deleteCourse(courseId, req.user.schoolId);
  if (!deleted) {
    return res.status(404).json({ success: false, message: '해당 강좌를 찾을 수 없거나 삭제 권한이 없습니다.' });
  }
  return res.json({ success: true, message: '강좌가 삭제되었습니다.' });
});

// ==================== SUBSCRIPTION APIs ====================

// POST /api/subscription/renew
app.post('/api/subscription/renew', authenticateToken, (req, res) => {
  const { plan, months } = req.body;
  const days = (parseInt(months) || 12) * 30;
  const updatedSchool = db.updateSchoolSubscription(req.user.schoolId, plan, days);

  if (!updatedSchool) {
    return res.status(400).json({ success: false, message: '구독 갱신에 실패했습니다.' });
  }

  const diffMs = new Date(updatedSchool.expireDate) - new Date();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return res.json({
    success: true,
    message: '구독 연장 결제가 완료되었습니다!',
    expireDate: updatedSchool.expireDate,
    daysLeft: daysLeft > 0 ? daysLeft : 0,
    plan: updatedSchool.plan
  });
});

// ==================== APPLICANT APIs ====================

// GET /api/applicants
app.get('/api/applicants', authenticateToken, (req, res) => {
  const applicants = db.getApplicantsBySchool(req.user.schoolId);
  return res.json({ success: true, applicants });
});

// PUT /api/applicants/:id/status
app.put('/api/applicants/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  const updated = db.updateApplicantStatus(req.params.id, req.user.schoolId, status);
  if (!updated) return res.status(404).json({ success: false, message: '신청자를 찾을 수 없습니다.' });
  return res.json({ success: true, applicant: updated, message: '신청자 상태가 변경되었습니다.' });
});

// DELETE /api/applicants/:id
app.delete('/api/applicants/:id', authenticateToken, (req, res) => {
  const deleted = db.deleteApplicant(req.params.id, req.user.schoolId);
  if (!deleted) return res.status(404).json({ success: false, message: '신청자를 찾을 수 없습니다.' });
  return res.json({ success: true, message: '수강 신청 정보가 삭제되었습니다.' });
});

// ==================== WAITLIST APIs ====================

// GET /api/waitlist
app.get('/api/waitlist', authenticateToken, (req, res) => {
  const waitlist = db.getWaitlistBySchool(req.user.schoolId);
  return res.json({ success: true, waitlist });
});

// POST /api/waitlist/:id/promote
app.post('/api/waitlist/:id/promote', authenticateToken, (req, res) => {
  const promoted = db.promoteWaitlist(req.params.id, req.user.schoolId);
  if (!promoted) return res.status(404).json({ success: false, message: '대기자를 찾을 수 없습니다.' });
  return res.json({ success: true, applicant: promoted, message: '대기자가 수강 신청자로 전환 승인되었습니다!' });
});

// DELETE /api/waitlist/:id
app.delete('/api/waitlist/:id', authenticateToken, (req, res) => {
  const deleted = db.deleteWaitlist(req.params.id, req.user.schoolId);
  if (!deleted) return res.status(404).json({ success: false, message: '대기자를 찾을 수 없습니다.' });
  return res.json({ success: true, message: '대기자 명단에서 취소 삭제되었습니다.' });
});

// ==================== SETTLEMENT APIs ====================

// GET /api/settlements
app.get('/api/settlements', authenticateToken, (req, res) => {
  const settlements = db.getSettlementsBySchool(req.user.schoolId);
  return res.json({ success: true, settlements });
});

// POST /api/settlements
app.post('/api/settlements', authenticateToken, (req, res) => {
  const { type, studentName, courseTitle, amount, note } = req.body;
  if (!type || !studentName || !amount) {
    return res.status(400).json({ success: false, message: '구분, 학생명, 금액을 입력해 주세요.' });
  }

  const newSettlement = db.createSettlement(req.user.schoolId, {
    type,
    studentName,
    courseTitle: courseTitle || '기타',
    amount: parseInt(amount) || 0,
    note: note || ''
  });
  return res.json({ success: true, settlement: newSettlement, message: '정산/환불 신청건이 신규 등록되었습니다.' });
});

// PUT /api/settlements/:id/status
app.put('/api/settlements/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  const updated = db.updateSettlementStatus(req.params.id, req.user.schoolId, status);
  if (!updated) return res.status(404).json({ success: false, message: '정산 항목을 찾을 수 없습니다.' });
  return res.json({ success: true, settlement: updated, message: '정산 상태가 변경되었습니다.' });
});

// ==================== ATTENDANCE APIs (강사 모바일 출석부 & 알림) ====================

// GET /api/attendance?courseId=...&date=...
app.get('/api/attendance', authenticateToken, (req, res) => {
  const { courseId, date } = req.query;
  const records = db.getAttendanceByCourseAndDate(req.user.schoolId, courseId, date);
  return res.json({ success: true, records });
});

// POST /api/attendance/check
app.post('/api/attendance/check', authenticateToken, (req, res) => {
  const { courseId, records } = req.body;
  if (!courseId || !Array.isArray(records)) {
    return res.status(400).json({ success: false, message: '강좌 및 출석 데이터를 전송해 주세요.' });
  }

  const logs = db.recordAttendance(req.user.schoolId, courseId, records);
  return res.json({
    success: true,
    logs,
    message: `🎉 ${records.length}명의 출석이 기록되었으며, 카카오 알림톡(안심 등하교) 통보가 전송되었습니다.`
  });
});

// ==================== ADVANCED OPERATIONAL & LMS APIs ====================

// POST /api/lottery/execute (추첨제 추첨 실행)
app.post('/api/lottery/execute', authenticateToken, (req, res) => {
  const { courseId } = req.body;
  if (!courseId) return res.status(400).json({ success: false, message: '강좌 ID를 지정해 주세요.' });

  const result = db.executeLottery(req.user.schoolId, courseId);
  if (result.error) return res.status(400).json({ success: false, message: result.error });

  return res.json(result);
});

// GET /api/financials/edufine (에듀파인 강사료/수용비 엑셀 집계)
app.get('/api/financials/edufine', authenticateToken, (req, res) => {
  const edufineData = db.getEdufineExport(req.user.schoolId);
  return res.json({ success: true, edufineData });
});

// POST /api/financials/refund-calculate (소비자분쟁기준 일할 환불 계산기)
app.post('/api/financials/refund-calculate', (req, res) => {
  const { fee, totalDays, attendedDays } = req.body;
  const refundAmount = db.calculateRefundAmount(fee, totalDays, attendedDays);
  return res.json({
    success: true,
    refundAmount,
    message: `전체 ${totalDays}일 중 ${attendedDays}일 수강 후 취소: 환불 예정 금액은 ${refundAmount.toLocaleString()}원 입니다.`
  });
});

// GET & POST /api/qa (클래스 Q&A 게시판)
app.get('/api/qa', (req, res) => {
  const { courseId, schoolCode } = req.query;
  const school = db.findSchoolByCode((schoolCode || 'UNCHON2025').toUpperCase());
  const schoolId = school ? school.id : 'sch_1';

  const questions = db.getQABoard(schoolId, courseId);
  return res.json({ success: true, questions });
});

app.post('/api/qa', (req, res) => {
  const { courseId, courseTitle, authorName, title, content, schoolCode } = req.body;
  if (!courseId || !title || !content) {
    return res.status(400).json({ success: false, message: '제목과 내용을 입력해 주세요.' });
  }

  const school = db.findSchoolByCode((schoolCode || 'UNCHON2025').toUpperCase());
  const schoolId = school ? school.id : 'sch_1';

  const newQA = db.createQA(schoolId, {
    courseId,
    courseTitle: courseTitle || '늘봄 강좌',
    authorName: authorName || '학부모',
    title,
    content
  });

  return res.json({ success: true, qa: newQA, message: 'Q&A 질문이 등록되었습니다.' });
});

app.put('/api/qa/:id/reply', authenticateToken, (req, res) => {
  const { reply } = req.body;
  const updated = db.replyQA(req.params.id, reply);
  if (!updated) return res.status(404).json({ success: false, message: '질문을 찾을 수 없습니다.' });
  return res.json({ success: true, qa: updated, message: '강사 답변이 등록되었습니다.' });
});

// GET & POST /api/safety/return-schedules (귀가 일정표)
app.get('/api/safety/return-schedules', (req, res) => {
  const { studentName, schoolCode } = req.query;
  const school = db.findSchoolByCode((schoolCode || 'UNCHON2025').toUpperCase());
  const schoolId = school ? school.id : 'sch_1';

  const schedules = db.getSafetySchedules(schoolId, studentName);
  return res.json({ success: true, schedules });
});

app.post('/api/safety/return-schedules', (req, res) => {
  const { studentName, gradeClass, parentPhone, dayOfWeek, returnTime, pickupPerson, schoolCode } = req.body;
  if (!studentName || !returnTime || !pickupPerson) {
    return res.status(400).json({ success: false, message: '학생명, 귀가시간, 동행자를 입력하세요.' });
  }

  const school = db.findSchoolByCode((schoolCode || 'UNCHON2025').toUpperCase());
  const schoolId = school ? school.id : 'sch_1';

  const newSched = db.saveSafetySchedule(schoolId, {
    studentName,
    gradeClass: gradeClass || '1학년',
    parentPhone: parentPhone || '010-0000-0000',
    dayOfWeek: dayOfWeek || '월~금',
    returnTime,
    pickupPerson
  });

  return res.json({ success: true, schedule: newSched, message: '귀가 일정표가 저장되었습니다.' });
});

// GET & POST /api/safety/absence (결석 및 조퇴 신청)
app.get('/api/safety/absence', authenticateToken, (req, res) => {
  const absenceList = db.getAbsenceRequests(req.user.schoolId);
  return res.json({ success: true, absenceList });
});

app.post('/api/safety/absence', (req, res) => {
  const { studentName, parentPhone, courseTitle, absenceDate, type, reason, schoolCode } = req.body;
  if (!studentName || !absenceDate || !reason) {
    return res.status(400).json({ success: false, message: '학생명, 결석일자, 사유를 입력하세요.' });
  }

  const school = db.findSchoolByCode((schoolCode || 'UNCHON2025').toUpperCase());
  const schoolId = school ? school.id : 'sch_1';

  const newAbs = db.createAbsenceRequest(schoolId, {
    studentName,
    parentPhone: parentPhone || '010-0000-0000',
    courseTitle: courseTitle || '늘봄 강좌',
    absenceDate,
    type: type || '결석',
    reason
  });

  return res.json({ success: true, absence: newAbs, message: '결석/조퇴 신청이 담당 선생님께 전달되었습니다.' });
});

// GET /api/parent/absence (학부모 신청 결석 내역 조회)
app.get('/api/parent/absence', (req, res) => {
  const { phone, schoolCode } = req.query;
  const school = db.findSchoolByCode((schoolCode || 'UNCHON2025').toUpperCase());
  const schoolId = school ? school.id : 'sch_1';

  const absenceList = db.getAbsenceRequests(schoolId, phone);
  return res.json({ success: true, absenceList });
});

// DELETE /api/parent/absence/:id
app.delete('/api/parent/absence/:id', (req, res) => {
  const deleted = db.deleteAbsenceRequest(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: '결석 신청건을 찾을 수 없습니다.' });
  return res.json({ success: true, message: '결석/조퇴 신청이 취소되었습니다.' });
});

// DELETE /api/safety/return-schedules/:id
app.delete('/api/safety/return-schedules/:id', (req, res) => {
  const deleted = db.deleteSafetySchedule(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: '귀가 일정을 찾을 수 없습니다.' });
  return res.json({ success: true, message: '귀가 일정표가 삭제되었습니다.' });
});

// ---------------- Section 2 (Official Manual) Endpoints ----------------

// 2.2 & 2.3 Staff & Service Administrators
app.get('/api/manual/staff', (req, res) => {
  const staff = db.getStaff('sch_1');
  return res.json({ success: true, staff });
});

app.post('/api/manual/staff', (req, res) => {
  const { name, role, permissions } = req.body;
  if (!name) return res.status(400).json({ success: false, message: '교직원 이름을 입력하세요.' });
  const newStaff = db.addStaff('sch_1', { name, role, permissions });
  return res.json({ success: true, staff: newStaff, message: `교직원 '${name}'님이 등록되었습니다.` });
});

app.post('/api/manual/service-admin', (req, res) => {
  const { staffId, permissions } = req.body;
  const admin = db.assignServiceAdmin('sch_1', staffId, permissions);
  if (!admin) return res.status(404).json({ success: false, message: '교직원을 찾을 수 없습니다.' });
  return res.json({ success: true, admin, message: `'${admin.name}'님이 서비스 관리자로 지정되었습니다.` });
});

// 2.4.1 Temporary Student Generator (7학년 생월반 생일번)
app.post('/api/manual/temp-student', (req, res) => {
  const { name, birthDate, phone } = req.body;
  if (!name || !birthDate) return res.status(400).json({ success: false, message: '학생 이름과 생년월일을 입력하세요.' });
  const tempStudent = db.generateTempStudent('sch_1', { name, birthDate, phone });
  return res.json({
    success: true,
    student: tempStudent,
    message: `[신학기 임시학적] '${name}' 학생에게 '${tempStudent.gradeClass}'이(가) 부여되었습니다.`
  });
});

// 2.4.1 Multi-Child Account Sharing
app.get('/api/manual/multi-child', (req, res) => {
  const { phone } = req.query;
  const children = db.getMultiChildAccounts(phone || '010-2345-6789');
  return res.json({ success: true, children });
});

// 2.5 Homeroom Teacher Management
app.get('/api/manual/homeroom', (req, res) => {
  const teachers = db.getHomeroomTeachers('sch_1');
  return res.json({ success: true, teachers });
});

app.post('/api/manual/homeroom', (req, res) => {
  const { name, assignedClass, phone } = req.body;
  if (!name || !assignedClass) return res.status(400).json({ success: false, message: '담임 교사명과 담당 학급을 입력하세요.' });
  const newHR = db.addHomeroomTeacher('sch_1', { name, assignedClass, phone });
  return res.json({ success: true, teacher: newHR, message: `'${name}' 선생님이 '${assignedClass}' 담임으로 등록되었습니다.` });
});

// 2.6 Instructors & Banking ID Grouping
app.get('/api/manual/instructors', (req, res) => {
  const instructors = db.getInstructors('sch_1');
  return res.json({ success: true, instructors });
});

app.get('/api/manual/instructor-banking-groups', (req, res) => {
  const groups = db.getInstructorBankingGroups('sch_1');
  return res.json({ success: true, groups });
});

// 2.10 SMS Settings
app.get('/api/manual/sms-config', (req, res) => {
  const config = db.getSmsConfig('sch_1');
  return res.json({ success: true, config });
});

app.post('/api/manual/sms-config', (req, res) => {
  const updated = db.updateSmsConfig('sch_1', req.body);
  return res.json({ success: true, config: updated, message: '문자 및 발신번호 설정이 저장되었습니다.' });
});

// 2.11.3 Overlap Restriction Groups
app.get('/api/manual/restriction-groups', (req, res) => {
  const groups = db.getRestrictionGroups('sch_1');
  return res.json({ success: true, groups });
});

app.post('/api/manual/restriction-groups', (req, res) => {
  const { code, name, description } = req.body;
  if (!code || !name) return res.status(400).json({ success: false, message: '그룹 코드와 그룹명을 입력하세요.' });
  const newGroup = db.addRestrictionGroup('sch_1', { code, name, description });
  return res.json({ success: true, group: newGroup, message: `중복제한그룹 [${code}] '${name}'이(가) 등록되었습니다.` });
});

// 2.11.4 Notice Text Settings
app.get('/api/manual/notice-settings', (req, res) => {
  const settings = db.getNoticeSettings('sch_1');
  return res.json({ success: true, settings });
});

app.post('/api/manual/notice-settings', (req, res) => {
  const updated = db.updateNoticeSettings('sch_1', req.body);
  return res.json({ success: true, settings: updated, message: '안내글 설정이 저장되었습니다.' });
});

// ==================== Live dbdbschool 29 Submodels REST APIs ====================

// 1. 대기자관리 (/af/ad_wait/lists)
app.get('/api/af/ad_wait/lists', (req, res) => {
  const waitlist = db.getWaitlist('sch_1');
  return res.json({ success: true, count: waitlist.length, waitlist });
});

app.post('/api/af/ad_wait/promote', (req, res) => {
  const { waitId } = req.body;
  const promoted = db.promoteWaitlist(waitId);
  if (promoted) {
    return res.json({ success: true, message: `'${promoted.studentName}' 학생이 대기에서 정규 수강생으로 승격되었습니다.`, promoted });
  }
  return res.status(404).json({ success: false, message: '대기자를 찾을 수 없습니다.' });
});

// 2. 출석부관리 (/af/ad_att/stat)
app.get('/api/af/ad_att/stat', (req, res) => {
  const stats = db.getAttendanceStats('sch_1');
  return res.json({ success: true, stats });
});

app.post('/api/af/ad_att/stamp', (req, res) => {
  const { courseId } = req.body;
  return res.json({ success: true, message: `선택 강좌의 ${new Date().getMonth() + 1}월 출석부에 학교장 직인이 날인 처리되었습니다.` });
});

// 3. 환불/취소관리 (/af/ad_ref/lists)
app.get('/api/af/ad_ref/lists', (req, res) => {
  const refunds = db.getRefunds('sch_1');
  return res.json({ success: true, count: refunds.length, refunds });
});

app.post('/api/af/ad_ref/create', (req, res) => {
  const newRef = db.addRefund('sch_1', req.body);
  return res.json({ success: true, message: `'${newRef.studentName}' 학생의 환불 요청(${newRef.refundAmount.toLocaleString()}원)이 등록되었습니다.`, refund: newRef });
});

// 4. 결석/귀가신청 (/af/ad_abs/lists)
app.get('/api/af/ad_abs/lists', (req, res) => {
  const absences = db.getAbsences('sch_1');
  return res.json({ success: true, count: absences.length, absences });
});

app.post('/api/af/ad_abs/status', (req, res) => {
  const { id, status } = req.body;
  const updated = db.updateAbsenceStatus(id, status);
  return res.json({ success: true, message: `결석/조퇴 신청이 '${status}' 처리되었습니다.`, item: updated });
});

// 5. 강사관리 (/af/ad_tea/lists)
app.get('/api/af/ad_tea/lists', (req, res) => {
  const teachers = db.getInstructors('sch_1');
  return res.json({ success: true, count: teachers.length, teachers });
});

// 6. 알림관리 (/af/notification/lists)
app.get('/api/af/notification/lists', (req, res) => {
  const notifications = db.getNotifications('sch_1');
  return res.json({ success: true, count: notifications.length, notifications });
});

// 7. 푸시알림관리 (/af/spush/lists)
app.get('/api/af/spush/lists', (req, res) => {
  const pushNotifications = db.getPushNotifications('sch_1');
  return res.json({ success: true, count: pushNotifications.length, pushNotifications });
});

app.post('/api/af/spush/send', (req, res) => {
  const { title, body } = req.body;
  return res.json({ success: true, message: `[${title}] 모바일 앱 푸시 알림이 전체 학생/학부모에게 발송되었습니다.` });
});

// 8. 연장신청 (/af/ad_extension/lists)
app.get('/api/af/ad_extension/lists', (req, res) => {
  const extensions = db.getServiceExtensions('sch_1');
  return res.json({ success: true, extensions });
});

// 9. 지원금관리 4개 서브엔드포인트
app.get('/api/af/ad_free2_stu/lists', (req, res) => {
  const students = db.getSubsidyStudents('sch_1');
  return res.json({ success: true, students });
});

app.get('/api/af/ad_free2_app/lists', (req, res) => {
  const applicants = db.getSubsidyApplicants('sch_1');
  return res.json({ success: true, applicants });
});

app.get('/api/af/ad_free2_cfg/main', (req, res) => {
  return res.json({
    success: true,
    config: {
      annualLimit: 600000,
      priorityPolicy: '자유수강권 > 늘봄무상지원금 > 바우처',
      autoDeduct: true,
      excludeMaterials: false
    }
  });
});

app.get('/api/af/ad_free2_cfg/free1', (req, res) => {
  const ranks = db.getSubsidyRanks('sch_1');
  return res.json({ success: true, ranks });
});

// 10. 설문관리 2개 서브엔드포인트
app.get('/api/af/ad_sur/lists', (req, res) => {
  const surveys = db.getSurveys('sch_1');
  return res.json({ success: true, surveys });
});

app.get('/api/af/ad_surs/lists', (req, res) => {
  const sampleSurveys = db.getSampleSurveys();
  return res.json({ success: true, sampleSurveys });
});

// 11. 환경설정 서브엔드포인트
app.get('/api/af/ad_cfg/period', (req, res) => {
  const periods = db.getPeriods('sch_1');
  return res.json({ success: true, periods });
});

app.get('/api/af/ad_cfg/afDiv', (req, res) => {
  const divisions = db.getAfDivisions('sch_1');
  return res.json({ success: true, divisions });
});

app.get('/api/af/ad_time/lists', (req, res) => {
  const periods = db.getApplyPeriods('sch_1');
  return res.json({ success: true, periods });
});

app.get('/api/af/ad_info/modify', (req, res) => {
  const info = db.getManagerInfo('sch_1');
  return res.json({ success: true, info });
});

app.post('/api/af/ad_info/modify', (req, res) => {
  const updated = db.updateManagerInfo('sch_1', req.body);
  return res.json({ success: true, message: '담당자 및 학교 정보가 성공적으로 수정되었습니다.', info: updated });
});

app.post('/api/af/ad_cfg/clear', (req, res) => {
  return res.json({ success: true, message: '선택하신 운영구분의 신청/수납/출결 데이터가 안전하게 초기화되었습니다.' });
});

// 12. 학교관리 (/sczigi/service/lists)
app.get('/api/sczigi/service/lists', (req, res) => {
  const schools = db.getAllSchools();
  return res.json({ success: true, schools });
});

// 12.1. Q&A 고객지원 게시판 APIs (/api/af/qanda/*)
let serverQnaList = [
  {
    id: 3,
    schoolId: '1001',
    schoolName: '서울초등학교',
    title: '2026학년도 늘봄학교 교재 수량 변경 요청건',
    author: '박상현',
    hp1: '010',
    hp2: '9876',
    hp3: '5432',
    phone: '010-9876-5432',
    tel: '02-123-4567',
    email: 'park1001@seoul.es.kr',
    createdAt: '2026-08-17',
    status: '접수',
    answerDate: null,
    content: '늘봄학교 교실 추가로 인한 로봇교실 교재 20세트 추가 요청드립니다.'
  },
  {
    id: 2,
    schoolId: '3267',
    schoolName: '광주풍향초등학교',
    title: '2026학년도 1학기 늘봄학교 만족도 조사 설문지',
    author: '김혜련',
    hp1: '010',
    hp2: '2494',
    hp3: '1479',
    phone: '010-2494-1479',
    tel: '062-609-1182',
    email: 'khh147979@naver.com',
    createdAt: '2026-06-01',
    status: '완료',
    answerDate: '06/01',
    content: '2026학년도 바뀐 설문지 보내드립니다.\n감사합니다.',
    answerContent: '자료 올려 주셔서 감사합니다.\n4가지 샘플 설문에 등록해드렸습니다.\n확인 바랍니다.',
    fileName: '2026학년도1학기늘봄학교만족도조사설문지.hwp'
  },
  {
    id: 1,
    schoolId: '3267',
    schoolName: '광주풍향초등학교',
    title: '지원금 스쿨뱅킹 현황',
    author: '관리자',
    hp1: '010',
    hp2: '1234',
    hp3: '5678',
    phone: '010-1234-5678',
    tel: '062-609-1180',
    email: 'admin@school.go.kr',
    createdAt: '2025-06-13',
    status: '완료',
    answerDate: '06/13',
    content: '지원금 스쿨뱅킹 이체 현황 및 자동 차감 설정 관련 문의입니다.',
    answerContent: '안녕하세요. 지원금 스쿨뱅킹 처리 내역 조회가 완료되었습니다.'
  }
];

app.get('/api/af/qanda/lists', (req, res) => {
  return res.json({ success: true, qnas: serverQnaList });
});

app.post('/api/af/qanda/write', (req, res) => {
  const { title, author, hp1, hp2, hp3, tel, email, content, fileName, updateManagerInfo, schoolId, schoolName } = req.body;
  const nextId = Math.max(...serverQnaList.map(q => q.id), 0) + 1;
  const now = new Date();
  const createdAt = now.toISOString().split('T')[0];

  const newItem = {
    id: nextId,
    schoolId: schoolId || '3267',
    schoolName: schoolName || '광주풍향초등학교',
    title: title || '문의사항',
    author: author || '김혜련',
    hp1: hp1 || '010',
    hp2: hp2 || '2494',
    hp3: hp3 || '1479',
    phone: `${hp1 || '010'}-${hp2 || '2494'}-${hp3 || '1479'}`,
    tel: tel || '062-609-1182',
    email: email || 'khh147979@naver.com',
    createdAt,
    status: '접수',
    answerDate: null,
    content: content || '',
    fileName: fileName || undefined,
    updateManagerInfo: !!updateManagerInfo
  };

  serverQnaList.unshift(newItem);
  return res.json({ success: true, message: '문의사항이 성공적으로 등록되었습니다.', qna: newItem });
});

app.post('/api/af/qanda/reply', (req, res) => {
  const { id, answerContent, status } = req.body;
  const item = serverQnaList.find(q => q.id === parseInt(id, 10));
  if (item) {
    item.answerContent = answerContent;
    if (status) item.status = status;
    const now = new Date();
    item.answerDate = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    return res.json({ success: true, message: '답변이 성공적으로 저장되었습니다.', qna: item });
  }
  return res.status(404).json({ success: false, message: '해당 문의글을 찾을 수 없습니다.' });
});

app.delete('/api/af/qanda/delete/:id', (req, res) => {
  const { id } = req.params;
  const targetId = parseInt(id, 10);
  serverQnaList = serverQnaList.filter(q => q.id !== targetId);
  return res.json({ success: true, message: '문의글이 삭제되었습니다.' });
});


// 13. Manual & FAQ Master Endpoints (/af/ad_faq/main)
const manualData = require('./utils/manualData');

app.get('/api/manual/all', (req, res) => {
  return res.json({
    success: true,
    operations: manualData.OPERATIONS_STEPS,
    templates: manualData.TEMPLATE_DOWNLOADS,
    manuals: manualData.MANUAL_DOWNLOADS,
    faqs: manualData.FAQ_CATEGORIES
  });
});

app.get('/api/manual/doc/:id', (req, res) => {
  const { id } = req.params;
  const docIdNum = parseInt(id, 10);
  const op = manualData.OPERATIONS_STEPS.find(o => o.docId === docIdNum || o.num === docIdNum);
  if (op) {
    return res.json({ success: true, doc: op });
  }
  // Find in FAQs or manuals
  let foundFaq = null;
  for (const cat of manualData.FAQ_CATEGORIES) {
    const item = cat.items.find(i => i.docId === docIdNum || String(i.docId) === id);
    if (item) {
      foundFaq = { title: item.q, content: `### ${item.q}\n\n상세 운영 지침 및 표준 절차입니다.\n\n1. 관련 메뉴로 이동합니다.\n2. 관리자 권한으로 설정값을 점검하고 변경합니다.\n3. 확인 버튼을 클릭하여 저장합니다.` };
      break;
    }
  }
  if (foundFaq) {
    return res.json({ success: true, doc: foundFaq });
  }
  return res.json({
    success: true,
    doc: {
      title: `매뉴얼 문서 (ID: ${id})`,
      content: `### 디비디비스쿨 공식 매뉴얼 문서\n\n- 문서 번호: ${id}\n- 해당 기능에 대한 상세 가이드 및 팁이 수록되어 있습니다.`
    }
  });
});

app.get('/api/manual/download/:fileId', (req, res) => {
  const { fileId } = req.params;
  let filename = `${fileId}.zip`;
  if (fileId.includes('mp4')) filename = 'student_guide.mp4';
  if (fileId.includes('banner')) filename = 'dbdbschool_banner.png';
  if (fileId.includes('popup')) filename = 'dbdbschool_popup.png';
  
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/octet-stream');
  return res.send(Buffer.from(`DBDBSCHOOL MANUAL FILE DATA: ${fileId}`));
});

// Interactive dbdbschool Student Portal APIs
let sampleDbdbCourses = [
  { id: 'c_3267_1', courseName: '창의로봇과교실 (월/수)', instructor: '김로봇', capacity: 20, enrolled: 18, waitlist: 2, status: '접수중', time: '14:00~15:30' },
  { id: 'c_3267_2', courseName: 'AI 코딩 & 엔트리 (화/목)', instructor: '박코딩', capacity: 15, enrolled: 12, waitlist: 0, status: '접수중', time: '15:30~17:00' },
  { id: 'c_3267_3', courseName: '신나는 K-POP 댄스 (금)', instructor: '이댄스', capacity: 25, enrolled: 25, waitlist: 5, status: '대기접수중', time: '16:00~17:30' }
];

app.get('/api/dbdbschool/:schoolId/courses', (req, res) => {
  return res.json({ success: true, schoolId: req.params.schoolId, courses: sampleDbdbCourses });
});

app.post('/api/dbdbschool/:schoolId/enroll', (req, res) => {
  const { courseId, studentName, isWaitlist } = req.body;
  const course = sampleDbdbCourses.find(c => c.id === courseId);
  if (!course) {
    return res.status(404).json({ success: false, message: '해당 강좌를 찾을 수 없습니다.' });
  }
  if (isWaitlist) {
    course.waitlist += 1;
    return res.json({ success: true, message: `${studentName} 학생의 대기 신청이 완료되었습니다.` });
  }
  course.enrolled += 1;
  return res.json({ success: true, message: `${studentName} 학생의 수강 신청 완료되었습니다.` });
});

// Official dbdbschool URL direct handler: /help/go_data/num/:num/data/:type
app.get('/help/go_data/num/:num/data/:type', (req, res) => {
  const { num, type } = req.params;
  if (type === 'video' || type === 'mov') {
    return res.redirect(`https://www.youtube.com/results?search_query=dbdbschool+manual+${num}`);
  }
  return res.redirect(`/api/manual/doc/${num}`);
});

// Serve static files
app.use(express.static(path.join(__dirname), { redirect: false }));

// dbdbschool Page Routing Fallback Middleware (Matches all live dbdbschool URL patterns)
app.use((req, res, next) => {
  const fs = require('fs');
  if (req.path && req.path.startsWith('/sczigi/')) {
    const cleanPath = req.path.replace(/^\/sczigi\//, '').replace(/\/$/, '');
    const directIndexPath = path.join(__dirname, 'sczigi', cleanPath, 'index.html');
    const directHtmlPath = path.join(__dirname, 'sczigi', `${cleanPath}.html`);
    const fallbackSnPath = path.join(__dirname, 'sczigi', cleanPath, 'sn', '3267', 'index.html');
    if (fs.existsSync(directIndexPath)) return res.sendFile(directIndexPath);
    if (fs.existsSync(directHtmlPath)) return res.sendFile(directHtmlPath);
    if (fs.existsSync(fallbackSnPath)) return res.sendFile(fallbackSnPath);
  }

  if (req.path && req.path.startsWith('/af/')) {
    if (req.path.startsWith('/af/ad_lec/lists')) {
      const mainAdminIndex = path.join(__dirname, 'af', 'ad_lec', 'lists', 'sn', 'index.html');
      return res.sendFile(mainAdminIndex);
    }
    const cleanPath = req.path.replace(/^\/af\//, '').replace(/\/$/, '');
    const directIndexPath = path.join(__dirname, 'af', cleanPath, 'index.html');
    const directHtmlPath = path.join(__dirname, 'af', `${cleanPath}.html`);
    const fallbackSnPath = path.join(__dirname, 'af', cleanPath, 'sn', '3267', 'index.html');
    const exactFile = path.join(__dirname, req.path.replace(/\/$/, ''), 'index.html');
    if (fs.existsSync(exactFile)) return res.sendFile(exactFile);
    if (fs.existsSync(directIndexPath)) return res.sendFile(directIndexPath);
    if (fs.existsSync(directHtmlPath)) return res.sendFile(directHtmlPath);
    if (fs.existsSync(fallbackSnPath)) return res.sendFile(fallbackSnPath);
    const mainAdminIndex = path.join(__dirname, 'af', 'ad_lec', 'lists', 'sn', 'index.html');
    if (fs.existsSync(mainAdminIndex)) return res.sendFile(mainAdminIndex);
  }
  next();
});

// ==================== APPLICANT MANAGEMENT (ad_app) API & ROUTES ====================
let applicantDb = [
  // (금) 돌봄 4부 (Course 1552375) - 19명
  { id: '21016254', seq: 19, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 1, studentNum: 10, gradeClass: '1학년 1반', studentName: '오하율', parentPhone: '010-1234-5670', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:28:38', bankName: '농협', schoolBankingAccount: '302-1234-5678-01', depositorName: '오태양', memo: '' },
  { id: '21016237', seq: 18, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 1, studentNum: 11, gradeClass: '1학년 1반', studentName: '이소윤', parentPhone: '010-3718-3500', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:26:54', bankName: '국민은행', schoolBankingAccount: '648201-01-234567', depositorName: '이진수', memo: '' },
  { id: '21016247', seq: 17, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 1, studentNum: 13, gradeClass: '1학년 1반', studentName: '이채린', parentPhone: '010-2345-6781', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:27:53', bankName: '신한은행', schoolBankingAccount: '110-234-567890', depositorName: '이동현', memo: '' },
  { id: '21016260', seq: 16, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 1, studentNum: 14, gradeClass: '1학년 1반', studentName: '장희준', parentPhone: '010-5334-7217', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:29:29', bankName: '카카오뱅크', schoolBankingAccount: '3333-01-9876543', depositorName: '장성식', memo: '' },
  { id: '21016240', seq: 15, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 1, studentNum: 17, gradeClass: '1학년 1반', studentName: '최다연', parentPhone: '010-5219-2196', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '늘봄 지원금', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 15:27:16', bankName: '우리은행', schoolBankingAccount: '1002-123-456789', depositorName: '최병서', memo: '' },
  { id: '21016242', seq: 14, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 1, studentNum: 18, gradeClass: '1학년 1반', studentName: '최연우', parentPhone: '010-3456-7892', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '일반 자부담', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 15:27:36', bankName: '농협', schoolBankingAccount: '351-0123-4567-89', depositorName: '최민수', memo: '' },
  { id: '21016276', seq: 13, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 1, studentNum: 19, gradeClass: '1학년 1반', studentName: '최유나', parentPhone: '010-3373-3683', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '일반 자부담', paymentStatus: '결제대기', status: '신청대기', appliedAt: '2026-07-10 15:31:04', bankName: '하나은행', schoolBankingAccount: '123-910111-12131', depositorName: '최광철', memo: '' },
  { id: '21016252', seq: 12, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 2, studentNum: 2, gradeClass: '1학년 2반', studentName: '김은성', parentPhone: '010-9073-5302', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:28:24', bankName: '기업은행', schoolBankingAccount: '010-9073-5302', depositorName: '김성태', memo: '' },
  { id: '21016250', seq: 11, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 2, studentNum: 5, gradeClass: '1학년 2반', studentName: '노슬찬', parentPhone: '010-5445-0930', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:28:20', bankName: '농협', schoolBankingAccount: '301-4455-6677-88', depositorName: '노철웅', memo: '' },
  { id: '21016257', seq: 10, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 2, studentNum: 7, gradeClass: '1학년 2반', studentName: '배지안', parentPhone: '010-4567-8901', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:29:10', bankName: '국민은행', schoolBankingAccount: '445501-01-334455', depositorName: '배영호', memo: '' },
  { id: '21016266', seq: 9, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 2, studentNum: 8, gradeClass: '1학년 2반', studentName: '소하윤', parentPhone: '010-5678-9012', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:29:45', bankName: '신한은행', schoolBankingAccount: '110-345-678901', depositorName: '소진우', memo: '' },
  { id: '21016262', seq: 8, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 1, classNum: 2, studentNum: 14, gradeClass: '1학년 2반', studentName: '임지유', parentPhone: '010-6789-0123', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:30:12', bankName: '우리은행', schoolBankingAccount: '1002-345-678901', depositorName: '임태훈', memo: '' },
  { id: '21016290', seq: 7, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 2, classNum: 1, studentNum: 12, gradeClass: '2학년 1반', studentName: '장무재', parentPhone: '010-7890-1234', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:30:40', bankName: '하나은행', schoolBankingAccount: '123-456789-01234', depositorName: '장호진', memo: '' },
  { id: '21016282', seq: 6, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 2, classNum: 2, studentNum: 3, gradeClass: '2학년 2반', studentName: '국민준', parentPhone: '010-8901-2345', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:31:05', bankName: '농협', schoolBankingAccount: '302-3456-7890-12', depositorName: '국동현', memo: '' },
  { id: '21016288', seq: 5, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 2, classNum: 2, studentNum: 5, gradeClass: '2학년 2반', studentName: '김도아', parentPhone: '010-9012-3456', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:31:30', bankName: '카카오뱅크', schoolBankingAccount: '3333-02-1234567', depositorName: '김상우', memo: '' },
  { id: '21016279', seq: 4, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 2, classNum: 2, studentNum: 13, gradeClass: '2학년 2반', studentName: '홍은재', parentPhone: '010-0123-4567', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:32:00', bankName: '기업은행', schoolBankingAccount: '010-0123-4567', depositorName: '홍성민', memo: '' },
  { id: '21016318', seq: 3, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 2, classNum: 3, studentNum: 2, gradeClass: '2학년 3반', studentName: '김지민', parentPhone: '010-1234-9876', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:32:25', bankName: '신한은행', schoolBankingAccount: '110-456-789012', depositorName: '김병철', memo: '' },
  { id: '21016286', seq: 2, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 2, classNum: 3, studentNum: 6, gradeClass: '2학년 3반', studentName: '이서린', parentPhone: '010-2345-8765', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:32:50', bankName: '국민은행', schoolBankingAccount: '556601-01-445566', depositorName: '이재혁', memo: '' },
  { id: '21016297', seq: 1, period: '26년 8월 늘봄', courseId: '1552375', courseTitle: '(금) 돌봄 4부', instructorName: '돌봄전담사', grade: 2, classNum: 3, studentNum: 9, gradeClass: '2학년 3반', studentName: '이용준', parentPhone: '010-3456-7654', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 28000, bookFee: 15000, materialFee: 5000, totalFee: 62000, addDate: '', subsidyType: '늘봄 무상지원', paymentStatus: '무상', status: '승인', appliedAt: '2026-07-10 15:33:15', bankName: '농협', schoolBankingAccount: '302-5678-9012-34', depositorName: '이광수', memo: '' },

  // 컴퓨터 월,수 1부 (Course 1552319) - 15명
  { id: '21017001', seq: 15, period: '26년 8월 늘봄', courseId: '1552319', courseTitle: '컴퓨터 월,수 1부', instructorName: '김윤정', grade: 1, classNum: 1, studentNum: 1, gradeClass: '1학년 1반', studentName: '강건우', parentPhone: '010-1111-2222', tuitionFee: 38000, accommodationFee: 1900, teacherFee: 36100, bookFee: 15000, materialFee: 0, totalFee: 53000, addDate: '2026-08-01', subsidyType: '일반 자부담', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 16:01:00', bankName: '국민은행', schoolBankingAccount: '111-222-333333', depositorName: '강태진', memo: '' },
  { id: '21017002', seq: 14, period: '26년 8월 늘봄', courseId: '1552319', courseTitle: '컴퓨터 월,수 1부', instructorName: '김윤정', grade: 1, classNum: 1, studentNum: 3, gradeClass: '1학년 1반', studentName: '김도하', parentPhone: '010-1234-5678', tuitionFee: 38000, accommodationFee: 1900, teacherFee: 36100, bookFee: 15000, materialFee: 0, totalFee: 53000, addDate: '2026-08-01', subsidyType: '일반 자부담', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 16:02:10', bankName: '신한은행', schoolBankingAccount: '222-333-444444', depositorName: '김도일', memo: '' },
  { id: '21017003', seq: 13, period: '26년 8월 늘봄', courseId: '1552319', courseTitle: '컴퓨터 월,수 1부', instructorName: '김윤정', grade: 1, classNum: 2, studentNum: 4, gradeClass: '1학년 2반', studentName: '박서아', parentPhone: '010-3456-7890', tuitionFee: 38000, accommodationFee: 1900, teacherFee: 36100, bookFee: 15000, materialFee: 0, totalFee: 53000, addDate: '2026-08-01', subsidyType: '일반 자부담', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 16:03:00', bankName: '우리은행', schoolBankingAccount: '333-444-555555', depositorName: '박진철', memo: '' },
  { id: '21017004', seq: 12, period: '26년 8월 늘봄', courseId: '1552319', courseTitle: '컴퓨터 월,수 1부', instructorName: '김윤정', grade: 2, classNum: 1, studentNum: 6, gradeClass: '2학년 1반', studentName: '이준우', parentPhone: '010-4567-8901', tuitionFee: 38000, accommodationFee: 1900, teacherFee: 36100, bookFee: 15000, materialFee: 0, totalFee: 53000, addDate: '2026-08-01', subsidyType: '늘봄 지원금', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 16:04:15', bankName: '하나은행', schoolBankingAccount: '444-555-666666', depositorName: '이동주', memo: '' },
  { id: '21017005', seq: 11, period: '26년 8월 늘봄', courseId: '1552319', courseTitle: '컴퓨터 월,수 1부', instructorName: '김윤정', grade: 2, classNum: 2, studentNum: 8, gradeClass: '2학년 2반', studentName: '정지우', parentPhone: '010-5678-9012', tuitionFee: 38000, accommodationFee: 1900, teacherFee: 36100, bookFee: 15000, materialFee: 0, totalFee: 53000, addDate: '2026-08-01', subsidyType: '일반 자부담', paymentStatus: '결제대기', status: '승인', appliedAt: '2026-07-10 16:05:00', bankName: '기업은행', schoolBankingAccount: '555-666-777777', depositorName: '정우성', memo: '' },

  // 로봇과학 1부 (Course 1552305) - 14명
  { id: '21018001', seq: 14, period: '26년 8월 늘봄', courseId: '1552305', courseTitle: '로봇과학 1부', instructorName: '최정호', grade: 1, classNum: 1, studentNum: 5, gradeClass: '1학년 1반', studentName: '조민재', parentPhone: '010-6789-1234', tuitionFee: 42000, accommodationFee: 2100, teacherFee: 39900, bookFee: 20000, materialFee: 15000, totalFee: 77000, addDate: '2026-08-01', subsidyType: '일반 자부담', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 16:10:00', bankName: '농협', schoolBankingAccount: '302-8888-9999-01', depositorName: '조성태', memo: '' },
  { id: '21018002', seq: 13, period: '26년 8월 늘봄', courseId: '1552305', courseTitle: '로봇과학 1부', instructorName: '최정호', grade: 2, classNum: 2, studentNum: 11, gradeClass: '2학년 2반', studentName: '한서준', parentPhone: '010-7890-2345', tuitionFee: 42000, accommodationFee: 2100, teacherFee: 39900, bookFee: 20000, materialFee: 15000, totalFee: 77000, addDate: '2026-08-01', subsidyType: '일반 자부담', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 16:11:00', bankName: '신한은행', schoolBankingAccount: '110-888-999999', depositorName: '한영호', memo: '' },
  { id: '21018003', seq: 12, period: '26년 8월 늘봄', courseId: '1552305', courseTitle: '로봇과학 1부', instructorName: '최정호', grade: 3, classNum: 1, studentNum: 7, gradeClass: '3학년 1반', studentName: '황지호', parentPhone: '010-8901-3456', tuitionFee: 42000, accommodationFee: 2100, teacherFee: 39900, bookFee: 20000, materialFee: 15000, totalFee: 77000, addDate: '2026-08-01', subsidyType: '늘봄 지원금', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 16:12:00', bankName: '국민은행', schoolBankingAccount: '999-000-111111', depositorName: '황인수', memo: '' },

  // 댄스 2부 (Course 1552303) - 16명
  { id: '21019001', seq: 16, period: '26년 8월 늘봄', courseId: '1552303', courseTitle: '댄스 2부', instructorName: '김지향', grade: 2, classNum: 1, studentNum: 4, gradeClass: '2학년 1반', studentName: '문채원', parentPhone: '010-9012-4567', tuitionFee: 30000, accommodationFee: 1500, teacherFee: 28500, bookFee: 0, materialFee: 0, totalFee: 30000, addDate: '2026-08-01', subsidyType: '일반 자부담', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 16:20:00', bankName: '카카오뱅크', schoolBankingAccount: '3333-05-6789012', depositorName: '문재학', memo: '' },
  { id: '21019002', seq: 15, period: '26년 8월 늘봄', courseId: '1552303', courseTitle: '댄스 2부', instructorName: '김지향', grade: 3, classNum: 2, studentNum: 9, gradeClass: '3학년 2반', studentName: '윤서진', parentPhone: '010-0123-5678', tuitionFee: 30000, accommodationFee: 1500, teacherFee: 28500, bookFee: 0, materialFee: 0, totalFee: 30000, addDate: '2026-08-01', subsidyType: '일반 자부담', paymentStatus: '결제대기', status: '승인', appliedAt: '2026-07-10 16:21:00', bankName: '우리은행', schoolBankingAccount: '1002-999-888777', depositorName: '윤정우', memo: '' },

  // 바이올린 1부 (Course 1552315) - 8명
  { id: '21020001', seq: 8, period: '26년 8월 늘봄', courseId: '1552315', courseTitle: '바이올린 1부', instructorName: '천윤아', grade: 1, classNum: 2, studentNum: 10, gradeClass: '1학년 2반', studentName: '서예린', parentPhone: '010-1234-7777', tuitionFee: 45000, accommodationFee: 2250, teacherFee: 42750, bookFee: 18000, materialFee: 10000, totalFee: 73000, addDate: '2026-08-01', subsidyType: '일반 자부담', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 16:30:00', bankName: '신한은행', schoolBankingAccount: '110-555-444333', depositorName: '서동진', memo: '' },
  { id: '21020002', seq: 7, period: '26년 8월 늘봄', courseId: '1552315', courseTitle: '바이올린 1부', instructorName: '천윤아', grade: 2, classNum: 3, studentNum: 8, gradeClass: '2학년 3반', studentName: '안유진', parentPhone: '010-2345-8888', tuitionFee: 45000, accommodationFee: 2250, teacherFee: 42750, bookFee: 18000, materialFee: 10000, totalFee: 73000, addDate: '2026-08-01', subsidyType: '늘봄 지원금', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 16:31:00', bankName: '국민은행', schoolBankingAccount: '555-888-222111', depositorName: '안진우', memo: '' },

  // 창의수학 1부 (Course 1552328) - 17명
  { id: '21021001', seq: 17, period: '26년 8월 늘봄', courseId: '1552328', courseTitle: '창의수학 1부', instructorName: '김경아', grade: 1, classNum: 1, studentNum: 8, gradeClass: '1학년 1반', studentName: '남궁민', parentPhone: '010-3456-9999', tuitionFee: 35000, accommodationFee: 1750, teacherFee: 33250, bookFee: 12000, materialFee: 5000, totalFee: 52000, addDate: '2026-08-01', subsidyType: '일반 자부담', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 16:40:00', bankName: '농협', schoolBankingAccount: '302-1111-2222-33', depositorName: '남궁혁', memo: '' },
  { id: '21021002', seq: 16, period: '26년 8월 늘봄', courseId: '1552328', courseTitle: '창의수학 1부', instructorName: '김경아', grade: 2, classNum: 1, studentNum: 15, gradeClass: '2학년 1반', studentName: '탁승우', parentPhone: '010-4567-0000', tuitionFee: 35000, accommodationFee: 1750, teacherFee: 33250, bookFee: 12000, materialFee: 5000, totalFee: 52000, addDate: '2026-08-01', subsidyType: '일반 자부담', paymentStatus: '결제대기', status: '승인', appliedAt: '2026-07-10 16:41:00', bankName: '하나은행', schoolBankingAccount: '123-777-888999', depositorName: '탁영호', memo: '' },

  // 바둑 1부 (Course 1552313) - 8명
  { id: '21022001', seq: 8, period: '26년 8월 늘봄', courseId: '1552313', courseTitle: '바둑 1부', instructorName: '박경도', grade: 1, classNum: 2, studentNum: 9, gradeClass: '1학년 2반', studentName: '주원진', parentPhone: '010-5678-1111', tuitionFee: 32000, accommodationFee: 1600, teacherFee: 30400, bookFee: 8000, materialFee: 0, totalFee: 40000, addDate: '2026-08-01', subsidyType: '일반 자부담', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 16:50:00', bankName: '기업은행', schoolBankingAccount: '010-5678-1111', depositorName: '주태수', memo: '' },

  // (월) 맞춤형 AI코딩교실 (Course c_2)
  { id: '21023001', seq: 10, period: '26년 8월 늘봄', courseId: 'c_2', courseTitle: '(월) 맞춤형 AI코딩교실', instructorName: '박코딩', grade: 2, classNum: 2, studentNum: 1, gradeClass: '2학년 2반', studentName: '강태양', parentPhone: '010-6789-2222', tuitionFee: 35000, accommodationFee: 1750, teacherFee: 33250, bookFee: 0, materialFee: 10000, totalFee: 45000, addDate: '2026-08-01', subsidyType: '일반 자부담', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 17:00:00', bankName: '카카오뱅크', schoolBankingAccount: '3333-09-8877665', depositorName: '강선우', memo: '' },

  // (화/목) 창의로봇교실 (Course c_3)
  { id: '21024001', seq: 9, period: '26년 8월 늘봄', courseId: 'c_3', courseTitle: '(화/목) 창의로봇교실', instructorName: '이로봇', grade: 3, classNum: 1, studentNum: 2, gradeClass: '3학년 1반', studentName: '구본승', parentPhone: '010-7890-3333', tuitionFee: 40000, accommodationFee: 2000, teacherFee: 38000, bookFee: 0, materialFee: 15000, totalFee: 55000, addDate: '2026-08-01', subsidyType: '일반 자부담', paymentStatus: '결제완료', status: '승인', appliedAt: '2026-07-10 17:10:00', bankName: '농협', schoolBankingAccount: '302-3333-4444-55', depositorName: '구자명', memo: '' }
];

let payCoursesList = [
  {
    "value": "1552375",
    "text": "[26년 8월] (금) 돌봄 4부(돌봄전담사,19명)"
  },
  {
    "value": "1552291",
    "text": "[26년 8월] (금)돌봄 1부(돌봄전담사,5명)"
  },
  {
    "value": "1552292",
    "text": "[26년 8월] (금)돌봄 2부(돌봄전담사,12명)"
  },
  {
    "value": "1552293",
    "text": "[26년 8월] (금)돌봄 3부(돌봄전담사,20명)"
  },
  {
    "value": "1552374",
    "text": "[26년 8월] (목) 돌봄 4부(돌봄전담사,20명)"
  },
  {
    "value": "1552288",
    "text": "[26년 8월] (목)돌봄 1부(돌봄전담사,2명)"
  },
  {
    "value": "1552289",
    "text": "[26년 8월] (목)돌봄 2부(돌봄전담사,4명)"
  },
  {
    "value": "1552290",
    "text": "[26년 8월] (목)돌봄 3부(돌봄전담사,10명)"
  },
  {
    "value": "1552284",
    "text": "[26년 8월] (수)돌봄 1부(돌봄전담사,1명)"
  },
  {
    "value": "1552285",
    "text": "[26년 8월] (수)돌봄 2부(돌봄전담사,4명)"
  },
  {
    "value": "1552286",
    "text": "[26년 8월] (수)돌봄 3부(돌봄전담사,10명)"
  },
  {
    "value": "1552287",
    "text": "[26년 8월] (수)돌봄 4부(돌봄전담사,20명)"
  },
  {
    "value": "1552277",
    "text": "[26년 8월] (월)돌봄 1부(돌봄전담사,1명)"
  },
  {
    "value": "1552278",
    "text": "[26년 8월] (월)돌봄 2부(돌봄전담사,4명)"
  },
  {
    "value": "1552279",
    "text": "[26년 8월] (월)돌봄 3부(돌봄전담사,10명)"
  },
  {
    "value": "1552280",
    "text": "[26년 8월] (월)돌봄 4부(돌봄전담사,20명)"
  },
  {
    "value": "1552373",
    "text": "[26년 8월] (화) 돌봄 4부(돌봄전담사,20명)"
  },
  {
    "value": "1552281",
    "text": "[26년 8월] (화)돌봄 1부(돌봄전담사,2명)"
  },
  {
    "value": "1552282",
    "text": "[26년 8월] (화)돌봄 2부(돌봄전담사,4명)"
  },
  {
    "value": "1552283",
    "text": "[26년 8월] (화)돌봄 3부(돌봄전담사,10명)"
  },
  {
    "value": "1552299",
    "text": "[26년 8월] 논술 1부(박지숙,17명)"
  },
  {
    "value": "1552300",
    "text": "[26년 8월] 논술 2부(박지숙,11명)"
  },
  {
    "value": "1552301",
    "text": "[26년 8월] 논술 3부(박지숙,0명)"
  },
  {
    "value": "1552297",
    "text": "[26년 8월] 놀이체육 1부(강태연,11명)"
  },
  {
    "value": "1552296",
    "text": "[26년 8월] 놀이체육 2부(강태연,15명)"
  },
  {
    "value": "1552324",
    "text": "[26년 8월] 뉴스포츠 1부(박지연,30명)"
  },
  {
    "value": "1552325",
    "text": "[26년 8월] 뉴스포츠 2부(박지연,20명)"
  },
  {
    "value": "1552302",
    "text": "[26년 8월] 댄스 1부(김지향,0명)"
  },
  {
    "value": "1552303",
    "text": "[26년 8월] 댄스 2부(김지향,16명)"
  },
  {
    "value": "1552304",
    "text": "[26년 8월] 댄스 3부(김지향,6명)"
  },
  {
    "value": "1552295",
    "text": "[26년 8월] 독후활동미술놀이 1부(임은희,9명)"
  },
  {
    "value": "1552294",
    "text": "[26년 8월] 독후활동미술놀이 2부(임은희,20명)"
  },
  {
    "value": "1552305",
    "text": "[26년 8월] 로봇과학 1부(최정호,14명)"
  },
  {
    "value": "1552306",
    "text": "[26년 8월] 로봇과학 2부(최정호,22명)"
  },
  {
    "value": "1552307",
    "text": "[26년 8월] 로봇과학 3부(최정호,6명)"
  },
  {
    "value": "1552313",
    "text": "[26년 8월] 바둑 1부(박경도,8명)"
  },
  {
    "value": "1552314",
    "text": "[26년 8월] 바둑 2부(박경도,4명)"
  },
  {
    "value": "1552315",
    "text": "[26년 8월] 바이올린 1부(천윤아,8명)"
  },
  {
    "value": "1552316",
    "text": "[26년 8월] 바이올린 2부(천윤아,11명)"
  },
  {
    "value": "1552326",
    "text": "[26년 8월] 생활영어 1부(서인경,9명)"
  },
  {
    "value": "1552327",
    "text": "[26년 8월] 생활영어 2부(서인경,4명)"
  },
  {
    "value": "1552298",
    "text": "[26년 8월] 아침늘봄 (월~금 08:00~08:40)(이금진,5명)"
  },
  {
    "value": "1552308",
    "text": "[26년 8월] 주산 1부(박은화,8명)"
  },
  {
    "value": "1552309",
    "text": "[26년 8월] 주산 2부(박은화,2명)"
  },
  {
    "value": "1552310",
    "text": "[26년 8월] 주산 3부(박은화,3명)"
  },
  {
    "value": "1552317",
    "text": "[26년 8월] 창의미술 1부(김언주,20명)"
  },
  {
    "value": "1552318",
    "text": "[26년 8월] 창의미술 2부(김언주,10명)"
  },
  {
    "value": "1552275",
    "text": "[26년 8월] 창의보드 1부(정진화,10명)"
  },
  {
    "value": "1552276",
    "text": "[26년 8월] 창의보드 2부(정진화,18명)"
  },
  {
    "value": "1552328",
    "text": "[26년 8월] 창의수학 1부(김경아,17명)"
  },
  {
    "value": "1552329",
    "text": "[26년 8월] 창의수학 2부(김경아,12명)"
  },
  {
    "value": "1552319",
    "text": "[26년 8월] 컴퓨터 월,수 1부(김윤정,15명)"
  },
  {
    "value": "1552320",
    "text": "[26년 8월] 컴퓨터 월,수 2부(김윤정,29명)"
  },
  {
    "value": "1552321",
    "text": "[26년 8월] 컴퓨터 월,수 3부(김윤정,22명)"
  },
  {
    "value": "1552322",
    "text": "[26년 8월] 컴퓨터 화,목 1부(김윤정,22명)"
  },
  {
    "value": "1552323",
    "text": "[26년 8월] 컴퓨터 화,목 2부(김윤정,29명)"
  },
  {
    "value": "1552429",
    "text": "[26년 8월] 컴퓨터 화,목 3부(김윤정,28명)"
  },
  {
    "value": "1552311",
    "text": "[26년 8월] 한자 1부(김재표,13명)"
  },
  {
    "value": "1552312",
    "text": "[26년 8월] 한자 2부(김재표,10명)"
  }
];

let availableCoursesList = [
  { id: 'c_1', title: '(금) 돌봄 4부', teacherId: 'kim_minji', teacherName: '김민지', fee: 0, materialFee: 0, category: '돌봄', period: '26년 8월', operatingPeriod: '2026.08.01 ~ 2026.08.31', schedule: '금 16:00~16:50', capacity: 20, waitingCapacity: 5, targetGrade: [1, 2] },
  { id: 'c_2', title: '(월) 맞춤형 AI코딩교실', teacherId: 'park_coding', teacherName: '박코딩', fee: 35000, materialFee: 10000, category: '맞춤형', period: '26년 8월', operatingPeriod: '2026.08.01 ~ 2026.08.31', schedule: '월 14:00~14:50', capacity: 15, waitingCapacity: 5, targetGrade: [1, 2, 3] },
  { id: 'c_3', title: '(화/목) 창의로봇교실', teacherId: 'lee_robot', teacherName: '이로봇', fee: 40000, materialFee: 15000, category: '방과후', period: '26년 8월', operatingPeriod: '2026.08.01 ~ 2026.08.31', schedule: '화, 목 15:00~15:50', capacity: 16, waitingCapacity: 5, targetGrade: [1, 2, 3, 4, 5, 6] },
  { id: 'c_4', title: '(수) K-POP 방송댄스', teacherId: 'jung_dance', teacherName: '정댄스', fee: 30000, materialFee: 0, category: '방과후', period: '26년 8월', operatingPeriod: '2026.08.01 ~ 2026.08.31', schedule: '수 14:00~14:50', capacity: 20, waitingCapacity: 5, targetGrade: [1, 2, 3, 4, 5, 6] },
  { id: 'c_5', title: '(월/수) 주산암산교실', teacherId: 'kang_math', teacherName: '강수학', fee: 35000, materialFee: 5000, category: '방과후', period: '26년 8월', operatingPeriod: '2026.08.01 ~ 2026.08.31', schedule: '월, 수 14:00~14:50', capacity: 15, waitingCapacity: 5, targetGrade: [1, 2, 3] },
  { id: 'c_6', title: '(화/목) 생명과학실험', teacherId: 'song_sci', teacherName: '송과학', fee: 42000, materialFee: 18000, category: '맞춤형', period: '26년 8월', operatingPeriod: '2026.08.01 ~ 2026.08.31', schedule: '화, 목 14:00~14:50', capacity: 15, waitingCapacity: 5, targetGrade: [1, 2, 3, 4] },
  { id: 'c_7', title: '(금) 늘봄 미술교실', teacherId: 'han_art', teacherName: '한미술', fee: 0, materialFee: 8000, category: '돌봄', period: '26년 8월', operatingPeriod: '2026.08.01 ~ 2026.08.31', schedule: '금 15:00~15:50', capacity: 20, waitingCapacity: 5, targetGrade: [1, 2] }
];


// Tuition Pay Entry Page (/af/ad_pay/edit/...)
app.get(/^\/af\/ad_pay\/edit/, (req, res) => {
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

app.get(['/af/ad_app/lists/sn/3267', '/af/ad_app/lists/sn/3267/'], (req, res) => {
  return res.sendFile(path.join(__dirname, 'af', 'ad_app', 'lists', 'sn', '3267', 'index.html'));
});

// Applicant Registration Page (/af/ad_app/sin/...)
app.get(/^\/af\/ad_app\/sin/, (req, res) => {
  return res.sendFile(path.join(__dirname, 'af', 'ad_app', 'sin', 'sn', '3267', 'index.html'));
});

// Standalone Student Search Modal / Popup Route
app.get(/^\/student\/search/, (req, res) => {
  return res.sendFile(path.join(__dirname, 'af', 'ad_app', 'sin', 'sn', '3267', 'student_search.html'));
});

app.get('/api/courses/sn/3267', (req, res) => {
  return res.json({ success: true, courses: availableCoursesList });
});

app.get('/api/student/search', (req, res) => {
  const { grade, classNum, keyword } = req.query;
  const sampleStudents = [
    // 1학년
    { studentId: 'stu_1', studentName: '김도하', grade: 1, classNum: 1, studentNum: 1, parentPhone: '010-1234-5678' },
    { studentId: 'stu_2', studentName: '김민준', grade: 1, classNum: 1, studentNum: 2, parentPhone: '010-2345-6789' },
    { studentId: 'stu_3', studentName: '박서아', grade: 1, classNum: 1, studentNum: 3, parentPhone: '010-3456-7890' },
    { studentId: 'stu_4', studentName: '오하율', grade: 1, classNum: 1, studentNum: 10, parentPhone: '010-1234-5670' },
    { studentId: 'stu_5', studentName: '이소윤', grade: 1, classNum: 1, studentNum: 11, parentPhone: '010-3718-3500' },
    { studentId: 'stu_6', studentName: '이채린', grade: 1, classNum: 1, studentNum: 13, parentPhone: '010-2345-6781' },
    { studentId: 'stu_7', studentName: '장희준', grade: 1, classNum: 1, studentNum: 14, parentPhone: '010-5334-7217' },
    { studentId: 'stu_8', studentName: '최다연', grade: 1, classNum: 1, studentNum: 17, parentPhone: '010-5219-2196' },
    { studentId: 'stu_9', studentName: '최유나', grade: 1, classNum: 1, studentNum: 19, parentPhone: '010-3373-3683' },
    { studentId: 'stu_10', studentName: '김은성', grade: 1, classNum: 2, studentNum: 2, parentPhone: '010-9073-5302' },
    { studentId: 'stu_11', studentName: '노슬찬', grade: 1, classNum: 2, studentNum: 5, parentPhone: '010-5445-0930' },
    { studentId: 'stu_12', studentName: '배지안', grade: 1, classNum: 2, studentNum: 7, parentPhone: '010-4567-8901' },
    { studentId: 'stu_13', studentName: '소하윤', grade: 1, classNum: 2, studentNum: 8, parentPhone: '010-5678-9012' },
    { studentId: 'stu_14', studentName: '임지유', grade: 1, classNum: 2, studentNum: 14, parentPhone: '010-6789-0123' },

    // 2학년
    { studentId: 'stu_15', studentName: '장무재', grade: 2, classNum: 1, studentNum: 12, parentPhone: '010-7890-1234' },
    { studentId: 'stu_16', studentName: '이준우', grade: 2, classNum: 1, studentNum: 6, parentPhone: '010-4567-8901' },
    { studentId: 'stu_17', studentName: '국민준', grade: 2, classNum: 2, studentNum: 3, parentPhone: '010-8901-2345' },
    { studentId: 'stu_18', studentName: '김도아', grade: 2, classNum: 2, studentNum: 5, parentPhone: '010-9012-3456' },
    { studentId: 'stu_19', studentName: '정지우', grade: 2, classNum: 2, studentNum: 8, parentPhone: '010-5678-9012' },
    { studentId: 'stu_20', studentName: '홍은재', grade: 2, classNum: 2, studentNum: 13, parentPhone: '010-0123-4567' },
    { studentId: 'stu_21', studentName: '김지민', grade: 2, classNum: 3, studentNum: 2, parentPhone: '010-1234-9876' },
    { studentId: 'stu_22', studentName: '이서린', grade: 2, classNum: 3, studentNum: 6, parentPhone: '010-2345-8765' },
    { studentId: 'stu_23', studentName: '이용준', grade: 2, classNum: 3, studentNum: 9, parentPhone: '010-3456-7654' },

    // 3학년
    { studentId: 'stu_24', studentName: '구본승', grade: 3, classNum: 1, studentNum: 2, parentPhone: '010-7890-3333' },
    { studentId: 'stu_25', studentName: '황지호', grade: 3, classNum: 1, studentNum: 7, parentPhone: '010-8901-3456' },
    { studentId: 'stu_26', studentName: '윤서진', grade: 3, classNum: 2, studentNum: 9, parentPhone: '010-0123-5678' },
    { studentId: 'stu_27', studentName: '송하은', grade: 3, classNum: 2, studentNum: 14, parentPhone: '010-1122-3344' },

    // 4학년
    { studentId: 'stu_28', studentName: '박시우', grade: 4, classNum: 1, studentNum: 4, parentPhone: '010-2233-4455' },
    { studentId: 'stu_29', studentName: '유가은', grade: 4, classNum: 2, studentNum: 11, parentPhone: '010-3344-5566' },

    // 5학년
    { studentId: 'stu_30', studentName: '정태윤', grade: 5, classNum: 1, studentNum: 9, parentPhone: '010-4455-6677' },
    { studentId: 'stu_31', studentName: '한서율', grade: 5, classNum: 2, studentNum: 15, parentPhone: '010-5566-7788' },

    // 6학년
    { studentId: 'stu_32', studentName: '고은우', grade: 6, classNum: 1, studentNum: 3, parentPhone: '010-6677-8899' },
    { studentId: 'stu_33', studentName: '민채아', grade: 6, classNum: 2, studentNum: 12, parentPhone: '010-7788-9900' }
  ];

  let filtered = sampleStudents;
  if (grade && grade !== 'all') filtered = filtered.filter(s => String(s.grade) === String(grade));
  if (classNum && classNum !== 'all') filtered = filtered.filter(s => String(s.classNum) === String(classNum));
  if (keyword) {
    const kw = keyword.toLowerCase().trim();
    filtered = filtered.filter(s => s.studentName.toLowerCase().includes(kw) || s.parentPhone.includes(kw));
  }
  return res.json({ success: true, students: filtered });
});

// GET /api/af/ad_app/sin-courses : Evaluates courses and student registration status
app.get('/api/af/ad_app/sin-courses', (req, res) => {
  const { studentName, gradeClass, period, category, keyword } = req.query;

  // Find enrolled courses for this student
  let enrolled = [];
  if (studentName && gradeClass) {
    enrolled = applicantDb.filter(a => a.studentName === studentName && a.gradeClass === gradeClass);
  }

  let studentGrade = 1;
  if (gradeClass) {
    const match = gradeClass.match(/(\d+)학년/);
    if (match) studentGrade = parseInt(match[1]);
  }

  let filtered = [...availableCoursesList];

  // Month filter (sld1)
  if (period && period !== 'all' && period !== '구분전체') {
    filtered = filtered.filter(c => !c.period || c.period.includes(period));
  }

  // Category filter (slp1)
  if (category && category !== 'all' && category !== '늘봄과정전체') {
    filtered = filtered.filter(c => c.category === category);
  }

  // Keyword filter
  if (keyword) {
    const kw = keyword.toLowerCase().trim();
    filtered = filtered.filter(c => c.title.toLowerCase().includes(kw) || c.teacherName.toLowerCase().includes(kw));
  }

  // Evaluate course status for student
  const coursesWithStatus = filtered.map((c, idx) => {
    const currentEnrolledCount = applicantDb.filter(a => a.courseId === c.id).length;
    const isApplied = enrolled.some(a => a.courseId === c.id);

    let status = 'available';
    let statusText = '신청';

    if (isApplied) {
      status = 'applied';
      statusText = '신청완료';
    } else {
      // Check capacity
      if (currentEnrolledCount >= c.capacity) {
        status = 'closed';
        statusText = '마감';
      } else if (enrolled.length > 0) {
        // Check time conflict
        const isTimeConflict = enrolled.some(ea => {
          const enrolledCourse = availableCoursesList.find(ac => ac.id === ea.courseId);
          if (!enrolledCourse) return false;
          // Simple schedule conflict check
          return enrolledCourse.schedule && c.schedule && enrolledCourse.schedule.split(' ')[0] === c.schedule.split(' ')[0];
        });

        if (isTimeConflict) {
          status = 'time_conflict';
          statusText = '시간중복';
        } else {
          // Check teacher conflict
          const isTeacherConflict = enrolled.some(ea => ea.instructorName === c.teacherName);
          if (isTeacherConflict) {
            status = 'teacher_conflict';
            statusText = '강사중복';
          }
        }
      }
    }

    return {
      seq: idx + 1,
      ...c,
      currentCount: currentEnrolledCount,
      waitingCount: 0,
      status,
      statusText
    };
  });

  return res.json({
    success: true,
    appliedCount: enrolled.length,
    courses: coursesWithStatus
  });
});

// POST /api/af/ad_app/direct-apply
app.post('/api/af/ad_app/direct-apply', (req, res) => {
  const { studentName, gradeClass, studentNum, parentPhone, courseId } = req.body;
  if (!studentName || !gradeClass || !courseId) {
    return res.status(400).json({ success: false, message: '학생 정보와 강좌를 모두 선택해주세요.' });
  }

  const course = availableCoursesList.find(c => c.id === courseId);
  if (!course) {
    return res.status(404).json({ success: false, message: '강좌를 찾을 수 없습니다.' });
  }

  // Check duplicate
  const already = applicantDb.find(a => a.studentName === studentName && a.gradeClass === gradeClass && a.courseId === courseId);
  if (already) {
    return res.status(400).json({ success: false, message: '이미 신청된 강좌입니다.' });
  }

  const nextSeq = applicantDb.length > 0 ? Math.max(...applicantDb.map(a => a.seq || 0)) + 1 : 700;
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const newItem = {
    id: `app_${nextSeq}`,
    seq: nextSeq,
    period: course.period || '26년 8월 늘봄',
    courseId: course.id,
    courseTitle: course.title,
    instructorName: course.teacherName,
    grade: parseInt(gradeClass) || 1,
    classNum: 1,
    studentNum: parseInt(studentNum) || 1,
    gradeClass: gradeClass,
    studentName: studentName,
    parentPhone: parentPhone || '010-0000-0000',
    tuitionFee: course.fee || 0,
    accommodationFee: 0,
    teacherFee: 0,
    bookFee: 0,
    materialFee: course.materialFee || 0,
    totalFee: (course.fee || 0) + (course.materialFee || 0),
    subsidyType: course.fee === 0 ? '늘봄 무상지원' : '일반 자부담',
    paymentStatus: course.fee === 0 ? '무상' : '결제대기',
    status: '승인',
    appliedAt: dateStr,
    bankName: '',
    schoolBankingAccount: '',
    depositorName: '',
    memo: '관리자 직접 수강신청'
  };

  applicantDb.unshift(newItem);

  const appliedCount = applicantDb.filter(a => a.studentName === studentName && a.gradeClass === gradeClass).length;
  return res.json({ success: true, message: '수강신청이 완료되었습니다.', appliedCount, item: newItem });
});

// POST /api/af/ad_app/direct-cancel
app.post('/api/af/ad_app/direct-cancel', (req, res) => {
  const { studentName, gradeClass, courseId } = req.body;
  if (!studentName || !gradeClass || !courseId) {
    return res.status(400).json({ success: false, message: '학생 정보와 강좌를 모두 전달해주세요.' });
  }

  const prevLen = applicantDb.length;
  applicantDb = applicantDb.filter(a => !(a.studentName === studentName && a.gradeClass === gradeClass && a.courseId === courseId));

  if (applicantDb.length === prevLen) {
    return res.status(404).json({ success: false, message: '취소할 수강 내역을 찾을 수 없습니다.' });
  }

  const appliedCount = applicantDb.filter(a => a.studentName === studentName && a.gradeClass === gradeClass).length;
  return res.json({ success: true, message: '수강신청이 성공적으로 취소되었습니다.', appliedCount });
});

app.get('/api/af/ad_app/lists/sn/3267', (req, res) => {
  const { courseId, grade, paymentStatus, keyword } = req.query;
  let items = [...applicantDb];

  if (courseId) {
    items = items.filter(a => a.courseId === courseId);
  }
  if (grade) {
    items = items.filter(a => String(a.grade) === String(grade));
  }
  if (paymentStatus) {
    items = items.filter(a => a.paymentStatus === paymentStatus);
  }
  if (keyword) {
    const kw = keyword.toLowerCase();
    items = items.filter(a => 
      a.studentName.toLowerCase().includes(kw) ||
      (a.gradeClass && a.gradeClass.toLowerCase().includes(kw)) ||
      (a.parentPhone && a.parentPhone.includes(kw)) ||
      (a.courseTitle && a.courseTitle.toLowerCase().includes(kw))
    );
  }

  const stats = {
    totalCount: items.length,
    approvedCount: items.filter(a => a.status === '승인').length,
    waitingCount: items.filter(a => a.status === '신청대기' || a.paymentStatus === '결제대기').length,
    totalTuitionFee: items.reduce((sum, a) => sum + (a.totalFee || 0), 0),
    totalCollectedFee: items.filter(a => a.paymentStatus === '결제완료').reduce((sum, a) => sum + (a.totalFee || 0), 0)
  };

  return res.json({ success: true, items, stats });
});

app.post('/api/af/ad_app/create', (req, res) => {
  const body = req.body;
  const nextSeq = applicantDb.length > 0 ? Math.max(...applicantDb.map(a => a.seq || 0)) + 1 : 700;
  const newId = `app_${nextSeq}`;
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const tuitionFee = parseInt(body.tuitionFee) || 0;
  const materialFee = parseInt(body.materialFee) || 0;
  const bookFee = parseInt(body.bookFee) || 0;
  const accommodationFee = parseInt(body.accommodationFee) || 0;
  const totalFee = tuitionFee + materialFee + bookFee + accommodationFee;

  const newItem = {
    id: newId,
    seq: nextSeq,
    period: body.period || '26년 8월 늘봄',
    courseId: body.courseId || 'c_1',
    courseTitle: body.courseTitle || '(금) 돌봄 4부',
    instructorName: body.instructorName || '김민지',
    grade: parseInt(body.gradeClass) || 1,
    classNum: 1,
    studentNum: parseInt(body.studentNum) || 1,
    gradeClass: body.gradeClass || '1학년 1반',
    studentName: body.studentName || '신규학생',
    parentPhone: body.parentPhone || '010-0000-0000',
    tuitionFee,
    accommodationFee,
    teacherFee: 0,
    bookFee,
    materialFee,
    totalFee,
    subsidyType: body.subsidyType || '일반 자부담',
    paymentStatus: body.paymentStatus || (totalFee === 0 ? '무상' : '결제대기'),
    status: body.status || '승인',
    appliedAt: dateStr,
    bankName: body.bankName || '',
    schoolBankingAccount: body.schoolBankingAccount || '',
    depositorName: body.depositorName || '',
    memo: body.memo || ''
  };

  applicantDb.unshift(newItem);
  return res.json({ success: true, message: '신청자가 성공적으로 등록되었습니다.', item: newItem });
});

app.get('/api/af/ad_app/view/:id', (req, res) => {
  const item = applicantDb.find(a => a.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: '해당 신청 내역을 찾을 수 없습니다.' });
  }
  return res.json({ success: true, item });
});

app.post('/api/af/ad_app/update', (req, res) => {
  const { id, studentName, gradeClass, parentPhone, paymentStatus, status, tuitionFee, materialFee, schoolBankingAccount, memo } = req.body;
  const item = applicantDb.find(a => a.id === id);
  if (!item) {
    return res.status(404).json({ success: false, message: '해당 신청 내역을 찾을 수 없습니다.' });
  }

  if (studentName !== undefined) item.studentName = studentName;
  if (gradeClass !== undefined) item.gradeClass = gradeClass;
  if (parentPhone !== undefined) item.parentPhone = parentPhone;
  if (paymentStatus !== undefined) item.paymentStatus = paymentStatus;
  if (status !== undefined) item.status = status;
  if (tuitionFee !== undefined) item.tuitionFee = parseInt(tuitionFee) || 0;
  if (materialFee !== undefined) item.materialFee = parseInt(materialFee) || 0;
  item.totalFee = (item.tuitionFee || 0) + (item.materialFee || 0) + (item.bookFee || 0) + (item.accommodationFee || 0);
  if (schoolBankingAccount !== undefined) item.schoolBankingAccount = schoolBankingAccount;
  if (memo !== undefined) item.memo = memo;

  return res.json({ success: true, message: '신청자 정보가 저장되었습니다.', item });
});

app.post('/api/af/ad_app/delete', (req, res) => {
  const { id } = req.body;
  applicantDb = applicantDb.filter(a => a.id !== id);
  return res.json({ success: true, message: '해당 신청 내역이 삭제되었습니다.' });
});

app.post('/api/af/ad_app/batch-upload', (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: '일괄 등록할 명단이 올바르지 않습니다.' });
  }

  let count = 0;
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  for (const it of items) {
    const nextSeq = applicantDb.length > 0 ? Math.max(...applicantDb.map(a => a.seq || 0)) + 1 : 700;
    const tFee = parseInt(it.tuitionFee) || 35000;
    const mFee = parseInt(it.materialFee) || 0;

    const newItem = {
      id: `app_${nextSeq}`,
      seq: nextSeq,
      period: '26년 8월 늘봄',
      courseId: it.courseId || 'c_1',
      courseTitle: it.courseTitle || '신청 강좌',
      instructorName: it.instructorName || '담당강사',
      grade: parseInt(it.gradeClass) || 1,
      classNum: 1,
      studentNum: parseInt(it.studentNum) || 1,
      gradeClass: it.gradeClass || '1학년 1반',
      studentName: it.studentName || '학생',
      parentPhone: it.parentPhone || '010-0000-0000',
      tuitionFee: tFee,
      accommodationFee: 0,
      teacherFee: 0,
      bookFee: 0,
      materialFee: mFee,
      totalFee: tFee + mFee,
      subsidyType: '일반 자부담',
      paymentStatus: '결제대기',
      status: '승인',
      appliedAt: dateStr,
      bankName: '',
      schoolBankingAccount: '',
      depositorName: '',
      memo: '엑셀 일괄입력'
    };
    applicantDb.unshift(newItem);
    count++;
  }

  return res.json({ success: true, count, message: `${count}명의 수강 신청이 일괄 등록되었습니다.` });
});

app.post('/api/af/ad_app/batch-fee', (req, res) => {
  const { courseId, tuitionFee, materialFee } = req.body;
  let updatedCount = 0;
  const tFee = parseInt(tuitionFee) || 0;
  const mFee = parseInt(materialFee) || 0;

  for (const item of applicantDb) {
    if (!courseId || item.courseId === courseId) {
      item.tuitionFee = tFee;
      item.materialFee = mFee;
      item.totalFee = tFee + mFee + (item.bookFee || 0) + (item.accommodationFee || 0);
      updatedCount++;
    }
  }

  return res.json({ success: true, updatedCount, message: `${updatedCount}건의 수강료가 일괄 적용되었습니다.` });
});

app.post('/api/af/ad_app/copy', (req, res) => {
  const { sourceCourseId, targetCourseId, feeOption, clearTarget } = req.body;
  const sourceCourse = availableCoursesList.find(c => c.id === sourceCourseId);
  const targetCourse = availableCoursesList.find(c => c.id === targetCourseId);

  if (!sourceCourse || !targetCourse) {
    return res.status(400).json({ success: false, message: '원본 또는 대상 강좌가 존재하지 않습니다.' });
  }

  if (clearTarget) {
    applicantDb = applicantDb.filter(a => a.courseId !== targetCourseId);
  }

  const sourceItems = applicantDb.filter(a => a.courseId === sourceCourseId);
  let count = 0;

  for (const item of sourceItems) {
    const nextSeq = Math.max(...applicantDb.map(a => a.seq || 0), 700) + 1;
    const copiedItem = {
      ...item,
      id: `app_${nextSeq}`,
      seq: nextSeq,
      courseId: targetCourse.id,
      courseTitle: targetCourse.title,
      instructorName: targetCourse.teacherName,
      appliedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    if (feeOption === 'target') {
      copiedItem.tuitionFee = targetCourse.fee || 0;
      copiedItem.totalFee = copiedItem.tuitionFee + (copiedItem.materialFee || 0);
    }

    applicantDb.unshift(copiedItem);
    count++;
  }

  return res.json({ success: true, copiedCount: count, message: `${sourceCourse.title}의 신청자 ${count}명이 ${targetCourse.title} (으)로 복사되었습니다.` });
});

app.get('/api/af/ad_app/school-banking/csv/sn/3267', (req, res) => {
  let csvContent = '\uFEFF연번,학년반,번호,학생명,강좌명,수강료,수용비,교재비,재료비,합계,결제상태,스쿨뱅킹계좌,예금주\n';
  for (const a of applicantDb) {
    csvContent += `"${a.seq}","${a.gradeClass || ''}","${a.studentNum || ''}","${a.studentName || ''}","${a.courseTitle || ''}","${a.tuitionFee || 0}","${a.accommodationFee || 0}","${a.bookFee || 0}","${a.materialFee || 0}","${a.totalFee || 0}","${a.paymentStatus || ''}","${a.schoolBankingAccount || ''}","${a.depositorName || ''}"\n`;
  }

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="school_banking_list_3267.csv"');
  return res.send(csvContent);
});

// Map sld to Period Name
const sldPeriodMap = {
  '5': '3월',
  '6': '26년 4월',
  '7': '26년 5월',
  '8': '26년 6월',
  '9': '26년 7월',
  '10': '26년 8월',
  '11': '26년 9월'
};

// GET /api/af/ad_app/com/courses
app.get('/api/af/ad_app/com/courses', (req, res) => {
  const { sld } = req.query;
  const periodName = sldPeriodMap[sld] || '26년 8월';
  
  const courses = payCoursesList.map(c => ({
    value: c.value,
    text: c.text.replace(/26년 8월|3월|26년 4월|26년 5월|26년 6월|26년 7월|26년 9월/g, periodName)
  }));
  return res.json({ success: true, list: courses });
});

// Excel Export Generator for Additional & Canceled Applicants
function generateComExcelHandler(req, res) {
  const params = req.method === 'POST' ? req.body : req.query;
  const com_gubun = String(params.com_gubun || '2');
  const sld = String(params.sld || '10');
  const sln = String(params.sln || '');
  const sld2 = String(params.sld2 || '');
  const sln2 = String(params.sln2 || '');
  const excel_gubun = String(params.excel_gubun || '2');
  const file_type = String(params.file_type || 'all');

  const curPeriod = sldPeriodMap[sld] || '26년 8월';
  const prevPeriod = sldPeriodMap[sld2] || '26년 7월';
  const isAddition = (excel_gubun === '2');
  const typeTitle = isAddition ? '신청 추가자' : '신청 취소자';

  let targetStudents = [];

  if (isAddition) {
    let candidates = applicantDb.filter(a => a.status !== '취소');
    if (sln) {
      candidates = candidates.filter(a => String(a.courseId) === String(sln));
    }
    targetStudents = candidates.map((a, idx) => ({
      seq: idx + 1,
      period: curPeriod,
      courseTitle: a.courseTitle || '돌봄 4부',
      instructorName: a.instructorName || '김윤정',
      gradeClass: a.gradeClass || `${a.grade || 1}학년 1반`,
      studentNum: a.studentNum || (idx + 1),
      studentName: a.studentName || '학생',
      parentPhone: a.parentPhone || '010-0000-0000',
      tuitionFee: a.tuitionFee || 0,
      materialFee: a.materialFee || 0,
      bookFee: a.bookFee || 0,
      totalFee: a.totalFee || 0,
      targetDate: a.addDate || '2026-08-01',
      status: a.status || '승인',
      memo: a.memo || (com_gubun === '1' ? '이전 강좌 미신청 신규' : '추가일자 등록')
    }));
  } else {
    const cancelPool = [
      { id: 'c_901', courseId: '1552375', courseTitle: '[26년 8월] (금) 돌봄 4부', instructorName: '돌봄전담사', gradeClass: '1학년 1반', studentNum: 10, studentName: '오하율', parentPhone: '010-1234-5670', tuitionFee: 0, materialFee: 0, refundFee: 0, targetDate: '2026-08-10', memo: '학부모 요청 취소' },
      { id: 'c_902', courseId: '1552319', courseTitle: '[26년 8월] 컴퓨터 월,수 1부', instructorName: '김윤정', gradeClass: '1학년 1반', studentNum: 13, studentName: '이채린', parentPhone: '010-2345-6781', tuitionFee: 38000, materialFee: 0, refundFee: 38000, targetDate: '2026-08-08', memo: '이사로 인한 취소 및 환불' },
      { id: 'c_903', courseId: '1552305', courseTitle: '[26년 8월] 로봇과학 1부', instructorName: '최정호', gradeClass: '2학년 1반', studentNum: 14, studentName: '임지유', parentPhone: '010-6789-0123', tuitionFee: 42000, materialFee: 15000, refundFee: 42000, targetDate: '2026-08-12', memo: '시간표 중복 취소' },
      { id: 'c_904', courseId: '1552328', courseTitle: '[26년 8월] 창의수학 1부', instructorName: '김경아', gradeClass: '2학년 3반', studentNum: 2, studentName: '김지민', parentPhone: '010-1234-9876', tuitionFee: 35000, materialFee: 5000, refundFee: 35000, targetDate: '2026-08-05', memo: '적응 곤란 환불' }
    ];

    let candidates = cancelPool;
    if (sln) {
      candidates = candidates.filter(a => String(a.courseId) === String(sln));
      if (candidates.length === 0) {
        candidates = [cancelPool[0]];
      }
    }

    targetStudents = candidates.map((a, idx) => ({
      seq: idx + 1,
      period: curPeriod,
      courseTitle: a.courseTitle,
      instructorName: a.instructorName,
      gradeClass: a.gradeClass,
      studentNum: a.studentNum,
      studentName: a.studentName,
      parentPhone: a.parentPhone,
      tuitionFee: a.tuitionFee,
      refundFee: a.refundFee,
      targetDate: a.targetDate,
      memo: a.memo
    }));
  }

  const dateColHeader = isAddition ? '추가일자' : '최종수강일(취소일)';
  const feeColHeader = isAddition ? '재료비' : '환불금액';

  let tableRows = '';
  targetStudents.forEach(s => {
    tableRows += `
      <tr>
        <td style="text-align:center; mso-number-format:'\\@';">${s.seq}</td>
        <td style="text-align:center;">${s.period}</td>
        <td style="text-align:left;">${s.courseTitle}</td>
        <td style="text-align:center;">${s.instructorName}</td>
        <td style="text-align:center;">${s.gradeClass}</td>
        <td style="text-align:center; mso-number-format:'\\@';">${s.studentNum}</td>
        <td style="text-align:center;">${s.studentName}</td>
        <td style="text-align:center; mso-number-format:'\\@';">${s.parentPhone}</td>
        <td style="text-align:right; mso-number-format:'\\#,##0';">${s.tuitionFee.toLocaleString()}</td>
        <td style="text-align:right; mso-number-format:'\\#,##0';">${(isAddition ? s.materialFee : s.refundFee).toLocaleString()}</td>
        <td style="text-align:center; mso-number-format:'yyyy-mm-dd';">${s.targetDate}</td>
        <td style="text-align:left;">${s.memo || ''}</td>
      </tr>
    `;
  });

  const conditionText = com_gubun === '1' ? `현재/이전 강좌 비교 [현재: ${curPeriod} / 이전: ${prevPeriod}]` : `수강생의 추가일자 & 최종수강일(환불/취소) 기준 [${curPeriod}]`;

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>${typeTitle}</x:Name>
          <x:WorksheetOptions>
            <x:DisplayGridlines/>
          </x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    table { border-collapse: collapse; font-family: '맑은 고딕', Malgun Gothic, sans-serif; font-size: 11pt; }
    th { background-color: #f2f4f7; color: #111; font-weight: bold; border: 1px solid #c0c0c0; padding: 6px 10px; text-align: center; }
    td { border: 1px solid #d0d0d0; padding: 5px 8px; font-size: 10pt; vertical-align: middle; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: center; color: #204d74; padding: 10px; }
    .info-cell { font-size: 10pt; color: #555; padding: 4px; }
  </style>
</head>
<body>
  <table>
    <tr>
      <td colspan="12" class="title-cell">광주풍향초등학교 늘봄학교 ${typeTitle} 명단</td>
    </tr>
    <tr>
      <td colspan="12" class="info-cell">■ 검색 조건: ${conditionText} &nbsp;|&nbsp; ■ 출력 일시: ${new Date().toLocaleString('ko-KR')} &nbsp;|&nbsp; ■ 총 인원: ${targetStudents.length}명</td>
    </tr>
    <tr>
      <th style="width:50px;">연번</th>
      <th style="width:80px;">강좌구분</th>
      <th style="width:200px;">강좌명</th>
      <th style="width:90px;">강사명</th>
      <th style="width:90px;">학년반</th>
      <th style="width:50px;">번호</th>
      <th style="width:90px;">학생명</th>
      <th style="width:120px;">학부모연락처</th>
      <th style="width:90px;">수강료(원)</th>
      <th style="width:90px;">${feeColHeader}(원)</th>
      <th style="width:110px;">${dateColHeader}</th>
      <th style="width:160px;">비고</th>
    </tr>
    ${tableRows}
  </table>
</body>
</html>
  `.trim();

  let filenameCourse = sln ? '_선택강좌' : '_전체';
  let filename = `${curPeriod.replace(/\s+/g, '')}_${typeTitle.replace(/\s+/g, '')}${filenameCourse}.xls`;

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
  return res.send(Buffer.from(excelHtml, 'utf-8'));
}

app.post('/api/af/ad_app/com/excel', generateComExcelHandler);
app.get('/api/af/ad_app/com/excel', generateComExcelHandler);
app.post(/^\/af\/ad_app\/com\/p\//, generateComExcelHandler);

// dbdbschool Page Routing Fallback Middleware (Matches all live dbdbschool URL patterns)
app.use((req, res, next) => {
  if (req.path && req.path.startsWith('/admin/') && !req.path.includes('.')) {
    return res.sendFile(path.join(__dirname, 'admin', 'index.html'));
  }
  if (req.path && req.path.startsWith('/af/ad_app/copy/')) {
    return res.sendFile(path.join(__dirname, 'af', 'ad_app', 'copy', 'sn', '3267', 'index.html'));
  }
  next();
});

// API for retrieving courses (mock)
app.get('/api/af/ad_app/sin-courses', (req, res) => {
  const period = req.query.period || 'all';
  const category = req.query.category || 'all';
  const keyword = req.query.keyword || '';

  // Use the coursesDb mock data if it exists in the server, or return static list
  let courses = [
    { id: '1342532', title: '[3월] (금)돌봄 1부', teacherName: '돌봄전담사', currentCount: 4, operatingPeriod: '3월', category: '돌봄' },
    { id: '1342533', title: '[3월] (금)돌봄 2부', teacherName: '돌봄전담사', currentCount: 14, operatingPeriod: '3월', category: '돌봄' },
    { id: '1342476', title: '[3월] 논술 1부', teacherName: '박지숙', currentCount: 0, operatingPeriod: '3월', category: '방과후' },
    { id: '1381243', title: '[26년 4월] 뉴스포츠 1부', teacherName: '박지연', currentCount: 30, operatingPeriod: '26년 4월', category: '방과후' }
  ];

  if (period !== 'all') {
    courses = courses.filter(c => c.operatingPeriod === period);
  }
  if (category !== 'all') {
    courses = courses.filter(c => c.category === category);
  }
  if (keyword) {
    courses = courses.filter(c => c.title.includes(keyword) || c.teacherName.includes(keyword));
  }

  return res.json({ success: true, courses, appliedCount: 0 });
});

// API for copying applicants
app.post('/api/af/ad_app/copy', (req, res) => {
  const { sourceCourseId, targetCourseId, inputType, options } = req.body;
  
  if (!sourceCourseId || !targetCourseId) {
    return res.status(400).json({ success: false, message: 'Missing course IDs' });
  }

  // Mock applicant array
  if (typeof applicantDb === 'undefined') {
    global.applicantDb = [];
  }

  // Find source applicants (mocked logic)
  const sourceApplicants = global.applicantDb.filter(a => a.courseId === sourceCourseId);
  
  if (inputType === 'clear') {
    global.applicantDb = global.applicantDb.filter(a => a.courseId !== targetCourseId);
  }

  // Copy logic
  sourceApplicants.forEach(a => {
    global.applicantDb.push({
      ...a,
      id: 'app_' + Date.now() + Math.random(),
      courseId: targetCourseId,
      // Apply options if needed
    });
  });

  return res.json({ success: true, message: '복사 완료', copiedCount: sourceApplicants.length });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`🚀 [늘봄학교 SaaS 플랫폼] 서버 구동 완료: http://localhost:${PORT}`);
});