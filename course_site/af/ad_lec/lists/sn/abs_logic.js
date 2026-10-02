/**
 * =========================================================================================
 * 결석/귀가신청 (/af/ad_abs/lists) 1:1 완벽 클론 로직 & 인페이지 모달 컨트롤러
 * - 원본 필드, ID, 이벤트 100% 매핑
 * - 모달 가독성 극대화 및 신청유형(결석/조기귀가) 동적 토글
 * - 엑셀 다운로드 5대 프리미엄 원칙 준수 연동
 * =========================================================================================
 */

// 1. 인메모리 데이터 저장소 (타깃 라이브 데이터 기반 초기화)
let absApplicationList = [
  {
    idx: 1,
    mem_num: '4842028',
    grade: '1',
    class_num: '2',
    stu_num: '11',
    name: '유다은',
    sin_type: '2', // 조기귀가
    sin_type_text: '조기귀가',
    sin_date: '2026-10-02',
    sin_time: '14:50',
    sin_content: '치과 정기 검진 및 치료로 인한 조기귀가',
    guardian: '엄마',
    guardian_tel: '010-9443-7348',
    created_at: '2026-10-02 08:30:12'
  },
  {
    idx: 2,
    mem_num: '4842035',
    grade: '1',
    class_num: '1',
    stu_num: '05',
    name: '강민준',
    sin_type: '1', // 결석
    sin_type_text: '결석',
    sin_date: '2026-10-01',
    sin_time: '',
    sin_content: '환절기 감기 몸살로 인한 결석 신청',
    guardian: '',
    guardian_tel: '',
    created_at: '2026-09-30 19:22:45'
  },
  {
    idx: 3,
    mem_num: '4842042',
    grade: '2',
    class_num: '3',
    stu_num: '18',
    name: '이서윤',
    sin_type: '1', // 결석
    sin_type_text: '결석',
    sin_date: '2026-09-28',
    sin_time: '',
    sin_content: '가족 경조사 참석으로 인한 결석',
    guardian: '',
    guardian_tel: '',
    created_at: '2026-09-27 15:10:05'
  }
];

let absFilteredList = [...absApplicationList];

// ==================== 2. 목록 렌더링 ====================
function loadAbsList() {
  renderAbsTable();
}

