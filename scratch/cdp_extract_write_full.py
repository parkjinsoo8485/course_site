import sys, json
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp('http://localhost:9222')
    target = None
    for ctx in browser.contexts:
        for pg in ctx.pages:
            if 'ad_free2_app/write' in pg.url:
                target = pg
                break
    
    if not target:
        print('Target not found')
        browser.close()
        exit()
    
    JS = """
() => {
    const ths = Array.from(document.querySelectorAll('th')).map(el => el.innerText.trim()).filter(t=>t);
    const btns = Array.from(document.querySelectorAll('button,input[type=submit],input[type=button],a.btn,.btn')).map(el=>(el.innerText||el.value||'').trim()).filter(t=>t&&t.length<50);
    const inputs = Array.from(document.querySelectorAll('input,select,textarea')).map(el=>({
        tag: el.tagName, id: el.id||'', name: el.name||'', type: el.type||'',
        value: el.value||'', placeholder: el.placeholder||'',
        options: el.tagName==='SELECT' ? Array.from(el.options).map(o=>({v:o.value,t:o.text})) : []
    }));
    const html = (document.querySelector('#contents') || document.querySelector('.panel_main') || document.querySelector('form[name=fm_write]') || document.body).outerHTML;
    return {ths, btns, inputs, html: html.substring(0, 80000)};
}
"""
    result = target.evaluate(JS)
    
    print('=== TH HEADERS ===')
    for t in result['ths']:
        print(' TH:', t)
    
    print('\n=== BUTTONS ===')
    for b in result['btns']:
        print(' BTN:', b)
    
    print('\n=== INPUTS ===')
    for inp in result['inputs']:
        if inp['options']:
            opts = [o['t'] for o in inp['options']]
            print(f"  SELECT id={inp['id']} name={inp['name']} opts={opts}")
        else:
            print(f"  {inp['tag']} id={inp['id']} name={inp['name']} type={inp['type']} val={inp['value'][:30]} ph={inp['placeholder'][:30]}")
    
    with open('scratch/cdp_write_modal_content.html', 'w', encoding='utf-8') as f:
        f.write(result['html'])
    print(f'\n[Done] HTML saved: {len(result["html"])} chars')
    
    browser.close()
