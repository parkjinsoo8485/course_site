const fs = require('fs');
const html = fs.readFileSync('scratch/ad_pay_edit_response.html', 'utf8');

// Match table rows in fm_edit
const formMatch = html.match(/<form[^>]*id="fm_edit"[^>]*>([\s\S]*?)<\/form>/i);
if (!formMatch) {
  console.log('Form not found');
  process.exit(1);
}

const tableContent = formMatch[1];
const rows = [...tableContent.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)].map(m => m[1]);
console.log('Total table rows:', rows.length);

const parsedStudents = [];
rows.forEach((r, idx) => {
  if (idx === 0 || idx === rows.length - 1) return; // header or footer
  const tds = [...r.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1].trim());
  if (tds.length >= 10) {
    const chkVal = (tds[0].match(/value="([^"]+)"/) || [])[1];
    const seq = tds[1];
    const grade = tds[2];
    const classNum = tds[3];
    const studentNum = tds[4];
    const name = tds[5].replace(/<[^>]+>/g, '').trim();
    const payVal = (tds[6].match(/value="([^"]*)"/) || [])[1];
    const useCostVal = (tds[7].match(/value="([^"]*)"/) || [])[1];
    const teaFeeVal = (tds[8].match(/value="([^"]*)"/) || [])[1];
    const bookVal = (tds[9].match(/value="([^"]*)"/) || [])[1];
    const itemVal = (tds[10].match(/value="([^"]*)"/) || [])[1];
    const addDateVal = (tds[11].match(/value="([^"]*)"/) || [])[1];
    parsedStudents.push({
      appId: chkVal,
      seq: parseInt(seq),
      grade: parseInt(grade),
      classNum: parseInt(classNum),
      studentNum: parseInt(studentNum),
      name,
      pay: payVal,
      useCost: useCostVal,
      teaFee: teaFeeVal,
      book: bookVal,
      item: itemVal,
      addDate: addDateVal
    });
  }
});

console.log('Parsed students (' + parsedStudents.length + '):');
console.log(JSON.stringify(parsedStudents, null, 2));
