/**
 * File: src/index.js
 * Team: CSC648-FA25-03-TEAM01
 * Purpose: Express server entry point for TutorLink backend.
 * Notes:
 *  - Loads environment variables
 *  - Configures CORS so frontend → backend works locally and in production
 *  - Mounts all API routes (auth, courses, tutor posts, requests, VP search)
 *  - Provides DB health check endpoint
 */

import "dotenv/config";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import db from "./db/knex.js";

dotenv.config();

// ------------------------
// Route Imports
// ------------------------
import courses from "./routes/courses.js";
import tutorPosts from "./routes/tutorPosts.js";
import requests from "./routes/requests.js";
import vpSearch from "./routes/vpSearch.js";
import authRoutes from "./routes/auth.js";

// ------------------------
// App Setup
// ------------------------
const app = express();
const port = process.env.PORT || 3001;

// ------------------------
// CORS Configuration
// ------------------------
// Allows the frontend (Next.js) to call the backend API.
// Uses FRONTEND_URL in production and localhost during dev.
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Local frontend dev server
      process.env.FRONTEND_URL, // Production frontend domain
    ].filter(Boolean),
    credentials: true,
  })
);

// Enable JSON parsing for incoming requests
// Increased limit to 10MB to support base64 profile image uploads
app.use(express.json({ limit: "10mb" }));

// ------------------------
// Health Check Endpoint
// ------------------------
app.get("/api/health", async (req, res) => {
  try {
    await db.raw("SELECT 1");
    return res.json({ status: "ok", db: "connected" });
  } catch (e) {
    return res.status(500).json({ status: "error", message: e.message });
  }
});

// Simple root route
app.get("/", (req, res) => {
  res.json({ message: "TutorLink Backend API", version: "1.0.0" });
});

// ------------------------
// API Routes
// ------------------------
app.use("/api/auth", authRoutes);
app.use("/api/courses", courses);
app.use("/api/tutor-posts", tutorPosts);
app.use("/api/requests", requests);
app.use("/api/vp-search", vpSearch);

// ------------------------
// Start Server
// ------------------------
app.listen(port, () =>
  console.log(`✅ Backend API listening on http://localhost:${port}`)
);
