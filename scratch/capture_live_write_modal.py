"""
Capture the live target page at https://www.dbdbschool.kr/af/ad_free2_app/write/p/1/sn/3267/smt/3
using a non-headless browser where user can login manually if needed.
"""
import sys
import time
import json
import os

sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

TARGET_URL = 'https://www.dbdbschool.kr/af/ad_free2_app/write/p/1/sn/3267/smt/3'
AUTH_FILE = 'auth.json'

def try_login(page, ctx):
    """Try to login and save session"""
    print("[Login] Navigating to login page...")
    page.goto('https://www.dbdbschool.kr/member/login/sn/3267', wait_until='domcontentloaded')
    print("[Login] Please login manually in the opened browser. Waiting 60 seconds...")
    
    for i in range(60, 0, -5):
        time.sleep(5)
        if '/login' not in page.url and '403' not in page.content():
            print("[Login] Login detected! Saving session...")
            ctx.storage_state(path=AUTH_FILE)
            return True
        print(f"  Waiting... {i}s remaining")
    return False

with sync_playwright() as p:
    # Try with existing auth.json first
    storage = AUTH_FILE if os.path.exists(AUTH_FILE) else None
    
    browser = p.chromium.launch(headless=False, args=['--disable-blink-features=AutomationControlled'])
    ctx = browser.new_context(
        storage_state=storage,
        viewport={'width': 1920, 'height': 1080},
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        locale='ko-KR',
        timezone_id='Asia/Seoul'
    )
    page = ctx.new_page()
    page.on('dialog', lambda d: d.accept())
    
    print(f"[Step 1] Navigating to: {TARGET_URL}")
    try:
        page.goto(TARGET_URL, wait_until='domcontentloaded', timeout=30000)
    except Exception as e:
        print(f"Navigation error: {e}")
    
    time.sleep(3)
    print(f"[Step 2] Current URL: {page.url}")
    print(f"[Step 2] Title: {page.title()}")
    
    # If redirected to login
    if '/login' in page.url or '403' in page.content() or page.title() == '늘봄학교 - 로그인':
        print("[Step 3] Not logged in. Opening login page...")
        if not try_login(page, ctx):
            print("Login timeout. Exiting.")
            browser.close()
            sys.exit(1)
        # Re-navigate to target
        page.goto(TARGET_URL, wait_until='domcontentloaded', timeout=30000)
        time.sleep(3)
    
    print(f"[Step 4] Final URL: {page.url}")
    print(f"[Step 4] Final Title: {page.title()}")
    
    # Save full page screenshot and HTML
    page.screenshot(path='scratch/target_write_modal_live.png', full_page=True)
    html = page.content()
    with open('scratch/target_write_modal_live.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"[Step 5] HTML saved ({len(html)} bytes), screenshot saved.")
    
    # Extract DOM structure
    extract_js = """
() => {
    const main = document.querySelector('#contents, form[name=\"fm_write\"], .panel_main, .contents');
    if (!main) return {error: 'No main element found'};
    
    const inputs = Array.from(main.querySelectorAll('input,select,textarea')).map(el => ({
        tag: el.tagName, id: el.id || '', name: el.name || '', type: el.type || '',
        value: el.value || '', placeholder: el.placeholder || '',
        options: el.tagName === 'SELECT' ? Array.from(el.options).map(o => ({value:o.value,text:o.text})) : []
    }));
    
    const ths = Array.from(main.querySelectorAll('th')).map(el => el.innerText.trim()).filter(t=>t);
    const btns = Array.from(main.querySelectorAll('button,input[type=submit],input[type=button],a.btn'))
        .map(el => (el.innerText||el.value||'').trim()).filter(t=>t);
    
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,.panel-heading,.page-title'))
        .map(el => el.innerText.trim()).filter(t=>t);
    
    const notes = Array.from(main.querySelectorAll('.alert li, ul.notice li, .info_box li, p, .help-block, .text-danger, .text-warning, .text-info, .text-muted'))
        .map(el => el.innerText.trim()).filter(t => t.length > 5 && t.length < 300);
    
    const rows = Array.from(main.querySelectorAll('tr')).map(tr => ({
        ths: Array.from(tr.querySelectorAll('th')).map(el=>el.innerText.trim()),
        tds: Array.from(tr.querySelectorAll('td')).map(el=>el.innerText.trim().substring(0,100))
    }));
    
    const links = Array.from(main.querySelectorAll('a')).map(el=>({text:el.innerText.trim(),href:el.href})).filter(l=>l.text);
    
    return {inputs, ths, btns, headings, notes, rows, links, innerHTML: main.outerHTML.substring(0, 30000)};
}
"""
    
    try:
        result = page.evaluate(extract_js)
    except Exception as e:
        print(f"JS extraction error: {e}")
        result = {}
    
    print('=== HEADINGS ===')
    for h in result.get('headings', []):
        print(' H:', h)
    
    print('=== TH HEADERS ===')
    for th in result.get('ths', []):
        print(' TH:', th)
    
    print('=== BUTTONS ===')
    for b in result.get('btns', []):
        print(' BTN:', b)
    
    print('=== INPUTS ===')
    for inp in result.get('inputs', []):
        if inp.get('options'):
            opts = [o['text'] for o in inp['options'][:10]]
            print(f"  SELECT id={inp['id']} name={inp['name']} opts={opts}")
        else:
            print(f"  INPUT id={inp['id']} name={inp['name']} type={inp['type']} placeholder={inp['placeholder']}")
    
    print('=== TABLE ROWS ===')
    for row in result.get('rows', []):
        if row['ths']:
            print(f"  TH: {row['ths']} | TD: {row['tds']}")
    
    print('=== NOTES/HELP TEXT ===')
    for n in result.get('notes', [])[:30]:
        print(' NOTE:', n)
    
    # Save innerHTML
    if 'innerHTML' in result:
        with open('scratch/target_write_modal_content.html', 'w', encoding='utf-8') as f:
            f.write(result['innerHTML'])
        print(f"\n[Done] Content HTML saved ({len(result.get('innerHTML',''))} chars)")
    
    # Update auth.json with fresh session
    try:
        ctx.storage_state(path=AUTH_FILE)
        print("[Done] Auth session updated.")
    except:
        pass
    
    browser.close()
    print("[Done] Browser closed.")
