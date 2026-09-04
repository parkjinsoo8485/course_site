import json
import os
import sys
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def extract_from_cdp():
    print("Connecting to Chrome on port 9222 via CDP...")
    with sync_playwright() as p:
        try:
            browser = p.chromium.connect_over_cdp("http://127.0.0.1:9222")
        except Exception as e:
            print(f"Failed to connect to CDP on 9222: {e}")
            return

        contexts = browser.contexts
        print(f"Found {len(contexts)} contexts.")
        target_page = None

        for ctx in contexts:
            for page in ctx.pages:
                url = page.url
                print(f"Open tab: {url}")
                if "dbdbschool.kr" in url and "modifyField" in url:
                    target_page = page
                    break
            if target_page:
                break

        if not target_page:
            for ctx in contexts:
                for page in ctx.pages:
                    if "dbdbschool.kr" in page.url:
                        target_page = page
                        print(f"Found dbdbschool tab, navigating to modifyField...")
                        target_page.goto("https://www.dbdbschool.kr/af/ad_lec/modifyField/p/1/sn/3267/sld/11/sof/ln/sot/asc", wait_until="domcontentloaded")
                        break
                if target_page:
                    break

        if not target_page:
            print("No dbdbschool tab found!")
            return

        print(f"Target page URL: {target_page.url}")
        print(f"Target page Title: {target_page.title()}")

        styles = target_page.evaluate("""
            () => Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.outerHTML).join('\\n')
        """)

        body_html = target_page.evaluate("""
            () => {
                const el = document.querySelector('#contents') || document.querySelector('#content') || document.querySelector('form[name="fm_write"]') || document.body;
                return el.outerHTML;
            }
        """)

        full_content = f"<!-- Auto-extracted via CDP Port 9222 -->\\n<!-- URL: {target_page.url} -->\\n<!-- Title: {target_page.title()} -->\\n\\n<!-- Stylesheets -->\\n{styles}\\n\\n<!-- Extracted DOM -->\\n{body_html}"

        with open("scratch/target.html", "w", encoding="utf-8") as f:
            f.write(full_content)

        print(f"✅ Successfully wrote scratch/target.html ({len(full_content)} chars)!")

        # Save cookies to auth.json
        cookies = target_page.context.cookies()
        auth_state = {
            "cookies": cookies,
            "origins": [
                {
                    "origin": "https://www.dbdbschool.kr",
                    "localStorage": []
                }
            ]
        }
        with open("auth.json", "w", encoding="utf-8") as f:
            json.dump(auth_state, f, indent=2)
        print(f"✅ Saved fresh auth.json with {len(cookies)} cookies!")

        target_page.screenshot(path="scratch/target.png")
        print("✅ Saved scratch/target.png!")

if __name__ == "__main__":
    extract_from_cdp()
