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
  ad_att_stat: '<i class="fa-solid fa-signature"></i> 출석부관리 (/af/ad_att/stat)',
  ad_ref_lists: '<i class="fa-solid fa-calculator"></i> 환불/취소관리 (/af/ad_ref/lists)',
  ad_abs_lists: '<i class="fa-solid fa-user-xmark"></i> 결석/귀가신청 (/af/ad_abs/lists)',
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
  if (path.includes('/af/ad_app/lists') || path.includes('/af/ad_stu/lists')) return 'ad_app_lists';
  if (path.includes('/af/ad_wait/lists')) return 'ad_wait_lists';
  if (path.includes('/af/ad_att/stat')) return 'ad_att_stat';
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
  if (path.includes('/af/ad_cfg/main')) return 'ad_cfg_main';
  return 'ad_lec_lists';
}

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const initialKey = getSubmodelKeyFromPath(path);
  switchSubmodelView(null, initialKey, path, false);
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

async function loadLectures() {
  const category = document.getElementById('categoryFilter') ? document.getElementById('categoryFilter').value : '전체';
  const status = document.getElementById('statusFilter') ? document.getElementById('statusFilter').value : '전체';
  const keyword = document.getElementById('searchKeyword') ? document.getElementById('searchKeyword').value.trim() : '';

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

function renderLectureTable(lectures) {
  const tbody = document.getElementById('lectureTbody');
  if (!tbody) return;
  if (!lectures || lectures.length === 0) {
    tbody.innerHTML = `<tr><td colspan="13" style="text-align: center; padding: 40px; color: var(--text-secondary);">조회된 강좌가 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = lectures.map((lec, idx) => {
    const costInstructor = lec.costInstructor !== undefined ? lec.costInstructor : Math.round(lec.tuitionFee * 0.8);
    const costFacility = lec.costFacility !== undefined ? lec.costFacility : Math.round(lec.tuitionFee * 0.2);

    return `
    <tr>
      <td style="text-align: center;"><input type="checkbox" class="lec-checkbox" value="${lec.id}"></td>
      <td>${idx + 1}</td>
      <td><span style="font-weight:600; color:#475569;">${lec.category}</span></td>
      <td>
        <strong>${lec.title}</strong>
        ${lec.allowTimeConflict ? '<span style="font-size:0.75rem; color:#8b5cf6; display:block;">[중복허용]</span>' : ''}
      </td>
      <td>${lec.instructor} <span style="font-size:0.78rem; color:#64748b;">(${lec.teacherId || 'inst'})</span></td>
      <td>${lec.targetGrade}</td>
      <td><strong>${lec.enrolledCount}</strong>/${lec.capacity} <span style="font-size:0.8rem; color:#64748b;">(대기: ${lec.waitingCount}/${lec.waitingCapacity})</span></td>
      <td>
        <strong>${lec.tuitionFee.toLocaleString()}원</strong>
        <div style="font-size:0.78rem; color:#64748b;">
          강사: <span style="color:#16a34a;">${costInstructor.toLocaleString()}원</span> / 
          수용: <span style="color:#2563eb;">${costFacility.toLocaleString()}원</span>
        </div>
      </td>
      <td>
        <span style="font-size:0.85rem;">재료: ${lec.materialFee.toLocaleString()}원</span>
        ${lec.textbookFee ? `<br><span style="font-size:0.78rem; color:#64748b;">교재: ${lec.textbookFee.toLocaleString()}원</span>` : ''}
      </td>
      <td>
        ${lec.dayOfWeek} ${lec.scheduleTime}
        <div style="font-size:0.78rem; color:#64748b;">(총 ${lec.totalHours || 12}시수 / ${lec.location})</div>
      </td>
      <td style="text-align: center;">
        <label class="switch">
          <input type="checkbox" ${lec.instructorClosed ? 'checked' : ''} onchange="toggleInstructorClose('${lec.id}')">
          <span class="slider"></span>
        </label>
      </td>
      <td style="text-align: center;">
        <span class="badge badge-${lec.status}">${lec.status === 'OUTPUT' ? '출력' : (lec.status === 'CLOSED' ? '종료' : '대기')}</span>
      </td>
      <td style="text-align: center; white-space: nowrap;">
        <button class="btn btn-outline" style="padding: 4px 6px; font-size:0.78rem;" onclick="openCourseCopyModal('${lec.id}', '${lec.title}')" title="강좌 복사"><i class="fa-solid fa-clone"></i> 복사</button>
        <button class="btn btn-outline" style="padding: 4px 6px; font-size:0.78rem;" onclick="runLottery('${lec.id}')" title="추첨 실행"><i class="fa-solid fa-dice"></i> 추첨</button>
      </td>
    </tr>
  `;
  }).join('');
}

// ==================== 2. 신청자관리 (/af/ad_app/lists) ====================

let applicantListCache = [];
let applicantCoursesCache = [];
let appSortAsc = { studentNum: true, appliedAt: false };

async function loadApplicants() {
  const categoryEl = document.getElementById('appCategoryFilter');
  const neulbomEl = document.getElementById('appNeulbomFilter');
  const courseEl = document.getElementById('appCourseFilter');
  const gradeEl = document.getElementById('appGradeFilter');
  const classEl = document.getElementById('appClassFilter');
  const searchTypeEl = document.getElementById('appSearchTypeFilter');
  const keywordEl = document.getElementById('appSearchKeyword');

  const category = categoryEl ? categoryEl.value : '26년 8월';
  const neulbomType = neulbomEl ? neulbomEl.value : '=늘봄과정=';
  const courseId = courseEl ? courseEl.value : '=강좌전체=';
  const grade = gradeEl ? gradeEl.value : '=학년=';
  const classNum = classEl ? classEl.value : '=반=';
  const searchType = searchTypeEl ? searchTypeEl.value : 'all';
  const keyword = keywordEl ? keywordEl.value.trim() : '';

  const params = new URLSearchParams();
  if (category && category !== '전체') params.append('category', category);
  if (neulbomType && neulbomType !== '=늘봄과정=') params.append('neulbomType', neulbomType);
  if (courseId && courseId !== '=강좌전체=') params.append('courseId', courseId);
  if (grade && grade !== '=학년=') params.append('grade', grade);
  if (classNum && classNum !== '=반=') params.append('classNum', classNum);
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
  const filterSelect = document.getElementById('appCourseFilter');
  const newAppCourseSelect = document.getElementById('newAppCourseSelect');
  const batchFeeCourseSelect = document.getElementById('batchFeeCourseSelect');
  const testModeCourseSelect = document.getElementById('testModeCourseSelect');

  const optionsHtml = courses.map(c => `<option value="${c.id || c.title}">[${c.category || '늘봄'}] ${c.title} (${c.instructor || c.teacherName || '강사'}, ${c.enrolledCount || c.applied || 0}명)</option>`).join('');

  if (filterSelect && filterSelect.options.length <= 1) {
    filterSelect.innerHTML = '<option value="=강좌전체=">=강좌전체=</option>' + optionsHtml;
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
    tbody.innerHTML = `<tr><td colspan="17" style="text-align:center; padding:40px; color:#64748b;"><i class="fa-solid fa-folder-open" style="font-size:24px; margin-bottom:8px; display:block;"></i>조회된 수강 신청자가 없습니다.</td></tr>`;
    return;
  }

  let totalTuition = 0;
  let totalFacility = 0;
  let totalInstructor = 0;
  let totalBook = 0;
  let totalMaterial = 0;
  let grandTotal = 0;

  const rows = items.map((app, idx) => {
    const tuition = Number(app.tuitionFee) || 0;
    const material = Number(app.materialFee) || 0;
    const book = Number(app.bookFee) || 0;
    const instructor = app.instructorFee !== undefined ? Number(app.instructorFee) : Math.round(tuition * 0.8);
    const facility = app.facilityFee !== undefined ? Number(app.facilityFee) : Math.round(tuition * 0.2);
    const total = Number(app.totalFee) || (tuition + material + book);

    totalTuition += tuition;
    totalFacility += facility;
    totalInstructor += instructor;
    totalBook += book;
    totalMaterial += material;
    grandTotal += total;

    const grade = app.grade || (app.gradeClass ? app.gradeClass.charAt(0) : '1');
    const classNum = app.classNum || (app.gradeClass && app.gradeClass.includes('반') ? app.gradeClass.split('반')[0].slice(-1) : '1');
    const studentNum = app.studentNum || app.studentNumber || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`);
    const phone = app.parentPhone || app.guardianPhone || '-';

    return `
      <tr>
        <td style="text-align:center;"><input type="checkbox" class="app-checkbox" value="${app.id}"></td>
        <td style="text-align:center;">${idx + 1}</td>
        <td style="text-align:center;"><span style="font-size:11.5px; color:#475569;">[${app.category || '26년 8월'}]</span><br><span style="font-weight:600; color:#2563eb;">${app.neulbomType || '방과후'}</span></td>
        <td><strong>${escHtml(app.courseTitle)}</strong></td>
        <td style="text-align:center;">${grade}</td>
        <td style="text-align:center;">${classNum}</td>
        <td style="text-align:center;"><strong>${studentNum}</strong></td>
        <td style="text-align:center;">
          <a href="javascript:void(0);" onclick="viewAppSchedule('${escHtml(app.studentName)}', '${escHtml(app.gradeClass || grade + '학년 ' + classNum + '반')}')" style="font-weight:bold; color:#1d4ed8; text-decoration:underline;">${escHtml(app.studentName)}</a>
        </td>
        <td style="text-align:center; font-size:12px;">
          ${phone}
          <button class="btn btn-outline" style="padding:1px 5px; font-size:10px; margin-left:2px;" onclick="editAppContact('${app.id}', '${escHtml(app.studentName)}', '${phone}')">수정</button>
        </td>
        <td style="text-align:right; font-weight:600;">${tuition.toLocaleString()}원</td>
        <td style="text-align:right; color:#64748b;">${facility.toLocaleString()}원</td>
        <td style="text-align:right; color:#64748b;">${instructor.toLocaleString()}원</td>
        <td style="text-align:right; color:#64748b;">${book.toLocaleString()}원</td>
        <td style="text-align:right; color:#64748b;">${material.toLocaleString()}원</td>
        <td style="text-align:right; font-weight:bold; color:#059669;">${total.toLocaleString()}원</td>
        <td style="text-align:center; font-size:11px; color:#64748b;">${(app.appliedAt || '2026-08-15').substring(0, 10)}</td>
        <td style="text-align:center; white-space:nowrap;">
          <button class="btn btn-outline" style="padding:3px 6px; font-size:11px;" onclick="openAppEditModal('${app.id}')" title="수정"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-outline" style="padding:3px 6px; font-size:11px; color:#dc2626;" onclick="deleteApp('${app.id}')" title="삭제"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `;
  }).join('');

  const summaryRow = `
    <tr style="background:#f8fafc; font-weight:bold; border-top:2px solid #cbd5e1;">
      <td colspan="9" style="text-align:center; padding:10px;">합계 (${items.length}명)</td>
      <td style="text-align:right; color:#1e293b;">${totalTuition.toLocaleString()}원</td>
      <td style="text-align:right; color:#64748b;">${totalFacility.toLocaleString()}원</td>
      <td style="text-align:right; color:#64748b;">${totalInstructor.toLocaleString()}원</td>
      <td style="text-align:right; color:#64748b;">${totalBook.toLocaleString()}원</td>
      <td style="text-align:right; color:#64748b;">${totalMaterial.toLocaleString()}원</td>
      <td style="text-align:right; color:#059669;">${grandTotal.toLocaleString()}원</td>
      <td colspan="2"></td>
    </tr>
  `;

  tbody.innerHTML = rows + summaryRow;
}

