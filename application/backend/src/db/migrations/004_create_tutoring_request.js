/**
 * File: src/db/migrations/004_create_tutoring_request.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: Create tutoring_requests table for students requesting sessions from tutors.
 * Notes: Links a requester, the tutor, and the specific tutor_post for context.
 */

export async function up(knex) {
    await knex.schema.createTable('tutoring_request', (t) => {
      t.increments('request_id').primary();
      t.integer('requester_user_id').unsigned().notNullable()
        .references('user_id').inTable('user_account').onDelete('CASCADE');
      t.integer('tutor_id').unsigned().notNullable()
        .references('user_id').inTable('user_account').onDelete('CASCADE');
      t.integer('post_id').unsigned().notNullable()
        .references('post_id').inTable('tutor_post').onDelete('CASCADE');
      t.string('course_code', 16).notNullable()
        .references('course_code').inTable('course').onDelete('CASCADE');
  
      t.string('student_contact', 255).notNullable();
      t.text('message');
  
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
  
  export async function down(knex) {
    await knex.schema.dropTableIfExists('tutoring_request');
  }
  