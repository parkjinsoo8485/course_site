import fs from 'fs';

const subpages = JSON.parse(fs.readFileSync('scratch/sczigi_subpages_analysis.json', 'utf8'));

console.log(`Total Pages Analyzed: ${subpages.length}\n`);

const summary = subpages.map((p, idx) => {
  return {
    index: idx + 1,
    url: p.url,
    title: p.subDom.title,
    h1: p.subDom.h1,
    contentTitle: p.subDom.contentTitle,
    tableHeaders: p.subDom.tables?.map(t => t.headers),
    buttons: p.subDom.buttons?.map(b => b.text).filter(t => t && t !== '×'),
    formsCount: p.subDom.forms?.length
  };
});

fs.writeFileSync('scratch/sczigi_pages_summary.json', JSON.stringify(summary, null, 2), 'utf8');
console.log(JSON.stringify(summary, null, 2));
