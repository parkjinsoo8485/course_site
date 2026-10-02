/**
 * =============================================================================
 * [설문관리 (ad_sur) 클라이언트 로직]
 * Sprint 2 - 설문관리 1:1 완벽 클론 JS
 * 타깃: /af/ad_sur/lists/sn/3267, write, modify, que, ans
 * =============================================================================
 */

// ============================================================
// 시드 데이터 (4개 설문)
// ============================================================
const SUR_SEED = [
  {
    num: 11977,
    sur_type_txt: '강좌(강사기준)',
    lec_div_txt: '3월\n26년 4월\n26년 5월\n26년 6월',
    lec_pro_type_txt: '방과후\n맞춤형',
    title: '[2026년] 늘봄학교 강사 만족도 조사 설문지(학부모용)',
    use_open_pwd: 'Y',
    ans_grp_txt: '학부모',
    ans_grade_txt: '1,2,3,4,5,6',
    que_cnt: 7,
    ans_cnt: 129,
    sur_sdate: '2026-06-10',
    sur_edate: '2026-06-15',
    sur_type: 3,
    ans_grp: 102,
    ans_grade: [1,2,3,4,5,6],
    lec_div: [5,6,7,8]
  },
  {
    num: 11976,
    sur_type_txt: '강좌(강사기준)',
    lec_div_txt: '3월\n26년 4월\n26년 5월\n26년 6월',
    lec_pro_type_txt: '방과후\n맞춤형',
    title: '[2026년] 늘봄학교 강사 만족도 조사 설문지(학생용)',
    use_open_pwd: 'Y',
    ans_grp_txt: '학생',
    ans_grade_txt: '1,2,3,4,5,6',
    que_cnt: 5,
    ans_cnt: 86,
    sur_sdate: '2026-06-10',
    sur_edate: '2026-06-15',
    sur_type: 3,
    ans_grp: 2,
    ans_grade: [1,2,3,4,5,6],
    lec_div: [5,6,7,8]
  },
  {
    num: 11975,
    sur_type_txt: '종합',
    lec_div_txt: '-',
    lec_pro_type_txt: '전체',
    title: '[2026년] 늘봄학교 만족도 조사 설문지(학부모용)',
    use_open_pwd: 'Y',
    ans_grp_txt: '학부모',
    ans_grade_txt: '1,2,3,4,5,6',
    que_cnt: 5,
    ans_cnt: 34,
    sur_sdate: '2026-06-10',
    sur_edate: '2026-06-15',
    sur_type: 1,
    ans_grp: 102,
    ans_grade: [1,2,3,4,5,6],
    lec_div: []
  },
  {
    num: 11974,
    sur_type_txt: '종합',
    lec_div_txt: '-',
    lec_pro_type_txt: '전체',
    title: '[2026년] 늘봄학교 만족도 조사 설문지(학생용)',
    use_open_pwd: 'Y',
    ans_grp_txt: '학생',
    ans_grade_txt: '1,2,3,4,5,6',
    que_cnt: 5,
    ans_cnt: 22,
    sur_sdate: '2026-06-10',
    sur_edate: '2026-06-15',
    sur_type: 1,
    ans_grp: 2,
    ans_grade: [1,2,3,4,5,6],
    lec_div: []
  }
];

