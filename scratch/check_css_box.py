for p in ['course_site/css/af/content.css', 'course_site/css/default.css', 'course_site/af/ad_lec/lists/sn/admin_lec.css']:
    try:
        with open(p, encoding='utf-8') as f:
            c = f.read()
            if 'main_control_box' in c:
                print(f"Found in {p}")
                for line in c.splitlines():
                    if 'main_control_box' in line:
                        print(" ", line.strip()[:100])
    except Exception as e:
        print(f"Error reading {p}: {e}")
