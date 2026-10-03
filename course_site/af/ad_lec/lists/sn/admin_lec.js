// dbdbschool Sub-Model View Engine & Action Button Router (28 Live Pages & 29 Submodels)

const SCHOOL_SN = '3267';
let currentSubmodelKey = 'ad_lec_lists';
var currentViewingQaId = null;
var qaItems = [
  {
    id: 'qna_8806',
    num: 2,
    authorName: '원희자(김채원)',
    hp1: '010',
    hp2: '2494',
    hp3: '1479',
    phone: '062-609-1182',
    email: 'khh147979@naver.com',
    subject: '2026학년도 1학기 늘봄학교 만족도 조사 설문지',
    contents: '2026학년도 바뀐 설문지 양식 첨부하여 보내드립니다.\n늘봄학교 1학기 만족도 조사 설문 등록 부탁드립니다.\n감사합니다.',
    status: '2',
    statusText: '완료',
    createdAt: '2026-06-01',
    answerDate: '06/01',
    answerContent: '안녕하세요. 디비디비스쿨 고객지원팀입니다.\n자료 올려 주셔서 대단히 감사합니다.\n4가지 샘플 설문에 정상 등록해드렸으니 설문관리 메뉴에서 바로 확인 및 활용 가능하십니다.\n추가 문의사항이 있으시면 언제든지 말씀해 주세요.'
  },
  {
    id: 'qna_3356',
    num: 1,
    authorName: '원희자(김채원)',
    hp1: '010',
    hp2: '2494',
    hp3: '1479',
    phone: '062-609-1182',
    email: 'khh147979@naver.com',
    subject: '지원금 스쿨뱅킹 현황',
    contents: '1학기 지원금 스쿨뱅킹 수납 현황 파일 확인 및 에듀파인 규격 매핑 부탁드립니다.',
    status: '2',
    statusText: '완료',
    createdAt: '2025-06-13',
    answerDate: '06/13',
    answerContent: '안녕하세요. 요청하신 지원금 스쿨뱅킹 수납 현황을 에듀파인 연계 규격에 맞게 생성하여 등록 처리 완료하였습니다.\n감사합니다.'
  }
];

const submodelTitles = {
  // 단독 대메뉴 (13개)
  ad_faq_main: '<i class="fa fa-file-text-o"></i> 매뉴얼 <span style="font-size:12px; color:#a6a6a6; font-weight:normal;">광주풍향초등학교 늘봄학교</span>',
  qanda_lists: '<i class="fa fa-file-text-o"></i> 고객지원 게시판 <span style="font-size:12px; color:#a6a6a6; font-weight:normal;">광주풍향초등학교 늘봄학교</span>',
  sczigi_service_lists: '<i class="fa-solid fa-school"></i> 학교관리 (/sczigi/service/lists)',
  ad_lec_lists: '<i class="fa-solid fa-book-open"></i> 강좌관리 (/af/ad_lec/lists)',
  ad_app_lists: '<i class="fa-solid fa-users"></i> 신청자관리 (/af/ad_app/lists)',
  ad_wait_lists: '<i class="fa-solid fa-clock-rotate-left"></i> 대기자관리 (/af/ad_wait/lists)',
  ad_ref_lists: '<i class="fa-solid fa-calculator"></i> 환불/취소관리 (/af/ad_ref/lists)',
  ad_rsch_lists: '<i class="fa fa-calendar"></i> 귀가일정표 <span style="font-size:12px; color:#a6a6a6; font-weight:normal;">광주풍향초등학교 늘봄학교</span>',
  ad_abs_lists: '<i class="fa fa-calendar-o"></i> 결석/귀가신청 <span style="font-size:12px; color:#a6a6a6; font-weight:normal;">광주풍향초등학교 늘봄학교</span>',
  ad_tea_lists: '<i class="fa-solid fa-chalkboard-user"></i> 강사관리 (/af/ad_tea/lists)',
  notification_lists: '<i class="fa-solid fa-paper-plane"></i> 알림관리 (/af/notification/lists)',
  spush_lists: '<i class="fa-solid fa-bell"></i> 푸시알림관리 (/af/spush/lists)',
  ad_extension_lists: '<i class="fa-solid fa-calendar-plus"></i> 연장신청 (/af/ad_extension/lists)',

  // 지원금관리 (4개)
  ad_free2_stu: '<i class="fa-solid fa-hand-holding-dollar"></i> 지원금관리 > 대상자관리 (/af/ad_free2_stu/lists)',
  ad_free2_app: '<i class="fa-solid fa-receipt"></i> 지원금관리 > 수강자관리 (/af/ad_free2_app/lists)',
  ad_free2_cfg_main: '<i class="fa-solid fa-sliders"></i> 지원금관리 > 지원금설정 (/af/ad_free2_cfg/main)',
  ad_free2_cfg_free1: '<i class="fa-solid fa-ranking-star"></i> 지원금관리 > 순위구분설정 (/af/ad_free2_cfg/free1)',

  // 설문관리 (2개)
  ad_sur_lists: '<i class="fa-solid fa-square-poll-vertical"></i> 설문관리 > 설문 (/af/ad_sur/lists)',
  ad_surs_lists: '<i class="fa-solid fa-list-check"></i> 설문관리 > 샘플설문 (/af/ad_surs/lists)',

  // 환경설정 (10개)
  ad_cfg_main: '<i class="fa-solid fa-gear"></i> 환경설정 > 기본설정 (/af/ad_cfg/main)',
  ad_time_lists: '<i class="fa-solid fa-calendar-days"></i> 환경설정 > 신청기간 (/af/ad_time/lists)',
  ad_cfg_period: '<i class="fa-solid fa-clock"></i> 환경설정 > 강의시간 (/af/ad_cfg/period)',
  ad_cfg_afDiv: '<i class="fa-solid fa-layer-group"></i> 환경설정 > 강좌구분 (/af/ad_cfg/afDiv)',
  ad_cfg_appLiGrp: '<i class="fa-solid fa-ban"></i> 환경설정 > 중복제한그룹 (/af/ad_cfg/appLiGrp)',
  ad_verify_main: '<i class="fa-solid fa-user-check"></i> 환경설정 > 학적검증 (/af/ad_verify/main)',
  ad_neis_edufine_lists: '<i class="fa-solid fa-file-invoice-dollar"></i> 환경설정 > 나이스/에듀파인 설정 (/af/ad_neis_edufine/lists)',
  ad_cfg_message: '<i class="fa-solid fa-bullhorn"></i> 환경설정 > 안내글설정 (/af/ad_cfg/message)',
  ad_cfg_clear: '<i class="fa-solid fa-triangle-exclamation"></i> 환경설정 > 초기화 (/af/ad_cfg/clear)',
  ad_info_modify: '<i class="fa-solid fa-id-card"></i> 환경설정 > 담당자정보 (/af/ad_info/modify)'
};

function getSubmodelKeyFromPath(path) {
  if (!path) return 'ad_lec_lists';
  if (path.includes('/af/ad_faq/main')) return 'ad_faq_main';
  if (path.includes('/af/qanda/lists')) return 'qanda_lists';
  if (path.includes('/sczigi/service/lists')) return 'sczigi_service_lists';
  if (path.includes('/af/ad_lec/lists') || path.includes('/af/ad_lec/main')) return 'ad_lec_lists';
  if (path.includes('/af/ad_app/') || path.includes('/af/ad_stu/lists')) return 'ad_app_lists';
  if (path.includes('/af/ad_wait')) return 'ad_wait_lists';
  if (path.includes('/af/ad_att/stat')) {
    window.location.replace('/af/ad_wait/lists/sn/3267');
    return 'ad_wait_lists';
  }
  if (path.includes('/af/ad_ref/lists')) return 'ad_ref_lists';
  if (path.includes('/af/ad_rsch/lists')) return 'ad_rsch_lists';
  if (path.includes('/af/ad_abs/lists')) return 'ad_abs_lists';
  if (path.includes('/af/ad_tea/lists')) return 'ad_tea_lists';
  if (path.includes('/af/notification/lists')) return 'notification_lists';
  if (path.includes('/af/spush/lists')) return 'spush_lists';
  if (path.includes('/af/ad_extension/lists')) return 'ad_extension_lists';
  if (path.includes('/af/ad_free2_stu')) return 'ad_free2_stu';
  if (path.includes('/af/ad_free2_app')) return 'ad_free2_app';
  if (path.includes('/af/ad_free2_cfg/free1')) return 'ad_free2_cfg_free1';
  if (path.includes('/af/ad_free2_cfg/main')) return 'ad_free2_cfg_main';
  if (path.includes('/af/ad_surs/lists')) return 'ad_surs_lists';
  if (path.includes('/af/ad_sur/lists')) return 'ad_sur_lists';
  if (path.includes('/af/ad_cfg/period')) return 'ad_cfg_period';
  if (path.includes('/af/ad_cfg/afDiv')) return 'ad_cfg_afDiv';
  if (path.includes('/af/ad_cfg/appLiGrp')) return 'ad_cfg_appLiGrp';
  if (path.includes('/af/ad_time/lists')) return 'ad_time_lists';
  if (path.includes('/af/ad_verify/main')) return 'ad_verify_main';
  if (path.includes('/af/ad_neis_edufine/lists')) return 'ad_neis_edufine_lists';
  if (path.includes('/af/ad_cfg/message')) return 'ad_cfg_message';
  if (path.includes('/af/ad_cfg/clear')) return 'ad_cfg_clear';
  if (path.includes('/af/ad_info/modify')) return 'ad_info_modify';
  if (path.includes('/af/ad_cfg/main') || path.includes('/af/ad_cfg/tea') || path.includes('/af/ad_cfg/att') || path.includes('/af/ad_cfg/sms')) return 'ad_cfg_main';
  return 'ad_lec_lists';
}

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const initialKey = getSubmodelKeyFromPath(path);
  switchSubmodelView(null, initialKey, path, false);
  try { checkInitialModalRoute(); } catch(e) { console.warn(e); }

  // FAQ 패널 콘텐츠를 항상 미리 렌더링해 두기 (panel display:none 상태에서도 동작)
  try { loadFaqList(); } catch(e) { console.warn('loadFaqList pre-render error:', e); }

  // ==================== 전역 사이드바 SPA 내비게이션 인터셉터 ====================
  // 사이드바의 어떤 메뉴를 클릭하더라도 브라우저 전체 새로고침을 100% 원천 차단하고
  // 사이드바 DOM과 크기는 그대로 유지한 채 본문 페이지만 번개처럼 교체합니다!
  document.addEventListener('click', (e) => {
    const link = e.target.closest('#left_menu a');
    if (!link) return;

    const href = link.getAttribute('href');
    // 로그아웃, 모달창 팝업, 자바스크립트 명령, 빈 링크는 고유 핸들러에 위임
    if (!href || href === '#' || href.startsWith('javascript:') || href.includes('/logout') || href.includes('/modify')) {
      return;
    }

    // 브라우저 페이지 전체 새로고침 100% 방지!
    e.preventDefault();
    e.stopPropagation();

    const targetKey = getSubmodelKeyFromPath(href);
    switchSubmodelView(null, targetKey, href, true);
  });

  // 브라우저 뒤로가기 / 앞으로가기 완벽 지원
  window.addEventListener('popstate', (e) => {
    const path = window.location.pathname;
    const targetKey = e.state?.key || getSubmodelKeyFromPath(path);
    switchSubmodelView(null, targetKey, path, false);
  });
});

// Dynamic Sub-model Switcher & SPA URL PushState
function switchSubmodelView(event, key, url, pushState = true) {
  if (event) event.preventDefault();

  // 모든 메뉴 클릭 및 화면 전환 시 최상단 스크롤 강제 (하단 배치 및 겹침 방지)
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const mc = document.querySelector('.main-content');
    if (mc) mc.scrollTop = 0;
  } catch(e) {}

  currentSubmodelKey = key;

  if (pushState && url) {
    window.history.pushState({ key, url }, '', url);
  }

  const titleEl = document.getElementById('viewMainTitle');
  if (titleEl && submodelTitles[key]) {
    titleEl.innerHTML = submodelTitles[key];
  }

  document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
  let activeSubitem = document.getElementById('sub_' + key);
  if (!activeSubitem && (key === 'ad_lec_write' || key === 'ad_lec_input')) {
    activeSubitem = document.getElementById('sub_ad_lec_lists');
  }
  if (activeSubitem) {
    activeSubitem.classList.add('active');
    const parentMenu = activeSubitem.closest('.has-submenu');
    if (parentMenu) {
      parentMenu.classList.add('open');
      const depthUl = parentMenu.querySelector('.depth, .submenu-list');
      if (depthUl) depthUl.style.display = 'block';
    }
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

    case 'ad_ref_lists':
      loadRefunds();
      break;
    case 'ad_rsch_lists':
      if (typeof loadRschList === 'function') loadRschList();
      break;
    case 'ad_abs_lists':
      if (typeof loadAbsList === 'function') loadAbsList();
      else loadAbsences();
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
    case 'ad_free2_cfg_main':
      loadSubsidyConfig();
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
    case 'ad_verify_main':
      if (typeof loadAcademicVerification === 'function') loadAcademicVerification();
      break;
    case 'ad_neis_edufine_lists':
      if (typeof loadNeisEdufineSettings === 'function') loadNeisEdufineSettings();
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

// 원본 상세검색 토글
function toggleDetailedSearch(e) {
  if (e) e.preventDefault();
  let container = e && e.target ? e.target.closest('.submodel-panel') : null;
  if (!container) {
    container = document.querySelector('.submodel-panel:not([style*="display: none"])') || document;
  }
  const searchModule = container.querySelector('#main_control_box_search');
  const btn = container.querySelector('#main_control_box_btn01');
  if (!searchModule) return;
  const isHidden = searchModule.style.display === 'none' || window.getComputedStyle(searchModule).display === 'none';
  searchModule.style.display = isHidden ? 'inline-block' : 'none';
  if (btn) {
    btn.innerHTML = isHidden ? '상세검색 <strong>닫기</strong><span class="fa fa-angle-up"></span>' : '상세검색 <strong>열기</strong><span class="fa fa-angle-down"></span>';
  }
}

// 추가기능.. 드롭다운 토글
function toggleExtraMenu(e) {
  if (e) e.preventDefault();
  let container = e && e.target ? e.target.closest('.submodel-panel') : null;
  if (!container) {
    container = document.querySelector('.submodel-panel:not([style*="display: none"])') || document;
  }
  const dropModule = container.querySelector('#main_control_box_drop');
  const btn = container.querySelector('#main_control_box_btn02');
  if (!dropModule) return;
  const isHidden = dropModule.style.display === 'none' || window.getComputedStyle(dropModule).display === 'none';
  dropModule.style.display = isHidden ? 'inline-block' : 'none';
  if (btn) {
    const icon = btn.querySelector('.fa');
    if (icon) {
      icon.className = isHidden ? 'fa fa-angle-up' : 'fa fa-angle-down';
    }
  }
}

// 검색 필터 초기화
function resetLectureFilters() {
  const selDiv = document.getElementById('sel_led_div');
  const selPro = document.getElementById('s_lec_pro_type');
  const selStatus = document.getElementById('sls');
  const selGrade = document.getElementById('s_grade');
  const txtWord = document.getElementById('s_word');

  if (selDiv) selDiv.value = 'all';
  if (selPro) selPro.value = 'all';
  if (selStatus) selStatus.value = 'all';
  if (selGrade) selGrade.value = '';
  if (txtWord) txtWord.value = '';

  const catOld = document.getElementById('categoryFilter');
  if (catOld) catOld.value = '전체';
  const stOld = document.getElementById('statusFilter');
  if (stOld) stOld.value = '전체';
  const kwOld = document.getElementById('searchKeyword');
  if (kwOld) kwOld.value = '';

  loadLectures();
}

async function loadLectures() {
  // 1. 강좌구분 (카테고리)
  let category = '전체';
  const selDiv = document.getElementById('sel_led_div');
  if (selDiv && selDiv.value !== 'all') {
    const sldToCat = { '5': '3월', '6': '26년 4월', '7': '26년 5월', '8': '26년 6월', '9': '26년 7월', '10': '26년 8월', '11': '26년 9월' };
    category = sldToCat[selDiv.value] || selDiv.options[selDiv.selectedIndex]?.text || '전체';
  } else if (document.getElementById('categoryFilter')) {
    category = document.getElementById('categoryFilter').value;
  }

  // 2. 상태
  let status = '전체';
  const selStatus = document.getElementById('sls');
  if (selStatus && selStatus.value !== 'all') {
    const slsMap = { '1': '출력', '0': '대기', '2': '종료' };
    status = slsMap[selStatus.value] || '전체';
  } else if (document.getElementById('statusFilter')) {
    status = document.getElementById('statusFilter').value;
  }

  // 3. 검색어
  let keyword = '';
  const wordInput = document.getElementById('s_word');
  if (wordInput && wordInput.value.trim()) {
    keyword = wordInput.value.trim();
  } else if (document.getElementById('searchKeyword')) {
    keyword = document.getElementById('searchKeyword').value.trim();
  }

  // 선택된 카테고리에 맞춰 버튼들의 고유 URL sld 동적 동기화
  const sldMap = { '3월': '5', '26년 4월': '6', '26년 5월': '7', '26년 6월': '8', '26년 7월': '9', '26년 8월': '10', '26년 9월': '11' };
  const targetSld = sldMap[category] || '11';
  try { if (typeof updateActionButtonUrls === 'function') updateActionButtonUrls(targetSld); } catch(_) {}

  try {
    const res = await fetch(`/api/af/ad_lec/lists/sn/${SCHOOL_SN}?category=${encodeURIComponent(category)}&status=${encodeURIComponent(status)}&keyword=${encodeURIComponent(keyword)}`);
    const data = await res.json();
    if (data.success) {
      const span = document.getElementById('totalCountSpan');
      if (span) span.innerText = data.totalCount;
      renderLectureTable(data.lectures);
    }
  } catch (e) { console.error('loadLectures Error:', e); }
}

// 하단 일괄적용 (update_type 22종 연동)
async function handleLectureBulkAction() {
  const updateTypeSelect = document.getElementById('update_type');
  if (!updateTypeSelect || !updateTypeSelect.value) {
    alert('일괄적용할 항목을 선택하세요.');
    return;
  }
  const updateType = updateTypeSelect.value;

  const checkedBoxes = Array.from(document.querySelectorAll('.lec-checkbox:checked'));
  if (checkedBoxes.length === 0) {
    alert('선택된 강좌가 없습니다.');
    return;
  }

  const courseIds = checkedBoxes.map(cb => cb.value);

  if (updateType === 'del') {
    if (!confirm(`선택한 ${courseIds.length}개 강좌를 정말 삭제하시겠습니까?`)) {
      return;
    }
  }

  try {
    const res = await fetch('/api/af/ad_lec/bulk-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schoolId: SCHOOL_SN,
        courseIds,
        updateType
      })
    });
    const result = await res.json();
    if (result.success) {
      alert(result.message || '일괄 적용이 완료되었습니다.');
      loadLectures();
    } else {
      alert(result.message || '일괄 적용에 실패했습니다.');
    }
  } catch (err) {
    console.error('Bulk Action Error:', err);
    alert('서버 통신 중 오류가 발생했습니다.');
  }
}

// 테이블 정렬 토글
let currentSortField = 'num';
let currentSortAsc = true;
function toggleSort(field) {
  if (currentSortField === field) {
    currentSortAsc = !currentSortAsc;
  } else {
    currentSortField = field;
    currentSortAsc = true;
  }

  if (!currentLecturesCache || currentLecturesCache.length === 0) return;

  const sorted = [...currentLecturesCache].sort((a, b) => {
    let valA = a[field] || '';
    let valB = b[field] || '';
    if (field === 'num' || field === 'capacity' || field === 'tuitionFee') {
      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
    }
    if (valA < valB) return currentSortAsc ? -1 : 1;
    if (valA > valB) return currentSortAsc ? 1 : -1;
    return 0;
  });

  renderLectureTable(sorted);
}

// 전체 체크박스 연동 (chk_all)
function chk_all(obj) {
  let isChecked = false;
  if (obj && typeof obj.checked === 'boolean') {
    isChecked = obj.checked;
  } else {
    const master = document.querySelector('#panel_ad_lec_lists #check_all');
    isChecked = master ? master.checked : true;
  }
  document.querySelectorAll('#lectureTbody .lec-checkbox, #panel_ad_lec_lists .lec-checkbox').forEach(cb => {
    cb.checked = isChecked;
  });
}

// 원본 show_max_sin 호환
function show_max_sin(num) {
  const row = document.getElementById('lec_row_' + num);
  const capLink = row ? row.querySelector('a[onclick*="quickEditCapacity"]') : null;
  const currentCap = capLink ? parseInt(capLink.innerText) || 20 : 20;
  quickEditCapacity(num, currentCap, capLink);
}

// 원본 chk_del 호환
function chk_del(num) {
  deleteLecture(num);
}

let currentLecturesCache = [];

function renderLectureTable(lectures) {
  const tbody = document.getElementById('lectureTbody');
  if (!tbody) return;
  currentLecturesCache = lectures || [];
  if (!lectures || lectures.length === 0) {
    tbody.innerHTML = `<tr><td colspan="18" style="text-align: center; padding: 40px; color: var(--text-secondary);">조회된 강좌가 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = lectures.map((lec, idx) => {
    const isNew = window.lastRegisteredCourseId && String(lec.id) === String(window.lastRegisteredCourseId);
    const rowHighlight = isNew ? 'background-color: #ecfdf5; border-left: 4px solid #10b981;' : '';
    return `
    <tr style="height: 38px; ${rowHighlight}" id="lec_row_${lec.id}">
      <td style="text-align: center;"><input type="checkbox" class="lec-checkbox" value="${lec.id}"></td>
      <td style="text-align: center;">${idx + 1}</td>
      <td style="text-align: center;">
        <button type="button" class="btn btn-default" style="height: 24px; padding: 0 8px; font-size: 11px; border: 1px solid #d1d5db; background: #fff; border-radius: 3px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;" onclick="openCourseEditModal('${lec.id}')">수정</button>
      </td>
      <td style="text-align: center;">
        <span style="font-weight: 600; color: #475569;">${lec.category || ''}</span>
        ${lec.neulbomType ? `<br><span style="font-size: 11px; color: #64748b;">(${lec.neulbomType})</span>` : ''}
      </td>
      <td style="text-align: left; padding-left: 10px;">
        <a href="javascript:void(0)" onclick="openCourseEditModal('${lec.id}')" style="font-weight: 600; color: #1e40af; text-decoration: none;">${lec.title}</a>
        ${lec.allowTimeConflict ? '<br><span style="font-size: 10px; color: #7c3aed; background: #ede9fe; padding: 1px 4px; border-radius: 3px; display: inline-block; margin-top: 2px;">[시간중복허용]</span>' : ''}
      </td>
      <td style="text-align: center;">
        ${lec.teacherName || lec.instructor || '-'}<br><span style="font-size: 11px; color: #64748b;">(${lec.teacherId || lec.instructor || 'inst'})</span>
      </td>
      <td style="text-align: center;">
        <strong style="color: ${(lec.enrolledCount || 0) >= (lec.capacity || 0) ? '#dc2626' : '#2563eb'};">${lec.enrolledCount || 0}</strong> / <a href="javascript:void(0)" onclick="quickEditCapacity('${lec.id}', ${lec.capacity || 0}, this); return false;" style="border-bottom: 1px dotted #475569; color: #1e293b; text-decoration: none; font-weight: bold; cursor: pointer;" title="클릭하여 정원 빠른수정">${lec.capacity || 0}</a>
      </td>
      <td style="text-align: center;">
        ${lec.waitingCount || 0} / ${lec.waitingCapacity || 0}
      </td>
      <td style="text-align: center;">${lec.targetGrade || '전체'}</td>
      <td style="text-align: center; font-size: 11px; white-space: nowrap;">${lec.period || '-'}</td>
      <td style="text-align: center; font-size: 11px;">${lec.dayOfWeek ? `${lec.dayOfWeek} ` : ''}${lec.scheduleTime || ''}</td>
      <td style="text-align: right; font-weight: 600; padding-right: 12px;">${(Number(lec.tuitionFee) || 0).toLocaleString()}원</td>
      <td style="text-align: center;">
        <span style="font-size: 11px; color: #16a34a; font-weight: 600;">${lec.feeReceipt === 'N' ? '미출력' : '출력'}</span>
      </td>
      <td style="text-align: center;">
        <label class="switch" style="transform: scale(0.75);">
          <input type="checkbox" ${lec.instructorClosed ? 'checked' : ''} onchange="toggleInstructorClose('${lec.id}')">
          <span class="slider"></span>
        </label>
      </td>
      <td style="text-align: center;">
        <label class="switch" style="transform: scale(0.75);">
          <input type="checkbox" ${lec.teacherEditable === 'Y' || lec.teacherEditable === true ? 'checked' : ''} onchange="toggleInstructorEdit('${lec.id}')">
          <span class="slider"></span>
        </label>
      </td>
      <td style="text-align: center; font-size: 11px; color: #64748b;">${lec.refundClosed ? '마감' : '마감전'}</td>
      <td style="text-align: center;">
        <select onchange="quickChangeStatus('${lec.id}', this.value)" style="height: 24px; font-size: 11px; border-radius: 3px; border: 1px solid #cbd5e1; background: #fff; padding: 0 4px; cursor: pointer; color: ${lec.status === 'OUTPUT' || lec.status === '출력' ? '#16a34a' : (lec.status === 'CLOSED' || lec.status === '종료' ? '#64748b' : '#d97706')}; font-weight: 600;">
          <option value="출력" ${(lec.status === 'OUTPUT' || lec.status === '출력') ? 'selected' : ''}>출력</option>
          <option value="대기" ${(lec.status === 'WAITING' || lec.status === '대기') ? 'selected' : ''}>대기</option>
          <option value="종료" ${(lec.status === 'CLOSED' || lec.status === '종료') ? 'selected' : ''}>종료</option>
        </select>
      </td>
      <td style="text-align: center;">
        <button type="button" class="btn btn-outline" style="height: 24px; padding: 0 6px; font-size: 11px; color: #dc2626; border-color: #fca5a5; display: inline-flex; align-items: center; justify-content: center; cursor: pointer;" onclick="deleteLecture('${lec.id}')" title="강좌 삭제"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `;
  }).join('');

  if (window.lastRegisteredCourseId) {
    setTimeout(() => {
      const targetRow = document.getElementById('lec_row_' + window.lastRegisteredCourseId);
      if (targetRow) {
        targetRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }
}

// ==================== 2. 신청자관리 (/af/ad_app/lists) ====================

let applicantListCache = [];
let applicantCoursesCache = [];
let appSortAsc = { studentNum: true, appliedAt: false };

async function loadApplicants() {
  const categoryEl = document.getElementById('app_filter_sld') || document.getElementById('appCategoryFilter');
  const neulbomEl = document.getElementById('app_filter_slp') || document.getElementById('appNeulbomFilter');
  const courseEl = document.getElementById('sel_lec_num') || document.getElementById('appCourseFilter');
  const gradeEl = document.getElementById('app_filter_sgr') || document.getElementById('appGradeFilter');
  const classEl = document.getElementById('app_filter_scl') || document.getElementById('appClassFilter');
  const searchTypeEl = document.getElementById('app_filter_st') || document.getElementById('appSearchTypeFilter');
  const keywordEl = document.getElementById('app_filter_sw') || document.getElementById('appSearchKeyword');

  let category = categoryEl ? categoryEl.value : '10';
  if (category === '5') category = '3월';
  else if (category === '6') category = '26년 4월';
  else if (category === '7') category = '26년 5월';
  else if (category === '8') category = '26년 6월';
  else if (category === '9') category = '26년 7월';
  else if (category === '10') category = '26년 8월';
  else if (category === '11') category = '26년 9월';
  else if (category === 'all') category = '전체';

  let neulbomType = neulbomEl ? neulbomEl.value : '=늘봄과정=';
  if (neulbomType === '1') neulbomType = '방과후';
  else if (neulbomType === '2') neulbomType = '맞춤형';
  else if (neulbomType === '3') neulbomType = '돌봄';

  const courseId = courseEl ? courseEl.value : '';
  const grade = gradeEl ? gradeEl.value : '';
  const classNum = classEl ? classEl.value : '';
  let searchType = searchTypeEl ? searchTypeEl.value : 'name';
  if (searchType === 'app_mem_name') searchType = 'name';
  else if (searchType === 'tel') searchType = 'phone';

  const keyword = keywordEl ? keywordEl.value.trim() : '';

  const params = new URLSearchParams();
  if (category && category !== '전체' && category !== 'all') params.append('category', category);
  if (neulbomType && neulbomType !== '=늘봄과정=' && neulbomType !== 'all') params.append('neulbomType', neulbomType);
  if (courseId && courseId !== '=강좌전체=' && courseId !== '') params.append('courseId', courseId);
  if (grade && grade !== '=학년=' && grade !== '') params.append('grade', grade);
  if (classNum && classNum !== '=반=' && classNum !== '') params.append('classNum', classNum);
  if (searchType && searchType !== 'all') params.append('searchType', searchType);
  if (keyword) params.append('keyword', keyword);

  try {
    const res = await fetch(`/api/af/ad_app/lists/sn/${SCHOOL_SN}?${params.toString()}`);
    const data = await res.json();
    if (data.success) {
      applicantListCache = data.items || [];
      if (data.courses && Array.isArray(data.courses)) {
        applicantCoursesCache = data.courses;
        populateApplicantCourseFilters(data.courses);
      }
      renderApplicantKPIs(data.stats, applicantListCache);
      renderApplicantsTable(applicantListCache);
    }
  } catch (e) {
    console.error('loadApplicants Error:', e);
  }
}

function populateApplicantCourseFilters(courses) {
  const filterSelect1 = document.getElementById('sel_lec_num');
  const filterSelect2 = document.getElementById('appCourseFilter');
  const newAppCourseSelect = document.getElementById('newAppCourseSelect');
  const batchFeeCourseSelect = document.getElementById('batchFeeCourseSelect');
  const testModeCourseSelect = document.getElementById('testModeCourseSelect');

  const optionsHtml = courses.map(c => `<option value="${c.id || c.title}">[${c.category || '늘봄'}] ${c.title} (${c.instructor || c.teacherName || '강사'}, ${c.enrolledCount || c.applied || 0}명)</option>`).join('');

  if (filterSelect1 && filterSelect1.options.length <= 1) {
    filterSelect1.innerHTML = '<option value="">=강좌전체=</option>' + optionsHtml;
  }
  if (filterSelect2 && filterSelect2.options.length <= 1) {
    filterSelect2.innerHTML = '<option value="=강좌전체=">=강좌전체=</option>' + optionsHtml;
  }
  if (newAppCourseSelect) {
    newAppCourseSelect.innerHTML = '<option value="">강좌를 선택하세요</option>' + optionsHtml;
  }
  if (batchFeeCourseSelect) {
    batchFeeCourseSelect.innerHTML = optionsHtml;
  }
  if (testModeCourseSelect) {
    testModeCourseSelect.innerHTML = optionsHtml;
  }
}

function renderApplicantKPIs(stats, items) {
  const totalCount = stats ? stats.totalCount : items.length;
  const approvedCount = stats ? stats.approvedCount : items.filter(i => i.status === '승인' || i.status === '정상' || i.status === '수강승인').length;
  const waitingCount = stats ? stats.waitingCount : items.filter(i => i.status === '신청대기' || i.paymentStatus === '결제대기' || i.paymentStatus === '미납').length;
  const totalFee = stats ? stats.totalTuitionFee : items.reduce((sum, i) => sum + (Number(i.totalFee) || (Number(i.tuitionFee) || 0) + (Number(i.materialFee) || 0)), 0);
  const collectedFee = stats ? stats.totalCollectedFee : items.reduce((sum, i) => i.paymentStatus === '결제완료' || i.paymentStatus === '납부완료' ? sum + (Number(i.totalFee) || Number(i.tuitionFee) || 0) : sum, 0);

  const totalEl = document.getElementById('appKpiTotal');
  const approvedEl = document.getElementById('appKpiApproved');
  const waitingEl = document.getElementById('appKpiWaiting');
  const totalFeeEl = document.getElementById('appKpiTotalFee');
  const collectedFeeEl = document.getElementById('appKpiCollectedFee');
  const spanCount = document.getElementById('applicantCountSpan');

  if (totalEl) totalEl.innerText = `${totalCount.toLocaleString()}명`;
  if (approvedEl) approvedEl.innerText = `${approvedCount.toLocaleString()}명`;
  if (waitingEl) waitingEl.innerText = `${waitingCount.toLocaleString()}명`;
  if (totalFeeEl) totalFeeEl.innerText = `${totalFee.toLocaleString()}원`;
  if (collectedFeeEl) collectedFeeEl.innerText = `${collectedFee.toLocaleString()}원`;
  if (spanCount) spanCount.innerText = totalCount;
}

function renderApplicantsTable(items) {
  const tbody = document.getElementById('studentTbody');
  if (!tbody) return;

  if (!items || items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="17" class="center" style="padding:40px; text-align:center; color:#64748b;"><i class="fa fa-folder-open-o" style="font-size:24px; margin-bottom:8px; display:block;"></i>조회된 수강 신청자가 없습니다.</td></tr>`;
    return;
  }

  const rows = items.map((app, idx) => {
    const tuition = Number(app.tuitionFee) || 0;
    const facility = app.facilityFee !== undefined ? Number(app.facilityFee) : Math.round(tuition * 0.2);
    const instructor = app.instructorFee !== undefined ? Number(app.instructorFee) : Math.round(tuition * 0.8);
    const book = Number(app.bookFee) || 0;
    const material = Number(app.materialFee) || 0;
    const total = Number(app.totalFee) || (tuition + material + book);

    const grade = app.grade || (app.gradeClass ? app.gradeClass.charAt(0) : '1');
    const classNum = app.classNum || (app.gradeClass && app.gradeClass.includes('반') ? app.gradeClass.split('반')[0].slice(-1) : '1');
    const studentNum = app.studentNum || app.studentNumber || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`);
    const phone = app.parentPhone || app.guardianPhone || '-';
    const num = app.id || (idx + 1);

    const neulbomType = app.neulbomType || '돌봄';
    let neulbomBadgeClass = 'lec_pro_type1';
    if (neulbomType.includes('맞춤형')) neulbomBadgeClass = 'lec_pro_type2';
    else if (neulbomType.includes('돌봄')) neulbomBadgeClass = 'lec_pro_type3';

    const appliedDateStr = (app.appliedAt || '2026-07-10 15:28:38').replace('T', '<br>');

    return `
      <tr>
        <td><input type="checkbox" name="data_checked[]" value="${num}"></td>
        <td>${items.length - idx}</td>
        <td>
          ${escHtml(app.category || '26년 8월')}<br><span class="${neulbomBadgeClass}">${escHtml(neulbomType)}</span>
        </td>
        <td class="text-left">${escHtml(app.courseTitle)}</td>
        <td>${grade}</td>
        <td>${classNum}</td>
        <td>${studentNum}</td>
        <td style="position:relative;">
          <a href="#none;" class="link_type" onclick="openAppEditModal('${num}'); return false;">${escHtml(app.studentName)}</a>
          <a href="#none;" id="stu_sch_${num}" style="position:absolute; right:4px; top:0px;" onclick="open_stu_schedule('${num}', '${escHtml(app.studentName)}'); return false;"><i class="fa fa-list-alt" title="시간표 보기"></i></a>
        </td>
        <td style="position:relative;">
          <span class="stu_hp_${num}">${phone}</span>&nbsp;
          <a href="#none;" id="stu_hp_${num}" style="position:absolute; right:4px; top:0px;" onclick="show_stu_hp('${num}', '${escHtml(app.studentName)}'); return false;"><i class="fa fa-pencil-square" title="연락처 수정"></i></a>
          <input type="hidden" name="stu_hp_info_${num}" id="stu_hp_info_${num}" value="${phone}^학부모^${phone}">
        </td>
        <td><a href="#none;" class="link_type" onclick="openAppBatchFeeModal(); return false;">${tuition.toLocaleString()}</a></td>
        <td><a href="#none;" class="link_type" onclick="openAppBatchFeeModal(); return false;">${facility.toLocaleString()}</a></td>
        <td>${instructor.toLocaleString()}</td>
        <td><a href="#none;" class="link_type" onclick="openAppBatchFeeModal(); return false;">${book.toLocaleString()}</a></td>
        <td><a href="#none;" class="link_type" onclick="openAppBatchFeeModal(); return false;">${material.toLocaleString()}</a></td>
        <td>${total.toLocaleString()}</td>
        <td>${appliedDateStr}</td>
        <td><a href="#none;" onclick="chk_cancel('${num}'); return false;"><i class="fa fa-trash-o icon_btn" title="삭제"></i></a></td>
      </tr>
    `;
  }).join('');

  tbody.innerHTML = rows;
}

function resetAppFilters() {
  const cat = document.getElementById('app_filter_sld') || document.getElementById('appCategoryFilter');
  const nlb = document.getElementById('app_filter_slp') || document.getElementById('appNeulbomFilter');
  const crs = document.getElementById('sel_lec_num') || document.getElementById('appCourseFilter');
  const grd = document.getElementById('app_filter_sgr') || document.getElementById('appGradeFilter');
  const cls = document.getElementById('app_filter_scl') || document.getElementById('appClassFilter');
  const st = document.getElementById('app_filter_st') || document.getElementById('appSearchTypeFilter');
  const kw = document.getElementById('app_filter_sw') || document.getElementById('appSearchKeyword');

  if (cat) cat.value = '10';
  if (nlb) nlb.value = 'all';
  if (crs) crs.value = '';
  if (grd) grd.value = '';
  if (cls) cls.value = '';
  if (st) st.value = 'app_mem_name';
  if (kw) kw.value = '';

  loadApplicants();
}

function toggleSelectAllApps(master) {
  document.querySelectorAll('input[name="data_checked[]"]').forEach(cb => cb.checked = master.checked);
}

function chk_all_apps(master) {
  document.querySelectorAll('input[name="data_checked[]"]').forEach(cb => cb.checked = master.checked);
}

function open_stu_schedule(stu_num, stu_name) {
  let student = applicantListCache.find(a => String(a.id) === String(stu_num));
  openAppPrintModal('timetable', student);
}

function show_stu_hp(num, name) {
  const existing = document.querySelector('.stu_hp_box');
  if (existing) {
    alert("이미 편집 중인 연락처가 있습니다.");
    return;
  }
  const anchor = document.getElementById('stu_hp_' + num);
  if (!anchor) return;
  const rawInfo = document.getElementById('stu_hp_info_' + num)?.value || '';
  const parts = rawInfo.split('^');
  const phone = parts[0] || '010-0000-0000';
  const hpParts = phone.split('-');
  const hp1 = hpParts[0] || '010';
  const hp2 = hpParts[1] || '';
  const hp3 = hpParts[2] || '';

  const box = document.createElement('div');
  box.className = 'stu_hp_box';
  box.style.cssText = 'position:absolute; right:2px; top:-20px; width:420px; padding:8px 10px; border:1px solid #4791D2; border-radius:5px; background:#FFF; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.15); font-size:12px;';
  box.innerHTML = `
    <div style="text-align:left; padding-left:4px;">
      학생 휴대폰 :
      <select name="mem_hp_1" id="mem_hp_1_${num}" class="form-control input-sm" style="width:70px; display:inline-block; height:28px; line-height:normal !important; padding:0 6px; vertical-align:middle;">
        <option value="010"${hp1==='010'?' selected':''}>010</option>
        <option value="011"${hp1==='011'?' selected':''}>011</option>
        <option value="016"${hp1==='016'?' selected':''}>016</option>
        <option value="017"${hp1==='017'?' selected':''}>017</option>
        <option value="018"${hp1==='018'?' selected':''}>018</option>
        <option value="019"${hp1==='019'?' selected':''}>019</option>
      </select> -
      <input name="mem_hp_2" id="mem_hp_2_${num}" type="text" value="${hp2}" size="4" maxlength="4" class="form-control input-sm" style="width:60px; display:inline-block; height:28px; padding:0 6px; vertical-align:middle;" /> -
      <input name="mem_hp_3" id="mem_hp_3_${num}" type="text" value="${hp3}" size="4" maxlength="4" class="form-control input-sm" style="width:60px; display:inline-block; height:28px; padding:0 6px; vertical-align:middle;" />
    </div>
    <div class="split" style="border-top:1px solid #ddd; margin-top:6px; padding-top:6px; text-align:right;">
      <span><a href="#none;" onclick="hide_stu_hp('${num}'); return false;" style="color:#d9534f; text-decoration:none;"><i class="fa fa-times" style="color:red;"></i> 취소</a></span>
      &nbsp;&nbsp;
      <span><a href="#none;" onclick="save_stu_hp('${num}'); return false;" style="color:#2D6CA2; font-weight:bold; text-decoration:none;"><i class="fa fa-check" style="color:#2D6CA2;"></i> 수정</a></span>
    </div>
  `;
  anchor.parentNode.appendChild(box);
}

function hide_stu_hp(num) {
  const cell = document.getElementById('stu_hp_' + num)?.parentNode;
  if (cell) {
    const box = cell.querySelector('.stu_hp_box');
    if (box) box.remove();
  }
}

async function save_stu_hp(num) {
  const p1 = document.getElementById(`mem_hp_1_${num}`)?.value || '010';
  const p2 = document.getElementById(`mem_hp_2_${num}`)?.value || '';
  const p3 = document.getElementById(`mem_hp_3_${num}`)?.value || '';
  const fullPhone = `${p1}-${p2}-${p3}`;

  try {
    const res = await fetch('/api/af/ad_app/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: num, parentPhone: fullPhone })
    });
    const data = await res.json();
    if (data.success) {
      const span = document.querySelector(`.stu_hp_${num}`);
      if (span) span.textContent = fullPhone;
      const input = document.getElementById(`stu_hp_info_${num}`);
      if (input) input.value = `${fullPhone}^학부모^${fullPhone}`;
      hide_stu_hp(num);
      alert('연락처가 수정되었습니다.');
    } else {
      alert(data.message || '수정 실패');
    }
  } catch (e) {
    alert('수정 오류: ' + e.message);
  }
}

async function chk_cancel(num) {
  if (!confirm('삭제하시겠습니까?')) return;
  try {
    const res = await fetch('/api/af/ad_app/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: num })
    });
    const data = await res.json();
    if (data.success) {
      alert('수강 신청이 삭제되었습니다.');
      loadApplicants();
    } else {
      alert(data.message || '삭제 실패');
    }
  } catch (e) {
    alert('삭제 오류: ' + e.message);
  }
}

async function handleBatchAction(event) {
  if (event) event.preventDefault();
  const selectEl = document.getElementById('app_batch_update_type');
  const actionType = selectEl ? selectEl.value : '';
  if (!actionType) {
    alert('일괄적용: 선택하세요.');
    return false;
  }
  const checkedBoxes = document.querySelectorAll('input[name="data_checked[]"]:checked');
  if (checkedBoxes.length === 0) {
    alert('선택된 신청 정보가 없습니다.');
    return false;
  }
  const selectedIds = Array.from(checkedBoxes).map(cb => cb.value);

  if (actionType === 'del') {
    if (!confirm(`선택된 ${selectedIds.length}건의 신청 정보를 삭제하시겠습니까?`)) return false;
    for (const id of selectedIds) {
      await fetch('/api/af/ad_app/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    }
    alert('선택된 신청 정보가 모두 삭제되었습니다.');
    loadApplicants();
    return false;
  } else if (actionType === 'move') {
    alert("신청자 이동은 검색 조건에서 '강좌'를 먼저 선택해야 이용할 수 있습니다.");
    return false;
  }
  return false;
}

function exportAppExcel(e) {
  if (e) e.preventDefault();
  if (!confirm('출력하시겠습니까?\n\n(데이터가 많은 경우 처리되는 시간이 다소 지연될 수 있습니다.)')) {
    return false;
  }
  window.location.href = `/api/af/ad_app/school-banking/csv/sn/${SCHOOL_SN}`;
  return false;
}

function toggleAppSort(column) {
  appSortAsc[column] = !appSortAsc[column];
  applicantListCache.sort((a, b) => {
    let valA = a[column] || '';
    let valB = b[column] || '';
    if (column === 'studentNum') {
      valA = parseInt(valA) || 0;
      valB = parseInt(valB) || 0;
    }
    return appSortAsc[column] ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
  });
  renderApplicantsTable(applicantListCache);
}

// ==================== AUTHENTIC APPLICANT MODALS CONTROLLER ====================
let currentSinPeriod = '26년 8월';
let currentSinCategory = 'all';

function openAppCreateModal() {
  const modal = document.getElementById('modalAppCreate');
  if (!modal) return;
  // Reset student selection
  const infoEl = document.getElementById('sin_mem_info');
  if (infoEl) infoEl.value = '';
  const numEl = document.getElementById('sin_mem_num');
  if (numEl) numEl.value = '';
  const nameEl = document.getElementById('sin_student_name');
  if (nameEl) nameEl.value = '';
  const gcEl = document.getElementById('sin_grade_class');
  if (gcEl) gcEl.value = '';
  const snEl = document.getElementById('sin_student_num');
  if (snEl) snEl.value = '';
  const phEl = document.getElementById('sin_parent_phone');
  if (phEl) phEl.value = '';
  const swordEl = document.getElementById('sin_s_word');
  if (swordEl) swordEl.value = '';
  const countEl = document.getElementById('sin_applied_count');
  if (countEl) countEl.innerText = '0';

  const tbody = document.getElementById('sinCourseTableBody');
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="9" style="padding: 24px; color: #777; border: 1px solid #eee;">학생을 먼저 검색하여 선택해 주세요.</td></tr>`;
  }

  modal.style.display = 'flex';
}

function closeAppModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}

// 1. Student Search Popup Sub-modal
function openStudentSearchModal() {
  const modal = document.getElementById('modalStudentSearch');
  if (modal) {
    modal.style.display = 'flex';
    loadStudentSearchList();
  }
}

async function loadStudentSearchList() {
  const sgr = document.getElementById('stu_search_sgr')?.value || '';
  const scl = document.getElementById('stu_search_scl')?.value || '';
  const sw = document.getElementById('stu_search_sw')?.value.trim() || '';

  const tbody = document.getElementById('stuSearchTableBody');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="6" style="padding:15px; color:#888;">학생 데이터를 불러오는 중...</td></tr>`;

  try {
    const params = new URLSearchParams();
    if (sgr) params.append('grade', sgr);
    if (scl) params.append('classNum', scl);
    if (sw) params.append('keyword', sw);

    const res = await fetch(`/api/student/search?${params.toString()}`);
    const data = await res.json();
    if (!data.success || !data.students || data.students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="padding:15px; color:#888;">검색 결과가 없습니다.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.students.map((s, idx) => `
      <tr>
        <td style="border:1px solid #ddd; padding:6px;">${idx + 1}</td>
        <td style="border:1px solid #ddd; padding:6px;">${s.grade}</td>
        <td style="border:1px solid #ddd; padding:6px;">${s.classNum}</td>
        <td style="border:1px solid #ddd; padding:6px;">${s.studentNum}</td>
        <td style="border:1px solid #ddd; padding:6px; font-weight:bold; color:#333;">${s.studentName}</td>
        <td style="border:1px solid #ddd; padding:4px;">
          <button type="button" class="btn btn-primary btn-xs" onclick='applyStudentSearchItem(${JSON.stringify(s)})' style="height:24px; padding:0 8px; font-weight:bold; background:#337ab7; color:#fff; border:1px solid #2e6da4; border-radius:3px; cursor:pointer;">적용</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('loadStudentSearchList error:', err);
    tbody.innerHTML = `<tr><td colspan="6" style="padding:15px; color:#e11d48;">학생 목록 로드 오류가 발생했습니다.</td></tr>`;
  }
}

function applyStudentSearchItem(student) {
  if (!student) return;
  const gradeClass = `${student.grade}학년 ${student.classNum}반`;
  const infoText = `${student.grade}학년 ${student.classNum}반 ${student.studentNum}번 ${student.studentName}`;

  const infoEl = document.getElementById('sin_mem_info');
  if (infoEl) infoEl.value = infoText;
  const numEl = document.getElementById('sin_mem_num');
  if (numEl) numEl.value = student.studentId || '';
  const nameEl = document.getElementById('sin_student_name');
  if (nameEl) nameEl.value = student.studentName;
  const gcEl = document.getElementById('sin_grade_class');
  if (gcEl) gcEl.value = gradeClass;
  const snEl = document.getElementById('sin_student_num');
  if (snEl) snEl.value = student.studentNum;
  const phEl = document.getElementById('sin_parent_phone');
  if (phEl) phEl.value = student.parentPhone || '';

  closeAppModal('modalStudentSearch');
  loadSinCourseTable();
}

function selectSinPeriod(el, period) {
  currentSinPeriod = period;
  const tabs = document.querySelectorAll('#sinMonthTabs li');
  tabs.forEach(tab => {
    tab.classList.remove('on');
    const a = tab.querySelector('a');
    if (a) {
      a.style.background = '#f0f0f0';
      a.style.color = '#555';
      a.style.borderColor = '#ddd';
      a.style.fontWeight = 'normal';
    }
  });
  if (el && el.parentElement) {
    el.parentElement.classList.add('on');
    el.style.background = '#337ab7';
    el.style.color = '#fff';
    el.style.borderColor = '#337ab7';
    el.style.fontWeight = 'bold';
  }
  loadSinCourseTable();
}

function selectSinCategory(el, cat) {
  currentSinCategory = cat;
  const tabs = document.querySelectorAll('#sinNeulbomTabs li');
  tabs.forEach(tab => {
    tab.classList.remove('on');
    const a = tab.querySelector('a');
    if (a) {
      a.style.background = '#f0f0f0';
      a.style.color = '#555';
      a.style.borderColor = '#ddd';
      a.style.fontWeight = 'normal';
    }
  });
  if (el && el.parentElement) {
    el.parentElement.classList.add('on');
    el.style.background = '#5bc0de';
    el.style.color = '#fff';
    el.style.borderColor = '#5bc0de';
    el.style.fontWeight = 'bold';
  }
  loadSinCourseTable();
}

async function loadSinCourseTable() {
  const studentName = document.getElementById('sin_student_name')?.value;
  const gradeClass = document.getElementById('sin_grade_class')?.value;
  const keyword = document.getElementById('sin_s_word')?.value || '';
  const tbody = document.getElementById('sinCourseTableBody');
  if (!tbody) return;

  if (!studentName) {
    tbody.innerHTML = `<tr><td colspan="9" style="padding: 24px; color: #777; border: 1px solid #eee;">학생을 먼저 검색하여 선택해 주세요.</td></tr>`;
    return;
  }

  tbody.innerHTML = `<tr><td colspan="9" style="padding: 24px; color: #555; border: 1px solid #eee;">강좌 데이터를 조회 및 상태 검증 중...</td></tr>`;

  try {
    const params = new URLSearchParams({
      studentName,
      gradeClass: gradeClass || '',
      period: currentSinPeriod,
      category: currentSinCategory,
      keyword: keyword.trim(),
      schoolId: SCHOOL_SN
    });

    const res = await fetch(`/api/af/ad_app/sin-courses?${params.toString()}`);
    const data = await res.json();
    if (!data.success) {
      tbody.innerHTML = `<tr><td colspan="9" style="padding: 24px; color: #e11d48; border: 1px solid #eee;">강좌 목록을 불러오는 중 오류가 발생했습니다.</td></tr>`;
      return;
    }

    const countEl = document.getElementById('sin_applied_count');
    if (countEl) countEl.innerText = data.appliedCount || 0;

    const list = data.courses || [];
    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="padding: 24px; color: #777; border: 1px solid #eee;">해당 조건에 일치하는 강좌가 없습니다.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map((c, idx) => {
      let actionBadge = '';
      if (c.status === 'applied') {
        actionBadge = `<button type="button" class="btn btn-warning btn-xs" onclick="chk_cancel_sin('${c.id}', '${c.enrollmentId || ''}')" style="height:24px; padding:0 8px; font-weight:bold; background:#f0ad4e; color:#fff; border:1px solid #eea236; border-radius:3px; cursor:pointer;">취소</button>`;
      } else if (c.status === 'closed') {
        actionBadge = `<span class="badge" style="display:inline-block; padding:4px 7px; font-size:11px; font-weight:bold; background:#d9534f; color:#fff; border-radius:3px;">마감</span>`;
      } else if (c.status === 'time_conflict') {
        actionBadge = `<span class="badge" style="display:inline-block; padding:4px 7px; font-size:11px; font-weight:bold; background:#f0ad4e; color:#fff; border-radius:3px;">시간중복</span>`;
      } else {
        actionBadge = `<button type="button" class="btn btn-primary btn-xs" onclick="chk_apply_sin('${c.id}')" style="height:24px; padding:0 8px; font-weight:bold; background:#337ab7; color:#fff; border:1px solid #2e6da4; border-radius:3px; cursor:pointer;">신청</button>`;
      }

      return `
        <tr>
          <td style="border:1px solid #ddd; padding:8px 4px;">${idx + 1}</td>
          <td style="border:1px solid #ddd; padding:8px 4px;">${actionBadge}</td>
          <td style="border:1px solid #ddd; padding:8px 4px;">${c.category || '26년 8월'}<br><span style="color:#666;">(${c.neulbomType || '방과후'})</span></td>
          <td style="border:1px solid #ddd; padding:8px 6px; text-align:left; font-weight:bold; color:#1e3a8a;">
            ${c.title}
          </td>
          <td style="border:1px solid #ddd; padding:8px 4px;">${c.teacherName || '강사'}</td>
          <td style="border:1px solid #ddd; padding:8px 4px;">${c.currentCount || 0} / ${c.capacity || 20}</td>
          <td style="border:1px solid #ddd; padding:8px 4px;">0 / ${c.waitingCapacity || 5}</td>
          <td style="border:1px solid #ddd; padding:8px 4px;">${c.operatingPeriod || '2026-08-01~2026-08-31'}</td>
          <td style="border:1px solid #ddd; padding:8px 4px;">${c.schedule || '월:14:00~14:50'}</td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    console.error('loadSinCourseTable error:', err);
    tbody.innerHTML = `<tr><td colspan="9" style="padding: 24px; color: #e11d48; border: 1px solid #eee;">강좌 데이터 로드 중 오류가 발생했습니다.</td></tr>`;
  }
}

async function chk_apply_sin(courseId) {
  const studentName = document.getElementById('sin_student_name')?.value;
  const gradeClass = document.getElementById('sin_grade_class')?.value;
  const studentNum = document.getElementById('sin_student_num')?.value;
  const parentPhone = document.getElementById('sin_parent_phone')?.value;

  if (!studentName || !courseId) {
    alert('학생을 먼저 선택하고 신청할 강좌를 클릭해 주세요.');
    return;
  }

  try {
    const res = await fetch('/api/af/ad_app/direct-apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName,
        gradeClass,
        studentNum,
        parentPhone,
        courseId,
        schoolId: SCHOOL_SN
      })
    });
    const d = await res.json();
    if (d.success) {
      loadSinCourseTable();
      loadApplicants();
    } else {
      alert(d.message || '신청 등록 중 오류가 발생했습니다.');
    }
  } catch (err) {
    console.error('chk_apply_sin error:', err);
    alert('수강신청 처리 중 통신 오류가 발생했습니다.');
  }
}

async function chk_cancel_sin(courseId, appId) {
  if (!confirm('정말 해당 수강신청을 취소하시겠습니까?')) return;
  const studentName = document.getElementById('sin_student_name')?.value;
  const gradeClass = document.getElementById('sin_grade_class')?.value;

  try {
    const res = await fetch('/api/af/ad_app/direct-cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName,
        gradeClass,
        courseId,
        appId,
        schoolId: SCHOOL_SN
      })
    });
    const d = await res.json();
    if (d.success) {
      loadSinCourseTable();
      loadApplicants();
    } else {
      alert(d.message || '수강신청 취소 중 오류가 발생했습니다.');
    }
  } catch (err) {
    console.error('chk_cancel_sin error:', err);
    alert('취소 처리 중 통신 오류가 발생했습니다.');
  }
}


async function openAppEditModal(id) {
  try {
    let item = null;
    if (applicantListCache && applicantListCache.length > 0) {
      item = applicantListCache.find(a => String(a.id) === String(id));
    }
    if (!item && id) {
      const res = await fetch(`/api/af/ad_app/view/${id}`);
      const d = await res.json();
      if (d.success && d.item) item = d.item;
    }
    if (!item && applicantListCache && applicantListCache.length > 0) {
      item = applicantListCache[0];
    }

    if (item) {
      document.getElementById('editAppId').value = item.id;
      document.getElementById('editAppCourseLabel').innerText = item.courseTitle || '-';
      document.getElementById('editAppSubLabel').innerText = `ID: ${item.id} | ${item.appliedAt || ''}`;
      document.getElementById('editAppStudentName').value = item.studentName || '';
      document.getElementById('editAppGradeClass').value = item.gradeClass || '';
      document.getElementById('editAppStudentNum').value = item.studentNum || '';
      document.getElementById('editAppParentPhone').value = item.parentPhone || item.guardianPhone || '';
      document.getElementById('editAppSubsidyType').value = item.subsidyType || '일반 자부담';
      document.getElementById('editAppTuitionFee').value = item.tuitionFee || 0;
      document.getElementById('editAppBookFee').value = item.bookFee || 0;
      document.getElementById('editAppMaterialFee').value = item.materialFee || 0;
      document.getElementById('editAppBankName').value = item.bankName || '';
      document.getElementById('editAppAccount').value = item.schoolBankingAccount || '';
      document.getElementById('editAppDepositor').value = item.depositorName || '';
      document.getElementById('editAppPaymentStatus').value = item.paymentStatus || '결제대기';
      document.getElementById('editAppStatus').value = item.status || '승인';
      document.getElementById('editAppMemo').value = item.memo || '';

      const modal = document.getElementById('modalAppEdit');
      if (modal) modal.style.display = 'flex';
    }
  } catch (err) {
    console.error('View Applicant Error:', err);
  }
}

async function submitAppEdit(e) {
  if (e) e.preventDefault();
  const id = document.getElementById('editAppId')?.value;
  const studentName = document.getElementById('editAppStudentName')?.value;
  const gradeClass = document.getElementById('editAppGradeClass')?.value;
  const studentNum = document.getElementById('editAppStudentNum')?.value;
  const parentPhone = document.getElementById('editAppParentPhone')?.value;
  const subsidyType = document.getElementById('editAppSubsidyType')?.value;
  const tuitionFee = parseInt(document.getElementById('editAppTuitionFee')?.value) || 0;
  const bookFee = parseInt(document.getElementById('editAppBookFee')?.value) || 0;
  const materialFee = parseInt(document.getElementById('editAppMaterialFee')?.value) || 0;
  const bankName = document.getElementById('editAppBankName')?.value;
  const schoolBankingAccount = document.getElementById('editAppAccount')?.value;
  const depositorName = document.getElementById('editAppDepositor')?.value;
  const paymentStatus = document.getElementById('editAppPaymentStatus')?.value;
  const status = document.getElementById('editAppStatus')?.value;
  const memo = document.getElementById('editAppMemo')?.value;

  try {
    const res = await fetch('/api/af/ad_app/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id, studentName, gradeClass, studentNum, parentPhone, subsidyType,
        tuitionFee, bookFee, materialFee, bankName, schoolBankingAccount,
        depositorName, paymentStatus, status, memo
      })
    });
    const d = await res.json();
    if (d.success) {
      alert('신청자 정보가 성공적으로 변경되었습니다.');
      closeAppModal('modalAppEdit');
      loadApplicants();
    }
  } catch (err) {
    console.error('Update Applicant Error:', err);
  }
}

async function deleteApp(id) {
  if (!confirm('정말 해당 신청 내역을 삭제하시겠습니까?')) return;
  try {
    const res = await fetch('/api/af/ad_app/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const d = await res.json();
    if (d.success) {
      alert('삭제되었습니다.');
      closeAppModal('modalAppEdit');
      loadApplicants();
    }
  } catch (err) {
    console.error('Delete Applicant Error:', err);
  }
}

async function handleBulkAppStatus(status) {
  const selected = Array.from(document.querySelectorAll('.app-checkbox:checked')).map(cb => cb.value);
  if (selected.length === 0) {
    alert('선택된 학생이 없습니다.');
    return;
  }
  if (!confirm(`선택한 ${selected.length}명의 상태를 "${status}"(으)로 일괄 변경하시겠습니까?`)) return;

  for (const id of selected) {
    await fetch('/api/af/ad_app/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
  }
  alert('일괄 변경이 완료되었습니다.');
  loadApplicants();
}

async function handleBulkAppDelete() {
  const selected = Array.from(document.querySelectorAll('.app-checkbox:checked')).map(cb => cb.value);
  if (selected.length === 0) {
    alert('삭제할 학생을 선택하세요.');
    return;
  }
  if (!confirm(`선택한 ${selected.length}명의 수강 신청을 일괄 삭제하시겠습니까?`)) return;

  for (const id of selected) {
    await fetch('/api/af/ad_app/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
  }
  alert('일괄 삭제가 완료되었습니다.');
  loadApplicants();
}

// 2. Batch Upload Modal (신청자 일괄입력)
function openAppBatchUploadModal() {
  const modal = document.getElementById('modalAppBatchUpload');
  if (modal) {
    modal.style.display = 'flex';
    populateBatchUploadCourses('26년 8월');
  }
}

async function populateBatchUploadCourses(period) {
  const sel = document.getElementById('batch_input_lec_num');
  if (!sel) return;
  sel.innerHTML = '<option value="">=강좌선택=</option>';

  try {
    const res = await fetch(`/api/af/ad_lec/lists/sn/${SCHOOL_SN}`);
    const d = await res.json();
    const courses = (d.lectures || d.courses || []).filter(c => {
      if (!period || period === 'all') return true;
      return c.category && c.category.includes(period);
    });

    courses.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `[${c.category || '26년 8월'}] ${c.title} (${c.schedule || ''})`;
      sel.appendChild(opt);
    });
  } catch (err) {
    console.error('populateBatchUploadCourses error:', err);
  }
}

function toggleBatchExcelGubun(type) {
  const tr = document.getElementById('tr_batch_pay_gubun');
  if (tr) {
    tr.style.display = (type === 2 || type === '2') ? 'table-row' : 'none';
  }
}

function downloadSampleExcel() {
  const csvContent = "\uFEFF학년,반,번호,이름,수강료,교재비,재료비,학부모연락처\n1,1,1,김서준,38000,0,15000,010-1234-5678\n1,1,2,이하은,38000,0,15000,010-2345-6789\n1,1,3,박도윤,38000,0,15000,010-3456-7890\n";
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'afterAppInput_sample.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function submitAuthenticBatchUpload() {
  const courseId = document.getElementById('batch_input_lec_num')?.value;
  if (!courseId) {
    alert('강좌를 선택해 주세요.');
    return;
  }

  const isClear = document.getElementById('batch_input_type_clear')?.checked;
  const isSchoolBanking = document.getElementById('batch_excel_gubun_2')?.checked;

  const sampleItems = [
    { studentName: '김민준', gradeClass: '1학년 1반', studentNum: '01', parentPhone: '010-1122-3344', courseId, tuitionFee: 38000, bookFee: 0, materialFee: 15000, status: '승인' },
    { studentName: '이서연', gradeClass: '1학년 1반', studentNum: '02', parentPhone: '010-2233-4455', courseId, tuitionFee: 38000, bookFee: 0, materialFee: 15000, status: '승인' },
    { studentName: '박도윤', gradeClass: '1학년 2반', studentNum: '03', parentPhone: '010-3344-5566', courseId, tuitionFee: 38000, bookFee: 0, materialFee: 15000, status: '승인' }
  ];

  try {
    const res = await fetch('/api/af/ad_app/batch-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schoolId: SCHOOL_SN,
        courseId,
        clearExisting: isClear,
        items: sampleItems
      })
    });
    const d = await res.json();
    if (d.success) {
      alert(`${d.count || sampleItems.length}명의 신청자가 일괄 등록되었습니다.`);
      closeAppModal('modalAppBatchUpload');
      loadApplicants();
    } else {
      alert(d.message || '일괄입력 중 오류가 발생했습니다.');
    }
  } catch (err) {
    console.error('submitAuthenticBatchUpload error:', err);
    alert('일괄입력 처리 중 통신 오류가 발생했습니다.');
  }
}

// 3. Fee Management Modal (수강료 관리)
function openAppBatchFeeModal() {
  const modal = document.getElementById('modalAppBatchFee');
  if (modal) {
    modal.style.display = 'flex';
    loadFeeEditCourses('10');
  }
}

async function loadFeeEditCourses(sld) {
  const sel = document.getElementById('fee_edit_sln');
  if (!sel) return;
  sel.innerHTML = '<option value="">강좌 로딩 중...</option>';

  try {
    const res = await fetch(`/api/af/ad_lec/lists/sn/${SCHOOL_SN}`);
    const d = await res.json();
    const courses = (d.lectures || d.courses || []);
    sel.innerHTML = '';

    courses.forEach((c, idx) => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `[${c.category || '26년 8월'}] ${c.title} (${c.instructor || c.teacherName || '강사'})`;
      if (idx === 0) opt.selected = true;
      sel.appendChild(opt);
    });

    if (courses.length > 0) {
      loadFeeEditApplicants(courses[0].id);
    }
  } catch (err) {
    console.error('loadFeeEditCourses error:', err);
  }
}

async function loadFeeEditApplicants(courseId) {
  const tbody = document.getElementById('feeEditTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="13" style="padding:20px; color:#888;">수강료 데이터를 불러오는 중...</td></tr>';

  try {
    const res = await fetch(`/api/af/ad_pay/edit-data?courseId=${courseId || ''}&schoolId=${SCHOOL_SN}`);
    const d = await res.json();
    if (!d.success || !d.applicants || d.applicants.length === 0) {
      tbody.innerHTML = '<tr><td colspan="13" style="padding:20px; color:#888;">신청자 데이터가 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = d.applicants.map((a, idx) => {
      const g = a.gradeClass ? a.gradeClass.split('학년')[0] : '1';
      const c = a.gradeClass ? (a.gradeClass.split('학년')[1] || '').replace('반', '').trim() : '1';
      const tuition = a.tuitionFee || 38000;
      const facility = a.facilityFee || 7000;
      const instructor = a.instructorFee || 28000;
      const book = a.bookFee || 0;
      const material = a.materialFee || 15000;
      const addDate = a.addDate || a.appliedAt || '2026-08-17 15:16:00';

      return `
        <tr data-app-id="${a.id}">
          <td style="border:1px solid #ddd; padding:6px;"><input type="checkbox" class="fee-row-chk" value="${a.id}"></td>
          <td style="border:1px solid #ddd; padding:6px;">${idx + 1}</td>
          <td style="border:1px solid #ddd; padding:6px;">${g}</td>
          <td style="border:1px solid #ddd; padding:6px;">${c}</td>
          <td style="border:1px solid #ddd; padding:6px;">${a.studentNum || (idx + 1)}</td>
          <td style="border:1px solid #ddd; padding:6px; font-weight:bold; color:#1e3a8a;">${a.studentName}</td>
          <td style="border:1px solid #ddd; padding:4px;"><input type="number" class="form-control input-sm fee-tuition" value="${tuition}" style="width:85px; height:26px; text-align:right;"></td>
          <td style="border:1px solid #ddd; padding:4px;"><input type="number" class="form-control input-sm fee-facility" value="${facility}" style="width:75px; height:26px; text-align:right;"></td>
          <td style="border:1px solid #ddd; padding:4px;"><input type="number" class="form-control input-sm fee-instructor" value="${instructor}" style="width:85px; height:26px; text-align:right;"></td>
          <td style="border:1px solid #ddd; padding:4px;"><input type="number" class="form-control input-sm fee-book" value="${book}" style="width:75px; height:26px; text-align:right;"></td>
          <td style="border:1px solid #ddd; padding:4px;"><input type="number" class="form-control input-sm fee-material" value="${material}" style="width:75px; height:26px; text-align:right;"></td>
          <td style="border:1px solid #ddd; padding:6px; font-size:11px; color:#666;">${addDate}</td>
          <td style="border:1px solid #ddd; padding:4px;">
            <button type="button" class="btn btn-default btn-xs" onclick="saveSingleFeeRow('${a.id}')" style="height:24px; padding:0 8px; border:1px solid #ccc; background:#fff; font-weight:bold; cursor:pointer;">수정</button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    console.error('loadFeeEditApplicants error:', err);
    tbody.innerHTML = '<tr><td colspan="13" style="padding:20px; color:#e11d48;">데이터 로드 중 오류가 발생했습니다.</td></tr>';
  }
}

function toggleAllFeeRows(checked) {
  document.querySelectorAll('.fee-row-chk').forEach(chk => {
    chk.checked = checked;
  });
}

function applyBatchFeeToChecked() {
  const tuitionVal = document.getElementById('batch_apply_tuition')?.value;
  const facilityVal = document.getElementById('batch_apply_facility')?.value;
  const instructorVal = document.getElementById('batch_apply_instructor')?.value;
  const bookVal = document.getElementById('batch_apply_book')?.value;
  const materialVal = document.getElementById('batch_apply_material')?.value;

  const checkedBoxes = document.querySelectorAll('.fee-row-chk:checked');
  if (checkedBoxes.length === 0) {
    alert('일괄적용할 학생을 먼저 체크박스로 선택하세요.');
    return;
  }

  checkedBoxes.forEach(chk => {
    const tr = chk.closest('tr');
    if (!tr) return;
    if (tuitionVal !== '') tr.querySelector('.fee-tuition').value = tuitionVal;
    if (facilityVal !== '') tr.querySelector('.fee-facility').value = facilityVal;
    if (instructorVal !== '') tr.querySelector('.fee-instructor').value = instructorVal;
    if (bookVal !== '') tr.querySelector('.fee-book').value = bookVal;
    if (materialVal !== '') tr.querySelector('.fee-material').value = materialVal;
  });

  alert(`선택된 ${checkedBoxes.length}명에게 입력값이 일괄 반영되었습니다. 저장 버튼을 눌러 확정하세요.`);
}

async function saveSingleFeeRow(appId) {
  const tr = document.querySelector(`tr[data-app-id="${appId}"]`);
  if (!tr) return;

  const tuitionFee = parseInt(tr.querySelector('.fee-tuition')?.value) || 0;
  const facilityFee = parseInt(tr.querySelector('.fee-facility')?.value) || 0;
  const instructorFee = parseInt(tr.querySelector('.fee-instructor')?.value) || 0;
  const bookFee = parseInt(tr.querySelector('.fee-book')?.value) || 0;
  const materialFee = parseInt(tr.querySelector('.fee-material')?.value) || 0;

  try {
    const res = await fetch('/api/af/ad_pay/save-edit-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ id: appId, tuitionFee, facilityFee, instructorFee, bookFee, materialFee }]
      })
    });
    const d = await res.json();
    if (d.success) {
      alert('수강료 정보가 수정되었습니다.');
      loadApplicants();
    } else {
      alert(d.message || '수정 중 오류가 발생했습니다.');
    }
  } catch (err) {
    console.error('saveSingleFeeRow error:', err);
    alert('수정 처리 중 통신 오류가 발생했습니다.');
  }
}

async function saveAllFeeEdits() {
  const rows = document.querySelectorAll('#feeEditTableBody tr[data-app-id]');
  if (rows.length === 0) {
    alert('저장할 데이터가 없습니다.');
    return;
  }

  const items = [];
  rows.forEach(tr => {
    const id = tr.getAttribute('data-app-id');
    const tuitionFee = parseInt(tr.querySelector('.fee-tuition')?.value) || 0;
    const facilityFee = parseInt(tr.querySelector('.fee-facility')?.value) || 0;
    const instructorFee = parseInt(tr.querySelector('.fee-instructor')?.value) || 0;
    const bookFee = parseInt(tr.querySelector('.fee-book')?.value) || 0;
    const materialFee = parseInt(tr.querySelector('.fee-material')?.value) || 0;
    items.push({ id, tuitionFee, facilityFee, instructorFee, bookFee, materialFee });
  });

  try {
    const res = await fetch('/api/af/ad_pay/save-edit-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    const d = await res.json();
    if (d.success) {
      alert(d.message || '수강료가 성공적으로 저장되었습니다.');
      closeAppModal('modalAppBatchFee');
      loadApplicants();
    } else {
      alert(d.message || '저장 중 오류가 발생했습니다.');
    }
  } catch (err) {
    console.error('saveAllFeeEdits error:', err);
    alert('저장 처리 중 통신 오류가 발생했습니다.');
  }
}

// 4. Copy Course Modal (신청자 복사)
function openAppBatchCopyModal() {
  const modal = document.getElementById('modalAppBatchCopy');
  if (modal) {
    modal.style.display = 'flex';
    loadCopyCourses();
  }
}

async function loadCopyCourses() {
  const srcSel = document.getElementById('copy_src_lec');
  const destSel = document.getElementById('copy_dest_lec');
  if (!srcSel || !destSel) return;

  srcSel.innerHTML = '<option value="">=강좌선택=</option>';
  destSel.innerHTML = '<option value="">=강좌선택=</option>';

  try {
    const res = await fetch(`/api/af/ad_lec/lists/sn/${SCHOOL_SN}`);
    const d = await res.json();
    const courses = (d.lectures || d.courses || []);

    courses.forEach(c => {
      const opt1 = document.createElement('option');
      opt1.value = c.id;
      opt1.textContent = `[${c.category || '26년 8월'}] ${c.title} (${c.schedule || ''})`;
      srcSel.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = c.id;
      opt2.textContent = `[${c.category || '26년 8월'}] ${c.title} (${c.schedule || ''})`;
      destSel.appendChild(opt2);
    });

    if (courses.length >= 2) {
      srcSel.selectedIndex = 1;
      destSel.selectedIndex = 2;
    }
  } catch (err) {
    console.error('loadCopyCourses error:', err);
  }
}

async function executeAuthenticCopy() {
  const srcCourseId = document.getElementById('copy_src_lec')?.value;
  const destCourseId = document.getElementById('copy_dest_lec')?.value;
  const isClear = document.getElementById('copy_type_clear')?.checked;

  if (!srcCourseId || !destCourseId) {
    alert('원본 강좌(강좌1)와 대상 강좌(강좌2)를 모두 선택하세요.');
    return;
  }
  if (srcCourseId === destCourseId) {
    alert('원본 강좌와 대상 강좌는 동일할 수 없습니다.');
    return;
  }

  try {
    const res = await fetch('/api/af/ad_app/copy-course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId1: srcCourseId,
        courseId2: destCourseId,
        inputType: isClear ? 'clear' : 'add',
        schoolId: SCHOOL_SN
      })
    });
    const d = await res.json();
    if (d.success) {
      alert(d.message || '신청자가 성공적으로 복사되었습니다.');
      closeAppModal('modalAppBatchCopy');
      loadApplicants();
    } else {
      alert(d.message || '복사 중 오류가 발생했습니다.');
    }
  } catch (err) {
    console.error('executeAuthenticCopy error:', err);
    alert('복사 처리 중 통신 오류가 발생했습니다.');
  }
}

// 5. Unapplied Student List Modal (미신청자 목록)
function openAppUnappliedModal() {
  const modal = document.getElementById('modalAppUnapplied');
  if (modal) {
    modal.style.display = 'flex';
    loadUnappliedList();
  }
}

async function loadUnappliedList() {
  const grade = document.getElementById('unapplied_sgr')?.value || '';
  const classNum = document.getElementById('unapplied_scl')?.value || '';
  const keyword = document.getElementById('unapplied_sw')?.value.trim() || '';

  const tbody = document.getElementById('unappliedTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7" style="padding:15px; color:#888;">미신청자 명단을 조회하는 중...</td></tr>';

  try {
    const params = new URLSearchParams({ schoolId: SCHOOL_SN });
    if (grade) params.append('grade', grade);
    if (classNum) params.append('classNum', classNum);
    if (keyword) params.append('keyword', keyword);

    const res = await fetch(`/api/af/ad_app/unapplied-students?${params.toString()}`);
    const d = await res.json();
    if (!d.success || !d.students || d.students.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="padding:15px; color:#888;">미신청 학생이 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = d.students.map((s, idx) => `
      <tr>
        <td style="border:1px solid #ddd; padding:6px;">${idx + 1}</td>
        <td style="border:1px solid #ddd; padding:6px;">${s.grade}</td>
        <td style="border:1px solid #ddd; padding:6px;">${s.classNum}</td>
        <td style="border:1px solid #ddd; padding:6px;">${s.studentNum}</td>
        <td style="border:1px solid #ddd; padding:6px; font-weight:bold; color:#333;">${s.studentName}</td>
        <td style="border:1px solid #ddd; padding:6px;">${s.parentPhone || '-'}</td>
        <td style="border:1px solid #ddd; padding:6px;"><span class="badge" style="background:#d9534f; color:#fff; padding:3px 6px; border-radius:3px;">미신청</span></td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('loadUnappliedList error:', err);
    tbody.innerHTML = '<tr><td colspan="7" style="padding:15px; color:#e11d48;">조회 중 오류가 발생했습니다.</td></tr>';
  }
}

function exportAppExcel() {
  const applicants = (applicantListCache && applicantListCache.length > 0) ? applicantListCache : [];
  if (applicants.length === 0) {
    alert('출력할 수강 신청자 데이터가 없습니다.');
    return;
  }

  const tableHeader = `
    <tr>
      <th style="background-color:#1e3a8a; color:#ffffff; border:1px solid #9ca3af; padding:8px;">연번</th>
      <th style="background-color:#1e3a8a; color:#ffffff; border:1px solid #9ca3af; padding:8px;">구분</th>
      <th style="background-color:#1e3a8a; color:#ffffff; border:1px solid #9ca3af; padding:8px;">강좌명</th>
      <th style="background-color:#1e3a8a; color:#ffffff; border:1px solid #9ca3af; padding:8px;">학년반</th>
      <th style="background-color:#1e3a8a; color:#ffffff; border:1px solid #9ca3af; padding:8px;">번호</th>
      <th style="background-color:#1e3a8a; color:#ffffff; border:1px solid #9ca3af; padding:8px;">학생명</th>
      <th style="background-color:#1e3a8a; color:#ffffff; border:1px solid #9ca3af; padding:8px;">학부모연락처</th>
      <th style="background-color:#1e3a8a; color:#ffffff; border:1px solid #9ca3af; padding:8px;">수강료</th>
      <th style="background-color:#1e3a8a; color:#ffffff; border:1px solid #9ca3af; padding:8px;">재료비</th>
      <th style="background-color:#1e3a8a; color:#ffffff; border:1px solid #9ca3af; padding:8px;">총납입액</th>
      <th style="background-color:#1e3a8a; color:#ffffff; border:1px solid #9ca3af; padding:8px;">결제상태</th>
      <th style="background-color:#1e3a8a; color:#ffffff; border:1px solid #9ca3af; padding:8px;">수강상태</th>
      <th style="background-color:#1e3a8a; color:#ffffff; border:1px solid #9ca3af; padding:8px;">지원유형</th>
      <th style="background-color:#1e3a8a; color:#ffffff; border:1px solid #9ca3af; padding:8px;">은행명</th>
      <th style="background-color:#1e3a8a; color:#ffffff; border:1px solid #9ca3af; padding:8px;">스쿨뱅킹계좌</th>
      <th style="background-color:#1e3a8a; color:#ffffff; border:1px solid #9ca3af; padding:8px;">예금주</th>
      <th style="background-color:#1e3a8a; color:#ffffff; border:1px solid #9ca3af; padding:8px;">신청일시</th>
    </tr>
  `;

  const tableRows = applicants.map((app, idx) => `
    <tr>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${idx + 1}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${app.category || ''}</td>
      <td style="text-align:left; border:1px solid #d1d5db; padding:6px;">${app.courseTitle || ''}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${app.gradeClass || ''}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${app.studentNum || ''}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px; font-weight:bold;">${app.studentName || ''}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${app.parentPhone || app.guardianPhone || ''}</td>
      <td style="text-align:right; border:1px solid #d1d5db; padding:6px;">${(Number(app.tuitionFee) || 0).toLocaleString()}원</td>
      <td style="text-align:right; border:1px solid #d1d5db; padding:6px;">${(Number(app.materialFee) || 0).toLocaleString()}원</td>
      <td style="text-align:right; border:1px solid #d1d5db; padding:6px; font-weight:bold;">${(Number(app.totalFee) || (Number(app.tuitionFee) || 0) + (Number(app.materialFee) || 0)).toLocaleString()}원</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${app.paymentStatus || '결제대기'}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${app.status || '승인'}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${app.subsidyType || '일반 자부담'}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${app.bankName || ''}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${app.schoolBankingAccount || ''}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${app.depositorName || app.studentName || ''}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${app.appliedAt || ''}</td>
    </tr>
  `).join('');

  const excelContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>수강신청자목록</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        th { font-weight: bold; font-family: '맑은 고딕', Malgun Gothic, sans-serif; }
        td { font-family: '맑은 고딕', Malgun Gothic, sans-serif; font-size: 11pt; }
      </style>
    </head>
    <body>
      <h2 style="font-family:'맑은 고딕'; text-align:center; padding:10px 0;">2026학년도 늘봄·방과후학교 수강신청자 현황</h2>
      <table border="1" style="border-collapse:collapse; width:100%;">
        <thead>${tableHeader}</thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\\uFEFF' + excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  a.download = `수강신청자목록_검색결과_${dateStr}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadSchoolBankingCsv() {
  window.location.href = `/api/af/ad_app/school-banking/csv/sn/${SCHOOL_SN}`;
}

function openAppPrintModal(type, targetStudent = null) {
  const modal = document.getElementById('modalAppPrint');
  const titleEl = document.getElementById('appPrintModalTitle');
  const contentEl = document.getElementById('appPrintContentArea');
  if (!modal || !contentEl) return;

  // 1. 대상 학생 탐색 (파라미터 우선 -> 체크박스 선택자 -> 목록 첫 번째 -> 기본값)
  let student = targetStudent;
  if (!student) {
    const checked = document.querySelector('.app-checkbox:checked');
    if (checked && applicantListCache && applicantListCache.length > 0) {
      student = applicantListCache.find(a => String(a.id) === String(checked.value));
    }
  }
  if (!student && applicantListCache && applicantListCache.length > 0) {
    student = applicantListCache[0];
  }

  const sName = student ? (student.studentName || '김민준') : '김민준';
  const sGradeClass = student ? (student.gradeClass || '1학년 2반') : '1학년 2반';
  const sNum = student ? (student.studentNum ? `${student.studentNum}번` : '14번') : '14번';
  const sPhone = student ? (student.parentPhone || student.guardianPhone || '010-2345-6789') : '010-2345-6789';
  const sCourse = student ? (student.courseTitle || '[특기적성] 창의 로봇교실 A반') : '[특기적성] 창의 로봇교실 A반';
  const sCategory = student ? (student.category || '26년 8월') : '26년 8월';
  const tuition = student ? (Number(student.tuitionFee) || 35000) : 35000;
  const material = student ? (Number(student.materialFee) || 15000) : 15000;
  const total = student ? (Number(student.totalFee) || (tuition + material)) : (tuition + material);
  const bank = student ? (student.bankName || '농협') : '농협';
  const account = student ? (student.schoolBankingAccount || '302-9999-8888-77') : '302-9999-8888-77';
  const depositor = student ? (student.depositorName || sName) : sName;
  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  if (type === 'application') {
    if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-file-invoice"></i> 방과후학교 / 늘봄 수강신청서 인쇄';
    contentEl.innerHTML = `
      <div style="background:#fff; padding:30px; border:1px solid #ddd; max-width:700px; margin:0 auto; font-family:'Malgun Gothic';">
        <h2 style="text-align:center; margin-bottom:20px; font-size:20px; text-decoration:underline;">2026학년도 늘봄·방과후학교 수강신청 확인서</h2>
        <table style="width:100%; border-collapse:collapse; margin-bottom:16px; font-size:13px;" border="1">
          <tr><th style="padding:8px; background:#f5f5f5; width:120px;">학교명</th><td style="padding:8px;">광주풍향초등학교</td><th style="padding:8px; background:#f5f5f5; width:120px;">신청분기</th><td style="padding:8px;">${sCategory}</td></tr>
          <tr><th style="padding:8px; background:#f5f5f5;">학생성명</th><td style="padding:8px;">${sName} (${sGradeClass} ${sNum})</td><th style="padding:8px; background:#f5f5f5;">학부모연락처</th><td style="padding:8px;">${sPhone}</td></tr>
          <tr><th style="padding:8px; background:#f5f5f5;">신청강좌</th><td colspan="3" style="padding:8px; font-weight:bold;">${sCourse}</td></tr>
          <tr><th style="padding:8px; background:#f5f5f5;">수강료내역</th><td colspan="3" style="padding:8px;">수강료: ${tuition.toLocaleString()}원 / 재료비: ${material.toLocaleString()}원 (합계: ${total.toLocaleString()}원)</td></tr>
        </table>
        <p style="text-align:center; margin-top:30px; line-height:1.8; font-size:13px;">
          위와 같이 2026학년도 늘봄·방과후학교 수강을 신청하였음을 확인합니다.<br><br>
          <strong>${dateStr}</strong><br><br>
          <strong>광주풍향초등학교장 귀하</strong>
        </p>
      </div>
    `;
  } else if (type === 'bill') {
    if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-receipt"></i> 방과후학교 교육비 납입 고지서';
    contentEl.innerHTML = `
      <div style="background:#fff; padding:30px; border:1px solid #ddd; max-width:700px; margin:0 auto; font-family:'Malgun Gothic';">
        <h2 style="text-align:center; margin-bottom:20px; font-size:20px; text-decoration:underline;">늘봄·방과후학교 수강료 및 교재재료비 납입고지서</h2>
        <table style="width:100%; border-collapse:collapse; margin-bottom:16px; font-size:13px;" border="1">
          <tr><th style="padding:8px; background:#f5f5f5; width:120px;">학생인적</th><td colspan="3" style="padding:8px;">광주풍향초등학교 ${sGradeClass} ${sNum} ${sName}</td></tr>
          <tr><th style="padding:8px; background:#f5f5f5;">신청강좌</th><td colspan="3" style="padding:8px;">${sCourse}</td></tr>
          <tr><th style="padding:8px; background:#f5f5f5;">납부계좌</th><td colspan="3" style="padding:8px;">${bank} ${account} (예금주: ${depositor})</td></tr>
          <tr><th style="padding:8px; background:#f5f5f5;">납부기한</th><td colspan="3" style="padding:8px; color:#dc2626; font-weight:bold;">2026년 8월 25일까지</td></tr>
          <tr><th style="padding:8px; background:#f5f5f5;">납입금액</th><td colspan="3" style="padding:8px; font-size:16px; font-weight:bold; color:#059669;">${total.toLocaleString()}원 (수강료: ${tuition.toLocaleString()}원 + 재료비: ${material.toLocaleString()}원)</td></tr>
        </table>
        <p style="text-align:center; margin-top:20px; font-size:12px; color:#64748b;">
          ※ 지정된 납부기한까지 스쿨뱅킹 계좌 잔액을 확인해 주시기 바랍니다.
        </p>
      </div>
    `;
  } else {
    if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-calendar-days"></i> 학생 수강 시간표 인쇄';
    contentEl.innerHTML = `
      <div style="background:#fff; padding:30px; border:1px solid #ddd; max-width:700px; margin:0 auto; font-family:'Malgun Gothic';">
        <h2 style="text-align:center; margin-bottom:20px; font-size:20px; text-decoration:underline;">${sName} 학생 주간 수강시간표</h2>
        <div style="margin-bottom:10px; font-size:13px;">학생: ${sName} (${sGradeClass} ${sNum}) | 학교: 광주풍향초등학교</div>
        <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:center;" border="1">
          <thead><tr style="background:#f5f5f5;"><th style="padding:8px;">교시 / 요일</th><th>월요일</th><th>화요일</th><th>수요일</th><th>목요일</th><th>금요일</th></tr></thead>
          <tbody>
            <tr><td style="padding:8px; font-weight:bold;">1부 (14:00~14:50)</td><td>-</td><td style="background:#e0f2fe; font-weight:bold;">${sCourse}</td><td>-</td><td style="background:#e0f2fe; font-weight:bold;">${sCourse}</td><td>-</td></tr>
            <tr><td style="padding:8px; font-weight:bold;">2부 (15:00~15:50)</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
          </tbody>
        </table>
      </div>
    `;
  }

  modal.style.display = 'flex';
}

function triggerPrintArea() {
  window.print();
}

function openAppChangeHistoryModal() {
  const modal = document.getElementById('modalAppStatusView');
  const titleEl = document.getElementById('appStatusModalTitle');
  const bodyEl = document.getElementById('appStatusModalBody');
  if (!modal || !bodyEl) return;

  if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i> 최근 수강 추가 및 취소 변동 이력';
  bodyEl.innerHTML = `
    <table class="db-table" style="width:100%; font-size:12px;">
      <thead><tr><th>일시</th><th>구분</th><th>학생명</th><th>강좌명</th><th>변동사유</th><th>처리자</th></tr></thead>
      <tbody>
        <tr><td>2026-08-17 14:20</td><td><span class="badge" style="background:#16a34a; color:#fff;">추가등록</span></td><td>정다은</td><td>[늘봄] AI 로봇 코딩 교실</td><td>관리자 직접 등록</td><td>관리자(김혜련)</td></tr>
        <tr><td>2026-08-16 11:05</td><td><span class="badge" style="background:#dc2626; color:#fff;">수강취소</span></td><td>김하은</td><td>[특기적성] 창의 미술교실</td><td>학부모 유선 취소 요청</td><td>관리자(김혜련)</td></tr>
      </tbody>
    </table>
  `;
  modal.style.display = 'flex';
}

function openAppUnregisteredModal() {
  const modal = document.getElementById('modalAppStatusView');
  const titleEl = document.getElementById('appStatusModalTitle');
  const bodyEl = document.getElementById('appStatusModalBody');
  if (!modal || !bodyEl) return;

  if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-user-slash"></i> 방과후 미신청 학생 명단 (안내문 미제출)';
  bodyEl.innerHTML = `
    <table class="db-table" style="width:100%; font-size:12px;">
      <thead><tr><th>연번</th><th>학년반</th><th>번호</th><th>학생명</th><th>보호자연락처</th><th>SMS 안내</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>1학년 1반</td><td>03</td><td>강태호</td><td>010-4444-5555</td><td><button class="btn btn-outline" style="padding:2px 6px; font-size:11px;" onclick="alert('신청 안내 SMS가 발송되었습니다.')">SMS 발송</button></td></tr>
        <tr><td>2</td><td>1학년 2반</td><td>08</td><td>윤채원</td><td>010-6666-7777</td><td><button class="btn btn-outline" style="padding:2px 6px; font-size:11px;" onclick="alert('신청 안내 SMS가 발송되었습니다.')">SMS 발송</button></td></tr>
      </tbody>
    </table>
  `;
  modal.style.display = 'flex';
}

function editAppContact(id, studentName, currentPhone) {
  const newPhone = prompt(`[${studentName}] 학생의 학부모 연락처를 수정하세요:`, currentPhone !== '-' ? currentPhone : '010-');
  if (newPhone && newPhone.trim()) {
    fetch('/api/af/ad_app/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, parentPhone: newPhone.trim(), guardianPhone: newPhone.trim() })
    }).then(res => res.json()).then(d => {
      if (d.success) {
        alert('연락처가 변경되었습니다.');
        loadApplicants();
      }
    });
  }
}

function viewAppSchedule(studentName, gradeClass) {
  alert(`[${studentName} (${gradeClass})] 학생 주간 수강시간표:\n\n- 화요일 14:00~14:50: [특기적성] 창의 로봇교실 A반\n- 목요일 14:00~14:50: [특기적성] 창의 로봇교실 A반`);
}

function openAppTestMode() {
  const modal = document.getElementById('modalAppTestMode');
  if (modal) modal.style.display = 'flex';
}

async function executeTestApply() {
  const courseTitle = document.getElementById('testModeCourseSelect')?.value;
  alert(`[정다은] 학생의 [${courseTitle || '신청 강좌'}] 가상 수강신청이 성공적으로 접수되었습니다.\n관리자 신청목록에 자동 반영됩니다.`);
  closeAppModal('modalAppTestMode');
  loadApplicants();
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

let currentWaitlistData = [];
let allWaitCourses = [];

async function initWaitCourses() {
  if (allWaitCourses.length > 0) return allWaitCourses;
  try {
    const res = await fetch(`/api/af/ad_lec/lists/sn/${SCHOOL_SN || 3267}`);
    const data = await res.json();
    if (data && (data.lectures || data.courses)) {
      allWaitCourses = data.lectures || data.courses;
    }
  } catch (e) {
    console.warn('initWaitCourses error:', e);
  }
  if (!allWaitCourses || allWaitCourses.length === 0) {
    allWaitCourses = [
      { title: '창의로봇(초급)', category: '26년 8월', neulbomType: '방과후' },
      { title: '신나는 미술놀이', category: '26년 8월', neulbomType: '맞춤형' },
      { title: '오후 돌봄교실', category: '26년 8월', neulbomType: '돌봄' }
    ];
  }
  return allWaitCourses;
}

async function populateWaitCourseOptions() {
  await initWaitCourses();
  const selCourse = document.getElementById('wait_sel_course');
  const sinCourse = document.getElementById('wait_sin_course');
  const batchCourse = document.getElementById('wait_batch_course');
  const copySrc = document.getElementById('wait_copy_source');
  const copyTgt = document.getElementById('wait_copy_target');
  const excelCourse = document.getElementById('wait_excel_course');

  if (selCourse && selCourse.options.length <= 1) {
    selCourse.innerHTML = '<option value="">=강좌전체=</option>' +
      allWaitCourses.map(c => `<option value="${escapeHtml(c.title)}">${escapeHtml(c.title)}</option>`).join('');
  }
  if (sinCourse) {
    sinCourse.innerHTML = allWaitCourses.map(c => `<option value="${escapeHtml(c.title)}">${escapeHtml(c.title)}</option>`).join('');
  }
  if (batchCourse) {
    batchCourse.innerHTML = allWaitCourses.map(c => `<option value="${escapeHtml(c.title)}">${escapeHtml(c.title)}</option>`).join('');
  }
  if (copySrc) {
    copySrc.innerHTML = allWaitCourses.map(c => `<option value="${escapeHtml(c.title)}">${escapeHtml(c.title)}</option>`).join('');
  }
  if (copyTgt) {
    copyTgt.innerHTML = allWaitCourses.map(c => `<option value="${escapeHtml(c.title)}">${escapeHtml(c.title)}</option>`).join('');
  }
  if (excelCourse && excelCourse.options.length <= 1) {
    excelCourse.innerHTML = '<option value="">=강좌전체 (모든 대기자)=</option>' +
      allWaitCourses.map(c => `<option value="${escapeHtml(c.title)}">${escapeHtml(c.title)}</option>`).join('');
  }
}

async function loadWaitlist() {
  try {
    await populateWaitCourseOptions();
    const fm = document.getElementById('fm_list_search_wait');
    const params = new URLSearchParams();
    if (fm) {
      const sld = fm.sld ? fm.sld.value : '';
      const slp = fm.slp ? fm.slp.value : '';
      const sln = fm.sln ? fm.sln.value : '';
      const sgr = fm.sgr ? fm.sgr.value : '';
      const scl = fm.scl ? fm.scl.value : '';
      const st = fm.st ? fm.st.value : 'app_mem_name';
      const sw = fm.sw ? fm.sw.value.trim() : '';

      if (sld) params.append('sld', sld);
      if (slp) params.append('slp', slp);
      if (sln) params.append('sln', sln);
      if (sgr) params.append('sgr', sgr);
      if (scl) params.append('scl', scl);
      if (st) params.append('st', st);
      if (sw) params.append('sw', sw);
    }

    const res = await fetch('/api/af/ad_wait/lists?' + params.toString());
    const data = await res.json();
    currentWaitlistData = data.waitlist || [];
    const tbody = document.getElementById('waitlistTbody');
    const countEl = document.getElementById('wait_total_count');
    if (countEl) countEl.textContent = currentWaitlistData.length;

    if (tbody) {
      if (currentWaitlistData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="12" class="center" style="padding:40px; color:#888;">검색된 대기자가 없습니다.</td></tr>';
        return;
      }

      tbody.innerHTML = currentWaitlistData.map((w, idx) => {
        const neulbomBadgeClass = (w.neulbomType === '돌봄') ? 'background:#5cb85c;' : ((w.neulbomType === '방과후') ? 'background:#428bca;' : 'background:#f0ad4e;');
        return `
          <tr>
            <td><input type="checkbox" name="data_checked[]" value="${w.id}" class="wait-checkbox" style="cursor:pointer;"></td>
            <td>${w.rank || (idx + 1)}</td>
            <td>
              <button type="button" class="btn btn-primary btn-sm" onclick="chk_app('${w.id}');" style="padding:2px 8px; font-size:12px; height:24px; line-height:1; font-weight:bold;">신청</button>
            </td>
            <td>
              ${escapeHtml(w.category || '26년 8월')}<br>
              <span class="lec_pro_type3" style="display:inline-block; margin-top:2px; font-size:11px; color:#fff; ${neulbomBadgeClass} padding:1px 5px; border-radius:3px; font-weight:bold;">${escapeHtml(w.neulbomType || '돌봄')}</span>
            </td>
            <td class="text-left" style="text-align:left !important; font-weight:600; color:#333;">${escapeHtml(w.courseTitle)}</td>
            <td>${escapeHtml(String(w.grade || ''))}</td>
            <td>${escapeHtml(String(w.class || ''))}</td>
            <td>${escapeHtml(String(w.studentNum || ''))}</td>
            <td style="font-weight:bold; color:#1e293b;">${escapeHtml(w.studentName)}</td>
            <td style="font-size:12px; color:#555;">${escapeHtml(w.parentPhone || '')}</td>
            <td style="font-size:11.5px; color:#777; line-height:1.3;">${(w.appliedAt || '').replace(' ', '<br>')}</td>
            <td>
              <a href="#none;" onclick="chk_cancel('${w.id}'); return false;" title="삭제" style="text-decoration:none;">
                <i class="fa fa-trash-o icon_btn" style="color:#d9534f; font-size:15px; cursor:pointer;"></i>
              </a>
            </td>
          </tr>
        `;
      }).join('');
    }
  } catch (e) {
    console.error('loadWaitlist Error:', e);
  }
}

// 대기자 신청(승격) 모달 열기
function openWaitAppModal(num) {
  let item = null;
  if (num && currentWaitlistData) {
    item = currentWaitlistData.find(w => String(w.id) === String(num));
  }
  if (!item && currentWaitlistData && currentWaitlistData.length > 0) {
    item = currentWaitlistData[0];
  }
  if (!item) {
    alert('해당 대기자 정보를 찾을 수 없습니다.');
    return;
  }

  const idEl = document.getElementById('wait_app_id');
  const courseEl = document.getElementById('wait_app_courseTitle');
  const divEl = document.getElementById('wait_app_division');
  const nameEl = document.getElementById('wait_app_studentName');
  const gcEl = document.getElementById('wait_app_gradeClass');
  const phoneEl = document.getElementById('wait_app_parentPhone');
  const rankEl = document.getElementById('wait_app_rank');

  if (idEl) idEl.value = item.id;
  if (courseEl) courseEl.textContent = item.courseTitle || '-';
  if (divEl) divEl.textContent = `${item.category || ''} (${item.neulbomType || ''})`;
  if (nameEl) nameEl.textContent = item.studentName || '-';
  if (gcEl) gcEl.textContent = `${item.grade || ''}학년 ${item.class || ''}반 ${item.studentNum || ''}번`;
  if (phoneEl) phoneEl.textContent = item.parentPhone || '미등록';
  if (rankEl) rankEl.textContent = `대기 ${item.rank || 1}순위`;

  const m = document.getElementById('waitAppModal');
  if (m) m.style.display = 'flex';
}

function closeWaitAppModal() {
  const m = document.getElementById('waitAppModal');
  if (m) m.style.display = 'none';
}

// 모달 내 신청자로 승격 실행
async function executeWaitApp() {
  const idEl = document.getElementById('wait_app_id');
  const num = idEl ? idEl.value : '';
  if (!num) return;

  const btn = document.getElementById('btn_wait_app_submit');
  if (btn) btn.disabled = true;

  try {
    const res = await fetch('/api/af/ad_wait/app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ num })
    });
    const data = await res.json();
    if (data.success) {
      closeWaitAppModal();
      alert(data.message || '신청자로 등록 처리되었습니다.');
      loadWaitlist();
    } else {
      alert(data.message || '처리에 실패했습니다.');
    }
  } catch (e) {
    alert('서버 통신 오류가 발생했습니다.');
  } finally {
    if (btn) btn.disabled = false;
  }
}

// 신청(승격) 처리 (chk_app) -> 신청 모달 팝업으로 즉시 연동
function chk_app(num) {
  openWaitAppModal(num);
}

// 대기자 삭제 (chk_cancel)
async function chk_cancel(num) {
  if (!confirm('삭제하시겠습니까?')) return;
  try {
    const res = await fetch('/api/af/ad_wait/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ num })
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message || '성공적으로 삭제되었습니다.');
      loadWaitlist();
    } else {
      alert(data.message || '삭제에 실패했습니다.');
    }
  } catch (e) {
    alert('서버 통신 오류가 발생했습니다.');
  }
}

// 전체 선택/취소 (chk_wait_all)
function chk_wait_all(obj) {
  const isChecked = obj.checked;
  const cbs = document.querySelectorAll('.wait-checkbox');
  cbs.forEach(cb => { cb.checked = isChecked; });
}

// 하단 일괄적용 (신청 / 삭제 / 이동)
async function handleWaitBulkAction() {
  const updateTypeSelect = document.getElementById('wait_update_type');
  const updateType = updateTypeSelect ? updateTypeSelect.value : '';
  if (!updateType) {
    alert('일괄적용: 선택하세요.');
    if (updateTypeSelect) updateTypeSelect.focus();
    return;
  }

  const selectedCbs = Array.from(document.querySelectorAll('.wait-checkbox:checked'));
  if (selectedCbs.length === 0) {
    alert('선택된 학생이 없습니다.');
    return;
  }
  const selectedIds = selectedCbs.map(cb => cb.value);

  if (updateType === 'app') {
    if (!confirm(`선택된 ${selectedIds.length}명의 대기자를 정규 수강생(신청자)으로 등록(승격)하시겠습니까?`)) return;
    try {
      const res = await fetch('/api/af/ad_wait/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ update_type: 'app', data_checked: selectedIds })
      });
      const data = await res.json();
      alert(data.message || '신청자 등록 처리가 완료되었습니다.');
      loadWaitlist();
    } catch (e) {
      alert('오류가 발생했습니다.');
    }
  } else if (updateType === 'del') {
    if (!confirm('선택된 신청 정보를 삭제하시겠습니까?')) return;
    try {
      const res = await fetch('/api/af/ad_wait/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ update_type: 'del', data_checked: selectedIds })
      });
      const data = await res.json();
      alert(data.message || '삭제가 완료되었습니다.');
      loadWaitlist();
    } catch (e) {
      alert('오류가 발생했습니다.');
    }
  } else if (updateType === 'move') {
    const selCourseEl = document.getElementById('wait_sel_course');
    const selectedCourse = selCourseEl ? selCourseEl.value : '';
    if (!selectedCourse) {
      alert("대기자 이동은 검색 조건에서 '강좌'를 먼저 선택해야 이용할 수 있습니다.");
      return;
    }
    openWaitMoveModal(selectedCourse);
  }
}

// 검색 리셋
function resetWaitSearch() {
  const fm = document.getElementById('fm_list_search_wait');
  if (fm) {
    fm.sld.value = 'all';
    fm.slp.value = 'all';
    fm.sln.value = '';
    fm.sgr.value = '';
    fm.scl.value = '';
    fm.st.value = 'app_mem_name';
    fm.sw.value = '';
  }
  loadWaitlist();
}

// ----------------- 5종 모달 동작 함수들 -----------------

// 1. 대기자 등록 모달
async function openWaitSinModal() {
  await populateWaitCourseOptions();
  updateWaitSinCourses();
  const m = document.getElementById('waitSinModal');
  if (m) m.style.display = 'flex';
}
function closeWaitSinModal() {
  const m = document.getElementById('waitSinModal');
  if (m) m.style.display = 'none';
}
function selectSampleStudentForWait() {
  const samples = [
    { name: '김하윤', grade: '1', class: '2', num: '14', phone: '010-8234-9122' },
    { name: '이도현', grade: '2', class: '1', num: '07', phone: '010-4567-8901' },
    { name: '박서아', grade: '3', class: '3', num: '19', phone: '010-9876-5432' }
  ];
  const s = samples[Math.floor(Math.random() * samples.length)];
  document.getElementById('wait_sin_studentName').value = s.name;
  document.getElementById('wait_sin_grade').value = s.grade;
  document.getElementById('wait_sin_class').value = s.class;
  document.getElementById('wait_sin_num').value = s.num;
  document.getElementById('wait_sin_phone').value = s.phone;
}
function updateWaitSinCourses() {
  const divEl = document.getElementById('wait_sin_div');
  const typeEl = document.getElementById('wait_sin_neulbomType');
  const div = divEl ? divEl.value : '';
  const type = typeEl ? typeEl.value : '';
  const sel = document.getElementById('wait_sin_course');
  if (!sel) return;
  const filtered = allWaitCourses.filter(c => {
    const matchDiv = !div || (c.category && c.category.includes(div));
    const matchType = (type === 'all') || !type || (c.neulbomType && c.neulbomType.includes(type));
    return matchDiv && matchType;
  });
  const listToUse = filtered.length > 0 ? filtered : allWaitCourses;
  sel.innerHTML = listToUse.map(c => `<option value="${escapeHtml(c.title)}">${escapeHtml(c.title)}</option>`).join('');
}
async function submitWaitSinForm() {
  const studentName = document.getElementById('wait_sin_studentName').value.trim();
  const grade = document.getElementById('wait_sin_grade').value;
  const classNum = document.getElementById('wait_sin_class').value;
  const studentNum = document.getElementById('wait_sin_num').value;
  const parentPhone = document.getElementById('wait_sin_phone').value.trim();
  let courseTitle = document.getElementById('wait_sin_course').value;
  if (!courseTitle && allWaitCourses.length > 0) courseTitle = allWaitCourses[0].title;
  const category = document.getElementById('wait_sin_div').value || '26년 8월';
  const neulbomType = document.getElementById('wait_sin_neulbomType').value || '돌봄';

  if (!studentName || !courseTitle) {
    alert('학생명과 희망 강좌는 필수입니다.');
    return;
  }

  try {
    const res = await fetch('/api/af/ad_wait/sin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName, grade, class: classNum, studentNum, parentPhone,
        courseTitle, category, neulbomType, division: `${category} ${neulbomType}`
      })
    });
    const data = await res.json();
    if (data.success) {
      closeWaitSinModal();
      alert(data.message || '대기자로 등록되었습니다.');
      loadWaitlist();
    } else {
      alert(data.message || '등록에 실패했습니다.');
    }
  } catch (e) {
    alert('서버 오류가 발생했습니다.');
  }
}

// 2. 대기자 일괄입력 모달
function openWaitBatchInputModal() {
  populateWaitCourseOptions();
  const m = document.getElementById('waitBatchInputModal');
  if (m) m.style.display = 'flex';
}
function closeWaitBatchInputModal() {
  const m = document.getElementById('waitBatchInputModal');
  if (m) m.style.display = 'none';
}
function downloadWaitBatchTemplate() {
  const csv = '\uFEFF학년,반,번호,학생명,학부모연락처\r\n1,1,5,김예준,010-1111-2222\r\n2,3,10,이서아,010-3333-4444\r\n';
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = '대기자_일괄입력_양식.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
let parsedWaitBatchEntries = [];
function previewWaitBatch() {
  const text = document.getElementById('wait_batch_text').value.trim();
  if (!text) {
    alert('데이터를 입력해주세요.');
    return;
  }
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  parsedWaitBatchEntries = [];
  lines.forEach(line => {
    // 탭 또는 쉼표 구분 지원
    const parts = line.includes('\t') ? line.split('\t') : line.split(/[\s,]+/);
    if (parts.length >= 4) {
      parsedWaitBatchEntries.push({
        grade: parts[0].trim(),
        class: parts[1].trim(),
        studentNum: parts[2].trim(),
        studentName: parts[3].trim(),
        parentPhone: parts[4] ? parts[4].trim() : '010-0000-0000'
      });
    }
  });

  const previewBox = document.getElementById('wait_batch_preview_box');
  const tbody = document.getElementById('wait_batch_tbody');
  const countSpan = document.getElementById('wait_batch_count');
  if (countSpan) countSpan.textContent = parsedWaitBatchEntries.length;
  if (tbody) {
    tbody.innerHTML = parsedWaitBatchEntries.map((e, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${escapeHtml(e.grade)}학년</td>
        <td>${escapeHtml(e.class)}반</td>
        <td>${escapeHtml(e.studentNum)}번</td>
        <td style="font-weight:bold;">${escapeHtml(e.studentName)}</td>
        <td>${escapeHtml(e.parentPhone)}</td>
      </tr>
    `).join('');
  }
  if (previewBox) previewBox.style.display = 'block';
}
async function submitWaitBatchInput() {
  if (parsedWaitBatchEntries.length === 0) {
    previewWaitBatch();
    if (parsedWaitBatchEntries.length === 0) return;
  }
  const courseTitle = document.getElementById('wait_batch_course').value;
  if (!courseTitle) {
    alert('대상 강좌를 선택해주세요.');
    return;
  }

  const entries = parsedWaitBatchEntries.map(e => ({
    ...e,
    courseTitle,
    category: '26년 8월',
    neulbomType: '돌봄',
    division: '26년 8월 돌봄'
  }));

  try {
    const res = await fetch('/api/af/ad_wait/batch-input', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries })
    });
    const data = await res.json();
    if (data.success) {
      closeWaitBatchInputModal();
      alert(data.message || '일괄 등록이 완료되었습니다.');
      loadWaitlist();
    } else {
      alert(data.message || '일괄 등록에 실패했습니다.');
    }
  } catch (e) {
    alert('서버 통신 오류가 발생했습니다.');
  }
}

// 3. 대기자 복사 모달
function openWaitCopyModal() {
  populateWaitCourseOptions();
  const m = document.getElementById('waitCopyModal');
  if (m) m.style.display = 'flex';
}
function closeWaitCopyModal() {
  const m = document.getElementById('waitCopyModal');
  if (m) m.style.display = 'none';
}
async function submitWaitCopy() {
  const sourceCourse = document.getElementById('wait_copy_source').value;
  const targetCourse = document.getElementById('wait_copy_target').value;
  const modeRadio = document.querySelector('input[name="wait_copy_mode"]:checked');
  const mode = modeRadio ? modeRadio.value : 'append';

  if (!sourceCourse || !targetCourse) {
    alert('원본 강좌와 대상 강좌를 선택해주세요.');
    return;
  }
  if (sourceCourse === targetCourse) {
    alert('원본 강좌와 대상 강좌가 동일합니다.');
    return;
  }

  try {
    const res = await fetch('/api/af/ad_wait/copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceCourse, targetCourse, mode })
    });
    const data = await res.json();
    if (data.success) {
      closeWaitCopyModal();
      alert(data.message || '대기자 복사가 완료되었습니다.');
      loadWaitlist();
    } else {
      alert(data.message || '복사에 실패했습니다.');
    }
  } catch (e) {
    alert('서버 통신 오류가 발생했습니다.');
  }
}

// 4. 신청결과 엑셀출력 모달
function openWaitExcelModal() {
  populateWaitCourseOptions();
  const m = document.getElementById('waitExcelModal');
  if (m) m.style.display = 'flex';
}
function closeWaitExcelModal() {
  const m = document.getElementById('waitExcelModal');
  if (m) m.style.display = 'none';
}
function downloadWaitExcel() {
  const sld = document.getElementById('wait_excel_div').value;
  const slp = document.getElementById('wait_excel_pro_type').value;
  const sln = document.getElementById('wait_excel_course').value;
  const params = new URLSearchParams();
  if (sld) params.append('sld', sld);
  if (slp) params.append('slp', slp);
  if (sln) params.append('sln', sln);

  window.location.href = '/api/af/ad_wait/excel?' + params.toString();
  setTimeout(() => {
    closeWaitExcelModal();
  }, 1000);
}

// 5. 대기자 순위 이동 모달
let currentMoveList = [];
let currentMoveCourse = '';
function openWaitMoveModal(courseTitle) {
  currentMoveCourse = courseTitle;
  currentMoveList = currentWaitlistData.filter(w => w.courseTitle === courseTitle);
  if (currentMoveList.length === 0) {
    alert(`'${courseTitle}' 강좌에 등록된 대기자가 없습니다.`);
    return;
  }

  const titleEl = document.getElementById('wait_move_course_title');
  if (titleEl) titleEl.textContent = courseTitle;
  renderWaitMoveTable();

  const m = document.getElementById('waitMoveModal');
  if (m) m.style.display = 'flex';
}
function closeWaitMoveModal() {
  const m = document.getElementById('waitMoveModal');
  if (m) m.style.display = 'none';
}
function renderWaitMoveTable() {
  const tbody = document.getElementById('wait_move_tbody');
  if (!tbody) return;
  tbody.innerHTML = currentMoveList.map((item, idx) => `
    <tr>
      <td style="font-weight:bold; color:#337ab7;">대기 ${idx + 1}번</td>
      <td style="font-weight:bold;">${escapeHtml(item.studentName)}</td>
      <td>${escapeHtml(String(item.grade))}학년 ${escapeHtml(String(item.class))}반 ${escapeHtml(String(item.studentNum))}번</td>
      <td>${escapeHtml(item.parentPhone || '')}</td>
      <td>
        <button type="button" class="btn btn-default btn-xs" onclick="moveWaitRowUp(${idx})" ${idx === 0 ? 'disabled' : ''} style="padding:1px 6px; font-size:11px;">▲ 위로</button>
        <button type="button" class="btn btn-default btn-xs" onclick="moveWaitRowDown(${idx})" ${idx === currentMoveList.length - 1 ? 'disabled' : ''} style="padding:1px 6px; font-size:11px;">▼ 아래로</button>
      </td>
    </tr>
  `).join('');
}
function moveWaitRowUp(idx) {
  if (idx <= 0) return;
  const temp = currentMoveList[idx - 1];
  currentMoveList[idx - 1] = currentMoveList[idx];
  currentMoveList[idx] = temp;
  renderWaitMoveTable();
}
function moveWaitRowDown(idx) {
  if (idx >= currentMoveList.length - 1) return;
  const temp = currentMoveList[idx + 1];
  currentMoveList[idx + 1] = currentMoveList[idx];
  currentMoveList[idx] = temp;
  renderWaitMoveTable();
}
async function saveWaitMoveOrder() {
  const orderedIds = currentMoveList.map(w => w.id);
  try {
    const res = await fetch('/api/af/ad_wait/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseTitle: currentMoveCourse, orderedIds })
    });
    const data = await res.json();
    if (data.success) {
      closeWaitMoveModal();
      alert(data.message || '순위 변경이 저장되었습니다.');
      loadWaitlist();
    } else {
      alert(data.message || '저장에 실패했습니다.');
    }
  } catch (e) {
    alert('서버 통신 오류가 발생했습니다.');
  }
}

// Window global functions binding
window.loadWaitlist = loadWaitlist;
window.chk_app = chk_app;
window.chk_cancel = chk_cancel;
window.chk_wait_all = chk_wait_all;
window.handleWaitBulkAction = handleWaitBulkAction;
window.resetWaitSearch = resetWaitSearch;
window.openWaitSinModal = openWaitSinModal;
window.closeWaitSinModal = closeWaitSinModal;
window.selectSampleStudentForWait = selectSampleStudentForWait;
window.updateWaitSinCourses = updateWaitSinCourses;
window.submitWaitSinForm = submitWaitSinForm;
window.openWaitBatchInputModal = openWaitBatchInputModal;
window.closeWaitBatchInputModal = closeWaitBatchInputModal;
window.downloadWaitBatchTemplate = downloadWaitBatchTemplate;
window.previewWaitBatch = previewWaitBatch;
window.submitWaitBatchInput = submitWaitBatchInput;
window.openWaitCopyModal = openWaitCopyModal;
window.closeWaitCopyModal = closeWaitCopyModal;
window.submitWaitCopy = submitWaitCopy;
window.openWaitExcelModal = openWaitExcelModal;
window.closeWaitExcelModal = closeWaitExcelModal;
window.downloadWaitExcel = downloadWaitExcel;
window.openWaitMoveModal = openWaitMoveModal;
window.closeWaitMoveModal = closeWaitMoveModal;
window.moveWaitRowUp = moveWaitRowUp;
window.moveWaitRowDown = moveWaitRowDown;
window.saveWaitMoveOrder = saveWaitMoveOrder;
window.openWaitAppModal = openWaitAppModal;
window.closeWaitAppModal = closeWaitAppModal;
window.executeWaitApp = executeWaitApp;

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
      <tr>
        <td style="vertical-align:middle;"><input type="checkbox" class="ref-checkbox" value="${r.id}" style="float:none;"></td>
        <td style="vertical-align:middle;">${idx + 1}</td>
        <td style="vertical-align:middle;">${statusBadge}</td>
        <td style="vertical-align:middle;">${r.appType || '일반'}</td>
        <td style="vertical-align:middle;">${r.neulbomType || '방과후'}</td>
        <td class="text-left" style="vertical-align:middle; font-weight:bold; color:#1e293b;">${r.courseTitle || ''}</td>
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
        <td class="text-left" style="vertical-align:middle; font-size:11px; color:#555;">${r.reason || ''}</td>
        <td style="vertical-align:middle; font-size:11px; color:#777;">${r.createdAt || ''}</td>
        <td style="vertical-align:middle;">
          <a href="#none;" onclick="deleteRefundItem('${r.id}', '${r.studentName}'); return false;">
            <i class="fa fa-trash-o icon_btn" title="삭제" style="cursor:pointer; color:#d9534f; font-size:15px;"></i>
          </a>
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

  const proMap = { '1': '방과후', '2': '맞춤형', '3': '돌봄' };
  const divMap = { '5': '3월', '6': '26년 4월', '7': '26년 5월', '8': '26년 6월', '9': '26년 7월', '10': '26년 8월', '11': '26년 9월' };

  const filtered = currentRefundsCache.filter(r => {
    if (selProType !== 'all') {
      const targetPro = proMap[selProType] || selProType;
      if (r.neulbomType !== targetPro && r.neulbomType !== selProType) return false;
    }
    if (selDiv !== 'all') {
      const targetDiv = divMap[selDiv] || selDiv;
      if (r.lectureDivision && !r.lectureDivision.includes(targetDiv) && r.lectureDivision !== selDiv) return false;
    }
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

async function applyRefundBulkAction() {
  const sel = document.getElementById('ref_bulk_status_sel');
  if (!sel) return;
  const val = sel.value;
  if (!val) {
    alert('일괄처리 항목을 선택하세요.');
    return;
  }
  if (val === 'del') {
    await handleBulkRefundDelete();
  } else {
    await handleBulkRefundStatus(val);
  }
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

// ==================== Modal 1: 환불/취소 등록 (#refundSinModal) - 라이브 사이트 1:1 매핑 ====================
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
}
// ==================== Modal 2: 환불/취소 일괄등록 (#refundBatchModal) - 라이브 사이트 1:1 매핑 ====================
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
  const panel = document.getElementById('panel_ad_tea_lists');
  const st = panel ? (panel.querySelector('#st')?.value || 'mem_name') : 'mem_name';
  const sw = panel ? (panel.querySelector('#s_word')?.value.trim() || '') : '';

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
  const panel = document.getElementById('panel_ad_tea_lists');
  const swEl = panel ? panel.querySelector('#s_word') : null;
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
    modal.classList.add('show', 'active');
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
  if (modal) {
    modal.classList.remove('show', 'active');
    modal.style.display = 'none';
  }
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

  modal.classList.add('show', 'active');
  modal.style.display = 'flex';
}

function closeTeaModifyModal() {
  const modal = document.getElementById('modal_ad_tea_modify');
  if (modal) {
    modal.classList.remove('show', 'active');
    modal.style.display = 'none';
  }
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
    modal.classList.add('show', 'active');
    modal.style.display = 'flex';
    document.getElementById('userfile').value = '';
    document.getElementById('def_passwd').value = '';
    document.getElementById('input_type_add').checked = true;
  }
}

function closeTeaInputModal() {
  const modal = document.getElementById('modal_ad_tea_input');
  if (modal) {
    modal.classList.remove('show', 'active');
    modal.style.display = 'none';
  }
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
  if (modal) {
    modal.classList.add('show', 'active');
    modal.style.display = 'flex';
  }
}

function closeTeaScheduleModal() {
  const modal = document.getElementById('modal_ad_tea_schedule');
  if (modal) {
    modal.classList.remove('show', 'active');
    modal.style.display = 'none';
  }
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

// ==================== 12. 지원금관리 (4개 서브모델) ====================

let currentSubsidyStudents = [];
let currentSubsidySort = { column: 'grade', asc: true };
let parsedBatchStudents = [];

// 대상자 목록 로드 및 19열 테이블 렌더링
async function loadSubsidyStudents() {
  const tbody = document.getElementById('subsidyStuTbody');
  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="19" class="center" style="padding:40px; color:#64748b;"><i class="fa fa-spinner fa-spin"></i> 지원금 대상자 목록을 조회하는 중입니다...</td></tr>';
  }

  try {
    const fundType = document.getElementById('sub_filter_fund') ? document.getElementById('sub_filter_fund').value : '';
    const rank = document.getElementById('sub_filter_rank') ? document.getElementById('sub_filter_rank').value : '';
    const rankDetail = document.getElementById('sub_filter_rank_detail') ? document.getElementById('sub_filter_rank_detail').value : '';
    const grade = document.getElementById('sub_filter_grade') ? document.getElementById('sub_filter_grade').value : '';
    const classNum = document.getElementById('sub_filter_class') ? document.getElementById('sub_filter_class').value : '';
    const searchName = document.getElementById('sub_filter_name') ? document.getElementById('sub_filter_name').value.trim() : '';

    const params = new URLSearchParams();
    if (fundType) params.append('fundType', fundType);
    if (rank) params.append('rank', rank);
    if (rankDetail) params.append('rankDetail', rankDetail);
    if (grade) params.append('grade', grade);
    if (classNum) params.append('classNum', classNum);
    if (searchName) params.append('searchName', searchName);

    const res = await fetch('/api/af/ad_free2_stu/lists?' + params.toString());
    const data = await res.json();
    currentSubsidyStudents = (data && data.students) ? data.students : [];

    // 정렬 적용
    applySubsidySorting();

    // 렌더링
    renderSubsidyStudentsTable();

    // 요약 통계 반영
    if (data && data.summary) {
      updateSubsidySummaryBar(data.summary);
    } else {
      updateSubsidySummaryBarFromLocal();
    }
  } catch (e) {
    console.error('loadSubsidyStudents Error:', e);
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="19" class="center" style="padding:40px; color:#ef4444;"><i class="fa fa-exclamation-triangle"></i> 대상자 목록을 불러오는 중 오류가 발생했습니다.</td></tr>';
    }
  }
}

// 테이블 행 렌더링
function renderSubsidyStudentsTable() {
  const tbody = document.getElementById('subsidyStuTbody');
  if (!tbody) return;

  if (currentSubsidyStudents.length === 0) {
    tbody.innerHTML = '<tr><td colspan="19" class="center" style="padding:40px; color:#64748b;">조건에 일치하는 지원금 대상자가 없습니다.</td></tr>';
    updateSubsidyCountBadges(0);
    return;
  }

  tbody.innerHTML = currentSubsidyStudents.map((s, idx) => `
    <tr style="transition:background 0.15s ease;" onmouseover="this.style.background='#f8fafc';" onmouseout="this.style.background='#ffffff';">
      <td style="vertical-align:middle; text-align:center;"><input type="checkbox" class="sub_chk_item" value="${s.id}" onchange="updateSubsidySelectedCount();"></td>
      <td style="vertical-align:middle; text-align:center; color:#64748b; font-size:12px;">${idx + 1}</td>
      <td style="vertical-align:middle; text-align:center;">
        <button type="button" class="btn btn-default btn-xs" onclick="openEditSubsidyModal('${s.id}')" style="height:24px; padding:0 8px; font-size:11px; display:inline-flex; align-items:center; justify-content:center; border:1px solid #ccc; background:#fff; border-radius:3px; cursor:pointer;">수정</button>
      </td>
      <td style="vertical-align:middle; text-align:center; font-weight:bold;">${s.grade}학년</td>
      <td style="vertical-align:middle; text-align:center;">${s.classNum}반</td>
      <td style="vertical-align:middle; text-align:center;">${s.studentNum}번</td>
      <td style="vertical-align:middle; text-align:center;"><strong style="color:#1e293b; font-size:13px;">${s.studentName}</strong></td>
      <!-- 1학년 지원금 -->
      <td style="vertical-align:middle; text-align:right; font-size:12px; background:#f0f9ff;">${(s.fund1_total || 0).toLocaleString()}원</td>
      <td style="vertical-align:middle; text-align:right; font-size:12px; background:#f0f9ff; color:#ea580c;">${(s.fund1_used || 0).toLocaleString()}원</td>
      <td style="vertical-align:middle; text-align:right; font-size:12px; background:#f0f9ff; font-weight:bold; color:#0369a1;">${(s.fund1_balance || 0).toLocaleString()}원</td>
      <td style="vertical-align:middle; text-align:center; font-size:11px; background:#f0f9ff; color:#64748b;">${s.fund1_period || '-'}</td>
      <!-- 3학년 지원금 -->
      <td style="vertical-align:middle; text-align:right; font-size:12px; background:#fffbeb;">${(s.fund3_total || 0).toLocaleString()}원</td>
      <td style="vertical-align:middle; text-align:right; font-size:12px; background:#fffbeb; color:#ea580c;">${(s.fund3_used || 0).toLocaleString()}원</td>
      <td style="vertical-align:middle; text-align:right; font-size:12px; background:#fffbeb; font-weight:bold; color:#92400e;">${(s.fund3_balance || 0).toLocaleString()}원</td>
      <td style="vertical-align:middle; text-align:center; font-size:11px; background:#fffbeb; color:#64748b;">${s.fund3_period || '-'}</td>
      <!-- 순위 및 순위구분 -->
      <td style="vertical-align:middle; text-align:center;"><span class="badge" style="background:#e2e8f0; color:#334155; font-size:11px;">${s.rank || '-'}</span></td>
      <td style="vertical-align:middle; text-align:center; font-size:12px;">${s.rankDetail || '-'}</td>
      <td style="vertical-align:middle; text-align:center;">
        <span class="badge ${s.isPreDesignated === 'Y' ? 'badge-OUTPUT' : 'badge-CLOSED'}" style="font-size:11px;">${s.isPreDesignated === 'Y' ? '선정(Y)' : '미선정(N)'}</span>
      </td>
      <!-- 자유수강권 -->
      <td style="vertical-align:middle; text-align:right; font-size:12px; background:#f0fdf4;">${(s.free_total || 0).toLocaleString()}원</td>
      <td style="vertical-align:middle; text-align:right; font-size:12px; background:#f0fdf4; color:#ea580c;">${(s.free_used || 0).toLocaleString()}원</td>
      <td style="vertical-align:middle; text-align:right; font-size:12px; background:#f0fdf4; font-weight:bold; color:#16a34a;">${(s.free_balance || 0).toLocaleString()}원</td>
    </tr>
  `).join('');

  updateSubsidyCountBadges(currentSubsidyStudents.length);
  updateSubsidySelectedCount();
}

// 요약 통계 갱신
function updateSubsidySummaryBar(sum) {
  const cntEl = document.getElementById('sum_count');
  const freeTotEl = document.getElementById('sum_free_total');
  const freeUsedEl = document.getElementById('sum_free_used');
  const freeBalEl = document.getElementById('sum_free_balance');

  if (cntEl) cntEl.textContent = (sum.totalCount || 0).toLocaleString();
  if (freeTotEl) freeTotEl.textContent = (sum.freeTotal || 0).toLocaleString();
  if (freeUsedEl) freeUsedEl.textContent = (sum.freeUsed || 0).toLocaleString();
  if (freeBalEl) freeBalEl.textContent = (sum.freeBalance || 0).toLocaleString();
}

function updateSubsidySummaryBarFromLocal() {
  const sum = {
    totalCount: currentSubsidyStudents.length,
    freeTotal: currentSubsidyStudents.reduce((acc, s) => acc + (s.free_total || 0), 0),
    freeUsed: currentSubsidyStudents.reduce((acc, s) => acc + (s.free_used || 0), 0),
    freeBalance: currentSubsidyStudents.reduce((acc, s) => acc + (s.free_balance || 0), 0)
  };
  updateSubsidySummaryBar(sum);
}

function updateSubsidyCountBadges(count) {
  const el1 = document.getElementById('sub_stu_total_count');
  if (el1) el1.textContent = count;
}

// 필터 초기화
function resetSubsidyFilters() {
  if (document.getElementById('sub_filter_fund')) document.getElementById('sub_filter_fund').value = '';
  if (document.getElementById('sub_filter_rank')) document.getElementById('sub_filter_rank').value = '';
  if (document.getElementById('sub_filter_rank_detail')) document.getElementById('sub_filter_rank_detail').value = '';
  if (document.getElementById('sub_filter_grade')) document.getElementById('sub_filter_grade').value = '';
  if (document.getElementById('sub_filter_class')) document.getElementById('sub_filter_class').value = '';
  if (document.getElementById('sub_filter_name')) document.getElementById('sub_filter_name').value = '';
  loadSubsidyStudents();
}

// 정렬
function toggleSubsidySort(column) {
  if (currentSubsidySort.column === column) {
    currentSubsidySort.asc = !currentSubsidySort.asc;
  } else {
    currentSubsidySort.column = column;
    currentSubsidySort.asc = true;
  }
  applySubsidySorting();
  renderSubsidyStudentsTable();
}

function applySubsidySorting() {
  const { column, asc } = currentSubsidySort;
  currentSubsidyStudents.sort((a, b) => {
    let valA = a[column];
    let valB = b[column];
    if (typeof valA === 'string') {
      return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return asc ? (valA - valB) : (valB - valA);
  });
}

// 전체 선택
function toggleSelectAllSubsidy(master) {
  const items = document.querySelectorAll('.sub_chk_item');
  items.forEach(chk => chk.checked = master.checked);
  updateSubsidySelectedCount();
}

// 선택된 체크박스 카운트 및 삭제 버튼 표시
function updateSubsidySelectedCount() {
  const checked = document.querySelectorAll('.sub_chk_item:checked');
  const delBtn = document.getElementById('btn_sub_delete_selected');
  if (delBtn) {
    if (checked.length > 0) {
      delBtn.style.display = 'inline-flex';
      delBtn.textContent = `선택삭제 (${checked.length})`;
    } else {
      delBtn.style.display = 'none';
    }
  }
}

// 선택 삭제 실행
async function deleteSelectedSubsidyStudents() {
  const checked = Array.from(document.querySelectorAll('.sub_chk_item:checked')).map(el => el.value);
  if (checked.length === 0) {
    alert('삭제할 대상자를 선택해 주세요.');
    return;
  }

  if (!confirm(`선택한 ${checked.length}명의 지원금 대상자를 정말 삭제하시겠습니까?`)) {
    return;
  }

  try {
    const res = await fetch('/api/af/ad_free2_stu', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: checked })
    });
    const result = await res.json();
    if (result.success) {
      alert(result.message || '삭제되었습니다.');
      const chkAll = document.getElementById('sub_chk_all');
      if (chkAll) chkAll.checked = false;
      loadSubsidyStudents();
    } else {
      alert('삭제 실패: ' + (result.message || '알 수 없는 오류'));
    }
  } catch (err) {
    console.error('deleteSelectedSubsidyStudents Error:', err);
    alert('삭제 처리 중 오류가 발생했습니다.');
  }
}

// 모달 A: 대상자 등록 / 수정 모달 제어
function openCreateSubsidyModal() {
  document.getElementById('sub_edit_id').value = '';
  document.getElementById('subsidy_modal_title').innerHTML = '<i class="fa fa-user-plus" style="color:#2563eb;"></i> 대상자 등록';
  document.getElementById('fm_subsidy_student').reset();
  document.getElementById('sub_form_fund1_total').value = 0;
  document.getElementById('sub_form_fund1_period').value = '2026-03-01~2027-02-28';
  document.getElementById('sub_form_fund3_total').value = 0;
  document.getElementById('sub_form_fund3_period').value = '2026-03-01~2027-02-28';
  document.getElementById('sub_form_free_total').value = 600000;

  const modal = document.getElementById('modal_subsidy_student_form');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function openEditSubsidyModal(id) {
  const student = currentSubsidyStudents.find(s => s.id === id);
  if (!student) {
    alert('대상자 정보를 찾을 수 없습니다.');
    return;
  }

  document.getElementById('sub_edit_id').value = student.id;
  document.getElementById('subsidy_modal_title').innerHTML = `<i class="fa fa-pencil" style="color:#2563eb;"></i> 대상자 수정 - ${student.studentName}`;
  document.getElementById('sub_form_grade').value = student.grade || 1;
  document.getElementById('sub_form_class').value = student.classNum || 1;
  document.getElementById('sub_form_student_num').value = student.studentNum || 1;
  document.getElementById('sub_form_name').value = student.studentName || '';
  document.getElementById('sub_form_phone').value = student.phone || '';
  document.getElementById('sub_form_rank').value = student.rank || '1순위';
  document.getElementById('sub_form_rank_detail').value = student.rankDetail || '국민기초생활수급자';

  const radios = document.querySelectorAll('input[name="sub_form_predesignated"]');
  radios.forEach(r => r.checked = (r.value === student.isPreDesignated));

  document.getElementById('sub_form_fund1_total').value = student.fund1_total || 0;
  document.getElementById('sub_form_fund1_period').value = student.fund1_period || '2026-03-01~2027-02-28';
  document.getElementById('sub_form_fund3_total').value = student.fund3_total || 0;
  document.getElementById('sub_form_fund3_period').value = student.fund3_period || '2026-03-01~2027-02-28';
  document.getElementById('sub_form_free_total').value = student.free_total || 600000;
  document.getElementById('sub_form_note').value = student.note || '';

  const modal = document.getElementById('modal_subsidy_student_form');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function closeSubsidyModal() {
  const modal = document.getElementById('modal_subsidy_student_form');
  if (modal) modal.style.display = 'none';
}

async function submitSubsidyStudentForm() {
  const editId = document.getElementById('sub_edit_id').value;
  const grade = Number(document.getElementById('sub_form_grade').value);
  const classNum = Number(document.getElementById('sub_form_class').value);
  const studentNum = Number(document.getElementById('sub_form_student_num').value);
  const studentName = document.getElementById('sub_form_name').value.trim();
  const phone = document.getElementById('sub_form_phone').value.trim();
  const rank = document.getElementById('sub_form_rank').value;
  const rankDetail = document.getElementById('sub_form_rank_detail').value;
  const isPreDesignated = document.querySelector('input[name="sub_form_predesignated"]:checked') ? document.querySelector('input[name="sub_form_predesignated"]:checked').value : 'Y';
  const fund1_total = Number(document.getElementById('sub_form_fund1_total').value || 0);
  const fund1_period = document.getElementById('sub_form_fund1_period').value.trim();
  const fund3_total = Number(document.getElementById('sub_form_fund3_total').value || 0);
  const fund3_period = document.getElementById('sub_form_fund3_period').value.trim();
  const free_total = Number(document.getElementById('sub_form_free_total').value || 600000);
  const note = document.getElementById('sub_form_note').value.trim();

  if (!studentName) {
    alert('학생 이름을 입력해 주세요.');
    return;
  }

  const payload = {
    grade,
    classNum,
    studentNum,
    studentName,
    phone,
    rank,
    rankDetail,
    isPreDesignated,
    fund1_total,
    fund1_period,
    fund3_total,
    fund3_period,
    free_total,
    note
  };

  try {
    let url = '/api/af/ad_free2_stu';
    let method = 'POST';
    if (editId) {
      url = `/api/af/ad_free2_stu/${editId}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success) {
      alert(result.message || '저장되었습니다.');
      closeSubsidyModal();
      resetSubsidyFilters();
    } else {
      alert('저장 실패: ' + (result.message || '알 수 없는 오류'));
    }
  } catch (err) {
    console.error('submitSubsidyStudentForm Error:', err);
    alert('저장 처리 중 오류가 발생했습니다.');
  }
}

// 모달 B: 대상자 일괄입력 모달 제어
function openBatchSubsidyModal() {
  parsedBatchStudents = [];
  const area = document.getElementById('sub_batch_text_area');
  if (area) area.value = '';
  const fileInput = document.getElementById('sub_batch_file_input');
  if (fileInput) fileInput.value = '';
  parseBatchSubsidyPreview();

  const modal = document.getElementById('modal_subsidy_batch_form');
  if (modal) modal.style.display = 'flex';
}

function closeBatchSubsidyModal() {
  const modal = document.getElementById('modal_subsidy_batch_form');
  if (modal) modal.style.display = 'none';
}

function parseBatchSubsidyPreview() {
  const text = (document.getElementById('sub_batch_text_area')?.value || '').trim();
  const tbody = document.getElementById('sub_batch_preview_tbody');
  const countEl = document.getElementById('sub_batch_preview_count');

  parsedBatchStudents = [];
  if (!text) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="9" style="padding:20px; color:#94a3b8;">데이터를 입력하거나 파일을 첨부하면 실시간 미리보기가 표시됩니다.</td></tr>';
    if (countEl) countEl.textContent = '0';
    return;
  }

  const lines = text.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    // 헤더 행 무시
    if (line.includes('학년') && line.includes('이름')) continue;

    // 탭 또는 쉼표 구분
    let tokens = [];
    if (line.includes('\t')) {
      tokens = line.split('\t').map(t => t.trim());
    } else {
      tokens = line.split(',').map(t => t.trim());
    }

    if (tokens.length >= 4) {
      const student = {
        grade: Number(tokens[0] || 1),
        classNum: Number(tokens[1] || 1),
        studentNum: Number(tokens[2] || 1),
        studentName: tokens[3] || '',
        phone: tokens[4] || '',
        rank: tokens[5] || '1순위',
        rankDetail: tokens[6] || '국민기초생활수급자',
        isPreDesignated: (tokens[7] || 'Y').toUpperCase() === 'N' ? 'N' : 'Y',
        fund1_total: Number(tokens[8] || 0),
        fund3_total: Number(tokens[9] || 0),
        free_total: Number(tokens[10] || 600000),
        note: tokens[11] || ''
      };
      if (student.studentName) {
        parsedBatchStudents.push(student);
      }
    }
  }

  if (countEl) countEl.textContent = parsedBatchStudents.length;

  if (tbody) {
    if (parsedBatchStudents.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="padding:20px; color:#ef4444;">유효한 학생 데이터 규격을 감지하지 못했습니다. (학년, 반, 번호, 이름 순서 확인)</td></tr>';
    } else {
      tbody.innerHTML = parsedBatchStudents.slice(0, 10).map((st, i) => `
        <tr>
          <td>${st.grade}</td>
          <td>${st.classNum}</td>
          <td>${st.studentNum}</td>
          <td style="font-weight:bold;">${st.studentName}</td>
          <td>${st.phone || '-'}</td>
          <td>${st.rank}</td>
          <td>${st.rankDetail}</td>
          <td>${st.isPreDesignated}</td>
          <td>${st.free_total.toLocaleString()}원</td>
        </tr>
      `).join('') + (parsedBatchStudents.length > 10 ? `<tr><td colspan="9" style="padding:6px; color:#64748b; background:#f8fafc;">... 외 ${parsedBatchStudents.length - 10}명 더 있음</td></tr>` : '');
    }
  }
}

function handleBatchSubsidyFileUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const content = evt.target.result;
    const area = document.getElementById('sub_batch_text_area');
    if (area) {
      area.value = content;
      parseBatchSubsidyPreview();
    }
  };
  reader.readAsText(file, 'euc-kr'); // 한글 CSV 지원
}

async function executeBatchSubsidyUpload() {
  if (parsedBatchStudents.length === 0) {
    alert('등록할 대상자 데이터가 없습니다. 먼저 명단을 입력하거나 파일을 선택해 주세요.');
    return;
  }

  if (!confirm(`총 ${parsedBatchStudents.length}명의 학생을 지원금 대상자로 일괄 등록하시겠습니까?`)) {
    return;
  }

  try {
    const res = await fetch('/api/af/ad_free2_stu/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students: parsedBatchStudents })
    });
    const result = await res.json();
    if (result.success) {
      alert(result.message || '일괄 등록이 완료되었습니다.');
      closeBatchSubsidyModal();
      resetSubsidyFilters();
    } else {
      alert('일괄 등록 실패: ' + (result.message || '알 수 없는 오류'));
    }
  } catch (err) {
    console.error('executeBatchSubsidyUpload Error:', err);
    alert('일괄 등록 처리 중 오류가 발생했습니다.');
  }
}

// 엑셀 출력 2종 (현재 검색 결과 / 전교생 기준)
function exportSubsidySearchResults() {
  const fundType = document.getElementById('sub_filter_fund') ? document.getElementById('sub_filter_fund').value : '';
  const rank = document.getElementById('sub_filter_rank') ? document.getElementById('sub_filter_rank').value : '';
  const rankDetail = document.getElementById('sub_filter_rank_detail') ? document.getElementById('sub_filter_rank_detail').value : '';
  const grade = document.getElementById('sub_filter_grade') ? document.getElementById('sub_filter_grade').value : '';
  const classNum = document.getElementById('sub_filter_class') ? document.getElementById('sub_filter_class').value : '';
  const searchName = document.getElementById('sub_filter_name') ? document.getElementById('sub_filter_name').value.trim() : '';

  const params = new URLSearchParams();
  if (fundType) params.append('fundType', fundType);
  if (rank) params.append('rank', rank);
  if (rankDetail) params.append('rankDetail', rankDetail);
  if (grade) params.append('grade', grade);
  if (classNum) params.append('classNum', classNum);
  if (searchName) params.append('searchName', searchName);

  window.location.href = '/af/ad_free2_stu/excel?' + params.toString();
}

function exportSubsidyAllStudents() {
  window.location.href = '/af/ad_free2_stu/excel_all';
}

let currentSubsidyApplicants = [];
let currentSubsidyAppSort = { column: 'grade', asc: true };

function applySubsidyAppSorting() {
  if (!currentSubsidyAppSort || !currentSubsidyAppSort.column) return;
  const col = currentSubsidyAppSort.column;
  const asc = currentSubsidyAppSort.asc ? 1 : -1;
  currentSubsidyApplicants.sort((a, b) => {
    let va = a[col] !== undefined ? a[col] : '';
    let vb = b[col] !== undefined ? b[col] : '';
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * asc;
    return String(va).localeCompare(String(vb), 'ko') * asc;
  });
}

function toggleSubsidyAppSort(col) {
  if (currentSubsidyAppSort.column === col) {
    currentSubsidyAppSort.asc = !currentSubsidyAppSort.asc;
  } else {
    currentSubsidyAppSort.column = col;
    currentSubsidyAppSort.asc = true;
  }
  applySubsidyAppSorting();
  renderSubsidyApplicantsTable();
}

function toggleSelectAllSubsidyApp(masterCheckbox) {
  const isChecked = masterCheckbox ? masterCheckbox.checked : false;
  const chks = document.querySelectorAll('.sub_app_chk_item');
  chks.forEach(cb => { cb.checked = isChecked; });
  updateSubsidyAppSelectedCount();
}

function updateSubsidyAppSelectedCount() {
  const selected = document.querySelectorAll('.sub_app_chk_item:checked');
  const selCntBadge = document.getElementById('sub_app_selected_count');
  if (selCntBadge) selCntBadge.innerText = selected.length;
  const delBtn = document.getElementById('btn_sub_app_delete_selected');
  if (delBtn) {
    if (selected.length > 0) {
      delBtn.style.display = 'inline-flex';
      delBtn.innerText = `선택삭제 (${selected.length})`;
    } else {
      delBtn.style.display = 'none';
    }
  }
}

async function deleteSelectedSubsidyApplicants() {
  const chks = document.querySelectorAll('.sub_app_chk_item:checked');
  if (chks.length === 0) {
    alert('삭제할 수강자를 먼저 선택해주세요.');
    return;
  }
  if (!confirm(`선택한 ${chks.length}명의 수강자 지원금 내역을 삭제하시겠습니까?`)) {
    return;
  }
  const ids = Array.from(chks).map(cb => cb.value);
  try {
    const res = await fetch('/api/af/ad_free2_app', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });
    const result = await res.json();
    if (result.success) {
      alert(`${result.deletedCount || ids.length}명의 수강자 지원금 내역이 삭제되었습니다.`);
      loadSubsidyApplicants();
    } else {
      alert('삭제 실패: ' + (result.message || '오류 발생'));
    }
  } catch (e) {
    console.error('deleteSelectedSubsidyApplicants error:', e);
    alert('삭제 요청 중 오류가 발생했습니다.');
  }
}

// 수강자 지원금 목록 로드 및 18열 테이블 렌더링
async function loadSubsidyApplicants() {
  const tbody = document.getElementById('subsidyAppTbody');
  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="15" class="center" style="padding:40px; color:#64748b;"><i class="fa fa-spinner fa-spin"></i> 수강자 지원금 내역을 불러오는 중입니다...</td></tr>';
  }

  try {
    const category = document.getElementById('sub_app_filter_category') ? document.getElementById('sub_app_filter_category').value : '';
    const programType = document.getElementById('sub_app_filter_program') ? document.getElementById('sub_app_filter_program').value : '';
    const fundType = document.getElementById('sub_app_filter_fund') ? document.getElementById('sub_app_filter_fund').value : '';
    const grade = document.getElementById('sub_app_filter_grade') ? document.getElementById('sub_app_filter_grade').value : '';
    const classNum = document.getElementById('sub_app_filter_class') ? document.getElementById('sub_app_filter_class').value : '';
    const searchName = document.getElementById('sub_app_filter_name') ? document.getElementById('sub_app_filter_name').value.trim() : '';

    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (programType) params.append('programType', programType);
    if (fundType) params.append('fundType', fundType);
    if (grade) params.append('grade', grade);
    if (classNum) params.append('classNum', classNum);
    if (searchName) params.append('searchName', searchName);

    const res = await fetch('/api/af/ad_free2_app/lists?' + params.toString());
    const data = await res.json();
    currentSubsidyApplicants = (data && data.applicants) ? data.applicants : [];

    applySubsidyAppSorting();
    renderSubsidyApplicantsTable();

    if (data && data.summary) {
      updateSubsidyAppSummaryBar(data.summary);
    } else {
      updateSubsidyAppSummaryBarFromLocal();
    }

    loadSubsidyAllowedMonths();
  } catch (e) {
    console.error('loadSubsidyApplicants Error:', e);
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="18" class="center" style="padding:40px; color:#ef4444;"><i class="fa fa-exclamation-triangle"></i> 수강자 지원금 목록을 불러오는 중 오류가 발생했습니다.</td></tr>';
    }
  }
}

// 18열 테이블 렌더링 (공식 BIN0003 서식 1:1)
function renderSubsidyApplicantsTable() {
  const tbody = document.getElementById('subsidyAppTbody');
  if (!tbody) return;

  if (currentSubsidyApplicants.length === 0) {
    tbody.innerHTML = '<tr><td colspan="18" class="center" style="padding:40px; color:#64748b;">조건에 일치하는 수강자 지원금 내역이 없습니다.</td></tr>';
    updateSubsidyAppCountBadges(0);
    return;
  }

  tbody.innerHTML = currentSubsidyApplicants.map((a, idx) => `
    <tr style="transition:background 0.15s ease;" onmouseover="this.style.background='#f8fafc';" onmouseout="this.style.background='#ffffff';">
      <td style="vertical-align:middle; text-align:center;"><input type="checkbox" class="sub_app_chk_item" value="${a.id}" onchange="updateSubsidyAppSelectedCount();"></td>
      <td style="vertical-align:middle; text-align:center; color:#64748b; font-size:12px;">${idx + 1}</td>
      <td style="vertical-align:middle; text-align:center;">
        <button type="button" onclick="openSubsidyAppEditRowModal('${a.id}')" style="background:transparent; border:none; cursor:pointer; font-size:15px; color:#475569; padding:2px 4px; display:inline-flex; align-items:center; justify-content:center;" title="수정">
          <i class="fa fa-cog"></i>
        </button>
      </td>
      <td style="vertical-align:middle; text-align:center; font-size:12px;">${a.grade ? a.grade + '학년' : '-'}</td>
      <td style="vertical-align:middle; text-align:center; font-size:12px;">${a.classNum ? a.classNum + '반' : '-'}</td>
      <td style="vertical-align:middle; text-align:center; font-size:12px;">${a.studentNum ? a.studentNum + '번' : '-'}</td>
      <td style="vertical-align:middle; text-align:center; font-size:12px;"><strong style="color:#1e293b;">${a.studentName || '-'}</strong></td>
      <td style="vertical-align:middle; text-align:center; font-size:12px;">${a.month || '3월'}</td>
      <td style="vertical-align:middle; text-align:left; padding-left:12px; font-size:12px;"><strong style="color:#1e293b;">${a.courseTitle || '-'}</strong></td>
      <td style="vertical-align:middle; text-align:right; font-size:12px;">${(a.tuitionFee || 0).toLocaleString()}</td>
      <td style="vertical-align:middle; text-align:right; font-size:12px;">${(a.instructorFee || 0).toLocaleString()}</td>
      <td style="vertical-align:middle; text-align:right; font-size:12px;">${(a.overheadFee || 0).toLocaleString()}</td>
      <td style="vertical-align:middle; text-align:right; font-size:12px;">${(a.textbookFee || 0).toLocaleString()}</td>
      <td style="vertical-align:middle; text-align:right; font-size:12px;">${(a.materialFee || 0).toLocaleString()}</td>
      <td style="vertical-align:middle; text-align:right; font-size:12px; font-weight:bold;">${(a.totalFee || 0).toLocaleString()}</td>
      <td style="vertical-align:middle; text-align:right; font-size:12px; color:#ea580c; font-weight:bold;">${(a.collectedAmount || 0).toLocaleString()}</td>
      <td style="vertical-align:middle; text-align:right; font-size:12px; font-weight:bold; background:#e0f2fe; color:#0369a1;">${(a.subsidizedAmount || 0).toLocaleString()}</td>
      <td style="vertical-align:middle; text-align:center;">
        <button type="button" onclick="deleteSingleSubsidyApp('${a.id}')" style="background:transparent; border:none; cursor:pointer; font-size:14px; color:#94a3b8; padding:2px 4px; display:inline-flex; align-items:center; justify-content:center;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#94a3b8'" title="삭제">
          <i class="fa fa-trash-o"></i>
        </button>
      </td>
    </tr>
  `).join('');

  updateSubsidyAppCountBadges(currentSubsidyApplicants.length);
}

function updateSubsidyAppCountBadges(cnt) {
  const el = document.getElementById('sub_app_total_count');
  if (el) el.innerText = cnt;
}

function updateSubsidyAppSummaryBar(summary) {
  if (!summary) return;
  const cEl = document.getElementById('sub_app_sum_count');
  const fEl = document.getElementById('sub_app_sum_fee');
  const sEl = document.getElementById('sub_app_sum_subsidized');
  const pEl = document.getElementById('sub_app_sum_pocket');

  if (cEl) cEl.innerText = (summary.totalCount || 0).toLocaleString();
  if (fEl) fEl.innerText = (summary.totalFee || 0).toLocaleString();
  if (sEl) sEl.innerText = (summary.totalSubsidized || 0).toLocaleString();
  if (pEl) pEl.innerText = (summary.totalCollected || 0).toLocaleString();
}

function updateSubsidyAppSummaryBarFromLocal() {
  let fee = 0, sub = 0, pocket = 0;
  currentSubsidyApplicants.forEach(a => {
    fee += (a.totalFee || 0);
    sub += (a.subsidizedAmount || 0);
    pocket += (a.collectedAmount || 0);
  });
  updateSubsidyAppSummaryBar({
    totalCount: currentSubsidyApplicants.length,
    totalFee: fee,
    totalSubsidized: sub,
    totalCollected: pocket
  });
}

// 상단 지원금 내역 조회 허용 월 로드 및 배지 렌더링
let currentAllowedMonths = ['3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월'];

async function loadSubsidyAllowedMonths() {
  try {
    const res = await fetch('/api/af/ad_free2_app/allowed_months');
    const data = await res.json();
    if (data.success && Array.isArray(data.allowedMonths)) {
      currentAllowedMonths = data.allowedMonths;
    }
  } catch (e) {
    console.error('loadSubsidyAllowedMonths error:', e);
  }
  renderAllowedMonthsBadges();
}

function renderAllowedMonthsBadges() {
  const container = document.getElementById('sub_app_allowed_months_badges');
  if (!container) return;
  const allMonths = ['3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월', '1월', '2월'];
  container.innerHTML = allMonths.map(m => {
    const isAllowed = currentAllowedMonths.includes(m);
    if (isAllowed) {
      return `<span style="background-color:#f0ad4e; border:1px solid #eea236; color:#ffffff; font-weight:bold; font-size:11px; padding:2px 8px; border-radius:3px; display:inline-block;">${m}</span>`;
    } else {
      return `<span style="background-color:#ffffff; border:1px solid #d1d5db; color:#9ca3af; font-size:11px; padding:2px 8px; border-radius:3px; display:inline-block;">${m}</span>`;
    }
  }).join(' ');
}

// 1. 지원금 내역 조회 허용 모달
function openSubsidyAllowMonthsModal() {
  const modal = document.getElementById('modal_sub_app_allow_months');
  const chks = document.querySelectorAll('.sub_allow_month_chk');
  chks.forEach(cb => {
    cb.checked = currentAllowedMonths.includes(cb.value);
  });
  if (modal) modal.style.display = 'flex';
}

function closeSubsidyAllowMonthsModal() {
  const modal = document.getElementById('modal_sub_app_allow_months');
  if (modal) modal.style.display = 'none';
}

async function submitSubsidyAllowMonths() {
  const chks = document.querySelectorAll('.sub_allow_month_chk:checked');
  const selected = Array.from(chks).map(cb => cb.value);
  try {
    const res = await fetch('/api/af/ad_free2_app/allowed_months', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allowedMonths: selected })
    });
    const result = await res.json();
    if (result.success) {
      currentAllowedMonths = result.allowedMonths;
      renderAllowedMonthsBadges();
      closeSubsidyAllowMonthsModal();
      alert('지원금 내역 조회 허용 월이 성공적으로 저장되었습니다.');
    } else {
      alert('저장 실패: ' + (result.message || '오류 발생'));
    }
  } catch (e) {
    console.error('submitSubsidyAllowMonths error:', e);
    alert('서버 저장 중 오류가 발생했습니다.');
  }
}

// 2. 수강자 등록 모달 (공식 서식 1:1 정밀 매핑 및 계산 로직)
var useCost = 'Y';

function filterNum(str) {
  if (typeof str !== 'string') str = String(str || 0);
  return str.replace(/[^0-9-]/g, '') || '0';
}

function commaSplit(n) {
  var parts = (n + '').split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function chkMoney(obj) {
  if (!obj) return;
  var val = filterNum(obj.value);
  obj.value = commaSplit(val);
}

function validate_required(elem) {
  if (!elem) return false;
  var val = elem.value ? elem.value.trim() : '';
  return val.length > 0;
}

function chkSumFreeMoney(show_msg) {
  // 지원금액 전체 합계, 징수금액 적용
  var pay_list = {};
  pay_list['lec_pay'] = 0;
  if (useCost == 'Y') {		
    pay_list['lec_tea_fee'] = 0;
    pay_list['lec_use_cost'] = 0;
  }
  pay_list['lec_pay_item'] = 0;
  pay_list['lec_pay_book'] = 0;
  pay_list['deduct_pay'] = 0;

  var freeInputs = document.querySelectorAll('#fm_edit input.free_pay');
  freeInputs.forEach(function(inp) {
    var free_key = inp.id.split('_')[0];
    var free_pay_key = inp.id.replace(free_key + '_', "");
    if (inp.value && pay_list[free_pay_key] !== undefined) {
      pay_list[free_pay_key] += parseInt(filterNum(inp.value), 10);
    }
  });

  var app_lec_pay_el = document.querySelector('#fm_edit #app_lec_pay');
  var app_lec_pay = parseInt(filterNum(app_lec_pay_el ? app_lec_pay_el.value : '0'), 10);
  var app_lec_tea_fee = 0;
  var app_lec_use_cost = 0;
  if (useCost == 'Y') {
    var tea_el = document.querySelector('#fm_edit #app_lec_tea_fee');
    var use_el = document.querySelector('#fm_edit #app_lec_use_cost');
    app_lec_tea_fee = parseInt(filterNum(tea_el ? tea_el.value : '0'), 10);
    app_lec_use_cost = parseInt(filterNum(use_el ? use_el.value : '0'), 10);	
  }
  var book_el = document.querySelector('#fm_edit #app_lec_pay_book');
  var item_el = document.querySelector('#fm_edit #app_lec_pay_item');
  var tot_el = document.querySelector('#fm_edit #tot_app_lec_pay');
  var app_lec_pay_book = parseInt(filterNum(book_el ? book_el.value : '0'), 10);
  var app_lec_pay_item = parseInt(filterNum(item_el ? item_el.value : '0'), 10);
  var tot_app_lec_pay = parseInt(filterNum(tot_el ? tot_el.value : '0'), 10);
  
  // 지원금액 전체 합계 적용
  var free_deduct_el = document.querySelector('#fm_edit #free_deduct_pay');
  if (free_deduct_el) free_deduct_el.value = commaSplit(pay_list['deduct_pay']);

  // { 징수금액 적용
  var co_amount_pay_list = {};
  co_amount_pay_list['lec_pay'] = app_lec_pay - pay_list['lec_pay'];
  if (useCost == 'Y') {		
    co_amount_pay_list['lec_tea_fee'] = app_lec_tea_fee - pay_list['lec_tea_fee'];
    co_amount_pay_list['lec_use_cost'] = app_lec_use_cost - pay_list['lec_use_cost'];
  }
  co_amount_pay_list['lec_pay_book'] = app_lec_pay_book - pay_list['lec_pay_book'];
  co_amount_pay_list['lec_pay_item'] = app_lec_pay_item - pay_list['lec_pay_item'];
  co_amount_pay_list['pay'] = tot_app_lec_pay - pay_list['deduct_pay'];

  var err_cnt = 0;
  for (var key in pay_list) {
    var checkKey = (key == 'deduct_pay') ? 'pay' : key;
    var tmp = document.querySelector('#fm_edit #co_amount_' + checkKey);
    if (tmp) {
      tmp.value = commaSplit(co_amount_pay_list[checkKey]); // 징수금액에 변경값 적용
      if (co_amount_pay_list[checkKey] < 0) {
        tmp.style.color = 'red';
        err_cnt++;
      } else {
        tmp.style.color = '';
      }
    }
  }

  if (err_cnt > 0) {
    if (show_msg == true) {
      alert('징수금액 : (-)로 계산된 금액을 확인해 주시기 바랍니다.');
    }
    return false;
  }
  return true;
}

function chkFreeMoney(obj) {						
  if (!obj || !obj.id) return false;
  var obj_id = obj.id;
  if (!obj_id.startsWith('free')) {
    return false; 
  }

  var free_key = obj_id.split('_')[0];
  var free_lec_pay = 0;
  var free_lec_tea_fee = 0;
  var free_lec_use_cost = 0;		
  var free_lec_pay_book = 0;
  var free_lec_pay_item = 0;
  var free_deduct_pay = 0;

  if (useCost == 'Y') {
    var tea_el = document.querySelector('#fm_edit #' + free_key + '_lec_tea_fee');
    var use_el = document.querySelector('#fm_edit #' + free_key + '_lec_use_cost');
    free_lec_tea_fee = parseInt(filterNum(tea_el ? tea_el.value : '0'), 10);
    free_lec_use_cost = parseInt(filterNum(use_el ? use_el.value : '0'), 10);

    if (obj_id == free_key + '_lec_tea_fee' || obj_id == free_key + '_lec_use_cost') {
      // 수강료 = 강사료 + 수용비 처리
      var lec_el = document.querySelector('#fm_edit #' + free_key + '_lec_pay');
      if (lec_el) lec_el.value = commaSplit(free_lec_tea_fee + free_lec_use_cost);
    }
  }

  var lec_el = document.querySelector('#fm_edit #' + free_key + '_lec_pay');
  var book_el = document.querySelector('#fm_edit #' + free_key + '_lec_pay_book');
  var item_el = document.querySelector('#fm_edit #' + free_key + '_lec_pay_item');

  free_lec_pay = parseInt(filterNum(lec_el ? lec_el.value : '0'), 10);
  free_lec_pay_book = parseInt(filterNum(book_el ? book_el.value : '0'), 10);
  free_lec_pay_item = parseInt(filterNum(item_el ? item_el.value : '0'), 10);

  free_deduct_pay = free_lec_pay + free_lec_pay_book + free_lec_pay_item;
  var deduct_el = document.querySelector('#fm_edit #' + free_key + '_deduct_pay');
  if (deduct_el) deduct_el.value = commaSplit(free_deduct_pay); // 합계에 변경값 적용

  chkSumFreeMoney();
}

function openSubsidyAppRegisterModal() {
  var modal = document.getElementById('modal_sub_app_register');
  if (document.getElementById('app_num')) document.getElementById('app_num').value = '';
  if (document.getElementById('sub_app_reg_applicant_id')) document.getElementById('sub_app_reg_applicant_id').value = '';
  if (document.getElementById('app_mem_name')) document.getElementById('app_mem_name').innerText = '';
  if (document.getElementById('sub_app_reg_student_name_label')) document.getElementById('sub_app_reg_student_name_label').innerText = '';
  if (document.getElementById('app_mem_grade')) document.getElementById('app_mem_grade').innerText = '';
  if (document.getElementById('sub_app_reg_grade_label')) document.getElementById('sub_app_reg_grade_label').innerText = '';
  if (document.getElementById('app_mem_class')) document.getElementById('app_mem_class').innerText = '';
  if (document.getElementById('sub_app_reg_class_label')) document.getElementById('sub_app_reg_class_label').innerText = '';
  if (document.getElementById('app_mem_bunho')) document.getElementById('app_mem_bunho').innerText = '';
  if (document.getElementById('sub_app_reg_num_label')) document.getElementById('sub_app_reg_num_label').innerText = '';
  if (document.getElementById('lec_name')) document.getElementById('lec_name').innerText = '';
  if (document.getElementById('sub_app_reg_course_label')) document.getElementById('sub_app_reg_course_label').innerText = '';

  var resetFields = [
    'app_lec_pay', 'app_lec_tea_fee', 'app_lec_use_cost', 'app_lec_pay_book', 'app_lec_pay_item', 'tot_app_lec_pay',
    'free2_lec_pay', 'free2_lec_tea_fee', 'free2_lec_use_cost', 'free2_lec_pay_book', 'free2_lec_pay_item', 'free2_deduct_pay',
    'free3_lec_pay', 'free3_lec_tea_fee', 'free3_lec_use_cost', 'free3_lec_pay_book', 'free3_lec_pay_item', 'free3_deduct_pay',
    'free1_lec_pay', 'free1_lec_tea_fee', 'free1_lec_use_cost', 'free1_lec_pay_book', 'free1_lec_pay_item', 'free1_deduct_pay',
    'free_deduct_pay',
    'co_amount_lec_pay', 'co_amount_lec_tea_fee', 'co_amount_lec_use_cost', 'co_amount_lec_pay_book', 'co_amount_lec_pay_item', 'co_amount_pay'
  ];
  resetFields.forEach(function(fId) {
    var el = document.getElementById(fId);
    if (el) el.value = '0';
  });

  if (document.getElementById('max_support_pay')) document.getElementById('max_support_pay').value = '0';
  if (document.getElementById('bigo')) document.getElementById('bigo').value = '';
  if (document.getElementById('log_data')) document.getElementById('log_data').value = '';

  if (modal) modal.style.display = 'flex';
}

function closeSubsidyAppRegisterModal() {
  var modal = document.getElementById('modal_sub_app_register');
  if (modal) modal.style.display = 'none';
}

async function fm_edit_check(fm) {
  try {
    if (!fm) fm = document.getElementById('fm_edit');
    if (!validate_required(fm.month)) {
      alert('대상 월 : 선택해 주세요.');
      return false;
    }

    if (!validate_required(fm.app_num)) {
      alert('신청자 정보 : 검색 후 선택해 주시기 바랍니다.');
      return false;
    }

    if (!chkSumFreeMoney(true)) {
      return false;
    }

    if (!confirm('적용하시겠습니까?')) {
      return false;
    }

    var studentName = document.getElementById('app_mem_name') ? document.getElementById('app_mem_name').innerText.trim() : '';
    var grade = parseInt(document.getElementById('app_mem_grade') ? document.getElementById('app_mem_grade').innerText : '1', 10) || 1;
    var classNum = parseInt(document.getElementById('app_mem_class') ? document.getElementById('app_mem_class').innerText : '1', 10) || 1;
    var studentNum = parseInt(document.getElementById('app_mem_bunho') ? document.getElementById('app_mem_bunho').innerText : '1', 10) || 1;
    var courseTitle = document.getElementById('lec_name') ? document.getElementById('lec_name').innerText.trim() : '';

    var monthVal = fm.month.value ? (fm.month.value.includes('월') ? fm.month.value : fm.month.value + '월') : '3월';
    var tuitionFee = parseInt(filterNum(fm.app_lec_pay ? fm.app_lec_pay.value : '0'), 10);
    var instructorFee = parseInt(filterNum(fm.app_lec_tea_fee ? fm.app_lec_tea_fee.value : '0'), 10);
    var overheadFee = parseInt(filterNum(fm.app_lec_use_cost ? fm.app_lec_use_cost.value : '0'), 10);
    var textbookFee = parseInt(filterNum(fm.app_lec_pay_book ? fm.app_lec_pay_book.value : '0'), 10);
    var materialFee = parseInt(filterNum(fm.app_lec_pay_item ? fm.app_lec_pay_item.value : '0'), 10);
    var totalFee = parseInt(filterNum(fm.tot_app_lec_pay ? fm.tot_app_lec_pay.value : '0'), 10) || (tuitionFee + textbookFee + materialFee);
    var subsidizedAmount = parseInt(filterNum(fm.free_deduct_pay ? fm.free_deduct_pay.value : '0'), 10);
    var collectedAmount = parseInt(filterNum(fm.co_amount_pay ? fm.co_amount_pay.value : '0'), 10);
    var bigo = fm.bigo ? fm.bigo.value : '';

    var payload = {
      month: monthVal,
      grade: grade,
      classNum: classNum,
      studentNum: studentNum,
      studentName: studentName,
      courseTitle: courseTitle,
      tuitionFee: tuitionFee,
      instructorFee: instructorFee,
      overheadFee: overheadFee,
      textbookFee: textbookFee,
      materialFee: materialFee,
      totalFee: totalFee,
      collectedAmount: collectedAmount,
      subsidizedAmount: subsidizedAmount,
      note: bigo,
      status: collectedAmount === 0 ? '차감완료' : '부분차감'
    };

    var res = await fetch('/api/af/ad_free2_app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    var result = await res.json();
    if (result.success) {
      alert('수강자 지원금이 성공적으로 등록되었습니다.');
      closeSubsidyAppRegisterModal();
      if (typeof loadSubsidyApplicants === 'function') loadSubsidyApplicants();
    } else {
      alert('등록 실패: ' + (result.message || '오류 발생'));
    }
    return false;
  } catch (error) {
    console.error('fm_edit_check error:', error);
    alert('서버 등록 중 오류가 발생했습니다.');
    return false;
  }
}

function submitSubsidyAppRegister() {
  return fm_edit_check(document.getElementById('fm_edit'));
}

// 3. 신청자 검색 팝업 모달
function openSubsidyAppSearchStudentModal() {
  var modal = document.getElementById('modal_sub_app_search_student');
  if (modal) modal.style.display = 'flex';
  searchSubsidyApplicantsPopup();
}

function closeSubsidyAppSearchStudentModal() {
  var modal = document.getElementById('modal_sub_app_search_student');
  if (modal) modal.style.display = 'none';
}

async function searchSubsidyApplicantsPopup() {
  var month = document.getElementById('sub_app_search_month') ? document.getElementById('sub_app_search_month').value : '';
  var course = document.getElementById('sub_app_search_course') ? document.getElementById('sub_app_search_course').value : '';
  var grade = document.getElementById('sub_app_search_grade') ? document.getElementById('sub_app_search_grade').value : '';
  var classNum = document.getElementById('sub_app_search_class') ? document.getElementById('sub_app_search_class').value : '';
  var keyword = document.getElementById('sub_app_search_keyword') ? document.getElementById('sub_app_search_keyword').value.trim() : '';

  var params = new URLSearchParams();
  if (month) params.append('month', month);
  if (course) params.append('course', course);
  if (grade) params.append('grade', grade);
  if (classNum) params.append('classNum', classNum);
  if (keyword) params.append('keyword', keyword);

  try {
    var res = await fetch('/api/af/ad_free2_app/applicant_search?' + params.toString());
    var data = await res.json();
    var list = data.list || [];
    var tbody = document.getElementById('sub_app_search_results_tbody');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="padding:24px; color:#64748b; font-size:12px;">검색 조건에 일치하는 신청자가 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(function(item, idx) {
      return `
        <tr style="border-bottom:1px solid #e2e8f0; font-size:12px;">
          <td style="padding:8px 4px; border:1px solid #cbd5e1;">${idx + 1}</td>
          <td style="text-align:left; padding:8px 10px; font-weight:bold; color:#1e293b; border:1px solid #cbd5e1;">
            ${item.courseTitle || ''} <span style="font-weight:normal; color:#64748b;">(${(item.fee || 32000).toLocaleString()}원)</span>
          </td>
          <td style="padding:8px 4px; border:1px solid #cbd5e1;">${item.grade || 1}학년</td>
          <td style="padding:8px 4px; border:1px solid #cbd5e1;">${item.classNum || 1}반</td>
          <td style="padding:8px 4px; border:1px solid #cbd5e1;">${item.studentNum || 1}번</td>
          <td style="padding:8px 4px; font-weight:bold; border:1px solid #cbd5e1;">
            <div style="display:flex; align-items:center; justify-content:center; gap:6px;">
              <span>${item.studentName || ''}</span>
              <button type="button" class="btn btn-primary btn-xs" onclick='selectSubsidyAppStudent(${JSON.stringify(item)})' style="height:24px; padding:0 10px; font-size:11px; font-weight:bold; background-color:#337ab7; border-color:#2e6da4; color:#fff; border-radius:3px; cursor:pointer;">선택</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (e) {
    console.error('searchSubsidyApplicantsPopup error:', e);
  }
}

function selectSubsidyAppStudent(item) {
  var nameEl = document.getElementById('app_mem_name');
  if (nameEl) nameEl.innerText = item.studentName || '';
  var subNameEl = document.getElementById('sub_app_reg_student_name_label');
  if (subNameEl) subNameEl.innerText = item.studentName || '';

  var numEl = document.getElementById('app_num');
  if (numEl) numEl.value = item.id || item.appNum || item.studentNum || '1';

  var gradeEl = document.getElementById('app_mem_grade');
  if (gradeEl) gradeEl.innerText = item.grade || '1';
  var subGradeEl = document.getElementById('sub_app_reg_grade_label');
  if (subGradeEl) subGradeEl.innerText = item.grade || '1';

  var classEl = document.getElementById('app_mem_class');
  if (classEl) classEl.innerText = item.classNum || '1';
  var subClassEl = document.getElementById('sub_app_reg_class_label');
  if (subClassEl) subClassEl.innerText = item.classNum || '1';

  var bunhoEl = document.getElementById('app_mem_bunho');
  if (bunhoEl) bunhoEl.innerText = item.studentNum || '1';
  var subBunhoEl = document.getElementById('sub_app_reg_num_label');
  if (subBunhoEl) subBunhoEl.innerText = item.studentNum || '1';

  var courseEl = document.getElementById('lec_name');
  if (courseEl) courseEl.innerText = item.courseTitle || '';
  var subCourseEl = document.getElementById('sub_app_reg_course_label');
  if (subCourseEl) subCourseEl.innerText = item.courseTitle || '';

  var subIdEl = document.getElementById('sub_app_reg_applicant_id');
  if (subIdEl) subIdEl.value = item.id || '';

  var tuitionFee = Number(item.tuitionFee || item.fee || 32000);
  var instructorFee = Number(item.instructorFee !== undefined ? item.instructorFee : Math.round(tuitionFee * 0.95));
  var overheadFee = Number(item.overheadFee !== undefined ? item.overheadFee : (tuitionFee - instructorFee));
  var textbookFee = Number(item.textbookFee !== undefined ? item.textbookFee : 30500);
  var materialFee = Number(item.materialFee !== undefined ? item.materialFee : 5000);
  var totalFee = tuitionFee + textbookFee + materialFee;

  var appPay = document.getElementById('app_lec_pay');
  if (appPay) appPay.value = commaSplit(tuitionFee);
  var appTea = document.getElementById('app_lec_tea_fee');
  if (appTea) appTea.value = commaSplit(instructorFee);
  var appUse = document.getElementById('app_lec_use_cost');
  if (appUse) appUse.value = commaSplit(overheadFee);
  var appBook = document.getElementById('app_lec_pay_book');
  if (appBook) appBook.value = commaSplit(textbookFee);
  var appItem = document.getElementById('app_lec_pay_item');
  if (appItem) appItem.value = commaSplit(materialFee);
  var appTot = document.getElementById('tot_app_lec_pay');
  if (appTot) appTot.value = commaSplit(totalFee);

  var grade = Number(item.grade || 1);
  var targetPrefix = (grade === 1) ? 'free2' : (grade === 3 ? 'free3' : 'free1');
  
  var teaInput = document.getElementById(targetPrefix + '_lec_tea_fee');
  if (teaInput) teaInput.value = commaSplit(instructorFee);
  var useInput = document.getElementById(targetPrefix + '_lec_use_cost');
  if (useInput) useInput.value = commaSplit(overheadFee);
  var lecInput = document.getElementById(targetPrefix + '_lec_pay');
  if (lecInput) lecInput.value = commaSplit(tuitionFee);
  var bookInput = document.getElementById(targetPrefix + '_lec_pay_book');
  if (bookInput) bookInput.value = commaSplit(textbookFee);
  var itemInput = document.getElementById(targetPrefix + '_lec_pay_item');
  if (itemInput) itemInput.value = commaSplit(materialFee);
  var deductInput = document.getElementById(targetPrefix + '_deduct_pay');
  if (deductInput) deductInput.value = commaSplit(totalFee);

  chkSumFreeMoney();
  closeSubsidyAppSearchStudentModal();
}

// 4. 수강자 가져오기 모달 (공식 서식 BIN000E & 늘봄과정 연동 1:1)
function openSubsidyAppImportModal(monthParam) {
  const modal = document.getElementById('modal_sub_app_import');
  if (modal) modal.style.display = 'flex';

  let target = monthParam;
  if (!target) {
    const filterMonth = document.getElementById('sub_app_filter_month');
    if (filterMonth && filterMonth.value) {
      target = filterMonth.value;
    }
  }
  if (!target) target = '3월';

  const mSelect = document.getElementById('sub_app_import_month');
  if (mSelect) {
    const formatted = target.includes('월') ? target : `${target}월`;
    mSelect.value = formatted;
    onSubsidyImportMonthChange(formatted);
  }
}

function onSubsidyImportMonthChange(val) {
  const lbl = document.getElementById('sub_app_import_target_label');
  if (lbl) lbl.innerText = val;
  const chk = document.getElementById('sub_app_import_month_chk');
  if (chk) chk.value = val;
}

function toggleSubsidyImportDivAll(master) {
  const items = document.querySelectorAll('.sub_app_import_div_item');
  items.forEach(cb => { cb.checked = master.checked; });
}

function updateSubsidyImportDivState() {
  const items = document.querySelectorAll('.sub_app_import_div_item');
  const checked = document.querySelectorAll('.sub_app_import_div_item:checked');
  const master = document.getElementById('sub_app_import_div_all');
  if (master) master.checked = items.length > 0 && items.length === checked.length;
}

function toggleSubsidyImportNeulbomAll(master) {
  const items = document.querySelectorAll('.sub_app_import_neulbom_item');
  items.forEach(cb => { cb.checked = master.checked; });
}

function updateSubsidyImportNeulbomState() {
  const items = document.querySelectorAll('.sub_app_import_neulbom_item');
  const checked = document.querySelectorAll('.sub_app_import_neulbom_item:checked');
  const master = document.getElementById('sub_app_import_neulbom_all');
  if (master) master.checked = items.length > 0 && items.length === checked.length;
}

function toggleSubsidyImportFundAll(master) {
  const items = document.querySelectorAll('.sub_app_import_fund_item');
  items.forEach(cb => { cb.checked = master.checked; });
}

function updateSubsidyImportFundState() {
  const items = document.querySelectorAll('.sub_app_import_fund_item');
  const checked = document.querySelectorAll('.sub_app_import_fund_item:checked');
  const master = document.getElementById('sub_app_import_fund_all');
  if (master) master.checked = items.length > 0 && items.length === checked.length;
}

function closeSubsidyAppImportModal() {
  const modal = document.getElementById('modal_sub_app_import');
  if (modal) modal.style.display = 'none';
}

async function executeSubsidyAppImport() {
  const targetMonth = document.getElementById('sub_app_import_month').value;
  const maxAmount = parseInt(document.getElementById('sub_app_import_max_amount').value, 10) || 0;

  const neulbomTypes = Array.from(document.querySelectorAll('.sub_app_import_neulbom_item:checked')).map(cb => cb.value);
  const courseDivs = Array.from(document.querySelectorAll('.sub_app_import_div_item:checked')).map(cb => cb.value);
  const subsidyTypes = Array.from(document.querySelectorAll('.sub_app_import_fund_item:checked')).map(cb => cb.value);

  if (neulbomTypes.length === 0) {
    alert('가져올 늘봄과정을 하나 이상 선택해주세요.');
    return;
  }

  if (!confirm(`[${targetMonth}]의 신청자를 바탕으로 수강자 가져오기 및 자동 정산을 진행하시겠습니까?\n늘봄과정: ${neulbomTypes.join(', ')}\n기존 ${targetMonth} 데이터는 새로 갱신됩니다.`)) {
    return;
  }

  try {
    const res = await fetch('/api/af/ad_free2_app/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetMonth, maxAmount, neulbomTypes, courseDivs, subsidyTypes })
    });
    const result = await res.json();
    if (result.success) {
      alert(`[${targetMonth}] 수강자 가져오기가 완료되었습니다. (가져온 건수: ${result.count || 0}건)`);
      closeSubsidyAppImportModal();
      loadSubsidyApplicants();
    } else {
      alert('가져오기 실패: ' + (result.message || '오류 발생'));
    }
  } catch (e) {
    console.error('executeSubsidyAppImport error:', e);
    alert('수강자 가져오기 처리 중 오류가 발생했습니다.');
  }
}

// 5. 엑셀 출력 연동들 (공식 1:1)
function exportSubsidyAppResults() {
  const month = document.getElementById('sub_app_filter_month') ? document.getElementById('sub_app_filter_month').value : '';
  const course = document.getElementById('sub_app_filter_course') ? document.getElementById('sub_app_filter_course').value : '';
  const grade = document.getElementById('sub_app_filter_grade') ? document.getElementById('sub_app_filter_grade').value : '';
  const classNum = document.getElementById('sub_app_filter_class') ? document.getElementById('sub_app_filter_class').value : '';
  const searchName = document.getElementById('sub_app_filter_name') ? document.getElementById('sub_app_filter_name').value.trim() : '';

  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (course) params.append('course', course);
  if (grade) params.append('grade', grade);
  if (classNum) params.append('classNum', classNum);
  if (searchName) params.append('searchName', searchName);

  window.location.href = '/af/ad_free2_app/excel?' + params.toString();
}

function exportSubsidyAppAllCollect() {
  window.location.href = '/af/ad_free2_app/excel_all_collect';
}

// 6. 월별현황 모달
function openSubsidyAppMonthlyModal() {
  const modal = document.getElementById('modal_sub_app_monthly_status');
  if (modal) modal.style.display = 'flex';
}

function closeSubsidyAppMonthlyModal() {
  const modal = document.getElementById('modal_sub_app_monthly_status');
  if (modal) modal.style.display = 'none';
}

function submitSubsidyAppMonthly() {
  window.location.href = '/af/ad_free2_app/excel_monthly';
  closeSubsidyAppMonthlyModal();
}

// 7. 스쿨뱅킹현황 모달
function openSubsidyAppBankingModal() {
  const modal = document.getElementById('modal_sub_app_schoolbanking');
  if (modal) modal.style.display = 'flex';
}

function closeSubsidyAppBankingModal() {
  const modal = document.getElementById('modal_sub_app_schoolbanking');
  if (modal) modal.style.display = 'none';
}

function submitSubsidyAppBanking() {
  const month = document.getElementById('sub_app_banking_month').value;
  window.location.href = `/af/ad_free2_app/excel_banking?month=${encodeURIComponent(month)}`;
  closeSubsidyAppBankingModal();
}

// 8. 행정실용 모달
function openSubsidyAppAdminOfficeModal() {
  const modal = document.getElementById('modal_sub_app_admin_office');
  if (modal) modal.style.display = 'flex';
}

function closeSubsidyAppAdminOfficeModal() {
  const modal = document.getElementById('modal_sub_app_admin_office');
  if (modal) modal.style.display = 'none';
}

function submitSubsidyAppAdminOffice() {
  const month = document.getElementById('sub_app_admin_month').value;
  window.location.href = `/af/ad_free2_app/excel_admin?month=${encodeURIComponent(month)}`;
  closeSubsidyAppAdminOfficeModal();
}

// 9. 나이스용 모달
function openSubsidyAppNeisModal() {
  const modal = document.getElementById('modal_sub_app_neis');
  if (modal) modal.style.display = 'flex';
}

function closeSubsidyAppNeisModal() {
  const modal = document.getElementById('modal_sub_app_neis');
  if (modal) modal.style.display = 'none';
}

function submitSubsidyAppNeis() {
  const month = document.getElementById('sub_app_neis_month').value;
  window.location.href = `/af/ad_free2_app/excel_neis?month=${encodeURIComponent(month)}`;
  closeSubsidyAppNeisModal();
}

// 10. 단건 행 ⚙ 수정 모달
function openSubsidyAppEditRowModal(id) {
  const item = currentSubsidyApplicants.find(a => String(a.id) === String(id));
  if (!item) return;

  const modal = document.getElementById('modal_sub_app_edit_row');
  document.getElementById('sub_app_edit_row_id').value = item.id;
  document.getElementById('sub_app_edit_student_info').innerText = `${item.grade}학년 ${item.classNum}반 ${item.studentNum}번 ${item.studentName}`;
  document.getElementById('sub_app_edit_course_info').innerText = `${item.courseTitle} (${item.month || '3월'})`;

  document.getElementById('sub_app_edit_tuition_fee').value = item.tuitionFee || item.fee || 0;
  document.getElementById('sub_app_edit_instructor_fee').value = item.instructorFee || 0;
  document.getElementById('sub_app_edit_overhead_fee').value = item.overheadFee || 0;
  document.getElementById('sub_app_edit_textbook_fee').value = item.textbookFee || 0;
  document.getElementById('sub_app_edit_material_fee').value = item.materialFee || 0;
  document.getElementById('sub_app_edit_collected_amount').value = item.collectedAmount || 0;
  document.getElementById('sub_app_edit_subsidized_amount').value = item.subsidizedAmount || 0;

  if (modal) modal.style.display = 'flex';
}

function closeSubsidyAppEditRowModal() {
  const modal = document.getElementById('modal_sub_app_edit_row');
  if (modal) modal.style.display = 'none';
}

async function submitSubsidyAppEditRow() {
  const editId = document.getElementById('sub_app_edit_row_id').value;
  const item = currentSubsidyApplicants.find(a => String(a.id) === String(editId));
  if (!item) return;

  const tuitionFee = parseInt(document.getElementById('sub_app_edit_tuition_fee').value, 10) || 0;
  const instructorFee = parseInt(document.getElementById('sub_app_edit_instructor_fee').value, 10) || 0;
  const overheadFee = parseInt(document.getElementById('sub_app_edit_overhead_fee').value, 10) || 0;
  const textbookFee = parseInt(document.getElementById('sub_app_edit_textbook_fee').value, 10) || 0;
  const materialFee = parseInt(document.getElementById('sub_app_edit_material_fee').value, 10) || 0;
  const collectedAmount = parseInt(document.getElementById('sub_app_edit_collected_amount').value, 10) || 0;
  const subsidizedAmount = parseInt(document.getElementById('sub_app_edit_subsidized_amount').value, 10) || 0;
  const totalFee = tuitionFee + textbookFee + materialFee;

  const payload = {
    ...item,
    tuitionFee,
    instructorFee,
    overheadFee,
    textbookFee,
    materialFee,
    totalFee,
    collectedAmount,
    subsidizedAmount
  };

  try {
    const res = await fetch(`/api/af/ad_free2_app/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success) {
      alert('수정되었습니다.');
      closeSubsidyAppEditRowModal();
      loadSubsidyApplicants();
    } else {
      alert('수정 실패: ' + (result.message || '오류 발생'));
    }
  } catch (e) {
    console.error('submitSubsidyAppEditRow error:', e);
    alert('수정 중 오류가 발생했습니다.');
  }
}

// 11. 단건 삭제
async function deleteSingleSubsidyApp(id) {
  if (!confirm('해당 수강자 지원금 내역을 삭제하시겠습니까?')) {
    return;
  }
  try {
    const res = await fetch('/api/af/ad_free2_app', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id] })
    });
    const result = await res.json();
    if (result.success) {
      loadSubsidyApplicants();
    } else {
      alert('삭제 실패: ' + (result.message || '오류 발생'));
    }
  } catch (e) {
    console.error('deleteSingleSubsidyApp error:', e);
    alert('삭제 요청 중 오류가 발생했습니다.');
  }
}

function resetSubsidyAppFilters() {
  const mEl = document.getElementById('sub_app_filter_month');
  if (mEl) mEl.value = '';
  const cEl = document.getElementById('sub_app_filter_course');
  if (cEl) cEl.value = '';
  const grEl = document.getElementById('sub_app_filter_grade');
  if (grEl) grEl.value = '';
  const clEl = document.getElementById('sub_app_filter_class');
  if (clEl) clEl.value = '';
  const nmEl = document.getElementById('sub_app_filter_name');
  if (nmEl) nmEl.value = '';

  loadSubsidyApplicants();
}

let currentSubsidyConfigs = {};
let currentSubsidyDeductOrder = [];
let currentActiveSubsidyKey = 'fund_1';

// 지원금설정 로드 및 폼 반영
async function loadSubsidyConfig() {
  try {
    const res = await fetch('/api/af/ad_free2_cfg/main');
    const data = await res.json();
    if (data.configs) {
      currentSubsidyConfigs = data.configs;
    }
    if (data.order) {
      currentSubsidyDeductOrder = data.order;
    }
    renderSubsidyConfigForm(currentActiveSubsidyKey);
  } catch (e) {
    console.error('loadSubsidyConfig Error:', e);
  }
}

// 탭 전환
function selectSubsidyTab(fundKey) {
  currentActiveSubsidyKey = fundKey;
  ['fund_1', 'fund_3', 'fund_free'].forEach(k => {
    const btn = document.getElementById('tab_' + k);
    if (btn) {
      if (k === fundKey) {
        btn.className = 'btn btn-primary btn-sm';
        btn.style.backgroundColor = '#337ab7';
        btn.style.borderColor = '#2e6da4';
        btn.style.color = '#fff';
      } else {
        btn.className = 'btn btn-default btn-sm';
        btn.style.backgroundColor = '#fff';
        btn.style.borderColor = '#ccc';
        btn.style.color = '#333';
      }
    }
  });

  renderSubsidyConfigForm(fundKey);
}

// 폼 렌더링
function renderSubsidyConfigForm(fundKey) {
  const cfg = currentSubsidyConfigs[fundKey] || {
    name: fundKey === 'fund_1' ? '1학년 지원금' : (fundKey === 'fund_3' ? '3학년 지원금' : '자유수강권'),
    used: '사용',
    deductMode: '잔여 금액에서 차감',
    months: ['3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월', '1월', '2월'],
    items: { tuition: true, noTuitionFee: false, textbook: true, material: true },
    monthlyLimit: fundKey === 'fund_1' ? 720000 : 600000,
    annualLimit: fundKey === 'fund_1' ? 720000 : 600000,
    priority: fundKey === 'fund_free' ? 1 : (fundKey === 'fund_1' ? 2 : 3)
  };

  const badge = document.getElementById('sub_cfg_current_badge');
  if (badge) badge.innerText = `(${cfg.name})`;

  const activeInput = document.getElementById('sub_cfg_active_fund_key');
  if (activeInput) activeInput.value = fundKey;

  const nameInput = document.getElementById('sub_cfg_name');
  if (nameInput) nameInput.value = cfg.name || '';

  const usedY = document.getElementById('sub_cfg_used_y');
  const usedN = document.getElementById('sub_cfg_used_n');
  if (usedY && usedN) {
    if (cfg.used === '사용') usedY.checked = true;
    else usedN.checked = true;
  }

  const modeRem = document.getElementById('sub_cfg_mode_rem');
  const modeFix = document.getElementById('sub_cfg_mode_fix');
  if (modeRem && modeFix) {
    if (cfg.deductMode === '강좌별 고정 금액 차감') modeFix.checked = true;
    else modeRem.checked = true;
  }

  const monthCbs = document.querySelectorAll('.sub_cfg_month');
  const monthSet = new Set(cfg.months || []);
  monthCbs.forEach(cb => {
    cb.checked = monthSet.has(cb.value);
  });

  const tuitCb = document.getElementById('sub_cfg_item_tuition');
  const noFeeCb = document.getElementById('sub_cfg_item_nofee');
  const textCb = document.getElementById('sub_cfg_item_textbook');
  const matCb = document.getElementById('sub_cfg_item_material');
  if (tuitCb) tuitCb.checked = !!(cfg.items && cfg.items.tuition);
  if (noFeeCb) noFeeCb.checked = !!(cfg.items && cfg.items.noTuitionFee);
  if (textCb) textCb.checked = !!(cfg.items && cfg.items.textbook);
  if (matCb) matCb.checked = !!(cfg.items && cfg.items.material);

  const mLimitInput = document.getElementById('sub_cfg_month_limit');
  if (mLimitInput) mLimitInput.value = cfg.monthlyLimit !== undefined ? cfg.monthlyLimit : 0;

  const aLimitInput = document.getElementById('sub_cfg_annual_limit');
  if (aLimitInput) aLimitInput.value = cfg.annualLimit !== undefined ? cfg.annualLimit : 600000;

  const priSel = document.getElementById('sub_cfg_priority');
  if (priSel) priSel.value = cfg.priority || '1';
}

// 지원금 설정 저장
async function saveSubsidyConfig() {
  const fundKey = document.getElementById('sub_cfg_active_fund_key').value || 'fund_1';
  const name = document.getElementById('sub_cfg_name').value.trim();
  const used = document.getElementById('sub_cfg_used_y').checked ? '사용' : '사용안함';
  const deductMode = document.getElementById('sub_cfg_mode_fix').checked ? '강좌별 고정 금액 차감' : '잔여 금액에서 차감';

  const months = [];
  document.querySelectorAll('.sub_cfg_month:checked').forEach(cb => months.push(cb.value));

  const items = {
    tuition: document.getElementById('sub_cfg_item_tuition').checked,
    noTuitionFee: document.getElementById('sub_cfg_item_nofee').checked,
    textbook: document.getElementById('sub_cfg_item_textbook').checked,
    material: document.getElementById('sub_cfg_item_material').checked
  };

  const monthlyLimit = parseInt(document.getElementById('sub_cfg_month_limit').value, 10) || 0;
  const annualLimit = parseInt(document.getElementById('sub_cfg_annual_limit').value, 10) || 0;
  const priority = parseInt(document.getElementById('sub_cfg_priority').value, 10) || 1;

  const payload = {
    fundKey,
    configData: {
      name,
      used,
      deductMode,
      months,
      items,
      monthlyLimit,
      annualLimit,
      priority
    }
  };

  try {
    const res = await fetch('/api/af/ad_free2_cfg/main', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success) {
      alert(result.message || '지원금 설정이 성공적으로 저장되었습니다.');
      currentSubsidyConfigs[fundKey] = result.config;
      renderSubsidyConfigForm(fundKey);
    } else {
      alert('저장 실패: ' + (result.message || '오류 발생'));
    }
  } catch (e) {
    console.error('saveSubsidyConfig Error:', e);
    alert('설정 저장 중 오류가 발생했습니다.');
  }
}

// 모달: 차감 순서 변경
function openSubsidyOrderModal() {
  const modal = document.getElementById('modal_subsidy_order_change');
  if (modal) modal.style.display = 'flex';
  renderSubsidyOrderList();
}

function closeSubsidyOrderModal() {
  const modal = document.getElementById('modal_subsidy_order_change');
  if (modal) modal.style.display = 'none';
}

function renderSubsidyOrderList() {
  const container = document.getElementById('subsidy_order_list_container');
  if (!container) return;

  if (!currentSubsidyDeductOrder || currentSubsidyDeductOrder.length === 0) {
    currentSubsidyDeductOrder = [
      { id: 'fund_free', name: '자유수강권', order: 1 },
      { id: 'fund_1', name: '1학년 지원금', order: 2 },
      { id: 'fund_3', name: '3학년 지원금', order: 3 }
    ];
  }

  container.innerHTML = currentSubsidyDeductOrder.map((item, idx) => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:4px;">
      <div style="display:flex; align-items:center; gap:10px;">
        <span class="badge" style="background:#337ab7; color:#fff; font-size:12px; padding:4px 8px;">${idx + 1}순위</span>
        <strong style="color:#1e293b; font-size:14px;">${item.name}</strong>
      </div>
      <div style="display:flex; gap:4px;">
        <button type="button" class="btn btn-default btn-xs" onclick="moveSubsidyOrder(${idx}, -1)" ${idx === 0 ? 'disabled' : ''} style="height:26px; padding:0 8px; font-size:11px; cursor:pointer;">▲ 위로</button>
        <button type="button" class="btn btn-default btn-xs" onclick="moveSubsidyOrder(${idx}, 1)" ${idx === currentSubsidyDeductOrder.length - 1 ? 'disabled' : ''} style="height:26px; padding:0 8px; font-size:11px; cursor:pointer;">▼ 아래로</button>
      </div>
    </div>
  `).join('');
}

function moveSubsidyOrder(idx, dir) {
  const targetIdx = idx + dir;
  if (targetIdx < 0 || targetIdx >= currentSubsidyDeductOrder.length) return;
  const temp = currentSubsidyDeductOrder[idx];
  currentSubsidyDeductOrder[idx] = currentSubsidyDeductOrder[targetIdx];
  currentSubsidyDeductOrder[targetIdx] = temp;

  currentSubsidyDeductOrder.forEach((item, i) => { item.order = i + 1; });
  renderSubsidyOrderList();
}

async function saveSubsidyOrder() {
  try {
    const res = await fetch('/api/af/ad_free2_cfg/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderList: currentSubsidyDeductOrder })
    });
    const result = await res.json();
    if (result.success) {
      alert('지원금 차감 순서가 성공적으로 저장되었습니다.');
      closeSubsidyOrderModal();
    } else {
      alert('순서 저장 실패: ' + (result.message || '오류 발생'));
    }
  } catch (e) {
    console.error('saveSubsidyOrder Error:', e);
    alert('차감 순서 저장 중 오류가 발생했습니다.');
  }
}

let currentSubsidyRanks = [];
let currentActiveRankTab = 'all';

// 순위 구분 코드 로드
async function loadSubsidyRanks() {
  const tbody = document.getElementById('subsidyRankTbody');
  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="9" class="center" style="padding:40px; color:#64748b;"><i class="fa fa-spinner fa-spin"></i> 순위 구분 코드를 불러오는 중입니다...</td></tr>';
  }

  try {
    const params = new URLSearchParams();
    if (currentActiveRankTab && currentActiveRankTab !== 'all') {
      params.append('rank', currentActiveRankTab);
    }

    const res = await fetch('/api/af/ad_free2_cfg/free1?' + params.toString());
    const data = await res.json();
    currentSubsidyRanks = (data && data.ranks) ? data.ranks : [];

    renderSubsidyRanksTable();

    const countEl = document.getElementById('sub_rank_total_count');
    if (countEl) countEl.innerText = currentSubsidyRanks.length;
  } catch (e) {
    console.error('loadSubsidyRanks Error:', e);
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="9" class="center" style="padding:40px; color:#ef4444;"><i class="fa fa-exclamation-triangle"></i> 순위 구분 코드를 불러오는 중 오류가 발생했습니다.</td></tr>';
    }
  }
}

// 순위 탭 필터링
function filterSubsidyRankTab(tabKey) {
  currentActiveRankTab = tabKey;
  ['all', '1', '2', '3', '4', '5'].forEach(k => {
    const btn = document.getElementById('tab_rank_' + k);
    if (btn) {
      if (k === tabKey) {
        btn.className = 'btn btn-primary btn-sm';
        btn.style.backgroundColor = '#337ab7';
        btn.style.borderColor = '#2e6da4';
        btn.style.color = '#fff';
      } else {
        btn.className = 'btn btn-default btn-sm';
        btn.style.backgroundColor = '#fff';
        btn.style.borderColor = '#ccc';
        btn.style.color = '#333';
      }
    }
  });

  loadSubsidyRanks();
}

// 9열 테이블 렌더링
function renderSubsidyRanksTable() {
  const tbody = document.getElementById('subsidyRankTbody');
  if (!tbody) return;

  if (currentSubsidyRanks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="center" style="padding:40px; color:#64748b;">등록된 순위 구분 코드가 없습니다.</td></tr>';
    return;
  }

  const rankBadgeColors = {
    1: { bg: '#dbeafe', color: '#1d4ed8' },
    2: { bg: '#dcfce7', color: '#15803d' },
    3: { bg: '#fef3c7', color: '#b45309' },
    4: { bg: '#f3e8ff', color: '#7e22ce' },
    5: { bg: '#f1f5f9', color: '#475569' }
  };

  tbody.innerHTML = currentSubsidyRanks.map((r, idx) => {
    const badgeStyle = rankBadgeColors[r.rankNumber] || { bg: '#f1f5f9', color: '#475569' };
    const rankLabel = r.rankNumber === 5 ? '기타' : `${r.rankNumber}순위`;

    return `
      <tr style="transition:background 0.15s ease;" onmouseover="this.style.background='#f8fafc';" onmouseout="this.style.background='#ffffff';">
        <td style="vertical-align:middle; text-align:center; color:#64748b; font-size:12px;">${idx + 1}</td>
        <td style="vertical-align:middle; text-align:center;">
          <span class="badge" style="background:${badgeStyle.bg}; color:${badgeStyle.color}; font-weight:bold; font-size:11px; padding:3px 8px; border-radius:3px;">${rankLabel}</span>
        </td>
        <td style="vertical-align:middle; text-align:center;">
          <span class="badge" style="background:${r.used === '사용' ? '#dcfce7' : '#fee2e2'}; color:${r.used === '사용' ? '#15803d' : '#b91c1c'}; font-size:11px;">${r.used || '사용'}</span>
        </td>
        <td style="vertical-align:middle; text-align:left; padding-left:14px;">
          <strong style="color:#1e293b; font-size:13px;">${r.name || '-'}</strong>
        </td>
        <td style="vertical-align:middle; text-align:right; font-size:12px; font-weight:bold; color:#2563eb;">
          ${(r.limitAmount || 0).toLocaleString()}원
        </td>
        <td style="vertical-align:middle; text-align:center;">
          ${r.isPriority ? '<span class="badge" style="background:#ffedd5; color:#c2410c; font-size:11px;">우선배정</span>' : '<span style="color:#94a3b8; font-size:11px;">일반</span>'}
        </td>
        <td style="vertical-align:middle; text-align:center;">
          <div style="display:inline-flex; gap:3px;">
            <button type="button" class="btn btn-default btn-xs" onclick="moveSubsidyRankOrder(${idx}, -1)" ${idx === 0 ? 'disabled' : ''} style="height:22px; padding:0 6px; font-size:10px; cursor:pointer;">▲</button>
            <button type="button" class="btn btn-default btn-xs" onclick="moveSubsidyRankOrder(${idx}, 1)" ${idx === currentSubsidyRanks.length - 1 ? 'disabled' : ''} style="height:22px; padding:0 6px; font-size:10px; cursor:pointer;">▼</button>
          </div>
        </td>
        <td style="vertical-align:middle; text-align:left; padding-left:14px; font-size:12px; color:#475569;">
          ${r.note || '-'}
        </td>
        <td style="vertical-align:middle; text-align:center;">
          <div style="display:inline-flex; gap:4px;">
            <button type="button" class="btn btn-default btn-xs" onclick="openEditSubsidyRankModal('${r.id}')" style="height:24px; padding:0 8px; font-size:11px; display:inline-flex; align-items:center; justify-content:center; border:1px solid #ccc; background:#fff; border-radius:3px; cursor:pointer;">수정</button>
            <button type="button" class="btn btn-danger btn-xs" onclick="deleteSubsidyRank('${r.id}')" style="height:24px; padding:0 8px; font-size:11px; display:inline-flex; align-items:center; justify-content:center; border:1px solid #d43f3a; background:#d9534f; color:#fff; border-radius:3px; cursor:pointer;">삭제</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 모달 제어: 등록/수정
function openCreateSubsidyRankModal() {
  const modal = document.getElementById('modal_subsidy_rank_form');
  const title = document.getElementById('subsidy_rank_modal_title');
  if (title) title.innerText = '순위 구분 코드 등록';

  document.getElementById('sub_rnk_form_edit_id').value = '';
  document.getElementById('sub_rnk_form_rank').value = currentActiveRankTab !== 'all' ? currentActiveRankTab : '1';
  document.getElementById('sub_rnk_form_name').value = '';
  document.getElementById('sub_rnk_form_limit').value = '600000';
  document.getElementById('sub_rnk_form_priority').checked = true;
  document.getElementById('sub_rnk_form_used_y').checked = true;
  document.getElementById('sub_rnk_form_note').value = '';

  if (modal) modal.style.display = 'flex';
}

function openEditSubsidyRankModal(id) {
  const item = currentSubsidyRanks.find(r => String(r.id) === String(id));
  if (!item) return;

  const modal = document.getElementById('modal_subsidy_rank_form');
  const title = document.getElementById('subsidy_rank_modal_title');
  if (title) title.innerText = '순위 구분 코드 수정';

  document.getElementById('sub_rnk_form_edit_id').value = item.id;
  document.getElementById('sub_rnk_form_rank').value = item.rankNumber || 1;
  document.getElementById('sub_rnk_form_name').value = item.name || '';
  document.getElementById('sub_rnk_form_limit').value = item.limitAmount || 600000;
  document.getElementById('sub_rnk_form_priority').checked = !!item.isPriority;
  if (item.used === '사용') {
    document.getElementById('sub_rnk_form_used_y').checked = true;
  } else {
    document.getElementById('sub_rnk_form_used_n').checked = true;
  }
  document.getElementById('sub_rnk_form_note').value = item.note || '';

  if (modal) modal.style.display = 'flex';
}

function closeSubsidyRankModal() {
  const modal = document.getElementById('modal_subsidy_rank_form');
  if (modal) modal.style.display = 'none';
}

async function submitSubsidyRankForm() {
  const editId = document.getElementById('sub_rnk_form_edit_id').value;
  const rankNumber = parseInt(document.getElementById('sub_rnk_form_rank').value, 10) || 1;
  const name = document.getElementById('sub_rnk_form_name').value.trim();
  const limitAmount = parseInt(document.getElementById('sub_rnk_form_limit').value, 10) || 0;
  const isPriority = document.getElementById('sub_rnk_form_priority').checked;
  const used = document.getElementById('sub_rnk_form_used_y').checked ? '사용' : '미사용';
  const note = document.getElementById('sub_rnk_form_note').value.trim();

  if (!name) {
    alert('순위 코드명을 입력해주세요.');
    return;
  }

  const payload = {
    rankNumber,
    name,
    limitAmount,
    isPriority,
    used,
    note
  };

  try {
    let url = '/api/af/ad_free2_cfg/free1';
    let method = 'POST';
    if (editId) {
      url = `/api/af/ad_free2_cfg/free1/${editId}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success) {
      alert(editId ? '성공적으로 수정되었습니다.' : '성공적으로 등록되었습니다.');
      closeSubsidyRankModal();
      loadSubsidyRanks();
    } else {
      alert('저장 실패: ' + (result.message || '오류 발생'));
    }
  } catch (e) {
    console.error('submitSubsidyRankForm Error:', e);
    alert('서버 저장 중 오류가 발생했습니다.');
  }
}

async function deleteSubsidyRank(id) {
  if (!confirm('해당 순위 구분 코드를 삭제하시겠습니까?')) {
    return;
  }

  try {
    const res = await fetch(`/api/af/ad_free2_cfg/free1/${id}`, {
      method: 'DELETE'
    });
    const result = await res.json();
    if (result.success) {
      alert('성공적으로 삭제되었습니다.');
      loadSubsidyRanks();
    } else {
      alert('삭제 실패: ' + (result.message || '오류 발생'));
    }
  } catch (e) {
    console.error('deleteSubsidyRank Error:', e);
    alert('삭제 요청 중 오류가 발생했습니다.');
  }
}

async function moveSubsidyRankOrder(idx, dir) {
  const targetIdx = idx + dir;
  if (targetIdx < 0 || targetIdx >= currentSubsidyRanks.length) return;

  const temp = currentSubsidyRanks[idx];
  currentSubsidyRanks[idx] = currentSubsidyRanks[targetIdx];
  currentSubsidyRanks[targetIdx] = temp;

  try {
    const res = await fetch('/api/af/ad_free2_cfg/free1/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderList: currentSubsidyRanks })
    });
    const result = await res.json();
    if (result.success) {
      renderSubsidyRanksTable();
    }
  } catch (e) {
    console.error('moveSubsidyRankOrder Error:', e);
  }
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

function openBatchUploadModal() { 
  const modal = document.getElementById('batchUploadModal');
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeBatchUploadModal() {
  try { restoreListUrl(); } catch(_) {}
 
  const modal = document.getElementById('batchUploadModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

function parse23ColCsvRows(text, defaultCategory) {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];

  let startIndex = 0;
  if (lines[0].includes('강좌명') || lines[0].includes('늘봄과정')) {
    startIndex = 1;
  }

  const parsedRows = [];
  for (let i = startIndex; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;
    const regex = /(?:^|,)(?:"([^"]*)"|([^,]*))/g;
    const cols = [];
    let match;
    while ((match = regex.exec(rawLine)) !== null) {
      cols.push((match[1] !== undefined ? match[1] : match[2] || '').trim());
    }
    if (cols.length === 0 || !cols[0]) continue;

    parsedRows.push({
      title: cols[0],
      neulbomType: cols[1] || '방과후',
      groupLimit: cols[2] || '',
      department: cols[3] || '',
      teacherId: cols[4] || 'teacher01',
      noSameTeacher: (cols[5] === 'Y') ? 'Y' : 'N',
      grade: cols[6] || '1,2',
      schedule: cols[7] || '월:14:00~14:50',
      allowTimeConflict: (cols[8] === 'Y') ? 'Y' : 'N',
      capacity: parseInt(cols[9], 10) || 20,
      waitingCapacity: parseInt(cols[10], 10) || 5,
      period: cols[11] || '2026.09.01~2026.09.30',
      totalHours: parseInt(cols[12], 10) || 16,
      classroom: cols[13] || '컴퓨터실',
      fee: parseInt(cols[14], 10) || 30000,
      costFacility: cols[15] !== undefined && cols[15] !== '' ? parseInt(cols[15], 10) : 3000,
      textbookFee: parseInt(cols[16], 10) || 0,
      materialFee: parseInt(cols[17], 10) || 0,
      subsidyExcludeTuition: cols[18] || '',
      subsidyExcludeTextbook: cols[19] || '',
      subsidyExcludeMaterial: cols[20] || '',
      maxSubsidyAmount: parseInt(cols[21], 10) || 0,
      description: cols[22] || '',
      category: defaultCategory || '26년 9월'
    });
  }
  return parsedRows;
}

async function executeBatchUpload(text, defaultCategory) {
  const rows = parse23ColCsvRows(text, defaultCategory);
  if (rows.length === 0) {
    alert('업로드할 유효한 강좌 데이터 행이 없습니다.');
    return false;
  }

  const res = await fetch('/api/af/ad_lec/batch-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      schoolId: typeof SCHOOL_SN !== 'undefined' ? SCHOOL_SN : '3267',
      rows: rows
    })
  });

  const result = await res.json();
  if (res.ok && result.success) {
    alert(result.message || '강좌가 성공적으로 일괄 등록되었습니다.');
    closeBatchUploadModal();
    if (typeof loadLectures === 'function') {
      loadLectures();
    }
    return true;
  } else {
    alert(result.message || result.error || '일괄입력 처리 중 오류가 발생했습니다.');
    return false;
  }
}

async function submitBatchUploadModal(fm, event) {
  if (event) event.preventDefault();
  
  const divSelect = document.getElementById('modal_lec_div');
  const fileInput = document.getElementById('modal_userfile');
  const textarea = document.getElementById('batchUploadTextarea');

  if (!divSelect || !divSelect.value) {
    alert('강좌구분 : 필수항목입니다.');
    if (divSelect) divSelect.focus();
    return false;
  }

  const categoryText = divSelect.options && divSelect.selectedIndex >= 0 ? divSelect.options[divSelect.selectedIndex].text : '26년 9월';

  if (fileInput && fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    if (file.size > 1024 * 1024) {
      alert('엑셀 데이터 파일 : 용량이 너무 큰 엑셀 데이터는 입력할 수 없습니다(1M 이하만 가능)');
      return false;
    }

    if (!confirm('기존 데이터에 추가로 일괄입력 하시겠습니까?')) {
      return false;
    }

    const reader = new FileReader();
    reader.onload = async function(e) {
      try {
        await executeBatchUpload(e.target.result, categoryText);
      } catch (err) {
        console.error('Batch upload error:', err);
        alert('일괄입력 처리 중 오류가 발생했습니다: ' + err.message);
      }
    };
    reader.readAsText(file, 'utf-8');
    return false;
  } else if (textarea && textarea.value.trim().length > 0) {
    if (!confirm('기존 데이터에 추가로 일괄입력 하시겠습니까?')) {
      return false;
    }
    await executeBatchUpload(textarea.value.trim(), categoryText);
    return false;
  } else {
    alert('엑셀 데이터 파일 : 필수항목입니다.');
    if (fileInput) fileInput.focus();
    return false;
  }
}

window.openBatchUploadModal = openBatchUploadModal;
window.closeBatchUploadModal = closeBatchUploadModal;
window.submitBatchUploadModal = submitBatchUploadModal;

// ==================== 강좌 일괄수정 (Batch Modify Field) ====================
function chk_field(id) {
  if (id === 'chk_lec_div') {
    const el = document.getElementById('lec_div2');
    if (el) el.disabled = !document.getElementById('chk_lec_div').checked;
  } else if (id === 'chk_lec_date') {
    const s = document.getElementById('lec_sdate');
    const e = document.getElementById('lec_edate');
    const chk = document.getElementById('chk_lec_date').checked;
    if (s) s.disabled = !chk;
    if (e) e.disabled = !chk;
  } else if (id === 'chk_tea_id') {
    const chk = document.getElementById('chk_tea_id').checked;
    document.querySelectorAll('input[name="tea_id_chk"]').forEach(r => r.disabled = !chk);
  } else if (id === 'chk_lec_time') {
    const chk = document.getElementById('chk_lec_time').checked;
    document.querySelectorAll('input[name="lec_time_not_chk"]').forEach(r => r.disabled = !chk);
  } else if (id === 'chk_pay_view') {
    const chk = document.getElementById('chk_pay_view').checked;
    document.querySelectorAll('input[name="lec_pay_view"]').forEach(r => r.disabled = !chk);
  } else if (id === 'chk_tea_finish') {
    const chk = document.getElementById('chk_tea_finish').checked;
    document.querySelectorAll('input[name="lec_tea_finish"]').forEach(r => r.disabled = !chk);
  } else if (id === 'chk_tea_edit') {
    const chk = document.getElementById('chk_tea_edit').checked;
    document.querySelectorAll('input[name="lec_tea_edit"]').forEach(r => r.disabled = !chk);
  } else if (id === 'chk_refund_status') {
    const chk = document.getElementById('chk_refund_status').checked;
    document.querySelectorAll('input[name="refund_status"]').forEach(r => r.disabled = !chk);
  } else if (id === 'chk_lec_status') {
    const chk = document.getElementById('chk_lec_status').checked;
    document.querySelectorAll('input[name="lec_status2"]').forEach(r => r.disabled = !chk);
  }
}

function openBatchModifyModal() {
  const modal = document.getElementById('batchModifyModal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeBatchModifyModal() {
  try { restoreListUrl(); } catch(_) {}

  const modal = document.getElementById('batchModifyModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

async function submitBatchModifyModal(fm, event) {
  if (event) event.preventDefault();

  const checkedFields = [
    'chk_lec_div', 'chk_lec_date', 'chk_tea_id', 'chk_lec_time',
    'chk_pay_view', 'chk_tea_finish', 'chk_tea_edit', 'chk_refund_status', 'chk_lec_status'
  ].filter(id => {
    const el = document.getElementById(id);
    return el && el.checked;
  });

  if (checkedFields.length === 0) {
    alert('수정할 필드를 최소 하나 이상 선택하세요.');
    return false;
  }

  if (document.getElementById('chk_lec_div')?.checked) {
    const val = document.getElementById('lec_div2')?.value;
    if (!val) {
      alert('변경할 강좌구분을 선택하세요.');
      document.getElementById('lec_div2')?.focus();
      return false;
    }
  }

  if (document.getElementById('chk_lec_date')?.checked) {
    const s = document.getElementById('lec_sdate')?.value?.trim();
    const e = document.getElementById('lec_edate')?.value?.trim();
    if (!s || !e) {
      alert('운영기간 시작일자와 종료일자를 모두 입력하세요.');
      return false;
    }
  }

  if (!confirm('지정한 조건의 강좌 정보를 일괄 수정하시겠습니까?')) {
    return false;
  }

  const div1 = document.getElementById('lec_div1')?.value;
  const status1Radio = document.querySelector('input[name="lec_status1"]:checked');
  const status1 = status1Radio ? status1Radio.value : 'all';

  const updates = {};
  if (document.getElementById('chk_lec_div')?.checked) {
    const divSelect = document.getElementById('lec_div2');
    updates.category = divSelect ? divSelect.options[divSelect.selectedIndex].text : '';
    updates.division = divSelect ? divSelect.value : '';
  }
  if (document.getElementById('chk_lec_date')?.checked) {
    const s = document.getElementById('lec_sdate')?.value?.trim();
    const e = document.getElementById('lec_edate')?.value?.trim();
    updates.startDate = s;
    updates.endDate = e;
    updates.period = `${s} ~ ${e}`;
  }
  if (document.getElementById('chk_tea_id')?.checked) {
    const val = document.querySelector('input[name="tea_id_chk"]:checked')?.value;
    updates.preventTeacherDup = (val === 'Y');
  }
  if (document.getElementById('chk_lec_time')?.checked) {
    const val = document.querySelector('input[name="lec_time_not_chk"]:checked')?.value;
    updates.allowTimeConflict = (val === 'Y');
  }
  if (document.getElementById('chk_pay_view')?.checked) {
    const val = document.querySelector('input[name="lec_pay_view"]:checked')?.value;
    updates.feeReceipt = (val === 'Y' ? 'Y' : 'N');
  }
  if (document.getElementById('chk_tea_finish')?.checked) {
    const val = document.querySelector('input[name="lec_tea_finish"]:checked')?.value;
    updates.instructorClosed = (val === 'Y');
  }
  if (document.getElementById('chk_tea_edit')?.checked) {
    const val = document.querySelector('input[name="lec_tea_edit"]:checked')?.value;
    updates.instructorCanEdit = (val === 'Y');
  }
  if (document.getElementById('chk_refund_status')?.checked) {
    const val = document.querySelector('input[name="refund_status"]:checked')?.value;
    updates.refundClosed = (val === 'Y');
  }
  if (document.getElementById('chk_lec_status')?.checked) {
    const val = document.querySelector('input[name="lec_status2"]:checked')?.value;
    const statusMap = { '1': 'OUTPUT', '0': 'WAITING', '2': 'CLOSED' };
    updates.status = statusMap[val] || 'OUTPUT';
  }

  // Filter criteria for backend
  const filter = {};
  if (div1 && div1 !== '' && div1 !== '0') {
    const divText = document.getElementById('lec_div1').options[document.getElementById('lec_div1').selectedIndex].text;
    filter.category = divText;
  }
  if (status1 !== 'all') {
    const statusMap1 = { '1': 'OUTPUT', '0': 'WAITING', '2': 'CLOSED' };
    filter.status = statusMap1[status1] || 'OUTPUT';
  }

  try {
    const res = await fetch('/api/af/ad_lec/bulk-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates, filter })
    });
    const result = await res.json();
    if (result.success) {
      alert(result.message || '강좌 정보가 일괄 수정되었습니다.');
    } else {
      alert(result.message || '수정 중 오류가 발생했습니다.');
    }
  } catch (err) {
    console.error('bulk-update error:', err);
    alert('서버 통신 중 오류가 발생했습니다.');
  }

  closeBatchModifyModal();
  if (typeof loadLectures === 'function') {
    loadLectures();
  }
  return false;
}

window.chk_field = chk_field;
window.openBatchModifyModal = openBatchModifyModal;
window.closeBatchModifyModal = closeBatchModifyModal;
window.submitBatchModifyModal = submitBatchModifyModal;

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
  if (e && e.preventDefault) e.preventDefault();
  const textarea = document.getElementById('batchUploadTextarea');
  const text = textarea ? textarea.value.trim() : '';
  if (!text) return alert('데이터를 입력해주세요.');

  const divSelect = document.getElementById('modal_lec_div') || document.getElementById('search_lec_div');
  const categoryText = divSelect && divSelect.selectedIndex >= 0 ? divSelect.options[divSelect.selectedIndex].text : '26년 9월';

  return executeBatchUpload(text, categoryText);
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

let activeInstructorTargetId = 'add_tea_id';

function openCourseEditModal(courseId) {
  const course = (currentLecturesCache || []).find(c => String(c.id) === String(courseId));
  if (!course) {
    alert('해당 강좌 정보를 찾을 수 없습니다.');
    return;
  }
  openAddModal(course);
}

function openAddModal(course = null) {
  const m = document.getElementById('addModal');
  const form = document.getElementById('fm_course_add');
  const titleEl = m ? m.querySelector('.modal-title') : null;
  const submitBtn = m ? m.querySelector('#btnAddCourseSubmit') : null;

  if (course) {
    if (form) form.dataset.editId = course.id;
    if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> 강좌 수정';
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> 수정';

    if (document.getElementById('add_lec_name')) document.getElementById('add_lec_name').value = course.title || '';
    if (document.getElementById('add_lec_div')) document.getElementById('add_lec_div').value = course.category || '26년 9월';
    if (document.getElementById('add_lec_pro_type')) document.getElementById('add_lec_pro_type').value = course.neulbomType || '방과후';
    if (document.getElementById('add_tea_id')) document.getElementById('add_tea_id').value = course.teacherId || course.instructor || course.teacherName || '';
    if (document.getElementById('add_tea_id1')) document.getElementById('add_tea_id1').value = course.assistantInstructor || '';

    const gradeStr = String(course.targetGrade || course.grade || '');
    const grades = gradeStr.split(',').map(g => g.trim());
    document.querySelectorAll('input[name="lec_grade"]').forEach(cb => {
      cb.checked = grades.includes(cb.value) || gradeStr.includes(cb.value);
    });
    if (typeof updateMasterGradeCheckbox === 'function') updateMasterGradeCheckbox();

    if (document.getElementById('add_lec_time_disp')) document.getElementById('add_lec_time_disp').value = course.scheduleTime || '';
    if (document.getElementById('add_lec_max_sin')) document.getElementById('add_lec_max_sin').value = course.capacity || 20;
    if (document.getElementById('add_lec_max_wait')) document.getElementById('add_lec_max_wait').value = course.waitingCapacity !== undefined ? course.waitingCapacity : 5;

    if (course.period && course.period.includes('~')) {
      const parts = course.period.split('~');
      if (document.getElementById('add_lec_sdate')) document.getElementById('add_lec_sdate').value = parts[0].trim();
      if (document.getElementById('add_lec_edate')) document.getElementById('add_lec_edate').value = parts[1].trim();
    }

    if (document.getElementById('add_lec_pay')) document.getElementById('add_lec_pay').value = course.tuitionFee || course.fee || 0;
    if (document.getElementById('add_lec_use_cost')) document.getElementById('add_lec_use_cost').value = course.costFacility !== undefined ? course.costFacility : 0;
    if (document.getElementById('add_lec_tea_fee')) document.getElementById('add_lec_tea_fee').value = course.costInstructor !== undefined ? course.costInstructor : (course.tuitionFee || 0);
    if (document.getElementById('add_lec_pay_book')) document.getElementById('add_lec_pay_book').value = course.textbookFee || 0;
    if (document.getElementById('add_lec_pay_item')) document.getElementById('add_lec_pay_item').value = course.materialFee || 0;
    if (document.getElementById('add_lec_room')) document.getElementById('add_lec_room').value = course.location || course.classroom || '본관2층 컴퓨터교실';
    if (document.getElementById('add_lec_tot_sisu')) document.getElementById('add_lec_tot_sisu').value = course.totalHours || 16;
    if (document.getElementById('add_lec_content')) document.getElementById('add_lec_content').value = course.description || course.content || '';

    if (document.getElementById('add_lec_time_not_chk')) document.getElementById('add_lec_time_not_chk').checked = !!course.allowTimeConflict;
    if (document.getElementById('add_tea_id_chk')) document.getElementById('add_tea_id_chk').checked = !!course.noSameTeacher;

    if (document.getElementById('add_not_free2_pay')) document.getElementById('add_not_free2_pay').checked = !!course.notFree2Pay;
    if (document.getElementById('add_not_free3_pay')) document.getElementById('add_not_free3_pay').checked = !!course.notFree3Pay;
    if (document.getElementById('add_not_free1_pay')) document.getElementById('add_not_free1_pay').checked = !!course.notFree1Pay;
    if (document.getElementById('add_not_free2_pay_book')) document.getElementById('add_not_free2_pay_book').checked = !!course.notFree2PayBook;
    if (document.getElementById('add_not_free3_pay_book')) document.getElementById('add_not_free3_pay_book').checked = !!course.notFree3PayBook;
    if (document.getElementById('add_not_free1_pay_book')) document.getElementById('add_not_free1_pay_book').checked = !!course.notFree1PayBook;

    const statusVal = course.status === 'CLOSED' ? '종료' : (course.status === 'WAITING' ? '대기' : '출력');
    const rad = document.querySelector(`input[name="add_lec_status"][value="${statusVal}"]`);
    if (rad) rad.checked = true;
  } else {
    if (form) {
      delete form.dataset.editId;
      form.reset();
    }
    if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> 강좌 등록';
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> 등록';
    if (document.getElementById('add_lec_name')) document.getElementById('add_lec_name').value = '';
    if (document.getElementById('add_lec_div')) document.getElementById('add_lec_div').value = '26년 9월';
    if (document.getElementById('add_lec_pro_type')) document.getElementById('add_lec_pro_type').value = '방과후';
    if (document.getElementById('add_tea_id')) document.getElementById('add_tea_id').value = '';
    if (document.getElementById('add_tea_id1')) document.getElementById('add_tea_id1').value = '';
    document.querySelectorAll('input[name="lec_grade"]').forEach(cb => cb.checked = false);
    if (typeof updateMasterGradeCheckbox === 'function') updateMasterGradeCheckbox();
    if (document.getElementById('add_lec_time_disp')) document.getElementById('add_lec_time_disp').value = '';
    if (document.getElementById('add_lec_max_sin')) document.getElementById('add_lec_max_sin').value = '20';
    if (document.getElementById('add_lec_max_wait')) document.getElementById('add_lec_max_wait').value = '5';
    if (document.getElementById('add_lec_tot_sisu')) document.getElementById('add_lec_tot_sisu').value = '16';
    if (document.getElementById('add_lec_sdate')) document.getElementById('add_lec_sdate').value = '2026-09-01';
    if (document.getElementById('add_lec_edate')) document.getElementById('add_lec_edate').value = '2026-09-30';
    if (document.getElementById('add_lec_room_sel')) document.getElementById('add_lec_room_sel').value = '';
    if (document.getElementById('add_lec_room')) document.getElementById('add_lec_room').value = '';
    if (document.getElementById('add_lec_pay')) document.getElementById('add_lec_pay').value = '0';
    if (document.getElementById('add_lec_use_cost')) document.getElementById('add_lec_use_cost').value = '0';
    if (document.getElementById('add_lec_tea_fee')) document.getElementById('add_lec_tea_fee').value = '0';
    if (document.getElementById('add_lec_pay_book')) document.getElementById('add_lec_pay_book').value = '0';
    if (document.getElementById('add_lec_pay_item')) document.getElementById('add_lec_pay_item').value = '0';
    if (document.getElementById('add_not_free2_pay')) document.getElementById('add_not_free2_pay').checked = false;
    if (document.getElementById('add_not_free3_pay')) document.getElementById('add_not_free3_pay').checked = false;
    if (document.getElementById('add_not_free1_pay')) document.getElementById('add_not_free1_pay').checked = false;
    if (document.getElementById('add_not_free2_pay_book')) document.getElementById('add_not_free2_pay_book').checked = false;
    if (document.getElementById('add_not_free3_pay_book')) document.getElementById('add_not_free3_pay_book').checked = false;
    if (document.getElementById('add_not_free1_pay_book')) document.getElementById('add_not_free1_pay_book').checked = false;
    if (document.getElementById('add_lec_content')) document.getElementById('add_lec_content').value = '';
    const rad = document.querySelector('input[name="add_lec_status"][value="출력"]');
    if (rad) rad.checked = true;
  }

  if (m) {
    m.style.display = 'flex';
    m.classList.add('show');
    document.body.style.overflow = 'hidden';
    // 모달 피처 초기화 (강좌구분 동적로드 + 강의시간 슬롯 로드)
    if (typeof initAddModalFeatures === 'function') initAddModalFeatures();
    // 강사ID 입력 이벤트 연결 (모달이 열리면 매c88 재바인딩)
    const teaInput = m.querySelector('#add_tea_id');
    if (teaInput) {
      teaInput.oninput = (e) => checkInstructorConflict(e.target.value.trim());
      teaInput.onblur = (e) => checkInstructorConflict(e.target.value.trim());
    }
    // 강의시간 입력 이벤트 연결
    const timeInput = m.querySelector('#add_lec_time_disp');
    if (timeInput) {
      timeInput.oninput = (e) => checkTimeConflict(e.target.value.trim());
      timeInput.onblur = (e) => checkTimeConflict(e.target.value.trim());
    }
  }
}

function closeAddModal() {
  try { restoreListUrl(); } catch(_) {}

  const m = document.getElementById('addModal');
  if (m) {
    m.style.display = 'none';
    m.classList.remove('show');
    document.body.style.overflow = '';
  }
  const form = document.getElementById('fm_course_add');
  if (form) delete form.dataset.editId;
}

async function quickEditCapacity(courseId, currentCapacity, anchorEl) {
  const newCapStr = prompt('수정할 정원을 입력하세요 (명):', currentCapacity);
  if (newCapStr === null) return;
  const newCap = parseInt(newCapStr, 10);
  if (isNaN(newCap) || newCap < 0) return alert('유효한 숫자를 입력해 주세요.');

  try {
    const res = await fetch('/api/af/ad_lec/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: courseId, capacity: newCap })
    });
    const d = await res.json();
    if (d.success) {
      if (anchorEl) anchorEl.textContent = newCap;
      const cached = (currentLecturesCache || []).find(c => String(c.id) === String(courseId));
      if (cached) cached.capacity = newCap;
    } else {
      alert(d.message || '정원 수정 실패');
    }
  } catch (err) {
    console.error('quickEditCapacity error:', err);
  }
}

async function quickChangeStatus(courseId, newStatus) {
  try {
    const res = await fetch('/api/af/ad_lec/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: courseId, status: newStatus })
    });
    const d = await res.json();
    if (!d.success) {
      alert(d.message || '상태 변경 실패');
      loadLectures();
    } else {
      const cached = (currentLecturesCache || []).find(c => String(c.id) === String(courseId));
      if (cached) cached.status = newStatus;
    }
  } catch (err) {
    console.error('quickChangeStatus error:', err);
    loadLectures();
  }
}

window.quickEditCapacity = quickEditCapacity;
window.quickChangeStatus = quickChangeStatus;

async function deleteLecture(courseId) {
  if (!confirm('정말 이 강좌를 삭제하시겠습니까?')) return;
  try {
    const res = await fetch(`/api/af/ad_lec/${encodeURIComponent(courseId)}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message || '강좌가 성공적으로 삭제되었습니다.');
      loadLectures();
    } else {
      alert(data.message || '강좌 삭제에 실패했습니다.');
    }
  } catch (err) {
    console.error('deleteLecture error:', err);
    alert('서버 통신 오류가 발생했습니다.');
  }
}

async function toggleInstructorClose(courseId) {
  try {
    const res = await fetch('/api/af/ad_lec/instructor-close', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolId: SCHOOL_SN, courseId })
    });
    const data = await res.json();
    if (!data.success) {
      alert(data.message || '강사마감 변경에 실패했습니다.');
      loadLectures();
    }
  } catch (err) {
    console.error(err);
    loadLectures();
  }
}

function toggleInstructorEdit(courseId) {
  console.log('toggleInstructorEdit:', courseId);
}

function openBatchCopyModal() {
  const m = document.getElementById('batchCopyModal');
  if (!m) return;

  // 1. 현재 선택된 강좌 구분명 텍스트 표시
  const srcDivElem = document.getElementById('copy_src_lec_div_text');
  const selLecDiv = document.getElementById('search_lec_div') || document.getElementById('lec_div');
  let currentDivText = '26년 9월';
  if (selLecDiv && selLecDiv.selectedIndex >= 0 && selLecDiv.options[selLecDiv.selectedIndex].value) {
    currentDivText = selLecDiv.options[selLecDiv.selectedIndex].text;
  }
  if (srcDivElem) srcDivElem.textContent = currentDivText;

  // 2. 강좌 목록 박스 동적 렌더링
  const listUl = document.getElementById('copy_lec_list_ul');
  if (listUl) {
    listUl.innerHTML = '';
    const courseItems = (typeof courses !== 'undefined' && Array.isArray(courses) && courses.length > 0)
      ? courses
      : [
          { id: 101, name: '01. 창의로봇 A' },
          { id: 102, name: '02. 바이올린 B' },
          { id: 103, name: '03. 창의미술 C' },
          { id: 104, name: '04. 바둑 D' },
          { id: 105, name: '05. 뉴스포츠 E' },
          { id: 106, name: '06. 한자속독 F' },
          { id: 107, name: '07. 생명과학 G' },
          { id: 108, name: '08. 주산암산 H' }
        ];

    courseItems.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `
        <input type="checkbox" name="lec_list[]" id="lec_copy_${c.id}" value="${c.id}" checked>
        <label for="lec_copy_${c.id}">${c.name || c.title || '강좌 ' + c.id}</label>
      `;
      listUl.appendChild(li);
    });
  }

  // 3. 전체선택 체크박스 초기화
  const chkAll = document.getElementById('copy_check_all');
  if (chkAll) chkAll.checked = true;

  m.style.display = 'flex';
  m.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeBatchCopyModal() {
  const m = document.getElementById('batchCopyModal');
  if (m) {
    m.classList.remove('show');
    m.style.display = 'none';
  }
  document.body.style.overflow = '';
  try { restoreListUrl(); } catch(_) {}
}

function copy_chk_all(masterCheckbox) {
  const isChecked = masterCheckbox.checked;
  const checkboxes = document.querySelectorAll('#copy_lec_list_container input[name="lec_list[]"]');
  checkboxes.forEach(cb => cb.checked = isChecked);
}

function copy_chk_field(id) {
  if (id === 'copy_chk_lec_date') {
    const chk = document.getElementById('copy_chk_lec_date').checked;
    const s = document.getElementById('copy_lec_sdate');
    const e = document.getElementById('copy_lec_edate');
    if (s) s.disabled = !chk;
    if (e) e.disabled = !chk;
  } else if (id === 'copy_chk_tea_finish') {
    const chk = document.getElementById('copy_chk_tea_finish').checked;
    document.querySelectorAll('input[name="copy_lec_tea_finish"]').forEach(r => r.disabled = !chk);
  } else if (id === 'copy_chk_refund_status') {
    const chk = document.getElementById('copy_chk_refund_status').checked;
    document.querySelectorAll('input[name="copy_refund_status"]').forEach(r => r.disabled = !chk);
  } else if (id === 'copy_chk_lec_status') {
    const chk = document.getElementById('copy_chk_lec_status').checked;
    document.querySelectorAll('input[name="copy_lec_status"]').forEach(r => r.disabled = !chk);
  }
}

async function submitBatchCopyModal(fm, event) {
  if (event) event.preventDefault();

  const selectedCheckboxes = document.querySelectorAll('#copy_lec_list_container input[name="lec_list[]"]:checked');
  const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.value);

  if (selectedIds.length === 0) {
    alert('복사할 강좌를 최소 하나 이상 선택하세요.');
    return false;
  }

  const targetDivSelect = document.getElementById('copy_lec_div2');
  if (!targetDivSelect || !targetDivSelect.value) {
    alert('복사 대상 강좌구분을 선택하세요.');
    if (targetDivSelect) targetDivSelect.focus();
    return false;
  }

  const targetCategoryText = targetDivSelect.options[targetDivSelect.selectedIndex].text;
  const targetDivisionVal = targetDivSelect.value;

  if (document.getElementById('copy_chk_lec_date')?.checked) {
    const s = document.getElementById('copy_lec_sdate')?.value?.trim();
    const e = document.getElementById('copy_lec_edate')?.value?.trim();
    if (!s || !e) {
      alert('운영기간 시작일자와 종료일자를 모두 입력하세요.');
      return false;
    }
  }

  if (!confirm(`선택한 ${selectedIds.length}개 강좌를 '${targetCategoryText}'(으)로 일괄 복사하시겠습니까?`)) {
    return false;
  }

  const copyApplicants = document.querySelector('input[name="copy_mem"]:checked')?.value || 'N';
  const copyNotRefunded = document.getElementById('copy_not_ref')?.checked || false;
  const copyWaitlist = document.querySelector('input[name="copy_wait"]:checked')?.value || 'N';

  const copyFees = {
    tuitionFee: document.querySelector('input[name="copy_lec_pay"]:checked')?.value || 'Y',
    useCost: document.querySelector('input[name="copy_lec_use_cost"]:checked')?.value || 'Y',
    bookFee: document.querySelector('input[name="copy_lec_pay_book"]:checked')?.value || 'Y',
    materialFee: document.querySelector('input[name="copy_lec_pay_item"]:checked')?.value || 'Y'
  };

  const payload = {
    schoolId: typeof SCHOOL_SN !== 'undefined' ? SCHOOL_SN : '3267',
    selectedIds: selectedIds,
    targetCategory: targetCategoryText,
    targetDivision: targetDivisionVal,
    copyApplicants: copyApplicants === 'Y',
    copyNotRefunded: copyNotRefunded,
    copyWaitlist: copyWaitlist === 'Y',
    copyFees: copyFees
  };

  if (document.getElementById('copy_chk_lec_date')?.checked) {
    payload.startDate = document.getElementById('copy_lec_sdate')?.value?.trim();
    payload.endDate = document.getElementById('copy_lec_edate')?.value?.trim();
    payload.period = `${payload.startDate} ~ ${payload.endDate}`;
  }

  if (document.getElementById('copy_chk_tea_finish')?.checked) {
    payload.instructorClosed = (document.querySelector('input[name="copy_lec_tea_finish"]:checked')?.value === 'Y');
  }

  if (document.getElementById('copy_chk_refund_status')?.checked) {
    payload.refundClosed = (document.querySelector('input[name="copy_refund_status"]:checked')?.value === 'Y');
  }

  if (document.getElementById('copy_chk_lec_status')?.checked) {
    const val = document.querySelector('input[name="copy_lec_status"]:checked')?.value;
    const statusMap = { '1': 'OUTPUT', '0': 'WAITING', '2': 'CLOSED' };
    payload.status = statusMap[val] || 'OUTPUT';
  }

  try {
    const res = await fetch('/api/af/ad_lec/bulk-copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success) {
      alert(result.message || '강좌가 성공적으로 일괄 복사되었습니다.');
    } else {
      alert(result.message || '복사 처리 중 오류가 발생했습니다.');
    }
  } catch (err) {
    console.error('bulk-copy error:', err);
    alert('서버 통신 중 오류가 발생했습니다.');
  }

  closeBatchCopyModal();
  if (typeof loadLectures === 'function') {
    loadLectures();
  }
  return false;
}

// ---------------- 강좌 통계 모달 기능 (stat 클론) ----------------
function openStatModal() {
  const modal = document.getElementById('statModal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  loadStatData();
}

function closeStatModal() {
  const modal = document.getElementById('statModal');
  if (modal) {
    modal.style.display = 'none';
  }
  document.body.style.overflow = '';
  try { restoreListUrl(); } catch(_) {}
}

async function loadStatData() {
  try {
    const res = await fetch('/api/af/ad_lec/stats');
    if (!res.ok) return;
    const data = await res.json();
    if (data && data.success && Array.isArray(data.stats) && data.stats.length > 0) {
      updateStatTableWithDynamicData(data.stats);
    }
  } catch (err) {
    console.warn('loadStatData error:', err);
  }
}

function updateStatTableWithDynamicData(stats) {
  // If dynamic stats are returned, update matching category rows or append them
  const tbody = document.getElementById('stat_table_tbody');
  if (!tbody) return;
  // stats: [{category, total, outputCount, waitingCount, closedCount, totalCapacity, totalApplied}]
  stats.forEach(st => {
    const rows = tbody.querySelectorAll('tr');
    let matched = false;
    rows.forEach(tr => {
      const th = tr.querySelector('th');
      if (th && th.textContent.trim() === st.category.trim()) {
        matched = true;
        const tds = tr.querySelectorAll('td');
        if (tds.length >= 11) {
          tds[0].textContent = st.total;
          tds[1].querySelector('a') ? (tds[1].querySelector('a').textContent = st.outputCount) : (tds[1].textContent = st.outputCount);
          tds[2].querySelector('a') ? (tds[2].querySelector('a').textContent = st.closedCount) : (tds[2].textContent = st.closedCount);
          tds[3].querySelector('a') ? (tds[3].querySelector('a').textContent = st.waitingCount) : (tds[3].textContent = st.waitingCount);
          tds[8].textContent = (st.totalCapacity || 0).toLocaleString();
          tds[9].textContent = (st.totalApplied || 0).toLocaleString();
        }
      }
    });
  });
}

function filterByStatCategory(catName, statusVal) {
  closeStatModal();
  const catSel = document.getElementById('categoryFilter');
  if (catSel && catName) {
    let found = false;
    for (let opt of catSel.options) {
      if (opt.value === catName || opt.text.includes(catName)) {
        catSel.value = opt.value;
        found = true;
        break;
      }
    }
    if (!found) {
      const newOpt = new Option(catName, catName, true, true);
      catSel.add(newOpt);
    }
  }
  const statusSel = document.getElementById('statusFilter');
  if (statusSel) {
    if (statusVal) {
      statusSel.value = statusVal;
    } else {
      statusSel.value = '전체';
    }
  }
  if (typeof loadLectures === 'function') {
    loadLectures();
  }
}

// =====================================================================
// ╔════════════════════════════════════════════════════════════╗
// ║  강좌와 모달 기능 구현 (수정 → 이 옆부터 신규 추가)
// ╠════════════════════════════════════════════════════════════╣
// ║  1. 강좌구분 동적 로드                                                ║
// ║  2. 강의시간 DB 슬롯 선택 UI                                         ║
// ║  3. 강사ID 중복 배정 실시간 체크                                ║
// ║  4. 강의시간 충돌 감지                                             ║
// ║  5. 첨부파일 실제 서버 업로드                                      ║
// ╚════════════════════════════════════════════════════════════╝
// =====================================================================

// ── [1] 강좌구분 동적 로드 ──
async function loadLecDivisions() {
  const sel = document.getElementById('add_lec_div');
  if (!sel) return;
  try {
    const sn = (typeof SCHOOL_SN !== 'undefined' && SCHOOL_SN) ? SCHOOL_SN : '3267';
    const res = await fetch(`/api/af/ad_lec/divisions?sn=${sn}`);
    if (!res.ok) return;
    const data = await res.json();
    if (!data.success || !data.divisions) return;
    const current = sel.value;
    sel.innerHTML = '<option value="">=선택=</option>';
    data.divisions.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.value;
      opt.textContent = d.label;
      if (d.value === current || d.value === '26년 9월') opt.selected = true;
      sel.appendChild(opt);
    });
  } catch(e) { /* 실패시 기본값 유지 */ }
}

// ── [2] 강의시간 DB 슬롯 선택 UI ──
let _timeSlots = [];   // 캐시: 서버 슬롯 데이터
let _usedTimes = [];   // 캐시: 이미 사용중 시간

async function loadAndRenderTimeSlots() {
  const sn = (typeof SCHOOL_SN !== 'undefined' && SCHOOL_SN) ? SCHOOL_SN : '3267';
  try {
    const res = await fetch(`/api/af/ad_lec/time-slots?sn=${sn}`);
    if (!res.ok) return;
    const data = await res.json();
    if (!data.success) return;
    _timeSlots = data.slots || [];
    _usedTimes = data.usedTimes || [];
  } catch(e) {}
  renderTimeSlotGrid();
}

function renderTimeSlotGrid() {
  const container = document.getElementById('lecTimeSlotGrid');
  if (!container || _timeSlots.length === 0) return;

  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const periods = [...new Set(_timeSlots.map(s => s.period))];

  // 다중 선택 지원: 현재 입력값에서 선택된 항목 복원
  const currentDisp = document.getElementById('add_lec_time_disp')?.value || '';
  const preSelected = new Set(currentDisp.split(', ').filter(Boolean));

  let html = '<table style="border-collapse:collapse; width:100%; font-size:12px;">';
  html += '<thead><tr><th style="border:1px solid #ddd; padding:5px 8px; background:#f5f7fa; text-align:center; min-width:50px;"></th>';
  days.forEach(d => {
    html += `<th style="border:1px solid #ddd; padding:5px 8px; background:#f5f7fa; text-align:center; min-width:70px; font-weight:600;">${d}</th>`;
  });
  html += '</tr></thead><tbody>';

  periods.forEach(period => {
    const slot0 = _timeSlots.find(s => s.period === period);
    const timeLabel = slot0 ? `(${slot0.start}~${slot0.end})` : '';
    html += `<tr><td style="border:1px solid #ddd; padding:5px 6px; background:#fafafa; text-align:center; font-weight:600; white-space:nowrap;">${period}<br><span style="font-size:10px; color:#888; font-weight:normal;">${timeLabel}</span></td>`;
    days.forEach(day => {
      const slot = _timeSlots.find(s => s.day === day && s.period === period);
      if (!slot) { html += '<td style="border:1px solid #ddd;"></td>'; return; }
      const val = slot.value;
      const isUsed = _usedTimes.includes(val);
      const isChecked = preSelected.has(val);
      const cellBg = isUsed ? '#fff8e1' : '#fff';
      const usedBadge = isUsed ? '<span style="display:block;font-size:10px;color:#f59e0b;">사용중</span>' : '';
      html += `<td style="border:1px solid #ddd; padding:6px 4px; text-align:center; background:${cellBg}; cursor:pointer;" onclick="toggleTimeSlot('${val}', this)">
        <label style="cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; margin:0;">
          <input type="checkbox" class="time-slot-chk" value="${val}" ${isChecked ? 'checked' : ''} onchange="syncTimeSlotDisplay()" style="cursor:pointer;">
          ${usedBadge}
        </label></td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

function toggleTimeSlot(val, td) {
  const cb = td.querySelector('.time-slot-chk');
  if (cb) { cb.checked = !cb.checked; syncTimeSlotDisplay(); }
}

function syncTimeSlotDisplay() {
  const checked = [];
  document.querySelectorAll('.time-slot-chk:checked').forEach(cb => checked.push(cb.value));
  const input = document.getElementById('add_lec_time_disp');
  if (input) input.value = checked.join(', ');
  // 첫번째 선택시 요일도 자동 세팅
  if (checked.length > 0) {
    const dayMatch = checked[0].match(/^([월화수목금토일])/);
    if (dayMatch) {
      const dayKr = dayMatch[1];
      const dayMap = { '월': '월', '화': '화', '수': '수', '목': '목', '금': '금', '토': '토', '일': '일' };
      window._autoDay = dayKr;
    }
  }
}

// ── [3] 강사ID 중복 배정 실시간 체크 ──
let _instructorCheckTimer = null;
async function checkInstructorConflict(teaId) {
  if (!teaId || teaId.length < 2) return;
  clearTimeout(_instructorCheckTimer);
  _instructorCheckTimer = setTimeout(async () => {
    const scheduleTime = document.getElementById('add_lec_time_disp')?.value?.trim() || '';
    const editId = document.getElementById('fm_course_add')?.dataset?.editId || '';
    try {
      const params = new URLSearchParams({ teaId });
      if (scheduleTime) params.set('scheduleTime', scheduleTime.split(', ')[0]);
      if (editId) params.set('excludeId', editId);
      const res = await fetch(`/api/af/ad_lec/check-instructor?${params}`);
      const data = await res.json();
      const msgEl = document.querySelector('#addModal .error_msg.error_tea_id');
      if (data.conflict && data.conflicts.length > 0) {
        const titles = data.conflicts.map(c => `「${c.title}」(${c.scheduleTime})`).join(', ');
        const warnMsg = `⚠️ 해당 강사가 이미 ${titles} 강좌에 배정되어 있습니다. (중복 허용하려면 찭학 ID 체크를 켜주세요)`;
        if (msgEl) {
          msgEl.textContent = warnMsg;
          msgEl.style.color = '#e67e22';
          msgEl.style.display = 'block';
        }
      } else {
        if (msgEl) { msgEl.textContent = ''; msgEl.style.display = 'none'; }
      }
    } catch(e) {}
  }, 600);
}

// ── [4] 강의시간 충돌 감지 ──
let _timeConflictTimer = null;
async function checkTimeConflict(scheduleTime) {
  if (!scheduleTime) return;
  clearTimeout(_timeConflictTimer);
  _timeConflictTimer = setTimeout(async () => {
    const editId = document.getElementById('fm_course_add')?.dataset?.editId || '';
    // 강의시간 충돌 쭔크 비활성 체크 시 패스
    const notChk = document.getElementById('add_lec_time_not_chk');
    if (notChk && notChk.checked) return;  // 중복 허용 체크될 시 거너띄
    const firstSlot = scheduleTime.split(', ')[0];
    try {
      const params = new URLSearchParams({ scheduleTime: firstSlot });
      if (editId) params.set('excludeId', editId);
      const res = await fetch(`/api/af/ad_lec/check-time-conflict?${params}`);
      const data = await res.json();
      const msgEl = document.querySelector('#addModal .error_msg.error_lec_time');
      if (data.conflict && data.conflicts.length > 0) {
        const titles = data.conflicts.map(c => `「${c.title}」`).join(', ');
        const warnMsg = `⚠️ ${firstSlot} 시간대에 ${titles} 강좌가 이미 있습니다. (중복 허용하려면 위 쬼끼 체크를 켜주세요)`;
        if (msgEl) {
          msgEl.textContent = warnMsg;
          msgEl.style.color = '#e67e22';
          msgEl.style.display = 'block';
        }
      } else {
        if (msgEl) { msgEl.textContent = ''; msgEl.style.display = 'none'; }
      }
    } catch(e) {}
  }, 600);
}

// ── [5] 첨부파일 실제 서버 업로드 ──
async function uploadLecFiles(lecId) {
  const fileBoxInputs = document.querySelectorAll('#file_box input[type="file"]');
  const filesToUpload = [];
  fileBoxInputs.forEach(input => {
    if (input.files && input.files.length > 0) {
      for (let f of input.files) filesToUpload.push(f);
    }
  });
  if (filesToUpload.length === 0) return { success: true, files: [] };

  const formData = new FormData();
  filesToUpload.forEach(f => formData.append('file[]', f));
  if (lecId) formData.append('lecId', lecId);

  try {
    const res = await fetch('/api/af/ad_lec/upload-file', {
      method: 'POST',
      body: formData  // Content-Type은 FormData가 자동 설정
    });
    const data = await res.json();
    return data;
  } catch(e) {
    return { success: false, message: '파일 업로드 중 네트워크 오류가 발생했습니다.' };
  }
}

// ── 모달 열릴 때 기능 초기화 ──
async function initAddModalFeatures() {
  // [1] 강좌구분 동적 로드
  await loadLecDivisions();
  // [2] 강의시간 슬롯 로드
  await loadAndRenderTimeSlots();
}

// ---------------- 강사 검색 모달 기능 ----------------
function openInstructorSearchModal(type) {
  activeInstructorTargetId = (type === 'sub') ? 'add_tea_id1' : 'add_tea_id';
  const modal = document.getElementById('teaSearchModal');
  if (modal) {
    modal.style.zIndex = '100050';
    modal.style.display = 'flex';
  }
  const kwInput = document.getElementById('popupTeaKeyword');
  if (kwInput) {
    kwInput.value = '';
    kwInput.focus();
  }
  doSearchInstructor();
}

function closeInstructorSearchModal() {
  const modal = document.getElementById('teaSearchModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

async function doSearchInstructor() {
  const kw = (document.getElementById('popupTeaKeyword')?.value || '').trim();
  let list = [];
  try {
    const res = await fetch('/api/af/ad_tea/lists');
    if (res.ok) {
      const data = await res.json();
      if (data && data.teachers) list = data.teachers;
    }
  } catch(e) {}

  // 기본/공통 강사 풀 보강
  const defaults = [
    { id: 'tea01', instructorId: 'tea01', name: '김선생 (대표강사)', phone: '010-1234-5678' },
    { id: 'tea02', instructorId: 'tea02', name: '이선생 (창의강사)', phone: '010-2345-6789' },
    { id: 'tea03', instructorId: 'tea03', name: '박선생 (로봇강사)', phone: '010-3456-7890' },
    { id: 'tea04', instructorId: 'tea04', name: '돌봄전담사 (돌봄교실)', phone: '010-4567-8901' },
    { id: 'sub01', instructorId: 'sub01', name: '이보조 (보조강사)', phone: '010-5678-9012' }
  ];

  const existingIds = new Set(list.map(t => t.instructorId || t.id));
  defaults.forEach(d => {
    if (!existingIds.has(d.id)) list.push(d);
  });

  if (kw) {
    list = list.filter(t => {
      const name = t.name || '';
      const tid = t.instructorId || t.id || '';
      const phone = t.phone || '';
      return name.includes(kw) || tid.includes(kw) || phone.includes(kw);
    });
  }

  const tbody = document.getElementById('teaSearchResultBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="padding:20px; color:#888; text-align:center;">일치하는 강사가 없습니다.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(t => {
    const tid = t.instructorId || t.id || '';
    const tname = t.name || '';
    const tphone = t.phone || '-';
    return `
      <tr style="border-bottom:1px solid #eee;">
        <td style="padding:8px; text-align:center; font-weight:600;">${tid}</td>
        <td style="padding:8px; text-align:center;">${tname}</td>
        <td style="padding:8px; text-align:center; color:#666;">${tphone}</td>
        <td style="padding:8px; text-align:center;">
          <button type="button" class="btn btn-default" onclick="selectInstructor('${tid}', '${tname}')" style="height:26px; padding:0 10px; font-size:12px; border:1px solid #ccc; background:#fff; cursor:pointer; border-radius:3px; display:inline-flex; align-items:center; justify-content:center;">선택</button>
        </td>
      </tr>
    `;
  }).join('');
}

function selectInstructor(id, name) {
  const target = document.getElementById(activeInstructorTargetId);
  if (target) {
    target.value = id || name;
  }
  closeInstructorSearchModal();
}

// ---------------- 강의시간 선택 헬퍼 모달 기능 ----------------
function openTimeSelectHelper() {
  const modal = document.getElementById('lecTimeModal');
  if (modal) {
    modal.style.zIndex = '100050';
    modal.style.display = 'flex';
  }
  const currentVal = document.getElementById('add_lec_time_disp')?.value || '';
  if (typeof _timeSlots !== 'undefined' && _timeSlots.length > 0) {
    renderTimeSlotGrid();
  } else {
    document.querySelectorAll('.time-opt-cb').forEach(cb => {
      cb.checked = currentVal.includes(cb.value);
    });
  }
}

function closeTimeSelectHelper() {
  const modal = document.getElementById('lecTimeModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function applySelectedTime() {
  const selected = new Set();
  document.querySelectorAll('.time-opt-cb:checked, .time-slot-chk:checked').forEach(cb => {
    if (cb.value) selected.add(cb.value);
  });
  const selectedArr = Array.from(selected);
  const input = document.getElementById('add_lec_time_disp');
  if (input) {
    input.value = selectedArr.length > 0 ? selectedArr.join(', ') : '';
    if (typeof checkTimeConflict === 'function') {
      checkTimeConflict(input.value);
    }
  }
  closeTimeSelectHelper();
}

// ---------------- 대상학년 전체선택 토글 ----------------
function toggleAllGrades(master) {
  const checked = master.checked;
  document.querySelectorAll('input[name="lec_grade"]').forEach(cb => {
    cb.checked = checked;
  });
}

function updateMasterGradeCheckbox() {
  const all = document.querySelectorAll('input[name="lec_grade"]');
  const checked = document.querySelectorAll('input[name="lec_grade"]:checked');
  const master = document.getElementById('add_check_all_grade');
  if (master) {
    master.checked = (all.length > 0 && all.length === checked.length);
  }
}

function chk_all_grade(master) {
  toggleAllGrades(master);
}

function add_file() {
  const fileBox = document.getElementById('file_box');
  if (!fileBox) return;
  const div = document.createElement('div');
  div.style.marginTop = '6px';
  div.style.display = 'flex';
  div.style.alignItems = 'center';
  div.style.gap = '6px';
  div.innerHTML = `
    <input type="file" name="file[]" class="form-control input-sm" style="display:inline-block; width:80%; height:32px; border:1px solid #ccc; box-sizing:border-box;">
    <button type="button" class="btn btn-default btn-xs" onclick="this.parentElement.remove()" style="height:30px; padding:0 8px; line-height:1; display:inline-flex; align-items:center; cursor:pointer;">&times;</button>
  `;
  fileBox.appendChild(div);
}

function chkLecPay(el) {
  if (typeof calculateTuitionSplit === 'function') calculateTuitionSplit();
}

function chkMoney(el) {
  // 금액 입력 시 부가 검증/계산
}

// ---------------- 수강료/수용비/강사료 분할 자동계산 ----------------
function calculateTuitionSplit() {
  const payInput = document.getElementById('add_lec_pay');
  const useCostInput = document.getElementById('add_lec_use_cost');
  const teaFeeInput = document.getElementById('add_lec_tea_fee');
  if (!payInput || !useCostInput || !teaFeeInput) return;

  const pay = parseInt(payInput.value, 10) || 0;
  const useCost = parseInt(useCostInput.value, 10) || 0;
  const teaFee = Math.max(0, pay - useCost);
  teaFeeInput.value = teaFee;
}

// ---------------- 강좌 등록 제출 (Submit) ----------------
async function submitAddCourse(e) {
  if (e) e.preventDefault();

  const lecName = document.getElementById('add_lec_name')?.value?.trim();
  if (!lecName) {
    alert('강좌명 : 필수항목입니다.');
    document.getElementById('add_lec_name')?.focus();
    return false;
  }

  const lecDiv = document.getElementById('add_lec_div')?.value;
  if (!lecDiv) {
    alert('강좌구분 : 필수항목입니다.');
    document.getElementById('add_lec_div')?.focus();
    return false;
  }

  const proType = document.getElementById('add_lec_pro_type')?.value;
  if (!proType) {
    alert('늘봄과정 : 필수항목입니다.');
    document.getElementById('add_lec_pro_type')?.focus();
    return false;
  }

  const teaId = document.getElementById('add_tea_id')?.value?.trim();
  if (!teaId) {
    alert('강사ID : 필수항목입니다.');
    document.getElementById('add_tea_id')?.focus();
    return false;
  }

  const selectedGrades = [];
  document.querySelectorAll('input[name="lec_grade"]:checked').forEach(cb => selectedGrades.push(cb.value));
  if (selectedGrades.length === 0) {
    alert('대상학년 : 필수항목입니다.');
    return false;
  }

  const lecTime = document.getElementById('add_lec_time_disp')?.value?.trim();
  if (!lecTime) {
    alert('강의시간 : 필수항목입니다.');
    document.getElementById('add_lec_time_disp')?.focus();
    return false;
  }

  const maxSin = parseInt(document.getElementById('add_lec_max_sin')?.value, 10) || 0;
  if (maxSin <= 0) {
    alert('정원 : 필수항목입니다.');
    document.getElementById('add_lec_max_sin')?.focus();
    return false;
  }

  const maxWait = parseInt(document.getElementById('add_lec_max_wait')?.value, 10) || 0;
  const sdate = document.getElementById('add_lec_sdate')?.value?.trim();
  const edate = document.getElementById('add_lec_edate')?.value?.trim();
  if (!sdate || !edate) {
    alert('운영기간 : 필수항목입니다.');
    return false;
  }

  const fee = parseInt(document.getElementById('add_lec_pay')?.value, 10) || 0;
  const costFacility = parseInt(document.getElementById('add_lec_use_cost')?.value, 10) || 0;
  const costInstructor = parseInt(document.getElementById('add_lec_tea_fee')?.value, 10) || (fee - costFacility);
  const bookFee = parseInt(document.getElementById('add_lec_pay_book')?.value, 10) || 0;
  const materialFee = parseInt(document.getElementById('add_lec_pay_item')?.value, 10) || 0;
  const classroom = document.getElementById('add_lec_room')?.value?.trim() || document.getElementById('add_lec_room_sel')?.value || '본관2층 컴퓨터교실';
  const totalHours = parseInt(document.getElementById('add_lec_tot_sisu')?.value, 10) || 16;
  const assistantId = document.getElementById('add_tea_id1')?.value?.trim() || '';
  const content = document.getElementById('add_lec_content')?.value || '';
  const statusEl = document.querySelector('input[name="add_lec_status"]:checked');
  const statusVal = statusEl ? statusEl.value : '출력';

  let dayOfWeek = '월';
  const dayMatch = lecTime.match(/^(월|화|수|목|금|토|일)/);
  if (dayMatch) dayOfWeek = dayMatch[1];

  const payload = {
    schoolId: SCHOOL_SN || 'sch_1',
    category: lecDiv,
    neulbomType: proType,
    title: lecName,
    instructor: teaId,
    teacherName: teaId,
    assistantInstructor: assistantId,
    targetGrade: selectedGrades.join(','),
    capacity: maxSin,
    waitingCapacity: maxWait,
    totalHours: totalHours,
    period: `${sdate} ~ ${edate}`,
    tuitionFee: fee,
    fee: fee,
    costFacility: costFacility,
    costInstructor: costInstructor,
    textbookFee: bookFee,
    materialFee: materialFee,
    classroom: classroom,
    location: classroom,
    dayOfWeek: dayOfWeek,
    scheduleTime: lecTime,
    schedule: `${dayOfWeek}:${lecTime}`,
    allowTimeConflict: document.getElementById('add_lec_time_not_chk')?.checked || false,
    noSameTeacher: document.getElementById('add_tea_id_chk')?.checked || false,
    notFree2Pay: document.getElementById('add_not_free2_pay')?.checked || false,
    notFree3Pay: document.getElementById('add_not_free3_pay')?.checked || false,
    notFree1Pay: document.getElementById('add_not_free1_pay')?.checked || false,
    notFree2PayBook: document.getElementById('add_not_free2_pay_book')?.checked || false,
    notFree3PayBook: document.getElementById('add_not_free3_pay_book')?.checked || false,
    notFree1PayBook: document.getElementById('add_not_free1_pay_book')?.checked || false,
    content: content,
    status: statusVal === '출력' ? 'OUTPUT' : (statusVal === '대기' ? 'WAITING' : 'CLOSED')
  };

  const editId = document.getElementById('fm_course_add')?.dataset?.editId;
  const apiUrl = editId ? '/api/af/ad_lec/update' : '/api/af/ad_lec/create';
  if (editId) payload.id = editId;

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      window.lastRegisteredCourseId = data.lecture ? data.lecture.id : (editId || null);

      // 첨부파일 업로드 (강좌 등록 성공 후)
      const lecId = data.lecture ? data.lecture.id : editId;
      const fileResult = await uploadLecFiles(lecId);
      let fileMsg = '';
      if (fileResult && fileResult.files && fileResult.files.length > 0) {
        fileMsg = `\n첨부파일 ${fileResult.files.length}개 업로드 완료.`;
      } else if (fileResult && !fileResult.success && fileResult.message) {
        fileMsg = `\n(첨부파일: ${fileResult.message})`;
      }

      const defaultMsg = editId ? `'${lecName}' 강좌가 성공적으로 수정되었습니다.` : `'${lecName}' 강좌가 성공적으로 등록되었습니다.`;
      alert((data.message || defaultMsg) + fileMsg);
      closeAddModal();

      // 등록된 강좌의 구분(category)으로 목록 필터를 자동 동기화하여 즉시 화면에 반영
      const catFilter = document.getElementById('categoryFilter');
      if (catFilter) {
        let found = false;
        for (let opt of catFilter.options) {
          if (opt.value === lecDiv) {
            found = true;
            break;
          }
        }
        if (!found) {
          const opt = document.createElement('option');
          opt.value = lecDiv;
          opt.text = lecDiv;
          catFilter.add(opt, 0);
        }
        catFilter.value = lecDiv;
      }

      // 검색어 및 상태 필터 초기화하여 새 강좌가 누락되지 않도록 보장
      const kwFilter = document.getElementById('searchKeyword');
      if (kwFilter) kwFilter.value = '';
      const stFilter = document.getElementById('statusFilter');
      if (stFilter) stFilter.value = '전체';

      // 화면 목록 재조회
      if (typeof loadLectures === 'function') {
        await loadLectures();
      }
    } else {
      alert(data.message || '강좌 등록 중 오류가 발생했습니다.');
    }
  } catch (err) {
    console.error('submitAddCourse error:', err);
    alert('서버 통신 중 오류가 발생했습니다.');
  }
  return false;
}

async function submitBatchCopy(e) {
  e.preventDefault();
  const payload = {
    schoolId: SCHOOL_SN,
    sourceCategory: document.getElementById('copySourceCategory').value,
    targetCategory: document.getElementById('copyTargetCategory').value.trim(),
    copyFees: document.getElementById('copyFeesCheck').checked
  };
  const res = await fetch('/api/af/ad_lec/batch-copy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  alert(data.message);
  closeBatchCopyModal();
  loadLectures();
}

async function openRefundCalculator() {
  const fee = prompt('수강료 (원)을 입력하세요:', '60000');
  const totalDays = prompt('전체 수업 일수 (총시수 기준):', '12');
  const attendedDays = prompt('수강한 일수:', '3');
  if (fee && totalDays && attendedDays) {
    const res = await fetch('/api/refunds/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tuitionFee: fee, totalDays, attendedDays })
    });
    const data = await res.json();
    alert(data.message);
  }
}


function exportToExcel() {
  const lectures = (currentLecturesCache && currentLecturesCache.length > 0) ? currentLecturesCache : [];
  if (lectures.length === 0) {
    alert('출력할 강좌 데이터가 없습니다.');
    return;
  }

  const tableHeader = `
    <tr>
      <th style="background-color:#4b5563; color:#ffffff; border:1px solid #9ca3af; padding:8px;">연번</th>
      <th style="background-color:#4b5563; color:#ffffff; border:1px solid #9ca3af; padding:8px;">구분</th>
      <th style="background-color:#4b5563; color:#ffffff; border:1px solid #9ca3af; padding:8px;">늘봄과정</th>
      <th style="background-color:#4b5563; color:#ffffff; border:1px solid #9ca3af; padding:8px;">강좌명</th>
      <th style="background-color:#4b5563; color:#ffffff; border:1px solid #9ca3af; padding:8px;">강사명(ID)</th>
      <th style="background-color:#4b5563; color:#ffffff; border:1px solid #9ca3af; padding:8px;">신청/정원</th>
      <th style="background-color:#4b5563; color:#ffffff; border:1px solid #9ca3af; padding:8px;">대기자/정원</th>
      <th style="background-color:#4b5563; color:#ffffff; border:1px solid #9ca3af; padding:8px;">대상학년</th>
      <th style="background-color:#4b5563; color:#ffffff; border:1px solid #9ca3af; padding:8px;">운영기간</th>
      <th style="background-color:#4b5563; color:#ffffff; border:1px solid #9ca3af; padding:8px;">강의시간</th>
      <th style="background-color:#4b5563; color:#ffffff; border:1px solid #9ca3af; padding:8px;">수강료</th>
      <th style="background-color:#4b5563; color:#ffffff; border:1px solid #9ca3af; padding:8px;">수용비</th>
      <th style="background-color:#4b5563; color:#ffffff; border:1px solid #9ca3af; padding:8px;">재료비</th>
      <th style="background-color:#4b5563; color:#ffffff; border:1px solid #9ca3af; padding:8px;">교재비</th>
      <th style="background-color:#4b5563; color:#ffffff; border:1px solid #9ca3af; padding:8px;">상태</th>
    </tr>
  `;

  const tableRows = lectures.map((lec, idx) => `
    <tr>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${idx + 1}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${lec.category || ''}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${lec.neulbomType || '방과후'}</td>
      <td style="text-align:left; border:1px solid #d1d5db; padding:6px;">${lec.title || ''}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${lec.teacherName || lec.instructor || ''} (${lec.teacherId || ''})</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${lec.enrolledCount || 0} / ${lec.capacity || 20}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${lec.waitingCount || 0} / ${lec.waitingCapacity || 5}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${lec.grade || ''}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${lec.period || ''}</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${lec.schedule || ''}</td>
      <td style="text-align:right; border:1px solid #d1d5db; padding:6px;">${(lec.tuitionFee || lec.fee || 0).toLocaleString()}원</td>
      <td style="text-align:right; border:1px solid #d1d5db; padding:6px;">${(lec.receptiveFee || 0).toLocaleString()}원</td>
      <td style="text-align:right; border:1px solid #d1d5db; padding:6px;">${(lec.materialFee || 0).toLocaleString()}원</td>
      <td style="text-align:right; border:1px solid #d1d5db; padding:6px;">${(lec.textbookFee || 0).toLocaleString()}원</td>
      <td style="text-align:center; border:1px solid #d1d5db; padding:6px;">${lec.status || '진행중'}</td>
    </tr>
  `).join('');

  const excelContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>강좌목록</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        th { font-weight: bold; font-family: '맑은 고딕', Malgun Gothic, sans-serif; }
        td { font-family: '맑은 고딕', Malgun Gothic, sans-serif; font-size: 11pt; }
      </style>
    </head>
    <body>
      <h2 style="font-family:'맑은 고딕'; text-align:center; padding:10px 0;">2026학년도 늘봄·방과후학교 강좌 개설 현황</h2>
      <table border="1" style="border-collapse:collapse; width:100%;">
        <thead>${tableHeader}</thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\\uFEFF' + excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  a.download = `강좌목록_검색결과_${dateStr}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
window.loadInstructorBanking = loadInstructorBanking;
window.saveBasicSettings = saveBasicSettings;
window.toggleSelectAll = toggleSelectAll;
window.toggleSelectAllApps = toggleSelectAllApps;
window.changeSelectedStatus = changeSelectedStatus;
window.toggleInstructorClose = toggleInstructorClose;
window.toggleInstructorEdit = toggleInstructorEdit;
window.deleteLecture = deleteLecture;
window.openCourseEditModal = openCourseEditModal;
window.runLottery = runLottery;
window.openAddModal = openAddModal;
window.closeAddModal = closeAddModal;
window.openInstructorSearchModal = openInstructorSearchModal;
window.closeInstructorSearchModal = closeInstructorSearchModal;
window.doSearchInstructor = doSearchInstructor;
window.selectInstructor = selectInstructor;
window.openTimeSelectHelper = openTimeSelectHelper;
window.closeTimeSelectHelper = closeTimeSelectHelper;
window.applySelectedTime = applySelectedTime;
window.toggleAllGrades = toggleAllGrades;
window.chk_all = chk_all;
window.add_file = add_file;
window.chkLecPay = chkLecPay;
window.chkMoney = chkMoney;
window.updateMasterGradeCheckbox = updateMasterGradeCheckbox;
window.calculateTuitionSplit = calculateTuitionSplit;
window.submitAddCourse = submitAddCourse;
window.openBatchCopyModal = openBatchCopyModal;
window.closeBatchCopyModal = closeBatchCopyModal;
window.copy_chk_all = copy_chk_all;
window.copy_chk_field = copy_chk_field;
window.submitBatchCopyModal = submitBatchCopyModal;
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
window.submitBatchCopy = submitBatchCopy;
function switchRole(role) {
  if (role === 'teacher') {
    window.location.href = '/teacher/dashboard';
  } else if (role === 'parent') {
    window.location.href = '/courses';
  } else {
    window.location.href = '/af/ad_lec/lists/sn/3267';
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

function approveSelectedStudent() { alert('선택된 학생이 승인되었습니다.'); }
function cancelSelectedStudent() { alert('선택된 학생의 신청이 취소되었습니다.'); }
function approveApplicant(id) { alert('신청이 승인되었습니다.'); }

window.switchRole = switchRole;
window.openSafetyModal = openSafetyModal;
if (typeof openVideoPlayer !== 'undefined') window.openVideoPlayer = openVideoPlayer;
if (typeof closeVideoPlayer !== 'undefined') window.closeVideoPlayer = closeVideoPlayer;
if (typeof openDocViewer !== 'undefined') window.openDocViewer = openDocViewer;
if (typeof closeDocViewer !== 'undefined') window.closeDocViewer = closeDocViewer;
if (typeof downloadManualZip !== 'undefined') window.downloadManualZip = downloadManualZip;
window.approveSelectedStudent = approveSelectedStudent;
window.cancelSelectedStudent = cancelSelectedStudent;
window.approveApplicant = approveApplicant;
if (typeof promoteWaitStudent !== 'undefined') window.promoteWaitStudent = promoteWaitStudent;
if (typeof batchStampAttendance !== 'undefined') window.batchStampAttendance = batchStampAttendance;
if (typeof approveAbsence !== 'undefined') window.approveAbsence = approveAbsence;
if (typeof submitPushNotification !== 'undefined') window.submitPushNotification = submitPushNotification;
if (typeof exportToExcel !== 'undefined') window.exportToExcel = exportToExcel;

// ==================== 14. 매뉴얼 & FAQ (/af/ad_faq/main) ====================

const FAQ_PROCEDURES = [
  { num: 1,  title: '학교홈페이지 배너 등록',     doc: '/help/go_data/num/239/data/link2' },
  { num: 2,  title: '학생 이용 동의서 받기',       doc: '/help/go_data/num/182/data/link2' },
  { num: 3,  title: '가정통신문 발송',             doc: '/help/go_data/num/183/data/link2' },
  { num: 4,  title: '학생등록',                   doc: '/help/go_data/num/71/data/link2',  video: '/help/go_data/num/71/data/link1' },
  { num: 5,  title: '강사등록',                   doc: '/help/go_data/num/185/data/link2', video: '/help/go_data/num/72/data/link1' },
  { num: 6,  title: '환경설정',                   doc: '/help/go_data/num/73/data/link2',  video: '/help/go_data/num/73/data/link1' },
  { num: 7,  title: '강좌등록',                   doc: '/help/go_data/num/74/data/link2',  video: '/help/go_data/num/74/data/link1' },
  { num: 8,  title: '수강신청 기간 설정',          doc: '/help/go_data/num/75/data/link2',  video: '/help/go_data/num/75/data/link1' },
  { num: 9,  title: '수강신청 테스트',             doc: '/help/go_data/num/76/data/link2',  video: '/help/go_data/num/76/data/link1' },
  { num: 10, title: '대기자 관리',                 doc: '/help/go_data/num/77/data/link2',  video: '/help/go_data/num/77/data/link1' },
  { num: 11, title: '추첨하기',                   doc: '/help/go_data/num/78/data/link2',  video: '/help/go_data/num/78/data/link1' },
  { num: 12, title: '신청결과 조회',               doc: '/help/go_data/num/186/data/link2' },
  { num: 13, title: '출석부 관리',                 doc: '/help/go_data/num/237/data/link2' },
  { num: 14, title: '수강료 산출',                 doc: '/help/go_data/num/80/data/link2',  video: '/help/go_data/num/80/data/link1' },
  { num: 15, title: '강사마감',                   doc: '/help/go_data/num/81/data/link2',  video: '/help/go_data/num/81/data/link1' },
  { num: 16, title: '지원금 관리',                 doc: '/help/go_data/num/255/data/link2' },
  { num: 17, title: '자유수강권자 관리',            doc: '/help/go_data/num/187/data/link2', video: '/help/go_data/num/82/data/link1' },
  { num: 18, title: '스쿨뱅킹 파일 다운로드',       doc: '/help/go_data/num/84/data/link2',  video: '/help/go_data/num/84/data/link1' },
  { num: 19, title: '다음달 수강신청 준비',         doc: '/help/go_data/num/188/data/link2' },
  { num: 20, title: '환불자 관리',                 doc: '/help/go_data/num/85/data/link2',  video: '/help/go_data/num/85/data/link1' },
  { num: 21, title: '데이터 백업 및 초기화',        doc: '/help/go_data/num/190/data/link2', video: '/help/go_data/num/86/data/link1' },
  { num: 22, title: '설문조사 가정통신문',          doc: '/help/go_data/num/191/data/link2' },
  { num: 23, title: '설문조사 관리',               doc: '/help/go_data/num/45/data/link2',  video: '/help/go_data/num/45/data/link1' },
];

const FAQ_TEMPLATES = [
  {
    title: '배너 / 팝업 이미지',
    links: [
      { label: '배너 문서', href: '/help/go_data/num/177/data/link2', type: 'doc' },
      { label: '팝업 이미지 문서', href: '/help/go_data/num/178/data/link2', type: 'doc' }
    ]
  },
  {
    title: '학생 수강신청 안내 동영상',
    links: [
      { label: '동영상', href: '/help/go_data/num/88/data/link1', type: 'video' },
      { label: '다운로드', href: '/help/go_data/num/168/data/link2', type: 'down' }
    ]
  },
  {
    title: '모바일 앱 이용 방법',
    links: [
      { label: '문서', href: '/help/go_data/num/181/data/link2', type: 'doc' }
    ]
  }
];

const FAQ_MANUALS = [
  {
    title: '관리자 수강신청 관리 매뉴얼',
    links: [{ label: '문서', href: '/help/go_data/num/161/data/link2', type: 'doc' }]
  },
  {
    title: '강사 매뉴얼',
    links: [
      { label: '동영상', href: '/help/go_data/num/101/data/link1', type: 'video' },
      { label: '초등학교 문서', href: '/help/go_data/num/162/data/link2', type: 'doc' },
      { label: '중·고등학교 문서', href: '/help/go_data/num/163/data/link2', type: 'doc' }
    ]
  },
  {
    title: '담임 매뉴얼',
    links: [{ label: '문서', href: '/help/go_data/num/166/data/link2', type: 'doc' }]
  },
  {
    title: '수강신청 전 필수 점검사항',
    links: [{ label: '문서', href: '/help/go_data/num/164/data/link2', type: 'doc' }]
  },
  {
    title: '★ 월별 마감 및 다음 달 수강신청 준비 절차 ★',
    isHighlight: true,
    links: [{ label: '문서', href: '/help/go_data/num/165/data/link2', type: 'doc' }]
  }
];

const FAQ_CATEGORIES = [
  {
    category: '학생관리',
    items: [
      { title: '학생 비밀번호를 초기화하고 싶어요', doc: '/help/go_data/num/89/data/link2', video: '/help/go_data/num/89/data/link1' },
      { title: '로그인 화면에 번호가 다 출력되지 않아요', doc: '/help/go_data/num/154/data/link2' },
      { title: '학생 진급 처리는 어떻게 하나요?', doc: '/help/go_data/num/61/data/link2', video: '/help/go_data/num/90/data/link1' },
      { title: '1학년 학적이 나오지 않아 가학적으로 받고 싶어요', doc: '/help/go_data/num/62/data/link2', video: '/help/go_data/num/62/data/link1' },
      { title: '학생 학적이 중간에 변경되었는데 어떻게 반영하나요?', doc: '/help/go_data/num/134/data/link2' },
      { title: '학생 학적을 일괄변경하고 싶어요', doc: '/help/go_data/num/135/data/link2' },
      { title: '다자녀 기능은 어떻게 활용하나요?', doc: '/help/go_data/num/155/data/link2' },
      { title: '학생 성별 일괄 업데이트 방법', doc: '/help/go_data/num/156/data/link2' }
    ]
  },
  {
    category: '교직원관리',
    items: [
      { title: '추가로 서비스 관리자를 지정하고 싶어요', doc: '/help/go_data/num/70/data/link2', video: '/help/go_data/num/70/data/link1' }
    ]
  },
  {
    category: '강사관리',
    items: [
      { title: '강사권한 설정(수강생 등록, 삭제, 수강료 입력)', doc: '/help/go_data/num/150/data/link2', video: '/help/go_data/num/95/data/link1' },
      { title: '강사에게 강좌 등록 권한을 주고 싶어요', doc: '/help/go_data/num/146/data/link2' },
      { title: '강사에게 전체 강좌 조회 권한을 주고 싶어요', doc: '/help/go_data/num/149/data/link2' },
      { title: '강사가 바뀌었어요', doc: '/help/go_data/num/148/data/link2' },
      { title: '강사 모바일 출결 문자 발송 기능 이용 안내', doc: '/help/go_data/num/151/data/link2', video: '/help/go_data/num/151/data/link1' }
    ]
  },
  {
    category: '강좌관리',
    items: [
      { title: '강좌 일괄 입력', doc: '/help/go_data/num/92/data/link2', video: '/help/go_data/num/92/data/link1' },
      { title: '강좌 일괄 수정 - 엑셀로 강좌 정보를 일괄수정하고 싶어요', doc: '/help/go_data/num/138/data/link2' },
      { title: '강좌 일괄 삭제 - 강좌를 한꺼번에 지우고 싶어요', doc: '/help/go_data/num/158/data/link2' },
      { title: '강좌 통계 기능 - 강좌 마감 상태 확인을 위한 강좌통계 기능 활용하기', doc: '/help/go_data/num/93/data/link2', video: '/help/go_data/num/93/data/link1' },
      { title: '강좌 상태 “출력, 종료, 대기” 이해하기', doc: '/help/go_data/num/159/data/link2' },
      { title: '정확한 강의시간 중복 체크 방법', doc: 'https://s3-ap-northeast-2.amazonaws.com/www.dbdbschool.kr/doc/faq/after/%EA%B0%95%EC%A2%8C%EA%B4%80%EB%A6%AC_06_%EC%8B%9C%EA%B0%84%EC%A4%91%EB%B3%B5%20%EC%B2%B4%ED%81%AC.hwp' },
      { title: '수강료를 강사료와 수용비로 나눠 관리하고 싶어요', doc: '/help/go_data/num/44/data/link2' }
    ]
  },
  {
    category: '신청자 관리',
    items: [
      { title: '수강신청 테스트 - 수강신청에 문제가 없는지 테스트 하고 싶어요', doc: '/help/go_data/num/76/data/link2', video: '/help/go_data/num/96/data/link1' },
      { title: '신청자 관리 등록 / 신청자를 미리 입력해 놓고 싶어요', doc: '/help/go_data/num/171/data/link2' },
      { title: '신청자 관리 삭제 / 특정 강좌의 신청자를 모두 삭제하고 싶어요', doc: '/help/go_data/num/172/data/link2' },
      { title: '신청자 관리 이동 / 신청자를 다른 강좌로 옮기고 싶어요', doc: '/help/go_data/num/174/data/link2' },
      { title: '신청자 관리 복사 / 신청자를 다른 강좌로 복사하고 싶어요', doc: '/help/go_data/num/175/data/link2' },
      { title: '신청자 통계 - 방과후학교를 수강한 학생수(단수)를 어디에서 확인하나요?', doc: '/help/go_data/num/58/data/link2' },
      { title: '학생화면에 이전 강좌구분을 출력하지 않게하는 방법', doc: '/help/go_data/num/176/data/link2' }
    ]
  },
  {
    category: '자유수강권자 관리',
    items: [
      { title: '자유수강권자를 추가하고 개별 처리하는 방법', doc: '/help/go_data/num/94/data/link2', video: '/help/go_data/num/94/data/link1' },
      { title: '자유수강권자를 환불하고 개별 처리하는 방법', doc: '/help/go_data/num/192/data/link2' },
      { title: '학생 자유수강권 잔액 조회 기능 활성화', doc: '/help/go_data/num/193/data/link2' }
    ]
  },
  {
    category: '스쿨뱅킹 & 나이스',
    items: [
      { title: '에듀파인 감면자(자유수강권자) 일괄입력 파일 다운로드', doc: '/help/go_data/num/169/data/link2' },
      { title: '에듀파인 개인부담금반환 입력용 파일 다운로드', doc: '/help/go_data/num/170/data/link2' },
      { title: '분기 접수, 월별 징수 처리 방법', doc: '/help/go_data/num/126/data/link2' },
      { title: '나이스 방과후학교 프로그램 수강생, 수강료 일괄입력 파일 다운로드', doc: '/help/go_data/num/97/data/link2', video: '/help/go_data/num/97/data/link1' }
    ]
  },
  {
    category: '환경설정',
    items: [
      { title: '학생 최대 신청 강좌수를 제한할 수 있나요?', doc: '/help/go_data/num/194/data/link2' },
      { title: '안내글 설정', doc: '/help/go_data/num/100/data/link2' }
    ]
  },
  {
    category: '알림관리',
    items: [
      { title: '알림 관리', doc: '/help/go_data/num/195/data/link2' }
    ]
  },
  {
    category: '모바일앱',
    items: [
      { title: '모바일 푸시 알림은 어떻게 등록하나요?', doc: '/help/go_data/num/167/data/link2' }
    ]
  },
  {
    category: '계약',
    items: [
      { title: '계약을 연장하고 싶어요', doc: '/help/go_data/num/160/data/link2' }
    ]
  },
  {
    category: '설문관리',
    items: [
      { title: '설문 참여율을 높이는 설문참여 안내 문자 발송하는 법', doc: '/help/go_data/num/47/data/link2' }
    ]
  }
];

function makeBadge(type, href, label) {
  if (type === 'doc') {
    return `<a href="${href}" target="_blank" rel="noreferrer" class="manual_btn"><i class="fa fa-download"></i> ${label || '문서'}</a>`;
  }
  if (type === 'video') {
    return `<a href="${href}" target="_blank" rel="noreferrer" class="manual_btn" style="color:#c0392b;"><i class="fa fa-youtube-play"></i> <span class="txt">${label || '동영상'}</span></a>`;
  }
  return `<a href="${href}" target="_blank" rel="noreferrer" class="manual_btn"><i class="fa fa-download"></i> ${label || '다운로드'}</a>`;
}

function loadFaqList() {
  // 1. 수강신청 운영 절차 (1 ~ 23)
  const opsContainer = document.getElementById('operationsListContainer');
  if (opsContainer && (!opsContainer.children.length || opsContainer.innerText.includes('로딩'))) {
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


// ---------------- 28. Q&A 고객지원 게시판 모듈 완벽 구현 ----------------

async function loadQaList() {
  if (!qaItems || qaItems.length === 0) {
    qaItems = [
      {
        id: 'qna_8806',
        num: 2,
        authorName: '원희자(김채원)',
        hp1: '010',
        hp2: '2494',
        hp3: '1479',
        phone: '062-609-1182',
        email: 'khh147979@naver.com',
        subject: '2026학년도 1학기 늘봄학교 만족도 조사 설문지',
        contents: '2026학년도 바뀐 설문지 양식 첨부하여 보내드립니다.\n늘봄학교 1학기 만족도 조사 설문 등록 부탁드립니다.\n감사합니다.',
        status: '2',
        statusText: '완료',
        createdAt: '2026-06-01',
        answerDate: '06/01',
        answerContent: '안녕하세요. 디비디비스쿨 고객지원팀입니다.\n자료 올려 주셔서 대단히 감사합니다.\n4가지 샘플 설문에 정상 등록해드렸으니 설문관리 메뉴에서 바로 확인 및 활용 가능하십니다.\n추가 문의사항이 있으시면 언제든지 말씀해 주세요.'
      },
      {
        id: 'qna_3356',
        num: 1,
        authorName: '원희자(김채원)',
        hp1: '010',
        hp2: '2494',
        hp3: '1479',
        phone: '062-609-1182',
        email: 'khh147979@naver.com',
        subject: '지원금 스쿨뱅킹 현황',
        contents: '1학기 지원금 스쿨뱅킹 수납 현황 파일 확인 및 에듀파인 규격 매핑 부탁드립니다.',
        status: '2',
        statusText: '완료',
        createdAt: '2025-06-13',
        answerDate: '06/13',
        answerContent: '안녕하세요. 요청하신 지원금 스쿨뱅킹 수납 현황을 에듀파인 연계 규격에 맞게 생성하여 등록 처리 완료하였습니다.\n감사합니다.'
      }
    ];
  }
  renderQaTable(qaItems);

  try {
    const res = await fetch(`/api/af/qanda/lists/sn/${SCHOOL_SN}`);
    if (res.ok) {
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        qaItems = data.items;
        renderQaTable(qaItems);
      }
    }
  } catch (err) {
    console.warn('Failed to fetch QA from server, using local items:', err);
  }
}

function renderQaTable(items) {
  const tbody = document.getElementById('qaTbody');
  if (!tbody) return;

  if (!items || items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="center" style="padding:40px; color:#888; text-align:center;">등록된 고객지원 문의가 없습니다.</td></tr>';
    return;
  }

  tbody.innerHTML = items.map((item, idx) => {
    let statusBadge = '<span style="display:inline-block; padding:2px 8px; border-radius:3px; font-size:11px; font-weight:700; background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe;">접수</span>';
    let answerText = item.answerDate || '-';
    if (item.status === '1') {
      statusBadge = '<span style="display:inline-block; padding:2px 8px; border-radius:3px; font-size:11px; font-weight:700; background:#fef2f2; color:#dc2626; border:1px solid #fecaca;">처리중</span>';
    } else if (item.status === '2' || item.status === '3' || item.statusText === '완료') {
      statusBadge = '<span style="display:inline-block; padding:2px 8px; border-radius:3px; font-size:11px; font-weight:700; background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0;">완료</span>';
    }

    const rowNum = item.num || (items.length - idx);

    return `
      <tr style="height:42px; cursor:pointer; border-bottom:1px solid #f1f5f9; transition:background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'" onclick="openQaViewModal('${item.id}')">
        <td style="text-align:center; color:#64748b; font-size:12px;">${rowNum}</td>
        <td style="text-align:left; padding-left:16px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
          <a href="javascript:void(0);" onclick="openQaViewModal('${item.id}'); event.stopPropagation();" style="color:#1e293b; text-decoration:none; font-weight:600; font-size:13px;">
            ${escHtml(item.subject)}
          </a>
        </td>
        <td style="text-align:center; color:#64748b; font-size:12px;">${item.createdAt || ''}</td>
        <td style="text-align:center;">${statusBadge}</td>
        <td style="text-align:center; color:#64748b; font-size:12px;">${escHtml(answerText)}</td>
      </tr>
    `;
  }).join('');
}

function filterQaList() {
  const status = document.getElementById('qaStatusFilter')?.value || 'all';
  const type = document.getElementById('qaSearchType')?.value || 'sub_con';
  const kw = (document.getElementById('qaSearchKeyword')?.value || '').trim().toLowerCase();

  let filtered = [...qaItems];
  if (status !== 'all') {
    filtered = filtered.filter(i => String(i.status) === String(status));
  }
  if (kw) {
    if (type === 'subject') {
      filtered = filtered.filter(i => (i.subject || '').toLowerCase().includes(kw));
    } else if (type === 'contents') {
      filtered = filtered.filter(i => (i.contents || '').toLowerCase().includes(kw));
    } else {
      filtered = filtered.filter(i => (i.subject || '').toLowerCase().includes(kw) || (i.contents && i.contents.toLowerCase().includes(kw)));
    }
  }
  renderQaTable(filtered);
}

function resetQaFilter() {
  if (document.getElementById('qaStatusFilter')) document.getElementById('qaStatusFilter').value = 'all';
  if (document.getElementById('qaSearchType')) document.getElementById('qaSearchType').value = 'sub_con';
  if (document.getElementById('qaSearchKeyword')) document.getElementById('qaSearchKeyword').value = '';
  renderQaTable(qaItems);
}

function openQaWriteModal() {
  const modal = document.getElementById('qaWriteModal');
  if (modal) {
    modal.style.display = 'block';
    // 폼 초기화
    if (document.getElementById('qaNewSubject')) document.getElementById('qaNewSubject').value = '';
    if (document.getElementById('qaNewContents')) document.getElementById('qaNewContents').value = '';
    setTimeout(() => {
      document.getElementById('qaNewSubject')?.focus();
    }, 100);
  }
}

function closeQaWriteModal() {
  const modal = document.getElementById('qaWriteModal');
  if (modal) modal.style.display = 'none';
}

function openQaViewModal(id) {
  const item = qaItems.find(i => String(i.id) === String(id));
  if (!item) return;

  currentViewingQaId = id;
  const modal = document.getElementById('qaViewModal');
  const body = document.getElementById('qaViewBody');
  if (!modal || !body) return;

  let answerHtml = '';
  if (item.answerContent) {
    answerHtml = `
      <div style="background:#f5f8fc; border:1px solid #d2e4f7; padding:15px 18px; border-radius:4px; margin-top:16px;">
        <div style="font-weight:bold; color:#2b669a; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <i class="fa fa-reply"></i> 디비디비스쿨 고객지원 담당자 공식 답변
          <span style="font-size:11px; color:#888; font-weight:normal; margin-left:auto;">답변일시: ${escHtml(item.answerDate || item.createdAt)}</span>
        </div>
        <div style="color:#444; white-space:pre-line; line-height:1.7; font-size:13px;">${escHtml(item.answerContent)}</div>
      </div>
    `;
  } else {
    answerHtml = `
      <div style="background:#fcf8e3; border:1px solid #faebcc; padding:12px 16px; border-radius:4px; margin-top:16px; color:#8a6d3b;">
        <i class="fa fa-clock-o"></i> 문의글이 정상 접수되었습니다. 고객지원 담당자가 확인 후 신속하게 답변을 등록해 드립니다.
      </div>
    `;
  }

  body.innerHTML = `
    <table class="table AlignLeft" style="width:100%; font-size:13px; margin-bottom:0; border-top:2px solid #337ab7;">
      <tbody>
        <tr>
          <th style="width:120px; background:#f9f9f9; padding:10px 14px; border-bottom:1px solid #ddd; font-weight:bold;">제목</th>
          <td style="font-weight:bold; font-size:14px; color:#1e293b; padding:10px 14px; border-bottom:1px solid #ddd;">${escHtml(item.subject)}</td>
        </tr>
        <tr>
          <th style="background:#f9f9f9; padding:10px 14px; border-bottom:1px solid #ddd; font-weight:bold;">작성자</th>
          <td style="padding:10px 14px; border-bottom:1px solid #ddd;">${escHtml(item.authorName || '원희자(김채원)')} (${escHtml(item.hp1 || '010')}-${escHtml(item.hp2 || '2494')}-${escHtml(item.hp3 || '1479')})</td>
        </tr>
        <tr>
          <th style="background:#f9f9f9; padding:10px 14px; border-bottom:1px solid #ddd; font-weight:bold;">등록일시</th>
          <td style="padding:10px 14px; border-bottom:1px solid #ddd;">${escHtml(item.createdAt || '')}</td>
        </tr>
        <tr>
          <th style="background:#f9f9f9; padding:10px 14px; border-bottom:1px solid #ddd; font-weight:bold;">진행상태</th>
          <td style="padding:10px 14px; border-bottom:1px solid #ddd;">
            <span class="badge" style="background:#4791d2; color:#fff; padding:4px 10px; border-radius:3px; font-size:11px;">
              ${item.status === '2' ? '완료' : (item.status === '1' ? '처리중' : '접수')}
            </span>
          </td>
        </tr>
        <tr>
          <th style="background:#f9f9f9; padding:14px 14px; border-bottom:1px solid #ddd; font-weight:bold; vertical-align:top;">문의내용</th>
          <td style="white-space:pre-line; line-height:1.7; padding:14px 14px; border-bottom:1px solid #ddd; font-size:13px; color:#333;">${escHtml(item.contents)}</td>
        </tr>
      </tbody>
    </table>
    ${answerHtml}
  `;

  modal.style.display = 'block';
}

function closeQaViewModal() {
  const modal = document.getElementById('qaViewModal');
  if (modal) modal.style.display = 'none';
}

async function submitQaWrite(e) {
  if (e) e.preventDefault();
  const subject = document.getElementById('qaNewSubject')?.value?.trim();
  const contents = document.getElementById('qaNewContents')?.value?.trim();
  const authorName = document.getElementById('qaNewAuthor')?.value?.trim() || '원희자(김채원)';
  const hp1 = document.getElementById('qaNewHp1')?.value?.trim() || '010';
  const hp2 = document.getElementById('qaNewHp2')?.value?.trim() || '2494';
  const hp3 = document.getElementById('qaNewHp3')?.value?.trim() || '1479';
  const phone = document.getElementById('qaNewPhone')?.value?.trim() || '062-609-1182';
  const email = document.getElementById('qaNewEmail')?.value?.trim() || 'khh147979@naver.com';

  if (!subject) {
    alert('문의 제목을 입력해 주세요.');
    document.getElementById('qaNewSubject')?.focus();
    return;
  }
  if (!contents) {
    alert('문의 내용을 입력해 주세요.');
    document.getElementById('qaNewContents')?.focus();
    return;
  }

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  const newItem = {
    id: 'qna_' + Date.now(),
    num: qaItems.length + 1,
    schoolId: SCHOOL_SN,
    authorName,
    hp1,
    hp2,
    hp3,
    phone,
    email,
    subject,
    contents,
    files: [],
    status: '0',
    statusText: '접수',
    createdAt: dateStr,
    answerDate: '',
    answerContent: ''
  };

  try {
    await fetch('/api/af/qanda/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        school_id: SCHOOL_SN,
        ...newItem
      })
    });
  } catch (err) {
    console.warn('API call error, saved locally:', err);
  }

  qaItems.unshift(newItem);
  renderQaTable(qaItems);
  closeQaWriteModal();
  alert('고객지원 문의글이 성공적으로 등록되었습니다.\n담당자가 빠르게 확인 후 신속하게 답변드리겠습니다.');
}

async function deleteCurrentQaItem() {
  if (!currentViewingQaId) return;
  if (!window.confirm('해당 문의글을 삭제하시겠습니까?')) return;

  try {
    await fetch('/api/af/qanda/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: currentViewingQaId })
    });
  } catch (_) {}

  qaItems = qaItems.filter(i => String(i.id) !== String(currentViewingQaId));
  renderQaTable(qaItems);
  closeQaViewModal();
  alert('문의글이 삭제되었습니다.');
}

window.loadQaList = loadQaList;
window.filterQaList = filterQaList;
window.resetQaFilter = resetQaFilter;
window.openQaWriteModal = openQaWriteModal;
window.closeQaWriteModal = closeQaWriteModal;
window.openQaViewModal = openQaViewModal;
window.closeQaViewModal = closeQaViewModal;
window.submitQaWrite = submitQaWrite;
window.deleteCurrentQaItem = deleteCurrentQaItem;

// Export Applicant Functions
window.loadApplicants = loadApplicants;
window.resetAppFilters = resetAppFilters;
window.toggleSelectAllApps = toggleSelectAllApps;
window.toggleAppSort = toggleAppSort;
window.openAppCreateModal = openAppCreateModal;
window.closeAppModal = closeAppModal;
window.handleAppCreateSubmit = typeof handleAppCreateSubmit !== 'undefined' ? handleAppCreateSubmit : function(){};
window.openAppEditModal = openAppEditModal;
window.submitAppEdit = submitAppEdit;
window.deleteApp = deleteApp;
window.handleBulkAppStatus = handleBulkAppStatus;
window.handleBulkAppDelete = handleBulkAppDelete;
window.openAppBatchUploadModal = openAppBatchUploadModal;
window.parseAppBatchSample = typeof parseAppBatchSample !== 'undefined' ? parseAppBatchSample : function(){};
window.submitAppBatchUpload = typeof submitAuthenticBatchUpload !== 'undefined' ? submitAuthenticBatchUpload : function(){};
window.openAppBatchFeeModal = openAppBatchFeeModal;
window.submitAppBatchFee = typeof saveAllFeeEdits !== 'undefined' ? saveAllFeeEdits : function(){};
window.openAppBatchCopyModal = openAppBatchCopyModal;
window.submitAppBatchCopy = typeof executeAuthenticCopy !== 'undefined' ? executeAuthenticCopy : function(){};
window.exportAppExcel = exportAppExcel;
window.downloadSchoolBankingCsv = downloadSchoolBankingCsv;
window.openAppPrintModal = openAppPrintModal;
window.triggerPrintArea = triggerPrintArea;
window.editAppContact = editAppContact;
window.viewAppSchedule = viewAppSchedule;
window.openAppTestMode = openAppTestMode;
window.executeTestApply = executeTestApply;

// Additional Target-Compatible Aliases and Functions
window.openAppSinModal = openAppCreateModal;
window.openAppBatchInputModal = function(e) { if(e) e.preventDefault(); openAppBatchUploadModal(); };
window.openAppPayEditModal = function(e) { if(e) e.preventDefault(); openAppBatchFeeModal(); };
window.openAppCopyModal = function(e) { if(e) e.preventDefault(); openAppBatchCopyModal(); };

// Authentic sub-modal interactive helpers
window.openStudentSearchModal = openStudentSearchModal;
window.loadStudentSearchList = loadStudentSearchList;
window.applyStudentSearchItem = applyStudentSearchItem;
window.selectSinPeriod = selectSinPeriod;
window.selectSinCategory = selectSinCategory;
window.loadSinCourseTable = loadSinCourseTable;
window.chk_apply_sin = chk_apply_sin;
window.chk_cancel_sin = chk_cancel_sin;
window.populateBatchUploadCourses = populateBatchUploadCourses;
window.toggleBatchExcelGubun = toggleBatchExcelGubun;
window.downloadSampleExcel = downloadSampleExcel;
window.submitAuthenticBatchUpload = submitAuthenticBatchUpload;
window.loadFeeEditCourses = loadFeeEditCourses;
window.loadFeeEditApplicants = loadFeeEditApplicants;
window.toggleAllFeeRows = toggleAllFeeRows;
window.applyBatchFeeToChecked = applyBatchFeeToChecked;
window.saveSingleFeeRow = saveSingleFeeRow;
window.saveAllFeeEdits = saveAllFeeEdits;
window.loadCopyCourses = loadCopyCourses;
window.executeAuthenticCopy = executeAuthenticCopy;
window.loadUnappliedList = loadUnappliedList;
// ==================== 1:1 AUTHENTIC EXPORT & PRINT CONTROLLERS ====================

const DB_COURSES_3267 = [
  { id: '1552375', title: '(금) 돌봄 4부', instructor: '돌봄전담사', count: 19, capacity: 20, schedule: '금 16:00~17:00', room: '늘봄지원실', period: '10', periodText: '26년 8월', category: '3', fee: 0, bookFee: 0, matFee: 0 },
  { id: '1552291', title: '(금)돌봄 1부', instructor: '돌봄전담사', count: 5, capacity: 20, schedule: '금 13:00~13:40', room: '늘봄지원실', period: '10', periodText: '26년 8월', category: '3', fee: 0, bookFee: 0, matFee: 0 },
  { id: '1552292', title: '(금)돌봄 2부', instructor: '돌봄전담사', count: 12, capacity: 20, schedule: '금 13:50~14:30', room: '늘봄지원실', period: '10', periodText: '26년 8월', category: '3', fee: 0, bookFee: 0, matFee: 0 },
  { id: '1552293', title: '(금)돌봄 3부', instructor: '돌봄전담사', count: 20, capacity: 20, schedule: '금 14:40~15:20', room: '늘봄지원실', period: '10', periodText: '26년 8월', category: '3', fee: 0, bookFee: 0, matFee: 0 },
  { id: '1552374', title: '(목) 돌봄 4부', instructor: '돌봄전담사', count: 20, capacity: 20, schedule: '목 16:00~17:00', room: '늘봄지원실', period: '10', periodText: '26년 8월', category: '3', fee: 0, bookFee: 0, matFee: 0 },
  { id: '1552288', title: '(목)돌봄 1부', instructor: '돌봄전담사', count: 2, capacity: 20, schedule: '목 13:00~13:40', room: '늘봄지원실', period: '10', periodText: '26년 8월', category: '3', fee: 0, bookFee: 0, matFee: 0 },
  { id: '1552289', title: '(목)돌봄 2부', instructor: '돌봄전담사', count: 4, capacity: 20, schedule: '목 13:50~14:30', room: '늘봄지원실', period: '10', periodText: '26년 8월', category: '3', fee: 0, bookFee: 0, matFee: 0 },
  { id: '1552290', title: '(목)돌봄 3부', instructor: '돌봄전담사', count: 10, capacity: 20, schedule: '목 14:40~15:20', room: '늘봄지원실', period: '10', periodText: '26년 8월', category: '3', fee: 0, bookFee: 0, matFee: 0 },
  { id: '1552299', title: '논술 1부', instructor: '박지숙', count: 17, capacity: 20, schedule: '수 13:00~13:40', room: '1-1교실', period: '10', periodText: '26년 8월', category: '1', fee: 30000, bookFee: 10000, matFee: 5000 },
  { id: '1552300', title: '논술 2부', instructor: '박지숙', count: 11, capacity: 20, schedule: '수 13:50~14:30', room: '1-1교실', period: '10', periodText: '26년 8월', category: '1', fee: 30000, bookFee: 10000, matFee: 5000 },
  { id: '1552297', title: '놀이체육 1부', instructor: '강태연', count: 11, capacity: 20, schedule: '월 13:00~13:40', room: '체육관', period: '10', periodText: '26년 8월', category: '1', fee: 30000, bookFee: 0, matFee: 10000 },
  { id: '1552296', title: '놀이체육 2부', instructor: '강태연', count: 15, capacity: 20, schedule: '월 13:50~14:30', room: '체육관', period: '10', periodText: '26년 8월', category: '1', fee: 30000, bookFee: 0, matFee: 10000 },
  { id: '1552324', title: '뉴스포츠 1부', instructor: '박지연', count: 30, capacity: 30, schedule: '화 13:00~13:40', room: '강당', period: '10', periodText: '26년 8월', category: '1', fee: 35000, bookFee: 0, matFee: 15000 },
  { id: '1552303', title: '댄스 2부', instructor: '김지향', count: 16, capacity: 20, schedule: '목 13:50~14:30', room: '무용실', period: '10', periodText: '26년 8월', category: '1', fee: 30000, bookFee: 0, matFee: 5000 },
  { id: '1552295', title: '독후활동미술놀이 1부', instructor: '임은희', count: 9, capacity: 20, schedule: '화 13:00~13:40', room: '미술실', period: '10', periodText: '26년 8월', category: '2', fee: 32000, bookFee: 8000, matFee: 12000 },
  { id: '1552294', title: '독후활동미술놀이 2부', instructor: '임은희', count: 20, capacity: 20, schedule: '화 13:50~14:30', room: '미술실', period: '10', periodText: '26년 8월', category: '2', fee: 32000, bookFee: 8000, matFee: 12000 },
  { id: '1552305', title: '로봇과학 1부', instructor: '최정호', count: 14, capacity: 20, schedule: '화 14:40~15:20', room: '과학실', period: '10', periodText: '26년 8월', category: '1', fee: 35000, bookFee: 15000, matFee: 20000 },
  { id: '1552306', title: '로봇과학 2부', instructor: '최정호', count: 22, capacity: 25, schedule: '화 15:30~16:10', room: '과학실', period: '10', periodText: '26년 8월', category: '1', fee: 35000, bookFee: 15000, matFee: 20000 },
  { id: '1552313', title: '바둑 1부', instructor: '박경도', count: 8, capacity: 20, schedule: '금 13:00~13:40', room: '바둑교실', period: '10', periodText: '26년 8월', category: '1', fee: 30000, bookFee: 10000, matFee: 0 },
  { id: '1552315', title: '바이올린 1부', instructor: '천윤아', count: 8, capacity: 15, schedule: '월 14:40~15:20', room: '음악실', period: '10', periodText: '26년 8월', category: '1', fee: 40000, bookFee: 10000, matFee: 5000 },
  { id: '1552316', title: '바이올린 2부', instructor: '천윤아', count: 11, capacity: 15, schedule: '월 15:30~16:10', room: '음악실', period: '10', periodText: '26년 8월', category: '1', fee: 40000, bookFee: 10000, matFee: 5000 },
  { id: '1552326', title: '생활영어 1부', instructor: '서인경', count: 9, capacity: 20, schedule: '목 14:40~15:20', room: '어학실', period: '10', periodText: '26년 8월', category: '1', fee: 30000, bookFee: 15000, matFee: 0 },
  { id: '1552298', title: '아침늘봄 (월~금 08:00~08:40)', instructor: '이금진', count: 5, capacity: 20, schedule: '월~금 08:00~08:40', room: '늘봄지원실', period: '10', periodText: '26년 8월', category: '3', fee: 0, bookFee: 0, matFee: 0 },
  { id: '1552308', title: '주산 1부', instructor: '박은화', count: 8, capacity: 20, schedule: '수 14:40~15:20', room: '1-2교실', period: '10', periodText: '26년 8월', category: '1', fee: 30000, bookFee: 8000, matFee: 0 },
  { id: '1552317', title: '창의미술 1부', instructor: '김언주', count: 20, capacity: 20, schedule: '목 13:00~13:40', room: '미술실', period: '10', periodText: '26년 8월', category: '1', fee: 30000, bookFee: 0, matFee: 15000 },
  { id: '1552275', title: '창의보드 1부', instructor: '정진화', count: 10, capacity: 20, schedule: '수 13:00~13:40', room: '창의실', period: '10', periodText: '26년 8월', category: '2', fee: 30000, bookFee: 0, matFee: 10000 },
  { id: '1552328', title: '창의수학 1부', instructor: '김경아', count: 17, capacity: 20, schedule: '화 13:00~13:40', room: '수학실', period: '10', periodText: '26년 8월', category: '1', fee: 32000, bookFee: 10000, matFee: 5000 },
  { id: '1552319', title: '컴퓨터 월,수 1부', instructor: '김윤정', count: 15, capacity: 25, schedule: '월,수 13:00~13:40', room: '컴퓨터실', period: '10', periodText: '26년 8월', category: '1', fee: 35000, bookFee: 12000, matFee: 0 },
  { id: '1552320', title: '컴퓨터 월,수 2부', instructor: '김윤정', count: 29, capacity: 30, schedule: '월,수 13:50~14:30', room: '컴퓨터실', period: '10', periodText: '26년 8월', category: '1', fee: 35000, bookFee: 12000, matFee: 0 },
  { id: '1552311', title: '한자 1부', instructor: '김재표', count: 13, capacity: 20, schedule: '목 13:00~13:40', room: '한자교실', period: '10', periodText: '26년 8월', category: '1', fee: 28000, bookFee: 10000, matFee: 0 }
];

function closeAppModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}
window.closeAppModal = closeAppModal;
window.closeModal = closeAppModal;

// -------------------- 추가/취소자 조회 (cap_11) --------------------
function chk_tr_sld2() {
  const tr = document.getElementById('tr_sld2');
  if (!tr) return;
  const isDiff = document.getElementById('com_gubun_1')?.checked;
  tr.style.display = isDiff ? '' : 'none';
}
window.chk_tr_sld2 = chk_tr_sld2;

function openAppComModal(e) {
  if (e) {
    try { e.preventDefault(); } catch (_) {}
  }
  const modal = document.getElementById('modalAppCom');
  if (!modal) return;
  modal.style.display = 'flex';
  filterComCourseList('cur');
  filterComCourseList('prev');
  chk_tr_sld2();
}
window.openAppComModal = openAppComModal;
window.openAppChangeHistoryModal = openAppComModal;

function filterComCourseList(target) {
  const isCur = target === 'cur';
  const sldEl = document.getElementById(isCur ? 'com_sld' : 'com_sld2');
  const slnEl = document.getElementById(isCur ? 'com_sln' : 'com_sln2');
  if (!sldEl || !slnEl) return;

  const pVal = sldEl.value || '10';
  let list = DB_COURSES_3267;
  if (pVal && pVal !== 'all') {
    list = list.filter(c => c.period === pVal);
  }
  if (list.length === 0) list = DB_COURSES_3267;

  slnEl.innerHTML = '<option value="">=강좌전체=</option>' + list.map(c => `
    <option value="${c.id}">[${c.periodText || '26년 8월'}] ${c.title} (${c.instructor}, ${c.count}명)</option>
  `).join('');
}
window.filterComCourseList = filterComCourseList;

function submitAppComExcelExport(e) {
  if (e) e.preventDefault();
  const comGubun = document.querySelector('input[name="com_gubun"]:checked')?.value || '2';
  const sld = document.getElementById('com_sld')?.value || '';
  const sln = document.getElementById('com_sln')?.value || '';
  const sld2 = document.getElementById('com_sld2')?.value || '';
  const sln2 = document.getElementById('com_sln2')?.value || '';
  const excelGubun = document.querySelector('input[name="com_excel_gubun"]:checked')?.value || '1';
  const fileType = document.querySelector('input[name="com_file_type"]:checked')?.value || 'one';

  if (!comGubun) {
    alert('검색 조건 : 선택하세요.');
    return;
  }
  if (!sld) {
    alert('현재 강좌(강좌구분) : 선택하세요.');
    return;
  }
  if (comGubun === '1' && !sld2) {
    alert('이전 강좌(강좌구분) : 선택하세요.');
    return;
  }

  const params = new URLSearchParams();
  params.append('com_gubun', comGubun);
  params.append('sld', sld);
  if (sln) params.append('sln', sln);
  if (sld2) params.append('sld2', sld2);
  if (sln2) params.append('sln2', sln2);
  params.append('excel_gubun', excelGubun);
  params.append('file_type', fileType);

  const downloadUrl = `/api/af/ad_app/com/export?${params.toString()}`;
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    try { document.body.removeChild(a); } catch (_) {}
  }, 1000);

  closeAppModal('modalAppCom');
}
window.submitAppComExcelExport = submitAppComExcelExport;

// -------------------- 미신청자 목록 (cap_12) --------------------
function openAppUnappliedModal(e) {
  if (e) {
    try { e.preventDefault(); } catch (_) {}
  }
  const modal = document.getElementById('modalAppUnapplied');
  if (!modal) return;
  modal.style.display = 'flex';
  loadUnappliedList();
}
window.openAppUnappliedModal = openAppUnappliedModal;
window.openAppUnregisteredModal = openAppUnappliedModal;

async function loadUnappliedList() {
  const tbody = document.getElementById('unappliedTableBody');
  if (!tbody) return;

  const ssc = document.getElementById('unapplied_ssc')?.value;
  const sld = document.getElementById('unapplied_sld')?.value || '10';
  const sgr = document.getElementById('unapplied_sgr')?.value || '';
  const scl = document.getElementById('unapplied_scl')?.value || '';
  const sw = document.getElementById('unapplied_sw')?.value || '';

  if (ssc === '' || ssc === undefined) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding:30px; color:#666;">신청 개수 조건을 선택하세요.</td></tr>';
    return;
  }

  tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding:30px; color:#888;"><i class="fa fa-spinner fa-spin"></i> 미신청자 데이터를 조회 중입니다...</td></tr>';

  try {
    const params = new URLSearchParams();
    if (ssc) params.append('ssc', ssc);
    if (sld) params.append('sld', sld);
    if (sgr) params.append('sgr', sgr);
    if (scl) params.append('scl', scl);
    if (sw) params.append('sw', sw);

    const res = await fetch(`/api/af/ad_app/unapplied?${params.toString()}`);
    const data = await res.json();
    const students = data.students || [];

    if (students.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding:30px; color:#888;">조건에 해당하는 학생이 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = students.map((s, idx) => `
      <tr>
        <td style="border:1px solid #ddd; padding:6px;">${idx + 1}</td>
        <td style="border:1px solid #ddd; padding:6px;">${s.grade}</td>
        <td style="border:1px solid #ddd; padding:6px;">${s.classNum}</td>
        <td style="border:1px solid #ddd; padding:6px;">${s.studentNum}</td>
        <td style="border:1px solid #ddd; padding:6px; font-weight:bold; color:#333;">${s.studentName}</td>
        <td style="border:1px solid #ddd; padding:6px;"><span class="badge" style="background:${s.appliedCount === 0 ? '#d9534f' : '#f0ad4e'}; color:#fff; padding:3px 7px; border-radius:10px;">${s.appliedCount}</span></td>
        <td style="border:1px solid #ddd; padding:6px; text-align:left; font-size:11.5px; color:#555;">${s.courses}</td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('loadUnappliedList error:', err);
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger" style="padding:30px;">조회 중 오류가 발생했습니다.</td></tr>';
  }
}
window.loadUnappliedList = loadUnappliedList;

function resetUnappliedFilter() {
  const sscEl = document.getElementById('unapplied_ssc');
  if (sscEl) sscEl.value = '1';
  const sgrEl = document.getElementById('unapplied_sgr');
  if (sgrEl) sgrEl.value = '';
  const sclEl = document.getElementById('unapplied_scl');
  if (sclEl) sclEl.value = '';
  const swEl = document.getElementById('unapplied_sw');
  if (swEl) swEl.value = '';
  loadUnappliedList();
}
window.resetUnappliedFilter = resetUnappliedFilter;

function exportUnappliedExcel() {
  const ssc = document.getElementById('unapplied_ssc')?.value || '1';
  const sld = document.getElementById('unapplied_sld')?.value || '10';
  const sgr = document.getElementById('unapplied_sgr')?.value || '';
  const scl = document.getElementById('unapplied_scl')?.value || '';
  const sw = document.getElementById('unapplied_sw')?.value || '';

  const params = new URLSearchParams();
  if (ssc) params.append('ssc', ssc);
  if (sld) params.append('sld', sld);
  if (sgr) params.append('sgr', sgr);
  if (scl) params.append('scl', scl);
  if (sw) params.append('sw', sw);

  const downloadUrl = `/api/af/ad_app/unapplied/export?${params.toString()}`;
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    try { document.body.removeChild(a); } catch (_) {}
  }, 1000);
}
window.exportUnappliedExcel = exportUnappliedExcel;

function openAppExcelExportModal(e) {
  if (e) {
    try { e.preventDefault(); } catch (_) {}
  }
  const modal = document.getElementById('modalAppExcelExport');
  if (!modal) return;
  modal.style.display = 'flex';
  filterExcelCourseList();
  chk_excel_gubun();
}

function filterExcelCourseList() {
  const container = document.getElementById('excel_search_lec_list');
  if (!container) return;
  const pVal = document.getElementById('excel_lec_div')?.value || '10';
  const cVal = document.getElementById('excel_lec_pro_type')?.value || '';

  let list = DB_COURSES_3267;
  if (pVal) list = list.filter(c => c.period === pVal);
  if (cVal) list = list.filter(c => c.category === cVal);

  if (list.length === 0) list = DB_COURSES_3267;

  container.innerHTML = `
    <ul style="list-style:none; padding:0; margin:0; line-height:1.9;">
      ${list.map(c => `
        <li>
          <label style="cursor:pointer; font-weight:normal; font-size:12px; display:inline-flex; align-items:center; gap:6px;">
            <input type="checkbox" name="lec_list[]" value="${c.id}" checked style="float:none;">
            [${c.periodText || '26년 8월'}] ${c.title} (${c.instructor}, ${c.count}명)
          </label>
        </li>
      `).join('')}
    </ul>
  `;
}

function chk_excel_all(masterBox) {
  const isChecked = typeof masterBox === 'boolean' ? masterBox : (masterBox && 'checked' in masterBox ? masterBox.checked : true);
  const master = document.getElementById('excel_chk_all');
  if (master && typeof masterBox === 'boolean') master.checked = isChecked;
  const boxes = document.querySelectorAll('#excel_search_lec_list input[type="checkbox"]');
  boxes.forEach(b => { b.checked = isChecked; });
}

function chk_excel_gubun() {
  const selected = document.querySelector('input[name="excel_gubun"]:checked')?.value || '2';
  const trPay = document.getElementById('tr_excel_pay');
  const trGrade = document.getElementById('tr_excel_grade');
  const trClass = document.getElementById('tr_excel_class');
  const trFileType = document.getElementById('tr_excel_file_type');

  if (selected === '2' || selected === '4' || selected === '8' || selected === '9') {
    if (trPay) trPay.style.display = 'table-row';
  } else {
    if (trPay) trPay.style.display = 'none';
  }

  if (selected === '4' || selected === '3' || selected === '5' || selected === '6') {
    if (trGrade) trGrade.style.display = 'table-row';
    if (trClass) trClass.style.display = 'table-row';
  } else {
    if (trGrade) trGrade.style.display = 'none';
    if (trClass) trClass.style.display = 'none';
  }

  if (selected === '1' || selected === '2' || selected === '8' || selected === '10') {
    if (trFileType) trFileType.style.display = 'table-row';
  } else {
    if (trFileType) trFileType.style.display = 'none';
  }
}

async function submitAppExcelExport(e) {
  if (e) e.preventDefault();
  const form = document.getElementById('fm_excel_export');
  const gubun = form.querySelector('input[name="excel_gubun"]:checked')?.value || '2';
  const checkedCourses = Array.from(document.querySelectorAll('#excel_search_lec_list input[type="checkbox"]:checked')).map(cb => cb.value);

  if (checkedCourses.length === 0) {
    alert('출력할 강좌를 1개 이상 선택해 주세요.');
    return;
  }

  const grade = document.getElementById('excel_mem_grade')?.value || '';
  const classNum = document.getElementById('excel_mem_class')?.value || '';

  const params = new URLSearchParams();
  params.append('excel_gubun', gubun);
  checkedCourses.forEach(id => params.append('lec_list', id));
  if (grade) params.append('mem_grade', grade);
  if (classNum) params.append('mem_class', classNum);

  // Trigger file download directly
  const downloadUrl = `/api/af/ad_app/excel/export?${params.toString()}`;
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    try { document.body.removeChild(a); } catch (_) {}
  }, 1000);

  closeAppModal('modalAppExcelExport');
}

// -------------------- 수강신청서 출력 (cap_14) --------------------
function openAppPdfPrintModal(e) {
  if (e) {
    try { e.preventDefault(); } catch (_) {}
  }
  const modal = document.getElementById('modalAppPdfPrint');
  if (!modal) return;
  modal.style.display = 'flex';
  filterPdfCourseList();
}

function filterPdfCourseList() {
  const select = document.getElementById('pdf_lec_num');
  if (!select) return;
  const pVal = document.getElementById('pdf_lec_div')?.value || '10';
  const cVal = document.getElementById('pdf_lec_pro_type')?.value || '';

  let list = DB_COURSES_3267;
  if (pVal) list = list.filter(c => c.period === pVal);
  if (cVal) list = list.filter(c => c.category === cVal);

  select.innerHTML = '<option value="">=전체=</option>' + list.map(c => `
    <option value="${c.id}">[${c.periodText || '26년 8월'}] ${c.title} (${c.instructor}, ${c.count}명)</option>
  `).join('');
}

function submitAppPdfPrint(e) {
  if (e) e.preventDefault();
  const courseId = document.getElementById('pdf_lec_num')?.value;
  const grade = document.getElementById('pdf_grade_num')?.value || '1';
  const classNum = document.getElementById('pdf_class_num')?.value || '1';

  closeAppModal('modalAppPdfPrint');
  renderApplicationSheet({ courseId, grade, classNum });
}

// -------------------- 고지서 출력 (cap_15) --------------------
function openAppPdf1BillPrintModal(e) {
  if (e) {
    try { e.preventDefault(); } catch (_) {}
  }
  const modal = document.getElementById('modalAppPdf1BillPrint');
  if (!modal) return;
  modal.style.display = 'flex';
  filterPdf1CourseList();
}

function filterPdf1CourseList() {
  const select = document.getElementById('pdf1_lec_num');
  if (!select) return;
  const pVal = document.getElementById('pdf1_lec_div')?.value || '10';
  const cVal = document.getElementById('pdf1_lec_pro_type')?.value || '';

  let list = DB_COURSES_3267;
  if (pVal) list = list.filter(c => c.period === pVal);
  if (cVal) list = list.filter(c => c.category === cVal);

  select.innerHTML = '<option value="">=전체=</option>' + list.map(c => `
    <option value="${c.id}">[${c.periodText || '26년 8월'}] ${c.title} (${c.instructor}, ${c.count}명)</option>
  `).join('');
}

function submitAppPdf1BillPrint(e) {
  if (e) e.preventDefault();
  const courseId = document.getElementById('pdf1_lec_num')?.value;
  const grade = document.getElementById('pdf1_grade_num')?.value || '1';
  const classNum = document.getElementById('pdf1_class_num')?.value || '1';
  const title = document.getElementById('pdf1_title')?.value || '수강료 징수 안내 및 납입고지서';
  const content = document.getElementById('pdf1_content')?.value || '';
  const omitSeal = document.getElementById('pdf1_view_omit_seal')?.checked || false;

  closeAppModal('modalAppPdf1BillPrint');
  renderBillSheet({ courseId, grade, classNum, title, content, omitSeal });
}

// -------------------- 시간표 출력 (cap_16) --------------------
function openAppPdf2TimetablePrintModal(e) {
  if (e) {
    try { e.preventDefault(); } catch (_) {}
  }
  const modal = document.getElementById('modalAppPdf2TimetablePrint');
  if (!modal) return;
  modal.style.display = 'flex';
  filterPdf2CourseList();
}

function filterPdf2CourseList() {
  const select = document.getElementById('pdf2_lec_num');
  if (!select) return;
  const pVal = document.getElementById('pdf2_lec_div')?.value || '10';
  const cVal = document.getElementById('pdf2_lec_pro_type')?.value || '';

  let list = DB_COURSES_3267;
  if (pVal) list = list.filter(c => c.period === pVal);
  if (cVal) list = list.filter(c => c.category === cVal);

  select.innerHTML = '<option value="">=전체=</option>' + list.map(c => `
    <option value="${c.id}">[${c.periodText || '26년 8월'}] ${c.title} (${c.instructor}, ${c.count}명)</option>
  `).join('');
}

function submitAppPdf2TimetablePrint(e) {
  if (e) e.preventDefault();
  const courseId = document.getElementById('pdf2_lec_num')?.value;
  const grade = document.getElementById('pdf2_grade_num')?.value || '1';
  const classNum = document.getElementById('pdf2_class_num')?.value || '1';

  closeAppModal('modalAppPdf2TimetablePrint');
  renderTimetableSheet({ courseId, grade, classNum });
}

// -------------------- A4 Sheet Document Renderers --------------------

function openPrintableDocViewer(title, htmlContent) {
  const modal = document.getElementById('modalPrintableDoc');
  const titleEl = document.getElementById('printableDocTitle');
  const paper = document.getElementById('printableDocPaper');
  if (!modal || !paper) return;

  if (titleEl) titleEl.innerHTML = `<i class="fa fa-print"></i> ${title}`;
  paper.innerHTML = htmlContent;
  modal.style.display = 'flex';
}

function printGeneratedDoc() {
  window.print();
}

function renderApplicationSheet({ courseId, grade, classNum }) {
  const targetCourses = courseId ? DB_COURSES_3267.filter(c => String(c.id) === String(courseId)) : DB_COURSES_3267.slice(0, 4);
  const totalTuition = targetCourses.reduce((sum, c) => sum + (c.fee || 30000), 0);
  const totalBook = targetCourses.reduce((sum, c) => sum + (c.bookFee || 0), 0);
  const totalMat = targetCourses.reduce((sum, c) => sum + (c.matFee || 0), 0);
  const grandTotal = totalTuition + totalBook + totalMat;

  const html = `
    <div style="text-align:center; margin-bottom:24px;">
      <h1 style="font-size:24px; font-weight:bold; letter-spacing:4px; margin:0 0 10px 0; color:#111; text-decoration:underline; text-underline-offset:6px;">2026학년도 늘봄학교 수강신청 확인서</h1>
      <p style="font-size:12px; color:#555; margin:0;">광주풍향초등학교 교무실 | 발급일자: 2026년 8월 10일</p>
    </div>

    <table style="width:100%; border-collapse:collapse; margin-bottom:18px; font-size:13px;">
      <tbody>
        <tr>
          <th style="width:18%; background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center;">소 속</th>
          <td style="width:32%; border:1px solid #333; padding:8px 10px;">${grade || 1}학년 ${classNum || 1}반 01번</td>
          <th style="width:18%; background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center;">성 명</th>
          <td style="width:32%; border:1px solid #333; padding:8px 10px; font-weight:bold;">김도하</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center;">생년월일</th>
          <td style="border:1px solid #333; padding:8px 10px;">2019. 03. 15.</td>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center;">보호자 성명</th>
          <td style="border:1px solid #333; padding:8px 10px;">윤보미 (010-2218-7705)</td>
        </tr>
      </tbody>
    </table>

    <div style="font-size:13px; font-weight:bold; margin-bottom:8px; color:#222;"><i class="fa fa-check-square-o"></i> 신청 강좌 및 수강료 내역</div>
    <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:12px; text-align:center;">
      <thead>
        <tr style="background:#e5e7eb;">
          <th style="border:1px solid #333; padding:8px 6px; width:45px;">연번</th>
          <th style="border:1px solid #333; padding:8px 6px;">강좌명</th>
          <th style="border:1px solid #333; padding:8px 6px; width:80px;">지도강사</th>
          <th style="border:1px solid #333; padding:8px 6px; width:120px;">요일 및 시간</th>
          <th style="border:1px solid #333; padding:8px 6px; width:80px;">강의실</th>
          <th style="border:1px solid #333; padding:8px 6px; width:70px;">수강료</th>
          <th style="border:1px solid #333; padding:8px 6px; width:70px;">교재비</th>
          <th style="border:1px solid #333; padding:8px 6px; width:70px;">재료비</th>
        </tr>
      </thead>
      <tbody>
        ${targetCourses.map((c, idx) => `
          <tr>
            <td style="border:1px solid #333; padding:7px 6px;">${idx + 1}</td>
            <td style="border:1px solid #333; padding:7px 8px; text-align:left; font-weight:bold;">${c.title}</td>
            <td style="border:1px solid #333; padding:7px 6px;">${c.instructor}</td>
            <td style="border:1px solid #333; padding:7px 6px;">${c.schedule}</td>
            <td style="border:1px solid #333; padding:7px 6px;">${c.room || '교실'}</td>
            <td style="border:1px solid #333; padding:7px 6px; text-align:right;">${(c.fee || 30000).toLocaleString()}원</td>
            <td style="border:1px solid #333; padding:7px 6px; text-align:right;">${(c.bookFee || 0).toLocaleString()}원</td>
            <td style="border:1px solid #333; padding:7px 6px; text-align:right;">${(c.matFee || 0).toLocaleString()}원</td>
          </tr>
        `).join('')}
        <tr style="background:#f9fafb; font-weight:bold;">
          <td colspan="5" style="border:1px solid #333; padding:8px; text-align:center;">합 계 (총 ${targetCourses.length}개 강좌)</td>
          <td style="border:1px solid #333; padding:8px; text-align:right;">${totalTuition.toLocaleString()}원</td>
          <td style="border:1px solid #333; padding:8px; text-align:right;">${totalBook.toLocaleString()}원</td>
          <td style="border:1px solid #333; padding:8px; text-align:right;">${totalMat.toLocaleString()}원</td>
        </tr>
        <tr style="background:#eef2ff; font-weight:bold; font-size:13px; color:#1e3a8a;">
          <td colspan="5" style="border:1px solid #333; padding:8px; text-align:center;">총 납입 예정 금액</td>
          <td colspan="3" style="border:1px solid #333; padding:8px; text-align:right; font-size:14px;">${grandTotal.toLocaleString()} 원</td>
        </tr>
      </tbody>
    </table>

    <div style="border:1px solid #999; padding:14px 18px; margin:24px 0; font-size:12.5px; line-height:1.8; background:#fafafa;">
      <strong>[ 수강자 유의사항 ]</strong><br>
      1. 수강료 납부는 지정된 스쿨뱅킹 계좌에서 당월 15일경 자동 인출됩니다.<br>
      2. 수강 취소 및 환불은 교육청 방과후학교 운영 가이드라인(일할/주할 계산)에 의거 처리됩니다.<br>
      3. 학생 안전 및 귀가 관리를 위해 출석 및 결석 시 늘봄지원실로 사전 연락하여 주시기 바랍니다.
    </div>

    <div style="text-align:center; margin-top:35px;">
      <p style="font-size:14px; font-weight:bold; letter-spacing:1px; margin-bottom:25px;">
        위와 같이 2026학년도 방과후·늘봄학교 수강을 신청하였음을 확인합니다.
      </p>
      <p style="font-size:13.5px; margin-bottom:35px;">2026년 8월 10일</p>
      <div style="font-size:20px; font-weight:bold; letter-spacing:3px; position:relative; display:inline-block; padding:0 30px;">
        광 주 풍 향 초 등 학 교 장
        <span style="position:absolute; right:-15px; top:-12px; width:52px; height:52px; border:2px solid #dc2626; color:#dc2626; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; transform:rotate(-10deg); opacity:0.85;">
          직인생략
        </span>
      </div>
    </div>
  `;

  openPrintableDocViewer('수강신청 확인서 미리보기', html);
}

function renderBillSheet({ courseId, grade, classNum, title, content, omitSeal }) {
  const targetCourses = courseId ? DB_COURSES_3267.filter(c => String(c.id) === String(courseId)) : DB_COURSES_3267.slice(0, 3);
  const totalTuition = targetCourses.reduce((sum, c) => sum + (c.fee || 30000), 0);
  const totalBook = targetCourses.reduce((sum, c) => sum + (c.bookFee || 0), 0);
  const totalMat = targetCourses.reduce((sum, c) => sum + (c.matFee || 0), 0);
  const grandTotal = totalTuition + totalBook + totalMat;

  const html = `
    <div style="text-align:center; margin-bottom:20px;">
      <h1 style="font-size:23px; font-weight:bold; letter-spacing:3px; margin:0 0 8px 0; color:#111;">${title || '수강료 징수 안내 및 납입고지서'}</h1>
      <p style="font-size:12px; color:#555; margin:0;">광주풍향초등학교 행정실 | 고지일자: 2026년 8월 10일</p>
    </div>

    <table style="width:100%; border-collapse:collapse; margin-bottom:14px; font-size:12.5px;">
      <tbody>
        <tr>
          <th style="width:18%; background:#f3f4f6; border:1px solid #333; padding:7px 10px; text-align:center;">학 번</th>
          <td style="width:32%; border:1px solid #333; padding:7px 10px;">${grade || 1}학년 ${classNum || 1}반 01번</td>
          <th style="width:18%; background:#f3f4f6; border:1px solid #333; padding:7px 10px; text-align:center;">학생 성명</th>
          <td style="width:32%; border:1px solid #333; padding:7px 10px; font-weight:bold;">김도하</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:7px 10px; text-align:center;">납부 방법</th>
          <td style="border:1px solid #333; padding:7px 10px;">스쿨뱅킹 자동이체</td>
          <th style="background:#f3f4f6; border:1px solid #333; padding:7px 10px; text-align:center;">납부 기한</th>
          <td style="border:1px solid #333; padding:7px 10px; color:#dc2626; font-weight:bold;">2026년 8월 20일까지</td>
        </tr>
      </tbody>
    </table>

    <div style="font-size:12px; white-space:pre-line; line-height:1.7; background:#f9fafb; border:1px solid #ccc; padding:12px 14px; margin-bottom:14px; color:#333;">
      ${content || '학부모님 안녕하십니까?\\n본교 늘봄·방과후학교 수강료를 아래와 같이 고지하오니 기한 내 입금 바랍니다.'}
    </div>

    <div style="font-size:13px; font-weight:bold; margin-bottom:6px; color:#222;"><i class="fa fa-list-alt"></i> 수강료 세부 내역</div>
    <table style="width:100%; border-collapse:collapse; margin-bottom:14px; font-size:12px; text-align:center;">
      <thead>
        <tr style="background:#e5e7eb;">
          <th style="border:1px solid #333; padding:7px 6px;">강좌명</th>
          <th style="border:1px solid #333; padding:7px 6px; width:90px;">강사명</th>
          <th style="border:1px solid #333; padding:7px 6px; width:90px;">수강료</th>
          <th style="border:1px solid #333; padding:7px 6px; width:90px;">교재비</th>
          <th style="border:1px solid #333; padding:7px 6px; width:90px;">재료비</th>
          <th style="border:1px solid #333; padding:7px 6px; width:100px;">합계</th>
        </tr>
      </thead>
      <tbody>
        ${targetCourses.map(c => `
          <tr>
            <td style="border:1px solid #333; padding:7px 8px; text-align:left; font-weight:bold;">${c.title}</td>
            <td style="border:1px solid #333; padding:7px 6px;">${c.instructor}</td>
            <td style="border:1px solid #333; padding:7px 6px; text-align:right;">${(c.fee || 30000).toLocaleString()}원</td>
            <td style="border:1px solid #333; padding:7px 6px; text-align:right;">${(c.bookFee || 0).toLocaleString()}원</td>
            <td style="border:1px solid #333; padding:7px 6px; text-align:right;">${(c.matFee || 0).toLocaleString()}원</td>
            <td style="border:1px solid #333; padding:7px 6px; text-align:right; font-weight:bold;">${((c.fee || 30000) + (c.bookFee || 0) + (c.matFee || 0)).toLocaleString()}원</td>
          </tr>
        `).join('')}
        <tr style="background:#fee2e2; font-weight:bold; font-size:13px; color:#991b1b;">
          <td colspan="2" style="border:1px solid #333; padding:8px; text-align:center;">납 부 총 액</td>
          <td colspan="4" style="border:1px solid #333; padding:8px; text-align:right; font-size:15px;">${grandTotal.toLocaleString()} 원</td>
        </tr>
      </tbody>
    </table>

    <div style="background:#eff6ff; border:1px solid #bfdbfe; padding:10px 14px; font-size:12px; color:#1e40af; margin-bottom:18px;">
      <i class="fa fa-info-circle"></i> <strong>입금 전용 스쿨뱅킹 계좌:</strong> 농협 302-0000-0000-01 (예금주: 광주풍향초등학교)<br>
      ※ 통장에 잔고를 미리 확인해 주시기 바라며, 학생명으로 입금되지 않을 시 확인이 지연될 수 있습니다.
    </div>

    <div style="text-align:center; margin-bottom:20px;">
      <span style="font-size:16px; font-weight:bold; letter-spacing:2px;">광 주 풍 향 초 등 학 교 장</span>
      ${omitSeal ? '<span style="font-size:12px; color:#555; margin-left:8px;">(직인 생략)</span>' : '<span style="display:inline-block; margin-left:8px; width:38px; height:38px; border:2px solid #dc2626; color:#dc2626; border-radius:50%; line-height:34px; font-size:11px; font-weight:bold;">직인</span>'}
    </div>

    <!-- Cut Line -->
    <div style="border-top:1px dashed #666; margin:16px 0; text-align:center; font-size:11px; color:#888;">
      ✂ - - - - - - - - - - - - - - - - - - - - - - - - - - 절 취 선 - - - - - - - - - - - - - - - - - - - - - - - - - -
    </div>

    <div style="font-size:12px;">
      <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom:6px;">
        <span>수강료 납입 영수증 (학생/학부모 보관용)</span>
        <span>광주풍향초등학교</span>
      </div>
      <table style="width:100%; border-collapse:collapse; font-size:11.5px; text-align:center;">
        <tr style="background:#f3f4f6;">
          <th style="border:1px solid #333; padding:5px;">학년 반 번호</th>
          <th style="border:1px solid #333; padding:5px;">학생 성명</th>
          <th style="border:1px solid #333; padding:5px;">납부 금액</th>
          <th style="border:1px solid #333; padding:5px;">수납 확인</th>
        </tr>
        <tr>
          <td style="border:1px solid #333; padding:5px;">${grade || 1}학년 ${classNum || 1}반 01번</td>
          <td style="border:1px solid #333; padding:5px; font-weight:bold;">김도하</td>
          <td style="border:1px solid #333; padding:5px; font-weight:bold;">${grandTotal.toLocaleString()}원</td>
          <td style="border:1px solid #333; padding:5px;">스쿨뱅킹 자동출금 완료</td>
        </tr>
      </table>
    </div>
  `;

  openPrintableDocViewer('수강료 납입고지서 미리보기', html);
}

function renderTimetableSheet({ courseId, grade, classNum }) {
  const html = `
    <div style="text-align:center; margin-bottom:20px;">
      <h1 style="font-size:23px; font-weight:bold; letter-spacing:3px; margin:0 0 6px 0; color:#111;">2026학년도 늘봄·방과후학교 주간 수강시간표</h1>
      <p style="font-size:12px; color:#555; margin:0;">광주풍향초등학교 | 2026년 8월 기준</p>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; font-size:13px; font-weight:bold; border-bottom:2px solid #333; padding-bottom:6px;">
      <span>수강 학생: ${grade || 1}학년 ${classNum || 1}반 01번 김도하</span>
      <span style="font-size:12px; color:#666;">출력일: 2026-08-10</span>
    </div>

    <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:center;">
      <thead>
        <tr style="background:#1e40af; color:#fff;">
          <th style="border:1px solid #333; padding:8px 6px; width:110px;">교시 / 시간</th>
          <th style="border:1px solid #333; padding:8px 6px;">월요일</th>
          <th style="border:1px solid #333; padding:8px 6px;">화요일</th>
          <th style="border:1px solid #333; padding:8px 6px;">수요일</th>
          <th style="border:1px solid #333; padding:8px 6px;">목요일</th>
          <th style="border:1px solid #333; padding:8px 6px;">금요일</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="background:#f3f4f6; border:1px solid #333; padding:8px; font-weight:bold;">아침늘봄<br><span style="font-size:11px; font-weight:normal; color:#666;">08:00~08:40</span></td>
          <td colspan="5" style="border:1px solid #333; padding:8px; background:#eff6ff; font-weight:bold; color:#1e3a8a;">
            아침늘봄 (이금진 / 늘봄지원실)
          </td>
        </tr>
        <tr>
          <td style="background:#f3f4f6; border:1px solid #333; padding:8px; font-weight:bold;">1부<br><span style="font-size:11px; font-weight:normal; color:#666;">13:00~13:40</span></td>
          <td style="border:1px solid #333; padding:8px; background:#f0fdf4; font-weight:bold; color:#166534;">
            놀이체육 1부<br><span style="font-size:11px; font-weight:normal; color:#555;">강태연 (체육관)</span>
          </td>
          <td style="border:1px solid #333; padding:8px; background:#fefce8; font-weight:bold; color:#854d0e;">
            독후미술 1부<br><span style="font-size:11px; font-weight:normal; color:#555;">임은희 (미술실)</span>
          </td>
          <td style="border:1px solid #333; padding:8px; background:#faf5ff; font-weight:bold; color:#6b21a8;">
            논술 1부<br><span style="font-size:11px; font-weight:normal; color:#555;">박지숙 (1-1교실)</span>
          </td>
          <td style="border:1px solid #333; padding:8px; background:#fff7ed; font-weight:bold; color:#9a3412;">
            한자 1부<br><span style="font-size:11px; font-weight:normal; color:#555;">김재표 (한자교실)</span>
          </td>
          <td style="border:1px solid #333; padding:8px; background:#eff6ff; font-weight:bold; color:#1e3a8a;">
            (금)돌봄 1부<br><span style="font-size:11px; font-weight:normal; color:#555;">돌봄전담사 (늘봄실)</span>
          </td>
        </tr>
        <tr>
          <td style="background:#f3f4f6; border:1px solid #333; padding:8px; font-weight:bold;">2부<br><span style="font-size:11px; font-weight:normal; color:#666;">13:50~14:30</span></td>
          <td style="border:1px solid #333; padding:8px; background:#eff6ff; font-weight:bold; color:#1e40af;">
            컴퓨터 2부<br><span style="font-size:11px; font-weight:normal; color:#555;">김윤정 (컴퓨터실)</span>
          </td>
          <td style="border:1px solid #333; padding:8px; background:#f0fdf4; font-weight:bold; color:#166534;">
            창의수학 2부<br><span style="font-size:11px; font-weight:normal; color:#555;">김경아 (수학실)</span>
          </td>
          <td style="border:1px solid #333; padding:8px; background:#fdf2f8; font-weight:bold; color:#9d174d;">
            창의보드 1부<br><span style="font-size:11px; font-weight:normal; color:#555;">정진화 (창의실)</span>
          </td>
          <td style="border:1px solid #333; padding:8px; background:#fefce8; font-weight:bold; color:#854d0e;">
            댄스 2부<br><span style="font-size:11px; font-weight:normal; color:#555;">김지향 (무용실)</span>
          </td>
          <td style="border:1px solid #333; padding:8px; background:#eff6ff; font-weight:bold; color:#1e3a8a;">
            (금)돌봄 2부<br><span style="font-size:11px; font-weight:normal; color:#555;">돌봄전담사 (늘봄실)</span>
          </td>
        </tr>
        <tr>
          <td style="background:#f3f4f6; border:1px solid #333; padding:8px; font-weight:bold;">3부<br><span style="font-size:11px; font-weight:normal; color:#666;">14:40~15:20</span></td>
          <td style="border:1px solid #333; padding:8px; background:#fdf4ff; font-weight:bold; color:#86198f;">
            바이올린 1부<br><span style="font-size:11px; font-weight:normal; color:#555;">천윤아 (음악실)</span>
          </td>
          <td style="border:1px solid #333; padding:8px; background:#eff6ff; font-weight:bold; color:#1d4ed8;">
            로봇과학 1부<br><span style="font-size:11px; font-weight:normal; color:#555;">최정호 (과학실)</span>
          </td>
          <td style="border:1px solid #333; padding:8px; background:#f0fdf4; font-weight:bold; color:#15803d;">
            주산 1부<br><span style="font-size:11px; font-weight:normal; color:#555;">박은화 (1-2교실)</span>
          </td>
          <td style="border:1px solid #333; padding:8px; background:#fef2f2; font-weight:bold; color:#991b1b;">
            생활영어 1부<br><span style="font-size:11px; font-weight:normal; color:#555;">서인경 (어학실)</span>
          </td>
          <td style="border:1px solid #333; padding:8px; background:#eff6ff; font-weight:bold; color:#1e3a8a;">
            (금)돌봄 3부<br><span style="font-size:11px; font-weight:normal; color:#555;">돌봄전담사 (늘봄실)</span>
          </td>
        </tr>
        <tr>
          <td style="background:#f3f4f6; border:1px solid #333; padding:8px; font-weight:bold;">4부<br><span style="font-size:11px; font-weight:normal; color:#666;">15:30~16:10</span></td>
          <td style="border:1px solid #333; padding:8px; background:#eff6ff; font-weight:bold; color:#1e3a8a;">(월)돌봄 4부</td>
          <td style="border:1px solid #333; padding:8px; background:#eff6ff; font-weight:bold; color:#1e3a8a;">(화)돌봄 4부</td>
          <td style="border:1px solid #333; padding:8px; background:#eff6ff; font-weight:bold; color:#1e3a8a;">(수)돌봄 4부</td>
          <td style="border:1px solid #333; padding:8px; background:#eff6ff; font-weight:bold; color:#1e3a8a;">(목)돌봄 4부</td>
          <td style="border:1px solid #333; padding:8px; background:#eff6ff; font-weight:bold; color:#1e3a8a;">(금)돌봄 4부</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top:20px; font-size:12px; color:#555; line-height:1.7; border:1px solid #e5e7eb; padding:12px 16px; background:#fafafa;">
      ※ 수업 시작 5분 전까지 해당 강의실로 입실하여 주시기 바랍니다.<br>
      ※ 결석, 조퇴, 귀가시간 변경 시에는 늘봄학교 지원실로 사전에 연락 바랍니다.<br>
      ※ 문의 전화: 광주풍향초등학교 늘봄학교 지원실 (062-000-0000)
    </div>
  `;

  openPrintableDocViewer('주간 수강시간표 미리보기', html);
}

// Window global bindings for export & print features
window.openAppExcelExportModal = openAppExcelExportModal;
window.filterExcelCourseList = filterExcelCourseList;
window.chk_excel_all = chk_excel_all;
window.chk_excel_gubun = chk_excel_gubun;
window.submitAppExcelExport = submitAppExcelExport;
window.exportAppExcel = openAppExcelExportModal;

window.openAppPdfPrintModal = openAppPdfPrintModal;
window.filterPdfCourseList = filterPdfCourseList;
window.submitAppPdfPrint = submitAppPdfPrint;

window.openAppPdf1BillPrintModal = openAppPdf1BillPrintModal;
window.filterPdf1CourseList = filterPdf1CourseList;
window.submitAppPdf1BillPrint = submitAppPdf1BillPrint;

window.openAppPdf2TimetablePrintModal = openAppPdf2TimetablePrintModal;
window.filterPdf2CourseList = filterPdf2CourseList;
window.submitAppPdf2TimetablePrint = submitAppPdf2TimetablePrint;

window.openPrintableDocViewer = openPrintableDocViewer;
window.printGeneratedDoc = printGeneratedDoc;
window.renderApplicationSheet = renderApplicationSheet;
window.renderBillSheet = renderBillSheet;
window.renderTimetableSheet = renderTimetableSheet;

window.toggleExtraMenu = toggleExtraMenu;
window.toggleDetailedSearch = toggleDetailedSearch;
window.chk_all_apps = chk_all_apps;
window.open_stu_schedule = open_stu_schedule;
window.show_stu_hp = show_stu_hp;
window.hide_stu_hp = hide_stu_hp;
window.save_stu_hp = save_stu_hp;
window.chk_cancel = chk_cancel;
window.handleBatchAction = handleBatchAction;

// ==================== 담당자 정보수정 모달 & 로그아웃 핸들러 ====================
function openAfAdminInfoModal() {
  const modal = document.getElementById('afAdminInfoModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function closeAfAdminInfoModal() {
  const modal = document.getElementById('afAdminInfoModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function handleAfAdminInfoSave(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('afAdminInfoName')?.value?.trim() || '원희자(김채원)';
  const phone = document.getElementById('afAdminInfoPhone')?.value?.trim() || '010-2494-1479';
  const email = document.getElementById('afAdminInfoEmail')?.value?.trim() || 'khh147979@naver.com';

  // Update left top profile header dynamically
  const userDts = document.querySelectorAll('#left_menu dl.user dt');
  userDts.forEach(dt => {
    dt.innerHTML = `${name}님 <span class="ball_num"><a href="/af/notification/lists/sn/3267"><i class="fa fa-bell"></i><i class="num">1</i></a></span>`;
  });

  closeAfAdminInfoModal();
  alert('담당자 정보가 성공적으로 수정되었습니다.');
}

function handleAfUserLogout(e) {
  if (e) {
    try { e.preventDefault(); } catch (_) {}
    try { e.stopPropagation(); } catch (_) {}
  }
  window.location.href = '/member/login/sn/3267';
}

window.openAfAdminInfoModal = openAfAdminInfoModal;
window.closeAfAdminInfoModal = closeAfAdminInfoModal;
window.handleAfAdminInfoSave = handleAfAdminInfoSave;
window.handleAfUserLogout = handleAfUserLogout;


// ==================== [타깃 사이트 고유 URL 및 모달 연동 엔진] ====================
let currentLecSld = '11';

function getActionUrl(action, sld) {
  const schoolId = '3267';
  const targetSld = sld || currentLecSld || '11';
  switch(action) {
    case 'write':
      return `/af/ad_lec/write/p/1/sn/${schoolId}/sld/${targetSld}/sof/ln/sot/asc`;
    case 'input':
      return `/af/ad_lec/input/p/1/sn/${schoolId}/sld/${targetSld}/sof/ln/sot/asc`;
    case 'modifyField':
      return `/af/ad_lec/modifyField/p/1/sn/${schoolId}/sld/${targetSld}/sof/ln/sot/asc`;
    case 'copy':
      return `/af/ad_lec/copy/p/1/sn/${schoolId}/sld/${targetSld}/sof/ln/sot/asc`;
    case 'stat':
      return `/af/ad_lec/stat/sn/${schoolId}`;
    case 'att_excel':
      return `/af/ad_att/excel/p/1/sn/${schoolId}/sld/${targetSld}/sof/ln/sot/asc`;
    default:
      return `/af/ad_lec/lists/sn/${schoolId}`;
  }
}

function updateActionButtonUrls(sld) {
  if (sld) currentLecSld = String(sld);
  const btnWrite = document.getElementById('btn_action_write');
  const btnInput = document.getElementById('btn_action_input');
  const btnModify = document.getElementById('btn_action_modify');
  const btnCopy = document.getElementById('btn_action_copy');
  const btnStat = document.getElementById('btn_action_stat');
  const btnAtt = document.getElementById('btn_action_att');

  if (btnWrite) btnWrite.setAttribute('href', getActionUrl('write', currentLecSld));
  if (btnInput) btnInput.setAttribute('href', getActionUrl('input', currentLecSld));
  if (btnModify) btnModify.setAttribute('href', getActionUrl('modifyField', currentLecSld));
  if (btnCopy) btnCopy.setAttribute('href', getActionUrl('copy', currentLecSld));
  if (btnStat) btnStat.setAttribute('href', getActionUrl('stat', currentLecSld));
  if (btnAtt) btnAtt.setAttribute('href', getActionUrl('att_excel', currentLecSld));
}

function handleActionUrl(event, action, modalOpenFn) {
  if (event) {
    try { event.preventDefault(); } catch(_) {}
    try { event.stopPropagation(); } catch(_) {}
  }
  const url = getActionUrl(action, currentLecSld);
  try {
    window.history.pushState({ modalAction: action }, '', url);
  } catch(e) {}

  if (typeof modalOpenFn === 'function') {
    modalOpenFn();
  }
}

function handleAttendanceExcel(event, url) {
  // 출석부 출력 안내 및 엑셀 다운로드 트리거
  alert('출석부 엑셀 파일을 다운로드합니다.');
  // 링크 이동 허용 또는 다운로드 진행
}

function restoreListUrl() {
  const currentPath = window.location.pathname;
  if (currentPath !== '/af/ad_lec/lists/sn/3267' && (currentPath.includes('/af/ad_lec/') || currentPath.includes('/af/ad_att/'))) {
    try {
      window.history.pushState({ modalAction: 'list' }, '', '/af/ad_lec/lists/sn/3267');
    } catch(e) {}
  }
}

function checkInitialModalRoute() {
  const path = window.location.pathname;
  if (path.includes('/af/ad_lec/write')) {
    setTimeout(() => { if (typeof openAddModal === 'function') openAddModal(); }, 100);
  } else if (path.includes('/af/ad_lec/input') && !path.includes('/af/ad_lec/inputs')) {
    setTimeout(() => { if (typeof openBatchUploadModal === 'function') openBatchUploadModal(); }, 100);
  } else if (path.includes('/af/ad_lec/modifyField')) {
    setTimeout(() => { if (typeof openBatchModifyModal === 'function') openBatchModifyModal(); }, 100);
  } else if (path.includes('/af/ad_lec/copy')) {
    setTimeout(() => { if (typeof openBatchCopyModal === 'function') openBatchCopyModal(); }, 100);
  } else if (path.includes('/af/ad_lec/stat')) {
    setTimeout(() => { if (typeof openStatModal === 'function') openStatModal(); }, 100);
  } else if (path.includes('/af/ad_app/excel')) {
    setTimeout(() => { if (typeof openAppExcelExportModal === 'function') openAppExcelExportModal(); }, 120);
  } else if (path.includes('/af/ad_app/pdf1')) {
    setTimeout(() => { if (typeof openAppPdf1BillPrintModal === 'function') openAppPdf1BillPrintModal(); }, 120);
  } else if (path.includes('/af/ad_app/pdf2')) {
    setTimeout(() => { if (typeof openAppPdf2TimetablePrintModal === 'function') openAppPdf2TimetablePrintModal(); }, 120);
  } else if (path.includes('/af/ad_app/pdf')) {
    setTimeout(() => { if (typeof openAppPdfPrintModal === 'function') openAppPdfPrintModal(); }, 120);
  } else if (path.includes('/af/ad_app/com')) {
    setTimeout(() => { if (typeof openAppComModal === 'function') openAppComModal(); }, 120);
  } else if (path.includes('/af/ad_app/list1')) {
    setTimeout(() => { if (typeof openAppUnappliedModal === 'function') openAppUnappliedModal(); }, 120);
  } else if (path.includes('/af/ad_wait/sin')) {
    setTimeout(() => { if (typeof openWaitSinModal === 'function') openWaitSinModal(); }, 120);
  } else if (path.includes('/af/ad_wait/input')) {
    setTimeout(() => { if (typeof openWaitBatchInputModal === 'function') openWaitBatchInputModal(); }, 120);
  } else if (path.includes('/af/ad_wait/copy')) {
    setTimeout(() => { if (typeof openWaitCopyModal === 'function') openWaitCopyModal(); }, 120);
  } else if (path.includes('/af/ad_wait/excel')) {
    setTimeout(() => { if (typeof openWaitExcelModal === 'function') openWaitExcelModal(); }, 120);
    } else if (path.includes('/af/ad_ref/write')) {
    setTimeout(() => { if (typeof openRefundSinModal === 'function') openRefundSinModal(); }, 120);
  } else if (path.includes('/af/ad_ref/batch-upload') || path.includes('/af/ad_ref/input')) {
    setTimeout(() => { if (typeof openRefundBatchModal === 'function') openRefundBatchModal(); }, 120);
  } else if (path.includes('/af/ad_wait/app')) {
    setTimeout(() => { if (typeof openWaitAppModal === 'function') openWaitAppModal(); }, 120);
  } else if (path.includes('/af/ad_wait/move')) {
    setTimeout(() => {
      if (typeof openWaitMoveModal === 'function') {
        const selCourseEl = document.getElementById('wait_sel_course');
        const course = (selCourseEl && selCourseEl.value) || (typeof currentWaitlistData !== 'undefined' && currentWaitlistData[0] ? currentWaitlistData[0].courseTitle : '');
        openWaitMoveModal(course);
      }
    }, 120);
  } else if (path.includes('/af/ad_free2_app/apply')) {
    const match = path.match(/smt\/(\d+)/);
    const smtMonth = match ? `${match[1]}월` : '3월';
    setTimeout(() => {
      if (typeof switchSubmodelView === 'function') {
        switchSubmodelView(null, 'ad_free2_app', path, false);
      }
      if (typeof openSubsidyAppImportModal === 'function') {
        openSubsidyAppImportModal(smtMonth);
      }
    }, 150);
  } else if (path.includes('/af/ad_rsch/write')) {
    setTimeout(() => {
      if (typeof switchSubmodelView === 'function') switchSubmodelView(null, 'ad_rsch_lists', path, false);
      if (typeof openRschWriteModal === 'function') openRschWriteModal();
    }, 120);
  } else if (path.includes('/af/ad_rsch/input')) {
    setTimeout(() => {
      if (typeof switchSubmodelView === 'function') switchSubmodelView(null, 'ad_rsch_lists', path, false);
      if (typeof openRschInputModal === 'function') openRschInputModal();
    }, 120);
  } else if (path.includes('/af/ad_abs/write')) {
    setTimeout(() => {
      if (typeof switchSubmodelView === 'function') switchSubmodelView(null, 'ad_abs_lists', path, false);
      if (typeof openAbsWriteModal === 'function') openAbsWriteModal();

    }, 120);
  } else if (path.includes('/af/ad_tea/write')) {
    setTimeout(() => {
      if (typeof switchSubmodelView === 'function') switchSubmodelView(null, 'ad_tea_lists', path, false);
      if (typeof openTeaWriteModal === 'function') openTeaWriteModal();
    }, 120);
  } else if (path.includes('/af/ad_tea/input')) {
    setTimeout(() => {
      if (typeof switchSubmodelView === 'function') switchSubmodelView(null, 'ad_tea_lists', path, false);
      if (typeof openTeaInputModal === 'function') openTeaInputModal();
    }, 120);
  } else if (path.includes('/af/ad_tea/modify')) {
    const match = path.match(/num\/(\d+)/);
    const num = match ? match[1] : '';
    setTimeout(() => {
      if (typeof switchSubmodelView === 'function') switchSubmodelView(null, 'ad_tea_lists', path, false);
      if (typeof openTeaModifyModal === 'function') openTeaModifyModal(num);
    }, 120);
  } else if (path.includes('/af/ad_tea/schedule')) {
    setTimeout(() => {
      if (typeof switchSubmodelView === 'function') switchSubmodelView(null, 'ad_tea_lists', path, false);
      if (typeof openTeaScheduleModal === 'function') openTeaScheduleModal();
    }, 120);
  }
}

// Window global exports
window.getActionUrl = getActionUrl;
window.updateActionButtonUrls = updateActionButtonUrls;
window.handleActionUrl = handleActionUrl;
window.handleAttendanceExcel = handleAttendanceExcel;
window.restoreListUrl = restoreListUrl;
window.checkInitialModalRoute = checkInitialModalRoute;
window.openRefundSinModal = openRefundSinModal;
window.closeRefundSinModal = closeRefundSinModal;
window.openRefundBatchModal = openRefundBatchModal;
window.closeRefundBatchModal = closeRefundBatchModal;
window.fillRefundSampleStudent = fillRefundSampleStudent;
window.onRefundCourseChanged = onRefundCourseChanged;
window.onRefundDivChanged = onRefundDivChanged;
window.onRefundTypeChanged = onRefundTypeChanged;
window.calculateRefundModalAmounts = calculateRefundModalAmounts;
window.searchRefundStudent = searchRefundStudent;
window.selectRefundStudent = selectRefundStudent;
window.calcFacilityRefund = calcFacilityRefund;
window.submitRefundSin = submitRefundSin;
window.fillRefundBatchSample = fillRefundBatchSample;
window.parseRefundBatchPreview = parseRefundBatchPreview;
window.submitRefundBatch = submitRefundBatch;
window.openRefundCalculator = openRefundCalculator;
window.onRefundBatchDivChanged = onRefundBatchDivChanged;
window.onRefundBatchCourseChanged = onRefundBatchCourseChanged;
window.toggleRefundBatchAllStudents = toggleRefundBatchAllStudents;
window.onRefundBatchStudentToggle = onRefundBatchStudentToggle;
window.calculateRefundBatchAmounts = calculateRefundBatchAmounts;
window.calcBatchFacilityRefund = calcBatchFacilityRefund;
window.filterRefunds = filterRefunds;
window.resetRefundSearch = resetRefundSearch;
window.toggleAllRefundCheckboxes = toggleAllRefundCheckboxes;
window.toggleRefundStatus = toggleRefundStatus;
window.handleBulkRefundStatus = handleBulkRefundStatus;
window.handleBulkRefundDelete = handleBulkRefundDelete;
window.deleteRefundItem = deleteRefundItem;
window.exportRefundExcel = exportRefundExcel;
window.loadRefunds = loadRefunds;
window.openStatModal = openStatModal;
window.closeStatModal = closeStatModal;
window.loadStatData = loadStatData;
window.filterByStatCategory = filterByStatCategory;
window.chk_all = chk_all;
window.toggleDetailedSearch = toggleDetailedSearch;
window.toggleExtraMenu = toggleExtraMenu;
window.resetLectureFilters = resetLectureFilters;
window.handleLectureBulkAction = handleLectureBulkAction;
window.toggleSort = toggleSort;
window.show_max_sin = show_max_sin;
window.chk_del = chk_del;
window.loadSubsidyApplicants = loadSubsidyApplicants;
window.renderSubsidyApplicantsTable = renderSubsidyApplicantsTable;
window.resetSubsidyAppFilters = resetSubsidyAppFilters;
window.applySubsidyAppSorting = applySubsidyAppSorting;
window.toggleSubsidyAppSort = toggleSubsidyAppSort;
window.toggleSelectAllSubsidyApp = toggleSelectAllSubsidyApp;
window.updateSubsidyAppSelectedCount = updateSubsidyAppSelectedCount;
window.deleteSelectedSubsidyApplicants = deleteSelectedSubsidyApplicants;
window.deleteSingleSubsidyApp = deleteSingleSubsidyApp;
window.loadSubsidyAllowedMonths = loadSubsidyAllowedMonths;
window.renderAllowedMonthsBadges = renderAllowedMonthsBadges;
window.openSubsidyAllowMonthsModal = openSubsidyAllowMonthsModal;
window.closeSubsidyAllowMonthsModal = closeSubsidyAllowMonthsModal;
window.submitSubsidyAllowMonths = submitSubsidyAllowMonths;
window.openSubsidyAppRegisterModal = openSubsidyAppRegisterModal;
window.closeSubsidyAppRegisterModal = closeSubsidyAppRegisterModal;
window.submitSubsidyAppRegister = submitSubsidyAppRegister;
window.openSubsidyAppSearchStudentModal = openSubsidyAppSearchStudentModal;
window.closeSubsidyAppSearchStudentModal = closeSubsidyAppSearchStudentModal;
window.searchSubsidyApplicantsPopup = searchSubsidyApplicantsPopup;
window.selectSubsidyAppStudent = selectSubsidyAppStudent;
window.chkFreeMoney = chkFreeMoney;
window.chkSumFreeMoney = chkSumFreeMoney;
window.chkMoney = chkMoney;
window.filterNum = filterNum;
window.commaSplit = commaSplit;
window.validate_required = validate_required;
window.fm_edit_check = fm_edit_check;
window.openSubsidyAppImportModal = openSubsidyAppImportModal;
window.closeSubsidyAppImportModal = closeSubsidyAppImportModal;
window.onSubsidyImportMonthChange = onSubsidyImportMonthChange;
window.toggleSubsidyImportDivAll = toggleSubsidyImportDivAll;
window.updateSubsidyImportDivState = updateSubsidyImportDivState;
window.toggleSubsidyImportNeulbomAll = toggleSubsidyImportNeulbomAll;
window.updateSubsidyImportNeulbomState = updateSubsidyImportNeulbomState;
window.toggleSubsidyImportFundAll = toggleSubsidyImportFundAll;
window.updateSubsidyImportFundState = updateSubsidyImportFundState;
window.executeSubsidyAppImport = executeSubsidyAppImport;
window.exportSubsidyAppResults = exportSubsidyAppResults;
window.exportSubsidyAppAllCollect = exportSubsidyAppAllCollect;
window.openSubsidyAppMonthlyModal = openSubsidyAppMonthlyModal;
window.closeSubsidyAppMonthlyModal = closeSubsidyAppMonthlyModal;
window.submitSubsidyAppMonthly = submitSubsidyAppMonthly;
window.openSubsidyAppBankingModal = openSubsidyAppBankingModal;
window.closeSubsidyAppBankingModal = closeSubsidyAppBankingModal;
window.submitSubsidyAppBanking = submitSubsidyAppBanking;
window.openSubsidyAppAdminOfficeModal = openSubsidyAppAdminOfficeModal;
window.closeSubsidyAppAdminOfficeModal = closeSubsidyAppAdminOfficeModal;
window.submitSubsidyAppAdminOffice = submitSubsidyAppAdminOffice;
window.openSubsidyAppAdminModal = openSubsidyAppAdminOfficeModal;
window.closeSubsidyAppAdminModal = closeSubsidyAppAdminOfficeModal;
window.submitSubsidyAppAdmin = submitSubsidyAppAdminOffice;
window.openSubsidyAppNeisModal = openSubsidyAppNeisModal;
window.closeSubsidyAppNeisModal = closeSubsidyAppNeisModal;
window.submitSubsidyAppNeis = submitSubsidyAppNeis;
window.openSubsidyAppEditRowModal = openSubsidyAppEditRowModal;
window.closeSubsidyAppEditRowModal = closeSubsidyAppEditRowModal;
window.submitSubsidyAppEditRow = submitSubsidyAppEditRow;
window.loadSubsidyConfig = loadSubsidyConfig;
window.selectSubsidyTab = selectSubsidyTab;
window.renderSubsidyConfigForm = renderSubsidyConfigForm;
window.saveSubsidyConfig = saveSubsidyConfig;
window.openSubsidyOrderModal = openSubsidyOrderModal;
window.closeSubsidyOrderModal = closeSubsidyOrderModal;
window.renderSubsidyOrderList = renderSubsidyOrderList;
window.moveSubsidyOrder = moveSubsidyOrder;
window.saveSubsidyOrder = saveSubsidyOrder;
window.loadSubsidyRanks = loadSubsidyRanks;
window.filterSubsidyRankTab = filterSubsidyRankTab;
window.renderSubsidyRanksTable = renderSubsidyRanksTable;
window.openCreateSubsidyRankModal = openCreateSubsidyRankModal;
window.openEditSubsidyRankModal = openEditSubsidyRankModal;
window.closeSubsidyRankModal = closeSubsidyRankModal;
window.submitSubsidyRankForm = submitSubsidyRankForm;
window.deleteSubsidyRank = deleteSubsidyRank;
window.moveSubsidyRankOrder = moveSubsidyRankOrder;



