//@ts-check
//
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.up = async (knex) => {
  await knex.schema.alterTable("keymaps", function (table) {
    table.dropForeign("keysId");
    table.dropForeign("layerId");
    table.dropUnique(["layerId", "type", "keyId"]);

    table.integer("keyboardId").nullable();
    table.integer("layer").nullable();
    table.integer("row").nullable();
    table.integer("column").nullable();
  });

  await knex.raw(`UPDATE keymaps
		SET keyboardId = keys.keyboardId,
      row = keys.row,
      column = keys.column
		FROM keys
    WHERE keymaps.keyId = keys.id`);

  await knex.raw(`UPDATE keymaps
	SET layer = layers.\`index\`
			FROM layers
			WHERE keymaps.layerId = layers.id`);

  await knex.schema.alterTable("keymaps", function (table) {
    table.dropNullable("keyboardId");
    table.dropNullable("layer");
    table.dropNullable("row");
    table.dropNullable("column");
    table.dropColumn("keyId");
    table.dropColumn("layerId");

    table.unique(["keyboardId", "layer", "row", "column", "type"]);
    table
      .foreign(["keyboardId", "column", "row"])
      .references(["keyboardId", "column", "row"])
      .inTable("keys");
  });

  await knex.schema.alterTable("keys", function (table) {
    table.dropUnique(["keyboardId", "column", "row"]);
    table.dropColumn("id");
    table.primary(["keyboardId", "column", "row"], "keys_pkey");
  });

  await knex.schema.dropTable("layers");
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.down = async (knex) => {
  await knex.schema.createTable("layers", function (table) {
    table.integer("id").primary();
    table.integer("index").notNullable();
    table.integer("keyboardId").notNullable();
    //
    table.foreign("keyboardId").references("keyboards.id");
    table.unique(["index", "keyboardId"]);
  });

  await knex.schema.alterTable("keys", function (table) {
    table.dropPrimary("keys_pkey");
    table.increments("id");
    table.unique(["keyboardId", "column", "row"]);
  });

  await knex
    .into(knex.raw("?? (??, ??)", ["layers", "keyboardId", "index"]))
    .insert(function () {
      this.select("keyboardId", knex.raw("?? AS ??", ["k.layer", "index"]))
        .from("keymaps as k")
        .groupBy("k.keyboardId", "k.layer");
    });

  await knex.schema.alterTable("keymaps", function (table) {
    table.dropForeign(["keyboardId", "column", "row"]);
    table.integer("layerId").nullable();
    table.integer("keyId").nullable();
  });

  await knex.raw(
    `UPDATE keymaps
			SET layerId = layers.id
			FROM layers
			WHERE keymaps.layer = layers.\`index\`
			AND keymaps.keyboardId = layers.keyboardId`,
  );

  await knex.raw(
    `UPDATE keymaps
    SET keyId = keys.id
    FROM keys
    WHERE keymaps.keyboardId = keys.keyboardId
    AND keymaps.row = keys.row
		AND keymaps.column = keys.column`,
  );

  await knex.schema.alterTable("keymaps", function (table) {
    table.dropForeign(["keyboardId", "column", "row"]);
    table.foreign("layerId").references("layers.id");
    table.foreign("keysId").references("keys.id");
    table.dropUnique(["keyboardId", "layer", "row", "column", "type"]);
    table.unique(["layerId", "type", "keyId"]);

    table.dropColumn("layer");
    table.dropColumn("row");
    table.dropColumn("column");
  });
};
