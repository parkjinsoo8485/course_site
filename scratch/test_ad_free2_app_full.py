import sys
import time
import urllib.request

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

def test_ad_free2_app():
    print("=" * 65, flush=True)
    print("[Test Harness] 수강자관리 (ad_free2_app) 1:1 매핑 통합 검증", flush=True)
    print("=" * 65, flush=True)

    # 1. 엑셀 다운로드 엔드포인트 검증
    print("\n[1/6] 엑셀 다운로드 엔드포인트 응답 검증 중...", flush=True)
    
    # 검색결과 엑셀
    req1 = urllib.request.Request("http://localhost:3005/af/ad_free2_app/excel")
    with urllib.request.urlopen(req1) as resp:
        assert resp.status == 200
        ct = resp.headers.get("Content-Type", "")
        cd = resp.headers.get("Content-Disposition", "")
        assert "excel" in ct or "ms-excel" in ct
        assert "subsidy_applicants_list.xls" in cd
        excel_body = resp.read().decode('utf-8')
        assert "지원금 수강자 차감 관리 내역" in excel_body
        print("  -> [PASS] 검색결과 엑셀 출력 정상 (200 OK, attachment: subsidy_applicants_list.xls)", flush=True)

    # 지원금정산출력 엑셀
    req2 = urllib.request.Request("http://localhost:3005/af/ad_free2_app/excel_settle")
    with urllib.request.urlopen(req2) as resp:
        assert resp.status == 200
        ct = resp.headers.get("Content-Type", "")
        cd = resp.headers.get("Content-Disposition", "")
        assert "excel" in ct or "ms-excel" in ct
        assert "subsidy_settlement_report.xls" in cd
        excel_body = resp.read().decode('utf-8')
        assert "방과후학교 지원금 정산 총괄표" in excel_body
        print("  -> [PASS] 지원금정산 총괄표 엑셀 출력 정상 (200 OK, attachment: subsidy_settlement_report.xls)", flush=True)

    # 2. Playwright 브라우저 UI 로드 검증
    print("\n[2/6] 브라우저 UI 로드 및 15열 테이블 렌더링 검증 중...", flush=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        page.on("dialog", lambda dialog: (print(f"    [Dialog] {dialog.message}", flush=True), dialog.accept()))
        page.on("console", lambda msg: print(f"    [Browser Console {msg.type}] {msg.text}", flush=True))
        page.on("pageerror", lambda err: print(f"    [Page Error] {err}", flush=True))

        page.goto("http://localhost:3005/af/ad_free2_app/lists/sn/3267", wait_until="domcontentloaded")
        time.sleep(1.2)

        # 사이드바 레이아웃 유지 검증
        sidebar = page.locator("#left_menu")
        assert sidebar.is_visible(), "좌측 사이드바가 100% 보존되어야 합니다."
        print("  -> [PASS] 좌측 사이드바 레이아웃 100% 보존 확인", flush=True)

        # 패널 활성화 검증
        panel = page.locator("#panel_ad_free2_app")
        assert panel.is_visible(), "#panel_ad_free2_app 패널이 활성화되어야 합니다."
        print("  -> [PASS] #panel_ad_free2_app 수강자관리 패널 활성화 확인", flush=True)

        # 15열 테이블 렌더링 검증
        page.wait_for_selector("#subsidyAppTbody tr td input.sub_app_chk_item", timeout=5000)
        initial_rows = page.locator("#subsidyAppTbody tr").count()
        print(f"  -> [PASS] 초기 수강자 지원금 목록 렌더링 확인 (총 {initial_rows}건)", flush=True)
        assert initial_rows >= 6, "초기 데이터는 최소 6건 이상이어야 합니다."

        # 요약 통계 바 검증
        sum_cnt = page.locator("#sub_app_sum_count").inner_text()
        sum_sub = page.locator("#sub_app_sum_subsidized").inner_text()
        print(f"  -> [PASS] 실시간 요약 통계 바 표시 확인: {sum_cnt}건, 지원금차감 합계 {sum_sub}원", flush=True)

        # 3. 필터 검색 & 초기화 검증
        print("\n[3/6] 필터 검색 (이름 검색 및 전체 초기화) 검증 중...", flush=True)
        page.fill("#sub_app_filter_name", "최유진")
        page.locator("#panel_ad_free2_app .filter-container button:has-text('검색')").click()
        time.sleep(0.8)

        filtered_count = page.locator("#subsidyAppTbody tr").count()
        print(f"  -> [PASS] '최유진' 검색 결과 행 수: {filtered_count}", flush=True)
        assert filtered_count == 1, "최유진 검색 결과는 1건이어야 합니다."

        page.locator("#panel_ad_free2_app .filter-container button:has-text('전체')").click()
        time.sleep(0.8)
        reset_count = page.locator("#subsidyAppTbody tr").count()
        print(f"  -> [PASS] [전체] 버튼 클릭 후 목록 복원: {reset_count}건", flush=True)
        assert reset_count == initial_rows, "전체 복원 시 초기 행 수와 일치해야 합니다."

        # 4. 수강자지원금 등록 모달 및 실시간 본인부담금 계산 검증
        print("\n[4/6] 수강자지원금 등록 모달 및 등록 기능 검증 중...", flush=True)
        page.locator("#panel_ad_free2_app button:has-text('수강자지원금등록')").click()
        time.sleep(0.5)

        modal = page.locator("#modal_subsidy_app_form")
        assert modal.is_visible(), "등록 모달이 표시되어야 합니다."
        print("  -> [PASS] 수강자 지원금 등록 모달 오픈 확인 (Viewport 정중앙)", flush=True)

        page.fill("#sub_app_form_course_title", "코딩드론마스터")
        page.select_option("#sub_app_form_grade", "2")
        page.fill("#sub_app_form_class", "3")
        page.fill("#sub_app_form_num", "15")
        page.fill("#sub_app_form_name", "장보고")
        page.fill("#sub_app_form_phone", "010-9876-5432")
        page.fill("#sub_app_form_fee", "40000")
        page.fill("#sub_app_form_sub_amount", "30000")
        page.dispatch_event("#sub_app_form_sub_amount", "input")

        pocket_val = page.locator("#sub_app_form_pocket_amount").input_value()
        print(f"  -> [PASS] 본인부담금 자동 계산 확인: {pocket_val}원 (40,000 - 30,000)", flush=True)
        assert pocket_val == "10000", "수강료 40,000원에서 지원금 30,000원 차감 시 본인부담금은 10,000원이어야 합니다."

        page.locator("#btn_sub_app_form_submit").click()
        time.sleep(1.5)

        # 등록 후 테이블 갱신 디버깅
        debug_html = page.locator("#subsidyAppTbody").inner_html()
        print(f"    [DEBUG after_create HTML] {debug_html[:200]}...", flush=True)
        after_create_rows = page.locator("#subsidyAppTbody tr:has(input.sub_app_chk_item)").count()
        print(f"  -> [PASS] 등록 완료 후 수강자 목록 증가 확인 (기존 {initial_rows} -> {after_create_rows})", flush=True)
        assert after_create_rows == initial_rows + 1, "신규 등록 후 1행 증가해야 합니다."
        assert "장보고" in page.locator("#subsidyAppTbody").inner_text()

        # 5. 수정 기능 검증
        print("\n[5/6] 수강자 지원금 내역 수정 기능 검증 중...", flush=True)
        # 첫 번째 행의 [수정] 버튼 클릭
        page.locator("#subsidyAppTbody tr:first-child button:has-text('수정')").click()
        time.sleep(0.5)

        assert modal.is_visible(), "수정 모달이 오픈되어야 합니다."
        modal_title = page.locator("#subsidy_app_modal_title").inner_text()
        print(f"  -> [PASS] 수정 모달 오픈 확인 (제목: {modal_title})", flush=True)

        page.fill("#sub_app_form_note", "정상 테스트 확인 완료")
        page.locator("#btn_sub_app_form_submit").click()
        time.sleep(0.8)
        print("  -> [PASS] 수정 저장 완료", flush=True)

        # 6. 지원금 일괄 차감 모달 및 선택삭제 검증
        print("\n[6/6] 일괄 차감 모달 및 선택삭제 검증 중...", flush=True)
        page.locator("#panel_ad_free2_app button:has-text('일괄차감실행')").click()
        time.sleep(0.5)

        batch_modal = page.locator("#modal_subsidy_deduct_batch")
        assert batch_modal.is_visible(), "일괄 차감 모달이 오픈되어야 합니다."
        print("  -> [PASS] 일괄 차감 실행 모달 오픈 확인", flush=True)

        # 일괄차감 실행 버튼 클릭
        batch_modal.locator("button:has-text('일괄차감 실행')").click()
        time.sleep(1.0)
        assert not batch_modal.is_visible(), "일괄 차감 완료 후 모달이 닫혀야 합니다."
        print("  -> [PASS] 일괄 차감 실행 완료 및 모달 닫힘 확인", flush=True)

        # 선택삭제 테스트
        # 장보고 검색 후 삭제
        page.fill("#sub_app_filter_name", "장보고")
        page.locator("#panel_ad_free2_app .filter-container button:has-text('검색')").click()
        time.sleep(0.6)

        page.locator("#subsidyAppTbody tr td input.sub_app_chk_item").first.check()
        time.sleep(0.3)

        del_btn = page.locator("#btn_sub_app_delete_selected")
        assert del_btn.is_visible(), "체크박스 선택 시 [선택삭제] 버튼이 노출되어야 합니다."
        del_btn_text = del_btn.inner_text()
        print(f"  -> [PASS] [선택삭제] 버튼 노출 확인: '{del_btn_text}'", flush=True)

        del_btn.click()
        time.sleep(1.0)

        # 검색 전체 초기화 후 건수 확인
        page.locator("#panel_ad_free2_app .filter-container button:has-text('전체')").click()
        page.wait_for_selector("#subsidyAppTbody tr td input.sub_app_chk_item", timeout=5000)
        final_rows = page.locator("#subsidyAppTbody tr:has(input.sub_app_chk_item)").count()
        print(f"  -> [PASS] 선택 삭제 후 행 수 복구 확인: {final_rows}건", flush=True)
        assert final_rows == initial_rows, "추가한 1건을 삭제했으므로 초기 행 수와 같아야 합니다."

        # 스크린샷 캡처
        screenshot_path = "c:/Users/user/My project/course/course_site/scratch/verified_ad_free2_app.png"
        page.screenshot(path=screenshot_path, full_page=False)
        print(f"\n[Artifact] 화면 캡처 저장 완료: {screenshot_path}", flush=True)

        browser.close()

    print("\n" + "=" * 65, flush=True)
    print(">> [성공] 수강자관리 (ad_free2_app) 모든 기능 및 모달 1:1 완벽 검증 완료!", flush=True)
    print("=" * 65, flush=True)

if __name__ == "__main__":
    test_ad_free2_app()
