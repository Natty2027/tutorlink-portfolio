/**
 * File: src/db/seeds/003_tutor_posts.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: Seed the tutor_posts table with realistic demo listings for the Vertical Prototype (VP).
 * Notes: Tutor IDs and course codes must match existing users and courses seeds.
 */

export async function seed(knex) {
  await knex('tutor_post').del();
  
  await knex('tutor_post').insert([
    // Computer Science Posts (4 posts)
    {
      post_id: 1,
      tutor_id: 1,
      course_code: 'CSC 340',
      gpa: 3.85,
      year: 'Senior',
      major: 'Computer Science',
      availability_text: 'Mondays & Wednesdays 2-5 PM, Fridays 1-4 PM',
      bio_intro: 'Hi! I\'m Sarah and I\'ve been tutoring Data Structures for 2 years. I can help you master algorithms, Big O notation, trees, graphs, and more. I scored an A+ in this course and love making complex topics easy to understand.',
      hourly_rate: 35.00,
      profile_image_url: null,
      is_live: true   // approved and visible in search
    },
    {
      post_id: 2,
      tutor_id: 2,
      course_code: 'CSC 648',
      gpa: 3.92,
      year: 'Senior',
      major: 'Computer Science',
      availability_text: 'Tuesdays & Thursdays 3-6 PM, Saturdays 10 AM-2 PM',
      bio_intro: 'Software Engineering expert here! I have industry experience and can help with Agile methodology, project management, testing, and full-stack development. Let\'s build something great together!',
      hourly_rate: 40.00,
      profile_image_url: null,
      is_live: true
    },
    {
      post_id: 3,
      tutor_id: 3,
      course_code: 'CSC 413',
      gpa: 3.78,
      year: 'Junior',
      major: 'Computer Science',
      availability_text: 'Mondays, Wednesdays, Fridays 12-3 PM',
      bio_intro: 'Passionate about software development and object-oriented programming! I can help you understand design patterns, Java programming, and best coding practices. Very patient and experienced with students.',
      hourly_rate: 30.00,
      profile_image_url: null,
      is_live: false  // example of a pending/non-approved listing
    },
    {
      post_id: 4,
      tutor_id: 4,
      course_code: 'CSC 415',
      gpa: 3.88,
      year: 'Senior',
      major: 'Computer Science',
      availability_text: 'Tuesdays & Thursdays 1-5 PM, Sundays 2-6 PM',
      bio_intro: 'Operating Systems can be challenging, but I\'m here to help! Expert in process management, memory allocation, scheduling algorithms, and file systems. I also have Linux system administration experience.',
      hourly_rate: 38.00,
      profile_image_url: null,
      is_live: true
    },

    // Mathematics Posts (3 posts)
    {
      post_id: 5,
      tutor_id: 5,
      course_code: 'MATH 226',
      gpa: 3.95,
      year: 'Junior',
      major: 'Mathematics',
      availability_text: 'Daily 4-7 PM, Weekends flexible',
      bio_intro: 'Calculus doesn\'t have to be scary! I specialize in making calculus concepts clear and intuitive. Whether it\'s limits, derivatives, or integration, I\'ll help you understand and succeed.',
      hourly_rate: 32.00,
      profile_image_url: null,
      is_live: true
    },
    {
      post_id: 6,
      tutor_id: 6,
      course_code: 'MATH 227',
      gpa: 3.82,
      year: 'Senior',
      major: 'Applied Mathematics',
      availability_text: 'Mondays, Wednesdays, Fridays 3-6 PM',
      bio_intro: 'Calculus II tutor with 3 years experience. I focus on integration techniques, sequences, series, and differential equations. I use real-world examples to make concepts stick!',
      hourly_rate: 33.00,
      profile_image_url: null,
      is_live: true
    },
    {
      post_id: 7,
      tutor_id: 7,
      course_code: 'MATH 301',
      gpa: 3.90,
      year: 'Senior',
      major: 'Mathematics',
      availability_text: 'Tuesdays & Thursdays 2-5 PM, Saturdays 11 AM-3 PM',
      bio_intro: 'Linear Algebra specialist! I help students master matrices, vector spaces, eigenvalues, and transformations. Great at visualizing abstract concepts and relating them to applications.',
      hourly_rate: 35.00,
      profile_image_url: null,
      is_live: false   // another example pending
    },

    // Biology Posts (2 posts)
    {
      post_id: 8,
      tutor_id: 8,
      course_code: 'BIOL 240',
      gpa: 3.87,
      year: 'Junior',
      major: 'Biology',
      availability_text: 'Weekdays 5-8 PM, Sundays 1-5 PM',
      bio_intro: 'Biology enthusiast with a passion for teaching! I cover cell biology, metabolism, genetics, and evolution. I use mnemonics, diagrams, and practice questions to help you ace your exams.',
      hourly_rate: 28.00,
      profile_image_url: null,
      is_live: true
    },
    {
      post_id: 9,
      tutor_id: 1,
      course_code: 'BIOL 355',
      gpa: 3.85,
      year: 'Senior',
      major: 'Molecular Biology',
      availability_text: 'Tuesdays & Thursdays 4-7 PM, Saturdays 2-5 PM',
      bio_intro: 'Genetics can be complex but fascinating! I help students understand Mendelian genetics, molecular genetics, gene expression, and population genetics. Strong background in research.',
      hourly_rate: 31.00,
      profile_image_url: null,
      is_live: true
    },
    {
      post_id: 10,
      tutor_id: 2,
      course_code: 'CSC 340',
      gpa: 3.76,
      year: 'Junior',
      major: 'Computer Science',
      availability_text: 'Fridays 9 AM-12 PM, Saturdays 1-4 PM',
      bio_intro: 'Hello! I am Michael, and I love helping students understand data structures through hands-on examples and visual explanations. I focus on breaking down recursion, graphs, and trees in a way that finally makes sense.',
      hourly_rate: 29.00,
      profile_image_url: null,
      is_live: true
  }
  ]);
}

