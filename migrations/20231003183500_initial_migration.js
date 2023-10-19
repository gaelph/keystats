// @ts-check
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.up = async (knex) => {
  await knex.schema.createTable("keyboards", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.integer("vendorId").notNullable();
    table.integer("productId").notNullable();

    table.unique(["vendorId", "productId"]);
  });

  await knex.schema.createTable("layers", (table) => {
    table.integer("id").primary();
    table.integer("index").notNullable();
    table.integer("keyboardId").notNullable();
    //
    table.foreign("keyboardId").references("keyboards.id");
    table.unique(["index", "keyboardId"]);
  });

  await knex.schema.createTable("keys", (table) => {
    table.increments("id").primary();
    table.integer("column").notNullable();
    table.integer("row").notNullable();
    table.integer("hand").notNullable();
    table.integer("finger").notNullable();
    table.integer("keyboardId").notNullable();

    table.foreign("keyboardId").references("keyboard.id");

    table.unique(["keyboardId", "column", "row"]);
    table.index(["keyboardId", "column", "row"]);
  });

  await knex.schema.createTable("keymaps", (table) => {
    table.increments("id").primary();
    table.integer("layerId").notNullable();
    table.integer("keyId").notNullable();
    table.string("keycode").notNullable();
    //
    table.index(["keycode"]);
    //
    table.foreign("keyId").references("keys.id");
    table.foreign("layerId").references("layers.id");
    table.unique(["layerId", "keyId"]);
  });

  await knex.schema.createTable("records", (table) => {
    table.increments("id").primary();
    table.date("date").notNullable();
    table.integer("modifiers").notNullable();
    table.string("application").nullable();
    table.integer("counts").notNullable();
    table.integer("keymapId").notNullable();
    //
    table.foreign("keymapId").references("keymaps.id");
    //
    table.index(["counts", "modifiers"], "records_keycode_modifiers_index");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.down = async (knex) => {
  await knex.schema.alterTable("records", (table) => {
    table.dropIndex(["modifiers", "modifiers"]);
    table.dropForeign("keymapId");
  });
  await knex.schema.dropTable("records");

  await knex.schema.alterTable("keymaps", (table) => {
    table.dropUnique(["layerId", "keyId"]);
    table.dropIndex(["keycode"]);
    table.dropForeign("keyId");
    table.dropForeign("layerId");
  });
  await knex.schema.dropTable("keymaps");

  await knex.schema.alterTable("keys", (table) => {
    table.dropIndex(["keyboardId", "column", "row"]);
    table.dropUnique(["keyboardId", "column", "row"]);
    table.dropForeign("keyboardId");
  });
  await knex.schema.dropTable("keys");

  await knex.schema.alterTable("layers", (table) => {
    table.dropUnique(["index", "keyboardId"]);
    table.dropForeign("keyboardId");
  });
  await knex.schema.dropTable("layers");

  await knex.schema.alterTable("keyboards", (table) => {
    table.dropUnique(["vendorId", "productId"]);
  });
  await knex.schema.dropTable("keyboards");
};

module.exports.config = {
  transaction: true,
};
