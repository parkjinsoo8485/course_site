import re
with open('course_site/af/ad_lec/lists/sn/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

for i, line in enumerate(text.split('\n')):
    if 'contents_box' in line:
        print(f'Line {i+1}: {line}')
