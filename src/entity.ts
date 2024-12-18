import { isArray, isObject, isString } from '@dwtechs/checkard';
import { Property } from './property';
import { Messages } from './message';
import { Types, Required } from './checks';
import type { Type, Verb } from './types';

export class Entity {
  name: string;
  properties: Property[];

  constructor(
    name: string,
    properties: Property[],
  ) {
    this.name = name;
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
          p.verbs,
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

  public validate(rows: Record<string, any>[], verb: Verb): string | null {
    for (const r of rows) {
      for (const { 
        key, 
        type,
        min,
        max,
        required,
        typeCheck,
        verbs,
        sanitize,
        normalize,
        control,
        sanitizer,
        normalizer,
        controller
      } of this.properties) {
        const v = r[key];
        if (verbs && verbs.includes(verb)) {
          if (sanitize)
            r[key] = this.sanitize(v, sanitizer);
          if (normalize && normalizer)
            r[key] = this.normalize(v, normalizer);
          if (required)
            return this.require(v, key);
          if (control)
            return this.control(v, key, type, min, max, typeCheck, controller);
        }
      }
    }
    return null;
  }

  private require(v: any, key: string): any {
    return Required.validate(v) ? Messages.missing(key) : null;
  }

  private control(
    v: any,
    key: string,
    type: Type,
    min: number,
    max: number,
    typeCheck: boolean,
    cb: Function | null
  ): any {
    if (cb)
      return !cb(v) ? Messages.invalid(key, type) : null ;
    return !Types[type].validate(v, min, max, typeCheck) ? Messages.invalid(key, type) : null;
  }

  private normalize(v: any, cb: Function | null): any { 
    return cb ? cb(v) : v;
  }

  private sanitize(v: any, cb: Function | null): any {
    if (cb)
      return cb(v);
    if (isArray(v, null, null))
      for (let d of v) {
        d = this.trim(d);
      }
    else
      v = this.trim(v);
    return v;
  }

  private trim(v: any): any {
    if (isObject(v, true))
      if (v.has)
        for (const p in v) {
          if (v.prototype.hasOwnProperty.call(p)) {
            let o = v[p];
            if (isString(o, true))
              o = o.trim();
          }
        }
    else
      v = v.trim();
    return v;
  }
  
}
  