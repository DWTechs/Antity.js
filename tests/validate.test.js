import { Entity } from '../dist/antity.js';

describe('Entity', () => {
  let entity;
  beforeEach(() => {
    entity = new Entity('Person', 'persons', [
      {
        key: 'name',
        type: 'string',
        min: 1,
        max: 255,
        typeCheck: true,
        verbs: ['POST'],
        required: true,
        sanitize: true,
        normalize: false,
        control: true,
        sanitizer: null,
        normalizer: val => val.toLowerCase(),
        controller: null
      },
      {
        key: 'age',
        type: 'number',
        min: 0,
        max: 120,
        typeCheck: true,
        verbs: ['POST', 'PATCH'],
        required: true,
        sanitize: false,
        normalize: false,
        control: true,
        sanitizer: null,
        normalizer: null,
        controller: null
      }
    ]);
  });
  
  test('should validate a valid row with verb POST', () => {
    const rows = [{ name: 'John Doe', age: 30 }];
    const verb = 'POST';
    const result = entity.validate(rows, verb);
    expect(result).toBeNull();
  });

  test('should return error message for missing required field', () => {
    const rows = [{ age: 30 }];
    const verb = 'POST';
    const result = entity.validate(rows, verb);
    expect(result).toBe('The field name is missing.');
  });

  test('should return error message for invalid field type', () => {
    const rows = [{ name: 'John Doe', age: 'thirty' }];
    const verb = 'POST';
    const result = entity.validate(rows, verb);
    expect(result).toBe('The field age is invalid.');
  });

  test('should apply sanitizer and normalizer', () => {
    const rows = [{ name: ' JOHN DOE ', age: 30 }];
    const verb = 'POST';
    entity.validate(rows, verb);
    expect(rows[0].name).toBe('john doe');
  });
});
