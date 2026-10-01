import re

with open('course_site/af/ad_lec/lists/sn/index.html', encoding='utf-8') as f:
    c = f.read()

m = re.findall(r'<input[^>]*id="check_all"[^>]*>', c)
print("check_all matches:", m)
