import { isNil } from '@dwtechs/checkard';
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
 * `readOnly` properties are skipped (never required, never checked) unless `allowReadOnly`
 * is set, matching `normalize()` — by the time validation runs, `normalize()` has already
 * stripped them from the record for an untrusted (client) write.
 *
 * @param {Record<string, unknown>} record - The record to validate
 * @param {Property[]} properties - The property configurations to apply
 * @param {Method} method - The HTTP method to check against
 * @param {boolean} [allowReadOnly=false] - Whether readOnly properties may be written
 * @returns {ValidationError | null} - Error object if validation fails, null if successful
 */
export function validate(
  record: Record<string, unknown>,
  properties: Property[],
  method: Method,
  allowReadOnly = false,
): ValidationError | null {
  for (const {
    key,
    type,
    min,
    max,
    requiredFor,
    isTypeChecked,
    readOnly,
    validator,
  } of properties) {
    if (readOnly && !allowReadOnly) continue;
    const v = record[key];
    if (requiredFor.includes(method)) {
      const rq = require(v, key, type);
      if (rq) return rq;
    }
    if (!isNil(v)) {
      const ct = control(v, key, type, min, max, isTypeChecked, validator);
      if (ct) return ct;
    }
  }
  return null;
}
