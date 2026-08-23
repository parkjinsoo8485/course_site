const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/instructor/courses
router.get('/courses', authenticateToken, (req, res) => {
  const courses = db.getCoursesBySchool(req.user.schoolId);
  return res.json({ success: true, courses });
});

// GET /api/attendance?courseId=...&date=...
router.get('/attendance', authenticateToken, (req, res) => {
  const { courseId, date } = req.query;
  const records = db.getAttendanceByCourseAndDate(req.user.schoolId, courseId, date);
  return res.json({ success: true, records });
});

// POST /api/attendance/check
router.post('/attendance/check', authenticateToken, (req, res) => {
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

// GET /api/settlements
router.get('/settlements', authenticateToken, (req, res) => {
  const settlements = db.getSettlementsBySchool(req.user.schoolId);
  return res.json({ success: true, settlements });
});

// POST /api/settlements
router.post('/settlements', authenticateToken, (req, res) => {
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
router.put('/settlements/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  const updated = db.updateSettlementStatus(req.params.id, req.user.schoolId, status);
  if (!updated) return res.status(404).json({ success: false, message: '정산 항목을 찾을 수 없습니다.' });
  return res.json({ success: true, settlement: updated, message: '정산 상태가 변경되었습니다.' });
});

// GET /api/financials/edufine (에듀파인 강사료/수용비 엑셀 집계)
router.get('/financials/edufine', authenticateToken, (req, res) => {
  const edufineData = db.getEdufineExport(req.user.schoolId);
  return res.json({ success: true, edufineData });
});

module.exports = router;
