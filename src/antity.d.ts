import type { Request, Response, NextFunction } from 'express';
declare const Methods: readonly [ "GET", "PATCH", "PUT", "POST", "DELETE" ];
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

declare class Entity {
  private _name;
  private _unsafeProps;
  private _properties;
  constructor(name: string, properties: Property[]);
  get name(): string;
  get unsafeProps(): string[];
  get properties(): Property[];
  set name(name: string);
  getProp(key: string): Property | undefined;
  getPropsByMethod(method: Method): Property[];
  normalize: (req: Request, _res: Response, next: NextFunction) => void;
  validate: (req: Request, _res: Response, next: NextFunction) => void;
}

declare class Property {
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
  sanitizer: ((v: any) => any) | null;
  normalizer: ((v: any) => any) | null;
  validator: ((v: any) => any) | null;
  constructor(
    key: string,
    type: Type,
    min: number | Date | null,
    max: number | Date | null,
    required: boolean,
    safe: boolean,
    typeCheck: boolean,
    methods: Method[],
    sanitize: boolean,
    normalize: boolean,
    validate: boolean,
    sanitizer: ((v: any) => any) | null,
    normalizer: ((v: any) => any) | null,
    validator: ((v: any) => any) | null
  );
}

export type { Type, Method };
export { 
  Entity,
  Property,
};

