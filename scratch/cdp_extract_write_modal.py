import sys, time, json
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp('http://localhost:9222')
    contexts = browser.contexts
    print(f'[CDP] Connected. Contexts: {len(contexts)}')

    target_page = None
    for ctx in contexts:
        for pg in ctx.pages:
            url = pg.url
            title = pg.title()
            print(f'  Page: {url[:80]} | {title[:50]}')
            if 'ad_free2_app' in url and 'write' in url:
                target_page = pg
                print(f'  *** TARGET FOUND: {url}')

    if not target_page:
        print('[!] Target write page not found. Available pages listed above.')
    else:
        print(f'\n[CDP] Extracting DOM from: {target_page.url}')
        target_page.screenshot(path='scratch/cdp_write_modal.png', full_page=True)
        print('[CDP] Screenshot saved: scratch/cdp_write_modal.png')

        extract_js = """
() => {
    const main = document.querySelector('form[name=\"fm_write\"]') || document.querySelector('#contents') || document.querySelector('.panel_main') || document.body;
    const ths = Array.from(document.querySelectorAll('th')).map(el => el.innerText.trim()).filter(t=>t);
    const tds = Array.from(document.querySelectorAll('td')).map(el => el.innerText.trim()).filter(t=>t.length>0&&t.length<200);
    const inputs = Array.from(document.querySelectorAll('input,select,textarea')).filter(el=>el.type!=='hidden'||el.name.includes('smt')||el.name.includes('month')).map(el=>({
        tag:el.tagName, id:el.id||'', name:el.name||'', type:el.type||'',
        value:el.value||'', placeholder:el.placeholder||'',
        options:el.tagName==='SELECT'?Array.from(el.options).map(o=>({v:o.value,t:o.text})).slice(0,20):[]
    }));
    const btns = Array.from(document.querySelectorAll('button,input[type=submit],input[type=button],a.btn')).map(el=>(el.innerText||el.value||'').trim()).filter(t=>t);
    const allText = document.body.innerText.substring(0, 5000);
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,.panel-heading,.hm_title')).map(el=>el.innerText.trim()).filter(t=>t);
    return {ths, tds: tds.slice(0,50), inputs, btns, headings, allText: allText.substring(0,3000), html: main.outerHTML.substring(0, 40000)};
}
"""
        result = target_page.evaluate(extract_js)

        print('\\n=== TITLE/HEADINGS ===')
        for h in result.get('headings', []):
            print(' H:', h)

        print('\\n=== TH HEADERS ===')
        for th in result.get('ths', []):
            print(' TH:', th)

        print('\\n=== BUTTONS ===')
        for b in result.get('btns', []):
            print(' BTN:', b)

        print('\\n=== INPUTS ===')
        for inp in result.get('inputs', []):
            if inp['options']:
                opts = [o['t'] for o in inp['options'][:8]]
                print(f"  SELECT id={inp['id']} name={inp['name']} opts={opts}")
            else:
                print(f"  {inp['tag']} id={inp['id']} name={inp['name']} type={inp['type']} val={inp['value'][:30]} ph={inp['placeholder'][:30]}")

        print('\\n=== FIRST 3000 CHARS OF PAGE TEXT ===')
        print(result.get('allText', ''))

        # Save HTML
        with open('scratch/cdp_write_modal.html', 'w', encoding='utf-8') as f:
            f.write(result.get('html', ''))
        print(f'\\n[Done] HTML saved ({len(result.get("html",""))} chars)')

    browser.close()
