import { Entity } from '../dist/antity';

describe('Entity unsafeProps getter', () => {
  it('should return an empty array when all properties have isPrivate: false', () => {
    const properties = [
      {
        key: 'id',
        type: 'integer',
        min: 1,
        max: 999999999,
        isTypeChecked: true,
        requiredFor: ['PUT', 'PATCH'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'name',
        type: 'string',
        min: 1,
        max: 255,
        isTypeChecked: true,
        requiredFor: ['POST', 'PUT'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'email',
        type: 'email',
        min: 5,
        max: 255,
        isTypeChecked: true,
        requiredFor: ['POST'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      }
    ];
    
    const entity = new Entity('users', properties);
    const unsafe = entity.unsafeProps;
    
    expect(unsafe).toEqual([]);
    expect(unsafe).toHaveLength(0);
  });

  it('should return all property keys when all properties have isPrivate: true', () => {
    const properties = [
      {
        key: 'password',
        type: 'string',
        min: 8,
        max: 255,
        isTypeChecked: true,
        requiredFor: ['POST', 'PUT'],
        isPrivate: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'token',
        type: 'string',
        min: 10,
        max: 500,
        isTypeChecked: true,
        requiredFor: ['POST'],
        isPrivate: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'ssn',
        type: 'string',
        min: 9,
        max: 11,
        isTypeChecked: true,
        requiredFor: ['POST'],
        isPrivate: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      }
    ];
    
    const entity = new Entity('secure', properties);
    const unsafe = entity.unsafeProps;
    
    expect(unsafe).toEqual(['password', 'token', 'ssn']);
    expect(unsafe).toHaveLength(3);
  });

  it('should return only property keys where isPrivate is true in mixed scenario', () => {
    const properties = [
      {
        key: 'id',
        type: 'integer',
        min: 1,
        max: 999999999,
        isTypeChecked: true,
        requiredFor: ['PUT', 'PATCH'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'username',
        type: 'string',
        min: 3,
        max: 50,
        isTypeChecked: true,
        requiredFor: ['POST', 'PUT'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'password',
        type: 'string',
        min: 8,
        max: 255,
        isTypeChecked: true,
        requiredFor: ['POST', 'PUT'],
        isPrivate: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'email',
        type: 'email',
        min: 5,
        max: 255,
        isTypeChecked: true,
        requiredFor: ['POST'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'secretKey',
        type: 'string',
        min: 16,
        max: 64,
        isTypeChecked: true,
        requiredFor: ['POST'],
        isPrivate: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      }
    ];
    
    const entity = new Entity('users', properties);
    const unsafe = entity.unsafeProps;
    
    expect(unsafe).toEqual(['password', 'secretKey']);
    expect(unsafe).toHaveLength(2);
    expect(unsafe).not.toContain('id');
    expect(unsafe).not.toContain('username');
    expect(unsafe).not.toContain('email');
  });

  it('should return an empty array when no properties are provided', () => {
    const properties = [];
    
    const entity = new Entity('empty', properties);
    const unsafe = entity.unsafeProps;
    
    expect(unsafe).toEqual([]);
    expect(unsafe).toHaveLength(0);
  });

  it('should return correct unsafe properties when only one property has isPrivate: true', () => {
    const properties = [
      {
        key: 'id',
        type: 'integer',
        min: 1,
        max: 999999999,
        isTypeChecked: true,
        requiredFor: ['PUT'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'internalCode',
        type: 'string',
        min: 1,
        max: 50,
        isTypeChecked: true,
        requiredFor: ['POST'],
        isPrivate: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      }
    ];
    
    const entity = new Entity('items', properties);
    const unsafe = entity.unsafeProps;
    
    expect(unsafe).toEqual(['internalCode']);
    expect(unsafe).toHaveLength(1);
  });

  it('should maintain the order of unsafe properties as they appear in the properties array', () => {
    const properties = [
      {
        key: 'field1',
        type: 'string',
        min: 1,
        max: 100,
        isTypeChecked: true,
        requiredFor: ['POST'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'field2',
        type: 'string',
        min: 1,
        max: 100,
        isTypeChecked: true,
        requiredFor: ['POST'],
        isPrivate: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'field3',
        type: 'string',
        min: 1,
        max: 100,
        isTypeChecked: true,
        requiredFor: ['POST'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'field4',
        type: 'string',
        min: 1,
        max: 100,
        isTypeChecked: true,
        requiredFor: ['POST'],
        isPrivate: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'field5',
        type: 'string',
        min: 1,
        max: 100,
        isTypeChecked: true,
        requiredFor: ['POST'],
        isPrivate: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      }
    ];
    
    const entity = new Entity('test', properties);
    const unsafe = entity.unsafeProps;
    
    expect(unsafe).toEqual(['field2', 'field4', 'field5']);
    expect(unsafe[0]).toBe('field2');
    expect(unsafe[1]).toBe('field4');
    expect(unsafe[2]).toBe('field5');
  });

  it('should return an array (not modify the internal array reference)', () => {
    const properties = [
      {
        key: 'secret',
        type: 'string',
        min: 1,
        max: 100,
        isTypeChecked: true,
        requiredFor: ['POST'],
        isPrivate: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      }
    ];
    
    const entity = new Entity('test', properties);
    const unsafe1 = entity.unsafeProps;
    const unsafe2 = entity.unsafeProps;
    
    expect(unsafe1).toEqual(['secret']);
    expect(unsafe2).toEqual(['secret']);
    expect(unsafe1).toBe(unsafe2); // Should return the same reference
  });

  it('should work correctly with various property types', () => {
    const properties = [
      {
        key: 'count',
        type: 'integer',
        min: 0,
        max: 1000,
        isTypeChecked: true,
        requiredFor: ['POST'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'apiKey',
        type: 'string',
        min: 20,
        max: 100,
        isTypeChecked: true,
        requiredFor: ['POST'],
        isPrivate: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'isActive',
        type: 'boolean',
        min: null,
        max: null,
        isTypeChecked: true,
        requiredFor: ['POST', 'PUT'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'internalId',
        type: 'integer',
        min: 1,
        max: 999999,
        isTypeChecked: true,
        requiredFor: ['POST'],
        isPrivate: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      }
    ];
    
    const entity = new Entity('mixed', properties);
    const unsafe = entity.unsafeProps;
    
    expect(unsafe).toEqual(['apiKey', 'internalId']);
    expect(unsafe).toHaveLength(2);
  });
});
