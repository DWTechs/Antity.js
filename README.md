
[![License: MIT](https://img.shields.io/npm/l/@dwtechs/antity.svg?color=brightgreen)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40dwtechs%2Fantity.svg)](https://www.npmjs.com/package/@dwtechs/antity)
[![last version release date](https://img.shields.io/github/release-date/DWTechs/Antity.js)](https://www.npmjs.com/package/@dwtechs/antity)
![Jest:coverage](https://img.shields.io/badge/Jest:coverage-79%25-brightgreen.svg)

- [Synopsis](#synopsis)
- [Support](#support)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Contributors](#contributors)
- [Stack](#stack)


## Synopsis

**[Antity.js](https://github.com/DWTechs/Antity.js)** is an Open source library for easy entity management.

- 🪶 Very lightweight
- 🧪 Thoroughly tested
- 🚚 Shipped as EcmaScrypt module
- 📝 Written in Typescript


## Support

- node: 22

This is the oldest targeted versions. The library should work properly on older versions of Node.js but we do not support it officially.  


## Installation

```bash
$ npm i @dwtechs/antity
```


## Usage


```javascript

import { Entity } from "@dwtechs/antity";
import { normalizeName, normalizeNickname } from "@dwtechs/checkard";

const entity = new Entity("users", [
  {
    key: "id",
    type: "integer",
    min: 0,
    max: 120,
    isTypeChecked: true,
    requiredFor: ["PUT"],
    isPrivate: true,
    sanitizer: null,
    normalizer: null,
    validator: null,
  },
  {
    key: "firstName",
    type: "string",
    min: 0,
    max: 255,
    isTypeChecked: true,
    requiredFor: ["PUT"],
    isPrivate: true,
    sanitizer: null,
    normalizer: normalizeName,
    validator: null,
  },
  {
    key: "lastName",
    type: "string",
    min: 0,
    max: 255,
    isTypeChecked: true,
    requiredFor: ["PUT"],
    isPrivate: true,
    sanitizer: null,
    normalizer: normalizeName,
    validator: null,
  },
  {
    key: "nickname",
    type: "string",
    min: 0,
    max: 255,
    isTypeChecked: true,
    requiredFor: ["PUT"],
    isPrivate: false,
    sanitizer: null,
    normalizer: normalizeNickname,
    validator: null,
  },
]);

// add a consumer. Used when logging in from user service
router.post("/", entity.normalizeArray, entity.validateArray, ...);
// or use check method to normalize and validate array at once
router.put("/", entity.check, ...);

```

## API Reference


```javascript

type Type = 
  "boolean" |
  "string" |
  "number" |
  "integer" |
  "float" |
  "even" |
  "odd" |
  "positive" |
  "negative" |
  "powerOfTwo" |
  "ascii" |
  "array" |
  "jwt" |
  "symbol" |
  "password" |
  "email" |
  "regex" |
  "json" |
  "ipAddress" |
  "slug" |
  "hexadecimal" |
  "date" |
  "timestamp" |
  "function" |
  "htmlElement" |
  "htmlEventAttribute" |
  "node" |
  "object" |
  "ansiEscapeCode" |
  "locale" |
  "timeZone";
            
type Method = "PATCH" | "PUT" | "POST";

class Property {
  key: string;
  type: Type;
  min: number | Date;
  max: number | Date;
  requiredFor: Method[];
  isPrivate: boolean;
  isTypeChecked: boolean;
  sanitizer: Function | null;
  normalizer: Function | null;
  validator: Function | null;
  readOnly: boolean;
};

class Entity {
  constructor(name: string, properties: Property[]);
  get name(): string;
  get privateProps(): string[];
  get properties(): Property[];
  set name(name: string);
  
  /**
   * Returns a single property object matching the given key.
   *
   * - Searches the entity's properties for a property with the specified key
   * - Useful for dynamic validation, normalization, or documentation
   *
   * @param {string} key - The property key to look up
   * @returns {Property | undefined} The Property object if found, otherwise undefined
   *
   * **Input Properties Required:**
   * - `key` (string) - Property key to look up
   *
   * **Output Properties:**
   * - Property object matching the key, or undefined if not found
   *
   * @example
   * ```typescript
   * const prop = entity.getProp('firstName');
   * // prop contains the Property object for 'firstName' or undefined
   * ```
   */
  getProp(key: string): Property | undefined;

  /**
   * Returns all properties configured for a given REST method.
   *
   * - Filters the entity's properties by the specified method (e.g., 'POST', 'GET')
   * - Useful for dynamic validation, normalization, or documentation
   *
   * @param {Method} method - The REST method to filter properties by (e.g., 'POST', 'GET')
   * @returns {Property[]} Array of Property objects associated with the method
   *
   * **Input Properties Required:**
   * - `method` (string) - REST method to filter by
   *
   * **Output Properties:**
   * - Array of Property objects matching the method
   *
   * @example
   * ```typescript
   * const postProps = entity.getPropsByMethod('POST');
   * // postProps contains all properties relevant for POST requests
   * ```
   */
  getPropsByMethod(method: Method): Property[];

  /**
   * Builds a single Property instance from a plain field-definition object.
   * Called once per entry of the `properties` array passed to the constructor.
   *
   * - Not meant to be called directly; override it in a subclass to build
   *   your own `Property` subclass (e.g. a library adding its own fields)
   *   while still reusing `Entity`'s constructor bookkeeping.
   *
   * @param {Record<string, unknown>} p - Plain field-definition object
   * @returns {Property} The constructed Property instance
   *
   * @example
   * ```typescript
   * class MyEntity extends Entity {
   *   protected createProperty(p: Record<string, unknown>): Property {
   *     return new MyProperty(p.key, p.type, ..., p.myCustomField);
   *   }
   * }
   * ```
   */
  protected createProperty(p: Record<string, unknown>): Property;
  
  /**
   * Normalizes an array of records by applying sanitization and normalization
   * rules defined in the properties of the class.
   *
   * - Applies sanitization if `sanitize: true`
   * - Applies normalization if `normalize: true`
   * - Mutates req.body.rows or req.body with sanitized/normalized values
   * - Calls next(error) on failure, next() on success
   *
   * @param {Request} req - Express request object containing rows
   * @param {Response} res - Express response object. Set `res.locals.allowReadOnly = true` beforehand to allow writing `readOnly` properties through this call.
   * @param {NextFunction} next - Express next function
   *
   * @returns {void}
   *
   * **Input Properties Required:**
   * - `req.body.rows` (array) or `req.body` (array) - Array of objects to normalize
   * - Each property config can specify sanitize, normalize, etc.
   *
   * **Output Properties:**
   * - Mutates array with sanitized/normalized values
   * - Calls next(error) if normalization fails, next() if all pass
   *
   * @example
   * ```typescript
   * router.post('/entities', entity.normalizeArray, (req, res) => {
   *   // req.body.rows are now sanitized and normalized
   *   res.json({ success: true });
   * });
   * ```
   */
  normalizeArray: (req: Request, res: Response, next: NextFunction) => void;
  
  /**
   * Normalizes a single record by applying sanitization and normalization
   * rules defined in the properties of the class.
   *
   * - Applies sanitization if `sanitize: true`
   * - Applies normalization if `normalize: true`
   * - Mutates req.body with sanitized/normalized values
   * - Calls next(error) on failure, next() on success
   *
   * @param {Request} req - Express request object containing a single record
   * @param {Response} res - Express response object. Set `res.locals.allowReadOnly = true` beforehand to allow writing `readOnly` properties through this call.
   * @param {NextFunction} next - Express next function
   *
   * @returns {void}
   *
   * **Input Properties Required:**
   * - `req.body` (object) - Single object to normalize
   * - Each property config can specify sanitize, normalize, etc.
   *
   * **Output Properties:**
   * - Mutates `req.body` with sanitized/normalized values
   * - Calls next(error) if normalization fails, next() if success
   *
   * @example
   * ```typescript
   * router.post('/entity', entity.normalizeOne, (req, res) => {
   *   // req.body is now sanitized and normalized
   *   res.json({ success: true });
   * });
   * ```
   */
  normalizeOne: (req: Request, res: Response, next: NextFunction) => void;
  
  /**
   * Validates an array of rows according to property config and HTTP method.
   *
   * - Checks required properties and validates values
   * - Calls next(error) on failure, next() on success
   *
   * @param {Request} req - Express request object containing rows
   * @param {Response} res - Express response object. Set `res.locals.allowReadOnly = true` beforehand to allow writing `readOnly` properties through this call.
   * @param {NextFunction} next - Express next function
   *
   * @returns {void}
   *
   * **Input Properties Required:**
   * - `req.body.rows` (array) or `req.body` (array) - Array of objects to validate
   * - Each property config can specify validate, required, etc.
   *
   * **Output Properties:**
   * - Calls next(error) if any row fails validation, next() if all pass
   *
   * @example
   * ```typescript
   * router.post('/entities', entity.validateArray, (req, res) => {
   *   // req.body.rows are now validated
   *   res.json({ success: true });
   * });
   * ```
   */
  validateArray: (req: Request, res: Response, next: NextFunction) => void;
  
  /**
   * Validates a single record according to property config and HTTP method.
   *
   * - Checks required properties and validates values
   * - Calls next(error) on failure, next() on success
   *
   * @param {Request} req - Express request object containing a single record
   * @param {Response} res - Express response object. Set `res.locals.allowReadOnly = true` beforehand to allow writing `readOnly` properties through this call.
   * @param {NextFunction} next - Express next function
   *
   * @returns {void}
   *
   * **Input Properties Required:**
   * - `req.body` (object) - Single object to validate
   * - Each property config can specify validate, required, etc.
   *
   * **Output Properties:**
   * - Calls next(error) if validation fails, next() if success
   *
   * @example
   * ```typescript
   * router.post('/entity', entity.validateOne, (req, res) => {
   *   // req.body is now validated
   *   res.json({ success: true });
   * });
   * ```
   */
  validateOne: (req: Request, res: Response, next: NextFunction) => void;

```
**normalizeArray()**, **normalizeOne()**, **validateArray()**, and **validateOne()** methods are made to be used as Express.js middlewares.

- **normalizeArray()** and **validateArray()** will look for data in the **req.body.rows** parameter or **req.body** as an array.
- **normalizeOne()** and **validateOne()** will look for data in the **req.body** parameter as a single object.


### Password validation

Password validation will have the following options by default : 

```javascript
const PWD_MIN_LENGTH = 9;
const PWD_MAX_LENGTH = 20;
const PWD_NUMBERS = true; // password must contain a number
const PWD_UPPERCASE = true; // password must contain an uppercase letter
const PWD_LOWERCASE = true; // password must contain a lowercase letter
const PWD_SYMBOLS = true; //  password must contain at least one of the following symbol character : !@#%*_-+=:?><./()
```

#### Environment variables

You can update password default validator by setting the following environment variables :

```javascript
  PWD_MIN_LENGTH_POLICY,
  PWD_MAX_LENGTH_POLICY,
  PWD_NUMBERS_POLICY,
  PWD_UPPERCASE_POLICY,
  PWD_LOWERCASE_POLICY,
  PWD_SYMBOLS_POLICY
```

Properties **min** and **max** of the password properties will override default and environement variable if set.


### Available options for a property

Any of these can be passed into the options object for each function. **Behavior** describes exactly what `normalizeArray`/`normalizeOne`/`validateArray`/`validateOne` do with the property at runtime, depending on its value.

| Name            | Type                     |  Default value  | Behavior |
| :-------------- | :----------------------- | :-------------- | :------- |
| key             | string                   |                  | Read/write key on each record. No behavior of its own. |
| type            | Type                     |                  | When a value is present, selects the built-in type validator run during `validate()` — skipped entirely if `validator` is set. |
| min             | number \| Date           | 0 \| 1900-01-01 | Passed to the `type` validator as a lower bound during `validate()`. Not used for `boolean`. |
| max             | number \| Date           | 999999999 \| 2200-12-31 | Passed to the `type` validator as an upper bound during `validate()`. Not used for `boolean`. |
| requiredFor     | Methods[]                | [ ]              | If the current HTTP method is in this list, `validate()` rejects the record with a 400 when the value is `null`/`undefined`. **Ignored when `readOnly` is `true`** (see below) — a `readOnly` field is never required. |
| isPrivate       | boolean                  | false            | Not enforced by `normalize()`/`validate()`. When `true`, the key is added to `entity.privateProps` — your own response code is responsible for stripping it from output; antity.js never removes it itself. |
| isTypeChecked   | boolean                  | false            | Passed to the `type` validator to toggle strict vs. lenient checking; the exact effect depends on `type` (e.g. a stricter locale/timezone allow-list). Not used for `boolean`, `string` or `array` types. |
| readOnly        | boolean                  | false            | If `true`: `normalize()` **deletes** the key from the record before sanitizing/normalizing, and `validate()` **skips** it entirely (never required, never checked) — a client can never set it or trigger validation on it, whatever `requiredFor` says. Bypassed for one request by setting `res.locals.allowReadOnly = true` beforehand (trusted server-side writes only). If `false`, treated like any other property. |
| sanitizer       | ((v:any) => any) \| null | null             | If set, `normalize()` calls it instead of the default sanitizer for any present (truthy) value. If `null`, the default trims strings — recursively for a plain object's string properties, per-element for an array. |
| normalizer      | ((v:any) => any) \| null | null             | If set, `normalize()` calls it right after sanitizing, for any present (truthy) value. If `null`, no normalization step runs. |
| validator       | ((v:any) => boolean) \| null | null | If set, `validate()` calls it instead of the built-in `type` validator for any present value: return `false` or throw to fail (a thrown error's message is included in the 400 response). If `null`, the built-in `type`/`min`/`max`/`isTypeChecked` validator runs. |


## Contributors

Antity.js is still in development and we would be glad to get all the help you can provide.
To contribute please read **[contributor.md](https://github.com/DWTechs/Antity.js/blob/main/contributor.md)** for detailed installation guide.


## Stack

| Purpose         |                    Choice                    |                                                     Motivation |
| :-------------- | :------------------------------------------: | -------------------------------------------------------------: |
| repository      |        [Github](https://github.com/)         |     hosting for software development version control using Git |
| package manager |     [npm](https://www.npmjs.com/get-npm)     |                                default node.js package manager |
| language        | [TypeScript](https://www.typescriptlang.org) | static type checking along with the latest ECMAScript features |
| module bundler  |      [Rollup](https://rollupjs.org)          |                        advanced module bundler for ES6 modules |
| unit testing    |          [Jest](https://jestjs.io/)          |                  delightful testing with a focus on simplicity |
