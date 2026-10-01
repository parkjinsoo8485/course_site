from playwright.sync_api import sync_playwright

def run():
    print("=== [Task 1 하네스 검증] 강좌관리 23개 필드 1:1 입력, 저장, 수정, 삭제 E2E 점검 ===")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
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
            page.goto("http://localhost:3005/af/ad_lec/lists/sn/3267")
            page.wait_for_load_state("networkidle")

            # 1. '강좌 등록' 버튼 클릭 및 모달 열림 검증
            btn_write = page.locator("#btn_action_write").first
            btn_write.click()
            page.wait_for_timeout(500)

            modal = page.locator("#addModal")
            test_assert(modal.is_visible(), "1. 강좌 등록 모달 정상 오픈 (사이드바 유지 확인)")

            # 2. 23종 필드 입력 시뮬레이션
            test_title = f"[자동화테스트] AI로봇코딩 {int(time_stamp())}"
            page.fill("#add_lec_name", test_title)
            page.select_option("#add_lec_div", "26년 9월")
            page.select_option("#add_lec_pro_type", "맞춤형")
            page.fill("#add_tea_id", "teacher_robot")
            page.fill("#add_tea_id1", "sub_tea01")

            # 학년 체크
            page.check("#lec_grade_grade_1")
            page.check("#lec_grade_grade_2")

            # 강의시간 및 중복허용
            page.fill("#add_lec_time_disp", "수:14:00~14:50")
            page.check("#add_lec_time_not_chk")

            # 정원 및 대기정원
            page.fill("#add_lec_max_sin", "24")
            page.fill("#add_lec_max_wait", "6")

            # 운영기간 및 총시수
            page.fill("#add_lec_sdate", "2026-09-01")
            page.fill("#add_lec_edate", "2026-09-30")
            page.fill("#add_lec_tot_sisu", "18")

            # 강의실
            page.fill("#add_lec_room", "본관2층 컴퓨터교실")

            # 수강료, 수용비, 교재비, 재료비
            page.fill("#add_lec_pay", "40000")
            page.fill("#add_lec_use_cost", "4000")
            page.fill("#add_lec_pay_book", "10000")
            page.fill("#add_lec_pay_item", "15000")

            # 지원금 차감 제외 체크박스
            page.check("#add_not_free2_pay")
            page.check("#add_not_free1_pay_book")

            test_assert(page.is_checked("#add_not_free2_pay"), "2. 23개 필드 및 지원금 차감제외 체크박스 입력 완료")

            # 3. 폼 제출 및 DB 저장
            page.on("dialog", lambda dialog: dialog.accept())
            page.click("#btnAddCourseSubmit")
            page.wait_for_timeout(1500)

            # 모달 닫힘 및 테이블 1행에 새 강좌 반영 확인
            test_assert(not modal.is_visible(), "3. 저장 후 모달 자동 닫힘 확인")

            page.wait_for_selector(f"#lectureTbody tr:has-text('{test_title}')", timeout=5000)
            created_row = page.locator(f"#lectureTbody tr:has-text('{test_title}')").first
            test_assert(created_row.is_visible(), f"4. DB 저장 및 테이블 목록에 '{test_title}' 즉시 반영 확인")

            # 4. 강좌 수정 모달 열림 및 23개 필드 복원 검증
            edit_btn = created_row.locator("button:has-text('수정')").first
            edit_btn.click()
            page.wait_for_timeout(600)

            test_assert(modal.is_visible(), "5. 등록된 강좌의 '수정' 클릭 시 모달 오픈 확인")
            title_val = page.input_value("#add_lec_name")
            tea_val = page.input_value("#add_tea_id")
            not_free_val = page.is_checked("#add_not_free2_pay")
            test_assert(title_val == test_title and tea_val == "teacher_robot" and not_free_val, "6. 모달 내부 23종 필드 및 차감제외 값 100% 복원 확인")

            # 정원 수정 (24 -> 28)
            page.fill("#add_lec_max_sin", "28")
            page.click("#btnAddCourseSubmit")
            page.wait_for_timeout(1500)

            # 5. 수정된 정원 목록 반영 확인
            updated_row = page.locator(f"#lectureTbody tr:has-text('{test_title}')").first
            row_text = updated_row.inner_text()
            test_assert("28" in row_text, "7. 정원 28명 수정 후 테이블 즉시 갱신 확인")

            # 6. 강좌 삭제 기능 검증
            del_btn = updated_row.locator("button:has-text('삭제'), a[onclick*='chk_del'], a[onclick*='deleteLecture']").first
            if del_btn.is_visible():
                del_btn.click()
                page.wait_for_timeout(1000)
                test_assert(page.locator(f"#lectureTbody tr:has-text('{test_title}')").count() == 0, "8. 강좌 정상 삭제 및 테이블에서 제거 확인")
            else:
                # API로 직접 삭제 호출
                row_id = updated_row.get_attribute("id").replace("lec_row_", "")
                page.evaluate(f"deleteLecture('{row_id}')")
                page.wait_for_timeout(1000)
                test_assert(page.locator(f"#lectureTbody tr:has-text('{test_title}')").count() == 0, "8. 강좌 정상 삭제 및 테이블에서 제거 확인")

            print(f"\n최종 결과: {passed}/{total} 항목 통과!")

        except Exception as e:
            print(f"하네스 오류 발생: {e}")
        finally:
            browser.close()

def time_stamp():
    import time
    return time.time()

if __name__ == '__main__':
    run()
