import { Entity, Property, STANDARD_PROP_KEYS } from '../dist/antity';

describe('Entity.createProperty', () => {
  it('should default readOnly to false when omitted', () => {
    const properties = [
      {
        key: 'name',
        type: 'string',
        min: 1,
        max: 255,
        isTypeChecked: true,
        requiredFor: [],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      }
    ];

    const entity = new Entity('users', properties);

    expect(entity.properties[0].readOnly).toBe(false);
  });

  it('should keep readOnly: true when provided', () => {
    const properties = [
      {
        key: 'lastLoginAt',
        type: 'date',
        min: null,
        max: null,
        isTypeChecked: true,
        requiredFor: [],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null,
        readOnly: true
      }
    ];

    const entity = new Entity('pwd', properties);

    expect(entity.properties[0].readOnly).toBe(true);
  });

  it('should be overridable by a subclass to construct its own Property subclass', () => {
    class CustomProperty extends Property {
      constructor(...args) {
        super(...args);
        this.isCustom = true;
      }
    }

    class CustomEntity extends Entity {
      createProperty(p) {
        return new CustomProperty(
          p.key,
          p.type,
          p.min,
          p.max,
          p.isPrivate,
          p.requiredFor,
          p.isTypeChecked,
          p.readOnly,
          p.sanitizer,
          p.normalizer,
          p.validator,
        );
      }
    }

    const properties = [
      {
        key: 'id',
        type: 'integer',
        min: 1,
        max: 999999999,
        isTypeChecked: true,
        requiredFor: [],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      }
    ];

    const entity = new CustomEntity('items', properties);

    expect(entity.properties[0]).toBeInstanceOf(CustomProperty);
    expect(entity.properties[0].isCustom).toBe(true);
  });

  it('should still copy custom fields not in STANDARD_PROP_KEYS', () => {
    expect(STANDARD_PROP_KEYS.has('readOnly')).toBe(true);
    expect(STANDARD_PROP_KEYS.has('isFilterable')).toBe(false);

    const properties = [
      {
        key: 'id',
        type: 'integer',
        min: 1,
        max: 999999999,
        isTypeChecked: true,
        requiredFor: [],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null,
        isFilterable: true,
      }
    ];

    const entity = new Entity('items', properties);

    expect(entity.properties[0].isFilterable).toBe(true);
  });
});
