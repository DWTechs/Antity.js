/*
MIT License

Copyright (c) 2024 DWTechs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/DWTechs/Antity.js
*/


type Type = keyof typeof Types;
type Method = typeof Methods[number];

declare const Methods: readonly ["GET", "PATCH", "PUT", "POST", "DELETE"];

declare const Types: {
  readonly boolean: {
      readonly validate: (v: any, _min: number, _max: number, _typeCheck: boolean) => v is boolean;
  };
  readonly string: {
      readonly validate: (v: any, min: number, max: number, _typeCheck: boolean) => v is string;
  };
  readonly number: {
      readonly validate: (v: any, min: number, max: number, typeCheck: boolean) => v is number;
  };
  readonly integer: {
      readonly validate: (v: any, min: number, max: number, typeCheck: boolean) => v is number;
  };
  readonly array: {
      readonly validate: (v: any, min: number, max: number, _typeCheck: boolean) => v is any[];
  };
};

declare const Required: {
  validate: (v: any) => boolean;
};

declare class Entity {
    name: string;
    properties: Property[];
    constructor(name: string, properties: Property[]);
    private init;
    validate(rows: Record<string, any>[], verb: Verb): string | null;
    private require;
    private control;
    private normalize;
    private sanitize;
    private trim;
}

declare const Messages: {
    missing: (key: string) => string;
    invalid: (key: string, type: Type) => string;
};

declare class Property {
    key: string;
    type: Type;
    min: number;
    max: number;
    required: boolean;
    typeCheck: boolean;
    methods: Method[];
    sanitize: boolean;
    normalize: boolean;
    control: boolean;
    sanitizer: ((v: any) => any) | null;
    normalizer: ((v: any) => any) | null;
    controller: ((v: any) => any) | null;
    constructor(
      key: string, 
      type: Type, 
      min: number, 
      max: number, 
      required: boolean, 
      typeCheck: boolean, 
      methods: Method[], 
      sanitize: boolean, 
      normalize: boolean, 
      control: boolean, 
      sanitizer: ((v: any) => any) | null, 
      normalizer: ((v: any) => any) | null, 
      controller: ((v: any) => any) | null
    );
}
export type { Type, Method };
export { 
  Entity,
  Property,
  Messages,
  Types,
  Required,
  Methods 
};

