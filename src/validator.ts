import { isIn } from '@dwtechs/checkard';
import { control } from './control';
import { require } from './require';
import type { Property } from './property';
import type { Method } from './types';

export type ValidationError = {
  statusCode: number;
  message: string;
};

/**
 * Applies validation to a single record based on property configurations and HTTP method.
 *
 * @param {Record<string, unknown>} record - The record to validate
 * @param {Property[]} properties - The property configurations to apply
 * @param {Method} method - The HTTP method to check against
 * @returns {ValidationError | null} - Error object if validation fails, null if successful
 */
export function applyValidation(
  record: Record<string, unknown>,
  properties: Property[],
  method: Method
): ValidationError | null {
  for (const { 
    key, 
    type,
    min,
    max,
    required,
    typeCheck,
    methods,
    validate,
    validator
  } of properties) {
    const v = record[key];
    if (isIn(methods, method)) {
      if (required) {
        const rq = require(v, key, type);
        if (rq)
          return rq;
      }
      if (v && validate) {
        const ct = control(v, key, type, min, max, typeCheck, validator);
        if (ct)
          return ct;
      }
    }
  }
  return null;
}
