import sys
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def run_comprehensive_ad_ref_test():
    passed = 0
    total = 0

    def test_assert(condition, desc):
        nonlocal passed, total
        total += 1
        if condition:
            passed += 1
            print(f"  [PASS] {desc}", flush=True)
        else:
            print(f"  [FAIL] {desc}", flush=True)

    def is_centered(box, viewport):
        if not box:
            return False
        mid_x = box["x"] + box["width"] / 2
        mid_y = box["y"] + box["height"] / 2
        vp_mid_x = viewport["width"] / 2
        vp_mid_y = viewport["height"] / 2
        x_diff = abs(mid_x - vp_mid_x)
        y_diff = abs(mid_y - vp_mid_y)
        return x_diff < 50 and y_diff < 50

    print("=== [환불/취소관리 1:1 완벽 모방 종합 심층 하네스 검증] ===", flush=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        vp = {"width": 1920, "height": 950}
        context = browser.new_context(viewport=vp, accept_downloads=True)
        page = context.new_page()
        page.on("dialog", lambda dialog: dialog.accept())

        try:
            # 1. 환불/취소관리 메인 URL 접속
            page.goto("http://localhost:3005/af/ad_ref/lists/sn/3267", timeout=15000)
            page.wait_for_timeout(1000)

            # 2. 사이드바 및 환불/취소관리 패널 활성화 검증
            sidebar = page.locator("#left_menu")
            test_assert(sidebar.is_visible(), "1. 좌측 사이드바(#left_menu) 100% 유지 확인")

            ref_panel = page.locator("#panel_ad_ref_lists")
            test_assert(ref_panel.is_visible(), "2. 환불/취소관리 패널(#panel_ad_ref_lists) 활성화 확인")

            # 3. 타이틀 영역 및 상단 강좌관리 바로가기
            title_el = ref_panel.locator("#contents_title")
            test_assert("환불/취소관리" in title_el.inner_text(), "3. 상단 1:1 타이틀 '환불/취소관리' 노출 확인")

            to_lec_btn = title_el.locator("a[href*='/af/ad_lec/lists']")
            test_assert(to_lec_btn.is_visible(), "4. 상단 '강좌관리' 바로가기 버튼 정상 노출 확인")

            # 4. 강좌관리 버튼 클릭 -> 새로고침 없이 패널 전환 및 사이드바 유지 검증
            to_lec_btn.click()
            page.wait_for_timeout(500)
            test_assert(page.locator("#panel_ad_lec_lists").is_visible(), "5. [강좌관리] 클릭 시 SPA 패널 정상 전환 확인")
            test_assert(sidebar.is_visible(), "6. [강좌관리] 전환 후에도 사이드바 100% 유지 확인")

            # 사이드바에서 환불/취소관리 다시 클릭
            page.locator("#left_menu a[href*='/af/ad_ref/lists']").first.click()
            page.wait_for_timeout(500)
            test_assert(ref_panel.is_visible(), "7. 사이드바 [환불/취소관리] 클릭 시 패널 복귀 확인")

            # 5. [신청자목록] 및 [대기자목록] 바로가기 버튼 검증
            to_app_btn = ref_panel.locator("a:has-text('신청자목록')")
            test_assert(to_app_btn.is_visible(), "8. [신청자목록] 바로가기 버튼 노출 확인")
            to_wait_btn = ref_panel.locator("a:has-text('대기자목록')")
            test_assert(to_wait_btn.is_visible(), "9. [대기자목록] 바로가기 버튼 노출 확인")

            # 6. 상단 액션 버튼 30px 높이 일관화 및 수평 1열 정렬 검증
            action_btns = ["#btn_ref_sin", "#btn_ref_batch", "#btn_ref_excel"]
            boxes = [page.locator(b).bounding_box() for b in action_btns]
            y_aligned = len(set(round(b["y"], 1) for b in boxes)) == 1
            h_unified = all(round(b["height"]) == 30 for b in boxes)
            test_assert(y_aligned and h_unified, "10. 액션 버튼(환불/취소등록, 일괄등록, 엑셀출력) 30px 높이 일관화 및 수평 1열 정렬 확인")

            # 7. 검색 필터 동작 검증
            page.wait_for_selector(".ref-checkbox", timeout=8000)
            init_count = ref_panel.locator("#refundTbody tr").count()
            page.fill("#ref_search_word", "손희안")
            page.click("#fm_list_search_ref input[type='submit']")
            page.wait_for_timeout(500)
            filtered_count = ref_panel.locator("#refundTbody tr").count()
            test_assert(0 < filtered_count < init_count, f"11. 검색어 '손희안' 필터링 정상 동작 (전체 {init_count}건 -> 검색 {filtered_count}건)")

            # [전체] 버튼 클릭하여 리셋
            page.click("#fm_list_search_ref input[value='전체']")
            page.wait_for_timeout(500)
            reset_count = ref_panel.locator("#refundTbody tr").count()
            test_assert(reset_count == init_count, f"12. [전체] 버튼 클릭 시 검색 필터 초기화 확인 ({reset_count}건 복원)")

            # 8. [환불/취소등록] 모달 오픈, 정중앙 배치, 계산기 동작 및 등록 기능 검증
            page.click("#btn_ref_sin")
            page.wait_for_timeout(400)
            sin_modal = page.locator("#refundSinModal")
            test_assert(sin_modal.is_visible(), "13. '환불/취소등록' 모달(#refundSinModal) 노출 확인")
            sin_box = sin_modal.locator(".modal-box").bounding_box()
            test_assert(is_centered(sin_box, vp), "14. '환불/취소등록' 모달 화면 정중앙(Dead-Center) 배치 확인")

            # 샘플학생 불러오기 클릭
            page.click("#btn_refund_sample_student")
            page.wait_for_timeout(200)
            s_name = page.locator("#ref_sin_studentName").input_value()
            test_assert(bool(s_name), f"15. 샘플학생 자동 채우기 확인 (학생명: {s_name})")

            # 계산기 실시간 반영 검증: 수강한 시수를 0으로 변경 -> 100% 전액 반환으로 변경되는지 확인
            page.fill("#ref_sin_attendedDays", "0")
            page.locator("#ref_sin_attendedDays").dispatch_event("input")
            page.wait_for_timeout(200)
            fee_val = page.locator("#ref_sin_fee").input_value()
            refund_val = page.locator("#ref_sin_tuitionRefund").input_value()
            test_assert(fee_val == refund_val, f"16. 수강 0시수 입력 시 개강 전 100% 환불 산출 확인 (원금 {fee_val}원 == 환불 {refund_val}원)")

            # 등록 제출
            page.click("#btn_ref_sin_submit")
            page.wait_for_timeout(1000)
            test_assert(not sin_modal.is_visible(), "17. 환불/취소등록 완료 후 모달 닫힘 확인")
            new_count = ref_panel.locator("#refundTbody tr").count()
            test_assert(new_count == init_count + 1, f"18. 등록 후 테이블 행 1건 증가 확인 ({init_count} -> {new_count}건)")

            # 9. [환불/취소일괄등록] 모달 오픈, 정중앙 배치, CSV 템플릿 다운로드 및 파싱/일괄저장 검증
            page.click("#btn_ref_batch")
            page.wait_for_timeout(400)
            batch_modal = page.locator("#refundBatchModal")
            test_assert(batch_modal.is_visible(), "19. '환불/취소일괄등록' 모달(#refundBatchModal) 노출 확인")
            batch_box = batch_modal.locator(".modal-box").bounding_box()
            test_assert(is_centered(batch_box, vp), "20. '환불/취소일괄등록' 모달 화면 정중앙 배치 확인")

            # CSV 샘플 템플릿 다운로드 검증
            with page.expect_download(timeout=5000) as tpl_dl:
                page.click("#refundBatchModal a[download]")
            tpl_file = tpl_dl.value
            test_assert("csv" in tpl_file.suggested_filename, f"21. 일괄등록 CSV 템플릿 다운로드 정상 확인 ({tpl_file.suggested_filename})")

            # 샘플 데이터 채우기 및 파싱 미리보기 검증
            page.click("#btn_refund_batch_sample")
            page.wait_for_timeout(300)
            test_assert(page.locator("#ref_batch_preview_box").is_visible(), "22. 샘플 데이터 3건 파싱 미리보기 렌더링 확인")

            # 일괄 등록 저장
            before_batch = ref_panel.locator("#refundTbody tr").count()
            page.click("#btn_ref_batch_submit")
            page.wait_for_timeout(1200)
            test_assert(not batch_modal.is_visible(), "23. 일괄등록 완료 후 모달 닫힘 확인")
            after_batch = ref_panel.locator("#refundTbody tr").count()
            test_assert(after_batch == before_batch + 3, f"24. 3건 일괄등록 후 목록 반영 확인 ({before_batch} -> {after_batch}건)")

            # 10. 신청상태 클릭 토글 변경 검증 (접수 -> 강사확인 -> 처리완료)
            first_badge = ref_panel.locator("#refundTbody tr td span.badge").first
            initial_text = first_badge.inner_text().strip()
            first_badge.click()
            page.wait_for_timeout(600)
            new_badge = ref_panel.locator("#refundTbody tr td span.badge").first
            new_text = new_badge.inner_text().strip()
            test_assert(initial_text != new_text, f"25. 신청상태 1-클릭 토글 변경 확인 ('{initial_text}' -> '{new_text}')")

            # 11. 엑셀 출력 다운로드 검증
            with page.expect_download(timeout=8000) as dl_info:
                page.click("#btn_ref_excel")
            dl_file = dl_info.value
            test_assert("csv" in dl_file.suggested_filename, f"26. 환불/취소 결과 엑셀(CSV) 출력 다운로드 확인 ({dl_file.suggested_filename})")

            # 12. 개별 행 [삭제] 아이콘 클릭 -> 삭제 검증
            before_del = ref_panel.locator("#refundTbody tr").count()
            del_icon = ref_panel.locator("#refundTbody tr td i.fa-trash-o").first
            del_icon.click()
            page.wait_for_timeout(1000)
            after_del = ref_panel.locator("#refundTbody tr").count()
            test_assert(after_del == before_del - 1, f"27. 개별 [삭제] 아이콘 클릭 시 환불 내역 삭제 확인 ({before_del} -> {after_del}건)")

            # 13. URL 직접 접근 라우팅 매핑 검증
            # 13-1. /af/ad_ref/write 직접 접근 시 등록 모달 자동 팝업
            page.goto("http://localhost:3005/af/ad_ref/write/sn/3267", timeout=15000)
            page.wait_for_timeout(800)
            test_assert(page.locator("#refundSinModal").is_visible(), "28. URL '/af/ad_ref/write' 직접 접속 시 등록 모달 자동 팝업 확인")
            page.click("#refundSinModal .close-btn")
            page.wait_for_timeout(300)

            # 13-2. /af/ad_ref/batch-upload 직접 접근 시 일괄등록 모달 자동 팝업
            page.goto("http://localhost:3005/af/ad_ref/batch-upload/sn/3267", timeout=15000)
            page.wait_for_timeout(800)
            test_assert(page.locator("#refundBatchModal").is_visible(), "29. URL '/af/ad_ref/batch-upload' 직접 접속 시 일괄등록 모달 자동 팝업 확인")
            page.click("#refundBatchModal .close-btn")
            page.wait_for_timeout(300)

            # 스크린샷 캡처
            page.screenshot(path="scratch/verified_ad_ref_full.png")
            print("  [INFO] 최종 검증 스크린샷 저장 완료: scratch/verified_ad_ref_full.png", flush=True)

        except Exception as e:
            print(f"  [ERROR] 테스트 도중 예외 발생: {e}", flush=True)
            page.screenshot(path="scratch/test_error_ad_ref.png")
        finally:
            browser.close()

    print(f"\n=== [검증 결과 요약: {passed} / {total} 항목 통과 ({passed/total*100:.1f}%)] ===", flush=True)
    return passed == total

if __name__ == '__main__':
    success = run_comprehensive_ad_ref_test()
    sys.exit(0 if success else 1)
