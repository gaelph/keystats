import Fs from "fs";
import Path from "path";
import knex, { Knex } from "knex";

import { existSync } from "../utils/fs.js";
import createDatabase from "../utils/createDatabase.js";

const { HOME } = process.env;
if (!HOME) {
  throw new Error("HOME environment variable not set");
  process.exit(1);
}

const STATE_DIR = Path.join(HOME, ".local", "state", "keystats");
const DB_FILE = Path.join(STATE_DIR, "database.sqlite3");

if (!existSync(STATE_DIR)) {
  Fs.mkdirSync(STATE_DIR, { recursive: true });
}

const CREATE_DATABASE = !existSync(DB_FILE);
console.log("Will create database: ", DB_FILE, CREATE_DATABASE);

// @ts-ignore
const db = knex({
  client: "sqlite3",
  connection: {
    filename: DB_FILE,
  },
  migrations: {
    tableName: "knex_migrations",
  },
  useNullAsDefault: true,
});

export async function initializeDB() {
  console.log("Initializing database...", CREATE_DATABASE);
  if (CREATE_DATABASE) {
    await createDatabase(db);
  }
}

export class DatabaseError extends Error {
  cause: Error | null;
  sql: string | null;
  bindings: Record<string, any> | null;

  constructor(
    message: string,
    query: Knex.QueryBuilder | Knex.Raw | null,
    cause?: Error | null,
  ) {
    super(message);
    const q = query?.toSQL().toNative();
    this.cause = cause || null;
    this.sql = q?.sql || null;
    this.bindings = q?.bindings || null;
  }
}

export class NotFoundError extends DatabaseError {
  constructor(query: Knex.QueryBuilder | Knex.Raw) {
    super(`Record not found`, query);
  }
}

export default db;
