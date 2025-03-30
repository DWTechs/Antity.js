import type { Type } from "./types";

const Messages = {
  missing: (key: string): string => `Missing ${key}`,
  invalid: (key: string, type: Type): string => `Invalid ${key}, must be of type ${type}`,
};

export { Messages };