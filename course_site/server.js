require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const db = require('./utils/db');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'neulbom_saas_super_secret_jwt_key_2026';

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false // Allow loading inline scripts & cdn resources for smooth developer demo
}));
app.use(express.json());

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

// Serve static files
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`🚀 [늘봄학교 SaaS 플랫폼] 서버 구동 완료: http://localhost:${PORT}`);
});