import re

def update_file(file_path):
    print(f"Processing: {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. NEW BATCH UPLOAD MODAL HTML
    new_batch_upload = '''  <!-- 23-Column Batch Upload Modal (강좌 일괄입력 모달) -->
  <div class="modal-backdrop" id="batchUploadModal" onclick="if(event.target===this) closeBatchUploadModal();" style="position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(0,0,0,0.5) !important; z-index: 99999 !important; display: none; justify-content: center !important; align-items: center !important;">
    <div class="modal-box" style="max-width: 860px; width: 95%; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin: auto !important; position: relative !important; background: #fff;">
      <div class="modal-header" style="background: #428bca; border-bottom: 1px solid #357ebd; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #fff;"><i class="fa fa-file-text-o" style="color: #fff; margin-right: 6px;"></i> 강좌 일괄입력</h3>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <a href="/af/ad_faq/main/sn/3267" class="btn btn-default btn-xs" style="height: 24px; padding: 0 10px; font-size: 11px; display: inline-flex; align-items: center; gap: 4px; line-height: 1; text-decoration: none; color: #333; background: #fff; border: 1px solid #ccc; border-radius: 3px;"><i class="fa fa-book"></i> 매뉴얼</a>
          <a href="https://www.dbdbschool.kr/help/go_data/num/92/data/link1" target="_blank" class="btn btn-danger btn-xs" style="height: 24px; padding: 0 10px; font-size: 11px; display: inline-flex; align-items: center; gap: 4px; line-height: 1; text-decoration: none; color: #fff; background: #d9534f; border: 1px solid #d43f3a; border-radius: 3px;"><i class="fa fa-youtube-play"></i> 유튜브</a>
          <button class="close-btn" onclick="closeBatchUploadModal()" style="margin-left: 8px; font-size: 24px; line-height: 1; background: none; border: none; cursor: pointer; color: #fff; opacity: 0.9;">&times;</button>
        </div>
      </div>
      
      <div class="modal-body" style="padding: 16px 20px; overflow-y: auto; flex: 1; background: #fff;">
        <div style="background: #eef7fe; border: 1px solid #cce5ff; border-radius: 4px; padding: 10px 14px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; font-size: 13px; color: #31708f;">
          <i class="fa fa-info-circle" style="font-size: 15px; color: #31708f;"></i>
          <span><span style="color: #d9534f; font-weight: bold;">☑</span> 표시가 있는 항목은 반드시 입력해야 합니다.</span>
        </div>

        <form id="fm_batch_modal" onsubmit="return submitBatchUploadModal(this, event);" enctype="multipart/form-data" method="post" accept-charset="utf-8">
          <table class="table table-bordered" style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border-top: 1px solid #ddd; font-size: 12px;">
            <tbody>
              <tr>
                <th style="background: #fbfbfb; color: #333; font-weight: bold; width: 140px; padding: 0 12px; border: 1px solid #e7e7e7; vertical-align: middle !important; height: 46px; text-align: center;">
                  <span style="display: inline-flex; align-items: center; gap: 4px; vertical-align: middle; line-height: 1;">
                    강좌구분 <span style="color: #d9534f; font-weight: bold;">☑</span>
                  </span>
                </th>
                <td style="padding: 0 12px; border: 1px solid #e7e7e7; vertical-align: middle !important; height: 46px;">
                  <div style="display: inline-flex; align-items: center; vertical-align: middle; height: 100%;">
                    <select name="modal_lec_div" id="modal_lec_div" style="width: 160px; height: 30px !important; line-height: normal !important; box-sizing: border-box !important; vertical-align: middle !important; padding: 0 24px 0 10px !important; border: 1px solid #ccc; border-radius: 3px; font-size: 12px; background-color: #fff; color: #333;">
                      <option value="5">3월</option>
                      <option value="6">26년 4월</option>
                      <option value="7">26년 5월</option>
                      <option value="8">26년 6월</option>
                      <option value="9">26년 7월</option>
                      <option value="10">26년 8월</option>
                      <option value="11" selected="selected">26년 9월</option>
                    </select>
                  </div>
                </td>
              </tr>
              <tr>
                <th style="background: #fbfbfb; color: #333; font-weight: bold; padding: 9px 12px; border: 1px solid #e7e7e7; vertical-align: middle; text-align: center;">
                  엑셀 데이터 파일 <span style="color: #d9534f; font-weight: bold;">☑</span>
                </th>
                <td style="padding: 8px 12px; border: 1px solid #e7e7e7; vertical-align: middle;">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <label id="modal_file_label" style="display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px; border: 1px solid #ccc; border-radius: 3px; background: #f8f9fa; cursor: pointer; font-size: 12px; color: #555; white-space: nowrap; box-sizing: border-box;">
                      <i class="fa fa-paperclip" style="color: #428bca;"></i>
                      <span id="modal_file_name_display">파일 선택...</span>
                      <input id="modal_userfile" name="modal_userfile" type="file" title="데이터파일" accept=".csv, .txt, .xlsx, .xls" style="display: none;" onchange="document.getElementById('modal_file_name_display').textContent = this.files[0] ? this.files[0].name : '파일 선택...';">
                    </label>
                    <a href="/af/ad_lec/inputs" download="lecture_batch_sample.csv" style="display: inline-flex; align-items: center; gap: 4px; height: 30px; padding: 0 12px; border: 1px solid #428bca; border-radius: 3px; background: #fff; color: #428bca; font-size: 12px; font-weight: bold; text-decoration: none; white-space: nowrap; box-sizing: border-box;">
                      <i class="fa fa-download"></i> 일괄입력 샘플 다운로드
                    </a>
                  </div>
                  <div style="margin-top: 6px; color: #888; font-size: 11px;">
                    <i class="fa fa-question-circle" style="color: #777;"></i>
                    <a href="https://www.dbdbschool.kr/help/view/num/261/p/1/pdc/faq/sn/3267" target="_blank" style="color: #888; text-decoration: none; border-bottom: 1px dashed #aaa;">한셀로 만들어진 엑셀파일은 변환 후 사용할 수 있습니다.</a>
                  </div>
                </td>
              </tr>
              <tr>
                <th style="background: #fbfbfb; color: #333; font-weight: bold; padding: 9px 12px; border: 1px solid #e7e7e7; vertical-align: middle; text-align: center;">
                  기존 데이터 <span style="color: #d9534f; font-weight: bold;">☑</span>
                </th>
                <td style="padding: 8px 12px; border: 1px solid #e7e7e7; vertical-align: middle;">
                  <label style="display: inline-flex; align-items: center; gap: 5px; margin: 0; cursor: pointer; font-weight: normal;">
                    <input type="radio" name="modal_input_type" id="modal_input_type_add" value="add" checked="checked" style="margin: 0; vertical-align: middle;">
                    <span>추가 입력(수정)</span>
                  </label>
                </td>
              </tr>
              <tr>
                <th style="background: #fbfbfb; color: #333; font-weight: bold; padding: 9px 12px; border: 1px solid #e7e7e7; vertical-align: middle; text-align: center;">
                  참고사항
                </th>
                <td style="padding: 8px 12px; border: 1px solid #e7e7e7; line-height: 1.8; color: #444; font-size: 12px;">
                  - 샘플파일 <span style="color: #d9534f; font-weight: bold;">첫 번째 줄의 내용은 변경할 수 없습니다.</span><br>
                  - <span style="color: #d9534f; font-weight: bold;">늘봄과정 : 늘봄과정 구분을 사용하는 경우에만 필수</span> 항목입니다.<br>
                  - 중복제한그룹 : 선택 항목입니다.<br>
                  - <span style="color: #d9534f; font-weight: bold;">강좌명 : 필수</span> 항목입니다.<br>
                  - <span style="color: #d9534f; font-weight: bold;">강사ID : 필수</span> 항목입니다.<br>
                  - <span style="color: #d9534f; font-weight: bold;">대상학년 : 필수</span> 항목입니다.<br>
                  - <span style="color: #d9534f; font-weight: bold;">대상학과 : 학과 설정이 되어 있는 경우에만 필수</span> 항목입니다.<br>
                  - <span style="color: #d9534f; font-weight: bold;">강의시간 : 필수</span> 항목입니다.<br>
                  - 강의시간중복허용 : 선택 항목입니다.<br>
                  - <span style="color: #d9534f; font-weight: bold;">정원 : 필수</span> 항목입니다.<br>
                  - <span style="color: #d9534f; font-weight: bold;">대기정원 : 대기자 기능을 사용하는 경우에만 필수</span> 항목입니다.<br>				
                  - <span style="color: #d9534f; font-weight: bold;">운영기간(시작) : 필수</span> 항목입니다.<br>
                  - <span style="color: #d9534f; font-weight: bold;">운영기간(종료) : 필수</span> 항목입니다.<br>
                  - 총시수, 강의실, 수강료, 수용비, 교재비, 재료비, 지원금차감제외, 최대지원금액, 내용 : 선택 항목입니다.<br>
                </td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 15px; margin-bottom: 20px; text-align: center; display: flex; justify-content: center; gap: 8px;">
            <button type="button" onclick="closeBatchUploadModal()" class="btn btn-default" style="min-width: 70px; height: 32px; padding: 0 16px; display: inline-flex; align-items: center; justify-content: center; line-height: 1; box-sizing: border-box; border: 1px solid #ccc; background: #fff; color: #333; border-radius: 3px; font-weight: bold; cursor: pointer;">취소</button>
            <button type="submit" class="btn btn-primary" style="min-width: 70px; height: 32px; padding: 0 16px; display: inline-flex; align-items: center; justify-content: center; line-height: 1; box-sizing: border-box; background: #428bca; border: 1px solid #357ebd; color: #ffffff; border-radius: 3px; font-weight: bold; cursor: pointer;">등록</button>
          </div>
        </form>

        <div style="padding: 12px 16px; background: #fafafa; border-left: 3px solid #d9534f; border-top: 1px solid #eee; border-right: 1px solid #eee; border-bottom: 1px solid #eee; font-size: 12px; color: #555;">
          <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">
            <li><span style="color: #d9534f; margin-right: 6px;">■</span>중복제한그룹은 <span style="color: #d9534f; font-weight:bold;">환경설정 &gt; 중복제한그룹 &gt; 코드명</span>과 일치하도록 입력해 주세요.</li>
            <li><span style="color: #d9534f; margin-right: 6px;">■</span>학과를 입력하는 경우 <span style="color: #d9534f; font-weight:bold;">학교환경설정 &gt; 학과설정 &gt; 코드명</span>과 일치하도록 입력해 주세요.</li>
            <li><span style="color: #d9534f; margin-right: 6px;">■</span>강의시간은 <span style="color: #d9534f; font-weight:bold;">환경설정 &gt; 수업교시 &gt; 코드명</span>과 일치하도록 입력해 주세요.</li>
            <li><span style="color: #d9534f; margin-right: 6px;">■</span>지원금명은 <span style="color: #d9534f; font-weight:bold;">지원금관리 &gt; 지원금설정 &gt; 지원금명</span>과 일치하도록 입력해 주세요.</li>
            <li><span style="color: #d9534f; margin-right: 6px;">■</span><span style="color: #d9534f; font-weight:bold;">강좌명이 같은 데이터는 수정</span>됩니다.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>'''

    # 2. NEW BATCH MODIFY MODAL HTML
    new_batch_modify = '''  <!-- Batch Modify Modal (강좌 일괄수정 모달 - modifyField 클론) -->
  <div class="modal-backdrop" id="batchModifyModal" onclick="if(event.target===this) closeBatchModifyModal();" style="position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(0,0,0,0.5) !important; z-index: 99999 !important; display: none; justify-content: center !important; align-items: center !important;">
    <div class="modal-box" style="max-width: 860px; width: 95%; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin: auto !important; position: relative !important; background: #fff;">
      <div class="modal-header" style="background: #428bca; border-bottom: 1px solid #357ebd; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #fff;"><i class="fa fa-pencil-square-o" style="color: #fff; margin-right: 6px;"></i> 강좌 일괄수정</h3>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <a href="/af/ad_faq/main/sn/3267" class="btn btn-default btn-xs" style="height: 24px; padding: 0 10px; font-size: 11px; display: inline-flex; align-items: center; gap: 4px; line-height: 1; text-decoration: none; color: #333; background: #fff; border: 1px solid #ccc; border-radius: 3px;"><i class="fa fa-book"></i> 매뉴얼</a>
          <button class="close-btn" onclick="closeBatchModifyModal()" style="margin-left: 8px; font-size: 24px; line-height: 1; background: none; border: none; cursor: pointer; color: #fff; opacity: 0.9;">&times;</button>
        </div>
      </div>
      
      <div class="modal-body" style="padding: 16px 20px; overflow-y: auto; flex: 1; background: #fff;">
        <div style="background: #eef7fe; border: 1px solid #cce5ff; border-radius: 4px; padding: 10px 14px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; font-size: 13px; color: #31708f;">
          <i class="fa fa-info-circle" style="font-size: 15px; color: #31708f;"></i>
          <span>수정할 필드의 체크박스(<span style="color: #428bca; font-weight: bold;">☑</span>)를 선택하면 해당 항목이 활성화됩니다.</span>
        </div>

        <form id="fm_modify_field_modal" onsubmit="return submitBatchModifyModal(this, event);" method="post" accept-charset="utf-8">
          <div class="panel-body" style="padding: 4px 0 8px 0;">
            <p style="margin: 0; font-size: 12px; color: #333; font-weight: bold;"><i class="fa fa-check" style="color: #428bca;"></i> <span> 변경을 원하는 강좌의 검색 조건을 선택하세요.</span></p>
          </div> 	
          <table class="table table-bordered table-hover list MAT0" style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border-top: 1px solid #ddd; font-size: 12px;">
            <tbody>
              <tr>
                <th style="width:70px; text-align:center; vertical-align:middle; background:#fbfbfb; border:1px solid #ddd; font-weight:bold; color:#333;" rowspan="2">검색<br>조건</th>
                <th style="width:140px; vertical-align:middle; background:#fbfbfb; border:1px solid #ddd; font-weight:bold; color:#333; padding:8px 12px; text-align: center;">강좌구분</th>
                <td style="border:1px solid #ddd; padding:6px 12px; vertical-align:middle;">
                  <select name="lec_div1" id="lec_div1" style="height:30px !important; line-height:normal !important; box-sizing:border-box !important; vertical-align:middle !important; padding:0 24px 0 10px !important; border:1px solid #ccc; border-radius:3px; font-size:12px; background-color:#fff; color:#333; width:180px;">
                    <option value="">= 선택하세요 =</option>
                    <option value="0">구분없음</option>
                    <option value="5">3월</option>
                    <option value="6">26년 4월</option>
                    <option value="7">26년 5월</option>
                    <option value="8">26년 6월</option>
                    <option value="9">26년 7월</option>
                    <option value="10">26년 8월</option>
                    <option value="11" selected="selected">26년 9월</option>
                  </select>
                  <div class="error_msg error_lec_div1" style="color:#d9534f; font-size:11px;"></div>
                </td>
              </tr>
              <tr>
                <th style="vertical-align:middle; background:#fbfbfb; border:1px solid #ddd; font-weight:bold; color:#333; padding:8px 12px; text-align: center;">상태</th>
                <td style="border:1px solid #ddd; padding:6px 12px; vertical-align:middle;">
                  <span style="display:inline-flex; align-items:center; margin-right:12px;"><input id="lec_status1_1" name="lec_status1" type="radio" value="1" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="lec_status1_1" style="cursor:pointer; margin:0; font-weight:normal;">출력</label></span>
                  <span style="display:inline-flex; align-items:center; margin-right:12px;"><input id="lec_status1_0" name="lec_status1" type="radio" value="0" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="lec_status1_0" style="cursor:pointer; margin:0; font-weight:normal;">대기</label></span>
                  <span style="display:inline-flex; align-items:center; margin-right:12px;"><input id="lec_status1_2" name="lec_status1" type="radio" value="2" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="lec_status1_2" style="cursor:pointer; margin:0; font-weight:normal;">종료</label></span>
                  <span style="display:inline-flex; align-items:center;"><input id="lec_status1_all" name="lec_status1" type="radio" value="all" checked="checked" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="lec_status1_all" style="cursor:pointer; margin:0; font-weight:normal;">전체</label></span>
                  <div class="error_msg error_lec_status1" style="color:#d9534f; font-size:11px;"></div>		
                </td>			
              </tr>
            </tbody>
          </table>
          
          <div class="panel-body" style="padding: 10px 0 8px 0;">
            <p style="margin: 0; font-size: 12px; color: #333; font-weight: bold;"><i class="fa fa-check" style="color: #428bca;"></i> <span> 검색된 강좌의 변경될 내용을 지정하세요.</span></p>
          </div> 		
          <table class="table table-bordered table-hover list MAT0" style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border-top: 1px solid #ddd; font-size: 12px;">
            <tbody>
              <tr>
                <th style="width:70px; text-align:center; vertical-align:middle; background:#fbfbfb; border:1px solid #ddd; font-weight:bold; color:#333;" rowspan="9">수정<br>필드</th>		
                <th style="width:140px; vertical-align:middle; background:#fbfbfb; border:1px solid #ddd; font-weight:bold; color:#333; padding:8px 12px; text-align: center;">
                  <span style="display:inline-flex; align-items:center; gap:4px; line-height:1; justify-content: center; width: 100%;">
                    강좌구분 <input type="checkbox" name="chk_lec_div" id="chk_lec_div" value="1" title="적용" onclick="chk_field(this.id);" style="margin:0; vertical-align:middle;">
                  </span>
                </th>
                <td style="border:1px solid #ddd; padding:6px 12px; vertical-align:middle;">
                  <select name="lec_div2" id="lec_div2" disabled="" style="height:30px !important; line-height:normal !important; box-sizing:border-box !important; vertical-align:middle !important; padding:0 24px 0 10px !important; border:1px solid #ccc; border-radius:3px; font-size:12px; background-color:#fff; color:#333; width:180px;">
                    <option value="">= 선택하세요 =</option>
                    <option value="5">3월</option>
                    <option value="6">26년 4월</option>
                    <option value="7">26년 5월</option>
                    <option value="8">26년 6월</option>
                    <option value="9">26년 7월</option>
                    <option value="10">26년 8월</option>
                    <option value="11">26년 9월</option>
                  </select>
                  <div class="error_msg error_lec_div2" style="color:#d9534f; font-size:11px;"></div>
                </td>
              </tr>	
              <tr>
                <th style="vertical-align:middle; background:#fbfbfb; border:1px solid #ddd; font-weight:bold; color:#333; padding:8px 12px; text-align: center;">
                  <span style="display:inline-flex; align-items:center; gap:4px; line-height:1; justify-content: center; width: 100%;">
                    운영기간 <input type="checkbox" name="chk_lec_date" id="chk_lec_date" value="1" title="적용" onclick="chk_field(this.id);" style="margin:0; vertical-align:middle;">
                  </span>
                </th>
                <td style="border:1px solid #ddd; padding:6px 12px; vertical-align:middle;">
                  <input id="lec_sdate" name="lec_sdate" value="" type="date" title="시작일자" disabled="" style="height:30px; line-height:normal; box-sizing:border-box; vertical-align:middle; padding:0 10px; border:1px solid #ccc; border-radius:3px; font-size:12px; width:130px;"> ~
                  <input id="lec_edate" name="lec_edate" value="" type="date" title="종료일자" disabled="" style="height:30px; line-height:normal; box-sizing:border-box; vertical-align:middle; padding:0 10px; border:1px solid #ccc; border-radius:3px; font-size:12px; width:130px;">
                  <div class="error_msg error_lec_sdate" style="color:#d9534f; font-size:11px;"></div>
                  <div class="error_msg error_lec_edate" style="color:#d9534f; font-size:11px;"></div>
                </td>	
              </tr>
              <tr>
                <th style="vertical-align:middle; background:#fbfbfb; border:1px solid #ddd; font-weight:bold; color:#333; padding:8px 12px; text-align: center;">
                  <span style="display:inline-flex; align-items:center; gap:4px; line-height:1.2; justify-content: center; width: 100%;">
                    강사ID 중복<br>신청 불가 <input type="checkbox" name="chk_tea_id" id="chk_tea_id" value="1" title="적용" onclick="chk_field(this.id);" style="margin:0; vertical-align:middle;">
                  </span>
                </th>
                <td style="border:1px solid #ddd; padding:6px 12px; vertical-align:middle;">
                  <span style="display:inline-flex; align-items:center; margin-right:12px;"><input id="tea_id_chk_Y" name="tea_id_chk" type="radio" value="Y" disabled="" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="tea_id_chk_Y" style="cursor:pointer; margin:0; font-weight:normal;">예</label></span>
                  <span style="display:inline-flex; align-items:center;"><input id="tea_id_chk_N" name="tea_id_chk" type="radio" value="N" disabled="" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="tea_id_chk_N" style="cursor:pointer; margin:0; font-weight:normal;">아니오</label></span>
                  <div class="error_msg error_tea_id_chk" style="color:#d9534f; font-size:11px;"></div>		
                </td>	
              </tr>			
              <tr>
                <th style="vertical-align:middle; background:#fbfbfb; border:1px solid #ddd; font-weight:bold; color:#333; padding:8px 12px; text-align: center;">
                  <span style="display:inline-flex; align-items:center; gap:4px; line-height:1; justify-content: center; width: 100%;">
                    시간 중복 허용 <input type="checkbox" name="chk_lec_time" id="chk_lec_time" value="1" title="적용" onclick="chk_field(this.id);" style="margin:0; vertical-align:middle;">
                  </span>
                </th>
                <td style="border:1px solid #ddd; padding:6px 12px; vertical-align:middle;">
                  <span style="display:inline-flex; align-items:center; margin-right:12px;"><input id="lec_time_not_chk_Y" name="lec_time_not_chk" type="radio" value="Y" disabled="" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="lec_time_not_chk_Y" style="cursor:pointer; margin:0; font-weight:normal;">예</label></span>
                  <span style="display:inline-flex; align-items:center;"><input id="lec_time_not_chk_N" name="lec_time_not_chk" type="radio" value="N" disabled="" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="lec_time_not_chk_N" style="cursor:pointer; margin:0; font-weight:normal;">아니오</label></span>
                  <div class="error_msg error_lec_time_not_chk" style="color:#d9534f; font-size:11px;"></div>		
                </td>	
              </tr>				
              <tr>
                <th style="vertical-align:middle; background:#fbfbfb; border:1px solid #ddd; font-weight:bold; color:#333; padding:8px 12px; text-align: center;">
                  <span style="display:inline-flex; align-items:center; gap:4px; line-height:1; justify-content: center; width: 100%;">
                    수강료 출력 <input type="checkbox" name="chk_pay_view" id="chk_pay_view" value="1" title="적용" onclick="chk_field(this.id);" style="margin:0; vertical-align:middle;">
                  </span>
                </th>
                <td style="border:1px solid #ddd; padding:6px 12px; vertical-align:middle;">
                  <span style="display:inline-flex; align-items:center; margin-right:12px;"><input id="lec_pay_view_Y" name="lec_pay_view" type="radio" value="Y" disabled="" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="lec_pay_view_Y" style="cursor:pointer; margin:0; font-weight:normal;">예</label></span>
                  <span style="display:inline-flex; align-items:center;"><input id="lec_pay_view_N" name="lec_pay_view" type="radio" value="N" disabled="" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="lec_pay_view_N" style="cursor:pointer; margin:0; font-weight:normal;">아니오</label></span>
                  <div class="error_msg error_lec_pay_view" style="color:#d9534f; font-size:11px;"></div>		
                </td>	
              </tr>				
              <tr>
                <th style="vertical-align:middle; background:#fbfbfb; border:1px solid #ddd; font-weight:bold; color:#333; padding:8px 12px; text-align: center;">
                  <span style="display:inline-flex; align-items:center; gap:4px; line-height:1; justify-content: center; width: 100%;">
                    강사마감 <input type="checkbox" name="chk_tea_finish" id="chk_tea_finish" value="1" title="적용" onclick="chk_field(this.id);" style="margin:0; vertical-align:middle;">
                  </span>
                </th>
                <td style="border:1px solid #ddd; padding:6px 12px; vertical-align:middle;">
                  <span style="display:inline-flex; align-items:center; margin-right:12px;"><input id="lec_tea_finish_Y" name="lec_tea_finish" type="radio" value="Y" disabled="" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="lec_tea_finish_Y" style="cursor:pointer; margin:0; font-weight:normal;">예</label></span>
                  <span style="display:inline-flex; align-items:center;"><input id="lec_tea_finish_N" name="lec_tea_finish" type="radio" value="N" disabled="" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="lec_tea_finish_N" style="cursor:pointer; margin:0; font-weight:normal;">아니오</label></span>
                  <div class="error_msg error_lec_tea_finish" style="color:#d9534f; font-size:11px;"></div>		
                </td>	
              </tr>			
              <tr>
                <th style="vertical-align:middle; background:#fbfbfb; border:1px solid #ddd; font-weight:bold; color:#333; padding:8px 12px; text-align: center;">
                  <span style="display:inline-flex; align-items:center; gap:4px; line-height:1; justify-content: center; width: 100%;">
                    강사 강좌 편집 <input type="checkbox" name="chk_tea_edit" id="chk_tea_edit" value="1" title="적용" onclick="chk_field(this.id);" style="margin:0; vertical-align:middle;">
                  </span>
                </th>
                <td style="border:1px solid #ddd; padding:6px 12px; vertical-align:middle;">
                  <span style="display:inline-flex; align-items:center; margin-right:12px;"><input id="lec_tea_edit_Y" name="lec_tea_edit" type="radio" value="Y" disabled="" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="lec_tea_edit_Y" style="cursor:pointer; margin:0; font-weight:normal;">예(<span class="text-danger" style="color:#d9534f; font-size:11px;">강사 마감 전, 대기 중인 강좌만 허용</span>)</label></span>
                  <span style="display:inline-flex; align-items:center;"><input id="lec_tea_edit_N" name="lec_tea_edit" type="radio" value="N" disabled="" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="lec_tea_edit_N" style="cursor:pointer; margin:0; font-weight:normal;">아니오</label></span>				
                  <div class="error_msg error_lec_tea_edit" style="color:#d9534f; font-size:11px;"></div>		
                </td>	
              </tr>	
              <tr>
                <th style="vertical-align:middle; background:#fbfbfb; border:1px solid #ddd; font-weight:bold; color:#333; padding:8px 12px; text-align: center;">
                  <span style="display:inline-flex; align-items:center; gap:4px; line-height:1; justify-content: center; width: 100%;">
                    환불마감 <input type="checkbox" name="chk_refund_status" id="chk_refund_status" value="1" title="적용" onclick="chk_field(this.id);" style="margin:0; vertical-align:middle;">
                  </span>
                </th>
                <td style="border:1px solid #ddd; padding:6px 12px; vertical-align:middle;">
                  <span style="display:inline-flex; align-items:center; margin-right:12px;"><input id="refund_status_Y" name="refund_status" type="radio" value="Y" disabled="" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="refund_status_Y" style="cursor:pointer; margin:0; font-weight:normal;">예</label></span>
                  <span style="display:inline-flex; align-items:center;"><input id="refund_status_N" name="refund_status" type="radio" value="N" disabled="" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="refund_status_N" style="cursor:pointer; margin:0; font-weight:normal;">아니오</label></span>
                  <div class="error_msg error_refund_status" style="color:#d9534f; font-size:11px;"></div>		
                </td>	
              </tr>	
              <tr>
                <th style="vertical-align:middle; background:#fbfbfb; border:1px solid #ddd; font-weight:bold; color:#333; padding:8px 12px; text-align: center;">
                  <span style="display:inline-flex; align-items:center; gap:4px; line-height:1; justify-content: center; width: 100%;">
                    상태 <input type="checkbox" name="chk_lec_status" id="chk_lec_status" value="1" title="적용" onclick="chk_field(this.id);" style="margin:0; vertical-align:middle;">
                  </span>
                </th>
                <td style="border:1px solid #ddd; padding:6px 12px; vertical-align:middle;">
                  <span style="display:inline-flex; align-items:center; margin-right:12px;"><input id="lec_status2_1" name="lec_status2" type="radio" value="1" disabled="" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="lec_status2_1" style="cursor:pointer; margin:0; font-weight:normal;">출력</label></span>
                  <span style="display:inline-flex; align-items:center; margin-right:12px;"><input id="lec_status2_0" name="lec_status2" type="radio" value="0" disabled="" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="lec_status2_0" style="cursor:pointer; margin:0; font-weight:normal;">대기</label></span>
                  <span style="display:inline-flex; align-items:center;"><input id="lec_status2_2" name="lec_status2" type="radio" value="2" disabled="" style="vertical-align:middle; margin:0 4px 0 0;"> <label for="lec_status2_2" style="cursor:pointer; margin:0; font-weight:normal;">종료</label></span>
                  <div class="error_msg error_lec_status2" style="color:#d9534f; font-size:11px;"></div>		
                </td>
              </tr>
            </tbody>
          </table>
          
          <div class="panel-body" style="padding: 15px 0 5px 0;">		
            <p class="text-center MAT30" style="text-align: center; margin: 0; display: flex; justify-content: center; gap: 8px;">
              <input type="button" value="취소" onclick="closeBatchModifyModal();" class="btn btn-default" style="min-width: 70px; height: 32px; padding: 0 16px; display: inline-flex; align-items: center; justify-content: center; line-height: 1; box-sizing: border-box; border: 1px solid #ccc; background: #fff; color: #333; border-radius: 3px; font-weight: bold; cursor: pointer;">				
              <input type="submit" value="수정" data-loading-text="처리중 .." class="btn btn-primary" id="sm_sm_sm_sm" style="min-width: 70px; height: 32px; padding: 0 16px; display: inline-flex; align-items: center; justify-content: center; line-height: 1; box-sizing: border-box; border: 1px solid #357ebd; background: #428bca; color: #fff; border-radius: 3px; font-weight: bold; cursor: pointer;">
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>'''

    # Pattern for batchUploadModal
    upload_pattern = r'<!-- (?:23-Column )?Batch Upload Modal.*?</div>\s*</div>\s*</div>'
    match_upload = re.search(upload_pattern, content, re.DOTALL)
    if match_upload:
        content = content[:match_upload.start()] + new_batch_upload + content[match_upload.end():]
        print("  Successfully replaced batchUploadModal")
    else:
        print("  WARNING: batchUploadModal pattern not matched!")

    # Pattern for batchModifyModal
    modify_pattern = r'<!-- Batch Modify Modal.*?</div>\s*</div>\s*</div>'
    match_modify = re.search(modify_pattern, content, re.DOTALL)
    if match_modify:
        content = content[:match_modify.start()] + new_batch_modify + content[match_modify.end():]
        print("  Successfully replaced batchModifyModal")
    else:
        print("  WARNING: batchModifyModal pattern not matched!")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Done: {file_path}")

update_file('course_site/af/ad_lec/lists/sn/index.html')
update_file('course_site/af/ad_lec/lists/sn/3267/index.html')
