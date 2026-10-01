from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    page.goto("http://localhost:3005/af/ad_lec/lists/sn/3267")
    page.wait_for_load_state("networkidle")
    
    title_box = page.locator("#panel_ad_lec_lists #contents_title")
    print("title_box visible:", title_box.is_visible())
    print("title_box text:", repr(title_box.inner_text()))
    
    btn_to_app = title_box.locator(".write_yun a")
    print("btn_to_app count:", btn_to_app.count())
    if btn_to_app.count() > 0:
        print("btn_to_app visible:", btn_to_app.first.is_visible())
        print("btn_to_app inner_text:", repr(btn_to_app.first.inner_text()))
        print("btn_to_app text_content:", repr(btn_to_app.first.text_content()))
    
    browser.close()
