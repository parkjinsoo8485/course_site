from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 950})
    page.goto('http://localhost:3005/af/ad_wait/lists/sn/3267')
    page.wait_for_timeout(1000)

    # Find all elements containing '신청'
    elements = page.query_selector_all('button, a, input, th, td')
    results = []
    for el in elements:
        text = (el.inner_text() or el.get_attribute('value') or '').strip()
        if '신청' in text:
            tag = el.evaluate('el => el.tagName')
            cls = el.get_attribute('class') or ''
            disabled = el.get_attribute('disabled')
            onclick = el.get_attribute('onclick') or ''
            results.append({
                'tag': tag,
                'text': text[:30],
                'class': cls,
                'disabled': disabled,
                'onclick': onclick[:60]
            })

    for r in results:
        print(r)
    browser.close()
