document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.replace('../login/login.html');
    return;
  }

  // DOM Elements
  const schoolTitle = document.getElementById('schoolTitle');
  const planBadge = document.getElementById('planBadge');
  const userAvatar = document.getElementById('userAvatar');
  const userName = document.getElementById('userName');
  const userRole = document.getElementById('userRole');
  const daysLeftBadge = document.getElementById('daysLeftBadge');
  const expireBanner = document.getElementById('expireBanner');
  const logoutBtn = document.getElementById('logoutBtn');

  // Sidebar Nav Tabs
  const navTabs = document.querySelectorAll('.sidebar-nav .nav-item[data-tab]');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // Courses Elements
  const statTotalCourses = document.getElementById('statTotalCourses');
  const statTotalApplied = document.getElementById('statTotalApplied');
  const statTotalWaiting = document.getElementById('statTotalWaiting');
  const statRecruiting = document.getElementById('statRecruiting');

  const filterCategory = document.getElementById('filterCategory');
  const filterStatus = document.getElementById('filterStatus');
  const filterKeyword = document.getElementById('filterKeyword');
  const searchBtn = document.getElementById('searchBtn');
  const excelExportBtn = document.getElementById('excelExportBtn');
  const courseTableBody = document.getElementById('courseTableBody');
  const selectAll = document.getElementById('selectAll');

  const openAddCourseModalBtn = document.getElementById('openAddCourseModalBtn');
  const addCourseModal = document.getElementById('addCourseModal');
  const closeCourseModalBtn = document.getElementById('closeCourseModalBtn');
  const cancelCourseBtn = document.getElementById('cancelCourseBtn');
  const addCourseForm = document.getElementById('addCourseForm');

  // Applicants Elements
  const statApprovedApplicants = document.getElementById('statApprovedApplicants');
  const statPendingApplicants = document.getElementById('statPendingApplicants');
  const statVoucherApplicants = document.getElementById('statVoucherApplicants');
  const applicantFilterStatus = document.getElementById('applicantFilterStatus');
  const applicantFilterKeyword = document.getElementById('applicantFilterKeyword');
  const applicantSearchBtn = document.getElementById('applicantSearchBtn');
  const applicantTableBody = document.getElementById('applicantTableBody');

  // Waitlist Elements
  const statTotalWaitlist = document.getElementById('statTotalWaitlist');
  const statRank1Waitlist = document.getElementById('statRank1Waitlist');
  const waitlistFilterKeyword = document.getElementById('waitlistFilterKeyword');
  const waitlistSearchBtn = document.getElementById('waitlistSearchBtn');
  const waitlistTableBody = document.getElementById('waitlistTableBody');

  // Settlement Elements
  const statTotalSettlementAmt = document.getElementById('statTotalSettlementAmt');
  const statTotalRefundAmt = document.getElementById('statTotalRefundAmt');
  const statPendingSettlements = document.getElementById('statPendingSettlements');
  const settlementFilterType = document.getElementById('settlementFilterType');
  const settlementFilterKeyword = document.getElementById('settlementFilterKeyword');
  const settlementSearchBtn = document.getElementById('settlementSearchBtn');
  const settlementTableBody = document.getElementById('settlementTableBody');

  const openAddSettlementModalBtn = document.getElementById('openAddSettlementModalBtn');
  const addSettlementModal = document.getElementById('addSettlementModal');
  const closeSettlementModalBtn = document.getElementById('closeSettlementModalBtn');
  const cancelSettlementBtn = document.getElementById('cancelSettlementBtn');
  const addSettlementForm = document.getElementById('addSettlementForm');

  // Subscription Modal Elements
  const renewSubscriptionBtn = document.getElementById('renewSubscriptionBtn');
  const bannerRenewBtn = document.getElementById('bannerRenewBtn');
  const renewModal = document.getElementById('renewModal');
  const closeRenewModalBtn = document.getElementById('closeRenewModalBtn');
  const confirmRenewBtn = document.getElementById('confirmRenewBtn');
  const renewMonthsSelect = document.getElementById('renewMonths');

  // Data Caches
  let currentCourses = [];
  let currentApplicants = [];
  let currentWaitlist = [];
  let currentSettlements = [];
  let currentUser = null;

  // ==================== TAB SWITCHING ====================
  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = tab.dataset.tab;

      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      tabPanes.forEach(pane => {
        pane.style.display = pane.id === `tab-${targetTab}` ? 'block' : 'none';
      });

      // Trigger data fetch for activated tab
      if (targetTab === 'courses') fetchCourses();
      else if (targetTab === 'applicants') fetchApplicants();
      else if (targetTab === 'waitlist') fetchWaitlist();
      else if (targetTab === 'settlements') fetchSettlements();
    });
  });

  // 1. Fetch User Info
  async function fetchMe() {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (!data.success) {
        alert(data.message || '인증 정보가 올바르지 않습니다.');
        logout();
        return;
      }

      currentUser = data.user;
      renderUserInfo(currentUser);
      fetchCourses();
    } catch (err) {
      console.error('Fetch Me Error:', err);
      logout();
    }
  }

  function renderUserInfo(user) {
    schoolTitle.textContent = user.schoolName || '방과후 늘봄학교';
    planBadge.textContent = (user.plan || 'Standard').toUpperCase() + ' PLAN';
    userAvatar.textContent = user.name ? user.name.charAt(0) : '교';
    userName.textContent = user.name + ' 선생님';
    userRole.textContent = user.role === 'school_admin' ? '학교 관리자' : '교사';

    daysLeftBadge.textContent = `${user.daysLeft}일 남음`;
    if (user.daysLeft <= 30) {
      expireBanner.style.display = 'flex';
    } else {
      expireBanner.style.display = 'none';
    }
  }

  // ==================== 1. TAB: COURSES ====================
  async function fetchCourses() {
    try {
      const res = await fetch('/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        currentCourses = data.courses;
        renderCourseTable(currentCourses);
      }
    } catch (err) {
      console.error('Fetch Courses Error:', err);
    }
  }

  function renderCourseTable(courses) {
    let totalApplied = 0;
    let totalWaiting = 0;
    let recruitingCount = 0;

    const cat = filterCategory.value;
    const stat = filterStatus.value;
    const kw = filterKeyword.value.trim().toLowerCase();

    const filtered = courses.filter(c => {
      if (cat && !c.category.includes(cat)) return false;
      if (stat && c.status !== stat) return false;
      if (kw && !c.title.toLowerCase().includes(kw) && !c.teacherName.toLowerCase().includes(kw)) return false;
      return true;
    });

    courses.forEach(c => {
      totalApplied += (c.applied || 0);
      totalWaiting += (c.waiting || 0);
      if (c.status === '모집중') recruitingCount++;
    });

    statTotalCourses.textContent = courses.length;
    statTotalApplied.textContent = totalApplied;
    statTotalWaiting.textContent = totalWaiting;
    statRecruiting.textContent = recruitingCount;

    courseTableBody.innerHTML = '';

    if (filtered.length === 0) {
      courseTableBody.innerHTML = `
        <tr>
          <td colspan="12" style="text-align: center; padding: 40px; color: var(--text-muted);">
            조회된 강좌 내역이 없습니다.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach((c, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="checkbox" class="course-check" value="${c.id}"></td>
        <td>${c.code || (idx + 1)}</td>
        <td><span class="badge-pill badge-primary">${c.category}</span></td>
        <td style="font-weight: 700;">${c.title}</td>
        <td>${c.teacherName}</td>
        <td>${c.applied} / ${c.capacity}</td>
        <td>${c.waiting} / ${c.waitingCapacity || 5}</td>
        <td>${c.grade}</td>
        <td>${c.schedule}</td>
        <td>${c.fee ? c.fee.toLocaleString() + '원' : '무료'}</td>
        <td>
          <span class="badge-pill ${c.status === '모집중' ? 'badge-success' : 'badge-warning'}">
            ${c.status}
          </span>
        </td>
        <td>
          <button class="action-btn-del del-course-btn" data-id="${c.id}" title="강좌 삭제">🗑️</button>
        </td>
      `;
      courseTableBody.appendChild(tr);
    });

    document.querySelectorAll('.del-course-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (confirm('해당 강좌를 정말 삭제하시겠습니까?')) {
          await deleteCourse(id);
        }
      });
    });
  }

  async function deleteCourse(id) {
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) fetchCourses();
      else alert(data.message || '삭제 실패');
    } catch (err) {
      alert('오류 발생');
    }
  }

  addCourseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newCourseData = {
      category: document.getElementById('newCategory').value.trim(),
      title: document.getElementById('newTitle').value.trim(),
      teacherName: document.getElementById('newTeacher').value.trim(),
      grade: document.getElementById('newGrade').value.trim(),
      capacity: document.getElementById('newCapacity').value,
      waitingCapacity: document.getElementById('newWaitingCapacity').value,
      schedule: document.getElementById('newSchedule').value.trim(),
      fee: document.getElementById('newFee').value,
      materialFee: document.getElementById('newMaterialFee') ? document.getElementById('newMaterialFee').value : 0,
      autoRenew: document.getElementById('newAutoRenew') ? document.getElementById('newAutoRenew').value : 'Y'
    };

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCourseData)
      });
      const data = await res.json();

      if (data.success) {
        alert('🎉 새 강좌가 등록되었습니다.');
        addCourseModal.style.display = 'none';
        addCourseForm.reset();
        fetchCourses();
      } else {
        alert(data.message || '강좌 등록 실패');
      }
    } catch (err) {
      alert('서버 등록 실패');
    }
  });

  const autoRenewCoursesBtn = document.getElementById('autoRenewCoursesBtn');
  if (autoRenewCoursesBtn) {
    autoRenewCoursesBtn.addEventListener('click', async () => {
      if (confirm('월별 수강 자동 연장을 실행하시겠습니까?\n자동 연동 설정된 강좌의 수강생이 이월 연장 처리됩니다.')) {
        try {
          const res = await fetch('/api/courses/auto-renew', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          alert(`🎉 ${data.message}`);
          fetchCourses();
        } catch (err) {
          alert('자동 연장 처리 중 오류가 발생했습니다.');
        }
      }
    });
  }

  const executeLotteryBtn = document.getElementById('executeLotteryBtn');
  if (executeLotteryBtn) {
    executeLotteryBtn.addEventListener('click', async () => {
      if (confirm('정원 초과 강좌의 공정 무작위 추첨을 실행하시겠습니까?\n추첨 완료 후 당첨자는 자동 승인되며, 미당첨자는 대기 순번이 할당됩니다.')) {
        try {
          const res = await fetch('/api/lottery/execute', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ courseId: 'crs_3' })
          });
          const data = await res.json();
          if (data.success) {
            alert(data.message);
            fetchCourses();
          } else {
            alert(data.message || '추첨 실행 실패');
          }
        } catch (err) {
          alert('추첨 처리 중 오류가 발생했습니다.');
        }
      }
    });
  }

  const edufineExportBtn = document.getElementById('edufineExportBtn');
  if (edufineExportBtn) {
    edufineExportBtn.addEventListener('click', async () => {
      try {
        const res = await fetch('/api/financials/edufine', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success && data.edufineData) {
          const worksheet = XLSX.utils.json_to_sheet(data.edufineData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, '에듀파인 강사료수용비집계');
          XLSX.writeFile(workbook, `에듀파인_늘봄학교_강사료수용비정산_${new Date().toISOString().split('T')[0]}.xlsx`);
        }
      } catch (err) {
        alert('에듀파인 엑셀 출력 실패');
      }
    });
  }

  // Excel Download (.xlsx)
  excelExportBtn.addEventListener('click', () => {
    if (currentCourses.length === 0) {
      alert('내보낼 강좌 데이터가 없습니다.');
      return;
    }

    const exportData = currentCourses.map((c, index) => ({
      '연번': index + 1,
      '강좌코드': c.code || '',
      '구분': c.category || '',
      '강좌명': c.title || '',
      '강사명': c.teacherName || '',
      '신청인원': c.applied || 0,
      '모집정원': c.capacity || 0,
      '대기인원': c.waiting || 0,
      '대기정원': c.waitingCapacity || 0,
      '대상학년': c.grade || '',
      '강의시간': c.schedule || '',
      '수강료(원)': c.fee || 0,
      '상태': c.status || ''
    }));

    const todayStr = new Date().toISOString().split('T')[0];
    const fileName = `늘봄학교_강좌목록_${todayStr}.xlsx`;

    if (typeof XLSX !== 'undefined') {
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      worksheet['!cols'] = [
        { wch: 6 }, { wch: 10 }, { wch: 16 }, { wch: 32 }, { wch: 14 },
        { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 14 },
        { wch: 22 }, { wch: 14 }, { wch: 10 }
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '강좌목록');
      XLSX.writeFile(workbook, fileName);
    } else {
      let tableHtml = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"/></head><body><table border="1">';
      tableHtml += '<tr><th>연번</th><th>강좌코드</th><th>구분</th><th>강좌명</th><th>강사명</th><th>신청인원</th><th>모집정원</th><th>대기인원</th><th>대기정원</th><th>대상학년</th><th>강의시간</th><th>수강료</th><th>상태</th></tr>';
      exportData.forEach(row => {
        tableHtml += `<tr><td>${row['연번']}</td><td>${row['강좌코드']}</td><td>${row['구분']}</td><td>${row['강좌명']}</td><td>${row['강사명']}</td><td>${row['신청인원']}</td><td>${row['모집정원']}</td><td>${row['대기인원']}</td><td>${row['대기정원']}</td><td>${row['대상학년']}</td><td>${row['강의시간']}</td><td>${row['수강료(원)']}</td><td>${row['상태']}</td></tr>`;
      });
      tableHtml += '</table></body></html>';

      const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.replace('.xlsx', '.xls');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });

  // ==================== 2. TAB: APPLICANTS ====================
  async function fetchApplicants() {
    try {
      const res = await fetch('/api/applicants', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        currentApplicants = data.applicants;
        renderApplicantTable(currentApplicants);
      }
    } catch (err) {
      console.error('Fetch Applicants Error:', err);
    }
  }

  function renderApplicantTable(applicants) {
    let approvedCount = 0;
    let pendingCount = 0;
    let voucherCount = 0;

    const stat = applicantFilterStatus.value;
    const kw = applicantFilterKeyword.value.trim().toLowerCase();

    const filtered = applicants.filter(a => {
      if (stat && a.status !== stat) return false;
      if (kw && !a.studentName.toLowerCase().includes(kw) && !a.gradeClass.toLowerCase().includes(kw) && !a.courseTitle.toLowerCase().includes(kw)) return false;
      return true;
    });

    applicants.forEach(a => {
      if (a.status === '승인') approvedCount++;
      if (a.status === '신청대기') pendingCount++;
      if (a.subsidyType === '자유수강권') voucherCount++;
    });

    statApprovedApplicants.textContent = approvedCount;
    statPendingApplicants.textContent = pendingCount;
    statVoucherApplicants.textContent = voucherCount;

    applicantTableBody.innerHTML = '';

    if (filtered.length === 0) {
      applicantTableBody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 40px; color: var(--text-muted);">
            조회된 수강 신청자 내역이 없습니다.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach((a, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td style="font-weight: 700;">${a.studentName}</td>
        <td>${a.gradeClass}</td>
        <td>${a.parentPhone}</td>
        <td>${a.courseTitle}</td>
        <td>${a.appliedAt}</td>
        <td><span class="badge-pill badge-primary">${a.subsidyType}</span></td>
        <td>${a.paymentStatus}</td>
        <td>
          <span class="badge-pill ${a.status === '승인' ? 'badge-success' : 'badge-warning'}">
            ${a.status}
          </span>
        </td>
        <td>
          ${a.status === '신청대기' ? `<button class="btn-secondary approve-applicant-btn" data-id="${a.id}" style="padding: 4px 8px; font-size: 0.8rem; background: #10b981; color: white;">승인</button>` : `<button class="btn-secondary revoke-applicant-btn" data-id="${a.id}" style="padding: 4px 8px; font-size: 0.8rem; background: #6b7280; color: white;">대기전환</button>`}
          <button class="action-btn-del del-applicant-btn" data-id="${a.id}" title="신청 삭제">🗑️</button>
        </td>
      `;
      applicantTableBody.appendChild(tr);
    });

    document.querySelectorAll('.approve-applicant-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        await updateApplicantStatus(e.target.dataset.id, '승인');
      });
    });

    document.querySelectorAll('.revoke-applicant-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        await updateApplicantStatus(e.target.dataset.id, '신청대기');
      });
    });

    document.querySelectorAll('.del-applicant-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (confirm('해당 수강 신청 내역을 삭제하시겠습니까?')) {
          await deleteApplicant(e.target.dataset.id);
        }
      });
    });
  }

  async function updateApplicantStatus(id, status) {
    try {
      const res = await fetch(`/api/applicants/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) fetchApplicants();
      else alert(data.message || '상태 변경 실패');
    } catch (err) {
      alert('오류 발생');
    }
  }

  async function deleteApplicant(id) {
    try {
      const res = await fetch(`/api/applicants/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) fetchApplicants();
      else alert(data.message || '삭제 실패');
    } catch (err) {
      alert('오류 발생');
    }
  }

  // ==================== 3. TAB: WAITLIST ====================
  async function fetchWaitlist() {
    try {
      const res = await fetch('/api/waitlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        currentWaitlist = data.waitlist;
        renderWaitlistTable(currentWaitlist);
      }
    } catch (err) {
      console.error('Fetch Waitlist Error:', err);
    }
  }

  function renderWaitlistTable(waitlist) {
    let rank1Count = 0;
    const kw = waitlistFilterKeyword.value.trim().toLowerCase();

    const filtered = waitlist.filter(w => {
      if (kw && !w.studentName.toLowerCase().includes(kw) && !w.courseTitle.toLowerCase().includes(kw)) return false;
      return true;
    });

    waitlist.forEach(w => {
      if (w.rank === 1) rank1Count++;
    });

    statTotalWaitlist.textContent = waitlist.length;
    statRank1Waitlist.textContent = rank1Count;

    waitlistTableBody.innerHTML = '';

    if (filtered.length === 0) {
      waitlistTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
            조회된 대기자 내역이 없습니다.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach((w) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="badge-pill badge-warning" style="font-weight: 700;">#${w.rank}순위</span></td>
        <td style="font-weight: 700;">${w.studentName}</td>
        <td>${w.gradeClass}</td>
        <td>${w.parentPhone}</td>
        <td>${w.courseTitle}</td>
        <td>${w.appliedAt}</td>
        <td><span class="badge-pill badge-warning">${w.status}</span></td>
        <td>
          <button class="btn-primary promote-waitlist-btn" data-id="${w.id}" style="padding: 4px 10px; font-size: 0.8rem; background: #4f46e5; width: auto;">
            ⚡ 수강 승인 전환
          </button>
          <button class="action-btn-del del-waitlist-btn" data-id="${w.id}" title="대기 취소">🗑️</button>
        </td>
      `;
      waitlistTableBody.appendChild(tr);
    });

    document.querySelectorAll('.promote-waitlist-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (confirm('해당 대기 학생을 수강 승인 완료자로 전환하시겠습니까?')) {
          await promoteWaitlist(e.target.dataset.id);
        }
      });
    });

    document.querySelectorAll('.del-waitlist-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (confirm('대기자 명단에서 삭제하시겠습니까?')) {
          await deleteWaitlist(e.target.dataset.id);
        }
      });
    });
  }

  async function promoteWaitlist(id) {
    try {
      const res = await fetch(`/api/waitlist/${id}/promote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert('🎉 대기자가 성공적으로 수강 신청 승인 처리되었습니다!');
        fetchWaitlist();
      } else {
        alert(data.message || '전환 실패');
      }
    } catch (err) {
      alert('오류 발생');
    }
  }

  async function deleteWaitlist(id) {
    try {
      const res = await fetch(`/api/waitlist/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) fetchWaitlist();
      else alert(data.message || '삭제 실패');
    } catch (err) {
      alert('오류 발생');
    }
  }

  // ==================== 4. TAB: SETTLEMENTS ====================
  async function fetchSettlements() {
    try {
      const res = await fetch('/api/settlements', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        currentSettlements = data.settlements;
        renderSettlementTable(currentSettlements);
      }
    } catch (err) {
      console.error('Fetch Settlements Error:', err);
    }
  }

  function renderSettlementTable(settlements) {
    let totalAmt = 0;
    let totalRefund = 0;
    let pendingCount = 0;

    const tp = settlementFilterType.value;
    const kw = settlementFilterKeyword.value.trim().toLowerCase();

    const filtered = settlements.filter(s => {
      if (tp && !s.type.includes(tp)) return false;
      if (kw && !s.studentName.toLowerCase().includes(kw) && !s.courseTitle.toLowerCase().includes(kw)) return false;
      return true;
    });

    settlements.forEach(s => {
      totalAmt += (s.amount || 0);
      if (s.type.includes('환불') && s.status.includes('완료')) totalRefund += (s.amount || 0);
      if (s.status.includes('대기') || s.status.includes('신청')) pendingCount++;
    });

    statTotalSettlementAmt.textContent = `${totalAmt.toLocaleString()}원`;
    statTotalRefundAmt.textContent = `${totalRefund.toLocaleString()}원`;
    statPendingSettlements.textContent = `${pendingCount}건`;

    settlementTableBody.innerHTML = '';

    if (filtered.length === 0) {
      settlementTableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">
            조회된 정산/환불 내역이 없습니다.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach((s, idx) => {
      const isComplete = s.status === '정산완료' || s.status === '환불완료';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><span class="badge-pill ${s.type.includes('환불') ? 'badge-warning' : 'badge-primary'}">${s.type}</span></td>
        <td style="font-weight: 700;">${s.studentName}</td>
        <td>${s.courseTitle}</td>
        <td style="font-weight: 700; color: #4f46e5;">${s.amount.toLocaleString()}원</td>
        <td>${s.requestedAt}</td>
        <td>
          <span class="badge-pill ${isComplete ? 'badge-success' : 'badge-warning'}">
            ${s.status}
          </span>
        </td>
        <td style="font-size: 0.85rem; color: var(--text-muted);">${s.note || '-'}</td>
        <td>
          ${!isComplete ? `<button class="btn-primary complete-settlement-btn" data-id="${s.id}" data-type="${s.type}" style="padding: 4px 8px; font-size: 0.8rem; background: #10b981; width: auto;">승인 완료</button>` : '<span style="color:#10b981; font-weight:600;">✓ 처리완료</span>'}
        </td>
      `;
      settlementTableBody.appendChild(tr);
    });

    document.querySelectorAll('.complete-settlement-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        const type = e.target.dataset.type;
        const targetStatus = type.includes('환불') ? '환불완료' : '정산완료';
        if (confirm(`해당 건을 '${targetStatus}' 상태로 승인 완료 처리하시겠습니까?`)) {
          await updateSettlementStatus(id, targetStatus);
        }
      });
    });
  }

  async function updateSettlementStatus(id, status) {
    try {
      const res = await fetch(`/api/settlements/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) fetchSettlements();
      else alert(data.message || '상태 변경 실패');
    } catch (err) {
      alert('오류 발생');
    }
  }

  addSettlementForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const stlData = {
      type: document.getElementById('stlType').value,
      studentName: document.getElementById('stlStudentName').value.trim(),
      amount: document.getElementById('stlAmount').value,
      courseTitle: document.getElementById('stlCourseTitle').value.trim(),
      note: document.getElementById('stlNote').value.trim()
    };

    try {
      const res = await fetch('/api/settlements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(stlData)
      });
      const data = await res.json();

      if (data.success) {
        alert('🎉 정산/환불 건이 성공적으로 등록되었습니다.');
        addSettlementModal.style.display = 'none';
        addSettlementForm.reset();
        fetchSettlements();
      } else {
        alert(data.message || '등록 실패');
      }
    } catch (err) {
      alert('서버 오류 발생');
    }
  });

  // ==================== COMMON EVENT LISTENERS ====================
  searchBtn.addEventListener('click', () => renderCourseTable(currentCourses));
  filterCategory.addEventListener('change', () => renderCourseTable(currentCourses));
  filterStatus.addEventListener('change', () => renderCourseTable(currentCourses));
  filterKeyword.addEventListener('keyup', (e) => { if (e.key === 'Enter') renderCourseTable(currentCourses); });

  applicantSearchBtn.addEventListener('click', () => renderApplicantTable(currentApplicants));
  applicantFilterStatus.addEventListener('change', () => renderApplicantTable(currentApplicants));
  applicantFilterKeyword.addEventListener('keyup', (e) => { if (e.key === 'Enter') renderApplicantTable(currentApplicants); });

  waitlistSearchBtn.addEventListener('click', () => renderWaitlistTable(currentWaitlist));
  waitlistFilterKeyword.addEventListener('keyup', (e) => { if (e.key === 'Enter') renderWaitlistTable(currentWaitlist); });

  settlementSearchBtn.addEventListener('click', () => renderSettlementTable(currentSettlements));
  settlementFilterType.addEventListener('change', () => renderSettlementTable(currentSettlements));
  settlementFilterKeyword.addEventListener('keyup', (e) => { if (e.key === 'Enter') renderSettlementTable(currentSettlements); });

  openAddCourseModalBtn.addEventListener('click', () => addCourseModal.style.display = 'flex');
  closeCourseModalBtn.addEventListener('click', () => addCourseModal.style.display = 'none');
  cancelCourseBtn.addEventListener('click', () => addCourseModal.style.display = 'none');

  openAddSettlementModalBtn.addEventListener('click', () => addSettlementModal.style.display = 'flex');
  closeSettlementModalBtn.addEventListener('click', () => addSettlementModal.style.display = 'none');
  cancelSettlementBtn.addEventListener('click', () => addSettlementModal.style.display = 'none');

  renewSubscriptionBtn.addEventListener('click', () => renewModal.style.display = 'flex');
  bannerRenewBtn.addEventListener('click', () => renewModal.style.display = 'flex');
  closeRenewModalBtn.addEventListener('click', () => renewModal.style.display = 'none');

  confirmRenewBtn.addEventListener('click', async () => {
    const months = renewMonthsSelect.value;
    try {
      const res = await fetch('/api/subscription/renew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ months })
      });
      const data = await res.json();

      if (data.success) {
        alert(`💳 ${data.message}\n만료일: ${data.expireDate} (${data.daysLeft}일 남음)`);
        renewModal.style.display = 'none';
        fetchMe();
      } else {
        alert(data.message || '연장 실패');
      }
    } catch (err) {
      alert('결제 연동 실패');
    }
  });

  selectAll.addEventListener('change', (e) => {
    document.querySelectorAll('.course-check').forEach(chk => chk.checked = e.target.checked);
  });

  logoutBtn.addEventListener('click', logout);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../login/login.html';
  }

  // Initialize
  fetchMe();
});