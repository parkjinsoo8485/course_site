import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('course_site/routes/admin.routes.js', encoding='utf-8') as f:
    js = f.read()

routes = re.findall(r'router\.(get|post|put|delete)\([\'\"]([^\'\"]+)[\'\"]', js)
for m, r in routes:
    if 'lec' in r:
        print(f"{m.upper():6s} {r}")
