#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""admin_lec.js의 환불/취소 모달 함수들을 라이브 사이트 1:1 매핑으로 완전 교체"""

JS_FILE = r"c:\Users\user\My project\course\course_site\course_site\af\ad_lec\lists\sn\admin_lec.js"

NEW_JS_SECTION = '''// ==================== Modal 1: 환불/취소 등록 (#refundSinModal) - 라이브 사이트 1:1 매핑 ====================
function openRefundSinModal() {
  const modal = document.getElementById('refundSinModal');
  if (!modal) return;
  modal.style.display = 'flex';

  // 강좌 목록 로드
  const selCourse = document.getElementById('ref_sin_course');
  if (selCourse) {
    const courses = (typeof currentLecturesCache !== 'undefined' && currentLecturesCache.length > 0)
      ? currentLecturesCache
      : [
          { lec_name: '논술 1부', tuitionFee: 30000, receptiveFee: 3000, totalLessons: 12, neulbomType: '방과후' },
          { lec_name: '놀이체육 1부', tuitionFee: 25000, receptiveFee: 2500, totalLessons: 10, neulbomType: '맞춤형' },
          { lec_name: '[특기적성] 창의 로봇교실 A반', tuitionFee: 30000, receptiveFee: 3000, totalLessons: 8, neulbomType: '방과후' },
          { lec_name: '01. [특기] 바이올린 A반', tuitionFee: 30000, receptiveFee: 0, textbookFee: 10000, totalLessons: 12, neulbomType: '방과후' },
          { lec_name: '(월)돌봄 1부', tuitionFee: 0, receptiveFee: 0, totalLessons: 20, neulbomType: '돌봄' }
        ];

    selCourse.innerHTML = '<option value="">= 강좌 선택 =</option>' +
      courses.map(c => `<option value="${c.lec_name || c.title}"
        data-fee="${c.tuitionFee || c.fee || 0}"
        data-receptive="${c.receptiveFee || c.costFacility || 0}"
        data-textbook="${c.textbookFee || 0}"
        data-material="${c.materialFee || 0}"
        data-total="${c.totalLessons || c.totalDays || 12}"
        data-type="${c.neulbomType || '방과후'}"
      >${c.lec_name || c.title}</option>`).join('');
  }

  // 학생정보 초기화
  const stuInfo = document.getElementById('ref_sin_student_info');
  if (stuInfo) stuInfo.value = '';
  const stuResult = document.getElementById('ref_sin_student_result');
  if (stuResult) stuResult.innerHTML = '';

  // 날짜 초기화 (비어있을 때만)
  const lastAttDate = document.getElementById('ref_sin_lastAttendedDate');
  if (lastAttDate && !lastAttDate.value) {
    lastAttDate.value = new Date().toISOString().slice(0, 10);
  }

  // 금액 초기화
  ['ref_sin_fee', 'ref_sin_tuitionRefund', 'ref_sin_fee_after',
   'ref_sin_receptiveFee', 'ref_sin_receptiveRefund', 'ref_sin_receptive_after', 'ref_sin_lecturer_after',
   'ref_sin_textbookFee', 'ref_sin_textbookRefund', 'ref_sin_textbook_after',
   'ref_sin_materialRefund', 'ref_sin_material_after',
   'ref_sin_totalDays', 'ref_sin_attendedDays'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = 0;
  });
  const tdLabel = document.getElementById('ref_sin_totalDays_label');
  if (tdLabel) tdLabel.textContent = '0시간';
  const preAdj = document.getElementById('ref_tuition_pre_adj');
  if (preAdj) preAdj.textContent = '0';
}

function closeRefundSinModal() {
  const modal = document.getElementById('refundSinModal');
  if (modal) modal.style.display = 'none';
}

// 학생 검색
function searchRefundStudent() {
  const query = document.getElementById('ref_sin_student_info')?.value?.trim();
  if (!query) { alert('학생 이름 또는 학년-반-번호를 입력하세요.'); return; }
  const result = document.getElementById('ref_sin_student_result');
  // 샘플 데이터로 검색 시뮬레이션
  const sampleStudents = [
    { grade: '2', classNo: '2', studentNo: '14', name: '박서준', phone: '010-3849-1928' },
    { grade: '3', classNo: '1', studentNo: '08', name: '윤도현', phone: '010-9182-3746' },
    { grade: '1', classNo: '1', studentNo: '05', name: '손희안', phone: '010-5432-9876' },
    { grade: '2', classNo: '3', studentNo: '12', name: '이서연', phone: '010-5555-6666' },
    { grade: '4', classNo: '2', studentNo: '03', name: '김지수', phone: '010-7777-8888' }
  ];
  const found = sampleStudents.filter(s =>
    s.name.includes(query) ||
    `${s.grade}-${s.classNo}-${s.studentNo}`.includes(query) ||
    `${s.grade}학년${s.classNo}반`.includes(query)
  );
  if (found.length === 0) {
    if (result) result.innerHTML = '<span style="color:#d9534f;">검색 결과가 없습니다.</span>';
    return;
  }
  if (result) {
    result.innerHTML = found.map((s, i) => `
      <span style="display:inline-block; margin:2px 6px 2px 0;">
        <a href="#" onclick="selectRefundStudent(${i}); return false;"
          style="color:#428bca; text-decoration:none; font-weight:bold;"
          data-idx="${i}" data-grade="${s.grade}" data-class="${s.classNo}" data-no="${s.studentNo}" data-name="${s.name}" data-phone="${s.phone}">
          [${s.grade}학년 ${s.classNo}반 ${s.studentNo}번 ${s.name}]
        </a>
      </span>`).join('');
    // 첫 번째 결과 자동 선택 (1건이면)
    if (found.length === 1) {
      const s = found[0];
      setRefundStudent(s.grade, s.classNo, s.studentNo, s.name, s.phone, result);
    }
  }
}

function selectRefundStudent(idx) {
  const links = document.querySelectorAll('#ref_sin_student_result a');
  const link = links[idx];
  if (!link) return;
  const grade = link.dataset.grade;
  const classNo = link.dataset.class;
  const studentNo = link.dataset.no;
  const name = link.dataset.name;
  const phone = link.dataset.phone;
  const result = document.getElementById('ref_sin_student_result');
  setRefundStudent(grade, classNo, studentNo, name, phone, result);
}

function setRefundStudent(grade, classNo, studentNo, name, phone, resultEl) {
  const infoEl = document.getElementById('ref_sin_student_info');
  if (infoEl) infoEl.value = `${grade}학년 ${classNo}반 ${studentNo}번 ${name}`;
  const gEl = document.getElementById('ref_sin_grade'); if (gEl) gEl.value = grade;
  const cEl = document.getElementById('ref_sin_classNo'); if (cEl) cEl.value = classNo;
  const nEl = document.getElementById('ref_sin_studentNo'); if (nEl) nEl.value = studentNo;
  const nameEl = document.getElementById('ref_sin_studentName'); if (nameEl) nameEl.value = name;
  const pEl = document.getElementById('ref_sin_parentPhone'); if (pEl) pEl.value = phone;
  if (resultEl) resultEl.innerHTML = `<span style="color:#5cb85c; font-weight:bold;"><i class="fa fa-check"></i> ${grade}학년 ${classNo}반 ${studentNo}번 <strong>${name}</strong> (${phone})</span>`;
}

function fillRefundSampleStudent() {
  const samples = [
    { grade: '2', classNo: '2', studentNo: '14', name: '박서준', phone: '010-3849-1928' },
    { grade: '3', classNo: '1', studentNo: '08', name: '윤도현', phone: '010-9182-3746' },
    { grade: '1', classNo: '1', studentNo: '05', name: '손희안', phone: '010-5432-9876' }
  ];
  const s = samples[Math.floor(Math.random() * samples.length)];
  const result = document.getElementById('ref_sin_student_result');
  setRefundStudent(s.grade, s.classNo, s.studentNo, s.name, s.phone, result);
  const infoEl = document.getElementById('ref_sin_student_info');
  if (infoEl) infoEl.value = `${s.grade}학년 ${s.classNo}반 ${s.studentNo}번 ${s.name}`;
}

function onRefundTypeChanged() {
  // 수강취소 vs 기타(부분환불) 구분 처리
  // 기타 선택 시 ui 변경 등 가능
}

function onRefundDivChanged() {
  // 강좌구분 변경 시 강좌 목록 갱신
  const div = document.getElementById('ref_sin_div')?.value;
  const selCourse = document.getElementById('ref_sin_course');
  if (!selCourse) return;
  // 강좌구분에 따라 강좌 필터 (캐시에서)
  const courses = (typeof currentLecturesCache !== 'undefined' && currentLecturesCache.length > 0)
    ? currentLecturesCache.filter(c => !div || (c.lec_div || '').includes(div))
    : [];
  if (courses.length > 0) {
    selCourse.innerHTML = '<option value="">= 강좌 선택 =</option>' +
      courses.map(c => `<option value="${c.lec_name || c.title}"
        data-fee="${c.tuitionFee || c.fee || 0}"
        data-receptive="${c.receptiveFee || c.costFacility || 0}"
        data-textbook="${c.textbookFee || 0}"
        data-material="${c.materialFee || 0}"
        data-total="${c.totalLessons || c.totalDays || 12}"
        data-type="${c.neulbomType || '방과후'}"
      >${c.lec_name || c.title}</option>`).join('');
  }
}

function onRefundCourseChanged() {
  const selCourse = document.getElementById('ref_sin_course');
  if (!selCourse) return;
  const opt = selCourse.selectedOptions[0];
  if (opt && opt.value) {
    const fee = parseInt(opt.getAttribute('data-fee')) || 0;
    const receptive = parseInt(opt.getAttribute('data-receptive')) || 0;
    const textbook = parseInt(opt.getAttribute('data-textbook')) || 0;
    const material = parseInt(opt.getAttribute('data-material')) || 0;
    const totalDays = parseInt(opt.getAttribute('data-total')) || 12;

    const feeEl = document.getElementById('ref_sin_fee'); if (feeEl) feeEl.value = fee;
    const recEl = document.getElementById('ref_sin_receptiveFee'); if (recEl) recEl.value = receptive;
    const tbEl = document.getElementById('ref_sin_textbookFee'); if (tbEl) tbEl.value = textbook;

    // 총 시수 업데이트
    const tdEl = document.getElementById('ref_sin_totalDays'); if (tdEl) tdEl.value = totalDays;
    const tdLabel = document.getElementById('ref_sin_totalDays_label'); if (tdLabel) tdLabel.textContent = totalDays + '시간';
  }
  calculateRefundModalAmounts();
}

// 환불금액 자동계산 (법정기준: 분할 1/3,1/2 / 일할 / 기타)
function calculateRefundModalAmounts() {
  const beforeCollection = document.getElementById('ref_sin_beforeCollection')?.checked || false;
  const totalDays = parseInt(document.getElementById('ref_sin_totalDays')?.value) || 0;
  const attendedDays = parseInt(document.getElementById('ref_sin_attendedDays')?.value) || 0;
  const tuitionFee = parseInt(document.getElementById('ref_sin_fee')?.value) || 0;
  const receptiveFee = parseInt(document.getElementById('ref_sin_receptiveFee')?.value) || 0;
  const textbookFee = parseInt(document.getElementById('ref_sin_textbookFee')?.value) || 0;
  const calcRule = document.querySelector('input[name="ref_calc_rule"]:checked')?.value || '일할';
  const calcStandard = document.getElementById('ref_sin_calc_standard')?.value || '1/3,1/2';
  const exclFacility = document.getElementById('ref_sin_excl_facility')?.checked || false;
  const roundDown = parseInt(document.getElementById('ref_sin_round_down')?.value) || 0;
  const roundUp = parseInt(document.getElementById('ref_sin_round_up')?.value) || 0;

  let tuitionRefundRaw = 0;
  let receptiveRefundRaw = 0;

  if (beforeCollection || attendedDays === 0) {
    // 징수 전 취소 또는 수업 전 취소: 전액 환불
    tuitionRefundRaw = tuitionFee;
    receptiveRefundRaw = receptiveFee;
  } else if (attendedDays >= totalDays && totalDays > 0) {
    tuitionRefundRaw = 0;
    receptiveRefundRaw = 0;
  } else if (calcRule === '일할') {
    const baseForCalc = exclFacility ? (tuitionFee - receptiveFee) : tuitionFee;
    const remaining = totalDays > 0 ? Math.max(0, totalDays - attendedDays) / totalDays : 0;
    tuitionRefundRaw = Math.floor(baseForCalc * remaining);
    if (exclFacility) tuitionRefundRaw += receptiveFee; // 수용비는 별도 전액
    receptiveRefundRaw = Math.floor(receptiveFee * remaining);
  } else if (calcRule === '분할') {
    const ratio = totalDays > 0 ? attendedDays / totalDays : 0;
    if (calcStandard === '1/3,1/2') {
      if (ratio < 1/3) {
        tuitionRefundRaw = Math.floor(tuitionFee * 2 / 3);
        receptiveRefundRaw = Math.floor(receptiveFee * 2 / 3);
      } else if (ratio < 1/2) {
        tuitionRefundRaw = Math.floor(tuitionFee / 2);
        receptiveRefundRaw = Math.floor(receptiveFee / 2);
      } else {
        tuitionRefundRaw = 0;
        receptiveRefundRaw = 0;
      }
    } else {
      // 1/2only
      if (ratio < 1/2) {
        tuitionRefundRaw = Math.floor(tuitionFee / 2);
        receptiveRefundRaw = Math.floor(receptiveFee / 2);
      } else {
        tuitionRefundRaw = 0;
        receptiveRefundRaw = 0;
      }
    }
  } else {
    // 기타: 직접 입력 (계산 안함)
    tuitionRefundRaw = parseInt(document.getElementById('ref_sin_tuitionRefund')?.value) || 0;
    receptiveRefundRaw = parseInt(document.getElementById('ref_sin_receptiveRefund')?.value) || 0;
  }

  // 버림/올림 적용
  function applyRounding(amount) {
    if (roundDown > 0 && (amount % roundDown) < roundDown) {
      const remainder = amount % roundDown;
      if (remainder > 0 && remainder < (roundUp > 0 ? roundUp : roundDown)) {
        amount = amount - remainder;
      } else if (roundUp > 0 && remainder >= roundUp) {
        amount = amount - remainder + roundDown;
      }
    }
    return amount;
  }

  const tuitionRefund = applyRounding(tuitionRefundRaw);
  const receptiveRefund = applyRounding(receptiveRefundRaw);

  // 환불금액 적용
  const tRefEl = document.getElementById('ref_sin_tuitionRefund');
  if (tRefEl) tRefEl.value = tuitionRefund;
  const rRefEl = document.getElementById('ref_sin_receptiveRefund');
  if (rRefEl) rRefEl.value = receptiveRefund;

  // 조정 전 표시
  const preAdj = document.getElementById('ref_tuition_pre_adj');
  if (preAdj) preAdj.textContent = tuitionRefundRaw.toLocaleString();

  // 환불 후 금액 계산
  const feeAfter = Math.max(0, tuitionFee - tuitionRefund);
  const receptiveAfter = Math.max(0, receptiveFee - receptiveRefund);
  const lecturerAfter = Math.max(0, feeAfter - receptiveAfter);
  const textbookRefund = parseInt(document.getElementById('ref_sin_textbookRefund')?.value) || 0;
  const textbookAfter = Math.max(0, textbookFee - textbookRefund);
  const materialRefund = parseInt(document.getElementById('ref_sin_materialRefund')?.value) || 0;

  const feeAfterEl = document.getElementById('ref_sin_fee_after'); if (feeAfterEl) feeAfterEl.value = feeAfter;
  const recAfterEl = document.getElementById('ref_sin_receptive_after'); if (recAfterEl) recAfterEl.value = receptiveAfter;
  const lecAfterEl = document.getElementById('ref_sin_lecturer_after'); if (lecAfterEl) lecAfterEl.value = lecturerAfter;
  const tbAfterEl = document.getElementById('ref_sin_textbook_after'); if (tbAfterEl) tbAfterEl.value = textbookAfter;
  const matAfterEl = document.getElementById('ref_sin_material_after'); if (matAfterEl) matAfterEl.value = 0;
}

// 수용비 환불금액 계산 버튼
function calcFacilityRefund() {
  const tuitionFee = parseInt(document.getElementById('ref_sin_fee')?.value) || 0;
  const tuitionRefund = parseInt(document.getElementById('ref_sin_tuitionRefund')?.value) || 0;
  const receptiveFee = parseInt(document.getElementById('ref_sin_receptiveFee')?.value) || 0;
  // 수강료 환불 비율에 따라 수용비도 같은 비율로 계산
  const ratio = tuitionFee > 0 ? tuitionRefund / tuitionFee : 0;
  const receptiveRefund = Math.floor(receptiveFee * ratio);
  const rRefEl = document.getElementById('ref_sin_receptiveRefund');
  if (rRefEl) rRefEl.value = receptiveRefund;
  calculateRefundModalAmounts();
}

async function submitRefundSin(event) {
  if (event) event.preventDefault();
  const studentName = document.getElementById('ref_sin_studentName')?.value?.trim();
  const courseTitle = document.getElementById('ref_sin_course')?.value?.trim();
  const reason = document.getElementById('ref_sin_reason')?.value?.trim();

  if (!courseTitle) { alert('강좌를 선택하세요.'); return; }
  if (!studentName && !document.getElementById('ref_sin_student_info')?.value?.trim()) {
    alert('학생 정보를 입력하세요.'); return;
  }

  const payload = {
    studentName: studentName || document.getElementById('ref_sin_student_info')?.value?.trim() || '',
    grade: document.getElementById('ref_sin_grade')?.value || '',
    classNo: document.getElementById('ref_sin_classNo')?.value || '',
    studentNo: document.getElementById('ref_sin_studentNo')?.value || '',
    parentPhone: document.getElementById('ref_sin_parentPhone')?.value || '',
    courseTitle,
    appType: document.querySelector('input[name="ref_sin_app_type"]:checked')?.value || '수강취소',
    beforeCollection: document.getElementById('ref_sin_beforeCollection')?.checked ? 'Y' : 'N',
    totalDays: parseInt(document.getElementById('ref_sin_totalDays')?.value) || 0,
    attendedDays: parseInt(document.getElementById('ref_sin_attendedDays')?.value) || 0,
    lastAttendedDate: document.getElementById('ref_sin_lastAttendedDate')?.value || '',
    tuitionFee: parseInt(document.getElementById('ref_sin_fee')?.value) || 0,
    tuitionRefund: parseInt(document.getElementById('ref_sin_tuitionRefund')?.value) || 0,
    receptiveFee: parseInt(document.getElementById('ref_sin_receptiveFee')?.value) || 0,
    receptiveRefund: parseInt(document.getElementById('ref_sin_receptiveRefund')?.value) || 0,
    textbookFee: parseInt(document.getElementById('ref_sin_textbookFee')?.value) || 0,
    textbookRefund: parseInt(document.getElementById('ref_sin_textbookRefund')?.value) || 0,
    materialRefund: parseInt(document.getElementById('ref_sin_materialRefund')?.value) || 0,
    status: document.querySelector('input[name="ref_sin_status"]:checked')?.value || '접수',
    reason: reason || '',
    note: document.getElementById('ref_sin_note')?.value?.trim() || ''
  };

  try {
    const res = await fetch('/api/af/ad_ref/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      closeRefundSinModal();
      await loadRefunds();
      alert(data.message || '환불/취소 등록이 완료되었습니다.');
    } else {
      alert(data.message || '환불/취소 등록에 실패했습니다.');
    }
  } catch (e) {
    console.error('submitRefundSin Error:', e);
    alert('서버 통신 오류가 발생했습니다.');
  }
}'''

