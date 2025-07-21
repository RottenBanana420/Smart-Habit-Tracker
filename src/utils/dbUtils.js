/**
 * Database utility functions
 * Helper functions for common database operations
 */
const { withConnection } = require("../models/db");
const { DatabaseError } = require("./errors");

/**
 * Execute a query with parameters and return all results
 * @param {string} sql - SQL query
 * @param {Object|Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
async function query(sql, params = []) {
  try {
    return await withConnection(async (db) => {
      return await db.all(sql, params);
    });
  } catch (error) {
    console.error("Database query error:", error);
    throw new DatabaseError(`Query failed: ${error.message}`);
  }
}

/**
 * Execute a query with parameters and return the first result
 * @param {string} sql - SQL query
 * @param {Object|Array} params - Query parameters
 * @returns {Promise<Object|null>} First result or null if no results
 */
async function queryOne(sql, params = []) {
  try {
    return await withConnection(async (db) => {
      return await db.get(sql, params);
    });
  } catch (error) {
    console.error("Database query error:", error);
    throw new DatabaseError(`Query failed: ${error.message}`);
  }
}

/**
 * Execute an insert query and return the ID of the inserted row
 * @param {string} sql - SQL insert query
 * @param {Object|Array} params - Query parameters
 * @returns {Promise<number>} ID of the inserted row
 */
async function insert(sql, params = []) {
  try {
    return await withConnection(async (db) => {
      const result = await db.run(sql, params);
      return result.lastID;
    });
  } catch (error) {
    console.error("Database insert error:", error);
    throw new DatabaseError(`Insert failed: ${error.message}`);
  }
}

/**
 * Execute an update query and return the number of affected rows
 * @param {string} sql - SQL update query
 * @param {Object|Array} params - Query parameters
 * @returns {Promise<number>} Number of affected rows
 */
async function update(sql, params = []) {
  try {
    return await withConnection(async (db) => {
      const result = await db.run(sql, params);
      return result.changes;
    });
  } catch (error) {
    console.error("Database update error:", error);
    throw new DatabaseError(`Update failed: ${error.message}`);
  }
}

/**
 * Execute a delete query and return the number of affected rows
 * @param {string} sql - SQL delete query
 * @param {Object|Array} params - Query parameters
 * @returns {Promise<number>} Number of affected rows
 */
async function remove(sql, params = []) {
  try {
    return await withConnection(async (db) => {
      const result = await db.run(sql, params);
      return result.changes;
    });
  } catch (error) {
    console.error("Database delete error:", error);
    throw new DatabaseError(`Delete failed: ${error.message}`);
  }
}

/**
 * Execute multiple queries in a transaction
 * @param {Function} operations - Function that takes a db connection and performs operations
 * @returns {Promise<any>} Result of the transaction
 */
async function transaction(operations) {
  return await withConnection(async (db) => {
    try {
      await db.exec("BEGIN TRANSACTION");
      const result = await operations(db);
      await db.exec("COMMIT");
      return result;
    } catch (error) {
      await db.exec("ROLLBACK");
      console.error("Transaction error:", error);
      throw new DatabaseError(`Transaction failed: ${error.message}`);
    }
  });
}

module.exports = {
  query,
  queryOne,
  insert,
  update,
  remove,
  transaction,
};
