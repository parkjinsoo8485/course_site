for path in ['course_site/af/ad_lec/lists/sn/index.html', 'course_site/af/ad_lec/lists/sn/3267/index.html']:
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace(
        '<form id="fm_refund_sin" onsubmit="submitRefundSin(event)">',
        '<form id="fm_refund_sin" onsubmit="event.preventDefault(); submitRefundSin(event); return false;">'
    )
    c = c.replace(
        '<button type="submit" id="btn_ref_sin_submit"',
        '<button type="button" id="btn_ref_sin_submit" onclick="submitRefundSin(event);"'
    )
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print('Updated form and button in', path)

# Update admin_lec.js fillRefundSampleStudent
with open('course_site/af/ad_lec/lists/sn/admin_lec.js', 'r', encoding='utf-8') as f:
    js = f.read()

old_fill = """function fillRefundSampleStudent() {
  const samples = [
    { grade: '2', classNo: '2', studentNo: '14', name: '박서준', phone: '010-3849-1928', course: '[특기적성] 창의 로봇교실 A반' },
    { grade: '3', classNo: '1', studentNo: '08', name: '윤도현', phone: '010-9182-3746', course: '01. [특기] 바이올린 A반' },
    { grade: '1', classNo: '1', studentNo: '05', name: '손희안', phone: '010-5432-9876', course: '놀이체육 1부' }
  ];
  const s = samples[Math.floor(Math.random() * samples.length)];
  const gEl = document.getElementById('ref_sin_grade'); if (gEl) gEl.value = s.grade;
  const cEl = document.getElementById('ref_sin_classNo'); if (cEl) cEl.value = s.classNo;
  const nEl = document.getElementById('ref_sin_studentNo'); if (nEl) nEl.value = s.studentNo;
  const nameEl = document.getElementById('ref_sin_studentName'); if (nameEl) nameEl.value = s.name;
  const pEl = document.getElementById('ref_sin_parentPhone'); if (pEl) pEl.value = s.phone;

  const selCourse = document.getElementById('ref_sin_course');
  if (selCourse) {
    selCourse.value = s.course;
    onRefundCourseChanged();
  }
}"""

new_fill = """function fillRefundSampleStudent() {
  const selCourse = document.getElementById('ref_sin_course');
  if (selCourse && selCourse.options.length > 1) {
    if (selCourse.selectedIndex <= 0) selCourse.selectedIndex = 1;
    onRefundCourseChanged();
  }

  const samples = [
    { grade: '2', classNo: '2', studentNo: '14', name: '박서준', phone: '010-3849-1928' },
    { grade: '3', classNo: '1', studentNo: '08', name: '윤도현', phone: '010-9182-3746' },
    { grade: '1', classNo: '1', studentNo: '05', name: '손희안', phone: '010-5432-9876' }
  ];
  const s = samples[Math.floor(Math.random() * samples.length)];
  const gEl = document.getElementById('ref_sin_grade'); if (gEl) gEl.value = s.grade;
  const cEl = document.getElementById('ref_sin_classNo'); if (cEl) cEl.value = s.classNo;
  const nEl = document.getElementById('ref_sin_studentNo'); if (nEl) nEl.value = s.studentNo;
  const nameEl = document.getElementById('ref_sin_studentName'); if (nameEl) nameEl.value = s.name;
  const pEl = document.getElementById('ref_sin_parentPhone'); if (pEl) pEl.value = s.phone;
}"""

if old_fill in js:
    js = js.replace(old_fill, new_fill)
    with open('course_site/af/ad_lec/lists/sn/admin_lec.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print('Updated fillRefundSampleStudent in admin_lec.js')
else:
    print('old_fill not found, checking substring')
