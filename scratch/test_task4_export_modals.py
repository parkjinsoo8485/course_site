import time
from playwright.sync_api import sync_playwright

def run():
    print("=== [Task 4 하네스 검증] 신청결과엑셀/수강신청서/고지서/시간표 출력 실기능 점검 ===")
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
            # 1. 신청자관리 페이지 접속 및 좌측 사이드바 보존 확인
            page.goto("http://localhost:3005/af/ad_app/lists/sn/3267")
            page.wait_for_load_state("networkidle")
            sidebar = page.locator("#left_menu")
            test_assert(sidebar.is_visible(), "1. 신청자관리 페이지 접속 및 좌측 사이드바(#left_menu) 100% 정상 유지")

            # 2. '신청결과엑셀출력' 모달 검증
            page.evaluate("if (typeof openAppExcelExportModal === 'function') openAppExcelExportModal();")
            page.wait_for_timeout(400)
            excel_modal = page.locator("#modalAppExcelExport")
            test_assert(excel_modal.is_visible(), "2-1. '신청결과엑셀출력' 모달 정상 팝업")

            # 10종 라디오 버튼 확인
            radio_count = page.locator("#modalAppExcelExport input[name='excel_gubun']").count()
            test_assert(radio_count == 10, f"2-2. 원본 타깃 1:1 매칭 10종 엑셀 구분 옵션 확인 ({radio_count}개)")

            page.on("dialog", lambda dialog: (print(f"    [Dialog]: {dialog.message}"), dialog.accept()))

            # 전체선택 체크박스 동작
            page.evaluate("chk_excel_all(true);")
            all_checked = page.evaluate("Array.from(document.querySelectorAll('#excel_search_lec_list input[type=\"checkbox\"]')).every(cb => cb.checked)")
            test_assert(all_checked, "2-3. 강좌 전체선택 체크박스 연동 확인")

            # 엑셀 다운로드 테스트
            with page.expect_download(timeout=6000) as download_info:
                page.evaluate("submitAppExcelExport(new Event('submit'));")
            download = download_info.value
            dl_name = download.suggested_filename
            test_assert("신청결과" in dl_name or "excel" in dl_name or ".csv" in dl_name, f"2-4. 엑셀(CSV) 파일 다운로드 응답 확인: {dl_name}")

            # 엑셀 모달 닫기
            page.evaluate("closeModal('modalAppExcelExport');")
            page.wait_for_timeout(300)

            # 3. '수강신청서출력' 모달 및 A4 서식 렌더링 검증
            page.evaluate("if (typeof openAppPdfPrintModal === 'function') openAppPdfPrintModal();")
            page.wait_for_timeout(400)
            pdf_modal = page.locator("#modalAppPdfPrint")
            test_assert(pdf_modal.is_visible(), "3-1. '수강신청서출력' 모달 정상 팝업")

            # PDF 인쇄 버튼 제출 -> A4 뷰어 모달 팝업
            page.evaluate("submitAppPdfPrint(new Event('submit'));")
            page.wait_for_timeout(400)
            doc_modal = page.locator("#modalPrintableDoc")
            test_assert(doc_modal.is_visible(), "3-2. 수강신청서 A4 규격 출력 서식 모달(#modalPrintableDoc) 렌더링 확인")
            title_text = page.locator("#printableDocTitle").inner_text()
            test_assert("수강" in title_text and "신청" in title_text, f"3-3. 출력 문서 제목 확인: {title_text}")

            # 문서 모달 닫기
            page.evaluate("closeModal('modalPrintableDoc');")
            page.wait_for_timeout(300)

            # 4. '고지서출력' 모달 및 고지서 서식 렌더링 검증
            page.evaluate("if (typeof openAppPdf1BillPrintModal === 'function') openAppPdf1BillPrintModal();")
            page.wait_for_timeout(400)
            bill_modal = page.locator("#modalAppPdf1BillPrint")
            test_assert(bill_modal.is_visible(), "4-1. '고지서출력' 모달 정상 팝업")

            # 수강료/재료비 체크박스 및 안내문구 입력 요소 확인
            notice_area = page.locator("#pdf1_content")
            test_assert(notice_area.is_visible(), "4-2. 고지서 안내사항(#pdf1_content) 입력 필드 확인")

            page.evaluate("submitAppPdf1BillPrint(new Event('submit'));")
            page.wait_for_timeout(400)
            test_assert(doc_modal.is_visible(), "4-3. 고지서 A4 규격 출력 서식 모달 렌더링 확인")
            bill_title = page.locator("#printableDocTitle").inner_text()
            test_assert("고지서" in bill_title or "수납" in bill_title, f"4-4. 고지서 문서 제목 확인: {bill_title}")

            page.evaluate("closeModal('modalPrintableDoc');")
            page.wait_for_timeout(300)

            # 5. '시간표출력' 모달 및 시간표 서식 렌더링 검증
            page.evaluate("if (typeof openAppPdf2TimetablePrintModal === 'function') openAppPdf2TimetablePrintModal();")
            page.wait_for_timeout(400)
            time_modal = page.locator("#modalAppPdf2TimetablePrint")
            test_assert(time_modal.is_visible(), "5-1. '시간표출력' 모달 정상 팝업")

            page.evaluate("submitAppPdf2TimetablePrint(new Event('submit'));")
            page.wait_for_timeout(400)
            test_assert(doc_modal.is_visible(), "5-2. 시간표 A4 규격 출력 서식 모달 렌더링 확인")
            time_title = page.locator("#printableDocTitle").inner_text()
            test_assert("시간표" in time_title, f"5-3. 시간표 문서 제목 확인: {time_title}")

            page.evaluate("closeModal('modalPrintableDoc');")
            page.wait_for_timeout(300)

            # 6. Deep Link 자동 모달 팝업 검증
            page.goto("http://localhost:3005/af/ad_app/excel/sn/3267")
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(600)
            test_assert(page.locator("#modalAppExcelExport").is_visible(), "6-1. URL 직접 접근 (/af/ad_app/excel/sn/3267) 시 엑셀출력 모달 자동 오픈 확인")

        except Exception as e:
            print(f"  [ERROR] {e}")
            import traceback
            traceback.print_exc()
        finally:
            browser.close()

        print(f"\n총 {total}개 검증 중 {passed}개 통과 (통과율: {passed/total*100:.1f}%)")

if __name__ == "__main__":
    run()
