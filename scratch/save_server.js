const http = require('http');
const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, 'target.html');
const cookiesPath = path.resolve(__dirname, '..', 'auth.json');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/save') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                if (data.html) {
                    fs.writeFileSync(targetPath, data.html, 'utf-8');
                    console.log(`[save_server] target.html saved (${data.html.length} chars)`);
                }
                if (data.cookies) {
                    console.log(`[save_server] Cookies received: ${data.cookies.length}`);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, length: data.html ? data.html.length : 0 }));
            } catch (err) {
                console.error('[save_server] Error parsing body:', err);
                res.writeHead(500);
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    res.writeHead(404);
    res.end('Not found');
});

const PORT = 3009;
server.listen(PORT, () => {
    console.log(`[save_server] Listening on http://localhost:${PORT}`);
});
