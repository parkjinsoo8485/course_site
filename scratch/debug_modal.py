from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    page.on("pageerror", lambda err: print("PAGE ERROR:", err))
    page.on("console", lambda msg: print("CONSOLE:", msg.text))

    page.goto('http://localhost:3005/af/ad_app/lists/sn/3267', wait_until='networkidle')

    res = page.evaluate("""() => {
        try {
            console.log('Type of openAppSinModal:', typeof window.openAppSinModal);
            console.log('Type of openAppCreateModal:', typeof window.openAppCreateModal);
            const m = document.getElementById('modalAppCreate');
            console.log('modalAppCreate element:', m ? 'EXISTS' : 'NOT FOUND');
            window.openAppSinModal();
            return {
                display: m ? m.style.display : null,
                classes: m ? m.className : null
            };
        } catch(e) {
            return { error: e.message, stack: e.stack };
        }
    }""")
    print('Eval result:', res)
    browser.close()
