/**
 * File: src/db/migrations/007_add_is_live_to_tutor_post.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: Add is_live flag to tutor_post to support approval workflow.
 */

export async function up(knex) {
    await knex.schema.alterTable("tutor_post", (table) => {
      table.boolean("is_live").notNullable().defaultTo(false);
    });
  }
  
  export async function down(knex) {
    await knex.schema.alterTable("tutor_post", (table) => {
      table.dropColumn("is_live");
    });
  }
  