const { encrypt } = require("../dist/passken.cjs");

const password = "mySecret!/;6[à}Pwd";
const secret = "mySuperFancySecret";
// const objectPassword = { password };
// const regexPassword = /mySecret!\/;6\[à}Pwd/;
// const booleanPassword = true;
const hashedPassword = encrypt(password, secret); // Using the same saltRounds as in the encrypt function

test('returns a string when password and secret are valid', () => {
  expect(typeof encrypt(password, secret)).toBe('string');
});

test('returns false when password is empty', () => {
  expect(encrypt('', secret)).toBe(false);
});

test('returns false when secret is empty', () => {
  expect(encrypt(password, '')).toBe(false);
});

test('returns false when password is not a string', () => {
  expect(encrypt(123, secret)).toBe(false);
});

test('returns false when secret is not a string', () => {
  expect(encrypt(password, 123)).toBe(false);
});

test('generates different hashes for the same password and secret', () => {
  const hash1 = encrypt(password, secret);
  const hash2 = encrypt(password, secret);
  expect(hash1).not.toBe(hash2);
});