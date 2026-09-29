import { Entity } from '../dist/antity.js';
import { log } from '@dwtechs/winstan';

describe('Entity.validateArray', () => {
  let entity;
  let req;
  let next;

  beforeEach(() => {
    entity = new Entity('orders', [
      {
        key: 'orderId',
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
        key: 'customerName',
        type: 'string',
        min: 1,
        max: 255,
        isTypeChecked: true,
        requiredFor: ['POST'],
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
        requiredFor: ['POST', 'PUT'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'totalAmount',
        type: 'float',
        min: 0.01,
        max: 999999.99,
        isTypeChecked: true,
        requiredFor: ['POST', 'PUT'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'status',
        type: 'string',
        min: 1,
        max: 50,
        isTypeChecked: true,
        requiredFor: ['PATCH'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      }
    ]);

    req = {
      body: {
        rows: [
          { customerName: 'John Doe', email: 'john@example.com', totalAmount: 99.99 },
          { customerName: 'Jane Smith', email: 'jane@example.com', totalAmount: 149.50 }
        ]
      },
      method: 'POST'
    };
    next = jest.fn();
  });

  it('should call next without error if all rows are valid', () => {
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with an error if rows are missing in the request body', () => {
    req.body = {};
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Validate: no rows found in request body'
    });
  });

  it('should call next with an error if method is invalid', () => {
    req.method = 'DELETE';
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: `Antity: Invalid REST method. Received: DELETE. Must be one of: PATCH,PUT,POST`
    });
  });

  it('should call next with an error if method is missing', () => {
    req.method = undefined;
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: `Antity: Invalid REST method. Received: undefined. Must be one of: PATCH,PUT,POST`
    });
  });

  it('should call next with an error if a required property is missing for POST', () => {
    req.body.rows[0] = { email: 'john@example.com', totalAmount: 99.99 }; // missing customerName
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Missing customerName of type string'
    });
  });

  it('should call next with an error if a required property is missing for PUT', () => {
    req.method = 'PUT';
    req.body.rows[0] = { orderId: 123, email: 'john@example.com' }; // missing totalAmount
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Missing totalAmount of type float'
    });
  });

  it('should call next with an error if a required property is missing for PATCH', () => {
    req.method = 'PATCH';
    req.body.rows[0] = { status: 'shipped' }; // missing orderId
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Missing orderId of type integer'
    });
  });

  it('should call next with an error if a property value exceeds max', () => {
    req.body.rows[0].totalAmount = 9999999; // exceeds max
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Invalid "totalAmount" - caused by: Checkard: Expected floating-point number, but received number: 9999999'
    });
  });

  it('should call next with an error if a property value is below min', () => {
    req.body.rows[0].totalAmount = 0.001; // below min of 0.01
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Invalid "totalAmount" - caused by: Checkard: Expected valid float in range [0.01, 999999.99], but received number: 0.001'
    });
  });

  it('should not require properties that are not needed for the current method', () => {
    // orderId and status are not needed for POST
    req.method = 'POST';
    req.body.rows = [
      { customerName: 'John', email: 'john@example.com', totalAmount: 99.99 }
    ];
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with an error if a property has wrong type', () => {
    req.body.rows[0].totalAmount = '99.99'; // string instead of float
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Invalid "totalAmount" - caused by: Checkard: Expected floating-point number, but received string: 99.99'
    });
  });

  it('should validate all rows and fail on the first invalid one', () => {
    req.body.rows = [
      { customerName: 'John', email: 'john@example.com', totalAmount: 99.99 }, // valid
      { customerName: 'Jane', email: 'invalid-email', totalAmount: 149.50 }, // invalid email
      { customerName: 'Bob', email: 'bob@example.com', totalAmount: 199.00 }  // valid
    ];
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Invalid \"email\" - caused by: Checkard: Expected valid email address, but received string: invalid-email'
    });
  });

  it('should validate provided values even if not required for the method', () => {
    // status is not needed for POST, but if provided it should still be validated
    req.method = 'POST';
    req.body.rows[0] = {
      customerName: 'John',
      email: 'john@example.com',
      totalAmount: 99.99,
      status: '' // empty string: present, but below the field's min length of 1
    };
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Invalid "status" - caused by: Checkard: Expected string with length in range [1, 50] (actual length: 0), but received string: '
    });
  });
});

