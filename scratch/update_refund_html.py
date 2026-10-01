import re

panel_ad_ref_html = '''      <!-- ==================== 5. 환불/취소관리 (/af/ad_ref/lists) ==================== -->
      <div class="submodel-panel" id="panel_ad_ref_lists" style="display: none;">
        <div id="contents_box">
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
              <!-- 매뉴얼 박스 -->
              <div class="new_help_manualbox hm_loca1">
                <p class="hm_title"><i class="fa fa-file-text-o" aria-hidden="true"></i>매뉴얼</p>
                <ul>
                  <li><a href="https://www.dbdbschool.kr/help/go_data/num/77/data/link1" target="_blank" class="manual_btn"><i class="fa fa-youtube-play"></i> 환불/취소 관리</a></li>
                </ul>
              </div>

              <!-- 패널 헤딩 -->
              <div class="panel-heading">환불/취소 신청 목록</div>

              <!-- 검색 필터 바 -->
              <div class="panel-search MAT0" style="margin-bottom:2px;">
                <form name="fm_list_search_ref" id="fm_list_search_ref" method="get" onsubmit="event.preventDefault(); filterRefunds();" accept-charset="utf-8">
                  <ul>
                    <li class="PAD0 select_box_menu_parent">
                      <span class="main_control_box_module" id="main_control_box_search_ref" style="display:inline-flex; align-items:center; flex-wrap:wrap; gap:4px;">
                        <select name="sld" id="ref_sel_div" onchange="filterRefunds();" class="form-control input-sm PAD0 select_box_menu_width" style="height:30px; line-height:normal !important; box-sizing:border-box !important;">
                          <option value="all">=강좌구분=</option>
                          <option value="3월">3월</option>
                          <option value="26년 4월">26년 4월</option>
                          <option value="26년 5월">26년 5월</option>
                          <option value="26년 6월">26년 6월</option>
                          <option value="26년 7월">26년 7월</option>
                          <option value="26년 8월" selected="selected">26년 8월</option>
                          <option value="26년 9월">26년 9월</option>
                        </select>

                        <select name="slp" id="ref_sel_pro_type" onchange="filterRefunds();" class="form-control input-sm PAD0 select_box_menu_width" style="height:30px; line-height:normal !important; box-sizing:border-box !important;">
                          <option value="all">=늘봄과정=</option>
                          <option value="방과후">방과후</option>
                          <option value="맞춤형">맞춤형</option>
                          <option value="돌봄">돌봄</option>
                        </select>

                        <select name="sln" id="ref_sel_course" onchange="filterRefunds();" class="form-control input-sm PAD0 select_box_menu_width" style="height:30px; max-width:240px; line-height:normal !important; box-sizing:border-box !important;">
                          <option value="">=강좌전체=</option>
                        </select>

                        <select name="sgr" id="ref_sel_grade" class="form-control input-sm PAD0" onchange="filterRefunds();" style="height:30px; line-height:normal !important; box-sizing:border-box !important;">
                          <option value="">=학년=</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                        </select>

                        <select name="scl" id="ref_sel_class" class="form-control input-sm PAD0" onchange="filterRefunds();" style="height:30px; line-height:normal !important; box-sizing:border-box !important;">
                          <option value="">=반=</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                        </select>

                        <select name="st" id="ref_sel_type" class="form-control input-sm PAD0" style="height:30px; line-height:normal !important; box-sizing:border-box !important;">
                          <option value="name">이름</option>
                          <option value="tel">연락처</option>
                          <option value="status">신청상태</option>
                        </select>

                        <input type="text" name="sw" id="ref_search_word" value="" size="15" maxlength="15" class="form-control input-sm" style="height:30px; width:120px;" placeholder="검색어">
                        <input type="submit" value="검색" class="btn btn-default btn-sm" style="height:30px; padding:0 12px; display:inline-flex; align-items:center; justify-content:center;">
                        <input type="button" value="전체" class="btn btn-default btn-sm" onclick="resetRefundSearch();" style="height:30px; padding:0 12px; display:inline-flex; align-items:center; justify-content:center;">
                      </span>
                    </li>
                  </ul>
                </form>
              </div>

              <!-- 액션 버튼 바 (30px 높이 일관화, 1열 정렬) -->
              <div class="panel-body" style="padding: 10px 0;">
                <ul class="list-inline" style="margin-bottom:0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                  <li style="display:inline-flex; align-items:center; gap:6px;">
                    <a href="/af/ad_app/lists/sn/3267" onclick="switchSubmodelView(event, 'ad_app_lists', '/af/ad_app/lists/sn/3267')" class="btn btn-default btn-sm" style="height:30px; padding:0 14px; display:inline-flex; align-items:center; justify-content:center; line-height:1;">신청자목록</a>
                    <a href="/af/ad_wait/lists/sn/3267" onclick="switchSubmodelView(event, 'ad_wait_lists', '/af/ad_wait/lists/sn/3267')" class="btn btn-default btn-sm" style="height:30px; padding:0 14px; display:inline-flex; align-items:center; justify-content:center; line-height:1;">대기자목록</a>
                  </li>
                  <li class="PAD0" style="display:inline-flex; align-items:center; gap:6px;">
                    <button type="button" id="btn_ref_sin" class="btn btn-primary btn-sm" onclick="openRefundSinModal();" style="height:30px; padding:0 14px; display:inline-flex; align-items:center; justify-content:center; line-height:1; font-weight:700;">환불/취소등록</button>
                    <button type="button" id="btn_ref_batch" class="btn btn-warning btn-sm" onclick="openRefundBatchModal();" style="height:30px; padding:0 14px; display:inline-flex; align-items:center; justify-content:center; line-height:1; color:#fff; font-weight:700;">환불/취소일괄등록</button>
                    <button type="button" id="btn_ref_excel" class="btn btn-success btn-sm" onclick="exportRefundExcel();" style="height:30px; padding:0 14px; display:inline-flex; align-items:center; justify-content:center; line-height:1; color:#fff; font-weight:700;"><i class="fa fa-file-excel-o"></i> 검색결과출력</button>
                  </li>
                </ul>
              </div>

              <!-- 일괄 상태 처리 바 -->
              <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; padding:8px 12px; border-radius:4px; margin-bottom:10px; font-size:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span>선택 항목 일괄 처리:</span>
                  <button type="button" class="btn btn-primary btn-xs" style="height:26px; padding:0 10px; display:inline-flex; align-items:center;" onclick="handleBulkRefundStatus('강사확인')"><i class="fa fa-check"></i> 강사확인</button>
                  <button type="button" class="btn btn-success btn-xs" style="height:26px; padding:0 10px; display:inline-flex; align-items:center;" onclick="handleBulkRefundStatus('처리완료')"><i class="fa fa-check-circle"></i> 처리완료</button>
                  <button type="button" class="btn btn-default btn-xs" style="height:26px; padding:0 10px; display:inline-flex; align-items:center;" onclick="handleBulkRefundStatus('접수')"><i class="fa fa-clock-o"></i> 접수 대기</button>
                  <button type="button" class="btn btn-danger btn-xs" style="height:26px; padding:0 10px; display:inline-flex; align-items:center;" onclick="handleBulkRefundDelete()"><i class="fa fa-trash-o"></i> 선택 삭제</button>
                </div>
                <div>
                  <span style="color:#64748b;">(총 <strong id="refundTotalCount" style="color:#2563eb;">0</strong>건 / 환불총액 <strong id="refundTotalSum" style="color:#d9534f;">0</strong>원)</span>
                </div>
              </div>

              <!-- 20개 컬럼 테이블 -->
              <div class="table-responsive">
                <table class="table table-bordered table-hover list" style="width:100%; border-collapse:collapse; font-size:12px; text-align:center; vertical-align:middle;">
                  <thead>
                    <tr style="background:#f5f5f5;">
                      <th style="width:36px; padding:6px 2px;"><input type="checkbox" id="chk_all_ref" onclick="toggleAllRefundCheckboxes(this);"></th>
                      <th style="width:40px; padding:6px 2px;">연번</th>
                      <th style="width:75px; padding:6px 2px;">신청상태</th>
                      <th style="width:85px; padding:6px 2px;">신청유형<br>(지원금)</th>
                      <th style="width:70px; padding:6px 2px;">구분<br>(늘봄과정)</th>
                      <th style="padding:6px 6px;">강좌명</th>
                      <th style="width:40px; padding:6px 2px;">학년</th>
                      <th style="width:36px; padding:6px 2px;">반</th>
                      <th style="width:40px; padding:6px 2px;">번호</th>
                      <th style="width:65px; padding:6px 2px;">이름</th>
                      <th style="width:100px; padding:6px 2px;">연락처</th>
                      <th style="width:80px; padding:6px 2px;">최종수강일</th>
                      <th style="width:80px; padding:6px 2px;">수강료<br>(환불금액)</th>
                      <th style="width:75px; padding:6px 2px;">수용비<br>(환불금액)</th>
                      <th style="width:75px; padding:6px 2px;">교재비<br>(환불금액)</th>
                      <th style="width:75px; padding:6px 2px;">재료비<br>(환불금액)</th>
                      <th style="width:75px; padding:6px 2px;">징수 전 취소</th>
                      <th style="width:80px; padding:6px 2px;">적용일자</th>
                      <th style="padding:6px 6px;">비고</th>
                      <th style="width:80px; padding:6px 2px;">등록일자</th>
                      <th style="width:45px; padding:6px 2px;">삭제</th>
                    </tr>
                  </thead>
                  <tbody id="refundTbody">
                    <tr><td colspan="21" class="center" style="padding:40px;">환불 목록을 불러오는 중입니다...</td></tr>
                  </tbody>
                </table>
              </div>

              <!-- 안내문 -->
              <div class="bottom-notice-box" style="margin-top:15px; padding:12px 16px; background:#f9f9f9; border:1px solid #e5e5e5; border-radius:4px; font-size:12px; color:#666;">
                <ul style="margin:0; padding-left:18px; line-height:1.7;">
                  <li>신청상태가 '접수'인 경우에만 취소할 수 있습니다.</li>
                  <li>신청상태('강사확인'): 강사가 환불/취소 관련 내용을 확인 후 관리자에 제출한 상태입니다.</li>
                  <li>신청상태('처리완료'): 관리자가 환불/취소 관련 처리를 완료한 후 행정실에 제출 한 상태입니다.</li>
                  <li>환불금액 산출 기준: 수업 시작 전 100%, 1/3 경과 전 2/3 반환, 1/2 경과 전 1/2 반환, 1/2 경과 후 반환하지 않음 (평생교육법/소비자분쟁해결기준 준용).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>'''

