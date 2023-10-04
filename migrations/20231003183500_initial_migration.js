/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("layers", (table) => {
    table.integer("id").primary();
  });

  await knex.schema.createTable("keys", (table) => {
    table.increments("id").primary();
    table.integer("column").notNullable();
    table.integer("row").notNullable();
    table.integer("hand").notNullable();
    table.integer("finger").notNullable();

    table.unique(["column", "row"]);
    table.index(["column", "row"]);
  });

  await knex.schema.createTable("keymaps", (table) => {
    table.increments("id").primary();
    table.integer("layerId").notNullable();
    table.integer("keyId").notNullable();
    table.integer("keycode").notNullable();
    //
    table.index(["keycode"]);
    //
    table.foreign("keyId").references("keys.id");
    table.foreign("layerId").references("layers.id");
  });

  await knex.schema.createTable("records", (table) => {
    table.increments("id").primary();
    table.date("date").notNullable();
    table.integer("keycode").notNullable();
    table.integer("modifiers").notNullable();
    table.string("application").nullable();
    table.integer("counts").notNullable();
    table.integer("keymapId").notNullable();
    //
    table.foreign("keymapId").references("keymaps.id");
    //
    table.index(["keycode", "modifiers"], "records_keycode_modifiers_index");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable("records", (table) => {
    table.dropIndex(["keycode", "modifiers"]);
    table.dropForeign("keymapId");
  });

  await knex.schema.dropTable("records");

  await knex.schema.alterTable("keymaps", (table) => {
    table.dropIndex(["keycode"]);
    table.dropForeign("keyId");
    table.dropForeign("layerId");
  });
  await knex.schema.dropTable("keymaps");

  await knex.schema.alterTable("keys", (table) => {
    table.dropIndex(["column", "row"]);
    table.dropUnique(["column", "row"]);
  });

  await knex.schema.dropTable("keys");

  await knex.schema.dropTable("layers");
}

export const config = {
  transaction: true,
};