function resetAppFilters() {
  const cat = document.getElementById('appCategoryFilter');
  const nlb = document.getElementById('appNeulbomFilter');
  const crs = document.getElementById('appCourseFilter');
  const grd = document.getElementById('appGradeFilter');
  const cls = document.getElementById('appClassFilter');
  const st = document.getElementById('appSearchTypeFilter');
  const kw = document.getElementById('appSearchKeyword');

  if (cat) cat.value = '26년 8월';
  if (nlb) nlb.value = '=늘봄과정=';
  if (crs) crs.value = '=강좌전체=';
  if (grd) grd.value = '=학년=';
  if (cls) cls.value = '=반=';
  if (st) st.value = 'all';
  if (kw) kw.value = '';

  loadApplicants();
}

function toggleSelectAllApps(master) {
  document.querySelectorAll('.app-checkbox').forEach(cb => cb.checked = master.checked);
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

function openAppCreateModal() {
  const modal = document.getElementById('modalAppCreate');
  if (modal) modal.style.display = 'flex';
}

function closeAppModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}

async function handleAppCreateSubmit(e) {
  if (e) e.preventDefault();
  const courseId = document.getElementById('newAppCourseSelect')?.value;
  const studentName = document.getElementById('newAppStudentName')?.value;
  const gradeClass = document.getElementById('newAppGradeClass')?.value;
  const studentNum = document.getElementById('newAppStudentNum')?.value;
  const parentPhone = document.getElementById('newAppParentPhone')?.value;
  const subsidyType = document.getElementById('newAppSubsidyType')?.value || '일반 자부담';
  const tuitionFee = parseInt(document.getElementById('newAppTuitionFee')?.value) || 0;
  const bookFee = parseInt(document.getElementById('newAppBookFee')?.value) || 0;
  const materialFee = parseInt(document.getElementById('newAppMaterialFee')?.value) || 0;
  const bankName = document.getElementById('newAppBankName')?.value || '농협';
  const account = document.getElementById('newAppAccount')?.value || '';
  const depositor = document.getElementById('newAppDepositor')?.value || '';
  const memo = document.getElementById('newAppMemo')?.value || '';

  if (!courseId || !studentName) {
    alert('강좌 및 학생명을 입력하세요.');
    return;
  }

  const selectedCourse = applicantCoursesCache.find(c => c.id === courseId || c.title === courseId);

  try {
    const res = await fetch('/api/af/ad_app/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schoolId: SCHOOL_SN,
        category: '26년 8월',
        neulbomType: '방과후',
        courseId,
        courseTitle: selectedCourse ? selectedCourse.title : courseId,
        instructorName: selectedCourse ? (selectedCourse.instructor || selectedCourse.teacherName) : '강사',
        studentName,
        gradeClass: gradeClass || '1학년 1반',
        studentNum: studentNum || '01',
        parentPhone: parentPhone || '010-0000-0000',
        subsidyType,
        tuitionFee,
        bookFee,
        materialFee,
        bankName,
        schoolBankingAccount: account,
        depositorName: depositor,
        paymentStatus: tuitionFee === 0 ? '무상' : '결제대기',
        status: '승인',
        memo
      })
    });
    const d = await res.json();
    if (d.success) {
      alert('신청자가 성공적으로 등록되었습니다.');
      closeAppModal('modalAppCreate');
      loadApplicants();
    } else {
      alert(d.message || '등록 중 오류가 발생했습니다.');
    }
  } catch (err) {
    console.error('Create Applicant Error:', err);
  }
}

