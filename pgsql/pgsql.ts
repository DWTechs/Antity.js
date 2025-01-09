import pool from "./pool.js";
import { log } from "@dwtechs/winstan";

/**
 * Executes a SELECT query on the specified table with the given columns, conditions, and arguments.
 *
 * @param {string} table - The name of the table to select from.
 * @param {string} cols - The columns to select.
 * @param {string} conds - The conditions for the selection.
 * @param {Array} args - The arguments for the query.
 * @return {Promise} A promise that resolves with the query result.
 */
function select(table: string, cols: string, conds: string, args: string[]): Promise<any> {
  const query = `SELECT ${cols} FROM ${table} ${conds}`;
  return execute(query, args, null);
}

/**
 * Inserts data into a specified table with the given columns, values, and optional return column.
 *
 * @param {string} table - The name of the table to insert into.
 * @param {string} cols - The columns to insert into, separated by commas.
 * @param {string} values - The values to insert, separated by commas.
 * @param {Array} args - The arguments for the query.
 * @param {string} [rtn] - The column to return after the insertion.
 * @param {object} [client] - The PostgreSQL client to use for the query.
 * @return {Promise} A promise that resolves with the result of the query.
 */
function insert(table: string, cols: string, values: string, args: string[], rtn: string, client: any): Promise<any> {
  const rtnQuery = rtn ? `RETURNING ${rtn}` : "";
  const query = `INSERT INTO "${table}" (${cols}) VALUES ${values} ${rtnQuery}`;
  return execute(query, args, client);
}

/**
 * Updates a table with the given queries and arguments.
 *
 * @param {string} table - The name of the table to update.
 * @param {Array<string>} queries - An array of update queries to execute.
 * @param {Array} args - The arguments for the update queries.
 * @param {Object} client - The PostgreSQL client object (optional).
 * @return {Promise} A promise that resolves with the result of the update queries.
 */
function update(table: string, queries: string[], args: string[], client: any): Promise<any> {
  let query = "";
  for (const q of queries) {
    query += `UPDATE "${table}" SET ${q};`;
  }
  return execute(query, args, client);
}

/**
 * Deletes rows from a table based on the provided IDs.
 *
 * @param {string} table - The name of the table from which to delete rows.
 * @param {Array} args - An array of IDs used to identify rows to delete.
 * @param {Object} client - The PostgreSQL client object (optional).
 * @return {Promise} A promise that resolves with the result of the delete operation.
 */
function deleteIds(table: string, args: string[], client: any): Promise<any> {
  const query = `DELETE FROM "${table}" WHERE id IN ${generateQueryPlaceholders(
    args.length,
  )}`;
  return execute(query, args, client);
}

/**
 * Deletes item from the specified table based on the provided id.
 *
 * @param {string} table - The name of the table from which to delete rows.
 * @param {integer} id - The id used to identify rows to delete.
 * @param {Object} client - The PostgreSQL client object (optional).
 * @return {Promise} A promise that resolves with the result of the delete operation.
 */
function deleteOne(table: string, id: number, client: any) {
  const query = `DELETE FROM "${table}" WHERE id = $1`;
  return execute(query, [id], client);
}

/**
 * Deletes old items from the specified table based on the provided date.
 *
 * @param {string} table - The name of the table from which to delete rows.
 * @param {Date} date - The date used to identify old items to delete.
 * @param {Object} client - The PostgreSQL client object (optional).
 * @return {Promise} A promise that resolves with the result of the delete operation.
 */
function deleteOld(table: string, date: number, client: any) {
  const query = `DELETE FROM "${table}" WHERE "archivedAt" < $1`;
  return execute(query, [date], client);
}

/**
 * Execute a query or a transaction depending on the provided pool or client.
 *
 * @param {string} query - The query string to execute.
 * @param {Array} args - The arguments to bind to the query.
 * @param {Object} clt - The PostgreSQL client object (optional).
 * @return {Promise} A promise that resolves with the result of the query execution.
 */
function execute(query: string, args: string[], clt: any): Promise<any> {
  const time = logStart(query, args);
  const client = clt || pool;
  return client
    .query(query, args)
    .then((res) => {
      deleteUselessParams(res);
      logEnd(res, time);
      return res;
    })
    .catch((err) => {
      err.msg = `Postgre: ${err.message}`;
      throw err;
    });
}

/**
 * Deletes useless parameters from the provided response object.
 *
 * @param {Object} res - The response object to modify.
 * @return {undefined} No return value.
 */
function deleteUselessParams(res: any): void {
  res.command = undefined;
  res.oid = undefined;
  res.fields = undefined;
  res._parsers = undefined;
  res._types = undefined;
  res.RowCtor = undefined;
  res.rowAsArray = undefined;
}

/**
 * Logs the start of a PostgreSQL query execution.
 *
 * @param {string} query - The SQL query to be executed.
 * @param {Array} args - The arguments to be bound to the query.
 * @return {number} The timestamp of the start of the query execution.
 */
function logStart(query: string, args: string[]): number {
  log.debug(
    `PG query : { Query : '${query
      .replace(/[\n\r]+/g, "")
      .replace(/\s{2,}/g, " ")}', Args : '${JSON.stringify(args)}' }`,
  );
  return Date.now();
}

/**
 * Logs the end of a PostgreSQL query execution.
 *
 * @param {Object} res - The response object from the query execution.
 * @param {number} time - The timestamp when the query execution started.
 * @return {undefined} No return value.
 */
function logEnd(res: any, time: number): void {
  log.debug(`PG response in ${Date.now() - time}ms : ${JSON.stringify(res)}`);
}

/**
 * Generates a PostgreSQL query string with placeholders for a given quantity of values.
 *
 * @param {number} qty - The quantity of values to generate placeholders for.
 * @return {string} The generated query string with placeholders.
 */
function generateQueryPlaceholders(qty: number): string {
  return `(${Array.from({ length: qty }, (_, i) => `$${i + 1}`).join(", ")})`;
}

export default {
  select,
  insert,
  update,
  deleteIds,
  deleteOne,
  deleteOld,
  execute,
  generateQueryPlaceholders,
};
