
type Type = keyof typeof Types;
type Method = typeof Methods[number];

declare const Methods: readonly ["GET", "PATCH", "PUT", "POST", "DELETE"];

declare const Types: {
  [key: string]: {
      validate: (v: any, min: number | Date, max: number | Date, typeCheck: boolean) => boolean;
  };
};

// declare const Types: {
//   readonly boolean: {
//       readonly validate: (v: any, _min: number, _max: number, _typeCheck: boolean) => v is boolean;
//   };
//   readonly string: {
//       readonly validate: (v: any, min: number, max: number, _typeCheck: boolean) => v is string;
//   };
//   readonly number: {
//       readonly validate: (v: any, min: number, max: number, typeCheck: boolean) => v is number;
//   };
//   readonly integer: {
//       readonly validate: (v: any, min: number, max: number, typeCheck: boolean) => v is number;
//   };
//   readonly array: {
//       readonly validate: (v: any, min: number, max: number, _typeCheck: boolean) => v is any[];
//   };
// };

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

