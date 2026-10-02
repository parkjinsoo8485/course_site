import sys
import json
import time

sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=['--disable-blink-features=AutomationControlled'])
    ctx = browser.new_context(
        storage_state='auth.json',
        viewport={'width': 1920, 'height': 1080},
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    )
    page = ctx.new_page()
    page.goto(
        'https://www.dbdbschool.kr/af/ad_free2_app/write/p/1/sn/3267/smt/3',
        wait_until='domcontentloaded', timeout=30000
    )
    time.sleep(3)
    print('URL:', page.url)
    print('TITLE:', page.title())
    page.screenshot(path='scratch/target_write_modal.png', full_page=True)
    html = page.content()
    print('HTML LENGTH:', len(html))
    with open('scratch/target_write_modal.html', 'w', encoding='utf-8') as f:
        f.write(html)

    JS = """
() => {
    const inputs = Array.from(document.querySelectorAll('input,select,textarea')).map(el => ({
        tag: el.tagName,
        id: el.id,
        name: el.name,
        type: el.type,
        value: el.value,
        options: el.tagName === 'SELECT' ? Array.from(el.options).map(o => ({value: o.value, text: o.text})) : []
    }));
    const ths = Array.from(document.querySelectorAll('th')).map(el => el.innerText.trim()).filter(t => t);
    const btns = Array.from(document.querySelectorAll('button,input[type=submit],input[type=button],a.btn'))
        .map(el => el.innerText.trim() || el.value).filter(t => t);
    const title = document.querySelector('h2,h3,.panel-heading') ? document.querySelector('h2,h3,.panel-heading').innerText : document.title;
    const notes = Array.from(document.querySelectorAll('.alert li, ul.notice li, .info_box li, p')).map(el=>el.innerText.trim()).filter(t=>t.length>5);
    const allTexts = Array.from(document.querySelectorAll('td,th,label,p,li,h1,h2,h3,h4,.help-block,.text-info,.text-danger'))
        .map(el=>el.innerText.trim()).filter(t=>t.length>0);
    return {inputs, ths, btns, title, notes, allTexts: allTexts.slice(0, 200)};
}
"""
    fields = page.evaluate(JS)
    print('=== TITLE ===')
    print(fields['title'])
    print('=== TH HEADERS ===')
    for th in fields['ths']:
        print(' -', th)
    print('=== BUTTONS ===')
    for b in fields['btns']:
        print(' -', b)
    print('=== INPUTS ===')
    for inp in fields['inputs']:
        if inp['options']:
            print(f"  {inp['tag']} id={inp['id']} name={inp['name']} options={[o['text'] for o in inp['options'][:10]]}")
        else:
            print(f"  {inp['tag']} id={inp['id']} name={inp['name']} type={inp['type']} value={inp['value']}")
    print('=== NOTES ===')
    for n in fields['notes'][:20]:
        print(' -', n)
    print('=== ALL TEXTS (first 80) ===')
    for t in fields['allTexts'][:80]:
        print(' |', t)

    browser.close()
