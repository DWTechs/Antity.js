import { isNil, isString, isNumber, isBoolean, isArray, isObject } from "@dwtechs/checkard";
import prepare from "./filters";
import type { Clause, MatchMode } from "./types";
// Builds the where clause with given filters
// Filters should be as follow :
// filters={
//   "key1":{"value":"xxx", "matchMode":"contains"}, => string
//   "key2":{"value":[1,2], "matchMode":"contains"}, => number[]
//   "key3":{"value":true, "matchMode":"contains"},  => boolean
//   "key4":{"value":["2023-04-09T22:00:00.000Z","2023-04-12T21:59:59.000Z"],"matchMode":"between"}, => date range
//   "key5":{"value":false} => boolean,
//   "key6":{"value":1400, "subProp":"xxx"} => JsonAgg[]
//   "key7":{"value":{"2":[1,2], "3":[3]} => object[]
// };
// MatchMode is optional.
// key is the name of a column in database
// aggregate columns must have an "Agg" suffix
// Other cases may be added

let i = 1;
const defaultOperator = "AND";

// returns filters as string in a where clause and the associated array of arguments
function clause(
  first: number,
  rows: number,
  sortOrder: string,
  sortField: string,
  filters: any
): Clause {

  if (!filters)
    return { conds: "", args: [] };

  let conds = "";
  const args = [];

  for (let prop in filters) {
    const filter = filters[prop];
    let newCond = "";
    // prepare property name for sql query
    prop = `\"${prop}\"`;
    if (isArray(filter)) {
      const conditions = buildConditions(prop, filter, args);
      const hasManyConditions = conditions.length > 1;
      if (hasManyConditions) {
        const operator = filter[0]?.operator ?? defaultOperator;
        newCond = ` (${conditions.join(` ${operator} `)}) `;
      } else
        newCond = ` ${conditions.toString()} `;
    } else {
      const { value, subProps, matchMode } = filter ?? {};
      newCond = buildCondition(prop, value, subProps, matchMode, args);
    }
    conds += newCond.trim() ? `${newCond} ${defaultOperator}` : "";
  }

  conds = where(conds);
  conds += orderBy(sortField, sortOrder);
  conds += limit(rows, first);
  i = 1;

  return { conds, args };
}

function buildConditions(prop: string, arrayVal: any[], args: any[]): any[] {
  const conds = [];
  for (const filter of arrayVal) {
    const { value, matchMode } = filter;
    conds.push(buildCondition(prop, value, null, matchMode, args));
  }
  return conds;
}

function buildCondition(prop: string, val: any, subProps: any, matchMode: MatchMode, args: any[]): string {
  let condition = "";
  // if aggregated column name ends with "JsonAgg"
  // it is an aggregate of json objects
  if (prop.endsWith('JsonAgg"')) {
    condition = prepare.jsonAgg(prop, subProps, val, args, matchMode);
  }
  // if aggregated column name ends with "ArrayAgg"
  // it is an aggregate of integers
  else if (prop.endsWith('ArrayAgg"'))
    condition = prepare.arrayAgg(prop, val, args);
  else if (isDateMatchMode(matchMode))
    condition = prepare.dateAdvanced(prop, val, matchMode, args);
  // interval
  else if (matchMode === "between")
    condition = prepare.interval(prop, val, args); //dates
  // lower than or equal to
  else if (matchMode === "lte")
    condition = prepare.lte(prop, val, args); //dates
  // greater than or equal to
  else if (matchMode === "gte")
    condition = prepare.gte(prop, val, args); //dates
  else {
    // geom
    if (prop === '"geom"') condition = prepare.geometry(val);
    // null
    else if (isNil(val)) condition = prepare.nil(prop, matchMode);
    // bool
    else if (isBoolean(val)) condition = prepare.boolean(prop, val);
    // number
    else if (isNumber(val, false)) condition = prepare.number(prop, val);
    // string
    else if (isString(val) && val)
      condition = prepare.string(prop, val, args, matchMode);
    //object
    else if (isObject(val, true))
      condition = prepare.object(prop, val, args, matchMode);
    // array
    else if (isArray(val)) condition = prepare.array(prop, val);
  }
  return condition;
}

function isDateMatchMode(matchMode: MatchMode): boolean {
  return ["dateIs", "dateIsNot", "dateBefore", "dateAfter"].includes(matchMode);
}

// Builds where clause
function where(conds: string): string {
  return conds
    ? ` WHERE ${conds.slice(0, -(defaultOperator.length + 1)).trim()}`
    : "";
}

// Adds order by clause
function orderBy(sortField: string, sortOrder: string): string {
  return sortField ? ` ORDER BY "${sortField}" ${sortOrder}` : "";
}

// Adds limit clause
function limit(rows: number, first: number): string {
  return rows ? ` LIMIT ${rows} OFFSET ${first}` : "";
}

export default {
  clause,
};