// 샘플 문항 시드
const SUR_QUE_SEED = {
  11977: [
    { num: 90448, title: '프로그램 운영 시간이 잘 지켜졌다.', required: true, type: 'radio', options: ['매우 그렇다(5점)', '그렇다(4점)', '보통이다(3점)', '그렇지 않다(2점)', '전혀 그렇지 않다(1점)'] },
    { num: 90449, title: '강사의 수업 준비가 충실했다.', required: true, type: 'radio', options: ['매우 그렇다(5점)', '그렇다(4점)', '보통이다(3점)', '그렇지 않다(2점)', '전혀 그렇지 않다(1점)'] },
    { num: 90450, title: '프로그램 내용이 아이의 흥미/적성에 맞았다.', required: true, type: 'radio', options: ['매우 그렇다(5점)', '그렇다(4점)', '보통이다(3점)', '그렇지 않다(2점)', '전혀 그렇지 않다(1점)'] },
    { num: 90451, title: '강사는 아이와의 소통 및 상호작용에 적극적이었다.', required: false, type: 'radio', options: ['매우 그렇다(5점)', '그렇다(4점)', '보통이다(3점)', '그렇지 않다(2점)', '전혀 그렇지 않다(1점)'] },
    { num: 90452, title: '강사의 교육 방법(교수법)이 적절했다.', required: false, type: 'radio', options: ['매우 그렇다(5점)', '그렇다(4점)', '보통이다(3점)', '그렇지 않다(2점)', '전혀 그렇지 않다(1점)'] },
    { num: 90453, title: '전반적으로 이 프로그램에 만족한다.', required: true, type: 'radio', options: ['매우 그렇다(5점)', '그렇다(4점)', '보통이다(3점)', '그렇지 않다(2점)', '전혀 그렇지 않다(1점)'] },
    { num: 90454, title: '개선이 필요한 점이나 건의사항이 있으시면 작성해 주세요.', required: false, type: 'text', options: [] }
  ]
};

// ============================================================
// 목록 렌더링
// ============================================================
function loadSurList() {
  const tbody = document.getElementById('surTableTbody');
  if (!tbody) return;

  if (SUR_SEED.length === 0) {
    tbody.innerHTML = '<tr><td colspan="13" style="text-align:center;padding:30px;color:#999;">등록된 설문이 없습니다.</td></tr>';
    return;
  }

  let html = '';
  SUR_SEED.forEach((s, idx) => {
    const pwdBadge = s.use_open_pwd === 'Y' ? '<span class="use_open_pwd" style="background:#f0f0f0;border:1px solid #ccc;border-radius:3px;padding:1px 5px;font-size:10px;color:#666;margin-right:4px;">비밀번호 사용</span>' : '';
    const lecDivHtml = s.lec_div_txt.replace(/\n/g, '<br>');
    const proTypeHtml = s.lec_pro_type_txt.replace(/\n/g, '<br>');

    html += `<tr>
      <td><input type="checkbox" name="data_checked[]" value="${s.num}"></td>
      <td class="mobile_none">${SUR_SEED.length - idx}</td>
      <td><a href="#none;" onclick="openSurModifyModal(${s.num}); return false;"><i class="fa fa-cog icon_btn" title="수정" style="cursor:pointer;color:#555;"></i></a></td>
      <td>${s.sur_type_txt}</td>
      <td style="font-size:11px;">${lecDivHtml}</td>
      <td style="font-size:11px;">${proTypeHtml}</td>
      <td class="noti_title text-left">
        <a href="#none;" onclick="openSurQueModal(${s.num}); return false;" class="link_type" title="문항보기">
          ${pwdBadge}${s.title}
        </a>
      </td>
      <td>${s.ans_grp_txt}</td>
      <td>${s.ans_grade_txt}</td>
      <td><a href="#none;" onclick="openSurQueModal(${s.num}); return false;" class="link_type" title="문항보기">${s.que_cnt}</a></td>
      <td><a href="#none;" onclick="openSurAnsModal(${s.num}); return false;" class="link_type" title="결과보기">${s.ans_cnt}</a></td>
      <td style="font-size:11px;">${s.sur_sdate}~<br>${s.sur_edate}</td>
      <td><a href="#none;" onclick="surChkDel(${s.num}); return false;"><i class="fa fa-trash-o icon_btn" title="삭제" style="cursor:pointer;color:#d9534f;"></i></a></td>
    </tr>`;
  });
  tbody.innerHTML = html;
}

// ============================================================
// 모달 열기/닫기 공통
// ============================================================
function openSurModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) {
    el.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
}

function closeSurModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) {
    el.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    ['modal_ad_sur_write', 'modal_ad_sur_modify', 'modal_ad_sur_que', 'modal_ad_sur_ans'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.style.display !== 'none') closeSurModal(id);
    });
  }
});

