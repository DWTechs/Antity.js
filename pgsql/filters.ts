import { isString, isNumber, isBoolean, isArray, isObject, isInteger } from "@dwtechs/checkard";
import type { MatchMode, Geometry } from "./types";

function boolean(prop: string, val: boolean): string {
  return ` ${prop} IS ${val} `;
}

function nil(prop: string, matchMode: MatchMode): string {
  if (matchMode === "equals")
    return ` ${prop} IS NULL`;
  if (matchMode === "notEquals")
    return ` ${prop} IS NOT NULL `;
  return "";
}

function number(prop: string, val: number, args: any[], matchMode: MatchMode, i: number): string {
  switch (matchMode) {
    case "equals":
      args.push(val);
      return ` ${prop} = ${i}`;
    case "notEquals":
      args.push(val);
      return ` ${prop} <> ${i}`;
    case "lt":
      args.push(val);
      return ` ${prop} < ${i}`;
    case "lte":
      args.push(val);
      return ` ${prop} <= ${i}`;
    case "gt":
      args.push(val);
      return ` ${prop} > ${i}`;
    case "gte":
      args.push(val);
      return ` ${prop} >= ${i}`;   
  }
}

function string(prop: string, val: string, args: any[], matchMode: MatchMode, i: number): string {
  let f = ` LOWER(${prop})`;
  const v = val.toLowerCase();
  switch (matchMode) {
    case "startsWith":
      args.push(`${v}%`);
      f += " LIKE";
      break;
    case "endsWith":
      args.push(`%${v}`);
      f += " LIKE";
      break;
    case "contains":
      args.push(`%${v}%`);
      f += " LIKE";
      break;
    case "notContains":
      args.push(`%${v}%`);
      f += " NOT LIKE";
      break;
    case "equals":
      args.push(v);
      f += " =";
      break;
    case "notEquals":
      args.push(v);
      f += " <>";
      break;
  }
  return f += ` $${i}`;
}

function dateAdvanced(prop: string, val: any, matchMode: MatchMode, args: any[], i: number): string {
  args.push(val);
  if (matchMode === "dateIs")
    return ` ${prop} >= $${i}::date AND ${prop} < $${i+1}::date + '1 day'::interval`;
  if (matchMode === "dateBefore") return ` ${prop} < $${i} `;
  if (matchMode === "dateAfter") return ` ${prop} > $${i} `;
  if (matchMode === "dateIsNot") return ` ${prop} <> $${i} `;
  return "";
}

function lte(prop: string, val: any, args: any[], i: number): string {
  args.push(val);
  return ` ${prop} <= $${i} `;
}

function gte(prop: string, val: any, args: any[], i: number): string {
  args.push(val);
  return ` ${prop} >= $${i} `;
}

function interval(prop: string, val: any, args: any[], i: number): string {
  // value must be an array of length 2
  if (isArray(val, "=", 2)) {
    const from = val[0];
    const to = val[1];
    if (
      (isNumber(from, false) && isNumber(to, false)) ||
      (isString(from) && isString(to))
    )
      return ` (${gte(prop, from, args, i)} AND ${lte(
        prop,
        to,
        args,
        i
      )}) `;
  }
  return "";
}

function date(prop: string, val: any, args: any[], i: number): string {
  let cond = "";
  // prop must be an array of length 2
  if (isArray(prop, "=", 2)) {
    val[1] = val[1] || val[0];
    cond += interval(prop[0], val, args, i);
    cond += cond ? " OR " : "";
    cond += interval(prop[1], val, args, i);
  }
  return cond;
}

// Accept integers only
function array(prop: string, val: any, i: number): string {
  // value must be an array of length 2
  if (isArray(val)) {
    // values must be integers to search for elements ids
    val.filter((el) => isInteger(el)); // strips non integer values from array
    return val.length ? ` ${prop} IN (${val.toString()})` : "";
  }
  return "";
}

// Accept integers only
function arrayAgg(prop: string, values: any[], args: any[]): string {
  let cond = "";
  // value must be an array to allow multiselect
  if (isArray(values)) {
    values.filter((el) => isInteger(el)); // strips non integer values from array
    for (const value of values) {
      args.push(value);
      cond += `$${i++} = ANY(${prop}) OR `;
    }
  }
  return cond ? ` (${cond.slice(0, -4)})` : cond;
}

function object(prop: string, object: any, args: any[], matchMode: MatchMode): string {
  let condition = "";
  for (const key in object) {
    const value = object[key];
    if (isNumber(value)) {
      condition += `${number(
        `CAST((${prop}->>'${key}') AS INT)`,
        value,
      )} AND `;
    } else if (isString(value)) {
      condition += `${string(`${prop}->>'${key}'`, value, args, matchMode)} AND `;
    } else if (isArray(value)) {
      condition += `${array(
        `CAST(${prop}->>'${key}' AS INT)`,
        value,
      )} AND `;
    } else if (isObject(value)) {
      // Recurse into sub object
      condition += `${object(`${prop}->'${key}'`, value, args, matchMode)} AND `;
    } else if (isBoolean(value)) {
      condition += `${boolean(`${prop}->'${key}'`, value)} AND `;
    }
  }
  return ` (${condition.slice(0, -5)}) `;
}

function jsonAgg(prop: string, subProps: any, val: any, args: any[], matchMode: MatchMode): string {
  const conds = [];
  const ps = subProps.map((e) => `p->>'${e}'`);
  // interval
  if (matchMode === "between") c += interval(p, v, args);
  // Date range
  else if (matchMode === "dateRange") c += date(p, val, args);
  else {
    for (let i = 0; i < val.length; i += subProps.length) {
      let cond = "";
      for (let j = 0; j < subProps.length; j++) {
        const p = ps[j];
        const v = isArray(val) ? val[i + j] : val;
        // bool
        if (isBoolean(v)) cond += boolean(`CAST(${p} AS boolean)`, v);
        // number
        else if (isNumber(v, false)) cond += number(p, `${v}::text`);
        // string
        else if (isString(v, true))
          cond += string(p, v, args, matchMode);
        // array
        else if (isArray(v)) {
          if (v.length && isNumber(v[0]))
            cond += array(`(${p})::int`, v);
          else cond += array(`${p}`, v);
        }
        // object
        else if (isObject(v)) cond += object(p, v, args, matchMode);

        if (cond) cond += " AND ";
      }
      conds.push(cond.slice(0, -5));
    }
  }
  return conds.length
    ? ` EXISTS( SELECT 1 FROM json_array_elements(${prop}::json) as p WHERE (${conds.join(
        ") OR (",
      )}))`
    : "";
}

function geometry(val: Geometry): string {
  const { lng, lat, radius, bounds } = val || {};
  if (bounds) {
    const { minLng, minLat, maxLng, maxLat } = bounds;
    return ` ST_Contains(
      ST_MakeEnvelope(${minLng}, ${minLat}, ${maxLng}, ${maxLat}),
      location
    ) `;
  }
  return ` ST_DWithin(
    location,
    ST_GeogFromtext('SRID=4326;POINT(${lng} ${lat})'),
    ${radius}
  ) `;
}

export default {
  nil,
  boolean,
  number,
  string,
  dateAdvanced,
  lte,
  gte,
  interval,
  date,
  array,
  arrayAgg,
  object,
  jsonAgg,
  geometry,
};
