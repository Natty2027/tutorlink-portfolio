/**
 * File: src/routes/requests.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: API endpoints for tutoring requests (messages) between students and tutors.
 * Notes:
 *  - POST creates a new tutoring request/message
 *  - GET /my-messages returns all messages for a specific tutor
 */

import { Router } from "express";
import db from "../db/knex.js";

const router = Router();

/**
 * GET /api/requests/my-messages?user_id=X
 * Returns all tutoring requests/messages sent TO a specific tutor
 * Includes requester info and course details
 */
router.get("/my-messages", async (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    const messages = await db("tutoring_request as r")
      .join("user_account as sender", "sender.user_id", "r.requester_user_id")
      .join("course as c", "c.course_code", "r.course_code")
      .join("tutor_post as p", "p.post_id", "r.post_id")
      .where("r.tutor_id", userId)
      .select(
        "r.request_id",
        "r.message",
        "r.student_contact",
        "r.created_at",
        "r.course_code",
        "c.course_name",
        "sender.user_id as sender_id",
        "sender.name_first as sender_first_name",
        "sender.name_last as sender_last_name",
        "sender.email as sender_email"
      )
      .orderBy("r.created_at", "desc");

    return res.json(messages);
  } catch (e) {
    console.error("Get messages error:", e);
    return res.status(500).json({
      error: "Failed to fetch messages",
      message: e.message,
    });
  }
});

/**
 * POST /api/requests
 * Create a new tutoring request/message
 * Body:
 *   - requester_user_id: ID of the user sending the message
 *   - tutor_id: ID of the tutor receiving the message
 *   - post_id: ID of the tutor post this is related to
 *   - course_code: course code for the tutoring
 *   - student_contact: contact info (email or phone)
 *   - message: the actual message text
 */
router.post("/", async (req, res) => {
  const {
    requester_user_id,
    tutor_id,
    post_id,
    course_code,
    student_contact,
    message,
  } = req.body || {};

  // Debug: log what we received
  console.log("Request body received:", req.body);

  // Validate required fields with specific error messages
  const missingFields = [];
  if (!requester_user_id) missingFields.push("requester_user_id");
  if (!tutor_id) missingFields.push("tutor_id");
  if (!post_id) missingFields.push("post_id");
  if (!course_code) missingFields.push("course_code");
  if (!student_contact) missingFields.push("student_contact");

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(", ")}`,
      received: {
        requester_user_id,
        tutor_id,
        post_id,
        course_code,
        student_contact: !!student_contact,
      },
    });
  }

  // Prevent users from messaging themselves
  if (requester_user_id === tutor_id) {
    return res
      .status(400)
      .json({ error: "You cannot send a message to yourself" });
  }

  try {
    // Verify the tutor post exists and belongs to the tutor
    const post = await db("tutor_post").where({ post_id, tutor_id }).first();

    if (!post) {
      return res.status(404).json({ error: "Tutor post not found" });
    }

    const [request_id] = await db("tutoring_request").insert({
      requester_user_id,
      tutor_id,
      post_id,
      course_code,
      student_contact,
      message: message || null,
    });

    return res.status(201).json({
      request_id,
      message: "Message sent successfully",
    });
  } catch (e) {
    console.error("Create request error:", e);
    return res.status(500).json({
      error: "Failed to send message",
      message: e.message,
    });
  }
});

export default router;
