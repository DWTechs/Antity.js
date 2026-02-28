import { Entity } from '../dist/antity';

describe('Entity properties getter', () => {
  it('should return all Property instances with their core properties', () => {
    const properties = [
      {
        key: 'id',
        type: 'integer',
        min: 1,
        max: 999999999,
        typeCheck: true,
        need: ['PUT', 'PATCH'],
        send: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'name',
        type: 'string',
        min: 1,
        max: 255,
        typeCheck: true,
        need: ['POST', 'PUT'],
        send: true,
        sanitizer: null,
        normalizer: val => val.trim(),
        validator: null
      },
      {
        key: 'email',
        type: 'email',
        min: 5,
        max: 255,
        typeCheck: true,
        need: ['POST'],
        send: true,
        sanitizer: null,
        normalizer: val => val.toLowerCase(),
        validator: null
      }
    ];
    
    const entity = new Entity('users', properties);
    const props = entity.properties;
    
    expect(props).toHaveLength(3);
    expect(props[0].key).toBe('id');
    expect(props[0].type).toBe('integer');
    expect(props[0].need).toEqual(['PUT', 'PATCH']);
    expect(props[1].key).toBe('name');
    expect(props[1].normalizer).toBeDefined();
    expect(props[2].key).toBe('email');
    expect(props[2].type).toBe('email');
  });

  it('should preserve custom fields added to properties', () => {
    const properties = [
      {
        key: 'id',
        type: 'integer',
        min: 1,
        max: 999999999,
        typeCheck: true,
        need: ['PUT'],
        send: true,
        sanitizer: null,
        normalizer: null,
        validator: null,
        customField: 42,
        metadata: {
          description: 'Unique identifier',
          example: 123
        }
      },
      {
        key: 'name',
        type: 'string',
        min: 1,
        max: 255,
        typeCheck: true,
        need: ['POST'],
        send: true,
        sanitizer: null,
        normalizer: null,
        validator: null,
        extra: 'customValue',
        isSearchable: true
      }
    ];
    
    const entity = new Entity('test', properties);
    const props = entity.properties;
    
    expect(props).toHaveLength(2);
    expect(props[0].key).toBe('id');
    expect(props[0].customField).toBe(42);
    expect(props[0].metadata).toEqual({
      description: 'Unique identifier',
      example: 123
    });
    expect(props[1].key).toBe('name');
    expect(props[1].extra).toBe('customValue');
    expect(props[1].isSearchable).toBe(true);
  });

  it('should return properties with correct types and configurations', () => {
    const properties = [
      {
        key: 'age',
        type: 'integer',
        min: 0,
        max: 120,
        typeCheck: true,
        need: ['POST', 'PUT'],
        send: true,
        sanitizer: null,
        normalizer: null,
        validator: val => val >= 18
      },
      {
        key: 'password',
        type: 'password',
        min: 8,
        max: 64,
        typeCheck: true,
        need: ['POST'],
        send: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      }
    ];
    
    const entity = new Entity('users', properties);
    const props = entity.properties;
    
    expect(props[0].type).toBe('integer');
    expect(props[0].validator).toBeDefined();
    expect(props[1].send).toBe(false);
    expect(props[1].type).toBe('password');
  });
});
