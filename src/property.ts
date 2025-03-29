import { 
  isString,
  isNumber,
  isArray,
  isDate,
  isIn,
  isProperty,
  isInteger,
  isBoolean,
  isFunction } from '@dwtechs/checkard';
import { Operations } from './operations';
import { Types } from './check';
import type { Type, Operation } from './types';

export class Property {
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
  sanitizer: ((v:any) => any) | null;
  normalizer: ((v:any) => any) | null;
  controller: ((v:any) => any) | null;
  
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
    sanitizer: ((v:any) => any) | null,
    normalizer: ((v:any) => any) | null,
    controller: ((v:any) => any) | null,
  ) {

    if (!isString(key, "!0")) 
      throw new Error(`Property "key" must be a string. Received ${key}`);
    if (!isProperty(Types, type))
      throw new Error(`Property "type" must be a valid type. Received ${type}`);
    if (isArray(operations)){
      for (const o of operations) {
        if (!isIn(Operations as unknown as unknown[], o))
          throw new Error(`Property "operations" must be an array of SQL operations. Received ${o}`);
      }
    }

    this.key = key;
    this.type = type;
    this.min = this.interval(min, type, 0, "1900-01-01T00:00:00Z");
    this.max = this.interval(max, type, 999999999, "2200-12-31T00:00:00Z");
    this.required = isBoolean(required) ? required : false;
    this.safe = isBoolean(safe) ? safe : true;
    this.typeCheck = isBoolean(typeCheck) ? typeCheck : false;
    this.operations = operations || Operations;
    this.sanitize = isBoolean(sanitize) ? sanitize : true;
    this.normalize = isBoolean(normalize) ? normalize : false;
    this.control = isBoolean(control) ? control : true;
    this.sanitizer = isFunction(sanitizer) ? sanitizer : null;
    this.normalizer = isFunction(normalizer) ? normalizer : null;
    this.controller = isFunction(controller) ? controller : null;
  }

  private interval(
    val: number | Date, 
    type: Type,
    integerDefault: number,
    dateDefault: string
  ): number | Date {
    if (type === "date")
      return isDate(val) ? val : new Date(dateDefault);
    return (isNumber(val, true) && isInteger(val, true)) ? val : integerDefault;
  }

}
  