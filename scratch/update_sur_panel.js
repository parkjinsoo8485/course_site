const fs = require('fs');
const path = require('path');

const indexPath = path.join('course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 교체 대상: 16번 설문관리 패널부터 17번 샘플설문 패널 끝까지
// 마커로 찾기
const startMarker = '<!-- ==================== 16. 설문관리 > 설문 (/af/ad_sur/lists) ====================';
const endMarker = '<!-- ==================== 18. 환경설정 > 기본설정 (/af/ad_cfg/main) ====================';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);

if (startIdx === -1) {
  console.error('❌ 시작 마커를 찾을 수 없습니다!');
  process.exit(1);
}
if (endIdx === -1) {
  console.error('❌ 끝 마커를 찾을 수 없습니다!');
  process.exit(1);
}

console.log(`✔ 시작 마커 위치: ${startIdx}`);
console.log(`✔ 끝 마커 위치: ${endIdx}`);

// 교체할 새 패널 HTML (설문관리 + 샘플설문 + 4개 모달)
const newPanel = `<!-- ==================== 16. 설문관리 > 설문 (/af/ad_sur/lists) ==================== -->
      <div class="submodel-panel" id="panel_ad_sur_lists" style="display: none;">
        <div style="padding: 15px;">
          <!-- 도움말/매뉴얼 박스 -->
          <div class="new_help_manualbox hm_loca1" style="background:#f8f9fa; border:1px solid #e9ecef; border-radius:4px; padding:8px 12px; margin-bottom:10px; display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <p class="hm_title" style="margin:0; font-weight:bold; font-size:12px; color:#555;"><i class="fa fa-file-text-o" aria-hidden="true"></i> 매뉴얼</p>
            <a href="#none;" class="manual_btn btn btn-default btn-xs" style="font-size:11px;"><i class="fa fa-youtube-play" style="color:#e00;"></i> 설문관리</a>
            <a href="#none;" class="manual_btn btn btn-default btn-xs" style="font-size:11px;"><i class="fa fa-download"></i> 설문조사 가정통신문</a>
          </div>

          <!-- 등록 버튼 -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div><span style="font-size:14px; font-weight:bold; color:#337ab7;"><i class="fa fa-pie-chart"></i> 설문 목록</span></div>
            <div>
              <button type="button" id="btn_sur_write" onclick="openSurWriteModal();" class="btn btn-primary btn-sm" style="display:inline-flex;align-items:center;justify-content:center;height:30px;padding:0 14px;font-size:12px;line-height:1;">
                <i class="fa fa-plus" style="margin-right:5px;"></i> 등록
              </button>
            </div>
          </div>

          <!-- 메인 폼 + 테이블 -->
          <form id="fm_list" name="fm_list" method="post" action="/af/ad_sur/del/p/1/sn/3267" onsubmit="return false;">
            <input type="hidden" name="csrf_test_name" value="mock_csrf_sur">
            <input type="hidden" name="form_open_date_use_chk_csrf" value="">

            <div class="table-responsive" style="overflow-x:auto;">
              <table id="surMainTable" class="table AlignCenter table-hover_sm list MAT0" style="font-size:12px;">
                <thead>
                  <tr>
                    <th width="40"><input type="checkbox" name="check_all" id="check_all" value="" onclick="surChkAll(this);" title="전체선택/취소" style="float:none;"></th>
                    <th class="mobile_none" width="60">연번</th>
                    <th width="50">수정</th>
                    <th width="90">설문구분</th>
                    <th width="130">강좌구분</th>
                    <th width="80">늘봄과정</th>
                    <th>제목</th>
                    <th width="80">참여구분</th>
                    <th width="85">대상학년</th>
                    <th width="65">문항</th>
                    <th width="70">참여자</th>
                    <th width="110">설문기간</th>
                    <th width="50">삭제</th>
                  </tr>
                </thead>
                <tbody id="surTableTbody">
                  <tr><td colspan="13" style="text-align:center;padding:30px;color:#999;">데이터를 불러오는 중...</td></tr>
                </tbody>
              </table>
            </div>

            <!-- 하단 일괄적용 + 페이지네이션 -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
              <div style="display:flex;align-items:center;gap:6px;">
                <select name="update_type" id="update_type" class="form-control input-sm" style="height:30px;line-height:normal!important;box-sizing:border-box!important;padding:0 24px 0 10px;vertical-align:middle;">
                  <option value="">== 일괄적용 ==</option>
                  <option value="del">설문 삭제</option>
                  <option value="ans_del">참여결과 삭제</option>
                </select>
                <button type="button" onclick="surBulkAction();" class="btn btn-default btn-sm" style="display:inline-flex;align-items:center;justify-content:center;height:30px;padding:0 14px;font-size:12px;line-height:1;">적용하기</button>
              </div>
              <div id="surPagination">
                <ul class="pagination pagination-sm" style="margin:0;">
                  <li class="active"><a href="#none;">1</a></li>
                </ul>
              </div>
            </div>
          </form>

          <!-- fm_del 폼 -->
          <form id="fm_del" name="fm_del" method="post" action="/af/ad_sur/del/p/1/sn/3267" onsubmit="return false;" style="display:none;">
            <input type="hidden" name="csrf_test_name" value="mock_csrf_sur">
            <input type="hidden" name="num" id="del_num" value="">
          </form>
        </div>
      </div>

      <!-- ==================== 17. 설문관리 > 샘플설문 (/af/ad_surs/lists) ==================== -->
      <div class="submodel-panel" id="panel_ad_surs_lists" style="display: none;">
        <div style="padding:15px;">
          <div style="margin-bottom:8px;">
            <span style="font-size:14px; font-weight:bold; color:#337ab7;"><i class="fa fa-list-alt"></i> 샘플 설문 템플릿</span>
          </div>
          <div class="table-responsive" style="overflow-x:auto;">
            <table class="table table-bordered table-hover" style="font-size:12px;">
              <thead style="background:#f5f5f5;">
                <tr>
                  <th width="100" style="text-align:center;">분류</th>
                  <th style="text-align:center;">표준 설문 템플릿 명칭</th>
                  <th width="80" style="text-align:center;">문항 수</th>
                  <th width="120" style="text-align:center;">설문지 복제 사용</th>
                </tr>
              </thead>
              <tbody id="sampleSurveyTbody">
                <tr><td colspan="4" style="text-align:center;padding:30px;color:#999;">샘플 설문 템플릿을 불러오는 중입니다...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ==================== [Modal] 설문 등록 (modal_ad_sur_write) ==================== -->
      <div id="modal_ad_sur_write" class="modal fade" tabindex="-1" role="dialog" style="display:none; z-index:9999; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); overflow-y:auto;">
        <div class="modal-dialog" style="width:700px; max-width:95%; margin:50px auto;">
          <div class="modal-content">
            <div class="modal-header" style="background:#337ab7; color:#fff; padding:10px 15px; display:flex; align-items:center; justify-content:space-between;">
              <h4 class="modal-title" style="margin:0; font-size:16px; font-weight:bold;"><i class="fa fa-pie-chart"></i> 설문 등록</h4>
              <button type="button" class="close" onclick="closeSurModal('modal_ad_sur_write');" style="color:#fff; opacity:1; font-size:22px; background:none; border:none;">&times;</button>
            </div>
            <div class="modal-body" style="padding:15px; max-height:75vh; overflow-y:auto;">
              <p style="font-size:12px; margin-bottom:10px;"><i class="fa required" style="color:#e00;" title="필수항목"></i><span style="font-size:11px;"> 표시가 있는 항목은 반드시 입력해야 합니다.</span></p>

              <!-- 샘플설문 선택 폼 -->
              <form id="fm_sample" name="sample" method="get" style="margin-bottom:10px;">
                <table class="table table-bordered table-hover list" style="margin:0; font-size:12px;">
                  <tbody>
                    <tr>
                      <th width="150" class="size35">샘플설문</th>
                      <td>
                        <select name="s_sur_num" id="s_sur_num" onchange="onSurSampleChange(this);" class="form-control input-sm PAD0" style="line-height:normal!important;box-sizing:border-box!important;">
                          <option value="">== 선택 ==</option>
                          <option value="2116">[서비스_종합][광주 2026년] 늘봄학교 만족도 조사 설문지(학부모용)</option>
                          <option value="2115">[서비스_종합][광주 2026년] 늘봄학교 만족도 조사 설문지(학생용)</option>
                          <option value="2118">[서비스_강좌(강사기준)][광주 2026년] 늘봄학교 강사 만족도 조사 설문지(학부모용)</option>
                          <option value="2117">[서비스_강좌(강사기준)][광주 2026년] 늘봄학교 강사 만족도 조사 설문지(학생용)</option>
                          <option value="708">[서비스_종합]방과후학교 기초조사 설문</option>
                          <option value="3">[서비스_종합]방과후학교 연간 운영 만족도 설문지(학부모용)</option>
                          <option value="2">[서비스_종합]방과후학교 연간 운영 만족도 설문지(학생용)</option>
                          <option value="617">[서비스_강좌(강사기준)]방과후학교 프로그램 및 강사 만족도 설문지(학부모용) (2024년)</option>
                          <option value="616">[서비스_강좌(강사기준)]방과후학교 프로그램 및 강사 만족도 설문지(학생용) (2024년)</option>
                        </select>
                        <br><small style="color:#777;">(선택된 경우 샘플설문의 문항도 함께 복사됩니다.)</small>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>

              <!-- 등록 폼 -->
              <form id="fm_edit" name="fm_edit" onsubmit="return surWriteSubmit(this);" method="post">
                <input type="hidden" name="csrf_test_name" value="mock_csrf_sur">
                <input type="hidden" name="form_open_date_use_chk_csrf" value="">
                <input type="hidden" name="s_sur_num" value="0">
                <table class="table table-bordered table-hover list" style="margin:0; font-size:12px;">
                  <tbody>
                    <tr>
                      <th width="150" class="size35">제목 <span><i class="fa required" title="필수항목" style="color:#e00;"></i></span></th>
                      <td><input id="sur_title" name="sur_title" type="text" title="제목" value="" class="form-control" style="width:80%;" maxlength="100"></td>
                    </tr>
                    <tr>
                      <th>설문구분 <span><i class="fa required" title="필수항목" style="color:#e00;"></i></span></th>
                      <td>
                        <input type="radio" name="sur_type" value="1" id="sur_type_1" checked="checked" onclick="surChkType();">&nbsp;<label for="sur_type_1">종합</label>&nbsp;&nbsp;
                        <input type="radio" name="sur_type" value="2" id="sur_type_2" onclick="surChkType();">&nbsp;<label for="sur_type_2">강좌</label>
                        <input type="radio" name="sur_type" value="3" id="sur_type_3" onclick="surChkType();">&nbsp;<label for="sur_type_3">강좌(강사ID 기준)</label>
                        <div class="error_msg error_sur_type"></div>
                      </td>
                    </tr>
                    <tr id="tr_lec_div" style="display:none;">
                      <th>강좌구분 <span><i class="fa required" title="필수항목" style="color:#e00;"></i></span>
                        <br><input type="checkbox" name="check_all_lec_div" id="check_all_lec_div" value="" onclick="surChkAllLecDiv(this);" style="float:none;">
                      </th>
                      <td>
                        <span>
                          <span><input type="checkbox" name="lec_div[]" id="lec_div_5" value="5"><label for="lec_div_5">3월</label></span>
                          <span><input type="checkbox" name="lec_div[]" id="lec_div_6" value="6"><label for="lec_div_6">26년 4월</label></span>
                          <span><input type="checkbox" name="lec_div[]" id="lec_div_7" value="7"><label for="lec_div_7">26년 5월</label></span>
                          <span><input type="checkbox" name="lec_div[]" id="lec_div_8" value="8"><label for="lec_div_8">26년 6월</label></span>
                          <span><input type="checkbox" name="lec_div[]" id="lec_div_9" value="9"><label for="lec_div_9">26년 7월</label></span>
                          <span><input type="checkbox" name="lec_div[]" id="lec_div_10" value="10"><label for="lec_div_10">26년 8월</label></span>
                          <span><input type="checkbox" name="lec_div[]" id="lec_div_11" value="11"><label for="lec_div_11">26년 9월</label></span>
                          <span><input type="checkbox" name="lec_div[]" id="lec_div_12" value="12"><label for="lec_div_12">26년 10월</label></span>
                        </span>
                        <div class="error_msg error_lec_div"></div>
                        <div style="font-size:11px;color:#888;">(상태가 '<span style="color:#e00;">대기</span>'로 되어있는 강좌의 신청자는 설문에 참여할 수 없습니다.)</div>
                      </td>
                    </tr>
                    <tr id="tr_lec_pro_type" style="display:none;">
                      <th width="160">늘봄과정 <span><i class="fa required" title="필수항목" style="color:#e00;"></i></span></th>
                      <td>
                        <input type="checkbox" name="lec_pro_type_all" id="lec_pro_type_all" value="all" checked="checked" onclick="surChkLecProTypeAll();"><label for="lec_pro_type_all">전체</label>
                        &nbsp;<input type="checkbox" name="lec_pro_type_list[]" id="lec_pro_type_1" value="1" class="lec_pro_type" disabled=""><label for="lec_pro_type_1">방과후</label>
                        &nbsp;<input type="checkbox" name="lec_pro_type_list[]" id="lec_pro_type_2" value="2" class="lec_pro_type" disabled=""><label for="lec_pro_type_2">맞춤형</label>
                        &nbsp;<input type="checkbox" name="lec_pro_type_list[]" id="lec_pro_type_3" value="3" class="lec_pro_type" disabled=""><label for="lec_pro_type_3">돌봄</label>
                        <div class="error_msg error_lec_pro_type_list"></div>
                      </td>
                    </tr>
                    <tr>
                      <th>참여구분 <span><i class="fa required" title="필수항목" style="color:#e00;"></i></span></th>
                      <td>
                        <span>
                          <span><input id="ans_grp_2" name="ans_grp" type="radio" value="2" onclick="surChkAnsGrp();"> <label for="ans_grp_2">학생</label>&nbsp;&nbsp;</span>
                          <span><input id="ans_grp_102" name="ans_grp" type="radio" value="102" onclick="surChkAnsGrp();"> <label for="ans_grp_102">학부모</label></span>
                          <span><input id="ans_grp_4" name="ans_grp" type="radio" value="4" onclick="surChkAnsGrp();"> <label for="ans_grp_4">강사</label></span>
                          <span><input id="ans_grp_1" name="ans_grp" type="radio" value="1" onclick="surChkAnsGrp();"> <label for="ans_grp_1">교직원</label></span>
                          <div class="error_msg error_ans_grp"></div>
                        </span>
                      </td>
                    </tr>
                    <tr id="tr_ans_grade" style="display:none;">
                      <th>대상학년 <span><i class="fa required" title="필수항목" style="color:#e00;"></i></span>
                        <br><input type="checkbox" name="check_all_grade" id="check_all_grade" value="" onclick="surChkAllGrade(this);" style="float:none;">
                      </th>
                      <td>
                        <span>
                          <span><input type="checkbox" name="ans_grade[]" id="ans_grade_1" value="1"><label for="ans_grade_1">1학년</label></span>
                          <span><input type="checkbox" name="ans_grade[]" id="ans_grade_2" value="2"><label for="ans_grade_2">2학년</label></span>
                          <span><input type="checkbox" name="ans_grade[]" id="ans_grade_3" value="3"><label for="ans_grade_3">3학년</label></span>
                          <span><input type="checkbox" name="ans_grade[]" id="ans_grade_4" value="4"><label for="ans_grade_4">4학년</label></span>
                          <span><input type="checkbox" name="ans_grade[]" id="ans_grade_5" value="5"><label for="ans_grade_5">5학년</label></span>
                          <span><input type="checkbox" name="ans_grade[]" id="ans_grade_6" value="6"><label for="ans_grade_6">6학년</label></span>
                        </span>
                        <div class="error_msg error_ans_grade"></div>
                      </td>
                    </tr>
                    <tr id="tr_use_open_pwd" style="display:none;">
                      <th>참여 비밀번호<br>사용</th>
                      <td>
                        <input type="checkbox" name="use_open_pwd" id="use_open_pwd" value="Y"><label for="use_open_pwd">로그인 하지 않고 설문 참여 비밀번호로 설문 가능</label>
                        <p style="font-size:11px;color:#777;">(설문 비밀번호는 '환경설정 &gt; 기본설정'에서 설정할 수 있습니다.)</p>
                      </td>
                    </tr>
                    <tr>
                      <th>설문기간 <span><i class="fa required" title="필수항목" style="color:#e00;"></i></span></th>
                      <td>
                        <input id="sur_sdate" name="sur_sdate" value="" type="text" maxlength="10" title="시작일자" class="form-control form-date" style="width:160px; display:inline-block;" placeholder="YYYY-MM-DD"> ~
                        <input id="sur_edate" name="sur_edate" value="" type="text" maxlength="10" title="종료일자" class="form-control form-date" style="width:160px; display:inline-block;" placeholder="YYYY-MM-DD">
                        <div class="error_msg error_sur_sdate"></div>
                        <div class="error_msg error_sur_edate"></div>
                      </td>
                    </tr>
                    <tr>
                      <th>안내글</th>
                      <td>
                        <textarea name="sur_content" id="sur_content" class="form-control" rows="5" style="width:100%;resize:vertical;" placeholder="설문 안내글을 입력하세요..."></textarea>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </div>
            <div class="modal-footer" style="padding:10px 15px; display:flex; justify-content:flex-end; gap:6px;">
              <button type="button" onclick="surWriteSubmit();" class="btn btn-primary btn-sm" style="display:inline-flex;align-items:center;justify-content:center;height:30px;padding:0 14px;font-size:12px;line-height:1;"><i class="fa fa-save" style="margin-right:5px;"></i> 저장</button>
              <button type="button" onclick="closeSurModal('modal_ad_sur_write');" class="btn btn-default btn-sm" style="display:inline-flex;align-items:center;justify-content:center;height:30px;padding:0 14px;font-size:12px;line-height:1;">취소</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== [Modal] 설문 수정 (modal_ad_sur_modify) ==================== -->
      <div id="modal_ad_sur_modify" class="modal fade" tabindex="-1" role="dialog" style="display:none; z-index:9999; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); overflow-y:auto;">
        <div class="modal-dialog" style="width:700px; max-width:95%; margin:50px auto;">
          <div class="modal-content">
            <div class="modal-header" style="background:#337ab7; color:#fff; padding:10px 15px; display:flex; align-items:center; justify-content:space-between;">
              <h4 class="modal-title" style="margin:0; font-size:16px; font-weight:bold;"><i class="fa fa-pie-chart"></i> 설문 수정</h4>
              <button type="button" class="close" onclick="closeSurModal('modal_ad_sur_modify');" style="color:#fff; opacity:1; font-size:22px; background:none; border:none;">&times;</button>
            </div>
            <div class="modal-body" style="padding:15px; max-height:75vh; overflow-y:auto;">
              <form id="fm_mod" name="fm_mod" onsubmit="return surModifySubmit(this);" method="post">
                <input type="hidden" name="csrf_test_name" value="mock_csrf_sur">
                <input type="hidden" name="num" id="mod_sur_num" value="">
                <table class="table table-bordered table-hover list" style="margin:0; font-size:12px;">
                  <tbody>
                    <tr>
                      <th width="150">제목 <i class="fa required" title="필수항목" style="color:#e00;"></i></th>
                      <td><input id="mod_sur_title" name="sur_title" type="text" class="form-control" style="width:80%;" maxlength="100"></td>
                    </tr>
                    <tr>
                      <th>설문구분</th>
                      <td>
                        <input type="radio" name="mod_sur_type" value="1" id="mod_sur_type_1" onclick="surModChkType();">&nbsp;<label for="mod_sur_type_1">종합</label>&nbsp;&nbsp;
                        <input type="radio" name="mod_sur_type" value="2" id="mod_sur_type_2" onclick="surModChkType();">&nbsp;<label for="mod_sur_type_2">강좌</label>
                        <input type="radio" name="mod_sur_type" value="3" id="mod_sur_type_3" onclick="surModChkType();">&nbsp;<label for="mod_sur_type_3">강좌(강사ID 기준)</label>
                      </td>
                    </tr>
                    <tr id="mod_tr_lec_div" style="display:none;">
                      <th>강좌구분</th>
                      <td>
                        <span><input type="checkbox" name="mod_lec_div[]" id="mod_lec_div_5" value="5"><label for="mod_lec_div_5">3월</label></span>
                        <span><input type="checkbox" name="mod_lec_div[]" id="mod_lec_div_6" value="6"><label for="mod_lec_div_6">26년 4월</label></span>
                        <span><input type="checkbox" name="mod_lec_div[]" id="mod_lec_div_7" value="7"><label for="mod_lec_div_7">26년 5월</label></span>
                        <span><input type="checkbox" name="mod_lec_div[]" id="mod_lec_div_8" value="8"><label for="mod_lec_div_8">26년 6월</label></span>
                      </td>
                    </tr>
                    <tr>
                      <th>참여구분</th>
                      <td>
                        <input id="mod_ans_grp_2" name="mod_ans_grp" type="radio" value="2"> <label for="mod_ans_grp_2">학생</label>&nbsp;&nbsp;
                        <input id="mod_ans_grp_102" name="mod_ans_grp" type="radio" value="102"> <label for="mod_ans_grp_102">학부모</label>
                        <input id="mod_ans_grp_4" name="mod_ans_grp" type="radio" value="4"> <label for="mod_ans_grp_4">강사</label>
                        <input id="mod_ans_grp_1" name="mod_ans_grp" type="radio" value="1"> <label for="mod_ans_grp_1">교직원</label>
                      </td>
                    </tr>
                    <tr>
                      <th>대상학년</th>
                      <td>
                        <span><input type="checkbox" name="mod_ans_grade[]" id="mod_ans_grade_1" value="1"><label for="mod_ans_grade_1">1학년</label></span>
                        <span><input type="checkbox" name="mod_ans_grade[]" id="mod_ans_grade_2" value="2"><label for="mod_ans_grade_2">2학년</label></span>
                        <span><input type="checkbox" name="mod_ans_grade[]" id="mod_ans_grade_3" value="3"><label for="mod_ans_grade_3">3학년</label></span>
                        <span><input type="checkbox" name="mod_ans_grade[]" id="mod_ans_grade_4" value="4"><label for="mod_ans_grade_4">4학년</label></span>
                        <span><input type="checkbox" name="mod_ans_grade[]" id="mod_ans_grade_5" value="5"><label for="mod_ans_grade_5">5학년</label></span>
                        <span><input type="checkbox" name="mod_ans_grade[]" id="mod_ans_grade_6" value="6"><label for="mod_ans_grade_6">6학년</label></span>
                      </td>
                    </tr>
                    <tr>
                      <th>설문기간</th>
                      <td>
                        <input id="mod_sur_sdate" name="mod_sur_sdate" value="" type="text" maxlength="10" class="form-control form-date" style="width:160px; display:inline-block;" placeholder="YYYY-MM-DD"> ~
                        <input id="mod_sur_edate" name="mod_sur_edate" value="" type="text" maxlength="10" class="form-control form-date" style="width:160px; display:inline-block;" placeholder="YYYY-MM-DD">
                      </td>
                    </tr>
                    <tr>
                      <th>안내글</th>
                      <td><textarea name="mod_sur_content" id="mod_sur_content" class="form-control" rows="5" style="width:100%;resize:vertical;"></textarea></td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </div>
            <div class="modal-footer" style="padding:10px 15px; display:flex; justify-content:flex-end; gap:6px;">
              <button type="button" onclick="surModifySubmit();" class="btn btn-primary btn-sm" style="display:inline-flex;align-items:center;justify-content:center;height:30px;padding:0 14px;font-size:12px;line-height:1;"><i class="fa fa-save" style="margin-right:5px;"></i> 저장</button>
              <button type="button" onclick="closeSurModal('modal_ad_sur_modify');" class="btn btn-default btn-sm" style="display:inline-flex;align-items:center;justify-content:center;height:30px;padding:0 14px;font-size:12px;line-height:1;">취소</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== [Modal] 설문 문항 관리 (modal_ad_sur_que) ==================== -->
      <div id="modal_ad_sur_que" class="modal fade" tabindex="-1" role="dialog" style="display:none; z-index:9999; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); overflow-y:auto;">
        <div class="modal-dialog" style="width:800px; max-width:95%; margin:40px auto;">
          <div class="modal-content">
            <div class="modal-header" style="background:#337ab7; color:#fff; padding:10px 15px; display:flex; align-items:center; justify-content:space-between;">
              <h4 class="modal-title" style="margin:0; font-size:16px; font-weight:bold;"><i class="fa fa-question-circle"></i> 설문 문항 관리</h4>
              <button type="button" class="close" onclick="closeSurModal('modal_ad_sur_que');" style="color:#fff; opacity:1; font-size:22px; background:none; border:none;">&times;</button>
            </div>
            <div class="modal-body" style="padding:15px; max-height:75vh; overflow-y:auto;">
              <div class="panel-body" style="padding:8px 0; border-bottom:1px solid #ddd; margin-bottom:10px;">
                <form id="fm_que_list_search" name="fm_list_search" method="get">
                  <table class="table list" style="margin:0; font-size:12px; width:100%;">
                    <tbody>
                      <tr>
                        <th width="120">설문</th>
                        <td>
                          <select id="sur_que_sel" name="sur_num" onchange="onSurQueChange(this);" class="form-control input-sm PAD0" style="line-height:normal!important;box-sizing:border-box!important;height:30px;padding:0 24px 0 10px;vertical-align:middle;">
                            <option value="">== 설문 선택 ==</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              </div>
              <div style="display:flex; justify-content:flex-end; gap:6px; margin-bottom:10px;">
                <button type="button" onclick="openSurQueWrite();" class="btn btn-primary btn-sm" style="display:inline-flex;align-items:center;justify-content:center;height:30px;padding:0 14px;font-size:12px;line-height:1;">문항등록</button>
                <button type="button" onclick="openSurQueSort();" class="btn btn-warning btn-sm" style="display:inline-flex;align-items:center;justify-content:center;height:30px;padding:0 14px;font-size:12px;line-height:1;">출력순서 변경</button>
                <button type="button" onclick="openSurAnsModal();" class="btn btn-info btn-sm" style="display:inline-flex;align-items:center;justify-content:center;height:30px;padding:0 14px;font-size:12px;line-height:1;">결과보기</button>
              </div>
              <div id="sur_que_title_area" style="background:#f9f9f9; border:1px solid #ddd; border-radius:4px; padding:10px; margin-bottom:10px; font-size:12px; display:none;"></div>
              <div id="sur_que_list_area" style="font-size:12px;">
                <div style="text-align:center; padding:20px; color:#999;">설문을 선택하면 문항이 표시됩니다.</div>
              </div>
            </div>
            <div class="modal-footer" style="padding:10px 15px; display:flex; justify-content:flex-end; gap:6px;">
              <button type="button" onclick="closeSurModal('modal_ad_sur_que');" class="btn btn-default btn-sm" style="display:inline-flex;align-items:center;justify-content:center;height:30px;padding:0 14px;font-size:12px;line-height:1;">닫기</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== [Modal] 설문 결과 확인 (modal_ad_sur_ans) ==================== -->
      <div id="modal_ad_sur_ans" class="modal fade" tabindex="-1" role="dialog" style="display:none; z-index:9999; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); overflow-y:auto;">
        <div class="modal-dialog" style="width:900px; max-width:95%; margin:40px auto;">
          <div class="modal-content">
            <div class="modal-header" style="background:#337ab7; color:#fff; padding:10px 15px; display:flex; align-items:center; justify-content:space-between;">
              <h4 class="modal-title" style="margin:0; font-size:16px; font-weight:bold;"><i class="fa fa-bar-chart"></i> 설문 결과 확인</h4>
              <button type="button" class="close" onclick="closeSurModal('modal_ad_sur_ans');" style="color:#fff; opacity:1; font-size:22px; background:none; border:none;">&times;</button>
            </div>
            <div class="modal-body" style="padding:15px; max-height:75vh; overflow-y:auto;">
              <div id="sur_ans_info" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
                <div style="background:#f0f4ff; border:1px solid #c7d5f8; border-radius:6px; padding:10px; font-size:12px;">
                  <div style="font-weight:bold; color:#337ab7; margin-bottom:6px;"><i class="fa fa-info-circle"></i> 설문 정보</div>
                  <div id="sur_ans_title" style="color:#333;"></div>
                </div>
                <div style="background:#f0fff4; border:1px solid #b7e1c8; border-radius:6px; padding:10px; font-size:12px;">
                  <div style="font-weight:bold; color:#2d7a4a; margin-bottom:6px;"><i class="fa fa-users"></i> 참여 통계</div>
                  <div id="sur_ans_stats" style="color:#333;"></div>
                </div>
              </div>
              <div id="sur_ans_result_area" style="font-size:12px;">
                <div style="text-align:center; padding:20px; color:#999;">설문 결과를 불러오는 중...</div>
              </div>
              <div style="margin-top:12px;">
                <div style="font-weight:bold; margin-bottom:6px; font-size:13px; color:#337ab7;"><i class="fa fa-list"></i> 개별 응답 목록</div>
                <div class="table-responsive">
                  <table class="table table-bordered table-hover" style="font-size:11px;">
                    <thead style="background:#f5f5f5;">
                      <tr>
                        <th width="40" style="text-align:center;">번호</th>
                        <th style="text-align:center;">학생명</th>
                        <th style="text-align:center;">강좌명</th>
                        <th style="text-align:center;">참여일시</th>
                        <th width="60" style="text-align:center;">상세</th>
                      </tr>
                    </thead>
                    <tbody id="sur_ans_list_tbody">
                      <tr><td colspan="5" style="text-align:center;padding:15px;color:#999;">참여자 목록을 불러오는 중...</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="modal-footer" style="padding:10px 15px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <button type="button" onclick="exportSurExcel();" class="btn btn-success btn-sm" style="display:inline-flex;align-items:center;justify-content:center;height:30px;padding:0 14px;font-size:12px;line-height:1;"><i class="fa fa-file-excel-o" style="margin-right:5px;"></i> 엑셀 출력</button>
              </div>
              <button type="button" onclick="closeSurModal('modal_ad_sur_ans');" class="btn btn-default btn-sm" style="display:inline-flex;align-items:center;justify-content:center;height:30px;padding:0 14px;font-size:12px;line-height:1;">닫기</button>
            </div>
          </div>
        </div>
      </div>

      `;

