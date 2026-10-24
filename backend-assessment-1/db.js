import { Pool } from "pg";

/**
 * Create a PostgreSQL connection pool
 *
 * @returns - A connection pool configured using the database connection string
 * @throws {Error} - If the database connection cannot be established when queried
 */
export const pool = new Pool({
  connectionString: process.env.DB_URL,
});
