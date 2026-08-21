// dbdbschool Sub-Model View Engine & Action Button Router (28 Live Pages & 29 Submodels)

const SCHOOL_SN = '3267';
let currentSubmodelKey = 'ad_lec_lists';

const submodelTitles = {
  // 단독 대메뉴 (13개)
  ad_faq_main: '<i class="fa-solid fa-book"></i> 매뉴얼 (FAQ)',
  qanda_lists: '<i class="fa-solid fa-comments"></i> 고객지원 게시판',
  sczigi_service_lists: '<i class="fa-solid fa-school"></i> 학교관리',
  ad_lec_lists: '<i class="fa-solid fa-book-open"></i> 강좌관리',
  ad_lec_write: '<i class="fa-solid fa-file-circle-plus"></i> 등록 - 강좌관리',
  ad_lec_input: '<i class="fa-solid fa-file-import"></i> 일괄입력 - 강좌관리',
  ad_app_lists: '<i class="fa-solid fa-users"></i> 신청자관리',
  ad_wait_lists: '<i class="fa-solid fa-clock-rotate-left"></i> 대기자관리',
  ad_att_stat: '<i class="fa-solid fa-signature"></i> 출석부관리',
  ad_ref_lists: '<i class="fa-solid fa-calculator"></i> 환불/취소관리',
  ad_abs_lists: '<i class="fa-solid fa-user-xmark"></i> 결석/귀가신청',
  ad_tea_lists: '<i class="fa-solid fa-chalkboard-user"></i> 강사관리',
  notification_lists: '<i class="fa-solid fa-paper-plane"></i> 알림관리',
  spush_lists: '<i class="fa-solid fa-bell"></i> 푸시알림관리',
  ad_extension_lists: '<i class="fa-solid fa-calendar-plus"></i> 연장신청',

  // 지원금관리 (4개)
  ad_free2_stu: '<i class="fa-solid fa-hand-holding-dollar"></i> 지원금관리 > 대상자관리',
  ad_free2_app: '<i class="fa-solid fa-receipt"></i> 지원금관리 > 수강자관리',
  ad_free2_cfg_main: '<i class="fa-solid fa-sliders"></i> 지원금관리 > 지원금설정',
  ad_free2_cfg_free1: '<i class="fa-solid fa-ranking-star"></i> 지원금관리 > 순위구분설정',

  // 설문관리 (2개)
  ad_sur_lists: '<i class="fa-solid fa-square-poll-vertical"></i> 설문관리 > 설문',
  ad_surs_lists: '<i class="fa-solid fa-list-check"></i> 설문관리 > 샘플설문',

  // 환경설정 (10개)
  ad_cfg_main: '<i class="fa-solid fa-gear"></i> 환경설정 > 기본설정',
  ad_time_lists: '<i class="fa-solid fa-calendar-days"></i> 환경설정 > 신청기간',
  ad_cfg_period: '<i class="fa-solid fa-clock"></i> 환경설정 > 강의시간',
  ad_cfg_afDiv: '<i class="fa-solid fa-layer-group"></i> 환경설정 > 강좌구분',
  ad_cfg_appLiGrp: '<i class="fa-solid fa-ban"></i> 환경설정 > 중복제한그룹',
  ad_verify_main: '<i class="fa-solid fa-user-check"></i> 환경설정 > 학적검증',
  ad_neis_edufine_lists: '<i class="fa-solid fa-file-invoice-dollar"></i> 환경설정 > 나이스/에듀파인 설정',
  ad_cfg_message: '<i class="fa-solid fa-bullhorn"></i> 환경설정 > 안내글설정',
  ad_cfg_clear: '<i class="fa-solid fa-triangle-exclamation"></i> 환경설정 > 초기화',
  ad_info_modify: '<i class="fa-solid fa-id-card"></i> 환경설정 > 담당자정보'
};

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  let initialKey = 'ad_lec_lists';

  // Match live URL routes
  if (path.includes('/af/ad_lec/write')) initialKey = 'ad_lec_write';
  else if (path.includes('/af/ad_lec/input')) initialKey = 'ad_lec_input';
  else if (path.includes('/af/ad_faq/main')) initialKey = 'ad_faq_main';
  else if (path.includes('/af/qanda/lists')) initialKey = 'qanda_lists';
  else if (path.includes('/sczigi/service/lists')) initialKey = 'sczigi_service_lists';
  else if (path.includes('/af/ad_lec/lists')) initialKey = 'ad_lec_lists';
  else if (path.includes('/af/ad_app/lists') || path.includes('/af/ad_stu/lists')) initialKey = 'ad_app_lists';
  else if (path.includes('/af/ad_wait/lists')) initialKey = 'ad_wait_lists';
  else if (path.includes('/af/ad_att/stat')) initialKey = 'ad_att_stat';
  else if (path.includes('/af/ad_ref/lists')) initialKey = 'ad_ref_lists';
  else if (path.includes('/af/ad_abs/lists')) initialKey = 'ad_abs_lists';
  else if (path.includes('/af/ad_tea/lists')) initialKey = 'ad_tea_lists';
  else if (path.includes('/af/notification/lists')) initialKey = 'notification_lists';
  else if (path.includes('/af/spush/lists')) initialKey = 'spush_lists';
  else if (path.includes('/af/ad_extension/lists')) initialKey = 'ad_extension_lists';
  else if (path.includes('/af/ad_free2_stu')) initialKey = 'ad_free2_stu';
  else if (path.includes('/af/ad_free2_app')) initialKey = 'ad_free2_app';
  else if (path.includes('/af/ad_free2_cfg/free1')) initialKey = 'ad_free2_cfg_free1';
  else if (path.includes('/af/ad_free2_cfg/main')) initialKey = 'ad_free2_cfg_main';
  else if (path.includes('/af/ad_surs/lists')) initialKey = 'ad_surs_lists';
  else if (path.includes('/af/ad_sur/lists')) initialKey = 'ad_sur_lists';
  else if (path.includes('/af/ad_cfg/period')) initialKey = 'ad_cfg_period';
  else if (path.includes('/af/ad_cfg/afDiv')) initialKey = 'ad_cfg_afDiv';
  else if (path.includes('/af/ad_cfg/appLiGrp')) initialKey = 'ad_cfg_appLiGrp';
  else if (path.includes('/af/ad_time/lists')) initialKey = 'ad_time_lists';
  else if (path.includes('/af/ad_verify/main')) initialKey = 'ad_verify_main';
  else if (path.includes('/af/ad_neis_edufine/lists')) initialKey = 'ad_neis_edufine_lists';
  else if (path.includes('/af/ad_cfg/message')) initialKey = 'ad_cfg_message';
  else if (path.includes('/af/ad_cfg/clear')) initialKey = 'ad_cfg_clear';
  else if (path.includes('/af/ad_info/modify')) initialKey = 'ad_info_modify';
  else if (path.includes('/af/ad_cfg/main')) initialKey = 'ad_cfg_main';

  switchSubmodelView(null, initialKey, path, false);
});

// Dynamic Sub-model Switcher & SPA URL PushState
function switchSubmodelView(event, key, url, pushState = true) {
  if (event) event.preventDefault();

  if (key === 'ad_app_lists') {
    window.location.href = '/af/ad_app/lists/sn/3267';
    return;
  }

  currentSubmodelKey = key;

  if (pushState && url) {
    window.history.pushState({ key, url }, '', url);
  }

  const titleEl = document.getElementById('viewMainTitle');
  if (titleEl && submodelTitles[key]) {
    titleEl.innerHTML = submodelTitles[key];
  }

  document.querySelectorAll('.sidebar-menu li.subitem').forEach(li => li.classList.remove('active'));
  const activeSubitem = document.getElementById('sub_' + key);
  if (activeSubitem) {
    activeSubitem.classList.add('active');
    const parentMenu = activeSubitem.closest('.has-submenu');
    if (parentMenu) parentMenu.classList.add('open');
  }

  document.querySelectorAll('.submodel-panel').forEach(panel => {
    panel.style.display = 'none';
    panel.classList.remove('active');
  });

  const activePanel = document.getElementById('panel_' + key) || document.getElementById('panel_ad_lec_lists');
  if (activePanel) {
    activePanel.style.display = 'block';
    activePanel.classList.add('active');
  }

  loadSubmodelData(key);
}

// Load submodel data on demand
function loadSubmodelData(key) {
  switch (key) {
    case 'ad_lec_lists':
    case 'ad_lec_room':
    case 'ad_lec_status':
      loadLectures();
      break;
    case 'ad_app_lists':
      loadApplicants();
      break;
    case 'ad_wait_lists':
      loadWaitlist();
      break;
    case 'ad_att_stat':
      loadAttendance();
      break;
    case 'ad_ref_lists':
      loadRefunds();
      break;
    case 'ad_abs_lists':
      loadAbsences();
      break;
    case 'ad_tea_lists':
      loadTeachers();
      break;
    case 'notification_lists':
      loadNotifications();
      break;
    case 'spush_lists':
      loadPushNotifications();
      break;
    case 'ad_extension_lists':
      loadServiceExtensions();
      break;
    case 'sczigi_service_lists':
      loadSchools();
      break;
    case 'ad_free2_stu':
      loadSubsidyStudents();
      break;
    case 'ad_free2_app':
      loadSubsidyApplicants();
      break;
    case 'ad_free2_cfg_free1':
      loadSubsidyRanks();
      break;
    case 'ad_sur_lists':
      loadSurveys();
      break;
    case 'ad_surs_lists':
      loadSampleSurveys();
      break;
    case 'ad_cfg_period':
      loadPeriods();
      break;
    case 'ad_cfg_afDiv':
      loadAfDivisions();
      break;
    case 'ad_time_lists':
      loadApplyPeriods();
      break;
    case 'ad_cfg_appLiGrp':
      loadRestrictionGroups();
      break;
    case 'ad_cfg_message':
      loadNoticeSettings();
      break;
    case 'ad_info_modify':
      loadManagerInfo();
      break;
    case 'qanda_lists':
      loadQaList();
      break;
    case 'ad_faq_main':
      loadFaqList();
      break;
  }
}

// ==================== 1. 강좌관리 (/af/ad_lec/lists) ====================

let cachedLectures = [];
let lectureSortDirection = 'asc';

function toggleDetailSearch() {
  const searchBox = document.getElementById('main_control_box_search');
  const toggleText = document.getElementById('searchToggleText');
  const toggleIcon = document.getElementById('searchToggleIcon');
  if (!searchBox) return;

  if (searchBox.style.display === 'none') {
    searchBox.style.display = 'inline-flex';
    if (toggleText) toggleText.innerText = '닫기';
    if (toggleIcon) { toggleIcon.className = 'fa fa-angle-up'; }
  } else {
    searchBox.style.display = 'none';
    if (toggleText) toggleText.innerText = '열기';
    if (toggleIcon) { toggleIcon.className = 'fa fa-angle-down'; }
  }
}

function toggleExtraDropdown() {
  const drop = document.getElementById('main_control_box_drop');
  const icon = document.getElementById('extraToggleIcon');
  if (!drop) return;

  if (drop.style.display === 'none' || drop.style.display === '') {
    drop.style.display = 'flex';
    if (icon) icon.className = 'fa fa-angle-up';
  } else {
    drop.style.display = 'none';
    if (icon) icon.className = 'fa fa-angle-down';
  }
}

// Close extra dropdown on click outside
document.addEventListener('click', (e) => {
  const btn = document.getElementById('main_control_box_btn02');
  const drop = document.getElementById('main_control_box_drop');
  if (drop && btn && !btn.contains(e.target) && !drop.contains(e.target)) {
    drop.style.display = 'none';
    const icon = document.getElementById('extraToggleIcon');
    if (icon) icon.className = 'fa fa-angle-down';
  }
});

function resetLectureSearch() {
  if (document.getElementById('categoryFilter')) document.getElementById('categoryFilter').value = 'all';
  if (document.getElementById('neulbomFilter')) document.getElementById('neulbomFilter').value = 'all';
  if (document.getElementById('statusFilter')) document.getElementById('statusFilter').value = 'all';
  if (document.getElementById('gradeFilter')) document.getElementById('gradeFilter').value = '';
  if (document.getElementById('searchKeyword')) document.getElementById('searchKeyword').value = '';
  loadLectures();
}

function sortLectureTable(field) {
  lectureSortDirection = lectureSortDirection === 'asc' ? 'desc' : 'asc';
  if (!cachedLectures || cachedLectures.length === 0) return;
  cachedLectures.sort((a, b) => {
    const valA = (a.title || '').toLowerCase();
    const valB = (b.title || '').toLowerCase();
    if (lectureSortDirection === 'asc') return valA.localeCompare(valB, 'ko');
    return valB.localeCompare(valA, 'ko');
  });
  renderLectureTable(cachedLectures);
}

async function loadLectures() {
  const categoryEl = document.getElementById('categoryFilter');
  const neulbomEl = document.getElementById('neulbomFilter');
  const statusEl = document.getElementById('statusFilter');
  const gradeEl = document.getElementById('gradeFilter');
  const keywordEl = document.getElementById('searchKeyword');

  const category = (categoryEl && categoryEl.value !== 'all') ? categoryEl.value : '';
  const status = (statusEl && statusEl.value !== 'all') ? statusEl.value : '';
  const keyword = keywordEl ? keywordEl.value.trim() : '';

  try {
    const res = await fetch(`/api/af/ad_lec/lists/sn/${SCHOOL_SN}?category=${encodeURIComponent(category)}&status=${encodeURIComponent(status)}&keyword=${encodeURIComponent(keyword)}`);
    const data = await res.json();
    if (data.success) {
      let list = data.lectures || [];

      // Client-side neulbom & grade secondary filtering
      if (neulbomEl && neulbomEl.value !== 'all') {
        list = list.filter(l => (l.neulbomType && l.neulbomType.includes(neulbomEl.value)) || (l.title && l.title.includes(neulbomEl.value)));
      }
      if (gradeEl && gradeEl.value) {
        list = list.filter(l => (l.targetGrade || '').includes(gradeEl.value));
      }

      cachedLectures = list;
      const span = document.getElementById('totalCountSpan');
      if (span) span.innerText = list.length;
      renderLectureTable(list);
      updateSelectedCourseCount();
    }
  } catch (e) { console.error('loadLectures Error:', e); }
}

