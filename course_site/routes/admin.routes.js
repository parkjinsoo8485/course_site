const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authenticateToken } = require('../middleware/auth');
const manualData = require('../utils/manualData');

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

// GET /api/schools/verify-code
router.get('/schools/verify-code', (req, res) => {
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

// POST /api/subscription/renew
router.post('/subscription/renew', authenticateToken, (req, res) => {
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

// ==================== dbdbschool (/af/ad_lec/lists/sn/[school_id]) CLONE APIs ====================

// GET /api/af/ad_lec/lists/sn/:school_id (강좌 목록 조회)
router.get('/af/ad_lec/lists/sn/:school_id', (req, res) => {
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
router.post('/af/ad_lec/create', (req, res) => {
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
router.post('/af/ad_lec/batch-copy', (req, res) => {
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
router.patch('/af/ad_lec/status', (req, res) => {
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
router.patch('/af/ad_lec/instructor-close', (req, res) => {
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
router.post('/af/ad_lec/copy', (req, res) => {
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
router.post('/af/ad_lec/batch-upload', (req, res) => {
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
router.get('/af/ad_lec/stats', (req, res) => {
  try {
    const schoolId = resolveSchoolId(req.query.schoolId);
    const stats = db.getCourseStatistics(schoolId);
    return res.json({ success: true, stats });
  } catch (err) {
    return res.status(500).json({ success: false, message: '강좌 통계를 불러오는 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_lec/apply-facility-fee (3.9 강좌 수용비 신청자 일괄 적용)
router.post('/af/ad_lec/apply-facility-fee', (req, res) => {
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
router.post('/af/ad_lec/batch-teacher-lock', (req, res) => {
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
router.get('/af/ad_lec/export-neis', (req, res) => {
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
router.get('/af/ad_lec/export-edufine', (req, res) => {
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
router.post('/af/ad_lec/lottery', (req, res) => {
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

// GET /api/af/ad_stu/lists/sn/:school_id (수강 신청자 명단)
router.get('/af/ad_stu/lists/sn/:school_id', (req, res) => {
  const schoolId = resolveSchoolId(req.params.school_id);
  const applicants = db.getApplicantsBySchool(schoolId);
  const waitlist = db.data.waitlist ? db.data.waitlist.filter(w => w.schoolId === schoolId) : [];
  return res.json({ success: true, applicants, waitlist });
});

// PATCH /api/af/ad_stu/approval (수강 승인 / 강제 취소)
router.patch('/af/ad_stu/approval', (req, res) => {
  const { schoolId, applicantId, status } = req.body;
  const targetSchoolId = resolveSchoolId(schoolId);
  const updated = db.updateApplicantStatus(targetSchoolId, applicantId, status || '승인');
  if (!updated) return res.status(404).json({ success: false, message: '신청 내역을 찾을 수 없습니다.' });
  return res.json({ success: true, applicant: updated, message: `수강 상태가 '${status}'(으)로 변경되었습니다.` });
});

// POST /api/af/ad_stu/transfer (학생 학적 일괄 이관)
router.post('/af/ad_stu/transfer', (req, res) => {
  const { schoolId, fromGrade, toGrade } = req.body;
  const targetSchoolId = resolveSchoolId(schoolId);
  const count = db.transferGradeClass(targetSchoolId, fromGrade || '1학년', toGrade || '2학년');
  return res.json({ success: true, transferredCount: count, message: `${count}명의 학생 학적이 '${toGrade}'(으)로 이관되었습니다.` });
});

// GET /api/af/ad_sms/templates (알림톡 템플릿 목록)
router.get('/af/ad_sms/templates', (req, res) => {
  const templates = db.getSmsTemplates();
  return res.json({ success: true, templates });
});

// POST /api/af/ad_sms/send (카카오 알림톡 / SMS 단체 발송)
router.post('/af/ad_sms/send', (req, res) => {
  const { schoolId, recipientCount, templateId, message } = req.body;
  const targetSchoolId = resolveSchoolId(schoolId);
  const log = db.sendBulkSms(targetSchoolId, { recipientCount, templateId, message });
  return res.json({ success: true, log, message: `${log.recipientCount}명에게 카카오 알림톡 발송이 완료되었습니다.` });
});

// GET /api/af/ad_sms/history/sn/:school_id (발송 이력)
router.get('/af/ad_sms/history/sn/:school_id', (req, res) => {
  const schoolId = resolveSchoolId(req.params.school_id);
  const logs = db.getSmsHistory(schoolId);
  return res.json({ success: true, logs });
});

// PATCH /api/af/ad_safety/absence/approve (결석/조퇴 승인 처리)
router.patch('/af/ad_safety/absence/approve', (req, res) => {
  const { id, status } = req.body;
  const updated = db.approveAbsenceRequest(id, status || '승인완료');
  if (!updated) return res.status(404).json({ success: false, message: '결석 신청건을 찾을 수 없습니다.' });
  return res.json({ success: true, absence: updated, message: '결석/조퇴 신청이 승인 처리되었습니다.' });
});

// GET /api/af/ad_faq/main (FAQ 및 매뉴얼 가이드 목록)
router.get('/af/ad_faq/main', (req, res) => {
  const faqs = db.getFaqList();
  return res.json({ success: true, faqs });
});

// GET & POST Settings APIs
router.get('/settings/basic', (req, res) => {
  const settings = db.getBasicSettings();
  return res.json({ success: true, settings });
});

router.post('/settings/basic', (req, res) => {
  const settings = db.updateBasicSettings(req.body);
  return res.json({ success: true, settings, message: '기본 설정이 성공적으로 저장되었습니다.' });
});

router.get('/settings/instructor-permissions', (req, res) => {
  const permissions = db.getInstructorPermissions();
  return res.json({ success: true, permissions });
});

router.post('/settings/instructor-permissions', (req, res) => {
  const permissions = db.updateInstructorPermissions(req.body);
  return res.json({ success: true, permissions, message: '강사 권한 옵션이 저극 반영되었습니다.' });
});

router.get('/settings/attendance-options', (req, res) => {
  const options = db.getAttendanceOptions();
  return res.json({ success: true, options });
});

router.post('/settings/attendance-options', (req, res) => {
  const options = db.updateAttendanceOptions(req.body);
  return res.json({ success: true, options, message: '출석부 설정이 저장되었습니다.' });
});

// ==================== Live dbdbschool 29 Submodels REST APIs ====================

// 1. 대기자관리 (/af/ad_wait/lists)
router.get('/af/ad_wait/lists', (req, res) => {
  const waitlist = db.getWaitlist('sch_1');
  return res.json({ success: true, count: waitlist.length, waitlist });
});

router.post('/af/ad_wait/promote', (req, res) => {
  const { waitId } = req.body;
  const promoted = db.promoteWaitlist(waitId);
  if (promoted) {
    return res.json({ success: true, message: `'${promoted.studentName}' 학생이 대기에서 정규 수강생으로 승격되었습니다.`, promoted });
  }
  return res.status(404).json({ success: false, message: '대기자를 찾을 수 없습니다.' });
});

// 2. 출석부관리 (/af/ad_att/stat)
router.get('/af/ad_att/stat', (req, res) => {
  const stats = db.getAttendanceStats('sch_1');
  return res.json({ success: true, stats });
});

router.post('/af/ad_att/stamp', (req, res) => {
  const { courseId } = req.body;
  return res.json({ success: true, message: `선택 강좌의 ${new Date().getMonth() + 1}월 출석부에 학교장 직인이 날인 처리되었습니다.` });
});

// 3. 환불/취소관리 (/af/ad_ref/lists)
router.get('/af/ad_ref/lists', (req, res) => {
  const refunds = db.getRefunds('sch_1');
  return res.json({ success: true, count: refunds.length, refunds });
});

router.post('/af/ad_ref/create', (req, res) => {
  const newRef = db.addRefund('sch_1', req.body);
  return res.json({ success: true, message: `'${newRef.studentName}' 학생의 환불 요청(${newRef.refundAmount.toLocaleString()}원)이 등록되었습니다.`, refund: newRef });
});

// 4. 결석/귀가신청 (/af/ad_abs/lists)
router.get('/af/ad_abs/lists', (req, res) => {
  const absences = db.getAbsences('sch_1');
  return res.json({ success: true, count: absences.length, absences });
});

router.post('/af/ad_abs/status', (req, res) => {
  const { id, status } = req.body;
  const updated = db.updateAbsenceStatus(id, status);
  return res.json({ success: true, message: `결석/조퇴 신청이 '${status}' 처리되었습니다.`, item: updated });
});

// 5. 강사관리 (/af/ad_tea/lists)
router.get('/af/ad_tea/lists', (req, res) => {
  const teachers = db.getInstructors('sch_1');
  return res.json({ success: true, count: teachers.length, teachers });
});

// 6. 알림관리 (/af/notification/lists)
router.get('/af/notification/lists', (req, res) => {
  const notifications = db.getNotifications('sch_1');
  return res.json({ success: true, count: notifications.length, notifications });
});

// 7. 푸시알림관리 (/af/spush/lists)
router.get('/af/spush/lists', (req, res) => {
  const pushNotifications = db.getPushNotifications('sch_1');
  return res.json({ success: true, count: pushNotifications.length, pushNotifications });
});

router.post('/af/spush/send', (req, res) => {
  const { title, body } = req.body;
  return res.json({ success: true, message: `[${title}] 모바일 앱 푸시 알림이 전체 학생/학부모에게 발송되었습니다.` });
});

// 8. 연장신청 (/af/ad_extension/lists)
router.get('/af/ad_extension/lists', (req, res) => {
  const extensions = db.getServiceExtensions('sch_1');
  return res.json({ success: true, extensions });
});

// 9. 지원금관리 4개 서브엔드포인트
router.get('/af/ad_free2_stu/lists', (req, res) => {
  const students = db.getSubsidyStudents('sch_1');
  return res.json({ success: true, students });
});

router.get('/af/ad_free2_app/lists', (req, res) => {
  const applicants = db.getSubsidyApplicants('sch_1');
  return res.json({ success: true, applicants });
});

router.get('/af/ad_free2_cfg/main', (req, res) => {
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

router.get('/af/ad_free2_cfg/free1', (req, res) => {
  const ranks = db.getSubsidyRanks('sch_1');
  return res.json({ success: true, ranks });
});

// 10. 설문관리 2개 서브엔드포인트
router.get('/af/ad_sur/lists', (req, res) => {
  const surveys = db.getSurveys('sch_1');
  return res.json({ success: true, surveys });
});

router.get('/af/ad_surs/lists', (req, res) => {
  const sampleSurveys = db.getSampleSurveys();
  return res.json({ success: true, sampleSurveys });
});

// 11. 환경설정 서브엔드포인트
router.get('/af/ad_cfg/period', (req, res) => {
  const periods = db.getPeriods('sch_1');
  return res.json({ success: true, periods });
});

router.get('/af/ad_cfg/afDiv', (req, res) => {
  const divisions = db.getAfDivisions('sch_1');
  return res.json({ success: true, divisions });
});

router.get('/af/ad_time/lists', (req, res) => {
  const periods = db.getApplyPeriods('sch_1');
  return res.json({ success: true, periods });
});

router.get('/af/ad_info/modify', (req, res) => {
  const info = db.getManagerInfo('sch_1');
  return res.json({ success: true, info });
});

router.post('/af/ad_info/modify', (req, res) => {
  const updated = db.updateManagerInfo('sch_1', req.body);
  return res.json({ success: true, message: '담당자 및 학교 정보가 성공적으로 수정되었습니다.', info: updated });
});

router.post('/af/ad_cfg/clear', (req, res) => {
  return res.json({ success: true, message: '선택하신 운영구분의 신청/수납/출결 데이터가 안전하게 초기화되었습니다.' });
});

// 12. 학교관리 (/sczigi/service/lists)
router.get('/sczigi/service/lists', (req, res) => {
  const schools = db.getAllSchools();
  return res.json({ success: true, schools });
});

// 13. Manual & FAQ Master Endpoints (/af/ad_faq/main)
router.get('/manual/all', (req, res) => {
  return res.json({
    success: true,
    operations: manualData.OPERATIONS_STEPS,
    templates: manualData.TEMPLATE_DOWNLOADS,
    manuals: manualData.MANUAL_DOWNLOADS,
    faqs: manualData.FAQ_CATEGORIES
  });
});

router.get('/manual/doc/:id', (req, res) => {
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

router.get('/manual/download/:fileId', (req, res) => {
  const { fileId } = req.params;
  let filename = `${fileId}.zip`;
  if (fileId.includes('mp4')) filename = 'student_guide.mp4';
  if (fileId.includes('banner')) filename = 'dbdbschool_banner.png';
  if (fileId.includes('popup')) filename = 'dbdbschool_popup.png';
  
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/octet-stream');
  return res.send(Buffer.from(`DBDBSCHOOL MANUAL FILE DATA: ${fileId}`));
});

// ---------------- Section 2 (Official Manual) Endpoints ----------------
router.get('/manual/staff', (req, res) => {
  const staff = db.getStaff('sch_1');
  return res.json({ success: true, staff });
});

router.post('/manual/staff', (req, res) => {
  const { name, role, permissions } = req.body;
  if (!name) return res.status(400).json({ success: false, message: '교직원 이름을 입력하세요.' });
  const newStaff = db.addStaff('sch_1', { name, role, permissions });
  return res.json({ success: true, staff: newStaff, message: `교직원 '${name}'님이 등록되었습니다.` });
});

router.post('/manual/service-admin', (req, res) => {
  const { staffId, permissions } = req.body;
  const admin = db.assignServiceAdmin('sch_1', staffId, permissions);
  if (!admin) return res.status(404).json({ success: false, message: '교직원을 찾을 수 없습니다.' });
  return res.json({ success: true, admin, message: `'${admin.name}'님이 서비스 관리자로 지정되었습니다.` });
});

router.post('/manual/temp-student', (req, res) => {
  const { name, birthDate, phone } = req.body;
  if (!name || !birthDate) return res.status(400).json({ success: false, message: '학생 이름과 생년월일을 입력하세요.' });
  const tempStudent = db.generateTempStudent('sch_1', { name, birthDate, phone });
  return res.json({
    success: true,
    student: tempStudent,
    message: `[신학기 임시학적] '${name}' 학생에게 '${tempStudent.gradeClass}'이(가) 부여되었습니다.`
  });
});

router.get('/manual/multi-child', (req, res) => {
  const { phone } = req.query;
  const children = db.getMultiChildAccounts(phone || '010-2345-6789');
  return res.json({ success: true, children });
});

router.get('/manual/homeroom', (req, res) => {
  const teachers = db.getHomeroomTeachers('sch_1');
  return res.json({ success: true, teachers });
});

router.post('/manual/homeroom', (req, res) => {
  const { name, assignedClass, phone } = req.body;
  if (!name || !assignedClass) return res.status(400).json({ success: false, message: '담임 교사명과 담당 학급을 입력하세요.' });
  const newHR = db.addHomeroomTeacher('sch_1', { name, assignedClass, phone });
  return res.json({ success: true, teacher: newHR, message: `'${name}' 선생님이 '${assignedClass}' 담임으로 등록되었습니다.` });
});

router.get('/manual/instructors', (req, res) => {
  const instructors = db.getInstructors('sch_1');
  return res.json({ success: true, instructors });
});

router.get('/manual/instructor-banking-groups', (req, res) => {
  const groups = db.getInstructorBankingGroups('sch_1');
  return res.json({ success: true, groups });
});

router.get('/manual/sms-config', (req, res) => {
  const config = db.getSmsConfig('sch_1');
  return res.json({ success: true, config });
});

router.post('/manual/sms-config', (req, res) => {
  const updated = db.updateSmsConfig('sch_1', req.body);
  return res.json({ success: true, config: updated, message: '문자 및 발신번호 설정이 저장되었습니다.' });
});

router.get('/manual/restriction-groups', (req, res) => {
  const groups = db.getRestrictionGroups('sch_1');
  return res.json({ success: true, groups });
});

router.post('/manual/restriction-groups', (req, res) => {
  const { code, name, description } = req.body;
  if (!code || !name) return res.status(400).json({ success: false, message: '그룹 코드와 그룹명을 입력하세요.' });
  const newGroup = db.addRestrictionGroup('sch_1', { code, name, description });
  return res.json({ success: true, group: newGroup, message: `중복제한그룹 [${code}] '${name}'이(가) 등록되었습니다.` });
});

router.get('/manual/notice-settings', (req, res) => {
  const settings = db.getNoticeSettings('sch_1');
  return res.json({ success: true, settings });
});

router.post('/manual/notice-settings', (req, res) => {
  const updated = db.updateNoticeSettings('sch_1', req.body);
  return res.json({ success: true, settings: updated, message: '안내글 설정이 저장되었습니다.' });
});

// ================== Q&A 고객지원 게시판 API ==================

// GET /api/af/qanda/lists/sn/:school_id — 목록 조회 (진행상태/검색어 필터)
router.get('/af/qanda/lists/sn/:school_id', (req, res) => {
  const { school_id } = req.params;
  const { as, st, sw, p } = req.query; // as=진행상태, st=검색타입, sw=검색어, p=페이지
  const page = parseInt(p || '1', 10);
  const PER_PAGE = 20;

  let items = db.getQnaList ? db.getQnaList(school_id) : [];

  // 진행상태 필터
  if (as && as !== 'all') {
    items = items.filter(i => String(i.status) === String(as));
  }

  // 키워드 필터
  if (sw && sw.trim()) {
    const kw = sw.trim().toLowerCase();
    items = items.filter(i => {
      if (st === 'subject') return (i.subject || '').toLowerCase().includes(kw);
      if (st === 'contents') return (i.contents || '').toLowerCase().includes(kw);
      return (i.subject || '').toLowerCase().includes(kw) || (i.contents || '').toLowerCase().includes(kw);
    });
  }

  const total = items.length;
  const paged = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return res.json({ success: true, items: paged, total, page, perPage: PER_PAGE });
});

// GET /api/af/qanda/view/:id — 상세 조회
router.get('/af/qanda/view/:id', (req, res) => {
  const { id } = req.params;
  const item = db.getQnaById ? db.getQnaById(id) : null;
  if (!item) return res.status(404).json({ success: false, message: '해당 문의글을 찾을 수 없습니다.' });
  return res.json({ success: true, item });
});

// POST /api/af/qanda/create — 신규 문의 등록
router.post('/af/qanda/create', (req, res) => {
  const { school_id, authorName, hp1, hp2, hp3, phone, email, subject, contents, files } = req.body;
  if (!authorName || !subject || !contents) {
    return res.status(400).json({ success: false, message: '성명, 제목, 내용은 필수 항목입니다.' });
  }
  const newItem = db.createQna ? db.createQna({
    schoolId: school_id,
    authorName, hp1, hp2, hp3, phone, email, subject, contents,
    files: files || [],
    status: '0', // 접수
  }) : null;
  return res.json({ success: true, item: newItem, message: '고객지원 문의가 성공적으로 등록되었습니다.' });
});

// POST /api/af/qanda/reply — 관리자 답변 등록/수정
router.post('/af/qanda/reply', (req, res) => {
  const { id, replyContent, status } = req.body;
  if (!id || !replyContent) {
    return res.status(400).json({ success: false, message: '문의글 ID와 답변 내용은 필수입니다.' });
  }
  const updated = db.updateQnaReply ? db.updateQnaReply(id, { replyContent, status: status || '3' }) : null;
  if (!updated) return res.status(404).json({ success: false, message: '해당 문의글을 찾을 수 없습니다.' });
  return res.json({ success: true, item: updated, message: '답변이 성공적으로 저장되었습니다.' });
});

// POST /api/af/qanda/delete — 문의글 삭제
router.post('/af/qanda/delete', (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ success: false, message: '삭제할 문의글 ID가 필요합니다.' });
  const deleted = db.deleteQna ? db.deleteQna(id) : true;
  if (!deleted) return res.status(404).json({ success: false, message: '해당 문의글을 찾을 수 없습니다.' });
  return res.json({ success: true, message: '고객지원 문의글이 삭제되었습니다.' });
});

// ==================== 신청자관리 (/af/ad_app) APIs ====================

// GET /api/af/ad_app/lists/sn/:school_id (신청자 목록 및 통계)
router.get('/af/ad_app/lists/sn/:school_id', (req, res) => {
  try {
    const schoolId = resolveSchoolId(req.params.school_id);
    const { category, neulbomType, courseId, grade, classNum, paymentStatus, status, keyword, searchType, sortBy } = req.query;

    const items = db.getApplicantsBySchool(schoolId, { category, neulbomType, courseId, grade, classNum, paymentStatus, status, keyword, searchType, sortBy });
    const stats = db.getApplicantStats(schoolId);
    const school = db.findSchoolById(schoolId);

    return res.json({
      success: true,
      sn: req.params.school_id,
      school: school ? { id: school.id, name: school.name, code: school.code } : { id: 'sch_1', name: '광주풍향초등학교', code: 'GWANGJU3267' },
      totalCount: items.length,
      stats,
      items
    });
  } catch (err) {
    console.error('dbdbschool Applicant API Error:', err);
    return res.status(500).json({ success: false, message: '신청자 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

// GET /api/af/ad_app/view/:id (신청자 상세 조회)
router.get('/af/ad_app/view/:id', (req, res) => {
  try {
    const item = db.getApplicantById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: '해당 수강 신청 내역을 찾을 수 없습니다.' });
    }
    return res.json({ success: true, item });
  } catch (err) {
    console.error('dbdbschool Applicant Detail Error:', err);
    return res.status(500).json({ success: false, message: '신청 상세 정보를 불러오는 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_app/create (신청자 신규 등록)
router.post('/af/ad_app/create', (req, res) => {
  try {
    const { schoolId, category, neulbomType, studentName, gradeClass, studentNum, parentPhone, courseId, courseTitle, instructorName, subsidyType, tuitionFee, bookFee, materialFee, paymentStatus, status, bankName, schoolBankingAccount, depositorName, memo } = req.body;

    if (!studentName || !courseId) {
      return res.status(400).json({ success: false, message: '학생명과 신청 강좌는 필수 항목입니다.' });
    }

    const targetSchoolId = resolveSchoolId(schoolId);
    const newItem = db.createApplicant({
      schoolId: targetSchoolId,
      category,
      neulbomType,
      studentName,
      gradeClass,
      studentNum,
      parentPhone,
      courseId,
      courseTitle,
      instructorName,
      subsidyType,
      tuitionFee,
      bookFee,
      materialFee,
      paymentStatus,
      status,
      bankName,
      schoolBankingAccount,
      depositorName,
      memo
    });

    return res.json({
      success: true,
      item: newItem,
      message: '수강 신청이 성공적으로 등록되었습니다.'
    });
  } catch (err) {
    console.error('Applicant Create Error:', err);
    return res.status(500).json({ success: false, message: '수강 신청 등록 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_app/update (신청자 정보 수정)
router.post('/af/ad_app/update', (req, res) => {
  try {
    const { id, ...data } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: '수정할 신청자 ID가 필요합니다.' });
    }

    const updated = db.updateApplicant(id, data);
    if (!updated) {
      return res.status(404).json({ success: false, message: '해당 신청 내역을 찾을 수 없습니다.' });
    }

    return res.json({
      success: true,
      item: updated,
      message: '수강 신청 정보가 성공적으로 수정되었습니다.'
    });
  } catch (err) {
    console.error('Applicant Update Error:', err);
    return res.status(500).json({ success: false, message: '신청 정보 수정 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_app/delete (신청자 삭제)
router.post('/af/ad_app/delete', (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: '삭제할 신청자 ID가 필요합니다.' });
    }

    const deleted = db.deleteApplicant(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: '해당 신청 내역을 찾을 수 없습니다.' });
    }

    return res.json({
      success: true,
      message: '수강 신청이 삭제되었습니다.'
    });
  } catch (err) {
    console.error('Applicant Delete Error:', err);
    return res.status(500).json({ success: false, message: '신청 삭제 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_app/batch-upload (엑셀 일괄입력)
router.post('/af/ad_app/batch-upload', (req, res) => {
  try {
    const { schoolId, items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: '일괄 등록할 데이터가 없습니다.' });
    }

    const targetSchoolId = resolveSchoolId(schoolId);
    const created = db.batchCreateApplicants(targetSchoolId, items);

    return res.json({
      success: true,
      count: created.length,
      items: created,
      message: `${created.length}명의 수강 신청이 일괄 등록되었습니다.`
    });
  } catch (err) {
    console.error('Applicant Batch Upload Error:', err);
    return res.status(500).json({ success: false, message: '일괄 등록 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_app/batch-fee (수강료 일괄설정)
router.post('/af/ad_app/batch-fee', (req, res) => {
  try {
    const { schoolId, courseId, tuitionFee, bookFee, materialFee } = req.body;
    const targetSchoolId = resolveSchoolId(schoolId);
    const result = db.batchUpdateApplicantFees(targetSchoolId, { courseId, tuitionFee, bookFee, materialFee });
    const updatedCount = typeof result === 'object' ? (result.updatedCount ?? result.count ?? 0) : Number(result || 0);

    return res.json({
      success: true,
      updatedCount,
      count: updatedCount,
      message: `${updatedCount}건의 수강료가 일괄 적용되었습니다.`
    });
  } catch (err) {
    console.error('Applicant Batch Fee Error:', err);
    return res.status(500).json({ success: false, message: '수강료 일괄 수정 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_app/copy (신청자 일괄 복사)
router.post('/af/ad_app/copy', (req, res) => {
  try {
    const { schoolId, fromCategory, toCategory } = req.body;
    const targetSchoolId = resolveSchoolId(schoolId);
    const result = db.copyApplicants({ schoolId: targetSchoolId, fromCategory, toCategory });

    return res.json({
      success: true,
      copiedCount: result.copiedCount,
      message: `${result.copiedCount}명의 신청자가 '${toCategory || '다음 분기'}'(으)로 일괄 복사되었습니다.`
    });
  } catch (err) {
    console.error('Applicant Batch Copy Error:', err);
    return res.status(500).json({ success: false, message: '신청자 일괄 복사 중 오류가 발생했습니다.' });
  }
});

// GET /api/af/ad_app/school-banking/csv/sn/:school_id (스쿨뱅킹 CSV 데이터)
router.get('/af/ad_app/school-banking/csv/sn/:school_id', (req, res) => {
  try {
    const schoolId = resolveSchoolId(req.params.school_id);
    const items = db.getApplicantsBySchool(schoolId);

    // CSV header & rows
    const headers = ['연번', '학년반', '번호', '학생명', '강좌명', '수납금액', '은행명', '계좌번호', '예금주', '학부모연락처', '지원유형', '결제상태'];
    const rows = items.map((a, idx) => [
      idx + 1,
      `"${a.gradeClass}"`,
      `"${a.studentNum || ''}"`,
      `"${a.studentName}"`,
      `"${a.courseTitle}"`,
      a.totalFee || 0,
      `"${a.bankName || ''}"`,
      `"${a.schoolBankingAccount || ''}"`,
      `"${a.depositorName || ''}"`,
      `"${a.parentPhone}"`,
      `"${a.subsidyType}"`,
      `"${a.paymentStatus}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="school_banking_${req.params.school_id}_${Date.now()}.csv"`);
    return res.send(csvContent);
  } catch (err) {
    console.error('School Banking CSV Error:', err);
    return res.status(500).json({ success: false, message: '스쿨뱅킹 CSV 생성 중 오류가 발생했습니다.' });
  }
});


// ==================== 매뉴얼 API (/api/manual/*) ====================

// GET /api/manual/all — 수강신청 운영절차 + 양식 다운로드 + 매뉴얼 다운로드 + FAQ
router.get('/manual/all', (req, res) => {
  const { OPERATIONS_STEPS, TEMPLATE_DOWNLOADS, MANUAL_DOWNLOADS, FAQ_CATEGORIES } = manualData;
  return res.json({
    success: true,
    operations: OPERATIONS_STEPS.map(op => ({
      num: op.num,
      title: op.title,
      docId: op.docId,
      videoUrl: op.videoUrl || null
    })),
    templates: TEMPLATE_DOWNLOADS.map(t => ({
      id: t.id,
      title: t.title,
      types: t.types
    })),
    manuals: MANUAL_DOWNLOADS.map(m => ({
      id: m.id,
      title: m.title,
      isHighlight: !!m.isHighlight,
      types: m.types
    })),
    faqs: FAQ_CATEGORIES.map(cat => ({
      category: cat.category,
      column: cat.column,
      items: cat.items.map(item => ({
        q: item.q,
        docId: item.docId,
        videoUrl: item.videoUrl || null
      }))
    }))
  });
});

// GET /api/manual/doc/:docId — 문서 상세 내용 조회
router.get('/manual/doc/:docId', (req, res) => {
  const { OPERATIONS_STEPS } = manualData;
  const docId = parseInt(req.params.docId) || req.params.docId;

  const op = OPERATIONS_STEPS.find(o => o.docId == docId);
  if (op) {
    return res.json({
      success: true,
      doc: {
        id: op.docId,
        title: op.title,
        content: op.content || `### ${op.title}\n\n${op.summary || ''}`,
        summary: op.summary || '',
        videoUrl: op.videoUrl || null
      }
    });
  }

  // 일반 문서 ID (매뉴얼 다운로드 등) — 기본 응답
  return res.json({
    success: true,
    doc: {
      id: docId,
      title: `디비디비스쿨 문서 #${docId}`,
      content: `### 문서 #${docId}\n\n이 문서는 디비디비스쿨 공식 매뉴얼 문서입니다.\n실제 서비스에서는 해당 문서 PDF/HWP 파일이 표시됩니다.`,
      summary: '디비디비스쿨 관리자 매뉴얼 문서입니다.',
      videoUrl: null
    }
  });
});

// GET /api/manual/restriction-groups — 중복제한그룹 목록
router.get('/manual/restriction-groups', (req, res) => {
  return res.json({
    success: true,
    groups: [
      { code: 'GROUP_A', name: '돌봄 중복제한', description: '돌봄 1~4부 간 동일 시간대 중복 신청 방지' },
      { code: 'GROUP_B', name: '수영 중복제한', description: '수영 강좌 동일 시간대 중복 신청 방지' },
      { code: 'GROUP_C', name: '영어 중복제한', description: '영어회화 초급/중급 중복 신청 방지' }
    ]
  });
});

// ==================== 고객지원 게시판 API (/api/af/qanda/*) ====================

// 인메모리 Q&A 저장소 (서버 재시작 시 초기화 — 실서비스는 DB 연동)
let qaStore = [
  {
    id: '8806',
    num: 2,
    schoolSn: '3267',
    authorName: '김혜련',
    phone: '062-609-1182',
    email: 'khh147979@naver.com',
    subject: '2026학년도 1학기 늘봄학교 만족도 조사 설문지',
    contents: '2026학년도 바뀐 설문지 보내드립니다.\n감사합니다.',
    files: [{ id: 'f_1', name: '2026학년도1학기늘봄학교만족도조사설문지.hwp' }],
    status: '2',
    statusText: '완료',
    createdAt: '2026-06-01',
    answerDate: '06/01',
    answerContent: '자료 올려 주셔서 감사합니다.\n4가지 샘플 설문에 등록해드렸습니다.\n확인 바랍니다.'
  },
  {
    id: '3356',
    num: 1,
    schoolSn: '3267',
    authorName: '김혜련',
    phone: '062-609-1182',
    email: 'khh147979@naver.com',
    subject: '지원금 스쿨뱅킹 현황',
    contents: '1학기 지원금 스쿨뱅킹 수납 현황 파일 확인 부탁드립니다.',
    files: [],
    status: '2',
    statusText: '완료',
    createdAt: '2026-05-15',
    answerDate: '05/16',
    answerContent: '요청하신 지원금 스쿨뱅킹 수납 현황을 에듀파인 연계 규격에 맞게 생성하여 등록 처리하였습니다.'
  }
];
let qaNextId = 9000;

// GET /api/af/qanda/lists/sn/:school_id
router.get('/af/qanda/lists/sn/:school_id', (req, res) => {
  const sn = req.params.school_id;
  const items = qaStore.filter(q => q.schoolSn === sn);
  return res.json({ success: true, sn, totalCount: items.length, items });
});

// POST /api/af/qanda/create
router.post('/af/qanda/create', (req, res) => {
  const { school_id, authorName, phone, email, subject, contents, files, status, statusText, createdAt } = req.body;
  const sn = String(school_id || '3267');
  const newItem = {
    id: String(qaNextId++),
    num: qaStore.filter(q => q.schoolSn === sn).length + 1,
    schoolSn: sn,
    authorName: authorName || '관리자',
    phone: phone || '',
    email: email || '',
    subject: subject || '(제목 없음)',
    contents: contents || '',
    files: files || [],
    status: status || '0',
    statusText: statusText || '접수',
    createdAt: createdAt || new Date().toISOString().split('T')[0],
    answerDate: '',
    answerContent: ''
  };
  qaStore.unshift(newItem);
  return res.json({ success: true, item: newItem, message: '고객지원 문의가 등록되었습니다.' });
});

// POST /api/af/qanda/delete
router.post('/af/qanda/delete', (req, res) => {
  const { id } = req.body;
  const before = qaStore.length;
  qaStore = qaStore.filter(q => String(q.id) !== String(id));
  if (qaStore.length === before) {
    return res.status(404).json({ success: false, message: '해당 문의를 찾을 수 없습니다.' });
  }
  return res.json({ success: true, message: '삭제되었습니다.' });
});

module.exports = router;


