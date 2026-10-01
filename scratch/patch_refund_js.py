import re

js_file = 'course_site/af/ad_lec/lists/sn/admin_lec.js'

with open(js_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace loadRefunds block
start_marker = '// ==================== 5. 환불/취소관리 (/af/ad_ref/lists) ===================='
end_marker = '// ==================== 6. 결석/귀가신청 (/af/ad_abs/lists) ===================='

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Error: Could not locate markers in admin_lec.js", start_idx, end_idx)
    exit(1)

new_refund_code = '''// ==================== 5. 환불/취소관리 (/af/ad_ref/lists) ====================
let currentRefundsCache = [];

async function loadRefunds() {
  try {
    const res = await fetch('/api/af/ad_ref/lists');
    const data = await res.json();
    currentRefundsCache = data.refunds || [];

    populateRefundCourseOptions();
    renderRefundTable(currentRefundsCache);
  } catch (e) {
    console.error('loadRefunds Error:', e);
  }
}

function populateRefundCourseOptions() {
  const selCourse = document.getElementById('ref_sel_course');
  if (!selCourse) return;
  
  const courseTitles = new Set();
  if (typeof currentLecturesCache !== 'undefined' && Array.isArray(currentLecturesCache)) {
    currentLecturesCache.forEach(c => { if (c.title || c.lec_name) courseTitles.add(c.title || c.lec_name); });
  }
  currentRefundsCache.forEach(r => { if (r.courseTitle) courseTitles.add(r.courseTitle); });

  const currentVal = selCourse.value;
  selCourse.innerHTML = '<option value="">=강좌전체=</option>' +
    Array.from(courseTitles).sort().map(t => `<option value="${t}">${t}</option>`).join('');
  if (currentVal) selCourse.value = currentVal;
}

function renderRefundTable(list) {
  const tbody = document.getElementById('refundTbody');
  if (!tbody) return;

  if (!list || list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="21" class="center" style="padding:40px; color:#888;">조회된 환불/취소 데이터가 없습니다.</td></tr>';
    const totalCountEl = document.getElementById('refundTotalCount');
    if (totalCountEl) totalCountEl.textContent = '0';
    const totalSumEl = document.getElementById('refundTotalSum');
    if (totalSumEl) totalSumEl.textContent = '0';
    return;
  }

  let totalRefundSum = 0;
  tbody.innerHTML = list.map((r, idx) => {
    totalRefundSum += (parseInt(r.refundAmount) || 0);

    let statusBadge = '';
    if (r.status === '처리완료') {
      statusBadge = `<span class="badge" style="background:#5cb85c; cursor:pointer;" onclick="toggleRefundStatus('${r.id}', '${r.status}')" title="클릭하여 상태 변경">처리완료</span>`;
    } else if (r.status === '강사확인') {
      statusBadge = `<span class="badge" style="background:#337ab7; cursor:pointer;" onclick="toggleRefundStatus('${r.id}', '${r.status}')" title="클릭하여 상태 변경">강사확인</span>`;
    } else {
      statusBadge = `<span class="badge" style="background:#f0ad4e; cursor:pointer;" onclick="toggleRefundStatus('${r.id}', '${r.status}')" title="클릭하여 상태 변경">접수</span>`;
    }

    const beforeColBadge = r.beforeCollection === 'Y' 
      ? '<span style="color:#d9534f; font-weight:bold;">Y (징수전)</span>' 
      : '<span style="color:#64748b;">N</span>';

    return `
      <tr style="height:36px;">
        <td style="vertical-align:middle;"><input type="checkbox" class="ref-checkbox" value="${r.id}"></td>
        <td style="vertical-align:middle;">${idx + 1}</td>
        <td style="vertical-align:middle;">${statusBadge}</td>
        <td style="vertical-align:middle;">${r.appType || '일반'}</td>
        <td style="vertical-align:middle;">${r.neulbomType || '방과후'}</td>
        <td style="vertical-align:middle; text-align:left; font-weight:bold; color:#1e293b;">${r.courseTitle || ''}</td>
        <td style="vertical-align:middle;">${r.grade || ''}</td>
        <td style="vertical-align:middle;">${r.classNo || ''}</td>
        <td style="vertical-align:middle;">${r.studentNo || ''}</td>
        <td style="vertical-align:middle; font-weight:bold; color:#337ab7;">${r.studentName || ''}</td>
        <td style="vertical-align:middle;">${r.parentPhone || ''}</td>
        <td style="vertical-align:middle;">${r.lastAttendedDate || '-'}</td>
        <td style="vertical-align:middle; text-align:right;">
          <span style="color:#666; font-size:11px;">${(parseInt(r.tuitionFee) || 0).toLocaleString()}원</span><br>
          <strong style="color:#d9534f;">${(parseInt(r.tuitionRefund) || 0).toLocaleString()}원</strong>
        </td>
        <td style="vertical-align:middle; text-align:right;">
          <span style="color:#666; font-size:11px;">${(parseInt(r.receptiveFee) || 0).toLocaleString()}원</span><br>
          <strong style="color:#d9534f;">${(parseInt(r.receptiveRefund) || 0).toLocaleString()}원</strong>
        </td>
        <td style="vertical-align:middle; text-align:right;">
          <span style="color:#666; font-size:11px;">${(parseInt(r.textbookFee) || 0).toLocaleString()}원</span><br>
          <strong style="color:#d9534f;">${(parseInt(r.textbookRefund) || 0).toLocaleString()}원</strong>
        </td>
        <td style="vertical-align:middle; text-align:right;">
          <span style="color:#666; font-size:11px;">${(parseInt(r.materialFee) || 0).toLocaleString()}원</span><br>
          <strong style="color:#d9534f;">${(parseInt(r.materialRefund) || 0).toLocaleString()}원</strong>
        </td>
        <td style="vertical-align:middle;">${beforeColBadge}</td>
        <td style="vertical-align:middle;">${r.effectiveDate || '-'}</td>
        <td style="vertical-align:middle; text-align:left; font-size:11px; color:#555;">${r.reason || ''}</td>
        <td style="vertical-align:middle; font-size:11px; color:#777;">${r.createdAt || ''}</td>
        <td style="vertical-align:middle;">
          <button type="button" class="btn btn-default btn-xs" onclick="deleteRefundItem('${r.id}', '${r.studentName}')" style="border:none; background:none; color:#d9534f; cursor:pointer;" title="삭제">
            <i class="fa fa-trash-o" style="font-size:15px;"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  const totalCountEl = document.getElementById('refundTotalCount');
  if (totalCountEl) totalCountEl.textContent = list.length;
  const totalSumEl = document.getElementById('refundTotalSum');
  if (totalSumEl) totalSumEl.textContent = totalRefundSum.toLocaleString();
}

function filterRefunds() {
  const selDiv = (document.getElementById('ref_sel_div')?.value || 'all');
  const selProType = (document.getElementById('ref_sel_pro_type')?.value || 'all');
  const selCourse = (document.getElementById('ref_sel_course')?.value || '').trim();
  const selGrade = (document.getElementById('ref_sel_grade')?.value || '').trim();
  const selClass = (document.getElementById('ref_sel_class')?.value || '').trim();
  const selType = (document.getElementById('ref_sel_type')?.value || 'name');
  const searchWord = (document.getElementById('ref_search_word')?.value || '').trim().toLowerCase();

  const filtered = currentRefundsCache.filter(r => {
    if (selProType !== 'all' && r.neulbomType !== selProType) return false;
    if (selCourse && r.courseTitle !== selCourse) return false;
    if (selGrade && String(r.grade) !== selGrade) return false;
    if (selClass && String(r.classNo) !== selClass) return false;

    if (searchWord) {
      if (selType === 'name' && !(r.studentName || '').toLowerCase().includes(searchWord)) return false;
      if (selType === 'tel' && !(r.parentPhone || '').replace(/-/g, '').includes(searchWord.replace(/-/g, ''))) return false;
      if (selType === 'status' && !(r.status || '').toLowerCase().includes(searchWord)) return false;
    }
    return true;
  });

  renderRefundTable(filtered);
}

function resetRefundSearch() {
  const form = document.getElementById('fm_list_search_ref');
  if (form) form.reset();
  const word = document.getElementById('ref_search_word');
  if (word) word.value = '';
  renderRefundTable(currentRefundsCache);
}

function toggleAllRefundCheckboxes(master) {
  const checkboxes = document.querySelectorAll('.ref-checkbox');
  checkboxes.forEach(cb => { cb.checked = master.checked; });
}

async function toggleRefundStatus(id, currentStatus) {
  let nextStatus = '접수';
  if (currentStatus === '접수') nextStatus = '강사확인';
  else if (currentStatus === '강사확인') nextStatus = '처리완료';
  else if (currentStatus === '처리완료') nextStatus = '접수';

  try {
    const res = await fetch('/api/af/ad_ref/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: nextStatus })
    });
    const data = await res.json();
    if (data.success) {
      await loadRefunds();
    } else {
      alert(data.message || '상태 변경에 실패했습니다.');
    }
  } catch (e) {
    console.error('toggleRefundStatus Error:', e);
  }
}

async function handleBulkRefundStatus(status) {
  const selected = Array.from(document.querySelectorAll('.ref-checkbox:checked')).map(cb => cb.value);
  if (selected.length === 0) {
    alert('일괄 처리할 항목을 1개 이상 선택하세요.');
    return;
  }
  for (const id of selected) {
    await fetch('/api/af/ad_ref/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
  }
  alert(`선택한 ${selected.length}건이 '${status}' 처리되었습니다.`);
  await loadRefunds();
}

async function handleBulkRefundDelete() {
  const selected = Array.from(document.querySelectorAll('.ref-checkbox:checked')).map(cb => cb.value);
  if (selected.length === 0) {
    alert('삭제할 항목을 1개 이상 선택하세요.');
    return;
  }
  if (!confirm(`선택한 ${selected.length}건의 환불/취소 내역을 정말 삭제하시겠습니까?`)) {
    return;
  }
  for (const id of selected) {
    await fetch('/api/af/ad_ref/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
  }
  alert(`선택한 ${selected.length}건이 삭제되었습니다.`);
  await loadRefunds();
}

async function deleteRefundItem(id, name) {
  if (!confirm(`'${name}' 학생의 환불/취소 내역을 정말 삭제하시겠습니까?`)) {
    return;
  }
  try {
    const res = await fetch('/api/af/ad_ref/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (data.success) {
      await loadRefunds();
    } else {
      alert(data.message || '삭제에 실패했습니다.');
    }
  } catch (e) {
    console.error('deleteRefundItem Error:', e);
  }
}

function exportRefundExcel() {
  window.location.href = '/api/af/ad_ref/excel';
}

// ==================== Modal 1: 환불/취소 등록 및 환불 계산기 (#refundSinModal) ====================
function openRefundSinModal() {
  const modal = document.getElementById('refundSinModal');
  if (!modal) return;
  modal.style.display = 'flex';

  const todayStr = new Date().toISOString().slice(0, 10);
  const lastAttDate = document.getElementById('ref_sin_lastAttendedDate');
  if (lastAttDate && !lastAttDate.value) lastAttDate.value = todayStr;
  const effDate = document.getElementById('ref_sin_effectiveDate');
  if (effDate && !effDate.value) effDate.value = todayStr;

  const selCourse = document.getElementById('ref_sin_course');
  if (selCourse) {
    const courses = (typeof currentLecturesCache !== 'undefined' && currentLecturesCache.length > 0)
      ? currentLecturesCache
      : [
          { title: '[특기적성] 창의 로봇교실 A반', fee: 30000, receptiveFee: 3000, neulbomType: '방과후' },
          { title: '01. [특기] 바이올린 A반', fee: 30000, receptiveFee: 0, textbookFee: 10000, neulbomType: '방과후' },
          { title: '놀이체육 1부', fee: 25000, receptiveFee: 2500, neulbomType: '맞춤형' },
          { title: '논술 1부', fee: 30000, receptiveFee: 3000, neulbomType: '방과후' },
          { title: '(월)돌봄 1부', fee: 0, receptiveFee: 0, neulbomType: '돌봄' }
        ];

    selCourse.innerHTML = '<option value="">=강좌 선택=</option>' +
      courses.map(c => `<option value="${c.title || c.lec_name}" data-fee="${c.tuitionFee || c.fee || 0}" data-receptive="${c.receptiveFee || c.costFacility || 0}" data-textbook="${c.textbookFee || 0}" data-material="${c.materialFee || 0}" data-type="${c.neulbomType || '방과후'}">${c.title || c.lec_name}</option>`).join('');

    if (courses.length > 0) {
      selCourse.value = courses[0].title || courses[0].lec_name;
      onRefundCourseChanged();
    }
  }

  calculateRefundModalAmounts();
}

function closeRefundSinModal() {
  const modal = document.getElementById('refundSinModal');
  if (modal) modal.style.display = 'none';
}

function fillRefundSampleStudent() {
  const samples = [
    { grade: '2', classNo: '2', studentNo: '14', name: '박서준', phone: '010-3849-1928', course: '[특기적성] 창의 로봇교실 A반' },
    { grade: '3', classNo: '1', studentNo: '08', name: '윤도현', phone: '010-9182-3746', course: '01. [특기] 바이올린 A반' },
    { grade: '1', classNo: '1', studentNo: '05', name: '손희안', phone: '010-5432-9876', course: '놀이체육 1부' }
  ];
  const s = samples[Math.floor(Math.random() * samples.length)];
  const gEl = document.getElementById('ref_sin_grade'); if (gEl) gEl.value = s.grade;
  const cEl = document.getElementById('ref_sin_classNo'); if (cEl) cEl.value = s.classNo;
  const nEl = document.getElementById('ref_sin_studentNo'); if (nEl) nEl.value = s.studentNo;
  const nameEl = document.getElementById('ref_sin_studentName'); if (nameEl) nameEl.value = s.name;
  const pEl = document.getElementById('ref_sin_parentPhone'); if (pEl) pEl.value = s.phone;

  const selCourse = document.getElementById('ref_sin_course');
  if (selCourse) {
    selCourse.value = s.course;
    onRefundCourseChanged();
  }
}

function onRefundCourseChanged() {
  const selCourse = document.getElementById('ref_sin_course');
  if (!selCourse) return;
  const opt = selCourse.selectedOptions[0];
  if (opt) {
    const fee = parseInt(opt.getAttribute('data-fee')) || 30000;
    const receptive = parseInt(opt.getAttribute('data-receptive')) || 0;
    const textbook = parseInt(opt.getAttribute('data-textbook')) || 0;
    const material = parseInt(opt.getAttribute('data-material')) || 0;
    const neulbomType = opt.getAttribute('data-type') || '방과후';

    const feeEl = document.getElementById('ref_sin_fee'); if (feeEl) feeEl.value = fee;
    const recEl = document.getElementById('ref_sin_receptiveFee'); if (recEl) recEl.value = receptive;
    const tbEl = document.getElementById('ref_sin_textbookFee'); if (tbEl) tbEl.value = textbook;
    const matEl = document.getElementById('ref_sin_materialFee'); if (matEl) matEl.value = material;
    const typeEl = document.getElementById('ref_sin_neulbomType'); if (typeEl) typeEl.value = neulbomType;
  }
  calculateRefundModalAmounts();
}

function calculateRefundModalAmounts() {
  const beforeCollection = document.getElementById('ref_sin_beforeCollection')?.checked || false;
  const totalDays = parseInt(document.getElementById('ref_sin_totalDays')?.value) || 12;
  const attendedDays = parseInt(document.getElementById('ref_sin_attendedDays')?.value) || 0;
  const tuitionFee = parseInt(document.getElementById('ref_sin_fee')?.value) || 0;
  const receptiveFee = parseInt(document.getElementById('ref_sin_receptiveFee')?.value) || 0;
  const textbookFee = parseInt(document.getElementById('ref_sin_textbookFee')?.value) || 0;
  const materialFee = parseInt(document.getElementById('ref_sin_materialFee')?.value) || 0;
  const calcRule = document.querySelector('input[name="ref_calc_rule"]:checked')?.value || 'standard';

  let tuitionRefund = 0;
  let receptiveRefund = 0;
  let desc = '';

  if (beforeCollection || attendedDays === 0) {
    tuitionRefund = tuitionFee;
    receptiveRefund = receptiveFee;
    desc = '수업 시작 전 / 징수 전 취소 (100% 전액 반환)';
  } else if (attendedDays >= totalDays) {
    tuitionRefund = 0;
    receptiveRefund = 0;
    desc = '총 시수 전부 경과 (반환 금액 없음)';
  } else if (calcRule === 'daily') {
    const rate = Math.max(0, (totalDays - attendedDays) / totalDays);
    tuitionRefund = Math.floor(tuitionFee * rate);
    receptiveRefund = Math.floor(receptiveFee * rate);
    desc = `일할/시수 비례 (잔여 ${(totalDays - attendedDays)}/${totalDays}시수, ${(rate * 100).toFixed(1)}%)`;
  } else {
    const ratio = attendedDays / totalDays;
    if (ratio <= (1 / 3)) {
      tuitionRefund = Math.floor((tuitionFee * 2) / 3);
      receptiveRefund = Math.floor((receptiveFee * 2) / 3);
      desc = '1/3 경과 전 (2/3 반환)';
    } else if (ratio <= 0.5) {
      tuitionRefund = Math.floor(tuitionFee / 2);
      receptiveRefund = Math.floor(receptiveFee / 2);
      desc = '1/2 경과 전 (1/2 반환)';
    } else {
      tuitionRefund = 0;
      receptiveRefund = 0;
      desc = '1/2 경과 후 (반환 금액 없음)';
    }
  }

  const textbookRefund = parseInt(document.getElementById('ref_sin_textbookRefund')?.value) || 0;
  const materialRefund = parseInt(document.getElementById('ref_sin_materialRefund')?.value) || 0;

  const tRefInput = document.getElementById('ref_sin_tuitionRefund');
  if (tRefInput) tRefInput.value = tuitionRefund;
  const rRefInput = document.getElementById('ref_sin_receptiveRefund');
  if (rRefInput) rRefInput.value = receptiveRefund;

  const descEl = document.getElementById('ref_tuition_rule_desc');
  if (descEl) descEl.textContent = desc;

  const totalRefund = tuitionRefund + receptiveRefund + textbookRefund + materialRefund;
  const displayEl = document.getElementById('ref_sin_totalRefundDisplay');
  if (displayEl) displayEl.textContent = totalRefund.toLocaleString() + '원';
}

async function submitRefundSin(event) {
  if (event) event.preventDefault();
  const studentName = document.getElementById('ref_sin_studentName')?.value?.trim();
  const courseTitle = document.getElementById('ref_sin_course')?.value?.trim();
  if (!studentName || !courseTitle) {
    alert('학생명과 강좌명을 입력하세요.');
    return;
  }

  const payload = {
    studentName,
    grade: document.getElementById('ref_sin_grade')?.value || '',
    classNo: document.getElementById('ref_sin_classNo')?.value || '',
    studentNo: document.getElementById('ref_sin_studentNo')?.value || '',
    parentPhone: document.getElementById('ref_sin_parentPhone')?.value || '',
    courseTitle,
    neulbomType: document.getElementById('ref_sin_neulbomType')?.value || '방과후',
    appType: document.getElementById('ref_sin_appType')?.value || '일반',
    beforeCollection: document.getElementById('ref_sin_beforeCollection')?.checked ? 'Y' : 'N',
    totalDays: parseInt(document.getElementById('ref_sin_totalDays')?.value) || 12,
    attendedDays: parseInt(document.getElementById('ref_sin_attendedDays')?.value) || 0,
    lastAttendedDate: document.getElementById('ref_sin_lastAttendedDate')?.value || '',
    tuitionFee: parseInt(document.getElementById('ref_sin_fee')?.value) || 0,
    tuitionRefund: parseInt(document.getElementById('ref_sin_tuitionRefund')?.value) || 0,
    receptiveFee: parseInt(document.getElementById('ref_sin_receptiveFee')?.value) || 0,
    receptiveRefund: parseInt(document.getElementById('ref_sin_receptiveRefund')?.value) || 0,
    textbookFee: parseInt(document.getElementById('ref_sin_textbookFee')?.value) || 0,
    textbookRefund: parseInt(document.getElementById('ref_sin_textbookRefund')?.value) || 0,
    materialFee: parseInt(document.getElementById('ref_sin_materialFee')?.value) || 0,
    materialRefund: parseInt(document.getElementById('ref_sin_materialRefund')?.value) || 0,
    status: document.getElementById('ref_sin_status')?.value || '접수',
    effectiveDate: document.getElementById('ref_sin_effectiveDate')?.value || '',
    reason: document.getElementById('ref_sin_reason')?.value?.trim() || ''
  };

  try {
    const res = await fetch('/api/af/ad_ref/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message || '환불/취소 등록이 완료되었습니다.');
      closeRefundSinModal();
      await loadRefunds();
    } else {
      alert(data.message || '환불/취소 등록에 실패했습니다.');
    }
  } catch (e) {
    console.error('submitRefundSin Error:', e);
    alert('서버 통신 오류가 발생했습니다.');
  }
}

// ==================== Modal 2: 환불/취소 일괄등록 (#refundBatchModal) ====================
let parsedRefundBatchItems = [];

function openRefundBatchModal() {
  const modal = document.getElementById('refundBatchModal');
  if (!modal) return;
  modal.style.display = 'flex';
}

function closeRefundBatchModal() {
  const modal = document.getElementById('refundBatchModal');
  if (modal) modal.style.display = 'none';
}

function fillRefundBatchSample() {
  const sample = [
    '1\\t1\\t5\\t김민준\\t010-1234-5678\\t놀이체육 1부\\t2026-08-10\\t3\\t12\\t25000\\t16660\\t개인사정',
    '2\\t3\\t12\\t이서연\\t010-9876-5432\\t창의로봇(초급)\\t2026-08-01\\t0\\t12\\t30000\\t30000\\t개강전취소',
    '3\\t2\\t8\\t박지훈\\t010-5555-6666\\t논술 1부\\t2026-08-16\\t6\\t12\\t30000\\t15000\\t시간중복'
  ].join('\\n');
  const txt = document.getElementById('ref_batch_text');
  if (txt) txt.value = sample;
  parseRefundBatchPreview();
}

function parseRefundBatchPreview() {
  const txt = document.getElementById('ref_batch_text')?.value?.trim();
  if (!txt) {
    alert('입력된 데이터가 없습니다. 양식에 맞추어 텍스트를 입력하세요.');
    return;
  }

  const lines = txt.split(/\\r?\\n/).filter(l => l.trim().length > 0);
  parsedRefundBatchItems = [];

  for (const line of lines) {
    if (line.includes('학년') && line.includes('이름')) continue;

    let parts = line.split('\\t');
    if (parts.length < 5) parts = line.split(',');
    if (parts.length < 5) parts = line.split(/\\s+/);

    if (parts.length >= 4) {
      const grade = parts[0]?.trim() || '1';
      const classNo = parts[1]?.trim() || '1';
      const studentNo = parts[2]?.trim() || '1';
      const studentName = parts[3]?.trim() || '';
      const parentPhone = parts[4]?.trim() || '';
      const courseTitle = parts[5]?.trim() || '[특기적성] 창의 로봇교실 A반';
      const lastAttendedDate = parts[6]?.trim() || new Date().toISOString().slice(0, 10);
      const attendedDays = parseInt(parts[7]) || 0;
      const totalDays = parseInt(parts[8]) || 12;
      const tuitionFee = parseInt(parts[9]) || 30000;
      const refundAmount = parseInt(parts[10]) || (attendedDays === 0 ? tuitionFee : Math.floor(tuitionFee * 0.5));
      const reason = parts[11]?.trim() || '일괄등록';

      parsedRefundBatchItems.push({
        grade,
        classNo,
        studentNo,
        studentName,
        parentPhone,
        courseTitle,
        lastAttendedDate,
        attendedDays,
        totalDays,
        tuitionFee,
        tuitionRefund: refundAmount,
        refundAmount,
        reason,
        status: '접수',
        beforeCollection: attendedDays === 0 ? 'Y' : 'N'
      });
    }
  }

  const previewBox = document.getElementById('ref_batch_preview_box');
  const tbody = document.getElementById('ref_batch_preview_tbody');
  const countEl = document.getElementById('ref_batch_parsed_count');

  if (previewBox && tbody) {
    previewBox.style.display = 'block';
    tbody.innerHTML = parsedRefundBatchItems.map((item, idx) => `
      <tr>
        <td style="padding:4px;">${idx + 1}</td>
        <td style="padding:4px; font-weight:bold;">${item.grade}학년 ${item.classNo}반 ${item.studentName}</td>
        <td style="padding:4px;">${item.parentPhone}</td>
        <td style="padding:4px; text-align:left;">${item.courseTitle}</td>
        <td style="padding:4px;">${item.lastAttendedDate}</td>
        <td style="padding:4px;">${item.attendedDays}/${item.totalDays}시수</td>
        <td style="padding:4px;">${item.tuitionFee.toLocaleString()}원</td>
        <td style="padding:4px; color:#d9534f; font-weight:bold;">${item.refundAmount.toLocaleString()}원</td>
        <td style="padding:4px; font-size:11px;">${item.reason}</td>
      </tr>
    `).join('');
  }

  if (countEl) {
    countEl.textContent = `파싱 완료: 총 ${parsedRefundBatchItems.length}건`;
  }
}

async function submitRefundBatch() {
  if (!parsedRefundBatchItems || parsedRefundBatchItems.length === 0) {
    parseRefundBatchPreview();
  }
  if (!parsedRefundBatchItems || parsedRefundBatchItems.length === 0) {
    alert('등록할 유효한 데이터가 없습니다.');
    return;
  }

  try {
    const res = await fetch('/api/af/ad_ref/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refunds: parsedRefundBatchItems })
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message || `총 ${parsedRefundBatchItems.length}건이 등록되었습니다.`);
      closeRefundBatchModal();
      await loadRefunds();
    } else {
      alert(data.message || '일괄 등록에 실패했습니다.');
    }
  } catch (e) {
    console.error('submitRefundBatch Error:', e);
    alert('서버 통신 오류가 발생했습니다.');
  }
}

// Redirect old helper calculator to new modal
async function openRefundCalculator() {
  openRefundSinModal();
}

'''

content = content[:start_idx] + new_refund_code + content[end_idx:]

# 2. Add route checks in checkInitialModalRoute
refund_route_checks = '''  } else if (path.includes('/af/ad_ref/write')) {
    setTimeout(() => { if (typeof openRefundSinModal === 'function') openRefundSinModal(); }, 120);
  } else if (path.includes('/af/ad_ref/batch-upload') || path.includes('/af/ad_ref/input')) {
    setTimeout(() => { if (typeof openRefundBatchModal === 'function') openRefundBatchModal(); }, 120);
'''

if 'path.includes(\'/af/ad_ref/write\')' not in content:
    content = content.replace(
        "} else if (path.includes('/af/ad_wait/app')) {",
        refund_route_checks + "  } else if (path.includes('/af/ad_wait/app')) {"
    )

# 3. Add exports at bottom
export_marker = "window.openStatModal = openStatModal;"
refund_exports = '''window.openRefundSinModal = openRefundSinModal;
window.closeRefundSinModal = closeRefundSinModal;
window.openRefundBatchModal = openRefundBatchModal;
window.closeRefundBatchModal = closeRefundBatchModal;
window.fillRefundSampleStudent = fillRefundSampleStudent;
window.onRefundCourseChanged = onRefundCourseChanged;
window.calculateRefundModalAmounts = calculateRefundModalAmounts;
window.submitRefundSin = submitRefundSin;
window.fillRefundBatchSample = fillRefundBatchSample;
window.parseRefundBatchPreview = parseRefundBatchPreview;
window.submitRefundBatch = submitRefundBatch;
window.openRefundCalculator = openRefundCalculator;
window.filterRefunds = filterRefunds;
window.resetRefundSearch = resetRefundSearch;
window.toggleAllRefundCheckboxes = toggleAllRefundCheckboxes;
window.toggleRefundStatus = toggleRefundStatus;
window.handleBulkRefundStatus = handleBulkRefundStatus;
window.handleBulkRefundDelete = handleBulkRefundDelete;
window.deleteRefundItem = deleteRefundItem;
window.exportRefundExcel = exportRefundExcel;
window.loadRefunds = loadRefunds;
'''

if 'window.openRefundSinModal' not in content:
    content = content.replace(export_marker, refund_exports + export_marker)

with open(js_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated admin_lec.js")
