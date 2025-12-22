import { Entity } from '../dist/antity.js';
import { normalizeName } from '@dwtechs/checkard';

describe('Entity.normalizeOne', () => {
  let entity;
  let req;
  let next;

  beforeEach(() => {
    entity = new Entity('person', [
      {
        key: 'name',
        type: 'string',
        min: 1,
        max: 255,
        typeCheck: true,
        methods: ['POST'],
        required: true,
        safe: true,
        sanitize: true,
        normalize: true,
        validate: true,
        sanitizer: null,
        normalizer: val => normalizeName(val),
        validator: null
      },
      {
        key: 'address',
        type: 'string',
        min: 1,
        max: 255,
        typeCheck: true,
        methods: ['POST'],
        required: true,
        safe: true,
        sanitize: true,
        normalize: true,
        validate: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'city',
        type: 'string',
        min: 1,
        max: 255,
        typeCheck: true,
        methods: ['POST'],
        required: true,
        safe: true,
        sanitize: false,
        normalize: true,
        validate: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'age',
        type: 'integer',
        min: 0,
        max: 120,
        typeCheck: true,
        methods: ['POST', 'PUT'],
        required: true,
        safe: true,
        sanitize: true,
        normalize: false,
        validate: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'normalizedAge',
        type: 'integer',
        min: 0,
        max: 120,
        typeCheck: true,
        methods: ['POST', 'PUT'],
        required: true,
        safe: true,
        sanitize: true,
        normalize: true,
        validate: true,
        sanitizer: null,
        normalizer: val => Math.floor(val),
        validator: null
      }
    ]);

    req = {
      body: {
        name: ' john Doe ',
        address: ' 45 backer street',
        city: ' new York',
        age: 30.5,
        normalizedAge: 30.5
      }
    };
    next = jest.fn();
  });

  it('should call next without error if record is present and valid in the request body', () => {
    entity.normalizeOne(req, null, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with an error if data is not present in the request body', () => {
    req.body = null;
    entity.normalizeOne(req, null, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Normalize: no data found in request body'
    });
  });

  it('should normalize and sanitize properties based on the normalizer function', () => {
    entity.normalizeOne(req, null, next);
    expect(req.body.name).toBe('John Doe');
    expect(req.body.address).toBe('45 backer street');
    expect(req.body.normalizedAge).toBe(30);
    expect(next).toHaveBeenCalledWith();
  });

  it('should not sanitize properties when sanitize = false', () => {
    entity.normalizeOne(req, null, next);
    expect(req.body.city).toBe(' new York');
    expect(next).toHaveBeenCalled();
  });

  it('should skip normalization for properties without a normalizer function', () => {
    entity.normalizeOne(req, null, next);
    expect(req.body.age).toBe(30.5);
    expect(next).toHaveBeenCalled();
  });

});
