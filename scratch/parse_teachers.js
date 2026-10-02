const fs = require('fs');

function parsePage(html) {
  const rows = [...html.matchAll(/<tr>\s*<td><input type="checkbox" name="data_checked\[\]" value="(\d+)">[\s\S]*?<\/tr>/g)];
  return rows.map(r => {
    const tr = r[0];
    const numMatch = tr.match(/value="(\d+)"/);
    const tds = [...tr.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
    return {
      num: numMatch ? numMatch[1] : '',
      seq: parseInt(tds[1], 10),
      id: tds[3],
      name: tds[4],
      hp: tds[5],
      lastLogin: tds[6],
      tempPass: tds[7]?.replace(/&nbsp;/g, '').trim() || '-',
      selfAuth: tds[8]?.replace(/&nbsp;/g, '').trim() || '-',
      twoFactor: tds[9]?.replace(/&nbsp;/g, '').trim() || '-',
      agreeDate: tds[10]?.replace(/&nbsp;/g, '').trim() || '-',
      status: tds[11]?.includes('사용') ? '1' : '0'
    };
  });
}

const p1 = parsePage(fs.readFileSync('scratch/target_ad_tea_lists.html', 'utf8'));
const p2 = fs.existsSync('scratch/target_ad_tea_lists_p2.html') 
  ? parsePage(fs.readFileSync('scratch/target_ad_tea_lists_p2.html', 'utf8')) 
  : [];

const allTeachers = [...p1, ...p2];
console.log('Total teachers parsed (all pages):', allTeachers.length);
fs.writeFileSync('scratch/teachers_seed.json', JSON.stringify(allTeachers, null, 2), 'utf8');