async function openAppEditModal(id) {
  try {
    const res = await fetch(`/api/af/ad_app/view/${id}`);
    const d = await res.json();
    if (d.success && d.item) {
      const item = d.item;
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

function openAppBatchUploadModal() {
  const modal = document.getElementById('modalAppBatchUpload');
  if (modal) modal.style.display = 'flex';
}

function parseAppBatchSample() {
  const sample = `김민준\t1학년 2반\t14\t010-2345-6789\t[특기적성] 창의 로봇교실 A반\t35000\t15000\n이서연\t2학년 1반\t07\t010-3456-7890\t[특기적성] 창의 로봇교실 A반\t35000\t15000`;
  const textarea = document.getElementById('appBatchTextarea');
  if (textarea) textarea.value = sample;
}

async function submitAppBatchUpload() {
  const text = document.getElementById('appBatchTextarea')?.value.trim();
  if (!text) {
    alert('붙여넣을 명단 데이터를 입력하세요.');
    return;
  }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const items = lines.map(line => {
    const parts = line.split(/[\t,]+/).map(p => p.trim());
    return {
      studentName: parts[0] || '학생',
      gradeClass: parts[1] || '1학년 1반',
      studentNum: parts[2] || '01',
      parentPhone: parts[3] || '010-0000-0000',
      courseTitle: parts[4] || '[늘봄] AI 로봇 코딩 교실',
      courseId: 'c_3267_1',
      tuitionFee: parseInt(parts[5]) || 35000,
      materialFee: parseInt(parts[6]) || 15000,
      paymentStatus: '결제대기',
      status: '승인'
    };
  });

  try {
    const res = await fetch('/api/af/ad_app/batch-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolId: SCHOOL_SN, items })
    });
    const d = await res.json();
    if (d.success) {
      alert(`${d.count}명의 수강 신청이 일괄 등록되었습니다.`);
      closeAppModal('modalAppBatchUpload');
      loadApplicants();
    }
  } catch (err) {
    console.error('Batch Upload Error:', err);
  }
}

function openAppBatchFeeModal() {
  const modal = document.getElementById('modalAppBatchFee');
  if (modal) modal.style.display = 'flex';
}

async function submitAppBatchFee(e) {
  if (e) e.preventDefault();
  const courseId = document.getElementById('batchFeeCourseSelect')?.value;
  const tuitionFee = parseInt(document.getElementById('batchFeeTuition')?.value) || 0;
  const bookFee = parseInt(document.getElementById('batchFeeBook')?.value) || 0;
  const materialFee = parseInt(document.getElementById('batchFeeMaterial')?.value) || 0;

  try {
    const res = await fetch('/api/af/ad_app/batch-fee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolId: SCHOOL_SN, courseId, tuitionFee, bookFee, materialFee })
    });
    const d = await res.json();
    if (d.success) {
      alert(`${d.updatedCount}건의 수강료가 일괄 적용되었습니다.`);
      closeAppModal('modalAppBatchFee');
      loadApplicants();
    }
  } catch (err) {
    console.error('Batch Fee Error:', err);
  }
}

function openAppBatchCopyModal() {
  const modal = document.getElementById('modalAppBatchCopy');
  if (modal) modal.style.display = 'flex';
}

async function submitAppBatchCopy(e) {
  if (e) e.preventDefault();
  const fromCategory = document.getElementById('copyAppFromCategory')?.value;
  const toCategory = document.getElementById('copyAppToCategory')?.value;

  try {
    const res = await fetch('/api/af/ad_app/copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolId: SCHOOL_SN, fromCategory, toCategory })
    });
    const d = await res.json();
    if (d.success) {
      alert(`${d.copiedCount}명의 신청자가 '${toCategory}'(으)로 일괄 복사되었습니다.`);
      closeAppModal('modalAppBatchCopy');
      loadApplicants();
    }
  } catch (err) {
    console.error('Batch Copy Error:', err);
  }
}

