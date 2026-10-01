import os
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    abs_path = os.path.abspath('scratch/page_af_ad_lec_lists_sn_3267.html')
    page.goto('file:///' + abs_path.replace('\\', '/'))
    page.wait_for_timeout(1000)

    # Check all buttons inside the button panel
    panel = page.locator('form#fm_list .panel-body').first
    print('panel innerHTML:\n', panel.inner_html())
    
    # Check all button elements in panel
    elements = panel.locator('input, a, button')
    for i in range(elements.count()):
        el = elements.nth(i)
        print(f"[{i}] tag={el.evaluate('e => e.tagName')} val={el.evaluate('e => e.value || e.innerText')} visible={el.is_visible()} box={el.bounding_box()}")

    # Capture clip screenshot
    box = panel.bounding_box()
    if box:
        page.screenshot(path='scratch/orig_panel_buttons.png', clip={'x': box['x'] - 20, 'y': box['y'] - 30, 'width': box['width'] + 40, 'height': box['height'] + 60})
        print('Saved scratch/orig_panel_buttons.png with box:', box)
    browser.close()
