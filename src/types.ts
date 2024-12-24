import type { Methods } from "./methods";
import type { Types } from "./checks";

export type Type = keyof typeof Types;
export type Method = typeof Methods[number];
