// dbdbschool Sub-Model View Engine & Action Button Router (28 Live Pages & 29 Submodels)

const SCHOOL_SN = '3267';
let currentSubmodelKey = 'ad_lec_lists';

const submodelTitles = {
  // 단독 대메뉴 (13개)
  ad_faq_main: '<i class="fa-solid fa-book"></i> 매뉴얼 (FAQ) (/af/ad_faq/main)',
  qanda_lists: '<i class="fa-solid fa-comments"></i> 고객지원 게시판 (/af/qanda/lists)',
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

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  let initialKey = 'ad_lec_lists';

  // Match live URL routes
  if (path.includes('/af/ad_faq/main')) initialKey = 'ad_faq_main';
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

async function loadQaList() {
  try {
    const res = await fetch(`/api/qa?schoolCode=UNCHON2025`);
    const data = await res.json();
    const tbody = document.getElementById('qaTbody');
    if (tbody && data.questions) {
      tbody.innerHTML = data.questions.map(qa => `
        <tr>
          <td><strong>${qa.courseTitle}</strong></td>
          <td>${qa.authorName} (${qa.authorRole})</td>
          <td>${qa.title}</td>
          <td><span class="badge ${qa.reply ? 'badge-OUTPUT' : 'badge-WAITING'}">${qa.reply ? '답변완료' : '미답변'}</span></td>
          <td>${(qa.createdAt || '').slice(0, 10)}</td>
          <td style="text-align: center;"><button class="btn btn-primary" style="padding:4px 8px; font-size:0.8rem;" onclick="alert('Q&A 답변 작성 창이 열립니다.')">답변</button></td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error('loadQaList Error:', e); }
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
