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
        methods: ['GET', 'POST', 'PUT'],
        required: true,
        safe: true,
        sanitize: true,
        normalize: true,
        validate: true,
        sanitizer: null,
        normalizer: val => val.toLowerCase(),
        validator: null
      },
      {
        key: 'age',
        type: 'integer',
        min: 0,
        max: 120,
        typeCheck: true,
        methods: ['GET', 'PUT'],
        required: true,
        safe: true,
        sanitize: true,
        normalize: false,
        validate: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      }
    ]);
  });
  
  test('should return proper props for GET', () => {
    const r = entity.getPropsByMethod("GET");
    expect(r).toHaveLength(2);
    expect(r).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'name' }),
        expect.objectContaining({ key: 'age' }),
      ])
    );
  });

  test('should return proper props for POST', () => {
    const r = entity.getPropsByMethod("POST");
    expect(r).toHaveLength(1);
    expect(r).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'name' }),
      ])
    );
  });

  test('should return proper props for PATCH', () => {
    const r = entity.getPropsByMethod("PATCH");
    expect(r).toHaveLength(0);
    expect(r).toEqual(
      expect.arrayContaining([])
    );
  });

  test('should return proper props for PUT', () => {
    const r = entity.getPropsByMethod("PUT");
    expect(r).toHaveLength(2);
    expect(r).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'name' }),
        expect.objectContaining({ key: 'age' }),
      ])
    );
  });
});
