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

// Official dbdbschool URL direct handler: /help/go_data/num/:num/data/:type
app.get('/help/go_data/num/:num/data/:type', (req, res) => {
  const { num, type } = req.params;
  if (type === 'video' || type === 'mov') {
    return res.redirect(`https://www.youtube.com/results?search_query=dbdbschool+manual+${num}`);
  }
  return res.redirect(`/api/manual/doc/${num}`);
});

// Serve static files first
app.use(express.static(path.join(__dirname)));

// dbdbschool Page Routing Fallback Middleware (Matches all live dbdbschool URL patterns)
app.use((req, res, next) => {
  if (req.path && (req.path.startsWith('/af/') || req.path.startsWith('/sczigi/'))) {
    if (req.path.endsWith('.js') || req.path.endsWith('.css') || req.path.endsWith('.png') || req.path.endsWith('.ico') || req.path.endsWith('.jpg')) {
      return next();
    }
    return res.sendFile(path.join(__dirname, 'af', 'ad_lec', 'lists', 'sn', 'index.html'));
  }
  next();
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`🚀 [늘봄학교 SaaS 플랫폼] 서버 구동 완료: http://localhost:${PORT}`);
});