import re
with open('course_site/af/ad_lec/lists/sn/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

for m in re.finditer(r'<div[^>]+id=["\']([^"\']+)["\'][^>]*>', text):
    tag = m.group(0)
    if 'panel' in tag:
        print(tag[:120])
