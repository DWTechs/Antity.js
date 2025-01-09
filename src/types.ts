import type { Operations } from "./operations";

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
export type Method = "GET" | "PATCH" | "PUT" | "POST" | "DELETE";
