/**
 * =========================================================================================
 * [Business Logic] 설문관리 (ad_sur) & 샘플설문 (ad_surs) 1:1 완벽 클론 로직 모듈
 * =========================================================================================
 */

// 1. 설문관리 시드 데이터 (타깃 실측 1:1 매핑)
let surveyStore = [
  {
    sur_num: 11977,
    sur_title: "[2026년] 늘봄학교 강사 만족도 조사 설문지(학부모용)",
    sur_type: 2, // 강좌(강사기준)
    sur_type_label: "강좌(강사기준)",
    lec_div: ["3월", "26년 4월", "26년 5월", "26년 6월"],
    lec_pro_type: ["방과후", "맞춤형"],
    ans_grp: 2, // 학부모
    ans_grp_label: "학부모",
    ans_grade: ["1", "2", "3", "4", "5", "6"],
    use_open_pwd: "Y",
    que_count: 7,
    ans_count: 129,
    sur_sdate: "2026-06-10",
    sur_edate: "2026-06-15",
    sur_content: "우리 학교에서는 늘봄학교를 이용해 주시는 학부모님들의 의견 수렴을 위해 2026학년도 1학기 늘봄학교 강사 만족도 조사를 아래와 같이 실시합니다. 다음의 문항에 성실히 답변해 주시기 바랍니다."
  },
  {
    sur_num: 11976,
    sur_title: "[2026년] 늘봄학교 강사 만족도 조사 설문지(학생용)",
    sur_type: 2, // 강좌(강사기준)
    sur_type_label: "강좌(강사기준)",
    lec_div: ["3월", "26년 4월", "26년 5월", "26년 6월"],
    lec_pro_type: ["방과후", "맞춤형"],
    ans_grp: 102, // 학생
    ans_grp_label: "학생",
    ans_grade: ["1", "2", "3", "4", "5", "6"],
    use_open_pwd: "Y",
    que_count: 5,
    ans_count: 86,
    sur_sdate: "2026-06-10",
    sur_edate: "2026-06-15",
    sur_content: "늘봄학교 수업에 참여하고 있는 학생 여러분의 소중한 생각을 듣고자 합니다. 즐겁고 유익한 수업을 만들기 위해 솔직하게 작성해 주세요."
  },
  {
    sur_num: 11975,
    sur_title: "[2026년] 늘봄학교 만족도 조사 설문지(학부모용)",
    sur_type: 1, // 종합
    sur_type_label: "종합",
    lec_div: ["-"],
    lec_pro_type: ["전체"],
    ans_grp: 2, // 학부모
    ans_grp_label: "학부모",
    ans_grade: ["1", "2", "3", "4", "5", "6"],
    use_open_pwd: "Y",
    que_count: 5,
    ans_count: 34,
    sur_sdate: "2026-06-10",
    sur_edate: "2026-06-15",
    sur_content: "늘봄학교 종합 운영 만족도 조사입니다. 전반적인 교육 환경과 돌봄 지원에 대한 의견을 부탁드립니다."
  },
  {
    sur_num: 11974,
    sur_title: "[2026년] 늘봄학교 만족도 조사 설문지(학생용)",
    sur_type: 1, // 종합
    sur_type_label: "종합",
    lec_div: ["-"],
    lec_pro_type: ["전체"],
    ans_grp: 102, // 학생
    ans_grp_label: "학생",
    ans_grade: ["1", "2", "3", "4", "5", "6"],
    use_open_pwd: "Y",
    que_count: 5,
    ans_count: 22,
    sur_sdate: "2026-06-10",
    sur_edate: "2026-06-15",
    sur_content: "늘봄학교 종합 학생 설문조사입니다. 학생 여러분의 즐거운 학교 생활을 응원합니다."
  }
];

