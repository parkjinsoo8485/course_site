const fs = require('fs');
const html = fs.readFileSync('scratch/ad_pay_edit_response.html', 'utf8');

const slnMatch = html.match(/<select[^>]*name="sln"[^>]*>([\s\S]*?)<\/select>/i);
const courses = [];
if (slnMatch) {
  [...slnMatch[1].matchAll(/<option[^>]*value="([^"]*)"[^>]*>([\s\S]*?)<\/option>/gi)].forEach(m => {
    courses.push({
      value: m[1],
      text: m[2].trim()
    });
  });
}

fs.writeFileSync('scratch/courses_59.json', JSON.stringify(courses, null, 2));
console.log('Saved 59 courses to scratch/courses_59.json');
