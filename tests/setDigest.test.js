const { setDigest, getDigest } = require("../dist/passken.cjs");

test('sets the digest correctly', () => {
  const digest = 'sha512';
  setDigest(digest);
  expect(getDigest()).toBe(digest);
});

test('returns false when setting an invalid digest', () => {
  expect(setDigest('invalidDigest')).toBe(false);
});

test('returns false when setting a null or undefined digest', () => {
  expect(setDigest(null)).toBe(false);
  expect(setDigest(undefined)).toBe(false);
});

test('returns false when setting a non-string digest', () => {
  expect(setDigest(123)).toBe(false);
});