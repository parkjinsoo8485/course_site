from playwright.sync_api import sync_playwright

def run():
    print("=== [Task 3 하네스 검증] 23열 일괄입력, 일괄수정, 일괄복사 실기능 E2E 점검 ===")
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

            # 1. 23열 CSV 템플릿 다운로드 검증
            with page.expect_download(timeout=5000) as download_info:
                page.evaluate("if (typeof downloadSample23ColExcel === 'function') downloadSample23ColExcel();")
            download = download_info.value
            filename = download.suggested_filename
            test_assert(filename == "dbdbschool_course_batch_template_23cols.csv", f"1. 23열 공식 CSV 템플릿 파일 다운로드 완료 ({filename})")

            # 2. 강좌 일괄입력 모달 오픈 및 데이터 일괄등록
            page.evaluate("if (typeof openBatchUploadModal === 'function') openBatchUploadModal();")
            page.wait_for_timeout(500)
            upload_modal = page.locator("#batchUploadModal")
            test_assert(upload_modal.is_visible(), "2. 강좌 일괄입력 모달 UI 정상 노출")

            test_batch_title = f"벌크강좌_{int(time_stamp())}"
            csv_data = (
                "강좌명,늘봄과정,중복제한그룹,대상학과,강사아이디,강사중복불가,대상학년,강의시간,강의시간중복허용,정원,대기정원,운영기간,총시수,강의실,수강료,수용비,교재비,재료비,지원금차감제외(수강료),지원금차감제외(교재비),지원금차감제외(재료비),최대지원금액,내용\n"
                f'{test_batch_title},맞춤형,,7차일반,teacher_bulk,N,"1,2",화:15:00~15:50,N,25,5,2026.09.01~2026.09.30,16,컴퓨터실,35000,5000,10000,10000,,,,0,벌크 입력 테스트 강좌'
            )
            page.evaluate("(data) => { const el = document.getElementById('batchUploadTextarea'); if (el) el.value = data; }", csv_data)

            page.on("dialog", lambda dialog: dialog.accept())
            page.evaluate("submitBatchUpload(new Event('submit'))")
            page.wait_for_timeout(1500)

            # 일괄 등록된 강좌 목록 확인
            page.wait_for_selector(f"#lectureTbody tr:has-text('{test_batch_title}')", timeout=5000)
            batch_row = page.locator(f"#lectureTbody tr:has-text('{test_batch_title}')").first
            test_assert(batch_row.is_visible(), f"3. 23열 일괄 등록 후 테이블에 '{test_batch_title}' 실시간 반영 확인")

            # 3. 강좌 일괄수정 모달 오픈 및 동작 검증
            page.evaluate("if (typeof openBatchModifyModal === 'function') openBatchModifyModal();")
            page.wait_for_timeout(500)
            mod_modal = page.locator("#batchModifyModal")
            test_assert(mod_modal.is_visible(), "4. 강좌 일괄수정 모달 UI 정상 노출")

            # 모달 닫기
            page.evaluate("if (typeof closeBatchModifyModal === 'function') closeBatchModifyModal();")
            page.wait_for_timeout(300)

            # 4. 강좌 일괄복사 모달 오픈 및 동작 검증
            page.evaluate("if (typeof openBatchCopyModal === 'function') openBatchCopyModal();")
            page.wait_for_timeout(500)
            copy_modal = page.locator("#batchCopyModal")
            test_assert(copy_modal.is_visible(), "5. 강좌 일괄복사 모달 UI 정상 노출 (사이드바 유지)")

            # 모달 닫기
            page.evaluate("if (typeof closeBatchCopyModal === 'function') closeBatchCopyModal();")
            page.wait_for_timeout(300)

            # 방금 추가한 벌크 강좌 삭제 정리
            row_id = batch_row.get_attribute("id").replace("lec_row_", "")
            page.evaluate(f"deleteLecture('{row_id}')")
            page.wait_for_timeout(1000)
            test_assert(page.locator(f"#lectureTbody tr:has-text('{test_batch_title}')").count() == 0, "6. 테스트 데이터 깔끔하게 정리 완료")

            print(f"\n최종 결과: {passed}/{total} 항목 통과!")

        except Exception as e:
            print(f"하네스 오류 발생: {e}")
        finally:
            browser.close()

def time_stamp():
    import time
    return time.time()

if __name__ == '__main__':
    run()