// ============================================================
// 설문 등록 모달
// ============================================================
function openSurWriteModal() {
  // 폼 초기화
  const form = document.getElementById('fm_edit');
  if (form) form.reset();

  // 조건부 행 초기화
  const trLecDiv = document.getElementById('tr_lec_div');
  const trLecPro = document.getElementById('tr_lec_pro_type');
  const trAnsGrade = document.getElementById('tr_ans_grade');
  const trUsePwd = document.getElementById('tr_use_open_pwd');
  if (trLecDiv) trLecDiv.style.display = 'none';
  if (trLecPro) trLecPro.style.display = 'none';
  if (trAnsGrade) trAnsGrade.style.display = 'none';
  if (trUsePwd) trUsePwd.style.display = 'none';

  openSurModal('modal_ad_sur_write');
}

function surChkType() {
  const val = document.querySelector('input[name="sur_type"]:checked');
  const trLecDiv = document.getElementById('tr_lec_div');
  const trLecPro = document.getElementById('tr_lec_pro_type');
  if (!val) return;
  if (val.value === '2' || val.value === '3') {
    if (trLecDiv) trLecDiv.style.display = '';
    if (trLecPro) trLecPro.style.display = '';
  } else {
    if (trLecDiv) trLecDiv.style.display = 'none';
    if (trLecPro) trLecPro.style.display = 'none';
  }
}

function surChkAnsGrp() {
  const val = document.querySelector('input[name="ans_grp"]:checked');
  const trAnsGrade = document.getElementById('tr_ans_grade');
  const trUsePwd = document.getElementById('tr_use_open_pwd');
  if (!val) return;
  // 학생(2)이나 학부모(102)일 때 대상학년 표시
  if (val.value === '2' || val.value === '102') {
    if (trAnsGrade) trAnsGrade.style.display = '';
    if (trUsePwd) trUsePwd.style.display = '';
  } else {
    if (trAnsGrade) trAnsGrade.style.display = 'none';
    if (trUsePwd) trUsePwd.style.display = 'none';
  }
}

function surChkAllLecDiv(el) {
  document.querySelectorAll('input[name="lec_div[]"]').forEach(cb => { cb.checked = el.checked; });
}

function surChkAllGrade(el) {
  document.querySelectorAll('input[name="ans_grade[]"]').forEach(cb => { cb.checked = el.checked; });
}

function surChkLecProTypeAll() {
  const allCb = document.getElementById('lec_pro_type_all');
  document.querySelectorAll('.lec_pro_type').forEach(cb => {
    cb.disabled = allCb && allCb.checked;
    if (allCb && allCb.checked) cb.checked = false;
  });
}

function onSurSampleChange(sel) {
  console.log('샘플설문 선택:', sel.value);
}

function surWriteSubmit() {
  const title = document.getElementById('sur_title');
  if (!title || !title.value.trim()) {
    alert('제목을 입력해 주세요.');
    if (title) title.focus();
    return false;
  }
  const surType = document.querySelector('input[name="sur_type"]:checked');
  if (!surType) {
    alert('설문구분을 선택해 주세요.');
    return false;
  }
  const ansGrp = document.querySelector('input[name="ans_grp"]:checked');
  if (!ansGrp) {
    alert('참여구분을 선택해 주세요.');
    return false;
  }
  const sdate = document.getElementById('sur_sdate');
  const edate = document.getElementById('sur_edate');
  if (!sdate || !sdate.value.trim() || !edate || !edate.value.trim()) {
    alert('설문기간을 입력해 주세요.');
    return false;
  }

  // 새 설문 추가
  const newSur = {
    num: Date.now(),
    sur_type_txt: surType.value === '1' ? '종합' : surType.value === '2' ? '강좌' : '강좌(강사기준)',
    lec_div_txt: '-',
    lec_pro_type_txt: '전체',
    title: title.value.trim(),
    use_open_pwd: document.getElementById('use_open_pwd') && document.getElementById('use_open_pwd').checked ? 'Y' : 'N',
    ans_grp_txt: ansGrp.value === '2' ? '학생' : ansGrp.value === '102' ? '학부모' : ansGrp.value === '4' ? '강사' : '교직원',
    ans_grade_txt: '1,2,3,4,5,6',
    que_cnt: 0,
    ans_cnt: 0,
    sur_sdate: sdate.value,
    sur_edate: edate.value,
    sur_type: parseInt(surType.value),
    ans_grp: parseInt(ansGrp.value),
    ans_grade: [1,2,3,4,5,6],
    lec_div: []
  };

  SUR_SEED.unshift(newSur);
  loadSurList();
  closeSurModal('modal_ad_sur_write');
  alert('설문이 등록되었습니다.');
  return false;
}

