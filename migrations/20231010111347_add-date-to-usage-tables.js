/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.up = async (knex) => {
  await knex.schema.alterTable("hand_usage", (table) => {
    table.string("date").nullable();

    table.dropUnique(["keyboardId", "hand", "repeats"]);
    table.unique(["keyboardId", "hand", "repeats", "date"]);
  });

  await knex.schema.alterTable("finger_usage", (table) => {
    table.string("date").nullable();
    table.dropUnique(["keyboardId", "finger", "repeats"]);
    table.unique(["keyboardId", "finger", "repeats", "date"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.down = async (knex) => {
  await knex.schema.alterTable("hand_usage", (table) => {
    table.unique(["keyboardId", "hand", "repeats"]);
    table.dropUnique(["keyboardId", "hand", "repeats", "date"]);

    table.dropColumn("date");
  });

  await knex.schema.alterTable("finger_usage", (table) => {
    table.unique(["keyboardId", "finger", "repeats"]);
    table.dropUnique(["keyboardId", "finger", "repeats", "date"]);

    table.dropColumn("date");
  });
};
