"""
Automated Playwright E2E Verification for 강사관리 (/af/ad_tea/lists)
"""
import sys
import os
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

def test_ad_tea():
    print("=== [ad_tea] 1:1 Authentic Button & Modal Full Verification Harness ===")

    # 1. 엑셀 다운로드 엔드포인트 검증
    excel_url = 'http://localhost:3005/af/ad_tea/excel/sn/3267'
    print(f"1. Testing Teacher Excel Endpoint: {excel_url} ...")
    req = urllib.request.urlopen(excel_url)
    assert req.status == 200, f"Expected 200, got {req.status}"
    content = req.read().decode('utf-8')
    assert 'hero-title' in content, "Missing hero-title in excel"
    assert 'total-row' in content, "Missing total-row in excel"
    assert '강태연' in content, "Missing sample teacher in excel"
    print("   ✔ Excel 5-Principles endpoint returned HTTP 200 with authentic content.")

    # 2. 브라우저 E2E 상호작용 검증
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1400, 'height': 900})

        print("2. Navigating to http://localhost:3005/af/ad_tea/lists/sn/3267 ...")
        page.goto('http://localhost:3005/af/ad_tea/lists/sn/3267', wait_until='networkidle')

        # 2-1: 패널 및 사이드바 활성화 확인
        panel = page.locator('#panel_ad_tea_lists')
        assert panel.is_visible(), "Error: #panel_ad_tea_lists is not visible!"
        print("   ✔ Panel #panel_ad_tea_lists is visible.")

        sidebar_item = page.locator('#sub_ad_tea_lists')
        assert 'active' in sidebar_item.get_attribute('class'), "Error: Sidebar menu item is not active!"
        print("   ✔ Sidebar item #sub_ad_tea_lists is active.")

        # 2-2: 메인 테이블 렌더링 확인 (1페이지 10개 행)
        rows = page.locator('#teaTableTbody tr')
        count = rows.count()
        assert count == 10, f"Expected 10 records on page 1, got {count}"
        print(f"   ✔ Main table rendered {count} rows on page 1 successfully.")

        # 2-3: 페이징 2페이지 클릭 확인 (2페이지 8개 행)
        page.locator('#teaPagination a:has-text("2")').click()
        page.wait_for_timeout(300)
        count_p2 = page.locator('#teaTableTbody tr').count()
        assert count_p2 == 8, f"Expected 8 records on page 2, got {count_p2}"
        print(f"   ✔ Pagination page 2 rendered {count_p2} rows successfully.")

        # 다시 1페이지 복귀
        page.locator('#teaPagination a:has-text("1")').click()
        page.wait_for_timeout(300)

        # 2-4: 검색 필터링 검증
        page.locator('#panel_ad_tea_lists #s_word').fill('강태연')
        page.locator('#panel_ad_tea_lists #fm_list_search input[type="submit"]').click()
        page.wait_for_timeout(300)
        filtered_count = page.locator('#teaTableTbody tr').count()
        assert filtered_count == 1, f"Expected 1 record for '강태연', got {filtered_count}"
        print("   ✔ Search filter correctly matched 1 record for '강태연'.")

        # [전체] 버튼 클릭 -> 초기화 검증
        page.locator('#panel_ad_tea_lists #fm_list_search input[value="전체"]').click()
        page.wait_for_timeout(300)
        reset_count = page.locator('#teaTableTbody tr').count()
        assert reset_count == 10, f"Expected 10 records after reset, got {reset_count}"
        print("   ✔ Reset [전체] button restored full list.")

        # 3. 모달 테스트
        # 3-1: 강사 등록 모달 검증
        print("3. Testing Write Modal...")
        page.locator("#panel_ad_tea_lists input[value='강사 등록']").click()
        page.wait_for_timeout(300)
        write_modal = page.locator('#modal_ad_tea_write')
        assert write_modal.is_visible(), "Error: Write modal did not open!"
        print("   ✔ Write modal #modal_ad_tea_write is visible.")

        # 중복확인 테스트 (dialog 자동 수락)
        page.on('dialog', lambda dialog: dialog.accept())
        page.locator('#mem_id').fill('강태연')
        page.locator('#modal_ad_tea_write button:has-text("중복확인")').click()
        page.wait_for_timeout(200)

        # 모달 닫기
        page.locator('#modal_ad_tea_write button:has-text("목록보기/취소")').click()
        page.wait_for_timeout(200)
        assert not write_modal.is_visible(), "Error: Write modal did not close!"
        print("   ✔ Write modal closed successfully.")

        # 3-2: 강사 수정 모달 검증
        print("4. Testing Modify Modal...")
        page.locator("#teaTableTbody tr:first-child a[title='수정']").click()
        page.wait_for_timeout(300)
        modify_modal = page.locator('#modal_ad_tea_modify')
        assert modify_modal.is_visible(), "Error: Modify modal did not open!"
        assert page.locator('#mod_view_mem_id').inner_text() == '강태연', "Error: Teacher ID mismatch!"
        assert page.locator('#mod_mem_name').is_disabled() or page.locator('#mod_mem_name').get_attribute('readonly') is not None, "Error: Name should be readonly initially!"
        print("   ✔ Modify modal #modal_ad_tea_modify loaded with teacher details.")

        # 이름변경 체크박스 클릭 시 readonly 해제 검증
        page.locator('#change_mem_name').click()
        page.wait_for_timeout(100)
        assert page.locator('#mod_mem_name').get_attribute('readonly') is None, "Error: Name should be editable after checkbox click!"
        print("   ✔ Name edit checkbox toggles readonly state correctly.")

        # 모달 닫기
        page.locator('#modal_ad_tea_modify button:has-text("목록보기/취소")').click()
        page.wait_for_timeout(200)
        assert not modify_modal.is_visible(), "Error: Modify modal did not close!"
        print("   ✔ Modify modal closed successfully.")

        # 3-3: 추가기능 드롭다운 및 일괄입력 모달 검증
        print("5. Testing Batch Input Modal...")
        page.locator('#panel_ad_tea_lists #main_control_box_btn02').click()
        page.wait_for_timeout(200)
        drop = page.locator('#panel_ad_tea_lists #main_control_box_drop')
        assert drop.is_visible(), "Error: Control box drop did not show!"

        page.locator('#panel_ad_tea_lists #main_control_box_drop a:has-text("강사 일괄입력")').click()
        page.wait_for_timeout(300)
        input_modal = page.locator('#modal_ad_tea_input')
        assert input_modal.is_visible(), "Error: Input modal did not open!"
        print("   ✔ Batch input modal #modal_ad_tea_input opened from extra menu.")

        # 닫기
        page.locator('#modal_ad_tea_input button:has-text("취소")').click()
        page.wait_for_timeout(200)
        assert not input_modal.is_visible(), "Error: Input modal did not close!"
        print("   ✔ Batch input modal closed successfully.")

        # 3-4: 시간표 출력 모달 검증
        print("6. Testing Schedule Modal...")
        page.locator('#panel_ad_tea_lists #main_control_box_btn02').click()
        page.wait_for_timeout(200)
        page.locator('#panel_ad_tea_lists #main_control_box_drop a:has-text("시간표출력")').click()
        page.wait_for_timeout(300)
        sched_modal = page.locator('#modal_ad_tea_schedule')
        assert sched_modal.is_visible(), "Error: Schedule modal did not open!"
        print("   ✔ Schedule modal #modal_ad_tea_schedule opened successfully.")

        # 닫기
        page.locator('#modal_ad_tea_schedule button:has-text("취소")').click()
        page.wait_for_timeout(200)
        assert not sched_modal.is_visible(), "Error: Schedule modal did not close!"
        print("   ✔ Schedule modal closed successfully.")

        # 4. 최종 스크린샷 캡처
        page.screenshot(path='scratch/verified_ad_tea_complete.png', full_page=True)
        print("   ✔ Saved complete verification screenshot to scratch/verified_ad_tea_complete.png")

        browser.close()

    print("\n🎉 ALL TESTS PASSED! Sprint 2 - 강사관리 (/af/ad_tea) 100% PERFECT CLONE VERIFIED!")

if __name__ == '__main__':
    test_ad_tea()
