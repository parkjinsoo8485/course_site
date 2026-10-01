import time
from playwright.sync_api import sync_playwright

def run():
    print("=== [2단계 하네스 검증] 수강신청관리 엑셀 다운로드 및 모달 실기능 점검 ===")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(accept_downloads=True)
        page = context.new_page()

        passed = 0
        total = 0
        def test_assert(condition, desc):
            nonlocal passed, total
            total += 1
            if condition:
                print(f"  [PASS] {desc}")
                passed += 1
            else:
                print(f"  [FAIL] {desc}")

        try:
            page.goto("http://localhost:3005/af/ad_lec/lists/sn/3267")
            page.wait_for_load_state("networkidle")

            # 1. 신청자관리 탭 전환
            page.evaluate("switchSubmodelView(null, 'ad_app_lists', '/af/ad_app/lists/sn/3267', true);")
            page.wait_for_timeout(1000)

            panel = page.locator("#panel_ad_app_lists")
            test_assert(panel.is_visible(), "1. 수강신청목록 패널 전환 확인")

            # 2. 신청자 데이터 로딩 확인
            page.wait_for_selector("#studentTbody tr", timeout=5000)
            rows = page.locator("#studentTbody tr")
            count = rows.count()
            test_assert(count > 0, f"2. 신청자 목록 데이터 바인딩 완료 ({count}명)")

            # 3. 신청자 검색결과 엑셀(.xls) 다운로드 검증
            app_excel_btn = page.locator("button[onclick*='exportAppExcel']").first
            test_assert(app_excel_btn.is_visible(), "3. 신청자 엑셀출력 버튼 노출 확인")

            with page.expect_download(timeout=5000) as download_info:
                app_excel_btn.click()
            download = download_info.value
            filename = download.suggested_filename
            test_assert(filename.startswith("수강신청자목록_검색결과_") and filename.endswith(".xls"), f"4. 실제 신청자 엑셀 파일 다운로드 완료 ({filename})")

            # 4. 스쿨뱅킹 CSV 다운로드 검증
            banking_btn = page.locator("button[onclick*='downloadSchoolBankingCsv']").first
            test_assert(banking_btn.is_visible(), "5. 스쿨뱅킹 CSV 다운로드 버튼 노출 확인")

            with page.expect_download(timeout=5000) as download_info:
                banking_btn.click()
            download_csv = download_info.value
            csv_filename = download_csv.suggested_filename
            test_assert(csv_filename.startswith("school_banking_") and csv_filename.endswith(".csv"), f"6. 스쿨뱅킹 CSV 파일 다운로드 완료 ({csv_filename})")

            # 5. 수강신청서 인쇄 모달 실데이터 검증
            page.evaluate("if (typeof openAppPrintModal === 'function') openAppPrintModal('application');")
            page.wait_for_timeout(500)
            print_modal = page.locator("#modalAppPrint")
            test_assert(print_modal.is_visible(), "7. 수강신청서 인쇄 모달 UI 정상 노출")

            print_content = page.locator("#appPrintContentArea").inner_text()
            test_assert("광주풍향초등학교" in print_content and "수강신청 확인서" in print_content, "8. 수강신청서 내 학교명 및 신청확인서 실데이터 렌더링 확인")

            # 6. 납입고지서 인쇄 모달 실데이터 검증
            page.evaluate("if (typeof openAppPrintModal === 'function') openAppPrintModal('bill');")
            page.wait_for_timeout(500)
            bill_content = page.locator("#appPrintContentArea").inner_text()
            test_assert("납입고지서" in bill_content and "스쿨뱅킹" in bill_content, "9. 납입고지서 실데이터 및 계좌 정보 렌더링 확인")

            # 모달 닫기
            page.evaluate("if (typeof closeAppModal === 'function') closeAppModal('modalAppPrint');")
            page.wait_for_timeout(300)

            # 7. 수강료 납부/학생정보 수정 모달 검증
            first_edit_btn = page.locator("#studentTbody tr button[onclick*='openAppEditModal']").first
            if first_edit_btn.is_visible():
                first_edit_btn.click()
            else:
                page.evaluate("if (typeof openAppEditModal === 'function') openAppEditModal(1);")
            page.wait_for_timeout(500)

            edit_modal = page.locator("#modalAppEdit")
            test_assert(edit_modal.is_visible(), "10. 수강료/학생정보 수정 모달 UI 정상 오픈")

            # 모달 닫기
            page.evaluate("if (typeof closeAppModal === 'function') closeAppModal('modalAppEdit');")
            page.wait_for_timeout(300)

            print(f"\n최종 결과: {passed}/{total} 항목 통과!")

        except Exception as e:
            print(f"오류 발생: {e}")
        finally:
            browser.close()

if __name__ == '__main__':
    run()
