/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.up = async (knex) => {
  await knex.schema.createTable("hand_usage", (table) => {
    table.increments("id").primary();
    table.integer("hand").checkIn([0, 1]).notNullable();
    table.integer("repeats").checkPositive().notNullable();
    table.integer("count").checkPositive().notNullable();
    table.integer("keyboardId").notNullable();
    table.date("createdAt").notNullable().defaultTo(knex.fn.now());
    table.date("updatedAt").notNullable().defaultTo(knex.fn.now());

    table.foreign("keyboardId").references("id").inTable("keyboards");
    table.unique(["keyboardId", "hand", "repeats"]);
  });

  await knex.schema.createTable("finger_usage", (table) => {
    table.increments("id").primary();
    table
      .integer("finger")
      .checkIn([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      .notNullable();
    table.integer("repeats").checkPositive().notNullable();
    table.integer("count").checkPositive().notNullable();
    table.integer("keyboardId").notNullable();
    table.date("createdAt").notNullable().defaultTo(knex.fn.now());
    table.date("updatedAt").notNullable().defaultTo(knex.fn.now());

    table.foreign("keyboardId").references("id").inTable("keyboards");
    table.unique(["keyboardId", "finger", "repeats"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.down = async (knex) => {
  await knex.schema.alterTable("finger_usage", (table) => {
    table.dropForeign(["keyboardId"]);
    table.dropUnique(["keyboardId", "finger", "repeats"]);
  });

  await knex.schema.dropTable("finger_usage");

  await knex.schema.alterTable("hand_usage", (table) => {
    table.dropForeign(["keyboardId"]);
    table.dropUnique(["keyboardId", "hand", "repeats"]);
  });

  await knex.schema.dropTable("hand_usage");
};
