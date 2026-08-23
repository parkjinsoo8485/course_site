const fs = require('fs');
const path = require('path');

const SCHOOL_SN = '3267';
const SCHOOL_NAME = '광주풍향초등학교';
const ADMIN_NAME = '관리자(김혜련)님';

function getHeader(activeService = '학교관리') {
  return `
  <!-- Top Global Header -->
  <div id="header">
    <div style="display:flex; align-items:center;">
      <span id="logo">${SCHOOL_NAME}</span>
      <div style="position:relative;">
        <button class="header-service-btn" onclick="toggleServiceDropdown()">${activeService} <i class="fa fa-caret-down"></i></button>
        <div class="dropdown-menu" id="serviceDropdown">
          <div style="padding: 6px 12px; font-size:11px; font-weight:bold; color:#777; border-bottom:1px solid #eee;">서비스 전환</div>
          <a href="/af/ad_faq/main/sn/${SCHOOL_SN}"><i class="fa fa-chart-line" style="color:#337ab7; margin-right:6px;"></i> 늘봄학교</a>
          <a href="/sczigi/service/lists/sn/${SCHOOL_SN}" style="font-weight:bold; color:#3c8dbc; background:#f0f7fd;"><i class="fa fa-school" style="color:#3c8dbc; margin-right:6px;"></i> 학교관리 (현재)</a>
        </div>
      </div>
    </div>
    <div class="header-user">
      <span>${ADMIN_NAME}</span>
      <span>|</span>
      <a href="javascript:void(0);" onclick="handleUserLogout(event)">로그아웃</a>
    </div>
  </div>`;
}

function getSidebar(activeKey) {
  const isTeacherGroup = ['teacher_lists', 'teacher_field', 'teacher_level', 'teacher_clear'].includes(activeKey);
  const isStudentGroup = ['student_lists', 'student_main', 'student_field', 'student_course', 'student_clear'].includes(activeKey);
  const isSmsGroup = ['sms_tel', 'sms_sin', 'sms_charge', 'sms_report'].includes(activeKey);

  return `
    <div id="left_menu">
      <div class="user_box">
        <div class="user_avatar">김</div>
        <div>
          <div class="user_name">${ADMIN_NAME}</div>
          <div class="user_links">
            <a href="javascript:void(0);" onclick="handleUserLogout(event)">로그아웃</a> • <a href="javascript:void(0);" onclick="openAdminInfoModal()">정보수정</a>
          </div>
        </div>
      </div>

      <ul class="parent">
        <li><a href="/af/ad_faq/main/sn/${SCHOOL_SN}"><i class="fa fa-tachometer-alt"></i> <span>늘봄학교 보기</span></a></li>
        <li><a href="/sczigi/service/lists/sn/${SCHOOL_SN}" class="${activeKey === 'service_lists' ? 'on' : ''}"><i class="fa fa-sitemap"></i> <span>서비스목록</span></a></li>
        
        <li class="${isTeacherGroup ? 'active-group' : ''}">
          <a href="/sczigi/teacher/lists/sn/${SCHOOL_SN}" class="${isTeacherGroup ? 'on' : ''}"><i class="fa fa-user-tie"></i> <span>교직원관리</span></a>
          <ul class="depth" style="${isTeacherGroup ? 'display:block;' : ''}">
            <li><a href="/sczigi/teacher/lists/sn/${SCHOOL_SN}" class="${activeKey === 'teacher_lists' ? 'on' : ''}">교직원관리</a></li>
            <li><a href="/sczigi/teacher/field/sn/${SCHOOL_SN}" class="${activeKey === 'teacher_field' ? 'on' : ''}">회원필드설정</a></li>
            <li><a href="/sczigi/teacher/level/sn/${SCHOOL_SN}" class="${activeKey === 'teacher_level' ? 'on' : ''}">직위명설정</a></li>
            <li><a href="/sczigi/teacher/clear/sn/${SCHOOL_SN}" class="${activeKey === 'teacher_clear' ? 'on' : ''}">초기화</a></li>
          </ul>
        </li>

        <li class="${isStudentGroup ? 'active-group' : ''}">
          <a href="/sczigi/student/lists/sn/${SCHOOL_SN}" class="${isStudentGroup ? 'on' : ''}"><i class="fa fa-user-graduate"></i> <span>학생관리</span></a>
          <ul class="depth" style="${isStudentGroup ? 'display:block;' : ''}">
            <li><a href="/sczigi/student/lists/sn/${SCHOOL_SN}" class="${activeKey === 'student_lists' ? 'on' : ''}">학생관리</a></li>
            <li><a href="/sczigi/student/main/sn/${SCHOOL_SN}" class="${activeKey === 'student_main' ? 'on' : ''}">기본설정</a></li>
            <li><a href="/sczigi/student/field/sn/${SCHOOL_SN}" class="${activeKey === 'student_field' ? 'on' : ''}">회원필드설정</a></li>
            <li><a href="/sczigi/student/course/sn/${SCHOOL_SN}" class="${activeKey === 'student_course' ? 'on' : ''}">학과설정</a></li>
            <li><a href="/sczigi/student/clear/sn/${SCHOOL_SN}" class="${activeKey === 'student_clear' ? 'on' : ''}">초기화</a></li>
          </ul>
        </li>

        <li class="${isSmsGroup ? 'active-group' : ''}">
          <a href="/sczigi/sms_tel/lists/sn/${SCHOOL_SN}" class="${isSmsGroup ? 'on' : ''}"><i class="fa fa-sms"></i> <span>문자관리</span></a>
          <ul class="depth" style="${isSmsGroup ? 'display:block;' : ''}">
            <li><a href="/sczigi/sms_tel/lists/sn/${SCHOOL_SN}" class="${activeKey === 'sms_tel' ? 'on' : ''}">발신번호관리</a></li>
            <li><a href="/sczigi/sms_sin/lists/sn/${SCHOOL_SN}" class="${activeKey === 'sms_sin' ? 'on' : ''}">충전신청</a></li>
            <li><a href="/sczigi/sms_charge/lists/sn/${SCHOOL_SN}" class="${activeKey === 'sms_charge' ? 'on' : ''}">충전내역</a></li>
            <li><a href="/sczigi/sms_report/lists/sn/${SCHOOL_SN}" class="${activeKey === 'sms_report' ? 'on' : ''}">발송통계</a></li>
          </ul>
        </li>

        <li><a href="/sczigi/auth/main/sn/${SCHOOL_SN}" class="${activeKey === 'auth_main' ? 'on' : ''}"><i class="fa fa-cog"></i> <span>권한설정</span></a></li>
        <li><a href="/sczigi/privacy_log/main/sn/${SCHOOL_SN}" class="${activeKey === 'privacy_log' ? 'on' : ''}"><i class="fa fa-database"></i> <span>서비스접근로그</span></a></li>
      </ul>
    </div>`;
}

