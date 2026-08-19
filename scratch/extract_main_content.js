const fs = require('fs');
const html = fs.readFileSync('scratch/ad_pay_edit_response.html', 'utf8');

// Find content area
const contentStart = html.indexOf('<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">');
const contentEnd = html.indexOf('<!-- //footer -->');

if (contentStart !== -1) {
  const content = html.substring(contentStart, contentEnd !== -1 ? contentEnd : contentStart + 50000);
  console.log('=== MAIN CONTENT (Length: ' + content.length + ') ===');
  console.log(content.substring(0, 10000));
  fs.writeFileSync('scratch/main_content.html', content);
} else {
  console.log('Main start not found directly, searching div with main');
  const match = html.match(/<div[^>]*class="[^"]*main[^"]*"[^>]*>([\s\S]*?)<\/body>/);
  if (match) {
    fs.writeFileSync('scratch/main_content.html', match[0]);
    console.log('Saved match to scratch/main_content.html');
  }
}
