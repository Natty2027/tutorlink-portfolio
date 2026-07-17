/**
 * File: src/routes/tutorPosts.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: API endpoints for tutor posts (create, list, get user's posts)
 * Notes:
 *  - Public GET only returns posts where is_live = true (approved listings)
 *  - POST creates new posts with is_live = false (pending approval)
 *  - /my-posts returns all posts for the authenticated user
 */

import { Router } from "express";
import db from "../db/knex.js";

const router = Router();

/**
 * GET /api/tutor-posts
 * Returns approved (is_live=true) tutor posts with optional search filters
 * Query params:
 *   - course: filter by course code (partial match)
 *   - name: filter by tutor name (partial match on full name)
 */
router.get("/", async (req, res) => {
  const course = (req.query.course || "").trim();
  const name = (req.query.name || "").trim();

  // Server-side validation: max 40 characters for search queries
  if (course.length > 40 || name.length > 40) {
    return res.status(400).json({
      error: "Search query must be 40 characters or less",
    });
  }

  // Server-side validation: alphanumeric and spaces only
  if (
    (course && !/^[a-zA-Z0-9\s]*$/.test(course)) ||
    (name && !/^[a-zA-Z0-9\s]*$/.test(name))
  ) {
    return res.status(400).json({
      error: "Search query must contain only letters, numbers, and spaces",
    });
  }

  try {
    const rows = await db("tutor_post as p")
      .join("user_account as u", "u.user_id", "p.tutor_id")
      .join("course as c", "c.course_code", "p.course_code")
      // Only show approved / live tutor posts in public search
      .where("p.is_live", true)
      .modify((qb) => {
        if (course) {
          qb.where("p.course_code", "like", `%${course}%`);
        }
        if (name) {
          // Match on full name so search feels natural to students
          qb.whereRaw(`CONCAT(u.name_first, ' ', u.name_last) LIKE ?`, [
            `%${name}%`,
          ]);
        }
      })
      .select(
        "p.post_id",
        "p.course_code",
        "c.course_name",
        "c.department",
        "u.user_id as tutor_id",
        "u.name_first",
        "u.name_last",
        "p.bio_intro",
        "p.availability_text",
        "p.hourly_rate",
        "p.profile_image_data",
        "p.updated_at"
      )
      .orderBy([
        { column: "p.course_code" },
        { column: "p.updated_at", order: "desc" },
      ]);

    return res.json(rows);
  } catch (e) {
    // Return structured error so frontend can debug & show a friendly message
    return res.status(500).json({
      error: "Failed to load tutor posts",
      message: e.message,
    });
  }
});

/**
 * GET /api/tutor-posts/my-posts
 * Returns all posts for a specific user (including pending approval)
 * Query params:
 *   - user_id: the user ID to fetch posts for (required)
 */
router.get("/my-posts", async (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    const rows = await db("tutor_post as p")
      .join("course as c", "c.course_code", "p.course_code")
      .where("p.tutor_id", userId)
      .select(
        "p.post_id",
        "p.course_code",
        "c.course_name",
        "c.department",
        "p.bio_intro",
        "p.availability_text",
        "p.hourly_rate",
        "p.gpa",
        "p.year",
        "p.major",
        "p.is_live",
        "p.created_at",
        "p.updated_at"
      )
      .orderBy("p.created_at", "desc");

    return res.json(rows);
  } catch (e) {
    return res.status(500).json({
      error: "Failed to load your tutor posts",
      message: e.message,
    });
  }
});

/**
 * GET /api/tutor-posts/:post_id
 * Returns a single tutor post by post_id (only if is_live = true)
 */