refund_modals_html = '''  <!-- ==================== 18. Modal: 환불/취소등록 및 계산기 (#refundSinModal) ==================== -->
  <div class="modal-backdrop" id="refundSinModal" onclick="if(event.target===this) closeRefundSinModal();" style="display:none; position: fixed !important; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 99999 !important;">
    <div class="modal-box" style="max-width: 820px; width: 95%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin: auto !important; position: relative !important; background: #fff;">
      <div class="modal-header" style="background: #428bca; border-bottom: 1px solid #357ebd; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center;">
        <h3 class="modal-title" style="margin: 0; font-size: 16px; font-weight: bold; color: #fff;"><i class="fa fa-calculator" style="margin-right: 6px;"></i> 환불/취소자 등록 및 환불 계산기</h3>
        <button type="button" class="close-btn" onclick="closeRefundSinModal()" style="color: #fff; background: none; border: none; font-size: 22px; cursor: pointer; line-height: 1;">&times;</button>
      </div>

      <div class="modal-body" style="padding: 16px 20px; overflow-y: auto; flex: 1; background: #fff;">
        <div style="background: #eef7fe; border: 1px solid #cce5ff; border-radius: 4px; padding: 10px 14px; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; font-size: 13px; color: #31708f;">
          <i class="fa fa-info-circle" style="font-size: 15px; color: #31708f;"></i>
          <span><strong style="color: #d9534f;">*</strong> 표시는 필수 입력 항목입니다. 최종수강일과 수강시수에 따라 법정 환불 기준(1/3, 1/2) 및 일할 계산이 자동 산출됩니다.</span>
        </div>

        <form id="fm_refund_sin" onsubmit="submitRefundSin(event)">
          <table class="table table-bordered list" style="margin-top:0px; width:100%; border-collapse:collapse; margin-bottom:15px; font-size:12px;">
            <colgroup>
              <col width="140">
              <col width="">
            </colgroup>
            <tbody>
              <!-- 학생 선택 및 정보 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">
                  학생 선택 <i class="fa fa-asterisk text-danger" style="font-size:9px; color:#d9534f;"></i>
                </th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px;">
                    <button type="button" id="btn_refund_sample_student" class="btn btn-info btn-xs" onclick="fillRefundSampleStudent();" style="height:26px; padding:0 10px; font-weight:bold;"><i class="fa fa-user"></i> 샘플학생 불러오기</button>
                    <span style="font-size:11px; color:#64748b;">(등록된 학생 중 1명을 자동 입력하거나 직접 정보를 입력하세요)</span>
                  </div>
                  <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                    <select id="ref_sin_grade" class="form-control" style="width:75px; height:30px; line-height:normal !important; box-sizing:border-box !important;" required>
                      <option value="">학년</option>
                      <option value="1">1학년</option>
                      <option value="2" selected>2학년</option>
                      <option value="3">3학년</option>
                      <option value="4">4학년</option>
                      <option value="5">5학년</option>
                      <option value="6">6학년</option>
                    </select>
                    <select id="ref_sin_classNo" class="form-control" style="width:65px; height:30px; line-height:normal !important; box-sizing:border-box !important;" required>
                      <option value="">반</option>
                      <option value="1">1반</option>
                      <option value="2" selected>2반</option>
                      <option value="3">3반</option>
                      <option value="4">4반</option>
                      <option value="5">5반</option>
                    </select>
                    <input type="text" id="ref_sin_studentNo" placeholder="번호" value="14" style="width:55px; height:30px; text-align:center; border:1px solid #ccc; border-radius:3px; padding:0 4px;" required>
                    <input type="text" id="ref_sin_studentName" placeholder="학생명" value="박서준" style="width:90px; height:30px; font-weight:bold; border:1px solid #ccc; border-radius:3px; padding:0 8px;" required>
                    <input type="text" id="ref_sin_parentPhone" placeholder="학부모 연락처" value="010-3849-1928" style="width:130px; height:30px; border:1px solid #ccc; border-radius:3px; padding:0 8px;">
                  </div>
                </td>
              </tr>

              <!-- 강좌 선택 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">
                  강좌 선택 <i class="fa fa-asterisk text-danger" style="font-size:9px; color:#d9534f;"></i>
                </th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                    <select id="ref_sin_div" class="form-control" style="width:105px; height:30px; line-height:normal !important; box-sizing:border-box !important;">
                      <option value="26년 8월" selected>26년 8월</option>
                      <option value="26년 9월">26년 9월</option>
                    </select>
                    <select id="ref_sin_neulbomType" class="form-control" style="width:85px; height:30px; line-height:normal !important; box-sizing:border-box !important;">
                      <option value="방과후" selected>방과후</option>
                      <option value="맞춤형">맞춤형</option>
                      <option value="돌봄">돌봄</option>
                    </select>
                    <select id="ref_sin_course" onchange="onRefundCourseChanged();" class="form-control" style="min-width:240px; height:30px; line-height:normal !important; box-sizing:border-box !important;" required>
                      <option value="">=강좌 선택=</option>
                    </select>
                  </div>
                </td>
              </tr>

              <!-- 신청유형(지원금) 및 징수 전 취소 여부 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">
                  신청유형 / 구분
                </th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                    <select id="ref_sin_appType" class="form-control" style="width:130px; height:30px; line-height:normal !important; box-sizing:border-box !important;">
                      <option value="일반" selected>일반</option>
                      <option value="자유수강권(1순위)">자유수강권(1순위)</option>
                      <option value="자유수강권(2순위)">자유수강권(2순위)</option>
                      <option value="교육급여">교육급여</option>
                      <option value="기타지원금">기타지원금</option>
                    </select>
                    <label style="margin:0; cursor:pointer; display:inline-flex; align-items:center; gap:6px; font-weight:normal;">
                      <input type="checkbox" id="ref_sin_beforeCollection" onchange="calculateRefundModalAmounts();">
                      <strong style="color:#d9534f;">징수 전 취소</strong> (수업 개강 전 또는 수강료 미징수 상태로 취소)
                    </label>
                  </div>
                </td>
              </tr>

              <!-- 시수 및 최종수강일 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">
                  수업시수 & 최종수강일 <i class="fa fa-asterisk text-danger" style="font-size:9px; color:#d9534f;"></i>
                </th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                    <div style="display:inline-flex; align-items:center; gap:4px;">
                      <span>총 수업시수:</span>
                      <input type="number" id="ref_sin_totalDays" value="12" min="1" max="100" onchange="calculateRefundModalAmounts();" oninput="calculateRefundModalAmounts();" style="width:55px; height:30px; text-align:center; border:1px solid #ccc; border-radius:3px;">
                      <span>시수</span>
                    </div>
                    <div style="display:inline-flex; align-items:center; gap:4px;">
                      <span>수강한 시수:</span>
                      <input type="number" id="ref_sin_attendedDays" value="3" min="0" max="100" onchange="calculateRefundModalAmounts();" oninput="calculateRefundModalAmounts();" style="width:55px; height:30px; text-align:center; border:1px solid #ccc; border-radius:3px;">
                      <span>시수</span>
                    </div>
                    <div style="display:inline-flex; align-items:center; gap:4px;">
                      <span>최종수강일:</span>
                      <input type="date" id="ref_sin_lastAttendedDate" style="height:30px; border:1px solid #ccc; border-radius:3px; padding:0 6px;">
                    </div>
                  </div>
                  <div style="margin-top:6px; font-size:11px; color:#666;">
                    계산 기준: 
                    <label style="margin-left:8px; font-weight:normal; cursor:pointer;"><input type="radio" name="ref_calc_rule" value="standard" checked onchange="calculateRefundModalAmounts();"> 법정 기준 (1/3, 1/2)</label>
                    <label style="margin-left:8px; font-weight:normal; cursor:pointer;"><input type="radio" name="ref_calc_rule" value="daily" onchange="calculateRefundModalAmounts();"> 일할/시수 비례</label>
                  </div>
                </td>
              </tr>

              <!-- 수강료 및 환불 산출 테이블 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">
                  환불 금액 산출 <i class="fa fa-asterisk text-danger" style="font-size:9px; color:#d9534f;"></i>
                </th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <table style="width:100%; border-collapse:collapse; text-align:center; font-size:12px;">
                    <thead>
                      <tr style="background:#f5f5f5; border-bottom:1px solid #ddd;">
                        <th style="padding:4px; border:1px solid #ddd;">항목</th>
                        <th style="padding:4px; border:1px solid #ddd;">수납(원금)</th>
                        <th style="padding:4px; border:1px solid #ddd;">환불 산출액</th>
                        <th style="padding:4px; border:1px solid #ddd;">산출 기준/비고</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="border:1px solid #ddd; padding:5px; font-weight:bold;">수강료</td>
                        <td style="border:1px solid #ddd; padding:5px;"><input type="number" id="ref_sin_fee" value="30000" onchange="calculateRefundModalAmounts();" oninput="calculateRefundModalAmounts();" style="width:80px; height:26px; text-align:right; border:1px solid #ccc; padding:0 4px;">원</td>
                        <td style="border:1px solid #ddd; padding:5px;"><input type="number" id="ref_sin_tuitionRefund" value="20000" style="width:80px; height:26px; text-align:right; font-weight:bold; color:#d9534f; border:1px solid #ccc; padding:0 4px;">원</td>
                        <td style="border:1px solid #ddd; padding:5px; font-size:11px; color:#666;" id="ref_tuition_rule_desc">1/3 경과 전 (2/3 반환)</td>
                      </tr>
                      <tr>
                        <td style="border:1px solid #ddd; padding:5px; font-weight:bold;">수용비</td>
                        <td style="border:1px solid #ddd; padding:5px;"><input type="number" id="ref_sin_receptiveFee" value="3000" onchange="calculateRefundModalAmounts();" oninput="calculateRefundModalAmounts();" style="width:80px; height:26px; text-align:right; border:1px solid #ccc; padding:0 4px;">원</td>
                        <td style="border:1px solid #ddd; padding:5px;"><input type="number" id="ref_sin_receptiveRefund" value="2000" style="width:80px; height:26px; text-align:right; font-weight:bold; color:#d9534f; border:1px solid #ccc; padding:0 4px;">원</td>
                        <td style="border:1px solid #ddd; padding:5px; font-size:11px; color:#666;">수강료 비율 연동</td>
                      </tr>
                      <tr>
                        <td style="border:1px solid #ddd; padding:5px;">교재비</td>
                        <td style="border:1px solid #ddd; padding:5px;"><input type="number" id="ref_sin_textbookFee" value="0" onchange="calculateRefundModalAmounts();" oninput="calculateRefundModalAmounts();" style="width:80px; height:26px; text-align:right; border:1px solid #ccc; padding:0 4px;">원</td>
                        <td style="border:1px solid #ddd; padding:5px;"><input type="number" id="ref_sin_textbookRefund" value="0" style="width:80px; height:26px; text-align:right; border:1px solid #ccc; padding:0 4px;">원</td>
                        <td style="border:1px solid #ddd; padding:5px; font-size:11px; color:#666;">미사용 교재 반환 시</td>
                      </tr>
                      <tr>
                        <td style="border:1px solid #ddd; padding:5px;">재료비</td>
                        <td style="border:1px solid #ddd; padding:5px;"><input type="number" id="ref_sin_materialFee" value="0" onchange="calculateRefundModalAmounts();" oninput="calculateRefundModalAmounts();" style="width:80px; height:26px; text-align:right; border:1px solid #ccc; padding:0 4px;">원</td>
                        <td style="border:1px solid #ddd; padding:5px;"><input type="number" id="ref_sin_materialRefund" value="0" style="width:80px; height:26px; text-align:right; border:1px solid #ccc; padding:0 4px;">원</td>
                        <td style="border:1px solid #ddd; padding:5px; font-size:11px; color:#666;">잔여재료 반환 시</td>
                      </tr>
                      <tr style="background:#fef6f6;">
                        <td colspan="2" style="border:1px solid #ddd; padding:6px; font-weight:bold; text-align:right;">총 환불 예상 금액:</td>
                        <td colspan="2" style="border:1px solid #ddd; padding:6px; text-align:left;">
                          <strong id="ref_sin_totalRefundDisplay" style="color:#d9534f; font-size:15px; margin-left:8px;">22,000원</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- 신청상태 & 적용일자 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">
                  신청상태 & 적용일자
                </th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                    <div style="display:inline-flex; align-items:center; gap:6px;">
                      <span>신청상태:</span>
                      <select id="ref_sin_status" class="form-control" style="width:110px; height:30px; line-height:normal !important; box-sizing:border-box !important;">
                        <option value="접수" selected>접수(신청)</option>
                        <option value="강사확인">강사확인</option>
                        <option value="처리완료">처리완료</option>
                      </select>
                    </div>
                    <div style="display:inline-flex; align-items:center; gap:6px;">
                      <span>적용일자:</span>
                      <input type="date" id="ref_sin_effectiveDate" style="height:30px; border:1px solid #ccc; border-radius:3px; padding:0 6px;">
                    </div>
                  </div>
                </td>
              </tr>

              <!-- 취소 사유(비고) -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">
                  취소 사유 (비고)
                </th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <textarea id="ref_sin_reason" class="form-control" style="width:100%; height:55px; font-size:12px;" placeholder="환불 및 취소 사유를 입력하세요 (예: 전학/이사, 병원진료, 타 과목 시간중복 등)"></textarea>
                </td>
              </tr>
            </tbody>
          </table>

          <div style="display:flex; justify-content:center; gap:10px; margin-top:14px;">
            <button type="submit" id="btn_ref_sin_submit" class="btn btn-primary btn-sm" style="height:30px; padding:0 24px; display:inline-flex; align-items:center; justify-content:center; line-height:1; font-weight:bold;">환불/취소 등록</button>
            <button type="button" class="btn btn-default btn-sm" onclick="closeRefundSinModal();" style="height:30px; padding:0 18px; display:inline-flex; align-items:center; justify-content:center; line-height:1; font-weight:bold;">취소</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- ==================== 19. Modal: 환불/취소 일괄등록 (#refundBatchModal) ==================== -->
  <div class="modal-backdrop" id="refundBatchModal" onclick="if(event.target===this) closeRefundBatchModal();" style="display:none; position: fixed !important; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 99999 !important;">
    <div class="modal-box" style="max-width: 860px; width: 95%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin: auto !important; position: relative !important; background: #fff;">
      <div class="modal-header" style="background: #f0ad4e; border-bottom: 1px solid #eea236; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center;">
        <h3 class="modal-title" style="margin: 0; font-size: 16px; font-weight: bold; color: #fff;"><i class="fa fa-file-excel-o" style="margin-right: 6px;"></i> 환불/취소 데이터 일괄등록</h3>
        <button type="button" class="close-btn" onclick="closeRefundBatchModal()" style="color: #fff; background: none; border: none; font-size: 22px; cursor: pointer; line-height: 1;">&times;</button>
      </div>

      <div class="modal-body" style="padding: 16px 20px; overflow-y: auto; flex: 1; background: #fff;">
        <div style="background: #fcf8e3; border: 1px solid #faebcc; border-radius: 4px; padding: 10px 14px; margin-bottom: 14px; font-size: 12px; color: #8a6d3b; line-height: 1.6;">
          <strong>■ 환불/취소 일괄등록 안내:</strong><br>
          - 엑셀(Excel)에서 데이터를 복사하여 아래 입력창에 붙여넣기(Ctrl+V) 하시면 탭/공백/콤마를 자동 구분하여 일괄 등록합니다.<br>
          - 입력 순서: <code>학년 | 반 | 번호 | 이름 | 연락처 | 강좌명 | 최종수강일 | 출석시수 | 총시수 | 수강료 | 환불금액 | 사유</code><br>
          - <a href="/af/ad_ref/template" download="refund_batch_sample.csv" class="btn btn-default btn-xs" style="height:24px; padding:0 8px; display:inline-flex; align-items:center; gap:4px; font-weight:bold; margin-top:4px;"><i class="fa fa-download"></i> 환불/취소 일괄등록 양식 다운로드 (CSV)</a>
          <button type="button" id="btn_refund_batch_sample" class="btn btn-info btn-xs" onclick="fillRefundBatchSample();" style="height:24px; padding:0 8px; display:inline-flex; align-items:center; gap:4px; font-weight:bold; margin-top:4px; margin-left:6px;"><i class="fa fa-magic"></i> 샘플 데이터 채우기</button>
        </div>

        <div style="margin-bottom: 10px;">
          <textarea id="ref_batch_text" class="form-control" rows="6" style="width: 100%; font-family: monospace; font-size: 12px; line-height: 1.5; border: 1px solid #ccc; border-radius: 3px; padding: 8px;" placeholder="여기에 엑셀 데이터를 붙여넣으세요...&#10;예시:&#10;1&#9;1&#9;5&#9;김민준&#9;010-1234-5678&#9;놀이체육 1부&#9;2026-08-10&#9;3&#9;12&#9;25000&#9;16660&#9;개인사정"></textarea>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <button type="button" id="btn_ref_batch_preview" class="btn btn-info btn-sm" onclick="parseRefundBatchPreview();" style="height:30px; padding:0 16px; display:inline-flex; align-items:center; gap:6px; font-weight:bold;"><i class="fa fa-table"></i> 파싱 및 데이터 미리보기</button>
          <span id="ref_batch_parsed_count" style="font-size:12px; color:#64748b; font-weight:bold;"></span>
        </div>

        <!-- 미리보기 테이블 -->
        <div id="ref_batch_preview_box" style="display:none; max-height:220px; overflow-y:auto; border:1px solid #ddd; margin-bottom:14px;">
          <table class="table table-bordered list" style="width:100%; margin:0; font-size:11.5px; text-align:center;">
            <thead>
              <tr style="background:#f5f5f5;">
                <th style="padding:4px;">No</th>
                <th style="padding:4px;">학생</th>
                <th style="padding:4px;">연락처</th>
                <th style="padding:4px;">강좌명</th>
                <th style="padding:4px;">최종수강일</th>
                <th style="padding:4px;">출석/총시수</th>
                <th style="padding:4px;">수강료</th>
                <th style="padding:4px;">환불금액</th>
                <th style="padding:4px;">사유</th>
              </tr>
            </thead>
            <tbody id="ref_batch_preview_tbody"></tbody>
          </table>
        </div>

        <div style="display:flex; justify-content:center; gap:10px;">
          <button type="button" id="btn_ref_batch_submit" class="btn btn-warning btn-sm" onclick="submitRefundBatch();" style="height:30px; padding:0 24px; display:inline-flex; align-items:center; justify-content:center; line-height:1; font-weight:bold; color:#fff;">일괄 등록 저장</button>
          <button type="button" class="btn btn-default btn-sm" onclick="closeRefundBatchModal();" style="height:30px; padding:0 18px; display:inline-flex; align-items:center; justify-content:center; line-height:1; font-weight:bold;">닫기</button>
        </div>
      </div>
    </div>
  </div>
'''

