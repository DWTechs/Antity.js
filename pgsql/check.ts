import { isIn } from "@dwtechs/checkard";
import type { MatchMode, Comparator, Type } from "./types";

const matchModes = {
  string: ["startsWith", "contains", "endsWith", "notContains", "equals", "notEquals", "lt", "lte", "gt", "gte"],
  number: ["equals", "notEquals", "lt", "lte", "gt", "gte"],
  date: ["is", "isNot", "dateAfter"],
};

function checkMatchMode(type: Type, matchMode: MatchMode): boolean {
  return isIn(matchMode, matchModes[type]);
}

function mapType(type: Type): Type| null {
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
  checkMatchMode,
  mapType,
};
