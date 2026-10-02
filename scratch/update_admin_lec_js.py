# -*- coding: utf-8 -*-
import os

js_path = r"c:\Users\user\My project\course\course_site\course_site\af\ad_lec\lists\sn\admin_lec.js"

with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Target replacement block: from "// 2. 수강자 등록 모달" to "// 4. 수강자 가져오기 모달"
old_block_start = "// 2. 수강자 등록 모달"
old_block_end = "// 4. 수강자 가져오기 모달"

s_idx = content.find(old_block_start)
e_idx = content.find(old_block_end)

if s_idx == -1 or e_idx == -1:
    print("Could not find markers in admin_lec.js!")
    exit(1)

new_block = '''// 2. 수강자 등록 모달 (공식 서식 1:1 정밀 매핑 및 계산 로직)
var useCost = 'Y';

function filterNum(str) {
  if (typeof str !== 'string') str = String(str || 0);
  return str.replace(/[^0-9-]/g, '') || '0';
}

function commaSplit(n) {
  var parts = (n + '').split('.');
  parts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
  return parts.join('.');
}

function chkMoney(obj) {
  if (!obj) return;
  var val = filterNum(obj.value);
  obj.value = commaSplit(val);
}

function validate_required(elem) {
  if (!elem) return false;
  var val = elem.value ? elem.value.trim() : '';
  return val.length > 0;
}

function chkSumFreeMoney(show_msg) {
  // 지원금액 전체 합계, 징수금액 적용
  var pay_list = {};
  pay_list['lec_pay'] = 0;
  if (useCost == 'Y') {		
    pay_list['lec_tea_fee'] = 0;
    pay_list['lec_use_cost'] = 0;
  }
  pay_list['lec_pay_item'] = 0;
  pay_list['lec_pay_book'] = 0;
  pay_list['deduct_pay'] = 0;

  var freeInputs = document.querySelectorAll('#fm_edit input.free_pay');
  freeInputs.forEach(function(inp) {
    var free_key = inp.id.split('_')[0];
    var free_pay_key = inp.id.replace(free_key + '_', "");
    if (inp.value && pay_list[free_pay_key] !== undefined) {
      pay_list[free_pay_key] += parseInt(filterNum(inp.value), 10);
    }
  });

  var app_lec_pay_el = document.querySelector('#fm_edit #app_lec_pay');
  var app_lec_pay = parseInt(filterNum(app_lec_pay_el ? app_lec_pay_el.value : '0'), 10);
  var app_lec_tea_fee = 0;
  var app_lec_use_cost = 0;
  if (useCost == 'Y') {
    var tea_el = document.querySelector('#fm_edit #app_lec_tea_fee');
    var use_el = document.querySelector('#fm_edit #app_lec_use_cost');
    app_lec_tea_fee = parseInt(filterNum(tea_el ? tea_el.value : '0'), 10);
    app_lec_use_cost = parseInt(filterNum(use_el ? use_el.value : '0'), 10);	
  }
  var book_el = document.querySelector('#fm_edit #app_lec_pay_book');
  var item_el = document.querySelector('#fm_edit #app_lec_pay_item');
  var tot_el = document.querySelector('#fm_edit #tot_app_lec_pay');
  var app_lec_pay_book = parseInt(filterNum(book_el ? book_el.value : '0'), 10);
  var app_lec_pay_item = parseInt(filterNum(item_el ? item_el.value : '0'), 10);
  var tot_app_lec_pay = parseInt(filterNum(tot_el ? tot_el.value : '0'), 10);
  
  // 지원금액 전체 합계 적용
  var free_deduct_el = document.querySelector('#fm_edit #free_deduct_pay');
  if (free_deduct_el) free_deduct_el.value = commaSplit(pay_list['deduct_pay']);

  // { 징수금액 적용
  var co_amount_pay_list = {};
  co_amount_pay_list['lec_pay'] = app_lec_pay - pay_list['lec_pay'];
  if (useCost == 'Y') {		
    co_amount_pay_list['lec_tea_fee'] = app_lec_tea_fee - pay_list['lec_tea_fee'];
    co_amount_pay_list['lec_use_cost'] = app_lec_use_cost - pay_list['lec_use_cost'];
  }
  co_amount_pay_list['lec_pay_book'] = app_lec_pay_book - pay_list['lec_pay_book'];
  co_amount_pay_list['lec_pay_item'] = app_lec_pay_item - pay_list['lec_pay_item'];
  co_amount_pay_list['pay'] = tot_app_lec_pay - pay_list['deduct_pay'];

  var err_cnt = 0;
  for (var key in pay_list) {
    var checkKey = (key == 'deduct_pay') ? 'pay' : key;
    var tmp = document.querySelector('#fm_edit #co_amount_' + checkKey);
    if (tmp) {
      tmp.value = commaSplit(co_amount_pay_list[checkKey]); // 징수금액에 변경값 적용
      if (co_amount_pay_list[checkKey] < 0) {
        tmp.style.color = 'red';
        err_cnt++;
      } else {
        tmp.style.color = '';
      }
    }
  }

  if (err_cnt > 0) {
    if (show_msg == true) {
      alert('징수금액 : (-)로 계산된 금액을 확인해 주시기 바랍니다.');
    }
    return false;
  }
  return true;
}

function chkFreeMoney(obj) {						
  if (!obj || !obj.id) return false;
  var obj_id = obj.id;
  if (!obj_id.startsWith('free')) {
    return false; 
  }

  var free_key = obj_id.split('_')[0];
  var free_lec_pay = 0;
  var free_lec_tea_fee = 0;
  var free_lec_use_cost = 0;		
  var free_lec_pay_book = 0;
  var free_lec_pay_item = 0;
  var free_deduct_pay = 0;

  if (useCost == 'Y') {
    var tea_el = document.querySelector('#fm_edit #' + free_key + '_lec_tea_fee');
    var use_el = document.querySelector('#fm_edit #' + free_key + '_lec_use_cost');
    free_lec_tea_fee = parseInt(filterNum(tea_el ? tea_el.value : '0'), 10);
    free_lec_use_cost = parseInt(filterNum(use_el ? use_el.value : '0'), 10);

    if (obj_id == free_key + '_lec_tea_fee' || obj_id == free_key + '_lec_use_cost') {
      // 수강료 = 강사료 + 수용비 처리
      var lec_el = document.querySelector('#fm_edit #' + free_key + '_lec_pay');
      if (lec_el) lec_el.value = commaSplit(free_lec_tea_fee + free_lec_use_cost);
    }
  }

  var lec_el = document.querySelector('#fm_edit #' + free_key + '_lec_pay');
  var book_el = document.querySelector('#fm_edit #' + free_key + '_lec_pay_book');
  var item_el = document.querySelector('#fm_edit #' + free_key + '_lec_pay_item');

  free_lec_pay = parseInt(filterNum(lec_el ? lec_el.value : '0'), 10);
  free_lec_pay_book = parseInt(filterNum(book_el ? book_el.value : '0'), 10);
  free_lec_pay_item = parseInt(filterNum(item_el ? item_el.value : '0'), 10);

  free_deduct_pay = free_lec_pay + free_lec_pay_book + free_lec_pay_item;
  var deduct_el = document.querySelector('#fm_edit #' + free_key + '_deduct_pay');
  if (deduct_el) deduct_el.value = commaSplit(free_deduct_pay); // 합계에 변경값 적용

  chkSumFreeMoney();
}

function openSubsidyAppRegisterModal() {
  var modal = document.getElementById('modal_sub_app_register');
  if (document.getElementById('app_num')) document.getElementById('app_num').value = '';
  if (document.getElementById('sub_app_reg_applicant_id')) document.getElementById('sub_app_reg_applicant_id').value = '';
  if (document.getElementById('app_mem_name')) document.getElementById('app_mem_name').innerText = '';
  if (document.getElementById('app_mem_grade')) document.getElementById('app_mem_grade').innerText = '';
  if (document.getElementById('app_mem_class')) document.getElementById('app_mem_class').innerText = '';
  if (document.getElementById('app_mem_bunho')) document.getElementById('app_mem_bunho').innerText = '';
  if (document.getElementById('lec_name')) document.getElementById('lec_name').innerText = '';

  var resetFields = [
    'app_lec_pay', 'app_lec_tea_fee', 'app_lec_use_cost', 'app_lec_pay_book', 'app_lec_pay_item', 'tot_app_lec_pay',
    'free2_lec_pay', 'free2_lec_tea_fee', 'free2_lec_use_cost', 'free2_lec_pay_book', 'free2_lec_pay_item', 'free2_deduct_pay',
    'free3_lec_pay', 'free3_lec_tea_fee', 'free3_lec_use_cost', 'free3_lec_pay_book', 'free3_lec_pay_item', 'free3_deduct_pay',
    'free1_lec_pay', 'free1_lec_tea_fee', 'free1_lec_use_cost', 'free1_lec_pay_book', 'free1_lec_pay_item', 'free1_deduct_pay',
    'free_deduct_pay',
    'co_amount_lec_pay', 'co_amount_lec_tea_fee', 'co_amount_lec_use_cost', 'co_amount_lec_pay_book', 'co_amount_lec_pay_item', 'co_amount_pay'
  ];
  resetFields.forEach(function(fId) {
    var el = document.getElementById(fId);
    if (el) el.value = '0';
  });

  if (document.getElementById('max_support_pay')) document.getElementById('max_support_pay').value = '0';
  if (document.getElementById('bigo')) document.getElementById('bigo').value = '';
  if (document.getElementById('log_data')) document.getElementById('log_data').value = '';

  if (modal) modal.style.display = 'flex';
}

function closeSubsidyAppRegisterModal() {
  var modal = document.getElementById('modal_sub_app_register');
  if (modal) modal.style.display = 'none';
}

async function fm_edit_check(fm) {
  try {
    if (!fm) fm = document.getElementById('fm_edit');
    if (!validate_required(fm.month)) {
      alert('대상 월 : 선택해 주세요.');
      return false;
    }

    if (!validate_required(fm.app_num)) {
      alert('신청자 정보 : 검색 후 선택해 주시기 바랍니다.');
      return false;
    }

    if (!chkSumFreeMoney(true)) {
      return false;
    }

    if (!confirm('적용하시겠습니까?')) {
      return false;
    }

    var studentName = document.getElementById('app_mem_name') ? document.getElementById('app_mem_name').innerText.trim() : '';
    var grade = parseInt(document.getElementById('app_mem_grade') ? document.getElementById('app_mem_grade').innerText : '1', 10) || 1;
    var classNum = parseInt(document.getElementById('app_mem_class') ? document.getElementById('app_mem_class').innerText : '1', 10) || 1;
    var studentNum = parseInt(document.getElementById('app_mem_bunho') ? document.getElementById('app_mem_bunho').innerText : '1', 10) || 1;
    var courseTitle = document.getElementById('lec_name') ? document.getElementById('lec_name').innerText.trim() : '';

    var monthVal = fm.month.value ? (fm.month.value.includes('월') ? fm.month.value : fm.month.value + '월') : '3월';
    var tuitionFee = parseInt(filterNum(fm.app_lec_pay ? fm.app_lec_pay.value : '0'), 10);
    var instructorFee = parseInt(filterNum(fm.app_lec_tea_fee ? fm.app_lec_tea_fee.value : '0'), 10);
    var overheadFee = parseInt(filterNum(fm.app_lec_use_cost ? fm.app_lec_use_cost.value : '0'), 10);
    var textbookFee = parseInt(filterNum(fm.app_lec_pay_book ? fm.app_lec_pay_book.value : '0'), 10);
    var materialFee = parseInt(filterNum(fm.app_lec_pay_item ? fm.app_lec_pay_item.value : '0'), 10);
    var totalFee = parseInt(filterNum(fm.tot_app_lec_pay ? fm.tot_app_lec_pay.value : '0'), 10) || (tuitionFee + textbookFee + materialFee);
    var subsidizedAmount = parseInt(filterNum(fm.free_deduct_pay ? fm.free_deduct_pay.value : '0'), 10);
    var collectedAmount = parseInt(filterNum(fm.co_amount_pay ? fm.co_amount_pay.value : '0'), 10);
    var bigo = fm.bigo ? fm.bigo.value : '';

    var payload = {
      month: monthVal,
      grade: grade,
      classNum: classNum,
      studentNum: studentNum,
      studentName: studentName,
      courseTitle: courseTitle,
      tuitionFee: tuitionFee,
      instructorFee: instructorFee,
      overheadFee: overheadFee,
      textbookFee: textbookFee,
      materialFee: materialFee,
      totalFee: totalFee,
      collectedAmount: collectedAmount,
      subsidizedAmount: subsidizedAmount,
      note: bigo,
      status: collectedAmount === 0 ? '차감완료' : '부분차감'
    };

    var res = await fetch('/api/af/ad_free2_app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    var result = await res.json();
    if (result.success) {
      alert('수강자 지원금이 성공적으로 등록되었습니다.');
      closeSubsidyAppRegisterModal();
      if (typeof loadSubsidyApplicants === 'function') loadSubsidyApplicants();
    } else {
      alert('등록 실패: ' + (result.message || '오류 발생'));
    }
    return false;
  } catch (error) {
    console.error('fm_edit_check error:', error);
    alert('서버 등록 중 오류가 발생했습니다.');
    return false;
  }
}

function submitSubsidyAppRegister() {
  return fm_edit_check(document.getElementById('fm_edit'));
}

// 3. 신청자 검색 팝업 모달
function openSubsidyAppSearchStudentModal() {
  var modal = document.getElementById('modal_sub_app_search_student');
  if (modal) modal.style.display = 'flex';
  searchSubsidyApplicantsPopup();
}

function closeSubsidyAppSearchStudentModal() {
  var modal = document.getElementById('modal_sub_app_search_student');
  if (modal) modal.style.display = 'none';
}

async function searchSubsidyApplicantsPopup() {
  var month = document.getElementById('sub_app_search_month') ? document.getElementById('sub_app_search_month').value : '';
  var course = document.getElementById('sub_app_search_course') ? document.getElementById('sub_app_search_course').value : '';
  var grade = document.getElementById('sub_app_search_grade') ? document.getElementById('sub_app_search_grade').value : '';
  var classNum = document.getElementById('sub_app_search_class') ? document.getElementById('sub_app_search_class').value : '';
  var keyword = document.getElementById('sub_app_search_keyword') ? document.getElementById('sub_app_search_keyword').value.trim() : '';

  var params = new URLSearchParams();
  if (month) params.append('month', month);
  if (course) params.append('course', course);
  if (grade) params.append('grade', grade);
  if (classNum) params.append('classNum', classNum);
  if (keyword) params.append('keyword', keyword);

  try {
    var res = await fetch('/api/af/ad_free2_app/applicant_search?' + params.toString());
    var data = await res.json();
    var list = data.list || [];
    var tbody = document.getElementById('sub_app_search_results_tbody');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="padding:24px; color:#64748b; font-size:12px;">검색 조건에 일치하는 신청자가 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(function(item, idx) {
      return `
        <tr style="border-bottom:1px solid #e2e8f0; font-size:12px;">
          <td style="padding:8px 4px; border:1px solid #cbd5e1;">${idx + 1}</td>
          <td style="text-align:left; padding:8px 10px; font-weight:bold; color:#1e293b; border:1px solid #cbd5e1;">
            ${item.courseTitle || ''} <span style="font-weight:normal; color:#64748b;">(${(item.fee || 32000).toLocaleString()}원)</span>
          </td>
          <td style="padding:8px 4px; border:1px solid #cbd5e1;">${item.grade || 1}학년</td>
          <td style="padding:8px 4px; border:1px solid #cbd5e1;">${item.classNum || 1}반</td>
          <td style="padding:8px 4px; border:1px solid #cbd5e1;">${item.studentNum || 1}번</td>
          <td style="padding:8px 4px; font-weight:bold; border:1px solid #cbd5e1;">
            <div style="display:flex; align-items:center; justify-content:center; gap:6px;">
              <span>${item.studentName || ''}</span>
              <button type="button" class="btn btn-primary btn-xs" onclick='selectSubsidyAppStudent(${JSON.stringify(item)})' style="height:24px; padding:0 10px; font-size:11px; font-weight:bold; background-color:#337ab7; border-color:#2e6da4; color:#fff; border-radius:3px; cursor:pointer;">선택</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (e) {
    console.error('searchSubsidyApplicantsPopup error:', e);
  }
}

function selectSubsidyAppStudent(item) {
  var nameEl = document.getElementById('app_mem_name');
  if (nameEl) nameEl.innerText = item.studentName || '';
  var numEl = document.getElementById('app_num');
  if (numEl) numEl.value = item.id || item.appNum || item.studentNum || '1';
  var gradeEl = document.getElementById('app_mem_grade');
  if (gradeEl) gradeEl.innerText = item.grade || '1';
  var classEl = document.getElementById('app_mem_class');
  if (classEl) classEl.innerText = item.classNum || '1';
  var bunhoEl = document.getElementById('app_mem_bunho');
  if (bunhoEl) bunhoEl.innerText = item.studentNum || '1';
  var courseEl = document.getElementById('lec_name');
  if (courseEl) courseEl.innerText = item.courseTitle || '';

  var subIdEl = document.getElementById('sub_app_reg_applicant_id');
  if (subIdEl) subIdEl.value = item.id || '';

  var tuitionFee = Number(item.tuitionFee || item.fee || 32000);
  var instructorFee = Number(item.instructorFee !== undefined ? item.instructorFee : Math.round(tuitionFee * 0.95));
  var overheadFee = Number(item.overheadFee !== undefined ? item.overheadFee : (tuitionFee - instructorFee));
  var textbookFee = Number(item.textbookFee !== undefined ? item.textbookFee : 30500);
  var materialFee = Number(item.materialFee !== undefined ? item.materialFee : 5000);
  var totalFee = tuitionFee + textbookFee + materialFee;

  var appPay = document.getElementById('app_lec_pay');
  if (appPay) appPay.value = commaSplit(tuitionFee);
  var appTea = document.getElementById('app_lec_tea_fee');
  if (appTea) appTea.value = commaSplit(instructorFee);
  var appUse = document.getElementById('app_lec_use_cost');
  if (appUse) appUse.value = commaSplit(overheadFee);
  var appBook = document.getElementById('app_lec_pay_book');
  if (appBook) appBook.value = commaSplit(textbookFee);
  var appItem = document.getElementById('app_lec_pay_item');
  if (appItem) appItem.value = commaSplit(materialFee);
  var appTot = document.getElementById('tot_app_lec_pay');
  if (appTot) appTot.value = commaSplit(totalFee);

  var grade = Number(item.grade || 1);
  var targetPrefix = (grade === 1) ? 'free2' : (grade === 3 ? 'free3' : 'free1');
  
  var teaInput = document.getElementById(targetPrefix + '_lec_tea_fee');
  if (teaInput) teaInput.value = commaSplit(instructorFee);
  var useInput = document.getElementById(targetPrefix + '_lec_use_cost');
  if (useInput) useInput.value = commaSplit(overheadFee);
  var lecInput = document.getElementById(targetPrefix + '_lec_pay');
  if (lecInput) lecInput.value = commaSplit(tuitionFee);
  var bookInput = document.getElementById(targetPrefix + '_lec_pay_book');
  if (bookInput) bookInput.value = commaSplit(textbookFee);
  var itemInput = document.getElementById(targetPrefix + '_lec_pay_item');
  if (itemInput) itemInput.value = commaSplit(materialFee);
  var deductInput = document.getElementById(targetPrefix + '_deduct_pay');
  if (deductInput) deductInput.value = commaSplit(totalFee);

  chkSumFreeMoney();
  closeSubsidyAppSearchStudentModal();
}

'''

content = content[:s_idx] + new_block + content[e_idx:]

# Also ensure window exports include new functions
window_export_marker = "window.selectSubsidyAppStudent = selectSubsidyAppStudent;"
if window_export_marker in content:
    extra_exports = """window.selectSubsidyAppStudent = selectSubsidyAppStudent;
window.chkFreeMoney = chkFreeMoney;
window.chkSumFreeMoney = chkSumFreeMoney;
window.chkMoney = chkMoney;
window.filterNum = filterNum;
window.commaSplit = commaSplit;
window.validate_required = validate_required;
window.fm_edit_check = fm_edit_check;"""
    content = content.replace(window_export_marker, extra_exports)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated admin_lec.js successfully!")
