import { Entity } from '../dist/antity';

describe('Entity properties getter', () => {
  it('should return all Property instances, including custom fields', () => {
    const properties = [
      {
        key: 'id',
        type: 'number',
        min: 0,
        max: 100,
        required: true,
        safe: true,
        typeCheck: true,
        methods: ['GET'],
        sanitize: true,
        normalize: false,
        validate: true,
        sanitizer: null,
        normalizer: null,
        validator: null,
        customField: 42
      },
      {
        key: 'name',
        type: 'string',
        min: 1,
        max: 255,
        required: true,
        safe: true,
        typeCheck: true,
        methods: ['POST'],
        sanitize: true,
        normalize: true,
        validate: true,
        sanitizer: null,
        normalizer: null,
        validator: null,
        extra: 'customValue'
      }
    ];
    const entity = new Entity('test', properties);
    const props = entity.properties;
    expect(props).toHaveLength(2);
    expect(props[0].key).toBe('id');
    expect(props[0].customField).toBe(42);
    expect(props[1].key).toBe('name');
    expect(props[1].extra).toBe('customValue');
  });
});
