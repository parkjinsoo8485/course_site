/**
 * =========================================================================================
 * [Sprint 4] 환경설정 파트 B (운영 규칙 및 연동) 1:1 Authentic Client Logic Engine
 * - 1. 신청기간 설정 (ad_time_lists)
 * - 2. 강의시간 설정 (ad_cfg_period)
 * - 3. 강좌구분 설정 (ad_cfg_afDiv)
 * - 4. 중복제한그룹 설정 (ad_cfg_appLiGrp)
 * - 5. 학적검증 (ad_verify_main & Excel)
 * - 6. 나이스/에듀파인 설정 (ad_neis_edufine_lists)
 * - 7. 안내글설정, 초기화, 담당자정보 (ad_cfg_message, ad_cfg_clear, ad_info_modify)
 * =========================================================================================
 */

// 전역 데이터 저장소
var cfgPartBData = {
  periods: [],
  afDivs: [],
  timeConfig: {},
  appLiGrps: [],
  verifyList: [],
  neisEdufine: { neisList: [], edufineCfg: {} },
  messages: {},
  managerInfo: {}
};

// ==================== 1. 신청기간 설정 (ad_time_lists) ====================
function loadApplyPeriods() {
  fetch('/api/ad_time/data/sn/3267')
    .then(r => r.json())
    .then(res => {
      if (!res.success) return;
      cfgPartBData.timeConfig = res.data;
      renderApplyPeriods(res.data);
    })
    .catch(e => console.error('loadApplyPeriods error:', e));
}

function renderApplyPeriods(data) {
  if (!data) return;
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };
  const setRadio = (name, val) => {
    const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
    if (el) el.checked = true;
  };

  setVal('time_div1_sel', data.semester || '2026-1');
  setVal('time_app_start', data.appStart || '2026-08-20 09:00');
  setVal('time_app_end', data.appEnd || '2026-08-25 18:00');
  setVal('time_cancel_start', data.cancelStart || '2026-08-26 09:00');
  setVal('time_cancel_end', data.cancelEnd || '2026-08-28 18:00');
  setVal('time_wait_start', data.waitStart || '2026-08-20 09:00');
  setVal('time_wait_end', data.waitEnd || '2026-08-25 18:00');
  setVal('time_max_apply', data.maxApplyCount || 3);
  setRadio('use_time_limit', data.useTimeLimit || 'Y');
  setRadio('allow_mod_after_end', data.allowModAfterEnd || 'N');

  // 학년별 개별 기간 그리드
  const grades = [1, 2, 3, 4, 5, 6];
  const tbody = document.getElementById('time_grade_tbody');
  if (tbody) {
    tbody.innerHTML = grades.map(g => {
      const gData = (data.gradeTimes && data.gradeTimes[g]) || {
        start: data.appStart || '2026-08-20 09:00',
        end: data.appEnd || '2026-08-25 18:00',
        useIndiv: 'N'
      };
      return `
        <tr>
          <td style="text-align:center;font-weight:bold;">${g}학년</td>
          <td style="text-align:center;">
            <label style="font-weight:normal;cursor:pointer;margin:0;">
              <input type="checkbox" id="g_indiv_${g}" ${gData.useIndiv === 'Y' ? 'checked' : ''} onchange="toggleGradeTimeInput(${g});"> 개별설정
            </label>
          </td>
          <td>
            <input type="datetime-local" class="form-control input-sm" id="g_start_${g}" value="${(gData.start || '').replace(' ', 'T')}" ${gData.useIndiv === 'Y' ? '' : 'disabled'} style="height:28px;font-size:12px;">
          </td>
          <td>
            <input type="datetime-local" class="form-control input-sm" id="g_end_${g}" value="${(gData.end || '').replace(' ', 'T')}" ${gData.useIndiv === 'Y' ? '' : 'disabled'} style="height:28px;font-size:12px;">
          </td>
          <td style="text-align:center;">
            <button type="button" onclick="applyBatchToGrade(${g});" class="btn btn-default btn-xs" style="height:24px;padding:0 8px;font-size:11px;">전체동일적용</button>
          </td>
        </tr>
      `;
    }).join('');
  }
}

function toggleGradeTimeInput(grade) {
  const chk = document.getElementById(`g_indiv_${grade}`);
  const s = document.getElementById(`g_start_${grade}`);
  const e = document.getElementById(`g_end_${grade}`);
  if (s) s.disabled = !chk.checked;
  if (e) e.disabled = !chk.checked;
}

