import re

ad_app_buttons_block = '''          <!-- Action Buttons Bar -->
          <div class="btn-action-group">
            <div style="display:flex; gap:6px; align-items:center;">
              <button class="btn-db btn-db-outline" onclick="switchSubmodelView(event, 'ad_wait_lists', '/af/ad_wait/lists/sn/3267')"><i class="fa-solid fa-clock-rotate-left"></i> 대기자목록</button>
              <span style="font-size:12px; color:#64748b; margin-left:4px;">(총 <strong id="applicantCountSpan" style="color:#2563eb;">0</strong>명)</span>
            </div>
            <div style="display:flex; gap:5px; flex-wrap:wrap;">
              <button class="btn-db btn-db-blue" onclick="openAppCreateModal()"><i class="fa-solid fa-user-plus"></i> 신청자동록</button>
              <button class="btn-db btn-db-orange" onclick="openAppBatchUploadModal()"><i class="fa-solid fa-file-import"></i> 신청자일괄입력</button>
              <button class="btn-db btn-db-orange" onclick="openAppBatchFeeModal()"><i class="fa-solid fa-won-sign"></i> 수강료입력</button>
              <button class="btn-db btn-db-cyan" onclick="openAppBatchCopyModal()"><i class="fa-solid fa-clone"></i> 신청자복사</button>
              <button class="btn-db btn-db-gray" onclick="openAppChangeHistoryModal()"><i class="fa-solid fa-clock-rotate-left"></i> 추가/취소자조회</button>
              <button class="btn-db btn-db-gray" onclick="openAppUnregisteredModal()"><i class="fa-solid fa-user-slash"></i> 미신청자목록</button>
              <button class="btn-db btn-db-green" onclick="exportAppExcel()"><i class="fa-solid fa-file-excel"></i> 신청결과엑셀출력</button>
              <button class="btn-db btn-db-green" onclick="openAppPrintModal('application')"><i class="fa-solid fa-print"></i> 수강신청서출력</button>
              <button class="btn-db btn-db-green" onclick="openAppPrintModal('bill')"><i class="fa-solid fa-receipt"></i> 고지서출력</button>
              <button class="btn-db btn-db-green" onclick="openAppPrintModal('timetable')"><i class="fa-solid fa-calendar-days"></i> 시간표출력</button>
            </div>
          </div>

          <!-- Bulk Status Bar -->
          <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; padding:8px 12px; border-radius:4px; margin-bottom:10px; font-size:12px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span>선택 수강생 일괄 처리:</span>
              <button class="btn-db btn-db-blue" style="padding:2px 8px; font-size:11.5px;" onclick="handleBulkAppStatus('승인')"><i class="fa-solid fa-check"></i> 선택 승인</button>
              <button class="btn-db btn-db-gray" style="padding:2px 8px; font-size:11.5px;" onclick="handleBulkAppStatus('신청대기')"><i class="fa-solid fa-pause"></i> 선택 대기</button>
              <button class="btn-db btn-db-coral" style="padding:2px 8px; font-size:11.5px;" onclick="handleBulkAppStatus('취소')"><i class="fa-solid fa-xmark"></i> 선택 취소</button>
              <button class="btn-db btn-db-coral" style="padding:2px 8px; font-size:11.5px; background:#b91c1c;" onclick="handleBulkAppDelete()"><i class="fa-solid fa-trash"></i> 선택 삭제</button>
            </div>
            <div>
              <span style="color:#64748b;">※ 번호 헤더 클릭 시 번호 오름차순/등록순 정렬이 전환됩니다.</span>
            </div>
          </div>'''

def fix_ad_app(file_path):
    print(f"Fixing ad_app buttons in: {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Locate appMainTable and restore the buttons above it
    pattern = r'<!-- Action Buttons Bar \(타깃 사이트 고유 URL 및 모달 연동\).*?(?=<div class="table-responsive">\s*<table class="db-table" id="appMainTable">)'
    if re.search(pattern, content, re.DOTALL):
        content = re.sub(pattern, ad_app_buttons_block + '\n\n          ', content, flags=re.DOTALL)
        print("  ✅ Restored ad_app buttons successfully")
    else:
        print("  ⚠️ Pattern not found for ad_app buttons")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_ad_app('course_site/af/ad_lec/lists/sn/index.html')
fix_ad_app('course_site/af/ad_lec/lists/sn/3267/index.html')

# Also sync batchCopyModal from 3267/index.html to index.html
with open('course_site/af/ad_lec/lists/sn/3267/index.html', 'r', encoding='utf-8') as f:
    c3267 = f.read()

m = re.search(r'<!-- Batch Copy Modal \(강좌 일괄복사 모달 - copy 클론\).*?</div>\s*</div>\s*</div>', c3267, re.DOTALL)
if m:
    batch_copy_html = m.group(0)
    with open('course_site/af/ad_lec/lists/sn/index.html', 'r', encoding='utf-8') as f:
        c_main = f.read()
    
    c_main = re.sub(r'<!-- Batch Copy Modal.*?</div>\s*</div>\s*</div>', batch_copy_html, c_main, flags=re.DOTALL)
    with open('course_site/af/ad_lec/lists/sn/index.html', 'w', encoding='utf-8') as f:
        f.write(c_main)
    print("✅ Synced batchCopyModal from 3267/index.html to index.html")
else:
    print("⚠️ batchCopyModal in 3267 not found")
