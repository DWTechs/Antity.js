import { isFunction } from '@dwtechs/checkard';
import { log } from "@dwtechs/winstan";
import { sanitize as san } from './sanitize';
import type { Property } from './property';

/**
 * Applies sanitization and normalization to a single record based on property configurations.
 *
 * @param {Record<string, unknown>} record - The record to process
 * @param {Property[]} properties - The property configurations to apply
 */
export function applyNormalization(
  record: Record<string, unknown>,
  properties: Property[]
): void {
  for (const { 
    key, 
    type,
    sanitize,
    normalize,
    sanitizer,
    normalizer,
  } of properties) {
    let v = record[key];
    if (v) {
      if (sanitize) {
        log.debug(`sanitize ${key}: ${type} = ${v}`);
        v = san(v, sanitizer);
      }
      if (normalize && isFunction(normalizer)) {
        log.debug(`normalize ${key}: ${type} = ${v}`);
        v = normalizer(v);
      }
      record[key] = v;
    }
  }
}
