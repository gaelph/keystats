/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.up = async (knex) => {
  await knex.schema.alterTable("keymaps", (table) => {
    table.enum("type", ["plain", "mtap", "ltap", "lmod"]);
    table.dropUnique(["layerId", "keyId"]);
    table.unique(["layerId", "type", "keyId"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.down = async (knex) => {
  await knex.schema.alterTable("keymaps", (table) => {
    table.dropUnique(["layerId", "type", "keyId"]);
    table.unique(["layerId", "keyId"]);
    table.dropColumn("type");
  });
};
