import type { Type } from "./types";

const Messages = {
  missing: (key: string) => `Missing ${key}`,
  invalid: (key: string, type: Type) => `Invalid ${key}, must be of type ${type}`,
};

export { Messages };