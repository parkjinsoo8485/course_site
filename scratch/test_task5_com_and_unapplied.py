import os
from playwright.sync_api import sync_playwright

def run():
    print("=== [Task 5 하네스 검증] 추가/취소자조회 및 미신청자목록 1:1 모달 실기능 점검 ===")
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
            page.on("dialog", lambda dialog: (print(f"    [Dialog]: {dialog.message}"), dialog.accept()))

            # 1. 페이지 접속 및 레이아웃 무결성 확인
            page.goto("http://localhost:3005/af/ad_app/lists/sn/3267")
            page.wait_for_load_state("networkidle")
            test_assert(page.locator("#left_menu").is_visible(), "1. 신청자관리 페이지 접속 및 좌측 사이드바(#left_menu) 100% 정상 유지")

            # 2. 추가기능/작업 버튼군 노출 확인 (데스크탑은 기본 inline 표시, 모바일은 토글)
            app_drop = page.locator("#panel_ad_app_lists #main_control_box_drop")
            if not app_drop.is_visible():
                page.evaluate("toggleExtraMenu();")
                page.wait_for_timeout(300)
            test_assert(app_drop.is_visible(), "2. 주요 액션 버튼군(#panel_ad_app_lists #main_control_box_drop) 정상 노출 확인")

            # 3. '추가/취소자조회' 모달 검증
            page.evaluate("openAppComModal();")
            page.wait_for_timeout(400)
            com_modal = page.locator("#modalAppCom")
            test_assert(com_modal.is_visible(), "3-1. '추가/취소자조회' 모달 정상 팝업")

            # 검색 조건 라디오 버튼 확인
            r2 = page.locator("#com_gubun_2")
            r1 = page.locator("#com_gubun_1")
            test_assert(r2.is_checked(), "3-2. 검색 조건 기본값 '수강생 추가일자 & 최종수강일 기준' 체크 확인")

            # 현재/이전 강좌 비교 라디오 클릭 시 이전 강좌 행 노출 토글 확인
            page.evaluate("document.getElementById('com_gubun_1').click();")
            page.wait_for_timeout(200)
            tr_sld2 = page.locator("#tr_sld2")
            test_assert(tr_sld2.is_visible(), "3-3. '현재/이전 강좌 비교' 선택 시 이전 강좌(#tr_sld2) 행 노출 확인")

            # 다시 2번 라디오 클릭 시 이전 강좌 행 숨김 확인
            page.evaluate("document.getElementById('com_gubun_2').click();")
            page.wait_for_timeout(200)
            test_assert(not tr_sld2.is_visible(), "3-4. '추가일자 기준' 선택 시 이전 강좌(#tr_sld2) 행 자동 숨김 확인")

            # 강좌 select 옵션 개수 확인
            cur_course_options = page.locator("#com_sln option").count()
            test_assert(cur_course_options > 1, f"3-5. 현재 강좌 목록 드롭다운에 강좌 정상 로드 확인 ({cur_course_options}개)")

            # 엑셀 다운로드 테스트
            with page.expect_download(timeout=6000) as download_info:
                page.evaluate("submitAppComExcelExport(new Event('submit'));")
            download = download_info.value
            dl_name = download.suggested_filename
            test_assert("추가취소자" in dl_name or ".csv" in dl_name, f"3-6. 추가/취소자 엑셀(CSV) 파일 다운로드 응답 확인: {dl_name}")

            # 모달 닫기
            page.evaluate("closeAppModal('modalAppCom');")
            page.wait_for_timeout(300)

            # 4. '미신청자목록' 모달 검증
            page.evaluate("openAppUnappliedModal();")
            page.wait_for_timeout(500)
            unapplied_modal = page.locator("#modalAppUnapplied")
            test_assert(unapplied_modal.is_visible(), "4-1. '미신청자 목록' 모달 정상 팝업")

            # 툴바 셀렉트 요소 확인
            test_assert(page.locator("#unapplied_ssc").is_visible(), "4-2. 신청개수 셀렉트(#unapplied_ssc) 툴바 요소 확인")
            test_assert(page.locator("#unapplied_sgr").is_visible(), "4-3. 학년 셀렉트(#unapplied_sgr) 툴바 요소 확인")

            # 테이블 데이터 로드 확인
            rows_count = page.locator("#unappliedTableBody tr").count()
            test_assert(rows_count > 0, f"4-4. 미신청자 목록 테이블 행 정상 로드 확인 ({rows_count}명)")

            # 학년 필터 테스트
            page.evaluate("document.getElementById('unapplied_sgr').value = '1'; loadUnappliedList();")
            page.wait_for_timeout(500)
            grade1_count = page.locator("#unappliedTableBody tr").count()
            test_assert(grade1_count > 0, f"4-5. 1학년 필터링 검색 결과 확인 ({grade1_count}명)")

            # 미신청자 엑셀 다운로드 테스트
            with page.expect_download(timeout=6000) as download_info:
                page.evaluate("exportUnappliedExcel();")
            dl_unapplied = download_info.value
            dl_u_name = dl_unapplied.suggested_filename
            test_assert("미신청자" in dl_u_name or ".csv" in dl_u_name, f"4-6. 미신청자 목록 엑셀(CSV) 파일 다운로드 확인: {dl_u_name}")

            page.evaluate("closeAppModal('modalAppUnapplied');")
            page.wait_for_timeout(300)

            # 5. Deep Link 직접 접속 테스트
            page.goto("http://localhost:3005/af/ad_app/com/sn/3267")
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(500)
            test_assert(page.locator("#modalAppCom").is_visible(), "5-1. URL 직접 접근 (/af/ad_app/com/sn/3267) 시 추가/취소자 모달 자동 오픈 확인")

            page.goto("http://localhost:3005/af/ad_app/list1/sn/3267")
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(500)
            test_assert(page.locator("#modalAppUnapplied").is_visible(), "5-2. URL 직접 접근 (/af/ad_app/list1/sn/3267) 시 미신청자 목록 모달 자동 오픈 확인")

        except Exception as e:
            print(f"  [ERROR] {e}")
            import traceback
            traceback.print_exc()
        finally:
            browser.close()

        print(f"\n총 {total}개 검증 중 {passed}개 통과 (통과율: {passed/total*100:.1f}%)")

if __name__ == "__main__":
    run()
