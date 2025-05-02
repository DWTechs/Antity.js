import { isNil } from '@dwtechs/checkard';
import { log } from "@dwtechs/winstan";
import { Type } from './types';
import { Types } from './check';

function control(
  v: unknown,
  key: string,
  type: Type,
  min: number | Date,
  max: number | Date,
  typeCheck: boolean,
  cb: ((v:unknown) => boolean) | null
): Record<string, unknown> | null {
  
  log.debug(`control ${key}: ${type} = ${v}`);
  
  let val: boolean;
  if (cb) // the property is controlled by a callback function
    val = cb(v);
  else // the property is controlled by the default controller of the type
    val = Types[type].validate(v, min, max, typeCheck)
  let c = "";
  if (!isNil(min))
    c += ` and >= ${min}`;
  if (!isNil(max))
    c += ` and <= ${max}`;
  return val ? null : { status: 400, msg: `Invalid ${key}, must be of type ${type}${c}`};

}

export {
  control,
};