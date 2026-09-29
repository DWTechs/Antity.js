# 0.19.0 (Sep 27th 2026)

- Export `Property` and `STANDARD_PROP_KEYS`.
- `Entity` builds each `Property` through a new overridable `protected createProperty(p)` method instead of inlining construction, so a subclass (e.g. `@dwtechs/antity-pgsql`'s `SQLEntity`) can construct its own `Property` subclass while reusing the base bookkeeping. Fixes a layering bug where subclass `Property` types were declared but never actually constructed.
- Add `readOnly` to `Property` (mandatory, no default) — marks a field as system-managed, not directly editable via the API, distinct from `isPrivate` (hides from responses). Enforced: `normalizeArray`/`normalizeOne` strip `readOnly` fields from the incoming record, and `validateArray`/`validateOne` skip them entirely (never required, never checked), so a client can never set or trigger validation on them. Trusted server-side code that legitimately needs to write a `readOnly` field through the same `normalize`/`validate` pipeline can set `res.locals.allowReadOnly = true` beforehand to bypass this for that request.
- A custom `validator` returning `false` was silently treated as valid — only a thrown exception counted. `validator`'s type is corrected from `(v:any) => any` to `(v:any) => boolean` to match.
- `isTypeChecked: false` (the library's own default) could never actually produce lenient checking for `number`/`integer`/`float`/`even`/`odd`/`positive`/`negative`/`powerOfTwo`/`ascii`/`regex`/`timestamp`/`locale` — it was being converted to `undefined` before reaching checkard, which silently re-defaulted most of these to strict.
- `min: 0`/`max: 0` were silently treated as "no bound" for `number`/`float`/`array`/`date`/`timestamp` (same root cause, different value being erased). `password`'s min/max keep their existing fallback-to-policy-default behavior, which is intentional there.
- `Property`'s internal bounds resolution discarded any non-integer `min`/`max` regardless of the field's `type`, so a `float`/`number` field with a fractional bound (e.g. `min: 0.01`) silently got reset to the integer default.
- A submitted value of `0`, `false`, or `""` skipped type/bounds/custom-validator checking entirely in both `normalize()` and `validate()` (only presence — `requiredFor` — was still checked).
- `Property.min`/`max`'s declared type in `antity.d.ts`/README allowed `null`, which never actually occurs at runtime (`interval()` always resolves to a concrete `number`/`Date`) — corrected to `number | Date`.
- Debug logs (`control`/`require`/`normalize`) now strip `\r`/`\n`/`\t` from a submitted value before interpolating it into the log message, closing a log-injection vector for anyone with debug logging enabled.
- Update "@dwtechs/checkard" dependency to version "3.7.0".

# 0.18.3 (aug 4rd 2026)

- Fix package.json config for library usability in applications test suites

# 0.18.2 (aug 3rd 2026)

- Add `"type": "module"` to package.json, fix `main`/`types` to point to the actual `dist/antity.js`/`dist/antity.d.ts` build output, and add an `exports` map

# 0.18.1 (Jul 3rd 2026)

- Update @dwtechs/checkard to 3.6.1
- Update @dwtechs/winstan to 0.7.1

# 0.18.0 (May 28th 2026)

- Use @dwtechs/passken isValidPassword() instead of @dwtechs/checkard for password type validation
- Add @dwtechs/passken 0.6.1 dependency
- Update Object.assign() in Entity constructor bypassing Property validation by only copying non-standard fields
- Cache getPropsByMethod() results at construction time for O(1) lookups

# 0.17.0 (May 7th 2026)

- Add `ansiEscapeCode`, `locale` and `timeZone` types
- Update @dwtechs/checkard to 3.6.0
- Update @dwtechs/winstan to 0.7.0

# 0.16.0 (Mar 8th 2026)

- Rename `send` property to `isPrivate` with inverted logic (isPrivate: true means the property should NOT be sent)
- Rename `need` property to `requiredFor` for better clarity
- Rename `typeCheck` property to `isTypeChecked` for consistency
- Rename `unsafeProps` getter to `privateProps` to align with new naming convention

# 0.15.0 (Feb 28th 2026)

- Delete `check()` method
- Delete `methods`, `sanityze`, `normalize` and `validate` options
- `required`option is now called `require`. It is of type array of methods instead of boolean
- `safe`option is now called `send`

# 0.14.0 (Dec 22nd 2025)

- Replace `normalize()` and `validate()` methods with more explicit methods:
  - Add `normalizeArray()` for normalizing arrays of records (supports `req.body.rows` as array)
  - Add `validateArray()` for validating arrays of records (supports `req.body.rows` as array)
  - Add `normalizeOne()` for normalizing a single record (supports `req.body` as object)
  - Add `validateOne()` for validating a single record (supports `req.body` as object)

# 0.13.0 (Sep 24th 2025)

- `Property` class now includes an index signature, allowing arbitrary custom properties to be added to instances. This makes the class extensible for downstream libraries and user code.

# 0.12.0 (Sep 20th 2025)

- Improve error messages
- Update dependencyies : 
  - @dwtechs/checkard to 3.5.1
  - @dwtechs/sparray to 0.2.1

# 0.11.1 (Aug 14th 2025)

- Add logs at the beginning of exported methods

# 0.11.0 (Jul 27th 2025)

- Add `check` middleware to Entity class for validating and normalizing request body rows

# 0.10.0 (May 3rd 2025)

- Add password validation with configurable options

# 0.9.2 (May 2nd 2025)

- Update typescript to version 5.8.3

# 0.9.1 (May 1st 2025)

- Fix scope issue when using validate and normalize middlewares

# 0.9.0 (Apr 20th 2025)

- add getPropsByMethod() to Entity class for filtering properties by REST method

# 0.8.0 (Apr 11th 2025)

- enhance validation and normalization logic
- replace "control" and "controller" properties in Property class by "validate" and "validator"

# 0.7.0 (Apr 06th 2025)

- normalize() method is now an Express middleware
- validate() method is now an Express middleware

# 0.6.0 (Mar 29th 2025)

- replace table parameter by name
- add getters for name, unsafeProps and properties
- add getProp() method to retrieve a property with its key
- add setter for entity name
- delete getTabe() and getUnsafeProps() methods
- delete cols parameter. Now used in pgsql plugin
- replace operations by REST methods

# 0.5.0 (Jan 11th 2025)

- add debug logs using @dwtechs/winstan library

# 0.4.0 (Jan 08th 2025)

- add safe parameter to check if a property can be sent to the requester or not
- add getUnsafeProps() method to get an unsafe properties array
- update operation parameter possible values to the validate() method with SQL operations and REST methods to validate proper properties depending on the current action 
- delete "name" property
- add stringify property to getCols() method to tell whether to return columns as string or array
- add pagination property to getCols() method to add a total count in a select query

# 0.3.0 (Dec 30th 2024)

- add getTable() method
- add getCols() method

# 0.2.0 (Dec 29th 2024)

- add new types : 
    jwt, 
    symbol, 
    float,
    even,
    odd,
    positve,
    negative,
    powerOfTwo,
    ascii,
    email,
    regex,
    json,
    ipAddress,
    slug,
    hexadecimal,
    date,
    timestamp,
    function,
    htmlElement,
    htmlEventAttribute,
    node,
    object

# 0.1.0 (Dec 28th 2024)

- initial release
