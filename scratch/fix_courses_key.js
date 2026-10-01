const fs = require('fs');
const file = 'course_site/af/ad_lec/lists/sn/admin_lec.js';
let content = fs.readFileSync(file, 'utf8');

// Replace d.courses with (d.lectures || d.courses || [])
content = content.replace(/const courses = \(d\.courses \|\| \[\]\)/g, 'const courses = (d.lectures || d.courses || [])');
content = content.replace(/const courses = d\.courses \|\| \[\];/g, 'const courses = (d.lectures || d.courses || []);');

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated courses fallback to d.lectures || d.courses in admin_lec.js');
