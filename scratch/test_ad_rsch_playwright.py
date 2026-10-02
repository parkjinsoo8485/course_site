"""
Automated Playwright E2E Verification for 귀가일정표 (/af/ad_rsch/lists)
"""
import sys
import os
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

def test_ad_rsch():
    print("=== [ad_rsch] 1:1 Authentic Button & Modal Full Verification Harness ===")

    # 1. 엑셀 다운로드 엔드포인트 직접 검증
    excel_url = 'http://localhost:3005/af/ad_rsch/excel/sn/3267'
    print(f"1. Testing Excel Endpoint: {excel_url} ...")
    req = urllib.request.urlopen(excel_url)
    assert req.status == 200, f"Expected 200, got {req.status}"
    content = req.read().decode('utf-8')
    assert 'hero-title' in content, "Missing hero-title in excel"
    assert 'total-row' in content, "Missing total-row in excel"
    assert '유다은' in content, "Missing sample student in excel"
    print("   ✔ Excel 5-Principles endpoint returned HTTP 200 with authentic content.")

    # 2. 샘플 서식 다운로드 검증
    sample_url = 'http://localhost:3005/af/ad_rsch/sample_excel'
    print(f"2. Testing Sample Download Endpoint: {sample_url} ...")
    req_sample = urllib.request.urlopen(sample_url)
    assert req_sample.status == 200, f"Expected 200, got {req_sample.status}"
    sample_txt = req_sample.read().decode('utf-8')
    assert '귀가동행자' in sample_txt, "Missing header in sample CSV"
    print("   ✔ Sample CSV download returned HTTP 200 with authentic columns.")

    # 3. 브라우저 E2E 시각적 및 상호작용 검증
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1400, 'height': 900})
        page = context.new_page()

        print("3. Navigating to http://localhost:3005/af/ad_rsch/lists/sn/3267 ...")
        page.goto('http://localhost:3005/af/ad_rsch/lists/sn/3267', wait_until='networkidle')

        # 3-1: 패널 확인
        panel = page.locator('#panel_ad_rsch_lists')
        assert panel.is_visible(), "Error: #panel_ad_rsch_lists is not visible!"
        print("   ✔ Panel #panel_ad_rsch_lists is visible.")

        # 3-2: 사이드바 활성화 확인
        sidebar_item = page.locator('#sub_ad_rsch_lists')
        assert 'active' in sidebar_item.get_attribute('class'), "Error: Sidebar menu item is not active!"
        print("   ✔ Sidebar item #sub_ad_rsch_lists is active.")

        # 3-3: 메인 테이블 행 확인
        rows = page.locator('#rschTableTbody tr')
        count = rows.count()
        assert count >= 1, f"Expected at least 1 student row, got {count}"
        print(f"   ✔ Main table rendered {count} student rows successfully.")

        # 3-4: [등록] 버튼 클릭 및 등록 모달 오픈 검증
        print("4. Testing Write Modal...")
        page.locator("#panel_ad_rsch_lists button:has-text('등록')").click()
        page.wait_for_timeout(400)
        write_modal = page.locator('#modal_ad_rsch_write')
        assert write_modal.is_visible(), "Error: Write modal did not open!"
        print("   ✔ Write modal opened successfully.")

        # 학생 검색 팝업 열기
        page.locator("#modal_ad_rsch_write button:has-text('학생 검색')").click()
        page.wait_for_timeout(300)
        search_modal = page.locator('#modal_ad_rsch_search_student')
        assert search_modal.is_visible(), "Error: Student search modal did not open!"
        print("   ✔ Student search modal opened.")

        # 학생 선택
        page.locator("#rsch_search_stu_tbody tr:first-child button").click()
        page.wait_for_timeout(300)
        assert not search_modal.is_visible(), "Error: Student search modal did not close!"
        assert page.locator('#mem_num').input_value() != "", "Error: Student was not selected!"
        print("   ✔ Student selected and bound to form.")

        # 요일 탭 전환 검증
        page.locator('#rsch_tab_2').click() # 화요일
        page.wait_for_timeout(200)
        assert page.locator('#rsch_day_panel_2').is_visible(), "Error: Tuesday panel did not show!"
        print("   ✔ Day tab switching verified.")

        # 모달 닫기
        page.locator("#modal_ad_rsch_write button:has-text('취소')").click()
        page.wait_for_timeout(300)
        assert not write_modal.is_visible(), "Error: Write modal did not close!"
        print("   ✔ Write modal closed successfully.")

        # 3-5: [일괄입력] 모달 오픈 및 닫기 검증
        print("5. Testing Batch Input Modal...")
        page.locator("#panel_ad_rsch_lists button:has-text('일괄입력')").click()
        page.wait_for_timeout(400)
        input_modal = page.locator('#modal_ad_rsch_input')
        assert input_modal.is_visible(), "Error: Batch input modal did not open!"
        page.locator("#modal_ad_rsch_input button:has-text('취소')").click()
        page.wait_for_timeout(300)
        assert not input_modal.is_visible(), "Error: Batch input modal did not close!"
        print("   ✔ Batch input modal opened and closed successfully.")

        # 3-6: 학생 주간 일정표 모달 검증
        print("6. Testing Student Weekly Schedule Modal...")
        page.locator("#rschTableTbody tr:first-child a.link_type:has-text('유다은')").click()
        page.wait_for_timeout(400)
        sched_modal = page.locator('#modal_ad_rsch_stu_schedule')
        assert sched_modal.is_visible(), "Error: Student schedule modal did not open!"
        page.locator("#modal_ad_rsch_stu_schedule button:has-text('닫기')").click()
        page.wait_for_timeout(300)
        assert not sched_modal.is_visible(), "Error: Student schedule modal did not close!"
        print("   ✔ Student schedule modal verified.")

        # 3-7: 최종 스크린샷 저장
        screenshot_path = os.path.join(os.getcwd(), 'scratch', 'verified_ad_rsch_complete.png')
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"   ✔ Full page screenshot saved to: {screenshot_path}")

        browser.close()
        print("\n===========================================================")
        print("🎉 [Playwright E2E Result] All 귀가일정표 Tests Passed Successfully!")
        print("===========================================================\n")

if __name__ == '__main__':
    test_ad_rsch()
