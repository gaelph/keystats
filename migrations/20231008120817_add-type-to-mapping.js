/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable("keymaps", (table) => {
    table.enum("type", ["plain", "mtap", "ltap", "lmod"]);
    table.dropUnique(["layerId", "keyId"]);
    table.unique(["layerId", "type", "keyId"]);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable("keymaps", (table) => {
    table.dropUnique(["layerId", "type", "keyId"]);
    table.unique(["layerId", "keyId"]);
    table.dropColumn("type");
  });
}
