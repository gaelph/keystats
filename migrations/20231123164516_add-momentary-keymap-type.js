/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.up = async (knex) => {
  await knex.schema.alterTable("keymaps", function (table) {
    table.dropUnique(["keyboardId", "layer", "row", "column", "type"]);
  });

  await knex.schema.alterTable("keymaps", function (table) {
    table.renameColumn("type", "type_old");
  });
  await knex.schema.alterTable("keymaps", function (table) {
    table.enum("type", ["plain", "mtap", "ltap", "lmod", "layer"]);
  });

  await knex.schema.raw(`
UPDATE keymaps SET type = type_old;
	`);

  await knex.schema.alterTable("keymaps", function (table) {
    table.unique(["keyboardId", "layer", "row", "column", "type"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.down = async (knex) => {
  await knex.schema.alterTable("keymaps", function (table) {
    table.dropUnique(["keyboardId", "layer", "row", "column", "type"]);
  });

  await knex.schema.alterTable("keymaps", function (table) {
    table.dropColumn("type");
  });
  await knex.schema.alterTable("keymaps", function (table) {
    table.renameColumn("type_old", "type");
  });

  await knex.schema.alterTable("keymaps", function (table) {
    table.unique(["keyboardId", "layer", "row", "column", "type"]);
  });
};
