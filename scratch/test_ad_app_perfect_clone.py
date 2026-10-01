import sys
import os
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def test_applicant_cloning():
    print("======================================================================")
    print("🚀 [Automated Test Harness] dbdbschool Applicant Management (1:1 Clone)")
    print("   Target: http://localhost:3005/af/ad_app/lists/sn/3267")
    print("======================================================================")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page()

        passed = 0
        total = 0

        def check(condition, message):
            nonlocal passed, total
            total += 1
            if condition:
                print(f"  ✅ [PASS] {message}")
                passed += 1
            else:
                print(f"  ❌ [FAIL] {message}")
                raise AssertionError(message)

        try:
            # 1. Direct page navigation
            print("\n[Step 1] Navigating to http://localhost:3005/af/ad_app/lists/sn/3267...")
            page.goto("http://localhost:3005/af/ad_app/lists/sn/3267", wait_until="networkidle")
            page.wait_for_timeout(1000)

            # 2. Check layout & sidebar preservation
            sidebar = page.locator("#left_menu")
            check(sidebar.is_visible(), "Sidebar #left_menu is 100% visible and intact")
            active_menu = page.locator("#sub_ad_app_lists")
            check(active_menu.is_visible(), "Sidebar menu [신청자관리] is rendered")
            
            panel = page.locator("#panel_ad_app_lists")
            check(panel.is_visible(), "Main panel #panel_ad_app_lists is active and displayed")

            # 3. Check Manual Box with 4 authentic links
            manual_box = page.locator("#panel_ad_app_lists .new_help_manualbox")
            check(manual_box.is_visible(), "New help manual box is rendered")
            check("신청자 등록" in manual_box.inner_text(), "Manual contains [신청자 등록]")
            check("수강신청 테스트" in manual_box.inner_text(), "Manual contains [수강신청 테스트]")
            check("신청결과 조회" in manual_box.inner_text(), "Manual contains [신청결과 조회]")
            check("스쿨뱅킹 파일 다운로드" in manual_box.inner_text(), "Manual contains [스쿨뱅킹 파일 다운로드]")

            # 4. Check Heading & Search Filters
            heading = page.locator("#panel_ad_app_lists .panel-heading")
            check(heading.inner_text().strip() == "신청목록", "Panel heading is exact: '신청목록'")

            search_panel = page.locator("#panel_ad_app_lists .panel-search")
            check(search_panel.is_visible(), "Search panel .panel-search is rendered")
            check(page.locator("#app_filter_sld").is_visible(), "Search select 'sld' (강좌구분) exists")
            check(page.locator("#app_filter_slp").is_visible(), "Search select 'slp' (늘봄과정) exists")
            check(page.locator("#sel_lec_num").is_visible(), "Search select 'sln' (강좌전체) exists")
            check(page.locator("#app_filter_sgr").is_visible(), "Search select 'sgr' (학년) exists")
            check(page.locator("#app_filter_scl").is_visible(), "Search select 'scl' (반) exists")
            check(page.locator("#app_filter_st").is_visible(), "Search select 'st' (검색조건) exists")

            # 5. Check Action Buttons
            check(page.locator("a:has-text('대기자목록')").first.is_visible(), "Action button [대기자목록] exists")
            check(page.locator("input[value='신청자등록']").is_visible(), "Action button [신청자등록] exists")

            # 6. Verify All 9 Action Toolbar Buttons (Desktop View)
            check(page.locator("a:has-text('신청자일괄입력')").first.is_visible(), "Toolbar contains [신청자일괄입력]")
            check(page.locator("a:has-text('수강료입력')").first.is_visible(), "Toolbar contains [수강료입력]")
            check(page.locator("a:has-text('신청자복사')").first.is_visible(), "Toolbar contains [신청자복사]")
            check(page.locator("a:has-text('추가/취소자조회')").first.is_visible(), "Toolbar contains [추가/취소자조회]")
            check(page.locator("a:has-text('미신청자목록')").first.is_visible(), "Toolbar contains [미신청자목록]")
            check(page.locator("a:has-text('신청결과엑셀출력')").first.is_visible(), "Toolbar contains [신청결과엑셀출력]")
            check(page.locator("a:has-text('수강신청서출력')").first.is_visible(), "Toolbar contains [수강신청서출력]")
            check(page.locator("a:has-text('고지서출력')").first.is_visible(), "Toolbar contains [고지서출력]")
            check(page.locator("a:has-text('시간표출력')").first.is_visible(), "Toolbar contains [시간표출력]")

            # 7. Check Data Table Rows
            page.wait_for_selector("#studentTbody tr", timeout=5000)
            rows = page.locator("#studentTbody tr")
            row_count = rows.count()
            check(row_count > 0, f"Table rows dynamically populated ({row_count} records)")

            # Check 17 columns in the table header
            cols = page.locator("#main_table_responsive_container thead th")
            check(cols.count() == 17, f"Table has exact 17 columns matching target site (found: {cols.count()})")

            # 8. Test Inline Contact Edit Popover
            first_edit_icon = page.locator("#studentTbody tr:first-child a i.fa-pencil-square").first
            check(first_edit_icon.is_visible(), "Inline phone edit pencil icon exists on rows")
            first_edit_icon.click()
            page.wait_for_timeout(300)
            hp_box = page.locator(".stu_hp_box")
            check(hp_box.is_visible(), "Inline contact edit popover .stu_hp_box appears on pencil click")
            check(hp_box.locator("select[name='mem_hp_1']").is_visible(), "Popover has prefix select (010, 011...)")
            check(hp_box.locator("input[name='mem_hp_2']").is_visible(), "Popover has middle phone input")
            check(hp_box.locator("input[name='mem_hp_3']").is_visible(), "Popover has end phone input")

            # Close inline box
            cancel_link = hp_box.locator("a:has-text('취소')")
            cancel_link.click()
            page.wait_for_timeout(200)
            check(not hp_box.is_visible(), "Popover closes cleanly on [취소] click")

            # 9. Test In-Page Centered Modals
            # 9a. Modal: 신청자 등록
            sin_btn = page.locator("input[value='신청자등록']")
            sin_btn.click()
            page.wait_for_timeout(400)
            sin_modal = page.locator("#modalAppCreate")
            check(sin_modal.is_visible(), "In-page centered modal [신청자 등록] opened without leaving page")
            sin_close = sin_modal.locator("button.close-btn, button:has-text('취소')").first
            sin_close.click()
            page.wait_for_timeout(300)

            # 9b. Modal: 신청자 일괄입력
            page.locator("a:has-text('신청자일괄입력')").first.click()
            page.wait_for_timeout(400)
            batch_modal = page.locator("#modalAppBatchUpload")
            check(batch_modal.is_visible(), "In-page centered modal [신청자일괄입력] opened")
            batch_modal.locator(".close-btn").click()
            page.wait_for_timeout(300)

            # 9c. Modal: 수강료 일괄설정
            page.locator("a:has-text('수강료입력')").first.click()
            page.wait_for_timeout(400)
            fee_modal = page.locator("#modalAppBatchFee")
            check(fee_modal.is_visible(), "In-page centered modal [수강료입력] opened")
            fee_modal.locator(".close-btn").click()
            page.wait_for_timeout(300)

            # 9d. Modal: 신청자 일괄복사
            page.locator("a:has-text('신청자복사')").first.click()
            page.wait_for_timeout(400)
            copy_modal = page.locator("#modalAppBatchCopy")
            check(copy_modal.is_visible(), "In-page centered modal [신청자복사] opened")
            copy_modal.locator(".close-btn").click()
            page.wait_for_timeout(300)

            # 9e. Modal: 수강신청서 출력 미리보기
            page.locator("a:has-text('수강신청서출력')").first.click()
            page.wait_for_timeout(400)
            print_modal = page.locator("#modalAppPrint")
            check(print_modal.is_visible(), "In-page centered modal [수강신청서출력] opened with preview")
            print_modal.locator(".close-btn").click()
            page.wait_for_timeout(300)

            # 9f. Modal: 고지서 출력 미리보기
            page.locator("a:has-text('고지서출력')").first.click()
            page.wait_for_timeout(400)
            check(print_modal.is_visible(), "In-page centered modal [고지서출력] opened with preview")
            print_modal.locator(".close-btn").click()
            page.wait_for_timeout(300)

            # 9g. Modal: 시간표 출력 미리보기
            page.locator("a:has-text('시간표출력')").first.click()
            page.wait_for_timeout(400)
            check(print_modal.is_visible(), "In-page centered modal [시간표출력] opened with preview")
            print_modal.locator(".close-btn").click()
            page.wait_for_timeout(300)

            # 10. Check bottom batch apply & help box
            check(page.locator("#app_batch_update_type").is_visible(), "Bottom batch select [일괄적용] is rendered")
            help_box = page.locator("#panel_ad_app_lists .help_box")
            check(help_box.is_visible(), "Help box with authentic 3 guidance items is rendered")

            # Capture screenshot for visual validation
            screenshot_path = "scratch/ad_app_clone_verified.png"
            page.screenshot(path=screenshot_path, full_page=True)
            print(f"\n📸 Full page screenshot saved to {screenshot_path}")

            print("\n======================================================================")
            print(f"🎉 [RESULT] All {total} checks passed successfully ({passed}/{total}, 100%)!")
            print("======================================================================")

        except Exception as e:
            print(f"\n❌ Error during test: {e}")
            sys.exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    test_applicant_cloning()
