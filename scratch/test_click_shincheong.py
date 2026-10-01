import sys
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 950})
    
    console_logs = []
    page.on('console', lambda msg: console_logs.append(f'[{msg.type}] {msg.text}'))
    
    dialogs = []
    page.on('dialog', lambda d: (dialogs.append(f'{d.type}: {d.message}'), d.accept()))
    
    page.goto('http://localhost:3005/af/ad_wait/lists/sn/3267')
    page.wait_for_timeout(1000)
    
    btn = page.locator('#waitlistTbody tr td button.btn-primary').first
    print('Button text:', btn.inner_text())
    print('Button is_enabled:', btn.is_enabled())
    print('Button outerHTML:', btn.evaluate('el => el.outerHTML'))
    
    # Click button
    btn.click()
    page.wait_for_timeout(1500)
    
    print('Dialogs encountered:', dialogs)
    print('Console logs:', console_logs)
    
    browser.close()