// 교체 실행
const before = html.substring(0, startIdx);
const after = html.substring(endIdx);
const newHtml = before + newPanel + after;

fs.writeFileSync(indexPath, newHtml, 'utf8');
console.log('✅ index.html 설문관리 패널 + 4개 모달 교체 완료!');
console.log(`  원본 크기: ${html.length} bytes`);
console.log(`  신규 크기: ${newHtml.length} bytes`);

// 검증
const checkIds = [
  'panel_ad_sur_lists', 'surMainTable', 'surTableTbody',
  'fm_list', 'check_all', 'update_type', 'surPagination',
  'fm_del', 'del_num',
  'modal_ad_sur_write', 'sur_title', 'sur_type_1', 'lec_div_5',
  'ans_grp_2', 'ans_grade_1', 'use_open_pwd', 'sur_sdate', 'sur_edate', 'sur_content',
  'modal_ad_sur_modify', 'mod_sur_title', 'mod_sur_num',
  'modal_ad_sur_que', 'sur_que_sel', 'sur_que_list_area',
  'modal_ad_sur_ans', 'sur_ans_title', 'sur_ans_list_tbody'
];

const missing = checkIds.filter(id => !newHtml.includes(`id="${id}"`));
if (missing.length === 0) {
  console.log(`✅ 전수 DOM ID 검증 완료! (${checkIds.length}개 전부 존재, missing: [])`);
} else {
  console.error('❌ 누락된 DOM ID:', missing);
}
