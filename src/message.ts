import { Types } from "./types";

const Messages = {
  missing: (key: string) => `Missing ${key}`,
  invalid: (key: string, type: Types) => `Invalid ${key}, must be of type ${type}`,
};

export default Messages;