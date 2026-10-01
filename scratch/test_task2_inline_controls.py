from playwright.sync_api import sync_playwright

def run():
    print("=== [Task 2 하네스 검증] 정원 빠른수정 및 상태 인라인 드롭다운 실기능 점검 ===")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
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

            # 1. 정원 빠른수정 링크 노출 검증
            page.wait_for_selector("#lectureTbody tr", timeout=5000)
            cap_link = page.locator("#lectureTbody tr a[onclick*='quickEditCapacity']").first
            test_assert(cap_link.is_visible(), "1. 정원 빠른수정 인라인 링크 노출 확인")

            # 2. 정원 빠른수정 (prompt 35 입력)
            page.on("dialog", lambda dialog: dialog.accept("35"))
            cap_link.click()
            page.wait_for_timeout(800)

            updated_cap = cap_link.inner_text()
            test_assert(updated_cap == "35", f"2. 정원 인라인 수정 즉시 반영 확인 ({updated_cap}명)")

            # 3. 상태 인라인 드롭다운 조작
            status_sel = page.locator("#lectureTbody tr select[onchange*='quickChangeStatus']").first
            test_assert(status_sel.is_visible(), "3. 상태 인라인 셀렉터 노출 확인")

            status_sel.select_option("대기")
            page.wait_for_timeout(800)
            test_assert(status_sel.input_value() == "대기", "4. 상태 '대기'로 인라인 즉시 변경 및 DB 반영 확인")

            status_sel.select_option("출력")
            page.wait_for_timeout(800)
            test_assert(status_sel.input_value() == "출력", "5. 상태 '출력'으로 원복 완료")

            print(f"\n최종 결과: {passed}/{total} 항목 통과!")

        except Exception as e:
            print(f"하네스 오류 발생: {e}")
        finally:
            browser.close()

if __name__ == '__main__':
    run()
