import { isArray, isString, isIn, isFunction } from '@dwtechs/checkard';
import { log } from "@dwtechs/winstan";
import { Property } from './property';
import { Methods } from './methods';
import { sanitize as san } from './sanitize';
import { control } from './control';
import { require } from './require';
import type {  Method } from './types';
import type { Request, Response, NextFunction } from 'express';

export class Entity {
  private _name: string;
  private _unsafeProps: string[];
  private _properties: Property[];

  constructor (
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
        p.validate,
        p.sanitizer,
        p.normalizer,
        p.validator, 
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
   * Retrieves a list of properties associated with a specific method.
   *
   * @param {Method} method - The method to filter properties by.
   * @returns {Property[]} An array of properties that are associated with the specified method.
   */
  public getPropsByMethod(method: Method): Property[] {
    const props: Property[] = [];
    for(const p of this.properties) {
      if (isIn(p.methods, method, 0))
        props.push(p);
    }
    return props;
  }
  
  /**
   * Normalizes an array of records by applying sanitization and normalization
   * rules defined in the `properties` of the class.
   *
   */
  public normalize = (req: Request, _res: Response, next: NextFunction): void => {
    
    const rows: Record<string, unknown>[] = req.body?.rows;
    
    if (!isArray(rows, "!0"))
      return next({ status: 400, msg: "Normalize: no rows found in request body" });
    
    for (const r of rows) {
      for (const { 
        key, 
        type,
        sanitize,
        normalize,
        sanitizer,
        normalizer,
      } of this._properties) {
        let v = r[key];
        if (v) {
          if (sanitize) {
            log.debug(`sanitize ${key}: ${type} = ${v}`);
            v = san(v, sanitizer);
          }
          if (normalize && isFunction(normalizer)) {
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
  public validate = (req: Request, _res: Response, next: NextFunction): void => {
      
    const rows: Record<string, unknown>[] = req.body?.rows;
    const method: Method = req.method;
  
    if (!isArray(rows, "!0"))
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
        validate,
        validator
      } of this._properties) {
        const v = r[key];
        if (isIn(methods, method)) {
          if (required) {
            const rq = require(v, key, type);
            if (rq)
              return next(rq);
          }
          if (v && validate) {
            const ct = control(v, key, type, min, max, typeCheck, validator);
            if (ct)
              return next(ct);
          }
        }
      }
    }
    next();
  }

}
  