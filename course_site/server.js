// server.js
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const { hashPassword } = require('./utils/hash');

const app = express();
app.use(express.json());

const {
  SPREADSHEET_ID,
  SHEET_NAME,
  JWT_SECRET,
  APPS_SCRIPT_URL
} = process.env;

// POST /api/login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password required' });

  // Query Google Apps Script for user row by email
  try {
    const url = `${APPS_SCRIPT_URL}?spreadsheetId=${encodeURIComponent(SPREADSHEET_ID)}&sheetName=${encodeURIComponent(SHEET_NAME)}&email=${encodeURIComponent(email)}`;
    const gsRes = await fetch(url);
    const user = await gsRes.json();

    if (!user || !user.email) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Hash incoming password with stored salt
    const hash = hashPassword(password, user.salt);

    if (hash !== user.passwordHash) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // JWT payload
    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '2h' });

    return res.json({
      success: true,
      token,
      role: user.role,
      username: user.username
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Serve static files (for index.html, login.js)
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)); 