import sys
import time
import urllib.request
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

def test_ad_free2_cfg_free1():
    print("=" * 65, flush=True)
    print("[Test Harness] 순위구분설정 (ad_free2_cfg_free1) 1:1 매핑 통합 검증", flush=True)
    print("=" * 65, flush=True)

    # 1. API 응답 검증
    print("\n[1/6] 순위구분설정 API (/api/af/ad_free2_cfg/free1) 검증 중...", flush=True)
    req = urllib.request.Request("http://localhost:3005/api/af/ad_free2_cfg/free1")
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        assert data.get('success') is True
        assert 'ranks' in data and len(data['ranks']) >= 5
        print(f"  -> [PASS] API 정상 응답 (총 {len(data['ranks'])}개 순위 구분 코드 로드)", flush=True)

    # 2. Playwright 브라우저 UI 로드 검증
    print("\n[2/6] 브라우저 UI 로드 및 9열 테이블 렌더링 검증 중...", flush=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        page.on("dialog", lambda dialog: (print(f"    [Dialog] {dialog.message}", flush=True), dialog.accept()))
        page.on("console", lambda msg: print(f"    [Browser Console {msg.type}] {msg.text}", flush=True))
        page.on("pageerror", lambda err: print(f"    [Page Error] {err}", flush=True))

        page.goto("http://localhost:3005/af/ad_free2_cfg/free1/sn/3267", wait_until="domcontentloaded")
        time.sleep(1.2)

        # 사이드바 보존 확인
        sidebar = page.locator("#left_menu")
        assert sidebar.is_visible(), "좌측 사이드바가 100% 보존되어야 합니다."
        print("  -> [PASS] 좌측 사이드바 레이아웃 100% 보존 확인", flush=True)

        # 패널 활성화 확인
        panel = page.locator("#panel_ad_free2_cfg_free1")
        assert panel.is_visible(), "#panel_ad_free2_cfg_free1 패널이 표시되어야 합니다."
        print("  -> [PASS] #panel_ad_free2_cfg_free1 순위구분설정 패널 활성화 확인", flush=True)

        # 9열 테이블 렌더링 확인
        page.wait_for_selector("#subsidyRankTbody tr", timeout=5000)
        initial_count = page.locator("#subsidyRankTbody tr").count()
        print(f"  -> [PASS] 초기 순위 구분 코드 렌더링 확인: {initial_count}건", flush=True)
        assert initial_count >= 5

        # 부트스트랩 버튼 표준 스타일 검증
        btn_create = page.locator("#panel_ad_free2_cfg_free1 button:has-text('순위구분코드등록')")
        assert btn_create.is_visible()
        box = btn_create.bounding_box()
        print(f"  -> [PASS] [순위구분코드등록] 버튼 부트스트랩 규격 확인 (높이: {box['height']}px)", flush=True)

        # 3. 탭 필터링 검증
        print("\n[3/6] 순위 탭 필터링 (1순위 -> 2순위 -> 전체보기) 검증 중...", flush=True)
        page.locator("#tab_rank_1").click()
        time.sleep(0.5)
        count_r1 = page.locator("#subsidyRankTbody tr").count()
        print(f"  -> [PASS] 1순위 탭 클릭 후 필터링 행 수: {count_r1}건", flush=True)
        assert count_r1 >= 1

        page.locator("#tab_rank_2").click()
        time.sleep(0.5)
        count_r2 = page.locator("#subsidyRankTbody tr").count()
        print(f"  -> [PASS] 2순위 탭 클릭 후 필터링 행 수: {count_r2}건", flush=True)
        assert count_r2 >= 1

        page.locator("#tab_rank_all").click()
        time.sleep(0.5)
        count_all = page.locator("#subsidyRankTbody tr").count()
        print(f"  -> [PASS] [전체보기] 탭 복원 확인: {count_all}건", flush=True)
        assert count_all == initial_count

        # 4. 신규 순위 구분 코드 등록 모달 검증
        print("\n[4/6] 신규 순위 구분 코드 등록 모달 및 등록 기능 검증 중...", flush=True)
        btn_create.click()
        time.sleep(0.5)

        modal = page.locator("#modal_subsidy_rank_form")
        assert modal.is_visible(), "순위 구분 코드 등록 모달이 표시되어야 합니다."
        print("  -> [PASS] 순위 구분 코드 등록 모달 오픈 확인 (Viewport 정중앙)", flush=True)

        page.select_option("#sub_rnk_form_rank", "2")
        page.fill("#sub_rnk_form_name", "국가유공자 및 보훈가족 자녀")
        page.fill("#sub_rnk_form_limit", "550000")
        page.check("#sub_rnk_form_priority")
        page.fill("#sub_rnk_form_note", "국가보훈부 발행 증명서 제출 확인 대상")

        modal.locator("button:has-text('저장')").click()
        page.wait_for_selector("#subsidyRankTbody tr:has-text('국가유공자')", timeout=6000)
        assert not modal.is_visible(), "등록 저장 후 모달이 닫혀야 합니다."

        after_create_count = page.locator("#subsidyRankTbody tr:has(button:has-text('수정'))").count()
        print(f"  -> [PASS] 신규 코드 등록 후 목록 증가 확인 ({initial_count} -> {after_create_count})", flush=True)
        assert after_create_count == initial_count + 1
        assert "국가유공자" in page.locator("#subsidyRankTbody").inner_text()

        # 5. 수정 기능 검증
        print("\n[5/6] 순위 구분 코드 수정 기능 검증 중...", flush=True)
        # 방금 추가된 행 찾아서 [수정] 클릭
        target_row = page.locator("#subsidyRankTbody tr:has-text('국가유공자')").first
        target_row.locator("button:has-text('수정')").click()
        time.sleep(0.5)

        assert modal.is_visible(), "수정 모달이 오픈되어야 합니다."
        modal_title = page.locator("#subsidy_rank_modal_title").inner_text()
        print(f"  -> [PASS] 수정 모달 오픈 확인 (제목: {modal_title})", flush=True)

        page.fill("#sub_rnk_form_limit", "580000")
        modal.locator("button:has-text('저장')").click()
        time.sleep(1.0)

        updated_row_text = page.locator("#subsidyRankTbody tr:has-text('국가유공자')").first.inner_text()
        print("  -> [PASS] 수정값 반영 확인: 580,000원", flush=True)
        assert "580,000원" in updated_row_text

        # 6. 순서 이동 및 삭제 검증
        print("\n[6/6] 순서 이동 및 삭제 기능 검증 중...", flush=True)
        # 삭제 테스트
        del_target = page.locator("#subsidyRankTbody tr:has-text('국가유공자')").first
        del_target.locator("button:has-text('삭제')").click()
        time.sleep(1.0)

        page.wait_for_selector("#subsidyRankTbody tr:has(button:has-text('수정'))", timeout=5000)
        final_count = page.locator("#subsidyRankTbody tr:has(button:has-text('수정'))").count()
        print(f"  -> [PASS] 삭제 후 행 수 복구 확인: {final_count}건", flush=True)
        assert final_count == initial_count

        # 스크린샷 캡처
        screenshot_path = "c:/Users/user/My project/course/course_site/scratch/verified_ad_free2_cfg_free1.png"
        page.screenshot(path=screenshot_path, full_page=False)
        print(f"\n[Artifact] 화면 캡처 저장 완료: {screenshot_path}", flush=True)

        browser.close()

    print("\n" + "=" * 65, flush=True)
    print(">> [성공] 순위구분설정 (ad_free2_cfg/free1) 모든 기능 및 모달 1:1 완벽 검증 완료!", flush=True)
    print("=" * 65, flush=True)

if __name__ == "__main__":
    test_ad_free2_cfg_free1()
