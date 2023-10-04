import knex from "knex";

const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./database.sqlite",
  },
  migrations: {
    tableName: "knex_migrations",
  },
});

export default db;
