function doGet(e) {
  return ContentService.createTextOutput('Signup/Login handler is running')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // 구글시트 ID와 시트명
    const SPREADSHEET_ID = '여기에_스프레드시트_ID_입력'; // ← 반드시 본인 시트의 ID로 교체!
    const SHEET_NAME = '회원가입';
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

    // 첫 행에 헤더가 없으면 추가
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 7).setValues([[
        '등록일시', '이름', '아이디', '비밀번호', '이메일', '휴대폰번호', '학교명']]);
    }

    // 1. 회원가입 처리
    if (data.type === 'signup') {
      // 중복 아이디 체크
      if (sheet.getLastRow() > 1) {
        const existingUsers = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues();
        for (let i = 0; i < existingUsers.length; i++) {
          if (existingUsers[i][0] === data.userid) {
            return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: '이미 존재하는 아이디입니다.' }))
              .setMimeType(ContentService.MimeType.JSON);
          }
        }
      }
      // 데이터 추가
      const timestamp = new Date().toLocaleString('ko-KR');
      const rowData = [
        timestamp,
        data.name,
        data.userid,
        data.password,
        data.email,
        data.phone,
        data.school
      ];
      sheet.appendRow(rowData);

      return ContentService.createTextOutput(JSON.stringify({ result: 'success', message: '회원가입이 완료되었습니다.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. 로그인 처리 (아이디만 체크)
    if (data.type === 'login') {
      if (sheet.getLastRow() > 1) {
        const existingUsers = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues();
        for (let i = 0; i < existingUsers.length; i++) {
          if (existingUsers[i][0] === data.userid) {
            return ContentService.createTextOutput(JSON.stringify({ result: 'success', message: '로그인 성공' }))
              .setMimeType(ContentService.MimeType.JSON);
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ result: 'fail', message: '존재하지 않는 아이디입니다.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 기타 요청
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: '알 수 없는 요청입니다.' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
} 