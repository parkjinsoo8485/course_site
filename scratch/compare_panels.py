with open('course_site/af/ad_lec/lists/sn/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

def print_panel_structure(panel_id):
    start = text.find(f'id="{panel_id}"')
    if start == -1:
        print(f'Panel {panel_id} not found')
        return
    # Find next submodel-panel
    next_panel = text.find('class="submodel-panel"', start + 30)
    chunk = text[start:next_panel] if next_panel != -1 else text[start:start+2000]
    print(f'=== {panel_id} ===')
    lines = chunk.split('\n')
    for line in lines[:50]:
        print(line)

print_panel_structure('panel_ad_app_lists')
print_panel_structure('panel_ad_wait_lists')
print_panel_structure('panel_ad_ref_lists')
