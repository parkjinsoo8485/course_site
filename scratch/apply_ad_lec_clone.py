import sys
sys.stdout.reconfigure(encoding='utf-8')

new_panel_html = """      <!-- ==================== 1. 강좌관리 (/af/ad_lec/lists) 1:1 원본 완벽 모방 ==================== -->
      <div class="submodel-panel active" id="panel_ad_lec_lists">
        <!-- 1. 타이틀 영역 -->
        <div id="contents_title">
          <i class="fa fa-file-text-o"></i> 강좌관리 <br><span class="title">광주풍향초등학교 늘봄학교</span>
          <p class="write_yun">
            <a href="/af/ad_app/lists/sn/3267" onclick="switchSubmodelView(event, 'ad_app_lists', '/af/ad_app/lists/sn/3267')">
              <i class="fa fa-slideshare"></i><br><span class="write">신청자관리</span>
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
                  <a href="https://www.dbdbschool.kr/help/go_data/num/74/data/link1" target="_blank" class="manual_btn"><i class="fa fa-youtube-play"></i> 강좌등록</a>
                  <a href="https://s3-ap-northeast-2.amazonaws.com/www.dbdbschool.kr/doc/faq/after/%EB%A7%A4%EB%89%B4%EC%96%BC_05_%EB%B0%A9%EA%B3%BC%ED%9B%84%ED%95%99%EA%B5%90%20%EC%9B%94%EB%B3%84%20%EC%88%98%EA%B0%95%EC%8B%A0%EC%B2%AD%20%EB%A7%88%EA%B0%90%20%EB%B0%8F%20%EB%8B%A4%EC%9D%8C%20%EB%8B%AC%20%EC%88%98%EA%B0%95%EC%8B%A0%EC%B2%AD%20%EC%A4%80%EB%B9%84%20%EC%A0%88%EC%B0%A8.hwp" target="_blank" class="manual_btn"><i class="fa fa-download"></i> 월마감 &amp; 다음달 준비절차</a>
                </li>
              </ul>
            </div>

            <!-- 3. 제목 및 상단 안내 메시지 -->
            <div class="panel-heading">목록</div>
            <div class="panel-body" style="padding:0;">
              <div class="top_message_box">
                <p><span class="text-danger"><i class="fa fa-info-circle"></i> 수강신청 시작시간은 학교수 제한이 있으므로 가정통신문 발송 전에 반드시 <a href="/af/ad_time/lists/sn/3267" onclick="switchSubmodelView(event, 'ad_time_lists', '/af/ad_time/lists/sn/3267')"><u>수강신청 기간을 미리 설정</u></a>하세요.</span></p>
                <p class="MAT5"><span class="text-danger"><i class="fa fa-info-circle"></i> 자주 하는 질문이 "<a href="/af/ad_faq/main/sn/3267" onclick="switchSubmodelView(event, 'ad_faq_main', '/af/ad_faq/main/sn/3267')"><u>매뉴얼</u></a>"에 정리되어 있으니 이곳을 참고하시고 기타 문의사항은 "<a href="/af/qanda/lists/sn/3267" onclick="switchSubmodelView(event, 'qanda_lists', '/af/qanda/lists/sn/3267')"><u>고객지원 게시판</u></a>"에 접수 바랍니다.</span></p>
              </div>
            </div>

            <!-- 4. 원본 상세검색 바 -->
            <div class="MAT0 panel-search" style="margin-bottom:2px;">
              <form action="/af/ad_lec/lists/sn/3267" name="fm_list_search" id="fm_list_search" method="get" onsubmit="event.preventDefault(); loadLectures();" accept-charset="utf-8">
                <ul>
                  <li class="PAD0 select_box_menu_parent">
                    <a href="#none;" id="main_control_box_btn01" class="main_control_box_btn btn btn-default btn-sm" onclick="toggleDetailedSearch(event)">상세검색 <strong>열기</strong><span class="fa fa-angle-down"></span></a>
                    <span class="main_control_box_module" id="main_control_box_search">
                      <select id="sel_led_div" name="sld" onchange="loadLectures();" class="form-control input-sm PAD0 select_box_menu_width">
                        <option value="all">=구분전체=</option>
                        <option value="5">3월</option>
                        <option value="6">26년 4월</option>
                        <option value="7">26년 5월</option>
                        <option value="8">26년 6월</option>
                        <option value="9">26년 7월</option>
                        <option value="10">26년 8월</option>
                        <option value="11" selected="selected">26년 9월</option>
                      </select>

                      <select id="s_lec_pro_type" name="slp" onchange="loadLectures();" class="form-control input-sm PAD0 select_box_menu_width">
                        <option value="all">=늘봄과정=</option>
                        <option value="1">방과후</option>
                        <option value="2">맞춤형</option>
                        <option value="3">돌봄</option>
                      </select>

                      <select name="sls" id="sls" onchange="loadLectures();" class="form-control input-sm PAD0">
                        <option value="all">=상태전체=</option>
                        <option value="1">출력</option>
                        <option value="0">대기</option>
                        <option value="2">종료</option>
                      </select>

                      <select name="s_grade" id="s_grade" class="form-control input-sm PAD0" onchange="loadLectures();">
                        <option value="">=학년=</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                      </select>

                      <select name="st" id="st" class="form-control input-sm PAD0">
                        <option value="lec_name">강좌명</option>
                        <option value="tea_id">강사ID</option>
                      </select>

                      <input type="text" name="sw" id="s_word" value="" size="15" maxlength="15" class="form-control input-sm size25" style="width: 12%;" placeholder="검색어" onkeyup="if(event.key==='Enter') loadLectures()">
                      <input type="submit" value="검색" class="btn btn-default input-sm">
                      <input type="button" value="전체" class="btn btn-default input-sm" onclick="resetLectureFilters();">
                      <input type="button" value="검색결과엑셀출력" class="btn btn-default input-sm" onclick="exportToExcel();">
                    </span>
                  </li>
                </ul>
              </form>
            </div>

            <!-- 5. 액션 버튼 & 테이블 컨테이너 폼 -->
            <form action="/af/ad_lec/lists/sn/3267" name="fm_list" id="fm_list" method="post" onsubmit="return false;" accept-charset="utf-8">
              <div class="panel-body">
                <ul>
                  <li class="pull-left PAD0">
                    <a href="/af/ad_att/excel/p/1/sn/3267/sld/10/sof/ln/sot/asc" id="btn_action_att" onclick="handleAttendanceExcel(event, this.getAttribute('href'))" class="btn btn-success btn-sm" style="display:inline-flex; align-items:center; text-decoration:none;"><i class="fa fa-file-excel-o" style="margin-right:4px;"></i>출석부 출력</a>
                  </li>
                  <li class="pull-right PAD0" style="position:relative;">
                    <input type="button" value="강좌 등록" id="btn_action_write" class="btn btn-primary btn-sm" onclick="handleActionUrl(event, 'write', openAddModal)">
                    <a href="#none;" id="main_control_box_btn02" class="main_control_box_btn btn btn-default btn-sm" onclick="toggleExtraMenu(event)">추가기능..<span class="fa fa-angle-down"></span></a>
                    <span class="main_control_box_module" id="main_control_box_drop" style="display:none; position:absolute; right:0; top:35px; z-index:100; background:#fff; border:1px solid #ccc; padding:6px; box-shadow:0 2px 6px rgba(0,0,0,0.15); border-radius:4px; min-width:140px; text-align:left;">
                      <a href="/af/ad_lec/input/p/1/sn/3267/sld/10/sof/ln/sot/asc" id="btn_action_input" class="btn btn-warning btn-sm" onclick="handleActionUrl(event, 'input', openBatchUploadModal)" style="display:block; margin-bottom:4px; text-align:center;">강좌 일괄입력</a>
                      <a href="/af/ad_lec/modifyField/p/1/sn/3267/sld/10/sof/ln/sot/asc" id="btn_action_modify" class="btn btn-info btn-sm" onclick="handleActionUrl(event, 'modifyField', openBatchModifyModal)" style="display:block; margin-bottom:4px; text-align:center;">강좌 일괄수정</a>
                      <a href="/af/ad_lec/copy/p/1/sn/3267/sld/10/sof/ln/sot/asc" id="btn_action_copy" class="btn btn-info btn-sm" onclick="handleActionUrl(event, 'copy', openBatchCopyModal)" style="display:block; margin-bottom:4px; text-align:center;">강좌 일괄복사</a>
                      <input type="button" value="강좌 통계" id="btn_action_stat" class="btn btn-default btn-sm btn-sm_new" onclick="handleActionUrl(event, 'stat', openStatModal)" style="display:block; width:100%;">
                    </span>
                  </li>
                </ul>
              </div>

              <!-- 강의시간 오류 메시지 영역 -->
              <div id="lec_time_message" class="panel-body" style="padding:0; display:none;">
                <div class="top_message_box">
                  <p><span class="text-danger"><i class="fa fa-info-circle"></i> 설정된 강의시간 중 '시간' 형식이 올바르지 않은 강좌가 있습니다. <u>'*'가 표시된 강의시간은 확인 바랍니다.</u></span></p>
                </div>
              </div>

              <!-- 6. 메인 테이블 컨테이너 (18개 정통 헤더) -->
              <div id="main_table_responsive_container" class="table-responsive-container" style="background:#fff;">
                <table class="table AlignCenter table-hover_sm list MAT0">
                  <thead>
                    <tr style="--sticky-row-top: 0px;">
                      <th width="50"><input type="checkbox" name="check_all" id="check_all" value="" onclick="chk_all(this);" title="전체선택/취소" style="float: none;"></th>
                      <th class="size15" width="60"><a href="#none;" class="link_type" onclick="toggleSort('num')">연번</a></th>
                      <th width="50">수정</th>
                      <th width="90">구분<br>(늘봄과정)</th>
                      <th class="size40"><a href="#none;" class="link_type" onclick="toggleSort('title')">강좌명<i class="fa fa-long-arrow-up" style="margin-left:1px;"></i></a></th>
                      <th width="90"><a href="#none;" class="link_type" onclick="toggleSort('teacher')">강사ID</a></th>
                      <th width="70"><a href="#none;" class="link_type">신청</a><br>/<a href="#none;" class="link_type">정원</a></th>
                      <th width="80"><a href="#none;" class="link_type">대기자</a><br>/<a href="#none;" class="link_type">정원</a></th>
                      <th width="90"><a href="#none;" class="link_type">학년</a></th>
                      <th width="110"><a href="#none;" class="link_type">운영기간</a></th>
                      <th width="120">강의시간</th>
                      <th width="60">수강료</th>
                      <th width="60"><a href="#none;" class="link_type">수강료<br>출력</a></th>
                      <th width="60"><a href="#none;" class="link_type">강사<br>마감</a></th>
                      <th width="60"><a href="#none;" class="link_type">강사<br>편집</a></th>
                      <th width="60"><a href="#none;" class="link_type">환불<br>마감</a></th>
                      <th><a href="#none;" class="link_type">상태</a></th>
                      <th width="50">삭제</th>
                    </tr>
                  </thead>
                  <tbody id="lectureTbody">
                    <tr><td colspan="18" class="center" style="padding:40px;">데이터를 불러오는 중입니다...</td></tr>
                  </tbody>
                </table>
              </div>

              <!-- 7. 테이블 하단 일괄적용 셀렉트 박스 및 적용 버튼 -->
              <div class="panel-body MAT30" style="text-align:center;">
                <ul>
                  <li class="PAD0" style="float:left;">
                    <select name="update_type" id="update_type" class="form-control" style="width: auto; display: inline-block;">
                      <option value="">===== 일괄적용 ======</option>
                      <option value="status_1">[상태변경] 출력</option>
                      <option value="status_0">[상태변경] 대기</option>
                      <option value="status_2">[상태변경] 종료</option>
                      <option value="">-------------------------------</option>
                      <option value="tea_finish_Y">[강사마감] Yes</option>
                      <option value="tea_finish_N">[강사마감] No</option>
                      <option value="">-------------------------------</option>
                      <option value="tea_edit_Y">[강사편집] Yes</option>
                      <option value="tea_edit_N">[강사편집] No</option>
                      <option value="">-------------------------------</option>
                      <option value="refund_status_Y">[환불마감] Yes</option>
                      <option value="refund_status_N">[환불마감] No</option>
                      <option value="">-------------------------------</option>
                      <option value="tea_id_chk_Y">[강사ID 중복 신청 불가] Yes</option>
                      <option value="tea_id_chk_N">[강사ID 중복 신청 불가] No</option>
                      <option value="">-------------------------------</option>
                      <option value="lec_time_not_chk_Y">[시간 중복 허용] Yes</option>
                      <option value="lec_time_not_chk_N">[시간 중복 허용] No</option>
                      <option value="">-------------------------------</option>
                      <option value="pay_view_Y">[수강료출력] Yes</option>
                      <option value="pay_view_N">[수강료출력] No</option>
                      <option value="">-------------------------------</option>
                      <option value="pay_update">[신청자 수강료] 전체 적용</option>
                      <option value="pay_use_cost_update">[신청자 수용비] 전체 적용</option>
                      <option value="pay_book_update">[신청자 교재비] 전체 적용</option>
                      <option value="pay_item_update">[신청자 재료비] 전체 적용</option>
                      <option value="">-------------------------------</option>
                      <option value="del">강좌 삭제</option>
                      <option value="">-------------------------------</option>
                      <option value="sdel">신청자 삭제</option>
                      <option value="">-------------------------------</option>
                      <option value="wdel">대기자 삭제</option>
                    </select>
                    <input type="button" id="btn_bulk_update_submit" class="btn btn-default" value="적용하기" onclick="handleLectureBulkAction()">
                  </li>
                  <li style="text-align:right;" class="MAlignCenter">
                  </li>
                </ul>
              </div>
            </form>
          </div>

          <!-- 8. 원본 하단 도움말 박스 (help_box) -->
          <div class="help_box">
            <ul>
              <li> 수강료 출력 : 학생의 신청 조회 화면에 <span class="text-danger">수강료 정보를 출력합니다.</span></li>
              <li> 강사 마감 : 강사는 신청자 등록 및 수강료 정보를 수정할 수 <span class="text-danger">없습니다.</span></li>
              <li> 강사 편집 : 강사는 강좌를 수정 및 삭제할 수 <span class="text-danger">있습니다(강사 마감 전, 대기 중인 강좌만 가능).</span></li>
              <li> 상태(출력) : 학생, 강사 화면에 <span class="text-danger">출력합니다.</span></li>
              <li> 상태(대기) : 학생 화면에 <span class="text-danger">출력하지 않습니다.</span></li>
              <li> 상태(종료) : 학생, 강사 화면에 출력은 하지만, <span class="text-danger">신청은 불가능합니다.</span></li>
            </ul>
          </div>
        </div>
      </div>
"""

# Apply replacement to course_site/af/ad_lec/lists/sn/index.html
with open('course_site/af/ad_lec/lists/sn/index.html', encoding='utf-8') as f:
    content = f.read()

start_marker = '<!-- ==================== 1. 강좌관리 (/af/ad_lec/lists) ==================== -->'
end_marker = '<!-- ==================== 2. 신청자관리 (/af/ad_app/lists) ==================== -->'

p1 = content.find(start_marker)
p2 = content.find(end_marker)

if p1 != -1 and p2 != -1:
    updated = content[:p1] + new_panel_html + "\n\n      " + content[p2:]
    with open('course_site/af/ad_lec/lists/sn/index.html', 'w', encoding='utf-8') as out:
        out.write(updated)
    print("SUCCESS: Replaced #panel_ad_lec_lists with exact 1:1 original clone!")
else:
    print(f"FAILED: Markers not found. p1={p1}, p2={p2}")
