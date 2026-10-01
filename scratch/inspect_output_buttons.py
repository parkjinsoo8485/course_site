from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:3005/af/ad_app/lists/sn/3267', wait_until='networkidle')

    btns = page.locator('button, a, input[type=button]').all()
    print('Found buttons matching output keywords:')
    for b in btns:
        text = b.inner_text().strip() or b.get_attribute('value') or ''
        if any(k in text for k in ['엑셀', '신청서', '고지서', '시간표']):
            tag = b.evaluate("el => el.tagName")
            visible = b.is_visible()
            href = b.get_attribute("href")
            onclick = b.get_attribute("onclick")
            print(f'  Tag: {tag}, Text: "{text}", Visible: {visible}, href: {href}, onclick: {onclick}')
    browser.close()
