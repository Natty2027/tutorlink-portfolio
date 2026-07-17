/**
 * File: src/db/seeds/001_courses.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: Seed the courses table with a realistic set of commonly-used SFSU courses.
 * Notes: These courses support search, tutor posts, and tutoring request flows.
 */

export async function seed(knex) {
    await knex('course').del();
    await knex('course').insert([
      // Computer Science
      { course_code: 'CSC 340', course_name: 'Data Structures & Algorithms', department: 'CSC', course_number: '340' },
      { course_code: 'CSC 413', course_name: 'Software Development',        department: 'CSC', course_number: '413' },
      { course_code: 'CSC 648', course_name: 'Software Engineering',        department: 'CSC', course_number: '648' },
      { course_code: 'CSC 415', course_name: 'Operating Systems',           department: 'CSC', course_number: '415' },
      
      // Mathematics
      { course_code: 'MATH 226', course_name: 'Calculus I',                 department: 'MATH', course_number: '226' },
      { course_code: 'MATH 227', course_name: 'Calculus II',                department: 'MATH', course_number: '227' },
      { course_code: 'MATH 301', course_name: 'Linear Algebra',             department: 'MATH', course_number: '301' },
      
      // Biology
      { course_code: 'BIOL 240', course_name: 'General Biology',            department: 'BIOL', course_number: '240' },
      { course_code: 'BIOL 355', course_name: 'Genetics',                   department: 'BIOL', course_number: '355' },
    ]);
  }
  