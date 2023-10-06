// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./database.sqlite3",
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};