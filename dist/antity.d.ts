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
  [key: string]: {
      validate: (v: any, min: number | Date, max: number | Date, typeCheck: boolean) => boolean;
  };
};

declare const Required: {
  validate: (v: any) => boolean;
};

declare class Entity {
  name: string;
  table: string;
  properties: Property[];
  constructor(name: string, table: string, properties: Property[]);
  private init;
  cols(method: Method): string[];
  normalize(rows: Record<string, any>[]): Record<string, any>[];
  validate(rows: Record<string, any>[], method: Method): string | null;
  private require;
  private control;
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
  constructor(key: string,
    type: Type,
    min: number | Date,
    max: number | Date,
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

