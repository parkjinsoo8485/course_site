import sys
import os
import time
import random
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

try:
    from playwright_stealth import Stealth
    HAS_STEALTH = True
except ImportError:
    HAS_STEALTH = False

AUTH_FILE = "auth.json"
LOGIN_URL = "https://www.dbdbschool.kr/member/login/sn/3267"
DEFAULT_OUTPUT = "scratch/target.html"
SCREENSHOT_OUTPUT = "scratch/target.png"

def human_delay(min_s=2.0, max_s=4.0, desc=""):
    delay = round(random.uniform(min_s, max_s), 2)
    if desc:
        print(f"    ⏳ [사람 속도 대기] {desc} ({delay}초 대기)...")
    time.sleep(delay)

def human_mouse_move(page, target_locator):
    try:
        box = target_locator.bounding_box()
        if not box:
            return
        target_x = box["x"] + box["width"] * random.uniform(0.3, 0.7)
        target_y = box["y"] + box["height"] * random.uniform(0.3, 0.7)
        
        # 인간처럼 여러 번에 나누어 부드럽게 마우스 이동
        steps = random.randint(15, 30)
        page.mouse.move(target_x, target_y, steps=steps)
        time.sleep(random.uniform(0.3, 0.7))
    except Exception as e:
        pass

def human_scroll(page):
    try:
        print("    🖱️ [사람 스크롤] 페이지를 훑어보는 중...")
        for _ in range(random.randint(2, 4)):
            scroll_amount = random.randint(200, 450)
            page.mouse.wheel(0, scroll_amount)
            time.sleep(random.uniform(0.4, 0.8))
        time.sleep(random.uniform(0.5, 1.0))
        # 다시 상단으로 스크롤
        page.mouse.wheel(0, -1000)
        time.sleep(0.5)
    except Exception:
        pass

