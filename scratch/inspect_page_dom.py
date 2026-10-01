import re

with open('course_site/af/ad_lec/lists/sn/index.html', encoding='utf-8') as f:
    local_html = f.read()

with open('scratch/page_af_ad_lec_lists_sn_3267.html', encoding='utf-8') as f:
    orig_html = f.read()

print("=== 1. 타이틀 영역 비교 ===")
m_loc = re.search(r'(<div id="contents_title">.*?</div>)', local_html, re.DOTALL)
m_orig = re.search(r'(<div id="contents_title">.*?</div>)', orig_html, re.DOTALL)
print("Local contents_title:", m_loc.group(1).strip() if m_loc else "NOT FOUND")
print("Orig contents_title:", m_orig.group(1).strip() if m_orig else "NOT FOUND")

print("\n=== 2. 상단 매뉴얼 박스 & 상단 메시지 비교 ===")
m_loc_man = re.search(r'(<div class="new_help_manualbox.*?</div>\s*</div>)', local_html, re.DOTALL)
m_orig_man = re.search(r'(<div class="new_help_manualbox.*?</div>\s*</div>)', orig_html, re.DOTALL)
print("Local manualbox found:", bool(m_loc_man))
print("Orig manualbox found:", bool(m_orig_man))

print("\n=== 3. 검색 폼 (#fm_list_search) 비교 ===")
m_loc_search = re.search(r'(<form[^>]*id="fm_list_search".*?</form>)', local_html, re.DOTALL)
m_orig_search = re.search(r'(<form[^>]*id="fm_list_search".*?</form>)', orig_html, re.DOTALL)
print("Local search form found:", bool(m_loc_search))
print("Orig search form found:", bool(m_orig_search))

print("\n=== 4. 액션 버튼 (출석부 출력, 강좌 등록, 추가기능 드롭다운) 비교 ===")
m_loc_actions = re.search(r'(<ul[^>]*>\s*<li class="pull-left PAD0">.*?</ul>)', local_html, re.DOTALL)
m_orig_actions = re.search(r'(<ul[^>]*>\s*<li class="pull-left PAD0">.*?</ul>)', orig_html, re.DOTALL)
print("Local actions found:", bool(m_loc_actions))
print("Orig actions found:", bool(m_orig_actions))

print("\n=== 5. 테이블 헤더 (<table ...><thead>...</thead>) 비교 ===")
m_loc_th = re.search(r'(<thead>.*?</thead>)', local_html, re.DOTALL)
m_orig_th = re.search(r'(<thead>.*?</thead>)', orig_html, re.DOTALL)
if m_loc_th and m_orig_th:
    loc_cols = re.findall(r'<th[^>]*>(.*?)</th>', m_loc_th.group(1), re.DOTALL)
    orig_cols = re.findall(r'<th[^>]*>(.*?)</th>', m_orig_th.group(1), re.DOTALL)
    print(f"Local columns ({len(loc_cols)}):", [re.sub(r'<[^>]+>', '', c).strip().replace('\n', ' ') for c in loc_cols])
    print(f"Orig columns ({len(orig_cols)}):", [re.sub(r'<[^>]+>', '', c).strip().replace('\n', ' ') for c in orig_cols])

print("\n=== 6. 테이블 하단 / 페이지네이션 / 하단 버튼 비교 ===")
m_loc_foot = re.search(r'(</tbody>\s*</table>.*?</div>\s*</div>)', local_html, re.DOTALL)
m_orig_foot = re.search(r'(</tbody>\s*</table>.*?</div>\s*</div>)', orig_html, re.DOTALL)
print("Local footer snippet:", m_loc_foot.group(1)[:200].strip() if m_loc_foot else "NOT FOUND")
print("Orig footer snippet:", m_orig_foot.group(1)[:200].strip() if m_orig_foot else "NOT FOUND")