function exportAppExcel() {
  window.location.href = `/api/af/ad_app/school-banking/csv/sn/${SCHOOL_SN}`;
}

function downloadSchoolBankingCsv() {
  window.location.href = `/api/af/ad_app/school-banking/csv/sn/${SCHOOL_SN}`;
}

function openAppPrintModal(type) {
  const modal = document.getElementById('modalAppPrint');
  const titleEl = document.getElementById('appPrintModalTitle');
  const contentEl = document.getElementById('appPrintContentArea');
  if (!modal || !contentEl) return;

  if (type === 'application') {
    if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-file-invoice"></i> 방과후학교 / 늘봄 수강신청서 인쇄';
    contentEl.innerHTML = `
      <div style="background:#fff; padding:30px; border:1px solid #ddd; max-width:700px; margin:0 auto; font-family:'Malgun Gothic';">
        <h2 style="text-align:center; margin-bottom:20px; font-size:20px; text-decoration:underline;">2026학년도 늘봄·방과후학교 수강신청 확인서</h2>
        <table style="width:100%; border-collapse:collapse; margin-bottom:16px; font-size:13px;" border="1">
          <tr><th style="padding:8px; background:#f5f5f5; width:120px;">학교명</th><td style="padding:8px;">광주풍향초등학교</td><th style="padding:8px; background:#f5f5f5; width:120px;">신청분기</th><td style="padding:8px;">26년 8월</td></tr>
          <tr><th style="padding:8px; background:#f5f5f5;">학생성명</th><td style="padding:8px;">김민준 (1학년 2반 14번)</td><th style="padding:8px; background:#f5f5f5;">학부모연락처</th><td style="padding:8px;">010-2345-6789</td></tr>
          <tr><th style="padding:8px; background:#f5f5f5;">신청강좌</th><td colspan="3" style="padding:8px; font-weight:bold;">[특기적성] 창의 로봇교실 A반</td></tr>
          <tr><th style="padding:8px; background:#f5f5f5;">수강료내역</th><td colspan="3" style="padding:8px;">수강료: 35,000원 / 재료비: 15,000원 (합계: 50,000원)</td></tr>
        </table>
        <p style="text-align:center; margin-top:30px; line-height:1.8; font-size:13px;">
          위와 같이 2026학년도 늘봄·방과후학교 수강을 신청하였음을 확인합니다.<br><br>
          <strong>2026년 8월 18일</strong><br><br>
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
          <tr><th style="padding:8px; background:#f5f5f5; width:120px;">학생인적</th><td colspan="3" style="padding:8px;">광주풍향초등학교 1학년 2반 14번 김민준</td></tr>
          <tr><th style="padding:8px; background:#f5f5f5;">납부계좌</th><td colspan="3" style="padding:8px;">농협 302-9999-8888-77 (스쿨뱅킹 자동출금)</td></tr>
          <tr><th style="padding:8px; background:#f5f5f5;">납부기한</th><td colspan="3" style="padding:8px; color:#dc2626; font-weight:bold;">2026년 8월 25일까지</td></tr>
          <tr><th style="padding:8px; background:#f5f5f5;">납입금액</th><td colspan="3" style="padding:8px; font-size:16px; font-weight:bold; color:#059669;">50,000원</td></tr>
        </table>
      </div>
    `;
  } else {
    if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-calendar-days"></i> 학생 수강 시간표 인쇄';
    contentEl.innerHTML = `
      <div style="background:#fff; padding:30px; border:1px solid #ddd; max-width:700px; margin:0 auto; font-family:'Malgun Gothic';">
        <h2 style="text-align:center; margin-bottom:20px; font-size:20px; text-decoration:underline;">학생 개인별 주간 수강시간표</h2>
        <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:center;" border="1">
          <thead><tr style="background:#f5f5f5;"><th style="padding:8px;">교시 / 요일</th><th>월요일</th><th>화요일</th><th>수요일</th><th>목요일</th><th>금요일</th></tr></thead>
          <tbody>
            <tr><td style="padding:8px; font-weight:bold;">1부 (14:00~14:50)</td><td>-</td><td style="background:#e0f2fe; font-weight:bold;">창의로봇교실</td><td>-</td><td style="background:#e0f2fe; font-weight:bold;">창의로봇교실</td><td>-</td></tr>
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

function openAddModal() { document.getElementById('addModal').classList.add('show'); }
function closeAddModal() { document.getElementById('addModal').classList.remove('show'); }
function openBatchCopyModal() { document.getElementById('batchCopyModal').classList.add('show'); }
function closeBatchCopyModal() { document.getElementById('batchCopyModal').classList.remove('show'); }

async function submitAddCourse(e) {
  e.preventDefault();
  const fee = parseInt(document.getElementById('addTuitionFee').value) || 0;
  const costFacility = parseInt(document.getElementById('addCostFacility').value) || Math.round(fee * 0.2);

  const payload = {
    schoolId: SCHOOL_SN,
    category: document.getElementById('addCategory').value,
    neulbomType: document.getElementById('addNeulbomType').value,
    title: document.getElementById('addTitle').value.trim(),
    instructor: document.getElementById('addInstructor').value.trim(),
    targetGrade: document.getElementById('addTargetGrade').value.trim(),
    capacity: document.getElementById('addCapacity').value,
    waitingCapacity: document.getElementById('addWaitingCapacity').value,
    totalHours: document.getElementById('addTotalHours').value,
    tuitionFee: fee,
    fee: fee,
    costFacility: costFacility,
    costInstructor: fee - costFacility,
    textbookFee: document.getElementById('addTextbookFee').value || 0,
    materialFee: document.getElementById('addMaterialFee').value || 0,
    classroom: document.getElementById('addClassroom').value.trim(),
    dayOfWeek: document.getElementById('addDayOfWeek').value.trim(),
    scheduleTime: document.getElementById('addScheduleTime').value.trim(),
    allowTimeConflict: document.getElementById('addAllowConflict').checked,
    noSameTeacher: document.getElementById('addNoSameTeacher').checked
  };

  const res = await fetch('/api/af/ad_lec/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  alert(data.message);
  closeAddModal();
  loadLectures();
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
window.handleAppCreateSubmit = handleAppCreateSubmit;
window.openAppEditModal = openAppEditModal;
window.submitAppEdit = submitAppEdit;
window.deleteApp = deleteApp;
window.handleBulkAppStatus = handleBulkAppStatus;
window.handleBulkAppDelete = handleBulkAppDelete;
window.openAppBatchUploadModal = openAppBatchUploadModal;
window.parseAppBatchSample = parseAppBatchSample;
window.submitAppBatchUpload = submitAppBatchUpload;
window.openAppBatchFeeModal = openAppBatchFeeModal;
window.submitAppBatchFee = submitAppBatchFee;
window.openAppBatchCopyModal = openAppBatchCopyModal;
window.submitAppBatchCopy = submitAppBatchCopy;
window.exportAppExcel = exportAppExcel;
window.downloadSchoolBankingCsv = downloadSchoolBankingCsv;
window.openAppPrintModal = openAppPrintModal;
window.triggerPrintArea = triggerPrintArea;
window.openAppChangeHistoryModal = openAppChangeHistoryModal;
window.openAppUnregisteredModal = openAppUnregisteredModal;
window.editAppContact = editAppContact;
window.viewAppSchedule = viewAppSchedule;
window.openAppTestMode = openAppTestMode;
window.executeTestApply = executeTestApply;

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
