document.addEventListener('DOMContentLoaded', () => {
  const schoolCode = 'UNCHON2025';
  const parentPhoneInput = document.getElementById('parentPhone');
  const parentStudentNameInput = document.getElementById('parentStudentName');
  const parentGradeClassInput = document.getElementById('parentGradeClass');
  const parentSubsidyTypeSelect = document.getElementById('parentSubsidyType');
  const lookupMyAppsBtn = document.getElementById('lookupMyAppsBtn');
  const parentCourseList = document.getElementById('parentCourseList');
  const myApplicantList = document.getElementById('myApplicantList');
  const myWaitlistList = document.getElementById('myWaitlistList');
  const toastAlert = document.getElementById('toastAlert');

  const tabBtns = document.querySelectorAll('.tab-btn-mobile');
  const tabPanes = document.querySelectorAll('.tab-view-pane');

  let currentCourses = [];

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabPanes.forEach(p => p.style.display = 'none');
      if (target === 'apply') {
        document.getElementById('tab-apply-view').style.display = 'block';
      } else {
        document.getElementById('tab-my-view').style.display = 'block';
        fetchMyApplications();
      }
    });
  });

  // 1. Fetch Public Course List
  async function fetchPublicCourses() {
    try {
      const res = await fetch(`/api/parent/courses?schoolCode=${schoolCode}`);
      const data = await res.json();

      if (data.success) {
        currentCourses = data.courses;
        document.getElementById('parentSchoolTag').textContent = `🏫 ${data.schoolName}`;
        renderCourseCards(currentCourses);
      }
    } catch (err) {
      showToast('강좌 목록을 불러오지 못했습니다.', true);
    }
  }

  function renderCourseCards(courses) {
    parentCourseList.innerHTML = '';

    if (courses.length === 0) {
      parentCourseList.innerHTML = '<p style="text-align:center; padding:30px; color:#64748b;">개설된 강좌가 없습니다.</p>';
      return;
    }

    courses.forEach(c => {
      const percent = Math.min(100, Math.round((c.applied / c.capacity) * 100));
      const isFull = c.applied >= c.capacity;
      const card = document.createElement('div');
      card.className = 'course-card-mobile';

      card.innerHTML = `
        <div class="course-header-mobile">
          <span class="course-cat">${c.category}</span>
          <span style="font-size:0.75rem; color:${c.autoRenew === 'Y' ? '#10b981' : '#64748b'}; font-weight:600;">
            ${c.autoRenew === 'Y' ? '🔄 월 자동연장' : '1개월 매회신청'}
          </span>
        </div>
        <div class="course-title-mobile">${c.title}</div>
        <div class="course-info-list">
          <div>👨‍🏫 강사: ${c.teacherName}</div>
          <div>⏰ 시간: <strong>${c.schedule}</strong></div>
          <div>🎯 대상: ${c.grade} | 정원: ${c.capacity}명</div>
        </div>

        <div style="display:flex; justify-between; font-size:0.75rem; margin-bottom:4px; font-weight:600;">
          <span>신청 현황 (${c.applied}/${c.capacity}명)</span>
          <span style="color:${isFull ? '#ef4444' : '#10b981'};">${isFull ? '대기 접수중' : '신청 가능'}</span>
        </div>
        <div class="seat-gauge">
          <div class="seat-fill" style="width: ${percent}%; background:${isFull ? '#f59e0b' : '#10b981'}"></div>
        </div>

        <div class="price-row">
          <div>
            <div class="price-text">${c.fee ? c.fee.toLocaleString() + '원' : '무료 (지원금 대상)'}</div>
            <div class="material-text">교재/재료비: ${c.materialFee ? c.materialFee.toLocaleString() + '원 (별도)' : '포함/없음'}</div>
          </div>
          <button class="btn-mobile-primary apply-course-btn" data-id="${c.id}" style="width:auto; padding:8px 16px; font-size:0.85rem; background:${isFull ? '#f59e0b' : '#4f46e5'};">
            ${isFull ? '⏳ 대기 신청' : '⚡ 원클릭 신청'}
          </button>
        </div>
      `;
      parentCourseList.appendChild(card);
    });

    document.querySelectorAll('.apply-course-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        applyCourse(id);
      });
    });
  }

  // 2. Apply for Course
  async function applyCourse(courseId) {
    const studentName = parentStudentNameInput.value.trim();
    const parentPhone = parentPhoneInput.value.trim();
    const gradeClass = parentGradeClassInput.value.trim();
    const subsidyType = parentSubsidyTypeSelect.value;

    if (!studentName || !parentPhone) {
      showToast('보호자 연락처와 학생 이름을 입력해 주세요.', true);
      return;
    }

    try {
      const res = await fetch('/api/parent/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolCode,
          studentName,
          gradeClass,
          parentPhone,
          courseId,
          subsidyType
        })
      });

      const data = await res.json();

      if (data.success) {
        showToast(data.message, false);
        fetchPublicCourses();
      } else {
        showToast(data.message || '신청 실패', true);
      }
    } catch (err) {
      showToast('서버 신청 오류가 발생했습니다.', true);
    }
  }

  // 3. Fetch My Applications & Waitlist
  async function fetchMyApplications() {
    const parentPhone = parentPhoneInput.value.trim();
    if (!parentPhone) return;

    try {
      const res = await fetch(`/api/parent/lookup?phone=${encodeURIComponent(parentPhone)}&schoolCode=${schoolCode}`);
      const data = await res.json();

      if (data.success) {
        renderMyApplicants(data.applicants);
        renderMyWaitlist(data.waitlist);
      }
    } catch (err) {
      console.error('Fetch My Apps Error:', err);
    }
  }

  function renderMyApplicants(applicants) {
    myApplicantList.innerHTML = '';

    if (applicants.length === 0) {
      myApplicantList.innerHTML = '<p style="color:#64748b; font-size:0.85rem;">승인 완료된 수강 내역이 없습니다.</p>';
      return;
    }

    applicants.forEach(a => {
      const div = document.createElement('div');
      div.className = 'course-card-mobile';
      div.style.borderLeft = '4px solid #10b981';
      div.innerHTML = `
        <div style="font-weight:700; font-size:0.95rem; margin-bottom:4px;">${a.courseTitle}</div>
        <div style="font-size:0.8rem; color:#64748b;">학생: ${a.studentName} (${a.gradeClass}) | ${a.appliedAt}</div>
        <div style="margin-top:8px; font-size:0.8rem;"><span style="background:#ecfdf5; color:#10b981; padding:2px 8px; border-radius:10px; font-weight:700;">✅ 수강 승인 완료 (${a.subsidyType})</span></div>
      `;
      myApplicantList.appendChild(div);
    });
  }

  function renderMyWaitlist(waitlist) {
    myWaitlistList.innerHTML = '';

    if (waitlist.length === 0) {
      myWaitlistList.innerHTML = '<p style="color:#64748b; font-size:0.85rem;">대기자 내역이 없습니다.</p>';
      return;
    }

    waitlist.forEach(w => {
      const div = document.createElement('div');
      div.className = 'course-card-mobile';
      div.style.borderLeft = '4px solid #f59e0b';
      div.innerHTML = `
        <div style="font-weight:700; font-size:0.95rem; margin-bottom:4px;">${w.courseTitle}</div>
        <div style="font-size:0.8rem; color:#64748b;">학생: ${w.studentName} (${w.gradeClass}) | ${w.appliedAt}</div>
        <div style="margin-top:8px; font-size:0.8rem;"><span style="background:#fffbe6; color:#d97706; padding:2px 8px; border-radius:10px; font-weight:700;">⌛ 대기 순번 #${w.rank}순위</span></div>
      `;
      myWaitlistList.appendChild(div);
    });
  }

  lookupMyAppsBtn.addEventListener('click', fetchMyApplications);

  function showToast(msg, isError) {
    toastAlert.textContent = msg;
    toastAlert.className = `alert-toast ${isError ? 'alert-danger' : 'alert-success'}`;
    toastAlert.style.display = 'block';
    setTimeout(() => {
      toastAlert.style.display = 'none';
    }, 4000);
  }

  // Initialize
  fetchPublicCourses();
});
