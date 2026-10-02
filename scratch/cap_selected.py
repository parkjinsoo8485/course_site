from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1400, 'height': 900})
    page.goto('http://localhost:3005/af/ad_free2_app/lists/sn/3267', wait_until='networkidle')
    
    # 수강자등록 열기
    page.locator("#panel_ad_free2_app button:has-text('수강자등록')").click()
    page.wait_for_timeout(300)
    
    # 신청자 검색 클릭
    page.locator("#modal_sub_app_register button:has-text('신청자 검색')").click()
    page.wait_for_timeout(400)
    
    # 학생 선택
    page.locator('#sub_app_search_results_tbody button').first.click()
    page.wait_for_timeout(500)
    
    # 캡처
    page.screenshot(path='scratch/modal_after_student_selected.png')
    browser.close()
print("Selected screenshot saved")
