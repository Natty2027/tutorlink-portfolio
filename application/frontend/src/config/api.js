// Base URL for the backend API (without /api suffix)
// In development: http://localhost:3001
// In production: Your EC2 backend URL (e.g., http://ec2-xx-xx-xx-xx.compute-1.amazonaws.com:3001)
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
