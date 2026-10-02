# -*- coding: utf-8 -*-
import re

excel_routes_code = '''// ==================== 지원금 수강자관리 (/af/ad_free2_app) 엑셀 6종 + 정산 1종 프리미엄 공식 서식 ====================

// 0. 지원금 정산 총괄표 (/af/ad_free2_app/excel_settle)
app.get(/^\\/af\\/ad_free2_app\\/excel_settle/, (req, res) => {
  const list = db.getSubsidyApplicants('sch_1');
  const totalFee = list.reduce((a, c) => a + (c.totalFee || c.fee || 0), 0);
  const totalSub = list.reduce((a, c) => a + (c.subsidizedAmount || 0), 0);
  const totalOut = list.reduce((a, c) => a + (c.collectedAmount !== undefined ? c.collectedAmount : (c.outOfPocket || 0)), 0);

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    body { font-family: '맑은 고딕', Arial, sans-serif; font-size: 10pt; color: #1e293b; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
    th { background-color: #dbeafe; border: 1px solid #94a3b8; padding: 8px 12px; font-weight: bold; text-align: center; font-size: 10pt; color: #1e3a8a; }
    td { border: 1px solid #cbd5e1; padding: 7px 10px; vertical-align: middle; text-align: center; font-size: 9.5pt; }
    .title-cell { font-size: 17pt; font-weight: bold; text-align: left; color: #1e40af; padding: 14px 4px 6px 4px; }
    .meta-bar { font-size: 9.5pt; color: #475569; padding: 6px 4px 12px 4px; text-align: left; border: none; }
    .num { text-align: right; mso-number-format: "#,##0"; }
    .total-row td { background-color: #fef3c7; font-weight: bold; color: #92400e; border-top: 2px solid #b45309; border-bottom: 2px solid #b45309; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="7" class="title-cell">2026학년도 방과후학교 지원금 정산 총괄표</td></tr>
    <tr>
      <td colspan="7" class="meta-bar">
        ■ 학교명: <strong>광주풍향초등학교</strong> | 출력일시: ${new Date().toLocaleString('ko-KR')} | 집계 대상: 전 강좌 지원 수강생
      </td>
    </tr>
    <tr>
      <th style="width: 20%;">구분</th>
      <th style="width: 12%;">총 신청인원</th>
      <th style="width: 17%;">총 수강료(A)</th>
      <th style="width: 17%;">지원금 차감합계(B)</th>
      <th style="width: 17%;">본인부담금 합계(A-B)</th>
      <th style="width: 17%;">정산일자</th>
      <th style="width: 17%;">비고</th>
    </tr>
    <tr>
      <td style="text-align:left; font-weight:bold;">풍향초 전 강좌 합계</td>
      <td style="font-weight:bold;">${list.length}명</td>
      <td class="num" style="font-weight:bold;">${totalFee.toLocaleString()}원</td>
      <td class="num" style="font-weight:bold; color:#1d4ed8;">${totalSub.toLocaleString()}원</td>
      <td class="num" style="font-weight:bold; color:#c2410c;">${totalOut.toLocaleString()}원</td>
      <td>${new Date().toISOString().slice(0, 10)}</td>
      <td>정상 집계 완료</td>
    </tr>
    <tr class="total-row">
      <td style="text-align:left;">총 합계</td>
      <td>${list.length}명</td>
      <td class="num">${totalFee.toLocaleString()}원</td>
      <td class="num" style="color:#1d4ed8;">${totalSub.toLocaleString()}원</td>
      <td class="num" style="color:#c2410c;">${totalOut.toLocaleString()}원</td>
      <td>-</td>
      <td>최종 결산</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="subsidy_settlement_report.xls"');
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 1. 검색결과출력 (공식 BIN002D 서식 1:1 프리미엄 엑셀)
app.get(/^\\/af\\/ad_free2_app\\/excel$/, (req, res) => {
  const { month, category, course, grade, classNum, searchName } = req.query;
  const list = db.getSubsidyApplicants('sch_1', { month, category, course, grade, classNum, searchName });

  const totalTuition = list.reduce((a, c) => a + (c.tuitionFee || 0), 0);
  const totalInstructor = list.reduce((a, c) => a + (c.instructorFee || 0), 0);
  const totalOverhead = list.reduce((a, c) => a + (c.overheadFee || 0), 0);
  const totalTextbook = list.reduce((a, c) => a + (c.textbookFee || 0), 0);
  const totalMaterial = list.reduce((a, c) => a + (c.materialFee || 0), 0);
  const totalFeeSum = list.reduce((a, c) => a + (c.totalFee || c.fee || 0), 0);
  const totalCollected = list.reduce((a, c) => a + (c.collectedAmount !== undefined ? c.collectedAmount : (c.outOfPocket || 0)), 0);
  const totalSubsidized = list.reduce((a, c) => a + (c.subsidizedAmount || 0), 0);
  const totalBalance = totalFeeSum - totalSubsidized;

  const rowsHtml = list.map((a, idx) => {
    const fee = a.totalFee || a.fee || 0;
    const sub = a.subsidizedAmount || 0;
    const col = a.collectedAmount !== undefined ? a.collectedAmount : (a.outOfPocket || 0);
    const bal = fee - sub;
    const isEven = idx % 2 === 1;
    const rowBg = isEven ? '#f8fafc' : '#ffffff';

    return `
    <tr style="background-color: ${rowBg};">
      <td style="mso-number-format:'0';">${idx + 1}</td>
      <td>${a.grade}</td>
      <td>일반</td>
      <td>${a.classNum}</td>
      <td>${a.studentNum}</td>
      <td style="font-weight:bold; color:#0f172a;">${a.studentName}</td>
      <td>1순위</td>
      <td>기초/차상위</td>
      <td>${a.month || '3월'}</td>
      <td style="text-align:left; font-weight:500;">${a.courseTitle || ''}</td>
      <td class="num">${(a.tuitionFee || 0).toLocaleString()}</td>
      <td class="num">${(a.instructorFee || 0).toLocaleString()}</td>
      <td class="num">${(a.overheadFee || 0).toLocaleString()}</td>
      <td class="num">${(a.textbookFee || 0).toLocaleString()}</td>
      <td class="num">${(a.materialFee || 0).toLocaleString()}</td>
      <td class="num" style="font-weight:bold; background-color:#f1f5f9;">${fee.toLocaleString()}</td>
      <td class="num" style="font-weight:bold; color:#c2410c; background-color:#fff7ed;">${col.toLocaleString()}</td>
      <td class="num" style="font-weight:bold; color:#1d4ed8; background-color:#eff6ff;">${sub.toLocaleString()}</td>
      <td class="num">${bal.toLocaleString()}</td>
      <td>${col === 0 ? '전액지원' : '일부지원'}</td>
    </tr>
  `;
  }).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    body { font-family: '맑은 고딕', Arial, sans-serif; font-size: 9.5pt; color: #1e293b; }
    table { border-collapse: collapse; width: 100%; }
    th { border: 1px solid #94a3b8; padding: 7px 6px; font-weight: bold; text-align: center; vertical-align: middle; font-size: 9.5pt; }
    td { border: 1px solid #cbd5e1; padding: 6px 6px; vertical-align: middle; text-align: center; font-size: 9pt; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: left; color: #1e40af; padding: 14px 4px 4px 4px; }
    .meta-bar { font-size: 9.5pt; color: #475569; padding: 6px 4px 10px 4px; text-align: left; border: none; }
    .num { text-align: right; mso-number-format: "#,##0"; }
    .header-base { background-color: #f1f5f9; color: #334155; }
    .header-calc { background-color: #e0f2fe; color: #0369a1; }
    .header-collect { background-color: #ffedd5; color: #9a3412; }
    .header-sub { background-color: #dbeafe; color: #1e40af; }
    .total-row td { background-color: #fef3c7; font-weight: bold; color: #92400e; border-top: 2px solid #ca8a04; border-bottom: 2px solid #ca8a04; font-size: 9.5pt; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="20" class="title-cell">2026학년도 방과후학교 지원금 수강자 목록 (검색결과)</td></tr>
    <tr>
      <td colspan="20" class="meta-bar">
        ■ <strong>광주풍향초등학교</strong> | 출력일시: ${new Date().toLocaleString('ko-KR')} | 총 검색 건수: <strong>${list.length}명</strong> | 수강총액: <strong>${totalFeeSum.toLocaleString()}원</strong> | 총 지원금: <strong>${totalSubsidized.toLocaleString()}원</strong> | 총 징수금액: <strong>${totalCollected.toLocaleString()}원</strong>
      </td>
    </tr>
    <tr>
      <th rowspan="2" class="header-base" style="width:40px;">연번</th>
      <th rowspan="2" class="header-base" style="width:45px;">학년</th>
      <th rowspan="2" class="header-base" style="width:45px;">학과</th>
      <th rowspan="2" class="header-base" style="width:40px;">반</th>
      <th rowspan="2" class="header-base" style="width:40px;">번호</th>
      <th rowspan="2" class="header-base" style="width:75px;">이름</th>
      <th rowspan="2" class="header-base" style="width:55px;">순위</th>
      <th rowspan="2" class="header-base" style="width:80px;">순위 구분</th>
      <th rowspan="2" class="header-base" style="width:45px;">월</th>
      <th rowspan="2" class="header-base" style="width:160px;">강좌명</th>
      <th colspan="6" class="header-calc">신청 / 산출 내역 (A)</th>
      <th rowspan="2" class="header-collect" style="width:85px;">징수금액(A-B)</th>
      <th rowspan="2" class="header-sub" style="width:85px;">지원금액(B)</th>
      <th rowspan="2" class="header-base" style="width:85px;">지원금 잔액</th>
      <th rowspan="2" class="header-base" style="width:65px;">비고</th>
    </tr>
    <tr>
      <th class="header-calc" style="width:70px;">수강료</th>
      <th class="header-calc" style="width:70px;">강사료</th>
      <th class="header-calc" style="width:65px;">수용비</th>
      <th class="header-calc" style="width:65px;">교재비</th>
      <th class="header-calc" style="width:65px;">재료비</th>
      <th class="header-calc" style="width:75px; font-weight:bold;">합계</th>
    </tr>
    ${rowsHtml}
    <tr class="total-row">
      <td colspan="10" style="text-align:center;">총 결산 합계 (${list.length}명)</td>
      <td class="num">${totalTuition.toLocaleString()}</td>
      <td class="num">${totalInstructor.toLocaleString()}</td>
      <td class="num">${totalOverhead.toLocaleString()}</td>
      <td class="num">${totalTextbook.toLocaleString()}</td>
      <td class="num">${totalMaterial.toLocaleString()}</td>
      <td class="num" style="background-color:#fef08a;">${totalFeeSum.toLocaleString()}</td>
      <td class="num" style="color:#c2410c; background-color:#fed7aa;">${totalCollected.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8; background-color:#bfdbfe;">${totalSubsidized.toLocaleString()}</td>
      <td class="num">${totalBalance.toLocaleString()}</td>
      <td>-</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="subsidy_applicants_search_result.xls"');
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 2. 전체징수현황 엑셀 (/af/ad_free2_app/excel_all_collect)
app.get(/^\\/af\\/ad_free2_app\\/excel_all_collect/, (req, res) => {
  const list = db.getSubsidyApplicants('sch_1');
  const totalFeeSum = list.reduce((a, c) => a + (c.totalFee || c.fee || 0), 0);
  const totalSub = list.reduce((a, c) => a + (c.subsidizedAmount || 0), 0);
  const totalCol = list.reduce((a, c) => a + (c.collectedAmount !== undefined ? c.collectedAmount : (c.outOfPocket || 0)), 0);

  const rowsHtml = list.map((a, idx) => {
    const fee = a.totalFee || a.fee || 0;
    const sub = a.subsidizedAmount || 0;
    const col = a.collectedAmount !== undefined ? a.collectedAmount : (a.outOfPocket || 0);
    const isEven = idx % 2 === 1;
    const rowBg = isEven ? '#f8fafc' : '#ffffff';

    return `
    <tr style="background-color: ${rowBg};">
      <td style="mso-number-format:'0';">${idx + 1}</td>
      <td style="text-align:left; font-weight:500;">${a.courseTitle || ''}</td>
      <td>${a.grade}학년</td>
      <td>${a.classNum}반</td>
      <td>${a.studentNum}번</td>
      <td style="font-weight:bold; color:#0f172a;">${a.studentName}</td>
      <td>${a.month || '3월'}</td>
      <td class="num" style="font-weight:bold;">${fee.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8; font-weight:bold; background-color:#eff6ff;">${sub.toLocaleString()}</td>
      <td class="num" style="color:#c2410c; font-weight:bold; background-color:#fff7ed;">${col.toLocaleString()}</td>
      <td><span style="font-weight:bold; color:${col === 0 ? '#15803d' : '#0369a1'};">${col === 0 ? '전액지원' : '수납완료'}</span></td>
      <td>${a.subsidyType || '자유수강권'}</td>
    </tr>
  `;
  }).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    body { font-family: '맑은 고딕', Arial, sans-serif; font-size: 10pt; color: #1e293b; }
    table { border-collapse: collapse; width: 100%; }
    th { background-color: #d1fae5; border: 1px solid #6ee7b7; padding: 8px 8px; font-weight: bold; text-align: center; font-size: 10pt; color: #065f46; }
    td { border: 1px solid #cbd5e1; padding: 7px 8px; vertical-align: middle; text-align: center; font-size: 9.5pt; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: left; color: #047857; padding: 14px 4px 6px 4px; }
    .meta-bar { font-size: 9.5pt; color: #475569; padding: 6px 4px 10px 4px; text-align: left; border: none; }
    .num { text-align: right; mso-number-format: "#,##0"; }
    .total-row td { background-color: #fef3c7; font-weight: bold; color: #92400e; border-top: 2px solid #b45309; border-bottom: 2px solid #b45309; font-size: 10pt; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="12" class="title-cell">2026학년도 광주풍향초등학교 지원금 전체 징수 및 지원 현황표</td></tr>
    <tr>
      <td colspan="12" class="meta-bar">
        ■ <strong>광주풍향초등학교</strong> | 출력일시: ${new Date().toLocaleString('ko-KR')} | 총 대상: <strong>${list.length}명</strong> | 수강총액: <strong>${totalFeeSum.toLocaleString()}원</strong> | 총 지원금: <strong>${totalSub.toLocaleString()}원</strong> | 실 징수총액: <strong>${totalCol.toLocaleString()}원</strong>
      </td>
    </tr>
    <tr>
      <th style="width:40px;">연번</th>
      <th style="width:200px;">강좌명</th>
      <th style="width:60px;">학년</th>
      <th style="width:50px;">반</th>
      <th style="width:50px;">번호</th>
      <th style="width:85px;">학생명</th>
      <th style="width:55px;">대상월</th>
      <th style="width:110px;">총 수강비용(A)</th>
      <th style="width:110px;">지원금 차감액(B)</th>
      <th style="width:115px;">징수(본인부담)금액(A-B)</th>
      <th style="width:85px;">수납상태</th>
      <th style="width:100px;">비고</th>
    </tr>
    ${rowsHtml}
    <tr class="total-row">
      <td colspan="7" style="text-align:center;">총 결산 합계 (${list.length}건)</td>
      <td class="num">${totalFeeSum.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8;">${totalSub.toLocaleString()}</td>
      <td class="num" style="color:#c2410c;">${totalCol.toLocaleString()}</td>
      <td>완료</td>
      <td>전액 결산</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="subsidy_all_collection_report.xls"');
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 3. 월별현황 엑셀 (공식 BIN002C 서식 1:1 프리미엄 엑셀)
app.get(/^\\/af\\/ad_free2_app\\/excel_monthly/, (req, res) => {
  const { month } = req.query;
  const list = db.getSubsidyApplicants('sch_1');
  const targetMonth = month || '3월';

  const months = ['3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월', '1월', '2월'];
  const monthSums = {};
  months.forEach(m => { monthSums[m] = 0; });

  let grandUsedTotal = 0;
  let grandTotalLimit = 0;
  let grandRemain = 0;
  let grandRecentCollect = 0;
  let grandTotalCollect = 0;

  const rowsHtml = list.map((a, idx) => {
    const sub = a.subsidizedAmount || 0;
    const col = a.collectedAmount !== undefined ? a.collectedAmount : (a.outOfPocket || 0);
    const limit = 600000;
    const remain = Math.max(0, limit - sub);
    const isEven = idx % 2 === 1;
    const rowBg = isEven ? '#f8fafc' : '#ffffff';

    grandUsedTotal += sub;
    grandTotalLimit += limit;
    grandRemain += remain;
    grandRecentCollect += col;
    grandTotalCollect += col;

    const monthCols = months.map(m => {
      const val = (a.month === m) ? sub : 0;
      monthSums[m] += val;
      return `<td class="num">${val > 0 ? val.toLocaleString() : '-'}</td>`;
    }).join('');

    return `
    <tr style="background-color: ${rowBg};">
      <td style="mso-number-format:'0';">${idx + 1}</td>
      <td>${a.grade}</td>
      <td>일반</td>
      <td>${a.classNum}</td>
      <td>${a.studentNum}</td>
      <td style="font-weight:bold; color:#0f172a;">${a.studentName}</td>
      <td>자유수강권</td>
      <td>1순위</td>
      <td>차상위</td>
      ${monthCols}
      <td class="num" style="font-weight:bold; color:#1d4ed8; background-color:#eff6ff;">${sub.toLocaleString()}</td>
      <td class="num" style="color:#047857; font-weight:bold;">${remain.toLocaleString()}</td>
      <td class="num">${limit.toLocaleString()}</td>
      <td class="num" style="color:#dc2626; font-weight:bold; background-color:#fef2f2;">${col.toLocaleString()}</td>
      <td class="num" style="color:#dc2626; font-weight:bold; background-color:#fef2f2;">${col.toLocaleString()}</td>
      <td>전체</td>
      <td>정상</td>
    </tr>
  `;
  }).join('');

  const monthTotalCols = months.map(m => `
    <td class="num">${monthSums[m] > 0 ? monthSums[m].toLocaleString() : '-'}</td>
  `).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    body { font-family: '맑은 고딕', Arial, sans-serif; font-size: 9pt; color: #1e293b; }
    table { border-collapse: collapse; width: 100%; }
    th { background-color: #e0e7ff; border: 1px solid #94a3b8; padding: 7px 4px; font-weight: bold; text-align: center; vertical-align: middle; font-size: 9pt; color: #3730a3; }
    td { border: 1px solid #cbd5e1; padding: 5px 4px; vertical-align: middle; text-align: center; font-size: 8.5pt; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: left; color: #312e81; padding: 14px 4px 6px 4px; }
    .meta-bar { font-size: 9.5pt; color: #475569; padding: 6px 4px 10px 4px; text-align: left; border: none; }
    .num { text-align: right; mso-number-format: "#,##0"; }
    .total-row td { background-color: #fef3c7; font-weight: bold; color: #92400e; border-top: 2px solid #ca8a04; border-bottom: 2px solid #ca8a04; font-size: 9pt; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="28" class="title-cell">2026학년도 방과후 지원금 대상자 월별 지원 현황 대장</td></tr>
    <tr>
      <td colspan="28" class="meta-bar">
        ■ <strong>광주풍향초등학교</strong> | 기준 월: <strong>${targetMonth}</strong> | 출력일시: ${new Date().toLocaleString('ko-KR')} | 대상 학생: <strong>${list.length}명</strong>
      </td>
    </tr>
    <tr>
      <th style="width:35px;">연번</th><th style="width:38px;">학년</th><th style="width:38px;">학과</th><th style="width:35px;">반</th><th style="width:35px;">번호</th><th style="width:65px;">이름</th><th style="width:75px;">지원금</th><th style="width:45px;">순위</th><th style="width:65px;">순위 구분</th>
      <th style="width:55px;">3월</th><th style="width:55px;">4월</th><th style="width:55px;">5월</th><th style="width:55px;">6월</th><th style="width:55px;">7월</th><th style="width:55px;">8월</th><th style="width:55px;">9월</th><th style="width:55px;">10월</th><th style="width:55px;">11월</th><th style="width:55px;">12월</th><th style="width:55px;">1월</th><th style="width:55px;">2월</th>
      <th style="width:75px; background-color:#bfdbfe; color:#1e40af;">사용합계</th>
      <th style="width:75px;">남은금액</th>
      <th style="width:75px;">총액</th>
      <th style="width:75px; color:#b91c1c; background-color:#fee2e2;">징수(최근월)</th>
      <th style="width:75px; color:#b91c1c; background-color:#fee2e2;">징수금액</th>
      <th style="width:60px;">지원기간</th>
      <th style="width:50px;">비고</th>
    </tr>
    ${rowsHtml}
    <tr class="total-row">
      <td colspan="9" style="text-align:center;">총 결산 합계 (${list.length}명)</td>
      ${monthTotalCols}
      <td class="num" style="color:#1d4ed8;">${grandUsedTotal.toLocaleString()}</td>
      <td class="num" style="color:#047857;">${grandRemain.toLocaleString()}</td>
      <td class="num">${grandTotalLimit.toLocaleString()}</td>
      <td class="num" style="color:#dc2626;">${grandRecentCollect.toLocaleString()}</td>
      <td class="num" style="color:#dc2626;">${grandTotalCollect.toLocaleString()}</td>
      <td>-</td>
      <td>정상</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="subsidy_monthly_status_report.xls"');
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 4. 스쿨뱅킹현황 엑셀 (공식 BIN002A 서식 1:1 프리미엄 엑셀)
app.get(/^\\/af\\/ad_free2_app\\/excel_banking/, (req, res) => {
  const { month } = req.query;
  const list = db.getSubsidyApplicants('sch_1');
  const targetMonth = month || '6월';

  let totalUnitFee = 0;
  let totalFeeSum = 0;
  let totalCollectFee = 0;
  let totalSubFee = 0;

  const rowsHtml = list.map((a, idx) => {
    const fee = a.totalFee || a.fee || 0;
    const sub = a.subsidizedAmount || 0;
    const col = a.collectedAmount !== undefined ? a.collectedAmount : (a.outOfPocket || 0);
    const instFee = a.instructorFee || Math.round(fee * 0.95);
    const ovhFee = a.overheadFee || (fee - instFee);

    totalUnitFee += fee;
    totalFeeSum += fee;
    totalCollectFee += col;
    totalSubFee += sub;

    const isEven = idx % 2 === 1;
    const rowBg = isEven ? '#f8fafc' : '#ffffff';

    return `
    <tr style="background-color: ${rowBg};">
      <td style="mso-number-format:'0';">${idx + 1}</td>
      <td style="text-align:left; font-weight:500;">${a.courseTitle || ''}</td>
      <td style="text-align:left;">${a.courseTitle || ''}</td>
      <td>tea0${(idx % 4) + 1}</td>
      <td>1</td>
      <td>1</td>
      <td class="num">${fee.toLocaleString()}</td>
      <td class="num" style="font-weight:bold;">${fee.toLocaleString()}</td>
      <!-- 징수 -->
      <td>${col > 0 ? 1 : 0}</td>
      <td class="num">${col > 0 ? instFee.toLocaleString() : 0}</td>
      <td class="num">${col > 0 ? ovhFee.toLocaleString() : 0}</td>
      <td class="num" style="color:#c2410c;">${col.toLocaleString()}</td>
      <td class="num" style="color:#c2410c; font-weight:bold; background-color:#fff7ed;">${col.toLocaleString()}</td>
      <!-- 자유수강권 -->
      <td>${sub > 0 ? 1 : 0}</td>
      <td class="num">${sub > 0 ? instFee.toLocaleString() : 0}</td>
      <td class="num">${sub > 0 ? ovhFee.toLocaleString() : 0}</td>
      <td class="num" style="color:#1d4ed8;">${sub.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8; font-weight:bold; background-color:#eff6ff;">${sub.toLocaleString()}</td>
      <!-- 1학년/추가지원금 -->
      <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
      <!-- 최종 스쿨뱅킹 출금액 -->
      <td class="num" style="font-weight:bold; color:#b45309; background-color:#fef3c7;">${col.toLocaleString()}</td>
      <td class="num">${instFee.toLocaleString()}</td>
      <td class="num">${ovhFee.toLocaleString()}</td>
      <td>수강료</td>
    </tr>
  `;
  }).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    body { font-family: '맑은 고딕', Arial, sans-serif; font-size: 9pt; color: #1e293b; }
    table { border-collapse: collapse; width: 100%; }
    th { border: 1px solid #94a3b8; padding: 6px 4px; font-weight: bold; text-align: center; vertical-align: middle; font-size: 9pt; }
    td { border: 1px solid #cbd5e1; padding: 5px 4px; vertical-align: middle; text-align: center; font-size: 8.5pt; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: left; color: #9a3412; padding: 14px 4px 6px 4px; }
    .meta-bar { font-size: 9.5pt; color: #475569; padding: 6px 4px 10px 4px; text-align: left; border: none; }
    .num { text-align: right; mso-number-format: "#,##0"; }
    .th-base { background-color: #f1f5f9; color: #334155; }
    .th-col { background-color: #fed7aa; color: #9a3412; }
    .th-free { background-color: #fef08a; color: #854d0e; }
    .th-add { background-color: #e9d5ff; color: #6b21a8; }
    .th-final { background-color: #fde68a; color: #78350f; }
    .total-row td { background-color: #fef3c7; font-weight: bold; color: #92400e; border-top: 2px solid #ca8a04; border-bottom: 2px solid #ca8a04; font-size: 9pt; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="27" class="title-cell">2026학년도 방과후학교 지원금 스쿨뱅킹 수납 현황표 (${targetMonth})</td></tr>
    <tr>
      <td colspan="27" class="meta-bar">
        ■ <strong>광주풍향초등학교</strong> | 대상 월: <strong>${targetMonth}</strong> | 출력일시: ${new Date().toLocaleString('ko-KR')} | 총 강좌: <strong>${list.length}건</strong> | 스쿨뱅킹 총 수납액: <strong>${totalCollectFee.toLocaleString()}원</strong>
      </td>
    </tr>
    <tr>
      <th rowspan="2" class="th-base" style="width:35px;">연번</th>
      <th rowspan="2" class="th-base" style="width:140px;">강좌명</th>
      <th rowspan="2" class="th-base" style="width:140px;">나이스 강좌명</th>
      <th rowspan="2" class="th-base" style="width:60px;">강사ID</th>
      <th rowspan="2" class="th-base" style="width:45px;">학생수</th>
      <th rowspan="2" class="th-base" style="width:45px;">학생수합</th>
      <th rowspan="2" class="th-base" style="width:70px;">단가</th>
      <th rowspan="2" class="th-base" style="width:75px;">금액</th>
      <th colspan="5" class="th-col">징수(스쿨뱅킹)</th>
      <th colspan="5" class="th-free">자유수강권</th>
      <th colspan="5" class="th-add">1학년/추가지원금</th>
      <th rowspan="2" class="th-final" style="width:85px;">스쿨뱅킹출금액</th>
      <th rowspan="2" class="th-base" style="width:70px;">강사료</th>
      <th rowspan="2" class="th-base" style="width:60px;">수용비</th>
      <th rowspan="2" class="th-base" style="width:55px;">비고</th>
    </tr>
    <tr>
      <th class="th-col" style="width:40px;">학생수</th>
      <th class="th-col" style="width:60px;">강사료</th>
      <th class="th-col" style="width:55px;">수용비</th>
      <th class="th-col" style="width:65px;">징수금액</th>
      <th class="th-col" style="width:70px;">징수합계</th>
      <th class="th-free" style="width:40px;">학생수</th>
      <th class="th-free" style="width:60px;">강사료</th>
      <th class="th-free" style="width:55px;">수용비</th>
      <th class="th-free" style="width:65px;">지원금액</th>
      <th class="th-free" style="width:70px;">지원합계</th>
      <th class="th-add" style="width:40px;">학생수</th>
      <th class="th-add" style="width:60px;">강사료</th>
      <th class="th-add" style="width:55px;">수용비</th>
      <th class="th-add" style="width:65px;">지원금액</th>
      <th class="th-add" style="width:70px;">지원합계</th>
    </tr>
    ${rowsHtml}
    <tr class="total-row">
      <td colspan="6" style="text-align:center;">총 결산 합계 (${list.length}건)</td>
      <td class="num">${totalUnitFee.toLocaleString()}</td>
      <td class="num">${totalFeeSum.toLocaleString()}</td>
      <td>-</td><td>-</td><td>-</td>
      <td class="num">${totalCollectFee.toLocaleString()}</td>
      <td class="num" style="color:#c2410c;">${totalCollectFee.toLocaleString()}</td>
      <td>-</td><td>-</td><td>-</td>
      <td class="num">${totalSubFee.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8;">${totalSubFee.toLocaleString()}</td>
      <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
      <td class="num" style="color:#b45309;">${totalCollectFee.toLocaleString()}</td>
      <td>-</td><td>-</td><td>정산완료</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="subsidy_school_banking_${encodeURIComponent(targetMonth)}.xls"`);
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 5. 행정실용 엑셀 (공식 BIN0023 / BIN0027 서식 1:1 프리미엄 엑셀)
app.get(/^\\/af\\/ad_free2_app\\/excel_admin/, (req, res) => {
  const { month } = req.query;
  const list = db.getSubsidyApplicants('sch_1');
  const targetMonth = month || '6월';

  let grandTotalFee = 0;
  let grandCollect = 0;
  let grandSub = 0;

  const rowsHtml = list.map((a, idx) => {
    const fee = a.totalFee || a.fee || 0;
    const sub = a.subsidizedAmount || 0;
    const col = a.collectedAmount !== undefined ? a.collectedAmount : (a.outOfPocket || 0);
    const isEven = idx % 2 === 1;
    const rowBg = isEven ? '#f8fafc' : '#ffffff';

    grandTotalFee += fee;
    grandCollect += col;
    grandSub += sub;

    return `
    <tr style="background-color: ${rowBg};">
      <td style="mso-number-format:'0';">${idx + 1}</td>
      <td>${a.grade}학년</td>
      <td>일반</td>
      <td>${a.classNum}반</td>
      <td>${a.studentNum}</td>
      <td style="font-weight:bold; color:#0f172a;">${a.studentName}</td>
      <!-- 수강료 -->
      <td class="num">${(a.tuitionFee || 0).toLocaleString()}</td>
      <td class="num" style="color:#c2410c;">${col.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8;">${sub.toLocaleString()}</td>
      <td class="num">0</td><td class="num">0</td>
      <!-- 교재비 -->
      <td class="num">${(a.textbookFee || 0).toLocaleString()}</td>
      <td class="num">0</td>
      <td class="num" style="color:#1d4ed8;">${(a.textbookFee || 0).toLocaleString()}</td>
      <td class="num">0</td><td class="num">0</td>
      <!-- 재료비 -->
      <td class="num">${(a.materialFee || 0).toLocaleString()}</td>
      <td class="num">0</td>
      <td class="num" style="color:#1d4ed8;">${(a.materialFee || 0).toLocaleString()}</td>
      <td class="num">0</td><td class="num">0</td>
      <!-- 총액 결산 -->
      <td class="num" style="font-weight:bold; background-color:#f1f5f9;">${fee.toLocaleString()}</td>
      <td class="num" style="color:#dc2626; font-weight:bold; background-color:#fff7ed;">${col.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8; font-weight:bold; background-color:#eff6ff;">${sub.toLocaleString()}</td>
      <td style="text-align:left; font-weight:500;">${a.courseTitle || ''}</td>
      <td>tea0${(idx % 4) + 1}</td>
      <td>에듀파인반영</td>
    </tr>
  `;
  }).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    body { font-family: '맑은 고딕', Arial, sans-serif; font-size: 9pt; color: #1e293b; }
    table { border-collapse: collapse; width: 100%; }
    th { border: 1px solid #94a3b8; padding: 6px 4px; font-weight: bold; text-align: center; vertical-align: middle; font-size: 9pt; }
    td { border: 1px solid #cbd5e1; padding: 5px 4px; vertical-align: middle; text-align: center; font-size: 8.5pt; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: left; color: #831843; padding: 14px 4px 6px 4px; }
    .meta-bar { font-size: 9.5pt; color: #475569; padding: 6px 4px 10px 4px; text-align: left; border: none; }
    .num { text-align: right; mso-number-format: "#,##0"; }
    .th-base { background-color: #f1f5f9; color: #334155; }
    .th-tui { background-color: #bae6fd; color: #0369a1; }
    .th-book { background-color: #bbf7d0; color: #15803d; }
    .th-item { background-color: #fef08a; color: #854d0e; }
    .th-sum { background-color: #fed7aa; color: #9a3412; }
    .total-row td { background-color: #fef3c7; font-weight: bold; color: #92400e; border-top: 2px solid #ca8a04; border-bottom: 2px solid #ca8a04; font-size: 9pt; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="26" class="title-cell">에듀파인 수입관리 연계용 학생기준 강사별 지원금 감면자 목록 (${targetMonth})</td></tr>
    <tr>
      <td colspan="26" class="meta-bar">
        ■ <strong>광주풍향초등학교</strong> | 대상 월: <strong>${targetMonth}</strong> | 출력일시: ${new Date().toLocaleString('ko-KR')} | 총 감면 대상: <strong>${list.length}명</strong> | 수입총액: <strong>${grandTotalFee.toLocaleString()}원</strong> | 총 감면(지원)액: <strong>${grandSub.toLocaleString()}원</strong>
      </td>
    </tr>
    <tr>
      <th rowspan="2" class="th-base" style="width:35px;">연번</th>
      <th rowspan="2" class="th-base" style="width:50px;">학년</th>
      <th rowspan="2" class="th-base" style="width:40px;">학과</th>
      <th rowspan="2" class="th-base" style="width:40px;">반</th>
      <th rowspan="2" class="th-base" style="width:40px;">번호</th>
      <th rowspan="2" class="th-base" style="width:65px;">이름</th>
      <th colspan="5" class="th-tui">수강료</th>
      <th colspan="5" class="th-book">교재비</th>
      <th colspan="5" class="th-item">재료비</th>
      <th rowspan="2" class="th-sum" style="width:80px;">금액합계</th>
      <th rowspan="2" class="th-sum" style="width:80px; color:#c2410c;">징수금액합계</th>
      <th rowspan="2" class="th-sum" style="width:80px; color:#1d4ed8;">지원금액합계</th>
      <th rowspan="2" class="th-base" style="width:140px;">강좌</th>
      <th rowspan="2" class="th-base" style="width:60px;">강사ID</th>
      <th rowspan="2" class="th-base" style="width:65px;">비고</th>
    </tr>
    <tr>
      <th class="th-tui" style="width:65px;">금액</th>
      <th class="th-tui" style="width:65px;">징수금액</th>
      <th class="th-tui" style="width:65px;">자유수강권</th>
      <th class="th-tui" style="width:55px;">다자녀</th>
      <th class="th-tui" style="width:55px;">농어촌</th>
      <th class="th-book" style="width:65px;">금액</th>
      <th class="th-book" style="width:65px;">징수금액</th>
      <th class="th-book" style="width:65px;">자유수강권</th>
      <th class="th-book" style="width:55px;">다자녀</th>
      <th class="th-book" style="width:55px;">농어촌</th>
      <th class="th-item" style="width:65px;">금액</th>
      <th class="th-item" style="width:65px;">징수금액</th>
      <th class="th-item" style="width:65px;">자유수강권</th>
      <th class="th-item" style="width:55px;">다자녀</th>
      <th class="th-item" style="width:55px;">농어촌</th>
    </tr>
    ${rowsHtml}
    <tr class="total-row">
      <td colspan="6" style="text-align:center;">총 결산 합계 (${list.length}명)</td>
      <td colspan="5" class="num">${grandTotalFee.toLocaleString()}</td>
      <td colspan="5" class="num">0</td>
      <td colspan="5" class="num">0</td>
      <td class="num">${grandTotalFee.toLocaleString()}</td>
      <td class="num" style="color:#c2410c;">${grandCollect.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8;">${grandSub.toLocaleString()}</td>
      <td colspan="3">에듀파인 연계 완료</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="subsidy_admin_office_report_${encodeURIComponent(targetMonth)}.xls"`);
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 6. 나이스용 엑셀 (/af/ad_free2_app/excel_neis)
app.get(/^\\/af\\/ad_free2_app\\/excel_neis/, (req, res) => {
  const { month } = req.query;
  const list = db.getSubsidyApplicants('sch_1');
  const targetMonth = month || '6월';

  let grandFee = 0;
  let grandSub = 0;
  let grandCol = 0;

  const rowsHtml = list.map((a, idx) => {
    const fee = a.totalFee || a.fee || 0;
    const sub = a.subsidizedAmount || 0;
    const col = a.collectedAmount !== undefined ? a.collectedAmount : (a.outOfPocket || 0);
    const isEven = idx % 2 === 1;
    const rowBg = isEven ? '#f8fafc' : '#ffffff';

    grandFee += fee;
    grandSub += sub;
    grandCol += col;

    return `
    <tr style="background-color: ${rowBg};">
      <td style="mso-number-format:'0';">${idx + 1}</td>
      <td>${a.grade}</td>
      <td>${a.classNum}</td>
      <td>${a.studentNum}</td>
      <td style="font-weight:bold; color:#0f172a;">${a.studentName}</td>
      <td>자유수강권</td>
      <td>방과후학교</td>
      <td style="text-align:left; font-weight:500;">${a.courseTitle || ''}</td>
      <td class="num">${fee.toLocaleString()}</td>
      <td class="num" style="font-weight:bold; color:#1d4ed8; background-color:#eff6ff;">${sub.toLocaleString()}</td>
      <td class="num" style="font-weight:bold; color:#c2410c; background-color:#fff7ed;">${col.toLocaleString()}</td>
      <td>${targetMonth}</td>
      <td><span style="font-weight:bold; color:#15803d;">정상등록</span></td>
      <td>-</td>
    </tr>
  `;
  }).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    body { font-family: '맑은 고딕', Arial, sans-serif; font-size: 9.5pt; color: #1e293b; }
    table { border-collapse: collapse; width: 100%; }
    th { background-color: #f1f5f9; border: 1px solid #94a3b8; padding: 8px 6px; font-weight: bold; text-align: center; vertical-align: middle; font-size: 9.5pt; color: #0f172a; }
    td { border: 1px solid #cbd5e1; padding: 6px 6px; vertical-align: middle; text-align: center; font-size: 9pt; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: left; color: #0f172a; padding: 14px 4px 6px 4px; }
    .meta-bar { font-size: 9.5pt; color: #475569; padding: 6px 4px 10px 4px; text-align: left; border: none; }
    .num { text-align: right; mso-number-format: "#,##0"; }
    .total-row td { background-color: #fef3c7; font-weight: bold; color: #92400e; border-top: 2px solid #ca8a04; border-bottom: 2px solid #ca8a04; font-size: 9.5pt; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="14" class="title-cell">나이스(NEIS) 학교행정업무 연계용 방과후 지원금 대상자 명단 (${targetMonth})</td></tr>
    <tr>
      <td colspan="14" class="meta-bar">
        ■ <strong>광주풍향초등학교</strong> | 대상 월: <strong>${targetMonth}</strong> | 출력일시: ${new Date().toLocaleString('ko-KR')} | 나이스 등록 대상: <strong>${list.length}명</strong> | 지원금 총액: <strong>${grandSub.toLocaleString()}원</strong>
      </td>
    </tr>
    <tr>
      <th style="width:40px;">연번</th>
      <th style="width:45px;">학년</th>
      <th style="width:40px;">반</th>
      <th style="width:40px;">번호</th>
      <th style="width:75px;">성명</th>
      <th style="width:85px;">지원영역</th>
      <th style="width:85px;">수강과정</th>
      <th style="width:170px;">강좌명</th>
      <th style="width:80px;">수강비용</th>
      <th style="width:85px; background-color:#dbeafe; color:#1e40af;">지원금액</th>
      <th style="width:85px; background-color:#ffedd5; color:#9a3412;">실징수액</th>
      <th style="width:55px;">해당월</th>
      <th style="width:70px;">처리상태</th>
      <th style="width:60px;">비고</th>
    </tr>
    ${rowsHtml}
    <tr class="total-row">
      <td colspan="8" style="text-align:center;">총 결산 합계 (${list.length}명)</td>
      <td class="num">${grandFee.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8;">${grandSub.toLocaleString()}</td>
      <td class="num" style="color:#c2410c;">${grandCol.toLocaleString()}</td>
      <td>${targetMonth}</td>
      <td>완료</td>
      <td>-</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="subsidy_neis_upload_format.xls"`);
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});
'''

server_path = r'c:\Users\user\My project\course\course_site\course_site\server.js'
with open(server_path, 'r', encoding='utf-8') as f:
    server_code = f.read()

pattern = re.compile(
    r'// ==================== 지원금 수강자관리 \(/af/ad_free2_app\) 엑셀 6종.*?(?=// ==================== 강좌 일괄입력 \(ad_lec/input\) SPA 모달 페이지 라우팅 ====================)',
    re.DOTALL
)

if pattern.search(server_code):
    updated = pattern.sub(excel_routes_code + '\n\n', server_code)
    with open(server_path, 'w', encoding='utf-8') as f:
        f.write(updated)
    print("Successfully updated server.js with unified total rows!")
else:
    print("Pattern not matched!")
