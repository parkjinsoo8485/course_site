const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authenticateToken } = require('../middleware/auth');
const lotteryService = require('../services/lotteryService');
const settlementService = require('../services/settlementService');
const refundService = require('../services/refundService');

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

// GET /api/courses
router.get('/courses', authenticateToken, (req, res) => {
  const courses = db.getCoursesBySchool(req.user.schoolId);
  return res.json({ success: true, courses });
});

// POST /api/courses
router.post('/courses', authenticateToken, (req, res) => {
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
router.post('/courses/auto-renew', authenticateToken, (req, res) => {
  const renewed = db.autoRenewCourses(req.user.schoolId);
  return res.json({ success: true, message: `월별 수강 자동 연장이 완료되었습니다. (총 ${renewed}건 연장)` });
});

// DELETE /api/courses/:id
router.delete('/courses/:id', authenticateToken, (req, res) => {
  const courseId = req.params.id;
  const deleted = db.deleteCourse(courseId, req.user.schoolId);
  if (!deleted) {
    return res.status(404).json({ success: false, message: '해당 강좌를 찾을 수 없거나 삭제 권한이 없습니다.' });
  }
  return res.json({ success: true, message: '강좌가 삭제되었습니다.' });
});

// POST /api/courses/check-conflict (시간표 수강신청 중복 감지 API)
router.post('/courses/check-conflict', (req, res) => {
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

// POST /api/lottery/execute (추첨제 추첨 실행)
router.post('/lottery/execute', authenticateToken, (req, res) => {
  const { courseId } = req.body;
  if (!courseId) return res.status(400).json({ success: false, message: '강좌 ID를 지정해 주세요.' });

  const result = db.executeLottery(req.user.schoolId, courseId);
  if (result.error) return res.status(400).json({ success: false, message: result.error });

  return res.json(result);
});

// GET /api/applicants
router.get('/applicants', authenticateToken, (req, res) => {
  const applicants = db.getApplicantsBySchool(req.user.schoolId);
  return res.json({ success: true, applicants });
});

// PUT /api/applicants/:id/status
router.put('/applicants/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  const updated = db.updateApplicantStatus(req.params.id, req.user.schoolId, status);
  if (!updated) return res.status(404).json({ success: false, message: '신청자를 찾을 수 없습니다.' });
  return res.json({ success: true, applicant: updated, message: '신청자 상태가 변경되었습니다.' });
});

// DELETE /api/applicants/:id
router.delete('/applicants/:id', authenticateToken, (req, res) => {
  const deleted = db.deleteApplicant(req.params.id, req.user.schoolId);
  if (!deleted) return res.status(404).json({ success: false, message: '신청자를 찾을 수 없습니다.' });
  return res.json({ success: true, message: '수강 신청 정보가 삭제되었습니다.' });
});

// GET /api/waitlist
router.get('/waitlist', authenticateToken, (req, res) => {
  const waitlist = db.getWaitlistBySchool(req.user.schoolId);
  return res.json({ success: true, waitlist });
});

// POST /api/waitlist/:id/promote
router.post('/waitlist/:id/promote', authenticateToken, (req, res) => {
  const promoted = db.promoteWaitlist(req.params.id, req.user.schoolId);
  if (!promoted) return res.status(404).json({ success: false, message: '대기자를 찾을 수 없습니다.' });
  return res.json({ success: true, applicant: promoted, message: '대기자가 수강 신청자로 전환 승인되었습니다!' });
});

// DELETE /api/waitlist/:id
router.delete('/waitlist/:id', authenticateToken, (req, res) => {
  const deleted = db.deleteWaitlist(req.params.id, req.user.schoolId);
  if (!deleted) return res.status(404).json({ success: false, message: '대기자를 찾을 수 없습니다.' });
  return res.json({ success: true, message: '대기자 명단에서 취소 삭제되었습니다.' });
});

module.exports = router;
