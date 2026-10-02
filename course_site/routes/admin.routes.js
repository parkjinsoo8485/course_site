const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authenticateToken } = require('../middleware/auth');
const manualData = require('../utils/manualData');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ── 첨부파일 업로드 multer 설정 ──
const uploadDir = path.join(__dirname, '..', 'uploads', 'lec_files');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safe = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, `${ts}_${safe}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB 제한
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg','.jpeg','.png','.gif','.pdf','.hwp','.docx','.xlsx','.zip','.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('허용되지 않는 파일 형식입니다.'));
  }
});

// Helper to resolve school ID or SN code
const resolveSchoolId = (schoolIdParam) => {
  const str = String(schoolIdParam || '');
  if (!str || str === '3267' || str === 'default') {
    return 'sch_1';
  }
  const foundByCode = db.findSchoolByCode(str.toUpperCase());
  if (foundByCode) return foundByCode.id;
  const foundById = db.findSchoolById(str);
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
      ...req.body,
      schoolId: targetSchoolId,
      category: category || '2026년 1분기',
      title,
      instructor: req.body.instructor || req.body.teacherId || 'inst_1',
      teacherId: req.body.teacherId || req.body.instructor || 'inst_1',
      teacherName: req.body.teacherName || req.body.instructor || '강사',
      targetGrade: targetGrade || '전학년',
      capacity: parseInt(capacity) || 20,
      waitingCapacity: parseInt(waitingCapacity) || 5,
      tuitionFee: parseInt(tuitionFee) || 0,
      fee: parseInt(tuitionFee) || 0,
      materialFee: parseInt(materialFee) || 0,
      dayOfWeek: dayOfWeek || '월',
      scheduleTime: scheduleTime || '14:00~14:50',
      schedule: `${dayOfWeek || '월'}:${scheduleTime || '14:00~14:50'}`,
      location: location || req.body.classroom || '방과후 교실',
      status: req.body.status || 'OUTPUT'
    });

    return res.json({ success: true, lecture: newCourse, message: `'${title}' 강좌가 성공적으로 등록되었습니다.` });
  } catch (err) {
    console.error('Create Lecture Error:', err);
    return res.status(500).json({ success: false, message: '강좌 등록 중 오류가 발생했습니다.' });
  }
});

// POST /af/ad_lec/update (강좌 정보 수정)
router.post('/af/ad_lec/update', (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: '수정할 강좌 ID가 필요합니다.' });
    }
    const updated = db.updateCourse(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: '수정할 강좌를 찾을 수 없습니다.' });
    }
    return res.json({ success: true, lecture: updated, message: `'${updated.title}' 강좌가 성공적으로 수정되었습니다.` });
  } catch (err) {
    console.error('Update Lecture Error:', err);
    return res.status(500).json({ success: false, message: '강좌 수정 중 오류가 발생했습니다.' });
  }
});

// DELETE /api/af/ad_lec/:course_id (강좌 삭제)
router.delete(['/af/ad_lec/:course_id', '/af/ad_lec/delete/:course_id'], (req, res) => {
  try {
    const courseId = req.params.course_id;
    const deleted = db.deleteCourse(courseId);
    if (deleted) {
      return res.json({ success: true, message: '강좌가 성공적으로 삭제되었습니다.' });
    }
    return res.status(404).json({ success: false, message: '삭제할 강좌를 찾을 수 없습니다.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: '강좌 삭제 중 오류가 발생했습니다.' });
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

// POST /api/af/ad_lec/bulk-action (하단 update_type 22종 일괄적용)
router.post('/af/ad_lec/bulk-action', (req, res) => {
  try {
    const { schoolId, courseIds, updateType } = req.body;
    const targetSchoolId = resolveSchoolId(schoolId);

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ success: false, message: '선택된 강좌가 없습니다.' });
    }
    if (!updateType) {
      return res.status(400).json({ success: false, message: '적용할 작업을 선택하세요.' });
    }

    let affectedCount = 0;
    const courses = db.getCoursesBySchool(targetSchoolId);

    courseIds.forEach(id => {
      const crs = courses.find(c => String(c.id) === String(id));
      if (!crs) return;

      switch (updateType) {
        case 'status_1':
          crs.status = 'OUTPUT';
          affectedCount++;
          break;
        case 'status_0':
          crs.status = 'WAITING';
          affectedCount++;
          break;
        case 'status_2':
          crs.status = 'CLOSED';
          affectedCount++;
          break;
        case 'tea_finish_Y':
          crs.instructorClosed = true;
          affectedCount++;
          break;
        case 'tea_finish_N':
          crs.instructorClosed = false;
          affectedCount++;
          break;
        case 'tea_edit_Y':
          crs.teacherEditable = 'Y';
          affectedCount++;
          break;
        case 'tea_edit_N':
          crs.teacherEditable = 'N';
          affectedCount++;
          break;
        case 'refund_status_Y':
          crs.refundClosed = true;
          affectedCount++;
          break;
        case 'refund_status_N':
          crs.refundClosed = false;
          affectedCount++;
          break;
        case 'tea_id_chk_Y':
          crs.teacherNoDuplicate = true;
          affectedCount++;
          break;
        case 'tea_id_chk_N':
          crs.teacherNoDuplicate = false;
          affectedCount++;
          break;
        case 'lec_time_not_chk_Y':
          crs.allowTimeConflict = true;
          affectedCount++;
          break;
        case 'lec_time_not_chk_N':
          crs.allowTimeConflict = false;
          affectedCount++;
          break;
        case 'pay_view_Y':
          crs.feeReceipt = 'Y';
          affectedCount++;
          break;
        case 'pay_view_N':
          crs.feeReceipt = 'N';
          affectedCount++;
          break;
        case 'del':
          db.deleteCourse(id);
          affectedCount++;
          break;
        default:
          affectedCount++;
          break;
      }
    });

    return res.json({
      success: true,
      affectedCount,
      message: `${affectedCount}개 강좌에 '${updateType}' 일괄 작업이 정상 적용되었습니다.`
    });
  } catch (err) {
    console.error('Bulk Action Error:', err);
    return res.status(500).json({ success: false, message: '일괄 적용 중 오류가 발생했습니다.' });
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

// ── 강좌구분(lec_div) 동적 목록 조회 ──
// GET /api/af/ad_lec/divisions?sn=3267
router.get('/af/ad_lec/divisions', (req, res) => {
  try {
    const schoolId = resolveSchoolId(req.query.sn || req.query.schoolId);
    // afDivisions 기반 + 현재 강좌에서 사용 중인 category 수집
    const lectures = db.getLecturesBySchool(schoolId, {});
    const fromLec = [...new Set(lectures.map(l => l.category).filter(Boolean))];
    const baseDivs = [
      { value: '3월', label: '3월' },
      { value: '26년 4월', label: '26년 4월' },
      { value: '26년 5월', label: '26년 5월' },
      { value: '26년 6월', label: '26년 6월' },
      { value: '26년 7월', label: '26년 7월' },
      { value: '26년 8월', label: '26년 8월' },
      { value: '26년 9월', label: '26년 9월' },
      { value: '26년 10월', label: '26년 10월' },
      { value: '26년 11월', label: '26년 11월' },
      { value: '26년 12월', label: '26년 12월' },
    ];
    fromLec.forEach(cat => {
      if (!baseDivs.find(d => d.value === cat)) baseDivs.unshift({ value: cat, label: cat });
    });
    return res.json({ success: true, divisions: baseDivs });
  } catch (err) {
    return res.status(500).json({ success: false, message: '강좌구분 목록 조회 중 오류가 발생했습니다.' });
  }
});

// ── 강의시간 슬롯 목록 조회 ──
// GET /api/af/ad_lec/time-slots?sn=3267
router.get('/af/ad_lec/time-slots', (req, res) => {
  try {
    // 원본 dbdbschool 방식: 요일 × 부번 조합 슬롯
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    const periods = [
      { label: '1부', start: '13:00', end: '13:40' },
      { label: '2부', start: '13:50', end: '14:30' },
      { label: '3부', start: '14:40', end: '15:20' },
      { label: '4부', start: '15:30', end: '16:10' },
      { label: '5부', start: '16:20', end: '17:00' },
      { label: '6부', start: '17:10', end: '17:50' },
      { label: '7부', start: '18:00', end: '18:40' },
    ];
    const slots = [];
    days.forEach(day => {
      periods.forEach(p => {
        const value = `${day}${p.label} (${p.start}~${p.end})`;
        slots.push({ day, period: p.label, start: p.start, end: p.end, value, label: value });
      });
    });
    // 이미 사용중인 시간대 강조를 위해 현재 강좌 스케줄 포함
    const schoolId = resolveSchoolId(req.query.sn || req.query.schoolId);
    const lectures = db.getLecturesBySchool(schoolId, {});
    const usedTimes = lectures.map(l => l.scheduleTime).filter(Boolean);
    return res.json({ success: true, slots, usedTimes });
  } catch (err) {
    return res.status(500).json({ success: false, message: '강의시간 슬롯 조회 중 오류가 발생했습니다.' });
  }
});

// ── 강사 중복 배정 체크 ──
// GET /api/af/ad_lec/check-instructor?teaId=tea01&scheduleTime=월1부&excludeId=crs_xxx
router.get('/af/ad_lec/check-instructor', (req, res) => {
  try {
    const { teaId, scheduleTime, excludeId } = req.query;
    if (!teaId) return res.json({ success: true, conflict: false });
    const lectures = db.getLecturesBySchool('sch_1', {});
    const conflicts = lectures.filter(l => {
      if (excludeId && l.id === excludeId) return false;
      const sameTeacher = (l.instructor === teaId || l.teacherName === teaId ||
        l.teacherId === teaId || l.assistantInstructor === teaId);
      if (!sameTeacher) return false;
      if (scheduleTime && l.scheduleTime) {
        return l.scheduleTime === scheduleTime;
      }
      return true;
    });
    return res.json({
      success: true,
      conflict: conflicts.length > 0,
      conflicts: conflicts.map(l => ({ id: l.id, title: l.title, scheduleTime: l.scheduleTime, category: l.category }))
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: '강사 중복 체크 중 오류가 발생했습니다.' });
  }
});

// ── 강의시간 충돌 감지 ──
// GET /api/af/ad_lec/check-time-conflict?scheduleTime=월1부&excludeId=crs_xxx
router.get('/af/ad_lec/check-time-conflict', (req, res) => {
  try {
    const { scheduleTime, excludeId } = req.query;
    if (!scheduleTime) return res.json({ success: true, conflict: false, conflicts: [] });
    const lectures = db.getLecturesBySchool('sch_1', {});
    const conflicts = lectures.filter(l => {
      if (excludeId && l.id === excludeId) return false;
      return l.scheduleTime && l.scheduleTime.includes(scheduleTime.split(' ')[0]);
    });
    return res.json({
      success: true,
      conflict: conflicts.length > 0,
      conflicts: conflicts.map(l => ({ id: l.id, title: l.title, scheduleTime: l.scheduleTime, category: l.category }))
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: '강의시간 충돌 체크 중 오류가 발생했습니다.' });
  }
});

// ── 첨부파일 서버 업로드 ──
// POST /api/af/ad_lec/upload-file (multipart/form-data, field: file[])
router.post('/af/ad_lec/upload-file', (req, res) => {
  upload.array('file[]', 5)(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: '파일 크기는 3MB 이하만 허용됩니다.' });
      }
      return res.status(400).json({ success: false, message: err.message || '파일 업로드 중 오류가 발생했습니다.' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: '업로드할 파일이 없습니다.' });
    }
    const uploaded = req.files.map(f => ({
      fieldname: f.fieldname,
      originalName: Buffer.from(f.originalname, 'latin1').toString('utf8'),
      filename: f.filename,
      size: f.size,
      url: `/uploads/lec_files/${f.filename}`
    }));
    return res.json({ success: true, files: uploaded, message: `${uploaded.length}개 파일이 업로드되었습니다.` });
  });
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
  const filters = {
    schoolId: 'sch_1',
    sld: req.query.sld,
    slp: req.query.slp,
    sln: req.query.sln,
    sgr: req.query.sgr,
    scl: req.query.scl,
    st: req.query.st,
    sw: req.query.sw
  };
  const waitlist = db.getWaitlist(filters);
  return res.json({ success: true, count: waitlist.length, waitlist });
});

// 신청자로 등록(이동) - 1:1 매핑 (chk_app & promote)
router.post(['/af/ad_wait/app', '/af/ad_wait/promote'], (req, res) => {
  const waitId = req.body.num || req.body.waitId || req.body.id;
  if (!waitId) {
    return res.status(400).json({ success: false, message: '대기자 식별자(num/waitId)가 필요합니다.' });
  }
  const result = db.promoteWaitlist(waitId);
  if (result) {
    const studentName = result.newApp ? result.newApp.studentName : (result.studentName || '학생');
    return res.json({
      success: true,
      message: `'${studentName}' 학생이 대기자에서 정규 수강생으로 승격 등록되었습니다.`,
      result
    });
  }
  return res.status(404).json({ success: false, message: '대기자를 찾을 수 없습니다.' });
});

// 대기자 삭제 - 1:1 매핑 (chk_cancel)
router.post('/af/ad_wait/cancel', (req, res) => {
  const waitId = req.body.num || req.body.waitId || req.body.id;
  if (!waitId) {
    return res.status(400).json({ success: false, message: '삭제할 대기자 식별자가 필요합니다.' });
  }
  const deleted = db.deleteWaitlist(waitId);
  if (deleted) {
    return res.json({ success: true, message: '대기자가 성공적으로 삭제되었습니다.' });
  }
  return res.status(404).json({ success: false, message: '대기자를 찾을 수 없습니다.' });
});

// 대기자 일괄적용 (삭제 / 이동)
router.post('/af/ad_wait/bulk-action', (req, res) => {
  const { update_type, data_checked } = req.body;
  const ids = Array.isArray(data_checked) ? data_checked : (data_checked ? [data_checked] : []);
  if (!ids || ids.length === 0) {
    return res.status(400).json({ success: false, message: '선택된 학생이 없습니다.' });
  }
  if (update_type === 'del') {
    db.batchDeleteWaitlist(ids);
    return res.json({ success: true, message: `선택된 ${ids.length}명의 대기자가 삭제되었습니다.` });
  } else if (update_type === 'app' || update_type === 'promote') {
    ids.forEach(id => db.promoteWaitlist(id));
    return res.json({ success: true, message: `선택된 ${ids.length}명의 대기자가 정규 수강생으로 승격 등록되었습니다.` });
  } else if (update_type === 'move') {
    const { targetCourseTitle, orderedIds } = req.body;
    if (orderedIds && Array.isArray(orderedIds)) {
      db.reorderWaitlist(targetCourseTitle, orderedIds);
      return res.json({ success: true, message: '대기자 순위가 성공적으로 변경되었습니다.' });
    }
    return res.json({ success: true, message: '대기자 이동이 완료되었습니다.' });
  }
  return res.status(400).json({ success: false, message: '유효하지 않은 일괄적용 항목입니다.' });
});

// 대기자 개별 등록 (대기자등록 모달)
router.post('/af/ad_wait/sin', (req, res) => {
  const entry = req.body;
  if (!entry.studentName) {
    return res.status(400).json({ success: false, message: '학생 정보는 필수입니다.' });
  }
  const added = db.addWaitlist(entry);
  return res.json({ success: true, message: `'${added.studentName}' 학생이 대기자로 정상 등록되었습니다.`, entry: added });
});

// 대기자 일괄 입력 (대기자일괄입력 모달)
router.post('/af/ad_wait/batch-input', (req, res) => {
  const { entries } = req.body;
  if (!entries || !Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({ success: false, message: '입력할 대기자 데이터가 없습니다.' });
  }
  const addedList = db.batchInputWaitlist(entries);
  return res.json({ success: true, message: `총 ${addedList.length}명의 대기자가 일괄 등록되었습니다.`, addedList });
});

// 대기자 복사 (대기자복사 모달)
router.post('/af/ad_wait/copy', (req, res) => {
  const { sourceCourse, targetCourse, mode } = req.body;
  if (!sourceCourse || !targetCourse) {
    return res.status(400).json({ success: false, message: '원본 강좌와 대상 강좌를 모두 선택해주세요.' });
  }
  const result = db.copyWaitlist(sourceCourse, targetCourse, mode || 'append');
  return res.json({ success: true, message: `대기자 ${result.copiedCount}명이 '${targetCourse}'(으)로 복사되었습니다.`, result });
});

// 대기자 순위 변경 (대기자 순위 이동)
router.post('/af/ad_wait/move', (req, res) => {
  const { courseTitle, orderedIds } = req.body;
  if (!courseTitle || !orderedIds || !Array.isArray(orderedIds)) {
    return res.status(400).json({ success: false, message: '강좌명과 순서 정보가 필요합니다.' });
  }
  db.reorderWaitlist(courseTitle, orderedIds);
  return res.json({ success: true, message: `'${courseTitle}' 강좌의 대기자 순위가 성공적으로 재조정되었습니다.` });
});

// 대기자 엑셀 출력
router.get('/af/ad_wait/excel', (req, res) => {
  const filters = {
    schoolId: 'sch_1',
    sld: req.query.sld,
    slp: req.query.slp,
    sln: req.query.sln
  };
  const waitlist = db.getWaitlist(filters);
  const rows = [
    ['순위', '구분', '강좌명', '학년', '반', '번호', '이름', '연락처', '등록일자', '상태']
  ];
  waitlist.forEach(w => {
    rows.push([
      w.rank,
      w.division || w.category,
      w.courseTitle,
      w.grade,
      w.class,
      w.studentNum,
      w.studentName,
      w.parentPhone,
      w.appliedAt,
      w.status
    ]);
  });
  const csvContent = '\uFEFF' + rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="waitlist_export_' + new Date().toISOString().substring(0, 10).replace(/-/g, '') + '.csv"');
  return res.send(csvContent);
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
  return res.json({ success: true, message: `'${newRef.studentName}' 학생의 환불/취소 요청(${newRef.refundAmount.toLocaleString()}원)이 정상 등록되었습니다.`, refund: newRef });
});

router.post('/af/ad_ref/batch', (req, res) => {
  const { refunds } = req.body;
  if (!Array.isArray(refunds) || refunds.length === 0) {
    return res.status(400).json({ success: false, message: '등록할 환불 데이터가 비어 있습니다.' });
  }
  const added = db.batchAddRefunds('sch_1', refunds);
  return res.json({ success: true, message: `총 ${added.length}건의 환불/취소 데이터가 일괄 등록되었습니다.`, addedCount: added.length, refunds: added });
});

router.post('/af/ad_ref/status', (req, res) => {
  const { id, status } = req.body;
  const updated = db.updateRefundStatus('sch_1', id, status);
  if (!updated) {
    return res.status(404).json({ success: false, message: '해당 환불 내역을 찾을 수 없습니다.' });
  }
  return res.json({ success: true, message: `신청상태가 '${status}'(으)로 변경되었습니다.`, item: updated });
});

router.post('/af/ad_ref/delete', (req, res) => {
  const { id } = req.body;
  const deleted = db.deleteRefund('sch_1', id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: '삭제할 환불 내역을 찾을 수 없습니다.' });
  }
  return res.json({ success: true, message: '환불/취소 내역이 성공적으로 삭제되었습니다.' });
});

router.delete('/af/ad_ref/:id', (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteRefund('sch_1', id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: '삭제할 환불 내역을 찾을 수 없습니다.' });
  }
  return res.json({ success: true, message: '환불/취소 내역이 성공적으로 삭제되었습니다.' });
});

router.get('/af/ad_ref/excel', (req, res) => {
  const refunds = db.getRefunds('sch_1');
  const rows = [
    ['연번', '신청상태', '신청유형(지원금)', '구분(늘봄과정)', '강좌명', '학년', '반', '번호', '이름', '연락처', '최종수강일', '수강료', '환불금액(수강료)', '수용비', '환불금액(수용비)', '교재비', '환불금액(교재비)', '재료비', '환불금액(재료비)', '징수전취소', '적용일자', '비고', '등록일자'].join(',')
  ];
  refunds.forEach((r, idx) => {
    rows.push([
      idx + 1,
      `"${r.status || ''}"`,
      `"${r.appType || ''}"`,
      `"${r.neulbomType || ''}"`,
      `"${(r.courseTitle || '').replace(/"/g, '""')}"`,
      `"${r.grade || ''}"`,
      `"${r.classNo || ''}"`,
      `"${r.studentNo || ''}"`,
      `"${r.studentName || ''}"`,
      `"${r.parentPhone || ''}"`,
      `"${r.lastAttendedDate || ''}"`,
      r.tuitionFee || 0,
      r.tuitionRefund || 0,
      r.receptiveFee || 0,
      r.receptiveRefund || 0,
      r.textbookFee || 0,
      r.textbookRefund || 0,
      r.materialFee || 0,
      r.materialRefund || 0,
      `"${r.beforeCollection || 'N'}"`,
      `"${r.effectiveDate || ''}"`,
      `"${(r.reason || '').replace(/"/g, '""')}"`,
      `"${r.createdAt || ''}"`
    ].join(','));
  });

  const csvContent = '\uFEFF' + rows.join('\n');
  const filename = `환불_취소관리_${new Date().toISOString().slice(0, 10)}.csv`;
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
  return res.send(csvContent);
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

