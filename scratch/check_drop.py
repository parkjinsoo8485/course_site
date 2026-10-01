from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={'width': 1920, 'height': 911})
    page.goto('http://localhost:3005/af/ad_app/lists/sn/3267')
    page.wait_for_load_state('networkidle')
    drop = page.locator('#submodel_ad_app_lists #main_control_box_drop')
    print('Initial is_visible:', drop.is_visible())
    print('Initial display style:', page.evaluate('window.getComputedStyle(document.querySelector("#submodel_ad_app_lists #main_control_box_drop")).display'))
    print('Calling toggleExtraMenu()...')
    page.evaluate('toggleExtraMenu()')
    print('After toggle is_visible:', drop.is_visible())
    print('After toggle display style:', page.evaluate('window.getComputedStyle(document.querySelector("#submodel_ad_app_lists #main_control_box_drop")).display'))
    b.close()
