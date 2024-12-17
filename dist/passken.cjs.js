/*
MIT License

Copyright (c) 2022 DWTechs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/DWTechs/Passken.js
*/

'use strict';

var node_crypto = require('node:crypto');

/*
MIT License

Copyright (c) 2009 DWTechs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/DWTechs/Checkard.js
*/

function getTag(t) {
  return t == null ? t === undefined ? '[object Undefined]' : '[object Null]' : toString.call(t);
}

function isBoolean(b) {
  return typeof b === "boolean";
}
function isString(s, required) {
  return typeof s === "string" && (!!s );
}
function isNumber(n, type) {
  return !isSymbol(n) && !((n === null || n === void 0 ? void 0 : n.constructor) === Array) && (Number(n) === n );
}
function isSymbol(s) {
  var type = typeof s;
  return type === 'symbol' || type === 'object' && s != null && getTag(s) === '[object Symbol]';
}
function isInteger(n, type) {
  if (!isNumber(n)) return false;
  var _int = Number.parseInt(String(n), 10);
  return n === _int ;
}
function isValidInteger(n, min, max, type) {
  if (min === void 0) {
    min = -999999999;
  }
  if (max === void 0) {
    max = 999999999;
  }
  return isInteger(n) && n >= min && n <= max;
}

const digests = node_crypto.getHashes();
let digest = "sha256";
let keyLen = 64;
let saltRnds = 12;
function getSaltRounds() {
    return saltRnds;
}
function setSaltRounds(rnds) {
    if (!isValidInteger(rnds, 12, 100))
        return false;
    saltRnds = rnds;
    return saltRnds;
}
function getKeyLen() {
    return keyLen;
}
function setKeyLen(len) {
    if (!isValidInteger(len, 2, 256))
        return false;
    keyLen = len;
    return keyLen;
}
function getDigest() {
    return digest;
}
function setDigest(func) {
    if (!digests.includes(func))
        return false;
    digest = func;
    return digest;
}
function getDigests() {
    return digests;
}
function hash(pwd, secret) {
    return node_crypto.createHmac(digest, secret).update(pwd).digest("hex");
}
function pbkdf2(pwd, secret, salt) {
    return node_crypto.pbkdf2Sync(hash(pwd, secret), salt, saltRnds, keyLen, digest).toString("hex");
}
function encrypt(pwd, secret) {
    if (!isString(pwd) || !isString(secret))
        return false;
    const salt = node_crypto.randomBytes(16).toString('hex');
    return salt + pbkdf2(pwd, secret, salt);
}
function compare(pwd, hash, secret) {
    if (!isString(pwd) || !isString(secret))
        return false;
    const hashedPwd = pbkdf2(pwd, secret, hash.slice(0, 32));
    const storedHash = hash.slice(32);
    return hashedPwd === storedHash;
}

const defOpts = {
    len: 12,
    num: true,
    ucase: true,
    lcase: true,
    sym: false,
    strict: true,
    exclSimilarChars: true,
};
const list = {
    lcase: 'abcdefghijklmnopqrstuvwxyz',
    ucase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    num: '0123456789',
    sym: '!@#$%&*_-+:;?><,./',
};
function create(opts = defOpts) {
    const len = isValidInteger(opts.len, 12, 64) ? opts.len : defOpts.len;
    const num = isBoolean(opts.num) ? opts.num : defOpts.num;
    const ucase = isBoolean(opts.ucase) ? opts.ucase : defOpts.ucase;
    const sym = isBoolean(opts.sym) ? opts.sym : defOpts.sym;
    const strict = isBoolean(opts.strict) ? opts.strict : defOpts.strict;
    const exclSimilarChars = opts.exclSimilarChars ? opts.exclSimilarChars : defOpts.exclSimilarChars;
    let lcase = isBoolean(opts.lcase) ? opts.lcase : defOpts.lcase;
    if (!lcase && !num)
        lcase = true;
    const chars = [];
    if (lcase)
        chars.push(...list.lcase);
    if (ucase)
        chars.push(...list.ucase);
    if (num)
        chars.push(...list.num);
    if (sym)
        chars.push(...list.sym);
    if (exclSimilarChars) {
        chars.splice(chars.indexOf('l'), 1);
        chars.splice(chars.indexOf('I'), 1);
        chars.splice(chars.indexOf('1'), 1);
        chars.splice(chars.indexOf('o'), 1);
        chars.splice(chars.indexOf('O'), 1);
        chars.splice(chars.indexOf('0'), 1);
    }
    if (strict) {
        const pwd = [];
        if (lcase)
            pwd.push(getRandChar(list.lcase));
        if (ucase)
            pwd.push(getRandChar(list.ucase));
        if (num)
            pwd.push(getRandChar(list.num));
        if (sym)
            pwd.push(getRandChar(list.sym));
        for (let i = pwd.length; i < len; i++) {
            pwd.push(getRandChar(chars.join('')));
        }
        return shuffleArray(pwd).join('');
    }
    return Array(len)
        .fill(null)
        .map(() => getRandChar(chars.join('')))
        .join('');
}
function getRandChar(str) {
    return str.charAt(Math.floor(Math.random() * str.length));
}
function shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

exports.compare = compare;
exports.create = create;
exports.encrypt = encrypt;
exports.getDigest = getDigest;
exports.getDigests = getDigests;
exports.getKeyLen = getKeyLen;
exports.getSaltRounds = getSaltRounds;
exports.setDigest = setDigest;
exports.setKeyLen = setKeyLen;
exports.setSaltRounds = setSaltRounds;
