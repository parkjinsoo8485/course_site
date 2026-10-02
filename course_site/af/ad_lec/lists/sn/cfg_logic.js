/**
 * =============================================================================
 * [환경설정 파트 A (ad_cfg) 클라이언트 로직]
 * Sprint 3 - 기본설정, 강사권한, 출석부옵션, 문자설정 1:1 완벽 클론 JS
 * 타깃: /af/ad_cfg/main, /af/ad_cfg/tea, /af/ad_cfg/att, /af/ad_cfg/sms
 * =============================================================================
 */

let currentSignIndex = 1;
let signCanvas = null;
let signCtx = null;
let isDrawingSign = false;
const originalSignData = {
  1: '', 2: '', 3: '', 4: ''
};

// 탭 스위칭
function switchCfgTab(tabKey, e) {
  if (e && e.preventDefault) e.preventDefault();

  const tabs = ['main', 'tea', 'att', 'sms'];
  const tabTitles = {
    main: '기본설정',
    tea: '강사권한 설정',
    att: '출석부옵션 설정',
    sms: '문자설정'
  };

  tabs.forEach(t => {
    const pane = document.getElementById(`cfg_pane_${t}`);
    const tabBtn = document.getElementById(`tab_btn_${t}`);
    if (pane) pane.style.display = (t === tabKey) ? 'block' : 'none';
    if (tabBtn) {
      if (t === tabKey) {
        tabBtn.className = 'on';
        const aTag = tabBtn.querySelector('a');
        if (aTag) {
          aTag.style.fontWeight = 'bold';
          aTag.style.color = '#337ab7';
          aTag.style.border = '1px solid #ddd';
          aTag.style.borderBottom = '1px solid #fff';
          aTag.style.background = '#fff';
          aTag.style.borderTop = '2px solid #337ab7';
        }
      } else {
        tabBtn.className = '';
        const aTag = tabBtn.querySelector('a');
        if (aTag) {
          aTag.style.fontWeight = 'normal';
          aTag.style.color = '#555';
          aTag.style.border = '1px solid transparent';
          aTag.style.background = '#f9f9f9';
          aTag.style.borderTop = 'none';
        }
      }
    }
  });

  const titleEl = document.getElementById('cfg_title_text');
  if (titleEl && tabTitles[tabKey]) {
    titleEl.innerText = tabTitles[tabKey];
  }

  // URL 반영
  const newUrl = `/af/ad_cfg/${tabKey}/sn/3267`;
  if (window.history && window.history.pushState) {
    window.history.pushState({ tab: tabKey }, '', newUrl);
  }

  // 탭 전환 시 인라인 체크 로직 호출
  if (tabKey === 'tea') {
    chk_wr_sin1();
    chk_hp_view();
  } else if (tabKey === 'sms') {
    chk_allow_tea();
  }
}

// 강사권한 연동 로직
function chk_wr_sin1() {
  const allowWrSinY = document.getElementById('allowWrSin_Y');
  const allowWrSin1 = document.getElementById('allowWrSin1');
  const allowWrSin2 = document.getElementById('allowWrSin2');
  if (allowWrSinY && allowWrSin1 && allowWrSin2) {
    const enabled = allowWrSinY.checked;
    allowWrSin1.disabled = !enabled;
    allowWrSin2.disabled = !enabled;
  }
}

function chk_hp_view() {
  const allowHpViewY = document.getElementById('allowHpView_Y');
  const allowHpEdit = document.getElementById('allowHpEdit');
  if (allowHpViewY && allowHpEdit) {
    allowHpEdit.disabled = !allowHpViewY.checked;
  }
}

// 문자설정 연동 로직
function chk_allow_tea() {
  const smsAlTeaAtY = document.getElementById('smsAlTeaAt_Y');
  const smsAlTeaSiY = document.getElementById('smsAlTeaSi_Y');
  // 기타 강사 발송 관련 옵션 제어
}

// 서명 패드 모달
function show_sign_modal(idx) {
  currentSignIndex = idx;
  const modal = document.getElementById('modal_sign_pad');
  const title = document.getElementById('sign_modal_title');
  if (title) title.innerText = `결재란 ${idx} 서명 만들기`;

  if (modal) {
    modal.style.display = 'flex';
    initSignCanvas();
  }
}

