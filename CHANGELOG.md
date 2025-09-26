
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
