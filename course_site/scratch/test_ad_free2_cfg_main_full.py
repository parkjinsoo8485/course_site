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
    print(" 2. 지원금설정 (/af/ad_free2_cfg/main/sn/3267) 종합 테스트 시작")
    print("=" * 60)

    # 1. API: 설정 조회
    try:
        r = requests.get(f"{BASE_URL}/api/af/ad_free2_cfg/main")
        assert r.status_code == 200, f"Status {r.status_code}"
        data = r.json()
        assert data.get("success") == True, "success != True"
        assert "configs" in data, "configs missing"
        configs = data["configs"]
        assert "fund_1" in configs and "fund_3" in configs and "fund_free" in configs, "funds missing"
        assert "order" in data, "order missing"
        log("API: /api/af/ad_free2_cfg/main 조회 성공 (3종 지원금 설정 및 차감 순서 반환)", True)
    except Exception as e:
        log(f"API: 지원금 설정 조회 에러: {e}", False)
        all_passed = False

    # 2. API: 설정 저장 (PUT)
    try:
        payload = {
            "fundKey": "fund_1",
            "configData": {
                "name": "1학년 지원금 (하네스테스트)",
                "used": "사용",
                "deductMode": "잔여 금액에서 차감",
                "months": ["3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월", "1월", "2월"],
                "items": {"tuition": True, "noTuitionFee": False, "textbook": True, "material": True},
                "monthlyLimit": 720000,
                "annualLimit": 720000,
                "priority": 2
            }
        }
        r = requests.put(f"{BASE_URL}/api/af/ad_free2_cfg/main", json=payload)
        assert r.status_code == 200
        res = r.json()
        assert res.get("success") == True
        assert res["config"]["name"] == "1학년 지원금 (하네스테스트)"
        log("API: /api/af/ad_free2_cfg/main PUT 저장 성공", True)

        # 복구
        payload["configData"]["name"] = "1학년 지원금"
        requests.put(f"{BASE_URL}/api/af/ad_free2_cfg/main", json=payload)
    except Exception as e:
        log(f"API: 설정 저장 에러: {e}", False)
        all_passed = False

    # 3. API: 차감 순서 변경 (POST)
    try:
        new_order = [
            {"id": "fund_free", "name": "자유수강권", "order": 1},
            {"id": "fund_1", "name": "1학년 지원금", "order": 2},
            {"id": "fund_3", "name": "3학년 지원금", "order": 3}
        ]
        r = requests.post(f"{BASE_URL}/api/af/ad_free2_cfg/order", json={"orderList": new_order})
        assert r.status_code == 200
        res = r.json()
        assert res.get("success") == True
        log("API: /api/af/ad_free2_cfg/order POST 차감순서 저장 성공", True)
    except Exception as e:
        log(f"API: 차감 순서 저장 에러: {e}", False)
        all_passed = False

    # 4. HTML DOM 검증
    try:
        r_page = requests.get(f"{BASE_URL}/af/ad_free2_cfg/main/sn/3267")
        assert r_page.status_code == 200
        html = r_page.text

        # 패널 존재
        assert 'id="panel_ad_free2_cfg_main"' in html, "panel_ad_free2_cfg_main missing"

        # 3개 지원금 탭 버튼 검증
        assert 'id="tab_fund_1"' in html, "tab_fund_1 missing"
        assert 'id="tab_fund_3"' in html, "tab_fund_3 missing"
        assert 'id="tab_fund_free"' in html, "tab_fund_free missing"
        log("DOM: 3개 지원금 탭 버튼 배치 확인", True)

        # 설정 폼 입력요소들 확인
        form_elements = [
            'id="sub_cfg_name"',
            'id="sub_cfg_used_y"',
            'id="sub_cfg_used_n"',
            'id="sub_cfg_mode_rem"',
            'id="sub_cfg_mode_fix"',
            'id="sub_cfg_item_tuition"',
            'id="sub_cfg_item_nofee"',
            'id="sub_cfg_item_textbook"',
            'id="sub_cfg_item_material"',
            'id="sub_cfg_month_limit"',
            'id="sub_cfg_annual_limit"',
            'id="sub_cfg_priority"'
        ]
        for fe in form_elements:
            assert fe in html, f"Form element {fe} missing"
        log("DOM: 지원금 상세 설정 폼 필드 12종 완비 확인", True)

        # 차감순서변경 버튼 및 모달 확인
        assert 'openSubsidyOrderModal()' in html, "openSubsidyOrderModal button missing"
        assert 'id="modal_subsidy_order_change"' in html, "modal_subsidy_order_change missing"

        # 모달 정중앙 스타일 규격 확인
        m_match = re.search(r'<div[^>]*id="modal_subsidy_order_change"[^>]*style="([^"]*)"', html)
        assert m_match, "Modal style not found"
        style = m_match.group(1)
        assert "position: fixed" in style or "position:fixed" in style
        assert "justify-content: center" in style or "justify-content:center" in style
        assert "align-items: center" in style or "align-items:center" in style
        log("DOM: 모달 [#modal_subsidy_order_change] 정중앙 표준 규격 확인", True)

        # 부트스트랩 버튼 표준 스타일 규격 확인 (30px 등)
        assert "height:30px" in html or "height: 30px" in html, "30px button height missing"
        log("DOM: 부트스트랩 버튼 표준 규격 (height:30px) 확인", True)

    except Exception as e:
        log(f"DOM: 지원금설정 페이지 검증 에러: {e}", False)
        all_passed = False

    print("=" * 60)
    if all_passed:
        print("\033[92m>>> 지원금설정 (/af/ad_free2_cfg/main) 100% 매핑 및 테스트 통과! <<<\033[0m")
    else:
        print("\033[91m>>> 지원금설정 테스트 실패 발생! <<<\033[0m")
    print("=" * 60)
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(run_tests())
