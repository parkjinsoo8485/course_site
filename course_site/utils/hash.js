const crypto = require('crypto');

/**
 * Hashes a password with a salt using SHA-256 and returns base64.
 * @param {string} password
 * @param {string} salt
 * @returns {string} base64 hash
 */
function hashPassword(password, salt) {
  const hash = crypto.createHash('sha256');
  hash.update(password + salt);
  return hash.digest('base64');
}

module.exports = { hashPassword }; 