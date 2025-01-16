import type { MatchMode, Comparator, Type } from "./types";

function mapValue(value: any, matchMode: MatchMode): any {
  switch (matchMode) {
    case "startsWith":
      return `${value}%`;
    case "endsWith":
      return `%${value}`;
    case "contains":
      return `%${value}%`;
    case "notContains":
      return `%${value}%`;
    default:
      return value;
  }
}


function mapComparator(matchMode: MatchMode): Comparator| null {
  switch (matchMode) {
    case "startsWith":
      return "LIKE";
    case "endsWith":
      return "LIKE";
    case "contains":
      return "LIKE";
    case "notContains":
      return "NOT LIKE";
    case "equals": 
      return "=";
    case "notEquals":
      return "<>";
    case "in":
      return "IN";
    case "lt":
      return "<";
    case "lte":
      return "<=";
    case "gt":
      return ">";
    case "gte":
      return ">=";
    case "is":
      return "IS";
    case "isNot":
      return "IS NOT";
    case "before":
      return "<";
    case "after":
      return ">";
    default:
      return null;
  }
}

function mapType(type: Type): Type {
  const s = "string";
  const n = "number";
  const d = "date";
  switch (type) {
    case "integer": 
      return n;
    case "float": 
      return n;
    case "even": 
      return n;
    case "odd": 
      return n;
    case "positive": 
      return n;
    case "negative": 
      return n;
    case "powerOfTwo": 
      return n;
    case "ascii": 
      return n;
    case "jwt": 
      return s;
    case "symbol": 
      return s;
    case "email": 
      return s;
    case "regex": 
      return s;
    case "ipAddress": 
      return s;
    case "slug": 
      return s;
    case "hexadecimal": 
      return s;
    case "date": 
      return d;
    case "timestamp": 
      return d;
    case "function": 
      return s;
    case "htmlElement": 
      return s;
    case "htmlEventAttribute": 
      return s;
    case "node": 
      return s;
    case "json": 
      return s;
    case "object": 
      return s;
    default:
      return type;
  }
}

export {
  mapValue,
  mapComparator,
  mapType,
};