// 2. 문항관리 시드 데이터
const questionStore = {
  11977: [
    { id: 90448, num: 1, type: "choice", title: "강사님은 수업 준비를 철저히 하시고 수업 시간을 준수하십니까?", options: ["매우 그렇다 (56)", "그렇다 (36)", "보통이다 (12)", "그렇지 않다 (2)", "매우 그렇지 않다 (0)"], scores: [56, 36, 12, 2, 0] },
    { id: 90449, num: 2, type: "choice", title: "강사님은 학생들의 수준에 맞추어 열성적으로 지도하십니까?", options: ["매우 그렇다 (62)", "그렇다 (46)", "보통이다 (8)", "그렇지 않다 (1)", "매우 그렇지 않다 (0)"], scores: [62, 46, 8, 1, 0] },
    { id: 90450, num: 3, type: "choice", title: "수업 내용이 학생의 소질 계발과 학업 및 인성 함양에 도움이 됩니까?", options: ["매우 그렇다 (58)", "그렇다 (41)", "보통이다 (14)", "그렇지 않다 (3)", "매우 그렇지 않다 (0)"], scores: [58, 41, 14, 3, 0] },
    { id: 90451, num: 4, type: "choice", title: "강사님은 학생들을 친절하고 안전하게 지도하십니까?", options: ["매우 그렇다 (68)", "그렇다 (45)", "보통이다 (5)", "그렇지 않다 (0)", "매우 그렇지 않다 (0)"], scores: [68, 45, 5, 0, 0] },
    { id: 90452, num: 5, type: "choice", title: "수업 후 학생의 안전한 귀가 및 생활 지도가 잘 이루어집니까?", options: ["매우 그렇다 (65)", "그렇다 (45)", "보통이다 (7)", "그렇지 않다 (1)", "매우 그렇지 않다 (0)"], scores: [65, 45, 7, 1, 0] },
    { id: 90453, num: 6, type: "choice", title: "다음 학기에도 본 프로그램 및 강사님의 강좌에 계속 참여할 의향이 있으십니까?", options: ["매우 그렇다 (70)", "그렇다 (44)", "보통이다 (8)", "그렇지 않다 (2)", "매우 그렇지 않다 (0)"], scores: [70, 44, 8, 2, 0] },
    { id: 90454, num: 7, type: "text", title: "강사님 또는 늘봄학교 운영에 바라는 점이나 건의사항이 있으시면 자유롭게 적어주세요.", answers: ["아이들이 너무 재미있어하고 강사님이 따뜻하게 챙겨주셔서 감사합니다.", "재료 준비가 충실해서 만족스럽습니다.", "다음 학기에도 꼭 개설되었으면 좋겠습니다."] }
  ]
};

// 3. 샘플설문 시드 데이터 (타깃 실측 42건 중 주요 대표 샘플들)
const sampleSurveyStore = [
  { num: 42, reg_type: "서비스", sur_type: "종합", title: "[경기2] 초1~2 맞춤형/ 돌봄/ 수익자 방과후> 2027학년도 운영을 위한 기초 수요조사 설문 (학부모 대상)", que_count: 8 },
  { num: 41, reg_type: "서비스", sur_type: "방과후", title: "[경기2] 2026 2학기 프로그램 운영 만족도 조사 설문 (학부모)- 방과후", que_count: 6 },
  { num: 40, reg_type: "서비스", sur_type: "돌봄", title: "[경기2] 2026 2학기 프로그램 운영 만족도 조사 설문 (학부모)- 돌봄", que_count: 6 },
  { num: 39, reg_type: "서비스", sur_type: "맞춤형", title: "[경기2] 2026 2학기 프로그램 운영 만족도 조사 설문 (학부모)- 초1~2 맞춤형", que_count: 6 },
  { num: 38, reg_type: "서비스", sur_type: "방과후", title: "[경기2] 2026 2학기 프로그램 운영 만족도 조사 설문 - 방과후", que_count: 5 },
  { num: 37, reg_type: "서비스", sur_type: "종합", title: "2026학년도 방과후학교 운영 및 강사 만족도 조사 (학생/학부모 공용)", que_count: 7 },
  { num: 36, reg_type: "서비스", sur_type: "강좌", title: "늘봄학교 특기적성 강좌별 만족도 및 차년도 수요조사", que_count: 6 },
  { num: 35, reg_type: "서비스", sur_type: "돌봄", title: "초등돌봄교실 급·간식 및 안전 귀가 만족도 설문", que_count: 5 }
];

/**
 * 설문관리 메인 테이블 렌더링
 */
