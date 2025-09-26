import { Entity } from '../dist/antity';
import { normalizeName } from '@dwtechs/checkard';

describe('Entity.check', () => {
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
        validate: true,
        sanitizer: null,
        normalizer: val => normalizeName(val),
        validator: null,
        customProp: true,
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
        rows: [
          { name: ' john Doe ', address: ' 45 backer street', city: ' new York', age: 30.5, normalizedAge: 30.5 },
          { name: '  Jane smith  ', address: ' 23 backer street', city: 'new York ' , age: 25.9, normalizedAge: 25.9 }
        ]
      }
    };
    next = jest.fn();
  });

  it('should call next without error if rows are present and valid in the request body', () => {
    req.method = 'PATCH';
    entity.check(req, null, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with an error if rows are not present in the request body', () => {
    req.body = {};
    entity.check(req, null, next);

    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: no rows found in request body - caused by: Checkard: Expected array, but received undefined: undefined'
    });
  });

  it('should call next with an error if the method is invalid', () => {
    req.method = 'PTCH';
    entity.check(req, null, next);
    expect(next).toHaveBeenCalledWith({
        statusCode: 400,
        message: `Antity: Invalid REST method. Must be one of: GET,PATCH,PUT,POST,DELETE - caused by: Checkard: Expected value PTCH to be found in array, but received object: GET,PATCH,PUT,POST,DELETE`
    });
  });

  it('should call next with an error if the method is missing', () => {
    req.method = undefined;
    entity.check(req, null, next);
    expect(next).toHaveBeenCalledWith({
        statusCode: 400,
        message: `Antity: Invalid REST method. Must be one of: GET,PATCH,PUT,POST,DELETE - caused by: Checkard: Expected value undefined to be found in array, but received object: GET,PATCH,PUT,POST,DELETE`
    });
  });

  it('should check properties based on the normalizer function', () => {
    req.method = 'POST';
    entity.check(req, null, next);
    const r0 = req.body.rows[0];
    const r1 = req.body.rows[1];
    expect(r0.name).toBe('John Doe');
    expect(r0.address).toBe('45 backer street');
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: "Antity: Invalid \"age\" - caused by: Checkard: Expected integer, but received number: 30.5"
    });
  });

  it('should call next with an error if a property value is greater than max', () => {
    req.method = 'POST';
    req.body.rows[0].age = 150; // Exceeds max value
    entity.check(req, null, next);
    expect(next).toHaveBeenCalledWith({
        statusCode: 400,
        message: 'Antity: Invalid \"age\" - caused by: Checkard: Expected valid integer in range [0, 120], but received number: 150'
    });
  });

  it('should call next with an error if a property value is lower than min', () => {
    req.method = 'POST';
    req.body.rows[0].age = -1; // Exceeds max value
    entity.check(req, null, next);
    expect(next).toHaveBeenCalledWith({
        statusCode: 400,
        message: 'Antity: Invalid \"age\" - caused by: Checkard: Expected valid integer in range [0, 120], but received number: -1'
    });
  });

  it('should skip validation for properties not applicable to the current method', () => {
    req.body.rows[0].age = "30"; // invalid age
    req.method = 'GET';
    entity.check(req, null, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with an error if a property value has a wrong type', () => {
    req.method = 'POST';
    req.body.rows[0].age = "30"; // invalid age
    entity.check(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: "Antity: Invalid \"age\" - caused by: Checkard: Expected integer, but received string: 30",
    });
  });

  it('should not sanitize properties when sanitize = false', () => {
    entity.check(req, null, next);
    expect(req.body.rows[0].city).toBe(' new York');
    expect(req.body.rows[1].city).toBe('new York ');
    expect(next).toHaveBeenCalled();
  });

  it('should skip normalization for properties without a normalizer function', () => {
    entity.check(req, null, next);
    expect(req.body.rows[0].age).toBe(30.5);
    expect(req.body.rows[1].age).toBe(25.9);
    expect(next).toHaveBeenCalled();
  });

});