function renderLectureTable(lectures) {
  const tbody = document.getElementById('lectureTbody');
  if (!tbody) return;
  if (!lectures || lectures.length === 0) {
    tbody.innerHTML = `<tr><td colspan="18" style="text-align: center; padding: 40px; color: #777;">검색된 데이터가 없습니다.</td></tr>`;
    return;
  }

  const totalCount = lectures.length;

  tbody.innerHTML = lectures.map((lec, idx) => {
    const seq = totalCount - idx;
    const periodDisplay = (lec.period || '2026-09-01~2026-09-30').replace('~', '~<br>');
    
    // Exact badge design matching screenshot
    let neulbomBadge = '';
    if (lec.neulbomType === '돌봄' || (lec.category && lec.category.includes('돌봄')) || (lec.title && lec.title.includes('돌봄'))) {
      neulbomBadge = '<span style="display:inline-block; font-size:11px; padding:0 4px; border:1px solid #bce8f1; color:#31708f; background-color:#d9edf7; border-radius:3px;">돌봄</span>';
    } else if (lec.neulbomType === '맞춤형' || (lec.title && (lec.title.includes('놀이체육') || lec.title.includes('독후') || lec.title.includes('창의보드')))) {
      neulbomBadge = '<span style="display:inline-block; font-size:11px; padding:0 4px; border:1px solid #ebccd1; color:#a94442; background-color:#f2dede; border-radius:3px;">맞춤형</span>';
    } else {
      neulbomBadge = '<span style="display:inline-block; font-size:11px; padding:0 4px; border:1px solid #ccc; color:#555; background-color:#f5f5f5; border-radius:3px;">방과후</span>';
    }

    const scheduleHtml = (lec.schedule || `${lec.dayOfWeek || ''}:${lec.scheduleTime || ''}`).replace(/ \/ /g, '<br>');

    // Status button
    let statusBtn = '';
    if (lec.status === 'CLOSED') {
      statusBtn = `<button type="button" class="btn btn-default btn-xs" style="background:#777; border-color:#666; color:#fff; font-size:11px; padding:1px 6px; border-radius:3px;" onclick="toggleCourseAttribute('${lec.id}', 'status')">종료 <i class="fa-solid fa-caret-down" style="font-size:9px;"></i></button>`;
    } else if (lec.status === 'WAITING') {
      statusBtn = `<button type="button" class="btn btn-warning btn-xs" style="background:#f0ad4e; border-color:#eea236; color:#fff; font-size:11px; padding:1px 6px; border-radius:3px;" onclick="toggleCourseAttribute('${lec.id}', 'status')">대기 <i class="fa-solid fa-caret-down" style="font-size:9px;"></i></button>`;
    } else {
      statusBtn = `<button type="button" class="btn btn-danger btn-xs" style="background:#d9534f; border-color:#d43f3a; color:#fff; font-size:11px; padding:1px 6px; border-radius:3px;" onclick="toggleCourseAttribute('${lec.id}', 'status')">출력 <i class="fa-solid fa-caret-down" style="font-size:9px;"></i></button>`;
    }

    return `
    <tr style="height:36px; text-align:center; vertical-align:middle; border-bottom:1px solid #eee;">
      <td><input type="checkbox" class="lec-checkbox" value="${lec.id}" onchange="updateSelectedCourseCount()"></td>
      <td style="color:#555;">${seq}</td>
      <td>
        <a href="javascript:void(0)" onclick="openEditModal('${lec.id}')" title="수정" style="color:#777; text-decoration:none; font-size:13px;"><i class="fa-solid fa-gear"></i></a>
      </td>
      <td style="line-height:1.3; font-size:11px;">
        <div style="color:#333;">${lec.category || '26년 9월'}</div>
        ${neulbomBadge}
      </td>
      <td style="text-align:left; padding-left:8px;">
        <strong style="color:#333; font-size:12px;">${lec.title}</strong>
        ${lec.allowTimeConflict ? '<span style="font-size:10px; color:#8b5cf6; margin-left:4px;">[중복허용]</span>' : ''}
      </td>
      <td style="font-size:11px; color:#333;">${lec.instructor || '돌봄전담사'}</td>
      <td>
        <a href="/af/ad_app/lists/sn/${SCHOOL_SN}" onclick="switchSubmodelView(event, 'ad_app_lists', '/af/ad_app/lists/sn/${SCHOOL_SN}')" style="color:#337ab7; text-decoration:underline; font-weight:normal;">${lec.enrolledCount || 0} / ${lec.capacity || 20}</a>
      </td>
      <td>
        <a href="/af/ad_wait/lists/sn/${SCHOOL_SN}" onclick="switchSubmodelView(event, 'ad_wait_lists', '/af/ad_wait/lists/sn/${SCHOOL_SN}')" style="color:#555; text-decoration:underline; text-decoration-style:dotted;">${lec.waitingCount || 0}/${lec.waitingCapacity || 3}</a>
      </td>
      <td style="font-size:11px;">${lec.targetGrade || '1,2,3'}</td>
      <td style="font-size:11px; color:#555; line-height:1.2;">${periodDisplay}</td>
      <td style="font-size:11px; color:#555; line-height:1.2;">${scheduleHtml}</td>
      <td style="text-align:right; padding-right:8px; font-weight:normal; color:#333;">${(lec.tuitionFee || 0).toLocaleString()}</td>
      <td style="cursor:pointer;" onclick="toggleCourseAttribute('${lec.id}', 'feeReceipt')">
        ${lec.feeReceipt === 'Y' ? '<span style="color:#5cb85c; font-weight:bold;">출력</span>' : '<span style="color:#999;">-</span>'}
      </td>
      <td style="cursor:pointer;" onclick="toggleCourseAttribute('${lec.id}', 'teacherClosed')">
        ${lec.teacherClosed === 'Y' || lec.instructorClosed ? '<span style="color:#d9534f; font-weight:bold;">마감</span>' : '<span style="color:#999;">-</span>'}
      </td>
      <td style="cursor:pointer;" onclick="toggleCourseAttribute('${lec.id}', 'teacherEditable')">
        ${lec.teacherEditable === 'Y' ? '<span style="color:#5cb85c; font-weight:bold;">가능</span>' : '<span style="color:#999;">-</span>'}
      </td>
      <td style="cursor:pointer;" onclick="toggleCourseAttribute('${lec.id}', 'refundClosed')">
        ${lec.refundClosed ? '<span style="color:#d9534f; font-weight:bold;">마감</span>' : '<span style="color:#999;">-</span>'}
      </td>
      <td>
        ${statusBtn}
      </td>
      <td>
        <a href="javascript:void(0)" onclick="deleteCourse('${lec.id}', '${lec.title}')" title="삭제" style="color:#777; text-decoration:none; font-size:14px;"><i class="fa-regular fa-trash-can"></i></a>
      </td>
    </tr>
  `;
  }).join('');
}

function updateSelectedCourseCount() {
  const checkedBoxes = document.querySelectorAll('.lec-checkbox:checked');
  const countEl = document.getElementById('selectedCoursesCount');
  if (countEl) countEl.innerText = checkedBoxes.length;
}

function toggleSelectAll(masterBox) {
  const boxes = document.querySelectorAll('.lec-checkbox');
  boxes.forEach(b => b.checked = masterBox.checked);
  updateSelectedCourseCount();
}

