import { isString, isArray, isIn, isInteger, isBoolean, isFunction } from '@dwtechs/checkard';
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
  // primary: boolean;
  verbs: Verb[];
  normalize: Function;
  control: Function;
  
  constructor(
    key: string,
    type: Type,
    min: number,
    max: number,
    required: boolean,
    typeCheck: boolean,
    // primary: boolean,
    verbs: Verb[],
    normalize: Function | null,
    control: Function | null
  ) {

    if (!isString(key, true)) 
      throw new Error(`Property key must be a string. Received ${key}`);
    if (!isIn(type, Types))
      throw new Error(`Property type must be a valid type. Received ${type}`);
    if (!isArray(verbs)){
      for (const v of verbs) {
        if (!isIn(v, Verbs))
          throw new Error(`Property verbs must be an array of REST Verbs. Received ${v}`);
      }
    }

    this.key = key;
    this.type = type;
    this.min = isInteger(min, true) ? min : 0;
    this.max = isInteger(max, true) ? max : 999999999;
    this.required = isBoolean(required) ? required : false;
    this.typeCheck = isBoolean(typeCheck) ? typeCheck : false;
    // this.primary = primary || false;
    this.verbs = verbs || Verbs;
    this.normalize = isFunction(normalize) ? normalize : null;
    this.control = isFunction(control) ? control : null;
  }

}
  