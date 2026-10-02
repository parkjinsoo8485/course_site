const fs = require('fs');

['course_site/af/ad_lec/lists/sn/index.html', 'course_site/af/ad_lec/lists/sn/3267/index.html'].forEach(fp => {
  const content = fs.readFileSync(fp, 'utf8');
  const matches = [...content.matchAll(/id=["']panel_ad_tea_lists["']/g)];
  console.log(fp, 'matches count:', matches.length);
  matches.forEach(m => {
    const line = content.substring(0, m.index).split('\n').length;
    console.log('  match at line:', line);
  });
});
