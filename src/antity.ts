import { isArray, isObject, isString, isIn } from '@dwtechs/checkard';
import { Property } from './property';
import { Messages } from './message';
import { Types, Required } from './checks';
import type { Type, Operation } from './types';

export class Entity {
  private table: string;
  private cols: Record<Operation, string>;
  private unsafeProps: string[];
  private properties: Property[];

  constructor(
    table: string,
    properties: Property[],
  ) {

    this.table = table;
    this.properties = [];
    this.cols = {
      select: "",
      insert: "",
      update: "",
      merge: "",
      delete: ""
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
        this.cols[o] += this.cols[o].length ? `, ${p.key}` : `${p.key}`;
      }

      if (!prop.safe) this.unsafeProps.push(prop.key);

    }
  }

  public getTable() {
    return this.table;
  }

  public getCols(operation: Operation): string {
    return this.cols[operation];
  }

  public getUnsafeProps(): string[] {
    return this.unsafeProps;
  }

  public normalize(rows: Record<string, any>[]): Record<string, any>[] {
    for (const r of rows) {
      for (const { 
        key, 
        sanitize,
        normalize,
        sanitizer,
        normalizer,
      } of this.properties) {
        let v = r[key];
        if (v) {
          if (sanitize)
            v = this.sanitize(v, sanitizer);
          if (normalize && normalizer)
            v = normalizer(v);
          r[key] = v;
        }
      }
    }
    return rows;
  }
  
  public validate(rows: Record<string, any>[], operation: Operation): string | null {
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
        if (operation && isIn(operation, operations)) {
          if (required) {
            const rq = this.require(v, key);
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
    
  private require(v: any, key: string): any {
    return Required.validate(v) ? null : Messages.missing(key);
  }

  private control(
    v: any,
    key: string,
    type: Type,
    min: number | Date | null,
    max: number | Date | null,
    typeCheck: boolean,
    cb: ((v:any) => any) | null
  ): any {
    if (cb)
      return cb(v) ? null : Messages.invalid(key, type);
    return Types[type].validate(v, min, max, typeCheck) ? null : Messages.invalid(key, type);
  }

  private sanitize(v: any, cb: ((v:any) => any) | null): any {
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

  private trim(v: any): any {
    if (isString(v, true))
      return v.trim();
    if (isObject(v, true)) {
      if (v.has)
        for (const p in v) {
          if (v.prototype.hasOwnProperty.call(p)) {
            let o = v[p];
            if (isString(o, true))
              o = o.trim();
          }
        }
      return v;
    }
  }
}
  