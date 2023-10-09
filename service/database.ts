import knex from "knex";

import type Model from "./models/model.js";

// @ts-ignore
const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./database.sqlite3",
  },
  migrations: {
    tableName: "knex_migrations",
  },
  useNullAsDefault: true,
});

db.migrate.latest();

export class DatabaseError extends Error {
  cause: Error | null;

  constructor(message: string, cause: Error | null) {
    super(message);
    this.cause = cause;
  }
}

export class DatabaseRecordNotFoundError extends DatabaseError {
  constructor(model: typeof Model) {
    super(`Could not find record in table ${model.table}`, null);
  }
}

export default db;
