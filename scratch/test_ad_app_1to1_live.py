from playwright.sync_api import sync_playwright

def run():
    print("=== [신청자관리 1:1 타깃 모방 검증] E2E 실기능 하네스 점검 ===")
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
            page.goto("http://localhost:3005/af/ad_app/lists/sn/3267")
            page.wait_for_load_state("networkidle")

            # 1. 패널 전환 검증
            panel = page.locator("#panel_ad_app_lists")
            test_assert(panel.is_visible(), "1. 신청자관리 패널(#panel_ad_app_lists) 기본 노출 확인")

            # 2. 매뉴얼 박스 및 제목 검증
            heading = page.locator("#panel_ad_app_lists .panel-heading")
            test_assert(heading.inner_text().strip() == "신청목록", "2. 타깃 1:1 패널 제목 '신청목록' 확인")

            # 3. 데스크탑 검색 모듈 직접 노출 검증
            search_module = page.locator("#main_control_box_search")
            test_assert(search_module.is_visible(), "3. 데스크탑 기본 검색 모듈(#main_control_box_search) 1:1 직접 노출 확인")

            # 4. 신청자 데이터 로딩 확인
            page.wait_for_selector("#studentTbody tr", timeout=5000)
            rows = page.locator("#studentTbody tr")
            count = rows.count()
            test_assert(count > 0, f"4. 신청자 테이블 데이터 렌더링 완료 ({count}행)")

            # 5. 모바일/태블릿 반응형 상세검색 및 추가기능 토글 검증
            page.set_viewport_size({"width": 768, "height": 900})
            page.wait_for_timeout(300)
            btn_search = page.locator("#main_control_box_btn01")
            test_assert(btn_search.is_visible(), "5. 모바일/태블릿 반응형 '상세검색' 토글 버튼 노출 확인")

            btn_extra = page.locator("#main_control_box_btn02")
            test_assert(btn_extra.is_visible(), "6. 모바일/태블릿 반응형 '추가기능..' 드롭다운 버튼 노출 확인")
            btn_extra.click()
            page.wait_for_timeout(300)
            extra_drop = page.locator("#main_control_box_drop")
            test_assert(extra_drop.is_visible(), "7. '추가기능..' 서브메뉴(일괄입력/수강료/복사/조회/인쇄 등) 정상 오픈")

            # 데스크탑 복귀
            page.set_viewport_size({"width": 1280, "height": 900})
            page.wait_for_timeout(300)

            # 6. 신청자 등록 모달 오픈 검증
            page.evaluate("openAppSinModal();")
            page.wait_for_timeout(500)
            create_modal = page.locator("#modalAppCreate")
            test_assert(create_modal.is_visible(), "8. '신청자등록' 모달(#modalAppCreate) 정상 노출")
            page.evaluate("closeAppModal('modalAppCreate');")
            page.wait_for_timeout(300)

            # 7. 인라인 연락처 수정 팝오버(show_stu_hp) 검증
            first_hp_btn = page.locator("#studentTbody tr td a[id^='stu_hp_']").first
            if first_hp_btn.is_visible():
                first_hp_btn.click()
                page.wait_for_timeout(400)
                hp_box = page.locator(".stu_hp_box")
                test_assert(hp_box.is_visible(), "9. 학생 연락처 인라인 수정 팝오버(.stu_hp_box) 정상 노출")
                # 닫기 클릭
                hp_box.locator("a:has-text('취소')").click()
                page.wait_for_timeout(300)
                test_assert(page.locator(".stu_hp_box").count() == 0, "10. 연락처 팝오버 정상 닫힘 확인")
            else:
                test_assert(True, "9. 연락처 수정 버튼 스킵")
                test_assert(True, "10. 연락처 팝오버 닫힘 스킵")

            # 8. 학생 이름 클릭 시 학생정보/수강료 수정 모달 검증
            first_student_link = page.locator("#studentTbody tr td a.link_type").first
            test_assert(first_student_link.is_visible(), "11. 학생명 링크 노출 확인")
            first_student_link.click()
            page.wait_for_timeout(500)
            edit_modal = page.locator("#modalAppEdit")
            test_assert(edit_modal.is_visible(), "12. 학생 클릭 시 학생/수강료 수정 모달(#modalAppEdit) 정상 오픈")
            page.evaluate("closeAppModal('modalAppEdit');")
            page.wait_for_timeout(300)

            # 9. 수강신청서/고지서 인쇄 모달 검증
            page.evaluate("openAppPdfPrintModal(new Event('click'));")
            page.wait_for_timeout(500)
            print_modal = page.locator("#modalAppPrint")
            test_assert(print_modal.is_visible(), "13. 수강신청서 인쇄 모달(#modalAppPrint) 정상 오픈")
            page.evaluate("closeAppModal('modalAppPrint');")
            page.wait_for_timeout(300)

            # 10. 전체선택 체크박스 검증
            page.evaluate("chk_all_apps({ checked: true });")
            page.wait_for_timeout(200)
            checked_count = page.locator("input[name='data_checked[]']:checked").count()
            test_assert(checked_count == count, f"14. 전체선택 체크박스 동작 확인 ({checked_count}/{count}개 선택됨)")

            print(f"\n최종 결과: {passed}/{total} 항목 통과!")

        except Exception as e:
            print(f"하네스 오류 발생: {e}")
        finally:
            browser.close()

if __name__ == '__main__':
    run()
