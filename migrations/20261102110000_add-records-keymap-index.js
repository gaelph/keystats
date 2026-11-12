/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.up = async (knex) => {
  await knex.schema.alterTable("records", (table) => {
    table.index(["keymapId"], "records_keymapid_index");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.down = async (knex) => {
  await knex.schema.alterTable("records", (table) => {
    table.dropIndex(["keymapId"], "records_keymapid_index");
  });
};
