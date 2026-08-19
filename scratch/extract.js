const fs = require('fs');
const cheerio = require('cheerio');

const files = [
  {path: '../course_site/af/ad_app/sin/sn/3267/index.html', id: 'modalSin', title: '신청자 등록'},
  {path: '../course_site/af/ad_app/input/sn/3267/index.html', id: 'modalInput', title: '신청자일괄입력'},
  {path: '../course_site/af/ad_pay/edit/sn/3267/index.html', id: 'modalPay', title: '수강료입력'},
  {path: '../course_site/af/ad_app/copy/sn/3267/index.html', id: 'modalCopyPage', title: '신청자복사'}
];

let modalsHtml = '';

files.forEach(f => {
  try {
    const html = fs.readFileSync(f.path, 'utf8');
    const $ = cheerio.load(html);
    
    // Replace the specific container with just its contents so we don't bring in the outer layout.
    // If we take contents_box, we might bring in the title which we don't want.
    // Let's just take `#contents` if it exists, or just the main panel.
    let contentNode = $('#contents');
    if(!contentNode.length) contentNode = $('.panel_main').parent();
    if(!contentNode.length) contentNode = $('#contents_box');
    
    if(contentNode.length) {
      // Remove title headers inside it if they exist since we have modal header
      contentNode.find('#contents_title').remove();
    }
    
    let content = contentNode.html() || '내용 없음';
    
    modalsHtml += `
  <!-- Modal: ${f.title} -->
  <div class="modal-backdrop" id="${f.id}">
    <div class="modal-box" style="max-width:1200px; padding:0; border-radius:4px; overflow:hidden; max-height:90vh; overflow-y:auto;">
      <div class="modal-header" style="background:#f5f5f5; border-bottom:1px solid #ddd; padding:10px 15px; color:#333; font-weight:bold; justify-content: flex-start; gap: 10px; position:sticky; top:0; z-index:10;">
        <span style="font-size:14px;">${f.title}</span>
        <span style="cursor:pointer; margin-left:auto; font-size:20px; font-weight:normal;" onclick="closeModal('${f.id}')">&times;</span>
      </div>
      <div class="modal-body" style="padding: 15px; text-align: left; background:#fff;">
        ${content}
      </div>
    </div>
  </div>
`;
  } catch (e) {
    console.error('Failed to parse', f.path, e);
  }
});

fs.writeFileSync('modals_extracted.html', modalsHtml);
console.log('Successfully wrote modals_extracted.html');