// 9. 지원금관리 대상자관리 (ad_free2_stu) CRUD 및 출력 엔드포인트
router.get('/af/ad_free2_stu/lists', (req, res) => {
  const { grade, classNum, rank, rankDetail, fundType, searchName } = req.query;
  const students = db.getSubsidyStudents('sch_1', { grade, classNum, rank, rankDetail, fundType, searchName });

  // 통계 계산
  const summary = {
    totalCount: students.length,
    fund1Total: students.reduce((acc, s) => acc + (s.fund1_total || 0), 0),
    fund1Used: students.reduce((acc, s) => acc + (s.fund1_used || 0), 0),
    fund1Balance: students.reduce((acc, s) => acc + (s.fund1_balance || 0), 0),
    fund3Total: students.reduce((acc, s) => acc + (s.fund3_total || 0), 0),
    fund3Used: students.reduce((acc, s) => acc + (s.fund3_used || 0), 0),
    fund3Balance: students.reduce((acc, s) => acc + (s.fund3_balance || 0), 0),
    freeTotal: students.reduce((acc, s) => acc + (s.free_total || 0), 0),
    freeUsed: students.reduce((acc, s) => acc + (s.free_used || 0), 0),
    freeBalance: students.reduce((acc, s) => acc + (s.free_balance || 0), 0)
  };

  return res.json({ success: true, students, summary });
});

