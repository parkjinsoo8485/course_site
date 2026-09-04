const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function extractFromLiveChrome() {
    console.log('Connecting to Chrome on port 9222...');
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    console.log('Contexts found:', contexts.length);

    let targetPage = null;
    for (const ctx of contexts) {
        const pages = ctx.pages();
        for (const p of pages) {
            const url = p.url();
            console.log('Open tab URL:', url);
            if (url.includes('dbdbschool.kr') && url.includes('modifyField')) {
                targetPage = p;
                break;
            }
        }
        if (targetPage) break;
    }

    if (!targetPage) {
        console.log('modifyField page not found directly, looking for any dbdbschool tab...');
        for (const ctx of contexts) {
            for (const p of ctx.pages()) {
                if (p.url().includes('dbdbschool.kr')) {
                    targetPage = p;
                    console.log('Found dbdbschool tab, navigating to modifyField...');
                    await targetPage.goto('https://www.dbdbschool.kr/af/ad_lec/modifyField/p/1/sn/3267/sld/11/sof/ln/sot/asc', { waitUntil: 'domcontentloaded' });
                    break;
                }
            }
            if (targetPage) break;
        }
    }

    if (!targetPage) {
        console.error('No dbdbschool tab found in Chrome!');
        await browser.close();
        process.exit(1);
    }

    console.log('Extracting DOM from target page:', targetPage.url());
    const data = await targetPage.evaluate(() => {
        const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.outerHTML).join('\n');
        const contentsEl = document.querySelector('#contents') || document.querySelector('#content') || document.querySelector('form[name="fm_write"]') || document.body;
        return {
            styles,
            fullHtml: document.documentElement.outerHTML,
            bodyHtml: contentsEl ? contentsEl.outerHTML : document.body.outerHTML,
            url: window.location.href,
            title: document.title
        };
    });

    const targetHtmlPath = path.resolve('scratch/target.html');
    const fullContent = `<!-- Auto-extracted via CDP Port 9222 -->\n<!-- URL: ${data.url} -->\n<!-- Title: ${data.title} -->\n<!-- Extracted Time: ${new Date().toISOString()} -->\n\n<!-- Stylesheets -->\n${data.styles}\n\n<!-- Extracted DOM -->\n${data.bodyHtml}`;

    fs.writeFileSync(targetHtmlPath, fullContent, 'utf-8');
    console.log(`Successfully saved scratch/target.html (${fullContent.length} bytes)!`);

    // Also update auth.json with fresh storage_state
    const cookies = await targetPage.context().cookies();
    const authState = {
        cookies: cookies,
        origins: [
            {
                origin: "https://www.dbdbschool.kr",
                localStorage: []
            }
        ]
    };
    fs.writeFileSync('auth.json', JSON.stringify(authState, null, 2), 'utf-8');
    console.log(`Saved fresh auth.json with ${cookies.length} cookies!`);

    await targetPage.screenshot({ path: 'scratch/target.png' });
    console.log('Saved scratch/target.png!');
}

extractFromLiveChrome().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
