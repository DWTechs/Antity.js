import { isArray, isObject, isString, isIn } from '@dwtechs/checkard';
import { Property } from './property';
import { Messages } from './message';
import { Types, Required } from './checks';
import type { Type, Method } from './types';

export class Entity {
  name: string;
  table: string;
  properties: Property[];

  constructor(
    name: string,
    table: string,
    properties: Property[],
  ) {
    this.name = name;
    this.table = table;
    this.properties = this.init(properties);
  }

  private init(properties: Property[]): Property[] {
    const props = [];
    for (const p of properties) {
      props.push(
        new Property(
          p.key,
          p.type,
          p.min,
          p.max,
          p.required,
          p.typeCheck,
          p.methods,
          p.sanitize,
          p.normalize,
          p.control,
          p.sanitizer,
          p.normalizer,
          p.controller, 
        )
      );
    }
    return props;
  }

  public cols(method: Method): string[] {
    const cols = [];
    for (const p of this.properties) {
      if (isIn(method, p.methods))
        cols.push(p.key);
    }
    return cols;
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
  
  public validate(rows: Record<string, any>[], method: Method): string | null {
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
        if (method && isIn(method, methods)) {
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
    min: number,
    max: number,
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
  