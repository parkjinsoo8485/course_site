const fs = require('fs');

const jsPath = 'course_site/af/ad_lec/lists/sn/admin_lec.js';
let content = fs.readFileSync(jsPath, 'utf8');

const logicCode = fs.readFileSync('scratch/ad_tea_logic.js', 'utf8');

// 1. ad_tea 라우트 추가
const routeAnchor = "} else if (path.includes('/af/ad_abs/write')) {";
const routeReplacement = `} else if (path.includes('/af/ad_abs/write')) {
    setTimeout(() => {
      if (typeof switchSubmodelView === 'function') switchSubmodelView(null, 'ad_abs_lists', path, false);
      if (typeof openAbsWriteModal === 'function') openAbsWriteModal();
    }, 120);
  } else if (path.includes('/af/ad_tea/write')) {
    setTimeout(() => {
      if (typeof switchSubmodelView === 'function') switchSubmodelView(null, 'ad_tea_lists', path, false);
      if (typeof openTeaWriteModal === 'function') openTeaWriteModal();
    }, 120);
  } else if (path.includes('/af/ad_tea/input')) {
    setTimeout(() => {
      if (typeof switchSubmodelView === 'function') switchSubmodelView(null, 'ad_tea_lists', path, false);
      if (typeof openTeaInputModal === 'function') openTeaInputModal();
    }, 120);
  } else if (path.includes('/af/ad_tea/modify')) {
    const match = path.match(/num\\/(\\d+)/);
    const num = match ? match[1] : '';
    setTimeout(() => {
      if (typeof switchSubmodelView === 'function') switchSubmodelView(null, 'ad_tea_lists', path, false);
      if (typeof openTeaModifyModal === 'function') openTeaModifyModal(num);
    }, 120);
  } else if (path.includes('/af/ad_tea/schedule')) {
    setTimeout(() => {
      if (typeof switchSubmodelView === 'function') switchSubmodelView(null, 'ad_tea_lists', path, false);
      if (typeof openTeaScheduleModal === 'function') openTeaScheduleModal();
    }, 120);`;

if (!content.includes('/af/ad_tea/write')) {
  // 기존 블록 교체
  const absBlock = `} else if (path.includes('/af/ad_abs/write')) {
    setTimeout(() => {
      if (typeof switchSubmodelView === 'function') switchSubmodelView(null, 'ad_abs_lists', path, false);
      if (typeof openAbsWriteModal === 'function') openAbsWriteModal();
    }, 120);
  }`;
  if (content.includes(absBlock)) {
    content = content.replace(absBlock, routeReplacement + '\n  }');
    console.log('Added ad_tea initial modal routes to checkInitialModalRoute!');
  } else {
    console.error('Could not find absBlock to insert ad_tea modal routes!');
  }
}

// 2. logicCode 및 export 추가
const exportCode = `
// Window exports for ad_tea
window.loadTeachers = loadTeachers;
window.renderTeaPage = renderTeaPage;
window.searchTeaList = searchTeaList;
window.resetTeaList = resetTeaList;
window.toggleTeaControlBox = toggleTeaControlBox;
window.toggleTeaStatusDropdown = toggleTeaStatusDropdown;
window.chk_all_tea = chk_all_tea;
window.chk_mem_status = chk_mem_status;
window.chk_del = chk_del;
window.fm_tea_list_check = fm_tea_list_check;
window.openTeaWriteModal = openTeaWriteModal;
window.closeTeaWriteModal = closeTeaWriteModal;
window.chk_id = chk_id;
window.submitTeaWrite = submitTeaWrite;
window.openTeaModifyModal = openTeaModifyModal;
window.closeTeaModifyModal = closeTeaModifyModal;
window.chk_change_mem_name = chk_change_mem_name;
window.submitTeaModify = submitTeaModify;
window.openTeaInputModal = openTeaInputModal;
window.closeTeaInputModal = closeTeaInputModal;
window.submitTeaBatchInput = submitTeaBatchInput;
window.openTeaScheduleModal = openTeaScheduleModal;
window.closeTeaScheduleModal = closeTeaScheduleModal;
window.submitTeaSchedule = submitTeaSchedule;
`;

if (!content.includes('window.loadTeachers = loadTeachers;')) {
  content = content + '\n\n' + logicCode + '\n' + exportCode;
  console.log('Appended ad_tea logic and exports to admin_lec.js!');
} else {
  console.log('ad_tea logic already present in admin_lec.js, replacing...');
  const marker = '// ==================== [Sprint 2] 강사관리 (/af/ad_tea) 1:1 Authentic Logic ====================';
  const idx = content.indexOf(marker);
  if (idx !== -1) {
    content = content.substring(0, idx) + logicCode + '\n' + exportCode;
  }
}

fs.writeFileSync(jsPath, content, 'utf8');
console.log('admin_lec.js successfully updated!');
