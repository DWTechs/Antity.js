import { isNil } from '@dwtechs/checkard';
import { log } from "@dwtechs/winstan";
import { Type } from './types';
  
/**
 * Validates that a given value is not null or undefined and logs the validation process.
 *
 * @param v - The value to validate.
 * @param key - The key or name associated with the value, used for logging and error messages.
 * @param type - The expected type of the value, used for logging purposes.
 * @returns A string containing an error message if the value is null or undefined, otherwise `null`.
 */
function require(v: unknown, key: string, type: Type): Record<string, unknown> | null {
  log.debug(`require ${key}: ${type} = ${v}`);	
  return isNil(v) ? { status: 400, msg: `Missing ${key} of type ${type}`} : null;
}

export {
  require,
};