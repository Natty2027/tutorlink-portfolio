/**
 * File: src/db/migrations/001_create_user_account.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: Create users table to store student and tutor account information.
 */

export async function up(knex) {
    await knex.schema.createTable('user_account', (t) => {
      t.increments('user_id').primary();
      t.string('name_first', 100).notNullable();
      t.string('name_last', 100).notNullable();
      t.string('email', 255).notNullable().unique();      // @sfsu.edu
      t.string('password_hash', 255).notNullable();
      t.string('contact_phone', 30);
      t.enum('account_status', ['active','suspended','inactive'])
        .notNullable().defaultTo('active');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
  
  export async function down(knex) {
    await knex.schema.dropTableIfExists('user_account');
  }
  