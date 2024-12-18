import { isBoolean, isString, isValidInteger, isValidNumber, isArray, isNil } from '@dwtechs/checkard';

const Types = {
  boolean: {
    validate: (v: any, _min: number, _max: number, _typeCheck: boolean) => isBoolean(v)
  },
  string: {
    validate: (v: any, _min: number, _max: number, _typeCheck: boolean) => isString(v, false)
  },
  number: {
    validate: (v: any, min: number, max: number, typeCheck: boolean) => isValidNumber(v, min || undefined, max || undefined, typeCheck || undefined)
  },
  integer: {
    validate: (v: any, min: number, max: number, typeCheck: boolean) => isValidInteger(v, min || undefined, max || undefined, typeCheck || undefined)
  },
  array: {
    validate: (v: any, min: number, max: number, _typeCheck: boolean) => isArray(v, min, max)
  }
} as const;

const Required = {
  validate: (v: any) => !isNil(v)
};

export { Types, Required };
  