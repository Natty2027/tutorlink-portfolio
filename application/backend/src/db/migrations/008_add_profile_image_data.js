/**
 * File: src/db/migrations/008_add_profile_image_data.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: Add profile_image_data field to store base64-encoded profile pictures.
 * Notes: Uses LONGTEXT to store larger base64 image strings safely in the database.
 */

export const up = async (knex) => {
  await knex.schema.alterTable("tutor_post", (table) => {
    table.text("profile_image_data", "longtext");
  });
};

export const down = async (knex) => {
  await knex.schema.alterTable("tutor_post", (table) => {
    table.dropColumn("profile_image_data");
  });
};