async function applyBatchAction() {
  const action = document.getElementById('bottom_batch_action').value;
  if (!action) {
    alert('일괄적용할 항목을 먼저 선택하세요.');
    return;
  }
  const checkedBoxes = Array.from(document.querySelectorAll('.lec-checkbox:checked')).map(b => b.value);
  if (checkedBoxes.length === 0) {
    alert('적용할 강좌를 1개 이상 선택해 주세요.');
    return;
  }

  if (action === 'batch_delete') {
    if (!confirm(`선택한 ${checkedBoxes.length}개 강좌를 정말 삭제하시겠습니까?`)) return;
    try {
      for (const id of checkedBoxes) {
        await fetch(`/api/af/ad_lec/delete/${id}`, { method: 'DELETE' });
      }
      alert('선택한 강좌가 일괄 삭제되었습니다.');
      loadLectures();
    } catch (e) {
      alert('일괄 삭제 중 오류가 발생했습니다.');
    }
    return;
  }

  // Handle status / toggle batch updates
  try {
    for (const id of checkedBoxes) {
      const course = cachedLectures.find(c => c.id === id);
      if (!course) continue;
      const payload = { ...course };
      if (action === 'status_1') payload.status = 'OUTPUT';
      else if (action === 'status_0') payload.status = 'WAITING';
      else if (action === 'status_2') payload.status = 'CLOSED';
      else if (action === 'tuition_output_yes') payload.feeReceipt = 'Y';
      else if (action === 'tuition_output_no') payload.feeReceipt = 'N';
      else if (action === 'teacher_close_yes') payload.teacherClosed = 'Y';
      else if (action === 'teacher_close_no') payload.teacherClosed = 'N';
      else if (action === 'teacher_edit_yes') payload.teacherEditable = 'Y';
      else if (action === 'teacher_edit_no') payload.teacherEditable = 'N';
      else if (action === 'refund_close_yes') payload.refundClosed = true;
      else if (action === 'refund_close_no') payload.refundClosed = false;

      await fetch(`/api/af/ad_lec/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    alert(`선택한 ${checkedBoxes.length}개 강좌에 일괄 적용이 완료되었습니다.`);
    loadLectures();
  } catch (err) {
    console.error('Batch update error:', err);
    alert('일괄 적용 처리 중 오류가 발생했습니다.');
  }
}

// ==================== 강좌관리 인라인 및 액션 헬퍼 ====================

// 1. 인라인 정원 실시간 수정 (show_max_sin)
async function show_max_sin(courseId, currentCapacity = 20) {
  const newCap = prompt('변경할 강좌의 정원을 입력하세요:', currentCapacity);
  if (newCap === null || newCap.trim() === '') return;
  const capNum = parseInt(newCap, 10);
  if (isNaN(capNum) || capNum < 0) {
    alert('올바른 숫자를 입력하세요.');
    return;
  }

  try {
    const res = await fetch('/api/af/ad_lec/capacity', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: courseId, capacity: capNum })
    });
    const data = await res.json();
    if (data.success) {
      loadLectures();
    } else {
      alert(data.message || '정원 수정 실패');
    }
  } catch (err) {
    console.error('Capacity update error:', err);
    alert('정원 수정 중 통신 오류가 발생했습니다.');
  }
}

// 2. 강좌 상태 드롭다운 실시간 변경 (chk_lec_status)
async function chk_lec_status(courseId, statusCode) {
  let statusStr = 'OUTPUT';
  if (statusCode === 0 || statusCode === '0') statusStr = 'WAITING';
  else if (statusCode === 2 || statusCode === '2') statusStr = 'CLOSED';

  try {
    const res = await fetch('/api/af/ad_lec/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseIds: [courseId], status: statusStr })
    });
    const data = await res.json();
    if (data.success) {
      loadLectures();
    } else {
      alert(data.message || '상태 변경 실패');
    }
  } catch (err) {
    console.error('Status update error:', err);
  }
}

// 3. 강좌 일괄복사 사전 검증 (chk_copy)
function chk_copy() {
  const sel = document.getElementById('categoryFilter');
  if (!sel || sel.value === 'all') {
    alert('강좌구분을 먼저 선택하세요.');
    return false;
  }
  openBatchCopyModal();
  return true;
}

// 4. 검색결과 엑셀 출력 (exportToExcel)
function exportToExcel() {
  window.location.href = '/af/ad_lec/listse/p/1/sn/3267/sld/11/sof/ln/sot/asc';
}

// 5. 출석부 출력 (printAttendanceSheet)
function printAttendanceSheet() {
  window.open('/af/ad_att/excel/p/1/sn/3267/sld/11/sof/ln/sot/asc', '_blank');
}

// 6. 강좌 통계 모달 열기
async function openLectureStatsModal() {
  try {
    const res = await fetch('/api/af/ad_lec/stats');
    const data = await res.json();
    if (data.success && data.stats) {
      let msg = '📊 [강좌 통계 현황]\n\n';
      data.stats.forEach(st => {
        msg += `■ 구분: ${st.category}\n - 총 강좌수: ${st.total}개 (출력: ${st.outputCount}, 대기: ${st.waitingCount}, 종료: ${st.closedCount})\n - 총 정원: ${st.totalCapacity}명 / 총 신청자: ${st.totalApplied}명\n\n`;
      });
      alert(msg);
    }
  } catch (e) {
    alert('통계 데이터를 불러오는 중 오류가 발생했습니다.');
  }
}

// 7. 검색 조건 리셋 (전체 버튼)
function resetLectureSearch() {
  const cat = document.getElementById('categoryFilter');
  const nlb = document.getElementById('neulbomFilter');
  const sts = document.getElementById('statusFilter');
  const grd = document.getElementById('gradeFilter');
  const kw = document.getElementById('searchKeyword');

  if (cat) cat.value = 'all';
  if (nlb) nlb.value = 'all';
  if (sts) sts.value = 'all';
  if (grd) grd.value = '';
  if (kw) kw.value = '';

  loadLectures();
}

// ==================== 2. 신청자관리 (/af/ad_app/lists) ====================

async function loadApplicants() {
  try {
    const res = await fetch(`/api/af/ad_stu/lists/sn/${SCHOOL_SN}`);
    const data = await res.json();
    if (data.success) {
      const span = document.getElementById('applicantCountSpan');
      if (span) span.innerText = data.totalCount || data.applicants.length;

      const tbody = document.getElementById('studentTbody');
      if (!tbody) return;
      tbody.innerHTML = data.applicants.map(app => `
        <tr>
          <td style="text-align: center;"><input type="checkbox" class="app-checkbox" value="${app.id}"></td>
          <td><strong>${app.studentName}</strong></td>
          <td>${app.gradeClass}</td>
          <td>${app.parentPhone}</td>
          <td>${app.courseTitle}</td>
          <td><span class="badge badge-OUTPUT">${app.subsidyType}</span></td>
          <td><strong>35,000원</strong></td>
          <td><span class="badge badge-OUTPUT">${app.paymentStatus}</span></td>
          <td><span class="badge ${app.status === '수강승인' ? 'badge-OUTPUT' : 'badge-CLOSED'}">${app.status}</span></td>
          <td style="text-align: center;">
            <button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.8rem;" onclick="approveApplicant('${app.id}')">승인 변경</button>
          </td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadApplicants Error:', e); }
}

function toggleSelectAllApps(master) {
  document.querySelectorAll('.app-checkbox').forEach(cb => cb.checked = master.checked);
}

function approveSelectedStudent() {
  alert('선택하신 수강생의 승인 상태가 업데이트되었습니다.');
  loadApplicants();
}

function cancelSelectedStudent() {
  if (confirm('선택 학생의 수강을 취소하고 대기자에게 결원 승격 알림을 전송하시겠습니까?')) {
    alert('수강 취소 및 대기자 자동 승격이 완료되었습니다.');
    loadApplicants();
  }
}

function approveApplicant(id) {
  alert(`신청 ID: ${id}의 승인 상태가 변경되었습니다.`);
  loadApplicants();
}

// ==================== 3. 대기자관리 (/af/ad_wait/lists) ====================

async function loadWaitlist() {
  try {
    const res = await fetch('/api/af/ad_wait/lists');
    const data = await res.json();
    const tbody = document.getElementById('waitlistTbody');
    if (tbody && data.waitlist) {
      tbody.innerHTML = data.waitlist.map(w => `
        <tr>
          <td><strong style="color: var(--primary-color);">대기 ${w.rank}번</strong></td>
          <td><strong>${w.studentName}</strong></td>
          <td>${w.gradeClass}</td>
          <td>${w.parentPhone}</td>
          <td>${w.courseTitle}</td>
          <td>${w.appliedAt}</td>
          <td><span class="badge ${w.status === '대기중' ? 'badge-WAITING' : 'badge-OUTPUT'}">${w.status}</span></td>
          <td style="text-align: center;">
            ${w.status === '대기중' ? `<button class="btn btn-primary" style="padding:4px 8px; font-size:0.8rem;" onclick="promoteWaitStudent('${w.id}')"><i class="fa-solid fa-arrow-up-right-from-square"></i> 즉시 승격</button>` : '<span style="color:#16a34a; font-weight:600;">승격 완료됨</span>'}
          </td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadWaitlist Error:', e); }
}

async function promoteWaitStudent(waitId) {
  const res = await fetch('/api/af/ad_wait/promote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ waitId })
  });
  const data = await res.json();
  alert(data.message);
  loadWaitlist();
}

// ==================== 4. 출석부관리 (/af/ad_att/stat) ====================

async function loadAttendance() {
  try {
    const res = await fetch('/api/af/ad_att/stat');
    const data = await res.json();
    const tbody = document.getElementById('attendanceTbody');
    if (tbody && data.stats) {
      tbody.innerHTML = data.stats.map(s => `
        <tr>
          <td><strong>${s.courseTitle}</strong></td>
          <td>${s.teacherName}</td>
          <td>${s.enrolled}명</td>
          <td>${s.targetDays}일</td>
          <td>${s.attendedSum}명</td>
          <td>${s.absentSum}명</td>
          <td><strong style="color:#16a34a;">${s.attRate}</strong></td>
          <td style="text-align: center;"><span class="badge badge-OUTPUT">${s.stampStatus}</span></td>
          <td style="text-align: center;"><button class="btn btn-outline" style="padding:4px 8px; font-size:0.8rem;" onclick="alert('${s.courseTitle} 출석부 인쇄 미리보기가 열립니다.')"><i class="fa-solid fa-print"></i> 인쇄</button></td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadAttendance Error:', e); }
}

function batchStampAttendance() {
  alert('선택 강좌 출석부에 학교장 직인이 전자 날인되었습니다.');
  loadAttendance();
}

// ==================== 5. 환불/취소관리 (/af/ad_ref/lists) ====================

async function loadRefunds() {
  try {
    const res = await fetch('/api/af/ad_ref/lists');
    const data = await res.json();
    const tbody = document.getElementById('refundTbody');
    if (tbody && data.refunds) {
      tbody.innerHTML = data.refunds.map(r => `
        <tr>
          <td><strong>${r.studentName}</strong></td>
          <td>${r.gradeClass}</td>
          <td>${r.courseTitle}</td>
          <td>${r.fee.toLocaleString()}원</td>
          <td>${r.totalDays}시수</td>
          <td>${r.attendedDays}시수</td>
          <td>${r.rule}</td>
          <td style="color:#ef4444; font-weight:700;">${r.refundAmount.toLocaleString()}원</td>
          <td><span class="badge ${r.status === '환불완료' ? 'badge-OUTPUT' : 'badge-WAITING'}">${r.status}</span></td>
          <td>${r.requestedAt}</td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadRefunds Error:', e); }
}

// ==================== 6. 결석/귀가신청 (/af/ad_abs/lists) ====================

async function loadAbsences() {
  try {
    const res = await fetch('/api/af/ad_abs/lists');
    const data = await res.json();
    const tbody = document.getElementById('absenceTbody');
    if (tbody && data.absences) {
      tbody.innerHTML = data.absences.map(a => `
        <tr>
          <td><strong>${a.studentName}</strong></td>
          <td>${a.gradeClass}</td>
          <td>${a.parentPhone}</td>
          <td><span class="badge ${a.type === '결석' ? 'badge-CLOSED' : 'badge-WAITING'}">${a.type}</span></td>
          <td>${a.reason}</td>
          <td>${a.date}</td>
          <td>${a.returnCompanion}</td>
          <td><span class="badge ${a.status === '승인완료' ? 'badge-OUTPUT' : 'badge-WAITING'}">${a.status}</span></td>
          <td style="text-align: center;">
            ${a.status === '승인완료' ? '<span style="color:#16a34a; font-weight:600;"><i class="fa-solid fa-check"></i> 완료</span>' : `<button class="btn btn-primary" style="padding:4px 8px; font-size:0.8rem;" onclick="approveAbsence('${a.id}')">승인</button>`}
          </td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadAbsences Error:', e); }
}

async function approveAbsence(id) {
  const res = await fetch('/api/af/ad_abs/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status: '승인완료' })
  });
  const data = await res.json();
  alert(data.message);
  loadAbsences();
}

// ==================== 7. 강사관리 (/af/ad_tea/lists) ====================

async function loadTeachers() {
  try {
    const res = await fetch('/api/af/ad_tea/lists');
    const data = await res.json();
    const tbody = document.getElementById('teacherTbody');
    if (tbody && data.teachers) {
      tbody.innerHTML = data.teachers.map(t => `
        <tr>
          <td><code>${t.id}</code></td>
          <td><strong>${t.name}</strong></td>
          <td>${t.subject}</td>
          <td>${t.phone}</td>
          <td>${t.isMain ? '<span style="color:#16a34a; font-weight:600;">대표강사 (주계좌)</span>' : '보조강사'}</td>
          <td style="text-align: center;"><button class="btn btn-outline" style="padding:4px 8px; font-size:0.8rem;" onclick="alert('${t.name} 강사의 권한 설정 팝업이 열립니다.')"><i class="fa-solid fa-gear"></i> 권한</button></td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadTeachers Error:', e); }
}

// ==================== 8. 알림관리 (/af/notification/lists) ====================

async function loadNotifications() {
  try {
    const res = await fetch('/api/af/notification/lists');
    const data = await res.json();
    const tbody = document.getElementById('notificationTbody');
    if (tbody && data.notifications) {
      tbody.innerHTML = data.notifications.map(n => `
        <tr>
          <td><span class="badge badge-OUTPUT">${n.type}</span></td>
          <td><strong>${n.title}</strong></td>
          <td>${n.recipientCount}명</td>
          <td>${n.status}</td>
          <td>${n.sentAt}</td>
          <td>${n.sender}</td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadNotifications Error:', e); }
}

// ==================== 9. 푸시알림관리 (/af/spush/lists) ====================

async function loadPushNotifications() {
  try {
    const res = await fetch('/api/af/spush/lists');
    const data = await res.json();
    const tbody = document.getElementById('pushTbody');
    if (tbody && data.pushNotifications) {
      tbody.innerHTML = data.pushNotifications.map(p => `
        <tr>
          <td><strong>${p.title}</strong></td>
          <td>${p.body}</td>
          <td>${p.targetRole}</td>
          <td>${p.readCount}명 열람</td>
          <td>${p.sentAt}</td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadPushNotifications Error:', e); }
}

async function submitPushNotification(e) {
  e.preventDefault();
  const title = document.getElementById('pushTitle').value;
  const body = document.getElementById('pushBody').value;
  const res = await fetch('/api/af/spush/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body })
  });
  const data = await res.json();
  alert(data.message);
  loadPushNotifications();
}

// ==================== 10. 연장신청 (/af/ad_extension/lists) ====================

async function loadServiceExtensions() {
  try {
    const res = await fetch('/api/af/ad_extension/lists');
    const data = await res.json();
    const tbody = document.getElementById('extensionTbody');
    if (tbody && data.extensions) {
      tbody.innerHTML = data.extensions.map(x => `
        <tr>
          <td><strong>${x.serviceName}</strong></td>
          <td>${x.termName}</td>
          <td>${x.startDate}</td>
          <td>${x.endDate}</td>
          <td><span class="badge badge-OUTPUT">${x.status}</span></td>
          <td>${x.cost}</td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadServiceExtensions Error:', e); }
}

// ==================== 11. 학교관리 (/sczigi/service/lists) ====================

async function loadSchools() {
  try {
    const res = await fetch('/api/sczigi/service/lists');
    const data = await res.json();
    const tbody = document.getElementById('schoolTbody');
    if (tbody && data.schools) {
      tbody.innerHTML = data.schools.map(s => `
        <tr>
          <td><code>${s.code}</code></td>
          <td><strong>${s.name}</strong></td>
          <td><span class="badge badge-OUTPUT">${s.plan}</span></td>
          <td><span class="badge badge-OUTPUT">${s.status}</span></td>
          <td>${s.expireDate}</td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadSchools Error:', e); }
}

// ==================== 12. 지원금관리 (4개) ====================

async function loadSubsidyStudents() {
  try {
    const res = await fetch('/api/af/ad_free2_stu/lists');
    const data = await res.json();
    const tbody = document.getElementById('subsidyStuTbody');
    if (tbody && data.students) {
      tbody.innerHTML = data.students.map(s => `
        <tr>
          <td><strong>${s.studentName}</strong></td>
          <td>${s.gradeClass}</td>
          <td>${s.parentPhone}</td>
          <td>${s.rank}</td>
          <td>${s.annualBudget.toLocaleString()}원</td>
          <td>${s.usedAmount.toLocaleString()}원</td>
          <td><strong style="color:#16a34a;">${s.balance.toLocaleString()}원</strong></td>
          <td><span class="badge ${s.status === '지원가능' ? 'badge-OUTPUT' : 'badge-CLOSED'}">${s.status}</span></td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadSubsidyStudents Error:', e); }
}

async function loadSubsidyApplicants() {
  try {
    const res = await fetch('/api/af/ad_free2_app/lists');
    const data = await res.json();
    const tbody = document.getElementById('subsidyAppTbody');
    if (tbody && data.applicants) {
      tbody.innerHTML = data.applicants.map(a => `
        <tr>
          <td><strong>${a.studentName}</strong></td>
          <td>${a.courseTitle}</td>
          <td>${a.fee.toLocaleString()}원</td>
          <td style="color:#2563eb; font-weight:700;">-${a.subsidizedAmount.toLocaleString()}원</td>
          <td>${a.outOfPocket.toLocaleString()}원</td>
          <td>${a.deductionDate}</td>
          <td><span class="badge badge-OUTPUT">${a.subsidyType}</span></td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadSubsidyApplicants Error:', e); }
}

async function loadSubsidyRanks() {
  try {
    const res = await fetch('/api/af/ad_free2_cfg/free1');
    const data = await res.json();
    const tbody = document.getElementById('subsidyRankTbody');
    if (tbody && data.ranks) {
      tbody.innerHTML = data.ranks.map(r => `
        <tr>
          <td><strong style="color:var(--primary-color);">${r.rankNumber}순위</strong></td>
          <td><strong>${r.name}</strong></td>
          <td>${r.limitAmount.toLocaleString()}원</td>
          <td>${r.isPriority ? '<span class="badge badge-OUTPUT">우선배정</span>' : '일반'}</td>
          <td>${r.note}</td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadSubsidyRanks Error:', e); }
}

// ==================== 13. 설문관리 (2개) ====================

async function loadSurveys() {
  try {
    const res = await fetch('/api/af/ad_sur/lists');
    const data = await res.json();
    const tbody = document.getElementById('surveyTbody');
    if (tbody && data.surveys) {
      tbody.innerHTML = data.surveys.map(s => `
        <tr>
          <td><strong>${s.title}</strong></td>
          <td>${s.period}</td>
          <td>${s.targetCount}명</td>
          <td>${s.responseCount}명</td>
          <td><strong style="color:#16a34a;">${s.responseRate}</strong></td>
          <td><span class="badge ${s.status === '진행중' ? 'badge-OUTPUT' : 'badge-CLOSED'}">${s.status}</span></td>
          <td style="text-align: center;"><button class="btn btn-outline" style="padding:4px 8px; font-size:0.8rem;" onclick="alert('${s.title} 통계 보고서가 다운로드됩니다.')"><i class="fa-solid fa-chart-simple"></i> 보고서</button></td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadSurveys Error:', e); }
}

async function loadSampleSurveys() {
  try {
    const res = await fetch('/api/af/ad_surs/lists');
    const data = await res.json();
    const tbody = document.getElementById('sampleSurveyTbody');
    if (tbody && data.sampleSurveys) {
      tbody.innerHTML = data.sampleSurveys.map(s => `
        <tr>
          <td><span class="badge badge-OUTPUT">${s.category}</span></td>
          <td><strong>${s.title}</strong></td>
          <td>${s.questions}문항</td>
          <td style="text-align: center;"><button class="btn btn-primary" style="padding:4px 8px; font-size:0.8rem;" onclick="alert('템플릿이 신규 설문으로 복제되었습니다.')"><i class="fa-solid fa-copy"></i> 복제</button></td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadSampleSurveys Error:', e); }
}

// ==================== 14. 환경설정 ====================

async function loadPeriods() {
  try {
    const res = await fetch('/api/af/ad_cfg/period');
    const data = await res.json();
    const tbody = document.getElementById('periodTbody');
    if (tbody && data.periods) {
      tbody.innerHTML = data.periods.map(p => `
        <tr>
          <td><strong>${p.periodName}</strong></td>
          <td>${p.startTime}</td>
          <td>${p.endTime}</td>
          <td>${p.duration}</td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadPeriods Error:', e); }
}

async function loadAfDivisions() {
  try {
    const res = await fetch('/api/af/ad_cfg/afDiv');
    const data = await res.json();
    const tbody = document.getElementById('afDivTbody');
    if (tbody && data.divisions) {
      tbody.innerHTML = data.divisions.map(d => `
        <tr>
          <td><code>${d.code}</code></td>
          <td><strong>${d.name}</strong></td>
          <td>${d.period}</td>
          <td>${d.courseCount}개</td>
          <td>${d.isCurrent ? '<span class="badge badge-OUTPUT">현재 학기</span>' : '-'}</td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadAfDivisions Error:', e); }
}

async function loadApplyPeriods() {
  try {
    const res = await fetch('/api/af/ad_time/lists');
    const data = await res.json();
    const tbody = document.getElementById('applyPeriodTbody');
    if (tbody && data.periods) {
      tbody.innerHTML = data.periods.map(p => `
        <tr>
          <td><strong>${p.category}</strong></td>
          <td>${p.startAt}</td>
          <td>${p.endAt}</td>
          <td>${p.gradeTarget}</td>
          <td>${p.allowCancel ? '허용' : '차단'}</td>
          <td><span class="badge badge-OUTPUT">${p.status}</span></td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadApplyPeriods Error:', e); }
}

async function loadManagerInfo() {
  try {
    const res = await fetch('/api/af/ad_info/modify');
    const data = await res.json();
    if (data.info) {
      document.getElementById('infoSchoolName').value = data.info.schoolName || '운천초등학교';
      document.getElementById('infoManagerName').value = data.info.managerName || '';
      document.getElementById('infoManagerPhone').value = data.info.managerPhone || '';
      document.getElementById('infoOfficePhone').value = data.info.officePhone || '';
    }
  } catch (e) { console.error('loadManagerInfo Error:', e); }
}

async function saveManagerInfo(e) {
  e.preventDefault();
  const payload = {
    managerName: document.getElementById('infoManagerName').value.trim(),
    managerPhone: document.getElementById('infoManagerPhone').value.trim(),
    officePhone: document.getElementById('infoOfficePhone').value.trim()
  };
  const res = await fetch('/api/af/ad_info/modify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  alert(data.message || '저장되었습니다.');
}
// ==================== 15. 매뉴얼 & FAQ (/af/ad_faq/main) ====================

async function loadFaqList() {
  try {
    const res = await fetch('/api/manual/all');
    const data = await res.json();
    if (!data.success) return;

    // 1. Render Operations (1 ~ 23)
    const opContainer = document.getElementById('operationsListContainer');
    if (opContainer && data.operations) {
      opContainer.innerHTML = data.operations.map(op => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:9px 6px; border-bottom:1px solid #f1f5f9;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; background:#2563eb; color:#fff; border-radius:50%; font-weight:700; font-size:0.75rem;">${op.num}</span>
            <span style="font-weight:600; font-size:0.88rem; color:#1e293b;">${op.title}</span>
          </div>
          <div style="display:flex; gap:5px;">
            <button class="btn-db btn-db-blue" style="height:26px; padding:0 8px; font-size:0.75rem;" onclick="openDocViewer(${op.docId}, '${op.title}')"><i class="fa-solid fa-file-lines"></i> 문서</button>
            ${op.videoUrl ? `<button class="btn-db btn-db-coral" style="height:26px; padding:0 8px; font-size:0.75rem;" onclick="openVideoPlayer('${op.videoUrl}', '${op.title} 동영상 매뉴얼')"><i class="fa-solid fa-play"></i> 동영상</button>` : ''}
          </div>
        </div>
      `).join('');
    }

    // 2. Render Template Downloads
    const tplContainer = document.getElementById('templateDownloadsContainer');
    if (tplContainer && data.templates) {
      tplContainer.innerHTML = data.templates.map(t => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #f1f5f9;">
          <span style="font-weight:600; font-size:0.85rem; color:#334155;">${t.title}</span>
          <div style="display:flex; gap:4px;">
            ${t.types.map(tp => {
              if (tp.isVideo) {
                return `<button class="btn-db btn-db-coral" style="height:24px; padding:0 6px; font-size:0.72rem;" onclick="openVideoPlayer('${tp.url}', '${t.title}')"><i class="fa-solid fa-play"></i> ${tp.name}</button>`;
              }
              if (tp.url && tp.url.includes('/doc/')) {
                const docId = tp.url.split('/').pop();
                return `<button class="btn-db btn-db-blue" style="height:24px; padding:0 6px; font-size:0.72rem;" onclick="openDocViewer('${docId}', '${t.title}')"><i class="fa-solid fa-file-lines"></i> ${tp.name}</button>`;
              }
              return `<a href="${tp.url}" class="btn-db btn-db-green" style="height:24px; padding:0 6px; font-size:0.72rem; text-decoration:none; display:inline-flex; align-items:center;" download><i class="fa-solid fa-download"></i> ${tp.name}</a>`;
            }).join('')}
          </div>
        </div>
      `).join('');
    }

    // 3. Render Manual Downloads
    const manContainer = document.getElementById('manualDownloadsContainer');
    if (manContainer && data.manuals) {
      manContainer.innerHTML = data.manuals.map(m => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #f1f5f9; ${m.isHighlight ? 'background:#fffbeb; padding:8px 6px; border-radius:4px;' : ''}">
          <span style="font-weight:700; font-size:0.84rem; color:${m.isHighlight ? '#b45309' : '#334155'};">${m.title}</span>
          <div style="display:flex; gap:4px;">
            ${m.types.map(tp => {
              if (tp.isVideo) {
                return `<button class="btn-db btn-db-coral" style="height:24px; padding:0 6px; font-size:0.72rem;" onclick="openVideoPlayer('${tp.url}', '${m.title}')"><i class="fa-solid fa-play"></i> ${tp.name}</button>`;
              }
              const docId = tp.url.split('/').pop();
              return `<button class="btn-db btn-db-blue" style="height:24px; padding:0 6px; font-size:0.72rem;" onclick="openDocViewer('${docId}', '${m.title} (${tp.name})')"><i class="fa-solid fa-file-lines"></i> ${tp.name}</button>`;
            }).join('')}
          </div>
        </div>
      `).join('');
    }

    // 4. Render FAQs (Left & Right columns)
    const leftCol = document.getElementById('faqColLeft');
    const rightCol = document.getElementById('faqColRight');
    if (leftCol && rightCol && data.faqs) {
      const leftFaqs = data.faqs.filter(f => f.column === 'left');
      const rightFaqs = data.faqs.filter(f => f.column === 'right');

      const renderFaqSection = (cats) => cats.map(c => `
        <div style="border: 1px solid #cbd5e1; border-radius: 4px; overflow: hidden; background:#ffffff;">
          <div style="background:#f8fafc; padding:8px 12px; font-weight:700; font-size:0.88rem; color:#1e293b; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; gap:6px;">
            <i class="fa-solid fa-folder-open" style="color:#0284c7;"></i> ${c.category}
          </div>
          <table class="db-table" style="margin:0; border:none;">
            <tbody>
              ${c.items.map(item => `
                <tr>
                  <td style="font-size:0.83rem; color:#334155; font-weight:500;">${item.q}</td>
                  <td style="width:120px; text-align:right; white-space:nowrap;">
                    <button class="btn-db btn-db-blue" style="height:22px; padding:0 6px; font-size:0.7rem;" onclick="openDocViewer('${item.docId}', '${item.q}')"><i class="fa-solid fa-file-lines"></i> 문서</button>
                    ${item.videoUrl ? `<button class="btn-db btn-db-coral" style="height:22px; padding:0 6px; font-size:0.7rem;" onclick="openVideoPlayer('${item.videoUrl}', '${item.q}')"><i class="fa-solid fa-play"></i> 동영상</button>` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `).join('');

      leftCol.innerHTML = renderFaqSection(leftFaqs);
      rightCol.innerHTML = renderFaqSection(rightFaqs);
    }
  } catch (e) { console.error('loadFaqList Error:', e); }
}

function openVideoPlayer(url, title) {
  let embedUrl = url;
  if (url.includes('watch?v=')) {
    embedUrl = url.replace('watch?v=', 'embed/');
  }
  document.getElementById('manualVideoTitle').innerHTML = `<i class="fa-solid fa-play-circle" style="color:#ef4444;"></i> ${title || '동영상 매뉴얼'}`;
  document.getElementById('manualVideoIframe').src = embedUrl;
  document.getElementById('manualVideoModal').classList.add('show');
}

function closeVideoPlayer() {
  document.getElementById('manualVideoIframe').src = '';
  document.getElementById('manualVideoModal').classList.remove('show');
}

async function openDocViewer(docId, title) {
  try {
    const res = await fetch(`/api/manual/doc/${docId}`);
    const data = await res.json();
    const doc = data.doc || { title: title, content: '문서 내용을 불러오는 중입니다...' };
    
    document.getElementById('manualDocTitle').innerHTML = `<i class="fa-solid fa-file-lines" style="color:#2563eb;"></i> ${title || doc.title}`;
    const htmlContent = (doc.content || '')
      .replace(/^### (.*$)/gim, '<h3 style="color:#1e3a8a; margin: 16px 0 8px 0; font-size:1.1rem; border-bottom:2px solid #93c5fd; padding-bottom:4px;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="color:#1e293b; margin: 20px 0 10px 0; font-size:1.25rem;">$1</h2>')
      .replace(/^\- (.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 4px;">$1</li>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/`([^`]+)`/gim, '<code style="background:#f1f5f9; padding:2px 6px; border-radius:3px; color:#ef4444;">$1</code>')
      .replace(/\n/gim, '<br>');

    document.getElementById('manualDocContent').innerHTML = `
      <div style="background:#f8fafc; padding:12px 16px; border-radius:4px; border:1px solid #e2e8f0; margin-bottom:16px;">
        <strong style="color:#0284c7;"><i class="fa-solid fa-circle-info"></i> 요약:</strong> ${doc.summary || '공식 운영 매뉴얼 상세 표준 가이드라인입니다.'}
      </div>
      <div>${htmlContent}</div>
    `;
    document.getElementById('manualDocModal').classList.add('show');
  } catch (e) {
    console.error('openDocViewer Error:', e);
    alert('문서를 불러오지 못했습니다.');
  }
}

function closeDocViewer() {
  document.getElementById('manualDocModal').classList.remove('show');
}

function downloadManualZip() {
  window.location.href = '/api/manual/download/manual_af';
}

// ---------------- Chapter 3 Handlers (Copy, Batch, Stats, Fees) ----------------

function openCourseCopyModal(courseId, courseTitle) {
  document.getElementById('copySourceCourseId').value = courseId;
  document.getElementById('copyNewCourseTitle').value = `${courseTitle} (복사본)`;
  document.getElementById('courseCopyModal').classList.add('show');
}
function closeCourseCopyModal() { document.getElementById('courseCopyModal').classList.remove('show'); }

async function submitCourseCopy(e) {
  e.preventDefault();
  const courseId = document.getElementById('copySourceCourseId').value;
  const newTitle = document.getElementById('copyNewCourseTitle').value.trim();
  const targetCategory = document.getElementById('copyTargetCategorySelect').value;

  const res = await fetch('/api/af/ad_lec/copy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      schoolId: SCHOOL_SN,
      courseId,
      overrides: { title: newTitle, category: targetCategory }
    })
  });
  const data = await res.json();
  alert(data.message);
  closeCourseCopyModal();
  loadLectures();
}

function openBatchUploadModal() { document.getElementById('batchUploadModal').classList.add('show'); }
function closeBatchUploadModal() { document.getElementById('batchUploadModal').classList.remove('show'); }

function downloadSample23ColExcel() {
  const sampleHeader = "강좌명,늘봄과정,중복제한그룹,대상학과,강사아이디,강사중복불가,대상학년,강의시간,강의시간중복허용,정원,대기정원,운영기간,총시수,강의실,수강료,수용비,교재비,재료비,지원금차감제외(수강료),지원금차감제외(교재비),지원금차감제외(재료비),최대지원금액,내용\n" +
    "01. 창의로봇 A,방과후,,7차일반,teacher01,N,1,2,월:14:00~14:50,N,20,5,2026.03.01~2026.06.30,12,과학실,30000,6000,0,10000,자유수강권,,,10000,창의적인 로봇 조립 실습\n" +
    "02. 바이올린 B,방과후,,7차일반,teacher02,N,2,3,화:15:00~15:50,N,15,5,2026.03.01~2026.06.30,12,음악실,35000,7000,15000,0,,,,0,기초 바이올린 연주";

  const blob = new Blob([sampleHeader], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dbdbschool_course_batch_template_23cols.csv';
  a.click();
}

async function submitBatchUpload(e) {
  e.preventDefault();
  const text = document.getElementById('batchUploadTextarea').value.trim();
  if (!text) return alert('데이터를 입력해주세요.');

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return alert('유효한 데이터 행이 없습니다.');

  let startIndex = 0;
  if (lines[0].includes('강좌명') || lines[0].includes('늘봄과정')) {
    startIndex = 1;
  }

  const rows = [];
  for (let i = startIndex; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim());
    if (cols.length >= 1 && cols[0]) {
      rows.push({
        title: cols[0],
        neulbomType: cols[1] || '방과후',
        groupLimit: cols[2] || '',
        department: cols[3] || '',
        teacherId: cols[4] || 'inst_1',
        noSameTeacher: cols[5] || 'N',
        grade: cols[6] || '1,2,3',
        schedule: cols[7] || '월:14:00~14:50',
        allowTimeConflict: cols[8] || 'N',
        capacity: cols[9] || 20,
        waitingCapacity: cols[10] || 5,
        period: cols[11] || '2026-03-01~2026-06-30',
        totalHours: cols[12] || 12,
        classroom: cols[13] || '방과후 교실',
        fee: cols[14] || 30000,
        costFacility: cols[15] || 6000,
        textbookFee: cols[16] || 0,
        materialFee: cols[17] || 10000,
        subsidyExcludeTuition: cols[18] || '',
        maxSubsidyAmount: cols[21] || 0,
        description: cols[22] || ''
      });
    }
  }

  const res = await fetch('/api/af/ad_lec/batch-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schoolId: SCHOOL_SN, rows })
  });
  const data = await res.json();
  alert(data.message);
  closeBatchUploadModal();
  loadLectures();
}

async function applyFacilityFeeToStudents() {
  const cat = document.getElementById('categoryFilter') ? document.getElementById('categoryFilter').value : '전체';
  if (!confirm(`'${cat}' 구분의 강좌 수용비를 전체 신청자에게 일괄 적용하시겠습니까?`)) return;

  const res = await fetch('/api/af/ad_lec/apply-facility-fee', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schoolId: SCHOOL_SN, category: cat })
  });
  const data = await res.json();
  alert(data.message);
}

async function batchToggleTeacherLock(lockState) {
  const ids = getSelectedIds();
  const res = await fetch('/api/af/ad_lec/batch-teacher-lock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      schoolId: SCHOOL_SN,
      courseIds: ids.length > 0 ? ids : 'ALL',
      lockState
    })
  });
  const data = await res.json();
  alert(data.message);
  loadLectures();
}

async function exportToNeis() {
  const cat = document.getElementById('categoryFilter') ? document.getElementById('categoryFilter').value : '전체';
  const res = await fetch(`/api/af/ad_lec/export-neis?schoolId=${SCHOOL_SN}&category=${encodeURIComponent(cat)}`);
  const data = await res.json();
  if (data.rows) {
    let csv = "강좌코드,강좌명,강사명,대상학년,수강인원,수강료총액,강사료,수용비,교재비,재료비,총시수,운영기간\n";
    data.rows.forEach(r => {
      csv += `${r.courseCode},"${r.courseName}","${r.instructorName}",${r.targetGrade},${r.enrolledCount},${r.tuitionTotal},${r.costInstructor},${r.costFacility},${r.textbookFee},${r.materialFee},${r.totalHours},"${r.period}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neis_afterschool_tuition_${SCHOOL_SN}.csv`;
    a.click();
  }
}

async function exportEdufine() {
  const cat = document.getElementById('categoryFilter') ? document.getElementById('categoryFilter').value : '전체';
  const res = await fetch(`/api/af/ad_lec/export-edufine?schoolId=${SCHOOL_SN}&category=${encodeURIComponent(cat)}`);
  const data = await res.json();
  if (data.rows) {
    let csv = "운영구분,강좌명,강사명,수강인원,수강료단가,총징수액,강사료지급액(80%),수용비세입액(20%),교재재료비총액\n";
    data.rows.forEach(r => {
      csv += `"${r.category}","${r.courseName}","${r.instructorName}",${r.applied},${r.unitTuition},${r.totalCollected},${r.totalInstructorPay},${r.totalFacilityIncome},${r.totalMaterialIncome}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edufine_accounting_settle_${SCHOOL_SN}.csv`;
    a.click();
  }
}

function calcFeesLive() {
  const fee = parseInt(document.getElementById('addTuitionFee').value) || 0;
  let facility = parseInt(document.getElementById('addCostFacility').value);
  if (isNaN(facility)) facility = Math.round(fee * 0.2);
  const instructor = fee - facility;
  document.getElementById('addCostInstructor').value = instructor >= 0 ? instructor : 0;
}

// ---------------- Generic UI and Utility Handlers ----------------

function toggleSubmenu(anchorEl) {
  const parentLi = anchorEl.parentElement;
  if (!parentLi) return;
  const isOpen = parentLi.classList.contains('open');
  document.querySelectorAll('.sidebar-menu li.has-submenu').forEach(li => {
    if (li !== parentLi) li.classList.remove('open');
  });
  if (isOpen) parentLi.classList.remove('open');
  else parentLi.classList.add('open');
}

function toggleSelectAll(master) {
  document.querySelectorAll('.lec-checkbox').forEach(cb => cb.checked = master.checked);
}

function getSelectedIds() {
  return Array.from(document.querySelectorAll('.lec-checkbox:checked')).map(cb => cb.value);
}

async function changeSelectedStatus(targetStatus) {
  const ids = getSelectedIds();
  if (ids.length === 0) return alert('강좌를 선택해 주세요.');
  const res = await fetch('/api/af/ad_lec/status', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schoolId: SCHOOL_SN, courseIds: ids, status: targetStatus })
  });
  const data = await res.json();
  alert(data.message);
  loadLectures();
}

async function toggleInstructorClose(courseId) {
  await fetch('/api/af/ad_lec/instructor-close', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schoolId: SCHOOL_SN, courseId })
  });
  loadLectures();
}

async function runLottery(courseId) {
  const res = await fetch('/api/af/ad_lec/lottery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schoolId: SCHOOL_SN, courseId })
  });
  const data = await res.json();
  alert(data.message || '추첨이 진행되었습니다.');
  loadLectures();
}

// ==================== 6대 강좌관리 모달 완전 연동 로직 (01~09) ====================

// 1. 강좌 등록 (01_강좌등록)
function openAddModal() {
  window.location.href = '/af/ad_lec/write/sn/' + SCHOOL_SN;
}
function closeAddModal() {
  const modal = document.getElementById('addModal');
  if (modal) modal.style.display = 'none';
}

function toggleAllGradeCheck(type, master) {
  const chks = document.querySelectorAll(`.grade-chk-${type}`);
  chks.forEach(c => c.checked = master.checked);
  updateGradeHidden(type);
}

function updateGradeHidden(type) {
  const chks = Array.from(document.querySelectorAll(`.grade-chk-${type}:checked`)).map(c => c.value);
  const target = document.getElementById(type === 'add' ? 'addTargetGrade' : 'editTargetGrade');
  if (target) target.value = chks.join(',');
}

async function submitAddCourse(e) {
  e.preventDefault();
  updateGradeHidden('add');
  const fee = parseInt(document.getElementById('addTuitionFee').value) || 0;
  const costFacility = parseInt(document.getElementById('addCostFacility').value) || 0;

  const payload = {
    schoolId: SCHOOL_SN,
    category: document.getElementById('addCategory').value,
    neulbomType: document.getElementById('addNeulbomType').value,
    title: document.getElementById('addTitle').value.trim(),
    instructor: document.getElementById('addInstructor').value.trim(),
    targetGrade: document.getElementById('addTargetGrade').value || '1,2,3',
    capacity: parseInt(document.getElementById('addCapacity').value) || 20,
    waitingCapacity: parseInt(document.getElementById('addWaitingCapacity').value) || 3,
    totalHours: parseInt(document.getElementById('addTotalHours').value) || 12,
    period: `${document.getElementById('addSdate').value}~${document.getElementById('addEdate').value}`,
    tuitionFee: fee,
    fee: fee,
    costFacility: costFacility,
    costInstructor: fee - costFacility,
    textbookFee: parseInt(document.getElementById('addTextbookFee').value) || 0,
    materialFee: parseInt(document.getElementById('addMaterialFee').value) || 0,
    classroom: document.getElementById('addClassroom').value.trim(),
    dayOfWeek: document.getElementById('addDayOfWeek').value.trim(),
    scheduleTime: document.getElementById('addScheduleTime').value.trim(),
    allowTimeConflict: document.getElementById('addAllowConflict').checked,
    status: 'OUTPUT',
    feeReceipt: 'Y',
    teacherClosed: 'N',
    teacherEditable: 'Y'
  };

  try {
    const res = await fetch('/api/af/ad_lec/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    alert(data.message || '강좌가 성공적으로 등록되었습니다.');
    closeAddModal();
    loadLectures();
  } catch (err) {
    alert('강좌 등록 중 오류가 발생했습니다.');
  }
}

// 2. 강좌 일괄입력 모달 (02_강좌_일괄입력)
function openBatchUploadModal() {
  const modal = document.getElementById('batchUploadModal');
  if (modal) {
    modal.style.display = 'flex';
    initBatchUploadRows();
  }
}
function closeBatchUploadModal() {
  const modal = document.getElementById('batchUploadModal');
  if (modal) modal.style.display = 'none';
}

function initBatchUploadRows() {
  const tbody = document.getElementById('batchUploadTbody');
  if (!tbody) return;
  tbody.innerHTML = `
    <tr>
      <td>1</td>
      <td><select class="bu-neulbom" style="font-size:11px;"><option value="방과후">방과후</option><option value="맞춤형">맞춤형</option><option value="돌봄">돌봄</option></select></td>
      <td><input type="text" class="bu-title" placeholder="강좌명 (예: 바둑 1부)" style="width:100%; padding:2px 4px; font-size:11px;"></td>
      <td><input type="text" class="bu-inst" placeholder="강사명" style="width:100%; padding:2px 4px; font-size:11px;"></td>
      <td><input type="text" class="bu-grade" value="1,2,3" style="width:100%; padding:2px 4px; font-size:11px; text-align:center;"></td>
      <td><input type="text" class="bu-day" value="월,수" style="width:100%; padding:2px 4px; font-size:11px; text-align:center;"></td>
      <td><input type="text" class="bu-time" value="14:00~14:50" style="width:100%; padding:2px 4px; font-size:11px; text-align:center;"></td>
      <td><input type="number" class="bu-cap" value="20" style="width:100%; padding:2px 4px; font-size:11px; text-align:center;"></td>
      <td><input type="number" class="bu-fee" value="35000" style="width:100%; padding:2px 4px; font-size:11px; text-align:right;"></td>
      <td><a href="javascript:void(0)" onclick="this.closest('tr').remove()" style="color:#d9534f;"><i class="fa-regular fa-trash-can"></i></a></td>
    </tr>
    <tr>
      <td>2</td>
      <td><select class="bu-neulbom" style="font-size:11px;"><option value="맞춤형">맞춤형</option><option value="방과후">방과후</option><option value="돌봄">돌봄</option></select></td>
      <td><input type="text" class="bu-title" placeholder="강좌명 (예: 놀이체육)" style="width:100%; padding:2px 4px; font-size:11px;"></td>
      <td><input type="text" class="bu-inst" placeholder="강사명" style="width:100%; padding:2px 4px; font-size:11px;"></td>
      <td><input type="text" class="bu-grade" value="1,2" style="width:100%; padding:2px 4px; font-size:11px; text-align:center;"></td>
      <td><input type="text" class="bu-day" value="화,목" style="width:100%; padding:2px 4px; font-size:11px; text-align:center;"></td>
      <td><input type="text" class="bu-time" value="13:20~14:10" style="width:100%; padding:2px 4px; font-size:11px; text-align:center;"></td>
      <td><input type="number" class="bu-cap" value="20" style="width:100%; padding:2px 4px; font-size:11px; text-align:center;"></td>
      <td><input type="number" class="bu-fee" value="0" style="width:100%; padding:2px 4px; font-size:11px; text-align:right;"></td>
      <td><a href="javascript:void(0)" onclick="this.closest('tr').remove()" style="color:#d9534f;"><i class="fa-regular fa-trash-can"></i></a></td>
    </tr>
  `;
}

function addBatchUploadRow() {
  const tbody = document.getElementById('batchUploadTbody');
  if (!tbody) return;
  const count = tbody.querySelectorAll('tr').length + 1;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${count}</td>
    <td><select class="bu-neulbom" style="font-size:11px;"><option value="방과후">방과후</option><option value="맞춤형">맞춤형</option><option value="돌봄">돌봄</option></select></td>
    <td><input type="text" class="bu-title" placeholder="강좌명" style="width:100%; padding:2px 4px; font-size:11px;"></td>
    <td><input type="text" class="bu-inst" placeholder="강사명" style="width:100%; padding:2px 4px; font-size:11px;"></td>
    <td><input type="text" class="bu-grade" value="1,2,3" style="width:100%; padding:2px 4px; font-size:11px; text-align:center;"></td>
    <td><input type="text" class="bu-day" value="월" style="width:100%; padding:2px 4px; font-size:11px; text-align:center;"></td>
    <td><input type="text" class="bu-time" value="14:00~14:50" style="width:100%; padding:2px 4px; font-size:11px; text-align:center;"></td>
    <td><input type="number" class="bu-cap" value="20" style="width:100%; padding:2px 4px; font-size:11px; text-align:center;"></td>
    <td><input type="number" class="bu-fee" value="35000" style="width:100%; padding:2px 4px; font-size:11px; text-align:right;"></td>
    <td><a href="javascript:void(0)" onclick="this.closest('tr').remove()" style="color:#d9534f;"><i class="fa-regular fa-trash-can"></i></a></td>
  `;
  tbody.appendChild(tr);
}

function downloadLectureTemplate() {
  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
    '강좌구분,늘봄과정,강좌명,강사명,대상학년,요일,시간,정원,수강료\n' +
    '26년 9월,방과후,창의로봇 1부,최정호,"1,2,3","월,수",15:00~15:50,20,40000\n' +
    '26년 9월,맞춤형,놀이체육,김강사,"1,2","화,목",13:20~14:10,20,0\n' +
    '26년 9월,돌봄,(월)돌봄 1부,돌봄전담사,"1,2,3",월,14:00~14:50,20,0\n';
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', '강좌_일괄입력_표준서식.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function executeBatchUpload() {
  const category = document.getElementById('batchUploadCategory').value;
  const rows = document.querySelectorAll('#batchUploadTbody tr');
  let addedCount = 0;

  for (const r of rows) {
    const title = r.querySelector('.bu-title') ? r.querySelector('.bu-title').value.trim() : '';
    if (!title) continue;
    const neulbomType = r.querySelector('.bu-neulbom') ? r.querySelector('.bu-neulbom').value : '방과후';
    const instructor = r.querySelector('.bu-inst') ? r.querySelector('.bu-inst').value.trim() : '강사';
    const grade = r.querySelector('.bu-grade') ? r.querySelector('.bu-grade').value.trim() : '1,2,3';
    const day = r.querySelector('.bu-day') ? r.querySelector('.bu-day').value.trim() : '월';
    const time = r.querySelector('.bu-time') ? r.querySelector('.bu-time').value.trim() : '14:00~14:50';
    const cap = parseInt(r.querySelector('.bu-cap').value) || 20;
    const fee = parseInt(r.querySelector('.bu-fee').value) || 0;

    const payload = {
      schoolId: SCHOOL_SN,
      category: category,
      neulbomType: neulbomType,
      title: title,
      instructor: instructor,
      targetGrade: grade,
      capacity: cap,
      waitingCapacity: 3,
      dayOfWeek: day,
      scheduleTime: time,
      tuitionFee: fee,
      fee: fee,
      status: 'OUTPUT',
      feeReceipt: 'Y',
      period: '2026-09-01~2026-09-30'
    };

    await fetch('/api/af/ad_lec/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    addedCount++;
  }

  alert(`총 ${addedCount}개 강좌가 성공적으로 일괄 등록되었습니다.`);
  closeBatchUploadModal();
  loadLectures();
}

// 3. 강좌 일괄수정 모달 (03_강좌_일괄수정)
function openBatchEditModal() {
  const modal = document.getElementById('batchEditModal');
  if (!modal) return;
  modal.style.display = 'flex';
  
  const tbody = document.getElementById('bulkEditTbody');
  if (tbody) {
    const list = cachedLectures || [];
    tbody.innerHTML = list.map((lec, idx) => `
      <tr>
        <td><input type="checkbox" class="bulk-edit-chk" value="${lec.id}" onchange="updateBulkEditCount()"></td>
        <td>${list.length - idx}</td>
        <td>${lec.category || ''}</td>
        <td style="text-align:left; padding-left:8px;"><strong>${lec.title}</strong></td>
        <td>${lec.instructor || '돌봄전담사'}</td>
        <td>${lec.capacity || 20}</td>
        <td>${(lec.tuitionFee || 0).toLocaleString()}원</td>
        <td><span class="badge badge-success" style="background:#d9534f; color:#fff; font-size:10px; padding:1px 4px; border-radius:2px;">${lec.status === 'CLOSED' ? '종료' : '출력'}</span></td>
      </tr>
    `).join('');
    updateBulkEditCount();
  }
}
function closeBatchEditModal() {
  const modal = document.getElementById('batchEditModal');
  if (modal) modal.style.display = 'none';
}

function toggleBulkEditSelectAll(master) {
  const chks = document.querySelectorAll('.bulk-edit-chk');
  chks.forEach(c => c.checked = master.checked);
  updateBulkEditCount();
}

function updateBulkEditCount() {
  const count = document.querySelectorAll('.bulk-edit-chk:checked').length;
  const countEl = document.getElementById('bulkEditSelectedCount');
  if (countEl) countEl.innerText = count;
}

async function executeBatchEdit() {
  const checkedBoxes = Array.from(document.querySelectorAll('.bulk-edit-chk:checked')).map(c => c.value);
  if (checkedBoxes.length === 0) {
    alert('일괄 수정할 대상 강좌를 1개 이상 선택해 주세요.');
    return;
  }

  const updates = {};
  if (document.getElementById('chkEditCategory').checked) {
    updates.category = document.getElementById('bulkEditCategoryVal').value;
  }
  if (document.getElementById('chkEditDate').checked) {
    updates.period = `${document.getElementById('bulkEditSdate').value}~${document.getElementById('bulkEditEdate').value}`;
  }
  if (document.getElementById('chkEditInstructor').checked) {
    updates.instructor = document.getElementById('bulkEditInstructorVal').value.trim();
    updates.teacherName = updates.instructor;
  }
  if (document.getElementById('chkEditCapacity').checked) {
    updates.capacity = parseInt(document.getElementById('bulkEditCapacityVal').value) || 20;
    updates.waitingCapacity = parseInt(document.getElementById('bulkEditWaitVal').value) || 3;
  }
  if (document.getElementById('chkEditTuition').checked) {
    const fee = parseInt(document.getElementById('bulkEditTuitionVal').value) || 0;
    updates.tuitionFee = fee;
    updates.fee = fee;
  }
  if (document.getElementById('chkEditStatus').checked) {
    updates.status = document.getElementById('bulkEditStatusVal').value;
  }

  if (Object.keys(updates).length === 0) {
    alert('수정할 항목의 체크박스를 1개 이상 켜고 값을 입력해 주세요.');
    return;
  }

  try {
    const res = await fetch('/api/af/ad_lec/bulk-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseIds: checkedBoxes, updates })
    });
    const data = await res.json();
    alert(data.message || `${checkedBoxes.length}개 강좌가 일괄 수정되었습니다.`);
    closeBatchEditModal();
    loadLectures();
  } catch (err) {
    alert('일괄 수정 처리 중 오류가 발생했습니다.');
  }
}

// 4. 강좌 일괄복사 모달 (04_강좌_일괄복사)
function openBatchCopyModal() {
  const modal = document.getElementById('batchCopyModal');
  if (!modal) return;
  modal.style.display = 'flex';
  
  const tbody = document.getElementById('batchCopyTbody');
  if (tbody) {
    const list = cachedLectures || [];
    tbody.innerHTML = list.map((lec, idx) => `
      <tr>
        <td><input type="checkbox" class="batch-copy-chk" value="${lec.id}" checked></td>
        <td>${list.length - idx}</td>
        <td>${lec.category || ''}</td>
        <td style="text-align:left; padding-left:8px;"><strong>${lec.title}</strong></td>
        <td>${lec.instructor || '돌봄전담사'}</td>
        <td>${lec.capacity || 20}</td>
        <td>${(lec.tuitionFee || 0).toLocaleString()}원</td>
      </tr>
    `).join('');
  }
}
function closeBatchCopyModal() {
  const modal = document.getElementById('batchCopyModal');
  if (modal) modal.style.display = 'none';
}

function toggleBatchCopySelectAll(master) {
  const chks = document.querySelectorAll('.batch-copy-chk');
  chks.forEach(c => c.checked = master.checked);
}

async function executeBatchCopySubmit() {
  const targetCategory = document.getElementById('copyTargetCategory').value;
  const checkedBoxes = Array.from(document.querySelectorAll('.batch-copy-chk:checked')).map(c => c.value);
  if (checkedBoxes.length === 0) {
    alert('복사할 강좌를 1개 이상 선택해 주세요.');
    return;
  }

  let copiedCount = 0;
  for (const id of checkedBoxes) {
    const orig = cachedLectures.find(c => c.id === id);
    if (!orig) continue;
    const newCourse = {
      ...orig,
      id: 'lec_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      code: String(Date.now()).slice(-7),
      category: targetCategory,
      applied: 0,
      enrolledCount: 0,
      waiting: 0,
      waitingCount: 0
    };
    await fetch('/api/af/ad_lec/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourse)
    });
    copiedCount++;
  }

  alert(`총 ${copiedCount}개 강좌가 [${targetCategory}]으로 일괄 복사되었습니다.`);
  closeBatchCopyModal();
  loadLectures();
}

// 5. 강좌 통계 모달 (05_강좌_통계)
async function openLectureStatsModal() {
  const modal = document.getElementById('lecStatsModal');
  if (!modal) return;
  modal.style.display = 'flex';

  try {
    const res = await fetch('/api/af/ad_lec/stats');
    const data = await res.json();
    const tbody = document.getElementById('lecStatsTbody');
    if (tbody && data.stats) {
      tbody.innerHTML = data.stats.map(st => `
        <tr style="height:32px; border-bottom:1px solid #eee;">
          <td style="font-weight:bold; background:#f8fafc;">${st.category}</td>
          <td>${st.outputCount}</td>
          <td>${st.waitingCount}</td>
          <td>${st.closedCount}</td>
          <td style="font-weight:bold; color:#1e40af;">${st.total}</td>
          <td>${st.totalCapacity}명</td>
          <td style="color:#059669; font-weight:bold;">${st.totalApplied}명</td>
          <td>0명</td>
          <td>${st.totalCapacity > 0 ? Math.round((st.totalApplied / st.totalCapacity) * 100) : 0}%</td>
          <td><span style="color:#16a34a; font-weight:bold;">출력 (${st.total})</span></td>
          <td><span style="color:#d9534f;">-</span></td>
        </tr>
      `).join('');
    }
  } catch (e) {
    console.error('Stats load error:', e);
  }
}
function closeLecStatsModal() {
  const modal = document.getElementById('lecStatsModal');
  if (modal) modal.style.display = 'none';
}

// 6. 강좌 단건 상세 수정 모달 (09_강좌_상세수정화면)
function openEditModal(courseId) {
  const course = cachedLectures.find(c => c.id === courseId || c.code === courseId);
  if (!course) return;

  const modal = document.getElementById('editCourseModal');
  if (!modal) return;

  document.getElementById('editCourseId').value = course.id;
  document.getElementById('editCategory').value = course.category || '26년 9월';
  document.getElementById('editNeulbomType').value = course.neulbomType || '방과후';
  document.getElementById('editTitle').value = course.title || '';
  document.getElementById('editInstructor').value = course.instructor || course.teacherName || '';
  document.getElementById('editClassroom').value = course.classroom || course.location || '';
  document.getElementById('editDayOfWeek').value = course.dayOfWeek || '금';
  document.getElementById('editScheduleTime').value = course.scheduleTime || '14:00~14:50';
  document.getElementById('editTotalHours').value = course.totalHours || 12;
  document.getElementById('editCapacity').value = course.capacity || 20;
  document.getElementById('editWaitingCapacity').value = course.waitingCapacity || 3;
  
  const periodParts = (course.period || '2026-09-01~2026-09-30').split('~');
  document.getElementById('editSdate').value = periodParts[0] || '2026-09-01';
  document.getElementById('editEdate').value = periodParts[1] || '2026-09-30';

  document.getElementById('editTuitionFee').value = course.tuitionFee || 0;
  document.getElementById('editStatus').value = course.status || 'OUTPUT';
  document.getElementById('editTextbookFee').value = course.textbookFee || 0;
  document.getElementById('editMaterialFee').value = course.materialFee || 0;
  document.getElementById('editAllowConflict').checked = !!course.allowTimeConflict;

  // Grade Checkboxes
  const grades = (course.targetGrade || '1,2,3').split(',');
  document.querySelectorAll('.grade-chk-edit').forEach(chk => {
    chk.checked = grades.includes(chk.value);
  });
  updateGradeHidden('edit');

  modal.style.display = 'flex';
}
function closeEditCourseModal() {
  const modal = document.getElementById('editCourseModal');
  if (modal) modal.style.display = 'none';
}

async function submitEditCourse(e) {
  e.preventDefault();
  updateGradeHidden('edit');
  const courseId = document.getElementById('editCourseId').value;
  const fee = parseInt(document.getElementById('editTuitionFee').value) || 0;

  const payload = {
    category: document.getElementById('editCategory').value,
    neulbomType: document.getElementById('editNeulbomType').value,
    title: document.getElementById('editTitle').value.trim(),
    instructor: document.getElementById('editInstructor').value.trim(),
    teacherName: document.getElementById('editInstructor').value.trim(),
    targetGrade: document.getElementById('editTargetGrade').value || '1,2,3',
    capacity: parseInt(document.getElementById('editCapacity').value) || 20,
    waitingCapacity: parseInt(document.getElementById('editWaitingCapacity').value) || 3,
    totalHours: parseInt(document.getElementById('editTotalHours').value) || 12,
    period: `${document.getElementById('editSdate').value}~${document.getElementById('editEdate').value}`,
    tuitionFee: fee,
    fee: fee,
    textbookFee: parseInt(document.getElementById('editTextbookFee').value) || 0,
    materialFee: parseInt(document.getElementById('editMaterialFee').value) || 0,
    classroom: document.getElementById('editClassroom').value.trim(),
    dayOfWeek: document.getElementById('editDayOfWeek').value.trim(),
    scheduleTime: document.getElementById('editScheduleTime').value.trim(),
    allowTimeConflict: document.getElementById('editAllowConflict').checked,
    status: document.getElementById('editStatus').value
  };

  try {
    const res = await fetch(`/api/af/ad_lec/update/${courseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    alert(data.message || '강좌 정보가 성공적으로 수정되었습니다.');
    closeEditCourseModal();
    loadLectures();
  } catch (err) {
    alert('강좌 수정 중 오류가 발생했습니다.');
  }
}

async function deleteCurrentEditCourse() {
  const courseId = document.getElementById('editCourseId').value;
  const courseTitle = document.getElementById('editTitle').value;
  if (!confirm(`[${courseTitle}] 강좌를 정말 삭제하시겠습니까?`)) return;

  try {
    const res = await fetch(`/api/af/ad_lec/delete/${courseId}`, { method: 'DELETE' });
    const data = await res.json();
    alert(data.message || '강좌가 삭제되었습니다.');
    closeEditCourseModal();
    loadLectures();
  } catch (err) {
    alert('삭제 처리 중 오류가 발생했습니다.');
  }
}

async function loadFaqList() {
  try {
    const res = await fetch(`/api/af/ad_faq/main`);
    const data = await res.json();
    const container = document.getElementById('faqAccordionContainer');
    if (container && data.faqs) {
      container.innerHTML = data.faqs.map(faq => `
        <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 10px; padding: 14px;">
          <h4 style="margin: 0 0 6px 0; color: var(--primary-color); cursor: pointer;"><i class="fa-solid fa-circle-question"></i> [${faq.category}] ${faq.question}</h4>
          <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">${faq.answer}</p>
        </div>
      `).join('');
    }
  } catch (e) { console.error('loadFaqList Error:', e); }
}

function exportToExcel() {
  alert('📊 Excel (.xlsx) 보고서 파일이 다운로드되었습니다.');
}

function saveBasicSettings(e) {
  e.preventDefault();
  alert('기본 설정이 성공적으로 저장되었습니다.');
}

function loadInstructorBanking() {
  alert('동일 강사 ID 기준 스쿨뱅킹 묶음 징수 집계 조회가 완료되었습니다.');
}

async function loadRestrictionGroups() {
  try {
    const res = await fetch('/api/manual/restriction-groups');
    const data = await res.json();
    const tbody = document.getElementById('restrGroupTbody');
    if (tbody && data.groups) {
      tbody.innerHTML = data.groups.map(g => `
        <tr>
          <td><code>${g.code}</code></td>
          <td><strong>${g.name}</strong></td>
          <td>${g.description}</td>
          <td style="text-align: center;"><span class="badge badge-OUTPUT">3개 강좌</span></td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadRestrictionGroups error', e); }
}

async function loadNoticeSettings() {
  try {
    const res = await fetch('/api/manual/notice-settings');
    const data = await res.json();
    if (data.settings) {
      const top = document.getElementById('noticeLoginTop');
      if (top) top.value = data.settings.loginTopText || '';
      const bot = document.getElementById('noticeLoginBottom');
      if (bot) bot.value = data.settings.loginBottomText || '';
      const app = document.getElementById('noticeApplyGuide');
      if (app) app.value = data.settings.applyGuideText || '';
      const att = document.getElementById('noticeAttendanceFooter');
      if (att) att.value = data.settings.attendanceFooterText || '';
    }
  } catch (e) { console.error('loadNoticeSettings error', e); }
}

async function saveNoticeSettings(e) {
  e.preventDefault();
  const payload = {
    loginTopText: document.getElementById('noticeLoginTop').value.trim(),
    loginBottomText: document.getElementById('noticeLoginBottom').value.trim(),
    applyGuideText: document.getElementById('noticeApplyGuide').value.trim(),
    attendanceFooterText: document.getElementById('noticeAttendanceFooter').value.trim()
  };
  const res = await fetch('/api/manual/notice-settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  alert(data.message || '안내글 설정이 저장되었습니다.');
}

// Window Bindings for Global Access
window.switchSubmodelView = switchSubmodelView;
window.toggleSubmenu = toggleSubmenu;
window.loadLectures = loadLectures;
window.loadApplicants = loadApplicants;
window.loadWaitlist = loadWaitlist;
window.loadAttendance = loadAttendance;
window.loadRefunds = loadRefunds;
window.loadAbsences = loadAbsences;
window.loadTeachers = loadTeachers;
window.loadNotifications = loadNotifications;
window.loadPushNotifications = loadPushNotifications;
window.loadServiceExtensions = loadServiceExtensions;
window.loadSchools = loadSchools;
window.loadSubsidyStudents = loadSubsidyStudents;
window.loadSubsidyApplicants = loadSubsidyApplicants;
window.loadSubsidyRanks = loadSubsidyRanks;
window.loadSurveys = loadSurveys;
window.loadSampleSurveys = loadSampleSurveys;
window.loadPeriods = loadPeriods;
window.loadAfDivisions = loadAfDivisions;
window.loadApplyPeriods = loadApplyPeriods;
window.loadManagerInfo = loadManagerInfo;
window.saveManagerInfo = saveManagerInfo;
window.loadRestrictionGroups = loadRestrictionGroups;
window.loadNoticeSettings = loadNoticeSettings;
window.saveNoticeSettings = saveNoticeSettings;
window.loadQaList = loadQaList;
window.loadFaqList = loadFaqList;
window.loadInstructorBanking = loadInstructorBanking;
window.saveBasicSettings = saveBasicSettings;
window.toggleSelectAll = toggleSelectAll;
window.toggleSelectAllApps = toggleSelectAllApps;
window.changeSelectedStatus = changeSelectedStatus;
window.toggleInstructorClose = toggleInstructorClose;
window.runLottery = runLottery;
window.openAddModal = openAddModal;
window.closeAddModal = closeAddModal;
window.openBatchCopyModal = openBatchCopyModal;
window.closeBatchCopyModal = closeBatchCopyModal;
window.openCourseCopyModal = openCourseCopyModal;
window.closeCourseCopyModal = closeCourseCopyModal;
window.submitCourseCopy = submitCourseCopy;
window.openBatchUploadModal = openBatchUploadModal;
window.closeBatchUploadModal = closeBatchUploadModal;
window.submitBatchUpload = submitBatchUpload;
window.downloadSample23ColExcel = downloadSample23ColExcel;
window.applyFacilityFeeToStudents = applyFacilityFeeToStudents;
window.batchToggleTeacherLock = batchToggleTeacherLock;
window.exportToNeis = exportToNeis;
window.exportEdufine = exportEdufine;
window.calcFeesLive = calcFeesLive;
window.submitAddCourse = submitAddCourse;
window.submitBatchCopy = submitBatchCopy;
function switchRole(role) {
  if (role === 'teacher') {
    window.location.href = '/dashboard/teacher_dashboard.html';
  } else if (role === 'parent') {
    window.location.href = '/parent/index.html';
  } else {
    window.location.href = '/af/ad_lec/lists/sn';
  }
}

function openSafetyModal() {
  const name = prompt('학생 이름을 입력하세요:', '김도하');
  const type = prompt('신청 구분 (결석/귀가):', '귀가');
  const reason = prompt('사유:', '병원 진료로 인한 조기 귀가');
  if (name && type) {
    alert(`[${type}] ${name} 학생의 신청 건이 정상 등록되었습니다.`);
    loadAbsences();
  }
}

window.switchRole = switchRole;
window.openSafetyModal = openSafetyModal;
window.openVideoPlayer = openVideoPlayer;
window.closeVideoPlayer = closeVideoPlayer;
window.openDocViewer = openDocViewer;
window.closeDocViewer = closeDocViewer;
window.downloadManualZip = downloadManualZip;
window.approveSelectedStudent = approveSelectedStudent;
window.cancelSelectedStudent = cancelSelectedStudent;
window.approveApplicant = approveApplicant;
window.promoteWaitStudent = promoteWaitStudent;
window.batchStampAttendance = batchStampAttendance;
window.approveAbsence = approveAbsence;
window.submitPushNotification = submitPushNotification;
window.exportToExcel = exportToExcel;

// ==================== 14. 매뉴얼 & FAQ (/af/ad_faq/main) ====================

const FAQ_PROCEDURES = [
  { num: 1,  title: '학교홈페이지 배너 등록',     doc: 'https://www.dbdbschool.kr/help/go_data/num/239/data/link2' },
  { num: 2,  title: '학생 이용 동의서 받기',       doc: 'https://www.dbdbschool.kr/help/go_data/num/182/data/link2' },
  { num: 3,  title: '가정통신문 발송',             doc: 'https://www.dbdbschool.kr/help/go_data/num/183/data/link2' },
  { num: 4,  title: '학생등록',                   doc: 'https://www.dbdbschool.kr/help/go_data/num/71/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/71/data/link1' },
  { num: 5,  title: '강사등록',                   doc: 'https://www.dbdbschool.kr/help/go_data/num/185/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/72/data/link1' },
  { num: 6,  title: '환경설정',                   doc: 'https://www.dbdbschool.kr/help/go_data/num/73/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/73/data/link1' },
  { num: 7,  title: '강좌등록',                   doc: 'https://www.dbdbschool.kr/help/go_data/num/74/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/74/data/link1' },
  { num: 8,  title: '수강신청 기간 설정',          doc: 'https://www.dbdbschool.kr/help/go_data/num/75/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/75/data/link1' },
  { num: 9,  title: '수강신청 테스트',             doc: 'https://www.dbdbschool.kr/help/go_data/num/76/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/76/data/link1' },
  { num: 10, title: '대기자 관리',                 doc: 'https://www.dbdbschool.kr/help/go_data/num/77/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/77/data/link1' },
  { num: 11, title: '추첨하기',                   doc: 'https://www.dbdbschool.kr/help/go_data/num/78/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/78/data/link1' },
  { num: 12, title: '신청결과 조회',               doc: 'https://www.dbdbschool.kr/help/go_data/num/186/data/link2' },
  { num: 13, title: '출석부 관리',                 doc: 'https://www.dbdbschool.kr/help/go_data/num/237/data/link2' },
  { num: 14, title: '수강료 산출',                 doc: 'https://www.dbdbschool.kr/help/go_data/num/80/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/80/data/link1' },
  { num: 15, title: '강사마감',                   doc: 'https://www.dbdbschool.kr/help/go_data/num/81/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/81/data/link1' },
  { num: 16, title: '지원금 관리',                 doc: 'https://www.dbdbschool.kr/help/go_data/num/255/data/link2' },
  { num: 17, title: '자유수강권자 관리',            doc: 'https://www.dbdbschool.kr/help/go_data/num/187/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/82/data/link1' },
  { num: 18, title: '스쿨뱅킹 파일 다운로드',       doc: 'https://www.dbdbschool.kr/help/go_data/num/84/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/84/data/link1' },
  { num: 19, title: '다음달 수강신청 준비',         doc: 'https://www.dbdbschool.kr/help/go_data/num/188/data/link2' },
  { num: 20, title: '환불자 관리',                 doc: 'https://www.dbdbschool.kr/help/go_data/num/85/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/85/data/link1' },
  { num: 21, title: '데이터 백업 및 초기화',        doc: 'https://www.dbdbschool.kr/help/go_data/num/190/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/86/data/link1' },
  { num: 22, title: '설문조사 가정통신문',          doc: 'https://www.dbdbschool.kr/help/go_data/num/191/data/link2' },
  { num: 23, title: '설문조사 관리',               doc: 'https://www.dbdbschool.kr/help/go_data/num/45/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/45/data/link1' },
];

const FAQ_TEMPLATES = [
  {
    title: '배너 / 팝업 이미지',
    links: [
      { label: '배너 문서', href: 'https://www.dbdbschool.kr/help/go_data/num/177/data/link2', type: 'doc' },
      { label: '팝업 이미지 문서', href: 'https://www.dbdbschool.kr/help/go_data/num/178/data/link2', type: 'doc' }
    ]
  },
  {
    title: '학생 수강신청 안내 동영상',
    links: [
      { label: '동영상', href: 'https://www.dbdbschool.kr/help/go_data/num/88/data/link1', type: 'video' },
      { label: '다운로드', href: 'https://www.dbdbschool.kr/help/go_data/num/168/data/link2', type: 'down' }
    ]
  },
  {
    title: '모바일 앱 이용 방법',
    links: [
      { label: '문서', href: 'https://www.dbdbschool.kr/help/go_data/num/181/data/link2', type: 'doc' }
    ]
  }
];

const FAQ_MANUALS = [
  {
    title: '관리자 수강신청 관리 매뉴얼',
    links: [{ label: '문서', href: 'https://www.dbdbschool.kr/help/go_data/num/161/data/link2', type: 'doc' }]
  },
  {
    title: '강사 매뉴얼',
    links: [
      { label: '동영상', href: 'https://www.dbdbschool.kr/help/go_data/num/101/data/link1', type: 'video' },
      { label: '초등학교 문서', href: 'https://www.dbdbschool.kr/help/go_data/num/162/data/link2', type: 'doc' },
      { label: '중·고등학교 문서', href: 'https://www.dbdbschool.kr/help/go_data/num/163/data/link2', type: 'doc' }
    ]
  },
  {
    title: '담임 매뉴얼',
    links: [{ label: '문서', href: 'https://www.dbdbschool.kr/help/go_data/num/166/data/link2', type: 'doc' }]
  },
  {
    title: '수강신청 전 필수 점검사항',
    links: [{ label: '문서', href: 'https://www.dbdbschool.kr/help/go_data/num/164/data/link2', type: 'doc' }]
  },
  {
    title: '★ 월별 마감 및 다음 달 수강신청 준비 절차 ★',
    isHighlight: true,
    links: [{ label: '문서', href: 'https://www.dbdbschool.kr/help/go_data/num/165/data/link2', type: 'doc' }]
  }
];

const FAQ_CATEGORIES = [
  {
    category: '학생관리',
    items: [
      { title: '학생 비밀번호를 초기화하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/89/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/89/data/link1' },
      { title: '로그인 화면에 번호가 다 출력되지 않아요', doc: 'https://www.dbdbschool.kr/help/go_data/num/154/data/link2' },
      { title: '학생 진급 처리는 어떻게 하나요?', doc: 'https://www.dbdbschool.kr/help/go_data/num/61/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/90/data/link1' },
      { title: '1학년 학적이 나오지 않아 가학적으로 받고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/62/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/62/data/link1' },
      { title: '학생 학적이 중간에 변경되었는데 어떻게 반영하나요?', doc: 'https://www.dbdbschool.kr/help/go_data/num/134/data/link2' },
      { title: '학생 학적을 일괄변경하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/135/data/link2' },
      { title: '다자녀 기능은 어떻게 활용하나요?', doc: 'https://www.dbdbschool.kr/help/go_data/num/155/data/link2' },
      { title: '학생 성별 일괄 업데이트 방법', doc: 'https://www.dbdbschool.kr/help/go_data/num/156/data/link2' }
    ]
  },
  {
    category: '교직원관리',
    items: [
      { title: '추가로 서비스 관리자를 지정하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/70/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/70/data/link1' }
    ]
  },
  {
    category: '강사관리',
    items: [
      { title: '강사권한 설정(수강생 등록, 삭제, 수강료 입력)', doc: 'https://www.dbdbschool.kr/help/go_data/num/150/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/95/data/link1' },
      { title: '강사에게 강좌 등록 권한을 주고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/146/data/link2' },
      { title: '강사에게 전체 강좌 조회 권한을 주고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/149/data/link2' },
      { title: '강사가 바뀌었어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/148/data/link2' },
      { title: '강사 모바일 출결 문자 발송 기능 이용 안내', doc: 'https://www.dbdbschool.kr/help/go_data/num/151/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/151/data/link1' }
    ]
  },
  {
    category: '강좌관리',
    items: [
      { title: '강좌 일괄 입력', doc: 'https://www.dbdbschool.kr/help/go_data/num/92/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/92/data/link1' },
      { title: '강좌 일괄 수정 - 엑셀로 강좌 정보를 일괄수정하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/138/data/link2' },
      { title: '강좌 일괄 삭제 - 강좌를 한꺼번에 지우고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/158/data/link2' },
      { title: '강좌 통계 기능 - 강좌 마감 상태 확인을 위한 강좌통계 기능 활용하기', doc: 'https://www.dbdbschool.kr/help/go_data/num/93/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/93/data/link1' },
      { title: '강좌 상태 “출력, 종료, 대기” 이해하기', doc: 'https://www.dbdbschool.kr/help/go_data/num/159/data/link2' },
      { title: '정확한 강의시간 중복 체크 방법', doc: 'https://s3-ap-northeast-2.amazonaws.com/www.dbdbschool.kr/doc/faq/after/%EA%B0%95%EC%A2%8C%EA%B4%80%EB%A6%AC_06_%EC%8B%9C%EA%B0%84%EC%A4%91%EB%B3%B5%20%EC%B2%B4%ED%81%AC.hwp' },
      { title: '수강료를 강사료와 수용비로 나눠 관리하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/44/data/link2' }
    ]
  },
  {
    category: '신청자 관리',
    items: [
      { title: '수강신청 테스트 - 수강신청에 문제가 없는지 테스트 하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/76/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/96/data/link1' },
      { title: '신청자 관리 등록 / 신청자를 미리 입력해 놓고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/171/data/link2' },
      { title: '신청자 관리 삭제 / 특정 강좌의 신청자를 모두 삭제하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/172/data/link2' },
      { title: '신청자 관리 이동 / 신청자를 다른 강좌로 옮기고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/174/data/link2' },
      { title: '신청자 관리 복사 / 신청자를 다른 강좌로 복사하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/175/data/link2' },
      { title: '신청자 통계 - 방과후학교를 수강한 학생수(단수)를 어디에서 확인하나요?', doc: 'https://www.dbdbschool.kr/help/go_data/num/58/data/link2' },
      { title: '학생화면에 이전 강좌구분을 출력하지 않게하는 방법', doc: 'https://www.dbdbschool.kr/help/go_data/num/176/data/link2' }
    ]
  },
  {
    category: '자유수강권자 관리',
    items: [
      { title: '자유수강권자를 추가하고 개별 처리하는 방법', doc: 'https://www.dbdbschool.kr/help/go_data/num/94/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/94/data/link1' },
      { title: '자유수강권자를 환불하고 개별 처리하는 방법', doc: 'https://www.dbdbschool.kr/help/go_data/num/192/data/link2' },
      { title: '학생 자유수강권 잔액 조회 기능 활성화', doc: 'https://www.dbdbschool.kr/help/go_data/num/193/data/link2' }
    ]
  },
  {
    category: '스쿨뱅킹 & 나이스',
    items: [
      { title: '에듀파인 감면자(자유수강권자) 일괄입력 파일 다운로드', doc: 'https://www.dbdbschool.kr/help/go_data/num/169/data/link2' },
      { title: '에듀파인 개인부담금반환 입력용 파일 다운로드', doc: 'https://www.dbdbschool.kr/help/go_data/num/170/data/link2' },
      { title: '분기 접수, 월별 징수 처리 방법', doc: 'https://www.dbdbschool.kr/help/go_data/num/126/data/link2' },
      { title: '나이스 방과후학교 프로그램 수강생, 수강료 일괄입력 파일 다운로드', doc: 'https://www.dbdbschool.kr/help/go_data/num/97/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/97/data/link1' }
    ]
  },
  {
    category: '환경설정',
    items: [
      { title: '학생 최대 신청 강좌수를 제한할 수 있나요?', doc: 'https://www.dbdbschool.kr/help/go_data/num/194/data/link2' },
      { title: '안내글 설정', doc: 'https://www.dbdbschool.kr/help/go_data/num/100/data/link2' }
    ]
  },
  {
    category: '알림관리',
    items: [
      { title: '알림 관리', doc: 'https://www.dbdbschool.kr/help/go_data/num/195/data/link2' }
    ]
  },
  {
    category: '모바일앱',
    items: [
      { title: '모바일 푸시 알림은 어떻게 등록하나요?', doc: 'https://www.dbdbschool.kr/help/go_data/num/167/data/link2' }
    ]
  },
  {
    category: '계약',
    items: [
      { title: '계약을 연장하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/160/data/link2' }
    ]
  },
  {
    category: '설문관리',
    items: [
      { title: '설문 참여율을 높이는 설문참여 안내 문자 발송하는 법', doc: 'https://www.dbdbschool.kr/help/go_data/num/47/data/link2' }
    ]
  }
];

function makeBadge(type, href, label) {
  if (type === 'doc') {
    return `<a href="${href}" target="_blank" rel="noreferrer" style="display:inline-flex;align-items:center;gap:3px;padding:2px 7px;background:#2563eb;color:#fff;border-radius:3px;font-size:0.72rem;font-weight:700;text-decoration:none;transition:background 0.15s;" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'"><i class="fa-solid fa-file-lines"></i> ${label || '문서'}</a>`;
  }
  if (type === 'video') {
    return `<a href="${href}" target="_blank" rel="noreferrer" style="display:inline-flex;align-items:center;gap:3px;padding:2px 7px;background:#ef4444;color:#fff;border-radius:3px;font-size:0.72rem;font-weight:700;text-decoration:none;transition:background 0.15s;" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'"><i class="fa-brands fa-youtube"></i> ${label || '동영상'}</a>`;
  }
  return `<a href="${href}" target="_blank" rel="noreferrer" style="display:inline-flex;align-items:center;gap:3px;padding:2px 7px;background:#16a34a;color:#fff;border-radius:3px;font-size:0.72rem;font-weight:700;text-decoration:none;transition:background 0.15s;" onmouseover="this.style.background='#15803d'" onmouseout="this.style.background='#16a34a'"><i class="fa-solid fa-download"></i> ${label || '다운로드'}</a>`;
}

function loadFaqList() {
  // 1. 수강신청 운영 절차 (1 ~ 23)
  const opsContainer = document.getElementById('operationsListContainer');
  if (opsContainer) {
    opsContainer.innerHTML = FAQ_PROCEDURES.map(item => {
      let badges = '';
      if (item.doc) badges += makeBadge('doc', item.doc, '문서') + ' ';
      if (item.video) badges += makeBadge('video', item.video, '동영상');
      return `<div style="display:flex;align-items:center;justify-content:space-between;padding:4.5px 2px;border-bottom:1px solid #f8fafc;font-size:0.82rem;">
        <div style="display:flex;align-items:center;gap:6px;min-width:0;padding-right:6px;">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:19px;height:19px;background:#2563eb;color:#fff;border-radius:50%;font-size:0.68rem;font-weight:700;flex-shrink:0;">${item.num}</span>
          <span style="color:#1e293b;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(item.title)}</span>
        </div>
        <div style="display:flex;gap:3px;flex-shrink:0;">${badges}</div>
      </div>`;
    }).join('');
  }

  // 2. 양식 다운로드
  const tmplContainer = document.getElementById('templateDownloadsContainer');
  if (tmplContainer) {
    tmplContainer.innerHTML = FAQ_TEMPLATES.map(item => {
      const badges = item.links.map(lk => makeBadge(lk.type, lk.href, lk.label)).join(' ');
      return `<div style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:0.85rem;">
        <div style="font-weight:600;color:#1e293b;margin-bottom:5px;">${escHtml(item.title)}</div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;">${badges}</div>
      </div>`;
    }).join('');
  }

  // 3. 매뉴얼 다운로드
  const manContainer = document.getElementById('manualDownloadsContainer');
  if (manContainer) {
    manContainer.innerHTML = FAQ_MANUALS.map(item => {
      const badges = item.links.map(lk => makeBadge(lk.type, lk.href, lk.label)).join(' ');
      const titleColor = item.isHighlight ? '#dc2626' : '#1e293b';
      return `<div style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:0.85rem;">
        <div style="font-weight:600;color:${titleColor};margin-bottom:5px;">${escHtml(item.title)}</div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;">${badges}</div>
      </div>`;
    }).join('');
  }

  // 4. FAQ 카테고리 그리드 (좌/우 2열 분할)
  const leftCol = document.getElementById('faqColLeft');
  const rightCol = document.getElementById('faqColRight');
  if (leftCol && rightCol) {
    const half = Math.ceil(FAQ_CATEGORIES.length / 2);
    const renderCats = (cats) => cats.map(cat => {
      const rows = cat.items.map(item => {
        let badges = '';
        if (item.doc) badges += makeBadge('doc', item.doc, '문서') + ' ';
        if (item.video) badges += makeBadge('video', item.video, '동영상');
        return `<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f8fafc;font-size:0.82rem;">
          <span style="color:#334155;line-height:1.4;padding-right:8px;">${escHtml(item.title)}</span>
          <div style="display:flex;gap:4px;flex-shrink:0;">${badges}</div>
        </div>`;
      }).join('');

      return `<div style="border:1px solid #e2e8f0;border-radius:6px;background:#fff;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.03);">
        <div style="background:#f8fafc;padding:9px 12px;font-weight:700;color:#1e293b;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;gap:6px;font-size:0.88rem;">
          <span style="display:inline-block;width:3px;height:14px;background:#2563eb;border-radius:2px;"></span>
          ${escHtml(cat.category)}
          <span style="font-size:0.75rem;font-weight:400;color:#64748b;">(${cat.items.length})</span>
        </div>
        <div style="padding:4px 12px;">${rows}</div>
      </div>`;
    }).join('');

    leftCol.innerHTML = renderCats(FAQ_CATEGORIES.slice(0, half));
    rightCol.innerHTML = renderCats(FAQ_CATEGORIES.slice(half));
  }
}

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

window.loadFaqList = loadFaqList;

let QA_MOCK_DATA = [
  {
    id: 2,
    title: '2026학년도 1학기 늘봄학교 만족도 조사 설문지',
    author: '김혜련',
    hp1: '010',
    hp2: '2494',
    hp3: '1479',
    phone: '010-2494-1479',
    tel: '062-609-1182',
    email: 'khh147979@naver.com',
    createdAt: '2026-06-01',
    status: '완료',
    answerDate: '06/01',
    content: '2026학년도 바뀐 설문지 보내드립니다.\n감사합니다.',
    answerContent: '자료 올려 주셔서 감사합니다.\n4가지 샘플 설문에 등록해드렸습니다.\n확인 바랍니다.',
    fileName: '2026학년도1학기늘봄학교만족도조사설문지.hwp'
  },
  {
    id: 1,
    title: '지원금 스쿨뱅킹 현황',
    author: '관리자',
    hp1: '010',
    hp2: '1234',
    hp3: '5678',
    phone: '010-1234-5678',
    tel: '062-609-1180',
    email: 'admin@school.go.kr',
    createdAt: '2025-06-13',
    status: '완료',
    answerDate: '06/13',
    content: '지원금 스쿨뱅킹 이체 현황 및 자동 차감 설정 관련 문의입니다.',
    answerContent: '안녕하세요. 지원금 스쿨뱅킹 처리 내역 조회가 완료되었습니다.'
  }
];

let activeQaId = null;

async function loadQaList() {
  const tbody = document.getElementById('qaTbody');
  if (!tbody) return;

  try {
    const res = await fetch(`/api/af/qanda/lists?schoolId=${encodeURIComponent(SCHOOL_SN)}`);
    const data = await res.json();
    if (data && data.qnas) {
      QA_MOCK_DATA = data.qnas;
    }
  } catch (err) {
    console.warn('Using local QA fallback:', err);
  }

  const statusFilter = document.getElementById('qaStatusFilter') ? document.getElementById('qaStatusFilter').value : 'all';
  const searchType = document.getElementById('qaSearchType') ? document.getElementById('qaSearchType').value : 'sub_con';
  const keyword = document.getElementById('qaSearchKeyword') ? document.getElementById('qaSearchKeyword').value.trim().toLowerCase() : '';

  const filtered = QA_MOCK_DATA.filter(item => {
    let matchStatus = true;
    if (statusFilter !== 'all' && statusFilter !== '=진행상태=') {
      if (statusFilter === '2' || statusFilter === '완료') matchStatus = item.status === '완료';
      else if (statusFilter === '0' || statusFilter === '접수' || statusFilter === '대기') matchStatus = (item.status === '접수' || item.status === '대기');
      else if (statusFilter === '1' || statusFilter === '처리중') matchStatus = item.status === '처리중';
    }

    if (!keyword) return matchStatus;

    let matchKeyword = false;
    if (searchType === 'subject') matchKeyword = item.title.toLowerCase().includes(keyword);
    else if (searchType === 'contents') matchKeyword = (item.content || '').toLowerCase().includes(keyword);
    else if (searchType === 'author') matchKeyword = (item.author || '').toLowerCase().includes(keyword);
    else matchKeyword = item.title.toLowerCase().includes(keyword) || (item.content || '').toLowerCase().includes(keyword);

    return matchStatus && matchKeyword;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="padding:40px; text-align:center; color:#999;">등록된 문의사항이 없습니다.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    let statusDisplay = item.status || '접수';
    let statusColor = '#e67e22'; // orange for 접수/대기
    if (statusDisplay === '완료') statusColor = '#16a34a'; // green for 완료
    else if (statusDisplay === '처리중') statusColor = '#2563eb'; // blue for 처리중

    return `
      <tr style="border-bottom:1px solid #eeeeee; cursor:pointer;" onclick="openQaDetailModal(${item.id})">
        <td style="padding:10px; color:#555;">${item.id}</td>
        <td style="padding:10px; text-align:left; color:#333; font-weight:bold;">${escHtml(item.title)}</td>
        <td style="padding:10px; color:#666;">${item.createdAt}</td>
        <td style="padding:10px; color:${statusColor}; font-weight:bold;">${statusDisplay}</td>
        <td style="padding:10px; color:#666;">${item.answerDate || '-'}</td>
      </tr>
    `;
  }).join('');
}

function filterQaList() {
  loadQaList();
}

function resetQaFilter() {
  if (document.getElementById('qaStatusFilter')) document.getElementById('qaStatusFilter').value = 'all';
  if (document.getElementById('qaSearchType')) document.getElementById('qaSearchType').value = 'sub_con';
  if (document.getElementById('qaSearchKeyword')) document.getElementById('qaSearchKeyword').value = '';
  loadQaList();
}

function openQaWriteModal() {
  const modal = document.getElementById('qaWriteModal');
  if (modal) modal.style.display = 'flex';
}

function closeQaWriteModal() {
  const modal = document.getElementById('qaWriteModal');
  if (modal) modal.style.display = 'none';
}

async function submitQaWrite(e) {
  if (e) e.preventDefault();
  const author = document.getElementById('qaNewAuthor')?.value || '김혜련';
  const hp1 = document.getElementById('qaNewHp1')?.value || '010';
  const hp2 = document.getElementById('qaNewHp2')?.value || '2494';
  const hp3 = document.getElementById('qaNewHp3')?.value || '1479';
  const tel = document.getElementById('qaNewPhone')?.value || '062-609-1182';
  const email = document.getElementById('qaNewEmail')?.value || 'khh147979@naver.com';
  const subject = document.getElementById('qaNewSubject')?.value || '';
  const contents = document.getElementById('qaNewContents')?.value || '';
  const fileInput = document.getElementById('qaNewFile');
  const fileName = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0].name : '';

  if (!subject.trim()) {
    alert('제목을 입력해 주세요.');
    return;
  }

  const nextId = Math.max(...QA_MOCK_DATA.map(q => q.id), 0) + 1;
  const now = new Date();
  const createdAt = now.toISOString().split('T')[0];

  const newItem = {
    id: nextId,
    title: subject.trim(),
    author,
    hp1,
    hp2,
    hp3,
    phone: `${hp1}-${hp2}-${hp3}`,
    tel,
    email,
    createdAt,
    status: '접수',
    answerDate: null,
    content: contents,
    fileName: fileName || undefined
  };

  try {
    await fetch('/api/af/qanda/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: subject.trim(),
        author,
        hp1,
        hp2,
        hp3,
        tel,
        email,
        content: contents,
        fileName: fileName || undefined,
        schoolId: SCHOOL_SN,
        schoolName: '광주풍향초등학교'
      })
    });
  } catch (err) {
    console.error('API sync error:', err);
  }

  QA_MOCK_DATA.unshift(newItem);
  closeQaWriteModal();
  loadQaList();
  alert('문의사항이 성공적으로 등록되었습니다. (진행상태: 접수)');
}

function openQaDetailModal(id) {
  const item = QA_MOCK_DATA.find(q => q.id === id);
  if (!item) return;

  activeQaId = id;
  const modal = document.getElementById('qaDetailModal');
  if (!modal) return;

  document.getElementById('qaDetailId').value = item.id;
  document.getElementById('qaDetailAuthor').innerText = item.author || '김혜련';
  document.getElementById('qaDetailPhone').innerText = item.phone || '010-2494-1479';
  if (document.getElementById('qaDetailTel')) document.getElementById('qaDetailTel').innerText = item.tel || '062-609-1182';
  document.getElementById('qaDetailEmail').innerText = item.email || 'khh147979@naver.com';
  document.getElementById('qaDetailSubject').innerText = item.title;
  document.getElementById('qaDetailContents').innerText = item.content || item.title;
  if (document.getElementById('qaDetailDate')) document.getElementById('qaDetailDate').innerText = item.createdAt || '';

  const curStatus = item.status || '접수';
  const isDone = curStatus === '완료';
  const isProcessing = curStatus === '처리중';

  const statusEl = document.getElementById('qaDetailStatus');
  if (statusEl) {
    statusEl.innerText = curStatus;
    statusEl.style.color = isDone ? '#16a34a' : (isProcessing ? '#2563eb' : '#e67e22');
    statusEl.style.fontWeight = 'bold';
  }

  const fileRow = document.getElementById('qaDetailFileRow');
  const fileCell = document.getElementById('qaDetailFiles');
  if (item.fileName) {
    if (fileRow) fileRow.style.display = '';
    if (fileCell) fileCell.innerHTML = `<a href="#" onclick="alert('[다운로드] ${escHtml(item.fileName)}'); return false;" style="color:#2563eb; text-decoration:underline;">📎 ${escHtml(item.fileName)}</a>`;
  } else {
    if (fileRow) fileRow.style.display = 'none';
  }

  const readOnlyBox = document.getElementById('qaAnswerReadOnlyBox');
  const answerStatusBadge = document.getElementById('qaAnswerStatusBadge');
  const answerContentDisplay = document.getElementById('qaAnswerContentDisplay');

  if (item.answerContent && isDone) {
    if (readOnlyBox) {
      readOnlyBox.style.display = 'block';
      readOnlyBox.style.background = '#f0fdf4';
      readOnlyBox.style.borderColor = '#bbf7d0';
    }
    if (answerStatusBadge) {
      answerStatusBadge.innerText = '진행상태: 완료';
      answerStatusBadge.style.background = '#16a34a';
    }
    if (answerContentDisplay) {
      answerContentDisplay.innerText = item.answerContent;
    }
  } else if (isProcessing) {
    if (readOnlyBox) {
      readOnlyBox.style.display = 'block';
      readOnlyBox.style.background = '#eff6ff';
      readOnlyBox.style.borderColor = '#bfdbfe';
    }
    if (answerStatusBadge) {
      answerStatusBadge.innerText = '진행상태: 처리중';
      answerStatusBadge.style.background = '#2563eb';
    }
    if (answerContentDisplay) {
      answerContentDisplay.innerText = item.answerContent || '최고 관리자가 문의사항을 확인하여 처리 중입니다.';
    }
  } else {
    if (readOnlyBox) {
      readOnlyBox.style.display = 'block';
      readOnlyBox.style.background = '#fffbeb';
      readOnlyBox.style.borderColor = '#fef3c7';
    }
    if (answerStatusBadge) {
      answerStatusBadge.innerText = '진행상태: 접수';
      answerStatusBadge.style.background = '#e67e22';
    }
    if (answerContentDisplay) {
      answerContentDisplay.innerHTML = '<span style="color:#94a3b8; font-style:italic;">최고 관리자가 문의를 확인하고 답변을 준비 중입니다.</span>';
    }
  }

  modal.style.display = 'flex';
}

function closeQaDetailModal() {
  const modal = document.getElementById('qaDetailModal');
  if (modal) modal.style.display = 'none';
  activeQaId = null;
}

function saveQaReply() {
  if (!activeQaId) return;
  const item = QA_MOCK_DATA.find(q => q.id === activeQaId);
  if (!item) return;

  const replyText = document.getElementById('qaReplyTextarea')?.value || '';
  const replyStatusSelect = document.getElementById('qaReplyStatusSelect')?.value || '2';
  
  let statusStr = '완료';
  if (replyStatusSelect === '0') statusStr = '접수';
  else if (replyStatusSelect === '1') statusStr = '처리중';

  item.answerContent = replyText;
  item.status = statusStr;
  item.answerDate = `${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getDate()).padStart(2, '0')}`;

  closeQaDetailModal();
  loadQaList();
  alert('답변이 성공적으로 저장되었습니다.');
}

function deleteCurrentQaItem() {
  if (!activeQaId) return;
  if (confirm('해당 문의글을 삭제하시겠습니까?')) {
    QA_MOCK_DATA = QA_MOCK_DATA.filter(q => q.id !== activeQaId);
    closeQaDetailModal();
    loadQaList();
    alert('문의글이 삭제되었습니다.');
  }
}

window.loadQaList = loadQaList;
window.filterQaList = filterQaList;
window.resetQaFilter = resetQaFilter;
window.openQaWriteModal = openQaWriteModal;
window.closeQaWriteModal = closeQaWriteModal;
window.submitQaWrite = submitQaWrite;
window.openQaDetailModal = openQaDetailModal;
window.closeQaDetailModal = closeQaDetailModal;
window.saveQaReply = saveQaReply;
window.deleteCurrentQaItem = deleteCurrentQaItem;

function openAfAdminInfoModal() {
  const modal = document.getElementById('afAdminInfoModal');
  if (modal) modal.style.display = 'flex';
}

function closeAfAdminInfoModal() {
  const modal = document.getElementById('afAdminInfoModal');
  if (modal) modal.style.display = 'none';
}

function handleAfAdminInfoSave(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('afAdminInfoName')?.value || '박진수';
  closeAfAdminInfoModal();
  alert('관리자(' + name + ') 정보가 성공적으로 수정되었습니다.');
}

function handleAfUserLogout(e) {
  if (e) e.preventDefault();
  if (confirm('로그아웃 하시겠습니까?')) {
    window.location.href = '/af/ad_lec/lists/sn/3267';
  }
}

function openEditModal(courseId) {
  openAddModal();
  // Fetch course info if needed and populate
  const cat = document.getElementById('categoryFilter') ? document.getElementById('categoryFilter').value : '26년 8월';
  fetch(`/api/af/ad_lec/lists/sn/${SCHOOL_SN}?category=${encodeURIComponent(cat)}`)
    .then(r => r.json())
    .then(data => {
      if (data.lectures) {
        const found = data.lectures.find(l => l.id === courseId || String(l.code) === String(courseId));
        if (found) {
          if (document.getElementById('addTitle')) document.getElementById('addTitle').value = found.title;
          if (document.getElementById('addInstructor')) document.getElementById('addInstructor').value = found.instructor;
          if (document.getElementById('addCategory')) document.getElementById('addCategory').value = found.category;
          if (document.getElementById('addTuitionFee')) document.getElementById('addTuitionFee').value = found.tuitionFee;
          if (document.getElementById('addCapacity')) document.getElementById('addCapacity').value = found.capacity;
        }
      }
    });
}

function deleteCourse(courseId, title) {
  if (confirm(`'${title || '선택한 강좌'}'를 정말 삭제하시겠습니까?`)) {
    fetch('/api/af/ad_lec/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolId: SCHOOL_SN, courseId, status: 'CLOSED' })
    })
      .then(r => r.json())
      .then(data => {
        alert(data.message || '강좌가 삭제되었습니다.');
        loadLectures();
      });
  }
}

window.openAfAdminInfoModal = openAfAdminInfoModal;
window.closeAfAdminInfoModal = closeAfAdminInfoModal;
window.handleAfAdminInfoSave = handleAfAdminInfoSave;
window.handleAfUserLogout = handleAfUserLogout;
window.openEditModal = openEditModal;
window.deleteCourse = deleteCourse;

// ==================== 강좌등록 패널 인터랙션 ====================
function toggleAllPanelGrade(master) {
  const isChecked = master.checked;
  document.querySelectorAll('.p-grade-chk').forEach(chk => chk.checked = isChecked);
}

function chkPanelLecPay(obj) {
  const filterNum = (str) => (!str ? '0' : ('' + str).replace(/[^0-9]/g, '') || '0');
  const commaSplit = (num) => (parseInt(num, 10) || 0).toLocaleString();

  const payVal = parseInt(filterNum($('#p_lec_pay').val()), 10) || 0;
  const useVal = parseInt(filterNum($('#p_lec_use_cost').val()), 10) || 0;

  $('#p_lec_pay').val(commaSplit(payVal));
  $('#p_lec_use_cost').val(commaSplit(useVal));

  if (useVal > payVal) {
    $('#p_lec_use_cost').val('0');
    alert('수용비 : 수강료보다 클 수 없습니다.');
    $('#p_lec_tea_fee').val(commaSplit(payVal));
    return;
  }
  $('#p_lec_tea_fee').val(commaSplit(payVal - useVal));
}

function addPanelFile() {
  const $box = $('#p_file_box');
  const $row = $(
    '<div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">' +
      '<input type="file" style="font-size:12px;">' +
      '<button type="button" class="btn btn-default btn-xs" onclick="$(this).parent().remove()" style="color:#d9534f;">[삭제]</button>' +
    '</div>'
  );
  $box.append($row);
}

function openPanelLecTimeModal() {
  if (typeof openLecTimeWin === 'function') {
    openLecTimeWin();
  } else {
    const time = prompt('강의시간을 입력하세요 (예: 월,수 13:00~13:40):', '월 1부 (13:00~13:40)');
    if (time) {
      $('#p_lec_time_').val(time);
    }
  }
}

async function handlePanelCourseSubmit(e) {
  if (e) e.preventDefault();
  const filterNum = (str) => (!str ? 0 : parseInt(('' + str).replace(/[^0-9]/g, ''), 10) || 0);

  const title = $('#p_lec_name').val().trim();
  const category = $('#p_lec_div').val();
  const neulbomType = $('#p_lec_pro_type').val();
  const instructor = $('#p_tea_id').val().trim();
  const assistantInstructor = $('#p_tea_id1').val().trim();

  const selectedGrades = [];
  $('.p-grade-chk:checked').each(function() {
    selectedGrades.push($(this).val());
  });

  const scheduleTime = $('#p_lec_time_').val().trim();
  const capacity = filterNum($('#p_lec_max_sin').val());
  const waitingCapacity = filterNum($('#p_lec_max_wait').val());
  const sdate = $('#p_lec_sdate').val().trim();
  const edate = $('#p_lec_edate').val().trim();
  const totalHours = filterNum($('#p_lec_tot_sisu').val());
  const classroom = $('#p_lec_room').val().trim() || $('#p_lec_room_sel').val() || '후관1층 늘봄프로그램실';

  const fee = filterNum($('#p_lec_pay').val());
  const costFacility = filterNum($('#p_lec_use_cost').val());
  const textbookFee = filterNum($('#p_lec_pay_book').val());
  const materialFee = filterNum($('#p_lec_pay_item').val());
  const content = $('#p_lec_content').val();

  if (!title) { alert('강좌명을 입력하세요.'); return false; }
  if (!category) { alert('강좌구분을 선택하세요.'); return false; }
  if (!neulbomType) { alert('늘봄과정을 선택하세요.'); return false; }
  if (!instructor) { alert('강사ID를 입력하세요.'); return false; }
  if (selectedGrades.length === 0) { alert('대상학년을 최소 1개 이상 선택하세요.'); return false; }
  if (!scheduleTime) { alert('강의시간을 입력하세요.'); return false; }
  if (capacity <= 0) { alert('정원을 1명 이상 입력하세요.'); return false; }
  if (!sdate || !edate) { alert('운영기간 시작일과 종료일을 입력하세요.'); return false; }

  const payload = {
    schoolId: SCHOOL_SN || '3267',
    category,
    neulbomType,
    title,
    instructor,
    assistantInstructor,
    targetGrade: selectedGrades.join(','),
    scheduleTime,
    capacity,
    waitingCapacity,
    period: sdate + ' ~ ' + edate,
    totalHours,
    classroom,
    tuitionFee: fee,
    fee,
    costFacility,
    costInstructor: fee - costFacility,
    textbookFee,
    materialFee,
    content,
    feeReceipt: $('#p_lec_pay_view').is(':checked') ? 'Y' : 'N',
    teacherClosed: $('#p_lec_tea_finish').is(':checked') ? 'Y' : 'N',
    teacherEditable: $('#p_lec_tea_edit').is(':checked') ? 'Y' : 'N',
    refundClosed: $('#p_refund_status').is(':checked') ? 'Y' : 'N',
    status: $('input[name="p_lec_status"]:checked').val() === '1' ? 'OUTPUT' : ($('input[name="p_lec_status"]:checked').val() === '0' ? 'WAITING' : 'CLOSED')
  };

  try {
    const res = await fetch('/api/af/ad_lec/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      alert(data.message || '강좌가 성공적으로 등록되었습니다.');
      switchSubmodelView(null, 'ad_lec_lists', '/af/ad_lec/lists/sn/' + SCHOOL_SN);
      loadLectures();
    } else {
      alert(data.message || data.error || '등록 실패');
    }
  } catch(err) {
    alert('서버 통신 오류');
  }
  return false;
}

window.toggleAllPanelGrade = toggleAllPanelGrade;
window.chkPanelLecPay = chkPanelLecPay;
window.addPanelFile = addPanelFile;
window.openPanelLecTimeModal = openPanelLecTimeModal;
window.handlePanelCourseSubmit = handlePanelCourseSubmit;

// ==================== 강좌 일괄입력 패널 인터랙션 ====================
async function handlePanelBatchInputSubmit(e) {
  if (e) e.preventDefault();
  const divVal = document.getElementById('p_input_lec_div').value;
  const fileInput = document.getElementById('p_input_userfile');

  if (!divVal) {
    alert('강좌구분 : 필수항목입니다.');
    document.getElementById('p_input_lec_div').focus();
    return false;
  }

  if (!fileInput.files || fileInput.files.length === 0) {
    alert('엑셀 데이터 파일 : 필수항목입니다.');
    fileInput.focus();
    return false;
  }

  const file = fileInput.files[0];
  if (file.size > 1024 * 1024) {
    alert('엑셀 데이터 파일 : 용량이 너무 큰 엑셀 데이터는 입력할 수 없습니다(1M 이하만 가능)');
    return false;
  }

  if (!confirm('기존 데이터에 추가로 일괄입력 하시겠습니까?')) {
    return false;
  }

  // 텍스트(CSV)인 경우 클라이언트에서 파싱하여 전달하거나 FormData로 전송
  const reader = new FileReader();
  reader.onload = async function(evt) {
    const csvContent = evt.target.result;
    try {
      const res = await fetch('/api/af/ad_lec/batch-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: SCHOOL_SN || '3267',
          lec_div: divVal,
          csvText: csvContent
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message || '강좌가 성공적으로 일괄 등록되었습니다.');
        switchSubmodelView(null, 'ad_lec_lists', '/af/ad_lec/lists/sn/' + SCHOOL_SN);
        loadLectures();
      } else {
        alert(data.message || data.error || '일괄입력 처리 중 오류가 발생했습니다.');
      }
    } catch(err) {
      alert('서버 통신 중 오류가 발생했습니다.');
    }
  };
  reader.onerror = function() {
    alert('파일을 읽는 중 오류가 발생했습니다.');
  };
  reader.readAsText(file, 'utf-8');

  return false;
}

window.handlePanelBatchInputSubmit = handlePanelBatchInputSubmit;


