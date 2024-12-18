
[![License: MIT](https://img.shields.io/npm/l/@dwtechs/antity.svg?color=brightgreen)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40dwtechs%2Fantity.svg)](https://www.npmjs.com/package/@dwtechs/antity)
[![last version release date](https://img.shields.io/github/release-date/DWTechs/Antity.js)](https://www.npmjs.com/package/@dwtechs/antity)
[![minified size](https://img.shields.io/bundlephobia/min/@dwtechs/antity?color=brightgreen)](https://www.npmjs.com/package/@dwtechs/antity)

- [Synopsis](#synopsis)
- [Support](#support)
- [Installation](#installation)
- [Usage](#usage)
  - [ES6](#es6)
- [Configure](#configure)
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

- node: 16

This is the oldest targeted versions. The library should work properly on older versions of Node.js but we do not support it officially.  


## Installation

```bash
$ npm i @dwtechs/antity
```


## Usage


### ES6 / TypeScript

```javascript

import { Entity } from "@dwtechs/antity";

const entity = new Entity("consumer", [
  {
    key: "id",
    type: "integer",
    min: 0,
    max: 999999999,
    typeCheck: true,
    required: true,
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
    max: 999999999,
    typeCheck: true,
    required: true,
    sanitize: true,
    normalize: true,
    control: true,
    sanitizer: null,
    normalizer: null,
    controller: null,
  },
  {
    key: "lastName",
    type: "string",
    min: 0,
    max: 999999999,
    typeCheck: true,
    required: true,
    sanitize: true,
    normalize: true,
    control: true,
    sanitizer: null,
    normalizer: null,
    controller: null,
  },
  {
    key: "nickname",
    type: "string",
    min: 0,
    max: 999999999,
    typeCheck: true,
    required: true,
    sanitize: true,
    normalize: true,
    control: true,
    sanitizer: null,
    normalizer: null,
    controller: null,
  },
]);

```


## API Reference


```javascript

export type Type = "boolean" | "string" | "number" | "integer" | "array";
export type Verb = "GET" | "PATCH" | "PUT" | "POST" | "DELETE";

class Property {
  key: string;
  type: Type;
  min: number;
  max: number;
  required: boolean;
  typeCheck: boolean;
  verbs: Verb[];
  sanitize: boolean;
  normalize: boolean;
  control: boolean;
  sanitizer: Function | null;
  normalizer: Function | null;
  controller: Function | null;
};

class Entity {
  name: string;
  properties: Property[];
  validate: Function;
}

```


## Contributors

Winstan.js is still in development and we would be glad to get all the help you can provide.
To contribute please read **[contributor.md](https://github.com/DWTechs/Antity.js/blob/main/contributor.md)** for detailed installation guide.


## Stack

| Purpose         |                    Choice                    |                                                     Motivation |
| :-------------- | :------------------------------------------: | -------------------------------------------------------------: |
| repository      |        [Github](https://github.com/)         |     hosting for software development version control using Git |
| package manager |     [npm](https://www.npmjs.com/get-npm)     |                                default node.js package manager |
| language        | [TypeScript](https://www.typescriptlang.org) | static type checking along with the latest ECMAScript features |
| module bundler  |      [Rollup](https://rollupjs.org)          |                        advanced module bundler for ES6 modules |
| unit testing    |          [Jest](https://jestjs.io/)          |                  delightful testing with a focus on simplicity |
