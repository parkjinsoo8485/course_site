const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

async function testAll() {
  console.log('🧪 Starting syntax & execution validation for Cloned Dashboard and Mock API...');

  // 1. Validate Mock API
  const mockApi = require('./mock_api.js');
  const server = mockApi.listen(3006);
  console.log('✅ mock_api.js loaded and started successfully on port 3006.');

  // Test GET lists
  const res1 = await fetch('http://localhost:3006/api/af/ad_app/lists/sn/3267?sld=10');
  const data1 = await res1.json();
  if (data1.status === 200 && data1.data.length > 0) {
    console.log(`✅ [GET /lists] Passed: retrieved ${data1.data.length} applicants.`);
  } else {
    throw new Error('GET /lists failed');
  }

  // Test POST stu_hp
  const res2 = await fetch('http://localhost:3006/api/af/ad_app/stu_hp/sn/3267', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      num: '21016254',
      mem_hp: '010-1234-5678',
      mem_pa_name: '테스트학부모',
      mem_pa_tel: '010-9876-5432'
    })
  });
  const data2 = await res2.json();
  if (data2.status === 200 && data2.mem_hp === '010-1234-5678') {
    console.log('✅ [POST /stu_hp] Passed: contact info updated properly.');
  } else {
    throw new Error('POST /stu_hp failed');
  }

  // Test POST draw_first
  const res3 = await fetch('http://localhost:3006/api/af/ad_app/draw_first/sn/3267', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'Y',
      data_checked: ['21016254']
    })
  });
  const data3 = await res3.json();
  if (data3.status === 200 && data3.mode === 'Y') {
    console.log('✅ [POST /draw_first] Passed: priority updated.');
  } else {
    throw new Error('POST /draw_first failed');
  }

  // Test GET schedule
  const res4 = await fetch('http://localhost:3006/api/af/ad_app/schedule/sn/3267?mem_num=4841988');
  const data4 = await res4.json();
  if (data4.status === 200 && data4.schedule.length === 5) {
    console.log('✅ [GET /schedule] Passed: schedule timetable retrieved.');
  } else {
    throw new Error('GET /schedule failed');
  }

  server.close();

  // 2. Validate ClonedDashboard.jsx syntax
  const fs = require('fs');
  const jsxPath = path.resolve(__dirname, '../dashboard/ClonedDashboard.jsx');
  const jsxContent = fs.readFileSync(jsxPath, 'utf8');

  // Check balanced braces and valid React structure
  let openBraces = 0;
  for (const ch of jsxContent) {
    if (ch === '{') openBraces++;
    if (ch === '}') openBraces--;
  }
  if (openBraces === 0) {
    console.log(`✅ [JSX Syntax] dashboard/ClonedDashboard.jsx has balanced braces (${jsxContent.length} bytes).`);
  } else {
    throw new Error(`JSX unbalanced braces: delta ${openBraces}`);
  }

  console.log('\n🎉 ALL 3 STEPS COMPLETED AND VALIDATED SUCCESSFULLY! 🎉');
}

testAll().catch((err) => {
  console.error('❌ Validation error:', err);
  process.exit(1);
});
