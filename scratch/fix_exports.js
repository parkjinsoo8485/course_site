const fs = require('fs');
const file = 'course_site/af/ad_lec/lists/sn/admin_lec.js';
let content = fs.readFileSync(file, 'utf8');

const oldChunk = `window.openAppCreateModal = openAppCreateModal;
window.closeAppModal = closeAppModal;
window.handleAppCreateSubmit = handleAppCreateSubmit;
window.openAppEditModal = openAppEditModal;
window.submitAppEdit = submitAppEdit;
window.deleteApp = deleteApp;
window.handleBulkAppStatus = handleBulkAppStatus;
window.handleBulkAppDelete = handleBulkAppDelete;
window.openAppBatchUploadModal = openAppBatchUploadModal;
window.parseAppBatchSample = parseAppBatchSample;
window.submitAppBatchUpload = submitAppBatchUpload;
window.openAppBatchFeeModal = openAppBatchFeeModal;
window.submitAppBatchFee = submitAppBatchFee;
window.openAppBatchCopyModal = openAppBatchCopyModal;
window.submitAppBatchCopy = submitAppBatchCopy;`;

const newChunk = `window.openAppCreateModal = openAppCreateModal;
window.closeAppModal = closeAppModal;
window.handleAppCreateSubmit = typeof handleAppCreateSubmit !== 'undefined' ? handleAppCreateSubmit : function(){};
window.openAppEditModal = openAppEditModal;
window.submitAppEdit = submitAppEdit;
window.deleteApp = deleteApp;
window.handleBulkAppStatus = handleBulkAppStatus;
window.handleBulkAppDelete = handleBulkAppDelete;
window.openAppBatchUploadModal = openAppBatchUploadModal;
window.parseAppBatchSample = typeof parseAppBatchSample !== 'undefined' ? parseAppBatchSample : function(){};
window.submitAppBatchUpload = typeof submitAuthenticBatchUpload !== 'undefined' ? submitAuthenticBatchUpload : function(){};
window.openAppBatchFeeModal = openAppBatchFeeModal;
window.submitAppBatchFee = typeof saveAllFeeEdits !== 'undefined' ? saveAllFeeEdits : function(){};
window.openAppBatchCopyModal = openAppBatchCopyModal;
window.submitAppBatchCopy = typeof executeAuthenticCopy !== 'undefined' ? executeAuthenticCopy : function(){};`;

if (content.includes(oldChunk)) {
  content = content.replace(oldChunk, newChunk);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully fixed legacy exports in admin_lec.js');
} else {
  // Try CRLF / LF normalization
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedOld = oldChunk.replace(/\r\n/g, '\n');
  if (normalizedContent.includes(normalizedOld)) {
    const fixed = normalizedContent.replace(normalizedOld, newChunk.replace(/\r\n/g, '\n'));
    fs.writeFileSync(file, fixed, 'utf8');
    console.log('Successfully fixed legacy exports (normalized) in admin_lec.js');
  } else {
    console.error('oldChunk not found');
    process.exit(1);
  }
}