// 단일 대상자 등록
router.post('/af/ad_free2_stu', (req, res) => {
  try {
    const data = req.body;
    if (!data.studentName || !data.studentName.trim()) {
      return res.status(400).json({ success: false, message: '학생 이름을 입력해 주세요.' });
    }
    const student = db.addSubsidyStudent(data);
    return res.json({ success: true, message: `${student.studentName} 학생이 대상자로 정상 등록되었습니다.`, student });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 대상자 정보 수정
router.put('/af/ad_free2_stu/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = db.updateSubsidyStudent(id, data);
    if (!updated) {
      return res.status(404).json({ success: false, message: '해당 대상자를 찾을 수 없습니다.' });
    }
    return res.json({ success: true, message: `${updated.studentName} 학생의 정보가 성공적으로 수정되었습니다.`, student: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 대상자 삭제 (단일/일괄)
router.delete('/af/ad_free2_stu', (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: '삭제할 대상자를 선택해 주세요.' });
    }
    const deletedCount = db.deleteSubsidyStudents(ids);
    return res.json({ success: true, message: `선택한 ${deletedCount}명의 대상자가 성공적으로 삭제되었습니다.`, deletedCount });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 대상자 일괄 등록 (CSV / 텍스트 파싱)
router.post('/af/ad_free2_stu/batch', (req, res) => {
  try {
    const { students } = req.body;
    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, message: '등록할 학생 데이터가 비어 있습니다.' });
    }
    const added = db.batchAddSubsidyStudents(students);
    return res.json({ success: true, message: `총 ${added.length}명의 지원금 대상자가 성공적으로 일괄 등록되었습니다.`, count: added.length, added });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 대상자 일괄입력 공식 CSV 샘플 파일 다운로드
router.get('/af/ad_free2_stu/sample_csv', (req, res) => {
  const sampleCsv = '\uFEFF' + [
    '학년,반,번호,이름,연락처,순위,순위구분,선지정대상자,1학년지원총액,3학년지원총액,자유수강권총액,비고',
    '1,1,5,김영희,010-1111-2222,1순위,국민기초생활수급자,Y,600000,0,600000,신입생 우선지원',
    '2,2,10,이철수,010-3333-4444,2순위,한부모가족보호대상자,N,0,0,600000,',
    '3,1,12,박지민,010-5555-7777,3순위,학교장추천,N,0,300000,300000,담임 추천'
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="subsidy_student_batch_sample.csv"');
  return res.send(sampleCsv);
});

// 검색결과 엑셀 출력 (HTML Excel 규격)
router.get('/af/ad_free2_stu/excel', (req, res) => {
  const { grade, classNum, rank, rankDetail, fundType, searchName } = req.query;
  const students = db.getSubsidyStudents('sch_1', { grade, classNum, rank, rankDetail, fundType, searchName });

  const rowsHtml = students.map((s, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${s.grade}</td>
      <td>${s.classNum}</td>
      <td>${s.studentNum}</td>
      <td>${s.studentName}</td>
      <td>${(s.fund1_total || 0).toLocaleString()}</td>
      <td>${(s.fund1_used || 0).toLocaleString()}</td>
      <td>${(s.fund1_balance || 0).toLocaleString()}</td>
      <td>${s.fund1_period || '-'}</td>
      <td>${(s.fund3_total || 0).toLocaleString()}</td>
      <td>${(s.fund3_used || 0).toLocaleString()}</td>
      <td>${(s.fund3_balance || 0).toLocaleString()}</td>
      <td>${s.fund3_period || '-'}</td>
      <td>${s.rank || ''}</td>
      <td>${s.rankDetail || ''}</td>
      <td>${s.isPreDesignated || 'N'}</td>
      <td>${(s.free_total || 0).toLocaleString()}</td>
      <td>${(s.free_used || 0).toLocaleString()}</td>
      <td>${(s.free_balance || 0).toLocaleString()}</td>
    </tr>
  `).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    table { border-collapse: collapse; font-family: '맑은 고딕', sans-serif; font-size: 10pt; }
    th { background-color: #dff0d8; border: 1px solid #ccc; padding: 6px 10px; font-weight: bold; text-align: center; }
    td { border: 1px solid #ddd; padding: 5px 8px; vertical-align: middle; text-align: center; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: center; color: #3c763d; padding: 12px; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="19" class="title-cell">광주풍향초등학교 지원금 대상자 목록 (검색 결과)</td></tr>
    <tr><td colspan="19" style="font-size:10pt; color:#666; padding:4px;">■ 출력 일시: ${new Date().toLocaleString('ko-KR')} | 총 인원: ${students.length}명</td></tr>
    <tr>
      <th rowspan="2">연번</th>
      <th rowspan="2">학년</th>
      <th rowspan="2">반</th>
      <th rowspan="2">번호</th>
      <th rowspan="2">이름</th>
      <th colspan="4" style="background:#e0f2fe; color:#0369a1;">1학년 지원금</th>
      <th colspan="4" style="background:#fef3c7; color:#92400e;">3학년 지원금</th>
      <th rowspan="2">순위</th>
      <th rowspan="2">순위구분</th>
      <th rowspan="2">선지정대상자</th>
      <th colspan="3" style="background:#dcfce7; color:#166534;">자유수강권</th>
    </tr>
    <tr>
      <th>총액</th><th>사용액</th><th>잔액</th><th>지원기간</th>
      <th>총액</th><th>사용액</th><th>잔액</th><th>지원기간</th>
      <th>총액</th><th>사용액</th><th>잔액</th>
    </tr>
    ${rowsHtml}
  </table>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="subsidy_students_search_result.xls"');
  return res.send(excelHtml);
});

// 전교생 기준 대상자 엑셀 출력
router.get('/af/ad_free2_stu/excel_all', (req, res) => {
  const students = db.getSubsidyStudents('sch_1');
  const allSchoolList = [];
  
  // 1학년~6학년 가상 전교생 풀 생성 (각 반 15명씩)
  for (let g = 1; g <= 6; g++) {
    for (let c = 1; c <= 3; c++) {
      for (let n = 1; n <= 10; n++) {
        const matched = students.find(s => s.grade === g && s.classNum === c && s.studentNum === n);
        allSchoolList.push({
          grade: g,
          classNum: c,
          studentNum: n,
          studentName: matched ? matched.studentName : `학생_${g}-${c}-${n}`,
          isTarget: matched ? '대상' : '일반',
          rank: matched ? matched.rank : '-',
          rankDetail: matched ? matched.rankDetail : '-',
          freeTotal: matched ? matched.free_total : 0,
          freeUsed: matched ? matched.free_used : 0,
          freeBalance: matched ? matched.free_balance : 0
        });
      }
    }
  }

  const rowsHtml = allSchoolList.map((st, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${st.grade}</td>
      <td>${st.classNum}</td>
      <td>${st.studentNum}</td>
      <td>${st.studentName}</td>
      <td style="font-weight:bold; color:${st.isTarget === '대상' ? '#d9534f' : '#666'};">${st.isTarget}</td>
      <td>${st.rank}</td>
      <td>${st.rankDetail}</td>
      <td>${st.freeTotal.toLocaleString()}</td>
      <td>${st.freeUsed.toLocaleString()}</td>
      <td>${st.freeBalance.toLocaleString()}</td>
    </tr>
  `).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    table { border-collapse: collapse; font-family: '맑은 고딕', sans-serif; font-size: 10pt; }
    th { background-color: #d9edf7; border: 1px solid #ccc; padding: 6px 10px; font-weight: bold; text-align: center; }
    td { border: 1px solid #ddd; padding: 5px 8px; vertical-align: middle; text-align: center; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: center; color: #31708f; padding: 12px; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="11" class="title-cell">광주풍향초등학교 전교생 기준 지원금 대상자 현황표</td></tr>
    <tr><td colspan="11" style="font-size:10pt; color:#666; padding:4px;">■ 출력 일시: ${new Date().toLocaleString('ko-KR')} | 전교생: ${allSchoolList.length}명</td></tr>
    <tr>
      <th>연번</th>
      <th>학년</th>
      <th>반</th>
      <th>번호</th>
      <th>이름</th>
      <th>대상자구분</th>
      <th>순위</th>
      <th>순위구분</th>
      <th>자유수강권 총액</th>
      <th>사용액</th>
      <th>잔액</th>
    </tr>
    ${rowsHtml}
  </table>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="subsidy_all_students_report.xls"');
  return res.send(excelHtml);
});

// 10. 지원금관리 > 수강자관리 (ad_free2_app) CRUD, 일괄차감 및 엑셀 출력
router.get('/af/ad_free2_app/lists', (req, res) => {
  try {
    const filters = {
      month: req.query.month || '',
      courseTitle: req.query.courseTitle || '',
      category: req.query.category || '',
      programType: req.query.programType || '',
      fundType: req.query.fundType || '',
      grade: req.query.grade || '',
      classNum: req.query.classNum || '',
      searchName: req.query.searchName || ''
    };
    const applicants = db.getSubsidyApplicants('sch_1', filters);
    const summary = {
      totalCount: applicants.length,
      totalFee: applicants.reduce((acc, s) => acc + (s.totalFee || s.fee || 0), 0),
      totalTuition: applicants.reduce((acc, s) => acc + (s.tuitionFee || 0), 0),
      totalInstructor: applicants.reduce((acc, s) => acc + (s.instructorFee || 0), 0),
      totalOverhead: applicants.reduce((acc, s) => acc + (s.overheadFee || 0), 0),
      totalTextbook: applicants.reduce((acc, s) => acc + (s.textbookFee || 0), 0),
      totalMaterial: applicants.reduce((acc, s) => acc + (s.materialFee || 0), 0),
      totalSubsidized: applicants.reduce((acc, s) => acc + (s.subsidizedAmount || 0), 0),
      totalOutOfPocket: applicants.reduce((acc, s) => acc + (s.collectedAmount !== undefined ? s.collectedAmount : s.outOfPocket || 0), 0)
    };
    const allowedMonths = db.getSubsidyAllowedMonths();
    return res.json({ success: true, applicants, summary, allowedMonths });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/af/ad_free2_app/allowed_months', (req, res) => {
  try {
    const months = db.getSubsidyAllowedMonths();
    return res.json({ success: true, months, allowedMonths: months });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/af/ad_free2_app/allowed_months', (req, res) => {
  try {
    const months = req.body.months || req.body.allowedMonths || [];
    const updated = db.setSubsidyAllowedMonths(months);
    return res.json({ success: true, message: '학생 지원금 내역 조회 허용 월이 설정되었습니다.', months: updated, allowedMonths: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/af/ad_free2_app/import', (req, res) => {
  try {
    const { targetMonth, maxAmount, neulbomTypes, courseDivs, subsidyTypes } = req.body;
    const count = db.importSubsidyApplicants(targetMonth || '3월', maxAmount || 0, { neulbomTypes, courseDivs, subsidyTypes });
    return res.json({ success: true, message: `${targetMonth} 수강자 가져오기가 완료되었습니다. (${count}건 처리)`, count });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/af/ad_free2_app/applicant_search', (req, res) => {
  try {
    const list = db.getApplicantSearchList(req.query);
    return res.json({ success: true, list, applicants: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/af/ad_free2_app', (req, res) => {
  try {
    const data = req.body;
    if (!data.studentName) {
      return res.status(400).json({ success: false, message: '학생명을 입력해 주세요.' });
    }
    const created = db.addSubsidyApplicant(data);
    return res.json({ success: true, message: `${created.studentName} 수강자의 지원금 차감 내역이 등록되었습니다.`, applicant: created });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/af/ad_free2_app/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updateSubsidyApplicant(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: '해당 수강자 차감 내역을 찾을 수 없습니다.' });
    }
    return res.json({ success: true, message: `${updated.studentName} 학생의 차감 내역이 수정되었습니다.`, applicant: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/af/ad_free2_app', (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: '삭제할 항목을 선택해 주세요.' });
    }
    const deletedCount = db.deleteSubsidyApplicants(ids);
    return res.json({ success: true, message: `${deletedCount}건의 수강자 지원금 내역이 삭제되었습니다.`, count: deletedCount });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/af/ad_free2_app/batch_deduct', (req, res) => {
  try {
    const { category, subsidyType } = req.body;
    const count = db.batchDeductSubsidies(category || '26년 8월', subsidyType || '자유수강권');
    return res.json({ success: true, message: `총 ${count}건의 수강자 지원금이 성공적으로 일괄 차감되었습니다.`, count });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 수강자관리 검색결과 엑셀 출력
router.get('/af/ad_free2_app/excel', (req, res) => {
  const filters = {
    category: req.query.category || '',
    programType: req.query.programType || '',
    fundType: req.query.fundType || '',
    grade: req.query.grade || '',
    classNum: req.query.classNum || '',
    searchName: req.query.searchName || ''
  };
  const list = db.getSubsidyApplicants('sch_1', filters);
  const rowsHtml = list.map((a, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${a.category}</td>
      <td>${a.programType}</td>
      <td style="text-align:left;">${a.courseTitle}</td>
      <td>${a.grade}</td>
      <td>${a.classNum}</td>
      <td>${a.studentNum}</td>
      <td><strong>${a.studentName}</strong></td>
      <td>${a.phone}</td>
      <td style="text-align:right;">${(a.fee || 0).toLocaleString()}</td>
      <td style="text-align:right; color:#2563eb; font-weight:bold;">-${(a.subsidizedAmount || 0).toLocaleString()}</td>
      <td style="text-align:right;">${(a.outOfPocket || 0).toLocaleString()}</td>
      <td>${a.subsidyType}</td>
      <td>${a.deductionDate}</td>
      <td>${a.status}</td>
    </tr>
  `).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    table { border-collapse: collapse; font-family: '맑은 고딕', sans-serif; font-size: 10pt; }
    th { background-color: #fcf8e3; border: 1px solid #ccc; padding: 6px 10px; font-weight: bold; text-align: center; }
    td { border: 1px solid #ddd; padding: 5px 8px; vertical-align: middle; text-align: center; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: center; color: #8a6d3b; padding: 12px; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="15" class="title-cell">광주풍향초등학교 지원금 수강자 차감 관리 내역</td></tr>
    <tr><td colspan="15" style="font-size:10pt; color:#666; padding:4px;">■ 출력 일시: ${new Date().toLocaleString('ko-KR')} | 총 건수: ${list.length}건</td></tr>
    <tr>
      <th>연번</th>
      <th>강좌구분</th>
      <th>늘봄과정</th>
      <th>강좌명</th>
      <th>학년</th>
      <th>반</th>
      <th>번호</th>
      <th>학생명</th>
      <th>연락처</th>
      <th>수강료</th>
      <th>지원금차감액</th>
      <th>본인부담금</th>
      <th>지원구분</th>
      <th>차감일자</th>
      <th>상태</th>
    </tr>
    ${rowsHtml}
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="subsidy_applicants_list.xls"');
  return res.send(excelHtml);
});

// 지원금정산출력 엑셀
router.get('/af/ad_free2_app/excel_settle', (req, res) => {
  const list = db.getSubsidyApplicants('sch_1');
  const totalFee = list.reduce((a, c) => a + c.fee, 0);
  const totalSub = list.reduce((a, c) => a + c.subsidizedAmount, 0);
  const totalOut = list.reduce((a, c) => a + c.outOfPocket, 0);

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    table { border-collapse: collapse; font-family: '맑은 고딕', sans-serif; font-size: 10pt; }
    th { background-color: #dff0d8; border: 1px solid #ccc; padding: 6px 10px; font-weight: bold; text-align: center; }
    td { border: 1px solid #ddd; padding: 5px 8px; vertical-align: middle; text-align: center; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: center; color: #3c763d; padding: 12px; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="7" class="title-cell">2026학년도 방과후학교 지원금 정산 총괄표</td></tr>
    <tr>
      <th>구분</th>
      <th>총 신청인원</th>
      <th>총 수강료(A)</th>
      <th>지원금 차감합계(B)</th>
      <th>본인부담금 합계(A-B)</th>
      <th>정산일자</th>
      <th>비고</th>
    </tr>
    <tr>
      <td><strong>풍향초 전 강좌 합계</strong></td>
      <td><strong>${list.length}명</strong></td>
      <td style="text-align:right;"><strong>${totalFee.toLocaleString()}원</strong></td>
      <td style="text-align:right; color:#2563eb;"><strong>${totalSub.toLocaleString()}원</strong></td>
      <td style="text-align:right; color:#ea580c;"><strong>${totalOut.toLocaleString()}원</strong></td>
      <td>${new Date().toISOString().slice(0, 10)}</td>
      <td>정상 집계</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="subsidy_settlement_report.xls"');
  return res.send(excelHtml);
});

router.get('/af/ad_free2_cfg/main', (req, res) => {
  try {
    const configs = db.getSubsidyConfigs('sch_1');
    const order = db.getSubsidyDeductOrder('sch_1');
    return res.json({
      success: true,
      configs,
      order,
      config: {
        annualLimit: (configs.fund_free && configs.fund_free.annualLimit) || 600000,
        priorityPolicy: order.map(o => o.name).join(' > '),
        autoDeduct: true,
        excludeMaterials: false
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/af/ad_free2_cfg/main', (req, res) => {
  try {
    const { fundKey, configData } = req.body;
    if (!fundKey || !configData) {
      return res.status(400).json({ success: false, message: '지원금 식별자와 설정 데이터가 필요합니다.' });
    }
    const updated = db.updateSubsidyConfig('sch_1', fundKey, configData);
    return res.json({ success: true, message: `${updated.name || fundKey} 설정이 저장되었습니다.`, config: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/af/ad_free2_cfg/order', (req, res) => {
  try {
    const { orderList } = req.body;
    if (!Array.isArray(orderList)) {
      return res.status(400).json({ success: false, message: '올바른 순서 목록이 아닙니다.' });
    }
    const updated = db.updateSubsidyDeductOrder('sch_1', orderList);
    return res.json({ success: true, message: '지원금 차감 순서가 변경되었습니다.', order: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/af/ad_free2_cfg/free1', (req, res) => {
  try {
    const { rank } = req.query;
    const ranks = db.getSubsidyRanks('sch_1', rank);
    return res.json({ success: true, ranks });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/af/ad_free2_cfg/free1', (req, res) => {
  try {
    const data = req.body;
    if (!data.name) {
      return res.status(400).json({ success: false, message: '순위 코드명을 입력해 주세요.' });
    }
    const created = db.addSubsidyRank(data);
    return res.json({ success: true, message: `${created.name} 순위 코드가 등록되었습니다.`, rank: created });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/af/ad_free2_cfg/free1/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updateSubsidyRank(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: '해당 순위 코드를 찾을 수 없습니다.' });
    }
    return res.json({ success: true, message: '순위 코드가 수정되었습니다.', rank: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/af/ad_free2_cfg/free1/:id', (req, res) => {
  try {
    const { id } = req.params;
    const ok = db.deleteSubsidyRank(id);
    if (!ok) {
      return res.status(404).json({ success: false, message: '해당 순위 코드를 찾을 수 없습니다.' });
    }
    return res.json({ success: true, message: '순위 코드가 삭제되었습니다.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/af/ad_free2_cfg/free1/order', (req, res) => {
  try {
    const { orderList } = req.body;
    if (!Array.isArray(orderList)) {
      return res.status(400).json({ success: false, message: '올바른 순서 목록이 아닙니다.' });
    }
    const updated = db.updateSubsidyRankOrder(orderList);
    return res.json({ success: true, message: '출력 순서가 저장되었습니다.', ranks: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
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

// POST & GET /api/af/ad_app/excel/export (신청결과 엑셀출력 - 10대 출력 구분 완벽 지원)
router.all(['/af/ad_app/excel/export', '/api/af/ad_app/excel/export', '/af/ad_app/excel/download'], (req, res) => {
  try {
    const params = Object.assign({}, req.query, req.body);
    const schoolId = resolveSchoolId(params.schoolId || params.sn || 3267);
    const gubun = String(params.excel_gubun || '2'); // default 2: 강좌 기준(행정실용)
    const selectedCourseIds = Array.isArray(params.lec_list) ? params.lec_list : (params.lec_list ? [params.lec_list] : []);
    const gradeFilter = params.mem_grade || '';
    const classFilter = params.mem_class || '';

    const allCourses = db.getCoursesBySchool(schoolId);
    let applicants = db.getApplicantsBySchool(schoolId);

    // Filter by selected course ids if specified
    if (selectedCourseIds.length > 0 && selectedCourseIds[0] !== '') {
      const idSet = new Set(selectedCourseIds.map(String));
      applicants = applicants.filter(a => idSet.has(String(a.courseId)));
    }

    // Filter by grade / class if provided
    if (gradeFilter) {
      applicants = applicants.filter(a => String(a.grade) === String(gradeFilter) || (a.gradeClass && a.gradeClass.startsWith(gradeFilter + '학년')));
    }
    if (classFilter) {
      applicants = applicants.filter(a => String(a.classNum) === String(classFilter) || (a.gradeClass && a.gradeClass.includes(classFilter + '반')));
    }

    let headers = [];
    let rows = [];
    let filenamePrefix = '신청결과엑셀출력';

    switch (gubun) {
      case '1': // 강좌 기준
        filenamePrefix = '강좌기준_신청자목록';
        headers = ['연번', '강좌구분', '강좌명', '강사명', '강의요일시간', '강의실', '학년', '반', '번호', '학생명', '학부모연락처', '신청일시', '상태'];
        rows = applicants.map((a, idx) => {
          const c = allCourses.find(item => String(item.id) === String(a.courseId)) || {};
          return [
            idx + 1,
            `"${c.category || '26년 8월'}"`,
            `"${a.courseTitle || c.title || ''}"`,
            `"${c.instructor || '담당강사'}"`,
            `"${c.schedule || c.scheduleTime || '월~금'}"`,
            `"${c.location || '교실'}"`,
            `"${a.grade || ''}"`,
            `"${a.classNum || ''}"`,
            `"${a.studentNumber || a.studentNum || ''}"`,
            `"${a.studentName}"`,
            `"${a.parentPhone || a.guardianPhone || ''}"`,
            `"${a.appliedAt || '2026-08-10 10:00:00'}"`,
            `"${a.status || '정상'}"`
          ];
        });
        break;

      case '10': // 강좌 기준(학생 시간표)
        filenamePrefix = '강좌기준_학생시간표';
        headers = ['학년', '반', '번호', '학생명', '월요일', '화요일', '수요일', '목요일', '금요일', '총신청강좌수'];
        // Group by student
        const studentMapTimetable = {};
        applicants.forEach(a => {
          const key = `${a.grade}_${a.classNum}_${a.studentName}`;
          if (!studentMapTimetable[key]) {
            studentMapTimetable[key] = {
              grade: a.grade || '',
              classNum: a.classNum || '',
              num: a.studentNumber || a.studentNum || '',
              name: a.studentName,
              courses: []
            };
          }
          studentMapTimetable[key].courses.push(a.courseTitle);
        });
        rows = Object.values(studentMapTimetable).map(s => [
          `"${s.grade}"`,
          `"${s.classNum}"`,
          `"${s.num}"`,
          `"${s.name}"`,
          `"${s.courses[0] || '-'}"`,
          `"${s.courses[1] || s.courses[0] || '-'}"`,
          `"${s.courses[2] || s.courses[0] || '-'}"`,
          `"${s.courses[3] || s.courses[1] || '-'}"`,
          `"${s.courses[4] || s.courses[0] || '-'}"`,
          s.courses.length
        ]);
        break;

      case '7': // 나이스 신청자 입력용
        filenamePrefix = '나이스_신청자입력용';
        headers = ['학년', '반', '번호', '성명', '생년월일/식별번호', '강좌명', '시작일자', '종료일자'];
        rows = applicants.map(a => [
          `"${a.grade || '1'}"`,
          `"${a.classNum || '1'}"`,
          `"${a.studentNumber || a.studentNum || '1'}"`,
          `"${a.studentName}"`,
          `"190101-*******"`,
          `"${a.courseTitle}"`,
          `"2026-08-01"`,
          `"2026-08-31"`
        ]);
        break;

      case '8': // 강좌 기준(나이스 수강료 입력용)
        filenamePrefix = '나이스_강좌수강료';
        headers = ['강좌코드', '강좌명', '학년', '반', '번호', '성명', '징수금액(수강료)', '감면구분'];
        rows = applicants.map(a => [
          `"LEC_${a.courseId}"`,
          `"${a.courseTitle}"`,
          `"${a.grade || '1'}"`,
          `"${a.classNum || '1'}"`,
          `"${a.studentNumber || a.studentNum || '1'}"`,
          `"${a.studentName}"`,
          a.tuitionFee || 30000,
          `"${a.subsidyType || '일반'}"`
        ]);
        break;

      case '9': // 강사 기준(나이스 수강료 입력용)
        filenamePrefix = '나이스_강사수강료';
        headers = ['강사명', '강사생년월일', '강좌명', '수강인원', '총수강료', '강사료지급액'];
        const teacherMap = {};
        applicants.forEach(a => {
          const c = allCourses.find(item => String(item.id) === String(a.courseId)) || {};
          const tName = c.instructor || '담당강사';
          if (!teacherMap[tName]) {
            teacherMap[tName] = { teacher: tName, courses: {}, count: 0, totalFee: 0 };
          }
          teacherMap[tName].count++;
          teacherMap[tName].totalFee += (Number(a.tuitionFee) || 30000);
          teacherMap[tName].courses[a.courseTitle] = (teacherMap[tName].courses[a.courseTitle] || 0) + 1;
        });
        rows = Object.values(teacherMap).map(t => [
          `"${t.teacher}"`,
          `"800101-*******"`,
          `"${Object.keys(t.courses).join(', ')}"`,
          t.count,
          t.totalFee,
          Math.floor(t.totalFee * 0.95)
        ]);
        break;

      case '4': // 학생 기준(행정실용)
        filenamePrefix = '학생기준_행정실용';
        headers = ['학년', '반', '번호', '학생명', '신청강좌목록', '수강료합계', '교재비합계', '재료비합계', '총납부금액', '은행명', '계좌번호', '예금주', '학부모연락처'];
        const stuMapAdmin = {};
        applicants.forEach(a => {
          const key = `${a.grade}_${a.classNum}_${a.studentName}`;
          if (!stuMapAdmin[key]) {
            stuMapAdmin[key] = {
              grade: a.grade || '',
              classNum: a.classNum || '',
              num: a.studentNumber || a.studentNum || '',
              name: a.studentName,
              courses: [],
              tuition: 0,
              book: 0,
              material: 0,
              total: 0,
              bank: a.bankName || '농협',
              account: a.schoolBankingAccount || '302-0000-0000-01',
              depositor: a.depositorName || a.studentName,
              phone: a.parentPhone || a.guardianPhone || ''
            };
          }
          stuMapAdmin[key].courses.push(a.courseTitle);
          stuMapAdmin[key].tuition += (Number(a.tuitionFee) || 30000);
          stuMapAdmin[key].book += (Number(a.bookFee) || 0);
          stuMapAdmin[key].material += (Number(a.materialFee) || 0);
          stuMapAdmin[key].total += (Number(a.totalFee) || (Number(a.tuitionFee) || 30000));
        });
        rows = Object.values(stuMapAdmin).map(s => [
          `"${s.grade}"`,
          `"${s.classNum}"`,
          `"${s.num}"`,
          `"${s.name}"`,
          `"${s.courses.join('; ')}"`,
          s.tuition,
          s.book,
          s.material,
          s.total,
          `"${s.bank}"`,
          `"${s.account}"`,
          `"${s.depositor}"`,
          `"${s.phone}"`
        ]);
        break;

      case '3': // 학생 기준
        filenamePrefix = '학생기준_신청자목록';
        headers = ['학년', '반', '번호', '학생명', '신청강좌목록', '총수강료', '학부모연락처', '보호자성명'];
        const stuMap = {};
        applicants.forEach(a => {
          const key = `${a.grade}_${a.classNum}_${a.studentName}`;
          if (!stuMap[key]) {
            stuMap[key] = {
              grade: a.grade || '',
              classNum: a.classNum || '',
              num: a.studentNumber || a.studentNum || '',
              name: a.studentName,
              courses: [],
              total: 0,
              phone: a.parentPhone || a.guardianPhone || '',
              parentName: a.guardianName || '보호자'
            };
          }
          stuMap[key].courses.push(a.courseTitle);
          stuMap[key].total += (Number(a.totalFee) || (Number(a.tuitionFee) || 30000));
        });
        rows = Object.values(stuMap).map(s => [
          `"${s.grade}"`,
          `"${s.classNum}"`,
          `"${s.num}"`,
          `"${s.name}"`,
          `"${s.courses.join('; ')}"`,
          s.total,
          `"${s.phone}"`,
          `"${s.parentName}"`
        ]);
        break;

      case '5': // 미신청자
        filenamePrefix = '미신청자_목록';
        headers = ['학년', '반', '번호', '학생명', '학부모연락처', '보호자성명', '미신청상태'];
        const appliedNames = new Set(applicants.map(a => a.studentName));
        const unapplied = defaultStudents3267.filter(s => !appliedNames.has(s.studentName));
        rows = unapplied.map(s => [
          `"${s.grade}"`,
          `"${s.classNum}"`,
          `"${s.studentNum}"`,
          `"${s.studentName}"`,
          `"${s.parentPhone}"`,
          `"${s.parentName}"`,
          `"미신청"`
        ]);
        break;

      case '6': // 학급별 신청 현황
        filenamePrefix = '학급별_신청현황';
        headers = ['학년', '반', '학급재적수', '수강신청인원', '미신청인원', '신청률(%)'];
        const classStats = {};
        for (let g = 1; g <= 6; g++) {
          for (let c = 1; c <= 2; c++) {
            const key = `${g}-${c}`;
            classStats[key] = { grade: g, classNum: c, total: 25, applied: 0 };
          }
        }
        applicants.forEach(a => {
          const g = a.grade || 1;
          const c = a.classNum || 1;
          const key = `${g}-${c}`;
          if (classStats[key]) {
            classStats[key].applied++;
          }
        });
        rows = Object.values(classStats).map(cs => {
          const unapp = Math.max(0, cs.total - cs.applied);
          const rate = ((cs.applied / cs.total) * 100).toFixed(1);
          return [
            `"${cs.grade}학년"`,
            `"${cs.classNum}반"`,
            cs.total,
            cs.applied,
            unapp,
            `"${rate}%"`
          ];
        });
        break;

      case '2': // 강좌 기준(행정실용) - 기본값
      default:
        filenamePrefix = '강좌기준_행정실용';
        headers = ['연번', '강좌구분', '강좌명', '강사명', '학년', '반', '번호', '학생명', '수강료', '교재비', '재료비', '합계금액', '은행명', '계좌번호', '예금주', '학부모연락처', '수납상태'];
        rows = applicants.map((a, idx) => {
          const c = allCourses.find(item => String(item.id) === String(a.courseId)) || {};
          const tuition = Number(a.tuitionFee) || 30000;
          const book = Number(a.bookFee) || 0;
          const material = Number(a.materialFee) || 0;
          const total = Number(a.totalFee) || (tuition + book + material);
          return [
            idx + 1,
            `"${c.category || '26년 8월'}"`,
            `"${a.courseTitle || c.title || ''}"`,
            `"${c.instructor || '담당강사'}"`,
            `"${a.grade || ''}"`,
            `"${a.classNum || ''}"`,
            `"${a.studentNumber || a.studentNum || ''}"`,
            `"${a.studentName}"`,
            tuition,
            book,
            material,
            total,
            `"${a.bankName || '농협'}"`,
            `"${a.schoolBankingAccount || '302-0000-0000-01'}"`,
            `"${a.depositorName || a.studentName}"`,
            `"${a.parentPhone || a.guardianPhone || ''}"`,
            `"${a.paymentStatus || '납부완료'}"`
          ];
        });
        break;
    }

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const safeFilename = encodeURIComponent(`${filenamePrefix}_${schoolId}_${new Date().toISOString().slice(0, 10)}.csv`);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`);
    return res.send(csvContent);
  } catch (err) {
    console.error('Excel Export Error:', err);
    return res.status(500).json({ success: false, message: '엑셀 데이터 출력 중 오류가 발생했습니다.' });
  }
});

// POST & GET /api/af/ad_app/com/export (추가/취소자조회 엑셀출력)
router.all(['/af/ad_app/com/export', '/api/af/ad_app/com/export'], (req, res) => {
  try {
    const params = Object.assign({}, req.query, req.body);
    const schoolId = resolveSchoolId(params.schoolId || params.sn || 3267);
    const comGubun = String(params.com_gubun || '2'); // 2: 추가/최종수강일, 1: 강좌비교
    const excelGubun = String(params.com_excel_gubun || params.excel_gubun || '1'); // 1: 신청 취소자, 2: 신청 추가자
    const sld = params.sld || '10';
    const sln = params.sln || '';
    const sld2 = params.sld2 || '';
    const sln2 = params.sln2 || '';

    const allCourses = db.getCoursesBySchool(schoolId);
    const applicants = db.getApplicantsBySchool(schoolId);

    let rows = [];
    const isCancelled = excelGubun === '1';
    const gubunText = isCancelled ? '신청취소자' : '신청추가자';

    if (comGubun === '2') {
      // 수강생의 추가일자 & 최종수강일 기준
      if (isCancelled) {
        // 취소자 데이터 (환불/취소 내역 기준)
        const mockCancelled = [
          { period: '26년 8월', courseTitle: '논술 1부', teacherName: '박지숙', grade: '1', classNum: '1', studentNum: '04', studentName: '김이레', phone: '010-5541-2311', type: '취소', date: '2026-08-14', reason: '시간표 중복' },
          { period: '26년 8월', courseTitle: '놀이체육 1부', teacherName: '강태연', grade: '2', classNum: '1', studentNum: '01', studentName: '박지민', phone: '010-3344-5566', type: '취소', date: '2026-08-16', reason: '학부모 요청' },
          { period: '26년 8월', courseTitle: '창의미술 1부', teacherName: '김언주', grade: '1', classNum: '2', studentNum: '32', studentName: '일괄학생2', phone: '010-2222-3333', type: '취소', date: '2026-08-18', reason: '개인 사정' }
        ];
        rows = mockCancelled.map((item, idx) => [
          idx + 1,
          `"${item.period}"`,
          `"${item.courseTitle}"`,
          `"${item.teacherName}"`,
          `"${item.grade}"`,
          `"${item.classNum}"`,
          `"${item.studentNum}"`,
          `"${item.studentName}"`,
          `"${item.phone}"`,
          `"${item.type}"`,
          `"${item.date}"`,
          `"${item.reason}"`
        ]);
      } else {
        // 추가자 데이터 (신청자 중 추가일자 기준)
        let addedList = applicants;
        if (sln) addedList = addedList.filter(a => String(a.courseId) === String(sln));
        rows = addedList.map((a, idx) => {
          const c = allCourses.find(item => String(item.id) === String(a.courseId)) || {};
          return [
            idx + 1,
            `"${c.category || '26년 8월'}"`,
            `"${a.courseTitle || c.title || ''}"`,
            `"${c.instructor || '담당강사'}"`,
            `"${a.grade || ''}"`,
            `"${a.classNum || ''}"`,
            `"${a.studentNumber || a.studentNum || ''}"`,
            `"${a.studentName}"`,
            `"${a.parentPhone || a.guardianPhone || ''}"`,
            `"추가"`,
            `"${a.appliedAt || '2026-08-10'}"`,
            `"정상 추가"`
          ];
        });
      }
    } else {
      // 현재/이전 강좌 비교
      const mockDiff = [
        { period: '26년 8월', courseTitle: '(금) 돌봄 4부', teacherName: '돌봄전담사', grade: '1', classNum: '1', studentNum: '01', studentName: '김도하', phone: '010-2218-7705', type: gubunText, date: '2026-08-10', reason: '이전 강좌 비교' },
        { period: '26년 8월', courseTitle: '로봇과학 1부', teacherName: '최정호', grade: '1', classNum: '1', studentNum: '10', studentName: '오하율', phone: '010-3321-4455', type: gubunText, date: '2026-08-12', reason: '이전 강좌 비교' }
      ];
      rows = mockDiff.map((item, idx) => [
        idx + 1,
        `"${item.period}"`,
        `"${item.courseTitle}"`,
        `"${item.teacherName}"`,
        `"${item.grade}"`,
        `"${item.classNum}"`,
        `"${item.studentNum}"`,
        `"${item.studentName}"`,
        `"${item.phone}"`,
        `"${item.type}"`,
        `"${item.date}"`,
        `"${item.reason}"`
      ]);
    }

    const headers = ['연번', '강좌구분', '강좌명', '강사명', '학년', '반', '번호', '학생명', '학부모연락처', '구분', '등록/취소일자', '비고'];
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const safeFilename = encodeURIComponent(`추가취소자_${gubunText}_${schoolId}_${new Date().toISOString().slice(0, 10)}.csv`);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`);
    return res.send(csvContent);
  } catch (err) {
    console.error('Com Export Error:', err);
    return res.status(500).json({ success: false, message: '추가/취소자 엑셀 출력 중 오류가 발생했습니다.' });
  }
});

// ==================== AUTHENTIC TARGET SITE MODAL DATA APIS ====================

const defaultStudents3267 = [
  { studentId: '4841970', studentName: '김도하', grade: 1, classNum: 1, studentNum: 1, parentPhone: '010-2218-7705', parentName: '윤보미' },
  { studentId: '4841972', studentName: '김민호', grade: 1, classNum: 1, studentNum: 2, parentPhone: '010-6695-5578', parentName: '보호자' },
  { studentId: '4841974', studentName: '김은수', grade: 1, classNum: 1, studentNum: 3, parentPhone: '010-4629-0929', parentName: '김정은' },
  { studentId: '4841976', studentName: '김이레', grade: 1, classNum: 1, studentNum: 4, parentPhone: '010-5541-2311', parentName: '보호자' },
  { studentId: '4841978', studentName: '문지유', grade: 1, classNum: 1, studentNum: 5, parentPhone: '010-7788-9900', parentName: '보호자' },
  { studentId: '4841988', studentName: '오하율', grade: 1, classNum: 1, studentNum: 10, parentPhone: '010-3321-4455', parentName: '보호자' },
  { studentId: '4841991', studentName: '일괄학생1', grade: 1, classNum: 1, studentNum: 31, parentPhone: '010-1111-2222', parentName: '보호자' },
  { studentId: '4841992', studentName: '일괄학생2', grade: 1, classNum: 2, studentNum: 32, parentPhone: '010-2222-3333', parentName: '보호자' },
  { studentId: '4842001', studentName: '박지민', grade: 2, classNum: 1, studentNum: 1, parentPhone: '010-3344-5566', parentName: '박보호' },
  { studentId: '4842002', studentName: '최서연', grade: 2, classNum: 2, studentNum: 2, parentPhone: '010-4455-6677', parentName: '최보호' },
  { studentId: '4842003', studentName: '정우진', grade: 3, classNum: 1, studentNum: 3, parentPhone: '010-5566-7788', parentName: '정보호' },
  { studentId: '4842004', studentName: '이하은', grade: 4, classNum: 1, studentNum: 4, parentPhone: '010-6677-8899', parentName: '이보호' },
  { studentId: '4842005', studentName: '강민준', grade: 5, classNum: 1, studentNum: 5, parentPhone: '010-7788-9911', parentName: '강보호' },
  { studentId: '4842006', studentName: '윤서진', grade: 6, classNum: 1, studentNum: 6, parentPhone: '010-8899-0022', parentName: '윤보호' }
];

// GET /api/af/ad_app/unapplied (미신청자 목록 조회 API)
router.get(['/af/ad_app/unapplied', '/api/af/ad_app/unapplied'], (req, res) => {
  try {
    const { ssc, sld, sgr, scl, sw, schoolId } = req.query;
    const targetSchool = resolveSchoolId(schoolId || 3267);
    const applicants = db.getApplicantsBySchool(targetSchool);

    const sscNum = parseInt(ssc, 10);
    const threshold = isNaN(sscNum) ? 1 : sscNum; // default 1개 미만

    let list = defaultStudents3267.map(s => {
      const applied = applicants.filter(a => a.studentName === s.studentName);
      const courseTitles = applied.map(a => a.courseTitle || '방과후강좌');
      return {
        studentId: s.studentId,
        studentName: s.studentName,
        grade: s.grade,
        classNum: s.classNum,
        studentNum: s.studentNum,
        parentPhone: s.parentPhone,
        appliedCount: applied.length,
        courses: courseTitles.length > 0 ? courseTitles.join(', ') : '-'
      };
    });

    if (ssc !== undefined && ssc !== '') {
      list = list.filter(s => s.appliedCount < threshold);
    }
    if (sgr && sgr !== 'all' && sgr !== '') {
      list = list.filter(s => String(s.grade) === String(sgr));
    }
    if (scl && scl !== 'all' && scl !== '') {
      list = list.filter(s => String(s.classNum) === String(scl));
    }
    if (sw && sw.trim()) {
      const kw = sw.trim().toLowerCase();
      list = list.filter(s => s.studentName.toLowerCase().includes(kw));
    }

    return res.json({
      success: true,
      count: list.length,
      students: list
    });
  } catch (err) {
    console.error('Unapplied Students Error:', err);
    return res.status(500).json({ success: false, message: '미신청자 목록 조회 중 오류가 발생했습니다.' });
  }
});

// POST & GET /api/af/ad_app/unapplied/export (미신청자 검색결과 엑셀출력)
router.all(['/af/ad_app/unapplied/export', '/api/af/ad_app/unapplied/export', '/af/ad_app/list1/export'], (req, res) => {
  try {
    const params = Object.assign({}, req.query, req.body);
    const targetSchool = resolveSchoolId(params.schoolId || 3267);
    const applicants = db.getApplicantsBySchool(targetSchool);

    const sscNum = parseInt(params.ssc, 10);
    const threshold = isNaN(sscNum) ? 1 : sscNum;

    let list = defaultStudents3267.map(s => {
      const applied = applicants.filter(a => a.studentName === s.studentName);
      const courseTitles = applied.map(a => a.courseTitle || '방과후강좌');
      return {
        studentId: s.studentId,
        studentName: s.studentName,
        grade: s.grade,
        classNum: s.classNum,
        studentNum: s.studentNum,
        parentPhone: s.parentPhone,
        appliedCount: applied.length,
        courses: courseTitles.length > 0 ? courseTitles.join('; ') : '-'
      };
    });

    if (params.ssc !== undefined && params.ssc !== '') {
      list = list.filter(s => s.appliedCount < threshold);
    }
    if (params.sgr && params.sgr !== 'all' && params.sgr !== '') {
      list = list.filter(s => String(s.grade) === String(params.sgr));
    }
    if (params.scl && params.scl !== 'all' && params.scl !== '') {
      list = list.filter(s => String(s.classNum) === String(params.scl));
    }
    if (params.sw && params.sw.trim()) {
      const kw = params.sw.trim().toLowerCase();
      list = list.filter(s => s.studentName.toLowerCase().includes(kw));
    }

    const headers = ['연번', '학년', '반', '번호', '학생명', '학부모연락처', '신청수', '강좌'];
    const rows = list.map((s, idx) => [
      idx + 1,
      `"${s.grade}"`,
      `"${s.classNum}"`,
      `"${s.studentNum}"`,
      `"${s.studentName}"`,
      `"${s.parentPhone}"`,
      s.appliedCount,
      `"${s.courses}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const safeFilename = encodeURIComponent(`미신청자목록_${targetSchool}_${new Date().toISOString().slice(0, 10)}.csv`);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`);
    return res.send(csvContent);
  } catch (err) {
    console.error('Unapplied Export Error:', err);
    return res.status(500).json({ success: false, message: '미신청자 엑셀 출력 중 오류가 발생했습니다.' });
  }
});

// GET /api/student/search (학생 검색 팝업 API)
router.get(['/student/search', '/api/student/search'], (req, res) => {
  try {
    const { grade, sgr, classNum, scl, keyword, sw } = req.query;
    const targetGrade = grade || sgr;
    const targetClass = classNum || scl;
    const targetKeyword = (keyword || sw || '').trim().toLowerCase();

    let list = [...defaultStudents3267];
    if (targetGrade && targetGrade !== 'all' && targetGrade !== '') {
      list = list.filter(s => String(s.grade) === String(targetGrade));
    }
    if (targetClass && targetClass !== 'all' && targetClass !== '') {
      list = list.filter(s => String(s.classNum) === String(targetClass));
    }
    if (targetKeyword) {
      list = list.filter(s =>
        s.studentName.toLowerCase().includes(targetKeyword) ||
        (s.parentPhone && s.parentPhone.includes(targetKeyword))
      );
    }

    return res.json({
      success: true,
      students: list,
      totalCount: list.length
    });
  } catch (err) {
    console.error('Student Search Error:', err);
    return res.status(500).json({ success: false, message: '학생 검색 중 오류가 발생했습니다.' });
  }
});

// GET /api/af/ad_app/sin-courses (신청자 등록 - 강좌 목록 평가 API)
router.get(['/af/ad_app/sin-courses', '/api/af/ad_app/sin-courses'], (req, res) => {
  try {
    const { studentName, gradeClass, period, category, keyword, schoolId } = req.query;
    const targetSchoolId = resolveSchoolId(schoolId || 3267);

    const allCourses = db.getCoursesBySchool(targetSchoolId);
    const applicants = db.getApplicantsBySchool(targetSchoolId);

    // Find student enrollments
    const studentEnrolled = applicants.filter(a => {
      const matchName = studentName && a.studentName === studentName;
      const matchGC = !gradeClass || a.gradeClass === gradeClass;
      return matchName && matchGC;
    });

    const enrolledCourseIds = new Set(studentEnrolled.map(a => String(a.courseId)));
    const enrolledSchedules = studentEnrolled.map(a => {
      const c = allCourses.find(course => String(course.id) === String(a.courseId));
      return c ? (c.schedule || c.scheduleTime) : null;
    }).filter(Boolean);

    let filtered = [...allCourses];

    // Filter by period (월/구분)
    if (period && period !== 'all' && period !== '구분전체') {
      filtered = filtered.filter(c => c.category && c.category.includes(period));
    }

    // Filter by category (늘봄과정)
    if (category && category !== 'all' && category !== '늘봄과정전체') {
      filtered = filtered.filter(c => c.neulbomType === category || (c.category && c.category.includes(category)));
    }

    // Filter by keyword
    if (keyword && keyword.trim()) {
      const term = keyword.trim().toLowerCase();
      filtered = filtered.filter(c => (c.title && c.title.toLowerCase().includes(term)) || (c.instructor && c.instructor.toLowerCase().includes(term)));
    }

    const evaluated = filtered.map(c => {
      const cIdStr = String(c.id);
      const isApplied = enrolledCourseIds.has(cIdStr);
      const enrolledRecord = isApplied ? studentEnrolled.find(a => String(a.courseId) === cIdStr) : null;

      // Count current applicants for this course
      const currentCount = applicants.filter(a => String(a.courseId) === cIdStr).length;
      const capacity = Number(c.capacity) || 20;

      let status = 'available';
      let statusText = '신청';

      if (isApplied) {
        status = 'applied';
        statusText = '신청완료';
      } else if (currentCount >= capacity) {
        status = 'closed';
        statusText = '마감';
      } else if (c.schedule && enrolledSchedules.includes(c.schedule)) {
        status = 'time_conflict';
        statusText = '시간중복';
      }

      return {
        id: c.id,
        title: c.title,
        category: c.category || '26년 8월',
        neulbomType: c.neulbomType || '방과후',
        teacherName: c.instructor || c.teacherName || '강사',
        currentCount,
        capacity,
        waitingCapacity: c.waitingCapacity || 5,
        operatingPeriod: c.operatingPeriod || '2026-08-01~2026-08-31',
        schedule: c.schedule || c.scheduleTime || '월:14:00~14:50',
        fee: c.tuitionFee || c.fee || 38000,
        status,
        statusText,
        enrollmentId: enrolledRecord ? enrolledRecord.id : null
      };
    });

    return res.json({
      success: true,
      courses: evaluated,
      appliedCount: studentEnrolled.length,
      totalCount: evaluated.length
    });
  } catch (err) {
    console.error('Sin-Courses Evaluation Error:', err);
    return res.status(500).json({ success: false, message: '강좌 목록 평가 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_app/direct-apply (신청자 등록 모달 - 즉시 신청)
router.post(['/af/ad_app/direct-apply', '/api/af/ad_app/direct-apply'], (req, res) => {
  try {
    const { studentName, gradeClass, studentNum, parentPhone, courseId, schoolId } = req.body;
    if (!studentName || !courseId) {
      return res.status(400).json({ success: false, message: '학생명과 신청 강좌는 필수 항목입니다.' });
    }

    const targetSchoolId = resolveSchoolId(schoolId || 3267);
    const course = (db.data.courses || []).find(c => String(c.id) === String(courseId) || String(c.code) === String(courseId));

    const newApp = db.createApplicant({
      schoolId: targetSchoolId,
      studentName,
      gradeClass: gradeClass || '1학년 1반',
      studentNum: studentNum || '01',
      parentPhone: parentPhone || '010-0000-0000',
      guardianPhone: parentPhone || '010-0000-0000',
      courseId: course ? course.id : courseId,
      courseTitle: course ? course.title : '신청 강좌',
      category: course ? (course.category || '26년 8월') : '26년 8월',
      neulbomType: course ? (course.neulbomType || '방과후') : '방과후',
      instructorName: course ? (course.instructor || course.teacherName || '강사') : '강사',
      tuitionFee: course ? (course.tuitionFee || course.fee || 38000) : 38000,
      bookFee: course ? (course.bookFee || 0) : 0,
      materialFee: course ? (course.materialFee || 15000) : 15000,
      paymentStatus: '결제대기',
      status: '승인'
    });

    return res.json({
      success: true,
      item: newApp,
      message: `'${course ? course.title : '강좌'}' 신청이 완료되었습니다.`
    });
  } catch (err) {
    console.error('Direct Apply Error:', err);
    return res.status(500).json({ success: false, message: '신청 처리 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_app/direct-cancel (신청자 등록 모달 - 즉시 취소)
router.post(['/af/ad_app/direct-cancel', '/api/af/ad_app/direct-cancel'], (req, res) => {
  try {
    const { studentName, gradeClass, courseId, appId, schoolId } = req.body;
    const targetSchoolId = resolveSchoolId(schoolId || 3267);
    const applicants = db.getApplicantsBySchool(targetSchoolId);

    let target = null;
    if (appId) {
      target = applicants.find(a => String(a.id) === String(appId));
    }
    if (!target && studentName && courseId) {
      target = applicants.find(a => a.studentName === studentName && String(a.courseId) === String(courseId));
    }

    if (target) {
      db.deleteApplicant(target.id);
      return res.json({ success: true, message: '수강신청이 취소되었습니다.' });
    }

    return res.json({ success: true, message: '취소할 신청 내역이 없습니다.' });
  } catch (err) {
    console.error('Direct Cancel Error:', err);
    return res.status(500).json({ success: false, message: '수강신청 취소 중 오류가 발생했습니다.' });
  }
});

// GET /api/af/ad_pay/edit-data (수강료 관리 모달 데이터 조회)
router.get(['/af/ad_pay/edit-data', '/api/af/ad_pay/edit-data'], (req, res) => {
  try {
    const { courseId, schoolId } = req.query;
    const targetSchoolId = resolveSchoolId(schoolId || 3267);
    const allCourses = db.getCoursesBySchool(targetSchoolId);
    const allApplicants = db.getApplicantsBySchool(targetSchoolId);

    const targetCourse = (courseId && courseId !== 'all') ? allCourses.find(c => String(c.id) === String(courseId)) : allCourses[0];
    const cId = targetCourse ? targetCourse.id : (courseId || 'c_3267_1');

    let courseApplicants = allApplicants.filter(a => String(a.courseId) === String(cId));

    // If none found for this specific course, return sample applicants with exact structure
    if (courseApplicants.length === 0) {
      courseApplicants = allApplicants.slice(0, 10).map((a, idx) => ({
        ...a,
        id: `pay_app_${idx + 1}`,
        courseId: cId,
        tuitionFee: a.tuitionFee || 38000,
        facilityFee: a.facilityFee || 7000,
        instructorFee: a.instructorFee || 28000,
        bookFee: a.bookFee || 0,
        materialFee: a.materialFee || 15000,
        totalFee: (a.tuitionFee || 38000) + (a.bookFee || 0) + (a.materialFee || 15000),
        addDate: a.appliedAt || '2026-08-17 15:16:00'
      }));
    }

    return res.json({
      success: true,
      course: targetCourse,
      courses: allCourses,
      applicants: courseApplicants,
      totalCount: courseApplicants.length
    });
  } catch (err) {
    console.error('Pay Edit Data Error:', err);
    return res.status(500).json({ success: false, message: '수강료 데이터 조회 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_pay/save-edit-data (수강료 관리 일괄 저장)
router.post(['/af/ad_pay/save-edit-data', '/api/af/ad_pay/save-edit-data'], (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: '저장할 수강료 데이터가 없습니다.' });
    }

    let updatedCount = 0;
    items.forEach(it => {
      const tuition = Number(it.tuitionFee) || 0;
      const facility = Number(it.facilityFee) || 0;
      const instructor = Number(it.instructorFee) || 0;
      const book = Number(it.bookFee) || 0;
      const material = Number(it.materialFee) || 0;
      const total = tuition + book + material;

      db.updateApplicant(it.id, {
        tuitionFee: tuition,
        facilityFee: facility,
        instructorFee: instructor,
        bookFee: book,
        materialFee: material,
        totalFee: total
      });
      updatedCount++;
    });

    return res.json({
      success: true,
      updatedCount,
      message: `${updatedCount}건의 수강료 정보가 성공적으로 저장되었습니다.`
    });
  } catch (err) {
    console.error('Save Pay Edit Error:', err);
    return res.status(500).json({ success: false, message: '수강료 저장 중 오류가 발생했습니다.' });
  }
});

// POST /api/af/ad_app/copy-course (신청자 복사 실행)
router.post(['/af/ad_app/copy-course', '/api/af/ad_app/copy-course'], (req, res) => {
  try {
    const { courseId1, courseId2, inputType, schoolId } = req.body;
    if (!courseId1 || !courseId2) {
      return res.status(400).json({ success: false, message: '강좌1과 강좌2를 모두 선택하세요.' });
    }

    const targetSchoolId = resolveSchoolId(schoolId || 3267);
    const allCourses = db.getCoursesBySchool(targetSchoolId);
    const allApplicants = db.getApplicantsBySchool(targetSchoolId);

    const srcCourse = allCourses.find(c => String(c.id) === String(courseId1));
    const destCourse = allCourses.find(c => String(c.id) === String(courseId2));

    const sourceApps = allApplicants.filter(a => String(a.courseId) === String(courseId1));

    if (inputType === 'clear') {
      const destApps = allApplicants.filter(a => String(a.courseId) === String(courseId2));
      destApps.forEach(a => db.deleteApplicant(a.id));
    }

    let copiedCount = 0;
    sourceApps.forEach(src => {
      db.createApplicant({
        schoolId: targetSchoolId,
        studentName: src.studentName,
        gradeClass: src.gradeClass,
        studentNum: src.studentNum,
        parentPhone: src.parentPhone,
        courseId: courseId2,
        courseTitle: destCourse ? destCourse.title : (src.courseTitle || '복사된 강좌'),
        category: destCourse ? (destCourse.category || '26년 9월') : '26년 9월',
        neulbomType: destCourse ? (destCourse.neulbomType || '방과후') : '방과후',
        tuitionFee: destCourse ? (destCourse.tuitionFee || src.tuitionFee) : src.tuitionFee,
        bookFee: destCourse ? (destCourse.bookFee || 0) : src.bookFee,
        materialFee: destCourse ? (destCourse.materialFee || 15000) : src.materialFee,
        paymentStatus: '결제대기',
        status: '승인'
      });
      copiedCount++;
    });

    return res.json({
      success: true,
      copiedCount,
      message: `'${srcCourse ? srcCourse.title : '강좌1'}'의 신청자 ${copiedCount}명이 '${destCourse ? destCourse.title : '강좌2'}'(으)로 복사되었습니다.`
    });
  } catch (err) {
    console.error('Copy Course Error:', err);
    return res.status(500).json({ success: false, message: '강좌 복사 중 오류가 발생했습니다.' });
  }
});

// GET /api/af/ad_app/unapplied-students (미신청자 목록 조회)
router.get(['/af/ad_app/unapplied-students', '/api/af/ad_app/unapplied-students'], (req, res) => {
  try {
    const { schoolId, grade, classNum, keyword } = req.query;
    const targetSchoolId = resolveSchoolId(schoolId || 3267);
    const applicants = db.getApplicantsBySchool(targetSchoolId);
    const enrolledNames = new Set(applicants.map(a => a.studentName));

    let unapplied = defaultStudents3267.filter(s => !enrolledNames.has(s.studentName));

    if (grade && grade !== 'all' && grade !== '') {
      unapplied = unapplied.filter(s => String(s.grade) === String(grade));
    }
    if (classNum && classNum !== 'all' && classNum !== '') {
      unapplied = unapplied.filter(s => String(s.classNum) === String(classNum));
    }
    if (keyword && keyword.trim()) {
      const term = keyword.trim().toLowerCase();
      unapplied = unapplied.filter(s => s.studentName.toLowerCase().includes(term));
    }

    return res.json({
      success: true,
      students: unapplied,
      totalCount: unapplied.length
    });
  } catch (err) {
    console.error('Unapplied Students Error:', err);
    return res.status(500).json({ success: false, message: '미신청자 목록 조회 중 오류가 발생했습니다.' });
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


