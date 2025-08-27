import pg from "pg";

const { Pool } = pg;

export const pgPool = new Pool();