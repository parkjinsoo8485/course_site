const fs = require('fs');

const harRaw = fs.readFileSync('www.dbdbschool.kr.har', 'utf8');
const har = JSON.parse(harRaw);

const entries = har.log.entries;
console.log('Total entries:', entries.length);

let qandaEntry = null;
let qandaIndex = -1;

for (let i = 0; i < entries.length; i++) {
  const url = entries[i].request.url;
  if (url.includes('af/qanda/lists/sn/3267')) {
    qandaEntry = entries[i];
    qandaIndex = i;
    break;
  }
}

if (qandaEntry) {
  console.log(`Found qanda entry at index ${qandaIndex}`);
  console.log('Status:', qandaEntry.response.status);
  console.log('MIME:', qandaEntry.response.content.mimeType);
  const text = qandaEntry.response.content.text;
  if (text) {
    fs.writeFileSync('scratch/qanda_entry.html', text, 'utf8');
    console.log('Saved scratch/qanda_entry.html, size:', text.length);
  } else {
    console.log('No text content in response!');
  }
} else {
  console.log('Q&A entry not found!');
}
