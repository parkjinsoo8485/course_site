const fs = require('fs');

function inspectMainTable(file) {
  const html = fs.readFileSync(file, 'utf8');
  console.log(`\n======================================================`);
  console.log(`=== [MAIN AREA] ${file} ===`);

  // Target the actual contents_box or form or table
  // Look for #content or .contents_box
  const m = html.match(/<div class="contents_box"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<!--\s*#content/i)
         || html.match(/<div class="contents_box"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i)
         || html.match(/<div id="content"[^>]*>([\s\S]*?)<!--\s*#content/i);

  const block = m ? m[1] : html;

  // Buttons, inputs, links inside this block
  const items = [...block.matchAll(/<(a|button|input)\b([^>]*)>(.*?)<\/\1>|<(input)\b([^>]*)>/gis)]
    .map(match => {
      const tag = match[1] || match[4];
      const attrs = match[2] || match[5] || '';
      const text = (match[3] || '').replace(/<[^>]+>/g, '').trim();
      const val = (attrs.match(/value=['"]([^'"]*)['"]/i) || [])[1] || '';
      const href = (attrs.match(/href=['"]([^'"]*)['"]/i) || [])[1] || '';
      const onclick = (attrs.match(/onclick=['"]([^'"]*)['"]/i) || [])[1] || '';
      const id = (attrs.match(/id=['"]([^'"]*)['"]/i) || [])[1] || '';
      const name = (attrs.match(/name=['"]([^'"]*)['"]/i) || [])[1] || '';
      const label = text || val;
      return { tag, label, id, name, href, onclick };
    })
    .filter(x => {
      // Exclude sidebar navigation items
      const ignore = ['광주풍향초등학교', '늘봄학교', '다른 서비스 둘러보기', '홈으로', '강좌등록', '매뉴얼', '고객지원 게시판',
                      '학교관리', '강좌관리', '신청자관리', '대기자관리', '환불/취소관리', '지원금관리', '대상자관리', '수강자관리',
                      '지원금설정', '순위구분설정', '귀가일정표', '결석/귀가신청', '강사관리', '설문관리', '설문', '샘플설문', '환경설정',
                      '기본설정', '강사권한', '출석부옵션', '문자설정', '강의실', '신청기간', '강의시간', '차시관리', '안내문구', 'SMS문구',
                      '프로그램', '연장신청'];
      return !ignore.includes(x.label);
    });

  console.log(`Action elements (${items.length}):`);
  items.slice(0, 30).forEach(x => {
    console.log(`  [${x.tag}] "${x.label}" | id="${x.id}" name="${x.name}" href="${x.href}" onclick="${x.onclick}"`);
  });

  // Table headers & sample row cells
  const tables = [...block.matchAll(/<table\b([^>]*)>([\s\S]*?)<\/table>/gis)];
  tables.forEach((t, i) => {
    const ths = [...t[2].matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gis)].map(th => th[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' '));
    console.log(`  Table[${i}] THs:`, ths);
    const trs = [...t[2].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gis)];
    if (trs.length > 1) {
      const firstRowTds = [...trs[1][1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gis)].map(td => td[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' '));
      console.log(`  Table[${i}] Row 1 TDs:`, firstRowTds);
    }
  });
}

inspectMainTable('scratch/target_ad_sur_lists.html');
inspectMainTable('scratch/target_ad_sur_write.html');
inspectMainTable('scratch/target_ad_sur_que.html');
inspectMainTable('scratch/target_ad_sur_ans.html');
inspectMainTable('scratch/target_ad_surs_lists.html');
