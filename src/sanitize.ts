import { isArray, isObject, isString } from '@dwtechs/checkard';

/**
 * Sanitizes the input value by applying a callback function if provided,
 * or by trimming the value if it is an array or a single value.
 *
 * @param v - The value to be sanitized. It can be of any type.
 * @param cb - An optional callback function to apply to the value.
 *             If provided, the callback function will be used to sanitize the value.
 * @returns The sanitized value. If a callback function is provided, the result of the callback is returned.
 *          If the value is an array, each element is trimmed. Otherwise, the trimmed value is returned.
 */
function sanitize(v: unknown, cb: ((v:unknown) => unknown) | null): unknown {
  if (cb)
    return cb(v);
  if (isArray(v, null, null)) {
    for (let d of v) {
      d = trim(d);
    }
    return v;
  }
  return trim(v);
}

/**
 * Trims whitespace from a string or recursively trims all string properties of an object.
 *
 * @param v - The value to be trimmed. Can be a string or an object.
 * @returns The trimmed value. If the input is a string, returns the trimmed string.
 *          If the input is an object, returns the object with all string properties trimmed.
 */
function trim(v: unknown): unknown {
  if (isString(v, "!0"))
    return v.trim();
  if (isObject(v, true)) {
    for (const k in v) {
      if (Object.prototype.hasOwnProperty.call(v, k)) {
        let o = (v as Record<string, unknown>)[k];
        if (isString(o, "!0", null))
          o = o.trim();
      }
    }
  }
  return v;
}

export { 
  sanitize,
};
  