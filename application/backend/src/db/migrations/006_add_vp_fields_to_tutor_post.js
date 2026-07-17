/**
 * File: src/db/migrations/006_add_vp_fields_to_tutor_posts.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: Add hourly_rate and profile_image_url fields to tutor_posts for Vertical Prototype (VP).
 * Notes: These fields support richer tutor profiles in the search UI.
 */

export const up = async (knex) => {
  await knex.schema.alterTable("tutor_post", (table) => {
    table.decimal("hourly_rate", 6, 2);
    table.string("profile_image_url", 500);
  });
};

export const down = async (knex) => {
  await knex.schema.alterTable("tutor_post", (table) => {
    table.dropColumn("hourly_rate");
    table.dropColumn("profile_image_url");
  });
};

