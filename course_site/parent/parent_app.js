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
  const parentAbsenceList = document.getElementById('parentAbsenceList');
  const toastAlert = document.getElementById('toastAlert');

  const tabBtns = document.querySelectorAll('.tab-btn-mobile');
  const tabPanes = document.querySelectorAll('.tab-view-pane');

  let currentCourses = [];

  // Tab switching helper
  function switchTab(target) {
    tabBtns.forEach(b => {
      if (b.dataset.tab === target) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    tabPanes.forEach(p => p.style.display = 'none');

    if (target === 'apply') {
      document.getElementById('tab-apply-view').style.display = 'block';
      fetchPublicCourses();
    } else if (target === 'my') {
      document.getElementById('tab-my-view').style.display = 'block';
      fetchMyApplications();
    } else if (target === 'safety') {
      document.getElementById('tab-safety-view').style.display = 'block';
      fetchSafetySchedules();
    } else if (target === 'absence') {
      document.getElementById('tab-absence-view').style.display = 'block';
      fetchParentAbsence();
    } else if (target === 'qa') {
      document.getElementById('tab-qa-view').style.display = 'block';
      fetchParentQA();
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Lookup Button click -> Switches tab to 'my' & fetches applications
  lookupMyAppsBtn.addEventListener('click', () => {
    const studentName = parentStudentNameInput.value.trim();
    switchTab('my');
    showToast(`🔍 ${studentName || '자녀'}의 신청 및 대기 현황을 조회했습니다.`, false);
  });

  // Safety Return Schedule Operations
  const saveReturnScheduleBtn = document.getElementById('saveReturnScheduleBtn');
  if (saveReturnScheduleBtn) {
    saveReturnScheduleBtn.addEventListener('click', async () => {
      const studentName = parentStudentNameInput.value.trim();
      const gradeClass = parentGradeClassInput.value.trim();
      const parentPhone = parentPhoneInput.value.trim();
      const dayOfWeek = document.getElementById('retDay').value.trim();
      const returnTime = document.getElementById('retTime').value.trim();
      const pickupPerson = document.getElementById('retPickup').value.trim();

      if (!studentName || !returnTime || !pickupPerson) {
        showToast('학생명, 귀가시간, 동행자를 입력해주세요.', true);
        return;
      }

      try {
        const res = await fetch('/api/safety/return-schedules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schoolCode, studentName, gradeClass, parentPhone, dayOfWeek, returnTime, pickupPerson
          })
        });
        const data = await res.json();
        if (data.success) {
          showToast('🎉 자녀 귀가 일정표가 등록되었습니다.', false);
          fetchSafetySchedules();
        } else {
          showToast(data.message || '등록 실패', true);
        }
      } catch (err) {
        showToast('등록 중 오류가 발생했습니다.', true);
      }
    });
  }

  async function fetchSafetySchedules() {
    const studentName = parentStudentNameInput.value.trim();
    try {
      const res = await fetch(`/api/safety/return-schedules?studentName=${encodeURIComponent(studentName)}&schoolCode=${schoolCode}`);
      const data = await res.json();
      if (data.success) {
        const container = document.getElementById('safetyScheduleList');
        container.innerHTML = '';
        if (data.schedules.length === 0) {
          container.innerHTML = '<p style="color:#64748b; font-size:0.85rem; padding:10px 0;">등록된 귀가 일정표가 없습니다.</p>';
          return;
        }
        data.schedules.forEach(s => {
          const card = document.createElement('div');
          card.className = 'course-card-mobile';
          card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div style="font-weight:700;">🚌 ${s.studentName} (${s.gradeClass})</div>
              <button class="btn-danger-sm delete-safety-btn" data-id="${s.id}">🗑️ 삭제</button>
            </div>
            <div style="font-size:0.85rem; color:#64748b; margin-top:4px;">요일: ${s.dayOfWeek} | 귀가시간: <strong>${s.returnTime}</strong></div>
            <div style="font-size:0.85rem; color:#4f46e5; font-weight:700; margin-top:4px;">동행: ${s.pickupPerson}</div>
          `;
          container.appendChild(card);
        });

        container.querySelectorAll('.delete-safety-btn').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            if (!confirm('해당 귀가 일정을 삭제하시겠습니까?')) return;
            try {
              const res = await fetch(`/api/safety/return-schedules/${id}`, { method: 'DELETE' });
              const data = await res.json();
              showToast(data.message, !data.success);
              if (data.success) fetchSafetySchedules();
            } catch (err) {
              showToast('삭제 실패', true);
            }
          });
        });
      }
    } catch (err) {}
  }

  // Absence Submit & List
  const submitAbsenceBtn = document.getElementById('submitAbsenceBtn');
  if (submitAbsenceBtn) {
    submitAbsenceBtn.addEventListener('click', async () => {
      const studentName = parentStudentNameInput.value.trim();
      const parentPhone = parentPhoneInput.value.trim();
      const courseTitle = document.getElementById('absCourseTitle').value.trim();
      const absenceDate = document.getElementById('absDate').value;
      const reason = document.getElementById('absReason').value.trim();

      if (!absenceDate || !reason) {
        showToast('결석일자와 사유를 입력하세요.', true);
        return;
      }

      try {
        const res = await fetch('/api/safety/absence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schoolCode, studentName, parentPhone, courseTitle, absenceDate, type: '결석', reason
          })
        });
        const data = await res.json();
        if (data.success) {
          showToast('🎉 결석 신청서가 강사님께 제출되었습니다.', false);
          document.getElementById('absReason').value = '';
          fetchParentAbsence();
        } else {
          showToast(data.message || '제출 실패', true);
        }
      } catch (err) {
        showToast('제출 오류', true);
      }
    });
  }

  async function fetchParentAbsence() {
    const parentPhone = parentPhoneInput.value.trim();
    if (!parentAbsenceList) return;

    try {
      const res = await fetch(`/api/parent/absence?phone=${encodeURIComponent(parentPhone)}&schoolCode=${schoolCode}`);
      const data = await res.json();
      if (data.success) {
        parentAbsenceList.innerHTML = '';
        if (data.absenceList.length === 0) {
          parentAbsenceList.innerHTML = '<p style="color:#64748b; font-size:0.85rem;">제출된 결석/조퇴 신청서가 없습니다.</p>';
          return;
        }
        data.absenceList.forEach(a => {
          const card = document.createElement('div');
          card.className = 'course-card-mobile';
          card.style.borderLeft = '4px solid #ef4444';
          card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div style="font-weight:700; font-size:0.95rem;">🤒 ${a.courseTitle}</div>
              <button class="btn-danger-sm delete-absence-btn" data-id="${a.id}">🗑️ 취소</button>
            </div>
            <div style="font-size:0.85rem; color:#64748b; margin-top:4px;">학생: ${a.studentName} | 결석일: <strong>${a.absenceDate}</strong></div>
            <div style="font-size:0.85rem; background:#fef2f2; padding:8px; border-radius:6px; margin-top:6px; color:#991b1b;">사유: ${a.reason}</div>
            <div style="font-size:0.75rem; color:#10b981; font-weight:700; margin-top:6px;">상태: ${a.status || '제출완료'}</div>
          `;
          parentAbsenceList.appendChild(card);
        });

        parentAbsenceList.querySelectorAll('.delete-absence-btn').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            if (!confirm('결석 신청을 취소하시겠습니까?')) return;
            try {
              const res = await fetch(`/api/parent/absence/${id}`, { method: 'DELETE' });
              const data = await res.json();
              showToast(data.message, !data.success);
              if (data.success) fetchParentAbsence();
            } catch (err) {
              showToast('취소 실패', true);
            }
          });
        });
      }
    } catch (err) {}
  }

  // Q&A Submit Event & List
  const submitQABtn = document.getElementById('submitQABtn');
  if (submitQABtn) {
    submitQABtn.addEventListener('click', async () => {
      const authorName = `${parentStudentNameInput.value.trim()} 보호자`;
      const title = document.getElementById('qaTitle').value.trim();
      const content = document.getElementById('qaContent').value.trim();

      if (!title || !content) {
        showToast('제목과 내용을 입력해 주세요.', true);
        return;
      }

      try {
        const res = await fetch('/api/qa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schoolCode, courseId: 'crs_3', courseTitle: '[특기적성] 창의 로봇교실 A반', authorName, title, content
          })
        });
        const data = await res.json();
        if (data.success) {
          showToast('🎉 질문이 등록되었습니다.', false);
          document.getElementById('qaTitle').value = '';
          document.getElementById('qaContent').value = '';
          fetchParentQA();
        } else {
          showToast(data.message || '등록 실패', true);
        }
      } catch (err) {
        showToast('질문 등록 실패', true);
      }
    });
  }

  async function fetchParentQA() {
    try {
      const res = await fetch(`/api/qa?schoolCode=${schoolCode}`);
      const data = await res.json();
      if (data.success) {
        const container = document.getElementById('parentQAList');
        container.innerHTML = '';
        if (data.questions.length === 0) {
          container.innerHTML = '<p style="color:#64748b; font-size:0.85rem;">등록된 질문이 없습니다.</p>';
          return;
        }
        data.questions.forEach(q => {
          const card = document.createElement('div');
          card.className = 'course-card-mobile';
          card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div style="font-weight:700; font-size:0.95rem;">Q. ${q.title}</div>
              <button class="btn-danger-sm delete-qa-btn" data-id="${q.id}">🗑️ 삭제</button>
            </div>
            <div style="font-size:0.8rem; color:#64748b; margin-top:2px;">${q.authorName} | ${q.createdAt}</div>
            <div style="font-size:0.85rem; margin-top:6px; background:#f8fafc; padding:8px; border-radius:6px;">${q.content}</div>
            ${q.reply ? `
              <div style="background:#ecfdf5; color:#065f46; padding:8px; border-radius:6px; font-size:0.85rem; margin-top:6px;">
                <strong>A. 강사 답변 (${q.repliedAt}):</strong><br>${q.reply}
              </div>
            ` : `<div style="font-size:0.75rem; color:#f59e0b; margin-top:4px;">⏳ 강사 답변 대기중</div>`}
          `;
          container.appendChild(card);
        });

        container.querySelectorAll('.delete-qa-btn').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            if (!confirm('질문 게시글을 삭제하시겠습니까?')) return;
            try {
              const res = await fetch(`/api/parent/qa/${id}`, { method: 'DELETE' });
              const data = await res.json();
              showToast(data.message, !data.success);
              if (data.success) fetchParentQA();
            } catch (err) {
              showToast('삭제 실패', true);
            }
          });
        });
      }
    } catch (err) {}
  }

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

        <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px; font-weight:600;">
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
          <div style="display:flex; gap:6px;">
            <button class="btn-secondary detail-course-btn" data-id="${c.id}" style="padding:6px 10px; font-size:0.8rem;">📋 상세</button>
            <button class="btn-mobile-primary apply-course-btn" data-id="${c.id}" style="width:auto; padding:8px 14px; font-size:0.85rem; background:${isFull ? '#f59e0b' : '#4f46e5'};">
              ${isFull ? '⏳ 대기 신청' : '⚡ 원클릭 신청'}
            </button>
          </div>
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

    document.querySelectorAll('.detail-course-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const course = currentCourses.find(c => c.id === id);
        if (course) showCourseDetailModal(course);
      });
    });
  }

  // Course Detail Modal
  function showCourseDetailModal(c) {
    const modal = document.getElementById('courseDetailModal');
    document.getElementById('modalCourseTitle').textContent = c.title;
    document.getElementById('modalCourseContent').innerHTML = `
      <p style="margin-bottom:8px;"><strong>📚 카테고리:</strong> ${c.category}</p>
      <p style="margin-bottom:8px;"><strong>👨‍🏫 담당 강사:</strong> ${c.teacherName}</p>
      <p style="margin-bottom:8px;"><strong>⏰ 수강 시간:</strong> ${c.schedule}</p>
      <p style="margin-bottom:8px;"><strong>🎯 대상 학년:</strong> ${c.grade}</p>
      <p style="margin-bottom:8px;"><strong>📅 수강 기간:</strong> ${c.period || '2026-03-01 ~ 2026-06-30'}</p>
      <p style="margin-bottom:8px;"><strong>👥 정원/대기:</strong> 정원 ${c.capacity}명 / 대기정원 ${c.waitingCapacity || 5}명</p>
      <p style="margin-bottom:8px;"><strong>💰 수강료:</strong> ${c.fee ? c.fee.toLocaleString() + '원' : '무료'}</p>
      <p style="margin-bottom:8px;"><strong>📦 교재재료비:</strong> ${c.materialFee ? c.materialFee.toLocaleString() + '원 (별도)' : '포함'}</p>
      <p style="margin-bottom:8px;"><strong>🔄 연장 정책:</strong> ${c.autoRenew === 'Y' ? '매월 자동 수강 연장 처리' : '1개월 단기 수강'}</p>
    `;
    modal.style.display = 'flex';
  }

  const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
  const closeDetailModalBtn2 = document.getElementById('closeDetailModalBtn2');
  if (closeDetailModalBtn) closeDetailModalBtn.onclick = () => document.getElementById('courseDetailModal').style.display = 'none';
  if (closeDetailModalBtn2) closeDetailModalBtn2.onclick = () => document.getElementById('courseDetailModal').style.display = 'none';

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
        fetchMyApplications();
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
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div style="font-weight:700; font-size:0.95rem; margin-bottom:4px;">${a.courseTitle}</div>
          <button class="btn-danger-sm cancel-app-btn" data-id="${a.id}">❌ 수강 취소 / 환불</button>
        </div>
        <div style="font-size:0.8rem; color:#64748b;">학생: ${a.studentName} (${a.gradeClass}) | ${a.appliedAt}</div>
        <div style="margin-top:8px; font-size:0.8rem;"><span style="background:#ecfdf5; color:#10b981; padding:2px 8px; border-radius:10px; font-weight:700;">✅ 수강 승인 완료 (${a.subsidyType})</span></div>
      `;
      myApplicantList.appendChild(div);
    });

    myApplicantList.querySelectorAll('.cancel-app-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        const parentPhone = parentPhoneInput.value.trim();
        if (!confirm('정말로 수강 신청을 취소(환불 신청)하시겠습니까?')) return;

        try {
          const res = await fetch('/api/parent/cancel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applicantId: id, parentPhone })
          });
          const data = await res.json();
          showToast(data.message, !data.success);
          if (data.success) {
            fetchMyApplications();
            fetchPublicCourses();
          }
        } catch (err) {
          showToast('취소 처리 실패', true);
        }
      });
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
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div style="font-weight:700; font-size:0.95rem; margin-bottom:4px;">${w.courseTitle}</div>
          <button class="btn-danger-sm cancel-wait-btn" data-id="${w.id}">❌ 대기 취소</button>
        </div>
        <div style="font-size:0.8rem; color:#64748b;">학생: ${w.studentName} (${w.gradeClass}) | ${w.appliedAt}</div>
        <div style="margin-top:8px; font-size:0.8rem;"><span style="background:#fffbe6; color:#d97706; padding:2px 8px; border-radius:10px; font-weight:700;">⌛ 대기 순번 #${w.rank}순위</span></div>
      `;
      myWaitlistList.appendChild(div);
    });

    myWaitlistList.querySelectorAll('.cancel-wait-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        const parentPhone = parentPhoneInput.value.trim();
        if (!confirm('대기자 신청을 취소하시겠습니까?')) return;

        try {
          const res = await fetch('/api/parent/cancel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ waitlistId: id, parentPhone })
          });
          const data = await res.json();
          showToast(data.message, !data.success);
          if (data.success) {
            fetchMyApplications();
            fetchPublicCourses();
          }
        } catch (err) {
          showToast('대기 취소 실패', true);
        }
      });
    });
  }

  // Refund Calculator Modal Handlers
  const refundCalcModal = document.getElementById('refundCalcModal');
  const openRefundCalcBtn = document.getElementById('openRefundCalcBtn');
  const closeRefundModalBtn = document.getElementById('closeRefundModalBtn');
  const closeRefundModalBtn2 = document.getElementById('closeRefundModalBtn2');
  const runRefundCalcBtn = document.getElementById('runRefundCalcBtn');
  const refundResultBox = document.getElementById('refundResultBox');

  if (openRefundCalcBtn) openRefundCalcBtn.onclick = () => refundCalcModal.style.display = 'flex';
  if (closeRefundModalBtn) closeRefundModalBtn.onclick = () => refundCalcModal.style.display = 'none';
  if (closeRefundModalBtn2) closeRefundModalBtn2.onclick = () => refundCalcModal.style.display = 'none';

  if (runRefundCalcBtn) {
    runRefundCalcBtn.addEventListener('click', async () => {
      const fee = document.getElementById('calcFee').value;
      const totalDays = document.getElementById('calcTotalDays').value;
      const attendedDays = document.getElementById('calcAttendedDays').value;

      try {
        const res = await fetch('/api/financials/refund-calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fee, totalDays, attendedDays })
        });
        const data = await res.json();
        if (data.success) {
          refundResultBox.style.display = 'block';
          refundResultBox.innerHTML = `
            💰 예상 환불 금액: <span style="font-size:1.2rem; color:#059669; font-weight:800;">${data.refundAmount.toLocaleString()}원</span><br>
            <span style="font-size:0.75rem; color:#64748b; font-weight:normal;">(${data.message})</span>
          `;
        }
      } catch (err) {
        showToast('환불 계산 오류', true);
      }
    });
  }

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
