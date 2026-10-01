import time
from playwright.sync_api import sync_playwright

def test_authentic_modals():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page()

        # Handle dialogs (alerts and confirms) automatically
        page.on("dialog", lambda dialog: dialog.accept())

        print("1. Navigating to /af/ad_app/lists/sn/3267...")
        page.goto("http://localhost:3005/af/ad_app/lists/sn/3267", wait_until="networkidle")
        time.sleep(1)

        # Check left sidebar is intact
        sidebar = page.locator("#left_menu")
        assert sidebar.is_visible(), "Left sidebar #left_menu should be visible"
        print("  -> Sidebar #left_menu intact.")

        # Test A: Open [신청자등록] modal via input button
        print("\n2. Testing [신청자등록] modal...")
        create_btn = page.locator("input[value='신청자등록'], button:has-text('신청자등록'), a:has-text('신청자등록')").first
        create_btn.click()
        time.sleep(0.5)

        modal_create = page.locator("#modalAppCreate")
        assert modal_create.is_visible(), "#modalAppCreate should be visible"
        print("  -> #modalAppCreate opened successfully.")

        # Test B: Open [학생 검색] sub-modal
        print("\n3. Testing [검색하기] for Student Search sub-modal...")
        search_btn = page.locator("#modalAppCreate button:has-text('검색하기')").first
        search_btn.click()
        time.sleep(0.8)

        modal_search = page.locator("#modalStudentSearch")
        assert modal_search.is_visible(), "#modalStudentSearch should be visible"
        print("  -> #modalStudentSearch opened.")

        # Apply first student (김도하)
        apply_btn = page.locator("#stuSearchTableBody button:has-text('적용')").first
        apply_btn.click()
        time.sleep(0.8)

        student_info = page.locator("#sin_mem_info").input_value()
        print(f"  -> Selected student: '{student_info}'")
        assert "김도하" in student_info, "Student name should appear in #sin_mem_info"

        # Verify courses loaded in #sinCourseTableBody
        course_rows = page.locator("#sinCourseTableBody tr")
        course_count = course_rows.count()
        print(f"  -> Loaded {course_count} course rows.")
        assert course_count > 0, "Should load authentic courses"

        # Click [신청] on first course
        first_apply_btn = page.locator("#sinCourseTableBody button:has-text('신청')").first
        first_apply_btn.click()
        time.sleep(0.8)

        applied_count = page.locator("#sin_applied_count").inner_text()
        print(f"  -> Applied count after clicking 신청: {applied_count}")
        assert applied_count == "1", "Applied count should be 1"

        # Click [취소] on that course
        cancel_btn = page.locator("#sinCourseTableBody button:has-text('취소')").first
        cancel_btn.click()
        time.sleep(0.8)

        applied_count = page.locator("#sin_applied_count").inner_text()
        print(f"  -> Applied count after clicking 취소: {applied_count}")
        assert applied_count == "0", "Applied count should return to 0"

        # Close create modal
        page.locator("#modalAppCreate .close-btn").click()
        time.sleep(0.5)

        # Test C: Open [수강료입력 / 수강료 관리] modal
        print("\n4. Testing [수강료입력 / 수강료 관리] modal...")
        page.evaluate("openAppBatchFeeModal()")
        time.sleep(0.8)

        modal_fee = page.locator("#modalAppBatchFee")
        assert modal_fee.is_visible(), "#modalAppBatchFee should be visible"
        fee_rows = page.locator("#feeEditTableBody tr")
        print(f"  -> #modalAppBatchFee loaded with {fee_rows.count()} fee applicant rows.")
        assert fee_rows.count() > 0, "Fee management table should have applicant rows"

        # Test inline batch apply controls
        page.locator("#batch_apply_tuition").fill("45000")
        page.locator("#chk_all_fee_rows").click()
        page.locator("button:has-text('일괄적용')").click()
        time.sleep(0.5)

        first_tuition_val = page.locator("#feeEditTableBody .fee-tuition").first.input_value()
        print(f"  -> Batch apply tuition result on first row: {first_tuition_val}")
        assert first_tuition_val == "45000", "Tuition input should be updated to 45000"

        # Close fee modal
        page.locator("#modalAppBatchFee .close-btn").click()
        time.sleep(0.5)

        # Test D: Open [신청자 일괄입력] modal
        print("\n5. Testing [신청자 일괄입력] modal...")
        page.evaluate("openAppBatchUploadModal()")
        time.sleep(0.5)

        modal_batch = page.locator("#modalAppBatchUpload")
        assert modal_batch.is_visible(), "#modalAppBatchUpload should be visible"
        print("  -> #modalAppBatchUpload opened.")
        page.locator("#modalAppBatchUpload .close-btn").click()
        time.sleep(0.5)

        # Test E: Open [신청자 복사] modal
        print("\n6. Testing [신청자 복사] modal...")
        page.evaluate("openAppBatchCopyModal()")
        time.sleep(0.5)

        modal_copy = page.locator("#modalAppBatchCopy")
        assert modal_copy.is_visible(), "#modalAppBatchCopy should be visible"
        print("  -> #modalAppBatchCopy opened.")
        page.locator("#modalAppBatchCopy .close-btn").click()
        time.sleep(0.5)

        # Test F: Open [미신청자 목록] modal
        print("\n7. Testing [미신청자 목록] modal...")
        page.evaluate("openAppUnappliedModal()")
        time.sleep(0.8)

        modal_unapplied = page.locator("#modalAppUnapplied")
        assert modal_unapplied.is_visible(), "#modalAppUnapplied should be visible"
        unapplied_rows = page.locator("#unappliedTableBody tr")
        print(f"  -> #modalAppUnapplied loaded with {unapplied_rows.count()} unapplied students.")
        assert unapplied_rows.count() > 0, "Unapplied students table should have rows"
        page.locator("#modalAppUnapplied .close-btn").click()
        time.sleep(0.5)

        # Take screenshot of page
        screenshot_path = "scratch/authentic_modals_verified.png"
        page.screenshot(path=screenshot_path)
        print(f"\nSaved screenshot to {screenshot_path}")

        print("\n=== ALL PLAYWRIGHT UI MODAL TESTS PASSED 100%! ===")
        browser.close()

if __name__ == "__main__":
    test_authentic_modals()
