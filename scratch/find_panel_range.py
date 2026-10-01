with open('course_site/af/ad_lec/lists/sn/index.html', encoding='utf-8') as f:
    lines = f.readlines()

start = None
end = None
for i, line in enumerate(lines):
    if 'id="panel_ad_lec_lists"' in line:
        start = i
    if 'id="panel_ad_app_lists"' in line:
        end = i

print(f"panel_ad_lec_lists range: lines {start+1} to {end}")
for k in range(start, start + 15):
    print(f"{k+1}: {lines[k].strip()}")
print("...")
for k in range(end - 15, end + 2):
    print(f"{k+1}: {lines[k].strip()}")
