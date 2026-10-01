const fs = require('fs');
const file = 'course_site/af/ad_lec/lists/sn/admin_lec.js';
let content = fs.readFileSync(file, 'utf8');

const targetStart = 'function openAppBatchUploadModal() {';
const targetEnd = 'function exportAppExcel() {';

const replacement = `// 2. Batch Upload Modal (신청자 일괄입력)
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
    const res = await fetch(\`/api/af/ad_lec/lists/sn/\${SCHOOL_SN}\`);
    const d = await res.json();
    const courses = (d.courses || []).filter(c => {
      if (!period || period === 'all') return true;
      return c.category && c.category.includes(period);
    });

    courses.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = \`[\${c.category || '26년 8월'}] \${c.title} (\${c.schedule || ''})\`;
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
  const csvContent = "\\uFEFF학년,반,번호,이름,수강료,교재비,재료비,학부모연락처\\n1,1,1,김서준,38000,0,15000,010-1234-5678\\n1,1,2,이하은,38000,0,15000,010-2345-6789\\n1,1,3,박도윤,38000,0,15000,010-3456-7890\\n";
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
      alert(\`\${d.count || sampleItems.length}명의 신청자가 일괄 등록되었습니다.\`);
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
    const res = await fetch(\`/api/af/ad_lec/lists/sn/\${SCHOOL_SN}\`);
    const d = await res.json();
    const courses = d.courses || [];
    sel.innerHTML = '';

    courses.forEach((c, idx) => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = \`[\${c.category || '26년 8월'}] \${c.title} (\${c.instructor || c.teacherName || '강사'})\`;
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
    const res = await fetch(\`/api/af/ad_pay/edit-data?courseId=\${courseId || ''}&schoolId=\${SCHOOL_SN}\`);
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

      return \`
        <tr data-app-id="\${a.id}">
          <td style="border:1px solid #ddd; padding:6px;"><input type="checkbox" class="fee-row-chk" value="\${a.id}"></td>
          <td style="border:1px solid #ddd; padding:6px;">\${idx + 1}</td>
          <td style="border:1px solid #ddd; padding:6px;">\${g}</td>
          <td style="border:1px solid #ddd; padding:6px;">\${c}</td>
          <td style="border:1px solid #ddd; padding:6px;">\${a.studentNum || (idx + 1)}</td>
          <td style="border:1px solid #ddd; padding:6px; font-weight:bold; color:#1e3a8a;">\${a.studentName}</td>
          <td style="border:1px solid #ddd; padding:4px;"><input type="number" class="form-control input-sm fee-tuition" value="\${tuition}" style="width:85px; height:26px; text-align:right;"></td>
          <td style="border:1px solid #ddd; padding:4px;"><input type="number" class="form-control input-sm fee-facility" value="\${facility}" style="width:75px; height:26px; text-align:right;"></td>
          <td style="border:1px solid #ddd; padding:4px;"><input type="number" class="form-control input-sm fee-instructor" value="\${instructor}" style="width:85px; height:26px; text-align:right;"></td>
          <td style="border:1px solid #ddd; padding:4px;"><input type="number" class="form-control input-sm fee-book" value="\${book}" style="width:75px; height:26px; text-align:right;"></td>
          <td style="border:1px solid #ddd; padding:4px;"><input type="number" class="form-control input-sm fee-material" value="\${material}" style="width:75px; height:26px; text-align:right;"></td>
          <td style="border:1px solid #ddd; padding:6px; font-size:11px; color:#666;">\${addDate}</td>
          <td style="border:1px solid #ddd; padding:4px;">
            <button type="button" class="btn btn-default btn-xs" onclick="saveSingleFeeRow('\${a.id}')" style="height:24px; padding:0 8px; border:1px solid #ccc; background:#fff; font-weight:bold; cursor:pointer;">수정</button>
          </td>
        </tr>
      \`;
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

  alert(\`선택된 \${checkedBoxes.length}명에게 입력값이 일괄 반영되었습니다. 저장 버튼을 눌러 확정하세요.\`);
}

async function saveSingleFeeRow(appId) {
  const tr = document.querySelector(\`tr[data-app-id="\${appId}"]\`);
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
    const res = await fetch(\`/api/af/ad_lec/lists/sn/\${SCHOOL_SN}\`);
    const d = await res.json();
    const courses = d.courses || [];

    courses.forEach(c => {
      const opt1 = document.createElement('option');
      opt1.value = c.id;
      opt1.textContent = \`[\${c.category || '26년 8월'}] \${c.title} (\${c.schedule || ''})\`;
      srcSel.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = c.id;
      opt2.textContent = \`[\${c.category || '26년 8월'}] \${c.title} (\${c.schedule || ''})\`;
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

    const res = await fetch(\`/api/af/ad_app/unapplied-students?\${params.toString()}\`);
    const d = await res.json();
    if (!d.success || !d.students || d.students.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="padding:15px; color:#888;">미신청 학생이 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = d.students.map((s, idx) => \`
      <tr>
        <td style="border:1px solid #ddd; padding:6px;">\${idx + 1}</td>
        <td style="border:1px solid #ddd; padding:6px;">\${s.grade}</td>
        <td style="border:1px solid #ddd; padding:6px;">\${s.classNum}</td>
        <td style="border:1px solid #ddd; padding:6px;">\${s.studentNum}</td>
        <td style="border:1px solid #ddd; padding:6px; font-weight:bold; color:#333;">\${s.studentName}</td>
        <td style="border:1px solid #ddd; padding:6px;">\${s.parentPhone || '-'}</td>
        <td style="border:1px solid #ddd; padding:6px;"><span class="badge" style="background:#d9534f; color:#fff; padding:3px 6px; border-radius:3px;">미신청</span></td>
      </tr>
    \`).join('');
  } catch (err) {
    console.error('loadUnappliedList error:', err);
    tbody.innerHTML = '<tr><td colspan="7" style="padding:15px; color:#e11d48;">조회 중 오류가 발생했습니다.</td></tr>';
  }
}

`;

const startIdx = content.indexOf(targetStart);
const endIdx = content.indexOf(targetEnd);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated batch modal functions in admin_lec.js');
} else {
  console.error('Markers not found: startIdx=' + startIdx + ', endIdx=' + endIdx);
  process.exit(1);
}
