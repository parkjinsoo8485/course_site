const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// 1. Read auth.json cookies
const auth = JSON.parse(fs.readFileSync('auth.json', 'utf8'));
const cookieStr = auth.cookies.map(c => c.name + '=' + c.value).join('; ');

// 2. Read entry0.html
const html = fs.readFileSync('scratch/entry0.html', 'utf8');

// 3. Extract unique go_data URLs
const matches = html.match(/https?:\/\/[^"'<>\s]+/g) || [];
const goDataUrls = [...new Set(matches.filter(u => u.includes('/help/go_data/')))];
console.log(`Found ${goDataUrls.length} unique go_data URLs.`);

// Output directory
const outDir = path.join(__dirname, '../course_site/public/downloads/manual_faq');
fs.mkdirSync(outDir, { recursive: true });

function resolveRedirect(url) {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        'Cookie': cookieStr,
        'Referer': 'https://www.dbdbschool.kr/af/ad_faq/main/sn/3267'
      }
    }, (res) => {
      let loc = res.headers.location;
      if (loc) {
        // Fix binary decoding of UTF-8 headers
        try {
          loc = Buffer.from(loc, 'binary').toString('utf8');
        } catch (e) {}
      }
      resolve({
        statusCode: res.statusCode,
        location: loc,
        headers: res.headers
      });
    });
    req.on('error', (err) => {
      resolve({ statusCode: 500, error: err.message });
    });
    req.end();
  });
}

function downloadBinary(rawUrl, destPath) {
  return new Promise((resolve) => {
    // Correctly encode UTF-8 URL for S3
    const encodedUrl = encodeURI(rawUrl);
    const parsed = new URL(encodedUrl);
    const proto = parsed.protocol === 'https:' ? https : http;

    const req = proto.get(parsed, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let nextLoc = res.headers.location;
        try {
          nextLoc = Buffer.from(nextLoc, 'binary').toString('utf8');
        } catch (e) {}
        return downloadBinary(nextLoc, destPath).then(resolve);
      }
      if (res.statusCode !== 200) {
        return resolve({ success: false, status: res.statusCode, url: encodedUrl });
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve({ success: true, size: fs.statSync(destPath).size });
      });
      fileStream.on('error', (err) => resolve({ success: false, error: err.message }));
    });
    req.on('error', (err) => resolve({ success: false, error: err.message }));
  });
}

async function run() {
  const mapping = {};
  console.log('Resolving URLs and downloading files...');

  // Master zip download
  const masterZipUrl = 'https://s3-ap-northeast-2.amazonaws.com/www.dbdbschool.kr/doc/manual/af/manual_af.zip?23091501';
  const masterZipDest = path.join(outDir, 'manual_af.zip');
  console.log('Checking master manual_af.zip...');
  if (!fs.existsSync(masterZipDest) || fs.statSync(masterZipDest).size === 0) {
    const zipRes = await downloadBinary(masterZipUrl, masterZipDest);
    console.log('Master manual_af.zip download result:', zipRes);
  }
  mapping['https://s3-ap-northeast-2.amazonaws.com/www.dbdbschool.kr/doc/manual/af/manual_af.zip?23091501'] = {
    originalUrl: masterZipUrl,
    localFile: 'manual_af.zip',
    size: fs.existsSync(masterZipDest) ? fs.statSync(masterZipDest).size : 0,
    isFile: true
  };

  for (let i = 0; i < goDataUrls.length; i++) {
    const originalUrl = goDataUrls[i];
    const parts = originalUrl.match(/\/num\/(\d+)\/data\/(link\d+)/);
    const num = parts ? parts[1] : null;
    const type = parts ? parts[2] : null;

    try {
      const res = await resolveRedirect(originalUrl);
      const targetUrl = res.location || null;
      console.log(`[${i + 1}/${goDataUrls.length}] num:${num} ${type} => ${res.statusCode} : ${targetUrl}`);

      mapping[originalUrl] = {
        num,
        type,
        statusCode: res.statusCode,
        targetUrl
      };

      if (targetUrl) {
        if (targetUrl.includes('youtu.be') || targetUrl.includes('youtube.com')) {
          mapping[originalUrl].isVideo = true;
          mapping[originalUrl].youtubeUrl = targetUrl;
        } else {
          // File download
          mapping[originalUrl].isFile = true;
          const cleanUrl = targetUrl.split('?')[0];
          let fileName = path.basename(cleanUrl);
          if (!fileName || fileName.length === 0) fileName = `doc_${num}_${type}`;
          
          const safeLocalName = `${num}_${type}_${fileName}`;
          const destFile = path.join(outDir, safeLocalName);

          const dlRes = await downloadBinary(targetUrl, destFile);
          if (dlRes.success) {
            console.log(`   -> Downloaded (${dlRes.size} bytes): ${safeLocalName}`);
            mapping[originalUrl].localFile = safeLocalName;
            mapping[originalUrl].size = dlRes.size;
          } else {
            console.log(`   -> Download failed: ${dlRes.status} for ${dlRes.url}`);
          }
        }
      }
    } catch (e) {
      console.error(`Error resolving ${originalUrl}:`, e.message);
    }
  }

  const mappingFile = path.join(__dirname, '../course_site/utils/manual_faq_mapping.json');
  fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2), 'utf8');
  console.log(`Mapping successfully saved to ${mappingFile}`);

  // Create a zip of all downloaded files for Google Drive upload convenience
  console.log('Finished downloading all assets.');
}

run();
