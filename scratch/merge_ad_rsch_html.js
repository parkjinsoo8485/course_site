const fs = require('fs');

let indexHtml = fs.readFileSync('course_site/af/ad_lec/lists/sn/index.html', 'utf8');
const panelHtml = fs.readFileSync('scratch/panel_ad_rsch_lists.html', 'utf8');
const modalsHtml = fs.readFileSync('scratch/modals_ad_rsch.html', 'utf8');

if (!indexHtml.includes('id="panel_ad_rsch_lists"')) {
  const targetSurMarker = '<!-- ==================== 16. 설문관리 > 설문 (/af/ad_sur/lists) ==================== -->';
  if (indexHtml.includes(targetSurMarker)) {
    indexHtml = indexHtml.replace(targetSurMarker, panelHtml + '\n\n      ' + targetSurMarker);
    console.log('Panel inserted successfully before 설문관리!');
  } else {
    console.error('Target marker not found for panel!');
  }
} else {
  console.log('panel_ad_rsch_lists already present.');
}

if (!indexHtml.includes('id="modal_ad_rsch_write"')) {
  const bodyCloseMarker = '</body>';
  if (indexHtml.includes(bodyCloseMarker)) {
    indexHtml = indexHtml.replace(bodyCloseMarker, modalsHtml + '\n' + bodyCloseMarker);
    console.log('Modals inserted successfully before </body>!');
  } else {
    console.error('</body> marker not found!');
  }
} else {
  console.log('modal_ad_rsch_write already present.');
}

fs.writeFileSync('course_site/af/ad_lec/lists/sn/index.html', indexHtml, 'utf8');
console.log('index.html updated successfully!');
