const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const START_URLS = [
  'https://www.dbdbschool.kr/af/ad_faq/main/sn/3267',
  'https://www.dbdbschool.kr/af/main/index/sn/3267',
  'https://www.dbdbschool.kr/af/af_sub_app/main/sn/3267',
  'https://www.dbdbschool.kr/af/ad_notice/main/sn/3267',
  'https://www.dbdbschool.kr/af/ad_qna/main/sn/3267',
  'https://www.dbdbschool.kr/af/ad_gallery/main/sn/3267',
  'https://www.dbdbschool.kr/af/login/login/sn/3267',
  'https://www.dbdbschool.kr/af/join/index/sn/3267'
];

const ALLOWED_HOSTS = ['www.dbdbschool.kr', 'dbdbschool.kr'];
const visited = new Set();
const results = [];
const queue = [...START_URLS];

function fetchPage(urlStr) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(urlStr);
      const client = parsedUrl.protocol === 'https:' ? https : http;

      const req = client.get(urlStr, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
        },
        timeout: 10000
      }, (res) => {
        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = new URL(res.headers.location, urlStr).toString();
          return resolve({ statusCode: res.statusCode, redirectUrl, body: '', headers: res.headers });
        }

        const contentType = res.headers['content-type'] || '';
        if (!contentType.includes('text/html') && !contentType.includes('application/json')) {
          res.resume();
          return resolve({ statusCode: res.statusCode, body: '', isBinary: true });
        }

        let body = '';
        res.setEncoding('utf-8');
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, body, headers: res.headers }));
      });

      req.on('error', (err) => resolve({ error: err.message }));
      req.on('timeout', () => { req.destroy(); resolve({ error: 'Timeout' }); });
    } catch (err) {
      resolve({ error: err.message });
    }
  });
}

function extractLinks(html, baseUrl) {
  const links = [];
  if (!html) return links;

  // 1. href attributes
  const hrefRegex = /href\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const raw = match[1].trim();
    if (raw && !raw.startsWith('#') && !raw.startsWith('javascript:') && !raw.startsWith('mailto:') && !raw.startsWith('tel:')) {
      try {
        const full = new URL(raw, baseUrl).toString();
        links.push(full);
      } catch (e) {}
    }
  }

  // 2. onclick / script redirects: location.href, window.open, go_page etc.
  const scriptRegex = /(?:location\.href|location\.replace|window\.open)\s*(?:=|\()\s*['"]([^'"]+)['"]/gi;
  while ((match = scriptRegex.exec(html)) !== null) {
    const raw = match[1].trim();
    try {
      const full = new URL(raw, baseUrl).toString();
      links.push(full);
    } catch (e) {}
  }

  // 3. form actions
  const formRegex = /action\s*=\s*["']([^"']+)["']/gi;
  while ((match = formRegex.exec(html)) !== null) {
    const raw = match[1].trim();
    try {
      const full = new URL(raw, baseUrl).toString();
      links.push(full);
    } catch (e) {}
  }

  // 4. onclick functions with URLs like fn_move('/af/...')
  const fnRegex = /['"](\/af\/[a-zA-Z0-9_\-\/\.]+)['"]/gi;
  while ((match = fnRegex.exec(html)) !== null) {
    const raw = match[1].trim();
    try {
      const full = new URL(raw, baseUrl).toString();
      links.push(full);
    } catch (e) {}
  }

  return links;
}

function extractPageInfo(html, urlStr) {
  let title = '';
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    title = titleMatch[1].trim().replace(/\s+/g, ' ');
  }

  let h1 = '';
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    h1 = h1Match[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
  }

  // Extract menu titles if possible
  let menuName = '';
  const activeMenu = html.match(/class=["'][^"']*(?:active|on|current)[^"']*["'][^>]*>([\s\S]*?)<\/(?:a|li|div|span)>/i);
  if (activeMenu) {
    menuName = activeMenu[1].replace(/<[^>]+>/g, '').trim();
  }

  return { title, h1, menuName };
}

function normalizeUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    u.hash = ''; // Remove fragments
    // keep path and search
    return u.toString();
  } catch (e) {
    return urlStr;
  }
}

