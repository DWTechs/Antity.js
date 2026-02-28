import { Entity } from '../dist/antity.js';
import { normalizeName } from '@dwtechs/checkard';

describe('Entity.normalizeOne', () => {
  let entity;
  let req;
  let next;

  beforeEach(() => {
    entity = new Entity('article', [
      {
        key: 'title',
        type: 'string',
        min: 1,
        max: 200,
        typeCheck: true,
        need: ['POST', 'PUT'],
        send: true,
        sanitizer: null,
        normalizer: val => val.trim(),
        validator: null
      },
      {
        key: 'slug',
        type: 'slug',
        min: 1,
        max: 200,
        typeCheck: true,
        need: ['POST', 'PUT'],
        send: true,
        sanitizer: null,
        normalizer: val => val.trim().toLowerCase().replace(/\s+/g, '-'),
        validator: null
      },
      {
        key: 'author',
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
        key: 'content',
        type: 'string',
        min: 10,
        max: 10000,
        typeCheck: true,
        need: ['POST', 'PUT'],
        send: true,
        sanitizer: null,
        normalizer: null,
        validator: null
      },
      {
        key: 'viewCount',
        type: 'integer',
        min: 0,
        max: 999999999,
        typeCheck: true,
        need: [],
        send: true,
        sanitizer: null,
        normalizer: val => Math.floor(val),
        validator: null
      }
    ]);

    req = {
      body: {
        title: '  Getting Started with TypeScript  ',
        slug: '  Getting Started With TypeScript  ',
        author: '  john doe  ',
        content: '   This is an article about TypeScript.   ',
        viewCount: 42.7
      }
    };
    next = jest.fn();
  });

  it('should call next without error if record is present in the request body', () => {
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

  it('should sanitize and normalize properties with custom normalizer functions', () => {
    entity.normalizeOne(req, null, next);
    
    expect(req.body.title).toBe('Getting Started with TypeScript');
    expect(req.body.slug).toBe('getting-started-with-typescript');
    expect(req.body.author).toBe('John Doe');
    expect(req.body.viewCount).toBe(42);
    expect(next).toHaveBeenCalledWith();
  });

  it('should only sanitize properties without a normalizer function', () => {
    entity.normalizeOne(req, null, next);
    
    // content has no normalizer, only sanitization (trim)
    expect(req.body.content).toBe('This is an article about TypeScript.');
    expect(next).toHaveBeenCalled();
  });

  it('should handle missing optional properties gracefully', () => {
    req.body = {
      title: '  My Title  ',
      slug: '  My Title  ',
      author: ' jane ',
      content: 'Article content here.'
      // viewCount is missing
    };
    
    entity.normalizeOne(req, null, next);
    
    expect(req.body.title).toBe('My Title');
    expect(req.body.slug).toBe('my-title');
    expect(req.body.author).toBe('Jane');
    expect(req.body.viewCount).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });

  it('should apply multiple transformations correctly', () => {
    req.body = {
      title: '   HELLO   WORLD   ',
      slug: '   HELLO   WORLD   ',
      author: '  alice johnson  ',
      content: 'Content here',
      viewCount: 999.99
    };
    
    entity.normalizeOne(req, null, next);
    
    expect(req.body.title).toBe('HELLO   WORLD'); // trim only
    expect(req.body.slug).toBe('hello-world'); // trim + lowercase + replace spaces (multiple spaces become single hyphen)
    expect(req.body.author).toBe('Alice Johnson'); // normalizeName
    expect(req.body.viewCount).toBe(999); // Math.floor
    expect(next).toHaveBeenCalledWith();
  });
});
