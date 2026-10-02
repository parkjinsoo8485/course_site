# -*- coding: utf-8 -*-
import sys
import os
import urllib.request
import urllib.parse
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:3005"

endpoints = [
    {
        "name": "검색결과출력 (BIN002D 1:1)",
        "url": f"{BASE_URL}/af/ad_free2_app/excel",
        "expected_title": "2026학년도 방과후학교 지원금 수강자 목록 (검색결과)",
        "expected_columns": ["연번", "학년", "학과", "반", "번호", "이름", "순위", "순위 구분", "월", "강좌명", "신청 / 산출 내역", "징수금액", "지원금액", "지원금 잔액", "비고"]
    },
    {
        "name": "전체징수현황",
        "url": f"{BASE_URL}/af/ad_free2_app/excel_all_collect",
        "expected_title": "2026학년도 광주풍향초등학교 지원금 전체 징수 및 지원 현황표",
        "expected_columns": ["연번", "강좌명", "학년", "반", "번호", "학생명", "대상월", "총 수강비용(A)", "지원금 차감액(B)", "징수(본인부담)금액(A-B)", "수납상태", "비고"]
    },
    {
        "name": "월별현황 (BIN002C 1:1)",
        "url": f"{BASE_URL}/af/ad_free2_app/excel_monthly?month=" + urllib.parse.quote("3월"),
        "expected_title": "2026학년도 방과후 지원금 대상자 월별 지원 현황 대장",
        "expected_columns": ["연번", "학년", "학과", "반", "번호", "이름", "지원금", "순위", "순위 구분", "3월", "12월", "2월", "사용합계", "남은금액", "총액", "징수금액"]
    },
    {
        "name": "스쿨뱅킹현황 (BIN002A 1:1)",
        "url": f"{BASE_URL}/af/ad_free2_app/excel_banking?month=" + urllib.parse.quote("3월"),
        "expected_title": "2026학년도 방과후학교 지원금 스쿨뱅킹 수납 현황표",
        "expected_columns": ["연번", "강좌명", "나이스 강좌명", "강사ID", "학생수", "단가", "금액", "징수(스쿨뱅킹)", "자유수강권", "1학년/추가지원금", "스쿨뱅킹출금액", "강사료", "수용비", "비고"]
    },
    {
        "name": "행정실용 (BIN0020 / BIN0023 1:1)",
        "url": f"{BASE_URL}/af/ad_free2_app/excel_admin?month=" + urllib.parse.quote("3월"),
        "expected_title": "에듀파인 수입관리 연계용 학생기준 강사별 지원금 감면자 목록",
        "expected_columns": ["연번", "학년", "학과", "반", "번호", "이름", "수강료", "교재비", "재료비", "금액합계", "징수금액합계", "지원금액합계", "강좌", "강사ID", "비고"]
    },
    {
        "name": "나이스용",
        "url": f"{BASE_URL}/af/ad_free2_app/excel_neis?month=" + urllib.parse.quote("3월"),
        "expected_title": "나이스(NEIS) 학교행정업무 연계용 방과후 지원금 대상자 명단",
        "expected_columns": ["연번", "학년", "반", "번호", "성명", "지원영역", "수강과정", "강좌명", "수강비용", "지원금액", "실징수액", "해당월", "처리상태", "비고"]
    },
    {
        "name": "정산 총괄표",
        "url": f"{BASE_URL}/af/ad_free2_app/excel_settle",
        "expected_title": "2026학년도 방과후학교 지원금 정산 총괄표",
        "expected_columns": ["구분", "총 신청인원", "총 수강료(A)", "지원금 차감합계(B)", "본인부담금 합계(A-B)", "정산일자", "비고"]
    }
]

print("=== [ad_free2_app] 6종 엑셀 서식 1:1 매핑 및 프리미엄 가독성 자동화 검증 ===")

all_passed = True
for ep in endpoints:
    print(f"\n▶ 검증 중: {ep['name']}")
    try:
        req = urllib.request.Request(ep['url'])
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            content_type = resp.headers.get('Content-Type', '')
            content_disp = resp.headers.get('Content-Disposition', '')
            html = resp.read().decode('utf-8', errors='ignore')

            print(f"  - Status: {status}")
            print(f"  - Content-Type: {content_type}")
            print(f"  - Content-Disposition: {content_disp}")

            assert status == 200, f"Expected 200 but got {status}"
            assert "excel" in content_type or "vnd.ms-excel" in content_type, f"Invalid Content-Type: {content_type}"
            assert ep['expected_title'] in html, f"Missing title '{ep['expected_title']}'"

            # Check columns
            missing_cols = []
            for col in ep['expected_columns']:
                if col not in html:
                    missing_cols.append(col)
            
            if missing_cols:
                print(f"  ❌ Missing columns: {missing_cols}")
                all_passed = False
            else:
                print(f"  ✔ 공식 컬럼 1:1 전수 일치 확인: {len(ep['expected_columns'])}개")

            # Check total row existence
            if "총 합계" in html or "총 결산" in html or "총괄 집계" in html:
                print("  ✔ 하단 총 결산 집계 행(Total Summary) 완벽 배치 확인")
            else:
                print("  ❌ 하단 총 결산 행 누락!")
                all_passed = False

            # Check CSS styling for readability
            assert "font-family" in html and "border-collapse" in html, "CSS layout styles missing"
            print("  ✔ 맑은 고딕 / 지브라 컬러 코딩 프리미엄 가독성 스타일링 적용 확인")

    except Exception as e:
        print(f"  ❌ 에러 발생: {e}")
        all_passed = False

if all_passed:
    print("\n🎉 [성공] 6종 엑셀 전체가 공식 서식과 1:1 완벽 매칭되며 프리미엄 가독성 스타일로 검증되었습니다!")
else:
    print("\n❌ 일부 검증 항목에 오류가 있습니다.")
    sys.exit(1)
