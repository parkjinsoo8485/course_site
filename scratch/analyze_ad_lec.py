import re

with open('course_site/af/ad_lec/lists/sn/index.html', encoding='utf-8') as f:
    content = f.read()

modal_ids = re.findall(r'id=[\"\']([^\"\']*(?:modal|Modal)[^\"\']*)[\"\']', content)
print('Modal IDs:', sorted(set(modal_ids)))

btn_ids = re.findall(r'id=[\"\'](btn[^\"\']*)[\"\']', content)
print('Btn IDs:', sorted(set(btn_ids)))

fn_names = re.findall(r'function\s+([a-zA-Z0-9_]+)\s*\(', content)
print('Functions count:', len(fn_names))
key_fns = [f for f in set(fn_names) if any(k in f.lower() for k in ['batch', 'add', 'edit', 'stat', 'del', 'chk', 'quick', 'open', 'close', 'render', 'filter', 'search'])]
print('Key functions:', sorted(key_fns))
