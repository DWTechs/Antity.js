# 0.4.0 (Jan 08th 2025)

- add safe parameter to check if a property can be sent to the requester or not
- add getUnsafeProps() method to get an unsafe properties array
- update operation parameter possible values to the validate() method with SQL operations and REST methods to validate proper properties depending on the current action 
- delete "name" property
- add stringify property to getCols() method to tell whether to return columns as string or array.
- add pagination property to getCols() method to add a total count in a select query 
- add logs using @dwtechs/winstan library

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
