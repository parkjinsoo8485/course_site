const https = require('https');
const fs = require('fs');

const authData = JSON.parse(fs.readFileSync('auth.json', 'utf8'));
const cookieStr = authData.cookies.map(c => `${c.name}=${c.value}`).join('; ');

function fetchWithRedirect(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'Cookie': cookieStr,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
      console.log(`URL: ${url} -> Status: ${res.statusCode}, Location: ${res.headers.location}`);
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = 'https://www.dbdbschool.kr' + redirectUrl;
        }
        return fetchWithRedirect(redirectUrl).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data
        });
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching qanda write page...');
  const writeRes = await fetchWithRedirect('https://www.dbdbschool.kr/af/qanda/write/p/1/sn/3267');
  fs.writeFileSync('scratch/qanda_write.html', writeRes.data, 'utf8');
  console.log('Saved qanda_write.html, length:', writeRes.data.length);

  console.log('Fetching qanda view page 8806...');
  const viewRes = await fetchWithRedirect('https://www.dbdbschool.kr/af/qanda/view/num/8806/p/1/sn/3267');
  fs.writeFileSync('scratch/qanda_view_8806.html', viewRes.data, 'utf8');
  console.log('Saved qanda_view_8806.html, length:', viewRes.data.length);
}

main().catch(console.error);
