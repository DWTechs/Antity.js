
type Operation = typeof Operations[number];
type Method = typeof Methods[number];
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

declare const Operations: readonly [ "select", "insert", "update", "merge", "delete" ];
declare const Methods: readonly [ "GET", "PATCH", "PUT", "POST", "DELETE" ];

declare const Types: Record<Type, {
  validate: (v: any, min: number | Date, max: number | Date, typeCheck: boolean) => boolean;
}>;

declare const Required: {
  validate: (v: any) => boolean;
};

declare class Entity {
  private _table;
  private _cols;
  private _unsafeProps;
  private _properties;
  constructor(table: string, properties: Property[]);
  get table(): string;
  get unsafeProps(): string[];
  get cols(): Record<Operation, string[]>;
  get properties(): Property[];
  getColsByOp(operation: Operation, stringify?: boolean, pagination?: boolean): string[] | string;
  getProperty(key: string): Property | undefined;
  normalize(rows: Record<string, unknown>[]): Record<string, unknown>[];
  validate(rows: Record<string, unknown>[], operation: Operation | Method): string | null;
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
  min: number | Date;
  max: number | Date;
  required: boolean;
  safe: boolean;
  typeCheck: boolean;
  operations: Operation[];
  sanitize: boolean;
  normalize: boolean;
  control: boolean;
  sanitizer: ((v: any) => any) | null;
  normalizer: ((v: any) => any) | null;
  controller: ((v: any) => any) | null;
  constructor(
    key: string,
    type: Type,
    min: number | Date,
    max: number | Date,
    required: boolean,
    safe: boolean,
    typeCheck: boolean,
    operations: Operation[],
    sanitize: boolean,
    normalize: boolean,
    control: boolean,
    sanitizer: ((v: any) => any) | null,
    normalizer: ((v: any) => any) | null,
    controller: ((v: any) => any) | null
  );
}

export type { Type, Operation, Method };
export { 
  Entity,
  Property,
  Messages,
  Types,
  Required,
  Operations,
  Methods,
};

