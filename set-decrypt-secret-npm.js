// set-decrypt-secret-npm.js
// Node.js script to set DECRYPT_SECRET for npm scripts (cross-platform)
// Usage: Set DECRYPT_SECRET_NPM or pass as first argument

const secret = process.env.DECRYPT_SECRET_NPM || process.argv[2];
if (!secret) {
  console.error('ERROR: You must provide the secret as DECRYPT_SECRET_NPM env variable or as the first argument.');
  process.exit(1);
}
process.env.DECRYPT_SECRET = secret;
console.log('DECRYPT_SECRET set for this npm script run.');
// This script is meant to be run with `&&` before your test command in npm scripts.
