const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
let htmlContent = fs.readFileSync(indexPath, 'utf8');

// panel_qanda_lists 찾기
const qnaStartTag = '<div class="submodel-panel" id="panel_qanda_lists" style="display: none;">';
const nextPanelTag = '<!-- ==================== 29. 매뉴얼 (FAQ) (/af/ad_faq/main) ==================== -->';

const qnaStartIdx = htmlContent.indexOf(qnaStartTag);
const nextPanelIdx = htmlContent.indexOf(nextPanelTag);

if (qnaStartIdx === -1 || nextPanelIdx === -1) {
  console.error('Cannot find panel_qanda_lists in index.html');
  process.exit(1);
}

const newQnaPanelHtml = `<div class="submodel-panel" id="panel_qanda_lists" style="display: none;">
        <div class="content-card">
          <!-- Card Top Bar -->
          <div class="card-top-bar">
            <div class="section-title"><i class="fa-solid fa-headset" style="color:#2563eb; margin-right:6px;"></i>고객지원 게시판</div>
            <div class="helper-badges">
              <a href="/af/ad_faq/main/sn/3267" class="helper-btn" onclick="switchSubmodelView(event, 'ad_faq_main', '/af/ad_faq/main/sn/3267')"><i class="fa-solid fa-file-lines"></i> 매뉴얼</a>
            </div>
          </div>

          <!-- Alert / Notice Box -->
          <div class="alert-box">
            <i class="fa-solid fa-circle-info"></i>
            <div>
              <strong>문의사항을 고객지원 게시판에 올려주시면 <span style="color:#2563eb;">담당자가 빠르게 확인하고 신속하게 답변</span>드리겠습니다.</strong><br>
              ※ 자주 묻는 질문은 <a href="/af/ad_faq/main/sn/3267" onclick="switchSubmodelView(event, 'ad_faq_main', '/af/ad_faq/main/sn/3267')" style="color:#2563eb; text-decoration:underline; font-weight:bold;">매뉴얼 (FAQ)</a>에 정리되어 있으니 이곳을 먼저 참고해 주시기 바랍니다.
            </div>
          </div>

          <!-- Filter & Action Bar (Unified Height 30px & Flex Centering) -->
          <div class="filter-container" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <select name="as" id="qaStatusFilter" onchange="filterQaList();" style="height:30px; padding:0 10px; font-size:12px; border:1px solid #d1d5db; border-radius:3px; background:#fff; color:#333; cursor:pointer;">
                <option value="all">=진행상태 전체=</option>
                <option value="0">접수</option>
                <option value="1">처리중</option>
                <option value="2">완료</option>
                <option value="3">답변완료</option>
              </select>	
              <select name="st" id="qaSearchType" style="height:30px; padding:0 10px; font-size:12px; border:1px solid #d1d5db; border-radius:3px; background:#fff; color:#333; cursor:pointer;">
                <option value="sub_con" selected="selected">제목 + 내용</option>
                <option value="subject">제목</option>
                <option value="contents">내용</option>
              </select>
              <input type="text" name="sw" id="qaSearchKeyword" placeholder="검색어를 입력하세요" style="height:30px; width:220px; padding:0 10px; font-size:12px; border:1px solid #d1d5db; border-radius:3px; background:#fff;" onkeyup="if(event.key==='Enter') filterQaList();">
              <button type="button" class="btn-db btn-db-gray" onclick="filterQaList();" style="height:30px; padding:0 14px; display:inline-flex; align-items:center; justify-content:center; line-height:1; gap:4px;"><i class="fa-solid fa-magnifying-glass"></i> 검색</button>
              <button type="button" class="btn-db btn-db-gray" onclick="resetQaFilter();" style="height:30px; padding:0 14px; display:inline-flex; align-items:center; justify-content:center; line-height:1;">전체</button>
            </div>
            <div>
              <button type="button" class="btn-db btn-db-blue" onclick="openQaWriteModal();" style="height:30px; padding:0 16px; display:inline-flex; align-items:center; justify-content:center; line-height:1; font-weight:700; gap:5px;"><i class="fa-solid fa-pen-to-square"></i> 문의 등록</button>
            </div>
          </div>

          <!-- Table Container (사이트 표준 db-table) -->
          <div class="table-responsive" style="border:1px solid #d1d5db; border-radius:4px; overflow:hidden;">
            <table class="db-table" style="width:100%; border-collapse:collapse; table-layout:fixed; margin-bottom:0;">
              <thead>
                <tr style="background:#f8fafc; height:40px; border-bottom:1px solid #cbd5e1;">
                  <th style="width:65px; text-align:center; font-weight:700; color:#334155;">연번</th>
                  <th style="text-align:left; padding-left:16px; font-weight:700; color:#334155;">제목</th>
                  <th style="width:120px; text-align:center; font-weight:700; color:#334155;">등록일자</th>
                  <th style="width:95px; text-align:center; font-weight:700; color:#334155;">진행상태</th>
                  <th style="width:95px; text-align:center; font-weight:700; color:#334155;">답변일자</th>
                </tr>
              </thead>
              <tbody id="qaTbody">
                <tr><td colspan="5" class="center" style="padding:40px; color:#888;">Q&A 질문 목록을 불러오는 중입니다...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      `;

