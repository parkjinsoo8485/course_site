import time
from playwright.sync_api import sync_playwright

output_dir = r"C:\Users\user\.gemini\antigravity-ide\brain\fc28e79f-b539-4b51-9981-3311fd3883a5"

def capture_modals():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page()

        page.on("dialog", lambda dialog: dialog.accept())

        # 1. Open 신청자등록 modal with student selected and course list
        page.goto("http://localhost:3005/af/ad_app/lists/sn/3267", wait_until="networkidle")
        time.sleep(1)

        page.locator("input[value='신청자등록']").first.click()
        time.sleep(0.5)

        # Select student
        page.locator("#modalAppCreate button:has-text('검색하기')").first.click()
        time.sleep(0.5)

        # Capture Student Search Modal
        page.screenshot(path=f"{output_dir}\\modal_02_student_search.png")
        print("Captured modal_02_student_search.png")

        # Apply student
        page.locator("#stuSearchTableBody button:has-text('적용')").first.click()
        time.sleep(0.8)

        # Apply first course to show applied/cancel state
        page.locator("#sinCourseTableBody button:has-text('신청')").first.click()
        time.sleep(0.8)

        # Capture Sin Create Modal with enrolled courses & guidance
        page.screenshot(path=f"{output_dir}\\modal_01_app_create_sin.png")
        print("Captured modal_01_app_create_sin.png")

        # Close
        page.locator("#modalAppCreate .close-btn").click()
        time.sleep(0.5)

        # 2. Capture Fee Management Modal
        page.evaluate("openAppBatchFeeModal()")
        time.sleep(0.8)
        page.screenshot(path=f"{output_dir}\\modal_03_app_batch_fee.png")
        print("Captured modal_03_app_batch_fee.png")
        page.locator("#modalAppBatchFee .close-btn").click()
        time.sleep(0.5)

        # 3. Capture Batch Upload Modal
        page.evaluate("openAppBatchUploadModal()")
        time.sleep(0.5)
        page.screenshot(path=f"{output_dir}\\modal_04_app_batch_upload.png")
        print("Captured modal_04_app_batch_upload.png")
        page.locator("#modalAppBatchUpload .close-btn").click()
        time.sleep(0.5)

        # 4. Capture Course Copy Modal
        page.evaluate("openAppBatchCopyModal()")
        time.sleep(0.5)
        page.screenshot(path=f"{output_dir}\\modal_05_app_batch_copy.png")
        print("Captured modal_05_app_batch_copy.png")
        page.locator("#modalAppBatchCopy .close-btn").click()
        time.sleep(0.5)

        # 5. Capture Unapplied Students Modal
        page.evaluate("openAppUnappliedModal()")
        time.sleep(0.8)
        page.screenshot(path=f"{output_dir}\\modal_06_app_unapplied.png")
        print("Captured modal_06_app_unapplied.png")
        page.locator("#modalAppUnapplied .close-btn").click()
        time.sleep(0.5)

        browser.close()

if __name__ == "__main__":
    capture_modals()