def update_file(filepath):
    print(f"Updating {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace panel_ad_ref_lists
    # Find the block from <!-- ==================== 5. 환불/취소관리 (/af/ad_ref/lists) ==================== -->
    # up to <!-- ==================== 6. 결석/귀가신청
    pattern = re.compile(
        r'<!-- ==================== 5\. 환불/취소관리.*?<!-- ==================== 6\. 결석/귀가신청',
        re.DOTALL
    )
    if not pattern.search(content):
        print(f"Error: Could not find panel_ad_ref_lists block in {filepath}")
        return False

    replacement = panel_ad_ref_html + "\n\n      <!-- ==================== 6. 결석/귀가신청"
    content = pattern.sub(replacement, content, count=1)

    # 2. Add refund modals before <!-- Client Script -->
    # First remove any existing refund modals if present
    content = re.sub(r'<!-- ==================== 18\. Modal: 환불/취소등록.*?</div>\s*</div>\s*</div>\s*(?=(<!-- Client Script|<!-- ==================== 19|$))', '', content, flags=re.DOTALL)
    content = re.sub(r'<!-- ==================== 19\. Modal: 환불/취소 일괄등록.*?</div>\s*</div>\s*</div>\s*(?=<!-- Client Script)', '', content, flags=re.DOTALL)

    script_marker = '<!-- Client Script -->'
    if script_marker in content:
        content = content.replace(script_marker, refund_modals_html + '\n\n  ' + script_marker)
    else:
        print(f"Warning: {script_marker} not found in {filepath}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Successfully updated {filepath}")
    return True

update_file('course_site/af/ad_lec/lists/sn/index.html')
update_file('course_site/af/ad_lec/lists/sn/3267/index.html')
