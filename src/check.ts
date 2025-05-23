import type { Type } from './types';

const {
  PWD_MIN_LENGTH_POLICY,
  PWD_MAX_LENGTH_POLICY,
  PWD_NUMBERS_POLICY,
  PWD_UPPERCASE_POLICY,
  PWD_LOWERCASE_POLICY,
  PWD_SYMBOLS_POLICY
} = process.env;

const PWD_MIN_LENGTH = PWD_MIN_LENGTH_POLICY ? +PWD_MIN_LENGTH_POLICY : 9;
const PWD_MAX_LENGTH = PWD_MAX_LENGTH_POLICY ? +PWD_MAX_LENGTH_POLICY : 20;
const PWD_NUMBERS = PWD_NUMBERS_POLICY ? true : false;
const PWD_UPPERCASE = PWD_UPPERCASE_POLICY ? true : false;
const PWD_LOWERCASE = PWD_LOWERCASE_POLICY ? true : false;
const PWD_SYMBOLS = PWD_SYMBOLS_POLICY ? true : false;


import { 
  isSymbol,
  isBoolean,
  isStringOfLength,
  isArrayOfLength,
  isValidInteger,
  isValidFloat,
  isValidNumber,
  isValidPassword,
  isEmail,
  isRegex,
  isJson,
  isJWT,
  isEven,
  isOdd,
  isPositive,
  isNegative,
  isPowerOfTwo,
  isAscii,
  isIpAddress,
  isSlug,
  isHexadecimal,
  isValidDate,
  isValidTimestamp,
  isFunction,
  isHtmlElement,
  isHtmlEventAttribute,
  isNode,
  isObject
} from '@dwtechs/checkard';

const Types: Record<Type, { validate: (v: any, min: number | Date, max: number | Date, typeCheck: boolean) => boolean }> = {
  boolean: {
    validate: (v: any, _min: number, _max: number, _typeCheck: boolean) => 
      isBoolean(v)
  },
  string: {
    validate: (v: any, min: number, max: number, _typeCheck: boolean) => 
      isStringOfLength(v, min, max)
  },
  number: {
    validate: (v: any, min: number, max: number, typeCheck: boolean) => 
      isValidNumber(v, min || undefined, max || undefined, typeCheck || undefined)
  },
  integer: {
    validate: (v: any, min: number, max: number, typeCheck: boolean) => 
      isValidInteger(v, min ?? undefined, max ?? undefined, typeCheck || undefined)
  },
  float: {
    validate: (v: any, min: number, max: number, typeCheck: boolean) => 
      isValidFloat(v, min || undefined, max || undefined, typeCheck || undefined)
  },
  even: {
    validate: (v: any, _min: number, _max: number, typeCheck: boolean) => 
      isEven(v, typeCheck || undefined)
  },
  odd: {
    validate: (v: any, _min: number, _max: number, typeCheck: boolean) => 
      isOdd(v, typeCheck || undefined)
  },
  positive: {
    validate: (v: any, _min: number, _max: number, typeCheck: boolean) => 
      isPositive(v, typeCheck || undefined)
  },
  negative: {
    validate: (v: any, _min: number, _max: number, typeCheck: boolean) => 
      isNegative(v, typeCheck || undefined)
  },
  powerOfTwo: {
    validate: (v: any, _min: number, _max: number, typeCheck: boolean) => 
      isPowerOfTwo(v, typeCheck || undefined)
  },
  ascii: {
    validate: (v: any, _min: number, _max: number, typeCheck: boolean) => 
      isAscii(v, typeCheck || undefined) // typeCheck = extended ASCII
  },
  array: {
    validate: (v: any, min: number, max: number, _typeCheck: boolean) => 
      isArrayOfLength(v, min || undefined, max || undefined)
  },
  password: {
    validate: (v: any, min: number, max: number, _typeCheck: boolean) => {
      const o = { 
        minLength: min || PWD_MIN_LENGTH,
        maxLength: max || PWD_MAX_LENGTH,
        lowerCase: PWD_LOWERCASE,
        upperCase: PWD_UPPERCASE,
        number: PWD_NUMBERS,
        specialCharacter: PWD_SYMBOLS, 
      };
      return isValidPassword(v, o);
    }
  },
  email: {
    validate: (v: any, _min: number, _max: number, _typeCheck: boolean) => 
      isEmail(v)
  },
  regex: {
    validate: (v: any, _min: number, _max: number, typeCheck: boolean) => 
      isRegex(v, typeCheck || undefined)
  },
  json: {
    validate: (v: any, _min: number, _max: number, _typeCheck: boolean) => 
      isJson(v)
  },
  jwt: {
    validate: (v: any, _min: number, _max: number, _typeCheck: boolean) => 
      isJWT(v)
  },
  symbol: {
    validate: (v: any, _min: number, _max: number, _typeCheck: boolean) => 
      isSymbol(v)
  },
  ipAddress: {
    validate: (v: any, _min: number, _max: number, _typeCheck: boolean) => 
      isIpAddress(v)
  },
  slug: {
    validate: (v: any, _min: number, _max: number, _typeCheck: boolean) => 
      isSlug(v)
  },
  hexadecimal: {
    validate: (v: any, _min: number, _max: number, _typeCheck: boolean) => 
      isHexadecimal(v)
  },
  date: {
    validate: (v: any, min: Date, max: Date, _typeCheck: boolean) => 
      isValidDate(v, min || undefined, max || undefined)
  },
  timestamp: {
    validate: (v: any, min: number, max: number, typeCheck: boolean) => 
      isValidTimestamp(v, min || undefined, max || undefined, typeCheck || undefined)
  },
  function: {
    validate: (v: any, _min: number, _max: number, _typeCheck: boolean) => 
      isFunction(v)
  },
  htmlElement: {
    validate: (v: any, _min: number, _max: number, _typeCheck: boolean) => 
      isHtmlElement(v)
  },
  htmlEventAttribute: {
    validate: (v: any, _min: number, _max: number, _typeCheck: boolean) => 
      isHtmlEventAttribute(v)
  },
  node: {
    validate: (v: any, _min: number, _max: number, _typeCheck: boolean) => 
      isNode(v)
  },
  object: {
    validate: (v: any, _min: number, _max: number, _typeCheck: boolean) => 
      isObject(v)
  }
};

export { Types };
  