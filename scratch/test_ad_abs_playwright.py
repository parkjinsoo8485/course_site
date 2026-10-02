"""
Automated Playwright E2E Verification for 결석/귀가신청 (/af/ad_abs/lists)
"""
import sys
import os
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

def test_ad_abs():
    print("=== [ad_abs] 1:1 Authentic Button & Modal Full Verification Harness ===")

    # 1. 엑셀 다운로드 엔드포인트 검증
    excel_url = 'http://localhost:3005/af/ad_abs/excel/sn/3267'
    print(f"1. Testing Excel Endpoint: {excel_url} ...")
    req = urllib.request.urlopen(excel_url)
    assert req.status == 200, f"Expected 200, got {req.status}"
    content = req.read().decode('utf-8')
    assert 'hero-title' in content, "Missing hero-title in excel"
    assert 'total-row' in content, "Missing total-row in excel"
    assert '치과 정기 검진' in content, "Missing sample reason in excel"
    print("   ✔ Excel 5-Principles endpoint returned HTTP 200 with authentic content.")

    # 2. 브라우저 E2E 상호작용 검증
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1400, 'height': 900})

        print("2. Navigating to http://localhost:3005/af/ad_abs/lists/sn/3267 ...")
        page.goto('http://localhost:3005/af/ad_abs/lists/sn/3267', wait_until='networkidle')

        # 2-1: 패널 및 사이드바 활성화 확인
        panel = page.locator('#panel_ad_abs_lists')
        assert panel.is_visible(), "Error: #panel_ad_abs_lists is not visible!"
        print("   ✔ Panel #panel_ad_abs_lists is visible.")

        sidebar_item = page.locator('#sub_ad_abs_lists')
        assert 'active' in sidebar_item.get_attribute('class'), "Error: Sidebar menu item is not active!"
        print("   ✔ Sidebar item #sub_ad_abs_lists is active.")

        # 2-2: 메인 테이블 렌더링 확인
        rows = page.locator('#absTableTbody tr')
        count = rows.count()
        assert count >= 1, f"Expected at least 1 record, got {count}"
        print(f"   ✔ Main table rendered {count} rows successfully.")

        # 2-3: 일자검색 라디오 및 date input 토글 확인
        page.locator('#sdt_1').click()
        page.wait_for_timeout(200)
        assert not page.locator('#sdt_ssd').is_disabled(), "Error: sdt_ssd should be enabled!"
        print("   ✔ Date search radio enables date picker.")
        page.locator('#sdt_0').click()

        # 2-4: [등록] 버튼 클릭 및 등록 모달 오픈 검증
        print("3. Testing Write Modal...")
        page.locator("#panel_ad_abs_lists button:has-text('등록')").click()
        page.wait_for_timeout(400)
        write_modal = page.locator('#modal_ad_abs_write')
        assert write_modal.is_visible(), "Error: Write modal did not open!"
        print("   ✔ Write modal opened successfully.")

        # 학생 검색 팝업 열기
        page.locator("#modal_ad_abs_write button:has-text('검색하기')").click()
        page.wait_for_timeout(300)
        search_modal = page.locator('#modal_ad_rsch_search_student')
        assert search_modal.is_visible(), "Error: Student search modal did not open!"
        print("   ✔ Student search modal opened.")

        # 학생 선택
        page.locator("#rsch_search_stu_tbody tr:first-child button").click()
        page.wait_for_timeout(300)
        assert not search_modal.is_visible(), "Error: Student search modal did not close!"
        assert page.locator('#abs_mem_num').input_value() != "", "Error: Student was not selected!"
        print("   ✔ Student selected and bound to abs form.")

        # 조기귀가 라디오 클릭 ➔ 시간/동행자 행 표시 확인
        page.locator('#sin_type_2').click()
        page.wait_for_timeout(200)
        assert page.locator('#tr_sin_time').is_visible(), "Error: tr_sin_time should be visible for early return!"
        assert page.locator('#tr_guardian').is_visible(), "Error: tr_guardian should be visible for early return!"
        print("   ✔ Early return dynamic rows shown.")

        # 결석 라디오 클릭 ➔ 숨김 확인
        page.locator('#sin_type_1').click()
        page.wait_for_timeout(200)
        assert not page.locator('#tr_sin_time').is_visible(), "Error: tr_sin_time should be hidden for absence!"
        print("   ✔ Absence dynamic rows hidden.")

        # 모달 캡처
        page.locator('#sin_type_2').click()
        page.wait_for_timeout(200)
        page.screenshot(path='scratch/verified_ad_abs_modal.png')
        print("   ✔ Modal screenshot saved.")

        # 모달 닫기
        page.locator("#modal_ad_abs_write button:has-text('취소')").click()
        page.wait_for_timeout(300)
        assert not write_modal.is_visible(), "Error: Write modal did not close!"
        print("   ✔ Write modal closed successfully.")

        # 2-5: 최종 풀 페이지 스크린샷
        screenshot_path = os.path.join(os.getcwd(), 'scratch', 'verified_ad_abs_complete.png')
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"   ✔ Full page screenshot saved to: {screenshot_path}")

        browser.close()
        print("\n===========================================================")
        print("🎉 [Playwright E2E Result] All 결석/귀가신청 Tests Passed Successfully!")
        print("===========================================================\n")

if __name__ == '__main__':
    test_ad_abs()
