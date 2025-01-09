
const MatchModes = [ 
  "startsWith",
  "endsWith",
  "contains",
  "notContains",
  "equals",
  "notEquals",
  "between",
  "lte",
  "gte",
  "dateIs",
  "dateRange",
  "dateIsNot",
  "dateBefore",
  "dateAfter"
] as const;

export { MatchModes };
