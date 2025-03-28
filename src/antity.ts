import { isArray, isObject, isString, isIn, isNil } from '@dwtechs/checkard';
import { log } from "@dwtechs/winstan";
import { Property } from './property';
import { Messages } from './message';
import { Types } from './check';
import { Methods } from './methods';
import map from './map';
import type { Type, Operation, Method } from './types';

export class Entity {
  private table: string;
  private cols: Record<Operation, string[]>;
  private unsafeProps: string[];
  private properties: Property[];

  constructor(
    table: string,
    properties: Property[],
  ) {

    this.table = table;
    this.properties = [];
    this.cols = {
      select: [],
      insert: [],
      update: [],
      merge: [],
      delete: []
    };
    this.unsafeProps = [];

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
      this.properties.push(prop);
      
      for (const o of p.operations) {
        if (o === "update")
          this.cols[o].push(`${p.key} = $${this.cols[o].length+1}`); 
        else
          this.cols[o].push(p.key);
      }

      if (!prop.safe) this.unsafeProps.push(prop.key);

    }
  }

  public getTable() {
    return this.table;
  }

  public getCols(
    operation: Operation, 
    stringify?: boolean, 
    pagination?: boolean, 
  ): string[] | string {
    const cols = pagination && operation === "select" ? [...this.cols[operation], "COUNT(*) OVER () AS total"] : this.cols[operation];
    return stringify ? cols.join(', ') : cols;
  }

  public getUnsafeProps(): string[] {
    return this.unsafeProps;
  }

  protected getPropertyType(key: string): Type | null {
    return this.properties.find(p => p.key === key)?.type || null;
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
    if (cb)
      return cb(v) ? null : Messages.invalid(key, type);
    return Types[type].validate(v, min, max, typeCheck) ? null : Messages.invalid(key, type);
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
          if (isString(o, "!0"))
            o = o.trim();
        }
      }
    }
    return v;
  }

}
  