function renderSurTable() {
  const tbody = document.getElementById('surTableTbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  surveyStore.forEach((sur, index) => {
    const seq = surveyStore.length - index;
    const tr = document.createElement('tr');
    tr.style.verticalAlign = 'middle';

    const lecDivStr = sur.lec_div.join('<br>');
    const proTypeStr = sur.lec_pro_type.join('<br>');
    const pwdBadge = sur.use_open_pwd === 'Y' 
      ? '<span class="badge" style="background:#5bc0de; font-size:10px; margin-right:4px;">비밀번호 사용</span> ' 
      : '';

    tr.innerHTML = `
      <td><input type="checkbox" name="data_checked[]" value="${sur.sur_num}" class="sur-item-check" style="cursor: pointer;"></td>
      <td class="mobile_none">${seq}</td>
      <td>
        <a href="#none;" onclick="openSurModify(${sur.sur_num}); return false;" title="수정" style="color: #337ab7; font-size: 14px;">
          <i class="fa fa-cog icon_btn"></i>
        </a>
      </td>
      <td><span class="label ${sur.sur_type === 1 ? 'label-default' : 'label-primary'}" style="font-size: 11px;">${sur.sur_type_label}</span></td>
      <td style="font-size: 11px; line-height: 1.3;">${lecDivStr}</td>
      <td style="font-size: 11px; line-height: 1.3;">${proTypeStr}</td>
      <td class="noti_title text-left" style="text-align: left !important;">
        <a href="#none;" onclick="openSurQue(${sur.sur_num}); return false;" class="link_type" title="문항보기" style="color: #23527c; font-weight: 500;">
          ${pwdBadge}${sur.sur_title}
        </a>
      </td>
      <td><span class="badge" style="background: ${sur.ans_grp === 2 ? '#337ab7' : '#5cb85c'}; font-weight: normal;">${sur.ans_grp_label}</span></td>
      <td>${sur.ans_grade.join(',')}</td>
      <td>
        <a href="#none;" onclick="openSurQue(${sur.sur_num}); return false;" class="link_type" title="문항보기" style="font-weight: bold; color: #337ab7;">
          ${sur.que_count}
        </a>
      </td>
      <td>
        <a href="#none;" onclick="openSurAns(${sur.sur_num}); return false;" class="link_type" title="결과보기" style="font-weight: bold; color: #d9534f;">
          ${sur.ans_count}
        </a>
      </td>
      <td style="font-size: 11px; line-height: 1.3;">${sur.sur_sdate}~<br>${sur.sur_edate}</td>
      <td>
        <a href="#none;" onclick="deleteSurvey(${sur.sur_num}); return false;" title="삭제" style="color: #d9534f; font-size: 14px;">
          <i class="fa fa-trash-o icon_btn"></i>
        </a>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * 샘플설문 메인 테이블 렌더링
 */
function renderSursTable() {
  const tbody = document.getElementById('sursTableTbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  sampleSurveyStore.forEach(sample => {
    const tr = document.createElement('tr');
    tr.style.verticalAlign = 'middle';

    tr.innerHTML = `
      <td class="mobile_none">${sample.num}</td>
      <td>
        <a href="#none;" onclick="copySampleSurvey(${sample.num}); return false;" title="설문복사" style="color: #337ab7; font-size: 14px;">
          <i class="fa fa-cog icon_btn"></i>
        </a>
      </td>
      <td><span class="label label-info" style="font-size: 11px;">${sample.reg_type}</span></td>
      <td><span class="label label-default" style="font-size: 11px;">${sample.sur_type}</span></td>
      <td align="left" class="noti_title" style="text-align: left !important;">
        <a href="#none;" onclick="previewSampleSurvey(${sample.num}); return false;" class="link_type" title="문항보기" style="color: #23527c;">
          ${sample.title}
        </a>
      </td>
      <td>
        <a href="#none;" onclick="previewSampleSurvey(${sample.num}); return false;" class="link_type" title="문항보기" style="font-weight: bold; color: #337ab7;">
          ${sample.que_count}
        </a>
      </td>
      <td>-</td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * 전체 선택/해제 토글
 */
function toggleAllSurCheck(master) {
  const checkboxes = document.querySelectorAll('.sur-item-check');
  checkboxes.forEach(cb => cb.checked = master.checked);
}

function toggleAllLecDiv(master) {
  const cbs = document.querySelectorAll('input[name="lec_div[]"]');
  cbs.forEach(cb => cb.checked = master.checked);
}

function toggleAllProType(master) {
  const cbs = document.querySelectorAll('input[name="lec_pro_type_list[]"]');
  cbs.forEach(cb => cb.checked = master.checked);
}

function toggleAllGrade(master) {
  const cbs = document.querySelectorAll('input[name="ans_grade[]"]');
  cbs.forEach(cb => cb.checked = master.checked);
}

function toggleAnsLecList(master) {
  const cbs = document.querySelectorAll('#ans_lec_checkbox_list input[type="checkbox"]');
  cbs.forEach(cb => cb.checked = master.checked);
}

/**
 * 설문구분 라디오 변경에 따른 서브 옵션 토글
 */
function toggleSurveyTypeView(type) {
  const rowLecDiv = document.getElementById('row_lec_div');
  const rowProType = document.getElementById('row_pro_type');
  if (type === 1) {
    // 종합 설문
    if (rowLecDiv) rowLecDiv.style.display = 'none';
    if (rowProType) rowProType.style.display = 'none';
  } else {
    // 강좌 설문
    if (rowLecDiv) rowLecDiv.style.display = 'table-row';
    if (rowProType) rowProType.style.display = 'table-row';
  }
}

/**
 * 설문 등록 모달 오픈
 */
function openSurWrite() {
  const fm = document.getElementById('fm_sur_edit');
  if (fm) fm.reset();
  document.getElementById('sur_modal_mode_text').innerText = '설문 등록';
  document.getElementById('sur_edit_mode').value = 'insert';
  document.getElementById('sur_edit_num').value = '';
  document.getElementById('sur_title').value = '';
  document.getElementById('sur_type_1').checked = true;
  toggleSurveyTypeView(1);
  document.getElementById('ans_grp_2').checked = true;
  document.getElementById('use_open_pwd').checked = true;
  document.getElementById('sur_sdate').value = new Date().toISOString().slice(0, 10);
  document.getElementById('sur_edate').value = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  if (window.$) {
    $('#modal_ad_sur_write').modal('show');
  }
}

/**
 * 설문 수정 모달 오픈
 */
function openSurModify(surNum) {
  const sur = surveyStore.find(s => s.sur_num === Number(surNum));
  if (!sur) return;

  document.getElementById('sur_modal_mode_text').innerText = '설문 수정';
  document.getElementById('sur_edit_mode').value = 'update';
  document.getElementById('sur_edit_num').value = sur.sur_num;
  document.getElementById('sur_title').value = sur.sur_title;

  const radio = document.getElementById(`sur_type_${sur.sur_type}`);
  if (radio) radio.checked = true;
  toggleSurveyTypeView(sur.sur_type);

  const grpRadio = document.getElementById(`ans_grp_${sur.ans_grp}`);
  if (grpRadio) grpRadio.checked = true;

  document.getElementById('use_open_pwd').checked = sur.use_open_pwd === 'Y';
  document.getElementById('sur_sdate').value = sur.sur_sdate;
  document.getElementById('sur_edate').value = sur.sur_edate;
  document.getElementById('sur_content').value = sur.sur_content || '';

  if (window.$) {
    $('#modal_ad_sur_write').modal('show');
  }
}

/**
 * 설문 데이터 저장 (등록/수정)
 */
function saveSurveyData(form) {
  const mode = document.getElementById('sur_edit_mode').value;
  const num = document.getElementById('sur_edit_num').value;
  const title = document.getElementById('sur_title').value.trim();
  const surTypeVal = Number(document.querySelector('input[name="sur_type"]:checked')?.value || 1);
  const ansGrpVal = Number(document.querySelector('input[name="ans_grp"]:checked')?.value || 2);
  const sdate = document.getElementById('sur_sdate').value;
  const edate = document.getElementById('sur_edate').value;
  const content = document.getElementById('sur_content').value;

  if (!title) {
    alert('설문 제목을 입력해 주세요.');
    return false;
  }

  if (mode === 'update') {
    const target = surveyStore.find(s => s.sur_num === Number(num));
    if (target) {
      target.sur_title = title;
      target.sur_type = surTypeVal;
      target.sur_type_label = surTypeVal === 1 ? '종합' : '강좌(강사기준)';
      target.ans_grp = ansGrpVal;
      target.ans_grp_label = ansGrpVal === 2 ? '학부모' : '학생';
      target.sur_sdate = sdate;
      target.sur_edate = edate;
      target.sur_content = content;
    }
    alert('설문이 성공적으로 수정되었습니다.');
  } else {
    const newNum = 11980 + Math.floor(Math.random() * 100);
    surveyStore.unshift({
      sur_num: newNum,
      sur_title: title,
      sur_type: surTypeVal,
      sur_type_label: surTypeVal === 1 ? '종합' : '강좌(강사기준)',
      lec_div: surTypeVal === 1 ? ["-"] : ["26년 4월", "26년 5월"],
      lec_pro_type: surTypeVal === 1 ? ["전체"] : ["방과후", "맞춤형"],
      ans_grp: ansGrpVal,
      ans_grp_label: ansGrpVal === 2 ? '학부모' : '학생',
      ans_grade: ["1", "2", "3", "4", "5", "6"],
      use_open_pwd: document.getElementById('use_open_pwd').checked ? 'Y' : 'N',
      que_count: 5,
      ans_count: 0,
      sur_sdate: sdate,
      sur_edate: edate,
      sur_content: content
    });
    alert('신규 설문이 성공적으로 등록되었습니다.');
  }

  if (window.$) {
    $('#modal_ad_sur_write').modal('hide');
  }
  renderSurTable();
  return false;
}

/**
 * 설문 삭제
 */
function deleteSurvey(surNum) {
  if (!confirm('해당 설문 및 모든 응답 데이터를 삭제하시겠습니까?')) return;
  surveyStore = surveyStore.filter(s => s.sur_num !== Number(surNum));
  renderSurTable();
  alert('설문이 삭제되었습니다.');
}

function deleteSelectedSurveys() {
  const checkedBoxes = document.querySelectorAll('.sur-item-check:checked');
  if (checkedBoxes.length === 0) {
    alert('삭제할 설문을 1개 이상 선택해 주세요.');
    return;
  }
  if (!confirm(`선택한 ${checkedBoxes.length}개의 설문을 삭제하시겠습니까?`)) return;

  const checkedNums = Array.from(checkedBoxes).map(cb => Number(cb.value));
  surveyStore = surveyStore.filter(s => !checkedNums.includes(s.sur_num));
  renderSurTable();
  alert('선택한 설문이 삭제되었습니다.');
}

/**
 * 문항관리 모달 오픈 및 문항 목록 동적 렌더링
 */
function openSurQue(surNum) {
  const targetNum = Number(surNum) || 11977;
  const select = document.getElementById('que_sur_select');
  if (select) select.value = targetNum;

  loadQuestionsForSurvey(targetNum);

  if (window.$) {
    $('#modal_ad_sur_que').modal('show');
  }
}

function loadQuestionsForSurvey(surNum) {
  const container = document.getElementById('que_items_container');
  if (!container) return;

  const questions = questionStore[surNum] || questionStore[11977];
  container.innerHTML = '';

  questions.forEach(q => {
    const card = document.createElement('div');
    card.style.background = '#fff';
    card.style.border = '1px solid #e0e0e0';
    card.style.borderRadius = '4px';
    card.style.padding = '14px 16px';
    card.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';

    let optionsHtml = '';
    if (q.type === 'choice') {
      optionsHtml = `
        <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 10px; padding-left: 12px; font-size: 12px; color: #444;">
          ${q.options.map((opt, i) => `
            <div style="display: flex; align-items: center; gap: 6px;">
              <input type="radio" name="preview_que_${q.id}" id="prev_q_${q.id}_${i}" disabled>
              <label for="prev_q_${q.id}_${i}" style="margin: 0; font-weight: normal;">${i + 1}) ${opt}</label>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      optionsHtml = `
        <div style="margin-top: 10px;">
          <textarea class="form-control" rows="2" placeholder="주관식 서술형 응답란" disabled style="background: #fdfdfd; font-size: 12px;"></textarea>
        </div>
      `;
    }

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="font-size: 13px; font-weight: bold; color: #333; line-height: 1.4;">
          <span style="color: #337ab7; margin-right: 4px;">Q${q.num}.</span> ${q.title}
          <span class="label ${q.type === 'choice' ? 'label-primary' : 'label-success'}" style="font-size: 10px; margin-left: 6px;">
            ${q.type === 'choice' ? '객관식 5지선다' : '주관식 서술형'}
          </span>
        </div>
        <div style="display: flex; gap: 4px;">
          <button type="button" class="btn btn-default btn-xs" onclick="alert('문항 수정 창이 호출됩니다.');"><i class="fa fa-pencil"></i></button>
          <button type="button" class="btn btn-default btn-xs" onclick="alert('문항이 삭제됩니다.');"><i class="fa fa-trash-o text-danger"></i></button>
        </div>
      </div>
      ${optionsHtml}
    `;
    container.appendChild(card);
  });
}

function addNewQuestionPrompt() {
  const title = prompt('추가할 문항 제목을 입력하세요:');
  if (!title) return;
  const surNum = document.getElementById('que_sur_select').value;
  const list = questionStore[surNum] || questionStore[11977];
  const newId = 90500 + list.length;
  list.push({
    id: newId,
    num: list.length + 1,
    type: "choice",
    title: title,
    options: ["매우 그렇다 (0)", "그렇다 (0)", "보통이다 (0)", "그렇지 않다 (0)", "매우 그렇지 않다 (0)"],
    scores: [0, 0, 0, 0, 0]
  });
  loadQuestionsForSurvey(surNum);
  alert('새 문항이 등록되었습니다.');
}

/**
 * 결과보기 모달 오픈 및 통계 차트 렌더링
 */
function openSurAns(surNum) {
  const targetNum = Number(surNum) || 11977;
  const select = document.getElementById('ans_sur_select');
  if (select) select.value = targetNum;

  loadSurveyAnswers(targetNum);

  if (window.$) {
    $('#modal_ad_sur_ans').modal('show');
  }
}

function loadSurveyAnswers(surNum) {
  const container = document.getElementById('ans_questions_stats_container');
  if (!container) return;

  const questions = questionStore[surNum] || questionStore[11977];
  container.innerHTML = '';

  questions.forEach(q => {
    const card = document.createElement('div');
    card.style.background = '#fff';
    card.style.border = '1px solid #ddd';
    card.style.borderRadius = '4px';
    card.style.padding = '14px 18px';
    card.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';

    let contentHtml = '';
    if (q.type === 'choice') {
      const total = q.scores.reduce((a, b) => a + b, 0) || 1;
      const colors = ['#2e6da4', '#337ab7', '#5bc0de', '#f0ad4e', '#d9534f'];
      const labels = ['매우 그렇다', '그렇다', '보통이다', '그렇지 않다', '매우 그렇지 않다'];

      contentHtml = `
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 12px;">
          ${q.scores.map((count, i) => {
            const pct = ((count / total) * 100).toFixed(1);
            return `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
                  <span>${i + 1}) ${labels[i]}</span>
                  <span style="font-weight: bold; color: #333;">${count}명 (${pct}%)</span>
                </div>
                <div class="progress" style="height: 14px; margin-bottom: 0; background: #eee; border-radius: 3px;">
                  <div class="progress-bar" style="width: ${pct}%; background-color: ${colors[i]}; line-height: 14px; font-size: 10px;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else {
      contentHtml = `
        <div style="margin-top: 10px; background: #f9f9f9; padding: 10px 12px; border-radius: 4px; border: 1px solid #eee;">
          <div style="font-size: 11px; font-weight: bold; color: #777; margin-bottom: 6px;">수집된 서술형 의견 (총 3건):</div>
          <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #444; line-height: 1.6;">
            ${(q.answers || []).map(ans => `<li>${ans}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    card.innerHTML = `
      <div style="font-size: 13px; font-weight: bold; color: #222; border-bottom: 1px solid #eee; padding-bottom: 8px;">
        <span style="color: #337ab7; margin-right: 4px;">Q${q.num}.</span> ${q.title}
      </div>
      ${contentHtml}
    `;
    container.appendChild(card);
  });
}

function filterSurveyAnswers() {
  const surNum = document.getElementById('ans_sur_select').value;
  loadSurveyAnswers(surNum);
  alert('필터 조건에 따른 응답 결과가 조회되었습니다.');
}

/**
 * 엑셀 다운로드 엔드포인트 호출 (결과 / 대상자 / 참여현황)
 */
function downloadSurExcel(type) {
  const surNum = document.getElementById('ans_sur_select')?.value || 11977;
  let url = '';
  if (type === 'result') {
    url = `/af/ad_sur/excel/sn/3267?sur_num=${surNum}`;
  } else if (type === 'target') {
    url = `/af/ad_sur/target_excel/sn/3267?sur_num=${surNum}`;
  } else if (type === 'status') {
    url = `/af/ad_sur/status_excel/sn/3267?sur_num=${surNum}`;
  }
  window.open(url, '_blank');
}

/**
 * 샘플설문 미리보기 및 복사
 */
function previewSampleSurvey(sampleNum) {
  const sample = sampleSurveyStore.find(s => s.num === Number(sampleNum));
  if (!sample) return;

  document.getElementById('surs_preview_title').innerText = sample.title;
  document.getElementById('surs_preview_badge').innerText = `${sample.reg_type} / ${sample.sur_type}`;
  document.getElementById('surs_preview_desc').innerText = `총 ${sample.que_count}개 문항으로 구성된 검증된 표준 설문 양식입니다.`;

  const listContainer = document.getElementById('surs_preview_questions_list');
  listContainer.innerHTML = `
    <div style="background: #fff; border: 1px solid #eee; padding: 10px 14px; border-radius: 4px; font-size: 12px;">
      <b>Q1.</b> 수업 내용 및 교육 프로그램에 전반적으로 만족하십니까? (5지선다)
    </div>
    <div style="background: #fff; border: 1px solid #eee; padding: 10px 14px; border-radius: 4px; font-size: 12px;">
      <b>Q2.</b> 강사님의 열의와 성실한 지도 태도에 만족하십니까? (5지선다)
    </div>
    <div style="background: #fff; border: 1px solid #eee; padding: 10px 14px; border-radius: 4px; font-size: 12px;">
      <b>Q3.</b> 학생의 특기 신장 및 소질 계발에 도움이 되었습니까? (5지선다)
    </div>
    <div style="background: #fff; border: 1px solid #eee; padding: 10px 14px; border-radius: 4px; font-size: 12px;">
      <b>Q4.</b> 교실 환경 및 수업 준비물이 적절하게 제공되었습니까? (5지선다)
    </div>
    <div style="background: #fff; border: 1px solid #eee; padding: 10px 14px; border-radius: 4px; font-size: 12px;">
      <b>Q5.</b> 건의사항 및 바라는 점을 작성해 주세요. (서술형)
    </div>
  `;

  document.getElementById('btn_copy_sample_to_my_sur').onclick = function() {
    copySampleSurvey(sample.num);
    if (window.$) $('#modal_ad_surs_preview').modal('hide');
  };

  if (window.$) {
    $('#modal_ad_surs_preview').modal('show');
  }
}

function copySampleSurvey(sampleNum) {
  const sample = sampleSurveyStore.find(s => s.num === Number(sampleNum));
  if (!sample) return;

  if (!confirm(`[${sample.title}]\n\n이 샘플 설문을 내 설문으로 복사하여 신규 설문으로 등록하시겠습니까?`)) return;

  openSurWrite();
  document.getElementById('sur_title').value = sample.title.replace(/^\[[^\]]+\]\s*/, '[복사본] ');
  document.getElementById('sur_content').value = `${sample.title}에 기반한 만족도 조사입니다. 많은 참여 부탁드립니다.`;
}

function loadSampleSurveyToForm(sampleVal) {
  if (!sampleVal) return;
  const sample = sampleSurveyStore.find(s => s.num === 42) || sampleSurveyStore[0];
  document.getElementById('sur_title').value = sample.title;
}

// 4. 초기화 이벤트 바인딩
document.addEventListener('DOMContentLoaded', function() {
  renderSurTable();
  renderSursTable();
});
