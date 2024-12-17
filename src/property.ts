import { isString, isIn } from '@dwtechs/checkard';
import Verbs from './verbs';
import Types from './types';
import { Types, Verbs } from './types';

export class Property {
  key: string;
  type: Types;
  min: number;
  max: number;
  required: boolean;
  typeCheck: boolean;
  // primary: boolean;
  verbs: Verbs[];
  normalize: Function;
  control: Function;
  
  constructor(
    key: string,
    type: Types,
    min: number,
    max: number,
    required: boolean,
    typeCheck: boolean,
    // primary: boolean,
    verbs: Verbs[],
    normalize: Function,
    control: Function
  ) {

    if (!isString(key)) 
      throw new Error("Property key must be a string");
    if (!isIn(types, Types))
      throw new Error("Property types must be a REST Verb");
    if (!isIn(verbs, Verbs))
      throw new Error("Property verbs must be a REST Verb");

    this.key = isString(key) ? key : "";
    this.type = type;
    this.min = min || 0;
    this.max = max || 999999999;
    this.required = required || false;
    this.typeCheck = typeCheck || false;
    // this.primary = primary || false;
    this.verbs = verbs || ["GET", "PATCH", "PUT", "POST", "DELETE"];
    this.normalize = normalize || null;
    this.control = control || null;
  }

}
  