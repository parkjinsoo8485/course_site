// ==================== [Sprint 2] 강사관리 (/af/ad_tea) 1:1 Authentic Logic ====================

const defaultTeachersSeed = [
  { "num": "55382", "seq": 18, "id": "강태연", "name": "강태연", "hp": "010-7222-1718", "lastLogin": "2026-09-29 08:53:58", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2025-05-26", "status": "1" },
  { "num": "55938", "seq": 17, "id": "김경아", "name": "김경아", "hp": "010-8954-5376", "lastLogin": "2026-10-01 16:26:44", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2025-05-23", "status": "1" },
  { "num": "55385", "seq": 16, "id": "김언주", "name": "김언주", "hp": "010-3062-8867", "lastLogin": "2026-09-30 13:35:27", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2025-05-22", "status": "1" },
  { "num": "55388", "seq": 15, "id": "김윤정", "name": "김윤정", "hp": "010-9607-7614", "lastLogin": "2026-10-01 12:20:54", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2025-05-26", "status": "1" },
  { "num": "55389", "seq": 14, "id": "김재표", "name": "김재표", "hp": "010-8611-9755", "lastLogin": "2026-10-01 21:46:23", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2025-05-26", "status": "1" },
  { "num": "66057", "seq": 13, "id": "김지향", "name": "김지향", "hp": "010-5471-7785", "lastLogin": "2026-10-01 07:11:06", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2026-02-23", "status": "1" },
  { "num": "55374", "seq": 12, "id": "돌봄전담사", "name": "돌봄전담사", "hp": "010-2345-6789", "lastLogin": "2026-09-29 11:20:30", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2025-05-20", "status": "1" },
  { "num": "66058", "seq": 11, "id": "박경도", "name": "박경도", "hp": "010-7174-6467", "lastLogin": "2026-10-02 14:53:14", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2026-02-23", "status": "1" },
  { "num": "55384", "seq": 10, "id": "박은화", "name": "박은화", "hp": "010-7170-0780", "lastLogin": "2026-09-21 14:59:49", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2025-06-01", "status": "1" },
  { "num": "55375", "seq": 9, "id": "박지숙", "name": "박지숙", "hp": "010-2402-9796", "lastLogin": "2026-10-01 08:29:30", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2025-05-26", "status": "1" },
  { "num": "55390", "seq": 8, "id": "박지연", "name": "박지연", "hp": "010-3344-5566", "lastLogin": "2026-09-28 17:15:22", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2025-05-25", "status": "1" },
  { "num": "55391", "seq": 7, "id": "보조강사", "name": "보조강사", "hp": "010-8899-0011", "lastLogin": "2026-09-27 10:45:10", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2025-05-20", "status": "1" },
  { "num": "55392", "seq": 6, "id": "서인경", "name": "서인경", "hp": "010-1234-9876", "lastLogin": "2026-09-30 09:20:15", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2025-05-22", "status": "1" },
  { "num": "55393", "seq": 5, "id": "이금진", "name": "이금진", "hp": "010-4455-6677", "lastLogin": "2026-10-01 14:30:50", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2025-05-26", "status": "1" },
  { "num": "55394", "seq": 4, "id": "임은희", "name": "임은희", "hp": "010-7788-9900", "lastLogin": "2026-09-29 16:40:05", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2025-05-24", "status": "1" },
  { "num": "55395", "seq": 3, "id": "정진화", "name": "정진화", "hp": "010-2233-4455", "lastLogin": "2026-10-02 11:10:33", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2025-05-26", "status": "1" },
  { "num": "55396", "seq": 2, "id": "천윤아", "name": "천윤아", "hp": "010-5566-7788", "lastLogin": "2026-09-25 13:55:12", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2025-05-21", "status": "1" },
  { "num": "55397", "seq": 1, "id": "최정호", "name": "최정호", "hp": "010-9900-1122", "lastLogin": "2026-10-02 09:05:40", "tempPass": "-", "selfAuth": "-", "twoFactor": "-", "agreeDate": "2025-05-26", "status": "1" }
];

let currentTeacherData = [...defaultTeachersSeed];
let currentFilteredTeachers = [...defaultTeachersSeed];
let currentTeaPage = 1;
const teaPageSize = 10;

// 강사 목록 로드
function loadTeachers() {
  fetch('/api/ad_tea/list')
    .then(r => r.json())
    .then(data => {
      if (data && data.teachers && data.teachers.length > 0) {
        currentTeacherData = data.teachers;
      }
      currentFilteredTeachers = [...currentTeacherData];
      renderTeaPage(1);
    })
    .catch(() => {
      currentFilteredTeachers = [...currentTeacherData];
      renderTeaPage(1);
    });
}

// 강사 페이지 렌더링
function renderTeaPage(page = 1) {
  currentTeaPage = page;
  const tbody = document.getElementById('teaTableTbody');
  if (!tbody) return;

  const total = currentFilteredTeachers.length;
  const totalPages = Math.ceil(total / teaPageSize) || 1;
  if (currentTeaPage > totalPages) currentTeaPage = totalPages;
  if (currentTeaPage < 1) currentTeaPage = 1;

  const startIdx = (currentTeaPage - 1) * teaPageSize;
  const endIdx = startIdx + teaPageSize;
  const pageRows = currentFilteredTeachers.slice(startIdx, endIdx);

  tbody.innerHTML = pageRows.map(tea => {
    const isUsed = tea.status === '1';
    const statusText = isUsed ? '사용' : '대기';
    const statusClass = isUsed ? 'isu_status_1' : 'isu_status_0';
    return `
      <tr style="border-bottom:1px solid #eee; height:36px;">
        <td style="text-align:center; vertical-align:middle;">
          <input type="checkbox" name="data_checked[]" value="${tea.num}" class="tea-check-item" style="cursor:pointer;">
        </td>
        <td style="text-align:center; vertical-align:middle;">${tea.seq}</td>
        <td style="text-align:center; vertical-align:middle;">
          <a href="javascript:void(0);" onclick="openTeaModifyModal('${tea.num}')" title="수정" style="color:#555; text-decoration:none;">
            <i class="fa fa-cog icon_btn" style="cursor:pointer; font-size:14px;"></i>
          </a>
        </td>
        <td style="text-align:center; vertical-align:middle; font-weight:bold;">${tea.id}</td>
        <td style="text-align:center; vertical-align:middle;">${tea.name}</td>
        <td style="text-align:center; vertical-align:middle;">${tea.hp || '-'}</td>
        <td style="text-align:center; vertical-align:middle; font-size:12px; color:#666;">${tea.lastLogin || '-'}</td>
        <td style="text-align:center; vertical-align:middle;">${tea.tempPass || '-'}</td>
        <td style="text-align:center; vertical-align:middle;">${tea.selfAuth || '-'}</td>
        <td style="text-align:center; vertical-align:middle;">${tea.twoFactor || '-'}</td>
        <td style="text-align:center; vertical-align:middle; font-size:12px;">${tea.agreeDate || '-'}</td>
        <td style="text-align:center; vertical-align:middle;" width="95">
          <div class="span04" style="position:relative; display:inline-block;">
            <span class="${statusClass} isu_status_sm" id="view_mem_status_${tea.num}" style="padding:2px 8px; border-radius:3px; font-size:11px; font-weight:bold; background:${isUsed ? '#337ab7' : '#f0ad4e'}; color:#fff;">${statusText}</span>
            <span class="isu_check_box" style="margin-left:4px;">
              <a href="javascript:void(0);" onclick="toggleTeaStatusDropdown(event, '${tea.num}')" class="isu_check" style="color:#555; text-decoration:none;">
                <i class="fa fa-angle-down"></i>
              </a>
              <ul class="isu_choice teacher_isu" id="status_drop_${tea.num}" style="display:none; position:absolute; left:0; top:22px; background:#fff; border:1px solid #ccc; border-radius:3px; list-style:none; padding:4px 0; margin:0; z-index:10; min-width:60px; box-shadow:0 2px 6px rgba(0,0,0,0.15);">
                <li style="padding:3px 10px; text-align:center;"><a href="javascript:void(0);" onclick="chk_mem_status('${tea.num}', '0'); return false;" style="color:#333; text-decoration:none; font-size:12px; display:block;">대기</a></li>
                <li class="last" style="padding:3px 10px; text-align:center; border-top:1px solid #eee;"><a href="javascript:void(0);" onclick="chk_mem_status('${tea.num}', '1'); return false;" style="color:#333; text-decoration:none; font-size:12px; display:block;">사용</a></li>
              </ul>
            </span>
          </div>
        </td>
        <td style="text-align:center; vertical-align:middle;">
          <a href="javascript:void(0);" onclick="chk_del('${tea.num}'); return false;" title="삭제" style="color:#d9534f; text-decoration:none;">
            <i class="fa fa-trash-o icon_btn" style="cursor:pointer; font-size:14px;"></i>
          </a>
        </td>
      </tr>
    `;
  }).join('');

  // 페이징 렌더링
  const pagination = document.getElementById('teaPagination');
  if (pagination) {
    let pagesHtml = '';
    for (let i = 1; i <= totalPages; i++) {
      if (i === currentTeaPage) {
        pagesHtml += `<li class="active" style="padding:4px 10px; background:#337ab7; color:#fff; border-radius:3px; cursor:pointer;"><a href="javascript:void(0);" onclick="renderTeaPage(${i})" style="color:#fff; text-decoration:none;">${i}</a></li>`;
      } else {
        pagesHtml += `<li style="padding:4px 10px; background:#eee; border-radius:3px; cursor:pointer;"><a href="javascript:void(0);" onclick="renderTeaPage(${i})" style="color:#333; text-decoration:none;">${i}</a></li>`;
      }
    }
    if (totalPages > 1 && currentTeaPage < totalPages) {
      pagesHtml += `<li class="next" style="padding:4px 10px; background:#eee; border-radius:3px; cursor:pointer;"><a href="javascript:void(0);" onclick="renderTeaPage(${currentTeaPage + 1})" style="color:#333; text-decoration:none;">다음</a></li>`;
    }
    pagination.innerHTML = pagesHtml;
  }

  // 전체 선택 체크박스 초기화
  const allChk = document.getElementById('check_all');
  if (allChk) allChk.checked = false;
}

// 검색 핸들러
function searchTeaList(e) {
  if (e) e.preventDefault();
  const st = document.getElementById('st')?.value || 'mem_name';
  const sw = document.getElementById('s_word')?.value.trim() || '';

  if (!sw) {
    currentFilteredTeachers = [...currentTeacherData];
  } else {
    currentFilteredTeachers = currentTeacherData.filter(t => {
      if (st === 'mem_id') return t.id && t.id.includes(sw);
      return t.name && t.name.includes(sw);
    });
  }
  renderTeaPage(1);
}

// 검색 초기화 (전체 버튼)
function resetTeaList() {
  const swEl = document.getElementById('s_word');
  if (swEl) swEl.value = '';
  currentFilteredTeachers = [...currentTeacherData];
  renderTeaPage(1);
}

// 추가기능 드롭다운 토글
function toggleTeaControlBox(e) {
  if (e) e.stopPropagation();
  const drop = document.getElementById('main_control_box_drop');
  if (drop) {
    drop.style.display = drop.style.display === 'block' ? 'none' : 'block';
  }
}

// 개별 상태 드롭다운 토글
function toggleTeaStatusDropdown(e, num) {
  if (e) e.stopPropagation();
  // 다른 열린 드롭다운 닫기
  document.querySelectorAll('.teacher_isu').forEach(el => el.style.display = 'none');
  const drop = document.getElementById(`status_drop_${num}`);
  if (drop) {
    drop.style.display = drop.style.display === 'block' ? 'none' : 'block';
  }
}

// 배경 클릭 시 드롭다운 닫기
document.addEventListener('click', () => {
  const cDrop = document.getElementById('main_control_box_drop');
  if (cDrop) cDrop.style.display = 'none';
  document.querySelectorAll('.teacher_isu').forEach(el => el.style.display = 'none');
});

// 전체선택 체크박스 토글
function chk_all_tea(obj) {
  const checked = obj.checked;
  document.querySelectorAll('.tea-check-item').forEach(chk => chk.checked = checked);
}

// 개별 강사 상태 변경
function chk_mem_status(num, mem_status) {
  const target = currentTeacherData.find(t => String(t.num) === String(num));
  if (target) {
    target.status = String(mem_status);
    fetch('/api/ad_tea/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ num, status: mem_status })
    }).catch(() => {});
  }
  document.querySelectorAll('.teacher_isu').forEach(el => el.style.display = 'none');
  renderTeaPage(currentTeaPage);
  return true;
}

// 개별 강사 삭제
function chk_del(num) {
  if (confirm('삭제하시겠습니까?')) {
    currentTeacherData = currentTeacherData.filter(t => String(t.num) !== String(num));
    currentFilteredTeachers = currentFilteredTeachers.filter(t => String(t.num) !== String(num));
    fetch('/api/ad_tea/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nums: [num] })
    }).catch(() => {});
    renderTeaPage(currentTeaPage);
  }
  return false;
}

// 일괄적용 핸들러
function fm_tea_list_check(fm) {
  const updateTypeEl = document.getElementById('update_type');
  const updateType = updateTypeEl ? updateTypeEl.value : '';

  const checkedItems = [...document.querySelectorAll('.tea-check-item:checked')].map(c => c.value);
  if (checkedItems.length === 0) {
    alert('선택된 강사가 없습니다.');
    return false;
  }

  if (!updateType) {
    alert('일괄적용: 선택하세요.');
    if (updateTypeEl) updateTypeEl.focus();
    return false;
  }

  if (updateType === 'status_1') {
    if (confirm("선택된 강사의 상태를 '사용'으로 변경하시겠습니까?")) {
      currentTeacherData.forEach(t => {
        if (checkedItems.includes(String(t.num))) t.status = '1';
      });
      fetch('/api/ad_tea/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nums: checkedItems, status: '1' })
      }).catch(() => {});
      renderTeaPage(currentTeaPage);
    }
  } else if (updateType === 'status_0') {
    if (confirm("선택된 강사의 상태를 '대기'로 변경하시겠습니까?")) {
      currentTeacherData.forEach(t => {
        if (checkedItems.includes(String(t.num))) t.status = '0';
      });
      fetch('/api/ad_tea/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nums: checkedItems, status: '0' })
      }).catch(() => {});
      renderTeaPage(currentTeaPage);
    }
  } else if (updateType === 'del') {
    if (confirm("선택된 강사 정보를 삭제 하시겠습니까?")) {
      currentTeacherData = currentTeacherData.filter(t => !checkedItems.includes(String(t.num)));
      currentFilteredTeachers = currentFilteredTeachers.filter(t => !checkedItems.includes(String(t.num)));
      fetch('/api/ad_tea/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nums: checkedItems })
      }).catch(() => {});
      renderTeaPage(currentTeaPage);
    }
  }
  return false;
}

// ----------------- 강사 등록 모달 -----------------
function openTeaWriteModal() {
  const modal = document.getElementById('modal_ad_tea_write');
  if (modal) {
    modal.style.display = 'flex';
    document.getElementById('mem_id').value = '';
    document.getElementById('mem_name').value = '';
    document.getElementById('mem_passwd').value = '';
    document.getElementById('mem_status_1').checked = true;
    const errId = document.getElementById('error_mem_id');
    if (errId) errId.innerHTML = '';
  }
}

function closeTeaWriteModal() {
  const modal = document.getElementById('modal_ad_tea_write');
  if (modal) modal.style.display = 'none';
}

function chk_id() {
  const idVal = document.getElementById('mem_id')?.value.trim();
  const errEl = document.getElementById('error_mem_id');
  if (!idVal) {
    alert('아이디를 먼저 입력해 주세요.');
    return false;
  }
  const exists = currentTeacherData.some(t => t.id === idVal);
  if (exists) {
    if (errEl) errEl.innerHTML = `<span class="text-danger"><i class="fa fa-times-circle"></i> 이미 사용 중인 아이디입니다.</span>`;
    alert('이미 사용 중인 아이디입니다.');
  } else {
    if (errEl) errEl.innerHTML = `<span class="text-success" style="color:#28a745;"><i class="fa fa-check-circle"></i> 사용 가능한 아이디입니다.</span>`;
    alert('사용 가능한 아이디입니다.');
  }
  return true;
}

function submitTeaWrite(e) {
  if (e) e.preventDefault();
  const memId = document.getElementById('mem_id')?.value.trim();
  const memName = document.getElementById('mem_name')?.value.trim();
  const memPasswd = document.getElementById('mem_passwd')?.value.trim();
  const memStatus = document.getElementById('mem_status_1')?.checked ? '1' : '0';

  if (!memId || !memName || !memPasswd) {
    alert('필수 항목을 모두 입력해 주세요.');
    return false;
  }

  const newNum = String(Date.now());
  const newSeq = currentTeacherData.length + 1;
  const newTea = {
    num: newNum,
    seq: newSeq,
    id: memId,
    name: memName,
    hp: '010-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000),
    lastLogin: '-',
    tempPass: '-',
    selfAuth: '-',
    twoFactor: '-',
    agreeDate: new Date().toISOString().split('T')[0],
    status: memStatus
  };

  currentTeacherData.unshift(newTea);
  currentFilteredTeachers = [...currentTeacherData];
  fetch('/api/ad_tea/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTea)
  }).catch(() => {});

  alert('강사가 정상적으로 등록되었습니다.');
  closeTeaWriteModal();
  renderTeaPage(1);
  return false;
}

// ----------------- 강사 수정 모달 -----------------
function openTeaModifyModal(num) {
  const modal = document.getElementById('modal_ad_tea_modify');
  const tea = currentTeacherData.find(t => String(t.num) === String(num));
  if (!modal || !tea) return;

  document.getElementById('modify_tea_num').value = tea.num;
  document.getElementById('mod_view_mem_id').innerText = tea.id;
  document.getElementById('mod_mem_name').value = tea.name;
  document.getElementById('mod_mem_name').readOnly = true;
  document.getElementById('change_mem_name').checked = false;
  document.getElementById('mod_mem_passwd').value = '';
  document.getElementById('mod_view_hp').innerText = tea.hp || '-';
  document.getElementById('del_mem_hp').checked = false;

  if (tea.status === '1') {
    document.getElementById('mod_mem_status_1').checked = true;
  } else {
    document.getElementById('mod_mem_status_0').checked = true;
  }

  document.getElementById('mod_temp_pass').innerText = tea.tempPass || '-';
  document.getElementById('mod_self_auth').innerText = tea.selfAuth || '-';
  document.getElementById('mod_two_factor').innerText = tea.twoFactor || '-';
  document.getElementById('mod_agree_date').innerText = tea.agreeDate || '-';
  document.getElementById('mod_last_login').innerText = tea.lastLogin || '-';

  modal.style.display = 'flex';
}

function closeTeaModifyModal() {
  const modal = document.getElementById('modal_ad_tea_modify');
  if (modal) modal.style.display = 'none';
}

function chk_change_mem_name() {
  const chk = document.getElementById('change_mem_name');
  const nameInput = document.getElementById('mod_mem_name');
  if (nameInput && chk) {
    nameInput.readOnly = !chk.checked;
    if (chk.checked) nameInput.focus();
  }
}

function submitTeaModify(e) {
  if (e) e.preventDefault();
  const num = document.getElementById('modify_tea_num')?.value;
  const tea = currentTeacherData.find(t => String(t.num) === String(num));
  if (!tea) return false;

  const memName = document.getElementById('mod_mem_name')?.value.trim();
  const delHp = document.getElementById('del_mem_hp')?.checked;
  const memStatus = document.getElementById('mod_mem_status_1')?.checked ? '1' : '0';

  if (!memName) {
    alert('이름을 입력하세요.');
    return false;
  }

  tea.name = memName;
  if (delHp) tea.hp = '-';
  tea.status = memStatus;

  fetch('/api/ad_tea/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tea)
  }).catch(() => {});

  alert('강사 정보가 수정되었습니다.');
  closeTeaModifyModal();
  renderTeaPage(currentTeaPage);
  return false;
}

// ----------------- 강사 일괄입력 모달 -----------------
function openTeaInputModal() {
  const modal = document.getElementById('modal_ad_tea_input');
  if (modal) {
    modal.style.display = 'flex';
    document.getElementById('userfile').value = '';
    document.getElementById('def_passwd').value = '';
    document.getElementById('input_type_add').checked = true;
  }
}

function closeTeaInputModal() {
  const modal = document.getElementById('modal_ad_tea_input');
  if (modal) modal.style.display = 'none';
}

function submitTeaBatchInput(e) {
  if (e) e.preventDefault();
  const fileEl = document.getElementById('userfile');
  if (!fileEl || !fileEl.files || fileEl.files.length === 0) {
    alert('엑셀 데이터 파일 : 필수항목입니다.');
    if (fileEl) fileEl.focus();
    return false;
  }

  const inputType = document.getElementById('input_type_clear')?.checked ? 'clear' : 'add';
  const confirmMsg = inputType === 'clear' 
    ? '기존 데이터를 삭제 후 일괄입력 하시겠습니까?' 
    : '기존 데이터에 추가로 일괄입력 하시겠습니까?';

  if (!confirm(confirmMsg)) return false;

  if (inputType === 'clear') {
    currentTeacherData = [];
  }

  // 모의 배치 추가
  const sampleBatch = [
    { num: '77001', seq: currentTeacherData.length + 1, id: '박하은', name: '박하은', hp: '010-3333-8888', lastLogin: '-', tempPass: '-', selfAuth: '-', twoFactor: '-', agreeDate: new Date().toISOString().split('T')[0], status: '1' },
    { num: '77002', seq: currentTeacherData.length + 2, id: '윤도현', name: '윤도현', hp: '010-5555-9999', lastLogin: '-', tempPass: '-', selfAuth: '-', twoFactor: '-', agreeDate: new Date().toISOString().split('T')[0], status: '1' }
  ];

  currentTeacherData = [...sampleBatch, ...currentTeacherData];
  currentFilteredTeachers = [...currentTeacherData];

  alert('강사 데이터가 정상적으로 일괄입력 처리되었습니다. (2건 반영)');
  closeTeaInputModal();
  renderTeaPage(1);
  return false;
}

// ----------------- 강사 시간표 출력 모달 -----------------
function openTeaScheduleModal() {
  const modal = document.getElementById('modal_ad_tea_schedule');
  if (modal) modal.style.display = 'flex';
}

function closeTeaScheduleModal() {
  const modal = document.getElementById('modal_ad_tea_schedule');
  if (modal) modal.style.display = 'none';
}

function submitTeaSchedule(e) {
  const lecDiv = document.getElementById('lec_div')?.value;
  if (!lecDiv) {
    alert('강좌구분 : 선택하세요.');
    return false;
  }
  if (!confirm('출력하시겠습니까?\n\n(데이터가 많은 경우 처리되는 시간이 다소 지연될 수 있습니다.)')) {
    if (e) e.preventDefault();
    return false;
  }
  closeTeaScheduleModal();
  return true;
}
