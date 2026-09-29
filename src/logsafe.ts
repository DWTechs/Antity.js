/**
 * Strips characters a submitted string could use to forge extra log lines
 * (`\r`, `\n`, `\t`) before it's interpolated into a debug log message.
 * Non-string values are returned unchanged — they can't carry control characters.
 *
 * @param {unknown} v - The value about to be logged
 * @returns {unknown} The value, with any string content made log-safe
 */
export function logSafe(v: unknown): unknown {
  return typeof v === 'string' ? v.replace(/[\r\n\t]/g, '') : v;
}
