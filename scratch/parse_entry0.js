const fs = require('fs');
const html = fs.readFileSync('scratch/entry0.html', 'utf8');

// Check title
const titleMatch = html.match(/<title>(.*?)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1] : 'None');

// Check sidebar structure
const asideMatch = html.match(/<aside[\s\S]*?<\/aside>/i);
console.log('Aside length:', asideMatch ? asideMatch[0].length : 'Not found');

// Check content structure
const contentMatch = html.match(/<div[^>]*class=["'][^"']*content[^"']*["'][\s\S]*?<\/div>/i);
console.log('Content section exists:', !!contentMatch);

// Look at main containers
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
if (bodyMatch) {
  console.log('Body length:', bodyMatch[1].length);
}

// Find all go_data URLs
const goDataUrls = html.match(/https?:\/\/[^"'\s<>]*go_data[^"'\s<>]*/g) || [];
console.log('go_data URLs count:', goDataUrls.length);
console.log('Unique go_data URLs:', [...new Set(goDataUrls)]);
