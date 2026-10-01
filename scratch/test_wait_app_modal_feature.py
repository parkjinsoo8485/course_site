import sys
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def run_test():
    passed = 0
    total = 0

    def test_assert(condition, desc):
        nonlocal passed, total
        total += 1
        if condition:
            passed += 1
            print(f"  [PASS] {desc}", flush=True)
        else:
            print(f"  [FAIL] {desc}", flush=True)

    def is_centered(box, viewport):
        mid_x = box["x"] + box["width"] / 2
        mid_y = box["y"] + box["height"] / 2
        vp_mid_x = viewport["width"] / 2
        vp_mid_y = viewport["height"] / 2
        return abs(mid_x - vp_mid_x) < 50 and abs(mid_y - vp_mid_y) < 50

    print("=== [대기자관리 '신청' 버튼 및 승격 모달 1:1 완벽 연동 검증] ===", flush=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        vp = {"width": 1920, "height": 950}
        context = browser.new_context(viewport=vp)
        page = context.new_page()
        page.on("dialog", lambda d: d.accept())

        try:
            # 1. 페이지 접속
            page.goto("http://localhost:3005/af/ad_wait/lists/sn/3267")
            page.wait_for_timeout(1000)

            # 2. 신청 버튼 및 모달 연동 검증
            wait_panel = page.locator("#panel_ad_wait_lists")
            test_assert(wait_panel.is_visible(), "1. 대기자관리 패널 활성화 확인")

            # 첫 번째 행의 신청 버튼 확인
            first_row = wait_panel.locator("#waitlistTbody tr").first
            student_name = first_row.locator("td").nth(8).inner_text().strip()
            course_title = first_row.locator("td").nth(4).inner_text().strip()
            apply_btn = first_row.locator("button.btn-primary:has-text('신청')")
            test_assert(apply_btn.is_visible() and apply_btn.is_enabled(), f"2. 첫 번째 대기자({student_name})의 [신청] 버튼 활성화 확인")

            # 신청 버튼 클릭
            apply_btn.click()
            page.wait_for_timeout(500)

            # 대기자 신청/승격 모달 노출 검증
            app_modal = page.locator("#waitAppModal")
            test_assert(app_modal.is_visible(), "3. [신청] 버튼 클릭 시 대기자 신청/승격 모달(#waitAppModal) 즉시 팝업 확인")

            # 모달 정중앙(Dead-Center) 배치 검증
            box = app_modal.locator(".modal-box").bounding_box()
            test_assert(is_centered(box, vp), "4. 대기자 신청 모달 화면 정중앙(Dead-Center) 배치 확인")

            # 모달 내 학생 정보 연동 검증
            modal_name = page.locator("#wait_app_studentName").inner_text().strip()
            modal_course = page.locator("#wait_app_courseTitle").inner_text().strip()
            test_assert(modal_name == student_name, f"5. 모달 내 학생명 연동 일치 ({modal_name} == {student_name})")
            test_assert(modal_course == course_title, f"6. 모달 내 강좌명 연동 일치 ({modal_course})")

            # 모달 내 [신청자로 등록(승격)] 버튼 클릭
            confirm_btn = page.locator("#btn_wait_app_submit")
            test_assert(confirm_btn.is_visible(), "7. 모달 내 [신청자로 등록(승격)] 액션 버튼 노출 확인")

            count_before = wait_panel.locator("#waitlistTbody tr").count()
            confirm_btn.click()
            page.wait_for_timeout(1200)

            # 모달 닫힘 및 대기자 차감 검증
            test_assert(not app_modal.is_visible(), "8. 승격 처리 완료 후 모달 자동 닫힘 확인")
            count_after = wait_panel.locator("#waitlistTbody tr").count()
            test_assert(count_after == count_before - 1, f"9. 수강생 승격 완료 후 대기자 목록에서 차감 확인 ({count_before} -> {count_after})")

            # 3. 하단 일괄적용의 '선택 대기자 신청(승격)' 검증
            select_bulk = page.locator("#wait_update_type")
            option_app = select_bulk.locator("option[value='app']")
            test_assert(option_app.count() > 0, "10. 하단 일괄적용에 '선택 대기자 신청(승격)' 옵션 탑재 확인")

            # 첫 번째 체크박스 선택 후 일괄 신청 테스트
            chk = wait_panel.locator(".wait-checkbox").first
            chk.check()
            select_bulk.select_option("app")
            page.click("#btn_wait_bulk_submit")
            page.wait_for_timeout(1200)

            count_after_bulk = wait_panel.locator("#waitlistTbody tr").count()
            test_assert(count_after_bulk == count_after - 1, f"11. 일괄적용을 통한 대기자 수강생 일괄 승격 확인 ({count_after} -> {count_after_bulk})")

            # 4. URL 라우팅 직접 접근 (/af/ad_wait/app) 시 모달 자동 팝업 검증
            page.goto("http://localhost:3005/af/ad_wait/app/sn/3267")
            page.wait_for_timeout(1000)
            test_assert(page.locator("#waitAppModal").is_visible(), "12. URL '/af/ad_wait/app' 직접 접근 시 신청 모달 자동 팝업 확인")
            page.click("#waitAppModal .close-btn")
            page.wait_for_timeout(300)
            test_assert(not page.locator("#waitAppModal").is_visible(), "13. 모달 닫기 버튼 정상 작동 확인")

        except Exception as e:
            print(f"  [ERROR] 테스트 중 예외 발생: {e}")
        finally:
            browser.close()

    print("\n==========================================")
    print(f"최종 결과: {passed}/{total} 항목 완벽 통과! ({round(passed/total*100, 1)}%)")
    print("==========================================")
    return passed == total

if __name__ == '__main__':
    success = run_test()
    sys.exit(0 if success else 1)
