const fs = require('fs');
const file = 'course_site/af/ad_lec/lists/sn/admin_lec.js';
let content = fs.readFileSync(file, 'utf8');

const oldStr = 'window.openAppUnappliedModal = function(e) { if(e) e.preventDefault(); openAppUnregisteredModal(); };';
const newStr = `window.openAppUnappliedModal = function(e) { if(e) e.preventDefault(); openAppUnappliedModal(); };

// Authentic sub-modal interactive helpers
window.openStudentSearchModal = openStudentSearchModal;
window.loadStudentSearchList = loadStudentSearchList;
window.applyStudentSearchItem = applyStudentSearchItem;
window.selectSinPeriod = selectSinPeriod;
window.selectSinCategory = selectSinCategory;
window.loadSinCourseTable = loadSinCourseTable;
window.chk_apply_sin = chk_apply_sin;
window.chk_cancel_sin = chk_cancel_sin;
window.populateBatchUploadCourses = populateBatchUploadCourses;
window.toggleBatchExcelGubun = toggleBatchExcelGubun;
window.downloadSampleExcel = downloadSampleExcel;
window.submitAuthenticBatchUpload = submitAuthenticBatchUpload;
window.loadFeeEditCourses = loadFeeEditCourses;
window.loadFeeEditApplicants = loadFeeEditApplicants;
window.toggleAllFeeRows = toggleAllFeeRows;
window.applyBatchFeeToChecked = applyBatchFeeToChecked;
window.saveSingleFeeRow = saveSingleFeeRow;
window.saveAllFeeEdits = saveAllFeeEdits;
window.loadCopyCourses = loadCopyCourses;
window.executeAuthenticCopy = executeAuthenticCopy;
window.loadUnappliedList = loadUnappliedList;`;

if (content.includes(oldStr)) {
  content = content.replace(oldStr, newStr);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated window exports in admin_lec.js');
} else {
  console.error('oldStr not found');
  process.exit(1);
}
