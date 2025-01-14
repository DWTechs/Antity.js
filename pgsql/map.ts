import type { MatchMode, Comparator, Type } from "./types";

function mapMatchModes(matchMode: MatchMode): Comparator| null {
  switch (matchMode) {
    case "equals": 
      return "=";
    case "notEquals":
      return "<>";
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
    default:
      return null;
  }
}

function mapTypes(type: Type): Type| null {
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

export default {
  mapMatchModes,
  mapTypes,
};
