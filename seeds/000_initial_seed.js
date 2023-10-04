/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("layers").del();
  await knex("layers").insert([
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ]);

  await knex("keys").del();
  await knex("keys").insert([
    // left pinkie out
    { column: 0, row: 0, hand: 0, finger: 0 },
    { column: 0, row: 1, hand: 0, finger: 0 },
    { column: 0, row: 2, hand: 0, finger: 0 },
    { column: 0, row: 3, hand: 0, finger: 0 },
    // left pinkie in
    { column: 1, row: 0, hand: 0, finger: 0 },
    { column: 1, row: 1, hand: 0, finger: 0 },
    { column: 1, row: 2, hand: 0, finger: 0 },
    { column: 1, row: 3, hand: 0, finger: 0 },
    // left ring
    { column: 2, row: 0, hand: 0, finger: 1 },
    { column: 2, row: 1, hand: 0, finger: 1 },
    { column: 2, row: 2, hand: 0, finger: 1 },
    { column: 2, row: 3, hand: 0, finger: 1 },
    // left middle
    { column: 3, row: 0, hand: 0, finger: 2 },
    { column: 3, row: 1, hand: 0, finger: 2 },
    { column: 3, row: 2, hand: 0, finger: 2 },
    { column: 3, row: 3, hand: 0, finger: 4 },
    // left index in
    { column: 4, row: 0, hand: 0, finger: 3 },
    { column: 4, row: 1, hand: 0, finger: 3 },
    { column: 4, row: 2, hand: 0, finger: 3 },
    { column: 4, row: 3, hand: 0, finger: 4 },
    // left index out
    { column: 5, row: 0, hand: 0, finger: 3 },
    { column: 5, row: 1, hand: 0, finger: 3 },
    { column: 5, row: 2, hand: 0, finger: 3 },
    { column: 5, row: 3, hand: 0, finger: 4 },
    // right index out
    { column: 6, row: 0, hand: 1, finger: 6 },
    { column: 6, row: 1, hand: 1, finger: 6 },
    { column: 6, row: 2, hand: 1, finger: 6 },
    { column: 6, row: 3, hand: 1, finger: 5 },
    // right index in
    { column: 7, row: 0, hand: 1, finger: 7 },
    { column: 7, row: 1, hand: 1, finger: 7 },
    { column: 7, row: 2, hand: 1, finger: 7 },
    { column: 7, row: 3, hand: 1, finger: 5 },
    // right ring
    { column: 8, row: 0, hand: 1, finger: 8 },
    { column: 8, row: 1, hand: 1, finger: 8 },
    { column: 8, row: 2, hand: 1, finger: 8 },
    { column: 8, row: 3, hand: 1, finger: 5 },
    // right middle
    { column: 9, row: 0, hand: 1, finger: 9 },
    { column: 9, row: 1, hand: 1, finger: 9 },
    { column: 9, row: 2, hand: 1, finger: 9 },
    { column: 9, row: 3, hand: 1, finger: 9 },
    // right index in
    { column: 10, row: 0, hand: 1, finger: 10 },
    { column: 10, row: 1, hand: 1, finger: 10 },
    { column: 10, row: 2, hand: 1, finger: 10 },
    { column: 10, row: 3, hand: 1, finger: 10 },
    // right index out
    { column: 11, row: 0, hand: 1, finger: 10 },
    { column: 11, row: 1, hand: 1, finger: 10 },
    { column: 11, row: 2, hand: 1, finger: 10 },
    { column: 11, row: 3, hand: 1, finger: 10 },
  ]);
};
