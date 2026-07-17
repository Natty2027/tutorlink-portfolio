/**
 * File: src/routes/auth.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: Basic authentication endpoints (register + login) using bcrypt hashes.
 * Notes:
 *  - Passwords are NEVER stored as plaintext. We store bcrypt hashes in user_account.password_hash.
 *  - Frontend should POST JSON to /api/auth/register and /api/auth/login.
 */

import { Router } from "express";
import db from "../db/knex.js";
import bcrypt from "bcryptjs";

const router = Router();
const BCRYPT_ROUNDS = 10;

/**
 * POST /api/auth/register
 * Body:
 *  {
 *    "email": "name@sfsu.edu",
 *    "password": "plaintext-password",
 *    "name_first": "First",
 *    "name_last": "Last"
 *  }
 */
router.post("/register", async (req, res) => {
  const { email, password, name_first, name_last } = req.body || {};

  if (!email || !password || !name_first || !name_last) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Validate @sfsu.edu email domain
  if (!email.toLowerCase().endsWith("@sfsu.edu")) {
    return res
      .status(400)
      .json({ error: "Registration requires an @sfsu.edu email address." });
  }

  try {
    // Check if email already exists
    const existing = await db("user_account").where({ email }).first();
    if (existing) {
      return res.status(409).json({ error: "Email already registered." });
    }

    // Hash the password with bcrypt (sync for simplicity with bcryptjs)
    const password_hash = bcrypt.hashSync(password, BCRYPT_ROUNDS);

    // Insert new user
    const [user_id] = await db("user_account").insert({
      email,
      password_hash,
      name_first,
      name_last,
      account_status: "active",
    });

    return res.status(201).json({
      user_id,
      email,
      name_first,
      name_last,
    });
  } catch (e) {
    console.error("Register error:", e);
    return res.status(500).json({ error: "Server error during registration." });
  }
});

/**
 * POST /api/auth/login
 * Body:
 *  {
 *    "email": "name@sfsu.edu",
 *    "password": "plaintext-password"
 *  }
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await db("user_account").where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Use bcrypt.compareSync with bcryptjs
    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    return res.json({
      user_id: user.user_id,
      email: user.email,
      name_first: user.name_first,
      name_last: user.name_last,
    });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ error: "Server error during login." });
  }
});

export default router;