function closeSignModal() {
  const modal = document.getElementById('modal_sign_pad');
  if (modal) modal.style.display = 'none';
}

function initSignCanvas() {
  signCanvas = document.getElementById('sign_canvas');
  if (!signCanvas) return;
  signCtx = signCanvas.getContext('2d');
  signCtx.clearRect(0, 0, signCanvas.width, signCanvas.height);
  signCtx.lineWidth = 3;
  signCtx.lineCap = 'round';
  signCtx.strokeStyle = '#000000';

  signCanvas.onmousedown = (e) => {
    isDrawingSign = true;
    const rect = signCanvas.getBoundingClientRect();
    signCtx.beginPath();
    signCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  signCanvas.onmousemove = (e) => {
    if (!isDrawingSign) return;
    const rect = signCanvas.getBoundingClientRect();
    signCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    signCtx.stroke();
  };

  signCanvas.onmouseup = () => { isDrawingSign = false; };
  signCanvas.onmouseleave = () => { isDrawingSign = false; };

  // 터치 이벤트
  signCanvas.ontouchstart = (e) => {
    isDrawingSign = true;
    const rect = signCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    signCtx.beginPath();
    signCtx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    e.preventDefault();
  };
  signCanvas.ontouchmove = (e) => {
    if (!isDrawingSign) return;
    const rect = signCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    signCtx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    signCtx.stroke();
    e.preventDefault();
  };
  signCanvas.ontouchend = () => { isDrawingSign = false; };
}

function clearSignCanvas() {
  if (signCanvas && signCtx) {
    signCtx.clearRect(0, 0, signCanvas.width, signCanvas.height);
  }
}

function applySignFromCanvas() {
  if (!signCanvas) return;
  const dataUrl = signCanvas.toDataURL('image/png');
  const hiddenInput = document.getElementById(`sign_data${currentSignIndex}`);
  const previewImg = document.getElementById(`sign_preview${currentSignIndex}`);

  if (hiddenInput) {
    if (!originalSignData[currentSignIndex]) {
      originalSignData[currentSignIndex] = hiddenInput.value;
    }
    hiddenInput.value = dataUrl;
  }
  if (previewImg) {
    previewImg.src = dataUrl;
  }

  closeSignModal();
  alert(`결재란 ${currentSignIndex} 서명이 정상 적용되었습니다. 설정 저장 시 반영됩니다.`);
}

function clear_sign(idx) {
  const hiddenInput = document.getElementById(`sign_data${idx}`);
  const previewImg = document.getElementById(`sign_preview${idx}`);
  const emptyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAoCAYAAACiu5n/AAAAIElEQVR4nO3BMQEAAADCoPVPbQo/oAAAAAAAAAAAAHgaJagAAcHRYpIAAAAASUVORK5CYII=';

  if (hiddenInput) {
    if (!originalSignData[idx]) originalSignData[idx] = hiddenInput.value;
    hiddenInput.value = emptyPng;
  }
  if (previewImg) {
    previewImg.src = emptyPng;
  }
}

function cancel_sign(idx) {
  if (originalSignData[idx]) {
    const hiddenInput = document.getElementById(`sign_data${idx}`);
    const previewImg = document.getElementById(`sign_preview${idx}`);
    if (hiddenInput) hiddenInput.value = originalSignData[idx];
    if (previewImg) previewImg.src = originalSignData[idx];
  }
}

// 관리자 교직원 모달
function openMemWin(dest) {
  const modal = document.getElementById('modal_admin_search');
  if (modal) {
    modal.style.display = 'flex';
    searchTeachersForAdmin();
  }
}

function closeAdminSearchModal() {
  const modal = document.getElementById('modal_admin_search');
  if (modal) modal.style.display = 'none';
}

function searchTeachersForAdmin() {
  const kw = (document.getElementById('admin_search_keyword')?.value || '').trim();
  const tbody = document.getElementById('admin_search_tbody');
  if (!tbody) return;

  // 로컬 더미 또는 강사 목록 데이터 조회
  const teachers = [
    { id: 'tea01', name: '원희자', hp: '010-2494-1479' },
    { id: 'tea02', name: '김채원', hp: '010-9876-5432' },
    { id: 'tea03', name: '이영희', hp: '010-3333-4444' },
    { id: 'tea04', name: '박진수', hp: '010-5555-6666' }
  ];

  const filtered = kw ? teachers.filter(t => t.name.includes(kw) || t.id.includes(kw)) : teachers;
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:15px; color:#999;">검색 결과가 없습니다.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(t => `
    <tr>
      <td style="text-align:center;"><input type="radio" name="sel_admin_tea" value="${t.id}" data-name="${t.name}"></td>
      <td><strong>${t.name}</strong></td>
      <td>${t.id}</td>
      <td>${t.hp}</td>
    </tr>
  `).join('');
}

function addSelectedTeacherToAdmin() {
  const selected = document.querySelector('input[name="sel_admin_tea"]:checked');
  if (!selected) {
    alert('추가할 교직원을 선택해 주세요.');
    return;
  }
  const id = selected.value;
  const name = selected.getAttribute('data-name');
  const selectBox = document.getElementById('addAdminList');
  if (selectBox) {
    // 중복 체크
    for (let opt of selectBox.options) {
      if (opt.value === id) {
        alert('이미 관리자로 등록되어 있는 교직원입니다.');
        return;
      }
    }
    const newOpt = new Option(name, id);
    selectBox.add(newOpt);
    closeAdminSearchModal();
    alert(`${name} 교직원이 서비스 관리자로 추가되었습니다.`);
  }
}

function delAddMem() {
  const selectBox = document.getElementById('addAdminList');
  if (!selectBox) return;
  const selectedOpts = Array.from(selectBox.selectedOptions);
  if (selectedOpts.length === 0) {
    alert('삭제할 관리자를 목록에서 먼저 선택해 주세요.');
    return;
  }
  if (confirm('선택된 교직원을 관리자에서 삭제하시겠습니까?')) {
    selectedOpts.forEach(opt => opt.remove());
  }
}

// 폼 비동기 저장
async function submitCfgForm(e, fm, paneId) {
  if (e && e.preventDefault) e.preventDefault();

  const formData = new FormData(fm);
  const data = {};
  formData.forEach((val, key) => {
    data[key] = val;
  });

  // addAdminList
  if (paneId === 'main') {
    const selectBox = document.getElementById('addAdminList');
    if (selectBox) {
      data['addAdminList'] = Array.from(selectBox.options).map(o => o.value).join(',');
    }
  }

  try {
    const res = await fetch(`/api/ad_cfg/save/${paneId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) {
      alert(`[${result.tabName || '환경설정'}] 정상적으로 수정/저장되었습니다.`);
    } else {
      alert(`저장 중 오류: ${result.message}`);
    }
  } catch (err) {
    console.error('submitCfgForm error:', err);
    alert('서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
  }

  return false;
}

// 초기 라우트 감지 (URL에 /af/ad_cfg/tea 등이 포함되었는지 확인)
function checkInitialCfgRoute() {
  const path = window.location.pathname;
  if (path.includes('/af/ad_cfg/tea')) {
    switchCfgTab('tea');
  } else if (path.includes('/af/ad_cfg/att')) {
    switchCfgTab('att');
  } else if (path.includes('/af/ad_cfg/sms')) {
    switchCfgTab('sms');
  } else if (path.includes('/af/ad_cfg/main')) {
    switchCfgTab('main');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkInitialCfgRoute();
  chk_wr_sin1();
  chk_hp_view();
});

// 전역 노출
window.switchCfgTab = switchCfgTab;
window.chk_wr_sin1 = chk_wr_sin1;
window.chk_hp_view = chk_hp_view;
window.chk_allow_tea = chk_allow_tea;
window.show_sign_modal = show_sign_modal;
window.closeSignModal = closeSignModal;
window.clearSignCanvas = clearSignCanvas;
window.applySignFromCanvas = applySignFromCanvas;
window.clear_sign = clear_sign;
window.cancel_sign = cancel_sign;
window.openMemWin = openMemWin;
window.closeAdminSearchModal = closeAdminSearchModal;
window.searchTeachersForAdmin = searchTeachersForAdmin;
window.addSelectedTeacherToAdmin = addSelectedTeacherToAdmin;
window.delAddMem = delAddMem;
window.submitCfgForm = submitCfgForm;
window.checkInitialCfgRoute = checkInitialCfgRoute;
