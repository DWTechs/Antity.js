import { isString, isArray, isIn, isProperty, isInteger, isBoolean, isFunction } from '@dwtechs/checkard';
import { Verbs } from './verbs';
import { Types } from './checks';
import type { Type, Verb } from './types';

export class Property {
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
  sanitizer: ((v:any) => any) | null;
  normalizer: ((v:any) => any) | null;
  controller: ((v:any) => any) | null;
  
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
    sanitizer: ((v:any) => any) | null,
    normalizer: ((v:any) => any) | null,
    controller: ((v:any) => any) | null,
  ) {

    if (!isString(key, true)) 
      throw new Error(`Property key must be a string. Received ${key}`);
    if (!isProperty(type, Types))
      throw new Error(`Property type must be a valid type. Received ${type}`);
    if (isArray(verbs)){
      for (const v of verbs) {
        if (!isIn(v, Verbs as unknown as any[]))
          throw new Error(`Property verbs must be an array of REST Verbs. Received ${v}`);
      }
    }

    this.key = key;
    this.type = type;
    this.min = isInteger(min, true) ? min : 0;
    this.max = isInteger(max, true) ? max : 999999999;
    this.required = isBoolean(required) ? required : false;
    this.typeCheck = isBoolean(typeCheck) ? typeCheck : false;
    this.verbs = verbs || Verbs;
    this.sanitize = isBoolean(sanitize) ? sanitize : true;
    this.normalize = isBoolean(normalize) ? normalize : false;
    this.control = isBoolean(control) ? control : true;
    this.sanitizer = isFunction(sanitizer) ? sanitizer : null;
    this.normalizer = isFunction(normalizer) ? normalizer : null;
    this.controller = isFunction(controller) ? controller : null;
  }

}
  