const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// 삽입 위치: panel_ad_lec_lists 주석 줄 바로 앞
const targetStr = '      <!-- ==================== 1. 강좌관리 (/af/ad_lec/lists) ==================== -->\r\n      <div class="submodel-panel active" id="panel_ad_lec_lists">';

if (!content.includes(targetStr)) {
  console.log('ERROR: Target string not found in index.html');
  console.log('Checking alternate endings...');
  const altTarget = '      <!-- ==================== 1. 강좌관리 (/af/ad_lec/lists) ==================== -->\n      <div class="submodel-panel active" id="panel_ad_lec_lists">';
  if (content.includes(altTarget)) {
    console.log('Found with LF endings');
  } else {
    // Try to find the panel by ID alone
    const idx = content.indexOf('id="panel_ad_lec_lists"');
    if (idx >= 0) {
      console.log('Found panel by id at index:', idx);
      console.log('Surrounding context:', JSON.stringify(content.substring(idx - 200, idx + 50)));
    }
  }
  process.exit(1);
}

const faqPanelHtml = [
  '      <!-- ==================== 0. 매뉴얼 & FAQ (/af/ad_faq/main) ==================== -->',
  '      <div class="submodel-panel" id="panel_ad_faq_main" style="display:none;">',
  '        <div class="content-card" style="padding:20px 24px;">',
  '          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #e2e8f0;">',
  '            <div>',
  '              <h2 style="margin:0;font-size:1.1rem;font-weight:700;color:#1e293b;">안내 &amp; FAQ</h2>',
  '              <p style="margin:4px 0 0;font-size:0.82rem;color:#64748b;">&#8251; 아래 내용을 먼저 확인 후 고객지원 게시판을 이용하시기 바랍니다.</p>',
  '            </div>',
  '            <div style="display:flex;gap:8px;flex-shrink:0;">',
  '              <a href="/downloads/manual_faq/manual_af.zip" style="display:inline-flex;align-items:center;gap:5px;padding:6px 14px;background:#2563eb;color:#fff;border-radius:4px;font-size:0.82rem;font-weight:700;text-decoration:none;" onmouseover="this.style.background=\'#1d4ed8\'" onmouseout="this.style.background=\'#2563eb\'">',
  '                <i class="fa fa-download"></i> 매뉴얼 다운로드',
  '              </a>',
  '              <a href="https://www.youtube.com/playlist?list=PLA-pyXX5hMe9nkqFKeJKOCtGwlIVD2Ck2" target="_blank" style="display:inline-flex;align-items:center;gap:5px;padding:6px 14px;background:#ef4444;color:#fff;border-radius:4px;font-size:0.82rem;font-weight:700;text-decoration:none;" onmouseover="this.style.background=\'#dc2626\'" onmouseout="this.style.background=\'#ef4444\'">',
  '                <i class="fa fa-youtube-play"></i> 동영상 매뉴얼',
  '              </a>',
  '            </div>',
  '          </div>',
  '          <div style="margin-bottom:20px;">',
  '            <div style="background:#f1f5f9;padding:8px 14px;border-radius:5px 5px 0 0;font-weight:700;font-size:0.9rem;color:#1e293b;border-left:4px solid #2563eb;display:flex;align-items:center;gap:6px;">',
  '              <i class="fa fa-list-ol" style="color:#2563eb;"></i> 수강신청 운영 절차',
  '            </div>',
  '            <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 5px 5px;padding:8px 14px;background:#fff;">',
  '              <div id="operationsListContainer" style="display:grid;grid-template-columns:1fr 1fr;gap:0 20px;">',
  '                <div style="color:#94a3b8;font-size:0.82rem;padding:8px 0;">로딩 중...</div>',
  '              </div>',
  '            </div>',
  '          </div>',
  '          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">',
  '            <div>',
  '              <div style="background:#f1f5f9;padding:8px 14px;border-radius:5px 5px 0 0;font-weight:700;font-size:0.9rem;color:#1e293b;border-left:4px solid #16a34a;display:flex;align-items:center;gap:6px;">',
  '                <i class="fa fa-file-text-o" style="color:#16a34a;"></i> 양식 다운로드',
  '              </div>',
  '              <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 5px 5px;padding:8px 14px;background:#fff;min-height:80px;">',
  '                <div id="templateDownloadsContainer"><div style="color:#94a3b8;font-size:0.82rem;padding:8px 0;">로딩 중...</div></div>',
  '              </div>',
  '            </div>',
  '            <div>',
  '              <div style="background:#f1f5f9;padding:8px 14px;border-radius:5px 5px 0 0;font-weight:700;font-size:0.9rem;color:#1e293b;border-left:4px solid #7c3aed;display:flex;align-items:center;gap:6px;">',
  '                <i class="fa fa-book" style="color:#7c3aed;"></i> 매뉴얼 다운로드',
  '              </div>',
  '              <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 5px 5px;padding:8px 14px;background:#fff;min-height:80px;">',
  '                <div id="manualDownloadsContainer"><div style="color:#94a3b8;font-size:0.82rem;padding:8px 0;">로딩 중...</div></div>',
  '              </div>',
  '            </div>',
  '          </div>',
  '          <div>',
  '            <div style="background:#f1f5f9;padding:8px 14px;border-radius:5px 5px 0 0;font-weight:700;font-size:0.9rem;color:#1e293b;border-left:4px solid #f59e0b;display:flex;align-items:center;gap:6px;margin-bottom:12px;">',
  '              <i class="fa fa-question-circle" style="color:#f59e0b;"></i> FAQ <span style="font-size:0.8rem;font-weight:400;color:#64748b;">(자주하는 질문)</span>',
  '            </div>',
  '            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">',
  '              <div id="faqColLeft" style="display:flex;flex-direction:column;gap:10px;"><div style="color:#94a3b8;font-size:0.82rem;padding:8px 0;">로딩 중...</div></div>',
  '              <div id="faqColRight" style="display:flex;flex-direction:column;gap:10px;"></div>',
  '            </div>',
  '          </div>',
  '        </div>',
  '      </div>',
  '',
  '      ' + targetStr.trim()
].join('\r\n');

content = content.replace(targetStr, faqPanelHtml);

if (!content.includes('panel_ad_faq_main')) {
  console.log('ERROR: panel_ad_faq_main not inserted!');
  process.exit(1);
}

fs.writeFileSync(indexPath, content, 'utf8');
console.log('SUCCESS: panel_ad_faq_main inserted into index.html');
