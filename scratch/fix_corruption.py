"""
Replace the batchUploadModal file input with a styled version
"""

with open('course_site/af/ad_lec/lists/sn/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the old file input line in the batch upload modal and replace with styled version
OLD_FILE_INPUT = '''                  <input id="modal_userfile" name="modal_userfile" type="file" title="\ub370\uc774\ud130\ud30c\uc77c" accept=".csv, .txt, .xlsx, .xls" style="display:inline-block; vertical-align: middle;">&nbsp;
                  <span class="mobile_clear">(<a href="/af/ad_lec/inputs" download="lecture_batch_sample.csv" class="link_type" style="color: #337ab7; text-decoration: underline; font-weight: bold;">\uc77c\uad04\uc785\ub825 \uc0d8\ud50c \ub2e4\uc6b4\ub85c\ub4dc</a>)</span>
                  <div style="margin-top:6px; color:#666; font-size: 12px;">
                    <i class="fa fa-question-circle" style="color: #777;"></i> <a href="https://www.dbdbschool.kr/help/view/num/261/p/1/pdc/faq/sn/3267" target="_blank" style="border-bottom:1px dashed #777; color:#666; text-decoration:none;">\ud55c\uc140\ub85c \ub9cc\ub4e4\uc5b4\uc9c4 \uc5d1\uc140\ud30c\uc77c\uc740 \ubcc0\ud658 \ud6c4 \uc0ac\uc6a9\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.</a>
                  </div>'''

NEW_FILE_INPUT = '''                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <label id="modal_file_label" style="display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px; border: 1px solid #ccc; border-radius: 3px; background: #f8f9fa; cursor: pointer; font-size: 12px; color: #555; white-space: nowrap; box-sizing: border-box;">
                      <i class="fa fa-paperclip" style="color: #337ab7;"></i>
                      <span id="modal_file_name_display">\ud30c\uc77c \uc120\ud0dd...</span>
                      <input id="modal_userfile" name="modal_userfile" type="file" title="\ub370\uc774\ud130\ud30c\uc77c" accept=".csv, .txt, .xlsx, .xls" style="display: none;" onchange="document.getElementById('modal_file_name_display').textContent = this.files[0] ? this.files[0].name : '\ud30c\uc77c \uc120\ud0dd...';">
                    </label>
                    <a href="/af/ad_lec/inputs" download="lecture_batch_sample.csv" style="display: inline-flex; align-items: center; gap: 4px; height: 30px; padding: 0 10px; border: 1px solid #337ab7; border-radius: 3px; background: #fff; color: #337ab7; font-size: 12px; font-weight: bold; text-decoration: none; white-space: nowrap; box-sizing: border-box;">
                      <i class="fa fa-download"></i> \uc0d8\ud50c \ub2e4\uc6b4\ub85c\ub4dc
                    </a>
                  </div>
                  <div style="margin-top: 6px; color: #888; font-size: 11px;">
                    <i class="fa fa-info-circle" style="color: #777;"></i>
                    <a href="https://www.dbdbschool.kr/help/view/num/261/p/1/pdc/faq/sn/3267" target="_blank" style="color: #888; text-decoration: none; border-bottom: 1px dashed #aaa;">\ud55c\uc140\ub85c \ub9cc\ub4e4\uc5b4\uc9c4 \uc5d1\uc140\ud30c\uc77c\uc740 \ubcc0\ud658 \ud6c4 \uc0ac\uc6a9\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.</a>
                  </div>'''

if OLD_FILE_INPUT in content:
    new_content = content.replace(OLD_FILE_INPUT, NEW_FILE_INPUT, 1)
    print('SUCCESS: Replaced file input section')
    with open('course_site/af/ad_lec/lists/sn/index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
else:
    # Try to find it
    idx = content.find('input id="modal_userfile"')
    print(f'modal_userfile at: {idx}')
    if idx != -1:
        print(f'Context: {repr(content[max(0,idx-100):idx+400])}')
    else:
        print('NOT FOUND')
