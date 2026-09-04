with open('course_site/af/ad_lec/lists/sn/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

for modal_id in ['batchUploadModal', 'batchModifyModal']:
    search = 'id="' + modal_id + '"'
    idx = content.find(search)
    print(f'=== {modal_id} at byte {idx} ===')
    if idx != -1:
        # Extract roughly the start of the div
        start = content.rfind('<div', 0, idx)
        # Find closing of modal div - look for enough depth
        chunk = content[start:start+12000]
        print(chunk[:8000])
    print()
    print('---END---')
    print()