def human_speed_scrape(target_url, trigger_text=None, output_path=DEFAULT_OUTPUT, headless=False):
    """
    사람의 행동 패턴(자연스러운 딜레이, 마우스 이동, 부드러운 스크롤, 스텔스)으로 타겟 페이지를 안전하게 스크랩
    """
    os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else ".", exist_ok=True)
    
    with sync_playwright() as p:
        # 실제 크롬과 동일한 브라우저 환경 실행
        args = [
            "--disable-blink-features=AutomationControlled",
            "--no-sandbox",
            "--disable-infobars"
        ]
        
        browser = p.chromium.launch(headless=headless, args=args)
        
        storage_state = AUTH_FILE if os.path.exists(AUTH_FILE) else None
        context = browser.new_context(
            storage_state=storage_state,
            viewport={"width": 1920, "height": 1080},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            locale="ko-KR",
            timezone_id="Asia/Seoul"
        )
        page = context.new_page()
        page.on("dialog", lambda dialog: dialog.accept())

        # 스텔스 모드 적용
        if HAS_STEALTH:
            try:
                Stealth().apply_stealth_sync(page)
            except Exception:
                pass

        print("=" * 70)
        print("🚶 [사람 속도 스크래퍼] 안티봇(WAF) 차단 방지 모드로 실행합니다.")
        print(f"🎯 목표 주소: {target_url}")
        print(f"👁️ 브라우저 모드: {'헤드리스' if headless else '실제 브라우저 화면 표시(Headful)'}")
        print("=" * 70)

        # 1. 페이지 접속
        print(f"\n[1/5] 페이지 접속 중...")
        try:
            page.goto(target_url, wait_until="domcontentloaded", timeout=45000)
        except Exception as e:
            print(f"⚠️ 페이지 로드 지연 발생: {e}")

        human_delay(2.5, 4.0, "페이지 초기 로딩 및 읽기")

        # 2. 세션 만료 및 로그인 감지
        content_preview = page.content()
        if "403 Forbidden" in content_preview or "/login" in page.url:
            print("\n🔒 [세션 만료 감지] 로그인 세션이 만료되었거나 WAF에 의해 로그인이 필요합니다.")
            print("👉 브라우저 창에서 로그인을 완료해 주세요. (45초간 대기합니다)")
            if page.url != LOGIN_URL and "403" not in content_preview:
                page.goto(LOGIN_URL)
            
            for remaining in range(45, 0, -5):
                print(f"    ⏳ 수동 로그인 대기 중... ({remaining}초 남음)")
                time.sleep(5)
                # 로그인 완료 여부 체크 (URL 변경 또는 쿠키 생성)
                if "/login" not in page.url and "403" not in page.content():
                    print("    ✓ 로그인 감지 완료!")
                    break

            # 세션 새로 저장
            context.storage_state(path=AUTH_FILE)
            print(f"    ✅ 새 인증 세션 '{AUTH_FILE}' 저장 완료")
            
            # 목표 주소로 다시 이동
            print(f"    🔄 목표 주소 재진입: {target_url}")
            page.goto(target_url, wait_until="domcontentloaded")
            human_delay(2.5, 4.0, "재접속 후 페이지 대기")

        # 3. 사람처럼 자연스러운 스크롤
        human_scroll(page)

        # 4. 트리거(모달 버튼 등) 클릭 액션
        if trigger_text:
            print(f"\n[3/5] 버튼 클릭 준비: '{trigger_text}' 탐색 중...")
            btn = None
            try:
                btn = page.get_by_text(trigger_text, exact=False).first
                if not btn.is_visible():
                    btn = page.locator(trigger_text).first
            except Exception:
                pass

            if btn and btn.is_visible():
                print(f"    🖱️ 버튼을 향해 자연스럽게 마우스 이동...")
                human_mouse_move(page, btn)
                human_delay(0.8, 1.8, "버튼 클릭 전 머뭇거리기")
                btn.click()
                print(f"    ✓ '{trigger_text}' 클릭 완료!")
                human_delay(2.0, 3.5, "모달 창 렌더링 대기")
            else:
                print(f"    ⚠️ '{trigger_text}' 버튼을 찾지 못했습니다. 현재 화면에서 계속 추출합니다.")

        # 4.5. 팝업 공지(#admin_info_modal 등) 닫기
        try:
            close_btn = page.locator("#admin_info_modal .close, #admin_info_modal button[data-dismiss='modal']").first
            if close_btn and close_btn.is_visible():
                close_btn.click()
                time.sleep(1)
        except Exception:
            pass

        # 5. 최적 DOM(메인 폼/테이블 또는 대상 모달) 감지 및 outerHTML 추출
        print(f"\n[4/5] 렌더링된 최적 DOM(outerHTML) 추출 중...")
        selectors = [
            "form[name='fm_write']", "form[id*='write']", "form[id*='modify']", "form[id*='edit']", "form[id*='fm']",
            "#contents", "#content", ".contents", "main",
            ".modal.show", ".modal.fade.in", ".modal-dialog", ".modal-content",
            "#modal_box", "#addModal", ".modal_wrap", "body"
        ]

        target_html = None
        detected_selector = None

        # 모달 트리거 클릭 후라면 모달 요소 우선 탐색
        if trigger_text:
            modal_selectors = [".modal.show", ".modal.fade.in:not(#admin_info_modal)", ".modal-dialog", ".modal-content", "#modal_box", "#addModal", ".modal_wrap"]
            for sel in modal_selectors:
                try:
                    loc = page.locator(sel).first
                    if loc and loc.is_visible():
                        target_html = loc.evaluate("el => el.outerHTML")
                        detected_selector = sel
                        break
                except Exception:
                    continue

        if not target_html:
            for sel in selectors:
                try:
                    loc = page.locator(sel).first
                    if loc and loc.is_visible() and loc.evaluate("el => el.id !== 'admin_info_modal'"):
                        target_html = loc.evaluate("el => el.outerHTML")
                        detected_selector = sel
                        break
                except Exception:
                    continue

        if not target_html:
            target_html = page.content()
            detected_selector = "full_body_fallback"

        # 스타일시트 태그 모음
        styles = page.evaluate("""
            () => Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.outerHTML).join('\\n')
        """)

        meta_info = f"<!-- Auto-extracted via Human-Speed Scraper -->\\n<!-- URL: {target_url} -->\\n<!-- Target Selector: {detected_selector} -->\\n<!-- Extracted Time: {time.strftime('%Y-%m-%d %H:%M:%S')} -->\\n\\n"
        final_content = meta_info + "<!-- Stylesheets -->\\n" + styles + "\\n\\n<!-- Extracted DOM -->\\n" + target_html

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(final_content)

        page.screenshot(path=SCREENSHOT_OUTPUT)

        print(f"\n[5/5] 🎉 추출 성공!")
        print(f"📁 저장 파일: {output_path} ({len(final_content):,} bytes)")
        print(f"📸 스크린샷: {SCREENSHOT_OUTPUT}")
        print(f"🎯 감지 요소: {detected_selector}")
        print("=" * 70)

        context.close()
        browser.close()
        return output_path

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("사용법: python scratch/human_speed_scraper.py <URL> [모달버튼텍스트/셀렉터] [출력파일경로]")
        sys.exit(1)

    url = sys.argv[1]
    trigger = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] != "None" else None
    out = sys.argv[3] if len(sys.argv) > 3 else DEFAULT_OUTPUT

    human_speed_scrape(url, trigger, out)
