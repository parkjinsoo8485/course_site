import glob

targets = ['ad_ref/write', 'ad_ref/writes', '1625940']
for p in glob.glob('**/*.har', recursive=True):
    try:
        with open(p, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            for t in targets:
                if t in content:
                    print(f'Found {t} in {p}')
    except Exception as e:
        pass
