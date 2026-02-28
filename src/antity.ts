import { isArray, isString, isIn, isObject } from '@dwtechs/checkard';
import { log } from "@dwtechs/winstan";
import { Property } from './property';
import { normalize } from './normalize';
import { validate } from './validate';
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
        p.send,
        p.need,
        p.typeCheck,
        p.sanitizer,
        p.normalizer,
        p.validator, 
      )
      // Copy all extra fields from p to prop
      Object.assign(prop, p);
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
      if (isIn(p.need, method, 0))
        props.push(p);
    }
    return props;
  }
  
  /**
   * Normalizes an array of records by applying sanitization and normalization
   * rules defined in the `properties` of the class.
   *
   */
  public normalizeArray = (req: Request, _res: Response, next: NextFunction): void => {
    
    log.debug(`normalizeArray ${this.name}`);
    
    const rows: Record<string, unknown>[] = req.body?.rows;
    
    if (!isArray(rows, ">", 0))
      return next({ statusCode: 400, message: `${LOGS_PREFIX}Normalize: no rows found in request body` });
    
    for (const r of rows) {
      normalize(r, this._properties);
    }
    next()
  }

  /**
   * Normalizes a single record by applying sanitization and normalization
   * rules defined in the `properties` of the class.
   *
   */
  public normalizeOne = (req: Request, _res: Response, next: NextFunction): void => {
    
    log.debug(`normalizeOne ${this.name}`);
    
    const r: Record<string, unknown> = req.body;
    
    if (!isObject(r, true))
      return next({ statusCode: 400, message: `${LOGS_PREFIX}Normalize: no data found in request body` });
    
    normalize(r, this._properties);
    next()
  }
  
  /**
   * Validates an array of rows against the defined properties and operation/method.
   *
   * If a property is required and missing, or if it fails the control checks, the function returns an error message.
   * Otherwise, it returns `null` indicating successful validation.
   */
  public validateArray = (req: Request, _res: Response, next: NextFunction): void => {
      
    log.debug(`validateArray ${this.name}`);
    
    const rows: Record<string, unknown>[] = req.body?.rows;
    const method: Method = req.method;
  
    if (!isArray(rows, ">", 0))
      return next({ statusCode: 400, message: `${LOGS_PREFIX}Validate: no rows found in request body` });

    if (!isIn(METHODS, method))
      return next({ 
        statusCode: 400, 
        message: `${LOGS_PREFIX}Invalid REST method. Received: ${method}. Must be one of: ${METHODS.toString()}`
      });
    
    for (const r of rows) {
      const error = validate(r, this._properties, method);
      if (error)
        return next(error);
    }
    next();
  }

  /**
   * Validates a single record against the defined properties and operation/method.
   *
   * If a property is required and missing, or if it fails the control checks, the function returns an error message.
   * Otherwise, it returns `null` indicating successful validation.
   */
  public validateOne = (req: Request, _res: Response, next: NextFunction): void => {
      
    log.debug(`validateOne ${this.name}`);
    
    const record: Record<string, unknown> = req.body;
    const method: Method = req.method;
  
    if (!isObject(record, true))
      return next({ statusCode: 400, message: `${LOGS_PREFIX}Validate: no data found in request body` });

    if (!isIn(METHODS, method))
      return next({ 
        statusCode: 400, 
        message: `${LOGS_PREFIX}Invalid REST method. Received: ${method}. Must be one of: ${METHODS.toString()}`
      });
    
    const error = validate(record, this._properties, method);
    if (error)
      return next(error);
    
    next();
  }
}
