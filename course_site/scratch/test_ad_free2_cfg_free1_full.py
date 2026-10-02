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
    print(" 3. 순위구분설정 (/af/ad_free2_cfg/free1/sn/3267) 종합 테스트 시작")
    print("=" * 60)

    # 1. API: 순위 목록 조회
    try:
        r = requests.get(f"{BASE_URL}/api/af/ad_free2_cfg/free1")
        assert r.status_code == 200, f"Status {r.status_code}"
        data = r.json()
        assert data.get("success") == True
        assert "ranks" in data
        assert len(data["ranks"]) > 0
        log(f"API: /api/af/ad_free2_cfg/free1 조회 성공 ({len(data['ranks'])}개 순위 코드 반환)", True)
    except Exception as e:
        log(f"API: 순위 목록 조회 에러: {e}", False)
        all_passed = False

    # 2. API: 신규 순위 등록 (POST), 수정 (PUT), 삭제 (DELETE)
    created_id = None
    try:
        # POST
        create_payload = {
            "rankNumber": 1,
            "name": "하네스테스트용 국민기초생활수급자",
            "limitAmount": 600000,
            "isPriority": True,
            "used": "사용",
            "note": "자동화 테스트용 코드"
        }
        r_post = requests.post(f"{BASE_URL}/api/af/ad_free2_cfg/free1", json=create_payload)
        assert r_post.status_code == 200
        post_res = r_post.json()
        assert post_res.get("success") == True
        created_id = post_res["rank"]["id"]
        log(f"API: 순위 코드 생성 (POST) 성공 (ID: {created_id})", True)

        # PUT
        update_payload = {
            "rankNumber": 1,
            "name": "하네스테스트용 국민기초생활수급자 (수정됨)",
            "limitAmount": 700000,
            "isPriority": True,
            "used": "사용",
            "note": "수정 확인"
        }
        r_put = requests.put(f"{BASE_URL}/api/af/ad_free2_cfg/free1/{created_id}", json=update_payload)
        assert r_put.status_code == 200
        put_res = r_put.json()
        assert put_res.get("success") == True
        assert put_res["rank"]["name"] == "하네스테스트용 국민기초생활수급자 (수정됨)"
        log("API: 순위 코드 수정 (PUT) 성공", True)

        # DELETE
        r_del = requests.delete(f"{BASE_URL}/api/af/ad_free2_cfg/free1/{created_id}")
        assert r_del.status_code == 200
        del_res = r_del.json()
        assert del_res.get("success") == True
        log("API: 순위 코드 삭제 (DELETE) 성공", True)

    except Exception as e:
        log(f"API: 순위 등록/수정/삭제 CRUD 에러: {e}", False)
        all_passed = False

    # 3. HTML DOM 검증
    try:
        r_page = requests.get(f"{BASE_URL}/af/ad_free2_cfg/free1/sn/3267")
        assert r_page.status_code == 200
        html = r_page.text

        # 패널 존재
        assert 'id="panel_ad_free2_cfg_free1"' in html, "panel_ad_free2_cfg_free1 missing"

        # 9열 테이블 컬럼 검증
        cols = ['연번', '순위', '사용여부', '순위 구분 코드명', '지원한도', '우선배정', '순서', '비고', '관리']
        for col in cols:
            assert col in html, f"Table column '{col}' missing"
        log("DOM: 9열 테이블 컬럼 완비 확인", True)

        # 순위 탭 버튼들 검증 (전체, 1순위, 2순위, 3순위, 4순위, 기타)
        tabs = ['tab_rank_all', 'tab_rank_1', 'tab_rank_2', 'tab_rank_3', 'tab_rank_4', 'tab_rank_5']
        for t in tabs:
            assert f'id="{t}"' in html, f"Tab #{t} missing"
        log("DOM: 순위 필터 탭 6종 완비 확인", True)

        # 등록 버튼 및 모달 검증
        assert 'openCreateSubsidyRankModal()' in html, "openCreateSubsidyRankModal button missing"
        assert 'id="modal_subsidy_rank_form"' in html, "modal_subsidy_rank_form missing"

        # 모달 정중앙 스타일 규격 확인
        m_match = re.search(r'<div[^>]*id="modal_subsidy_rank_form"[^>]*style="([^"]*)"', html)
        assert m_match, "Modal style not found"
        style = m_match.group(1)
        assert "position: fixed" in style or "position:fixed" in style
        assert "justify-content: center" in style or "justify-content:center" in style
        assert "align-items: center" in style or "align-items:center" in style
        log("DOM: 모달 [#modal_subsidy_rank_form] 정중앙 표준 규격 확인", True)

    except Exception as e:
        log(f"DOM: 순위구분설정 페이지 검증 에러: {e}", False)
        all_passed = False

    print("=" * 60)
    if all_passed:
        print("\033[92m>>> 순위구분설정 (/af/ad_free2_cfg/free1) 100% 매핑 및 테스트 통과! <<<\033[0m")
    else:
        print("\033[91m>>> 순위구분설정 테스트 실패 발생! <<<\033[0m")
    print("=" * 60)
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(run_tests())
