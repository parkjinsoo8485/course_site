const fs = require('fs');
const path = require('path');

const mainHtml = fs.readFileSync(path.join(__dirname, 'target_ad_cfg_main.html'), 'utf8');
const teaHtml = fs.readFileSync(path.join(__dirname, 'target_ad_cfg_tea.html'), 'utf8');
const attHtml = fs.readFileSync(path.join(__dirname, 'target_ad_cfg_att.html'), 'utf8');
const smsHtml = fs.readFileSync(path.join(__dirname, 'target_ad_cfg_sms.html'), 'utf8');

function extractForm(html, formId, paneId, displayStyle) {
  const formMatch = html.match(/<form\b([^>]*)>(.*?)<\/form>/is);
  if (!formMatch) return '';
  const formAttrs = formMatch[1];
  let formBody = formMatch[2];

  // action url을 로컬 처리용으로 매핑
  let updatedAttrs = formAttrs
    .replace(/action="https:\/\/www\.dbdbschool\.kr\/af\/ad_cfg\/([^"]*)"/i, 'action="/af/ad_cfg/$1"')
    .replace(/onsubmit="return fm_edit_check\(this\);"/i, `onsubmit="return submitCfgForm(event, this, '${paneId}');"`);

  return `
    <!-- [Tab Pane: ${paneId}] -->
    <div id="cfg_pane_${paneId}" class="cfg-tab-pane" style="display: ${displayStyle};">
      <form ${updatedAttrs} id="${formId}">
        ${formBody}
      </form>
    </div>
  `;
}

const mainPane = extractForm(mainHtml, 'fm_cfg_main', 'main', 'block');
const teaPane = extractForm(teaHtml, 'fm_cfg_tea', 'tea', 'none');
const attPane = extractForm(attHtml, 'fm_cfg_att', 'att', 'none');
const smsPane = extractForm(smsHtml, 'fm_cfg_sms', 'sms', 'none');

