import pool from "./pool";
import { log } from "@dwtechs/winstan";
import { Entity } from "@dwtechs/antity";
import { mapType, mapComparator, mapIndex } from "./map";
import { checkMatchMode } from "./check";
import type { Clause, MatchMode, Type, Filters, Filter } from "./types";

export class SQLEntity extends Entity {
  private table: string;
  private cols: Record<Operation, string[]>;
  private unsafeProps: string[];
  private properties: Property[];
  private defaultOperator = "AND";

  // constructor(table: string, properties: Property[]) {
  //   super(table, properties); // Call the constructor of the base class
  // }

  public select( 
    first: number,
    rows: number,
    sortOrder: string,
    sortField: string,
    filters: Filters | null,
    pagination: boolean
  ): Promise<any> {

    let conditions = "";
    let i = 1;
    const args: (Filter["value"])[] = [];
  
    if (filters) {
      for (const key in filters) {
        const propType = this.getPropertyType(key);
        if (!propType) {
          log.info(`Skipping unknown property: ${key}`);
          continue;
        }
        
        const type = mapType(propType); // transform from entity type to valid sql filter type
        const filter = filters[key];
        let newCondition: string | null = null;
        const sqlKey = `\"${key}\"`; // escaped property name for sql query
        const { value, subProps, matchMode } = filter;
        
        if (matchMode && !checkMatchMode(type, matchMode)) { // check if match mode is compatible with sql type
          log.info(`Skipping invalid match mode: ${matchMode} for type: ${type} at property: ${key}`);
          continue;
        }

        const comparator = mapComparator(matchMode);
        const mappedIndex = mapIndex(i, matchMode);
        args.push(value);
        newCondition = `${sqlKey} ${comparator} ${mappedIndex}`;
        conditions += `${newCondition} ${this.defaultOperator}`;
        i++;
      }
    }

    conditions = this.where(conditions) 
               + this.orderBy(sortField, sortOrder) 
               + this.limit(rows, first);

    const query = `SELECT ${this.getCols("select", true, pagination)} FROM ${this.getTable()} ${conditions}`;
    return this.execute(query, args, null);

  }

  // Builds where clause
  private where(conds: string): string {
    return conds
      ? ` WHERE ${conds.slice(0, -(this.defaultOperator.length + 1)).trim()}`
      : "";
  }

  // Adds order by clause
  private orderBy(sortField: string, sortOrder: string): string {
    return sortField ? ` ORDER BY "${sortField}" ${sortOrder}` : "";
  }

  // Adds limit clause
  private limit(rows: number, first: number): string {
    return rows ? ` LIMIT ${rows} OFFSET ${first}` : "";
  }

  private execute(query: string, args: string[], clt: any): Promise<any> {
    const time = this.logStart(query, args);
    const client = clt || pool;
    return client
      .query(query, args)
      .then((res) => {
        this.deleteIdleParams(res);
        this.logEnd(res, time);
        return res;
      })
      .catch((err) => {
        err.msg = `Postgre error: ${err.message}`;
        throw err;
      });
  }

  private getPropertyType(propName: string): Type {
    return this.properties[propName]?.type || null;
  }

  private logStart(query: string, args: string[]): number {
    log.debug(
      `PG query : { Query : '${query
        .replace(/[\n\r]+/g, "")
        .replace(/\s{2,}/g, " ")}', Args : '${JSON.stringify(args)}' }`,
    );
    return Date.now();
  }

  private logEnd(res: any, time: number): void {
    log.debug(`PG response in ${Date.now() - time}ms : ${JSON.stringify(res)}`);
  }

  private deleteIdleParams(res: any): void {
    res.command = undefined;
    res.oid = undefined;
    res.fields = undefined;
    res._parsers = undefined;
    res._types = undefined;
    res.RowCtor = undefined;
    res.rowAsArray = undefined;
  }

}


// /**
//  * Inserts data into a specified table with the given columns, values, and optional return column.
//  *
//  * @param {string} table - The name of the table to insert into.
//  * @param {string} cols - The columns to insert into, separated by commas.
//  * @param {string} values - The values to insert, separated by commas.
//  * @param {Array} args - The arguments for the query.
//  * @param {string} [rtn] - The column to return after the insertion.
//  * @param {object} [client] - The PostgreSQL client to use for the query.
//  * @return {Promise} A promise that resolves with the result of the query.
//  */
// function insert(table: string, cols: string, values: string, args: string[], rtn: string, client: any): Promise<any> {
//   const rtnQuery = rtn ? `RETURNING ${rtn}` : "";
//   const query = `INSERT INTO "${table}" (${cols}) VALUES ${values} ${rtnQuery}`;
//   return execute(query, args, client);
// }

// /**
//  * Updates a table with the given queries and arguments.
//  *
//  * @param {string} table - The name of the table to update.
//  * @param {Array<string>} queries - An array of update queries to execute.
//  * @param {Array} args - The arguments for the update queries.
//  * @param {Object} client - The PostgreSQL client object (optional).
//  * @return {Promise} A promise that resolves with the result of the update queries.
//  */
// function update(table: string, queries: string[], args: string[], client: any): Promise<any> {
//   let query = "";
//   for (const q of queries) {
//     query += `UPDATE "${table}" SET ${q};`;
//   }
//   return execute(query, args, client);
// }

// /**
//  * Deletes rows from a table based on the provided IDs.
//  *
//  * @param {string} table - The name of the table from which to delete rows.
//  * @param {Array} args - An array of IDs used to identify rows to delete.
//  * @param {Object} client - The PostgreSQL client object (optional).
//  * @return {Promise} A promise that resolves with the result of the delete operation.
//  */
// function deleteIds(table: string, args: string[], client: any): Promise<any> {
//   const query = `DELETE FROM "${table}" WHERE id IN ${generateQueryPlaceholders(
//     args.length,
//   )}`;
//   return execute(query, args, client);
// }

// /**
//  * Deletes item from the specified table based on the provided id.
//  *
//  * @param {string} table - The name of the table from which to delete rows.
//  * @param {integer} id - The id used to identify rows to delete.
//  * @param {Object} client - The PostgreSQL client object (optional).
//  * @return {Promise} A promise that resolves with the result of the delete operation.
//  */
// function deleteOne(table: string, id: number, client: any) {
//   const query = `DELETE FROM "${table}" WHERE id = $1`;
//   return execute(query, [id], client);
// }

// /**
//  * Deletes old items from the specified table based on the provided date.
//  *
//  * @param {string} table - The name of the table from which to delete rows.
//  * @param {Date} date - The date used to identify old items to delete.
//  * @param {Object} client - The PostgreSQL client object (optional).
//  * @return {Promise} A promise that resolves with the result of the delete operation.
//  */
// function deleteOld(table: string, date: number, client: any) {
//   const query = `DELETE FROM "${table}" WHERE "archivedAt" < $1`;
//   return execute(query, [date], client);
// }

// /**
//  * Generates a PostgreSQL query string with placeholders for a given quantity of values.
//  *
//  * @param {number} qty - The quantity of values to generate placeholders for.
//  * @return {string} The generated query string with placeholders.
//  */
// function generateQueryPlaceholders(qty: number): string {
//   return `(${Array.from({ length: qty }, (_, i) => `$${i + 1}`).join(", ")})`;
// }
