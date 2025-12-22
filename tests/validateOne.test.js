import { Entity } from '../dist/antity.js';

describe('Entity.validateOne', () => {
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
      }
    ]);

    req = {
      body: {
        name: ' john Doe ',
        address: ' 45 backer street',
        city: ' new York',
        age: 30
      },
      method: 'POST'
    };
    next = jest.fn();
  });

  it('should call next without error if record is valid', () => {
      entity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
  });

  it('should call next with an error if data is missing in the request body', () => {
      req.body = null;
      entity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith({
          statusCode: 400,
          message: 'Antity: Validate: no data found in request body'
      });
  });

  it('should call next with an error if the method is invalid', () => {
    req.method = 'PTCH';
    entity.validateOne(req, null, next);
    expect(next).toHaveBeenCalledWith({
        statusCode: 400,
        message: `Antity: Invalid REST method. Received: PTCH. Must be one of: GET,PATCH,PUT,POST,DELETE`
    });
  });

  it('should call next with an error if the method is missing', () => {
    req.method = undefined;
    entity.validateOne(req, null, next);
    expect(next).toHaveBeenCalledWith({
        statusCode: 400,
        message: `Antity: Invalid REST method. Received: undefined. Must be one of: GET,PATCH,PUT,POST,DELETE`
    });
  });

  it('should call next with an error if a required property is missing', () => {
      req.body = { age: 30 };
      entity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith({
          statusCode: 400,
          message: 'Antity: Missing name of type string'
      });
  });

  it('should call next with an error if a property value is greater than max', () => {
      req.body.age = 150; // Exceeds max value
      entity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith({
          statusCode: 400,
          message: 'Antity: Invalid \"age\" - caused by: Checkard: Expected valid integer in range [0, 120], but received number: 150'
      });
  });

  it('should call next with an error if a property value is lower than min', () => {
    req.body.age = -1; // Below min value
    entity.validateOne(req, null, next);
    expect(next).toHaveBeenCalledWith({
        statusCode: 400,
        message: 'Antity: Invalid \"age\" - caused by: Checkard: Expected valid integer in range [0, 120], but received number: -1'
    });
  });

  it('should skip validation for properties not applicable to the current method', () => {
    req.body.age = "30"; // invalid age
    req.method = 'GET';
    entity.validateOne(req, null, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with an error if a property value has a wrong type', () => {
    req.body.age = "30"; // invalid age
    entity.validateOne(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: "Antity: Invalid \"age\" - caused by: Checkard: Expected integer, but received string: 30",
    });
  });
});
