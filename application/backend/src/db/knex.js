/**
 * File: src/db/knex.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: Initialize and export a configured Knex instance for database access.
 * Notes: Uses environment-based configuration to support dev/test/prod workflows.
 */

import knex from "knex";
import config from "../../knexfile.js";

const env = process.env.NODE_ENV || "development";
const db = knex(config[env]);

export default db;

