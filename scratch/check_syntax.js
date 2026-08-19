const fs = require('fs');
const code = fs.readFileSync('course_site/server.js', 'utf8');
const lines = code.split('\n');

let stack = [];
lines.forEach((line, idx) => {
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '{' || ch === '(' || ch === '[') {
      stack.push({ ch, line: idx + 1, col: i + 1 });
    } else if (ch === '}' || ch === ')' || ch === ']') {
      if (stack.length === 0) {
        console.log(`Unmatched closing ${ch} at line ${idx + 1}, col ${i + 1}`);
      } else {
        const top = stack.pop();
        const pairs = { '}': '{', ')': '(', ']': '[' };
        if (top.ch !== pairs[ch]) {
          console.log(`Mismatched ${ch} at line ${idx + 1}, col ${i + 1}, expected closing for ${top.ch} from line ${top.line}`);
        }
      }
    }
  }
});

console.log('Remaining unclosed brackets count:', stack.length);
if (stack.length > 0) {
  console.log('Unclosed items:', stack.slice(-10));
}
