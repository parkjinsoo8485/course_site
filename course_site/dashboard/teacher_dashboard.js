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

  // Stats
  const statTotalCourses = document.getElementById('statTotalCourses');
  const statTotalApplied = document.getElementById('statTotalApplied');
  const statTotalWaiting = document.getElementById('statTotalWaiting');
  const statRecruiting = document.getElementById('statRecruiting');

  // Filter
  const filterCategory = document.getElementById('filterCategory');
  const filterStatus = document.getElementById('filterStatus');
  const filterKeyword = document.getElementById('filterKeyword');
  const searchBtn = document.getElementById('searchBtn');
  const excelExportBtn = document.getElementById('excelExportBtn');
  const courseTableBody = document.getElementById('courseTableBody');
  const selectAll = document.getElementById('selectAll');

  // Modals
  const openAddCourseModalBtn = document.getElementById('openAddCourseModalBtn');
  const addCourseModal = document.getElementById('addCourseModal');
  const closeCourseModalBtn = document.getElementById('closeCourseModalBtn');
  const cancelCourseBtn = document.getElementById('cancelCourseBtn');
  const addCourseForm = document.getElementById('addCourseForm');

  const renewSubscriptionBtn = document.getElementById('renewSubscriptionBtn');
  const bannerRenewBtn = document.getElementById('bannerRenewBtn');
  const renewModal = document.getElementById('renewModal');
  const closeRenewModalBtn = document.getElementById('closeRenewModalBtn');
  const confirmRenewBtn = document.getElementById('confirmRenewBtn');
  const renewMonthsSelect = document.getElementById('renewMonths');

  let currentCourses = [];
  let currentUser = null;

  // 1. Fetch Current User & School Auth Info
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

  // 2. Fetch Courses
  async function fetchCourses() {
    try {
      const res = await fetch('/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        currentCourses = data.courses;
        renderTable(currentCourses);
      }
    } catch (err) {
      console.error('Fetch Courses Error:', err);
    }
  }

  // 3. Render Course Table & Metrics
  function renderTable(courses) {
    // Metrics calculation
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
          <button class="action-btn-del" data-id="${c.id}" title="강좌 삭제">🗑️</button>
        </td>
      `;
      courseTableBody.appendChild(tr);
    });

    // Delete Event Binding
    document.querySelectorAll('.action-btn-del').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (confirm('해당 강좌를 정말 삭제하시겠습니까?')) {
          await deleteCourse(id);
        }
      });
    });
  }

  // 4. Delete Course
  async function deleteCourse(id) {
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchCourses();
      } else {
        alert(data.message || '삭제 실패');
      }
    } catch (err) {
      alert('오류 발생');
    }
  }

  // 5. Add Course Form Submit
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
      fee: document.getElementById('newFee').value
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

  // 6. Excel Export (CSV with UTF-8 BOM)
  excelExportBtn.addEventListener('click', () => {
    if (currentCourses.length === 0) {
      alert('내보낼 강좌 데이터가 없습니다.');
      return;
    }

    let csvContent = '\uFEFF'; // UTF-8 BOM for Excel kor encoding
    csvContent += '코드,구분,강좌명,강사명,신청인원,정원,대기인원,학년,강의시간,수강료,상태\n';

    currentCourses.forEach(c => {
      csvContent += `"${c.code}","${c.category}","${c.title}","${c.teacherName}",${c.applied},${c.capacity},${c.waiting},"${c.grade}","${c.schedule}",${c.fee},"${c.status}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `늘봄학교_강좌목록_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // 7. Subscription Renewal
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

  // Event Listeners for UI & Modals
  searchBtn.addEventListener('click', () => renderTable(currentCourses));
  filterCategory.addEventListener('change', () => renderTable(currentCourses));
  filterStatus.addEventListener('change', () => renderTable(currentCourses));
  filterKeyword.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') renderTable(currentCourses);
  });

  openAddCourseModalBtn.addEventListener('click', () => addCourseModal.style.display = 'flex');
  closeCourseModalBtn.addEventListener('click', () => addCourseModal.style.display = 'none');
  cancelCourseBtn.addEventListener('click', () => addCourseModal.style.display = 'none');

  renewSubscriptionBtn.addEventListener('click', () => renewModal.style.display = 'flex');
  bannerRenewBtn.addEventListener('click', () => renewModal.style.display = 'flex');
  closeRenewModalBtn.addEventListener('click', () => renewModal.style.display = 'none');

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