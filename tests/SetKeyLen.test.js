const { setKeyLen, getKeyLen } = require("../dist/passken.cjs");


test('sets the key length correctly', () => {
  const keyLen = 24;
  setKeyLen(keyLen);
  expect(getKeyLen()).toBe(keyLen);
});

test('sets the key length at the upper limit', () => {
  const keyLen = 256;
  setKeyLen(keyLen);
  expect(getKeyLen()).toBe(keyLen);
});

test('sets the key length at the lower limit', () => {
  const keyLen = 2;
  setKeyLen(keyLen);
  expect(getKeyLen()).toBe(keyLen);
});

test('returns false when setting an invalid number key length', () => {
  expect(setKeyLen(0)).toBe(false);
  expect(setKeyLen(-1)).toBe(false);
  expect(setKeyLen(1)).toBe(false);
  expect(setKeyLen(257)).toBe(false);
  expect(setKeyLen(3.5)).toBe(false);
});

test('returns false when setting a null or undefined key length', () => {
  expect(setKeyLen(null)).toBe(false);
  expect(setKeyLen(undefined)).toBe(false);
});


test('returns false when setting a non-number key length', () => {
  expect(setKeyLen('32')).toBe(false);
});