async function crawl() {
  console.log('=== dbdbschool.kr URL Crawler Started ===');
  let count = 0;
  const maxPages = 300;

  while (queue.length > 0 && count < maxPages) {
    const rawUrl = queue.shift();
    const url = normalizeUrl(rawUrl);

    if (visited.has(url)) continue;
    visited.add(url);

    try {
      const parsed = new URL(url);
      if (!ALLOWED_HOSTS.includes(parsed.host)) continue;
      
      // Filter out static assets
      if (/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|pdf|hwp|xlsx?|zip)(\?.*)?$/i.test(parsed.pathname)) {
        continue;
      }

      count++;
      process.stdout.write(`[${count}] Crawling: ${url}\n`);

      const res = await fetchPage(url);

      if (res.redirectUrl) {
        const redirected = normalizeUrl(res.redirectUrl);
        results.push({
          url,
          statusCode: res.statusCode,
          redirectUrl: redirected,
          title: `[Redirect -> ${redirected}]`,
          pathname: parsed.pathname
        });
        if (!visited.has(redirected)) {
          queue.push(redirected);
        }
        continue;
      }

      if (res.error) {
        results.push({
          url,
          error: res.error,
          pathname: parsed.pathname
        });
        continue;
      }

      const info = extractPageInfo(res.body || '', url);
      results.push({
        url,
        statusCode: res.statusCode,
        title: info.title || info.h1 || info.menuName || '제목 없음',
        h1: info.h1,
        pathname: parsed.pathname
      });

      const extracted = extractLinks(res.body || '', url);
      for (const link of extracted) {
        const norm = normalizeUrl(link);
        try {
          const p = new URL(norm);
          if (ALLOWED_HOSTS.includes(p.host) && !visited.has(norm)) {
            queue.push(norm);
          }
        } catch (e) {}
      }

      // Small delay to be polite
      await new Promise(r => setTimeout(r, 100));

    } catch (e) {
      console.error('Error crawling:', url, e.message);
    }
  }

  console.log(`\nCrawling finished! Total URLs explored: ${results.length}`);

  // Create scratch dir if needed
  const outDir = path.join(__dirname);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Save JSON
  const jsonPath = path.join(outDir, 'dbdbschool_urls.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), 'utf-8');

  // 2. Save Markdown
  const mdPath = path.join(outDir, 'dbdbschool_sitemap.md');
  let md = '# dbdbschool (sn/3267) 사이트맵 & 전체 URL 조사 결과\n\n';
  md += `> 조사 일시: ${new Date().toISOString()}\n`;
  md += `> 총 수집 페이지: ${results.length} 개\n\n`;

  md += '## 1. 학교(sn/3267) 주요 모듈별 페이지 목록\n\n';
  md += '| 모듈 / 분류 | 페이지 제목 | URL 경로 | Next.js 라우트 매핑 제안 |\n';
  md += '|---|---|---|---|\n';

  // Group by module
  const schoolPages = results.filter(r => r.url.includes('/sn/3267') || r.pathname.includes('/3267'));
  const otherPages = results.filter(r => !r.url.includes('/sn/3267') && !r.pathname.includes('/3267'));

  for (const item of schoolPages) {
    const u = new URL(item.url);
    const pathParts = u.pathname.split('/').filter(Boolean);
    const nextRoute = `/app${u.pathname.replace('/sn/3267', '/sn/[school_id]')}/page.tsx`;
    md += `| \`${pathParts[1] || 'root'}\` | ${item.title || '-'} | [${u.pathname + u.search}](${item.url}) | \`${nextRoute}\` |\n`;
  }

  if (otherPages.length > 0) {
    md += '\n## 2. 공통 / 기타 페이지\n\n';
    md += '| 페이지 제목 | URL | 상태 |\n';
    md += '|---|---|---|\n';
    for (const item of otherPages) {
      md += `| ${item.title || '-'} | [${item.url}](${item.url}) | ${item.statusCode || item.error || '-'} |\n`;
    }
  }

  fs.writeFileSync(mdPath, md, 'utf-8');
  console.log(`Saved results to:\n- ${jsonPath}\n- ${mdPath}`);
}

crawl();
