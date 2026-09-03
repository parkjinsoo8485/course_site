const http = require('http');

function checkIndexHtml() {
  const fs = require('fs');
  const path = require('path');
  const file = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
  const content = fs.readFileSync(file, 'utf8');

  console.log('--- Current index.html Layout CSS check ---');
  const containerMatch = content.match(/#container\s*\{[^}]+\}/);
  const leftMenuMatch = content.match(/#left_menu\s*\{[^}]+\}/);
  const mainContentMatch = content.match(/\.main-content\s*\{[^}]+\}/);

  console.log('container:', containerMatch ? containerMatch[0] : 'not found');
  console.log('left_menu:', leftMenuMatch ? leftMenuMatch[0] : 'not found');
  console.log('main_content:', mainContentMatch ? mainContentMatch[0] : 'not found');
}

checkIndexHtml();