// ============================================================
// 설문 수정 모달
// ============================================================
function openSurModifyModal(surNum) {
  const sur = SUR_SEED.find(s => s.num === surNum);
  if (!sur) return;

  const numEl = document.getElementById('mod_sur_num');
  if (numEl) numEl.value = surNum;

  const titleEl = document.getElementById('mod_sur_title');
  if (titleEl) titleEl.value = sur.title;

  // 설문구분 라디오
  const typeRadio = document.querySelector(`input[name="mod_sur_type"][value="${sur.sur_type}"]`);
  if (typeRadio) typeRadio.checked = true;

  // 강좌구분 행 토글
  const modTrLecDiv = document.getElementById('mod_tr_lec_div');
  if (modTrLecDiv) modTrLecDiv.style.display = (sur.sur_type === 2 || sur.sur_type === 3) ? '' : 'none';

  // lec_div 체크박스
  [5,6,7,8].forEach(v => {
    const cb = document.getElementById(`mod_lec_div_${v}`);
    if (cb) cb.checked = sur.lec_div && sur.lec_div.includes(v);
  });

  // 참여구분
  const ansGrpRadio = document.querySelector(`input[name="mod_ans_grp"][value="${sur.ans_grp}"]`);
  if (ansGrpRadio) ansGrpRadio.checked = true;

  // 대상학년
  [1,2,3,4,5,6].forEach(g => {
    const cb = document.getElementById(`mod_ans_grade_${g}`);
    if (cb) cb.checked = sur.ans_grade && sur.ans_grade.includes(g);
  });

  // 설문기간
  const sdateEl = document.getElementById('mod_sur_sdate');
  const edateEl = document.getElementById('mod_sur_edate');
  if (sdateEl) sdateEl.value = sur.sur_sdate;
  if (edateEl) edateEl.value = sur.sur_edate;

  openSurModal('modal_ad_sur_modify');
}

function surModChkType() {
  const val = document.querySelector('input[name="mod_sur_type"]:checked');
  const modTrLecDiv = document.getElementById('mod_tr_lec_div');
  if (!val) return;
  if (modTrLecDiv) modTrLecDiv.style.display = (val.value === '2' || val.value === '3') ? '' : 'none';
}

function surModifySubmit() {
  const numEl = document.getElementById('mod_sur_num');
  const titleEl = document.getElementById('mod_sur_title');
  if (!titleEl || !titleEl.value.trim()) {
    alert('제목을 입력해 주세요.');
    return false;
  }

  const surNum = parseInt(numEl ? numEl.value : 0);
  const idx = SUR_SEED.findIndex(s => s.num === surNum);
  if (idx >= 0) {
    SUR_SEED[idx].title = titleEl.value.trim();
    const sdateEl = document.getElementById('mod_sur_sdate');
    const edateEl = document.getElementById('mod_sur_edate');
    if (sdateEl) SUR_SEED[idx].sur_sdate = sdateEl.value;
    if (edateEl) SUR_SEED[idx].sur_edate = edateEl.value;
  }

  loadSurList();
  closeSurModal('modal_ad_sur_modify');
  alert('설문이 수정되었습니다.');
  return false;
}

// ============================================================
// 설문 문항 모달
// ============================================================
function openSurQueModal(surNum) {
  // 셀렉트박스 옵션 채우기
  const selEl = document.getElementById('sur_que_sel');
  if (selEl) {
    selEl.innerHTML = '<option value="">== 설문 선택 ==</option>';
    SUR_SEED.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.num;
      opt.textContent = `[${s.sur_type_txt}] ${s.title}`;
      if (s.num === surNum) opt.selected = true;
      selEl.appendChild(opt);
    });
  }

  openSurModal('modal_ad_sur_que');
  if (surNum) renderSurQue(surNum);
}

