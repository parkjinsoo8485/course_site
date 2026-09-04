const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('scratch/crawled_write_page.html', 'utf8');

// HTML 파싱하지 않고 form이나 table 찾아보기
const formStart = html.indexOf('<form');
const formEnd = html.indexOf('</form>');
console.log('formStart:', formStart, 'formEnd:', formEnd);

if (formStart !== -1 && formEnd !== -1) {
  const formHtml = html.substring(formStart, formEnd + 7);
  fs.writeFileSync('scratch/crawled_form_only.html', formHtml, 'utf8');
  console.log('Saved formHtml to scratch/crawled_form_only.html (length: ' + formHtml.length + ')');
}