# 배치 모달 새 함수
NEW_BATCH_JS = '''// ==================== Modal 2: 환불/취소 일괄등록 (#refundBatchModal) - 라이브 사이트 1:1 매핑 ====================
let _refundBatchStudents = []; // 강좌별 학생 목록

function openRefundBatchModal() {
  const modal = document.getElementById('refundBatchModal');
  if (!modal) return;
  modal.style.display = 'flex';

  // 강좌 목록 로드
  const selCourse = document.getElementById('ref_batch_course');
  if (selCourse) {
    const courses = (typeof currentLecturesCache !== 'undefined' && currentLecturesCache.length > 0)
      ? currentLecturesCache
      : [
          { lec_name: '논술 1부', tuitionFee: 30000, receptiveFee: 3000, totalLessons: 12, neulbomType: '방과후' },
          { lec_name: '놀이체육 1부', tuitionFee: 25000, receptiveFee: 2500, totalLessons: 10, neulbomType: '맞춤형' },
          { lec_name: '[특기적성] 창의 로봇교실 A반', tuitionFee: 30000, receptiveFee: 3000, totalLessons: 8, neulbomType: '방과후' },
          { lec_name: '(월)돌봄 1부', tuitionFee: 0, receptiveFee: 0, totalLessons: 20, neulbomType: '돌봄' }
        ];
    selCourse.innerHTML = '<option value="">= 강좌 선택 =</option>' +
      courses.map(c => `<option value="${c.lec_name || c.title}"
        data-fee="${c.tuitionFee || c.fee || 0}"
        data-receptive="${c.receptiveFee || c.costFacility || 0}"
        data-total="${c.totalLessons || c.totalDays || 12}"
      >${c.lec_name || c.title}</option>`).join('');
  }

  // 학생목록 초기화
  const stuList = document.getElementById('ref_batch_student_list');
  if (stuList) stuList.innerHTML = '강좌를 선택하면 학생 목록이 표시됩니다.';
  _refundBatchStudents = [];

  // 금액 초기화
  ['ref_batch_fee', 'ref_batch_tuitionRefund', 'ref_batch_fee_after',
   'ref_batch_receptiveFee', 'ref_batch_receptiveRefund', 'ref_batch_receptive_after', 'ref_batch_lecturer_after',
   'ref_batch_totalDays', 'ref_batch_attendedDays'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = 0;
  });
  const tdLabel = document.getElementById('ref_batch_totalDays_label');
  if (tdLabel) tdLabel.textContent = '0시간';
  const preAdj = document.getElementById('ref_batch_tuition_pre_adj');
  if (preAdj) preAdj.textContent = '0';
}

function closeRefundBatchModal() {
  const modal = document.getElementById('refundBatchModal');
  if (modal) modal.style.display = 'none';
}

function onRefundBatchDivChanged() {
  const div = document.getElementById('ref_batch_div')?.value;
  const selCourse = document.getElementById('ref_batch_course');
  if (!selCourse) return;
  // 강좌 구분별 필터 (캐시에서)
  const courses = (typeof currentLecturesCache !== 'undefined' && currentLecturesCache.length > 0)
    ? currentLecturesCache
    : [];
  if (courses.length > 0) {
    selCourse.innerHTML = '<option value="">= 강좌 선택 =</option>' +
      courses.map(c => `<option value="${c.lec_name || c.title}"
        data-fee="${c.tuitionFee || c.fee || 0}"
        data-receptive="${c.receptiveFee || c.costFacility || 0}"
        data-total="${c.totalLessons || 12}"
      >${c.lec_name || c.title}</option>`).join('');
  }
}

function onRefundBatchCourseChanged() {
  const selCourse = document.getElementById('ref_batch_course');
  if (!selCourse) return;
  const opt = selCourse.selectedOptions[0];
  if (!opt || !opt.value) {
    const stuList = document.getElementById('ref_batch_student_list');
    if (stuList) stuList.innerHTML = '강좌를 선택하면 학생 목록이 표시됩니다.';
    return;
  }

  const fee = parseInt(opt.getAttribute('data-fee')) || 0;
  const receptive = parseInt(opt.getAttribute('data-receptive')) || 0;
  const totalDays = parseInt(opt.getAttribute('data-total')) || 12;

  // 징수금액 (읽기전용)
  const feeEl = document.getElementById('ref_batch_fee'); if (feeEl) feeEl.value = fee;
  const recEl = document.getElementById('ref_batch_receptiveFee'); if (recEl) recEl.value = receptive;
  const tdEl = document.getElementById('ref_batch_totalDays'); if (tdEl) tdEl.value = totalDays;
  const tdLabel = document.getElementById('ref_batch_totalDays_label'); if (tdLabel) tdLabel.textContent = totalDays + '시간';

  // 샘플 학생 목록 생성 (실제로는 API에서 수강자 가져옴)
  _refundBatchStudents = [
    { grade: '2', classNo: '2', studentNo: '3', name: '국민준', fee: fee, receptiveFee: receptive, hasRefund: false },
    { grade: '2', classNo: '2', studentNo: '8', name: '김태름', fee: fee, receptiveFee: receptive, hasRefund: false },
    { grade: '2', classNo: '2', studentNo: '10', name: '배율후', fee: fee, receptiveFee: receptive, hasRefund: true }, // 이미 환불 내역
    { grade: '2', classNo: '3', studentNo: '5', name: '이민지', fee: fee + 1000, receptiveFee: receptive, hasRefund: false }, // 수강료 다름
  ];

  const stuList = document.getElementById('ref_batch_student_list');
  if (stuList) {
    stuList.innerHTML = _refundBatchStudents.map((s, i) => {
      const disabled = s.hasRefund || (s.fee !== fee);
      const reason = s.hasRefund ? '환불내역 있음' : (s.fee !== fee ? '수강료 불일치' : '');
      return `
        <label style="display:block; margin:3px 0; cursor:${disabled ? 'not-allowed' : 'pointer'}; color:${disabled ? '#aaa' : '#333'}; font-weight:normal;">
          <input type="checkbox" class="ref_batch_student_chk" value="${i}" ${disabled ? 'disabled' : ''}
            style="margin-right:6px;" onchange="onRefundBatchStudentToggle();">
          ${s.grade}학년 ${s.classNo}반 ${s.studentNo}번 ${s.name}
          ${disabled ? `<span style="color:#d9534f; font-size:11px; margin-left:6px;">(선택불가: ${reason})</span>` : ''}
        </label>`;
    }).join('');
  }

  calculateRefundBatchAmounts();
}

function toggleRefundBatchAllStudents(cb) {
  const chks = document.querySelectorAll('.ref_batch_student_chk:not(:disabled)');
  chks.forEach(c => { c.checked = cb.checked; });
  onRefundBatchStudentToggle();
}

function onRefundBatchStudentToggle() {
  const checked = document.querySelectorAll('.ref_batch_student_chk:checked');
  // 선택된 학생수 표시 등 처리
}

function calculateRefundBatchAmounts() {
  const beforeCollection = document.getElementById('ref_batch_beforeCollection')?.checked || false;
  const totalDays = parseInt(document.getElementById('ref_batch_totalDays')?.value) || 0;
  const attendedDays = parseInt(document.getElementById('ref_batch_attendedDays')?.value) || 0;
  const tuitionFee = parseInt(document.getElementById('ref_batch_fee')?.value) || 0;
  const receptiveFee = parseInt(document.getElementById('ref_batch_receptiveFee')?.value) || 0;
  const calcRule = document.querySelector('input[name="ref_batch_calc_rule"]:checked')?.value || '일할';
  const calcStandard = document.getElementById('ref_batch_calc_standard')?.value || '1/3,1/2';
  const exclFacility = document.getElementById('ref_batch_excl_facility')?.checked || false;
  const roundDown = parseInt(document.getElementById('ref_batch_round_down')?.value) || 0;
  const roundUp = parseInt(document.getElementById('ref_batch_round_up')?.value) || 0;

  let tuitionRefundRaw = 0;
  let receptiveRefundRaw = 0;

  if (beforeCollection || attendedDays === 0) {
    tuitionRefundRaw = tuitionFee;
    receptiveRefundRaw = receptiveFee;
  } else if (attendedDays >= totalDays && totalDays > 0) {
    tuitionRefundRaw = 0;
    receptiveRefundRaw = 0;
  } else if (calcRule === '일할') {
    const baseForCalc = exclFacility ? (tuitionFee - receptiveFee) : tuitionFee;
    const remaining = totalDays > 0 ? Math.max(0, totalDays - attendedDays) / totalDays : 0;
    tuitionRefundRaw = Math.floor(baseForCalc * remaining);
    if (exclFacility) tuitionRefundRaw += receptiveFee;
    receptiveRefundRaw = Math.floor(receptiveFee * remaining);
  } else if (calcRule === '분할') {
    const ratio = totalDays > 0 ? attendedDays / totalDays : 0;
    if (calcStandard === '1/3,1/2') {
      if (ratio < 1/3) { tuitionRefundRaw = Math.floor(tuitionFee * 2 / 3); receptiveRefundRaw = Math.floor(receptiveFee * 2 / 3); }
      else if (ratio < 1/2) { tuitionRefundRaw = Math.floor(tuitionFee / 2); receptiveRefundRaw = Math.floor(receptiveFee / 2); }
      else { tuitionRefundRaw = 0; receptiveRefundRaw = 0; }
    } else {
      if (ratio < 1/2) { tuitionRefundRaw = Math.floor(tuitionFee / 2); receptiveRefundRaw = Math.floor(receptiveFee / 2); }
      else { tuitionRefundRaw = 0; receptiveRefundRaw = 0; }
    }
  } else {
    tuitionRefundRaw = parseInt(document.getElementById('ref_batch_tuitionRefund')?.value) || 0;
    receptiveRefundRaw = parseInt(document.getElementById('ref_batch_receptiveRefund')?.value) || 0;
  }

  function applyRounding(amount) {
    if (roundDown > 0) {
      const rem = amount % roundDown;
      if (rem > 0) {
        if (roundUp > 0 && rem >= roundUp) amount = amount - rem + roundDown;
        else amount = amount - rem;
      }
    }
    return amount;
  }

  const tuitionRefund = applyRounding(tuitionRefundRaw);
  const receptiveRefund = applyRounding(receptiveRefundRaw);

  const tRefEl = document.getElementById('ref_batch_tuitionRefund');
  if (tRefEl) tRefEl.value = tuitionRefund;
  const rRefEl = document.getElementById('ref_batch_receptiveRefund');
  if (rRefEl) rRefEl.value = receptiveRefund;
  const preAdj = document.getElementById('ref_batch_tuition_pre_adj');
  if (preAdj) preAdj.textContent = tuitionRefundRaw.toLocaleString();

  const feeAfter = Math.max(0, tuitionFee - tuitionRefund);
  const receptiveAfter = Math.max(0, receptiveFee - receptiveRefund);
  const lecturerAfter = Math.max(0, feeAfter - receptiveAfter);

  const feeAfterEl = document.getElementById('ref_batch_fee_after'); if (feeAfterEl) feeAfterEl.value = feeAfter;
  const recAfterEl = document.getElementById('ref_batch_receptive_after'); if (recAfterEl) recAfterEl.value = receptiveAfter;
  const lecAfterEl = document.getElementById('ref_batch_lecturer_after'); if (lecAfterEl) lecAfterEl.value = lecturerAfter;
}

function calcBatchFacilityRefund() {
  const tuitionFee = parseInt(document.getElementById('ref_batch_fee')?.value) || 0;
  const tuitionRefund = parseInt(document.getElementById('ref_batch_tuitionRefund')?.value) || 0;
  const receptiveFee = parseInt(document.getElementById('ref_batch_receptiveFee')?.value) || 0;
  const ratio = tuitionFee > 0 ? tuitionRefund / tuitionFee : 0;
  const receptiveRefund = Math.floor(receptiveFee * ratio);
  const rRefEl = document.getElementById('ref_batch_receptiveRefund');
  if (rRefEl) rRefEl.value = receptiveRefund;
  calculateRefundBatchAmounts();
}

function fillRefundBatchSample() {
  // 강좌 먼저 선택
  const selCourse = document.getElementById('ref_batch_course');
  if (selCourse && selCourse.options.length > 1 && !selCourse.value) {
    selCourse.selectedIndex = 1;
    onRefundBatchCourseChanged();
  }
  // 수강시수 샘플 입력
  const attEl = document.getElementById('ref_batch_attendedDays');
  if (attEl) attEl.value = 3;
  const lastEl = document.getElementById('ref_batch_lastDate');
  if (lastEl) lastEl.value = new Date().toISOString().slice(0, 10);
  const reasonEl = document.getElementById('ref_batch_reason');
  if (reasonEl) reasonEl.value = '개인사정';
  // 첫 번째 미선택 학생 체크
  const firstChk = document.querySelector('.ref_batch_student_chk:not(:disabled)');
  if (firstChk) firstChk.checked = true;
  calculateRefundBatchAmounts();
}

async function submitRefundBatch() {
  const selectedChks = [...document.querySelectorAll('.ref_batch_student_chk:checked')];
  const courseTitle = document.getElementById('ref_batch_course')?.value?.trim();
  const reason = document.getElementById('ref_batch_reason')?.value?.trim();

  if (!courseTitle) { alert('강좌를 선택하세요.'); return; }
  if (selectedChks.length === 0) { alert('등록할 학생을 선택하세요.'); return; }

  const tuitionRefund = parseInt(document.getElementById('ref_batch_tuitionRefund')?.value) || 0;
  const receptiveRefund = parseInt(document.getElementById('ref_batch_receptiveRefund')?.value) || 0;
  const tuitionFee = parseInt(document.getElementById('ref_batch_fee')?.value) || 0;
  const receptiveFee = parseInt(document.getElementById('ref_batch_receptiveFee')?.value) || 0;
  const attendedDays = parseInt(document.getElementById('ref_batch_attendedDays')?.value) || 0;
  const totalDays = parseInt(document.getElementById('ref_batch_totalDays')?.value) || 0;
  const lastDate = document.getElementById('ref_batch_lastDate')?.value || '';
  const beforeCollection = document.getElementById('ref_batch_beforeCollection')?.checked ? 'Y' : 'N';
  const note = document.getElementById('ref_batch_note')?.value?.trim() || '';
  const appType = document.querySelector('input[name="ref_batch_app_type"]:checked')?.value || '수강취소';
  const feeAfter = Math.max(0, tuitionFee - tuitionRefund);

  const refunds = selectedChks.map(chk => {
    const idx = parseInt(chk.value);
    const s = _refundBatchStudents[idx] || {};
    return {
      studentName: s.name || '',
      grade: s.grade || '',
      classNo: s.classNo || '',
      studentNo: s.studentNo || '',
      parentPhone: s.phone || '',
      courseTitle,
      appType,
      beforeCollection,
      totalDays,
      attendedDays,
      lastAttendedDate: lastDate,
      tuitionFee,
      tuitionRefund,
      receptiveFee,
      receptiveRefund,
      textbookFee: 0,
      textbookRefund: 0,
      materialRefund: 0,
      status: '처리완료',
      reason: reason || '일괄등록',
      note,
      feeAfter
    };
  });

  try {
    const res = await fetch('/api/af/ad_ref/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refunds })
    });
    const data = await res.json();
    if (data.success) {
      closeRefundBatchModal();
      await loadRefunds();
      alert(data.message || `총 ${refunds.length}건이 등록되었습니다.`);
    } else {
      alert(data.message || '일괄 등록에 실패했습니다.');
    }
  } catch (e) {
    console.error('submitRefundBatch Error:', e);
    alert('서버 통신 오류가 발생했습니다.');
  }
}

// 기존 함수와의 호환성 유지
async function openRefundCalculator() { openRefundSinModal(); }
function parseRefundBatchPreview() { calculateRefundBatchAmounts(); }
'''

