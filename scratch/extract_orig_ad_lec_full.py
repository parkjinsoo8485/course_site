import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/page_af_ad_lec_lists_sn_3267.html', encoding='utf-8') as f:
    orig = f.read()

# Extract #contents_title to end of help_box
pos_title = orig.find('<div id="contents_title">')
pos_end = orig.find('<!-- 모달 -->')
if pos_title != -1 and pos_end != -1:
    extracted = orig[pos_title:pos_end]
    print(f"Extracted length: {len(extracted)}")
    with open('scratch/extracted_ad_lec_contents_box.html', 'w', encoding='utf-8') as out:
        out.write(extracted)
    print("Saved to scratch/extracted_ad_lec_contents_box.html")
else:
    print(f"Indices: title={pos_title}, end={pos_end}")
