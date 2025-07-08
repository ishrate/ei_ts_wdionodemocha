// Usage: node encrypt-secret.js "yourPassword" "yourSecretKey"
const crypto = require('crypto');

const password = process.argv[2];
const secret = process.argv[3];

if (!password || !secret) {
  console.error('Usage: node encrypt-secret.js "yourPassword" "yourSecretKey"');
  process.exit(1);
}

const iv = crypto.randomBytes(16);
const key = crypto.createHash('sha256').update(secret).digest();
const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
let encrypted = cipher.update(password, 'utf8', 'base64');
encrypted += cipher.final('base64');
const result = iv.toString('base64') + ':' + encrypted;
console.log(result);
