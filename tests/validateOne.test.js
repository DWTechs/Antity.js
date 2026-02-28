import { Entity } from '../dist/antity.js';

describe('Entity.validateOne', () => {
  let entity;
  let req;
  let next;

  beforeEach(() => {
    entity = new Entity('product', [
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
        key: 'name',
        type: 'string',
        min: 1,
        max: 255,
        typeCheck: true,
        need: ['POST', 'PUT'],
        send: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'price',
        type: 'float',
        min: 0,
        max: 999999.99,
        typeCheck: true,
        need: ['POST', 'PUT'],
        send: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'stock',
        type: 'integer',
        min: 0,
        max: 999999,
        typeCheck: true,
        need: ['PATCH'],
        send: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      }
    ]);

    req = {
      body: {
        name: 'Product Name',
        price: 29.99,
        stock: 100
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
    req.method = 'GET';
    entity.validateOne(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: `Antity: Invalid REST method. Received: GET. Must be one of: PATCH,PUT,POST`
    });
  });

  it('should call next with an error if the method is missing', () => {
    req.method = undefined;
    entity.validateOne(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: `Antity: Invalid REST method. Received: undefined. Must be one of: PATCH,PUT,POST`
    });
  });

  it('should call next with an error if a required property is missing for POST', () => {
    req.body = { price: 29.99 }; // missing name which is needed for POST
    req.method = 'POST';
    entity.validateOne(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Missing name of type string'
    });
  });

  it('should call next with an error if a required property is missing for PUT', () => {
    req.body = { id: 123, name: 'Product' }; // missing price which is needed for PUT
    req.method = 'PUT';
    entity.validateOne(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Missing price of type float'
    });
  });

  it('should call next with an error if a required property is missing for PATCH', () => {
    req.body = { name: 'Product' }; // missing id which is needed for PATCH
    req.method = 'PATCH';
    entity.validateOne(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Missing id of type integer'
    });
  });

  it('should call next with an error if a property value is greater than max', () => {
    req.body.price = 1000000; // Exceeds max value
    entity.validateOne(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Invalid "price" - caused by: Checkard: Expected floating-point number, but received number: 1000000'
    });
  });

  it('should call next with an error if a property value is lower than min', () => {
    req.body.price = -1; // Below min value
    entity.validateOne(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Invalid "price" - caused by: Checkard: Expected floating-point number, but received number: -1'
    });
  });

  it('should not require properties not needed for the current method', () => {
    // stock is only needed for PATCH, not for POST
    req.body = { name: 'Product', price: 29.99 }; // no stock
    req.method = 'POST';
    entity.validateOne(req, null, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should validate provided values even if not required for the method', () => {
    // id is not needed for POST, but if provided it should still be validated
    req.body = { name: 'Product', price: 29.99, id: 'invalid' };
    req.method = 'POST';
    entity.validateOne(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Invalid \"id\" - caused by: Checkard: Expected integer, but received string: invalid'
    });
  });

  it('should call next with an error if a property value has a wrong type', () => {
    req.body.price = '29.99'; // string instead of float
    entity.validateOne(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Invalid "price" - caused by: Checkard: Expected floating-point number, but received string: 29.99'
    });
  });

  it('should validate all required properties for PUT method', () => {
    // PUT requires id, name, and price
    req.body = { id: 123, name: 'Updated Product', price: 39.99 };
    req.method = 'PUT';
    entity.validateOne(req, null, next);
    expect(next).toHaveBeenCalledWith();
  });
});
