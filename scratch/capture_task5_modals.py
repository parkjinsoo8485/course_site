import os
from playwright.sync_api import sync_playwright

def capture():
    artifact_dir = "C:/Users/user/.gemini/antigravity-ide/brain/fc28e79f-b539-4b51-9981-3311fd3883a5"
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        page = b.new_page(viewport={"width": 1920, "height": 911})
        page.goto("http://localhost:3005/af/ad_app/lists/sn/3267")
        page.wait_for_load_state("networkidle")

        # 1. 추가/취소자조회
        page.evaluate("openAppComModal()")
        page.wait_for_timeout(500)
        page.screenshot(path=os.path.join(artifact_dir, "modal_07_app_com.png"))
        
        # 1-1. 이전 강좌 비교 라디오 선택 상태도 캡처
        page.evaluate("document.getElementById('com_gubun_1').click()")
        page.wait_for_timeout(300)
        page.screenshot(path=os.path.join(artifact_dir, "modal_07_app_com_compare.png"))

        page.evaluate("closeAppModal('modalAppCom')")
        page.wait_for_timeout(300)

        # 2. 미신청자목록
        page.evaluate("openAppUnappliedModal()")
        page.wait_for_timeout(500)
        page.screenshot(path=os.path.join(artifact_dir, "modal_08_app_unapplied.png"))

        b.close()
    print("Screenshots captured successfully!")

if __name__ == "__main__":
    capture()
