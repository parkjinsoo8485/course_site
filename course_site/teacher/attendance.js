document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.replace('/af/ad_lec/lists/sn/3267');
    return;
  }

  const courseSelect = document.getElementById('courseSelect');
  const studentList = document.getElementById('studentList');
  const saveAttendanceBtn = document.getElementById('saveAttendanceBtn');
  const todayDateTag = document.getElementById('todayDateTag');

  const todayStr = new Date().toISOString().split('T')[0];
  todayDateTag.textContent = `📅 ${todayStr}`;

  let courses = [];
  let applicants = [];
  let currentAttendance = {};

  async function init() {
    try {
      const cRes = await fetch('/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const cData = await cRes.json();
      if (cData.success) {
        courses = cData.courses;
        renderCourseOptions(courses);
      }

      const aRes = await fetch('/api/applicants', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const aData = await aRes.json();
      if (aData.success) {
        applicants = aData.applicants;
        loadAttendanceForSelectedCourse();
      }
    } catch (err) {
      console.error('Attendance Init Error:', err);
    }
  }

  function renderCourseOptions(courseList) {
    courseSelect.innerHTML = '';
    courseList.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.title} (${c.schedule})`;
      courseSelect.appendChild(opt);
    });
  }

  courseSelect.addEventListener('change', loadAttendanceForSelectedCourse);

  async function loadAttendanceForSelectedCourse() {
    const courseId = courseSelect.value;
    if (!courseId) return;

    // Filter applicants for course
    const courseApps = applicants.filter(a => a.courseId === courseId && a.status === '승인');

    // Fetch existing attendance logs for today
    try {
      const res = await fetch(`/api/attendance?courseId=${courseId}&date=${todayStr}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      currentAttendance = {};
      if (data.success && data.records) {
        data.records.forEach(r => {
          currentAttendance[r.studentName] = r.status;
        });
      }
    } catch (err) {
      console.error('Fetch Attendance Logs Error:', err);
    }

    renderStudentRows(courseApps);
  }

  function renderStudentRows(studentApps) {
    studentList.innerHTML = '';

    if (studentApps.length === 0) {
      studentList.innerHTML = '<p style="text-align:center; padding:30px; color:#64748b;">수강 승인된 학생이 없습니다.</p>';
      return;
    }

    studentApps.forEach(s => {
      const status = currentAttendance[s.studentName] || '출석';
      const row = document.createElement('div');
      row.className = 'student-row';
      row.innerHTML = `
        <div class="student-info">
          <div>${s.studentName} <span style="font-size:0.8rem; font-weight:400; color:#64748b;">(${s.gradeClass})</span></div>
          <div style="font-size:0.75rem; color:#64748b; font-weight:400;">📞 ${s.parentPhone}</div>
        </div>
        <div class="att-btn-group" data-student="${s.studentName}" data-phone="${s.parentPhone}">
          <button class="att-btn btn-present ${status === '출석' ? 'active' : ''}" data-val="출석">✅ 출석</button>
          <button class="att-btn btn-early ${status === '조퇴' ? 'active' : ''}" data-val="조퇴">⏳ 조퇴</button>
          <button class="att-btn btn-absent ${status === '결석' ? 'active' : ''}" data-val="결석">❌ 결석</button>
        </div>
      `;
      studentList.appendChild(row);
    });

    document.querySelectorAll('.att-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const group = e.target.closest('.att-btn-group');
        group.querySelectorAll('.att-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
  }

  saveAttendanceBtn.addEventListener('click', async () => {
    const courseId = courseSelect.value;
    if (!courseId) return;

    const records = [];
    document.querySelectorAll('.att-btn-group').forEach(group => {
      const studentName = group.dataset.student;
      const parentPhone = group.dataset.phone;
      const activeBtn = group.querySelector('.att-btn.active');
      const status = activeBtn ? activeBtn.dataset.val : '출석';
      records.push({ studentName, parentPhone, status });
    });

    try {
      const res = await fetch('/api/attendance/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId, records })
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
      } else {
        alert(data.message || '출석 저장 실패');
      }
    } catch (err) {
      alert('서버 저장 실패');
    }
  });

  init();
});
