import os
from playwright.sync_api import sync_playwright

def capture():
    artifact_dir = r"C:\Users\user\.gemini\antigravity-ide\brain\fc28e79f-b539-4b51-9981-3311fd3883a5"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1400, "height": 900})

        # 1. 엑셀 출력 모달
        page.goto("http://localhost:3005/af/ad_app/lists/sn/3267")
        page.wait_for_load_state("networkidle")
        page.evaluate("openAppExcelExportModal();")
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(artifact_dir, "export_modal_01_excel.png"))
        page.evaluate("closeAppModal('modalAppExcelExport');")

        # 2. 수강신청서 출력 모달
        page.evaluate("openAppPdfPrintModal();")
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(artifact_dir, "export_modal_02_pdf_application.png"))
        
        # 2-1. 수강신청서 A4 뷰어
        page.evaluate("submitAppPdfPrint();")
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(artifact_dir, "export_modal_02_a4_sheet.png"))
        page.evaluate("closeAppModal('modalPrintableDoc');")

        # 3. 고지서 출력 모달
        page.evaluate("openAppPdf1BillPrintModal();")
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(artifact_dir, "export_modal_03_pdf1_bill.png"))
        
        # 3-1. 고지서 A4 뷰어
        page.evaluate("submitAppPdf1BillPrint();")
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(artifact_dir, "export_modal_03_bill_a4_sheet.png"))
        page.evaluate("closeAppModal('modalPrintableDoc');")

        # 4. 시간표 출력 모달
        page.evaluate("openAppPdf2TimetablePrintModal();")
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(artifact_dir, "export_modal_04_pdf2_timetable.png"))

        # 4-1. 시간표 A4 뷰어
        page.evaluate("submitAppPdf2TimetablePrint();")
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(artifact_dir, "export_modal_04_timetable_a4_sheet.png"))
        page.evaluate("closeAppModal('modalPrintableDoc');")

        browser.close()
        print("Captured 7 high-res export screenshots successfully.")

if __name__ == "__main__":
    capture()
