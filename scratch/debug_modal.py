from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:3005/af/ad_tea/lists/sn/3267', wait_until='networkidle')
    
    # 클릭 전
    print("Before click style:", page.evaluate('document.getElementById("modal_ad_tea_write").getAttribute("style")'))
    
    # 버튼 클릭
    page.locator("#panel_ad_tea_lists input[value='강사 등록']").click()
    page.wait_for_timeout(300)
    
    print("After click style:", page.evaluate('document.getElementById("modal_ad_tea_write").getAttribute("style")'))
    browser.close()
