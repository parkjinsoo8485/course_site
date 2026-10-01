import os

new_panel_ad_ref = '''      <!-- ==================== 5. 환불/취소관리 (/af/ad_ref/lists) 1:1 완벽 구현 ==================== -->
      <div class="submodel-panel" id="panel_ad_ref_lists" style="display: none;">
        <!-- 1. 타이틀 영역 -->
        <div id="contents_title">
          <i class="fa fa-file-text-o"></i> 환불/취소관리 <br><span class="title">광주풍향초등학교 늘봄학교</span>
          <p class="write_yun">
            <a href="/af/ad_lec/lists/sn/3267" onclick="switchSubmodelView(event, 'ad_lec_lists', '/af/ad_lec/lists/sn/3267')">
              <i class="fa fa-futbol-o"></i><br><span class="write">강좌관리</span>
            </a>
          </p>
        </div>

        <div id="contents">
          <div class="panel_main panel-default_main">
            <!-- 2. 매뉴얼 박스 -->
            <div class="new_help_manualbox hm_loca1">
              <p class="hm_title"><i class="fa fa-file-text-o" aria-hidden="true"></i>매뉴얼</p>
              <ul>
                <li>
                  <a href="https://www.dbdbschool.kr/help/go_data/num/85/data/link2" target="_blank" class="manual_btn"><i class="fa fa-download"></i> 환불자 관리</a>
                  <a href="https://www.dbdbschool.kr/help/go_data/num/85/data/link1" target="_blank" class="manual_btn" style="color:#c0392b;"><i class="fa fa-youtube-play"></i> <span class="txt">동영상</span></a>
                </li>
              </ul>
            </div>

            <!-- 3. 패널 헤딩 -->
            <div class="panel-heading">환불/취소 목록</div>

            <!-- 4. 검색 필터 바 -->
            <div class="panel-search">
              <form name="fm_list_search_ref" id="fm_list_search_ref" method="get" onsubmit="event.preventDefault(); filterRefunds();" accept-charset="utf-8">
                <ul>
                  <li class="PAD0 select_box_menu_parent">
                    <a href="#none;" id="main_control_box_btn01_ref" class="main_control_box_btn btn btn-default btn-sm" style="height:30px; padding:0 10px; display:inline-flex; align-items:center; justify-content:center; line-height:1;">상세검색 <strong>열기</strong><span class="fa fa-angle-down"></span></a>
                    <span class="main_control_box_module" id="main_control_box_search_ref">
                      <select name="sld" id="ref_sel_div" onchange="filterRefunds();" class="form-control input-sm PAD0 select_box_menu_width" style="height:30px; line-height:normal !important; box-sizing:border-box !important; vertical-align:middle;">
                        <option value="all">=강좌구분=</option>
                        <option value="5">3월</option>
                        <option value="6">26년 4월</option>
                        <option value="7">26년 5월</option>
                        <option value="8">26년 6월</option>
                        <option value="9">26년 7월</option>
                        <option value="10" selected="selected">26년 8월</option>
                        <option value="11">26년 9월</option>
                      </select>

                      <select name="slp" id="ref_sel_pro_type" onchange="filterRefunds();" class="form-control input-sm PAD0 select_box_menu_width" style="height:30px; line-height:normal !important; box-sizing:border-box !important; vertical-align:middle;">
                        <option value="all">=늘봄과정=</option>
                        <option value="1">방과후</option>
                        <option value="2">맞춤형</option>
                        <option value="3">돌봄</option>
                      </select>

                      <select name="sln" id="ref_sel_course" onchange="filterRefunds();" class="form-control input-sm PAD0 select_box_menu_width" style="height:30px; max-width:240px; line-height:normal !important; box-sizing:border-box !important; vertical-align:middle;">
                        <option value="">=강좌전체=</option>
                      </select>

                      <select name="sgr" id="ref_sel_grade" class="form-control input-sm PAD0" onchange="filterRefunds();" style="height:30px; line-height:normal !important; box-sizing:border-box !important; vertical-align:middle;">
                        <option value="">=학년=</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                      </select>

                      <select name="scl" id="ref_sel_class" class="form-control input-sm PAD0" onchange="filterRefunds();" style="height:30px; line-height:normal !important; box-sizing:border-box !important; vertical-align:middle;">
                        <option value="">=반=</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select>

                      <select name="st" id="ref_sel_type" class="form-control input-sm PAD0" style="height:30px; line-height:normal !important; box-sizing:border-box !important; vertical-align:middle;">
                        <option value="name">이름</option>
                        <option value="tel">연락처</option>
                        <option value="status">신청상태</option>
                      </select>

                      <input type="text" name="sw" id="ref_search_word" value="" size="15" maxlength="15" class="form-control input-sm size30" style="width: 120px; height:30px; vertical-align:middle; display:inline-block;" placeholder="검색어">
                      <input type="submit" value="검색" class="btn btn-default btn-sm" style="height:30px; padding:0 14px; display:inline-flex; align-items:center; justify-content:center; line-height:1;">
                      <input type="button" value="전체" class="btn btn-default btn-sm" onclick="resetRefundSearch();" style="height:30px; padding:0 14px; display:inline-flex; align-items:center; justify-content:center; line-height:1;">
                    </span>
                  </li>
                </ul>
              </form>
            </div>

            <!-- 5. 액션 버튼 바 -->
            <div class="panel-body">
              <ul class="list-inline" style="margin-bottom:0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
                <li style="display:inline-flex; align-items:center; gap:6px;">
                  <a href="/af/ad_app/lists/sn/3267" onclick="switchSubmodelView(event, 'ad_app_lists', '/af/ad_app/lists/sn/3267')" class="btn btn-default btn-sm" style="height:30px; padding:0 14px; display:inline-flex; align-items:center; justify-content:center; line-height:1;">신청자목록</a>
                  <a href="/af/ad_wait/lists/sn/3267" onclick="switchSubmodelView(event, 'ad_wait_lists', '/af/ad_wait/lists/sn/3267')" class="btn btn-default btn-sm" style="height:30px; padding:0 14px; display:inline-flex; align-items:center; justify-content:center; line-height:1;">대기자목록</a>
                </li>
                <li class="pull-right PAD0" style="display:inline-flex; align-items:center; gap:6px;">
                  <input type="button" id="btn_ref_sin" value="환불/취소등록" class="btn btn-primary btn-sm" onclick="openRefundSinModal();" style="height:30px; padding:0 14px; display:inline-flex; align-items:center; justify-content:center; line-height:1; font-weight:700;">
                  <input type="button" id="btn_ref_batch" value="환불/취소일괄등록" class="btn btn-warning btn-sm" onclick="openRefundBatchModal();" style="height:30px; padding:0 14px; display:inline-flex; align-items:center; justify-content:center; line-height:1; color:#fff; font-weight:700;">
                  <input type="button" id="btn_ref_excel" value="검색결과출력" class="btn btn-success btn-sm" onclick="exportRefundExcel();" style="height:30px; padding:0 14px; display:inline-flex; align-items:center; justify-content:center; line-height:1; color:#fff; font-weight:700;">
                </li>
              </ul>
            </div>

            <!-- 6. 리스트 테이블 -->
            <form action="/af/ad_ref/lists/sn/3267" name="fm_list_ref" id="fm_list_ref" method="post" accept-charset="utf-8">
              <div id="main_table_responsive_container" class="table-responsive table-responsive-container" style="background:#fff;">
                <table class="table AlignCenter table-hover_sm list MAT0">
                  <thead>
                    <tr style="--sticky-row-top: 0px;">
                      <th width="40"><input type="checkbox" name="check_all" id="chk_all_ref" onclick="toggleAllRefundCheckboxes(this);" title="전체선택/취소" style="float: none;"></th>
                      <th width="45">연번</th>
                      <th width="75">신청상태</th>
                      <th width="85">신청유형<br>(지원금)</th>
                      <th width="75">구분<br>(늘봄과정)</th>
                      <th>강좌명</th>
                      <th width="45">학년</th>
                      <th width="40">반</th>
                      <th width="45">번호</th>
                      <th width="70">이름</th>
                      <th width="115">연락처</th>
                      <th width="90">최종수강일</th>
                      <th width="85">수강료<br>(환불금액)</th>
                      <th width="75">수용비<br>(환불금액)</th>
                      <th width="75">교재비<br>(환불금액)</th>
                      <th width="75">재료비<br>(환불금액)</th>
                      <th width="75">징수 전 취소</th>
                      <th width="90">적용일자</th>
                      <th width="90">비고</th>
                      <th width="90">등록일자</th>
                      <th width="45">삭제</th>
                    </tr>
                  </thead>
                  <tbody id="refundTbody">
                    <tr><td colspan="21" class="center" style="padding:40px;">환불 목록을 불러오는 중입니다...</td></tr>
                  </tbody>
                </table>
              </div>

              <!-- 7. 하단 일괄처리 및 통계 바 (공식 레이아웃 1:1) -->
              <div class="panel-body MAT30" style="text-align:center;">
                <ul style="list-style:none; padding:0; margin:0; display:flex; justify-content:space-between; align-items:center;">
                  <li class="PAD0" style="display:inline-flex; align-items:center; gap:6px;">
                    <select name="update_type" id="ref_bulk_status_sel" class="form-control input-sm PAD0" style="height:30px; width:auto; line-height:normal !important; box-sizing:border-box !important; vertical-align:middle;">
                      <option value="">=== 일괄처리 ===</option>
                      <option value="강사확인">강사확인</option>
                      <option value="처리완료">처리완료</option>
                      <option value="접수">접수 대기</option>
                      <option value="">---------------</option>
                      <option value="del">환불/취소 삭제</option>
                    </select>
                    <input type="button" class="btn btn-default btn-sm" value="적용하기" onclick="applyRefundBulkAction();" style="height:30px; padding:0 14px; display:inline-flex; align-items:center; justify-content:center; line-height:1;">
                  </li>
                  <li style="text-align:right;" class="MAlignCenter">
                    <span style="font-size:12px; color:#777;">
                      총 <strong id="refundTotalCount" style="color:#337ab7;">0</strong>건 / 환불총액 <strong id="refundTotalSum" style="color:#d9534f;">0</strong>원
                    </span>
                  </li>
                </ul>
              </div>
            </form>

            <!-- 8. 도움말 박스 -->
            <div class="help_box">
              <ul>
                <li>신청상태가 '접수'인 경우에만 취소할 수 있습니다.</li>
                <li>신청상태('강사확인'): 강사가 환불/취소 관련 내용을 확인 후 관리자에 제출한 상태입니다.</li>
                <li>신청상태('처리완료'): 관리자가 환불/취소 관련 처리를 완료한 후 행정실에 제출 한 상태입니다.</li>
                <li>환불금액 산출 기준: 수업 시작 전 100%, 1/3 경과 전 2/3 반환, 1/2 경과 전 1/2 반환, 1/2 경과 후 반환하지 않음 (평생교육법/소비자분쟁해결기준 준용).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>'''

for filepath in ['course_site/af/ad_lec/lists/sn/index.html', 'course_site/af/ad_lec/lists/sn/3267/index.html']:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    start_idx = content.find('<div class="submodel-panel" id="panel_ad_ref_lists"')
    if start_idx == -1:
        print(f'ERROR: panel_ad_ref_lists not found in {filepath}')
        continue

    # Find the next submodel-panel after this
    end_idx = content.find('<!-- ==================== 6. 결석/귀가신청', start_idx)
    if end_idx == -1:
        end_idx = content.find('<div class="submodel-panel" id="panel_ad_abs_lists"', start_idx)

    if end_idx == -1:
        print(f'ERROR: end of panel_ad_ref_lists not found in {filepath}')
        continue

    # Also check if there is comment before panel_ad_ref_lists
    comment_idx = content.rfind('<!-- ==================== 5. 환불/취소관리', 0, start_idx)
    replace_start = comment_idx if comment_idx != -1 and (start_idx - comment_idx < 120) else start_idx

    new_content = content[:replace_start] + new_panel_ad_ref + '\n\n      ' + content[end_idx:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f'Successfully updated {filepath}')

