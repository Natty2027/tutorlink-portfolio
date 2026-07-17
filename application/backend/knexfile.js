/**
 * File: knexfile.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: Environment-based Knex configuration for migrations and seeds.
 * Notes: Loads MySQL2 connection settings from .env and applies shared base config.
 */

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load .env file
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });

const base = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  migrations: { directory: "./src/db/migrations" },
  seeds: { directory: "./src/db/seeds" },
  pool: { min: 0, max: 10 },
};

export default {
  development: base,
  production: base,
};

