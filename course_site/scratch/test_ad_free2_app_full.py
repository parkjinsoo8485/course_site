import requests
import re
import sys

BASE_URL = "http://localhost:3005"

def log(msg, ok=True):
    status = " PASS " if ok else " FAIL "
    color = "\033[92m" if ok else "\033[91m"
    reset = "\033[0m"
    print(f"[{color}{status}{reset}] {msg}")

def run_tests():
    all_passed = True
    print("=" * 60)
    print(" 1. 수강자관리 (/af/ad_free2_app/lists/sn/3267) 종합 테스트 시작")
    print("=" * 60)

    # 1. API: 목록 조회
    try:
        r = requests.get(f"{BASE_URL}/api/af/ad_free2_app/lists")
        data = r.json()
        assert r.status_code == 200, f"Status {r.status_code}"
        assert data.get("success") == True, "success != True"
        assert "applicants" in data, "applicants not in data"
        assert "summary" in data, "summary not in data"
        summary = data["summary"]
        assert "totalFee" in summary, "totalFee not in summary"
        assert "totalSubsidized" in summary, "totalSubsidized not in summary"
        assert "totalCollected" in summary, "totalCollected not in summary"
        log("API: /api/af/ad_free2_app/lists 조회 및 통계 반환 확인", True)
    except Exception as e:
        log(f"API: /api/af/ad_free2_app/lists 에러: {e}", False)
        all_passed = False

    # 2. API: 허용 월 GET & POST
    try:
        r_get = requests.get(f"{BASE_URL}/api/af/ad_free2_app/allowed_months")
        assert r_get.status_code == 200
        get_data = r_get.json()
        assert get_data.get("success") == True
        assert isinstance(get_data.get("allowedMonths"), list)

        months_payload = ["3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월"]
        r_post = requests.post(f"{BASE_URL}/api/af/ad_free2_app/allowed_months", json={"allowedMonths": months_payload})
        assert r_post.status_code == 200
        post_data = r_post.json()
        assert post_data.get("success") == True
        assert post_data.get("allowedMonths") == months_payload
        log("API: /api/af/ad_free2_app/allowed_months (GET & POST) 확인", True)
    except Exception as e:
        log(f"API: 허용 월 에러: {e}", False)
        all_passed = False

    # 3. API: 수강자 검색 팝업
    try:
        r = requests.get(f"{BASE_URL}/api/af/ad_free2_app/applicant_search?name=김")
        assert r.status_code == 200
        search_data = r.json()
        assert search_data.get("success") == True
        assert "applicants" in search_data
        log("API: /api/af/ad_free2_app/applicant_search 학생검색 확인", True)
    except Exception as e:
        log(f"API: 학생검색 에러: {e}", False)
        all_passed = False

    # 4. API: 엑셀 다운로드 6종 검증
    excel_endpoints = [
        ("/af/ad_free2_app/excel", "검색결과출력 (BIN002D)"),
        ("/af/ad_free2_app/excel_all_collect", "전체징수현황출력"),
        ("/af/ad_free2_app/excel_monthly?month=3월", "월별현황출력 (BIN002C)"),
        ("/af/ad_free2_app/excel_banking?month=3월", "스쿨뱅킹현황출력 (BIN002A)"),
        ("/af/ad_free2_app/excel_admin?month=3월", "행정실용출력 (BIN0023)"),
        ("/af/ad_free2_app/excel_neis?month=3월", "나이스용출력")
    ]
    for ep, desc in excel_endpoints:
        try:
            r = requests.get(f"{BASE_URL}{ep}")
            assert r.status_code == 200, f"Status {r.status_code}"
            assert len(r.content) > 100, "Content too short"
            ct = r.headers.get("content-type", "")
            cd = r.headers.get("content-disposition", "")
            assert "spreadsheet" in ct or "excel" in ct or "octet-stream" in ct or "attachment" in cd, f"Unexpected headers: {ct}, {cd}"
            log(f"EXCEL: {desc} ({ep}) 다운로드 확인 (크기: {len(r.content)} bytes)", True)
        except Exception as e:
            log(f"EXCEL: {desc} 에러: {e}", False)
            all_passed = False

    # 5. HTML DOM 검증
    try:
        r_page = requests.get(f"{BASE_URL}/af/ad_free2_app/lists/sn/3267")
        assert r_page.status_code == 200
        html = r_page.text

        # 패널 존재
        assert 'id="panel_ad_free2_app"' in html, "panel_ad_free2_app missing"
        # 18열 테이블 헤더 검증
        assert 'sub_app_chk_all' in html, "sub_app_chk_all missing"
        assert '수강료' in html and '강사료' in html and '수용비' in html and '교재비' in html and '재료비' in html, "18열 수수료 컬럼 missing"
        assert '징수금액' in html and '지원금액' in html, "징수금액/지원금액 컬럼 missing"

        # 공식 부트스트랩 버튼군 존재 검증
        btn_targets = [
            ("지원금 내역 조회 허용", "btn-warning"),
            ("수강자 등록", "btn-primary"),
            ("수강자 가져오기", "btn-primary"),
            ("검색결과 출력", "btn-success"),
            ("전체징수현황", "btn-success"),
            ("월별현황", "btn-primary"),
            ("스쿨뱅킹용", "btn-primary"),
            ("행정실용", "btn-primary"),
            ("나이스용", "btn-primary"),
            ("삭제", "btn-danger")
        ]
        for name, cls in btn_targets:
            assert name in html, f"Button '{name}' missing"
            log(f"DOM: 공식 부트스트랩 버튼 [{name}] 배치 확인", True)

        # 8대 모달 존재 및 정중앙 CSS 표준 검증
        modals = [
            ("modal_sub_app_allow_months", "지원금 조회 허용 월 설정"),
            ("modal_sub_app_register", "수강자 등록"),
            ("modal_sub_app_search_student", "수강자 검색 팝업"),
            ("modal_sub_app_import", "수강자 가져오기"),
            ("modal_sub_app_monthly_status", "월별 지원금 정산"),
            ("modal_sub_app_schoolbanking", "스쿨뱅킹 파일 출력"),
            ("modal_sub_app_admin_office", "행정실용 파일 출력"),
            ("modal_sub_app_neis", "나이스용 파일 출력"),
            ("modal_sub_app_edit_row", "단건 수강료/지원금 수정")
        ]
        for mid, mtitle in modals:
            assert f'id="{mid}"' in html, f"Modal #{mid} missing"
            # 정중앙 CSS 확인
            m_match = re.search(rf'<div[^>]*id="{mid}"[^>]*style="([^"]*)"', html)
            assert m_match, f"Modal #{mid} style not found"
            style = m_match.group(1)
            assert "position: fixed" in style or "position:fixed" in style, f"#{mid} missing position: fixed"
            assert "justify-content: center" in style or "justify-content:center" in style, f"#{mid} missing justify-content: center"
            assert "align-items: center" in style or "align-items:center" in style, f"#{mid} missing align-items: center"
            log(f"DOM: 모달 [#{mid}] ({mtitle}) 정중앙 표준 규격 확인", True)

    except Exception as e:
        log(f"DOM: 수강자관리 페이지 검증 에러: {e}", False)
        all_passed = False

    print("=" * 60)
    if all_passed:
        print("\033[92m>>> 수강자관리 (/af/ad_free2_app) 100% 매핑 및 테스트 통과! <<<\033[0m")
    else:
        print("\033[91m>>> 수강자관리 테스트 실패 발생! <<<\033[0m")
    print("=" * 60)
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(run_tests())
