import fs from 'fs';
import path from 'path';

const BASE_DIR = path.resolve('course_site/sczigi');

function getHeaderAndSidebar(activeMenu, pageTitle) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle} - 학교관리 - 디비디비스쿨</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Malgun Gothic', '맑은 고딕', 'Noto Sans KR', sans-serif; background-color: #ecf0f5; color: #333; font-size: 13px; min-height: 100vh; display: flex; flex-direction: column; }
    a { color: inherit; text-decoration: none; }
    
    #header { height: 50px; background-color: #3c8dbc; color: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; position: sticky; top: 0; z-index: 1000; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }
    #logo { font-size: 16px; font-weight: bold; }
    .header-service-btn { background: rgba(0,0,0,0.15); border: none; color: #fff; font-size: 13px; font-weight: bold; padding: 6px 12px; border-radius: 3px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; margin-left: 12px; }
    .header-service-btn:hover { background: rgba(0,0,0,0.25); }
    .header-user { font-size: 12px; display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.9); }
    .header-user a { text-decoration: underline; }
    
    .dropdown-menu { display: none; position: absolute; top: 44px; left: 160px; background: #fff; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1100; min-width: 160px; padding: 4px 0; }
    .dropdown-menu a { display: block; padding: 8px 14px; font-size: 12.5px; color: #333; }
    .dropdown-menu a:hover { background: #f0f7fd; color: #3c8dbc; font-weight: bold; }
    
    #container { display: flex; flex: 1; min-height: calc(100vh - 50px); }
    #left_menu { width: 220px; background-color: #222d32; color: #b8c7ce; flex-shrink: 0; }
    .user_box { padding: 14px; background-color: #1e282c; border-bottom: 1px solid #1a2226; display: flex; align-items: center; gap: 10px; }
    .user_avatar { width: 38px; height: 38px; border-radius: 50%; background: #3c8dbc; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 15px; }
    .user_name { font-size: 13px; font-weight: bold; color: #fff; }
    .user_links { font-size: 11px; color: #8aa4af; margin-top: 3px; }
    .user_links a:hover { color: #fff; }
    
    ul.parent { list-style: none; }
    ul.parent > li > a { display: flex; align-items: center; gap: 10px; padding: 12px 16px; color: #b8c7ce; font-weight: bold; border-left: 4px solid transparent; transition: 0.15s; }
    ul.parent > li > a:hover, ul.parent > li > a.on { background-color: #1e282c; color: #fff; border-left-color: #3c8dbc; }
    ul.parent > li > a i { width: 18px; text-align: center; }
    ul.depth { list-style: none; background-color: #2c3b41; }
    ul.depth li a { display: block; padding: 9px 16px 9px 42px; font-size: 12px; color: #8aa4af; }
    ul.depth li a:hover, ul.depth li a.on { color: #fff; background-color: #1e282c; font-weight: bold; }
    
    #contents_box { flex: 1; padding: 20px; max-width: 1400px; }
    #contents_title { font-size: 18px; font-weight: bold; color: #222; margin-bottom: 16px; }
    
    .panel_main { background: #fff; border: 1px solid #dcdcdc; border-radius: 3px; box-shadow: 0 1px 1px rgba(0,0,0,0.05); margin-bottom: 16px; }
    .panel-heading { background: #f5f5f5; padding: 10px 14px; font-size: 14px; font-weight: bold; color: #333; border-bottom: 1px solid #dcdcdc; }
    .panel-search { background: #fafafa; padding: 10px 14px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .panel-body { padding: 12px 14px; }
    
    .help_box { background: #fcf8e3; border: 1px solid #faebcc; color: #8a6d3b; padding: 10px 14px; border-radius: 3px; font-size: 12.5px; line-height: 1.7; margin-bottom: 14px; }
    .help_box ul { list-style: disc; padding-left: 18px; }
    .new_help_manualbox { background: #fff; border: 1px solid #dcdcdc; padding: 10px 14px; border-radius: 3px; font-size: 12.5px; display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
    
    .table-responsive-container { overflow-x: auto; }
    table.db-table { width: 100%; border-collapse: collapse; text-align: center; font-size: 12.5px; }
    table.db-table th { background: #f9f9f9; padding: 9px 8px; border: 1px solid #e5e5e5; color: #555; font-weight: bold; }
    table.db-table td { padding: 9px 8px; border: 1px solid #e5e5e5; color: #333; }
    table.db-table tr:hover td { background-color: #f9fbfd; }
    
    .btn { display: inline-flex; align-items: center; justify-content: center; padding: 5px 12px; font-size: 12px; font-weight: bold; border-radius: 3px; cursor: pointer; border: 1px solid transparent; text-decoration: none; }
    .btn-primary { background: #337ab7; color: #fff; border-color: #2e6da4; }
    .btn-primary:hover { background: #286090; }
    .btn-success { background: #5cb85c; color: #fff; border-color: #4cae4c; }
    .btn-success:hover { background: #449d44; }
    .btn-danger { background: #d9534f; color: #fff; border-color: #d43f3a; }
    .btn-danger:hover { background: #c9302c; }
    .btn-warning { background: #f0ad4e; color: #fff; border-color: #eea236; }
    .btn-warning:hover { background: #ec971f; }
    .btn-default { background: #fff; color: #333; border-color: #ccc; }
    .btn-default:hover { background: #f5f5f5; }
    .form-control { border: 1px solid #ccc; border-radius: 3px; padding: 5px 8px; font-size: 12.5px; outline: none; background: #fff; }
    
    #footer { background: #fff; border-top: 1px solid #d2d6de; padding: 14px; text-align: center; font-size: 12px; color: #666; margin-top: auto; }
  </style>
</head>
<body>
  <div id="header">
    <div style="display:flex; align-items:center;">
      <span id="logo">광주풍향초등학교</span>
      <div style="position:relative;">
        <button class="header-service-btn" onclick="toggleServiceDropdown()">학교관리 <i class="fa fa-caret-down"></i></button>
        <div class="dropdown-menu" id="serviceDropdown">
          <a href="/af/ad_lec/lists/sn/3267"><i class="fa fa-chart-line"></i> 늘봄학교 관리</a>
          <a href="/sczigi/service/lists/sn/3267" style="font-weight:bold; color:#3c8dbc;"><i class="fa fa-school"></i> 학교관리 (현재)</a>
        </div>
      </div>
    </div>
    <div class="header-user">
      <span>관리자(김혜련)님</span>
      <span>|</span>
      <a href="/member/logout/sn/3267">로그아웃</a>
    </div>
  </div>

  <div id="container">
    <div id="left_menu">
      <div class="user_box">
        <div class="user_avatar">김</div>
        <div>
          <div class="user_name">관리자(김혜련)님</div>
          <div class="user_links">
            <a href="/member/logout/sn/3267">로그아웃</a> • <a href="/sczigi/teacher/lists/sn/3267">정보수정</a>
          </div>
        </div>
      </div>

      <ul class="parent">
        <li><a href="/af/ad_lec/lists/sn/3267"><i class="fa fa-tachometer-alt"></i> <span>늘봄학교 보기</span></a></li>
        <li><a href="/sczigi/service/lists/sn/3267" class="${activeMenu === 'service_lists' ? 'on' : ''}"><i class="fa fa-sitemap"></i> <span>서비스목록</span></a></li>
        
        <li>
          <a href="/sczigi/teacher/lists/sn/3267" class="${activeMenu.startsWith('teacher') ? 'on' : ''}"><i class="fa fa-user-tie"></i> <span>교직원관리</span></a>
          <ul class="depth">
            <li><a href="/sczigi/teacher/lists/sn/3267" class="${activeMenu === 'teacher_lists' ? 'on' : ''}">교직원관리</a></li>
            <li><a href="/sczigi/teacher/field/sn/3267" class="${activeMenu === 'teacher_field' ? 'on' : ''}">회원필드설정</a></li>
            <li><a href="/sczigi/teacher/level/sn/3267" class="${activeMenu === 'teacher_level' ? 'on' : ''}">직위명설정</a></li>
            <li><a href="/sczigi/teacher/clear/sn/3267" class="${activeMenu === 'teacher_clear' ? 'on' : ''}">초기화</a></li>
          </ul>
        </li>

        <li>
          <a href="/sczigi/student/lists/sn/3267" class="${activeMenu.startsWith('student') ? 'on' : ''}"><i class="fa fa-user-graduate"></i> <span>학생관리</span></a>
          <ul class="depth">
            <li><a href="/sczigi/student/lists/sn/3267" class="${activeMenu === 'student_lists' ? 'on' : ''}">학생관리</a></li>
            <li><a href="/sczigi/student/main/sn/3267" class="${activeMenu === 'student_main' ? 'on' : ''}">기본설정</a></li>
            <li><a href="/sczigi/student/field/sn/3267" class="${activeMenu === 'student_field' ? 'on' : ''}">회원필드설정</a></li>
            <li><a href="/sczigi/student/course/sn/3267" class="${activeMenu === 'student_course' ? 'on' : ''}">학과설정</a></li>
            <li><a href="/sczigi/student/clear/sn/3267" class="${activeMenu === 'student_clear' ? 'on' : ''}">초기화</a></li>
          </ul>
        </li>

        <li>
          <a href="/sczigi/sms_tel/lists/sn/3267" class="${activeMenu.startsWith('sms') ? 'on' : ''}"><i class="fa fa-comment-dots"></i> <span>문자관리</span></a>
          <ul class="depth">
            <li><a href="/sczigi/sms_tel/lists/sn/3267" class="${activeMenu === 'sms_tel' ? 'on' : ''}">발신번호관리</a></li>
            <li><a href="/sczigi/sms_sin/lists/sn/3267" class="${activeMenu === 'sms_sin' ? 'on' : ''}">충전신청</a></li>
            <li><a href="/sczigi/sms_charge/lists/sn/3267" class="${activeMenu === 'sms_charge' ? 'on' : ''}">충전내역</a></li>
            <li><a href="/sczigi/sms_report/lists/sn/3267" class="${activeMenu === 'sms_report' ? 'on' : ''}">발송통계</a></li>
          </ul>
        </li>

        <li><a href="/sczigi/auth/main/sn/3267" class="${activeMenu === 'auth_main' ? 'on' : ''}"><i class="fa fa-cog"></i> <span>권한설정</span></a></li>
        <li><a href="/sczigi/privacy_log/main/sn/3267" class="${activeMenu === 'privacy_log' ? 'on' : ''}"><i class="fa fa-database"></i> <span>서비스접근로그</span></a></li>
      </ul>
    </div>

    <div id="contents_box">
      <div id="contents_title">${pageTitle}</div>
`;
}

function getFooter() {
  return `
    </div>
  </div>

  <div id="footer">
    Copyright ⓒ <a href="http://www.xmecca.com" target="_blank" style="color:#3c8dbc; font-weight:bold;">xmecca.com</a> All Rights Reserved.
    <br><i class="fa fa-envelope"></i> dbdbschool@naver.com
  </div>

  <script>
    function toggleServiceDropdown() {
      const el = document.getElementById('serviceDropdown');
      el.style.display = el.style.display === 'block' ? 'none' : 'block';
    }
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.header-service-btn') && !e.target.closest('#serviceDropdown')) {
        const el = document.getElementById('serviceDropdown');
        if (el) el.style.display = 'none';
      }
    });
  </script>
</body>
</html>`;
}

function writePage(relPath, content) {
  const fullPath = path.join(BASE_DIR, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Created: sczigi/${relPath}`);
}

// 1. Service Lists
writePage('service/lists/sn/3267/index.html', getHeaderAndSidebar('service_lists', '서비스목록') + `
  <div class="panel_main">
    <div class="panel-heading">목록</div>
    <div class="panel-body">
      <div class="help_box">
        <ul>
          <li>QR코드 다운로드 : QR코드 위에서 오른쪽 마우스 클릭 후 <strong style="color:#c9302c;">"이미지를 다른 이름으로 저장"</strong> 또는 <strong style="color:#c9302c;">"다른 이름으로 사진 저장"</strong> 클릭)</li>
        </ul>
      </div>
    </div>
    <div class="table-responsive-container">
      <table class="db-table">
        <thead>
          <tr>
            <th style="width:180px;">서비스명</th>
            <th style="text-align:left; padding-left:16px;">서비스 URL</th>
            <th style="width:240px;">이용기간</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight:bold; color:#337ab7;">늘봄학교</td>
            <td style="text-align:left; padding:14px 16px;">
              <div style="display:flex; align-items:flex-start; gap:16px;">
                <div style="border:1px solid #ddd; padding:4px; background:#fff; cursor:pointer;" onclick="alert('우클릭 후 사진 저장을 클릭하세요.')">
                  <svg width="140" height="140" viewBox="0 0 170 170" xmlns="http://www.w3.org/2000/svg">
                    <rect width="170" height="170" fill="white"/>
                    <rect x="10" y="10" width="45" height="45" fill="black"/><rect x="16" y="16" width="33" height="33" fill="white"/><rect x="22" y="22" width="21" height="21" fill="black"/>
                    <rect x="115" y="10" width="45" height="45" fill="black"/><rect x="121" y="16" width="33" height="33" fill="white"/><rect x="127" y="22" width="21" height="21" fill="black"/>
                    <rect x="10" y="115" width="45" height="45" fill="black"/><rect x="16" y="121" width="33" height="33" fill="white"/><rect x="22" y="127" width="21" height="21" fill="black"/>
                    <rect x="65" y="10" width="8" height="8" fill="black"/><rect x="80" y="10" width="8" height="8" fill="black"/><rect x="95" y="10" width="8" height="8" fill="black"/>
                    <rect x="65" y="25" width="8" height="8" fill="black"/><rect x="95" y="25" width="8" height="8" fill="black"/>
                    <rect x="65" y="40" width="8" height="8" fill="black"/><rect x="80" y="40" width="8" height="8" fill="black"/><rect x="95" y="40" width="8" height="8" fill="black"/>
                    <rect x="10" y="65" width="8" height="8" fill="black"/><rect x="25" y="65" width="8" height="8" fill="black"/><rect x="40" y="65" width="8" height="8" fill="black"/>
                    <rect x="65" y="65" width="8" height="8" fill="black"/><rect x="80" y="65" width="8" height="8" fill="black"/><rect x="95" y="65" width="8" height="8" fill="black"/><rect x="110" y="65" width="8" height="8" fill="black"/><rect x="125" y="65" width="8" height="8" fill="black"/>
                  </svg>
                  <div style="font-size:10px; color:#777; text-align:center; margin-top:2px;">우클릭→저장</div>
                </div>
                <div>
                  <a href="https://www.dbdbschool.kr/go/ai/0hc5dFL" target="_blank" style="color:#337ab7; font-weight:bold; font-size:13px; font-family:monospace; text-decoration:underline;">https://www.dbdbschool.kr/go/ai/0hc5dFL</a>
                  <div style="margin-top:10px; display:flex; gap:6px;">
                    <button class="btn btn-default" onclick="navigator.clipboard.writeText('https://www.dbdbschool.kr/go/ai/0hc5dFL'); alert('URL이 복사되었습니다.');">📋 URL 복사</button>
                    <a href="/sczigi/service/edit/sn/3267" class="btn btn-primary">⚙ 서비스 설정</a>
                  </div>
                </div>
              </div>
            </td>
            <td style="font-weight:bold; color:#555;">2025-05-09 ~ 2027-02-28</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="help_box">
    <ul>
      <li>현재 이용 중인 서비스 목록입니다.</li>
      <li>서비스 관리자는 해당 서비스 이동 후 "환경설정" 메뉴에서 지정할 수 있습니다.</li>
    </ul>
  </div>
` + getFooter());

// 2. Teacher Lists
writePage('teacher/lists/sn/3267/index.html', getHeaderAndSidebar('teacher_lists', '교직원관리') + `
  <div class="new_help_manualbox">
    <span style="color:#3c8dbc; font-weight:bold;"><i class="fa fa-file-alt"></i> 매뉴얼</span>
    <span style="color:#ccc;">|</span>
    <a href="https://s3-ap-northeast-2.amazonaws.com/www.dbdbschool.kr/doc/faq/common/학교관리_교직원등록.hwp" target="_blank" style="color:#337ab7; font-weight:bold; text-decoration:underline;">교직원 등록 매뉴얼 다운로드 (.hwp)</a>
  </div>
  <div class="panel_main">
    <div class="panel-heading">목록</div>
    <div class="panel-search">
      <select class="form-control" id="teaSct"><option value="">=전체=</option><option value="1">담임</option></select>
      <select class="form-control" id="teaSt"><option value="name">이름</option><option value="userId">아이디</option></select>
      <input type="text" class="form-control" id="teaKw" placeholder="검색어 입력" style="width:200px;">
      <button class="btn btn-default" onclick="alert('검색 실행')">검색</button>
      <button class="btn btn-default" onclick="location.reload()">전체</button>
    </div>
    <div style="padding:10px 14px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee;">
      <div>총 <strong style="color:#337ab7;">3</strong>명 등록됨</div>
      <div style="display:flex; gap:6px;">
        <a href="/sczigi/teacher/write/sn/3267" class="btn btn-danger">교직원 등록</a>
        <a href="/sczigi/teacher/input/sn/3267" class="btn btn-primary">교직원 일괄입력</a>
        <button class="btn btn-success" onclick="alert('검색결과가 엑셀로 다운로드됩니다.')">검색결과엑셀출력</button>
      </div>
    </div>
    <div class="table-responsive-container">
      <table class="db-table">
        <thead>
          <tr>
            <th style="width:45px;"><input type="checkbox"></th>
            <th style="width:50px;">연번</th>
            <th style="width:55px;">수정</th>
            <th style="width:100px;">아이디</th>
            <th style="width:100px;">이름</th>
            <th style="width:130px;">휴대폰<br>(비고)</th>
            <th style="width:80px;">담임</th>
            <th style="width:110px;">직명</th>
            <th style="width:140px;">마지막<br>로그인</th>
            <th style="width:60px;">임시<br>비번</th>
            <th style="width:60px;">본인<br>인증</th>
            <th style="width:60px;">2단계<br>인증</th>
            <th style="width:90px;">약관동의</th>
            <th style="width:80px;">상태</th>
            <th style="width:55px;">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="checkbox"></td>
            <td>3</td>
            <td><button class="btn btn-default" style="padding:2px 6px;" onclick="alert('수정 모달')">⚙️</button></td>
            <td style="font-weight:bold; color:#337ab7;">김혜련</td>
            <td style="font-weight:bold;">김혜련</td>
            <td></td>
            <td>-</td>
            <td>늘봄실무사</td>
            <td>-</td>
            <td style="color:#d9534f; font-weight:bold;">Y</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td><span class="btn btn-default" style="padding:2px 8px; font-size:11px; color:#3c763d; background:#dff0d8;">사용</span></td>
            <td><button class="btn btn-danger" style="padding:2px 6px;" onclick="confirm('삭제하시겠습니까?')">🗑️</button></td>
          </tr>
          <tr>
            <td><input type="checkbox"></td>
            <td>2</td>
            <td><button class="btn btn-default" style="padding:2px 6px;" onclick="alert('수정 모달')">⚙️</button></td>
            <td style="font-weight:bold; color:#337ab7;">박진수</td>
            <td style="font-weight:bold;">박진수</td>
            <td></td>
            <td>-</td>
            <td>늘봄지원실장</td>
            <td>2025-09-11 14:29:19</td>
            <td>N</td>
            <td>Y</td>
            <td>Y</td>
            <td>2025-05-09</td>
            <td><span class="btn btn-default" style="padding:2px 8px; font-size:11px; color:#3c763d; background:#dff0d8;">사용</span></td>
            <td><button class="btn btn-danger" style="padding:2px 6px;" onclick="confirm('삭제하시겠습니까?')">🗑️</button></td>
          </tr>
          <tr>
            <td><input type="checkbox"></td>
            <td>1</td>
            <td><button class="btn btn-default" style="padding:2px 6px;" onclick="alert('수정 모달')">⚙️</button></td>
            <td style="font-weight:bold; color:#337ab7;">풍향초</td>
            <td style="font-weight:bold;">풍향초</td>
            <td>062-609-1182</td>
            <td>1학년 1반</td>
            <td>교직원</td>
            <td>2026-04-24 11:40:16</td>
            <td>N</td>
            <td>N</td>
            <td>N</td>
            <td>2025-05-09</td>
            <td><span class="btn btn-default" style="padding:2px 8px; font-size:11px; color:#3c763d; background:#dff0d8;">사용</span></td>
            <td><button class="btn btn-danger" style="padding:2px 6px;" onclick="confirm('삭제하시겠습니까?')">🗑️</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div style="padding:10px 14px; background:#f5f5f5; border-top:1px solid #e5e5e5; display:flex; gap:6px;">
      <button class="btn btn-warning" onclick="alert('임시비밀번호가 설정되었습니다.')">선택항목 임시비밀번호 설정</button>
      <button class="btn btn-default" onclick="alert('본인인증이 초기화되었습니다.')">본인인증 초기화</button>
      <button class="btn btn-danger" onclick="confirm('선택한 항목을 삭제하시겠습니까?')">선택항목 삭제</button>
    </div>
  </div>
` + getFooter());

// 3. Student Lists
writePage('student/lists/sn/3267/index.html', getHeaderAndSidebar('student_lists', '학생관리') + `
  <div class="new_help_manualbox">
    <span style="color:#3c8dbc; font-weight:bold;"><i class="fa fa-file-alt"></i> 매뉴얼</span>
    <span style="color:#ccc;">|</span>
    <a href="https://www.youtube.com/results?search_query=dbdbschool+student+registration" target="_blank" style="color:#337ab7; font-weight:bold;">▶ 학생등록 동영상 가이드</a>
    <span style="color:#ccc;">|</span>
    <a href="https://www.youtube.com/results?search_query=dbdbschool+password+reset" target="_blank" style="color:#337ab7; font-weight:bold;">▶ 비밀번호 초기화 가이드</a>
  </div>
  <div class="panel_main">
    <div class="panel-heading">목록</div>
    <div class="panel-search">
      <select class="form-control"><option value="">=학년=</option><option value="1">1학년</option><option value="2">2학년</option><option value="3">3학년</option><option value="4">4학년</option><option value="5">5학년</option><option value="6">6학년</option></select>
      <select class="form-control"><option value="">=반=</option><option value="1">1반</option><option value="2">2반</option><option value="3">3반</option></select>
      <input type="text" class="form-control" placeholder="학생 이름 검색" style="width:160px;">
      <button class="btn btn-default" onclick="alert('검색 실행')">검색</button>
      <button class="btn btn-default" onclick="location.reload()">전체</button>
    </div>
    <div style="padding:10px 14px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee;">
      <div>총 <strong style="color:#337ab7;">317</strong>명 학생</div>
      <div style="display:flex; gap:6px;">
        <button class="btn btn-danger" onclick="alert('학생등록 모달')">학생등록</button>
        <a href="/sczigi/student/input/sn/3267" class="btn btn-primary">학생 일괄입력</a>
        <a href="/sczigi/student/up/sn/3267" class="btn btn-danger">진급처리(학적변경)</a>
        <button class="btn btn-success" onclick="alert('검색 결과가 엑셀로 다운로드됩니다.')">검색결과엑셀출력</button>
      </div>
    </div>
    <div class="table-responsive-container">
      <table class="db-table">
        <thead>
          <tr>
            <th style="width:45px;"><input type="checkbox"></th>
            <th style="width:50px;">연번</th>
            <th style="width:55px;">수정</th>
            <th style="width:55px;">학년 ↑</th>
            <th style="width:50px;">반</th>
            <th style="width:50px;">번호</th>
            <th style="width:100px;">이름</th>
            <th style="width:50px;">성별</th>
            <th style="width:130px;">연락처<br>(비고)</th>
            <th style="width:120px;">이전 학적</th>
            <th style="width:100px;">마지막<br>수정</th>
            <th style="width:140px;">마지막<br>로그인</th>
            <th style="width:60px;">임시<br>비번</th>
            <th style="width:90px;">약관동의</th>
            <th style="width:70px;">상태</th>
            <th style="width:55px;">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="checkbox"></td>
            <td>317</td>
            <td><button class="btn btn-default" style="padding:2px 6px;" onclick="alert('수정')">⚙️</button></td>
            <td style="font-weight:bold;">1</td>
            <td>1</td>
            <td>1</td>
            <td style="font-weight:bold; color:#337ab7;">강민준</td>
            <td>남</td>
            <td>010-3456-1101</td>
            <td>신입학</td>
            <td>2026-03-02</td>
            <td>2026-08-16 14:10:20</td>
            <td>N</td>
            <td>2026-03-02</td>
            <td><span class="btn btn-default" style="padding:2px 8px; font-size:11px; color:#3c763d; background:#dff0d8;">사용</span></td>
            <td><button class="btn btn-danger" style="padding:2px 6px;" onclick="confirm('삭제?')">🗑️</button></td>
          </tr>
          <tr>
            <td><input type="checkbox"></td>
            <td>316</td>
            <td><button class="btn btn-default" style="padding:2px 6px;" onclick="alert('수정')">⚙️</button></td>
            <td style="font-weight:bold;">1</td>
            <td>1</td>
            <td>2</td>
            <td style="font-weight:bold; color:#337ab7;">김도현</td>
            <td>남</td>
            <td>010-3456-1102</td>
            <td>신입학</td>
            <td>2026-03-02</td>
            <td>2026-08-15 11:25:30</td>
            <td>N</td>
            <td>2026-03-02</td>
            <td><span class="btn btn-default" style="padding:2px 8px; font-size:11px; color:#3c763d; background:#dff0d8;">사용</span></td>
            <td><button class="btn btn-danger" style="padding:2px 6px;" onclick="confirm('삭제?')">🗑️</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
` + getFooter());

// 4. SMS Tel Lists
writePage('sms_tel/lists/sn/3267/index.html', getHeaderAndSidebar('sms_tel', '문자관리 > 발신번호관리') + `
  <div class="panel_main">
    <div class="panel-heading">목록</div>
    <div style="padding:10px 14px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee;">
      <a href="/sczigi/sms_tel/help/sn/3267" class="btn btn-success">발신번호등록</a>
      <div style="display:flex; gap:6px;">
        <select class="form-control"><option value="all">=처리상태=</option><option value="접수">접수</option><option value="심사중">심사중</option><option value="승인완료">승인완료</option></select>
        <input type="text" class="form-control" placeholder="발신번호" style="width:140px;">
        <button class="btn btn-primary">검색</button>
        <button class="btn btn-default" onclick="location.reload()">전체</button>
      </div>
    </div>
    <div class="table-responsive-container">
      <table class="db-table">
        <thead>
          <tr>
            <th style="width:60px;">연번</th>
            <th style="width:50px;">수정</th>
            <th style="width:140px;">발신번호</th>
            <th style="width:150px;">발신번호명의</th>
            <th style="width:140px;">인증방식</th>
            <th>발신번호 구분(비고)</th>
            <th style="width:90px;">처리상태</th>
            <th style="width:110px;">승인일자</th>
            <th style="width:60px;">취소</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td><button class="btn btn-default" style="padding:2px 6px;" onclick="alert('수정 불가')">⚙️</button></td>
            <td style="font-weight:bold; color:#337ab7;">062-609-1182</td>
            <td style="font-weight:bold;">광주풍향초등학교</td>
            <td>통신서비스이용증명원</td>
            <td style="text-align:left;">대표번호 (학교 행정실)</td>
            <td><span class="btn btn-default" style="padding:2px 8px; font-size:11px; color:#3c763d; background:#dff0d8;">승인완료</span></td>
            <td>2025-05-10</td>
            <td><button class="btn btn-danger" style="padding:2px 6px;" onclick="confirm('취소?')">✕</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="help_box">
    <ul>
      <li><strong style="color:#c9302c;">등록</strong>은 <strong style="color:#c9302c;">최대 4개</strong> 까지만 가능합니다.</li>
      <li><strong style="color:#c9302c;">수정</strong>은 접수 상태에서만 가능합니다.</li>
      <li><strong style="color:#c9302c;">승인</strong>된 발신번호만 사용할 수 있습니다.</li>
      <li><strong style="color:#c9302c;">반려</strong>된 발신번호는 <strong style="color:#c9302c;">30일 이후 자동으로 삭제</strong>됩니다.</li>
    </ul>
  </div>
` + getFooter());

console.log('🎉 Full static pages generated successfully!');
