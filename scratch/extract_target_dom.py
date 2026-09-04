import sys
import os
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

AUTH_FILE = "auth.json"
DEFAULT_OUTPUT = "scratch/target.html"
SCREENSHOT_OUTPUT = "scratch/target.png"

def extract_dom(url, trigger=None, output_path=DEFAULT_OUTPUT):
    os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else ".", exist_ok=True)
    
    if not os.path.exists(AUTH_FILE):
        print(f"⚠️ [경고] '{AUTH_FILE}' 세션 파일이 없습니다. 로그인 세션 없이 시도합니다.")
        storage_state = None
    else:
        storage_state = AUTH_FILE

    with sync_playwright() as p:
        # headless mode for high speed
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            storage_state=storage_state,
            viewport={"width": 1920, "height": 1080}
        )
        page = context.new_page()
        page.on("dialog", lambda dialog: dialog.accept())

        print(f"🌐 [1/4] 페이지 이동 중: {url}")
        try:
            page.goto(url, wait_until="networkidle", timeout=30000)
        except Exception as e:
            print(f"⚠️ networkidle 타임아웃 발생, domcontentloaded 기준으로 계속 진행합니다: {e}")
            page.goto(url, wait_until="domcontentloaded", timeout=30000)

        time.sleep(1)

        # If trigger is provided (button text or selector to open modal)
        if trigger:
            print(f"🖱️ [2/4] 트리거 액션 수행: '{trigger}' 클릭 시도...")
            try:
                # 1) Try text search
                btn = page.get_by_text(trigger, exact=False).first
                if btn and btn.is_visible():
                    btn.click()
                else:
                    # 2) Try selector
                    page.locator(trigger).first.click()
                time.sleep(1)
                print(f"✓ 트리거 클릭 완료")
            except Exception as e:
                print(f"⚠️ 트리거 클릭 실패: {e}")

        # Extract target element outerHTML
        print(f"🔍 [3/4] 최적 타겟 DOM 요소 감지 및 추출 중...")
        
        # Priority order of selectors to capture
        selectors = [
            ".modal.show", ".modal.fade.in", ".modal-dialog", ".modal-content",
            "#modal_box", "#addModal", ".modal_wrap",
            "form[name='fm_write']", "form[id*='write']", "form[id*='add']", "form[id*='fm']",
            "#contents", "#content", ".contents", "main", "body"
        ]

        target_html = None
        detected_selector = None

        if trigger:
            # If trigger was executed, prioritize modal selectors
            for sel in selectors[:7]:
                try:
                    loc = page.locator(sel).first
                    if loc and loc.is_visible():
                        target_html = loc.evaluate("el => el.outerHTML")
                        detected_selector = sel
                        break
                except:
                    continue

        if not target_html:
            for sel in selectors:
                try:
                    loc = page.locator(sel).first
                    if loc and loc.is_visible():
                        target_html = loc.evaluate("el => el.outerHTML")
                        detected_selector = sel
                        break
                except:
                    continue

        if not target_html:
            target_html = page.content()
            detected_selector = "full_page_html"

        # Also get external stylesheets
        styles = page.evaluate("""
            () => Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.outerHTML).join('\\n')
        """)

        combined = f"<!-- Auto-extracted from: {url} -->\\n<!-- Selector: {detected_selector} -->\\n\\n<!-- External Stylesheets -->\\n{styles}\\n\\n<!-- Target DOM outerHTML -->\\n{target_html}"

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(combined)

        # Save screenshot for visual reference
        page.screenshot(path=SCREENSHOT_OUTPUT)

        print(f"✅ [4/4] 추출 성공!")
        print(f"📁 HTML 저장 완료: {output_path} ({len(combined):,} bytes)")
        print(f"📸 스크린샷 저장 완료: {SCREENSHOT_OUTPUT}")
        print(f"🎯 감지된 최적 요소: {detected_selector}")

        context.close()
        browser.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("사용법: python scratch/extract_target_dom.py <URL> [모달버튼텍스트/셀렉터] [출력파일경로]")
        sys.exit(1)

    target_url = sys.argv[1]
    trigger_action = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] != "None" else None
    out_file = sys.argv[3] if len(sys.argv) > 3 else DEFAULT_OUTPUT

    extract_dom(target_url, trigger_action, out_file)
