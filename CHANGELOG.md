# 0.7.0 (Apr 06th 2025)

- normalize() method is now an Express middleware
- validate() method is now an Express middleware

# 0.6.0 (Mar 29th 2025)

- Replace table parameter by name
- Add getters for name, unsafeProps and properties
- Add getProp() method to retrieve a property with its key
- Add setter for entity name
- Delete getTabe() and getUnsafeProps() methods
- Delete cols parameter. Now used in pgsql plugin
- Replace operations by REST methods

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
