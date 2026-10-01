import sys
import asyncio
from playwright.async_api import async_playwright

async def run_test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1920, 'height': 950})
        page = await context.new_page()

        print("[TEST 1] Visiting http://localhost:3005/af/ad_att/stat/sn/3267 (should redirect)...")
        response = await page.goto("http://localhost:3005/af/ad_att/stat/sn/3267", wait_until="networkidle")
        current_url = page.url
        print(f"  -> Landed at URL: {current_url}")
        assert "/af/ad_wait/lists/sn/3267" in current_url, f"Expected redirect to ad_wait, got {current_url}"
        print("  -> PASS: Successfully redirected to ad_wait!")

        print("[TEST 2] Checking DOM for removed elements on ad_wait page...")
        sub_att = await page.query_selector("#sub_ad_att_stat")
        assert sub_att is None, "Error: #sub_ad_att_stat still exists in DOM!"
        print("  -> PASS: #sub_ad_att_stat does NOT exist in sidebar!")

        panel_att = await page.query_selector("#panel_ad_att_stat")
        assert panel_att is None, "Error: #panel_ad_att_stat still exists in DOM!"
        print("  -> PASS: #panel_ad_att_stat does NOT exist in DOM!")

        att_text_links = await page.evaluate('''() => {
            const links = Array.from(document.querySelectorAll('#adminSidebar a, .sidebar a'));
            return links.filter(a => a.textContent.includes('출석부관리')).map(a => a.href);
        }''')
        assert len(att_text_links) == 0, f"Error: '출석부관리' link found in sidebar: {att_text_links}"
        print("  -> PASS: 0 '출석부관리' links found in sidebar!")

        print("[TEST 3] Visiting http://localhost:3005/af/ad_lec/lists/sn/3267...")
        await page.goto("http://localhost:3005/af/ad_lec/lists/sn/3267", wait_until="networkidle")
        sub_att_lec = await page.query_selector("#sub_ad_att_stat")
        assert sub_att_lec is None, "Error: #sub_ad_att_stat exists on ad_lec page!"
        panel_att_lec = await page.query_selector("#panel_ad_att_stat")
        assert panel_att_lec is None, "Error: #panel_ad_att_stat exists on ad_lec page!"
        print("  -> PASS: ad_lec page clean!")

        print("[TEST 4] Visiting http://localhost:3005/af/ad_app/lists/sn/3267...")
        await page.goto("http://localhost:3005/af/ad_app/lists/sn/3267", wait_until="networkidle")
        sub_att_app = await page.query_selector("#sub_ad_att_stat")
        assert sub_att_app is None, "Error: #sub_ad_att_stat exists on ad_app page!"
        print("  -> PASS: ad_app page clean!")

        await page.screenshot(path="scratch/ad_wait_no_att_sidebar.png", full_page=False)
        print("  -> PASS: Screenshot saved to scratch/ad_wait_no_att_sidebar.png")

        await browser.close()
        print("\nALL VERIFICATION TESTS PASSED SUCCESSFULLY! (6/6)")

if __name__ == '__main__':
    asyncio.run(run_test())
