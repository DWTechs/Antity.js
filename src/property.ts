import { 
  isString,
  isArray,
  isIn,
  isProperty,
  isInteger,
  isBoolean,
  isFunction } from '@dwtechs/checkard';
import { Methods } from './methods';
import { Types } from './checks';
import type { Type, Method } from './types';

export class Property {
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
  sanitizer: ((v:any) => any) | null;
  normalizer: ((v:any) => any) | null;
  controller: ((v:any) => any) | null;
  
  constructor(
    key: string,
    type: Type,
    min: number | Date,
    max: number | Date,
    required: boolean,
    typeCheck: boolean,
    methods: Method[],
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
    if (isArray(methods)){
      for (const m of methods) {
        if (!isIn(m, Methods as unknown as any[]))
          throw new Error(`Property methods must be an array of REST Methods. Received ${m}`);
      }
    }

    this.key = key;
    this.type = type;
    this.min = isInteger(min, true) ? min : 0;
    this.max = isInteger(max, true) ? max : 999999999;
    this.required = isBoolean(required) ? required : false;
    this.typeCheck = isBoolean(typeCheck) ? typeCheck : false;
    this.methods = methods || Methods;
    this.sanitize = isBoolean(sanitize) ? sanitize : true;
    this.normalize = isBoolean(normalize) ? normalize : false;
    this.control = isBoolean(control) ? control : true;
    this.sanitizer = isFunction(sanitizer) ? sanitizer : null;
    this.normalizer = isFunction(normalizer) ? normalizer : null;
    this.controller = isFunction(controller) ? controller : null;
  }

}
  