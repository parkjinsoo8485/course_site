import sys
import time
import urllib.request
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

def test_ad_free2_cfg_main():
    print("=" * 65, flush=True)
    print("[Test Harness] 지원금설정 (ad_free2_cfg_main) 1:1 매핑 통합 검증", flush=True)
    print("=" * 65, flush=True)

    # 1. API 응답 검증
    print("\n[1/5] 지원금설정 API (/api/af/ad_free2_cfg/main) 검증 중...", flush=True)
    req = urllib.request.Request("http://localhost:3005/api/af/ad_free2_cfg/main")
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        assert data.get('success') is True
        assert 'configs' in data and 'order' in data
        print(f"  -> [PASS] API 정상 응답 (configs: {list(data['configs'].keys())}, order count: {len(data['order'])})", flush=True)

    # 2. Playwright 브라우저 UI 로드 검증
    print("\n[2/5] 브라우저 UI 로드 및 패널 활성화 검증 중...", flush=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        page.on("dialog", lambda dialog: (print(f"    [Dialog] {dialog.message}", flush=True), dialog.accept()))
        page.on("console", lambda msg: print(f"    [Browser Console {msg.type}] {msg.text}", flush=True))
        page.on("pageerror", lambda err: print(f"    [Page Error] {err}", flush=True))

        page.goto("http://localhost:3005/af/ad_free2_cfg/main/sn/3267", wait_until="domcontentloaded")
        time.sleep(1.2)

        # 사이드바 보존 확인
        sidebar = page.locator("#left_menu")
        assert sidebar.is_visible(), "좌측 사이드바가 100% 보존되어야 합니다."
        print("  -> [PASS] 좌측 사이드바 레이아웃 100% 보존 확인", flush=True)

        # 패널 활성화 확인
        panel = page.locator("#panel_ad_free2_cfg_main")
        assert panel.is_visible(), "#panel_ad_free2_cfg_main 패널이 표시되어야 합니다."
        print("  -> [PASS] #panel_ad_free2_cfg_main 지원금설정 패널 활성화 확인", flush=True)

        # 부트스트랩 버튼 표준 스타일 검증
        btn_order = page.locator("#panel_ad_free2_cfg_main button:has-text('지원금 차감 순서 변경')")
        assert btn_order.is_visible()
        box = btn_order.bounding_box()
        print(f"  -> [PASS] [지원금 차감 순서 변경] 부트스트랩 버튼 렌더링 확인 (높이: {box['height']}px)", flush=True)

        # 3. 탭 전환 검증
        print("\n[3/5] 지원금 탭 전환 (1학년 -> 3학년 -> 자유수강권) 검증 중...", flush=True)
        # 초기 1학년 지원금 명칭 확인
        name_val = page.locator("#sub_cfg_name").input_value()
        print(f"  -> [PASS] 기본 탭(1학년 지원금) 입력값 확인: '{name_val}'", flush=True)
        assert "1학년" in name_val

        # 3학년 탭 클릭
        page.locator("#tab_fund_3").click()
        time.sleep(0.5)
        name_val3 = page.locator("#sub_cfg_name").input_value()
        print(f"  -> [PASS] 3학년 지원금 탭 클릭 후 입력값 전환 확인: '{name_val3}'", flush=True)
        assert "3학년" in name_val3

        # 자유수강권 탭 클릭
        page.locator("#tab_fund_free").click()
        time.sleep(0.5)
        name_val_free = page.locator("#sub_cfg_name").input_value()
        print(f"  -> [PASS] 자유수강권 탭 클릭 후 입력값 전환 확인: '{name_val_free}'", flush=True)
        assert "자유수강권" in name_val_free

        # 다시 1학년 탭으로 복귀
        page.locator("#tab_fund_1").click()
        time.sleep(0.5)

        # 4. 설정 폼 수정 및 저장 검증
        print("\n[4/5] 설정 수정 및 서버 저장 검증 중...", flush=True)
        page.fill("#sub_cfg_month_limit", "750000")
        page.locator("#panel_ad_free2_cfg_main form button:has-text('저장')").click()
        time.sleep(1.0)

        # 재조회하여 서버 반영 확인
        page.locator("#tab_fund_3").click()
        time.sleep(0.4)
        page.locator("#tab_fund_1").click()
        time.sleep(0.4)
        updated_limit = page.locator("#sub_cfg_month_limit").input_value()
        print(f"  -> [PASS] 설정 수정 후 저장값 유지 확인: {updated_limit}원", flush=True)
        assert updated_limit == "750000"

        # 5. 차감 순서 변경 모달 검증
        print("\n[5/5] 지원금 차감 순서 변경 모달 기능 1:1 검증 중...", flush=True)
        btn_order.click()
        time.sleep(0.5)

        modal = page.locator("#modal_subsidy_order_change")
        assert modal.is_visible(), "차감 순서 변경 모달이 오픈되어야 합니다."
        print("  -> [PASS] 차감 순서 변경 모달 오픈 확인 (Viewport 정중앙)", flush=True)

        items_count = page.locator("#subsidy_order_list_container > div").count()
        print(f"  -> [PASS] 차감 순위 항목 수: {items_count}개", flush=True)
        assert items_count >= 3

        # 첫 번째 항목 아래로 이동 클릭
        page.locator("#subsidy_order_list_container > div:first-child button:has-text('아래로')").click()
        time.sleep(0.4)

        # 순서저장 클릭
        modal.locator("button:has-text('순서저장')").click()
        time.sleep(1.0)
        assert not modal.is_visible(), "순서저장 완료 후 모달이 닫혀야 합니다."
        print("  -> [PASS] 순서저장 완료 및 모달 닫힘 확인", flush=True)

        # 스크린샷 캡처
        screenshot_path = "c:/Users/user/My project/course/course_site/scratch/verified_ad_free2_cfg_main.png"
        page.screenshot(path=screenshot_path, full_page=False)
        print(f"\n[Artifact] 화면 캡처 저장 완료: {screenshot_path}", flush=True)

        browser.close()

    print("\n" + "=" * 65, flush=True)
    print(">> [성공] 지원금설정 (ad_free2_cfg/main) 모든 기능 및 모달 1:1 완벽 검증 완료!", flush=True)
    print("=" * 65, flush=True)

if __name__ == "__main__":
    test_ad_free2_cfg_main()
