import type { Type } from './types';
import { 
  PWD_MIN_LENGTH,
  PWD_MAX_LENGTH,
  PWD_NUMBERS,
  PWD_UPPERCASE,
  PWD_LOWERCASE,
  PWD_SYMBOLS
} from './constants';

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
  isObject,
  isAnsiEscapeCode,
  isLocale,
  isTimeZone
} from '@dwtechs/checkard';

const Types: Record<Type, { validate: (v: any, min: number | Date, max: number | Date, typeCheck: boolean) => boolean }> = {
  boolean: {
    validate: (v: any, _min: number | Date, _max: number | Date, _typeCheck: boolean) => 
      isBoolean(v, true)
  },
  string: {
    validate: (v: any, min: number | Date, max: number | Date, _typeCheck: boolean) => 
      isStringOfLength(v, min as number, max as number, true)
  },
  number: {
    validate: (v: any, min: number | Date, max: number | Date, typeCheck: boolean) => 
      isValidNumber(v, (min as number) || undefined, (max as number) || undefined, typeCheck || undefined, true)
  },
  integer: {
    validate: (v: any, min: number | Date, max: number | Date, typeCheck: boolean) => 
      isValidInteger(v, (min as number) ?? undefined, (max as number) ?? undefined, typeCheck || undefined, true)
  },
  float: {
    validate: (v: any, min: number | Date, max: number | Date, typeCheck: boolean) => 
      isValidFloat(v, (min as number) || undefined, (max as number) || undefined, typeCheck || undefined, true)
  },
  even: {
    validate: (v: any, _min: number | Date, _max: number | Date, typeCheck: boolean) => 
      isEven(v, typeCheck || undefined, true)
  },
  odd: {
    validate: (v: any, _min: number | Date, _max: number | Date, typeCheck: boolean) => 
      isOdd(v, typeCheck || undefined, true)
  },
  positive: {
    validate: (v: any, _min: number | Date, _max: number | Date, typeCheck: boolean) => 
      isPositive(v, typeCheck || undefined, true)
  },
  negative: {
    validate: (v: any, _min: number | Date, _max: number | Date, typeCheck: boolean) => 
      isNegative(v, typeCheck || undefined, true)
  },
  powerOfTwo: {
    validate: (v: any, _min: number | Date, _max: number | Date, typeCheck: boolean) => 
      isPowerOfTwo(v, typeCheck || undefined, true)
  },
  ascii: {
    validate: (v: any, _min: number | Date, _max: number | Date, typeCheck: boolean) => 
      isAscii(v, typeCheck || undefined, true) // typeCheck = extended ASCII
  },
  array: {
    validate: (v: any, min: number | Date, max: number | Date, _typeCheck: boolean) => 
      isArrayOfLength(v, (min as number) || undefined, (max as number) || undefined, true)
  },
  password: {
    validate: (v: any, min: number | Date, max: number | Date, _typeCheck: boolean) => {
      const o = { 
        minLength: (min as number) || PWD_MIN_LENGTH,
        maxLength: (max as number) || PWD_MAX_LENGTH,
        lowerCase: PWD_LOWERCASE,
        upperCase: PWD_UPPERCASE,
        number: PWD_NUMBERS,
        specialCharacter: PWD_SYMBOLS, 
      };
      return isValidPassword(v, o, true);
    }
  },
  email: {
    validate: (v: any, _min: number | Date, _max: number | Date, _typeCheck: boolean) => 
      isEmail(v, true)
  },
  regex: {
    validate: (v: any, _min: number | Date, _max: number | Date, typeCheck: boolean) => 
      isRegex(v, typeCheck || undefined, true)
  },
  json: {
    validate: (v: any, _min: number | Date, _max: number | Date, _typeCheck: boolean) => 
      isJson(v, true)
  },
  jwt: {
    validate: (v: any, _min: number | Date, _max: number | Date, _typeCheck: boolean) => 
      isJWT(v, true)
  },
  symbol: {
    validate: (v: any, _min: number | Date, _max: number | Date, _typeCheck: boolean) => 
      isSymbol(v, true)
  },
  ipAddress: {
    validate: (v: any, _min: number | Date, _max: number | Date, _typeCheck: boolean) => 
      isIpAddress(v, true)
  },
  slug: {
    validate: (v: any, _min: number | Date, _max: number | Date, _typeCheck: boolean) => 
      isSlug(v, true)
  },
  hexadecimal: {
    validate: (v: any, _min: number | Date, _max: number | Date, _typeCheck: boolean) => 
      isHexadecimal(v, true)
  },
  date: {
    validate: (v: any, min: Date | number, max: Date | number, _typeCheck: boolean) => 
      isValidDate(v, min || undefined, max || undefined, true)
  },
  timestamp: {
    validate: (v: any, min: number | Date, max: number | Date, typeCheck: boolean) => 
      isValidTimestamp(v, min || undefined, max || undefined, typeCheck || undefined, true)
  },
  function: {
    validate: (v: any, _min: number | Date, _max: number | Date, _typeCheck: boolean) => 
      isFunction(v, true)
  },
  htmlElement: {
    validate: (v: any, _min: number | Date, _max: number | Date, _typeCheck: boolean) => 
      isHtmlElement(v, true)
  },
  htmlEventAttribute: {
    validate: (v: any, _min: number | Date, _max: number | Date, _typeCheck: boolean) => 
      isHtmlEventAttribute(v, true)
  },
  node: {
    validate: (v: any, _min: number | Date, _max: number | Date, _typeCheck: boolean) => 
      isNode(v, true)
  },
  object: {
    validate: (v: any, _min: number | Date, _max: number | Date, _typeCheck: boolean) => 
      isObject(v, true)
  },
  ansiEscapeCode: {
    validate: (v: any, _min: number | Date, _max: number | Date, _typeCheck: boolean) => 
      isAnsiEscapeCode(v, true)
  },
  locale: {
    validate: (v: any, _min: number | Date, _max: number | Date, typeCheck: boolean) => 
      isLocale(v, typeCheck || undefined, true)
  },
  timeZone: {
    validate: (v: any, _min: number | Date, _max: number | Date, _typeCheck: boolean) => 
      isTimeZone(v, true)
  }
};

export { Types };
  