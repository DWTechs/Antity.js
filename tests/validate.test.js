import { Entity } from '../dist/antity.js';

describe('Entity', () => {
  let entity;
  beforeEach(() => {
    entity = new Entity('persons', [
      {
        key: 'name',
        type: 'string',
        min: 1,
        max: 255,
        typeCheck: true,
        operations: ['insert'],
        required: true,
        safe: true,
        sanitize: true,
        normalize: true,
        control: true,
        sanitizer: null,
        normalizer: val => val.toLowerCase(),
        controller: null
      },
      {
        key: 'age',
        type: 'integer',
        min: 0,
        max: 120,
        typeCheck: true,
        operations: ['insert', 'update'],
        required: true,
        safe: true,
        sanitize: true,
        normalize: false,
        control: true,
        sanitizer: null,
        normalizer: null,
        controller: null
      },
      {
        key: 'token',
        type: 'jwt',
        min: 0,
        max: 120,
        typeCheck: true,
        operations: ['insert', 'update'],
        required: false,
        safe: true,
        sanitize: true,
        normalize: false,
        control: true,
        sanitizer: null,
        normalizer: null,
        controller: null
      },
    ]);
  });
  
  test('should validate a valid row with verb POST', () => {
    const rows = [{ name: 'John Doe', age: 30 }];
    const verb = 'POST';
    const result = entity.validate(rows, verb);
    expect(result).toBeNull();
  });

  test('should validate 2 valid rows with verb POST', () => {
    const rows = [{ name: 'John Doe', age: 30 }, { name: 'Jane Doe', age: 25 }];
    const verb = 'POST';
    const result = entity.validate(rows, verb);
    expect(result).toBeNull();
  });

  test('should return error message for missing required field', () => {
    const rows = [{ age: 30 }];
    const verb = 'POST';
    const result = entity.validate(rows, verb);
    expect(result).toBe('Missing name');
  });

  test('should return error message for invalid field type', () => {
    const rows = [{ name: 'John Doe', age: 'thirty' }];
    const verb = 'POST';
    const result = entity.validate(rows, verb);
    expect(result).toBe('Invalid age, must be of type integer');
  });

});