router.get("/:post_id", async (req, res) => {
  const postId = req.params.post_id;

  try {
    const post = await db("tutor_post as p")
      .join("user_account as u", "u.user_id", "p.tutor_id")
      .join("course as c", "c.course_code", "p.course_code")
      .where("p.post_id", postId)
      .where("p.is_live", true) // Only return approved posts
      .select(
        "p.post_id",
        "p.tutor_id",
        "p.course_code",
        "p.gpa",
        "p.year",
        "p.major",
        "p.availability_text",
        "p.bio_intro",
        "p.hourly_rate",
        "p.profile_image_url",
        "p.profile_image_data",
        "p.created_at",
        "p.updated_at",
        "c.course_name",
        "c.department",
        "u.name_first",
        "u.name_last"
      )
      .first();

    if (!post) {
      return res.status(404).json({ error: "Tutor post not found" });
    }

    return res.json(post);
  } catch (e) {
    return res.status(500).json({
      error: "Failed to load tutor post",
      message: e.message,
    });
  }
});

/**
 * POST /api/tutor-posts
 * Create a new tutor post (starts with is_live = false, pending approval)
 * Body:
 *   - tutor_id: user ID of the tutor (required)
 *   - course_code: course code to tutor (required)
 *   - bio_intro: introduction/bio text (required)
 *   - availability_text: availability description
 *   - hourly_rate: hourly rate in USD
 *   - gpa: tutor's GPA
 *   - year: academic year (e.g., "Senior")
 *   - major: tutor's major
 *   - profile_image_url: URL to profile image
 *   - profile_image_data: base64-encoded profile picture (max 5MB)
 */
router.post("/", async (req, res) => {
  const {
    tutor_id,
    course_code,
    bio_intro,
    availability_text,
    hourly_rate,
    gpa,
    year,
    major,
    profile_image_url,
    profile_image_data,
  } = req.body || {};

  // Validate required fields
  if (!tutor_id || !course_code || !bio_intro) {
    return res.status(400).json({
      error:
        "Missing required fields: tutor_id, course_code, and bio_intro are required",
    });
  }

  // Validate profile image if provided
  if (profile_image_data) {
    // Check if it's a valid base64 data URL
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const dataUrlMatch = profile_image_data.match(/^data:(image\/\w+);base64,/);

    if (!dataUrlMatch) {
      return res.status(400).json({
        error: "Invalid image format. Please upload a valid image file.",
      });
    }

    const mimeType = dataUrlMatch[1];
    if (!validImageTypes.includes(mimeType)) {
      return res.status(400).json({
        error: "Invalid image type. Supported formats: JPEG, PNG, GIF, WebP",
      });
    }

    // Check image size (base64 is ~33% larger than original)
    // 5MB limit = ~6.67MB base64
    const base64Data = profile_image_data.split(",")[1] || "";
    const sizeInBytes = (base64Data.length * 3) / 4;
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (sizeInBytes > maxSize) {
      return res.status(400).json({
        error: "Image size exceeds 5MB limit. Please upload a smaller image.",
      });
    }
  }

  try {
    // Verify the user exists
    const user = await db("user_account").where({ user_id: tutor_id }).first();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify the course exists
    const course = await db("course").where({ course_code }).first();
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if user already has a post for this course
    const existingPost = await db("tutor_post")
      .where({ tutor_id, course_code })
      .first();
    if (existingPost) {
      return res.status(409).json({
        error: "You already have a tutor post for this course",
      });
    }

    // Insert the new tutor post (is_live defaults to false)
    const [post_id] = await db("tutor_post").insert({
      tutor_id,
      course_code,
      bio_intro,
      availability_text: availability_text || null,
      hourly_rate: hourly_rate || null,
      gpa: gpa || null,
      year: year || null,
      major: major || null,
      profile_image_url: profile_image_url || null,
      profile_image_data: profile_image_data || null,
      is_live: false, // Requires manual approval
    });

    return res.status(201).json({
      post_id,
      tutor_id,
      course_code,
      is_live: false,
      message: "Tutor post created successfully. Pending approval.",
    });
  } catch (e) {
    console.error("Create tutor post error:", e);
    return res.status(500).json({
      error: "Failed to create tutor post",
      message: e.message,
    });
  }
});

export default router;
