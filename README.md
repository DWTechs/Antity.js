
[![License: MIT](https://img.shields.io/npm/l/@dwtechs/antity.svg?color=brightgreen)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40dwtechs%2Fantity.svg)](https://www.npmjs.com/package/@dwtechs/antity)
[![last version release date](https://img.shields.io/github/release-date/DWTechs/Antity.js)](https://www.npmjs.com/package/@dwtechs/antity)
![Jest:coverage](https://img.shields.io/badge/Jest:coverage-100%25-brightgreen.svg)
[![minified size](https://img.shields.io/bundlephobia/min/@dwtechs/antity?color=brightgreen)](https://www.npmjs.com/package/@dwtechs/antity)

- [Synopsis](#synopsis)
- [Support](#support)
- [Installation](#installation)
- [Usage](#usage)
  - [ES6](#es6)
- [API Reference](#api-reference)
- [Contributors](#contributors)
- [Stack](#stack)


## Synopsis

**[Antity.js](https://github.com/DWTechs/Antity.js)** is an Open source library for easy entity management.

- Only 1 small dependency to check inputs variables
- Very lightweight
- Thoroughly tested
- Works in Javascript, Typescript
- Can be used as EcmaScrypt module
- Written in Typescript


## Support

- node: 22

This is the oldest targeted versions. The library should work properly on older versions of Node.js but we do not support it officially.  


## Installation

```bash
$ npm i @dwtechs/antity
```


## Usage


### ES6 / TypeScript

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
  min: number | Date;
  max: number | Date;
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
   * Retrieves a property from the `properties` array that matches the specified key.
   *
   * @param {string} key - The key of the property to retrieve.
   * @returns {Property | undefined} - The property object if found, otherwise `undefined`.
   */
  getProp(key: string): Property | undefined;

  /**
   * Retrieves a list of properties associated with a specific method.
   *
   * @param {Method} method - The method to filter properties by.
   * @returns {Property[]} An array of properties that are associated with the specified method.
   */
  getPropsByMethod(method: Method): Property[];
  
  /**
   * Normalizes an array of records by applying sanitization and normalization
   * rules defined in the `properties` of the class.
   */
  normalize: (req: Request, _res: Response, next: NextFunction) => void;
  
  /**
   * Validates a set of rows against the defined properties and operation/method.
   *
   * If a property is required and missing, or if it fails the control checks, the function returns an error message.
   * Otherwise, it returns `null` indicating successful validation.
   */
  validate: (req: Request, _res: Response, next: NextFunction) => void;
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
| required        |  boolean                  | Is this property required on insert               | false
| safe            |  boolean                  | Is this property safe to send to the client       | true
| typeCheck       |  boolean                  | Type is checked if true                           | false
| methods         |  Method[]                 | SQL DML operations concerned by the property      | [ "select", "insert", "update", "merge", "delete" ]
| sanitize        |  boolean                  | Sanitize the property if true                     | true
| normalize       |  boolean                  | Normalize the property if true                    | false
| validate        |  boolean                  | validate the property if true                     | true
| sanitizer       |  ((v:any) => any) \| null | Sanitizer function if sanitize is true            | null
| normalizer      |  ((v:any) => any) \| null | Normalizer function if normalize is true          | null
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
