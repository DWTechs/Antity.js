const { setSaltRounds, getSaltRounds } = require("../dist/passken.cjs");

test('sets the salt rounds correctly', () => {
  const saltRounds = 14;
  setSaltRounds(saltRounds);
  expect(getSaltRounds()).toBe(saltRounds);
});

test('sets the salt rounds at the upper limit', () => {
  const saltRounds = 100;
  setSaltRounds(saltRounds);
  expect(getSaltRounds()).toBe(saltRounds);
});

test('sets the salt rounds at the lower limit', () => {
  const saltRounds = 12;
  setSaltRounds(saltRounds);
  expect(getSaltRounds()).toBe(saltRounds);
});

test('returns false when setting an invalid number salt rounds', () => {
  expect(setSaltRounds(0)).toBe(false);
  expect(setSaltRounds(-1)).toBe(false);
  expect(setSaltRounds(1)).toBe(false);
  expect(setSaltRounds(101)).toBe(false);
  expect(setSaltRounds(3,5)).toBe(false);
});

test('returns false when setting a null or undefined salt rounds', () => {
  expect(setSaltRounds(null)).toBe(false);
  expect(setSaltRounds(undefined)).toBe(false);
});


test('returns false when setting a non-number salt rounds', () => {
  expect(setSaltRounds('32')).toBe(false);
});