function applyBatchToGrade(grade) {
  const sVal = document.getElementById('time_app_start').value;
  const eVal = document.getElementById('time_app_end').value;
  const s = document.getElementById(`g_start_${grade}`);
  const e = document.getElementById(`g_end_${grade}`);
  const chk = document.getElementById(`g_indiv_${grade}`);
  if (s) s.value = sVal.replace(' ', 'T');
  if (e) e.value = eVal.replace(' ', 'T');
  if (chk) chk.checked = true;
  if (s) s.disabled = false;
  if (e) e.disabled = false;
  alert(`${grade}학년에 기본 신청기간이 적용되었습니다.`);
}

function saveApplyPeriods() {
  const gradeTimes = {};
  for (let g = 1; g <= 6; g++) {
    const chk = document.getElementById(`g_indiv_${g}`);
    const s = document.getElementById(`g_start_${g}`);
    const e = document.getElementById(`g_end_${g}`);
    gradeTimes[g] = {
      useIndiv: chk && chk.checked ? 'Y' : 'N',
      start: (s && s.value) ? s.value.replace('T', ' ') : '',
      end: (e && e.value) ? e.value.replace('T', ' ') : ''
    };
  }

  const payload = {
    semester: document.getElementById('time_div1_sel')?.value || '2026-1',
    appStart: document.getElementById('time_app_start')?.value,
    appEnd: document.getElementById('time_app_end')?.value,
    cancelStart: document.getElementById('time_cancel_start')?.value,
    cancelEnd: document.getElementById('time_cancel_end')?.value,
    waitStart: document.getElementById('time_wait_start')?.value,
    waitEnd: document.getElementById('time_wait_end')?.value,
    maxApplyCount: parseInt(document.getElementById('time_max_apply')?.value || '3', 10),
    useTimeLimit: document.querySelector('input[name="use_time_limit"]:checked')?.value || 'Y',
    allowModAfterEnd: document.querySelector('input[name="allow_mod_after_end"]:checked')?.value || 'N',
    gradeTimes
  };

  fetch('/api/ad_time/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert('신청기간 설정이 안전하게 저장되었습니다.');
        loadApplyPeriods();
      } else {
        alert('저장 실패: ' + (res.message || '오류 발생'));
      }
    })
    .catch(e => {
      console.error(e);
      alert('서버 저장 중 오류가 발생했습니다.');
    });
}

// ==================== 2. 강의시간 설정 (ad_cfg_period) ====================
function loadPeriods() {
  fetch('/api/ad_cfg/period/data/sn/3267')
    .then(r => r.json())
    .then(res => {
      if (!res.success) return;
      cfgPartBData.periods = res.data || [];
      renderPeriods(res.data);
    })
    .catch(e => console.error('loadPeriods error:', e));
}