function getBaseStyles() {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Malgun Gothic', '맑은 고딕', 'Noto Sans KR', sans-serif; background-color: #ecf0f5; color: #333; font-size: 13px; min-height: 100vh; display: flex; flex-direction: column; }
    a { color: inherit; text-decoration: none; }
    
    #header { height: 50px; background-color: #3c8dbc; color: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; position: sticky; top: 0; z-index: 1000; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }
    #logo { font-size: 16px; font-weight: bold; }
    .header-service-btn { background: rgba(0,0,0,0.15); border: none; color: #fff; font-size: 13px; font-weight: bold; padding: 6px 12px; border-radius: 3px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; margin-left: 12px; }
    .header-service-btn:hover { background: rgba(0,0,0,0.25); }
    .header-user { font-size: 12px; display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.9); }
    .header-user a { text-decoration: underline; cursor: pointer; }
    
    .dropdown-menu { display: none; position: absolute; top: 44px; left: 160px; background: #fff; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1100; min-width: 170px; padding: 4px 0; }
    .dropdown-menu a { display: block; padding: 8px 14px; font-size: 12.5px; color: #333; }
    .dropdown-menu a:hover { background: #f0f7fd; color: #3c8dbc; font-weight: bold; }
    
    #container { display: flex; flex: 1; min-height: calc(100vh - 50px); }
    #left_menu { width: 220px; background-color: #222d32; color: #b8c7ce; flex-shrink: 0; }
    .user_box { padding: 14px; background-color: #1e282c; border-bottom: 1px solid #1a2226; display: flex; align-items: center; gap: 10px; }
    .user_avatar { width: 38px; height: 38px; border-radius: 50%; background: #3c8dbc; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 15px; }
    .user_name { font-size: 13px; font-weight: bold; color: #fff; }
    .user_links { font-size: 11px; color: #8aa4af; margin-top: 3px; }
    .user_links a { cursor: pointer; }
    .user_links a:hover { color: #fff; text-decoration: underline; }
    
    ul.parent { list-style: none; }
    ul.parent > li > a { display: flex; align-items: center; gap: 10px; padding: 12px 16px; color: #b8c7ce; font-weight: bold; border-left: 4px solid transparent; transition: 0.15s; }
    ul.parent > li > a:hover, ul.parent > li > a.on { background-color: #1e282c; color: #fff; border-left-color: #3c8dbc; }
    ul.parent > li > a i { width: 18px; text-align: center; }
    ul.depth { list-style: none; background-color: #2c3b41; }
    ul.depth li a { display: block; padding: 9px 16px 9px 42px; font-size: 12px; color: #8aa4af; }
    ul.depth li a:hover, ul.depth li a.on { color: #fff; background-color: #1e282c; font-weight: bold; }
    
    #contents_box { flex: 1; padding: 20px; max-width: 1400px; }
    #contents_title { font-size: 18px; font-weight: bold; color: #222; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    
    .panel_main { background: #fff; border: 1px solid #dcdcdc; border-radius: 3px; box-shadow: 0 1px 1px rgba(0,0,0,0.05); margin-bottom: 16px; }
    .panel-heading { background: #f5f5f5; padding: 10px 14px; font-size: 14px; font-weight: bold; color: #333; border-bottom: 1px solid #dcdcdc; display: flex; justify-content: space-between; align-items: center; }
    .panel-search { background: #fafafa; padding: 10px 14px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
    .panel-body { padding: 14px; }
    
    .help_box { background: #fcf8e3; border: 1px solid #faebcc; color: #8a6d3b; padding: 10px 14px; border-radius: 3px; font-size: 12.5px; line-height: 1.7; margin-bottom: 14px; }
    .help_box ul { list-style: disc; padding-left: 18px; }
    
    .table-responsive-container { overflow-x: auto; }
    table.db-table { width: 100%; border-collapse: collapse; text-align: center; font-size: 12.5px; }
    table.db-table th { background: #f9f9f9; padding: 9px 8px; border: 1px solid #e5e5e5; color: #555; font-weight: bold; }
    table.db-table td { padding: 9px 8px; border: 1px solid #e5e5e5; color: #333; }
    table.db-table tr:hover td { background-color: #f9fbfd; }
    
    .btn { display: inline-flex; align-items: center; justify-content: center; padding: 5px 12px; font-size: 12px; font-weight: bold; border-radius: 3px; cursor: pointer; border: 1px solid transparent; text-decoration: none; gap: 4px; }
    .btn-primary { background: #337ab7; color: #fff; border-color: #2e6da4; }
    .btn-primary:hover { background: #286090; }
    .btn-success { background: #5cb85c; color: #fff; border-color: #4cae4c; }
    .btn-success:hover { background: #449d44; }
    .btn-danger { background: #d9534f; color: #fff; border-color: #d43f3a; }
    .btn-danger:hover { background: #c9302c; }
    .btn-warning { background: #f0ad4e; color: #fff; border-color: #eea236; }
    .btn-warning:hover { background: #ec971f; }
    .btn-default { background: #fff; color: #333; border-color: #ccc; }
    .btn-default:hover { background: #e6e6e6; }
    .btn-info { background: #5bc0de; color: #fff; border-color: #46b8da; }
    
    .form-control { border: 1px solid #ccc; border-radius: 3px; padding: 5px 8px; font-size: 12.5px; outline: none; background: #fff; }
    
    /* Modal Styles */
    .modal-backdrop { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2000; justify-content: center; align-items: center; padding: 20px; }
    .modal-box { background: #fff; border-radius: 4px; width: 100%; max-width: 600px; box-shadow: 0 4px 16px rgba(0,0,0,0.2); overflow: hidden; }
    .modal-header { background: #3c8dbc; color: #fff; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
    .modal-body { padding: 18px; max-height: 80vh; overflow-y: auto; }
    .modal-footer { padding: 10px 16px; background: #f9f9f9; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 8px; }
    
    #footer { background: #fff; border-top: 1px solid #d2d6de; padding: 14px; text-align: center; font-size: 12px; color: #666; margin-top: auto; }
  `;
}

function getFooter() {
  return `
  <div id="footer">
    Copyright ⓒ <a href="http://www.xmecca.com" target="_blank" style="color:#3c8dbc; font-weight:bold;">xmecca.com</a> All Rights Reserved.
    <br><i class="fa fa-envelope"></i> dbdbschool@naver.com
  </div>

  <!-- Modal: 관리자 정보수정 -->
  <div class="modal-backdrop" id="adminInfoModal">
    <div class="modal-box" style="max-width: 460px;">
      <div class="modal-header">
        <span><i class="fa fa-user-cog"></i> 관리자(김혜련) 정보수정</span>
        <button type="button" style="background:none; border:none; color:#fff; font-size:18px; cursor:pointer;" onclick="closeAdminInfoModal()">&times;</button>
      </div>
      <form onsubmit="handleAdminInfoSave(event)">
        <div class="modal-body" style="padding:16px;">
          <table style="width:100%; font-size:12.5px; border-collapse:collapse;">
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:8px; font-weight:bold; background:#f9f9f9; width:110px;">관리자 ID</td>
              <td style="padding:8px;"><input type="text" id="adminInfoId" value="admin_hyeryeon" readonly class="form-control" style="background:#eee; width:100%;"></td>
            </tr>
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:8px; font-weight:bold; background:#f9f9f9;">관리자 성명</td>
              <td style="padding:8px;"><input type="text" id="adminInfoName" value="김혜련" required class="form-control" style="width:100%;"></td>
            </tr>
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:8px; font-weight:bold; background:#f9f9f9;">휴대폰 번호</td>
              <td style="padding:8px;"><input type="text" id="adminInfoPhone" value="010-3267-8899" required class="form-control" style="width:100%;"></td>
            </tr>
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:8px; font-weight:bold; background:#f9f9f9;">이메일</td>
              <td style="padding:8px;"><input type="email" id="adminInfoEmail" value="hyeryeon@gwangju-es.kr" required class="form-control" style="width:100%;"></td>
            </tr>
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:8px; font-weight:bold; background:#f9f9f9;">새 비밀번호</td>
              <td style="padding:8px;"><input type="password" id="adminInfoNewPw" placeholder="변경 시에만 입력" class="form-control" style="width:100%;"></td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold; background:#f9f9f9;">비밀번호 확인</td>
              <td style="padding:8px;"><input type="password" id="adminInfoNewPwChk" placeholder="새 비밀번호 재입력" class="form-control" style="width:100%;"></td>
            </tr>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" onclick="closeAdminInfoModal()">닫기</button>
          <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> 저장하기</button>
        </div>
      </form>
    </div>
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

    function handleUserLogout(e) {
      if (e) e.preventDefault();
      if (confirm('로그아웃 하시겠습니까?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('superAdminAuth');
        localStorage.removeItem('parentAuthInfo');
        alert('안전하게 로그아웃 되었습니다.');
        window.location.href = '/af/ad_lec/lists/sn/3267/';
      }
    }

    function openAdminInfoModal() {
      const modal = document.getElementById('adminInfoModal');
      if (modal) modal.style.display = 'flex';
    }

    function closeAdminInfoModal() {
      const modal = document.getElementById('adminInfoModal');
      if (modal) modal.style.display = 'none';
    }

    function handleAdminInfoSave(e) {
      e.preventDefault();
      const name = document.getElementById('adminInfoName').value.trim();
      const phone = document.getElementById('adminInfoPhone').value.trim();
      const newPw = document.getElementById('adminInfoNewPw').value;
      const newPwChk = document.getElementById('adminInfoNewPwChk').value;

      if (newPw && newPw !== newPwChk) {
        alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        return false;
      }

      document.querySelectorAll('.user_name').forEach(el => el.textContent = '관리자(' + name + ')님');
      alert('[관리자 정보 수정 완료]\\n성명: ' + name + '\\n연락처: ' + phone + '\\n성공적으로 저장되었습니다.');
      closeAdminInfoModal();
      return false;
    }
  </script>`;
}

function renderHtmlPage(title, activeKey, pageTitle, contentBody, additionalModals = '') {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - 디비디비스쿨</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    ${getBaseStyles()}
  </style>
</head>
<body>
  ${getHeader()}
  <div id="container">
    ${getSidebar(activeKey)}
    <div id="contents_box">
      <div id="contents_title">${pageTitle}</div>
      ${contentBody}
    </div>
  </div>
  ${getFooter()}
  ${additionalModals}
</body>
</html>`;
}

// Ensure dir helper
function writePage(relPath, content) {
  const fullPath = path.join(__dirname, '..', 'course_site', 'sczigi', relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`[GENERATED] ${relPath}`);
}

console.log('🚀 Generating all 17 sczigi pages...');

// ==========================================
// 1. service/lists/sn/3267/index.html
// ==========================================
writePage('service/lists/sn/3267/index.html', renderHtmlPage(
  '서비스목록 - 학교관리',
  'service_lists',
  '<i class="fa fa-sitemap" style="color:#3c8dbc;"></i> 서비스목록',
  `
  <div class="panel_main">
    <div class="panel-heading">
      <span>목록</span>
    </div>
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
            <td style="font-weight:bold; color:#337ab7; font-size:14px;">늘봄학교</td>
            <td style="text-align:left; padding:14px 16px;">
              <div style="display:flex; align-items:flex-start; gap:16px;">
                <div style="border:1px solid #ddd; padding:6px; background:#fff; cursor:pointer;" onclick="alert('우클릭 후 사진 저장을 클릭하세요.')">
                  <svg width="140" height="140" viewBox="0 0 170 170" xmlns="http://www.w3.org/2000/svg">
                    <rect width="170" height="170" fill="white"/>
                    <rect x="10" y="10" width="45" height="45" fill="black"/><rect x="16" y="16" width="33" height="33" fill="white"/><rect x="22" y="22" width="21" height="21" fill="black"/>
                    <rect x="115" y="10" width="45" height="45" fill="black"/><rect x="121" y="16" width="33" height="33" fill="white"/><rect x="127" y="22" width="21" height="21" fill="black"/>
                    <rect x="10" y="115" width="45" height="45" fill="black"/><rect x="16" y="121" width="33" height="33" fill="white"/><rect x="22" y="127" width="21" height="21" fill="black"/>
                    <rect x="65" y="10" width="8" height="8" fill="black"/><rect x="80" y="10" width="8" height="8" fill="black"/><rect x="95" y="10" width="8" height="8" fill="black"/>
                    <rect x="65" y="25" width="8" height="8" fill="black"/><rect x="95" y="25" width="8" height="8" fill="black"/>
                    <rect x="65" y="40" width="8" height="8" fill="black"/><rect x="80" y="40" width="8" height="8" fill="black"/><rect x="95" y="40" width="8" height="8" fill="black"/>
                    <rect x="10" y="65" width="8" height="8" fill="black"/><rect x="25" y="65" width="8" height="8" fill="black"/><rect x="40" y="65" width="8" height="8" fill="black"/>
                    <rect x="65" y="65" width="8" height="8" fill="black"/><rect x="80" y="65" width="8" height="8" fill="black"/><rect x="95" y="65" width="8" height="8" fill="black"/>
                  </svg>
                  <div style="font-size:10px; color:#777; text-align:center; margin-top:2px;">우클릭→저장</div>
                </div>
                <div>
                  <a href="https://www.dbdbschool.kr/go/ai/0hc5dFL" target="_blank" style="color:#337ab7; font-weight:bold; font-size:13px; font-family:monospace; text-decoration:underline;">https://www.dbdbschool.kr/go/ai/0hc5dFL</a>
                  <div style="margin-top:10px; display:flex; gap:6px;">
                    <button class="btn btn-default" onclick="navigator.clipboard.writeText('https://www.dbdbschool.kr/go/ai/0hc5dFL'); alert('URL이 복사되었습니다.');"><i class="fa fa-copy"></i> URL 복사</button>
                    <a href="/sczigi/service/edit/sn/3267" class="btn btn-primary"><i class="fa fa-cog"></i> 서비스 설정</a>
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
  </div>`
));

// ==========================================
// 2. service/edit/sn/3267/index.html
// ==========================================
writePage('service/edit/sn/3267/index.html', renderHtmlPage(
  '서비스설정 - 학교관리',
  'service_lists',
  '<i class="fa fa-cog" style="color:#3c8dbc;"></i> 서비스설정',
  `
  <div class="panel_main">
    <div class="panel-heading">
      <span>서비스 기본 설정</span>
    </div>
    <div class="panel-body">
      <form onsubmit="alert('서비스 설정이 저장되었습니다.'); return false;">
        <table class="db-table" style="text-align:left;">
          <tbody>
            <tr>
              <th style="width:180px; background:#f9f9f9; padding:12px;">서비스명</th>
              <td style="padding:12px;"><strong style="font-size:14px; color:#337ab7;">늘봄학교</strong></td>
            </tr>
            <tr>
              <th style="background:#f9f9f9; padding:12px;">학교 식별 코드</th>
              <td style="padding:12px;"><input type="text" class="form-control" value="3267" readonly style="background:#eee; width:120px;"></td>
            </tr>
            <tr>
              <th style="background:#f9f9f9; padding:12px;">단축 URL 키</th>
              <td style="padding:12px;"><input type="text" class="form-control" value="0hc5dFL" style="width:200px;"></td>
            </tr>
            <tr>
              <th style="background:#f9f9f9; padding:12px;">서비스 이용 기간</th>
              <td style="padding:12px;">
                <input type="date" class="form-control" value="2025-05-09" style="width:140px; display:inline-block;"> ~ 
                <input type="date" class="form-control" value="2027-02-28" style="width:140px; display:inline-block;">
                <a href="/af/ad_extension/lists/sn/3267" class="btn btn-warning" style="margin-left:8px;"><i class="fa fa-calendar-plus"></i> 계약 연장 신청</a>
              </td>
            </tr>
            <tr>
              <th style="background:#f9f9f9; padding:12px;">서비스 상태</th>
              <td style="padding:12px;">
                <label style="margin-right:12px;"><input type="radio" name="service_status" value="1" checked> 정상 운영중</label>
                <label><input type="radio" name="service_status" value="0"> 서비스 일시중지</label>
              </td>
            </tr>
          </tbody>
        </table>
        <div style="text-align:center; margin-top:20px; display:flex; justify-content:center; gap:8px;">
          <a href="/sczigi/service/lists/sn/3267" class="btn btn-default">목록으로</a>
          <button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> 설정 저장</button>
        </div>
      </form>
    </div>
  </div>`
));

// ==========================================
// 3. teacher/lists/sn/3267/index.html
// ==========================================
writePage('teacher/lists/sn/3267/index.html', renderHtmlPage(
  '교직원관리 - 학교관리',
  'teacher_lists',
  '<i class="fa fa-user-tie" style="color:#3c8dbc;"></i> 교직원관리',
  `
  <div class="panel_main">
    <div class="panel-heading">
      <span>목록</span>
      <div style="display:flex; gap:6px;">
        <button class="btn btn-primary" onclick="openTeacherModal()"><i class="fa fa-user-plus"></i> 교직원 등록</button>
        <button class="btn btn-success" onclick="openBatchModal()"><i class="fa fa-file-excel"></i> 교직원 일괄입력</button>
        <button class="btn btn-default" onclick="alert('교직원 명단 엑셀이 다운로드됩니다.');"><i class="fa fa-download"></i> 엑셀출력</button>
      </div>
    </div>
    
    <div class="panel-search">
      <select class="form-control" style="width:110px;">
        <option value="">=전체직명=</option>
        <option value="교장">교장</option>
        <option value="교감">교감</option>
        <option value="늘봄지원실장">늘봄지원실장</option>
        <option value="늘봄실무사">늘봄실무사</option>
        <option value="교직원">교직원</option>
      </select>
      <select class="form-control" style="width:110px;">
        <option value="name">이름</option>
        <option value="id">아이디</option>
        <option value="phone">휴대폰</option>
      </select>
      <input type="text" class="form-control" placeholder="검색어 입력" style="width:180px;">
      <button class="btn btn-default"><i class="fa fa-search"></i> 검색</button>
      <button class="btn btn-default">전체</button>
    </div>

    <div class="table-responsive-container">
      <table class="db-table">
        <thead>
          <tr>
            <th style="width:40px;"><input type="checkbox"></th>
            <th style="width:50px;">연번</th>
            <th style="width:60px;">수정</th>
            <th style="width:90px;">아이디</th>
            <th style="width:90px;">이름</th>
            <th style="width:120px;">휴대폰<br>(비고)</th>
            <th style="width:90px;">담임</th>
            <th style="width:100px;">직명</th>
            <th style="width:120px;">마지막<br>로그인</th>
            <th style="width:60px;">임시<br>비번</th>
            <th style="width:60px;">본인<br>인증</th>
            <th style="width:60px;">2단계<br>인증</th>
            <th style="width:80px;">약관동의</th>
            <th style="width:60px;">상태</th>
            <th style="width:60px;">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="checkbox"></td>
            <td>3</td>
            <td><button class="btn btn-default" style="padding:2px 6px;" onclick="openTeacherModal('김혜련')">수정</button></td>
            <td style="font-weight:bold; color:#337ab7;">김혜련</td>
            <td><strong>김혜련</strong></td>
            <td>010-2494-1479<br><span style="color:#777; font-size:11px;">(관리자)</span></td>
            <td>-</td>
            <td><span class="btn btn-primary" style="padding:1px 6px; font-size:11px;">늘봄실무사</span></td>
            <td>2026-08-17 11:32:00</td>
            <td><span style="color:#3c8dbc; font-weight:bold;">Y</span></td>
            <td><span style="color:#5cb85c; font-weight:bold;">Y</span></td>
            <td><span style="color:#999;">N</span></td>
            <td>-</td>
            <td><span style="color:#5cb85c; font-weight:bold;">사용</span></td>
            <td><button class="btn btn-danger" style="padding:2px 6px;" onclick="alert('최고관리자 계정은 삭제할 수 없습니다.');">삭제</button></td>
          </tr>
          <tr>
            <td><input type="checkbox"></td>
            <td>2</td>
            <td><button class="btn btn-default" style="padding:2px 6px;" onclick="openTeacherModal('박진수')">수정</button></td>
            <td style="font-weight:bold; color:#337ab7;">박진수</td>
            <td><strong>박진수</strong></td>
            <td>010-9876-5432<br><span style="color:#777; font-size:11px;">(실장)</span></td>
            <td>-</td>
            <td><span class="btn btn-warning" style="padding:1px 6px; font-size:11px;">늘봄지원실장</span></td>
            <td>2025-09-11 14:29:19</td>
            <td><span style="color:#999;">N</span></td>
            <td><span style="color:#5cb85c; font-weight:bold;">Y</span></td>
            <td><span style="color:#5cb85c; font-weight:bold;">Y</span></td>
            <td>2025-09-11</td>
            <td><span style="color:#5cb85c; font-weight:bold;">사용</span></td>
            <td><button class="btn btn-danger" style="padding:2px 6px;" onclick="confirm('해당 교직원을 삭제하시겠습니까?');">삭제</button></td>
          </tr>
          <tr>
            <td><input type="checkbox"></td>
            <td>1</td>
            <td><button class="btn btn-default" style="padding:2px 6px;" onclick="openTeacherModal('풍향초')">수정</button></td>
            <td style="font-weight:bold; color:#337ab7;">풍향초</td>
            <td><strong>풍향초</strong></td>
            <td>062-609-1182</td>
            <td>1학년 1반</td>
            <td><span class="btn btn-default" style="padding:1px 6px; font-size:11px;">교직원</span></td>
            <td>2026-04-24 11:40:16</td>
            <td><span style="color:#999;">N</span></td>
            <td><span style="color:#999;">N</span></td>
            <td><span style="color:#999;">N</span></td>
            <td>2026-04-24</td>
            <td><span style="color:#5cb85c; font-weight:bold;">사용</span></td>
            <td><button class="btn btn-danger" style="padding:2px 6px;" onclick="confirm('해당 교직원을 삭제하시겠습니까?');">삭제</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="help_box">
    <ul>
      <li>교직원은 방과후/늘봄학교 관리 시스템 및 담임 교사용 출석부, 학적 관리에 배정할 수 있습니다.</li>
      <li>초기 비밀번호는 1234 이며 최초 로그인 시 변경을 권장합니다.</li>
    </ul>
  </div>`,
  `
  <!-- Teacher Add/Edit Modal -->
  <div class="modal-backdrop" id="teacherModal">
    <div class="modal-box">
      <div class="modal-header">
        <span id="teacherModalTitle"><i class="fa fa-user-plus"></i> 교직원 등록/수정</span>
        <button onclick="closeTeacherModal()" style="background:none; border:none; color:#fff; font-size:18px; cursor:pointer;">&times;</button>
      </div>
      <form onsubmit="alert('교직원 정보가 성공적으로 저장되었습니다.'); closeTeacherModal(); return false;">
        <div class="modal-body">
          <table class="db-table" style="text-align:left;">
            <tr><th style="width:120px;">아이디 *</th><td><input type="text" id="t_id" class="form-control" value="teacher_new" required></td></tr>
            <tr><th>성명 *</th><td><input type="text" id="t_name" class="form-control" value="신규교직원" required></td></tr>
            <tr><th>휴대폰 *</th><td><input type="text" class="form-control" value="010-1234-5678" required></td></tr>
            <tr><th>직명</th><td>
              <select class="form-control">
                <option>교직원</option><option>늘봄실무사</option><option>늘봄지원실장</option><option>교감</option><option>교장</option>
              </select>
            </td></tr>
            <tr><th>배정 학급</th><td><input type="text" class="form-control" placeholder="예: 2학년 3반"></td></tr>
            <tr><th>상태</th><td>
              <label><input type="radio" name="t_status" checked> 사용</label> &nbsp;
              <label><input type="radio" name="t_status"> 중지</label>
            </td></tr>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" onclick="closeTeacherModal()">취소</button>
          <button type="submit" class="btn btn-primary">저장 완료</button>
        </div>
      </form>
    </div>
  </div>
  <script>
    function openTeacherModal(name) {
      if(name) {
        document.getElementById('teacherModalTitle').innerHTML = '<i class="fa fa-user-edit"></i> 교직원 수정 (' + name + ')';
        document.getElementById('t_name').value = name;
      } else {
        document.getElementById('teacherModalTitle').innerHTML = '<i class="fa fa-user-plus"></i> 교직원 신규 등록';
      }
      document.getElementById('teacherModal').style.display = 'flex';
    }
    function closeTeacherModal() {
      document.getElementById('teacherModal').style.display = 'none';
    }
    function openBatchModal() {
      alert('교직원 일괄입력 서식 및 업로드 창이 열립니다.');
    }
  </script>`
));

// ==========================================
// 4. teacher/field/sn/3267/index.html
// ==========================================
writePage('teacher/field/sn/3267/index.html', renderHtmlPage(
  '회원필드설정 - 교직원관리',
  'teacher_field',
  '<i class="fa fa-sliders" style="color:#3c8dbc;"></i> 교직원 회원필드설정',
  `
  <div class="panel_main">
    <div class="panel-heading">
      <span>필드 출력 및 필수 여부 설정</span>
    </div>
    <div class="panel-body">
      <form onsubmit="alert('교직원 회원필드 설정이 저장되었습니다.'); return false;">
        <table class="db-table">
          <thead>
            <tr>
              <th style="width:200px;">필드명</th>
              <th>출력상태 (사용 여부)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight:bold;">휴대폰</td>
              <td>
                <label style="margin-right:16px;"><input type="radio" name="f_phone" value="1" checked> 출력 (사용)</label>
                <label><input type="radio" name="f_phone" value="0"> 숨김 (미사용)</label>
              </td>
            </tr>
            <tr>
              <td style="font-weight:bold;">직위</td>
              <td>
                <label style="margin-right:16px;"><input type="radio" name="f_pos" value="1" checked> 출력 (사용)</label>
                <label><input type="radio" name="f_pos" value="0"> 숨김 (미사용)</label>
              </td>
            </tr>
            <tr>
              <td style="font-weight:bold;">생년월일</td>
              <td>
                <label style="margin-right:16px;"><input type="radio" name="f_birth" value="1"> 출력 (사용)</label>
                <label><input type="radio" name="f_birth" value="0" checked> 숨김 (미사용)</label>
              </td>
            </tr>
            <tr>
              <td style="font-weight:bold;">나이스 개인번호</td>
              <td>
                <label style="margin-right:16px;"><input type="radio" name="f_neis" value="1" checked> 출력 (사용)</label>
                <label><input type="radio" name="f_neis" value="0"> 숨김 (미사용)</label>
              </td>
            </tr>
          </tbody>
        </table>
        <div style="text-align:center; margin-top:20px; display:flex; justify-content:center; gap:8px;">
          <a href="/sczigi/teacher/lists/sn/3267" class="btn btn-default">취소</a>
          <button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> 설정 수정</button>
        </div>
      </form>
    </div>
  </div>`
));

// ==========================================
// 5. teacher/level/sn/3267/index.html
// ==========================================
writePage('teacher/level/sn/3267/index.html', renderHtmlPage(
  '직위명 설정 - 교직원관리',
  'teacher_level',
  '<i class="fa fa-id-badge" style="color:#3c8dbc;"></i> 직위명 설정',
  `
  <div class="panel_main">
    <div class="panel-heading">
      <span>직위 코드 목록</span>
      <button class="btn btn-primary" onclick="alert('신규 직위 추가 행이 생성됩니다.');"><i class="fa fa-plus"></i> 직위 추가</button>
    </div>
    <div class="table-responsive-container">
      <table class="db-table">
        <thead>
          <tr>
            <th style="width:60px;">연번</th>
            <th style="width:80px;">사용</th>
            <th>코드명</th>
            <th style="width:80px;">적용</th>
            <th style="width:100px;">출력순서</th>
            <th style="width:80px;">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td><input type="checkbox" checked></td>
            <td><input type="text" class="form-control" value="교장" style="width:100%;"></td>
            <td><button class="btn btn-default" style="padding:2px 8px;" onclick="alert('적용되었습니다.');">적용</button></td>
            <td><input type="number" class="form-control" value="1" style="width:60px; text-align:center;"></td>
            <td><button class="btn btn-danger" style="padding:2px 8px;" onclick="confirm('삭제하시겠습니까?');">삭제</button></td>
          </tr>
          <tr>
            <td>2</td>
            <td><input type="checkbox" checked></td>
            <td><input type="text" class="form-control" value="교감" style="width:100%;"></td>
            <td><button class="btn btn-default" style="padding:2px 8px;" onclick="alert('적용되었습니다.');">적용</button></td>
            <td><input type="number" class="form-control" value="2" style="width:60px; text-align:center;"></td>
            <td><button class="btn btn-danger" style="padding:2px 8px;" onclick="confirm('삭제하시겠습니까?');">삭제</button></td>
          </tr>
          <tr>
            <td>3</td>
            <td><input type="checkbox" checked></td>
            <td><input type="text" class="form-control" value="늘봄지원실장" style="width:100%;"></td>
            <td><button class="btn btn-default" style="padding:2px 8px;" onclick="alert('적용되었습니다.');">적용</button></td>
            <td><input type="number" class="form-control" value="3" style="width:60px; text-align:center;"></td>
            <td><button class="btn btn-danger" style="padding:2px 8px;" onclick="confirm('삭제하시겠습니까?');">삭제</button></td>
          </tr>
          <tr>
            <td>4</td>
            <td><input type="checkbox" checked></td>
            <td><input type="text" class="form-control" value="늘봄실무사" style="width:100%;"></td>
            <td><button class="btn btn-default" style="padding:2px 8px;" onclick="alert('적용되었습니다.');">적용</button></td>
            <td><input type="number" class="form-control" value="4" style="width:60px; text-align:center;"></td>
            <td><button class="btn btn-danger" style="padding:2px 8px;" onclick="confirm('삭제하시겠습니까?');">삭제</button></td>
          </tr>
          <tr>
            <td>5</td>
            <td><input type="checkbox" checked></td>
            <td><input type="text" class="form-control" value="교직원" style="width:100%;"></td>
            <td><button class="btn btn-default" style="padding:2px 8px;" onclick="alert('적용되었습니다.');">적용</button></td>
            <td><input type="number" class="form-control" value="5" style="width:60px; text-align:center;"></td>
            <td><button class="btn btn-danger" style="padding:2px 8px;" onclick="confirm('삭제하시겠습니까?');">삭제</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`
));

// ==========================================
// 6. teacher/clear/sn/3267/index.html
// ==========================================
writePage('teacher/clear/sn/3267/index.html', renderHtmlPage(
  '초기화 - 교직원관리',
  'teacher_clear',
  '<i class="fa fa-triangle-exclamation" style="color:#d9534f;"></i> 교직원 데이터 초기화',
  `
  <div class="panel_main">
    <div class="panel-heading" style="color:#d9534f;">
      <span>교직원 데이터 초기화 및 영구 삭제</span>
    </div>
    <div class="panel-body">
      <div class="help_box" style="background:#f2dede; border-color:#ebccd1; color:#a94442;">
        <strong>⚠️ 경고: 초기화 실행 시 삭제된 교직원 계정 및 데이터는 복구할 수 없습니다. 신중히 진행하세요.</strong>
      </div>
      <form onsubmit="if(confirm('정말로 선택한 항목의 교직원 데이터를 초기화하시겠습니까?')) { alert('초기화가 완료되었습니다.'); } return false;">
        <table class="db-table" style="text-align:left;">
          <tbody>
            <tr>
              <th style="width:240px; background:#f9f9f9; padding:14px;"><label><input type="checkbox"> 직위 / 생년월일 / 나이스 개인번호</label></th>
              <td style="padding:14px;">교직원의 직위 정보, 생년월일 및 나이스 번호 데이터만 선택 초기화합니다.</td>
            </tr>
            <tr>
              <th style="background:#f9f9f9; padding:14px;"><label><input type="checkbox"> 교직원 회원 전체 데이터</label></th>
              <td style="padding:14px;">등록된 교직원 계정 전체를 초기화합니다. (단, 최고 관리자 계정 제외)</td>
            </tr>
            <tr>
              <th style="background:#f9f9f9; padding:14px;"><label><input type="checkbox"> 담임 학과 배정 데이터</label></th>
              <td style="padding:14px;">교직원에게 배정된 학년/반 담임 정보 매핑을 초기화합니다.</td>
            </tr>
          </tbody>
        </table>
        <div style="text-align:center; margin-top:20px;">
          <button type="submit" class="btn btn-danger" style="padding:8px 24px; font-size:13px;"><i class="fa fa-trash"></i> 선택 항목 초기화 실행</button>
        </div>
      </form>
    </div>
  </div>`
));

// ==========================================
// 7. student/lists/sn/3267/index.html
// ==========================================
writePage('student/lists/sn/3267/index.html', renderHtmlPage(
  '학생관리 - 학교관리',
  'student_lists',
  '<i class="fa fa-user-graduate" style="color:#3c8dbc;"></i> 학생관리',
  `
  <div class="panel_main">
    <div class="panel-heading">
      <span>목록</span>
      <div style="display:flex; gap:6px;">
        <button class="btn btn-primary" onclick="openStudentModal()"><i class="fa fa-user-plus"></i> 학생등록</button>
        <button class="btn btn-success" onclick="alert('학생 일괄입력 엑셀 업로더가 열립니다.');"><i class="fa fa-file-excel"></i> 학생 일괄입력</button>
        <button class="btn btn-warning" onclick="alert('학년도 진급 처리(학적 일괄변경) 마법사가 열립니다.');"><i class="fa fa-arrow-up"></i> 진급처리</button>
        <button class="btn btn-default" onclick="alert('학생 명단 엑셀이 다운로드됩니다.');"><i class="fa fa-download"></i> 엑셀출력</button>
      </div>
    </div>
    
    <div class="panel-search">
      <select class="form-control" style="width:90px;">
        <option value="">=학년=</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option>
      </select>
      <select class="form-control" style="width:90px;">
        <option value="">=반=</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
      </select>
      <select class="form-control" style="width:100px;">
        <option value="name">이름</option><option value="phone">연락처</option><option value="parent">보호자</option>
      </select>
      <input type="text" class="form-control" placeholder="학생명/연락처 검색" style="width:180px;">
      <button class="btn btn-default"><i class="fa fa-search"></i> 검색</button>
      <button class="btn btn-default">전체</button>
    </div>

    <div class="table-responsive-container">
      <table class="db-table">
        <thead>
          <tr>
            <th style="width:36px;"><input type="checkbox"></th>
            <th style="width:45px;">연번</th>
            <th style="width:55px;">수정</th>
            <th style="width:50px;">학년</th>
            <th style="width:45px;">반</th>
            <th style="width:45px;">번호</th>
            <th style="width:80px;">이름</th>
            <th style="width:50px;">성별</th>
            <th style="width:150px;">연락처<br>(비고)</th>
            <th style="width:80px;">이전 학적</th>
            <th style="width:110px;">마지막<br>수정</th>
            <th style="width:110px;">마지막<br>로그인</th>
            <th style="width:50px;">임시<br>비번</th>
            <th style="width:70px;">약관동의</th>
            <th style="width:50px;">상태</th>
            <th style="width:50px;">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="checkbox"></td>
            <td>2</td>
            <td><button class="btn btn-default" style="padding:2px 6px;" onclick="openStudentModal('이서아')">수정</button></td>
            <td><strong>1</strong></td>
            <td>1</td>
            <td>2</td>
            <td style="font-weight:bold; color:#337ab7;">이서아</td>
            <td>여</td>
            <td>010-2345-6789<br><span style="color:#777; font-size:11px;">(모: 이미영)</span></td>
            <td>신입학</td>
            <td>03-02 09:10</td>
            <td>08-15 14:12</td>
            <td><span style="color:#999;">N</span></td>
            <td>동의</td>
            <td><span style="color:#5cb85c; font-weight:bold;">사용</span></td>
            <td><button class="btn btn-danger" style="padding:2px 6px;" onclick="confirm('해당 학생을 삭제하시겠습니까?');">삭제</button></td>
          </tr>
          <tr>
            <td><input type="checkbox"></td>
            <td>1</td>
            <td><button class="btn btn-default" style="padding:2px 6px;" onclick="openStudentModal('김민준')">수정</button></td>
            <td><strong>1</strong></td>
            <td>1</td>
            <td>1</td>
            <td style="font-weight:bold; color:#337ab7;">김민준</td>
            <td>남</td>
            <td>010-1234-5678<br><span style="color:#777; font-size:11px;">(부: 김철수)</span></td>
            <td>신입학</td>
            <td>03-02 09:00</td>
            <td>08-16 17:20</td>
            <td><span style="color:#999;">N</span></td>
            <td>동의</td>
            <td><span style="color:#5cb85c; font-weight:bold;">사용</span></td>
            <td><button class="btn btn-danger" style="padding:2px 6px;" onclick="confirm('해당 학생을 삭제하시겠습니까?');">삭제</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`,
  `
  <div class="modal-backdrop" id="studentModal">
    <div class="modal-box">
      <div class="modal-header">
        <span id="stuModalTitle"><i class="fa fa-user-plus"></i> 학생 정보 등록/수정</span>
        <button onclick="closeStudentModal()" style="background:none; border:none; color:#fff; font-size:18px; cursor:pointer;">&times;</button>
      </div>
      <form onsubmit="alert('학생 정보가 정상적으로 저장되었습니다.'); closeStudentModal(); return false;">
        <div class="modal-body">
          <table class="db-table" style="text-align:left;">
            <tr><th style="width:110px;">학년/반/번호 *</th><td>
              <input type="number" value="1" style="width:50px;" class="form-control" required> 학년 
              <input type="number" value="1" style="width:50px;" class="form-control" required> 반 
              <input type="number" value="3" style="width:50px;" class="form-control" required> 번
            </td></tr>
            <tr><th>학생 성명 *</th><td><input type="text" id="s_name" class="form-control" value="신규학생" required></td></tr>
            <tr><th>성별</th><td><label><input type="radio" name="s_gen" checked> 남</label> &nbsp; <label><input type="radio" name="s_gen"> 여</label></td></tr>
            <tr><th>학생 휴대폰</th><td><input type="text" class="form-control" placeholder="010-0000-0000"></td></tr>
            <tr><th>보호자 성명</th><td><input type="text" class="form-control" value="학부모"></td></tr>
            <tr><th>보호자 연락처 *</th><td><input type="text" class="form-control" value="010-5555-6666" required></td></tr>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" onclick="closeStudentModal()">취소</button>
          <button type="submit" class="btn btn-primary">저장 완료</button>
        </div>
      </form>
    </div>
  </div>
  <script>
    function openStudentModal(name) {
      if(name) {
        document.getElementById('stuModalTitle').innerHTML = '<i class="fa fa-user-edit"></i> 학생 수정 (' + name + ')';
        document.getElementById('s_name').value = name;
      } else {
        document.getElementById('stuModalTitle').innerHTML = '<i class="fa fa-user-plus"></i> 학생 신규 등록';
      }
      document.getElementById('studentModal').style.display = 'flex';
    }
    function closeStudentModal() {
      document.getElementById('studentModal').style.display = 'none';
    }
  </script>`
));

// ==========================================
// 8. student/main/sn/3267/index.html
// ==========================================
writePage('student/main/sn/3267/index.html', renderHtmlPage(
  '기본설정 - 학생관리',
  'student_main',
  '<i class="fa fa-cog" style="color:#3c8dbc;"></i> 학생관리 기본설정',
  `
  <div class="panel_main">
    <div class="panel-heading">
      <span>학생 로그인 및 학적 기본설정</span>
    </div>
    <div class="panel-body">
      <form onsubmit="alert('학생관리 기본설정이 저장되었습니다.'); return false;">
        <table class="db-table" style="text-align:left;">
          <tbody>
            <tr>
              <th style="width:220px; background:#f9f9f9; padding:14px;">다자녀 로그인 공유</th>
              <td style="padding:14px;">
                <label style="margin-right:16px;"><input type="radio" name="multichild" value="1" checked> 허용 (동일 학부모 연락처 다자녀 간편 전환)</label>
                <label><input type="radio" name="multichild" value="0"> 개별 로그인만 허용</label>
              </td>
            </tr>
            <tr>
              <th style="background:#f9f9f9; padding:14px;">학적 최댓값 지정</th>
              <td style="padding:14px;">
                <div style="display:flex; gap:16px; align-items:center;">
                  <div>최대 학년: <input type="number" class="form-control" value="6" style="width:60px; display:inline-block;"> 학년</div>
                  <div>최대 학급: <input type="number" class="form-control" value="12" style="width:60px; display:inline-block;"> 반</div>
                  <div>최대 번호: <input type="number" class="form-control" value="40" style="width:60px; display:inline-block;"> 번</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div style="text-align:center; margin-top:20px; display:flex; justify-content:center; gap:8px;">
          <a href="/sczigi/student/lists/sn/3267" class="btn btn-default">취소</a>
          <button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> 설정 수정</button>
        </div>
      </form>
    </div>
  </div>`
));

// ==========================================
// 9. student/field/sn/3267/index.html
// ==========================================
writePage('student/field/sn/3267/index.html', renderHtmlPage(
  '회원필드설정 - 학생관리',
  'student_field',
  '<i class="fa fa-sliders" style="color:#3c8dbc;"></i> 학생 회원필드설정',
  `
  <div class="panel_main">
    <div class="panel-heading">
      <span>학생 입력 필드 출력 및 필수 여부 설정</span>
    </div>
    <div class="panel-body">
      <form onsubmit="alert('학생 회원필드 설정이 저장되었습니다.'); return false;">
        <table class="db-table">
          <thead>
            <tr>
              <th style="width:180px;">필드명</th>
              <th>출력상태</th>
              <th>필수입력 여부</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight:bold;">학생 휴대폰</td>
              <td><label><input type="radio" name="f_sphone_show" checked> 출력</label> &nbsp; <label><input type="radio" name="f_sphone_show"> 숨김</label></td>
              <td><label><input type="radio" name="f_sphone_req"> 필수</label> &nbsp; <label><input type="radio" name="f_sphone_req" checked> 선택</label></td>
            </tr>
            <tr>
              <td style="font-weight:bold;">보호자 성명</td>
              <td><label><input type="radio" name="f_gname_show" checked> 출력</label> &nbsp; <label><input type="radio" name="f_gname_show"> 숨김</label></td>
              <td><label><input type="radio" name="f_gname_req" checked> 필수</label> &nbsp; <label><input type="radio" name="f_gname_req"> 선택</label></td>
            </tr>
            <tr>
              <td style="font-weight:bold;">보호자 연락처</td>
              <td><label><input type="radio" name="f_gphone_show" checked> 출력</label> &nbsp; <label><input type="radio" name="f_gphone_show"> 숨김</label></td>
              <td><label><input type="radio" name="f_gphone_req" checked> 필수</label> &nbsp; <label><input type="radio" name="f_gphone_req"> 선택</label></td>
            </tr>
            <tr>
              <td style="font-weight:bold;">성별</td>
              <td><label><input type="radio" name="f_gen_show" checked> 출력</label> &nbsp; <label><input type="radio" name="f_gen_show"> 숨김</label></td>
              <td><label><input type="radio" name="f_gen_req" checked> 필수</label> &nbsp; <label><input type="radio" name="f_gen_req"> 선택</label></td>
            </tr>
          </tbody>
        </table>
        <div style="text-align:center; margin-top:20px; display:flex; justify-content:center; gap:8px;">
          <a href="/sczigi/student/lists/sn/3267" class="btn btn-default">취소</a>
          <button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> 설정 수정</button>
        </div>
      </form>
    </div>
  </div>`
));

// ==========================================
// 10. student/course/sn/3267/index.html
// ==========================================
writePage('student/course/sn/3267/index.html', renderHtmlPage(
  '학과 설정 - 학생관리',
  'student_course',
  '<i class="fa fa-graduation-cap" style="color:#3c8dbc;"></i> 학생 학과/과정 설정',
  `
  <div class="panel_main">
    <div class="panel-heading">
      <span>학과(과정) 코드 목록</span>
      <button class="btn btn-primary" onclick="alert('신규 학과 추가 행이 생성됩니다.');"><i class="fa fa-plus"></i> 학과 추가</button>
    </div>
    <div class="table-responsive-container">
      <table class="db-table">
        <thead>
          <tr>
            <th style="width:60px;">연번</th>
            <th style="width:80px;">사용</th>
            <th>코드명</th>
            <th style="width:80px;">적용</th>
            <th style="width:100px;">출력순서</th>
            <th style="width:80px;">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td><input type="checkbox" checked></td>
            <td><input type="text" class="form-control" value="일반과정" style="width:100%;"></td>
            <td><button class="btn btn-default" style="padding:2px 8px;" onclick="alert('적용되었습니다.');">적용</button></td>
            <td><input type="number" class="form-control" value="1" style="width:60px; text-align:center;"></td>
            <td><button class="btn btn-danger" style="padding:2px 8px;" onclick="confirm('삭제하시겠습니까?');">삭제</button></td>
          </tr>
          <tr>
            <td>2</td>
            <td><input type="checkbox" checked></td>
            <td><input type="text" class="form-control" value="특수교육대상" style="width:100%;"></td>
            <td><button class="btn btn-default" style="padding:2px 8px;" onclick="alert('적용되었습니다.');">적용</button></td>
            <td><input type="number" class="form-control" value="2" style="width:60px; text-align:center;"></td>
            <td><button class="btn btn-danger" style="padding:2px 8px;" onclick="confirm('삭제하시겠습니까?');">삭제</button></td>
          </tr>
          <tr>
            <td>3</td>
            <td><input type="checkbox" checked></td>
            <td><input type="text" class="form-control" value="늘봄연계과정" style="width:100%;"></td>
            <td><button class="btn btn-default" style="padding:2px 8px;" onclick="alert('적용되었습니다.');">적용</button></td>
            <td><input type="number" class="form-control" value="3" style="width:60px; text-align:center;"></td>
            <td><button class="btn btn-danger" style="padding:2px 8px;" onclick="confirm('삭제하시겠습니까?');">삭제</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`
));

// ==========================================
// 11. student/clear/sn/3267/index.html
// ==========================================
writePage('student/clear/sn/3267/index.html', renderHtmlPage(
  '초기화 - 학생관리',
  'student_clear',
  '<i class="fa fa-triangle-exclamation" style="color:#d9534f;"></i> 학생 데이터 초기화',
  `
  <div class="panel_main">
    <div class="panel-heading" style="color:#d9534f;">
      <span>학생 데이터 초기화 및 영구 삭제</span>
    </div>
    <div class="panel-body">
      <div class="help_box" style="background:#f2dede; border-color:#ebccd1; color:#a94442;">
        <strong>⚠️ 경고: 학생 데이터를 초기화하면 수강신청 이력 및 출석부 데이터와의 정합성에 영향을 미칠 수 있습니다.</strong>
      </div>
      <form onsubmit="if(confirm('선택한 항목의 학생 데이터를 정말로 초기화하시겠습니까?')) { alert('초기화가 완료되었습니다.'); } return false;">
        <table class="db-table" style="text-align:left;">
          <tbody>
            <tr>
              <th style="width:240px; background:#f9f9f9; padding:14px;"><label><input type="checkbox"> 개인정보 (휴대폰 / 보호자 연락처 / 성별)</label></th>
              <td style="padding:14px;">학생 및 학부모의 개인 식별 연락처 정보를 일괄 비식별화/초기화합니다.</td>
            </tr>
            <tr>
              <th style="background:#f9f9f9; padding:14px;"><label><input type="checkbox"> 학생 비밀번호 일괄 초기화</label></th>
              <td style="padding:14px;">모든 학생의 비밀번호를 기본 비밀번호(1234)로 리셋합니다.</td>
            </tr>
            <tr>
              <th style="background:#f9f9f9; padding:14px;"><label><input type="checkbox"> 학생 회원 전체 데이터</label></th>
              <td style="padding:14px;">등록된 전교생 학적 및 학생 계정 전체를 완전히 삭제합니다.</td>
            </tr>
            <tr>
              <th style="background:#f9f9f9; padding:14px;"><label><input type="checkbox"> 학생 학과(과정) 배정 데이터</label></th>
              <td style="padding:14px;">학생별로 지정된 학과 및 특수과정 코드 매핑을 초기화합니다.</td>
            </tr>
          </tbody>
        </table>
        <div style="text-align:center; margin-top:20px;">
          <button type="submit" class="btn btn-danger" style="padding:8px 24px; font-size:13px;"><i class="fa fa-trash"></i> 선택 항목 초기화 실행</button>
        </div>
      </form>
    </div>
  </div>`
));

// ==========================================
// 12. sms_tel/lists/sn/3267/index.html
// ==========================================
writePage('sms_tel/lists/sn/3267/index.html', renderHtmlPage(
  '발신번호관리 - 문자관리',
  'sms_tel',
  '<i class="fa fa-phone" style="color:#3c8dbc;"></i> 문자관리 > 발신번호관리',
  `
  <div class="panel_main">
    <div class="panel-heading">
      <span>등록 발신번호 목록</span>
      <button class="btn btn-primary" onclick="openSenderModal()"><i class="fa fa-plus"></i> 발신번호등록</button>
    </div>
    
    <div class="panel-search">
      <input type="text" class="form-control" placeholder="발신번호/명의 검색" style="width:200px;">
      <button class="btn btn-default"><i class="fa fa-search"></i> 검색</button>
      <button class="btn btn-default">전체</button>
    </div>

    <div class="table-responsive-container">
      <table class="db-table">
        <thead>
          <tr>
            <th style="width:60px;">연번</th>
            <th style="width:60px;">수정</th>
            <th style="width:140px;">발신번호</th>
            <th style="width:160px;">발신번호명의</th>
            <th style="width:120px;">인증방식</th>
            <th>발신번호 구분 (비고)</th>
            <th style="width:100px;">처리상태</th>
            <th style="width:110px;">승인일자</th>
            <th style="width:60px;">취소</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td><button class="btn btn-default" style="padding:2px 6px;" onclick="openSenderModal('062-609-1182')">수정</button></td>
            <td style="font-weight:bold; color:#337ab7; font-family:monospace; font-size:14px;">062-609-1182</td>
            <td>광주풍향초등학교</td>
            <td>통신사 가입증명서</td>
            <td>학교 대표 행정실 직통번호</td>
            <td><span style="color:#5cb85c; font-weight:bold;"><i class="fa fa-check-circle"></i> 승인완료</span></td>
            <td>2025-05-10</td>
            <td><button class="btn btn-danger" style="padding:2px 6px;" onclick="confirm('발신번호 등록을 취소하시겠습니까?');">취소</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="help_box">
    <ul>
      <li>전기통신사업법에 의거하여 사전에 등록 및 승인 완료된 발신번호로만 문자 메시지(SMS/LMS/알림톡) 발송이 가능합니다.</li>
      <li>신규 발신번호 추가 시 학교 통신사 가입증명원 또는 위임 서류를 첨부해 주시기 바랍니다.</li>
    </ul>
  </div>`,
  `
  <div class="modal-backdrop" id="senderModal">
    <div class="modal-box">
      <div class="modal-header">
        <span><i class="fa fa-phone"></i> 발신번호 신규 등록</span>
        <button onclick="closeSenderModal()" style="background:none; border:none; color:#fff; font-size:18px; cursor:pointer;">&times;</button>
      </div>
      <form onsubmit="alert('발신번호 승인 신청이 접수되었습니다. (영업일 기준 1일 이내 심사)'); closeSenderModal(); return false;">
        <div class="modal-body">
          <table class="db-table" style="text-align:left;">
            <tr><th style="width:120px;">발신번호 *</th><td><input type="text" class="form-control" value="062-609-1182" required></td></tr>
            <tr><th>명의자 *</th><td><input type="text" class="form-control" value="광주풍향초등학교" required></td></tr>
            <tr><th>인증 서류</th><td><input type="file" class="form-control"></td></tr>
            <tr><th>용도/비고</th><td><input type="text" class="form-control" placeholder="예: 교무실/늘봄지원실"></td></tr>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" onclick="closeSenderModal()">취소</button>
          <button type="submit" class="btn btn-primary">등록 신청</button>
        </div>
      </form>
    </div>
  </div>
  <script>
    function openSenderModal() { document.getElementById('senderModal').style.display = 'flex'; }
    function closeSenderModal() { document.getElementById('senderModal').style.display = 'none'; }
  </script>`
));

// ==========================================
// 13. sms_sin/lists/sn/3267/index.html
// ==========================================
writePage('sms_sin/lists/sn/3267/index.html', renderHtmlPage(
  '충전신청 - 문자관리',
  'sms_sin',
  '<i class="fa fa-cart-plus" style="color:#3c8dbc;"></i> 문자관리 > 충전신청',
  `
  <div class="panel_main">
    <div class="panel-heading">
      <span>SMS/LMS 포인트 충전신청</span>
    </div>
    <div class="panel-body">
      <form onsubmit="alert('문자 충전 신청 및 견적서 생성이 완료되었습니다.'); return false;">
        <table class="db-table" style="text-align:left;">
          <tbody>
            <tr>
              <th style="width:180px; background:#f9f9f9; padding:12px;">충전 금액 선택 *</th>
              <td style="padding:12px;">
                <label style="margin-right:16px;"><input type="radio" name="amt" value="50000" onchange="calcSms(50000)"> 50,000원 (2,500건)</label>
                <label style="margin-right:16px;"><input type="radio" name="amt" value="100000" checked onchange="calcSms(100000)"> 100,000원 (5,000건)</label>
                <label style="margin-right:16px;"><input type="radio" name="amt" value="200000" onchange="calcSms(200000)"> 200,000원 (10,500건 - 5%보너스)</label>
                <label><input type="radio" name="amt" value="500000" onchange="calcSms(500000)"> 500,000원 (27,500건 - 10%보너스)</label>
              </td>
            </tr>
            <tr>
              <th style="background:#f9f9f9; padding:12px;">충전 예상 건수</th>
              <td style="padding:12px;"><strong id="smsCountDisplay" style="font-size:16px; color:#337ab7;">5,000</strong> 건 (단문 SMS 기준)</td>
            </tr>
            <tr>
              <th style="background:#f9f9f9; padding:12px;">견적서 / 품의서</th>
              <td style="padding:12px;">
                <button type="button" class="btn btn-default" onclick="alert('[견적서 인쇄창] 광주풍향초등학교 문자 충전 견적서가 생성되었습니다.');"><i class="fa fa-print"></i> 견적서 미리보기/인쇄</button>
              </td>
            </tr>
            <tr>
              <th style="background:#f9f9f9; padding:12px;">학교 품의 진행상태</th>
              <td style="padding:12px;">
                <label style="margin-right:14px;"><input type="radio" name="sin_status" value="1" checked> 품의 완료 (즉시 충전 요청)</label>
                <label><input type="radio" name="sin_status" value="0"> 품의 진행중</label>
              </td>
            </tr>
          </tbody>
        </table>
        <div style="text-align:center; margin-top:16px;">
          <button type="submit" class="btn btn-primary" style="padding:8px 24px; font-size:13px;"><i class="fa fa-check"></i> 충전 신청 접수</button>
        </div>
      </form>
    </div>
  </div>

  <div class="panel_main">
    <div class="panel-heading"><span>충전 신청 이력</span></div>
    <div class="table-responsive-container">
      <table class="db-table">
        <thead>
          <tr>
            <th style="width:60px;">연번</th>
            <th>충전금액(원)</th>
            <th>충전건수(건)</th>
            <th>견적서</th>
            <th>품의여부</th>
            <th>상태</th>
            <th>신청일자</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td><strong>100,000</strong></td>
            <td>5,000</td>
            <td><button class="btn btn-default" style="padding:2px 6px;" onclick="alert('견적서 출력');">인쇄</button></td>
            <td><span style="color:#5cb85c; font-weight:bold;">품의완료</span></td>
            <td><span class="btn btn-success" style="padding:1px 6px; font-size:11px;">충전완료</span></td>
            <td>2026-05-10</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <script>
    function calcSms(amt) {
      let cnt = 5000;
      if(amt === 50000) cnt = 2500;
      else if(amt === 100000) cnt = 5000;
      else if(amt === 200000) cnt = 10500;
      else if(amt === 500000) cnt = 27500;
      document.getElementById('smsCountDisplay').innerText = cnt.toLocaleString();
    }
  </script>`
));

// ==========================================
// 14. sms_charge/lists/sn/3267/index.html
// ==========================================
writePage('sms_charge/lists/sn/3267/index.html', renderHtmlPage(
  '충전내역 - 문자관리',
  'sms_charge',
  '<i class="fa fa-receipt" style="color:#3c8dbc;"></i> 문자관리 > 충전내역',
  `
  <div class="panel_main">
    <div class="panel-heading"><span>충전 및 지급 내역</span></div>
    <div class="table-responsive-container">
      <table class="db-table">
        <thead>
          <tr>
            <th style="width:60px;">연번</th>
            <th>충전건수(건)</th>
            <th>충전구분</th>
            <th>비고</th>
            <th>처리구분</th>
            <th>처리일자</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2</td>
            <td style="font-weight:bold; color:#337ab7;">+5,000</td>
            <td>유료충전</td>
            <td>10만원 패키지 충전</td>
            <td><span style="color:#5cb85c; font-weight:bold;">정상처리</span></td>
            <td>2026-05-10 14:20:11</td>
          </tr>
          <tr>
            <td>1</td>
            <td style="font-weight:bold; color:#337ab7;">+1,000</td>
            <td>서비스지원</td>
            <td>신규 학년도 가입 무료 보너스 지급</td>
            <td><span style="color:#5cb85c; font-weight:bold;">지급완료</span></td>
            <td>2025-05-09 10:00:00</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`
));

// ==========================================
// 15. sms_report/lists/sn/3267/index.html
// ==========================================
writePage('sms_report/lists/sn/3267/index.html', renderHtmlPage(
  '발송통계 - 문자관리',
  'sms_report',
  '<i class="fa fa-chart-bar" style="color:#3c8dbc;"></i> 문자관리 > 발송통계',
  `
  <div class="panel_main">
    <div class="panel-heading">
      <span>문자 발송 집계</span>
      <button class="btn btn-default" onclick="alert('발송 통계 엑셀이 다운로드됩니다.');"><i class="fa fa-download"></i> 통계 엑셀출력</button>
    </div>
    
    <div class="panel-search">
      <button class="btn btn-default" onclick="alert('지난달 통계를 조회합니다.');">지난달</button>
      <button class="btn btn-primary" onclick="alert('이번달 통계를 조회합니다.');">이번달</button>
      <button class="btn btn-default" onclick="alert('최근 1달 통계를 조회합니다.');">최근1달</button>
      <input type="date" class="form-control" value="2026-08-01" style="width:130px;"> ~ 
      <input type="date" class="form-control" value="2026-08-17" style="width:130px;">
      <button class="btn btn-default"><i class="fa fa-search"></i> 검색</button>
    </div>

    <div class="table-responsive-container">
      <table class="db-table">
        <thead>
          <tr>
            <th rowspan="2" style="width:50px;">연번</th>
            <th rowspan="2" style="width:100px;">발송일자</th>
            <th colspan="3">SMS (단문)</th>
            <th colspan="3">LMS (장문)</th>
            <th colspan="3">차감(성공) / 재충전(실패)</th>
          </tr>
          <tr>
            <th>성공</th><th>실패</th><th>합계</th>
            <th>성공</th><th>실패</th><th>합계</th>
            <th>차감</th><th>재충전</th><th>합계</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2</td>
            <td><strong>2026-08-16</strong></td>
            <td>120</td><td style="color:#d9534f;">2</td><td>122</td>
            <td>45</td><td>0</td><td>45</td>
            <td style="font-weight:bold; color:#337ab7;">165</td><td style="color:#5cb85c;">+2</td><td>167</td>
          </tr>
          <tr>
            <td>1</td>
            <td><strong>2026-08-10</strong></td>
            <td>85</td><td>0</td><td>85</td>
            <td>12</td><td>0</td><td>12</td>
            <td style="font-weight:bold; color:#337ab7;">97</td><td>0</td><td>97</td>
          </tr>
        </tbody>
        <tfoot>
          <tr style="background:#f5f5f5; font-weight:bold;">
            <td colspan="2">월간 합계</td>
            <td>205</td><td style="color:#d9534f;">2</td><td>207</td>
            <td>57</td><td>0</td><td>57</td>
            <td style="color:#337ab7;">262</td><td style="color:#5cb85c;">+2</td><td>264</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>`
));

// ==========================================
// 16. auth/main/sn/3267/index.html
// ==========================================
writePage('auth/main/sn/3267/index.html', renderHtmlPage(
  '서비스 관리자 권한 설정 - 학교관리',
  'auth_main',
  '<i class="fa fa-key" style="color:#3c8dbc;"></i> 서비스 관리자 권한 설정',
  `
  <div class="panel_main">
    <div class="panel-heading"><span>학교관리 및 서비스 운영 권한</span></div>
    <div class="panel-body">
      <form onsubmit="alert('관리자 권한 설정이 성공적으로 저장되었습니다.'); return false;">
        <table class="db-table">
          <thead>
            <tr>
              <th>서비스명</th>
              <th>관리자 ID</th>
              <th>교직원관리 권한</th>
              <th>학생관리 권한</th>
              <th>문자관리 권한</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight:bold; color:#337ab7;">늘봄학교</td>
              <td><strong>김혜련</strong> (최고관리자)</td>
              <td><input type="checkbox" checked> 전체 이용</td>
              <td><input type="checkbox" checked> 전체 이용</td>
              <td><input type="checkbox" checked> 전체 이용</td>
            </tr>
            <tr>
              <td style="font-weight:bold; color:#337ab7;">늘봄학교</td>
              <td><strong>박진수</strong> (늘봄지원실장)</td>
              <td><input type="checkbox" checked> 전체 이용</td>
              <td><input type="checkbox" checked> 전체 이용</td>
              <td><input type="checkbox" checked> 전체 이용</td>
            </tr>
            <tr>
              <td style="font-weight:bold; color:#337ab7;">늘봄학교</td>
              <td><strong>풍향초</strong> (교직원)</td>
              <td><input type="checkbox"> 조회만</td>
              <td><input type="checkbox" checked> 학급 관리</td>
              <td><input type="checkbox"> 미부여</td>
            </tr>
          </tbody>
        </table>
        <div style="text-align:center; margin-top:20px; display:flex; justify-content:center; gap:8px;">
          <a href="/sczigi/service/lists/sn/3267" class="btn btn-default">취소</a>
          <button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> 권한 수정 저장</button>
        </div>
      </form>
    </div>
  </div>`
));

// ==========================================
// 17. privacy_log/main/sn/3267/index.html
// ==========================================
writePage('privacy_log/main/sn/3267/index.html', renderHtmlPage(
  '서비스 접근 로그 - 학교관리',
  'privacy_log',
  '<i class="fa fa-shield-halved" style="color:#3c8dbc;"></i> 개인정보 보호 및 서비스 접근 로그',
  `
  <div class="panel_main">
    <div class="panel-heading">
      <span>접속 로그 목록</span>
      <button class="btn btn-default" onclick="alert('접근 로그 내역이 다운로드됩니다.');"><i class="fa fa-download"></i> 엑셀출력</button>
    </div>
    
    <div class="panel-search">
      <input type="text" class="form-control" placeholder="아이디/수행업무 검색" style="width:200px;">
      <button class="btn btn-default"><i class="fa fa-search"></i> 검색</button>
      <button class="btn btn-default">전체</button>
    </div>

    <div class="table-responsive-container">
      <table class="db-table">
        <thead>
          <tr>
            <th style="width:60px;">연번</th>
            <th style="width:100px;">서비스</th>
            <th style="width:90px;">아이디</th>
            <th style="width:100px;">회원그룹</th>
            <th style="width:130px;">접속 IP</th>
            <th style="width:150px;">접속시간</th>
            <th style="text-align:left; padding-left:14px;">수행 업무</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>3</td>
            <td>학교관리</td>
            <td><strong>김혜련</strong></td>
            <td>최고관리자</td>
            <td>121.134.88.201</td>
            <td>2026-08-17 13:28:10</td>
            <td style="text-align:left; padding-left:14px;">교직원 목록 및 학생 목록 조회</td>
          </tr>
          <tr>
            <td>2</td>
            <td>늘봄학교</td>
            <td><strong>김혜련</strong></td>
            <td>최고관리자</td>
            <td>121.134.88.201</td>
            <td>2026-08-17 11:32:00</td>
            <td style="text-align:left; padding-left:14px;">강좌 수강신청자 목록 엑셀 다운로드</td>
          </tr>
          <tr>
            <td>1</td>
            <td>늘봄학교</td>
            <td><strong>박진수</strong></td>
            <td>실장</td>
            <td>211.234.112.55</td>
            <td>2026-08-16 16:40:22</td>
            <td style="text-align:left; padding-left:14px;">출석부 일일 현황 마감 확인</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`
));

console.log('✅ Finished generating all 17 sczigi static HTML pages.');