htmlContent = htmlContent.substring(0, qnaStartIdx) + newQnaPanelHtml + htmlContent.substring(nextPanelIdx);
fs.writeFileSync(indexPath, htmlContent, 'utf8');
console.log('index.html panel_qanda_lists updated successfully');

// admin_lec.js renderQaTable 함수 업데이트
const jsPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'admin_lec.js');
let jsContent = fs.readFileSync(jsPath, 'utf8');

const oldRenderQa = `function renderQaTable(items) {
  const tbody = document.getElementById('qaTbody');
  if (!tbody) return;

  if (!items || items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="center" style="padding:40px; color:#888;">등록된 고객지원 문의가 없습니다.</td></tr>';
    return;
  }

  tbody.innerHTML = items.map((item, idx) => {
    let statusBadge = '<span style="color:#428bca; font-weight:bold;">접수</span>';
    let answerText = item.answerDate || '-';
    if (item.status === '1') {
      statusBadge = '<span style="color:#d9534f; font-weight:bold;">처리중</span>';
    } else if (item.status === '2' || item.status === '3' || item.statusText === '완료') {
      statusBadge = '<span style="color:#EB9316; font-weight:bold;">완료</span>';
    }

    const rowNum = item.num || (items.length - idx);

    return \`
      <tr style="height:38px; cursor:pointer;" onclick="openQaViewModal('\${item.id}')">
        <td class="mobile_none">\${rowNum}</td>
        <td class="noti_title text-left" style="text-align:left; padding-left:14px;">
          <a href="javascript:void(0);" onclick="openQaViewModal('\${item.id}'); event.stopPropagation();" class="link_type" style="color:#333; text-decoration:none; font-weight:500;">
            \${escHtml(item.subject)}
          </a>
        </td>
        <td style="color:#666; font-size:12px;">\${item.createdAt || ''}</td>
        <td>\${statusBadge}</td>
        <td style="color:#666; font-size:12px;">\${escHtml(answerText)}</td>
      </tr>
    \`;
  }).join('');
}`;

const newRenderQa = `function renderQaTable(items) {
  const tbody = document.getElementById('qaTbody');
  if (!tbody) return;

  if (!items || items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="center" style="padding:40px; color:#888; text-align:center;">등록된 고객지원 문의가 없습니다.</td></tr>';
    return;
  }

  tbody.innerHTML = items.map((item, idx) => {
    let statusBadge = '<span style="display:inline-block; padding:2px 8px; border-radius:3px; font-size:11px; font-weight:700; background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe;">접수</span>';
    let answerText = item.answerDate || '-';
    if (item.status === '1') {
      statusBadge = '<span style="display:inline-block; padding:2px 8px; border-radius:3px; font-size:11px; font-weight:700; background:#fef2f2; color:#dc2626; border:1px solid #fecaca;">처리중</span>';
    } else if (item.status === '2' || item.status === '3' || item.statusText === '완료') {
      statusBadge = '<span style="display:inline-block; padding:2px 8px; border-radius:3px; font-size:11px; font-weight:700; background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0;">완료</span>';
    }

    const rowNum = item.num || (items.length - idx);

    return \`
      <tr style="height:42px; cursor:pointer; border-bottom:1px solid #f1f5f9; transition:background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'" onclick="openQaViewModal('\${item.id}')">
        <td style="text-align:center; color:#64748b; font-size:12px;">\${rowNum}</td>
        <td style="text-align:left; padding-left:16px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
          <a href="javascript:void(0);" onclick="openQaViewModal('\${item.id}'); event.stopPropagation();" style="color:#1e293b; text-decoration:none; font-weight:600; font-size:13px;">
            \${escHtml(item.subject)}
          </a>
        </td>
        <td style="text-align:center; color:#64748b; font-size:12px;">\${item.createdAt || ''}</td>
        <td style="text-align:center;">\${statusBadge}</td>
        <td style="text-align:center; color:#64748b; font-size:12px;">\${escHtml(answerText)}</td>
      </tr>
    \`;
  }).join('');
}`;

jsContent = jsContent.replace(/\r\n/g, '\n');
const normOldRenderQa = oldRenderQa.replace(/\r\n/g, '\n');

if (jsContent.includes(normOldRenderQa)) {
  jsContent = jsContent.replace(normOldRenderQa, newRenderQa);
  fs.writeFileSync(jsPath, jsContent, 'utf8');
  console.log('admin_lec.js renderQaTable updated successfully');
} else {
  console.warn('normOldRenderQa not directly matched in admin_lec.js');
}