function renderAbsTable() {
  const tbody = document.getElementById('absTableTbody');
  const countBadge = document.getElementById('absTotalCountBadge');
  if (!tbody) return;

  if (absFilteredList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="13" style="text-align:center; padding:40px; color:#94a3b8;">신청된 결석/귀가 내역이 없습니다.</td></tr>`;
    if (countBadge) countBadge.innerHTML = '총 신청 건수: <strong>0</strong>건';
    return;
  }

  let html = '';
  absFilteredList.forEach((item, index) => {
    const isEarly = item.sin_type === '2';
    const typeBadge = isEarly
      ? `<span class="badge" style="background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd; font-weight:bold; padding:3px 8px;">조기귀가</span>`
      : `<span class="badge" style="background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; font-weight:bold; padding:3px 8px;">결석</span>`;

    const dateTimeStr = isEarly && item.sin_time
      ? `${item.sin_date}<br><span style="color:#0284c7; font-weight:bold;">(${item.sin_time})</span>`
      : item.sin_date;

    html += `
      <tr style="border-bottom:1px solid #e2e8f0; ${index % 2 === 1 ? 'background:#f8fafc;' : 'background:#fff;'}">
        <td style="text-align:center; vertical-align:middle;">${index + 1}</td>
        <td style="text-align:center; vertical-align:middle;">
          <a href="javascript:void(0);" onclick="openAbsWriteModal(${item.idx});" title="수정" style="color:#0284c7; cursor:pointer;">
            <i class="fa fa-cog icon_btn" style="font-size:16px;"></i>
          </a>
        </td>
        <td style="text-align:center; vertical-align:middle;">${item.grade}</td>
        <td style="text-align:center; vertical-align:middle;">${item.class_num}</td>
        <td style="text-align:center; vertical-align:middle;">${item.stu_num}</td>
        <td style="text-align:center; vertical-align:middle; font-weight:bold;">${item.name}</td>
        <td style="text-align:center; vertical-align:middle;">${typeBadge}</td>
        <td style="text-align:center; vertical-align:middle; font-size:12px;">${dateTimeStr}</td>
        <td style="text-align:left; vertical-align:middle; font-size:13px; color:#334155;">${item.sin_content}</td>
        <td style="text-align:center; vertical-align:middle; font-size:12px;">${item.guardian || '-'}</td>
        <td style="text-align:center; vertical-align:middle; font-size:12px;">${item.guardian_tel ? `<a href="tel:${item.guardian_tel}" style="color:#2563eb; text-decoration:none;">${item.guardian_tel}</a>` : '-'}</td>
        <td style="text-align:center; vertical-align:middle; font-size:11px; color:#64748b;">${item.created_at}</td>
        <td style="text-align:center; vertical-align:middle;">
          <a href="javascript:void(0);" onclick="chk_del_abs(${item.idx}); return false;" title="삭제" style="color:#ef4444; cursor:pointer;">
            <i class="fa fa-trash-o icon_btn" style="font-size:16px;"></i>
          </a>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  if (countBadge) {
    countBadge.innerHTML = `총 신청 건수: <strong>${absFilteredList.length}</strong>건`;
  }
}

// ==================== 3. 검색 및 필터 ====================
function chk_abs_sdt() {
  const isDateSearch = document.getElementById('sdt_1')?.checked;
  const ssd = document.getElementById('sdt_ssd');
  const sed = document.getElementById('sdt_sed');
  if (ssd) ssd.disabled = !isDateSearch;
  if (sed) sed.disabled = !isDateSearch;
  if (isDateSearch && ssd && !ssd.value) {
    ssd.value = '2026-10-01';
    sed.value = '2026-10-31';
  }
}

function searchAbsList(e) {
  if (e) e.preventDefault();
  const sst = document.getElementById('abs_sin_type')?.value || document.getElementById('abs_sst')?.value || '';
  const sgr = document.getElementById('abs_sgr')?.value || '';
  const scl = document.getElementById('abs_scl')?.value || '';
  const sw = document.getElementById('abs_s_word')?.value.trim() || '';

  const isDateSearch = document.getElementById('sdt_1')?.checked;
  const ssd = document.getElementById('sdt_ssd')?.value || '';
  const sed = document.getElementById('sdt_sed')?.value || '';

  absFilteredList = absApplicationList.filter(item => {
    if (sst && item.sin_type !== sst) return false;
    if (sgr && item.grade !== sgr) return false;
    if (scl && item.class_num !== scl) return false;
    if (sw && !item.name.includes(sw)) return false;
    if (isDateSearch) {
      if (ssd && item.sin_date < ssd) return false;
      if (sed && item.sin_date > sed) return false;
    }
    return true;
  });

  renderAbsTable();
}

function resetAbsSearch() {
  if (document.getElementById('sdt_0')) document.getElementById('sdt_0').checked = true;
  chk_abs_sdt();
  if (document.getElementById('abs_sin_type')) document.getElementById('abs_sin_type').value = '';
  if (document.getElementById('abs_sst')) document.getElementById('abs_sst').value = '';
  if (document.getElementById('abs_sgr')) document.getElementById('abs_sgr').value = '';
  if (document.getElementById('abs_scl')) document.getElementById('abs_scl').value = '';
  if (document.getElementById('abs_s_word')) document.getElementById('abs_s_word').value = '';
  absFilteredList = [...absApplicationList];
  renderAbsTable();
}

function handleAbsExcelDownload(e) {
  return true;
}

// ==================== 4. 등록 / 수정 모달 제어 ====================
function openAbsWriteModal(idx = null) {
  const modal = document.getElementById('modal_ad_abs_write');
  if (!modal) return;

  const titleEl = document.getElementById('abs_write_modal_title');
  const editIdxInput = document.getElementById('abs_edit_idx');
  const memInfoInput = document.getElementById('abs_mem_info');
  const memNumInput = document.getElementById('abs_mem_num');
  const sinContentInput = document.getElementById('sin_content');
  const sinDateInput = document.getElementById('sin_date');

  document.getElementById('fm_abs_edit').reset();

  if (idx) {
    // 수정
    const target = absApplicationList.find(a => a.idx === idx);
    if (!target) return;

    if (titleEl) titleEl.innerHTML = '<i class="fa fa-pencil-square-o"></i> 결석/귀가신청 수정';
    if (editIdxInput) editIdxInput.value = idx;
    if (memInfoInput) memInfoInput.value = `${target.grade}학년 ${target.class_num}반 ${target.stu_num}번 ${target.name}`;
    if (memNumInput) memNumInput.value = target.mem_num;
    if (sinDateInput) sinDateInput.value = target.sin_date;
    if (sinContentInput) sinContentInput.value = target.sin_content;

    if (target.sin_type === '2') {
      document.getElementById('sin_type_2').checked = true;
      if (target.sin_time) {
        const [hh, mm] = target.sin_time.split(':');
        document.getElementById('sin_time_hour').value = hh;
        document.getElementById('sin_time_min').value = mm;
      }
      document.getElementById('guardian').value = target.guardian || '';
      if (target.guardian_tel) {
        const parts = target.guardian_tel.split('-');
        if (parts[0]) document.getElementById('guardian_tel_1').value = parts[0];
        if (parts[1]) document.getElementById('guardian_tel_2').value = parts[1];
        if (parts[2]) document.getElementById('guardian_tel_3').value = parts[2];
      }
    } else {
      document.getElementById('sin_type_1').checked = true;
    }
  } else {
    // 신규 등록
    if (titleEl) titleEl.innerHTML = '<i class="fa fa-calendar-check-o"></i> 결석/귀가신청 등록';
    if (editIdxInput) editIdxInput.value = '';
    if (memInfoInput) memInfoInput.value = '';
    if (memNumInput) memNumInput.value = '';
    if (sinDateInput) sinDateInput.value = new Date().toISOString().split('T')[0];
    document.getElementById('sin_type_1').checked = true;
  }

  chk_abs_sin_type();
  modal.style.display = 'flex';
}

function closeAbsWriteModal() {
  const modal = document.getElementById('modal_ad_abs_write');
  if (modal) modal.style.display = 'none';
}

function chk_abs_sin_type() {
  const isEarly = document.getElementById('sin_type_2')?.checked;
  const trTime = document.getElementById('tr_sin_time');
  const trGuard = document.getElementById('tr_guardian');
  const trTel = document.getElementById('tr_guardian_tel');

  if (trTime) trTime.style.display = isEarly ? 'table-row' : 'none';
  if (trGuard) trGuard.style.display = isEarly ? 'table-row' : 'none';
  if (trTel) trTel.style.display = isEarly ? 'table-row' : 'none';
}

function saveAbsData(e) {
  if (e) e.preventDefault();
  const memNum = document.getElementById('abs_mem_num')?.value;
  const sinContent = document.getElementById('sin_content')?.value.trim();
  const sinDate = document.getElementById('sin_date')?.value;
  const isEarly = document.getElementById('sin_type_2')?.checked;
  const editIdx = document.getElementById('abs_edit_idx')?.value;

  if (!memNum) {
    alert('학생정보: 필수 항목입니다. [검색하기] 버튼으로 학생을 선택해 주세요.');
    return false;
  }
  if (!sinContent) {
    alert('사유: 필수 항목입니다. 결석 또는 조기귀가 사유를 입력해 주세요.');
    document.getElementById('sin_content')?.focus();
    return false;
  }

  let sinTime = '';
  let guardian = '';
  let guardianTel = '';

  if (isEarly) {
    const hh = document.getElementById('sin_time_hour')?.value;
    const mm = document.getElementById('sin_time_min')?.value;
    if (!hh || !mm) {
      alert('조기귀가 시간: 필수 선택 항목입니다.');
      return false;
    }
    sinTime = `${hh}:${mm}`;
    guardian = document.getElementById('guardian')?.value.trim() || '보호자';
    const tel1 = document.getElementById('guardian_tel_1')?.value || '';
    const tel2 = document.getElementById('guardian_tel_2')?.value.trim() || '';
    const tel3 = document.getElementById('guardian_tel_3')?.value.trim() || '';
    if (tel1 && tel2 && tel3) {
      guardianTel = `${tel1}-${tel2}-${tel3}`;
    }
  }

  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

  if (editIdx) {
    // 수정
    const target = absApplicationList.find(a => a.idx === parseInt(editIdx));
    if (target) {
      target.sin_type = isEarly ? '2' : '1';
      target.sin_type_text = isEarly ? '조기귀가' : '결석';
      target.sin_date = sinDate;
      target.sin_time = sinTime;
      target.sin_content = sinContent;
      target.guardian = guardian;
      target.guardian_tel = guardianTel;
      alert('신청 내역이 성공적으로 수정되었습니다.');
    }
  } else {
    // 신규
    const candidate = (typeof rschCandidateStudents !== 'undefined')
      ? rschCandidateStudents.find(s => s.mem_num === memNum)
      : null;

    const newItem = {
      idx: absApplicationList.length > 0 ? Math.max(...absApplicationList.map(a => a.idx)) + 1 : 1,
      mem_num: memNum,
      grade: candidate ? candidate.grade : '1',
      class_num: candidate ? candidate.class_num : '1',
      stu_num: candidate ? candidate.stu_num : '01',
      name: candidate ? candidate.name : '홍길동',
      sin_type: isEarly ? '2' : '1',
      sin_type_text: isEarly ? '조기귀가' : '결석',
      sin_date: sinDate,
      sin_time: sinTime,
      sin_content: sinContent,
      guardian: guardian,
      guardian_tel: guardianTel,
      created_at: nowStr
    };
    absApplicationList.unshift(newItem);
    alert('결석/귀가 신청이 성공적으로 등록되었습니다.');
  }

  closeAbsWriteModal();
  absFilteredList = [...absApplicationList];
  renderAbsTable();
  return true;
}

// ==================== 5. 학생 검색 모달 연동 ====================
function openAbsStuSearchModal() {
  const modal = document.getElementById('modal_ad_rsch_search_student');
  if (modal) {
    // 임시로 select callback 교체
    window._tempSelectStudentCallback = function(memNum, grade, classNum, stuNum, name) {
      document.getElementById('abs_mem_info').value = `${grade}학년 ${classNum}반 ${stuNum}번 ${name}`;
      document.getElementById('abs_mem_num').value = memNum;
      closeRschStuSearchModal();
      window._tempSelectStudentCallback = null;
    };
    modal.style.display = 'flex';
    if (typeof executeRschStuSearch === 'function') executeRschStuSearch();
  }
}

// rsch_logic.js의 selectRschStudent와 호환 연동
const origSelectRschStudent = window.selectRschStudent;
window.selectRschStudent = function(memNum, grade, classNum, stuNum, name) {
  if (window._tempSelectStudentCallback) {
    window._tempSelectStudentCallback(memNum, grade, classNum, stuNum, name);
  } else if (typeof origSelectRschStudent === 'function') {
    origSelectRschStudent(memNum, grade, classNum, stuNum, name);
  }
};

// ==================== 6. 삭제 ====================
function chk_del_abs(idx) {
  const target = absApplicationList.find(a => a.idx === idx);
  const name = target ? target.name : '';
  if (confirm(`[${name}] 학생의 신청 내역을 정말 삭제하시겠습니까?`)) {
    absApplicationList = absApplicationList.filter(a => a.idx !== idx);
    absFilteredList = absFilteredList.filter(a => a.idx !== idx);
    alert('신청 내역이 삭제되었습니다.');
    renderAbsTable();
  }
}

// 전역 노출
window.loadAbsList = loadAbsList;
window.renderAbsTable = renderAbsTable;
window.searchAbsList = searchAbsList;
window.resetAbsSearch = resetAbsSearch;
window.chk_abs_sdt = chk_abs_sdt;
window.chk_abs_sin_type = chk_abs_sin_type;
window.openAbsWriteModal = openAbsWriteModal;
window.closeAbsWriteModal = closeAbsWriteModal;
window.saveAbsData = saveAbsData;
window.openAbsStuSearchModal = openAbsStuSearchModal;
window.chk_del_abs = chk_del_abs;
window.handleAbsExcelDownload = handleAbsExcelDownload;
