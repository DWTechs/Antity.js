import { isArray, isObject, isString, isIn, isNil } from '@dwtechs/checkard';
import { log } from "@dwtechs/winstan";
import { Property } from './property';
import { Types } from './check';
import { Methods } from './methods';
import type { Type, Method } from './types';
import type { Request, Response, NextFunction } from 'express';

export class Entity {
  private _name: string;
  private _unsafeProps: string[];
  private _properties: Property[];

  constructor(
    name: string,
    properties: Property[],
  ) {

    this._name = name;
    this._properties = [];
    this._unsafeProps = [];

    for (const p of properties) {
      const prop = new Property(
        p.key,
        p.type,
        p.min,
        p.max,
        p.required,
        p.safe,
        p.typeCheck,
        p.methods,
        p.sanitize,
        p.normalize,
        p.control,
        p.sanitizer,
        p.normalizer,
        p.controller, 
      )
      this._properties.push(prop);

      if (!prop.safe) this._unsafeProps.push(prop.key);

    }
  }

  public get name(): string {
    return this._name;
  }

  public get unsafeProps(): string[] {
    return this._unsafeProps;
  }

  public get properties(): Property[] {
    return this._properties;
  }

  public set name(name: string) {
    if (!isString(name, "!0"))
      throw new Error('name must be a string of length > 0');
    this._name = name;
  }

  /**
   * Retrieves a property from the `properties` array that matches the specified key.
   *
   * @param {string} key - The key of the property to retrieve.
   * @returns {Property | undefined} - The property object if found, otherwise `undefined`.
   */
  public getProp(key: string): Property | undefined {
    return this.properties.find(p => p.key === key);
  }
  
  /**
   * Normalizes an array of records by applying sanitization and normalization
   * rules defined in the `properties` of the class.
   *
   */
  public normalize(req: Request, _res: Response, next: NextFunction): void {
    
    const rows: Record<string, unknown>[] = req.body?.rows;
    
    if (!isObject(rows))
      return next({ status: 400, msg: "Normalize: no rows found in request body" });

    for (const r of rows) {
      for (const { 
        key, 
        type,
        sanitize,
        normalize,
        sanitizer,
        normalizer,
      } of this.properties) {
        let v = r[key];
        if (v) {
          if (sanitize) {
            log.debug(`sanitize ${key}: ${type} = ${v}`);
            v = this.sanitize(v, sanitizer);
          }
          if (normalize && normalizer) {
            log.debug(`normalize ${key}: ${type} = ${v}`);
            v = normalizer(v);
          }
          r[key] = v;
        }
      }
    }
    next()
  }
  
  /**
   * Validates a set of rows against the defined properties and operation/method.
   *
   * If a property is required and missing, or if it fails the control checks, the function returns an error message.
   * Otherwise, it returns `null` indicating successful validation.
   */
  public validate(req: Request, _res: Response, next: NextFunction): void{
      
    const rows: Record<string, unknown>[] = req.body;
    const method: Method = req.method;
  
    if (!isObject(req.body?.rows))
      return next({ status: 400, msg: "Sanitize: no rows found in request body" });

    if (!isIn(Methods, method))
      return next({ 
        status: 400, 
        msg: `Invalid REST method. Received: ${method}. Must be one of: ${Methods.toString()}`
      });
    
    for (const r of rows) {
      for (const { 
        key, 
        type,
        min,
        max,
        required,
        typeCheck,
        methods,
        control,
        controller
      } of this.properties) {
        const v = r[key];
        if (isIn(methods, method)) {
          if (required) {
            const rq = this.require(v, key, type);
            if (rq)
              return next(rq);
          }
          if (v && control) {
            const ct = this.control(v, key, type, min, max, typeCheck, controller);
            if (ct)
              return next(ct);
          }
        }
      }
    }
    next();
  }
    
  /**
   * Validates that a given value is not null or undefined and logs the validation process.
   *
   * @param v - The value to validate.
   * @param key - The key or name associated with the value, used for logging and error messages.
   * @param type - The expected type of the value, used for logging purposes.
   * @returns A string containing an error message if the value is null or undefined, otherwise `null`.
   */
  private require(v: unknown, key: string, type: Type): Record<string, unknown> | null {
    log.debug(`require ${key}: ${type} = ${v}`);	
    return isNil(v) ? { status: 400, msg: `Missing ${key} of type ${type}`} : null;
  }

  private control(
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
    
    return val ? null : { status: 400, msg: `Invalid ${key}, must be of type ${type}`};
  
  }

  /**
   * Sanitizes the input value by applying a callback function if provided,
   * or by trimming the value if it is an array or a single value.
   *
   * @param v - The value to be sanitized. It can be of any type.
   * @param cb - An optional callback function to apply to the value.
   *             If provided, the callback function will be used to sanitize the value.
   * @returns The sanitized value. If a callback function is provided, the result of the callback is returned.
   *          If the value is an array, each element is trimmed. Otherwise, the trimmed value is returned.
   */
  private sanitize(v: unknown, cb: ((v:unknown) => unknown) | null): unknown {
    if (cb)
      return cb(v);
    if (isArray(v, null, null)) {
      for (let d of v) {
        d = this.trim(d);
      }
      return v;
    }
    return this.trim(v);
  }

  /**
   * Trims whitespace from a string or recursively trims all string properties of an object.
   *
   * @param v - The value to be trimmed. Can be a string or an object.
   * @returns The trimmed value. If the input is a string, returns the trimmed string.
   *          If the input is an object, returns the object with all string properties trimmed.
   */
  private trim(v: unknown): unknown {
    if (isString(v, "!0"))
      return v.trim();
    if (isObject(v, true)) {
      for (const k in v) {
        if (Object.prototype.hasOwnProperty.call(v, k)) {
          let o = (v as Record<string, unknown>)[k];
          if (isString(o, "!0", null))
            o = o.trim();
        }
      }
    }
    return v;
  }

}
  