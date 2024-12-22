
type Type = keyof typeof Types;
type Verb = typeof Verbs[number];

declare const Verbs: readonly ["GET", "PATCH", "PUT", "POST", "DELETE"];

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
    verbs: Verb[];
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
      verbs: Verb[], 
      sanitize: boolean, 
      normalize: boolean, 
      control: boolean, 
      sanitizer: ((v: any) => any) | null, 
      normalizer: ((v: any) => any) | null, 
      controller: ((v: any) => any) | null
    );
}
export type { Type, Verb };
export { 
  Entity,
  Property,
  Messages,
  Types,
  Required,
  Verbs 
};

