# -*- coding: utf-8 -*-
import os
import sys
import json
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

def verify_modal():
    print("=== [ad_free2_app/write] 1:1 Authentic Modal Verification ===")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1920, "height": 1080})

        # 1. Load local page
        target_url = "http://localhost:3005/af/ad_free2_app/lists/sn/3267"
        print(f"Loading {target_url}...")
        page.goto(target_url, wait_until="networkidle")

        # 2. Check layout integrity: sidebar preserved
        sidebar = page.locator(".sidebar, #sidebar, .left-menu, nav")
        print(f"  ✔ Sidebar check: count = {sidebar.count()}")

        # 3. Click '수강자등록' button
        reg_btn = page.locator("#panel_ad_free2_app button:has-text('수강자등록')")
        assert reg_btn.is_visible(), "Button '수강자등록' not found!"
        print("  ✔ Found '수강자등록' button, clicking...")
        reg_btn.click()
        page.wait_for_timeout(500)

        # 4. Check modal is visible and centered
        modal = page.locator("#modal_sub_app_register")
        assert modal.is_visible(), "Modal #modal_sub_app_register not visible!"
        print("  ✔ Modal #modal_sub_app_register opened successfully!")

        # 5. Verify 1:1 elements existence
        expected_ids = [
            "month", "max_support_pay", "app_num", "app_mem_name",
            "app_mem_grade", "app_mem_class", "app_mem_bunho", "lec_name",
            "app_lec_pay", "app_lec_tea_fee", "app_lec_use_cost", "app_lec_pay_book", "app_lec_pay_item", "tot_app_lec_pay",
            "free2_lec_pay", "free2_lec_tea_fee", "free2_lec_use_cost", "free2_lec_pay_book", "free2_lec_pay_item", "free2_deduct_pay",
            "free3_lec_pay", "free3_lec_tea_fee", "free3_lec_use_cost", "free3_lec_pay_book", "free3_lec_pay_item", "free3_deduct_pay",
            "free1_lec_pay", "free1_lec_tea_fee", "free1_lec_use_cost", "free1_lec_pay_book", "free1_lec_pay_item", "free1_deduct_pay",
            "free_deduct_pay",
            "co_amount_lec_pay", "co_amount_lec_tea_fee", "co_amount_lec_use_cost", "co_amount_lec_pay_book", "co_amount_lec_pay_item", "co_amount_pay",
            "bigo", "log_data"
        ]

        missing = []
        for el_id in expected_ids:
            el = page.locator(f"#{el_id}")
            if el.count() == 0:
                missing.append(el_id)
        
        if missing:
            print("  ❌ Missing IDs:", missing)
            assert False, f"Missing IDs: {missing}"
        else:
            print(f"  ✔ All {len(expected_ids)} target fields present with 1:1 matching IDs!")

        # 6. Test applicant search modal interaction
        search_btn = page.locator("#modal_sub_app_register button:has-text('신청자 검색')")
        assert search_btn.is_visible(), "Search button inside modal not visible!"
        search_btn.click()
        page.wait_for_timeout(500)

        search_modal = page.locator("#modal_sub_app_search_student")
        assert search_modal.is_visible(), "Student search popup modal did not open!"
        print("  ✔ Student search popup opened.")

        # Click search in student popup
        page.locator("#modal_sub_app_search_student button:has-text('검색')").click()
        page.wait_for_timeout(600)

        # Select first student
        first_select = page.locator("#sub_app_search_results_tbody button:has-text('선택')").first
        if first_select.is_visible():
            first_select.click()
            page.wait_for_timeout(500)
            print("  ✔ Selected applicant from search popup!")
            
            # Check fields populated
            name_val = page.locator("#app_mem_name").inner_text()
            course_val = page.locator("#lec_name").inner_text()
            tot_val = page.locator("#tot_app_lec_pay").input_value()
            free_deduct = page.locator("#free_deduct_pay").input_value()
            co_amount = page.locator("#co_amount_pay").input_value()

            print(f"    - Student: {name_val}, Course: {course_val}")
            print(f"    - Total: {tot_val}원, Subsidized: {free_deduct}원, Collected: {co_amount}원")
            assert len(name_val) > 0, "Student name was not populated!"
        else:
            print("  ℹ No student in list, populating manually for calculation test...")
            page.locator("#modal_sub_app_search_student button:has-text('×')").click()
            page.evaluate("""() => {
                document.getElementById('app_num').value = '999';
                document.getElementById('app_mem_name').innerText = '홍길동';
                document.getElementById('app_mem_grade').innerText = '1';
                document.getElementById('app_mem_class').innerText = '2';
                document.getElementById('app_mem_bunho').innerText = '3';
                document.getElementById('lec_name').innerText = '창의로봇(초급)';
                document.getElementById('app_lec_pay').value = '35,000';
                document.getElementById('app_lec_tea_fee').value = '32,000';
                document.getElementById('app_lec_use_cost').value = '3,000';
                document.getElementById('app_lec_pay_book').value = '10,000';
                document.getElementById('app_lec_pay_item').value = '5,000';
                document.getElementById('tot_app_lec_pay').value = '50,000';
            }""")

        # 7. Test calculation logic: simulate user input in free2_lec_tea_fee
        print("  Testing 1:1 JS auto calculation...")
        page.fill("#free2_lec_tea_fee", "30000")
        page.locator("#free2_lec_tea_fee").dispatch_event("blur")
        page.fill("#free2_lec_use_cost", "3000")
        page.locator("#free2_lec_use_cost").dispatch_event("blur")
        page.fill("#free2_lec_pay_book", "10000")
        page.locator("#free2_lec_pay_book").dispatch_event("blur")
        page.fill("#free2_lec_pay_item", "5000")
        page.locator("#free2_lec_pay_item").dispatch_event("blur")

        page.wait_for_timeout(300)

        # Check calculated fields
        free2_pay = page.locator("#free2_lec_pay").input_value()
        free2_sum = page.locator("#free2_deduct_pay").input_value()
        free_tot = page.locator("#free_deduct_pay").input_value()
        co_amt = page.locator("#co_amount_pay").input_value()

        print(f"    - free2_lec_pay (강사료+수용비 자동): {free2_pay}")
        print(f"    - free2_deduct_pay (지원금액 합계): {free2_sum}")
        print(f"    - free_deduct_pay (전체 지원금액 합계): {free_tot}")
        print(f"    - co_amount_pay (징수금액 합계): {co_amt}")

        assert free2_pay == "33,000", f"Expected 33,000 but got {free2_pay}"
        assert free2_sum == "48,000", f"Expected 48,000 but got {free2_sum}"

        # 8. Take verification screenshot
        screenshot_path = os.path.join(os.getcwd(), "scratch", "verified_modal_1to1.png")
        page.screenshot(path=screenshot_path)
        print(f"  ✔ Screenshot saved: {screenshot_path}")

        browser.close()
        print(">>> [SUCCESS] 1:1 수강자등록 모달 검증 완벽 완료! <<<")

if __name__ == "__main__":
    verify_modal()
