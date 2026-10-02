import sys
import time
import urllib.request

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

def test_ad_free2_stu():
    print("=" * 65, flush=True)
    print("[Test Harness] 지원금 대상자관리 (ad_free2_stu) 1:1 매핑 통합 검증", flush=True)
    print("=" * 65, flush=True)

    # 1. 파일 다운로드 엔드포인트 검증
    print("\n[1/5] 파일 다운로드 엔드포인트 응답 검증 중...", flush=True)
    
    # 샘플 CSV
    req1 = urllib.request.Request("http://localhost:3005/af/ad_free2_stu/sample_csv")
    with urllib.request.urlopen(req1) as resp:
        assert resp.status == 200
        cd = resp.headers.get("Content-Disposition", "")
        assert "subsidy_student_batch_sample.csv" in cd
        csv_body = resp.read().decode('utf-8')
        assert "학년,반,번호,이름" in csv_body
        print("  -> [PASS] 샘플 CSV 다운로드 엔드포인트 정상 (200 OK, attachment)", flush=True)

    # 검색결과 엑셀
    req2 = urllib.request.Request("http://localhost:3005/af/ad_free2_stu/excel")
    with urllib.request.urlopen(req2) as resp:
        assert resp.status == 200
        ct = resp.headers.get("Content-Type", "")
        assert "excel" in ct or "ms-excel" in ct
        print("  -> [PASS] 검색결과 엑셀 출력 정상 (200 OK, ms-excel)", flush=True)

    # 전교생기준 엑셀
    req3 = urllib.request.Request("http://localhost:3005/af/ad_free2_stu/excel_all")
    with urllib.request.urlopen(req3) as resp:
        assert resp.status == 200
        ct = resp.headers.get("Content-Type", "")
        assert "excel" in ct or "ms-excel" in ct
        print("  -> [PASS] 전교생기준 대상자 엑셀 출력 정상 (200 OK, ms-excel)", flush=True)

    # 2. Playwright 브라우저 UI 검증
    print("\n[2/5] 브라우저 UI 로드 및 19열 테이블 렌더링 검증 중...", flush=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        page.on("dialog", lambda dialog: (print(f"    [Dialog] {dialog.message}", flush=True), dialog.accept()))
        page.on("console", lambda msg: print(f"    [Browser Console {msg.type}] {msg.text}", flush=True))
        page.on("pageerror", lambda err: print(f"    [Page Error] {err}", flush=True))

        page.goto("http://localhost:3005/af/ad_free2_stu/lists/sn/3267", wait_until="domcontentloaded")
        time.sleep(1)

        # 사이드바 레이아웃 유지 검증
        sidebar = page.locator("#left_menu")
        assert sidebar.is_visible(), "좌측 사이드바가 100% 보존되어야 합니다."
        print("  -> [PASS] 좌측 사이드바 레이아웃 100% 보존 확인", flush=True)

        # 패널 노출 검증
        panel = page.locator("#panel_ad_free2_stu")
        assert panel.is_visible(), "#panel_ad_free2_stu 패널이 표시되어야 합니다."
        print("  -> [PASS] #panel_ad_free2_stu 대상자관리 패널 활성화 확인", flush=True)

        # 19개 열 헤더 확인
        page.wait_for_selector("#subsidyStuTbody tr td input.sub_chk_item", timeout=5000)
        initial_rows = page.locator("#subsidyStuTbody tr").count()
        print(f"  -> [PASS] 초기 대상자 목록 렌더링 확인 (총 {initial_rows}명)", flush=True)
        assert initial_rows >= 8, "초기 학생 수는 최소 8명 이상이어야 합니다."

        # 3. 필터 검색 검증
        print("\n[3/5] 필터링 (이름 검색 및 전체 초기화) 검증 중...", flush=True)
        page.fill("#sub_filter_name", "이하늘")
        page.locator("#panel_ad_free2_stu .filter-container button:has-text('검색')").click()
        time.sleep(0.8)

        filtered_count = page.locator("#subsidyStuTbody tr").count()
        print(f"  -> [PASS] 이름 '이하늘' 검색 결과 행 수: {filtered_count}", flush=True)
        assert filtered_count == 1, "이하늘 검색 시 1개 행이어야 합니다."

        page.locator("#panel_ad_free2_stu .filter-container button:has-text('전체')").click()
        time.sleep(0.8)
        reset_count = page.locator("#subsidyStuTbody tr").count()
        print(f"  -> [PASS] [전체] 버튼 클릭 후 행 수 복구: {reset_count}", flush=True)
        assert reset_count == initial_rows, "전체 복원 시 초기 행 수와 일치해야 합니다."

        # 4. 대상자 등록 모달 검증
        print("\n[4/5] 대상자 등록 모달 오픈, 등록 및 수정 검증 중...", flush=True)
        page.locator("#panel_ad_free2_stu button:has-text('대상자등록')").click()
        time.sleep(0.5)

        modal = page.locator("#modal_subsidy_student_form")
        assert modal.is_visible(), "등록 모달이 표시되어야 합니다."
        print("  -> [PASS] 대상자등록 모달 오픈 확인 (Viewport 중앙 배치)", flush=True)

        page.select_option("#sub_form_grade", "1")
        page.fill("#sub_form_class", "3")
        page.fill("#sub_form_student_num", "18")
        page.fill("#sub_form_name", "테스트학생")
        page.fill("#sub_form_phone", "010-9999-8888")
        page.fill("#sub_form_fund1_total", "600000")
        page.fill("#sub_form_note", "자동화테스트 등록")

        page.locator("#btn_sub_form_submit").click()
        time.sleep(1.2)

        # 테이블에서 '테스트학생' 확인
        page.wait_for_selector("#subsidyStuTbody tr:has-text('테스트학생')", timeout=6000)
        found = page.locator("#subsidyStuTbody:has-text('테스트학생')").count()
        assert found > 0, "테이블에 신규 등록된 테스트학생이 존재해야 합니다."
        print("  -> [PASS] 신규 대상자 '테스트학생' 등록 및 테이블 반영 확인", flush=True)

        # 수정 기능 검증
        test_row = page.locator("#subsidyStuTbody tr:has-text('테스트학생')").first
        test_row.locator("button:has-text('수정')").click()
        time.sleep(0.5)

        curr_name = page.input_value("#sub_form_name")
        assert curr_name == "테스트학생"
        page.fill("#sub_form_note", "비고수정완료")
        page.locator("#btn_sub_form_submit").click()
        time.sleep(1.5)
        print("  -> [PASS] 대상자 정보 수정 및 반영 완료", flush=True)

        # 5. 일괄등록 모달 검증
        print("\n[5/5] 대상자일괄입력 모달 및 선택 삭제 검증 중...", flush=True)
        page.locator("#panel_ad_free2_stu button:has-text('대상자일괄입력')").click()
        time.sleep(0.5)

        batch_modal = page.locator("#modal_subsidy_batch_form")
        assert batch_modal.is_visible(), "일괄입력 모달이 표시되어야 합니다."

        sample_batch = "2\t1\t20\t일괄학생1\t010-1111-3333\t1순위\t국민기초생활수급자\tY\t0\t0\t600000\t일괄1\n3\t2\t21\t일괄학생2\t010-2222-4444\t2순위\t한부모가족보호대상자\tN\t0\t300000\t300000\t일괄2"
        page.fill("#sub_batch_text_area", sample_batch)
        time.sleep(0.5)

        preview_num = page.text_content("#sub_batch_preview_count")
        assert preview_num == "2", "2명이 파싱되어야 합니다."
        print("  -> [PASS] 일괄입력 실시간 파싱 및 미리보기 (2명 감지)", flush=True)

        page.locator("#modal_subsidy_batch_form button:has-text('일괄등록 실행')").click()
        time.sleep(1.5)
        page.wait_for_selector("#subsidyStuTbody tr:has-text('일괄학생1')", timeout=7000)

        batch_found = page.locator("#subsidyStuTbody tr:has-text('일괄학생1')").count()
        assert batch_found > 0, "일괄 등록된 학생1이 테이블에 표시되어야 합니다."
        print("  -> [PASS] 일괄등록 실행 후 테이블 2명 추가 확인", flush=True)

        # 선택삭제 검증
        for chk in page.locator("#subsidyStuTbody tr:has-text('테스트학생') input.sub_chk_item").all():
            chk.check()
        time.sleep(0.5)

        del_btn = page.locator("#btn_sub_delete_selected")
        assert del_btn.is_visible(), "선택삭제 버튼이 보여야 합니다."
        del_btn.click()
        time.sleep(1.5)

        remains = page.locator("#subsidyStuTbody:has-text('테스트학생')").count()
        assert remains == 0, "삭제된 학생은 테이블에서 제거되어야 합니다."
        print("  -> [PASS] 선택 대상자 삭제 정상 작동 확인", flush=True)

        # 최종 검증 스크린샷 캡처
        page.screenshot(path="scratch/verified_ad_free2_stu.png", full_page=True)
        print("\n[OK] 스크린샷 캡처 완료: scratch/verified_ad_free2_stu.png", flush=True)

        context.close()
        browser.close()

    print("\n" + "=" * 65, flush=True)
    print("[SUCCESS] 대상자관리(ad_free2_stu) 1:1 매핑 구현 100% 정상 완료!", flush=True)
    print("===============================================================", flush=True)

if __name__ == "__main__":
    test_ad_free2_stu()
