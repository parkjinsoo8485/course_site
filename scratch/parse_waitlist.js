const fs = require('fs');
const html = fs.readFileSync('scratch/btn_page_af_ad_wait_lists_sn_3267.html', 'utf8');
const tableMatch = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
if (!tableMatch) { console.log('No tbody'); process.exit(0); }
const rowMatches = tableMatch[1].match(/<tr[\s\S]*?<\/tr>/gi) || [];
console.log('Total waitlist rows:', rowMatches.length);
const items = rowMatches.map((row, idx) => {
  const tds = (row.match(/<td[\s\S]*?<\/td>/gi) || []).map(td => td.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  const valMatch = row.match(/value="(\d+)"/);
  return {
    id: valMatch ? valMatch[1] : 'wait_' + (idx + 1),
    rank: parseInt(tds[1] || (idx + 1)),
    div: tds[3] || '26년 8월 돌봄',
    courseTitle: tds[4] || '',
    grade: tds[5] || '1',
    ban: tds[6] || '1',
    num: tds[7] || '1',
    studentName: tds[8] || '',
    phone: tds[9] || '',
    appliedAt: tds[10] || '2026-07-10 16:09:31',
    status: '대기'
  };
});
console.log('First 3 items:', items.slice(0, 3));
fs.writeFileSync('scratch/authentic_waitlist_data.json', JSON.stringify(items, null, 2), 'utf8');
console.log('Successfully saved ' + items.length + ' items to scratch/authentic_waitlist_data.json');
