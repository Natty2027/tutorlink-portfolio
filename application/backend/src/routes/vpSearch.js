/**
 * File: src/routes/vpSearch.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: VP search endpoints for tutor_posts with category and text filters.
 * Notes:
 *  - Only returns tutor posts where is_live = true (approved listings).
 *  - Used by the Vertical Prototype search UI to demo realistic tutor search.
 */

import express from "express";
import db from "../db/knex.js";

const router = express.Router();

/**
 * GET /api/vp-search
 * Query params:
 *   - category: department filter (e.g., "CSC", "MATH", "BIOL") or "all"
 *   - query: free text search string
 *
 * Returns: Array of tutor posts with joined course and user data
 */
router.get("/", async (req, res) => {
  try {
    const category = (req.query.category || "").trim();
    const query = (req.query.query || "").trim();

    // Server-side validation: max 40 characters for search query
    if (query.length > 40) {
      return res.status(400).json({
        success: false,
        error: "Search query must be 40 characters or less",
      });
    }

    // Server-side validation: alphanumeric and spaces only
    if (query && !/^[a-zA-Z0-9\s]*$/.test(query)) {
      return res.status(400).json({
        success: false,
        error: "Search query must contain only letters, numbers, and spaces",
      });
    }

    // Base query: only live/approved tutor posts
    let dbQuery = db("tutor_post")
      .join("course", "tutor_post.course_code", "course.course_code")
      .join("user_account", "tutor_post.tutor_id", "user_account.user_id")
      .where("tutor_post.is_live", true)
      .select(
        "tutor_post.post_id",
        "tutor_post.tutor_id",
        "tutor_post.course_code",
        "tutor_post.gpa",
        "tutor_post.year",
        "tutor_post.major",
        "tutor_post.availability_text",
        "tutor_post.bio_intro",
        "tutor_post.hourly_rate",
        "tutor_post.profile_image_url",
        "tutor_post.profile_image_data",
        "course.course_name",
        "course.department",
        "user_account.name_first",
        "user_account.name_last"
      );

    // Apply category filter (department) if provided and not "all"
    if (category && category !== "all") {
      dbQuery = dbQuery.where("course.department", category);
    }

    // Apply text search if provided
    // Search across: course_code + course_name + bio_intro
    if (query) {
      const searchTerm = `%${query}%`;
      dbQuery = dbQuery.where(function () {
        this.where("tutor_post.course_code", "like", searchTerm)
          .orWhere("course.course_name", "like", searchTerm)
          .orWhere("tutor_post.bio_intro", "like", searchTerm);
      });
    }

    const results = await dbQuery;

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("VP Search error:", error);
    res.status(500).json({
      success: false,
      message: "Error searching tutor posts",
      error: error.message,
    });
  }
});

export default router;
