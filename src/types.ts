import type { Verbs } from "./verbs";
import type { Types } from "./checks";

export type Type = keyof typeof Types;
export type Verb = typeof Verbs[number];
