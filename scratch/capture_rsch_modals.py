import sys
import os
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 900})
    page.goto('http://localhost:3005/af/ad_rsch/lists/sn/3267', wait_until='networkidle')

    # 1. 등록 모달 캡처
    page.locator("#panel_ad_rsch_lists button:has-text('등록')").click()
    page.wait_for_timeout(300)
    page.screenshot(path='scratch/verified_rsch_write_modal.png')

    # 2. 학생 시간표 모달 캡처
    page.locator("#modal_ad_rsch_write button:has-text('취소')").click()
    page.wait_for_timeout(200)
    page.locator("#rschTableTbody tr:first-child a.link_type:has-text('유다은')").click()
    page.wait_for_timeout(300)
    page.screenshot(path='scratch/verified_rsch_schedule_modal.png')

    browser.close()
    print("Modals screenshots captured successfully!")
