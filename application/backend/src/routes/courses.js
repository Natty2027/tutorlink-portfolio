/**
 * File: src/routes/courses.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: API endpoints for listing and searching available courses.
 * Notes: Used by the frontend to power course dropdowns and search suggestions.
 */

import { Router } from "express";
import db from "../db/knex.js";

const router = Router();

/**
 * GET /api/courses/departments
 * Returns unique departments from the courses table
 * Used by the SearchBar to populate filter dropdown dynamically
 */
router.get("/departments", async (req, res) => {
  try {
    const departments = await db("course")
      .distinct("department")
      .orderBy("department");

    // Map department codes to readable names
    const departmentNames = {
      BIOL: "Biology",
      CHEM: "Chemistry",
      CSC: "Computer Science",
      MATH: "Mathematics",
      PHYS: "Physics",
    };

    const result = departments.map((row) => ({
      code: row.department,
      name: departmentNames[row.department] || row.department,
    }));

    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/courses?query=CSC
router.get("/", async (req, res) => {
  const q = (req.query.query || "").trim();

  // Server-side validation: max 40 characters for search query
  if (q.length > 40) {
    return res.status(400).json({
      error: "Search query must be 40 characters or less",
    });
  }

  // Server-side validation: alphanumeric and spaces only
  if (q && !/^[a-zA-Z0-9\s]*$/.test(q)) {
    return res.status(400).json({
      error: "Search query must contain only letters, numbers, and spaces",
    });
  }

  try {
    let query = db("course").select("*");
    if (q) {
      query = query.where((b) => {
        b.where("course_code", "like", `%${q}%`)
          .orWhere("department", "like", `%${q}%`)
          .orWhere("course_name", "like", `%${q}%`);
      });
    }
    const rows = await query.orderBy(["department", "course_number"]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
