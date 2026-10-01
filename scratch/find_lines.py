import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('course_site/af/ad_lec/lists/sn/index.html', encoding='utf-8') as f:
    lines = f.readlines()

targets = ['<body', 'id="header"', 'id="container"', 'id="left_menu"', 'class="main-content"', 'id="panel_ad_lec_lists"', 'panel_main', 'id="lectureTbody"']
for i, line in enumerate(lines):
    for t in targets:
        if t in line:
            print(f"Line {i+1} [{t}]: {line.strip()[:100]}")
