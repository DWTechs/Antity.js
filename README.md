
[![License: MIT](https://img.shields.io/npm/l/@dwtechs/antity.svg?color=brightgreen)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40dwtechs%2Fantity.svg)](https://www.npmjs.com/package/@dwtechs/antity)
[![last version release date](https://img.shields.io/github/release-date/DWTechs/Antity.js)](https://www.npmjs.com/package/@dwtechs/antity)
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
    operations: ["select", "update", "delete"],
    required: true,
    safe: true,
    sanitize: true,
    normalize: true,
    control: true,
    sanitizer: null,
    normalizer: null,
    controller: null,
  },
  {
    key: "firstName",
    type: "string",
    min: 0,
    max: 255,
    typeCheck: true,
    operations: ["select", "insert", "update", "delete"],
    required: true,
    safe: true,
    sanitize: true,
    normalize: true,
    control: true,
    sanitizer: null,
    normalizer: normalizeName,
    controller: null,
  },
  {
    key: "lastName",
    type: "string",
    min: 0,
    max: 255,
    typeCheck: true,
    operations: ["select", "insert", "update", "delete"],
    required: true,
    safe: true,
    sanitize: true,
    normalize: true,
    control: true,
    sanitizer: null,
    normalizer: normalizeName,
    controller: null,
  },
  {
    key: "nickname",
    type: "string",
    min: 0,
    max: 255,
    typeCheck: true,
    operations: ["select", "insert", "update", "delete"],
    required: true,
    safe: true,
    sanitize: true,
    normalize: true,
    control: true,
    sanitizer: null,
    normalizer: normalizeNickname,
    controller: null,
  },
]);

req.body = entity.normalize(req.body); // will also sanitize if true
const check = entity.validate(req.body, "select");
const unsafeProps = entity.getUnsafeProps();

```


## API Reference


```javascript

type Type = "boolean" | 
            "string" | 
            "number" | 
            "integer" | 
            "float" |
            "even" |
            "odd" |
            "positve" |
            "negative" |
            "powerOfTwo" |
            "ascii" |
            "array" | 
            "jwt" |
            "symbol" | 
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
            
type Operation = "select" | "insert" | "update" | "merge" | "delete";
type Method = "GET" | "PATCH" | "PUT" | "POST" | "DELETE";

class Property {
  key: string;
  type: Type;
  min: number | Date;
  max: number | Date;
  required: boolean;
  safe: boolean;
  typeCheck: boolean;
  operations: Operation[];
  sanitize: boolean;
  normalize: boolean;
  control: boolean;
  sanitizer: Function | null;
  normalizer: Function | null;
  controller: Function | null;
};

class Entity {
  table: string;
  cols: Record<Operation, string[]>;
  properties: Property[];
  normalize(rows: Record<string, any>[]): Record<string, any>[]; // will also sanitize if true
  validate(rows: Record<string, any>[], operation: Operation | Method): string | null;
  getTable(): string;
  // if pagination is true for a select operation, it will return cols + a total column 
  getCols(operation: Operation, stringify?: boolean, pagination?: boolean): string[] | string;
  getUnsafeProps(): string[];
}

```

### REST Methods mapping

When validating request inputs, you can use REST methods or SQL operations as second parameter 

| REST method | SQL operation |
| :---------- | :------------ |
| GET         | select        |
| PATCH       | update        |
| PUT         | update        |
| POST        | insert        |
| DELETE      | delete        |

examples : 

```javascript

entity.validate(req.body, "GET"); // will validate "select" properties
entity.validate(req.body, "PUT"); // will validate "update" properties
entity.validate(req.body, "DELETE"); // will validate "delete" properties

```


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
| operations      |  Operation[]              | SQL DML operations concerned by the property      | [ "select", "insert", "update", "merge", "delete" ]
| sanitize        |  boolean                  | Sanitize the property if true                     | true
| normalize       |  boolean                  | Normalize the property if true                    | false
| control         |  boolean                  | Control the property if true                      | true
| sanitizer       |  ((v:any) => any) \| null | Sanitizer function if sanitize is true            | null
| normalizer      |  ((v:any) => any) \| null | Normalizer function if normalize is true          | null
| controller      |  ((v:any, min:number, max:number, typeCheck:boolean) => any) \| null  | Controller function if control is true            | null

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
