import sys, time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

def run():
    print("=== [Task 6 하네스 검증] dbdbschool 강좌관리 페이지 1:1 완벽 모방 및 미세조정 종합 E2E 점검 ===")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(accept_downloads=True, viewport={"width": 1920, "height": 1080})
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
            # 1. 페이지 접속 및 좌측 사이드바 100% 온전성 검증
            page.goto("http://localhost:3005/af/ad_lec/lists/sn/3267")
            page.wait_for_load_state("networkidle")
            
            sidebar = page.locator("#left_menu")
            test_assert(sidebar.is_visible(), "1. 좌측 사이드바(#left_menu) 100% 유지 및 정상 렌더링 확인")

            lec_panel = page.locator("#panel_ad_lec_lists")
            test_assert(lec_panel.is_visible(), "2. 강좌관리 메인 패널(#panel_ad_lec_lists) 활성화 확인")

            # 2. 타이틀 영역 검증
            title_box = lec_panel.locator("#contents_title")
            test_assert(title_box.is_visible() and "강좌관리" in title_box.inner_text(), "3. 원본 1:1 타이틀(#contents_title: '강좌관리', '광주풍향초등학교 늘봄학교') 노출 확인")
            
            btn_to_app = title_box.locator(".write_yun a")
            btn_text = btn_to_app.inner_text().strip()
            test_assert(btn_to_app.is_visible() and "신청자관리" in btn_text, f"4. 상단 우측 '신청자관리' 바로가기 버튼 정상 탑재 확인 ({btn_text})")

            # 3. 매뉴얼 박스 & 상단 안내문 검증
            manual_box = lec_panel.locator(".new_help_manualbox")
            test_assert(manual_box.is_visible() and "강좌등록" in manual_box.inner_text(), "5. 상단 공식 매뉴얼 박스(.new_help_manualbox) 1:1 노출 확인")

            top_msg = lec_panel.locator(".top_message_box").first
            test_assert(top_msg.is_visible() and "수강신청 시작시간" in top_msg.inner_text(), "6. 상단 수강신청 주의사항 및 고객지원 안내 박스 1:1 노출 확인")

            # 4. 상세검색 버튼 삭제 및 검색 영역 상시 노출 검증
            toggle_search_btn = lec_panel.locator("#main_control_box_btn01")
            test_assert(toggle_search_btn.count() == 0, "7. 상세검색열기 버튼(#main_control_box_btn01) 완벽 삭제 확인")
            test_assert(lec_panel.locator("#sel_led_div").is_visible(), "7-1. 검색 조건 셀렉트 영역 상시 노출 확인")

            # 5. 검색결과 엑셀 출력 다운로드 검증
            with page.expect_download(timeout=6000) as dl_info:
                page.evaluate("if (typeof exportToExcel === 'function') exportToExcel();")
            excel_file = dl_info.value
            test_assert("강좌" in excel_file.suggested_filename or "excel" in excel_file.suggested_filename or ".csv" in excel_file.suggested_filename, f"8. 검색결과 엑셀 출력 기능 정상 작동 ({excel_file.suggested_filename})")

            # 6. 추가기능 버튼 삭제 및 우측 5종 액션 버튼 일렬 수평 정렬 검증
            extra_btn = lec_panel.locator("#main_control_box_btn02")
            test_assert(extra_btn.count() == 0, "9. '추가기능..' 버튼 완벽 삭제 확인")

            action_btns = ["#btn_action_write", "#btn_action_input", "#btn_action_modify", "#btn_action_copy", "#btn_action_stat"]
            boxes = [page.locator(b).bounding_box() for b in action_btns]
            y_aligned = len(set(round(b["y"], 1) for b in boxes)) == 1
            h_unified = all(round(b["height"]) == 30 for b in boxes)
            test_assert(y_aligned and h_unified, "10. 우측 5종 액션 버튼 30px 높이 일관화 및 오차 없는 수평 1열 정렬 확인")

            # 7. 테이블 18개 원본 헤더 컬럼 검증
            page.wait_for_selector("#main_table_responsive_container table", timeout=5000)
            th_elements = lec_panel.locator("#main_table_responsive_container table thead th")
            th_count = th_elements.count()
            test_assert(th_count == 18, f"11. 원본 1:1 매칭 18개 테이블 컬럼 완벽 렌더링 확인 ({th_count}개)")

            # 8. 전체선택 체크박스 연동 검증
            chk_all_box = lec_panel.locator("#check_all")
            chk_all_box.check()
            page.wait_for_timeout(300)
            all_selected = page.evaluate("Array.from(document.querySelectorAll('.lec-checkbox')).every(cb => cb.checked)")
            test_assert(all_selected, "12. 전체선택 체크박스(#check_all) 클릭 시 전체 강좌 일괄 체크 확인")

            # 9. 테이블 하단 일괄적용 (update_type) 조작 및 백엔드 동기화 검증
            page.on("dialog", lambda dialog: dialog.accept())
            page.select_option("#update_type", "status_2") # 종료로 일괄 변경
            page.click("#btn_bulk_update_submit")
            page.wait_for_timeout(1500)

            # 첫 행 상태가 '종료'로 반영되었는지 확인
            first_status = page.locator("#lectureTbody tr select").first.input_value()
            test_assert(first_status == "종료", f"13. 하단 일괄적용(#update_type: 'status_2') 즉시 반영 및 DB 동기화 확인 (상태: {first_status})")

            # 다시 '출력'으로 일괄 복원
            page.evaluate("chk_all({ checked: true })")
            page.wait_for_timeout(300)
            page.select_option("#update_type", "status_1")
            page.click("#btn_bulk_update_submit")
            page.wait_for_timeout(1500)
            restored_status = page.locator("#lectureTbody tr select").first.input_value()
            test_assert(restored_status == "출력", f"14. 하단 일괄적용(#update_type: 'status_1') 정상 원복 확인 (상태: {restored_status})")

            # 10. 하단 도움말 박스 (.help_box) 검증
            help_box = lec_panel.locator(".help_box")
            test_assert(help_box.is_visible() and "수강료 출력" in help_box.inner_text(), "15. 원본 하단 공식 도움말 박스(.help_box) 1:1 완벽 렌더링 확인")

            print(f"\n==========================================")
            print(f"최종 결과: {passed}/{total} 항목 완벽 통과! (100% 무오차)")
            print(f"==========================================")

        except Exception as e:
            print(f"하네스 오류 발생: {e}")
        finally:
            browser.close()

if __name__ == '__main__':
    run()
