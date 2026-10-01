from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    page.goto("http://localhost:3005/af/ad_lec/lists/sn/3267")
    page.wait_for_load_state("networkidle")
    
    # Checkbox counts
    all_cbs = page.evaluate("Array.from(document.querySelectorAll('.lec-checkbox')).map(cb => ({ id: cb.value, checked: cb.checked }))")
    print(f"Total .lec-checkbox: {len(all_cbs)}")
    
    # Check what chk_all does
    has_chk_all = page.evaluate("typeof window.chk_all")
    print(f"typeof window.chk_all: {has_chk_all}")
    
    # Click check_all
    chk_box = page.locator("#panel_ad_lec_lists #check_all")
    print(f"check_all is_checked before: {chk_box.is_checked()}")
    chk_box.click()
    page.wait_for_timeout(500)
    print(f"check_all is_checked after: {chk_box.is_checked()}")
    
    all_cbs_after = page.evaluate("Array.from(document.querySelectorAll('.lec-checkbox')).map(cb => cb.checked)")
    print(f"Checked count after click: {sum(all_cbs_after)} / {len(all_cbs_after)}")
    
    browser.close()
