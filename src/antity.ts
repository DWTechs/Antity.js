import { isArray, isObject, isString, isIn, isNil } from '@dwtechs/checkard';
import { log } from "@dwtechs/winstan";
import { Property } from './property';
import { Messages } from './message';
import { Types } from './check';
import { Methods } from './methods';
import * as map from './map';
import type { Type, Operation, Method } from './types';

export class Entity {
  private _table: string;
  private _cols: Record<Operation, string[]>;
  private _unsafeProps: string[];
  private _properties: Property[];

  constructor(
    table: string,
    properties: Property[],
  ) {

    this._table = table;
    this._properties = [];
    this._cols = {
      select: [],
      insert: [],
      update: [],
      merge: [],
      delete: []
    };
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
        p.operations,
        p.sanitize,
        p.normalize,
        p.control,
        p.sanitizer,
        p.normalizer,
        p.controller, 
      )
      this._properties.push(prop);
      
      // _cols help to dynamically generates SQL queries.
      // data is grouped by operation type, making it easy to retrieve and process later.
      for (const o of p.operations) {
        const c = this._cols[o];
        if (o === "update") // The "update" operation requires special formatting (key = $index), while other operations only store the key.
          c.push(`${p.key} = $${c.length+1}`); 
        else
          c.push(p.key);
      }

      if (!prop.safe) this._unsafeProps.push(prop.key);

    }
  }

  public get table(): string {
    return this._table;
  }

  public get unsafeProps(): string[] {
    return this._unsafeProps;
  }

  public get cols(): Record<Operation, string[]> {
    return this._cols;
  }

  public get properties(): Property[] {
    return this._properties;
  }

  public getColsByOp(
    operation: Operation, 
    stringify?: boolean, 
    pagination?: boolean, 
  ): string[] | string {
    const cols = pagination && operation === "select" 
      ? [...this._cols[operation], "COUNT(*) OVER () AS total"] 
      : this.cols[operation];
    return stringify ? cols.join(', ') : cols;
  }

  public getProperty(key: string): Property | undefined {
    return this.properties.find(p => p.key === key);
  }
  
  public normalize(rows: Record<string, unknown>[]): Record<string, unknown>[] {
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
    return rows;
  }
  
  public validate(
    rows: Record<string, unknown>[], 
    operation: Operation | Method,
  ): string | null {
    
    if (!isIn(Methods, operation))
      return null;
      
    const o = map.method(operation as Method);
    
    for (const r of rows) {
      for (const { 
        key, 
        type,
        min,
        max,
        required,
        typeCheck,
        operations,
        control,
        controller
      } of this.properties) {
        const v = r[key];
        if (isIn(operations, o)) {
          if (required) {
            const rq = this.require(v, key, type);
            if (rq)
              return rq;
          }
          if (v && control) {
            const ct = this.control(v, key, type, min, max, typeCheck, controller);
            if (ct)
              return ct;
          }
        }
      }
    }
    return null;
  }
    
  /**
   * Validates that a given value is not null or undefined and logs the validation process.
   *
   * @param v - The value to validate.
   * @param key - The key or name associated with the value, used for logging and error messages.
   * @param type - The expected type of the value, used for logging purposes.
   * @returns A string containing an error message if the value is null or undefined, otherwise `null`.
   */
  private require(v: unknown, key: string, type: Type): string | null {
    log.debug(`require ${key}: ${type} = ${v}`);	
    return isNil(v) ? Messages.missing(key) : null ;
  }

  private control(
    v: unknown,
    key: string,
    type: Type,
    min: number | Date,
    max: number | Date,
    typeCheck: boolean,
    cb: ((v:unknown) => unknown) | null
  ): string | null {
    
    log.debug(`control ${key}: ${type} = ${v}`);
    if (cb) // this property is controlled by a callback function
      return cb(v) ? null : Messages.invalid(key, type); // if the callback function returns a value, the value is invalid
    
    // if the property is not controlled by a callback function, it is controlled by the default controller of the type
    const val = Types[type].validate(v, min, max, typeCheck)
    return val ? null : Messages.invalid(key, type);
  
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
  