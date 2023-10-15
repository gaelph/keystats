import knex, { Knex } from "knex";

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
