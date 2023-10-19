// Update with your config settings.
import Path from "path";

const { HOME } = process.env;
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: "sqlite3",
    connection: {
      filename: Path.join(
        HOME,
        ".local",
        "state",
        "keystats",
        "./database.sqlite3",
      ),
    },
    migrations: {
      tableName: "knex_migrations",
    },
    useNullAsDefault: true,
  },
};
