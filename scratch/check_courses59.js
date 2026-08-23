const fs = require('fs');
const courses59 = JSON.parse(fs.readFileSync('scratch/courses_59.json', 'utf8'));

console.log('Courses count:', courses59.length);
console.log('First 3:', courses59.slice(0, 3));
