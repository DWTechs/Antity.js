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
import { Types } from './check';
import type { Type, Method } from './types';
import { LOGS_PREFIX, METHODS } from './constants';

export class Property {
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
  sanitizer: ((v:any) => any) | null;
  normalizer: ((v:any) => any) | null;
  validator: ((v:any) => any) | null;
  
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
    sanitizer: ((v:any) => any) | null,
    normalizer: ((v:any) => any) | null,
    validator: ((v:any) => any) | null,
  ) {

    try {
      isString(key, "!0", null, true);
    } catch (err) {
      throw new Error(`${LOGS_PREFIX}Property "key" must be a string - caused by: ${(err as Error).message}`);
    }
    
    try {
      isProperty(Types, type, true, true, true);
    } catch (err) {
      throw new Error(`${LOGS_PREFIX}Property "type" must be a valid type - caused by: ${(err as Error).message}`);
    }
    
    if (isArray(methods)){
      for (const m of methods) {
        try {
          isIn(METHODS as unknown as unknown[], m, 0, true);
        } catch (err) {
          throw new Error(`${LOGS_PREFIX}Property "methods" must be an array of REST methods - caused by: ${(err as Error).message}`);
        }
      }
    }

    this.key = key;
    this.type = type;
    this.min = this.interval(min, type, 0, "1900-01-01T00:00:00Z");
    this.max = this.interval(max, type, 999999999, "2200-12-31T00:00:00Z");
    this.required = isBoolean(required) ? required : false;
    this.safe = isBoolean(safe) ? safe : true;
    this.typeCheck = isBoolean(typeCheck) ? typeCheck : false;
    this.methods = methods || METHODS;
    this.sanitize = isBoolean(sanitize) ? sanitize : true;
    this.normalize = isBoolean(normalize) ? normalize : false;
    this.validate = isBoolean(validate) ? validate : true;
    this.sanitizer = isFunction(sanitizer) ? sanitizer : null;
    this.normalizer = isFunction(normalizer) ? normalizer : null;
    this.validator = isFunction(validator) ? validator : null;
  }

  private interval(
    val: number | Date | null, 
    type: Type,
    integerDefault: number,
    dateDefault: string
  ): number | Date {
    if (type === "date")
      return isDate(val) ? val : new Date(dateDefault);
    return (isNumber(val, true) && isInteger(val, true)) ? val : integerDefault;
  }

}
  