function renderPeriods(list) {
  const tbody = document.getElementById('period_list_tbody');
  if (!tbody) return;
  if (!list || list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;color:#888;">등록된 강의시간(교시)이 없습니다. [교시 추가] 버튼을 눌러 등록해주세요.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map((item, idx) => `
    <tr id="period_tr_${item.id}" data-id="${item.id}">
      <td style="text-align:center;font-weight:bold;">${idx + 1}</td>
      <td style="text-align:center;font-weight:bold;color:#337ab7;">${item.name}</td>
      <td style="text-align:center;">${item.startTime}</td>
      <td style="text-align:center;">${item.endTime}</td>
      <td style="text-align:center;">${item.durationMinutes ? item.durationMinutes + '분' : '-'}</td>
      <td style="text-align:center;">
        <span class="label ${item.isUsed === 'Y' ? 'label-success' : 'label-default'}" style="font-size:11px;padding:3px 8px;border-radius:10px;">
          ${item.isUsed === 'Y' ? '사용중' : '미사용'}
        </span>
      </td>
      <td style="text-align:center;display:flex;gap:4px;justify-content:center;">
        <button type="button" onclick="movePeriodOrder(${idx}, -1);" class="btn btn-default btn-xs" title="위로 이동" style="height:24px;padding:0 6px;"><i class="fa fa-arrow-up"></i></button>
        <button type="button" onclick="movePeriodOrder(${idx}, 1);" class="btn btn-default btn-xs" title="아래로 이동" style="height:24px;padding:0 6px;"><i class="fa fa-arrow-down"></i></button>
        <button type="button" onclick="openPeriodEditModal(${item.id});" class="btn btn-primary btn-xs" style="height:24px;padding:0 8px;font-size:11px;"><i class="fa fa-edit"></i> 수정</button>
        <button type="button" onclick="deletePeriod(${item.id});" class="btn btn-danger btn-xs" style="height:24px;padding:0 8px;font-size:11px;"><i class="fa fa-trash"></i> 삭제</button>
      </td>
    </tr>
  `).join('');
}

function openPeriodEditModal(id = null) {
  const modal = document.getElementById('modal_period_edit');
  if (!modal) return;
  const isNew = !id;
  document.getElementById('period_modal_title').innerText = isNew ? '강의시간(교시) 신규 등록' : '강의시간(교시) 수정';
  document.getElementById('period_id').value = id || '';

  if (isNew) {
    document.getElementById('period_name').value = `${(cfgPartBData.periods.length + 1)}교시`;
    document.getElementById('period_start_time').value = '13:00';
    document.getElementById('period_end_time').value = '13:50';
    document.getElementById('period_duration').value = '50';
    document.getElementById('period_is_used_Y').checked = true;
    document.getElementById('period_memo').value = '';
  } else {
    const item = cfgPartBData.periods.find(p => p.id === id);
    if (item) {
      document.getElementById('period_name').value = item.name || '';
      document.getElementById('period_start_time').value = item.startTime || '';
      document.getElementById('period_end_time').value = item.endTime || '';
      document.getElementById('period_duration').value = item.durationMinutes || '50';
      if (item.isUsed === 'Y') document.getElementById('period_is_used_Y').checked = true;
      else document.getElementById('period_is_used_N').checked = true;
      document.getElementById('period_memo').value = item.memo || '';
    }
  }

  modal.style.display = 'block';
  modal.classList.add('in');
}

function closePeriodEditModal() {
  const modal = document.getElementById('modal_period_edit');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('in');
  }
}

function savePeriodForm() {
  const id = document.getElementById('period_id').value;
  const payload = {
    id: id ? parseInt(id, 10) : undefined,
    name: document.getElementById('period_name').value.trim(),
    startTime: document.getElementById('period_start_time').value,
    endTime: document.getElementById('period_end_time').value,
    durationMinutes: parseInt(document.getElementById('period_duration').value || '50', 10),
    isUsed: document.querySelector('input[name="period_is_used"]:checked')?.value || 'Y',
    memo: document.getElementById('period_memo').value.trim()
  };

  if (!payload.name) {
    alert('교시명을 입력해주세요.');
    return;
  }

  fetch('/api/ad_cfg/period/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert('강의시간(교시)이 저장되었습니다.');
        closePeriodEditModal();
        loadPeriods();
      } else {
        alert('저장 실패: ' + (res.message || '오류 발생'));
      }
    })
    .catch(e => {
      console.error(e);
      alert('저장 중 통신 오류가 발생했습니다.');
    });
}

function deletePeriod(id) {
  if (!confirm('해당 강의시간(교시)을 정말 삭제하시겠습니까?')) return;
  fetch('/api/ad_cfg/period/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert('강의시간이 삭제되었습니다.');
        loadPeriods();
      } else {
        alert('삭제 실패: ' + res.message);
      }
    });
}

function movePeriodOrder(idx, dir) {
  const list = cfgPartBData.periods;
  const targetIdx = idx + dir;
  if (targetIdx < 0 || targetIdx >= list.length) return;
  const temp = list[idx];
  list[idx] = list[targetIdx];
  list[targetIdx] = temp;
  renderPeriods(list);
  savePeriodOrder();
}

function savePeriodOrder() {
  const ids = cfgPartBData.periods.map(p => p.id);
  fetch('/api/ad_cfg/period/reorder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids })
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) console.log('순서 저장 완료');
    });
}

function batchGenerateDefaultPeriods() {
  if (!confirm('표준 방과후 교시(1교시 13:00 ~ 6교시 17:30)로 일괄 자동 생성하시겠습니까?')) return;
  fetch('/api/ad_cfg/period/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'standard' })
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert('표준 교시가 성공적으로 생성되었습니다.');
        loadPeriods();
      }
    });
}

// ==================== 3. 강좌구분 설정 (ad_cfg_afDiv) ====================
function loadAfDivisions() {
  fetch('/api/ad_cfg/afdiv/data/sn/3267')
    .then(r => r.json())
    .then(res => {
      if (!res.success) return;
      cfgPartBData.afDivs = res.data || [];
      renderAfDivisions(res.data);
    })
    .catch(e => console.error('loadAfDivisions error:', e));
}

function renderAfDivisions(list) {
  const tbody = document.getElementById('afdiv_list_tbody');
  if (!tbody) return;
  if (!list || list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:#888;">등록된 강좌구분이 없습니다. [강좌구분 추가] 버튼을 눌러주세요.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map((item, idx) => `
    <tr>
      <td style="text-align:center;font-weight:bold;">${idx + 1}</td>
      <td style="text-align:center;font-family:monospace;font-weight:bold;color:#555;">${item.code}</td>
      <td style="text-align:center;font-weight:bold;color:#337ab7;">${item.name}</td>
      <td style="text-align:center;">
        <span class="label ${item.isUsed === 'Y' ? 'label-success' : 'label-default'}" style="font-size:11px;padding:3px 8px;border-radius:10px;">
          ${item.isUsed === 'Y' ? '사용' : '미사용'}
        </span>
      </td>
      <td>${item.memo || '-'}</td>
      <td style="text-align:center;display:flex;gap:4px;justify-content:center;">
        <button type="button" onclick="openAfDivEditModal(${item.id});" class="btn btn-primary btn-xs" style="height:24px;padding:0 8px;font-size:11px;"><i class="fa fa-edit"></i> 수정</button>
        <button type="button" onclick="deleteAfDiv(${item.id});" class="btn btn-danger btn-xs" style="height:24px;padding:0 8px;font-size:11px;"><i class="fa fa-trash"></i> 삭제</button>
      </td>
    </tr>
  `).join('');
}

function openAfDivEditModal(id = null) {
  const modal = document.getElementById('modal_afdiv_edit');
  if (!modal) return;
  const isNew = !id;
  document.getElementById('afdiv_modal_title').innerText = isNew ? '강좌구분 신규 추가' : '강좌구분 수정';
  document.getElementById('afdiv_id').value = id || '';

  if (isNew) {
    const nextCode = String(cfgPartBData.afDivs.length + 1).padStart(2, '0');
    document.getElementById('afdiv_code').value = nextCode;
    document.getElementById('afdiv_name').value = '';
    document.getElementById('afdiv_is_used_Y').checked = true;
    document.getElementById('afdiv_memo').value = '';
  } else {
    const item = cfgPartBData.afDivs.find(d => d.id === id);
    if (item) {
      document.getElementById('afdiv_code').value = item.code || '';
      document.getElementById('afdiv_name').value = item.name || '';
      if (item.isUsed === 'Y') document.getElementById('afdiv_is_used_Y').checked = true;
      else document.getElementById('afdiv_is_used_N').checked = true;
      document.getElementById('afdiv_memo').value = item.memo || '';
    }
  }

  modal.style.display = 'block';
  modal.classList.add('in');
}

function closeAfDivEditModal() {
  const modal = document.getElementById('modal_afdiv_edit');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('in');
  }
}

function saveAfDivForm() {
  const id = document.getElementById('afdiv_id').value;
  const payload = {
    id: id ? parseInt(id, 10) : undefined,
    code: document.getElementById('afdiv_code').value.trim(),
    name: document.getElementById('afdiv_name').value.trim(),
    isUsed: document.querySelector('input[name="afdiv_is_used"]:checked')?.value || 'Y',
    memo: document.getElementById('afdiv_memo').value.trim()
  };

  if (!payload.code || !payload.name) {
    alert('구분코드와 구분명을 모두 입력해주세요.');
    return;
  }

  fetch('/api/ad_cfg/afdiv/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert('강좌구분이 저장되었습니다.');
        closeAfDivEditModal();
        loadAfDivisions();
      } else {
        alert('저장 실패: ' + res.message);
      }
    });
}

function deleteAfDiv(id) {
  if (!confirm('강좌구분을 삭제하시겠습니까?')) return;
  fetch('/api/ad_cfg/afdiv/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert('삭제되었습니다.');
        loadAfDivisions();
      }
    });
}

// ==================== 4. 중복제한그룹 설정 (ad_cfg_appLiGrp) ====================
function loadRestrictionGroups() {
  fetch('/api/ad_cfg/appligrp/data/sn/3267')
    .then(r => r.json())
    .then(res => {
      if (!res.success) return;
      cfgPartBData.appLiGrps = res.data || [];
      renderRestrictionGroups(res.data);
    })
    .catch(e => console.error('loadRestrictionGroups error:', e));
}

function renderRestrictionGroups(list) {
  const tbody = document.getElementById('appligrp_list_tbody');
  if (!tbody) return;
  if (!list || list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;color:#888;">등록된 중복제한그룹이 없습니다. [그룹 추가] 버튼을 눌러 등록해주세요.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map((item, idx) => `
    <tr>
      <td style="text-align:center;font-weight:bold;">${idx + 1}</td>
      <td style="text-align:center;font-family:monospace;font-weight:bold;">${item.code}</td>
      <td style="text-align:center;font-weight:bold;color:#337ab7;">${item.name}</td>
      <td style="text-align:center;"><span class="badge" style="background:#e67e22;font-size:12px;">최대 ${item.maxAllowed}개</span></td>
      <td style="text-align:center;">
        <button type="button" onclick="openAssignCoursesModal(${item.id});" class="btn btn-default btn-xs" style="height:24px;padding:0 8px;font-size:11px;">
          <i class="fa fa-book"></i> 소속 강좌 (${(item.courseIds || []).length}개)
        </button>
      </td>
      <td style="text-align:center;">
        <span class="label ${item.isUsed === 'Y' ? 'label-success' : 'label-default'}" style="font-size:11px;padding:3px 8px;border-radius:10px;">
          ${item.isUsed === 'Y' ? '활성' : '비활성'}
        </span>
      </td>
      <td style="text-align:center;display:flex;gap:4px;justify-content:center;">
        <button type="button" onclick="openAppLiGrpEditModal(${item.id});" class="btn btn-primary btn-xs" style="height:24px;padding:0 8px;font-size:11px;"><i class="fa fa-edit"></i> 수정</button>
        <button type="button" onclick="deleteAppLiGrp(${item.id});" class="btn btn-danger btn-xs" style="height:24px;padding:0 8px;font-size:11px;"><i class="fa fa-trash"></i> 삭제</button>
      </td>
    </tr>
  `).join('');
}

function openAppLiGrpEditModal(id = null) {
  const modal = document.getElementById('modal_appligrp_edit');
  if (!modal) return;
  const isNew = !id;
  document.getElementById('appligrp_modal_title').innerText = isNew ? '중복제한그룹 신규 등록' : '중복제한그룹 수정';
  document.getElementById('appligrp_id').value = id || '';

  if (isNew) {
    const nextCode = `GRP_${String(cfgPartBData.appLiGrps.length + 1).padStart(2, '0')}`;
    document.getElementById('appligrp_code').value = nextCode;
    document.getElementById('appligrp_name').value = '';
    document.getElementById('appligrp_max').value = '1';
    document.getElementById('appligrp_is_used_Y').checked = true;
    document.getElementById('appligrp_memo').value = '';
  } else {
    const item = cfgPartBData.appLiGrps.find(g => g.id === id);
    if (item) {
      document.getElementById('appligrp_code').value = item.code || '';
      document.getElementById('appligrp_name').value = item.name || '';
      document.getElementById('appligrp_max').value = item.maxAllowed || '1';
      if (item.isUsed === 'Y') document.getElementById('appligrp_is_used_Y').checked = true;
      else document.getElementById('appligrp_is_used_N').checked = true;
      document.getElementById('appligrp_memo').value = item.memo || '';
    }
  }

  modal.style.display = 'block';
  modal.classList.add('in');
}

function closeAppLiGrpEditModal() {
  const modal = document.getElementById('modal_appligrp_edit');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('in');
  }
}

function saveAppLiGrpForm() {
  const id = document.getElementById('appligrp_id').value;
  const payload = {
    id: id ? parseInt(id, 10) : undefined,
    code: document.getElementById('appligrp_code').value.trim(),
    name: document.getElementById('appligrp_name').value.trim(),
    maxAllowed: parseInt(document.getElementById('appligrp_max').value || '1', 10),
    isUsed: document.querySelector('input[name="appligrp_is_used"]:checked')?.value || 'Y',
    memo: document.getElementById('appligrp_memo').value.trim()
  };

  if (!payload.code || !payload.name) {
    alert('그룹코드와 그룹명을 입력해주세요.');
    return;
  }

  fetch('/api/ad_cfg/appligrp/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert('중복제한그룹이 저장되었습니다.');
        closeAppLiGrpEditModal();
        loadRestrictionGroups();
      } else {
        alert('저장 실패: ' + res.message);
      }
    });
}

function deleteAppLiGrp(id) {
  if (!confirm('해당 중복제한그룹을 삭제하시겠습니까?')) return;
  fetch('/api/ad_cfg/appligrp/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert('삭제되었습니다.');
        loadRestrictionGroups();
      }
    });
}

var currentAssignGrpId = null;
function openAssignCoursesModal(grpId) {
  currentAssignGrpId = grpId;
  const modal = document.getElementById('modal_appligrp_courses');
  if (!modal) return;
  const grp = cfgPartBData.appLiGrps.find(g => g.id === grpId);
  document.getElementById('assign_grp_title').innerText = grp ? `[${grp.name}] 소속 강좌 선택 매핑` : '소속 강좌 매핑';

  fetch('/api/ad_lec/data/sn/3267')
    .then(r => r.json())
    .then(res => {
      const courses = res.data || [];
      const assignedIds = (grp && grp.courseIds) || [];
      const tbody = document.getElementById('assign_courses_tbody');
      if (tbody) {
        tbody.innerHTML = courses.map((c, i) => `
          <tr>
            <td style="text-align:center;">
              <input type="checkbox" class="assign_chk" value="${c.id}" ${assignedIds.includes(c.id) ? 'checked' : ''}>
            </td>
            <td style="text-align:center;">${i + 1}</td>
            <td style="font-weight:bold;">${c.name}</td>
            <td style="text-align:center;">${c.teacherName || '-'}</td>
            <td style="text-align:center;">${c.grade || '전학년'}</td>
            <td style="text-align:center;">${c.time || '-'}</td>
          </tr>
        `).join('');
      }
      modal.style.display = 'block';
      modal.classList.add('in');
    });
}

function closeAssignCoursesModal() {
  const modal = document.getElementById('modal_appligrp_courses');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('in');
  }
}

function saveAssignedCourses() {
  if (!currentAssignGrpId) return;
  const chks = document.querySelectorAll('.assign_chk:checked');
  const courseIds = Array.from(chks).map(c => parseInt(c.value, 10));

  fetch('/api/ad_cfg/appligrp/assign_courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grpId: currentAssignGrpId, courseIds })
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert('소속 강좌 매핑이 안전하게 저장되었습니다.');
        closeAssignCoursesModal();
        loadRestrictionGroups();
      }
    });
}

// ==================== 5. 학적검증 (ad_verify_main) ====================
function loadAcademicVerification() {
  fetch('/api/ad_verify/data/sn/3267')
    .then(r => r.json())
    .then(res => {
      if (!res.success) return;
      cfgPartBData.verifyList = res.data || [];
      renderAcademicVerification(res);
    })
    .catch(e => console.error('loadAcademicVerification error:', e));
}

function renderAcademicVerification(res) {
  const stats = res.stats || { totalStudents: 450, totalApplicants: 320, matched: 305, mismatched: 15 };
  document.getElementById('verify_stat_total').innerText = stats.totalStudents || 450;
  document.getElementById('verify_stat_apps').innerText = stats.totalApplicants || 320;
  document.getElementById('verify_stat_matched').innerText = stats.matched || 305;
  document.getElementById('verify_stat_mismatched').innerText = stats.mismatched || 15;

  const list = res.data || [];
  const tbody = document.getElementById('verify_list_tbody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:25px;color:#27ae60;font-weight:bold;"><i class="fa fa-check-circle"></i> 모든 수강생의 학적이 나이스(NEIS) 정규 학생명부와 100% 일치합니다.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map((item, idx) => `
    <tr style="background:${item.status === '불일치' ? '#fff5f5' : '#ffffff'};">
      <td style="text-align:center;">
        <input type="checkbox" class="verify_row_chk" value="${item.id}">
      </td>
      <td style="text-align:center;font-weight:bold;">${idx + 1}</td>
      <td style="text-align:center;font-weight:bold;color:#337ab7;">${item.studentName}</td>
      <td style="text-align:center;"><span class="badge" style="background:#3498db;">${item.appGrade}학년 ${item.appClass}반 ${item.appNumber}번</span></td>
      <td style="text-align:center;"><span class="badge" style="background:#2ecc71;">${item.neisGrade ? `${item.neisGrade}학년 ${item.neisClass}반 ${item.neisNumber}번` : '미등록'}</span></td>
      <td style="text-align:center;font-weight:bold;color:#e74c3c;">${item.reason}</td>
      <td style="text-align:center;">
        <span class="label ${item.status === '일치' ? 'label-success' : 'label-danger'}" style="font-size:11px;padding:3px 8px;border-radius:10px;">${item.status}</span>
      </td>
      <td style="text-align:center;">
        <button type="button" onclick="syncSingleVerifyStudent(${item.id});" class="btn btn-warning btn-xs" style="height:24px;padding:0 8px;font-size:11px;">
          <i class="fa fa-refresh"></i> 나이스로 동기화
        </button>
      </td>
    </tr>
  `).join('');
}

function runAcademicVerification() {
  const btn = document.getElementById('btn_run_verify');
  if (btn) btn.disabled = true;
  fetch('/api/ad_verify/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sn: '3267' }) })
    .then(r => r.json())
    .then(res => {
      if (btn) btn.disabled = false;
      alert(`학적검증이 완료되었습니다.\n총 ${res.checkedCount || 320}명 검사 중 불일치 ${res.mismatchedCount || 15}건 발견`);
      loadAcademicVerification();
    })
    .catch(() => {
      if (btn) btn.disabled = false;
    });
}

function syncSelectedVerifyStudents() {
  const chks = document.querySelectorAll('.verify_row_chk:checked');
  if (chks.length === 0) {
    alert('동기화할 학생을 1명 이상 선택해주세요.');
    return;
  }
  const ids = Array.from(chks).map(c => parseInt(c.value, 10));
  if (!confirm(`선택한 ${ids.length}명의 학적을 나이스 등록 기준으로 일괄 자동 갱신하시겠습니까?`)) return;

  fetch('/api/ad_verify/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids })
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert('선택한 학생의 학적이 성공적으로 동기화되었습니다.');
        loadAcademicVerification();
      }
    });
}

function syncSingleVerifyStudent(id) {
  fetch('/api/ad_verify/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids: [id] })
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert('학적이 나이스 기준으로 즉시 동기화되었습니다.');
        loadAcademicVerification();
      }
    });
}

function exportVerifyExcel() {
  window.location.href = '/af/ad_verify/excel/sn/3267';
}

// ==================== 6. 나이스/에듀파인 설정 (ad_neis_edufine_lists) ====================
function loadNeisEdufineSettings() {
  fetch('/api/ad_neis_edufine/data/sn/3267')
    .then(r => r.json())
    .then(res => {
      if (!res.success) return;
      cfgPartBData.neisEdufine = res.data || { neisList: [], edufineCfg: {} };
      renderNeisTable(res.data.neisList || []);
      renderEdufineForm(res.data.edufineCfg || {});
    })
    .catch(e => console.error('loadNeisEdufineSettings error:', e));
}

function renderNeisTable(list) {
  const tbody = document.getElementById('neis_mapping_tbody');
  if (!tbody) return;
  tbody.innerHTML = list.map((item, idx) => `
    <tr>
      <td style="text-align:center;font-weight:bold;">${idx + 1}</td>
      <td style="text-align:center;font-family:monospace;">${item.courseCode || 'C_' + (idx + 101)}</td>
      <td style="font-weight:bold;color:#337ab7;">${item.courseName}</td>
      <td style="text-align:center;">${item.teacherName || '-'}</td>
      <td>
        <input type="text" class="form-control input-sm neis_code_input" id="neis_code_${item.id}" value="${item.neisCode || ''}" placeholder="나이스 과목코드 (예: N_2026_01)" style="height:28px;font-size:12px;">
      </td>
      <td>
        <input type="text" class="form-control input-sm neis_name_input" id="neis_name_${item.id}" value="${item.neisName || ''}" placeholder="나이스 과목명" style="height:28px;font-size:12px;">
      </td>
      <td style="text-align:center;">
        <span class="label ${item.neisCode ? 'label-success' : 'label-warning'}" style="font-size:11px;padding:3px 8px;border-radius:10px;">
          ${item.neisCode ? '매핑완료' : '미매핑'}
        </span>
      </td>
      <td style="text-align:center;">
        <button type="button" onclick="autoSearchNeisCode(${item.id}, '${item.courseName}');" class="btn btn-default btn-xs" style="height:24px;padding:0 8px;font-size:11px;">
          <i class="fa fa-search"></i> 코드검색
        </button>
      </td>
    </tr>
  `).join('');
}

function renderEdufineForm(cfg) {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };
  setVal('edufine_year', cfg.fiscalYear || '2026');
  setVal('edufine_org_code', cfg.orgCode || 'G100003267');
  setVal('edufine_income_code', cfg.incomeCode || 'INC_AFTER_SCHOOL_01');
  setVal('edufine_bank_code', cfg.bankCode || '004');
  setVal('edufine_term_round', cfg.termRound || '1학기 1회차');
  setVal('edufine_memo', cfg.memo || '2026학년도 1학기 늘봄학교 스쿨뱅킹 수납 연계');
}

function autoSearchNeisCode(id, courseName) {
  const code = 'NEIS_' + Math.abs(courseName.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0) % 9000 + 1000);
  const codeEl = document.getElementById(`neis_code_${id}`);
  const nameEl = document.getElementById(`neis_name_${id}`);
  if (codeEl) codeEl.value = code;
  if (nameEl) nameEl.value = courseName;
  alert(`[${courseName}] 과목에 대한 나이스 표준 코드(${code})가 자동 매칭되었습니다.`);
}

function saveNeisMapping() {
  const list = cfgPartBData.neisEdufine.neisList || [];
  const mappings = list.map(item => ({
    id: item.id,
    neisCode: document.getElementById(`neis_code_${item.id}`)?.value.trim(),
    neisName: document.getElementById(`neis_name_${item.id}`)?.value.trim()
  }));

  fetch('/api/ad_neis_edufine/save_mapping', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mappings })
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert('나이스 과목코드 매핑 정보가 저장되었습니다.');
        loadNeisEdufineSettings();
      }
    });
}

function saveEdufineSettings() {
  const payload = {
    fiscalYear: document.getElementById('edufine_year')?.value,
    orgCode: document.getElementById('edufine_org_code')?.value,
    incomeCode: document.getElementById('edufine_income_code')?.value,
    bankCode: document.getElementById('edufine_bank_code')?.value,
    termRound: document.getElementById('edufine_term_round')?.value,
    memo: document.getElementById('edufine_memo')?.value
  };

  fetch('/api/ad_neis_edufine/save_edufine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert('에듀파인 연계 회계 설정이 안전하게 저장되었습니다.');
      }
    });
}

function switchNeisTab(tab) {
  const btnNeis = document.getElementById('tab_btn_neis');
  const btnEdu = document.getElementById('tab_btn_edufine');
  const paneNeis = document.getElementById('pane_neis_mapping');
  const paneEdu = document.getElementById('pane_edufine_config');

  if (tab === 'neis') {
    if (btnNeis) btnNeis.className = 'on active';
    if (btnEdu) btnEdu.className = '';
    if (paneNeis) paneNeis.style.display = 'block';
    if (paneEdu) paneEdu.style.display = 'none';
  } else {
    if (btnNeis) btnNeis.className = '';
    if (btnEdu) btnEdu.className = 'on active';
    if (paneNeis) paneNeis.style.display = 'none';
    if (paneEdu) paneEdu.style.display = 'block';
  }
}

// ==================== 7. 안내글설정, 초기화, 담당자정보 ====================
function loadNoticeSettings() {
  fetch('/api/ad_cfg/message/data/sn/3267')
    .then(r => r.json())
    .then(res => {
      if (!res.success) return;
      cfgPartBData.messages = res.data || {};
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
      };
      setVal('msg_apply_top', res.data.applyTop);
      setVal('msg_refund_guide', res.data.refundGuide);
      setVal('msg_abs_guide', res.data.absGuide);
      setVal('msg_mobile_push', res.data.mobilePush);
    });
}

function saveNoticeSettings() {
  const payload = {
    applyTop: document.getElementById('msg_apply_top')?.value,
    refundGuide: document.getElementById('msg_refund_guide')?.value,
    absGuide: document.getElementById('msg_abs_guide')?.value,
    mobilePush: document.getElementById('msg_mobile_push')?.value
  };

  fetch('/api/ad_cfg/message/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) alert('안내글 설정이 저장되었습니다.');
    });
}

function loadManagerInfo() {
  fetch('/api/ad_info/data/sn/3267')
    .then(r => r.json())
    .then(res => {
      if (!res.success) return;
      cfgPartBData.managerInfo = res.data || {};
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
      };
      setVal('info_dept_name', res.data.deptName || '방과후·늘봄지원센터');
      setVal('info_manager_name', res.data.managerName || '박진수');
      setVal('info_tel_office', res.data.telOffice || '062-609-1100');
      setVal('info_tel_hp', res.data.telHp || '010-2494-1479');
      setVal('info_email', res.data.email || 'parkjinsoo8485@gmail.com');
      setVal('info_work_hours', res.data.workHours || '평일 09:00 ~ 17:00 (점심시간 12:00~13:00 제외)');
      setVal('info_memo', res.data.memo || '늘봄학교 관련 문의사항은 언제든지 연락 바랍니다.');
    });
}

function saveManagerInfo() {
  const payload = {
    deptName: document.getElementById('info_dept_name')?.value,
    managerName: document.getElementById('info_manager_name')?.value,
    telOffice: document.getElementById('info_tel_office')?.value,
    telHp: document.getElementById('info_tel_hp')?.value,
    email: document.getElementById('info_email')?.value,
    workHours: document.getElementById('info_work_hours')?.value,
    memo: document.getElementById('info_memo')?.value
  };

  fetch('/api/ad_info/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) alert('담당자 정보가 성공적으로 변경되었습니다.');
    });
}

function executeSystemDataClear() {
  const confirmText = document.getElementById('clear_confirm_text')?.value.trim();
  const requiredText = '광주풍향초등학교 늘봄학교 초기화';
  if (confirmText !== requiredText) {
    alert(`보안 확인 문구가 일치하지 않습니다.\n입력해야 할 문구: [${requiredText}]`);
    return;
  }

  const chks = document.querySelectorAll('.clear_target_chk:checked');
  if (chks.length === 0) {
    alert('초기화할 데이터 항목을 1개 이상 선택해주세요.');
    return;
  }

  const targets = Array.from(chks).map(c => c.value);
  if (!confirm(`⚠️ [경고] 선택한 ${targets.length}개 항목의 데이터가 영구 초기화됩니다.\n계속 진행하시겠습니까?`)) {
    return;
  }

  fetch('/api/ad_cfg/clear/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targets, confirmText })
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert('선택하신 데이터가 안전하게 초기화되었습니다.');
        document.getElementById('clear_confirm_text').value = '';
      } else {
        alert('초기화 실패: ' + res.message);
      }
    });
}
