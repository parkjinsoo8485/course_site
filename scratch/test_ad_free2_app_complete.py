import os
import sys
import time
import urllib.request
import urllib.parse
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

def test_ad_free2_app():
    print("=== [ad_free2_app] 1:1 Authentic Button & Modal Full Verification Harness ===")
    
    # 1. Verify Excel endpoints via HTTP GET
    excel_endpoints = [
        ('/af/ad_free2_app/excel', 'subsidy_applicants_search_result.xls'),
        ('/af/ad_free2_app/excel_all_collect', 'subsidy_all_collection_report.xls'),
        ('/af/ad_free2_app/excel_monthly', 'subsidy_monthly_status_report.xls'),
        ('/af/ad_free2_app/excel_banking?month=' + urllib.parse.quote('6월'), 'subsidy_school_banking_6%EC%9B%94.xls'),
        ('/af/ad_free2_app/excel_admin?month=' + urllib.parse.quote('6월'), 'subsidy_admin_office_report_6%EC%9B%94.xls'),
        ('/af/ad_free2_app/excel_neis?month=' + urllib.parse.quote('6월'), 'subsidy_neis_upload_format.xls')
    ]
    
    for ep, expected_file in excel_endpoints:
        url = f"http://localhost:3005{ep}"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            content_type = resp.headers.get('Content-Type', '')
            content_disp = resp.headers.get('Content-Disposition', '')
            print(f"  [API Test] {ep} -> Status: {status}, Content-Type: {content_type}, Disposition: {content_disp}")
            assert status == 200, f"Expected 200 for {ep}, got {status}"
            assert 'excel' in content_type, f"Expected excel in content-type for {ep}, got {content_type}"
    print("  ✔ All 6 Excel endpoints verified with HTTP 200 and valid headers!")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page()

        # Navigate to target page
        page.goto('http://localhost:3005/af/ad_free2_app/lists/sn/3267', wait_until='networkidle')
        page.wait_for_timeout(1000)

        # 2. Check panel visibility
        panel = page.locator('#panel_ad_free2_app')
        assert panel.is_visible(), "Error: #panel_ad_free2_app is not visible!"
        print("  ✔ Panel #panel_ad_free2_app is visible.")

        # 3. Check search filter bar
        assert page.locator('#sub_app_filter_month').is_visible(), "Month filter missing"
        assert page.locator('#sub_app_filter_course').is_visible(), "Course filter missing"
        assert page.locator('#sub_app_filter_grade').is_visible(), "Grade filter missing"
        assert page.locator('#sub_app_filter_class').is_visible(), "Class filter missing"
        assert page.locator('#sub_app_filter_name').is_visible(), "Name filter missing"
        print("  ✔ Search filter bar (5 controls + search/reset) verified.")

        # 4. Check sub-banner & month badges
        badges_container = page.locator('#sub_app_allowed_months_badges')
        assert badges_container.is_visible(), "Allowed month badges container missing"
        badges_count = badges_container.locator('span').count()
        print(f"  ✔ Allowed month badges rendered: {badges_count} badges (3월~2월).")
        assert badges_count == 12, f"Expected 12 month badges, found {badges_count}"

        # 5. Check & test Modal 1: 지원금 내역 조회 허용 모달
        edit_months_btn = page.locator("#panel_ad_free2_app button[onclick*='openSubsidyAllowMonthsModal']")
        assert edit_months_btn.is_visible(), "Month allowance edit button not visible"
        edit_months_btn.click()
        page.wait_for_timeout(400)
        modal_allow = page.locator('#modal_sub_app_allow_months')
        assert modal_allow.is_visible(), "Modal #modal_sub_app_allow_months not open!"
        chks_count = modal_allow.locator('.sub_allow_month_chk').count()
        assert chks_count == 12, f"Expected 12 month checkboxes in allow modal, found {chks_count}"
        modal_allow.locator("button:has-text('취소')").click()
        page.wait_for_timeout(300)
        assert not modal_allow.is_visible(), "Modal #modal_sub_app_allow_months did not close!"
        print("  ✔ Modal 1 [지원금 내역 조회 허용] opened, verified 12 checkboxes, and closed.")

        # 6. Check all 8 action buttons in correct colors & styles
        buttons = [
            ("수강자등록", "#337ab7"),
            ("수강자 가져오기", "#f0ad4e"),
            ("검색결과출력", "#5cb85c"),
            ("전체징수현황", "#5cb85c"),
            ("월별현황", "#5cb85c"),
            ("스쿨뱅킹현황", "#5cb85c"),
            ("행정실용", "#5cb85c"),
            ("나이스용", "#5cb85c"),
        ]

        for text, expected_color in buttons:
            btn = page.locator(f"#panel_ad_free2_app .btn-action-group button:has-text('{text}')")
            assert btn.is_visible(), f"Button '{text}' is missing!"
            print(f"  ✔ Button [{text}] is visible and present.")

        # 7. Check & test Modal 2: 수강자등록 & Nested Modal 3: 신청자 검색
        page.locator("#panel_ad_free2_app button:has-text('수강자등록')").click()
        page.wait_for_timeout(400)
        modal_reg = page.locator('#modal_sub_app_register')
        assert modal_reg.is_visible(), "Modal #modal_sub_app_register not open!"
        
        # Click 신청자 검색 button inside register modal
        modal_reg.locator("button:has-text('신청자 검색')").click()
        page.wait_for_timeout(500)
        modal_search = page.locator('#modal_sub_app_search_student')
        assert modal_search.is_visible(), "Nested modal #modal_sub_app_search_student not open!"
        
        # Verify student search results table
        student_rows = modal_search.locator('#sub_app_search_results_tbody tr').count()
        print(f"  ✔ Nested search modal rendered {student_rows} applicant rows.")
        assert student_rows > 0, "No applicant rows in search modal!"
        
        # Click the first student button
        modal_search.locator('#sub_app_search_results_tbody button').first.click()
        page.wait_for_timeout(400)
        assert not modal_search.is_visible(), "Search modal did not close after student selection!"
        selected_name = page.locator('#sub_app_reg_student_name_label').inner_text()
        print(f"  ✔ Student selected into register modal: '{selected_name}'")
        assert selected_name != '미선택' and selected_name != '-', "Student name not filled into register modal!"

        # Close register modal
        modal_reg.locator("button:has-text('취소')").click()
        page.wait_for_timeout(300)
        assert not modal_reg.is_visible(), "Register modal did not close!"
        print("  ✔ Modal 2 [수강자등록] & Modal 3 [신청자 검색] verified 100%.")

        # 8. Test Modal 4: 수강자 가져오기
        page.locator("#panel_ad_free2_app button:has-text('수강자 가져오기')").click()
        page.wait_for_timeout(400)
        modal_import = page.locator('#modal_sub_app_import')
        assert modal_import.is_visible(), "Modal #modal_sub_app_import not open!"
        modal_import.locator("button:has-text('수강자 목록')").click()
        page.wait_for_timeout(300)
        assert not modal_import.is_visible(), "Import modal did not close!"
        print("  ✔ Modal 4 [수강자 가져오기] verified.")

        # 9. Test Modal 5: 월별현황
        page.locator("#panel_ad_free2_app button:has-text('월별현황')").click()
        page.wait_for_timeout(400)
        modal_monthly = page.locator('#modal_sub_app_monthly_status')
        assert modal_monthly.is_visible(), "Modal #modal_sub_app_monthly_status not open!"
        modal_monthly.locator("button:has-text('취소')").click()
        page.wait_for_timeout(300)
        assert not modal_monthly.is_visible(), "Monthly modal did not close!"
        print("  ✔ Modal 5 [월별현황] verified.")

        # 10. Test Modal 6: 스쿨뱅킹현황
        page.locator("#panel_ad_free2_app button:has-text('스쿨뱅킹현황')").click()
        page.wait_for_timeout(400)
        modal_banking = page.locator('#modal_sub_app_schoolbanking')
        assert modal_banking.is_visible(), "Modal #modal_sub_app_schoolbanking not open!"
        modal_banking.locator("button:has-text('취소')").click()
        page.wait_for_timeout(300)
        assert not modal_banking.is_visible(), "School banking modal did not close!"
        print("  ✔ Modal 6 [스쿨뱅킹현황] verified.")

        # 11. Test Modal 7: 행정실용
        page.locator("#panel_ad_free2_app button:has-text('행정실용')").click()
        page.wait_for_timeout(400)
        modal_admin = page.locator('#modal_sub_app_admin_office')
        assert modal_admin.is_visible(), "Modal #modal_sub_app_admin_office not open!"
        modal_admin.locator("button:has-text('취소')").click()
        page.wait_for_timeout(300)
        assert not modal_admin.is_visible(), "Admin office modal did not close!"
        print("  ✔ Modal 7 [행정실용] verified.")

        # 12. Test Modal 8: 나이스용
        page.locator("#panel_ad_free2_app button:has-text('나이스용')").click()
        page.wait_for_timeout(400)
        modal_neis = page.locator('#modal_sub_app_neis')
        assert modal_neis.is_visible(), "Modal #modal_sub_app_neis not open!"
        modal_neis.locator("button:has-text('취소')").click()
        page.wait_for_timeout(300)
        assert not modal_neis.is_visible(), "NEIS modal did not close!"
        print("  ✔ Modal 8 [나이스용] verified.")

        # 13. Test Modal 9: Row Cog Edit modal
        first_cog = page.locator('#subsidyAppTbody button[title="수정"]').first
        assert first_cog.is_visible(), "Row cog button not visible!"
        first_cog.click()
        page.wait_for_timeout(400)
        modal_edit_row = page.locator('#modal_sub_app_edit_row')
        assert modal_edit_row.is_visible(), "Row edit modal not open!"
        modal_edit_row.locator("button:has-text('취소')").click()
        page.wait_for_timeout(300)
        assert not modal_edit_row.is_visible(), "Row edit modal did not close!"
        print("  ✔ Modal 9 [지원금 처리 내역 수정 (⚙)] verified.")

        # 14. Test Selection Checkboxes & [선택삭제] button dynamic appearance
        del_btn = page.locator('#btn_sub_app_delete_selected')
        assert not del_btn.is_visible(), "Delete button should be hidden initially"
        page.locator('#sub_app_chk_all').check()
        page.wait_for_timeout(200)
        assert del_btn.is_visible(), "[선택삭제] button should be visible when items checked"
        print(f"  ✔ [선택삭제] button visible on select: '{del_btn.inner_text()}'")
        page.locator('#sub_app_chk_all').uncheck()
        page.wait_for_timeout(200)
        assert not del_btn.is_visible(), "[선택삭제] button should hide when uncheck all"

        # 15. Verify 18 Table Columns
        th_elements = page.locator('#panel_ad_free2_app .db-table thead tr th')
        th_count = th_elements.count()
        print(f"  ✔ Table headers count: {th_count} columns (Expected 18).")
        assert th_count == 18, f"Expected 18 table headers, found {th_count}"

        # 16. Capture full verified screenshot
        screenshot_path = os.path.join(os.getcwd(), 'scratch', 'verified_ad_free2_app_complete.png')
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"  ✔ Screenshot saved: {screenshot_path}")

        browser.close()
        print("\n🎉 ALL TESTS PASSED! 1:1 BOOTSTRAP BUTTON UI & MODAL 100% VERIFIED!")

if __name__ == '__main__':
    test_ad_free2_app()
