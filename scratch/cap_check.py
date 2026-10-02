from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1400, 'height': 900})
    page.goto('http://localhost:3005/af/ad_free2_app/lists/sn/3267', wait_until='networkidle')
    page.wait_for_timeout(1000)
    page.screenshot(path='scratch/current_page_view.png')
    
    # 1. 수강자등록 모달 열기
    page.locator("#panel_ad_free2_app button:has-text('수강자등록')").click()
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/current_modal_reg.png')
    
    # 스크롤 중간
    box = page.locator('#modal_sub_app_register .modal-box')
    box.evaluate('el => el.scrollTop = 500')
    page.wait_for_timeout(300)
    page.screenshot(path='scratch/current_modal_reg_mid.png')

    # 스크롤 바닥
    box.evaluate('el => el.scrollTop = el.scrollHeight')
    page.wait_for_timeout(300)
    page.screenshot(path='scratch/current_modal_reg_bottom.png')
    
    # 신청자 검색 모달 열기
    page.locator("#modal_sub_app_register button:has-text('신청자 검색')").click()
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/current_modal_search.png')
    
    browser.close()
print("Screenshots captured successfully")
