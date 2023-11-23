/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.up = async (knex) => {
  await knex.schema.alterTable("keymaps", function (table) {
    table.dropColumn("type_old");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.down = async (knex) => {
  await knex.schema.alterTable("keymaps", function (table) {
    table.enum("type_old", ["plain", "mtap", "ltap", "lmod"]);
  });
  await knex.schema.raw(`UPDATE keymaps SET type_old = type`);
};
