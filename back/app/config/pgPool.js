import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

export const pgPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,  // <= ici si undefined → bug
  port: process.env.DB_PORT,
});