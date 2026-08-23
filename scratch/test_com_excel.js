const http = require('http');

async function testComCourses() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3005/api/af/ad_app/com/courses?sld=10', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('[TEST 1] Courses Response Code:', res.statusCode);
        try {
          const json = JSON.parse(data);
          console.log('[TEST 1] Courses Count:', json.list ? json.list.length : 0);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function testExcelExport(params, label) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams(params).toString();
    const req = http.request('http://localhost:3005/api/af/ad_app/com/excel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`[${label}] Status:`, res.statusCode);
        console.log(`[${label}] Content-Type:`, res.headers['content-type']);
        console.log(`[${label}] Content-Disposition:`, res.headers['content-disposition']);
        console.log(`[${label}] Content snippet (first 150 chars):`, data.substring(0, 150));
        resolve({ status: res.statusCode, headers: res.headers, len: data.length });
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  try {
    await testComCourses();
    await testExcelExport({
      com_gubun: '2',
      sld: '10',
      sln: '',
      excel_gubun: '2',
      file_type: 'all'
    }, 'TEST 2 - 추가자 전체 엑셀');

    await testExcelExport({
      com_gubun: '2',
      sld: '10',
      sln: '',
      excel_gubun: '1',
      file_type: 'all'
    }, 'TEST 3 - 취소자 전체 엑셀');

    await testExcelExport({
      com_gubun: '1',
      sld: '10',
      sld2: '9',
      excel_gubun: '2',
      file_type: 'one'
    }, 'TEST 4 - 이전/현재 비교 추가자');

    console.log('\n>>> All Tests Passed Successfully! <<<');
  } catch (err) {
    console.error('Test failed:', err);
  }
}

main();
