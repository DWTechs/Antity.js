import { isBoolean, isString, isValidInteger, isValidNumber, isArray, isNil } from '@dwtechs/checkard';

const Types = {
  boolean: {
    validate: (v: any, min: number, max: number, typeCheck: boolean) => isBoolean(v)
  },
  string: {
    validate: (v: any, min: number, max: number, typeCheck: boolean) => isString(v, false)
  },
  number: {
    validate: (v: any, min: number, max: number, typeCheck: boolean) => isValidNumber(v, min || null, max || null, typeCheck || null)
  },
  integer: {
    validate: (v: any, min: number, max: number, typeCheck: boolean) => isValidInteger(v, min || null, max || null, typeCheck || null)
  },
  array: {
    validate: (v: any, min: number, max: number, typeCheck: boolean) => isArray(v, min, max)
  }
} as const;

const Required = {
  validate: (v: any) => !isNil(v)
};

export { Types, Required };
  