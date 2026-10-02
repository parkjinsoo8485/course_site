import sys
import json
import time
import os

sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

# This script captures the write modal page from localhost which has the same content
# via a Playwright session that logs into localhost first.

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False, args=['--disable-blink-features=AutomationControlled'])
    ctx = browser.new_context(
        viewport={'width': 1920, 'height': 1080},
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    )
    page = ctx.new_page()

    # Navigate to local server write modal
    page.goto('http://localhost:3005/af/ad_free2_app/lists/sn/3267', wait_until='networkidle', timeout=15000)
    time.sleep(1)

    # Click 수강자등록 button to open modal
    page.evaluate("document.getElementById('panel_ad_free2_app').style.display='block';")
    time.sleep(0.5)

    # Trigger openSubsidyAppRegisterModal
    page.evaluate("if(typeof openSubsidyAppRegisterModal==='function') openSubsidyAppRegisterModal();")
    time.sleep(1)

    # Take screenshot of modal
    modal = page.locator('#modal_sub_app_register')
    if modal.is_visible():
        print('Modal is visible!')
        modal.screenshot(path='scratch/local_write_modal.png')
        html = modal.evaluate('el => el.outerHTML')
        with open('scratch/local_write_modal.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print('Saved local modal HTML and screenshot.')

        # Extract all TH headers, inputs, buttons
        fields_js = """
() => {
    const modal = document.getElementById('modal_sub_app_register');
    if (!modal) return {};
    const inputs = Array.from(modal.querySelectorAll('input,select,textarea')).map(el => ({
        tag: el.tagName, id: el.id, name: el.name, type: el.type,
        options: el.tagName === 'SELECT' ? Array.from(el.options).map(o=>({value:o.value,text:o.text})) : []
    }));
    const ths = Array.from(modal.querySelectorAll('th')).map(el => el.innerText.trim());
    const btns = Array.from(modal.querySelectorAll('button,input[type=submit]')).map(el => el.innerText.trim()||el.value);
    const tds = Array.from(modal.querySelectorAll('td')).map(el => el.innerText.trim()).filter(t=>t);
    return {inputs, ths, btns, tds};
}
"""
        fields = page.evaluate(fields_js)
        print('=== LOCAL MODAL TH HEADERS ===')
        for th in fields.get('ths', []):
            print(' -', th)
        print('=== LOCAL MODAL BUTTONS ===')
        for b in fields.get('btns', []):
            print(' -', b)
        print('=== LOCAL MODAL INPUTS ===')
        for inp in fields.get('inputs', []):
            print(f"  {inp['tag']} id={inp['id']} name={inp['name']} type={inp['type']}")
        print('=== LOCAL MODAL TD TEXTS ===')
        for t in fields.get('tds', []):
            print(' |', t)
    else:
        print('Modal NOT visible, taking full page screenshot.')
        page.screenshot(path='scratch/local_write_modal.png')

    browser.close()
