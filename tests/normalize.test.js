import { Entity } from '../dist/antity.js';
import { normalizeName } from '@dwtechs/checkard';

describe('Entity.normalize', () => {
  let entity;
  let req;
  let next;

  beforeEach(() => {
    entity = new Entity('persons', [
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
        control: true,
        sanitizer: null,
        normalizer: val => normalizeName(val),
        controller: null
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
        control: true,
        sanitizer: null,
        normalizer: null,
        controller: null
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
        control: true,
        sanitizer: null,
        normalizer: null,
        controller: null
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
        control: true,
        sanitizer: null,
        normalizer: null,
        controller: null
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
        control: true,
        sanitizer: null,
        normalizer: val => Math.floor(val),
        controller: null
      }
    ]);

    req = {
      body: {
        rows: [
          { name: ' john Doe ', address: ' 45 backer street', city: ' new York', age: 30.5, normalizedAge: 30.5 },
          { name: '  Jane smith  ', address: ' 23 backer street', city: 'new York ' , age: 25.9, normalizedAge: 25.9 }
        ]
      }
    };
    next = jest.fn();
  });

  it('should call next without error if rows are present and valid in the request body', () => {
    entity.normalize(req, null, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with an error if rows are not present in the request body', () => {
    req.body = {};
    entity.normalize(req, null, next);

    expect(next).toHaveBeenCalledWith({
      status: 400,
      msg: 'Normalize: no rows found in request body'
    });
  });

  it('should normalize and sanitize properties based on the normalizer function', () => {
      entity.normalize(req, null, next);
      expect(req.body.rows[0].name).toBe('John Doe');
      expect(req.body.rows[1].name).toBe('Jane Smith');
      expect(req.body.rows[0].address).toBe('45 backer street');
      expect(req.body.rows[1].address).toBe('23 backer street');
      expect(req.body.rows[0].normalizedAge).toBe(30);
      expect(req.body.rows[1].normalizedAge).toBe(25);
      expect(next).toHaveBeenCalled();
  });

  it('should not sanitize properties when sanitize = false', () => {
    entity.normalize(req, null, next);
    expect(req.body.rows[0].city).toBe(' new York');
    expect(req.body.rows[1].city).toBe('new York ');
    expect(next).toHaveBeenCalled();
});

  it('should skip normalization for properties without a normalizer function', () => {
      entity.normalize(req, null, next);
      expect(req.body.rows[0].age).toBe(30.5);
      expect(req.body.rows[1].age).toBe(25.9);
      expect(next).toHaveBeenCalled();
  });

});
