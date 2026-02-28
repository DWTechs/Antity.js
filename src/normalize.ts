import { isFunction } from '@dwtechs/checkard';
import { log } from "@dwtechs/winstan";
import { sanitize } from './sanitize';
import type { Property } from './property';

/**
 * Applies sanitization and normalization to a single record based on property configurations.
 *
 * @param {Record<string, unknown>} record - The record to process
 * @param {Property[]} properties - The property configurations to apply
 */
export function normalize(
  record: Record<string, unknown>,
  properties: Property[]
): void {
  for (const { 
    key, 
    type,
    sanitizer,
    normalizer,
  } of properties) {
    let v = record[key];
    if (v) {
      log.debug(`sanitize ${key}: ${type} = ${v}`);
      v = sanitize(v, sanitizer);
      if (isFunction(normalizer)) {
        log.debug(`normalize ${key}: ${type} = ${v}`);
        v = normalizer(v);
      }
      record[key] = v;
    }
  }
}
