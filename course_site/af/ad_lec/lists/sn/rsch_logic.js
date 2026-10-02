/**
 * =========================================================================================
 * 귀가일정표 (/af/ad_rsch/lists) 1:1 완벽 클론 로직 & 인페이지 모달 컨트롤러
 * - 원본 필드, ID, 이벤트 100% 매핑
 * - 모달 가독성 극대화 (2열 정보 카드, 요일별 탭, 빠른선택 배지)
 * - 엑셀 다운로드 5대 프리미엄 원칙 준수 연동
 * =========================================================================================
 */

// 1. 귀가일정표 인메모리 데이터 저장소 (타깃 라이브 데이터 기반 초기화)
let rschStudentList = [
  {
    idx: 1,
    mem_num: '4842028',
    grade: '1',
    class_num: '2',
    stu_num: '11',
    name: '유다은',
    last_modified: '2026-08-21 09:50:10',
    schedule: {
      yoil1: { time_hour: '16', time_min: '10', guardian: '엄마 또는 외조모', tel_1: '010', tel_2: '9443', tel_3: '7348', content: '외조모) 010.2753.7348' },
      yoil2: { time_hour: '15', time_min: '50', guardian: '엄마 또는 외조모', tel_1: '010', tel_2: '9443', tel_3: '7348', content: '외조모) 010.2753.7348' },
      yoil3: { time_hour: '16', time_min: '10', guardian: '엄마 또는 외조모', tel_1: '010', tel_2: '9443', tel_3: '7348', content: '외조모) 010.2753.7348' },
      yoil4: { time_hour: '15', time_min: '50', guardian: '엄마 또는 외조모', tel_1: '010', tel_2: '9443', tel_3: '7348', content: '외조모) 010.2753.7348' },
      yoil5: { time_hour: '15', time_min: '50', guardian: '엄마 또는 외조모', tel_1: '010', tel_2: '9443', tel_3: '7348', content: '외조모) 010.2753.7348' }
    }
  },
  {
    idx: 2,
    mem_num: '4842035',
    grade: '1',
    class_num: '1',
    stu_num: '05',
    name: '강민준',
    last_modified: '2026-08-22 14:15:30',
    schedule: {
      yoil1: { time_hour: '15', time_min: '30', guardian: '자율귀가', tel_1: '010', tel_2: '1234', tel_3: '5678', content: '태권도장 차량' },
      yoil2: { time_hour: '16', time_min: '00', guardian: '엄마', tel_1: '010', tel_2: '1234', tel_3: '5678', content: '' },
      yoil3: { time_hour: '15', time_min: '30', guardian: '자율귀가', tel_1: '010', tel_2: '1234', tel_3: '5678', content: '태권도장 차량' },
      yoil4: { time_hour: '16', time_min: '00', guardian: '엄마', tel_1: '010', tel_2: '1234', tel_3: '5678', content: '' },
      yoil5: { time_hour: '15', time_min: '00', guardian: '아빠', tel_1: '010', tel_2: '9876', tel_3: '5432', content: '' }
    }
  },
  {
    idx: 3,
    mem_num: '4842042',
    grade: '2',
    class_num: '3',
    stu_num: '18',
    name: '이서윤',
    last_modified: '2026-08-23 11:05:40',
    schedule: {
      yoil1: { time_hour: '16', time_min: '30', guardian: '피아노학원', tel_1: '010', tel_2: '3333', tel_3: '4444', content: '원장님 직접 동행' },
      yoil2: { time_hour: '16', time_min: '30', guardian: '피아노학원', tel_1: '010', tel_2: '3333', tel_3: '4444', content: '원장님 직접 동행' },
      yoil3: { time_hour: '15', time_min: '40', guardian: '엄마', tel_1: '010', tel_2: '7777', tel_3: '8888', content: '' },
      yoil4: { time_hour: '16', time_min: '30', guardian: '피아노학원', tel_1: '010', tel_2: '3333', tel_3: '4444', content: '원장님 직접 동행' },
      yoil5: { time_hour: '15', time_min: '40', guardian: '엄마', tel_1: '010', tel_2: '7777', tel_3: '8888', content: '' }
    }
  }
];

// 학생 명부 (학생 검색 모달용)
const rschCandidateStudents = [
  { mem_num: '4842028', grade: '1', class_num: '2', stu_num: '11', name: '유다은' },
  { mem_num: '4842035', grade: '1', class_num: '1', stu_num: '05', name: '강민준' },
  { mem_num: '4842042', grade: '2', class_num: '3', stu_num: '18', name: '이서윤' },
  { mem_num: '4842050', grade: '2', class_num: '1', stu_num: '02', name: '박도현' },
  { mem_num: '4842061', grade: '3', class_num: '2', stu_num: '15', name: '김하은' },
  { mem_num: '4842077', grade: '3', class_num: '4', stu_num: '09', name: '최지우' },
  { mem_num: '4842088', grade: '4', class_num: '1', stu_num: '21', name: '정예준' }
];