describe('readOnly enforcement', () => {
  let roEntity;

  beforeEach(() => {
    roEntity = new Entity('accounts', [
      {
        key: 'id',
        type: 'integer',
        min: 1,
        max: 999999999,
        isTypeChecked: true,
        requiredFor: ['POST'], // deliberately required + readOnly: readOnly wins
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null,
        readOnly: true,
      },
      {
        key: 'name',
        type: 'string',
        min: 1,
        max: 255,
        isTypeChecked: true,
        requiredFor: ['POST'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null,
      },
    ]);
  });

  it('should not require a readOnly field even if requiredFor includes the method', () => {
    const req = { body: { rows: [{ name: 'acme' }] }, method: 'POST' }; // id omitted
    const next = jest.fn();
    roEntity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should not validate a readOnly field value by default', () => {
    const req = { body: { rows: [{ id: 'not-a-number', name: 'acme' }] }, method: 'POST' };
    const next = jest.fn();
    roEntity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should validate a readOnly field when res.locals.allowReadOnly is true', () => {
    const req = { body: { rows: [{ id: 'not-a-number', name: 'acme' }] }, method: 'POST' };
    const res = { locals: { allowReadOnly: true } };
    const next = jest.fn();
    roEntity.validateArray(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400 }),
    );
  });
});

describe('custom validator callback', () => {
  const makeEntity = (validator) => new Entity('users', [
    {
      key: 'age',
      type: 'integer',
      min: 0,
      max: 120,
      isTypeChecked: true,
      requiredFor: [],
      isPrivate: false,
      sanitizer: null,
      normalizer: null,
      validator,
    },
  ]);

  it('should fail validation when the callback returns false', () => {
    const entity = makeEntity((v) => v >= 18);
    const req = { body: { rows: [{ age: 5 }] }, method: 'POST' };
    const next = jest.fn();
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Custom validator callback failed for "age"',
    });
  });

  it('should pass validation when the callback returns true', () => {
    const entity = makeEntity((v) => v >= 18);
    const req = { body: { rows: [{ age: 21 }] }, method: 'POST' };
    const next = jest.fn();
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should still fail validation when the callback throws', () => {
    const entity = makeEntity(() => { throw new Error('boom'); });
    const req = { body: { rows: [{ age: 21 }] }, method: 'POST' };
    const next = jest.fn();
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Custom validator callback failed for "age" - caused by: boom',
    });
  });
});

describe('isTypeChecked: false permits lenient values', () => {
  it('should accept a numeric string for an integer field when isTypeChecked is false', () => {
    const entity = new Entity('t', [
      {
        key: 'age',
        type: 'integer',
        min: 0,
        max: 120,
        isTypeChecked: false,
        requiredFor: [],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null,
      },
    ]);
    const req = { body: { rows: [{ age: '42' }] }, method: 'POST' };
    const next = jest.fn();
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should reject the same numeric string when isTypeChecked is true', () => {
    const entity = new Entity('t', [
      {
        key: 'age',
        type: 'integer',
        min: 0,
        max: 120,
        isTypeChecked: true,
        requiredFor: [],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null,
      },
    ]);
    const req = { body: { rows: [{ age: '42' }] }, method: 'POST' };
    const next = jest.fn();
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400 }),
    );
  });
});

describe('min: 0 / max: 0 bounds', () => {
  it('should reject a value below an explicit min of 0', () => {
    const entity = new Entity('t', [
      {
        key: 'price',
        type: 'number',
        min: 0,
        max: 1000,
        isTypeChecked: true,
        requiredFor: [],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null,
      },
    ]);
    const req = { body: { rows: [{ price: -50 }] }, method: 'POST' };
    const next = jest.fn();
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400 }),
    );
  });

  it('should accept a value at the explicit min of 0', () => {
    const entity = new Entity('t', [
      {
        key: 'price',
        type: 'number',
        min: 0,
        max: 1000,
        isTypeChecked: true,
        requiredFor: [],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null,
      },
    ]);
    const req = { body: { rows: [{ price: 0 }] }, method: 'POST' };
    const next = jest.fn();
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith();
  });
});

describe('falsy values are still validated', () => {
  it('should run the custom validator for a boolean value of false', () => {
    const entity = new Entity('t', [
      {
        key: 'active',
        type: 'boolean',
        min: null,
        max: null,
        isTypeChecked: true,
        requiredFor: [],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: () => { throw new Error('ran for false'); },
      },
    ]);
    const req = { body: { rows: [{ active: false }] }, method: 'POST' };
    const next = jest.fn();
    entity.validateArray(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Custom validator callback failed for "active" - caused by: ran for false',
    });
  });
});

describe('log injection hardening', () => {
  it('should strip \\r\\n from a submitted value before logging it', () => {
    const debugSpy = jest.spyOn(log, 'debug');
    const entity = new Entity('t', [
      {
        key: 'bio',
        type: 'string',
        min: 0,
        max: 500,
        isTypeChecked: true,
        requiredFor: ['POST'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null,
      },
    ]);
    const req = { body: { rows: [{ bio: 'line1\r\nfake_log_line=INFO line2' }] }, method: 'POST' };
    entity.validateArray(req, null, jest.fn());

    for (const call of debugSpy.mock.calls) {
      expect(call[0]).not.toMatch(/[\r\n]/);
    }
    debugSpy.mockRestore();
  });
});