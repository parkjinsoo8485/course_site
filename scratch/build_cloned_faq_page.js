const fs = require('fs');
const path = require('path');

// 1. Read entry0.html
let html = fs.readFileSync('scratch/entry0.html', 'utf8');

// 2. Read mapping
const mapping = JSON.parse(fs.readFileSync('course_site/utils/manual_faq_mapping.json', 'utf8'));

// 3. Replace remote CSS paths with local css paths (with fallback)
html = html.replace(/https:\/\/s3-ap-northeast-2\.amazonaws\.com\/www\.dbdbschool\.kr\/css\//g, '/css/');
html = html.replace(/https:\/\/s3-ap-northeast-2\.amazonaws\.com\/www\.dbdbschool\.kr\/icon\/css\//g, '/css/');
html = html.replace(/https:\/\/s3-ap-northeast-2\.amazonaws\.com\/www\.dbdbschool\.kr\/js\/ui\//g, '/css/');
html = html.replace(/https:\/\/s3-ap-northeast-2\.amazonaws\.com\/www\.dbdbschool\.kr\/js\/scroll\//g, '/css/');

// 4. Replace go_data links with local /help/go_data/ endpoints
html = html.replace(/https:\/\/www\.dbdbschool\.kr\/help\/go_data\/num\/(\d+)\/data\/(link\d+)/g, '/help/go_data/num/$1/data/$2');

// 5. Replace master manual zip link
html = html.replace(
  'https://s3-ap-northeast-2.amazonaws.com/www.dbdbschool.kr/doc/manual/af/manual_af.zip?23091501',
  '/downloads/manual_faq/manual_af.zip'
);

// 6. Update user profile name to match screenshot: '원희자(김채원)님'
html = html.replace(/관리자\(김혜련\)님/g, '원희자(김채원)님');

// 7. Make the '매뉴얼' menu item active in sidebar
html = html.replace(
  '<li><a href="https://www.dbdbschool.kr/af/ad_faq/main/sn/3267"><i class="fa fa-download"></i><strong>매뉴얼</strong></a></li>',
  '<li class="active"><a href="/af/ad_faq/main/sn/3267"><i class="fa fa-download"></i><strong>매뉴얼</strong></a></li>'
);

// 8. Replace other internal links to relative / local routes
html = html.replace(/https:\/\/www\.dbdbschool\.kr\/af\//g, '/af/');
html = html.replace(/https:\/\/www\.dbdbschool\.kr\/sczigi\//g, '/sczigi/');
html = html.replace(/https:\/\/www\.dbdbschool\.kr\/member\//g, '/member/');

// 9. Add essential interactive scripts for sidebar submenus & top dropdown
const interactiveScript = `
<style>
/* Custom enhancements to ensure 100% pixel-perfect matching with screenshot */
#left_menu {
  overflow-y: auto !important;
}
#left_menu .parent > li.active > a {
  background-color: #2e6da4 !important;
  color: #fff !important;
}
#left_menu .parent > li > a {
  cursor: pointer;
}
.depth {
  transition: all 0.2s ease-in-out;
}
.depth.collapsed {
  display: none !important;
}
.depth.expanded {
  display: block !important;
}
/* Ensure fa icons render properly */
@font-face {
  font-family: 'FontAwesome';
  src: url('/icon/fonts/fontawesome-webfont.woff?v=4.2.0') format('woff');
  font-weight: normal;
  font-style: normal;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // 1. Top Neulbom dropdown toggle
  var topH1 = document.querySelector('#header h1');
  var serviceBox = document.querySelector('.box_position');
  if (topH1 && serviceBox) {
    topH1.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      serviceBox.style.display = (serviceBox.style.display === 'block') ? 'none' : 'block';
    });
    document.addEventListener('click', function() {
      if (serviceBox) serviceBox.style.display = 'none';
    });
  }

  // 2. Sidebar submenus accordion (지원금관리, 설문관리, 환경설정)
  var parentLis = document.querySelectorAll('#left_menu ul.parent > li');
  parentLis.forEach(function(li) {
    var subDepth = li.querySelector('ul.depth');
    if (subDepth) {
      // initially collapse
      subDepth.classList.add('collapsed');
      var link = li.querySelector('a');
      if (link) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          var isCollapsed = subDepth.classList.contains('collapsed');
          // toggle current
          if (isCollapsed) {
            subDepth.classList.remove('collapsed');
            subDepth.classList.add('expanded');
            var chevron = li.querySelector('.fa-chevron-down');
            if (chevron) chevron.style.transform = 'rotate(180deg)';
          } else {
            subDepth.classList.remove('expanded');
            subDepth.classList.add('collapsed');
            var chevron = li.querySelector('.fa-chevron-down');
            if (chevron) chevron.style.transform = 'rotate(0deg)';
          }
        });
      }
    }
  });

  // 3. Make all go_data links open nicely
  var goDataLinks = document.querySelectorAll('a[href*="/help/go_data/"]');
  goDataLinks.forEach(function(a) {
    a.setAttribute('target', '_blank');
  });
});
</script>
`;

html = html.replace('</body>', interactiveScript + '\n</body>');

// 10. Write to target directory
const targetDir = path.join(__dirname, '../course_site/af/ad_faq/main/sn/3267');
fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');

// Also copy to parent fallback path
const parentTargetDir = path.join(__dirname, '../course_site/af/ad_faq/main/sn');
fs.mkdirSync(parentTargetDir, { recursive: true });
fs.writeFileSync(path.join(parentTargetDir, 'index.html'), html, 'utf8');

console.log('Successfully generated cloned manual FAQ page at:');
console.log(path.join(targetDir, 'index.html'));
