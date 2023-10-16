import { Knex } from "knex";
import { instanceOfNodeError } from "./fs.js";
const SCHEMA = `
CREATE TABLE
  \`keyboards\` (
    \`id\` integer not null primary key autoincrement,
    \`name\` varchar(255) not null,
    \`vendorId\` inte ger not null,
    \`productId\` integer not null
  );

CREATE UNIQUE INDEX \`keyboards_vendorid_productid_unique\` on \`keyboards\` (\`vendorId\`, \`productId\`);

CREATE TABLE
  IF NOT EXISTS "keys" (
    \`column\` integer NOT NULL,
    \`row\` integer NOT NULL,
    \`hand\` integer NOT NULL,
    \`finger\` integer NOT NULL,
    \`keyboardId\` integer NOT NULL,
    FOREIGN KEY (\`keyboardId\`) REFERENCES \`keyboard\` (\`id\`),
    CONSTRAINT \`ke
ys_pkey\` PRIMARY KEY (\`keyboardId\`, \`column\`, \`row\`)
  );

CREATE INDEX \`keys_keyboardid_column_row_index\` on \`keys\` (\`keyboardId\`, \`column\`, \`row\`);

CREATE TABLE
  IF NOT EXISTS "keymaps" (
    \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    \`keycode\` varchar(255) NOT NULL,
    \`type\` text CHECK (\`type\` in ('plain', 'mtap', 'ltap', 'lmod')),
    \`keyboardId\` integer NOT NULL,
    \`layer\` integer NOT NULL,
    \`row\` integer NOT NULL,
    \`column\` integer NOT NULL,
    FOREIGN KEY (\`keyboardId\`, \`column\`, \`row\`) REFERENCES \`keys\` (\`keyboardId\`, \`column\`, \`row\`)
  );

CREATE INDEX \`keymaps_keycode_index\` on \`keymaps\` (\`keycode\`);

CREATE UNIQUE INDEX \`keymaps_keyboardid_layer_row_column_type_unique\` on \`keymaps\` (\`keyboardId\`, \`layer\`, \`row\`, \`column\`, \`type\`);

CREATE TABLE
  \`records\` (
    \`id\` integer not null primary key autoincrement,
    \`date\` date not null,
    \`modifiers\` integer not null,
    \`application\` varchar(255) null,
    \`counts\` integer not null,
    \`keymapId\` integer not null,
    foreign key (\`keymapId\`) references \`keymaps\` (\`id\`)
  );

CREATE INDEX \`records_keycode_modifiers_index\` on \`records\` (\`counts\`, \`modifiers\`);

CREATE TABLE
  \`finger_usage\` (
    \`id\` integer not null primary key autoincrement,
    \`finger\` integer not null check (\`finger\` in (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)),
    \`repeats\` integer not null check (\`repeats\` > 0),
    \`count\` integer not null check (\`count\` > 0),
    \`keyboardId\` integer not null,
    \`createdAt\` date not null default CURRENT_TIMESTAMP,
    \`updatedAt\` date not null default CURRENT_TIMESTAMP,
    \`date\` varchar(255) null,
    foreign key (\`keyboardId\`) references \`keyboards\` (\`id\`)
  );

CREATE UNIQUE INDEX \`finger_usage_keyboardid_finger_repeats_date_unique\` on \`finger_usage\` (\`keyboardId\`, \`finger\`, \`repeats\`, \`date\`);

CREATE TABLE
  \`hand_usage\` (
    \`id\` integer not null primary key autoincrement,
    \`hand\` integer not null check (\`hand\` in (0, 1)),
    \`repeats\` integer not null check (\`repeats\` > 0),
    \`count\` integer not null check (\`count\` > 0),
    \`keyboardId\` integer not null,
    \`createdAt\` date not null default CURRENT_TIMESTAMP,
    \`updatedAt\` date not null default CURRENT_TIMESTAMP,
    \`date\` varchar(255) null,
    foreign key (\`keyboardId\`) references \`keyboards\` (\`id\`)
  );

CREATE UNIQUE INDEX \`hand_usage_keyboardid_hand_repeats_date_unique\` on \`hand_usage\` (\`keyboardId\`, \`hand\`, \`repeats\`, \`date\`);

CREATE TABLE
  \`knex_migrations\` (
    \`id\` integer not null primary key autoincrement,
    \`name\` varchar(255),
    \`batch\` integer,
    \`migration_time\` datetime
  );

CREATE TABLE
  \`knex_migrations_lock\` (
    \`index\` integer not null primary key autoincrement,
    \`is_locked\` integer
  );
`;
export default async function createDatabase(db: Knex): Promise<void> {
  const statements = SCHEMA.split(";");
  for (const statement of statements) {
    console.log(statement);
    try {
      await db.raw(statement);
    } catch (e: any) {
      if (instanceOfNodeError(e as Error, TypeError)) {
        if (e.code !== "SQLITE_MISUSE") {
          throw e;
        }
      }
    }
  }
}