with open(JS_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# Modal 1 시작 찾기 (한글 주석)
START_1 = content.find('// ==================== Modal 1: ')
if START_1 == -1:
    print("ERROR: Modal 1 start not found")
    exit(1)

# Modal 2 끝 찾기 - "openRefundCalculator" 함수 이후
# 실제로는 다음 주석 블록까지
END_MARKER = '// Redirect old helper calculator'
END_IDX = content.find(END_MARKER, START_1)
if END_IDX == -1:
    # 대안: async function openRefundCalculator
    END_MARKER = 'async function openRefundCalculator'
    END_IDX = content.find(END_MARKER, START_1)

# openRefundCalculator 함수 전체 포함해서 끝 찾기
NEXT_SECTION = '// ==================== 6. '
NEXT_IDX = content.find(NEXT_SECTION, START_1)
if NEXT_IDX == -1:
    NEXT_SECTION = '// ==================== 6.'
    NEXT_IDX = content.find(NEXT_SECTION, START_1)

print(f"START_1: {START_1}")
print(f"NEXT_IDX (next section): {NEXT_IDX}")
print(f"Content between: {content[START_1:START_1+100]}")
print(f"Next section: {content[NEXT_IDX:NEXT_IDX+80]}")

if NEXT_IDX > START_1:
    old_section = content[START_1:NEXT_IDX]
    print(f"Replacing {len(old_section)} chars...")
    new_content = content[:START_1] + NEW_JS_SECTION + '\n' + NEW_BATCH_JS + '\n' + content[NEXT_IDX:]
    with open(JS_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"SUCCESS: New file size: {len(new_content)}")
else:
    print("ERROR: Could not find section boundaries")
