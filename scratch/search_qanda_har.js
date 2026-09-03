const fs = require('fs');
const readline = require('readline');

const harPath = 'www.dbdbschool.kr.har';
const rs = fs.createReadStream(harPath, { encoding: 'utf8' });
const rl = readline.createInterface({ input: rs });

const matchedUrls = new Set();
let entryIndex = 0;

rl.on('line', (line) => {
  if (line.includes('"url":')) {
    if (line.includes('qanda') || line.includes('qna')) {
      matchedUrls.add(line.trim());
    }
  }
});

rl.on('close', () => {
  console.log('Total unique matches:', matchedUrls.size);
  for (const u of matchedUrls) {
    console.log(u);
  }
});
