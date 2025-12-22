
import { log } from "@dwtechs/winstan";
import { Type } from './types';
import { Types } from './check';
import { LOGS_PREFIX } from './constants';
import type { ValidationError } from './validator';

function control(
  v: unknown,
  key: string,
  type: Type,
  min: number | Date,
  max: number | Date,
  typeCheck: boolean,
  cb: ((v:unknown) => boolean) | null
): ValidationError | null {
  
  log.debug(`control ${key}: ${type} = ${v}`);
  
  let errorMessage: string = "";
  
  if (cb) // the property is controlled by a custom callback function
    try {
      cb(v);
    } catch (err) { 
      errorMessage = `Custom validator callback failed for "${key}" - caused by: ${(err as Error).message}`;
    }
  else // the property is controlled by the default controller of the type
    try {
      Types[type].validate(v, min, max, typeCheck);
    } catch (err) {
      errorMessage = `Invalid "${key}" - caused by: ${(err as Error).message}`;
    }

  if (errorMessage)
    return { statusCode: 400, message: `${LOGS_PREFIX}${errorMessage}` };
    
  return null;

}

export {
  control,
};