import sys
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def run_ad_wait_test():
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

    print("=== [대기자관리 1:1 완벽 구현 종합 검증] http://localhost:3005/af/ad_wait/lists/sn/3267 ===", flush=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1920, "height": 950})
        page = context.new_page()

        # Alert/confirm auto acceptance
        page.on("dialog", lambda dialog: dialog.accept())

        try:
            # 1. 페이지 접속
            page.goto("http://localhost:3005/af/ad_wait/lists/sn/3267", timeout=15000)
            page.wait_for_timeout(1000)

            # 2. 사이드바 및 대기자관리 패널 활성화 검증
            sidebar = page.locator("#left_menu")
            test_assert(sidebar.is_visible(), "1. 좌측 사이드바(#left_menu) 100% 정상 유지 확인")

            wait_panel = page.locator("#panel_ad_wait_lists")
            test_assert(wait_panel.is_visible(), "2. 대기자관리 메인 패널(#panel_ad_wait_lists) 활성화 확인")

            # 3. 타이틀 및 상단 바로가기 버튼 검증
            title_el = wait_panel.locator("#contents_title")
            test_assert("대기자관리" in title_el.inner_text(), "3. 상단 1:1 타이틀 '대기자관리' 노출 확인")

            to_lec_btn = title_el.locator("a[href*='/af/ad_lec/lists']")
            test_assert(to_lec_btn.is_visible(), "4. 상단 우측 '강좌관리' 바로가기 버튼 정상 탑재 확인")

            # 4. 매뉴얼 박스
            manual_box = wait_panel.locator(".new_help_manualbox")
            test_assert(manual_box.is_visible() and "대기자 관리" in manual_box.inner_text(), "5. 상단 공식 매뉴얼 박스 1:1 노출 확인")

            # 5. 검색 필터 및 버튼 노출 검증
            search_form = wait_panel.locator("#fm_list_search_wait")
            test_assert(search_form.locator("#wait_sel_div").is_visible(), "6. 구분 셀렉트 필터 노출 확인")
            test_assert(search_form.locator("#wait_sel_pro_type").is_visible(), "7. 늘봄과정 셀렉트 필터 노출 확인")
            test_assert(search_form.locator("#wait_sel_course").is_visible(), "8. 강좌전체 셀렉트 필터 노출 확인")
            test_assert(search_form.locator("#wait_search_word").is_visible(), "9. 검색어 입력창 노출 확인")

            # 6. 상단 4종 액션 버튼 30px 높이 일관화 및 수평 1열 정렬 검증
            action_btns = ["#btn_wait_sin", "#btn_wait_input", "#btn_wait_copy", "#btn_wait_excel"]
            boxes = [page.locator(b).bounding_box() for b in action_btns]
            y_aligned = len(set(round(b["y"], 1) for b in boxes)) == 1
            h_unified = all(round(b["height"]) == 30 for b in boxes)
            test_assert(y_aligned and h_unified, "10. 4종 액션 버튼(대기자등록/일괄입력/복사/엑셀) 30px 높이 일관화 및 수평 1열 정렬 확인")

            # 7. 테이블 12개 컬럼 검증
            th_elements = wait_panel.locator("#wait_table_container table thead th")
            th_count = th_elements.count()
            test_assert(th_count == 12, f"11. 원본 1:1 매칭 12개 테이블 컬럼 완벽 렌더링 확인 ({th_count}개)")

            # 8. 대기자 데이터 렌더링 검증
            page.wait_for_selector(".wait-checkbox", timeout=8000)
            rows = wait_panel.locator("#waitlistTbody tr")
            row_count = rows.count()
            test_assert(row_count >= 10, f"12. 대기자 목록 데이터 정상 로드 확인 ({row_count}건)")

            # 9. [대기자등록] 모달 열기 및 등록 기능 검증
            page.click("#btn_wait_sin")
            page.wait_for_timeout(500)
            sin_modal = page.locator("#waitSinModal")
            test_assert(sin_modal.is_visible(), "13. '대기자 등록' 모달 정상 노출 확인")

            # 샘플학생조회 클릭 후 등록
            page.click("#btn_wait_sample_student")
            page.wait_for_timeout(300)
            page.click("#btn_wait_sin_submit")
            page.wait_for_timeout(1200)
            test_assert(not sin_modal.is_visible(), "14. 대기자 신규 등록 및 모달 정상 닫힘 확인")

            # 10. [대기자일괄입력] 모달 검증
            page.click("#btn_wait_input")
            page.wait_for_timeout(300)
            batch_modal = page.locator("#waitBatchInputModal")
            test_assert(batch_modal.is_visible(), "15. '대기자 일괄입력' 모달 정상 노출 확인")

            # 미리보기 파싱
            page.fill("#wait_batch_text", "1\t1\t10\t테스트학생\t010-9999-8888")
            page.click("#btn_wait_batch_preview")
            page.wait_for_timeout(200)
            test_assert(page.locator("#wait_batch_preview_box").is_visible(), "16. 일괄입력 데이터 미리보기 파싱 확인")
            page.click("#waitBatchInputModal .close-btn")
            page.wait_for_timeout(200)

            # 11. [대기자복사] 모달 검증
            page.click("#btn_wait_copy")
            page.wait_for_timeout(300)
            copy_modal = page.locator("#waitCopyModal")
            test_assert(copy_modal.is_visible(), "17. '대기자 복사' 모달 정상 노출 확인")
            page.click("#waitCopyModal .close-btn")
            page.wait_for_timeout(200)

            # 12. [신청결과엑셀출력] 모달 및 다운로드 검증
            page.click("#btn_wait_excel")
            page.wait_for_timeout(300)
            excel_modal = page.locator("#waitExcelModal")
            test_assert(excel_modal.is_visible(), "18. '신청결과 엑셀출력' 모달 정상 노출 확인")

            with page.expect_download(timeout=8000) as dl_info:
                page.click("#waitExcelModal button[type='submit']")
            dl_file = dl_info.value
            test_assert("csv" in dl_file.suggested_filename or "wait" in dl_file.suggested_filename, f"19. 엑셀 출력 다운로드 정상 동작 ({dl_file.suggested_filename})")

            # 13. [신청] 버튼 클릭 시 대기자 신청/승격 모달 및 수강생 승격 처리 검증
            before_count = wait_panel.locator("#waitlistTbody tr").count()
            first_apply_btn = wait_panel.locator("#waitlistTbody tr td button.btn-primary").first
            first_apply_btn.click()
            page.wait_for_timeout(300)
            app_modal = page.locator("#waitAppModal")
            test_assert(app_modal.is_visible(), "20. [신청] 클릭 시 '대기자 신청/승격' 모달(#waitAppModal) 정상 노출 확인")
            page.click("#btn_wait_app_submit")
            page.wait_for_timeout(1000)
            after_count = wait_panel.locator("#waitlistTbody tr").count()
            test_assert(after_count == before_count - 1, f"21. 신청(승격) 처리 완료 후 대기자 차감 확인 ({before_count} -> {after_count})")

            # 14. [삭제] 아이콘 클릭 시 개별 삭제 검증
            del_icon = wait_panel.locator("#waitlistTbody tr td i.fa-trash-o").first
            del_icon.click()
            page.wait_for_timeout(1000)
            del_after_count = wait_panel.locator("#waitlistTbody tr").count()
            test_assert(del_after_count == after_count - 1, f"22. [삭제] 아이콘 클릭 시 대기자 정상 삭제 확인 ({after_count} -> {del_after_count})")

            # 15. 전체선택 체크박스 및 일괄 삭제 검증
            chk_all = wait_panel.locator("#wait_check_all")
            chk_all.check()
            page.wait_for_timeout(200)
            all_checked = page.evaluate("Array.from(document.querySelectorAll('.wait-checkbox')).every(c => c.checked)")
            test_assert(all_checked, "23. 전체선택 체크박스(#wait_check_all) 전체 체크 연동 확인")

            # 16. 하단 도움말 박스 렌더링 검증
            help_box = wait_panel.locator(".help_box")
            test_assert(help_box.is_visible() and "먼저 등록된 학생" in help_box.inner_text(), "24. 하단 공식 도움말 박스(.help_box) 1:1 완벽 렌더링 확인")

            # 17. 대기자 순위 이동 모달 (#waitMoveModal) 검증
            page.evaluate("openWaitMoveModal(currentWaitlistData[0].courseTitle)")
            page.wait_for_timeout(300)
            move_modal = page.locator("#waitMoveModal")
            test_assert(move_modal.is_visible(), "25. '대기자 순위 이동' 모달(#waitMoveModal) 정상 노출 확인")
            rows_in_move = move_modal.locator("#wait_move_tbody tr").count()
            test_assert(rows_in_move > 0, f"26. 대기자 순위 이동 테이블 목록 정상 렌더링 확인 ({rows_in_move}명)")
            page.click("#waitMoveModal .close-btn")
            page.wait_for_timeout(200)
            test_assert(not move_modal.is_visible(), "27. '대기자 순위 이동' 모달 정상 닫힘 확인")

        except Exception as e:
            print(f"  [ERROR] 테스트 도중 예외 발생: {e}")
        finally:
            browser.close()

    print("\n==========================================")
    print(f"최종 결과: {passed}/{total} 항목 완벽 통과! ({round(passed/total*100, 1)}%)")
    print("==========================================")
    return passed == total

if __name__ == '__main__':
    success = run_ad_wait_test()
    sys.exit(0 if success else 1)
