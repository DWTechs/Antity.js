import { Entity } from '../dist/antity.js';
import { normalizeName } from '@dwtechs/checkard';

describe('Entity.normalizeArray', () => {
  let entity;
  let req;
  let next;

  beforeEach(() => {
    entity = new Entity('users', [
      {
        key: 'username',
        type: 'string',
        min: 3,
        max: 50,
        typeCheck: true,
        need: ['POST'],
        send: true,
        sanitizer: null,
        normalizer: val => val.trim().toLowerCase(),
        validator: null
      },
      {
        key: 'email',
        type: 'email',
        min: 5,
        max: 255,
        typeCheck: true,
        need: ['POST', 'PUT'],
        send: true,
        sanitizer: null,
        normalizer: val => val.trim().toLowerCase(),
        validator: null
      },
      {
        key: 'firstName',
        type: 'string',
        min: 1,
        max: 100,
        typeCheck: true,
        need: ['POST'],
        send: true,
        sanitizer: null,
        normalizer: normalizeName,
        validator: null
      },
      {
        key: 'lastName',
        type: 'string',
        min: 1,
        max: 100,
        typeCheck: true,
        need: ['POST'],
        send: true,
        sanitizer: null,
        normalizer: normalizeName,
        validator: null
      },
      {
        key: 'bio',
        type: 'string',
        min: 0,
        max: 500,
        typeCheck: true,
        need: [],
        send: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      }
    ]);

    req = {
      body: {
        rows: [
          { 
            username: '  JohnDoe_123  ',
            email: '  John.Doe@Example.COM  ',
            firstName: ' john ',
            lastName: 'doe  ',
            bio: '   Software developer   '
          },
          { 
            username: ' jane_smith ',
            email: ' JANE@EXAMPLE.COM ',
            firstName: '  jane  ',
            lastName: ' smith',
            bio: 'Designer'
          }
        ]
      }
    };
    next = jest.fn();
  });

  it('should call next without error if rows are present in the request body', () => {
    entity.normalizeArray(req, null, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with an error if rows are not present in the request body', () => {
    req.body = {};
    entity.normalizeArray(req, null, next);
    expect(next).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Antity: Normalize: no rows found in request body'
    });
  });

  it('should sanitize and normalize properties with custom normalizer functions', () => {
    entity.normalizeArray(req, null, next);
    const user1 = req.body.rows[0];
    const user2 = req.body.rows[1];
    
    // username: trim + lowercase
    expect(user1.username).toBe('johndoe_123');
    expect(user2.username).toBe('jane_smith');
    
    // email: trim + lowercase
    expect(user1.email).toBe('john.doe@example.com');
    expect(user2.email).toBe('jane@example.com');
    
    // firstName/lastName: normalizeName (capitalize first letter)
    expect(user1.firstName).toBe('John');
    expect(user1.lastName).toBe('Doe');
    expect(user2.firstName).toBe('Jane');
    expect(user2.lastName).toBe('Smith');
    
    expect(next).toHaveBeenCalledWith();
  });

  it('should only sanitize properties without a normalizer function', () => {
    entity.normalizeArray(req, null, next);
    
    // bio has no normalizer, only sanitization (trim whitespace)
    expect(req.body.rows[0].bio).toBe('Software developer');
    expect(req.body.rows[1].bio).toBe('Designer');
    expect(next).toHaveBeenCalled();
  });

  it('should handle missing optional properties gracefully', () => {
    req.body.rows = [
      { username: ' user1 ', email: ' USER1@EXAMPLE.COM ', firstName: 'john', lastName: 'doe' }
      // bio is missing
    ];
    entity.normalizeArray(req, null, next);
    expect(req.body.rows[0].username).toBe('user1');
    expect(req.body.rows[0].bio).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });

  it('should process all rows in the array', () => {
    req.body.rows = [
      { username: ' user1 ', email: ' user1@test.com ', firstName: 'alice', lastName: 'jones' },
      { username: ' user2 ', email: ' user2@test.com ', firstName: 'bob', lastName: 'smith' },
      { username: ' user3 ', email: ' user3@test.com ', firstName: 'charlie', lastName: 'brown' }
    ];
    
    entity.normalizeArray(req, null, next);
    
    expect(req.body.rows[0].username).toBe('user1');
    expect(req.body.rows[0].firstName).toBe('Alice');
    expect(req.body.rows[1].username).toBe('user2');
    expect(req.body.rows[1].firstName).toBe('Bob');
    expect(req.body.rows[2].username).toBe('user3');
    expect(req.body.rows[2].firstName).toBe('Charlie');
    
    expect(next).toHaveBeenCalledWith();
  });
});
