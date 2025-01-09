import type { Operations } from "./operations";
import type { Methods } from "./methods";

export type Type =  
  "boolean" | 
  "string" | 
  "number" | 
  "integer" | 
  "float" |
  "even" |
  "odd" |
  "positive" |
  "negative" |
  "powerOfTwo" |
  "ascii" |
  "array" |
  "jwt" |
  "symbol" |
  "email" |
  "regex" |
  "json" |
  "ipAddress" |
  "slug" |
  "hexadecimal" |
  "date" |
  "timestamp" |
  "function" |
  "htmlElement" |
  "htmlEventAttribute" |
  "node" |
  "object";

export type Operation = typeof Operations[number];
export type Method = typeof Methods[number];
