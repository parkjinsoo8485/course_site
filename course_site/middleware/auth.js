const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const JWT_SECRET = process.env.JWT_SECRET || 'neulbom_saas_super_secret_jwt_key_2026';

// Auth Limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: '요청 시도가 너무 많습니다. 15분 후 다시 시도해 주세요.' }
});

// JWT Verification Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: '인증 토큰이 없습니다. 다시 로그인해 주세요.' });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(403).json({ success: false, message: '유효하지 않은 토큰이거나 만료되었습니다.' });
    }
    req.user = userPayload;
    next();
  });
};

module.exports = {
  JWT_SECRET,
  authLimiter,
  authenticateToken
};
