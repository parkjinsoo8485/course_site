const fs = require('fs');
const html = fs.readFileSync('scratch/ad_pay_edit_response.html', 'utf8');

console.log('HTML total length:', html.length);

const bodyStart = html.indexOf('<body');
const bodyEnd = html.indexOf('</body>');
console.log('body start:', bodyStart, 'body end:', bodyEnd);

// Let's inspect where navbar, sidebar, content are
const navStart = html.indexOf('navbar-header');
const sidebarStart = html.indexOf('id="left_menu"');
const panelStart = html.indexOf('class="panel_main');
console.log('nav:', navStart, 'sidebar:', sidebarStart, 'panel:', panelStart);

// Save the full html for reference or analyze
