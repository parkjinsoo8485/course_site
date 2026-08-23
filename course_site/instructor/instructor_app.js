document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.replace('/af/ad_lec/lists/sn/3267');
    return;
  }

  const navItems = document.querySelectorAll('.inst-nav-item');
  const tabPanes = document.querySelectorAll('.inst-tab-pane');

  const instCourseCount = document.getElementById('instCourseCount');
  const instStudentCount = document.getElementById('instStudentCount');
  const instRevenueCount = document.getElementById('instRevenueCount');
  const instCourseTable = document.getElementById('instCourseTable');

  const calcFee = document.getElementById('calcFee');
  const calcTotalDays = document.getElementById('calcTotalDays');
  const calcAttendedDays = document.getElementById('calcAttendedDays');
  const runCalcBtn = document.getElementById('runCalcBtn');
  const calcResultBox = document.getElementById('calcResultBox');
  const instQAList = document.getElementById('instQAList');

  // Tab switching
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const target = item.dataset.tab;
      if (!target) return; // For external links
      e.preventDefault();

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      tabPanes.forEach(p => p.style.display = 'none');
      document.getElementById(`tab-${target}`).style.display = 'block';

      if (target === 'qa') fetchQA();
    });
  });

  async function fetchInstructorData() {
    try {
      const res = await fetch('/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        renderDashboard(data.courses);
      }
    } catch (err) {
      console.error('Fetch Instructor Courses Error:', err);
    }
  }

  function renderDashboard(courses) {
    instCourseCount.textContent = `${courses.length}개`;

    let totalStudents = 0;
    let totalRev = 0;

    instCourseTable.innerHTML = '';
    courses.forEach(c => {
      totalStudents += (c.applied || 0);
      totalRev += (c.applied || 0) * (c.fee || 0) * 0.8; // 80% 강사 수강료

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span style="background:#eef2ff; color:#4f46e5; padding:2px 8px; border-radius:6px; font-size:0.75rem; font-weight:700;">${c.category}</span></td>
        <td style="font-weight:700;">${c.title}</td>
        <td>${c.applied} / ${c.capacity}명</td>
        <td>${c.schedule}</td>
        <td>${c.fee ? c.fee.toLocaleString() + '원' : '무료'}</td>
        <td>${c.materialFee ? c.materialFee.toLocaleString() + '원' : '없음'}</td>
        <td><span style="color:#10b981; font-weight:700;">${c.autoRenew === 'Y' ? '🔄 자동연장' : '미연장'}</span></td>
      `;
      instCourseTable.appendChild(tr);
    });

    instStudentCount.textContent = `${totalStudents}명`;
    instRevenueCount.textContent = `${Math.round(totalRev).toLocaleString()}원`;
  }

  // Refund Calculator Event
  runCalcBtn.addEventListener('click', async () => {
    try {
      const res = await fetch('/api/financials/refund-calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fee: calcFee.value,
          totalDays: calcTotalDays.value,
          attendedDays: calcAttendedDays.value
        })
      });

      const data = await res.json();
      if (data.success) {
        calcResultBox.textContent = data.message;
        calcResultBox.style.display = 'block';
      }
    } catch (err) {
      alert('환불 계산 실패');
    }
  });

  // Fetch Q&A Board
  async function fetchQA() {
    try {
      const res = await fetch('/api/qa');
      const data = await res.json();

      if (data.success) {
        renderQA(data.questions);
      }
    } catch (err) {
      console.error('Fetch QA Error:', err);
    }
  }

  function renderQA(questions) {
    instQAList.innerHTML = '';

    if (questions.length === 0) {
      instQAList.innerHTML = '<p style="color:#64748b;">등록된 Q&A 문의가 없습니다.</p>';
      return;
    }

    questions.forEach(q => {
      const div = document.createElement('div');
      div.style.border = '1px solid #e2e8f0';
      div.style.borderRadius = '10px';
      div.style.padding = '16px';
      div.style.marginBottom = '12px';

      div.innerHTML = `
        <div style="font-weight:700; font-size:0.95rem; margin-bottom:4px;">Q. ${q.title}</div>
        <div style="font-size:0.8rem; color:#64748b; margin-bottom:8px;">작성자: ${q.authorName} (${q.courseTitle}) | ${q.createdAt}</div>
        <div style="font-size:0.9rem; margin-bottom:12px; background:#f8fafc; padding:10px; border-radius:6px;">${q.content}</div>

        ${q.reply ? `
          <div style="background:#ecfdf5; padding:10px; border-radius:6px; font-size:0.85rem; color:#065f46;">
            <strong>A. 강사 답변 (${q.repliedAt}):</strong><br>${q.reply}
          </div>
        ` : `
          <div style="display:flex; gap:8px;">
            <input type="text" class="reply-input" placeholder="학부모 질문에 답변 입력..." style="flex:1; padding:8px; border:1px solid #cbd5e1; border-radius:6px;">
            <button class="reply-btn" data-id="${q.id}" style="padding:8px 16px; background:#4f46e5; color:white; border:none; border-radius:6px; font-weight:700; cursor:pointer;">답변 달기</button>
          </div>
        `}
      `;
      instQAList.appendChild(div);
    });

    document.querySelectorAll('.reply-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        const input = e.target.parentElement.querySelector('.reply-input');
        const replyText = input.value.trim();

        if (!replyText) {
          alert('답변 내용을 입력해 주세요.');
          return;
        }

        try {
          const res = await fetch(`/api/qa/${id}/reply`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ reply: replyText })
          });

          const data = await res.json();
          if (data.success) {
            alert('🎉 답변이 등록되었습니다.');
            fetchQA();
          }
        } catch (err) {
          alert('답변 등록 실패');
        }
      });
    });
  }

  document.getElementById('instLogoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.replace('/af/ad_lec/lists/sn/3267');
  });

  fetchInstructorData();
});
