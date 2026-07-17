/**
 * File: src/db/migrations/001_create_course.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: Create the courses table to store course information used in tutor posts and tutoring requests.
 * Notes: Course code is the primary identifier (e.g., CSC 648).
 */

export async function up(knex) {
    await knex.schema.createTable('course', (t) => {
      t.string('course_code', 16).primary();     // e.g., CSC 648
      t.string('course_name', 255).notNullable();
      t.string('department', 64).notNullable();  // e.g., CSC
      t.string('course_number', 16).notNullable(); // "648"
    });
  }
  
  export async function down(knex) {
    await knex.schema.dropTableIfExists('course');
  }
  