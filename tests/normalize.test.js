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
        verbs: ['POST', 'PATCH'],
        required: true,
        sanitize: true,
        normalize: false,
        control: true,
        sanitizer: null,
        normalizer: null,
        controller: null
      }
    ]);
  });
  
  test('should apply normalizer', () => {
    const rows = [{ name: 'JOHN DOE', age: 30 }];
    entity.normalize(rows);
    expect(rows[0].name).toBe('john doe');
  });

  test('should apply sanitizer', () => {
    const rows = [{ name: ' john doe ', age: 30 }];
    entity.normalize(rows);
    expect(rows[0].name).toBe('john doe');
  });

  test('should apply sanitizer and normalizer', () => {
    const rows = [{ name: ' JOHN doe ', age: 30 }];
    entity.normalize(rows);
    expect(rows[0].name).toBe('john doe');
  });
});
