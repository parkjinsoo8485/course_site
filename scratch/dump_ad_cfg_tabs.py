import os
import time
from playwright.sync_api import sync_playwright

tabs = [
    {"name": "main", "url": "https://www.dbdbschool.kr/af/ad_cfg/main/sn/3267"},
    {"name": "tea",  "url": "https://www.dbdbschool.kr/af/ad_cfg/tea/sn/3267"},
    {"name": "att",  "url": "https://www.dbdbschool.kr/af/ad_cfg/att/sn/3267"},
    {"name": "sms",  "url": "https://www.dbdbschool.kr/af/ad_cfg/sms/sn/3267"}
]

def dump_all():
    print("Connecting to Chrome on port 9222...")
    with sync_playwright() as p:
        try:
            browser = p.chromium.connect_over_cdp("http://127.0.0.1:9222")
        except Exception as e:
            print(f"Error connecting to CDP: {e}")
            return

        contexts = browser.contexts
        target_page = None

        for ctx in contexts:
            for page in ctx.pages:
                if "dbdbschool.kr" in page.url:
                    target_page = page
                    break
            if target_page:
                break

        if not target_page:
            print("No dbdbschool tab found in Chrome!")
            return

        scratch_dir = os.path.dirname(os.path.abspath(__file__))

        for tab in tabs:
            print(f"[*] Navigating to {tab['name']}: {tab['url']}")
            target_page.goto(tab["url"], wait_until="domcontentloaded")
            time.sleep(1.5)

            html = target_page.evaluate("""() => {
                const box = document.querySelector('#contents_box') || document.querySelector('#contents') || document.body;
                return box.outerHTML;
            }""")

            out_file = os.path.join(scratch_dir, f"target_ad_cfg_{tab['name']}.html")
            with open(out_file, "w", encoding="utf-8") as f:
                f.write(html)
            print(f"[OK] Saved: {out_file} ({len(html)/1024:.1f} KB)")

        print("[SUCCESS] Sprint 3 tabs dump complete!")

if __name__ == "__main__":
    dump_all()