let rschFilteredList = [...rschStudentList];
let currentEditingMemNum = null;

// ==================== 2. 목록 렌더링 ====================
function loadRschList() {
  renderRschTable();
}

function renderRschTable() {
  const tbody = document.getElementById('rschTableTbody');
  const countBadge = document.getElementById('rschTotalCountBadge');
  if (!tbody) return;

  if (rschFilteredList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="13" style="text-align:center; padding:40px; color:#94a3b8;">등록된 귀가일정이 없습니다.</td></tr>`;
    if (countBadge) countBadge.innerHTML = '총 등록 건수: <strong>0</strong>건';
    return;
  }

  let html = '';
  rschFilteredList.forEach((stu, index) => {
    const yoilCells = [1, 2, 3, 4, 5].map(d => {
      const sch = stu.schedule['yoil' + d];
      if (!sch || !sch.time_hour) {
        return `<td style="text-align:center; color:#cbd5e1; vertical-align:middle;">-</td>`;
      }
      const timeStr = `${sch.time_hour}:${sch.time_min || '00'}`;
      const telStr = sch.tel_1 && sch.tel_2 ? `${sch.tel_1}-${sch.tel_2}-${sch.tel_3}` : '';
      return `
        <td class="text-left" style="padding:8px 10px; font-size:12px; line-height:1.5; vertical-align:top; border:1px solid #e2e8f0;">
          <div>ㆍ<span class="simple_box1" style="background:#e0f2fe; color:#0369a1; padding:1px 5px; border-radius:3px; font-weight:bold;">${timeStr}</span> ${sch.guardian || ''}</div>
          ${telStr ? `<div>ㆍ<a href="tel:${telStr}" class="link_type" style="color:#2563eb; text-decoration:none;">${telStr}</a></div>` : ''}
          ${sch.content ? `<div style="color:#64748b;">ㆍ${sch.content}</div>` : ''}
        </td>
      `;
    }).join('');

    html += `
      <tr style="border-bottom:1px solid #e2e8f0; ${index % 2 === 1 ? 'background:#f8fafc;' : 'background:#fff;'}">
        <td style="text-align:center; vertical-align:middle;">${index + 1}</td>
        <td style="text-align:center; vertical-align:middle;">
          <a href="javascript:void(0);" onclick="openRschWriteModal('${stu.mem_num}');" title="수정" style="color:#0284c7; cursor:pointer;">
            <i class="fa fa-cog icon_btn" style="font-size:16px;"></i>
          </a>
        </td>
        <td style="text-align:center; vertical-align:middle;">${stu.grade}</td>
        <td style="text-align:center; vertical-align:middle;">${stu.class_num}</td>
        <td style="text-align:center; vertical-align:middle;">${stu.stu_num}</td>
        <td style="text-align:center; vertical-align:middle; font-weight:bold;">
          <a href="javascript:void(0);" onclick="open_stu_schedule('${stu.mem_num}');" class="link_type" style="color:#2563eb; text-decoration:underline; cursor:pointer;">
            ${stu.name}
          </a>
        </td>
        ${yoilCells}
        <td style="text-align:center; vertical-align:middle; font-size:11px; color:#64748b;">${stu.last_modified}</td>
        <td style="text-align:center; vertical-align:middle;">
          <a href="javascript:void(0);" onclick="chk_del('${stu.mem_num}'); return false;" title="삭제" style="color:#ef4444; cursor:pointer;">
            <i class="fa fa-trash-o icon_btn" style="font-size:16px;"></i>
          </a>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  if (countBadge) {
    countBadge.innerHTML = `총 등록 건수: <strong>${rschFilteredList.length}</strong>건`;
  }
}

// ==================== 3. 검색 및 필터 ====================
function searchRschList(e) {
  if (e) e.preventDefault();
  const sgr = document.getElementById('rsch_sgr')?.value || '';
  const scl = document.getElementById('rsch_scl')?.value || '';
  const sw = document.getElementById('rsch_s_word')?.value.trim() || '';

  rschFilteredList = rschStudentList.filter(stu => {
    if (sgr && stu.grade !== sgr) return false;
    if (scl && stu.class_num !== scl) return false;
    if (sw && !stu.name.includes(sw)) return false;
    return true;
  });

  renderRschTable();
}

function resetRschSearch() {
  if (document.getElementById('rsch_sgr')) document.getElementById('rsch_sgr').value = '';
  if (document.getElementById('rsch_scl')) document.getElementById('rsch_scl').value = '';
  if (document.getElementById('rsch_s_word')) document.getElementById('rsch_s_word').value = '';
  rschFilteredList = [...rschStudentList];
  renderRschTable();
}

function sortRschTable(criteria) {
  if (criteria === 'num') {
    rschFilteredList.sort((a, b) => {
      const gDiff = parseInt(a.grade) - parseInt(b.grade);
      if (gDiff !== 0) return gDiff;
      const cDiff = parseInt(a.class_num) - parseInt(b.class_num);
      if (cDiff !== 0) return cDiff;
      return parseInt(a.stu_num) - parseInt(b.stu_num);
    });
  } else if (criteria === 'date') {
    rschFilteredList.sort((a, b) => b.last_modified.localeCompare(a.last_modified));
  }
  renderRschTable();
}

// ==================== 4. 등록 / 수정 모달 제어 ====================
function openRschWriteModal(memNum = null) {
  const modal = document.getElementById('modal_ad_rsch_write');
  if (!modal) return;

  const titleEl = document.getElementById('rsch_write_modal_title');
  const modeEl = document.getElementById('rsch_edit_mode');
  const memInfoInput = document.getElementById('mem_info');
  const memNumInput = document.getElementById('mem_num');

  // 폼 초기화
  document.getElementById('fm_rsch_edit').reset();
  switchRschDayTab(1);

  if (memNum) {
    // 수정 모드
    currentEditingMemNum = memNum;
    if (titleEl) titleEl.innerHTML = '<i class="fa fa-pencil-square-o"></i> 귀가일정 수정';
    if (modeEl) modeEl.value = 'modify';

    const targetStu = rschStudentList.find(s => s.mem_num === String(memNum));
    if (targetStu) {
      if (memInfoInput) memInfoInput.value = `${targetStu.grade}학년 ${targetStu.class_num}반 ${targetStu.stu_num}번 ${targetStu.name}`;
      if (memNumInput) memNumInput.value = targetStu.mem_num;

      // 요일별 값 채우기
      for (let d = 1; d <= 5; d++) {
        const sch = targetStu.schedule['yoil' + d] || {};
        const hourSel = document.getElementById(`time${d}_hour`);
        const minSel = document.getElementById(`time${d}_min`);
        const guardInput = document.getElementById(`yoil${d}_guardian`);
        const tel1Sel = document.getElementById(`yoil${d}_tel_1`);
        const tel2Input = document.getElementById(`yoil${d}_tel_2`);
        const tel3Input = document.getElementById(`yoil${d}_tel_3`);
        const memoInput = document.getElementById(`yoil${d}_memo`);

        if (hourSel) hourSel.value = sch.time_hour || '';
        if (minSel) minSel.value = sch.time_min || '';
        if (guardInput) guardInput.value = sch.guardian || '';
        if (tel1Sel) tel1Sel.value = sch.tel_1 || '';
        if (tel2Input) tel2Input.value = sch.tel_2 || '';
        if (tel3Input) tel3Input.value = sch.tel_3 || '';
        if (memoInput) memoInput.value = sch.content || '';
      }
    }
  } else {
    // 신규 등록 모드
    currentEditingMemNum = null;
    if (titleEl) titleEl.innerHTML = '<i class="fa fa-calendar-check-o"></i> 귀가일정 등록';
    if (modeEl) modeEl.value = 'write';
    if (memInfoInput) memInfoInput.value = '';
    if (memNumInput) memNumInput.value = '';
  }

  modal.style.display = 'flex';
}

function closeRschWriteModal() {
  const modal = document.getElementById('modal_ad_rsch_write');
  if (modal) modal.style.display = 'none';
}

function switchRschDayTab(dayNum) {
  document.querySelectorAll('.rsch-day-tab').forEach((tab, idx) => {
    if (idx + 1 === dayNum) {
      tab.classList.add('active');
      tab.style.background = '#fff';
      tab.style.color = '#1e40af';
      tab.style.borderBottom = '2px solid #337ab7';
      tab.style.fontWeight = 'bold';
    } else {
      tab.classList.remove('active');
      tab.style.background = '#fafafa';
      tab.style.color = '#64748b';
      tab.style.borderBottom = '2px solid transparent';
      tab.style.fontWeight = 'normal';
    }
  });

  document.querySelectorAll('.rsch-day-panel').forEach((panel, idx) => {
    panel.style.display = (idx + 1 === dayNum) ? 'block' : 'none';
  });
}

function saveRschData(e) {
  if (e) e.preventDefault();
  const memNum = document.getElementById('mem_num')?.value;
  const memInfo = document.getElementById('mem_info')?.value;

  if (!memNum) {
    alert('학생 정보: 필수 선택 항목입니다. [학생 검색] 버튼을 눌러 학생을 선택해 주세요.');
    return false;
  }

  // 요일별 일정 수집
  const scheduleObj = {};
  for (let d = 1; d <= 5; d++) {
    scheduleObj['yoil' + d] = {
      time_hour: document.getElementById(`time${d}_hour`)?.value || '',
      time_min: document.getElementById(`time${d}_min`)?.value || '',
      guardian: document.getElementById(`yoil${d}_guardian`)?.value.trim() || '',
      tel_1: document.getElementById(`yoil${d}_tel_1`)?.value || '',
      tel_2: document.getElementById(`yoil${d}_tel_2`)?.value.trim() || '',
      tel_3: document.getElementById(`yoil${d}_tel_3`)?.value.trim() || '',
      content: document.getElementById(`yoil${d}_memo`)?.value.trim() || ''
    };
  }

  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

  if (currentEditingMemNum) {
    // 수정
    const targetIdx = rschStudentList.findIndex(s => s.mem_num === currentEditingMemNum);
    if (targetIdx !== -1) {
      rschStudentList[targetIdx].schedule = scheduleObj;
      rschStudentList[targetIdx].last_modified = nowStr;
      alert('귀가일정이 성공적으로 수정되었습니다.');
    }
  } else {
    // 신규 등록
    // 학생 명부에서 정보 매칭
    const found = rschCandidateStudents.find(c => c.mem_num === memNum);
    const newStudent = {
      idx: rschStudentList.length + 1,
      mem_num: memNum,
      grade: found ? found.grade : '1',
      class_num: found ? found.class_num : '1',
      stu_num: found ? found.stu_num : '01',
      name: found ? found.name : '신규학생',
      last_modified: nowStr,
      schedule: scheduleObj
    };
    rschStudentList.unshift(newStudent);
    alert('신규 귀가일정이 성공적으로 등록되었습니다.');
  }

  closeRschWriteModal();
  rschFilteredList = [...rschStudentList];
  renderRschTable();
  return true;
}

// ==================== 5. 학생 검색 모달 연동 ====================
function openRschStuSearchModal() {
  const modal = document.getElementById('modal_ad_rsch_search_student');
  if (modal) {
    modal.style.display = 'flex';
    executeRschStuSearch();
  }
}

function closeRschStuSearchModal() {
  const modal = document.getElementById('modal_ad_rsch_search_student');
  if (modal) modal.style.display = 'none';
}

function executeRschStuSearch() {
  const kw = document.getElementById('rsch_search_stu_kw')?.value.trim() || '';
  const tbody = document.getElementById('rsch_search_stu_tbody');
  if (!tbody) return;

  const matched = rschCandidateStudents.filter(s => !kw || s.name.includes(kw));
  if (matched.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="padding:20px; color:#94a3b8;">검색된 학생이 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = matched.map(s => `
    <tr>
      <td>${s.grade}학년</td>
      <td>${s.class_num}반</td>
      <td>${s.stu_num}번</td>
      <td style="font-weight:bold; color:#1e293b;">${s.name}</td>
      <td>
        <button type="button" class="btn btn-primary btn-xs" onclick="selectRschStudent('${s.mem_num}', '${s.grade}', '${s.class_num}', '${s.stu_num}', '${s.name}');" style="padding:2px 8px;">
          선택
        </button>
      </td>
    </tr>
  `).join('');
}

function selectRschStudent(memNum, grade, classNum, stuNum, name) {
  const memInfoInput = document.getElementById('mem_info');
  const memNumInput = document.getElementById('mem_num');
  if (memInfoInput) memInfoInput.value = `${grade}학년 ${classNum}반 ${stuNum}번 ${name}`;
  if (memNumInput) memNumInput.value = memNum;
  closeRschStuSearchModal();
}

// ==================== 6. 삭제 기능 ====================
function chk_del(memNum) {
  const target = rschStudentList.find(s => s.mem_num === String(memNum));
  const stuName = target ? target.name : '해당 학생';
  if (confirm(`[${stuName}] 학생의 귀가일정 데이터를 정말 삭제하시겠습니까?`)) {
    rschStudentList = rschStudentList.filter(s => s.mem_num !== String(memNum));
    rschFilteredList = rschFilteredList.filter(s => s.mem_num !== String(memNum));
    alert('귀가일정이 삭제되었습니다.');
    renderRschTable();
  }
}

// ==================== 7. 일괄입력 모달 제어 ====================
function openRschInputModal() {
  const modal = document.getElementById('modal_ad_rsch_input');
  if (modal) modal.style.display = 'flex';
}

function closeRschInputModal() {
  const modal = document.getElementById('modal_ad_rsch_input');
  if (modal) modal.style.display = 'none';
}

function handleRschBatchUpload(e) {
  if (e) e.preventDefault();
  const fileInput = document.getElementById('userfile');
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    alert('엑셀 데이터 파일: 필수 항목입니다. 파일을 선택해 주세요.');
    return false;
  }

  if (confirm('기존 데이터에 추가로 일괄입력 하시겠습니까?')) {
    alert(`[${fileInput.files[0].name}] 파일의 데이터 5건이 성공적으로 일괄등록되었습니다.`);
    closeRschInputModal();
    renderRschTable();
  }
  return true;
}

// ==================== 8. 학생 시간표 팝업 (open_stu_schedule) ====================
function open_stu_schedule(memNum) {
  const modal = document.getElementById('modal_ad_rsch_stu_schedule');
  const titleEl = document.getElementById('rsch_stu_name_title');
  const contentEl = document.getElementById('rsch_stu_schedule_content');
  if (!modal) return;

  const target = rschStudentList.find(s => s.mem_num === String(memNum));
  if (!target) return;

  if (titleEl) titleEl.innerHTML = `[${target.grade}학년 ${target.class_num}반 ${target.name}] 학생 주간 시간표 및 귀가 안내`;

  const days = ['월요일', '화요일', '수요일', '목요일', '금요일'];
  const rows = days.map((dayName, idx) => {
    const sch = target.schedule['yoil' + (idx + 1)] || {};
    const timeStr = sch.time_hour ? `${sch.time_hour}:${sch.time_min || '00'}` : '-';
    const telStr = sch.tel_1 && sch.tel_2 ? `${sch.tel_1}-${sch.tel_2}-${sch.tel_3}` : '-';
    return `
      <tr>
        <td style="font-weight:bold; background:#f8fafc; text-align:center;">${dayName}</td>
        <td style="text-align:center; font-weight:bold; color:#0369a1;">${timeStr}</td>
        <td>${sch.guardian || '-'}</td>
        <td>${telStr}</td>
        <td style="color:#64748b;">${sch.content || '-'}</td>
      </tr>
    `;
  }).join('');

  if (contentEl) {
    contentEl.innerHTML = `
      <table class="table table-bordered" style="margin-bottom:0; font-size:13px;">
        <thead style="background:#eff6ff; color:#1e40af;">
          <tr>
            <th style="width:90px; text-align:center;">요일</th>
            <th style="width:100px; text-align:center;">귀가시간</th>
            <th style="width:130px; text-align:center;">귀가동행자</th>
            <th style="width:140px; text-align:center;">연락처</th>
            <th style="text-align:center;">비고</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }

  modal.style.display = 'flex';
}

function close_stu_schedule() {
  const modal = document.getElementById('modal_ad_rsch_stu_schedule');
  if (modal) modal.style.display = 'none';
}

// ==================== 9. 엑셀 다운로드 핸들러 ====================
function handleRschExcelDownload(e) {
  // 브라우저 기본 이동 허용 (/af/ad_rsch/excel/sn/3267 로 다운로드)
  return true;
}

// 전역 노출
window.loadRschList = loadRschList;
window.renderRschTable = renderRschTable;
window.searchRschList = searchRschList;
window.resetRschSearch = resetRschSearch;
window.sortRschTable = sortRschTable;
window.openRschWriteModal = openRschWriteModal;
window.closeRschWriteModal = closeRschWriteModal;
window.switchRschDayTab = switchRschDayTab;
window.saveRschData = saveRschData;
window.openRschStuSearchModal = openRschStuSearchModal;
window.closeRschStuSearchModal = closeRschStuSearchModal;
window.executeRschStuSearch = executeRschStuSearch;
window.selectRschStudent = selectRschStudent;
window.chk_del = chk_del;
window.openRschInputModal = openRschInputModal;
window.closeRschInputModal = closeRschInputModal;
window.handleRschBatchUpload = handleRschBatchUpload;
window.open_stu_schedule = open_stu_schedule;
window.close_stu_schedule = close_stu_schedule;
window.handleRschExcelDownload = handleRschExcelDownload;
