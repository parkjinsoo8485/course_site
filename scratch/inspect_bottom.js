const fs = require('fs');
const content = fs.readFileSync('scratch/main_content.html', 'utf8');

console.log('Total content length:', content.length);
// Find table end, bottom buttons, notice
const lastRows = content.lastIndexOf('<tr');
console.log('Last rows & footer:\n', content.substring(lastRows - 2000));
