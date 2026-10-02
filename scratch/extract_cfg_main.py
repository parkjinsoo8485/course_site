import re

def extract_main():
    with open('scratch/live_ad_free2_cfg_main.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # right_col or contents_box
    idx1 = html.find('id="contents_box"')
    if idx1 == -1:
        idx1 = html.find("class=\"right_col\"")
    
    if idx1 != -1:
        print("Found starting index:", idx1)
        sub = html[idx1-20:idx1+15000]
        # find closing
        with open('scratch/extracted_ad_free2_cfg_main.html', 'w', encoding='utf-8') as out:
            out.write(sub)
        print("Written extracted_ad_free2_cfg_main.html")

    # 버튼들 찾기
    buttons = re.findall(r'(<(?:button|input)[^>]*?(?:submit|button|btn)[^>]*?>.*?<\/(?:button)?>|<input[^>]*?(?:type=[\'"]submit[\'"]|type=[\'"]button[\'"])[^>]*?>)', html, re.IGNORECASE)
    print(f"Total buttons found: {len(buttons)}")
    for b in buttons[:20]:
        print("BTN:", b)

    # 폼이나 카드 영역
    tables = re.findall(r'<table[^>]*>.*?</table>', html, re.DOTALL)
    print(f"Total tables: {len(tables)}")

if __name__ == '__main__':
    extract_main()
