import type { Type } from "./types";

const Messages = {
  missing: (key: string): string => `Missing key: ${key}`,
  invalid: (key: string, type: Type): string => `Invalid key: ${key}. Must be of type ${type}`,
};

export { Messages };