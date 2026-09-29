
import { isNil } from '@dwtechs/checkard';
import { log } from "@dwtechs/winstan";
import { sanitize } from './sanitize';
import { logSafe } from './logsafe';
import type { Property } from './property';

/**
 * Applies sanitization and normalization to a single record based on property configurations.
 *
 * `readOnly` properties are stripped from the record instead of being sanitized/normalized,
 * unless `allowReadOnly` is set — trusted system code (not a client request) is expected to
 * pass `allowReadOnly: true` when it legitimately needs to write a readOnly property through
 * this same pipeline.
 *
 * @param {Record<string, unknown>} record - The record to process
 * @param {Property[]} properties - The property configurations to apply
 * @param {boolean} [allowReadOnly=false] - Whether readOnly properties may be written
 */
export function normalize(
  record: Record<string, unknown>,
  properties: Property[],
  allowReadOnly = false,
): void {
  for (const {
    key,
    type,
    sanitizer,
    normalizer,
    readOnly,
  } of properties) {
    if (readOnly && !allowReadOnly) {
      delete record[key];
      continue;
    }
    let v = record[key];
    if (!isNil(v)) {
      log.debug(`sanitize ${key}: ${type} = ${logSafe(v)}`);
      v = sanitize(v, sanitizer);
      if (normalizer) {
        log.debug(`normalize ${key}: ${type} = ${logSafe(v)}`);
        v = normalizer(v);
      }
      record[key] = v;
    }
  }
}
