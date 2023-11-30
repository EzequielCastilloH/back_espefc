const crypto = require('crypto');
const { AES, enc } = require('crypto-js');

const SECRET_KEY = 'mzppMMIZMr9hjSS7DoZgxEeknkSvs6G9';
const IV = 'xQ/nmpr9YHMur5T1';
function encrypt(data) {
  const encrypted = AES.encrypt(data, enc.Utf8.parse(SECRET_KEY), { iv: enc.Utf8.parse(IV) });
  return encrypted.toString();
}

function decrypt(data) {
  const decrypted = AES.decrypt(data, enc.Utf8.parse(SECRET_KEY), { iv: enc.Utf8.parse(IV) });
  return decrypted.toString(enc.Utf8);
}

module.exports = { encrypt, decrypt };