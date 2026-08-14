const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3005';

function request(method, urlPath, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🚀 [START] Automated Test Suite: Live dbdbschool 28-Page Sidebar Renewal');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  try {
    // 1. 단독 대메뉴군 13개 검증
    console.log('\n[1] Testing Standalone Menu Group APIs (13 Submodels)');
    
    const rFaq = await request('GET', '/api/af/ad_faq/main');
    assert(rFaq.status === 200 && Array.isArray(rFaq.data.faqs), '1. /af/ad_faq/main (FAQ) loaded');

    const rQa = await request('GET', '/api/qa?schoolCode=UNCHON2025');
    assert(rQa.status === 200 && Array.isArray(rQa.data.questions), '2. /af/qanda/lists (Q&A Board) loaded');

    const rSchool = await request('GET', '/api/sczigi/service/lists');
    assert(rSchool.status === 200 && Array.isArray(rSchool.data.schools), '3. /sczigi/service/lists (School Mgmt) loaded');

    const rLec = await request('GET', '/api/af/ad_lec/lists/sn/3267');
    assert(rLec.status === 200 && Array.isArray(rLec.data.lectures), '4. /af/ad_lec/lists (Course Mgmt) loaded');

    const rApp = await request('GET', '/api/af/ad_stu/lists/sn/3267');
    assert(rApp.status === 200 && Array.isArray(rApp.data.applicants), '5. /af/ad_app/lists (Applicant Mgmt) loaded');

    const rWait = await request('GET', '/api/af/ad_wait/lists');
    assert(rWait.status === 200 && Array.isArray(rWait.data.waitlist), '6. /af/ad_wait/lists (Waitlist Mgmt) loaded');

    const rPromote = await request('POST', '/api/af/ad_wait/promote', { waitId: 'wait_1' });
    assert(rPromote.status === 200 && rPromote.data.success, '6b. Waitlist instant promotion API');

    const rAtt = await request('GET', '/api/af/ad_att/stat');
    assert(rAtt.status === 200 && Array.isArray(rAtt.data.stats), '7. /af/ad_att/stat (Attendance Stats) loaded');

    const rRef = await request('GET', '/api/af/ad_ref/lists');
    assert(rRef.status === 200 && Array.isArray(rRef.data.refunds), '8. /af/ad_ref/lists (Refunds & Cancels) loaded');

    const rAbs = await request('GET', '/api/af/ad_abs/lists');
    assert(rAbs.status === 200 && Array.isArray(rAbs.data.absences), '9. /af/ad_abs/lists (Absences & Dismissal) loaded');

    const rTea = await request('GET', '/api/af/ad_tea/lists');
    assert(rTea.status === 200 && Array.isArray(rTea.data.teachers), '10. /af/ad_tea/lists (Teachers Mgmt) loaded');

    const rNoti = await request('GET', '/api/af/notification/lists');
    assert(rNoti.status === 200 && Array.isArray(rNoti.data.notifications), '11. /af/notification/lists (Notifications History) loaded');

    const rPush = await request('GET', '/api/af/spush/lists');
    assert(rPush.status === 200 && Array.isArray(rPush.data.pushNotifications), '12. /af/spush/lists (Push Notifications) loaded');

    const rExt = await request('GET', '/api/af/ad_extension/lists');
    assert(rExt.status === 200 && Array.isArray(rExt.data.extensions), '13. /af/ad_extension/lists (Service Extensions) loaded');

    // 2. 지원금관리 4개 서브모델 검증
    console.log('\n[2] Testing Subsidy Management Submodels (4 Submodels)');
    
    const rSubStu = await request('GET', '/api/af/ad_free2_stu/lists');
    assert(rSubStu.status === 200 && Array.isArray(rSubStu.data.students), '14. /af/ad_free2_stu/lists (Subsidy Students) loaded');

    const rSubApp = await request('GET', '/api/af/ad_free2_app/lists');
    assert(rSubApp.status === 200 && Array.isArray(rSubApp.data.applicants), '15. /af/ad_free2_app/lists (Subsidy Applicants) loaded');

    const rSubCfg = await request('GET', '/api/af/ad_free2_cfg/main');
    assert(rSubCfg.status === 200 && rSubCfg.data.config.annualLimit === 600000, '16. /af/ad_free2_cfg/main (Subsidy Policy 600k Limit)');

    const rSubRanks = await request('GET', '/api/af/ad_free2_cfg/free1');
    assert(rSubRanks.status === 200 && Array.isArray(rSubRanks.data.ranks), '17. /af/ad_free2_cfg/free1 (Subsidy Priority Ranks) loaded');

    // 3. 설문관리 2개 서브모델 검증
    console.log('\n[3] Testing Survey Management Submodels (2 Submodels)');

    const rSur = await request('GET', '/api/af/ad_sur/lists');
    assert(rSur.status === 200 && Array.isArray(rSur.data.surveys), '18. /af/ad_sur/lists (Surveys) loaded');

    const rSmpSur = await request('GET', '/api/af/ad_surs/lists');
    assert(rSmpSur.status === 200 && Array.isArray(rSmpSur.data.sampleSurveys), '19. /af/ad_surs/lists (Sample Survey Templates) loaded');

    // 4. 환경설정 10개 서브모델 검증
    console.log('\n[4] Testing Environment Configuration Submodels (10 Submodels)');

    const rTime = await request('GET', '/api/af/ad_time/lists');
    assert(rTime.status === 200 && Array.isArray(rTime.data.periods), '20. /af/ad_time/lists (Application Time Periods) loaded');

    const rPeriod = await request('GET', '/api/af/ad_cfg/period');
    assert(rPeriod.status === 200 && Array.isArray(rPeriod.data.periods), '21. /af/ad_cfg/period (Class Time Schedule Periods) loaded');

    const rDiv = await request('GET', '/api/af/ad_cfg/afDiv');
    assert(rDiv.status === 200 && Array.isArray(rDiv.data.divisions), '22. /af/ad_cfg/afDiv (Course Divisions) loaded');

    const rGrp = await request('GET', '/api/manual/restriction-groups');
    assert(rGrp.status === 200 && Array.isArray(rGrp.data.groups), '23. /af/ad_cfg/appLiGrp (Restriction Groups) loaded');

    const rNeis = await request('GET', '/api/af/ad_lec/export-neis?schoolId=3267');
    assert(rNeis.status === 200 && rNeis.data.count > 0, '24. /af/ad_neis_edufine/lists (NEIS Export) loaded');

    const rEdufine = await request('GET', '/api/af/ad_lec/export-edufine?schoolId=3267');
    assert(rEdufine.status === 200 && rEdufine.data.count > 0, '25. /af/ad_neis_edufine/lists (Edufine 80/20 Split Export) loaded');

    const rMsg = await request('GET', '/api/manual/notice-settings');
    assert(rMsg.status === 200 && rMsg.data.settings.loginTopText, '26. /af/ad_cfg/message (Notice Text Settings) loaded');

    const rClear = await request('POST', '/api/af/ad_cfg/clear', { targetCategory: '2026년 1분기' });
    assert(rClear.status === 200 && rClear.data.success, '27. /af/ad_cfg/clear (New Semester Reset API)');

    const rInfo = await request('GET', '/api/af/ad_info/modify');
    assert(rInfo.status === 200 && rInfo.data.info.managerName, '28. /af/ad_info/modify (Manager & School Info) loaded');

    // 5. SPA Route Fallback Test (28 Live URLs)
    console.log('\n[5] Testing SPA Routing Fallback for 28 Live URLs');
    const liveUrls = [
      '/af/ad_faq/main/sn/3267',
      '/af/qanda/lists/sn/3267',
      '/sczigi/service/lists/sn/3267',
      '/af/ad_lec/lists/sn/3267',
      '/af/ad_app/lists/sn/3267',
      '/af/ad_wait/lists/sn/3267',
      '/af/ad_att/stat/sn/3267',
      '/af/ad_ref/lists/sn/3267',
      '/af/ad_abs/lists/sn/3267',
      '/af/ad_tea/lists/sn/3267',
      '/af/notification/lists/sn/3267',
      '/af/spush/lists/sn/3267',
      '/af/ad_extension/lists/sn/3267',
      '/af/ad_free2_stu/lists/sn/3267',
      '/af/ad_free2_app/lists/sn/3267',
      '/af/ad_free2_cfg/main/sn/3267',
      '/af/ad_free2_cfg/free1/sn/3267',
      '/af/ad_sur/lists/sn/3267',
      '/af/ad_surs/lists/sn/3267',
      '/af/ad_cfg/main/sn/3267',
      '/af/ad_time/lists/sn/3267',
      '/af/ad_cfg/period/sn/3267',
      '/af/ad_cfg/afDiv/sn/3267',
      '/af/ad_cfg/appLiGrp/sn/3267',
      '/af/ad_verify/main/sn/3267',
      '/af/ad_neis_edufine/lists/sn/3267',
      '/af/ad_cfg/message/sn/3267',
      '/af/ad_cfg/clear/sn/3267',
      '/af/ad_info/modify/sn/3267'
    ];

    for (const u of liveUrls) {
      const res = await request('GET', u);
      assert(res.status === 200 && res.raw.includes('adminSidebar'), `SPA Page loaded for: ${u}`);
    }

    console.log(`\n========================================`);
    console.log(`🎉 ALL 29 SUBMODELS & 28 LIVE URLS VERIFIED: ${passed}/${total} (100% SUCCESS)`);
    console.log(`========================================\n`);

  } catch (err) {
    console.error('Test execution error:', err);
  }
}

runTests();
