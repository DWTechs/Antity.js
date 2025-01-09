import { isArray, isObject, isString, isIn } from '@dwtechs/checkard';
import { log } from "@dwtechs/winstan";
import { Property } from './property';
import { Messages } from './message';
import { Types, Required } from './checks';
import { Methods } from './methods';
import { Operations } from './operations';
import type { Type, Operation, Method } from './types';

export class Entity {
  // private db: any;
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

  public getCols(operation: Operation, stringify?: boolean, pagination?: boolean, ): string[] | string {
    const cols = pagination && operation === "select" ? [...this.cols[operation], "COUNT(*) OVER () AS total"] : this.cols[operation];
    return stringify ? cols.join(', ') : cols;
  }

  public getUnsafeProps(): string[] {
    return this.unsafeProps;
  }

  public normalize(rows: Record<string, any>[]): Record<string, any>[] {
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
  
  public validate(rows: Record<string, any>[], operation: Operation | Method): string | null {
    if (isIn(operation, Methods))
      operation = this.mapMethods(operation as Method);
    
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
        if (isIn(operation, operations)) {
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
    
  private require(v: any, key: string, type: Type): any {
    log.debug(`require ${key}: ${type} = ${v}`);	
    return Required.validate(v) ? null : Messages.missing(key);
  }

  private control(
    v: any,
    key: string,
    type: Type,
    min: number | Date,
    max: number | Date,
    typeCheck: boolean,
    cb: ((v:any) => any) | null
  ): any {
    log.debug(`control ${key}: ${type} = ${v}`);
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

  private mapMethods(method: Method): Operation {
    switch (method) {
      case "GET": 
        return Operations[0];
      case "PATCH":
        return Operations[2];
      case "PUT":
        return Operations[2];
      case "POST":
        return Operations[1];
      case "DELETE":
        return Operations[4];
    }
  }
}
  