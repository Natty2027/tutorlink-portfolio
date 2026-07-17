/**
 * File: src/db/migrations/003_create_tutor_post.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: Create tutor_posts table to store public tutor listings shown on the search page.
 * Notes: Each post links a tutor to the course they can teach.
 */

export async function up(knex) {
    await knex.schema.createTable('tutor_post', (t) => {
      t.increments('post_id').primary();
      t.integer('tutor_id').unsigned().notNullable()
        .references('user_id').inTable('user_account').onDelete('CASCADE');
      t.string('course_code', 16).notNullable()
        .references('course_code').inTable('course').onDelete('CASCADE');
  
      t.decimal('gpa', 3, 2);
      t.string('year', 32);     // e.g., Senior
      t.string('major', 128);
      t.text('availability_text');
      t.text('bio_intro');
  
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }
  
  export async function down(knex) {
    await knex.schema.dropTableIfExists('tutor_post');
  }
  