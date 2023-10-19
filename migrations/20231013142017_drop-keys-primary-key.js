/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.up = async (knex) => {
  await knex.schema.alterTable("keys", function (table) {
    table.dropPrimary("id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.down = async (knex) => {
  await knex.schema.alterTable("keys", function (table) {
    table.primary("id");
  });
};
