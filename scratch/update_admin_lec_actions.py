import re

def update_admin_lec_js(file_path):
    print(f"Updating JS: {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    action_logic = '''
// ==================== [타깃 사이트 고유 URL 및 모달 연동 엔진] ====================
let currentLecSld = '11';

function getActionUrl(action, sld) {
  const schoolId = '3267';
  const targetSld = sld || currentLecSld || '11';
  switch(action) {
    case 'write':
      return `/af/ad_lec/write/p/1/sn/${schoolId}/sld/${targetSld}/sof/ln/sot/asc`;
    case 'input':
      return `/af/ad_lec/input/p/1/sn/${schoolId}/sld/${targetSld}/sof/ln/sot/asc`;
    case 'modifyField':
      return `/af/ad_lec/modifyField/p/1/sn/${schoolId}/sld/${targetSld}/sof/ln/sot/asc`;
    case 'copy':
      return `/af/ad_lec/copy/p/1/sn/${schoolId}/sld/${targetSld}/sof/ln/sot/asc`;
    case 'stat':
      return `/af/ad_lec/stat/sn/${schoolId}`;
    case 'att_excel':
      return `/af/ad_att/excel/p/1/sn/${schoolId}/sld/${targetSld}/sof/ln/sot/asc`;
    default:
      return `/af/ad_lec/lists/sn/${schoolId}`;
  }
}

function updateActionButtonUrls(sld) {
  if (sld) currentLecSld = String(sld);
  const btnWrite = document.getElementById('btn_action_write');
  const btnInput = document.getElementById('btn_action_input');
  const btnModify = document.getElementById('btn_action_modify');
  const btnCopy = document.getElementById('btn_action_copy');
  const btnStat = document.getElementById('btn_action_stat');
  const btnAtt = document.getElementById('btn_action_att');

  if (btnWrite) btnWrite.setAttribute('href', getActionUrl('write', currentLecSld));
  if (btnInput) btnInput.setAttribute('href', getActionUrl('input', currentLecSld));
  if (btnModify) btnModify.setAttribute('href', getActionUrl('modifyField', currentLecSld));
  if (btnCopy) btnCopy.setAttribute('href', getActionUrl('copy', currentLecSld));
  if (btnStat) btnStat.setAttribute('href', getActionUrl('stat', currentLecSld));
  if (btnAtt) btnAtt.setAttribute('href', getActionUrl('att_excel', currentLecSld));
}

function handleActionUrl(event, action, modalOpenFn) {
  if (event) {
    try { event.preventDefault(); } catch(_) {}
    try { event.stopPropagation(); } catch(_) {}
  }
  const url = getActionUrl(action, currentLecSld);
  try {
    window.history.pushState({ modalAction: action }, '', url);
  } catch(e) {}

  if (typeof modalOpenFn === 'function') {
    modalOpenFn();
  }
}

function handleAttendanceExcel(event, url) {
  // 출석부 출력 안내 및 엑셀 다운로드 트리거
  alert('출석부 엑셀 파일을 다운로드합니다.');
  // 링크 이동 허용 또는 다운로드 진행
}

function restoreListUrl() {
  const currentPath = window.location.pathname;
  if (currentPath !== '/af/ad_lec/lists/sn/3267' && (currentPath.includes('/af/ad_lec/') || currentPath.includes('/af/ad_att/'))) {
    try {
      window.history.pushState({ modalAction: 'list' }, '', '/af/ad_lec/lists/sn/3267');
    } catch(e) {}
  }
}

function checkInitialModalRoute() {
  const path = window.location.pathname;
  if (path.includes('/af/ad_lec/write')) {
    setTimeout(() => { if (typeof openAddModal === 'function') openAddModal(); }, 100);
  } else if (path.includes('/af/ad_lec/input') && !path.includes('/af/ad_lec/inputs')) {
    setTimeout(() => { if (typeof openBatchUploadModal === 'function') openBatchUploadModal(); }, 100);
  } else if (path.includes('/af/ad_lec/modifyField')) {
    setTimeout(() => { if (typeof openBatchModifyModal === 'function') openBatchModifyModal(); }, 100);
  } else if (path.includes('/af/ad_lec/copy')) {
    setTimeout(() => { if (typeof openBatchCopyModal === 'function') openBatchCopyModal(); }, 100);
  } else if (path.includes('/af/ad_lec/stat')) {
    setTimeout(() => { if (typeof switchSubmodelView === 'function') switchSubmodelView(null, 'ad_lec_stats', '/af/ad_lec/stats/sn/3267', false); }, 100);
  }
}

// Window global exports
window.getActionUrl = getActionUrl;
window.updateActionButtonUrls = updateActionButtonUrls;
window.handleActionUrl = handleActionUrl;
window.handleAttendanceExcel = handleAttendanceExcel;
window.restoreListUrl = restoreListUrl;
window.checkInitialModalRoute = checkInitialModalRoute;
'''

    # Ensure restoreListUrl() is called in close functions
    content = content.replace("function closeAddModal() {", "function closeAddModal() {\n  try { restoreListUrl(); } catch(_) {}\n")
    content = content.replace("function closeBatchUploadModal() {", "function closeBatchUploadModal() {\n  try { restoreListUrl(); } catch(_) {}\n")
    content = content.replace("function closeBatchModifyModal() {", "function closeBatchModifyModal() {\n  try { restoreListUrl(); } catch(_) {}\n")
    content = content.replace("function closeBatchCopyModal() { document.getElementById('batchCopyModal').classList.remove('show'); }",
                              "function closeBatchCopyModal() {\n  const m = document.getElementById('batchCopyModal');\n  if (m) { m.classList.remove('show'); m.style.display = 'none'; }\n  try { restoreListUrl(); } catch(_) {}\n}")

    # Add checkInitialModalRoute inside DOMContentLoaded
    dom_loaded_call = "  try { checkInitialModalRoute(); } catch(e) { console.warn(e); }\n"
    if "try { checkInitialModalRoute(); }" not in content:
        content = content.replace("switchSubmodelView(null, initialKey, path, false);",
                                  "switchSubmodelView(null, initialKey, path, false);\n" + dom_loaded_call)

    # Append action_logic at the bottom
    if "function getActionUrl" not in content:
        content = content + "\n" + action_logic
        print("  - Added action_logic to admin_lec.js")
    else:
        print("  - action_logic already exists, updating...")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Completed JS update: {file_path}")

update_admin_lec_js('course_site/af/ad_lec/lists/sn/admin_lec.js')