function onSurQueChange(sel) {
  if (sel.value) renderSurQue(parseInt(sel.value));
}

function renderSurQue(surNum) {
  const queArea = document.getElementById('sur_que_list_area');
  if (!queArea) return;

  const ques = SUR_QUE_SEED[surNum] || [];

  if (ques.length === 0) {
    queArea.innerHTML = '<div style="text-align:center;padding:20px;color:#999;">등록된 문항이 없습니다. [문항등록] 버튼을 클릭하여 문항을 추가하세요.</div>';
    return;
  }

  let html = '';
  ques.forEach((q, idx) => {
    const reqTag = q.required ? ' <strong>(필수)</strong>' : '';
    let optHtml = '';
    if (q.type === 'radio') {
      q.options.forEach((opt, i) => {
        optHtml += `<ul><li>${i+1}) <input type="radio" name="que_${q.num}" id="que_${q.num}_${i+1}" value="${5-i}"><label for="que_${q.num}_${i+1}">${opt}</label></li></ul>`;
      });
    } else {
      optHtml = `<div style="margin-top:6px;"><textarea class="form-control" rows="2" style="width:100%;resize:vertical;" placeholder="자유롭게 입력해 주세요..."></textarea></div>`;
    }

    html += `
    <div class="panel-body ad_sur_que_list" style="border:1px solid #e5e5e5; border-radius:4px; padding:12px; margin-bottom:10px; background:#fafafa;">
      <div class="question_title" style="font-weight:bold; font-size:13px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
        <span>${idx+1}. ${q.title}${reqTag}</span>
        <span>
          <a href="#none;" onclick="alert('문항 수정'); return false;"><i class="fa fa-cog icon_btn" title="수정" style="cursor:pointer;color:#555;margin-right:4px;"></i></a>
          <a href="#none;" onclick="surQueChkDel(${q.num}); return false;"><i class="fa fa-trash-o icon_btn" title="삭제" style="cursor:pointer;color:#d9534f;"></i></a>
        </span>
      </div>
      <div class="question_list" style="font-size:12px;">
        ${optHtml}
      </div>
    </div>`;
  });

  queArea.innerHTML = html;
}

function openSurQueWrite() {
  alert('문항등록 팝업 (구현 예정)');
}

function openSurQueSort() {
  alert('출력순서 변경 팝업 (구현 예정)');
}

function surQueChkDel(queNum) {
  if (confirm(`문항 #${queNum}을 삭제하시겠습니까?`)) {
    alert('문항이 삭제되었습니다.');
  }
}

