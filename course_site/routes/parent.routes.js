const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const refundService = require('../services/refundService');

// GET /api/parent/courses?schoolCode=UNCHON2025
router.get('/courses', (req, res) => {
  const schoolCode = (req.query.schoolCode || 'UNCHON2025').trim().toUpperCase();
  const school = db.findSchoolByCode(schoolCode);
  if (!school) return res.status(404).json({ success: false, message: '학교를 찾을 수 없습니다.' });

  const courses = db.getCoursesBySchool(school.id);
  return res.json({ success: true, schoolName: school.name, schoolId: school.id, courses });
});

// GET /api/parent/lookup?phone=010-1234-5678&schoolCode=UNCHON2025
router.get('/lookup', (req, res) => {
  const { phone, schoolCode } = req.query;
  if (!phone) return res.status(400).json({ success: false, message: '보호자 연락처를 입력하세요.' });

  const school = db.findSchoolByCode((schoolCode || 'UNCHON2025').toUpperCase());
  const schoolId = school ? school.id : null;

  const data = db.getApplicantsByParentPhone(phone, schoolId);
  return res.json({ success: true, ...data });
});

// POST /api/parent/apply (시간표 겹침 방지 검증 포함 수강신청)
router.post('/apply', (req, res) => {
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
router.post('/cancel', (req, res) => {
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

// GET /api/parent/absence (학부모 신청 결석 내역 조회)
router.get('/absence', (req, res) => {
  const { phone, schoolCode } = req.query;
  const school = db.findSchoolByCode((schoolCode || 'UNCHON2025').toUpperCase());
  const schoolId = school ? school.id : 'sch_1';

  const absenceList = db.getAbsenceRequests(schoolId, phone);
  return res.json({ success: true, absenceList });
});

// DELETE /api/parent/absence/:id
router.delete('/absence/:id', (req, res) => {
  const deleted = db.deleteAbsenceRequest(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: '결석 신청건을 찾을 수 없습니다.' });
  return res.json({ success: true, message: '결석/조퇴 신청이 취소되었습니다.' });
});

// POST /api/refunds/calculate (일할/주할 분할 환불 금액 계산 API)
router.post('/refund-calculate', (req, res) => {
  try {
    const { tuitionFee, fee, totalDays, attendedDays } = req.body;
    const targetFee = tuitionFee !== undefined ? tuitionFee : fee;
    const refundAmount = refundService.calculateRefundAmount(targetFee, totalDays, attendedDays);
    return res.json({
      success: true,
      tuitionFee: parseInt(targetFee) || 0,
      fee: parseInt(targetFee) || 0,
      totalDays: parseInt(totalDays) || 20,
      attendedDays: parseInt(attendedDays) || 0,
      refundAmount,
      message: `전체 ${totalDays || 20}일 중 ${attendedDays || 0}일 수강 후 예상 환불액: ${refundAmount.toLocaleString()}원`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: '환불 금액 계산 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
