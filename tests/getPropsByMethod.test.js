import { Entity } from '../dist/antity.js';

describe('Entity.getPropsByMethod', () => {
  let entity;
  
  beforeEach(() => {
    entity = new Entity('users', [
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
        key: 'email',
        type: 'email',
        min: 5,
        max: 255,
        typeCheck: true,
        need: ['POST', 'PUT'],
        send: true,
        sanitizer: null,
        normalizer: val => val.toLowerCase(),
        validator: null
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
      },
      {
        key: 'firstName',
        type: 'string',
        min: 1,
        max: 100,
        typeCheck: true,
        need: ['POST', 'PUT', 'PATCH'],
        send: true,
        sanitizer: null,
        normalizer: val => val.trim(),
        validator: null
      },
      {
        key: 'age',
        type: 'integer',
        min: 0,
        max: 120,
        typeCheck: true,
        need: ['PATCH'],
        send: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      }
    ]);
  });
  
  test('should return properties needed for POST method', () => {
    const props = entity.getPropsByMethod('POST');
    expect(props).toHaveLength(3);
    expect(props).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'email' }),
        expect.objectContaining({ key: 'password' }),
        expect.objectContaining({ key: 'firstName' })
      ])
    );
  });

  test('should return properties needed for PUT method', () => {
    const props = entity.getPropsByMethod('PUT');
    expect(props).toHaveLength(3);
    expect(props).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'id' }),
        expect.objectContaining({ key: 'email' }),
        expect.objectContaining({ key: 'firstName' })
      ])
    );
  });

  test('should return properties needed for PATCH method', () => {
    const props = entity.getPropsByMethod('PATCH');
    expect(props).toHaveLength(3);
    expect(props).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'id' }),
        expect.objectContaining({ key: 'firstName' }),
        expect.objectContaining({ key: 'age' })
      ])
    );
  });

  test('should return empty array when no properties are needed for a method', () => {
    // Create entity with no properties needed for PATCH
    const simpleEntity = new Entity('simple', [
      {
        key: 'name',
        type: 'string',
        min: 1,
        max: 100,
        typeCheck: true,
        need: ['POST'],
        send: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      }
    ]);
    
    const props = simpleEntity.getPropsByMethod('PATCH');
    expect(props).toHaveLength(0);
    expect(props).toEqual([]);
  });

  test('should correctly filter properties with multiple method requirements', () => {
    const props = entity.getPropsByMethod('POST');
    const emailProp = props.find(p => p.key === 'email');
    const firstNameProp = props.find(p => p.key === 'firstName');
    
    expect(emailProp).toBeDefined();
    expect(emailProp?.need).toContain('POST');
    expect(emailProp?.need).toContain('PUT');
    
    expect(firstNameProp).toBeDefined();
    expect(firstNameProp?.need).toContain('POST');
    expect(firstNameProp?.need).toContain('PUT');
    expect(firstNameProp?.need).toContain('PATCH');
  });
});
