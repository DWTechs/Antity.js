
[![License: MIT](https://img.shields.io/npm/l/@dwtechs/antity.svg?color=brightgreen)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40dwtechs%2Fantity.svg)](https://www.npmjs.com/package/@dwtechs/antity)
[![last version release date](https://img.shields.io/github/release-date/DWTechs/Antity.js)](https://www.npmjs.com/package/@dwtechs/antity)
![Jest:coverage](https://img.shields.io/badge/Jest:coverage-72%25-brightgreen.svg)

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

const entity = new Entity("consumers", [
  {
    key: "id",
    type: "integer",
    min: 0,
    max: 120,
    typeCheck: true,
    methods: ["GET", "PUT", "DELETE"],
    required: true,
    safe: true,
    sanitize: true,
    normalize: true,
    validate: true,
    sanitizer: null,
    normalizer: null,
    validator: null,
  },
  {
    key: "firstName",
    type: "string",
    min: 0,
    max: 255,
    typeCheck: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    required: true,
    safe: true,
    sanitize: true,
    normalize: true,
    validate: true,
    sanitizer: null,
    normalizer: normalizeName,
    validator: null,
  },
  {
    key: "lastName",
    type: "string",
    min: 0,
    max: 255,
    typeCheck: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    required: true,
    safe: true,
    sanitize: true,
    normalize: true,
    validate: true,
    sanitizer: null,
    normalizer: normalizeName,
    validator: null,
  },
  {
    key: "nickname",
    type: "string",
    min: 0,
    max: 255,
    typeCheck: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    required: true,
    safe: true,
    sanitize: true,
    normalize: true,
    validate: true,
    sanitizer: null,
    normalizer: normalizeNickname,
    validator: null,
  },
]);

// add a consumer. Used when loggin in from user service
router.post("/", entity.normalize, entity.validate, ...);
// or use check method to both normalize and validate at once
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
  "object";
            
type Method = "GET" | "PATCH" | "PUT" | "POST" | "DELETE";

class Property {
  key: string;
  type: Type;
  min: number | Date | null;
  max: number | Date | null;
  required: boolean;
  safe: boolean;
  typeCheck: boolean;
  methods: Method[];
  sanitize: boolean;
  normalize: boolean;
  validate: boolean;
  sanitizer: Function | null;
  normalizer: Function | null;
  validator: Function | null;
};

class Entity {
  constructor(name: string, properties: Property[]);
  get name(): string;
  get unsafeProps(): string[];
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
   * Normalizes each row in req.body.rows according to property config and HTTP method.
   *
   * - Applies sanitization if `sanitize: true` and method matches
   * - Applies normalization if `normalize: true` and method matches
   * - Mutates req.body.rows with sanitized/normalized values
   * - Calls next(error) on failure, next() on success
   *
   * @param {Request} req - Express request object containing rows
   * @param {Response} _res - Express response object (not used)
   * @param {NextFunction} next - Express next function
   *
   * @returns {void}
   *
   * **Input Properties Required:**
   * - `req.body.rows` (array) - Array of objects to normalize
   * - Each property config can specify sanitize, normalize, etc.
   *
   * **Output Properties:**
   * - Mutates `req.body.rows` with sanitized/normalized values
   * - Calls next(error) if any row fails normalization, next() if all pass
   *
   * @example
   * ```typescript
   * router.post('/entity', entity.normalize, (req, res) => {
   *   // req.body.rows are now sanitized and normalized
   *   res.json({ success: true });
   * });
   * ```
   */
  normalize: (req: Request, _res: Response, next: NextFunction) => void;
  
  /**
   * Validates each row in req.body.rows according to property config and HTTP method.
   *
   * - Checks required properties and validates values
   * - Calls next(error) on failure, next() on success
   *
   * @param {Request} req - Express request object containing rows
   * @param {Response} _res - Express response object (not used)
   * @param {NextFunction} next - Express next function
   *
   * @returns {void}
   *
   * **Input Properties Required:**
   * - `req.body.rows` (array) - Array of objects to validate
   * - Each property config can specify validate, required, etc.
   *
   * **Output Properties:**
   * - Calls next(error) if any row fails validation, next() if all pass
   *
   * @example
   * ```typescript
   * router.post('/entity', entity.validate, (req, res) => {
   *   // req.body.rows are now validated
   *   res.json({ success: true });
   * });
   * ```
   */
  validate: (req: Request, _res: Response, next: NextFunction) => void;

  /**
   * Checks, sanitizes, normalizes, and validates each row in req.body.rows according to property config and HTTP method.
   *
   * - Applies sanitization if `sanitize: true` and method matches
   * - Applies normalization if `normalize: true` and method matches
   * - Checks required properties and validates values
   * - Calls next(error) on failure, next() on success
   *
   * @param {Request} req - Express request object containing rows
   * @param {Response} _res - Express response object (not used)
   * @param {NextFunction} next - Express next function
   *
   * @returns {void}
   *
   * **Input Properties Required:**
   * - `req.body.rows` (array) - Array of objects to check
   * - Each property config can specify sanitize, normalize, validate, required, etc.
   *
   * **Output Properties:**
   * - Mutates `req.body.rows` with sanitized/normalized values
   * - Calls next(error) if any row fails checks, next() if all pass
   *
   * @example
   * ```typescript
   * router.post('/entity', entity.check, (req, res) => {
   *   // req.body.rows are now sanitized, normalized, and validated
   *   res.json({ success: true });
   * });
   * ```
   */
  check: (req: Request, _res: Response, next: NextFunction) => void;
}

```
normalize() and validate() methods are made to be used as Express.js middlewares.
Each method will look for data to work on in the **req.body.rows** parameter.


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

Any of these can be passed into the options object for each function.

| Name            | Type                      |               Description                         |  Default value  |  
| :-------------- | :------------------------ | :------------------------------------------------ | :-------------- |
| key             |  string                   | Name of the property                              |
| type            |  Type                     | Type of the property                              |
| min             |  number \| Date           | Minimum value                                     | 0 \| 1900-01-01
| max             |  number \| Date           | Maximum value                                     | 999999999 \| 2200-12-31
| required        |  boolean                  | Property is required during validation            | false
| safe            |  boolean                  | Property is sent in the response                  | true
| typeCheck       |  boolean                  | Type is checked during validation                 | false
| methods         |  Method[]                 | property is validated for the listed methods only | [ "GET", "POST", "PUT", "DELETE" ]
| sanitize        |  boolean                  | Sanitize the property if true                     | true
| normalize       |  boolean                  | Normalize the property if true                    | false
| validate        |  boolean                  | validate the property if true                     | true
| sanitizer       |  ((v:any) => any) \| null | Custom sanitizer function if sanitize is true     | null
| normalizer      |  ((v:any) => any) \| null | Custop Normalizer function if normalize is true   | null
| validator       |  ((v:any, min:number, max:number, typeCheck:boolean) => any) \| null  | validator function if validate is true            | null

* *Min and max parameters are not used for boolean type*
* *TypeCheck Parameter is not used for boolean, string and array types*


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
