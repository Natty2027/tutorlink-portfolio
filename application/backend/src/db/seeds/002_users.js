/**
 * File: src/db/seeds/002_users.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: Seed demo users for TutorLink with bcrypt-style password hashes.
 * Notes: All users share the same demo password: "password".
 */

const DEMO_HASH =
  "$2a$10$N9qo8uLOickgx2ZMRZo5e.PcQ4GqOR/mrDam6DC1zp/70u/1cWQ7e"; // bcrypt hash of "password"

export async function seed(knex) {
  await knex("user_account").del();

  await knex("user_account").insert([
    {
      user_id: 1,
      name_first: "Sarah",
      name_last: "Johnson",
      email: "sjohnson@sfsu.edu",
      password_hash: DEMO_HASH,
      contact_phone: "415-555-0101",
      account_status: "active",
    },
    {
      user_id: 2,
      name_first: "Michael",
      name_last: "Chen",
      email: "mchen@sfsu.edu",
      password_hash: DEMO_HASH,
      contact_phone: "415-555-0102",
      account_status: "active",
    },
    {
      user_id: 3,
      name_first: "Emily",
      name_last: "Rodriguez",
      email: "erodriguez@sfsu.edu",
      password_hash: DEMO_HASH,
      contact_phone: "415-555-0103",
      account_status: "active",
    },
    {
      user_id: 4,
      name_first: "David",
      name_last: "Park",
      email: "dpark@sfsu.edu",
      password_hash: DEMO_HASH,
      contact_phone: "415-555-0104",
      account_status: "active",
    },
    {
      user_id: 5,
      name_first: "Jessica",
      name_last: "Williams",
      email: "jwilliams@sfsu.edu",
      password_hash: DEMO_HASH,
      contact_phone: "415-555-0105",
      account_status: "active",
    },
    {
      user_id: 6,
      name_first: "Alex",
      name_last: "Thompson",
      email: "athompson@sfsu.edu",
      password_hash: DEMO_HASH,
      contact_phone: "415-555-0106",
      account_status: "active",
    },
    {
      user_id: 7,
      name_first: "Rachel",
      name_last: "Kim",
      email: "rkim@sfsu.edu",
      password_hash: DEMO_HASH,
      contact_phone: "415-555-0107",
      account_status: "active",
    },
    {
      user_id: 8,
      name_first: "James",
      name_last: "Martinez",
      email: "jmartinez@sfsu.edu",
      password_hash: DEMO_HASH,
      contact_phone: "415-555-0108",
      account_status: "active",
    },
  ]);
}
