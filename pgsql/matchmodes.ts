
const MatchModes = [ 
  "startsWith",
  "endsWith",
  "contains",
  "notContains",
  "equals",
  "notEquals",
  "between",
  "lt",
  "lte",
  "gt",
  "gte",
  "dateIs",
  "dateRange",
  "dateIsNot",
  "dateBefore",
  "dateAfter"
] as const;

export { MatchModes };