// ============================================================
// 설문 결과 모달
// ============================================================
function openSurAnsModal(surNum) {
  const sur = SUR_SEED.find(s => s.num === surNum);
  if (!sur) return;

  const titleEl = document.getElementById('sur_ans_title');
  if (titleEl) {
    titleEl.innerHTML = `
      <strong>${sur.title}</strong><br>
      <span style="color:#555;">설문구분: ${sur.sur_type_txt} | 참여구분: ${sur.ans_grp_txt}</span><br>
      <span style="color:#555;">기간: ${sur.sur_sdate} ~ ${sur.sur_edate}</span>
    `;
  }

  const statsEl = document.getElementById('sur_ans_stats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div style="font-size:18px; font-weight:bold; color:#337ab7; margin-bottom:4px;">${sur.ans_cnt}명</div>
      <div>총 참여자 수</div>
      <div style="margin-top:6px;">문항 수: <strong>${sur.que_cnt}문항</strong></div>
    `;
  }

  // 결과 영역
  const resultArea = document.getElementById('sur_ans_result_area');
  if (resultArea) {
    const ques = SUR_QUE_SEED[surNum] || [];
    if (ques.length === 0) {
      resultArea.innerHTML = '<div style="text-align:center;padding:15px;color:#999;">문항이 없습니다.</div>';
    } else {
      let html = '';
      ques.forEach((q, idx) => {
        if (q.type === 'radio') {
          const scores = [85, 30, 10, 3, 1];
          const total = scores.reduce((a,b) => a+b, 0);
          let optHtml = '';
          q.options.forEach((opt, i) => {
            const cnt = scores[i] || 0;
            const pct = total > 0 ? Math.round(cnt / total * 100) : 0;
            optHtml += `
              <div style="margin-bottom:4px; display:flex; align-items:center; gap:8px;">
                <span style="width:180px; font-size:11px; color:#555;">${opt}</span>
                <div style="flex:1; background:#e9ecef; border-radius:3px; height:14px; overflow:hidden;">
                  <div style="background:#337ab7; width:${pct}%; height:100%; border-radius:3px;"></div>
                </div>
                <span style="width:60px; text-align:right; font-size:11px; color:#333;">${cnt}명 (${pct}%)</span>
              </div>`;
          });
          html += `
          <div style="border:1px solid #e5e5e5; border-radius:4px; padding:10px; margin-bottom:8px; background:#fff;">
            <div style="font-weight:bold; font-size:12px; margin-bottom:6px; color:#333;">${idx+1}. ${q.title}</div>
            ${optHtml}
          </div>`;
        } else {
          html += `
          <div style="border:1px solid #e5e5e5; border-radius:4px; padding:10px; margin-bottom:8px; background:#fff;">
            <div style="font-weight:bold; font-size:12px; margin-bottom:6px; color:#333;">${idx+1}. ${q.title}</div>
            <div style="font-size:11px; color:#777;">주관식 응답 (${Math.floor(Math.random()*20)+5}건)</div>
          </div>`;
        }
      });
      resultArea.innerHTML = html;
    }
  }

  // 개별 응답 목록
  const tbody = document.getElementById('sur_ans_list_tbody');
  if (tbody) {
    const names = ['김민준', '이서연', '박지우', '최현우', '정다은', '한수빈', '오태양', '윤채원', '임도현', '강나연'];
    const courses = ['피아노', '미술', '체육', '영어', '로봇과학'];
    let rows = '';
    for (let i = 0; i < Math.min(sur.ans_cnt, 10); i++) {
      rows += `<tr>
        <td style="text-align:center;">${sur.ans_cnt - i}</td>
        <td style="text-align:center;">${names[i % names.length]}</td>
        <td style="text-align:center;">${courses[i % courses.length]}</td>
        <td style="text-align:center;">2026-06-1${(i % 6)+1} 1${(i % 4)+4}:${(i*7%60).toString().padStart(2,'0')}</td>
        <td style="text-align:center;"><a href="#none;" onclick="alert('상세 응답 보기'); return false;" class="btn btn-default btn-xs">보기</a></td>
      </tr>`;
    }
    tbody.innerHTML = rows || '<tr><td colspan="5" style="text-align:center;padding:15px;color:#999;">참여자가 없습니다.</td></tr>';
  }

  openSurModal('modal_ad_sur_ans');
}

function exportSurExcel() {
  window.open('/af/ad_sur/excel/sn/3267', '_blank');
}

// ============================================================
// 삭제 / 일괄 적용
// ============================================================
function surChkDel(surNum) {
  if (!confirm('이 설문을 삭제하시겠습니까?\n(참여 결과도 함께 삭제됩니다.)')) return;
  const idx = SUR_SEED.findIndex(s => s.num === surNum);
  if (idx >= 0) SUR_SEED.splice(idx, 1);
  loadSurList();
  alert('설문이 삭제되었습니다.');
}

function surChkAll(el) {
  document.querySelectorAll('input[name="data_checked[]"]').forEach(cb => { cb.checked = el.checked; });
}

function surBulkAction() {
  const updateType = document.getElementById('update_type');
  const val = updateType ? updateType.value : '';
  const checked = [...document.querySelectorAll('input[name="data_checked[]"]:checked')];

  if (!val) { alert('일괄적용 항목을 선택하세요.'); return; }
  if (checked.length === 0) { alert('적용할 항목을 선택하세요.'); return; }

  if (!confirm(`선택한 ${checked.length}건을 "${updateType.options[updateType.selectedIndex].text}" 처리하시겠습니까?`)) return;

  if (val === 'del') {
    const nums = checked.map(cb => parseInt(cb.value));
    nums.forEach(n => {
      const idx = SUR_SEED.findIndex(s => s.num === n);
      if (idx >= 0) SUR_SEED.splice(idx, 1);
    });
    loadSurList();
    alert(`${nums.length}건 삭제 완료.`);
  } else if (val === 'ans_del') {
    checked.forEach(cb => {
      const n = parseInt(cb.value);
      const s = SUR_SEED.find(x => x.num === n);
      if (s) s.ans_cnt = 0;
    });
    loadSurList();
    alert('참여결과 삭제 완료.');
  }
}

// ============================================================
// 샘플설문 목록 렌더링 (패널 17)
// ============================================================
function loadSampleSurList() {
  const tbody = document.getElementById('sampleSurveyTbody');
  if (!tbody) return;

  const samples = [
    { cat: '서비스_종합', title: '[2026년] 늘봄학교 운영계획 수립을 위한 설문', que_cnt: 8 },
    { cat: '서비스_종합', title: '방과후학교 연간 운영 만족도 설문지(학부모용)', que_cnt: 10 },
    { cat: '서비스_종합', title: '방과후학교 연간 운영 만족도 설문지(학생용)', que_cnt: 8 },
    { cat: '서비스_강좌(강사기준)', title: '[광주 2026년] 늘봄학교 강사 만족도 조사 설문지(학부모용)', que_cnt: 7 },
    { cat: '서비스_강좌(강사기준)', title: '[광주 2026년] 늘봄학교 강사 만족도 조사 설문지(학생용)', que_cnt: 6 },
    { cat: '서비스_강좌(강사기준)', title: '방과후학교 프로그램 및 강사 만족도 설문지(학부모용) (2024년)', que_cnt: 9 },
    { cat: '서비스_강좌(강사기준)', title: '방과후학교 프로그램 및 강사 만족도 설문지(학생용) (2024년)', que_cnt: 8 },
  ];

  let html = '';
  samples.forEach((s, idx) => {
    html += `<tr>
      <td style="font-size:11px; text-align:center;">${s.cat}</td>
      <td style="font-size:12px;"><a href="#none;" onclick="alert('샘플설문 복제 기능'); return false;" class="link_type">${s.title}</a></td>
      <td style="text-align:center;">${s.que_cnt}</td>
      <td style="text-align:center;"><button onclick="alert('이 샘플을 내 설문으로 복제합니다.'); return false;" class="btn btn-primary btn-xs" style="height:26px;padding:0 10px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;line-height:1;">복제 사용</button></td>
    </tr>`;
  });
  tbody.innerHTML = html;
}

// ============================================================
// 패널 전환 시 설문 목록 자동 로드
// ============================================================
(function() {
  // switchSubmodelView 훅 (기존 함수가 있는 경우 덮어쓰기 방지)
  const origSwitchSubmodelView = window.switchSubmodelView;
  window.switchSubmodelView = function(evt, viewKey, url) {
    if (origSwitchSubmodelView) origSwitchSubmodelView(evt, viewKey, url);

    requestAnimationFrame(function() {
      if (viewKey === 'ad_sur_lists') loadSurList();
      if (viewKey === 'ad_surs_lists') loadSampleSurList();
    });
  };

  // DOMContentLoaded 시 현재 URL이 ad_sur면 자동 로드
  document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    if (path.includes('/af/ad_sur/') || path.includes('/af/ad_surs/')) {
      setTimeout(function() {
        if (path.includes('/ad_surs/')) {
          loadSampleSurList();
        } else {
          loadSurList();
        }
      }, 200);
    }

    // 패널 감시 (MutationObserver)
    const panel = document.getElementById('panel_ad_sur_lists');
    if (panel) {
      const obs = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
          if (m.attributeName === 'style' && panel.style.display !== 'none') {
            loadSurList();
          }
        });
      });
      obs.observe(panel, { attributes: true });
    }

    const samplePanel = document.getElementById('panel_ad_surs_lists');
    if (samplePanel) {
      const obs2 = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
          if (m.attributeName === 'style' && samplePanel.style.display !== 'none') {
            loadSampleSurList();
          }
        });
      });
      obs2.observe(samplePanel, { attributes: true });
    }
  });
})();
