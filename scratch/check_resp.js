const http = require('http');

http.get('http://localhost:3005/af/ad_faq/main/sn/3267', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const helpLinks = (data.match(/\/help\/go_data\/num\//g) || []).length;
    const loadingMatches = (data.match(/로딩 중/g) || []).length;
    console.log('Total /help/go_data/num/ links in HTTP response:', helpLinks);
    console.log('Total "로딩 중" in HTTP response:', loadingMatches);
    console.log('Has panel_ad_faq_main:', data.includes('id="panel_ad_faq_main"'));
    const m = data.match(/id="panel_ad_faq_main"[^>]*style="([^"]*)"/);
    console.log('panel_ad_faq_main style:', m ? m[1] : 'none');
  });
}).on('error', console.error);
