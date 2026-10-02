import json
import time
from playwright.sync_api import sync_playwright

def scrape_cfg():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        
        # 쿠키 적용
        try:
            with open("scratch/cookies.json", "r", encoding="utf-8") as f:
                cookies = json.load(f)
                context.add_cookies(cookies)
                print("Cookies added successfully.")
        except Exception as e:
            print("Cookie error:", e)

        page = context.new_page()

        # 1. 지원금설정 (main)
        print("Navigating to ad_free2_cfg/main...")
        page.goto("https://www.dbdbschool.kr/af/ad_free2_cfg/main/sn/3267", wait_until="networkidle", timeout=30000)
        time.sleep(2)

        page.screenshot(path="scratch/live_ad_free2_cfg_main.png")
        with open("scratch/live_ad_free2_cfg_main.html", "w", encoding="utf-8") as f:
            f.write(page.content())
        print("Saved scratch/live_ad_free2_cfg_main.html and png")

        # 2. 순위구분설정 (free1)
        print("Navigating to ad_free2_cfg/free1...")
        page.goto("https://www.dbdbschool.kr/af/ad_free2_cfg/free1/sn/3267", wait_until="networkidle", timeout=30000)
        time.sleep(2)

        page.screenshot(path="scratch/live_ad_free2_cfg_free1.png")
        with open("scratch/live_ad_free2_cfg_free1.html", "w", encoding="utf-8") as f:
            f.write(page.content())
        print("Saved scratch/live_ad_free2_cfg_free1.html and png")

        browser.close()

if __name__ == "__main__":
    scrape_cfg()
