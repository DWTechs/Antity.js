import { create } from "../dist/passken.cjs";

test('should return a string', () => {
  const password = create();
  expect(typeof password).toBe('string');
});

test('should return a password of the correct length', () => {
  const length = 12;
  const password = create({ len: length });
  expect(password.length).toBe(length);
});

test('should include lowercase letters', () => {
  const password = create({ lcase: true });
  expect(/[a-z]/.test(password)).toBe(true);
});

test('should include uppercase letters', () => {
  const password = create({ ucase: true });
  expect(/[A-Z]/.test(password)).toBe(true);
});

test('should include numbers', () => {
  const password = create({ num: true });
  expect(/[0-9]/.test(password)).toBe(true);
});

test('should include symbols', () => {
  const password = create({ sym: true });
  expect(/[^a-zA-Z0-9]/.test(password)).toBe(true);
});

test('should exclude similar characters', () => {
  const password = create({ exclSimilarChars: true });
  expect(!/[lI1oO0]/.test(password)).toBe(true);
});

test('should generate a password with at least one of each required character type', () => {
  const password = create({ strict: true, lcase: true, ucase: true, num: true, sym: true });
  expect(/[a-z]/.test(password)).toBe(true);
  expect(/[A-Z]/.test(password)).toBe(true);
  expect(/[0-9]/.test(password)).toBe(true);
  expect(/[^a-zA-Z0-9]/.test(password)).toBe(true);
});

test('should generate a password with random characters', () => {
  const password1 = create();
  const password2 = create();
  expect(password1).not.toBe(password2);
});
