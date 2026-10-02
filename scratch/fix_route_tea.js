const fs = require('fs');

const jsPath = 'course_site/af/ad_lec/lists/sn/admin_lec.js';
let content = fs.readFileSync(jsPath, 'utf8');

const routeAnchor = "if (typeof openAbsWriteModal === 'function') openAbsWriteModal();";
const routeInsertion = `
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
  if (content.includes(routeAnchor)) {
    // routeAnchor 바로 다음의 '    }, 120);' 부분을 교체
    const idx = content.indexOf(routeAnchor);
    const endBraceIdx = content.indexOf('}, 120);', idx);
    if (endBraceIdx !== -1) {
      content = content.substring(0, endBraceIdx - 4) + routeInsertion + content.substring(endBraceIdx + 8);
      console.log('Successfully inserted ad_tea routes into checkInitialModalRoute!');
    }
  } else {
    console.error('routeAnchor not found in content!');
  }
}

fs.writeFileSync(jsPath, content, 'utf8');
console.log('Updated admin_lec.js successfully!');
