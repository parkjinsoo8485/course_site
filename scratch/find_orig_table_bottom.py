import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/page_af_ad_lec_lists_sn_3267.html', encoding='utf-8') as f:
    orig = f.read()

# Find table end in orig
pos = orig.find('</tbody>')
if pos != -1:
    print("Table bottom in orig:")
    print(orig[pos:pos+2500])
else:
    # search for /table
    pos2 = orig.find('</table>')
    print("table tag pos:", pos2)
    if pos2 != -1:
        print(orig[pos2-100:pos2+2000])
