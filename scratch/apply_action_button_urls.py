import re

def update_html(file_path):
    print(f"Updating HTML: {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace Action Buttons Bar
    old_btn_group_pattern = r'<!-- Action Buttons Bar.*?<div class="table-responsive">'
    new_btn_group = '''<!-- Action Buttons Bar (타깃 사이트 고유 URL 및 모달 연동) -->
          <div class="btn-action-group">
            <div>
              <a href="/af/ad_att/excel/p/1/sn/3267/sld/11/sof/ln/sot/asc" id="btn_action_att" class="btn-db btn-db-green" onclick="handleAttendanceExcel(event, this.getAttribute('href'))" style="text-decoration:none;"><i class="fa-solid fa-print"></i> 출석부 출력</a>
            </div>
            <div style="display:flex; gap:5px; flex-wrap:wrap;">
              <a href="/af/ad_lec/write/p/1/sn/3267/sld/11/sof/ln/sot/asc" id="btn_action_write" class="btn-db btn-db-blue" onclick="handleActionUrl(event, 'write', openAddModal)" style="text-decoration:none;"><i class="fa-solid fa-plus"></i> 강좌 등록</a>
              <a href="/af/ad_lec/input/p/1/sn/3267/sld/11/sof/ln/sot/asc" id="btn_action_input" class="btn-db btn-db-orange" onclick="handleActionUrl(event, 'input', openBatchUploadModal)" style="text-decoration:none;"><i class="fa-solid fa-file-import"></i> 강좌 일괄입력</a>
              <a href="/af/ad_lec/modifyField/p/1/sn/3267/sld/11/sof/ln/sot/asc" id="btn_action_modify" class="btn-db btn-db-cyan" onclick="handleActionUrl(event, 'modifyField', openBatchModifyModal)" style="text-decoration:none;"><i class="fa-solid fa-pen-to-square"></i> 강좌 일괄수정</a>
              <a href="/af/ad_lec/copy/p/1/sn/3267/sld/11/sof/ln/sot/asc" id="btn_action_copy" class="btn-db btn-db-cyan" onclick="handleActionUrl(event, 'copy', openBatchCopyModal)" style="text-decoration:none;"><i class="fa-solid fa-clone"></i> 강좌 일괄복사</a>
              <a href="/af/ad_lec/stat/sn/3267" id="btn_action_stat" class="btn-db btn-db-gray" onclick="handleActionUrl(event, 'stat', () => switchSubmodelView(event, 'ad_lec_stats', '/af/ad_lec/stats/sn/3267'))" style="text-decoration:none;"><i class="fa-solid fa-chart-simple"></i> 강좌 통계</a>
            </div>
          </div>

          <!-- Table Container -->
          <div class="table-responsive">'''

    if re.search(old_btn_group_pattern, content, re.DOTALL):
        content = re.sub(old_btn_group_pattern, new_btn_group, content, flags=re.DOTALL)
        print("  - Successfully updated btn-action-group with specific target URLs")
    else:
        print("  - WARNING: btn-action-group pattern not matched")

    # 2. Replace Batch Copy Modal
    old_copy_modal_pattern = r'<!-- Batch Copy Modal.*?</div>\s*</div>\s*</div>'
    new_copy_modal = '''  <!-- Batch Copy Modal (강좌 일괄복사 모달) -->
  <div class="modal-backdrop" id="batchCopyModal" onclick="if(event.target===this) closeBatchCopyModal();" style="position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(0,0,0,0.5) !important; z-index: 99999 !important; display: none; justify-content: center !important; align-items: center !important;">
    <div class="modal-box" style="max-width: 650px; width: 95%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin: auto !important; position: relative !important; background: #fff;">
      <div class="modal-header" style="background: #428bca; border-bottom: 1px solid #357ebd; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #fff;"><i class="fa-solid fa-clone" style="margin-right: 6px;"></i> 강좌 일괄복사</h3>
        <button class="close-btn" onclick="closeBatchCopyModal()" style="font-size: 24px; line-height: 1; background: none; border: none; cursor: pointer; color: #fff; opacity: 0.9;">&times;</button>
      </div>
      <div class="modal-body" style="padding: 20px; overflow-y: auto; flex: 1; background: #fff;">
        <div style="background: #eef7fe; border: 1px solid #cce5ff; border-radius: 4px; padding: 10px 14px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; font-size: 13px; color: #31708f;">
          <i class="fa fa-info-circle" style="font-size: 15px; color: #31708f;"></i>
          <span>선택한 강좌구분의 전체 강좌를 새로운 대상 구분으로 복제합니다.</span>
        </div>
        <form onsubmit="submitBatchCopy(event)">
          <table class="table table-bordered" style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border-top: 1px solid #ddd; font-size: 12px;">
            <tbody>
              <tr>
                <th style="width: 160px; background: #fbfbfb; font-weight: bold; color: #333; padding: 9px 12px; border: 1px solid #e7e7e7; text-align: center; vertical-align: middle;">원본 강좌 구분</th>
                <td style="padding: 8px 12px; border: 1px solid #e7e7e7; vertical-align: middle;">
                  <select id="copySourceCategory" style="width: 180px; height: 30px !important; line-height: normal !important; box-sizing: border-box !important; padding: 0 10px; border: 1px solid #ccc; border-radius: 3px; font-size: 12px;">
                    <option value="26년 8월">26년 8월</option>
                    <option value="26년 9월" selected>26년 9월</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th style="background: #fbfbfb; font-weight: bold; color: #333; padding: 9px 12px; border: 1px solid #e7e7e7; text-align: center; vertical-align: middle;">복사 대상 구분명 <span style="color: #d9534f;">☑</span></th>
                <td style="padding: 8px 12px; border: 1px solid #e7e7e7; vertical-align: middle;">
                  <input type="text" id="copyTargetCategory" value="26년 10월" style="width: 180px; height: 30px; line-height: normal; box-sizing: border-box; padding: 0 10px; border: 1px solid #ccc; border-radius: 3px; font-size: 12px;" required>
                </td>
              </tr>
              <tr>
                <th style="background: #fbfbfb; font-weight: bold; color: #333; padding: 9px 12px; border: 1px solid #e7e7e7; text-align: center; vertical-align: middle;">설정값 복제</th>
                <td style="padding: 8px 12px; border: 1px solid #e7e7e7; vertical-align: middle;">
                  <label style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer; margin: 0; font-size: 12px;">
                    <input type="checkbox" id="copyFeesCheck" checked style="margin: 0; vertical-align: middle;">
                    <span>수강료 및 시간표 설정값 동시 복사</span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top: 15px; text-align: center; display: flex; justify-content: center; gap: 8px;">
            <button type="button" class="btn btn-default" onclick="closeBatchCopyModal()" style="min-width: 70px; height: 32px; padding: 0 16px; border: 1px solid #ccc; background: #fff; color: #333; border-radius: 3px; font-weight: bold; cursor: pointer;">취소</button>
            <button type="submit" class="btn btn-primary" style="min-width: 70px; height: 32px; padding: 0 16px; background: #428bca; border: 1px solid #357ebd; color: #fff; border-radius: 3px; font-weight: bold; cursor: pointer;"><i class="fa-solid fa-clone"></i> 일괄복사 실행</button>
          </div>
        </form>
      </div>
    </div>
  </div>'''

    if re.search(old_copy_modal_pattern, content, re.DOTALL):
        content = re.sub(old_copy_modal_pattern, new_copy_modal, content, flags=re.DOTALL)
        print("  - Successfully updated batchCopyModal")
    else:
        print("  - WARNING: batchCopyModal pattern not matched")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Completed HTML update: {file_path}")

update_html('course_site/af/ad_lec/lists/sn/index.html')
update_html('course_site/af/ad_lec/lists/sn/3267/index.html')
