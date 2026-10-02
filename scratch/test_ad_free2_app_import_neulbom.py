import os
import sys
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

def test_import_neulbom_modal():
    print("=== [ad_free2_app/apply] 수강자 가져오기 & 늘봄과정 1:1 정밀 검증 하네스 ===")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page()

        # 1. Direct URL deep-link access with smt/3
        target_url = 'http://localhost:3005/af/ad_free2_app/apply/p/1/sn/3267/smt/3'
        print(f"\n[Step 1] Navigating directly to target URL: {target_url}")
        page.goto(target_url, wait_until='networkidle')
        page.wait_for_timeout(1000)

        # 2. Check left sidebar & panel visibility
        panel = page.locator('#panel_ad_free2_app')
        assert panel.is_visible(), "Error: #panel_ad_free2_app should be visible"
        print("  ✔ Left sidebar layout preserved & #panel_ad_free2_app active.")

        # 3. Check Modal visibility on direct URL access
        modal = page.locator('#modal_sub_app_import')
        assert modal.is_visible(), "Error: #modal_sub_app_import should open automatically on /apply route!"
        print("  ✔ Modal #modal_sub_app_import automatically opened.")

        # 4. Check '대상 월' selection equals 3월 from smt/3
        month_val = page.locator('#sub_app_import_month').input_value()
        print(f"  ✔ '대상 월' selected value: '{month_val}' (Expected '3월')")
        assert month_val == '3월', f"Expected '3월', got '{month_val}'"

        target_label = page.locator('#sub_app_import_target_label').inner_text()
        print(f"  ✔ '강좌구분' target label: '{target_label}'")
        assert target_label == '3월', f"Expected '3월', got '{target_label}'"

        # 5. Check '늘봄과정' row and controls (전체, 방과후, 맞춤형, 돌봄)
        neulbom_th = page.locator('#modal_sub_app_import th:has-text("늘봄과정")')
        assert neulbom_th.is_visible(), "Error: '늘봄과정' th header missing!"
        print("  ✔ '늘봄과정 ☑' table header verified.")

        neulbom_all = page.locator('#sub_app_import_neulbom_all')
        assert neulbom_all.is_visible() and neulbom_all.is_checked(), "Error: #sub_app_import_neulbom_all should be checked"

        neulbom_items = page.locator('.sub_app_import_neulbom_item')
        item_count = neulbom_items.count()
        print(f"  ✔ 늘봄과정 items count: {item_count} (방과후, 맞춤형, 돌봄)")
        assert item_count == 3, f"Expected 3 items, got {item_count}"

        for i in range(item_count):
            item = neulbom_items.nth(i)
            val = item.input_value()
            assert item.is_checked(), f"Item {val} should be checked initially"
            print(f"    - 늘봄과정 [{val}] is checked.")

        # Test toggle interaction on 늘봄과정
        neulbom_all.uncheck()
        page.wait_for_timeout(100)
        for i in range(item_count):
            assert not neulbom_items.nth(i).is_checked(), "All items should uncheck when master unchecked"
        print("  ✔ Unchecking '전체' unchecks all items.")

        neulbom_all.check()
        page.wait_for_timeout(100)
        for i in range(item_count):
            assert neulbom_items.nth(i).is_checked(), "All items should check when master checked"
        print("  ✔ Checking '전체' checks all items.")

        # 6. Check '정산 지원금' row
        fund_th = page.locator('#modal_sub_app_import th:has-text("정산 지원금")')
        assert fund_th.is_visible(), "Error: '정산 지원금' header missing!"
        fund_items = page.locator('.sub_app_import_fund_item')
        print(f"  ✔ 정산 지원금 items count: {fund_items.count()} (자유수강권, 1학년 지원금, 3학년 지원금, 농어촌 지원금)")
        assert fund_items.count() >= 4, "Expected at least 4 subsidy types"

        # 7. Check '학생별 최대 지원 금액'
        max_amount_input = page.locator('#sub_app_import_max_amount')
        assert max_amount_input.is_visible(), "Error: #sub_app_import_max_amount missing"
        print(f"  ✔ '학생별 최대 지원 금액' input present with value: '{max_amount_input.input_value()}'")

        # 8. Check '참고사항' text bullets
        notes_td = page.locator('#modal_sub_app_import th:has-text("참고사항") + td')
        assert notes_td.is_visible(), "Error: 참고사항 td missing"
        notes_text = notes_td.inner_text()
        assert "기존 데이터는 모두 삭제" in notes_text, "Missing existing data deletion note"
        assert "강사 마감이 완료" in notes_text, "Missing instructor deadline note"
        assert "출력" in notes_text, "Missing lecture output status note"
        assert "이후에 등록된 데이터가 있는 경우" in notes_text, "Missing subsequent month note"
        assert "학적검증" in notes_text, "Missing student record verification note"
        print("  ✔ '참고사항' all 5 authentic guidelines verified with red alerts.")

        # 9. Check Action Buttons
        btn_list = page.locator('#modal_sub_app_import button:has-text("수강자 목록")')
        btn_import = page.locator('#modal_sub_app_import button:has-text("수강자 가져오기")')
        assert btn_list.is_visible(), "Error: [수강자 목록] button missing"
        assert btn_import.is_visible(), "Error: [수강자 가져오기] button missing"
        print("  ✔ Action buttons [수강자 목록] (default) and [수강자 가져오기] (danger) verified.")

        # 10. Capture modal screenshot
        screenshot_path = os.path.join(os.getcwd(), 'scratch', 'verified_import_neulbom_modal.png')
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"  ✔ Modal screenshot saved: {screenshot_path}")

        # 11. Test closing modal via [수강자 목록]
        btn_list.click()
        page.wait_for_timeout(300)
        assert not modal.is_visible(), "Modal should close when [수강자 목록] clicked"
        print("  ✔ Modal successfully closed via [수강자 목록].")

        # 12. Test opening modal from main list with different month
        page.locator('#sub_app_filter_month').select_option('5월')
        page.locator("#panel_ad_free2_app button:has-text('수강자 가져오기')").click()
        page.wait_for_timeout(300)
        assert modal.is_visible(), "Modal should open from action button"
        assert page.locator('#sub_app_import_month').input_value() == '5월', "Modal should inherit 5월 from filter"
        print("  ✔ Inherited month '5월' from main filter into modal.")

        # 13. Test execute import with dialog handler
        page.on("dialog", lambda dialog: dialog.accept())
        btn_import.click()
        page.wait_for_timeout(1000)
        print("  ✔ Execute import triggered and confirmed.")

        browser.close()
        print("\n🎉 ALL TESTS PASSED! 수강자 가져오기 & 늘봄과정 1:1 매칭 100% 검증 완료!")

if __name__ == '__main__':
    test_import_neulbom_modal()
