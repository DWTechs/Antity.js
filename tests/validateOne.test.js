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
        isTypeChecked: true,
        requiredFor: ['PUT', 'PATCH'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'name',
        type: 'string',
        min: 1,
        max: 255,
        isTypeChecked: true,
        requiredFor: ['POST', 'PUT'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'price',
        type: 'float',
        min: 0,
        max: 999999.99,
        isTypeChecked: true,
        requiredFor: ['POST', 'PUT'],
        isPrivate: false,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'stock',
        type: 'integer',
        min: 0,
        max: 999999,
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

  describe('type: ansiEscapeCode', () => {
    let ansiEntity;

    beforeEach(() => {
      ansiEntity = new Entity('ansi', [
        {
          key: 'code',
          type: 'ansiEscapeCode',
          min: 0,
          max: 0,
          isTypeChecked: false,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
    });

    it('should accept a valid ANSI escape code', () => {
      const req = { body: { code: '\x1b[31m' }, method: 'POST' };
      ansiEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject an invalid ANSI escape code', () => {
      const req = { body: { code: 'notansi' }, method: 'POST' };
      ansiEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('"code"')
      }));
    });
  });

  describe('type: locale', () => {
    let localeEntity;

    beforeEach(() => {
      localeEntity = new Entity('loc', [
        {
          key: 'lang',
          type: 'locale',
          min: 0,
          max: 0,
          isTypeChecked: false,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
    });

    it('should accept a valid locale', () => {
      const req = { body: { lang: 'en-US' }, method: 'POST' };
      localeEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should accept an extended locale when isTypeChecked is true', () => {
      const extLocaleEntity = new Entity('loc-ext', [
        {
          key: 'lang',
          type: 'locale',
          min: 0,
          max: 0,
          isTypeChecked: true,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
      const req = { body: { lang: 'fr' }, method: 'POST' };
      extLocaleEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject an invalid locale', () => {
      const req = { body: { lang: '12345' }, method: 'POST' };
      localeEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('"lang"')
      }));
    });
  });

  describe('type: timeZone', () => {
    let tzEntity;

    beforeEach(() => {
      tzEntity = new Entity('tz', [
        {
          key: 'timezone',
          type: 'timeZone',
          min: 0,
          max: 0,
          isTypeChecked: false,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
    });

    it('should accept a valid IANA time zone', () => {
      const req = { body: { timezone: 'Europe/Paris' }, method: 'POST' };
      tzEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should accept America/New_York', () => {
      const req = { body: { timezone: 'America/New_York' }, method: 'POST' };
      tzEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject an invalid time zone', () => {
      const req = { body: { timezone: 'Not/ATimeZone' }, method: 'POST' };
      tzEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('"timezone"')
      }));
    });
  });

  describe('type: password', () => {
    let pwdEntity;

    beforeEach(() => {
      pwdEntity = new Entity('account', [
        {
          key: 'password',
          type: 'password',
          min: null,
          max: null,
          isTypeChecked: false,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
    });

    it('should accept a password within the default policy length when min/max are omitted', () => {
      const req = { body: { password: 'abcdefghijklmnop' } , method: 'POST' }; // 16 chars, within default [9,20]
      pwdEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject a password exceeding the default max length policy (20) when max is omitted', () => {
      const req = { body: { password: 'a'.repeat(21) }, method: 'POST' };
      pwdEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('"password"')
      }));
    });
  });

  describe('type: date', () => {
    let dateEntity;

    beforeEach(() => {
      dateEntity = new Entity('event', [
        {
          key: 'startDate',
          type: 'date',
          min: new Date('2000-01-01T00:00:00Z'),
          max: new Date('2100-01-01T00:00:00Z'),
          isTypeChecked: false,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
    });

    it('should accept a valid Date within range', () => {
      const req = { body: { startDate: new Date('2024-06-15T00:00:00Z') }, method: 'POST' };
      dateEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject a non-Date value', () => {
      const req = { body: { startDate: '2024-06-15' }, method: 'POST' };
      dateEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('"startDate"')
      }));
    });
  });

  describe('type: timestamp', () => {
    let tsEntity;

    beforeEach(() => {
      tsEntity = new Entity('event', [
        {
          key: 'occurredAt',
          type: 'timestamp',
          min: 0,
          max: 9999999999999,
          isTypeChecked: true,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
    });

    it('should accept a valid millisecond timestamp', () => {
      const req = { body: { occurredAt: Date.now() }, method: 'POST' };
      tsEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject a non-numeric value', () => {
      const req = { body: { occurredAt: 'not-a-timestamp' }, method: 'POST' };
      tsEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('"occurredAt"')
      }));
    });
  });

  describe('type: array', () => {
    let arrEntity;

    beforeEach(() => {
      arrEntity = new Entity('cart', [
        {
          key: 'items',
          type: 'array',
          min: 1,
          max: 10,
          isTypeChecked: false,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
    });

    it('should accept a valid array within length bounds', () => {
      const req = { body: { items: [1, 2, 3] }, method: 'POST' };
      arrEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject a non-array value', () => {
      const req = { body: { items: 'not-an-array' }, method: 'POST' };
      arrEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('"items"')
      }));
    });
  });

  describe('type: json', () => {
    let jsonEntity;

    beforeEach(() => {
      jsonEntity = new Entity('config', [
        {
          key: 'payload',
          type: 'json',
          min: 0,
          max: 0,
          isTypeChecked: false,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
    });

    it('should accept a valid JSON string', () => {
      const req = { body: { payload: '{"a":1}' }, method: 'POST' };
      jsonEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject an invalid JSON string', () => {
      const req = { body: { payload: '{invalid' }, method: 'POST' };
      jsonEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('"payload"')
      }));
    });
  });

  describe('type: jwt', () => {
    let jwtEntity;
    const VALID_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    beforeEach(() => {
      jwtEntity = new Entity('session', [
        {
          key: 'token',
          type: 'jwt',
          min: 0,
          max: 0,
          isTypeChecked: false,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
    });

    it('should accept a valid JWT', () => {
      const req = { body: { token: VALID_JWT }, method: 'POST' };
      jwtEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject an invalid JWT', () => {
      const req = { body: { token: 'not.a.jwt' }, method: 'POST' };
      jwtEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('"token"')
      }));
    });
  });

  describe('type: symbol', () => {
    let symEntity;

    beforeEach(() => {
      symEntity = new Entity('tag', [
        {
          key: 'marker',
          type: 'symbol',
          min: 0,
          max: 0,
          isTypeChecked: false,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
    });

    it('should accept a Symbol value', () => {
      const req = { body: { marker: Symbol('x') }, method: 'POST' };
      symEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject a non-Symbol value', () => {
      const req = { body: { marker: 'not-a-symbol' }, method: 'POST' };
      symEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('"marker"')
      }));
    });
  });

  describe('type: ipAddress', () => {
    let ipEntity;

    beforeEach(() => {
      ipEntity = new Entity('client', [
        {
          key: 'ip',
          type: 'ipAddress',
          min: 0,
          max: 0,
          isTypeChecked: false,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
    });

    it('should accept a valid IPv4 address', () => {
      const req = { body: { ip: '192.168.1.1' }, method: 'POST' };
      ipEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject an invalid IP address', () => {
      const req = { body: { ip: 'not-an-ip' }, method: 'POST' };
      ipEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('"ip"')
      }));
    });
  });

  describe('type: slug', () => {
    let slugEntity;

    beforeEach(() => {
      slugEntity = new Entity('post', [
        {
          key: 'slug',
          type: 'slug',
          min: 0,
          max: 0,
          isTypeChecked: false,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
    });

    it('should accept a valid slug', () => {
      const req = { body: { slug: 'hello-world' }, method: 'POST' };
      slugEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject an invalid slug', () => {
      const req = { body: { slug: 'Not A Valid Slug!' }, method: 'POST' };
      slugEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('"slug"')
      }));
    });
  });

  describe('type: hexadecimal', () => {
    let hexEntity;

    beforeEach(() => {
      hexEntity = new Entity('color', [
        {
          key: 'code',
          type: 'hexadecimal',
          min: 0,
          max: 0,
          isTypeChecked: false,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
    });

    it('should accept a valid hexadecimal string', () => {
      const req = { body: { code: '0x1A2B3C' }, method: 'POST' };
      hexEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject an invalid hexadecimal string', () => {
      const req = { body: { code: 'zzzz' }, method: 'POST' };
      hexEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('"code"')
      }));
    });
  });

  describe('type: function', () => {
    let fnEntity;

    beforeEach(() => {
      fnEntity = new Entity('hook', [
        {
          key: 'callback',
          type: 'function',
          min: 0,
          max: 0,
          isTypeChecked: false,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
    });

    it('should accept a function value', () => {
      const req = { body: { callback: () => {} }, method: 'POST' };
      fnEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject a non-function value', () => {
      const req = { body: { callback: 'not-a-function' }, method: 'POST' };
      fnEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('"callback"')
      }));
    });
  });

  describe('type: htmlElement', () => {
    let elEntity;

    beforeEach(() => {
      elEntity = new Entity('widget', [
        {
          key: 'el',
          type: 'htmlElement',
          min: 0,
          max: 0,
          isTypeChecked: false,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
    });

    it('should accept a duck-typed HTML element', () => {
      const req = { body: { el: { nodeType: 1, nodeName: 'DIV' } }, method: 'POST' };
      elEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject a plain object without HTML element shape', () => {
      const req = { body: { el: { foo: 'bar' } }, method: 'POST' };
      elEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('"el"')
      }));
    });
  });

  describe('type: node', () => {
    let nodeEntity;

    beforeEach(() => {
      nodeEntity = new Entity('tree', [
        {
          key: 'el',
          type: 'node',
          min: 0,
          max: 0,
          isTypeChecked: false,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
    });

    it('should accept a duck-typed DOM node', () => {
      const req = { body: { el: { nodeType: 3, nodeName: '#text' } }, method: 'POST' };
      nodeEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject a plain object without node shape', () => {
      const req = { body: { el: { foo: 'bar' } }, method: 'POST' };
      nodeEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('"el"')
      }));
    });
  });

  describe('type: object', () => {
    let objEntity;

    beforeEach(() => {
      objEntity = new Entity('meta', [
        {
          key: 'data',
          type: 'object',
          min: 0,
          max: 0,
          isTypeChecked: false,
          requiredFor: ['POST'],
          isPrivate: false,
          sanitizer: null,
          normalizer: null,
          validator: null
        }
      ]);
    });

    it('should accept a plain object', () => {
      const req = { body: { data: { a: 1 } }, method: 'POST' };
      objEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject a non-object value', () => {
      const req = { body: { data: 'not-an-object' }, method: 'POST' };
      objEntity.validateOne(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('"data"')
      }));
    });
  });
});
