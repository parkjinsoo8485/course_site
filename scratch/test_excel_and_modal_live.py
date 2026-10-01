import time
from playwright.sync_api import sync_playwright

def run():
    print("=== [Python Playwright 하네스] 엑셀 다운로드 및 모달 실기능 점검 ===")
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
            test_assert("3267" in page.url, "1. 강좌관리 페이지 정상 접속")

            # 1. 강좌 테이블 데이터 바인딩 확인
            page.wait_for_selector("#lectureTbody tr", timeout=5000)
            rows = page.locator("#lectureTbody tr")
            count = rows.count()
            test_assert(count > 0, f"2. 강좌 목록 테이블 바인딩 완료 ({count}개 행)")

            # 2. 검색결과 엑셀 출력 버튼 클릭 및 실제 다운로드 감지
            excel_btn = page.locator("button[onclick*='exportToExcel']").first
            test_assert(excel_btn.is_visible(), "3. 검색결과 엑셀출력 버튼 노출 확인")

            with page.expect_download(timeout=5000) as download_info:
                excel_btn.click()
            download = download_info.value
            filename = download.suggested_filename
            test_assert(filename.startswith("강좌목록_검색결과_") and filename.endswith(".xls"), f"4. 실제 엑셀 파일 다운로드 완료 ({filename})")

            # 3. 강좌 일괄입력 모달 오픈 검증
            batch_input_btn = page.locator("#btn_action_input").first
            batch_input_btn.click()
            page.wait_for_timeout(500)
            input_modal = page.locator("#batchUploadModal")
            test_assert(input_modal.is_visible(), "5. 강좌 일괄입력 모달 UI 정상 노출 (사이드바 유지)")

            # 모달 닫기
            page.evaluate("if (typeof closeBatchUploadModal === 'function') closeBatchUploadModal();")
            page.wait_for_timeout(500)

            # 4. 강좌 일괄수정 모달 오픈 검증
            batch_mod_btn = page.locator("#btn_action_modify").first
            batch_mod_btn.click()
            page.wait_for_timeout(500)
            mod_modal = page.locator("#batchModifyModal")
            test_assert(mod_modal.is_visible(), "6. 강좌 일괄수정 모달 UI 정상 노출 (사이드바 유지)")

            # 모달 닫기
            page.evaluate("if (typeof closeBatchModifyModal === 'function') closeBatchModifyModal();")
            page.wait_for_timeout(500)

            print(f"\n최종 결과: {passed}/{total} 항목 통과!")

        except Exception as e:
            print(f"오류 발생: {e}")
        finally:
            browser.close()

if __name__ == '__main__':
    run()
