import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('course_site/af/ad_lec/lists/sn/index.html', encoding='utf-8') as f:
    local_html = f.read()

# Find main containers
for tag in ['header', 'left_menu', 'contents_box', 'contents']:
    pos = local_html.find(f'id="{tag}"')
    print(f'#{tag} present: {pos != -1}')

# Check panel structure
panels = re.findall(r'<div class="([^"]*panel[^"]*)"[^>]*>', local_html)
print('Panels in local:', panels)

# Print lines 150 to 350 of local index.html to see main body structure
lines = local_html.splitlines()
print('\n--- Lines 150 to 260 of local index.html ---')
for i in range(150, min(260, len(lines))):
    print(f'{i+1}: {lines[i]}')
