# -*- coding: utf-8 -*-
import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

def scroll_and_capture():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        page.goto("http://localhost:3005/af/ad_free2_app/lists/sn/3267", wait_until="networkidle")

        page.locator("#panel_ad_free2_app button:has-text('수강자등록')").click()
        page.wait_for_timeout(300)

        # Scroll the modal box to the bottom
        page.evaluate("""() => {
            const box = document.querySelector('#modal_sub_app_register .modal-box');
            if (box) box.scrollTop = box.scrollHeight;
        }""")
        page.wait_for_timeout(300)

        screenshot_path = os.path.join(os.getcwd(), "scratch", "verified_modal_1to1_scrolled.png")
        page.screenshot(path=screenshot_path)
        print(f"Scrolled screenshot saved to {screenshot_path}")
        browser.close()

if __name__ == "__main__":
    scroll_and_capture()
