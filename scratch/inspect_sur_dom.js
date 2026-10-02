const fs = require('fs');

function inspectContent(file) {
  const html = fs.readFileSync(file, 'utf8');
  console.log(`\n======================================================`);
  console.log(`=== [File] ${file} ===`);

  // Extract content inside #content or main
  const contentMatch = html.match(/<div id="content"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<!--\s*#content\s*-->/i)
                    || html.match(/<div id="content"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<!--\s*#content\s*-->/i)
                    || html.match(/<div id="content"[^>]*>([\s\S]*?)<div id="footer"/i);
  
  const contentArea = contentMatch ? contentMatch[1] : html;

  // Title / Heading
  const headings = [...contentArea.matchAll(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gis)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log('Headings:', headings);

  // Buttons inside content
  const btns = [...contentArea.matchAll(/<(button|a|input)\b([^>]*)>(.*?)<\/\1>|<(input)\b([^>]*)>/gis)]
    .map(m => {
      const tag = m[1] || m[4];
      const attrs = m[2] || m[5] || '';
      const text = (m[3] || '').replace(/<[^>]+>/g, '').trim();
      const val = (attrs.match(/value=['"]([^'"]*)['"]/i) || [])[1] || '';
      const href = (attrs.match(/href=['"]([^'"]*)['"]/i) || [])[1] || '';
      const onclick = (attrs.match(/onclick=['"]([^'"]*)['"]/i) || [])[1] || '';
      const id = (attrs.match(/id=['"]([^'"]*)['"]/i) || [])[1] || '';
      const name = (attrs.match(/name=['"]([^'"]*)['"]/i) || [])[1] || '';
      const label = text || val;
      return { tag, label, id, name, href, onclick };
    })
    .filter(b => b.label && !b.href.includes('css') && !b.href.includes('member/logout') && !b.href.includes('member/modify'));

  console.log('Content Buttons/Links count:', btns.length);
  btns.slice(0, 25).forEach(b => {
    console.log(`  [${b.tag}] "${b.label}" id="${b.id}" name="${b.name}" href="${b.href}" onclick="${b.onclick}"`);
  });

  // Table Structure
  const tables = [...contentArea.matchAll(/<table\b([^>]*)>([\s\S]*?)<\/table>/gis)];
  console.log(`Tables count: ${tables.length}`);
  tables.forEach((t, i) => {
    const ths = [...t[2].matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gis)].map(m => m[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' '));
    const sampleRows = [...t[2].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gis)].length;
    console.log(`  Table[${i}] (rows: ${sampleRows}) TH:`, ths);
  });
}

inspectContent('scratch/target_ad_sur_lists.html');
inspectContent('scratch/target_ad_sur_write.html');
inspectContent('scratch/target_ad_sur_que.html');
inspectContent('scratch/target_ad_sur_ans.html');
inspectContent('scratch/target_ad_surs_lists.html');
