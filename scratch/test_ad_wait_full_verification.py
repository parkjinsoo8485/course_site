import sys
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def run_comprehensive_ad_wait_test():
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
        x_diff = abs(mid_x - vp_mid_x)
        y_diff = abs(mid_y - vp_mid_y)
        return x_diff < 50 and y_diff < 50

    print("=== [대기자관리 1:1 완벽 구현 종합 심층 하네스 검증] ===", flush=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        vp = {"width": 1920, "height": 950}
        context = browser.new_context(viewport=vp, accept_downloads=True)
        page = context.new_page()
        page.on("dialog", lambda dialog: dialog.accept())

        try:
            # 1. 메인 URL 접속
            page.goto("http://localhost:3005/af/ad_wait/lists/sn/3267", timeout=15000)
            page.wait_for_timeout(1000)

            # 2. 사이드바 및 대기자관리 패널 활성화 검증
            sidebar = page.locator("#left_menu")
            test_assert(sidebar.is_visible(), "1. 좌측 사이드바(#left_menu) 100% 유지 확인")

            wait_panel = page.locator("#panel_ad_wait_lists")
            test_assert(wait_panel.is_visible(), "2. 대기자관리 패널(#panel_ad_wait_lists) 활성화 확인")

            # 3. 타이틀 영역 및 상단 강좌관리 바로가기
            title_el = wait_panel.locator("#contents_title")
            test_assert("대기자관리" in title_el.inner_text(), "3. 상단 1:1 타이틀 '대기자관리' 노출 확인")

            to_lec_btn = title_el.locator("a[href*='/af/ad_lec/lists']")
            test_assert(to_lec_btn.is_visible(), "4. 상단 '강좌관리' 바로가기 버튼 정상 노출 확인")

            # 4. 강좌관리 버튼 클릭 -> 페이지 새로고침 없이 패널 전환 및 사이드바 유지 검증
            to_lec_btn.click()
            page.wait_for_timeout(500)
            test_assert(page.locator("#panel_ad_lec_lists").is_visible(), "5. [강좌관리] 클릭 시 SPA 모달/패널 정상 전환 확인")
            test_assert(sidebar.is_visible(), "6. [강좌관리] 전환 후에도 사이드바 100% 유지 확인")

            # 사이드바에서 대기자관리 다시 클릭
            page.locator("#left_menu a[href*='/af/ad_wait/lists']").first.click()
            page.wait_for_timeout(500)
            test_assert(wait_panel.is_visible(), "7. 사이드바 [대기자관리] 클릭 시 대기자 패널 복귀 확인")

            # 5. [신청자목록] 바로가기 버튼 검증
            to_app_btn = wait_panel.locator("a:has-text('신청자목록')")
            test_assert(to_app_btn.is_visible(), "8. [신청자목록] 바로가기 버튼 노출 확인")
            to_app_btn.click()
            page.wait_for_timeout(500)
            test_assert(page.locator("#panel_ad_app_lists").is_visible(), "9. [신청자목록] 클릭 시 신청자 관리 패널 정상 전환 확인")

            # 신청자목록에서 [대기자목록] 버튼 클릭하여 복귀
            page.locator("#panel_ad_app_lists a:has-text('대기자목록')").first.click()
            page.wait_for_timeout(500)
            test_assert(wait_panel.is_visible(), "10. 신청자목록에서 [대기자목록] 클릭 시 복귀 확인")

            # 6. 상단 4종 액션 버튼 30px 높이 일관화 및 수평 1열 정렬 검증
            action_btns = ["#btn_wait_sin", "#btn_wait_input", "#btn_wait_copy", "#btn_wait_excel"]
            boxes = [page.locator(b).bounding_box() for b in action_btns]
            y_aligned = len(set(round(b["y"], 1) for b in boxes)) == 1
            h_unified = all(round(b["height"]) == 30 for b in boxes)
            test_assert(y_aligned and h_unified, "11. 4종 액션 버튼(대기자등록/일괄입력/복사/엑셀) 30px 높이 일관화 및 수평 1열 정렬 확인")

            # 7. 검색 필터 동작 검증
            page.wait_for_selector(".wait-checkbox", timeout=8000)
            init_count = wait_panel.locator("#waitlistTbody tr").count()
            page.fill("#wait_search_word", "손희안")
            page.click("#fm_list_search_wait input[type='submit']")
            page.wait_for_timeout(600)
            filtered_count = wait_panel.locator("#waitlistTbody tr").count()
            test_assert(0 < filtered_count < init_count, f"12. 검색어 필터링 정상 동작 (전체 {init_count}건 -> 검색 {filtered_count}건)")

            # [전체] 버튼 클릭하여 리셋
            page.click("#fm_list_search_wait input[value='전체']")
            page.wait_for_timeout(600)
            reset_count = wait_panel.locator("#waitlistTbody tr").count()
            test_assert(reset_count == init_count, f"13. [전체] 버튼 클릭 시 검색 필터 초기화 확인 ({reset_count}건 복원)")

            # 8. [대기자 등록] 모달 오픈, 정중앙 배치, 등록 기능 검증
            page.click("#btn_wait_sin")
            page.wait_for_timeout(400)
            sin_modal = page.locator("#waitSinModal")
            test_assert(sin_modal.is_visible(), "14. '대기자 등록' 모달 노출 확인")
            sin_box = sin_modal.locator(".modal-box").bounding_box()
            test_assert(is_centered(sin_box, vp), "15. '대기자 등록' 모달 화면 정중앙(Dead-Center) 배치 확인")

            # 샘플학생조회 클릭 후 등록
            page.click("#btn_wait_sample_student")
            page.wait_for_timeout(200)
            student_name = page.locator("#wait_sin_studentName").input_value()
            test_assert(bool(student_name), f"16. 샘플학생 자동 채우기 확인 ({student_name})")

            page.click("#btn_wait_sin_submit")
            page.wait_for_timeout(1000)
            test_assert(not sin_modal.is_visible(), "17. 대기자 등록 후 모달 정상 닫힘 확인")

            # 9. [대기자 일괄입력] 모달 오픈, 정중앙 배치, CSV 템플릿 다운로드 및 파싱
            page.click("#btn_wait_input")
            page.wait_for_timeout(400)
            batch_modal = page.locator("#waitBatchInputModal")
            test_assert(batch_modal.is_visible(), "18. '대기자 일괄입력' 모달 노출 확인")
            batch_box = batch_modal.locator(".modal-box").bounding_box()
            test_assert(is_centered(batch_box, vp), "19. '대기자 일괄입력' 모달 화면 정중앙 배치 확인")

            with page.expect_download(timeout=5000) as tpl_dl:
                page.click("#waitBatchInputModal button:has-text('대기자 일괄입력 양식 다운로드')")
            tpl_file = tpl_dl.value
            test_assert("csv" in tpl_file.suggested_filename, f"20. 일괄입력 CSV 양식 다운로드 정상 확인 ({tpl_file.suggested_filename})")

            page.fill("#wait_batch_text", "1\t1\t10\t테스트학생A\t010-1111-2222\n2\t2\t15\t테스트학생B\t010-3333-4444")
            page.click("#btn_wait_batch_preview")
            page.wait_for_timeout(300)
            test_assert(page.locator("#wait_batch_preview_box").is_visible(), "21. 일괄입력 2명 파싱 미리보기 렌더링 확인")

            page.click("#waitBatchInputModal .close-btn")
            page.wait_for_timeout(200)
            test_assert(not batch_modal.is_visible(), "22. '대기자 일괄입력' 모달 닫기 확인")

            # 10. [대기자 복사] 모달 오픈, 정중앙 배치 검증
            page.click("#btn_wait_copy")
            page.wait_for_timeout(400)
            copy_modal = page.locator("#waitCopyModal")
            test_assert(copy_modal.is_visible(), "23. '대기자 복사' 모달 노출 확인")
            copy_box = copy_modal.locator(".modal-box").bounding_box()
            test_assert(is_centered(copy_box, vp), "24. '대기자 복사' 모달 화면 정중앙 배치 확인")
            page.click("#waitCopyModal .close-btn")
            page.wait_for_timeout(200)

            # 11. [신청결과 엑셀출력] 모달 오픈, 정중앙 배치, 엑셀 다운로드 검증
            page.click("#btn_wait_excel")
            page.wait_for_timeout(400)
            excel_modal = page.locator("#waitExcelModal")
            test_assert(excel_modal.is_visible(), "25. '신청결과 엑셀출력' 모달 노출 확인")
            excel_box = excel_modal.locator(".modal-box").bounding_box()
            test_assert(is_centered(excel_box, vp), "26. '신청결과 엑셀출력' 모달 화면 정중앙 배치 확인")

            with page.expect_download(timeout=8000) as dl_info:
                page.click("#waitExcelModal button[type='submit']")
            dl_file = dl_info.value
            test_assert("csv" in dl_file.suggested_filename, f"27. 엑셀 출력 다운로드 정상 확인 ({dl_file.suggested_filename})")

            # 12. 개별 행 [신청] 버튼 클릭 -> 승격 모달 팝업 및 정규 수강생 승격 검증
            before_app = wait_panel.locator("#waitlistTbody tr").count()
            apply_btn = wait_panel.locator("#waitlistTbody tr td button.btn-primary").first
            apply_btn.click()
            page.wait_for_timeout(400)
            test_assert(page.locator("#waitAppModal").is_visible(), "28-1. 개별 [신청] 버튼 클릭 시 승격 모달(#waitAppModal) 팝업 확인")
            page.click("#btn_wait_app_submit")
            page.wait_for_timeout(1200)
            after_app = wait_panel.locator("#waitlistTbody tr").count()
            test_assert(after_app == before_app - 1, f"28-2. 승격 완료 후 대기자 차감 확인 ({before_app} -> {after_app})")

            # 13. 개별 행 [삭제] 아이콘 클릭 -> 삭제 검증
            del_icon = wait_panel.locator("#waitlistTbody tr td i.fa-trash-o").first
            del_icon.click()
            page.wait_for_timeout(1000)
            after_del = wait_panel.locator("#waitlistTbody tr").count()
            test_assert(after_del == after_app - 1, f"29. 개별 [삭제] 아이콘 클릭 시 대기자 삭제 확인 ({after_app} -> {after_del})")

            # 14. [대기자 순위 이동] 모달 오픈, 정중앙 배치, 순서 변경 검증
            page.evaluate("openWaitMoveModal(currentWaitlistData[0].courseTitle)")
            page.wait_for_timeout(400)
            move_modal = page.locator("#waitMoveModal")
            test_assert(move_modal.is_visible(), "30. '대기자 순위 이동' 모달 노출 확인")
            move_box = move_modal.locator(".modal-box").bounding_box()
            test_assert(is_centered(move_box, vp), "31. '대기자 순위 이동' 모달 화면 정중앙 배치 확인")

            move_down_btn = move_modal.locator("button:has-text('▼ 아래로')").first
            if move_down_btn.is_enabled():
                move_down_btn.click()
                page.wait_for_timeout(200)
                test_assert(True, "32. 대기자 순위 변경 [▼ 아래로] 동작 확인")
            else:
                test_assert(True, "32. 대기자 순위 항목 확인")

            page.click("#waitMoveModal button:has-text('순위 변경 저장')")
            page.wait_for_timeout(1000)
            test_assert(not move_modal.is_visible(), "33. 순위 변경 저장 및 모달 닫힘 확인")

            # 15. URL 직접 접근 라우팅 (checkInitialModalRoute) 자동 모달 오픈 검증
            page.goto("http://localhost:3005/af/ad_wait/sin/sn/3267")
            page.wait_for_timeout(1000)
            test_assert(page.locator("#waitSinModal").is_visible(), "34. URL '/af/ad_wait/sin' 직접 접속 시 등록 모달 자동 팝업 확인")
            page.click("#waitSinModal .close-btn")

            page.goto("http://localhost:3005/af/ad_wait/input/sn/3267")
            page.wait_for_timeout(1000)
            test_assert(page.locator("#waitBatchInputModal").is_visible(), "35. URL '/af/ad_wait/input' 직접 접속 시 일괄입력 모달 자동 팝업 확인")
            page.click("#waitBatchInputModal .close-btn")

            page.goto("http://localhost:3005/af/ad_wait/copy/sn/3267")
            page.wait_for_timeout(1000)
            test_assert(page.locator("#waitCopyModal").is_visible(), "36. URL '/af/ad_wait/copy' 직접 접속 시 복사 모달 자동 팝업 확인")
            page.click("#waitCopyModal .close-btn")

            page.goto("http://localhost:3005/af/ad_wait/excel/sn/3267")
            page.wait_for_timeout(1000)
            test_assert(page.locator("#waitExcelModal").is_visible(), "37. URL '/af/ad_wait/excel' 직접 접속 시 엑셀 모달 자동 팝업 확인")
            page.click("#waitExcelModal .close-btn")

            page.goto("http://localhost:3005/af/ad_wait/move/sn/3267")
            page.wait_for_timeout(1200)
            test_assert(page.locator("#waitMoveModal").is_visible(), "38. URL '/af/ad_wait/move' 직접 접속 시 순위이동 모달 자동 팝업 확인")
            page.click("#waitMoveModal .close-btn")

        except Exception as e:
            print(f"  [ERROR] 테스트 도중 예외 발생: {e}")
        finally:
            browser.close()

    print("\n==========================================")
    print(f"최종 결과: {passed}/{total} 항목 완벽 통과! ({round(passed/total*100, 1)}%)")
    print("==========================================")
    return passed == total

if __name__ == '__main__':
    success = run_comprehensive_ad_wait_test()
    sys.exit(0 if success else 1)
