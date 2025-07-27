import { Entity } from '../dist/antity.js';

describe('Entity.validate', () => {
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
      }
    ]);

    req = {
      body: {
        rows: [
          { name: ' john Doe ', address: ' 45 backer street', city: ' new York', age: 30 },
          { name: '  Jane smith  ', address: ' 23 backer street', city: 'new York ' , age: 25 }
        ]
      },
      method: 'POST'
    };
    next = jest.fn();
  });

  it('should call next without error if rows are valid', () => {
      entity.validate(req, null, next);
      expect(next).toHaveBeenCalledWith();
  });

  it('should call next with an error if rows are missing in the request body', () => {
      req.body = {};
      entity.validate(req, null, next);
      expect(next).toHaveBeenCalledWith({
          statusCode: 400,
          message: 'Validate: no rows found in request body'
      });
  });

  it('should call next with an error if the method is invalid', () => {
    req.method = 'PTCH';
    entity.validate(req, null, next);
    expect(next).toHaveBeenCalledWith({
        statusCode: 400,
        message: `Invalid REST method. Received: PTCH. Must be one of: GET,PATCH,PUT,POST,DELETE`
    });
  });

  it('should call next with an error if the method is missing', () => {
    req.method = undefined;
    entity.validate(req, null, next);
    expect(next).toHaveBeenCalledWith({
        statusCode: 400,
        message: `Invalid REST method. Received: undefined. Must be one of: GET,PATCH,PUT,POST,DELETE`
    });
  });

  it('should call next with an error if a required property is missing', () => {
      req.body.rows[0] = { age: 30 };
      entity.validate(req, null, next);
      expect(next).toHaveBeenCalledWith({
          statusCode: 400,
          message: 'Missing name of type string'
      });
  });

  it('should call next with an error if a property value is greater than max', () => {
      req.body.rows[0].age = 150; // Exceeds max value
      entity.validate(req, null, next);
      expect(next).toHaveBeenCalledWith({
          statusCode: 400,
          message: 'Invalid age, must be of type integer and >= 0 and <= 120'
      });
  });

  it('should call next with an error if a property value is lower than min', () => {
    req.body.rows[0].age = -1; // Exceeds max value
    entity.validate(req, null, next);
    expect(next).toHaveBeenCalledWith({
        statusCode: 400,
        message: 'Invalid age, must be of type integer and >= 0 and <= 120'
    });
  });

  it('should skip validation for properties not applicable to the current method', () => {
    req.body.rows[0].age = "30"; // invalid age
    req.method = 'GET';
    entity.validate(req, null, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with an error if a property value has a wrong type', () => {
    req.body.rows[0].age = "30"; // invalid age
    entity.validate(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: "Invalid age, must be of type integer and >= 0 and <= 120",
    });
  });
});