import { isArray, isString, isIn, isFunction } from '@dwtechs/checkard';
import { log } from "@dwtechs/winstan";
import { Property } from './property';
import { sanitize as san } from './sanitize';
import { control } from './control';
import { require } from './require';
import type {  Method } from './types';
import type { Request, Response, NextFunction } from 'express';
import { LOGS_PREFIX, METHODS } from './constants';

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
      throw new Error(`${LOGS_PREFIX}name must be a string of length > 0`);
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
    
    log.debug(`normalize ${this.name}`);
    
    if (!isArray(rows, "!0"))
      return next({ statusCode: 400, message: `${LOGS_PREFIX}Normalize: no rows found in request body` });
    
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

    log.debug(`validate ${this.name}`);
  
    if (!isArray(rows, "!0"))
      return next({ statusCode: 400, message: `${LOGS_PREFIX}Validate: no rows found in request body` });

    if (!isIn(METHODS, method))
      return next({ 
        statusCode: 400, 
        message: `${LOGS_PREFIX}Invalid REST method. Received: ${method}. Must be one of: ${METHODS.toString()}`
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

  /**
   * Checks, sanitizes, normalizes, and validates each row in req.body.rows according to property config and HTTP method.
   *
   * - Applies sanitization if `sanitize: true` and method matches
   * - Applies normalization if `normalize: true` and method matches
   * - Checks required properties and validates values
   * - Calls next(error) on failure, next() on success
   *
   * @param {Request} req - Express request object containing rows
   * @param {Response} _res - Express response object (not used)
   * @param {NextFunction} next - Express next function
   *
   * @returns {void}
   *
   * **Input Properties Required:**
   * - `req.body.rows` (array) - Array of objects to check
   * - Each property config can specify sanitize, normalize, validate, required, etc.
   *
   * **Output Properties:**
   * - Mutates `req.body.rows` with sanitized/normalized values
   * - Calls next(error) if any row fails checks, next() if all pass
   *
   * @example
   * ```typescript
   * router.post('/entity', entity.check, (req, res) => {
   *   // req.body.rows are now sanitized, normalized, and validated
   *   res.json({ success: true });
   * });
   * ```
   */
  public check = (req: Request, _res: Response, next: NextFunction): void => {
    
    const rows: Record<string, unknown>[] = req.body?.rows;
    const method: Method = req.method;
  
    log.debug(`check ${this.name}`);

    try {
      isArray(rows, "!0", null, true);
    } catch (err) {
      return next({ 
        statusCode: 400, 
        message: `${LOGS_PREFIX}no rows found in request body - caused by: ${(err as Error).message}`
      });
    }

    try {
      isIn(METHODS, method, 0, true);
    } catch (err) {
      return next({ 
        statusCode: 400, 
        message: `${LOGS_PREFIX}Invalid REST method. Must be one of: ${METHODS.toString()} - caused by: ${(err as Error).message}`
      });
    }

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
        sanitize,
        normalize,
        sanitizer,
        normalizer,
        validator
      } of this._properties) {
        let v = r[key];
        if (isIn(methods, method)) {
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
            if (validate) {
              const ct = control(v, key, type, min, max, typeCheck, validator);
              if (ct)
                return next(ct);
            }
          }
          if (required) {
            const rq = require(v, key, type);
            if (rq)
              return next(rq);
          }
        }
      }
    }

    next();
  }

}
  