const integratedHtml = `
      <!-- ==================== 18. 환경설정 > 기본설정 (/af/ad_cfg/main) 1:1 Authentic Clone ==================== -->
      <div class="submodel-panel" id="panel_ad_cfg_main" style="display: none;">
        <div class="content-card" style="background:#fff; border-radius:4px; box-shadow:0 1px 3px rgba(0,0,0,0.1); padding:20px;">
          
          <!-- 카드 상단 바 & 매뉴얼 -->
          <div class="card-top-bar" style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #337ab7; padding-bottom:12px; margin-bottom:16px;">
            <div class="section-title" id="cfg_section_title" style="font-size:18px; font-weight:bold; color:#333; display:flex; align-items:center; gap:8px;">
              <i class="fa fa-cog" style="color:#337ab7;"></i> <span id="cfg_title_text">기본설정</span>
              <span style="font-size:12px; color:#888; font-weight:normal;">광주풍향초등학교 늘봄학교</span>
            </div>
            <div class="helper-badges" style="display:flex; gap:6px;">
              <a href="https://www.dbdbschool.kr/help/go_data/num/73/data/link1" target="_blank" class="btn btn-default btn-xs" style="height:28px; padding:0 10px; font-size:12px; display:inline-flex; align-items:center; gap:4px; border:1px solid #ccc; background:#fff;">
                <i class="fa fa-youtube-play" style="color:#d9534f;"></i> 매뉴얼
              </a>
            </div>
          </div>

          <!-- 상단 4개 서브탭 메뉴 (1:1 탭 스위칭) -->
          <div class="panel-body" style="padding:0; margin-bottom:16px;">
            <ul class="tapMenu" id="cfg_tap_menu" style="display:flex; list-style:none; padding:0; margin:0; border-bottom:1px solid #ddd; gap:2px;">
              <li class="on" id="tab_btn_main" style="margin-bottom:-1px;">
                <a href="/af/ad_cfg/main/sn/3267" onclick="switchCfgTab('main', event);" style="display:block; padding:8px 20px; font-size:13px; font-weight:bold; text-decoration:none; color:#337ab7; border:1px solid #ddd; border-bottom:1px solid #fff; background:#fff; border-top:2px solid #337ab7; border-radius:3px 3px 0 0;">기본설정</a>
              </li>
              <li id="tab_btn_tea" style="margin-bottom:-1px;">
                <a href="/af/ad_cfg/tea/sn/3267" onclick="switchCfgTab('tea', event);" style="display:block; padding:8px 20px; font-size:13px; text-decoration:none; color:#555; border:1px solid transparent; background:#f9f9f9; border-radius:3px 3px 0 0;">강사권한</a>
              </li>
              <li id="tab_btn_att" style="margin-bottom:-1px;">
                <a href="/af/ad_cfg/att/sn/3267" onclick="switchCfgTab('att', event);" style="display:block; padding:8px 20px; font-size:13px; text-decoration:none; color:#555; border:1px solid transparent; background:#f9f9f9; border-radius:3px 3px 0 0;">출석부옵션</a>
              </li>
              <li id="tab_btn_sms" style="margin-bottom:-1px;">
                <a href="/af/ad_cfg/sms/sn/3267" onclick="switchCfgTab('sms', event);" style="display:block; padding:8px 20px; font-size:13px; text-decoration:none; color:#555; border:1px solid transparent; background:#f9f9f9; border-radius:3px 3px 0 0;">문자설정</a>
              </li>
            </ul>
          </div>

          <!-- 4개 탭 폼 컨테이너 -->
          <div id="cfg_panes_wrapper">
            ${mainPane}
            ${teaPane}
            ${attPane}
            ${smsPane}
          </div>

        </div>
      </div>

      <!-- ==================== [Modal] 출석부 결재란 전자 서명 패드 모달 ==================== -->
      <div id="modal_sign_pad" class="modal-backdrop" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1050; align-items:center; justify-content:center;">
        <div style="background:#fff; width:380px; border-radius:6px; box-shadow:0 5px 15px rgba(0,0,0,0.5); overflow:hidden;">
          <div style="background:#337ab7; color:#fff; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
            <h4 style="margin:0; font-size:15px; font-weight:bold;"><i class="fa fa-pencil"></i> <span id="sign_modal_title">결재 서명 만들기</span></h4>
            <button type="button" onclick="closeSignModal();" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer;">&times;</button>
          </div>
          <div style="padding:16px; text-align:center;">
            <p style="font-size:12px; color:#666; margin-bottom:10px;">마우스나 터치로 서명을 그리신 후 [적용] 버튼을 눌러주세요.</p>
            <div style="border:2px dashed #999; border-radius:4px; display:inline-block; background:#fff;">
              <canvas id="sign_canvas" width="300" height="150" style="touch-action:none; cursor:crosshair;"></canvas>
            </div>
            <div style="margin-top:12px; display:flex; justify-content:center; gap:8px;">
              <button type="button" class="btn btn-default btn-sm" onclick="clearSignCanvas();" style="height:30px; padding:0 14px;"><i class="fa fa-eraser"></i> 다시 그리기</button>
              <button type="button" class="btn btn-primary btn-sm" onclick="applySignFromCanvas();" style="height:30px; padding:0 18px; font-weight:bold; background:#337ab7;"><i class="fa fa-check"></i> 서명 적용</button>
              <button type="button" class="btn btn-default btn-sm" onclick="closeSignModal();" style="height:30px; padding:0 14px;">취소</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== [Modal] 서비스 관리자 교직원 추가 모달 ==================== -->
      <div id="modal_admin_search" class="modal-backdrop" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1050; align-items:center; justify-content:center;">
        <div style="background:#fff; width:480px; border-radius:6px; box-shadow:0 5px 15px rgba(0,0,0,0.5); overflow:hidden;">
          <div style="background:#337ab7; color:#fff; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
            <h4 style="margin:0; font-size:15px; font-weight:bold;"><i class="fa fa-user-plus"></i> 서비스 관리자 교직원 검색</h4>
            <button type="button" onclick="closeAdminSearchModal();" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer;">&times;</button>
          </div>
          <div style="padding:16px;">
            <div style="display:flex; gap:6px; margin-bottom:12px;">
              <input type="text" id="admin_search_keyword" class="form-control input-sm" placeholder="교직원 성명 또는 아이디 검색" style="height:30px;">
              <button type="button" class="btn btn-primary btn-sm" onclick="searchTeachersForAdmin();" style="height:30px; padding:0 14px; background:#337ab7;"><i class="fa fa-search"></i> 검색</button>
            </div>
            <div style="max-height:220px; overflow-y:auto; border:1px solid #ddd; border-radius:3px;">
              <table class="table table-bordered table-hover" style="margin:0; font-size:12px;">
                <thead style="background:#f5f5f5;">
                  <tr>
                    <th style="width:40px; text-align:center;">선택</th>
                    <th>교직원명</th>
                    <th>아이디</th>
                    <th>휴대폰</th>
                  </tr>
                </thead>
                <tbody id="admin_search_tbody">
                  <tr><td colspan="4" style="text-align:center; padding:20px; color:#888;">교직원명을 입력하고 검색해 주세요.</td></tr>
                </tbody>
              </table>
            </div>
            <div style="margin-top:14px; text-align:center; display:flex; justify-content:center; gap:8px;">
              <button type="button" class="btn btn-primary btn-sm" onclick="addSelectedTeacherToAdmin();" style="height:30px; padding:0 18px; font-weight:bold; background:#337ab7;">관리자로 추가</button>
              <button type="button" class="btn btn-default btn-sm" onclick="closeAdminSearchModal();" style="height:30px; padding:0 14px;">닫기</button>
            </div>
          </div>
        </div>
      </div>
`;

fs.writeFileSync(path.join(__dirname, 'panel_ad_cfg_integrated.html'), integratedHtml, 'utf8');
console.log('✅ panel_ad_cfg_integrated.html 생성 완료! (' + (integratedHtml.length / 1024).toFixed(1) + ' KB)');
