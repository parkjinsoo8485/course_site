const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authenticateToken } = require('../middleware/auth');

// GET & POST /api/qa (클래스 Q&A 게시판)
router.get('/qa', (req, res) => {
  const { courseId, schoolCode } = req.query;
  const school = db.findSchoolByCode((schoolCode || 'UNCHON2025').toUpperCase());
  const schoolId = school ? school.id : 'sch_1';

  const questions = db.getQABoard(schoolId, courseId);
  return res.json({ success: true, questions });
});

router.post('/qa', (req, res) => {
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

router.put('/qa/:id/reply', authenticateToken, (req, res) => {
  const { reply } = req.body;
  const updated = db.replyQA(req.params.id, reply);
  if (!updated) return res.status(404).json({ success: false, message: '질문을 찾을 수 없습니다.' });
  return res.json({ success: true, qa: updated, message: '강사 답변이 등록되었습니다.' });
});

// GET & POST /api/safety/return-schedules (귀가 일정표)
router.get('/safety/return-schedules', (req, res) => {
  const { studentName, schoolCode } = req.query;
  const school = db.findSchoolByCode((schoolCode || 'UNCHON2025').toUpperCase());
  const schoolId = school ? school.id : 'sch_1';

  const schedules = db.getSafetySchedules(schoolId, studentName);
  return res.json({ success: true, schedules });
});

router.post('/safety/return-schedules', (req, res) => {
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

router.delete('/safety/return-schedules/:id', (req, res) => {
  const deleted = db.deleteSafetySchedule(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: '귀가 일정을 찾을 수 없습니다.' });
  return res.json({ success: true, message: '귀가 일정표가 삭제되었습니다.' });
});

// GET & POST /api/safety/absence (결석 및 조퇴 신청)
router.get('/safety/absence', authenticateToken, (req, res) => {
  const absenceList = db.getAbsenceRequests(req.user.schoolId);
  return res.json({ success: true, absenceList });
});

router.post('/safety/absence', (req, res) => {
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

module.exports = router;
