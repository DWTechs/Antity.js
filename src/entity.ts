import { Property } from './property';
import Messages from './message';

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
          p.normalize,
          p.control
        )
      );
    }
    return props;
  }

  public validate(rows: Record<string, any>[]): string | null {
    for (const r of rows) {
      for (const { key, type, min, max, required, typeCheck } of this.properties) {
        const v = r[key];
        if (required && !v)
          return Messages.missing(key);
        if (!types[type].validate(v, min, max, typeCheck))
          return Messages.invalid(key, type);
      }
    }
    return null;
  }

}
  