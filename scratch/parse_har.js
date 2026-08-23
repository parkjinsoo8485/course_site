const fs = require('fs');
const path = require('path');

const HAR_PATH = path.resolve(__dirname, 'network.har');
const OUTPUT_PATH = path.resolve(__dirname, 'filtered_api_dom.json');
const HTML_BACKUP_PATH = path.resolve(__dirname, 'page_af_ad_app_lists_sn_3267.html');

function parseHarAndDom() {
  console.log(`🔍 Reading HAR file from: ${HAR_PATH}`);

  let entries = [];
  if (fs.existsSync(HAR_PATH)) {
    try {
      const raw = fs.readFileSync(HAR_PATH, 'utf8');
      const harData = JSON.parse(raw);
      entries = harData.log?.entries || [];
      console.log(`📊 Total entries found in HAR: ${entries.length}`);
    } catch (e) {
      console.warn('⚠️ Could not parse HAR JSON:', e.message);
    }
  }

  const filteredEntries = [];

  for (const entry of entries) {
    const req = entry.request;
    const res = entry.response;
    const resourceType = (entry._resourceType || '').toLowerCase();
    const mimeType = (res.content?.mimeType || '').toLowerCase();
    const url = req.url;

    const isDoc = resourceType === 'document' || mimeType.includes('text/html');
    const isXhrFetch = resourceType === 'xhr' || resourceType === 'fetch' || mimeType.includes('application/json') || mimeType.includes('text/javascript') || mimeType.includes('application/x-www-form-urlencoded');
    const isRelevant = isDoc || isXhrFetch || url.includes('/af/') || url.includes('/api/') || url.includes('lists') || url.includes('ajax');

    const isStaticAsset = /\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|css)(\?.*)?$/i.test(url);
    if (isStaticAsset && !isDoc) {
      continue;
    }

    if (!isRelevant) {
      continue;
    }

    let responseText = res.content?.text || '';
    if (res.content?.encoding === 'base64' && responseText) {
      try {
        responseText = Buffer.from(responseText, 'base64').toString('utf8');
      } catch (_) {}
    }

    let parsedResponseBody = responseText;
    if (mimeType.includes('json') || (responseText.trim().startsWith('{') && responseText.trim().endsWith('}')) || (responseText.trim().startsWith('[') && responseText.trim().endsWith(']'))) {
      try {
        parsedResponseBody = JSON.parse(responseText);
      } catch (_) {}
    }

    let parsedRequestBody = req.postData?.text || null;
    if (parsedRequestBody && (parsedRequestBody.startsWith('{') || parsedRequestBody.startsWith('['))) {
      try {
        parsedRequestBody = JSON.parse(parsedRequestBody);
      } catch (_) {}
    }

    filteredEntries.push({
      url: req.url,
      method: req.method,
      status: res.status,
      resourceType: resourceType || (isDoc ? 'document' : 'xhr'),
      mimeType: res.content?.mimeType || '',
      request: {
        queryString: req.queryString || [],
        headers: req.headers || [],
        postData: req.postData ? {
          mimeType: req.postData.mimeType,
          text: parsedRequestBody,
          params: req.postData.params || []
        } : null
      },
      response: {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers || [],
        body: typeof parsedResponseBody === 'string' && parsedResponseBody.length > 5000 
          ? parsedResponseBody.substring(0, 5000) + '... [TRUNCATED_FOR_LIGHTWEIGHT]' 
          : parsedResponseBody
      },
      time: entry.time,
      startedDateTime: entry.startedDateTime
    });
  }

  // Schema specifications for ad_app/lists/sn/3267
  const domSchema = {
    targetPage: 'https://www.dbdbschool.kr/af/ad_app/lists/sn/3267',
    pageTitle: '신청목록 - 신청자관리 - 늘봄학교',
    schoolName: '광주풍향초등학교',
    serviceName: '늘봄학교',
    role: 'school_admin',
    currentAdmin: '관리자(김혜련)님',
    filters: {
      divisions: [
        { value: 'all', label: '=강좌구분=' },
        { value: '5', label: '3월' },
        { value: '6', label: '26년 4월' },
        { value: '7', label: '26년 5월' },
        { value: '8', label: '26년 6월' },
        { value: '9', label: '26년 7월' },
        { value: '10', label: '26년 8월', default: true },
        { value: '11', label: '26년 9월' }
      ],
      programs: [
        { value: 'all', label: '=늘봄과정=' },
        { value: '1', label: '방과후' },
        { value: '2', label: '맞춤형' },
        { value: '3', label: '돌봄' }
      ],
      grades: [
        { value: '', label: '=학년=' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' }
      ],
      classes: [
        { value: '', label: '=반=' },
        ...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))
      ],
      searchTypes: [
        { value: 'app_mem_name', label: '이름' },
        { value: 'tel', label: '연락처' }
      ]
    },
    topActions: [
      { text: '상세검색 열기/닫기', id: 'main_control_box_btn01', type: 'toggle' },
      { text: '대기자목록', href: '/af/ad_wait/lists/sn/3267', variant: 'default' },
      { text: '신청자등록', href: '/af/ad_app/sin/sn/3267', variant: 'primary' },
      { text: '추가기능..', id: 'main_control_box_btn02', type: 'dropdown', subItems: [
        { text: '신청자일괄입력', href: '/af/ad_app/input/sn/3267', variant: 'warning' },
        { text: '수강료입력', href: '/af/ad_pay/edit/sn/3267', variant: 'warning' },
        { text: '신청자복사', href: '/af/ad_app/copy/sn/3267', variant: 'info' },
        { text: '추가/취소자조회', href: '/af/ad_app/com/sn/3267', variant: 'default' },
        { text: '미신청자목록', href: '/af/ad_app/list1/sn/3267', variant: 'default' },
        { text: '신청결과엑셀출력', href: '/af/ad_app/excel/sn/3267', variant: 'success' },
        { text: '수강신청서출력', href: '/af/ad_app/pdf/sn/3267', variant: 'success' },
        { text: '고지서출력', href: '/af/ad_app/pdf1/sn/3267', variant: 'success' },
        { text: '시간표출력', href: '/af/ad_app/pdf2/sn/3267', variant: 'success' }
      ]}
    ],
    tableColumns: [
      { key: 'checkbox', label: '선택', width: 40 },
      { key: 'seq', label: '연번', width: 60 },
      { key: 'division', label: '구분\n(늘봄과정)', width: 90 },
      { key: 'lec_name', label: '강좌명', width: null },
      { key: 'grade', label: '학년', width: 50 },
      { key: 'class_num', label: '반', width: 50 },
      { key: 'bunho', label: '번호', width: 60, sortable: true },
      { key: 'student_name', label: '이름', width: 80 },
      { key: 'contact', label: '연락처', width: 170 },
      { key: 'tuition_fee', label: '수강료', width: 70 },
      { key: 'material_fee', label: '수용비', width: 70 },
      { key: 'instructor_fee', label: '강사료', width: 70 },
      { key: 'book_fee', label: '교재비', width: 70 },
      { key: 'item_fee', label: '재료비', width: 70 },
      { key: 'total_fee', label: '합계', width: 70 },
      { key: 'reg_date', label: '등록일자', width: 100, sortable: true },
      { key: 'delete_action', label: '삭제', width: 50 }
    ],
    batchActions: [
      { value: 'del', label: '선택삭제' },
      { value: 'move', label: '신청자이동' },
      { value: 'draw_first_Y', label: '우선추첨대상자지정' },
      { value: 'draw_first_N', label: '우선추첨대상자제외' }
    ],
    apiEndpoints: [
      { path: '/api/af/ad_app/lists/sn/:school_id', method: 'GET', desc: '신청자 목록 및 필터 검색' },
      { path: '/api/af/ad_app/stu_hp/sn/:school_id', method: 'POST', desc: '학생/학부모 연락처 인라인 수정' },
      { path: '/api/af/ad_app/cancel/sn/:school_id', method: 'POST', desc: '단일/선택 신청자 삭제 및 취소 처리' },
      { path: '/api/af/ad_app/draw_first/sn/:school_id', method: 'POST', desc: '우선추첨 대상자 일괄 지정/제외' },
      { path: '/api/af/ad_app/schedule/sn/:school_id', method: 'GET', desc: '학생 수강 시간표 모달 데이터 조회' }
    ]
  };

  const outputPayload = {
    generatedAt: new Date().toISOString(),
    targetUrl: 'https://www.dbdbschool.kr/af/ad_app/lists/sn/3267',
    totalEntries: entries.length,
    filteredCount: filteredEntries.length,
    entries: filteredEntries,
    domSchema: domSchema
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(outputPayload, null, 2), 'utf8');
  console.log(`💾 Refined filtered API & DOM data saved to: ${OUTPUT_PATH}`);
}

parseHarAndDom();
