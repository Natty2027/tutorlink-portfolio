# TutorLink Application - BFF Architecture

This application follows the **Backend For Frontend (BFF)** pattern with separate frontend and backend services.

## Project Structure

```
application/
├── frontend/                      # Next.js Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/              # BFF Layer - Next.js API Routes
│   │   │   │   ├── health/       # Proxies to backend /api/health
│   │   │   │   ├── courses/      # Proxies to backend /api/courses
│   │   │   │   ├── tutor-posts/  # Proxies to backend /api/tutor-posts
│   │   │   │   ├── requests/     # Proxies to backend /api/requests
│   │   │   │   └── tutor-applications/
│   │   │   ├── member/[id]/      # Team member pages
│   │   │   └── page.js           # Home page
│   │   └── components/           # React components
│   ├── package.json
│   └── next.config.mjs
│
├── backend/                       # Express.js API Server
│   ├── src/
│   │   ├── routes/               # Express route handlers
│   │   │   ├── courses.js
│   │   │   ├── tutorPosts.js
│   │   │   ├── requests.js
│   │   │   └── tutorApplications.js
│   │   ├── db/
│   │   │   ├── knex.js           # Database connection
│   │   │   ├── migrations/       # Database schema migrations
│   │   │   └── seeds/            # Database seed data
│   │   └── index.js              # Express server entry point
│   ├── knexfile.js               # Knex configuration
│   └── package.json
│
└── README.md                      # This file
```

## What is BFF (Backend For Frontend)?

The BFF pattern separates concerns:

- **Frontend (Next.js)**: Handles UI rendering and has API routes that act as a middle layer
- **Backend (Express)**: Handles business logic, database operations, and data management

The Next.js API routes (`frontend/src/app/api/*`) act as a **proxy layer** that:

1. Receives requests from the frontend UI
2. Forwards them to the backend Express API
3. Returns the response to the frontend

### Benefits

1. **Separation of Concerns**: Frontend and backend can be developed independently
2. **Scalability**: Frontend and backend can be scaled separately
3. **Security**: Database credentials only in backend, not exposed to browser
4. **Flexibility**: Can easily swap out backend or add multiple backends
5. **Team Organization**: Frontend and backend teams can work independently

## Quick Start

### Prerequisites

- Node.js 18 or higher
- MySQL 8.0 or higher
- npm or yarn

### 1. Set Up Backend

```bash
cd application/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run migrations and seeds
npm run db:setup

# Start backend server (runs on port 3001)
npm run dev
```

### 2. Set Up Frontend

```bash
cd application/frontend

# Install dependencies
npm install

# Create .env.local file
echo "BACKEND_URL=http://localhost:3001" > .env.local

# Start frontend server (runs on port 3000)
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3000/api/health

## Environment Variables

### Backend (.env)

```bash
# Server Port
PORT=3001

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=tutoring_db

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

### Frontend (.env.local)

```bash
# Backend API URL
BACKEND_URL=http://localhost:3001
```

## Available Scripts

### Backend

```bash
npm run dev              # Start development server (port 3001)
npm run start            # Start production server
npm run migrate          # Run database migrations
npm run migrate:rollback # Rollback last migration
npm run seed             # Seed database with initial data
npm run db:setup         # Run migrations + seeds
```

### Frontend

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## API Endpoints

All endpoints are available through the frontend BFF layer at `http://localhost:3000/api/*`

### GET /api/health

Health check with database connectivity test

**Response:**

```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2025-11-05T..."
}
```

### GET /api/courses?query=CSC

Search for courses by code, department, or name

**Query Parameters:**

- `query` (optional): Search term

**Response:**

```json
[
  {
    "course_code": "CSC 648",
    "course_name": "Software Engineering",
    "department": "Computer Science",
    "course_number": "648"
  }
]
```

### GET /api/tutor-posts?course=CSC&name=John

Get tutor posts filtered by course and/or tutor name

**Query Parameters:**

- `course` (optional): Course code filter
- `name` (optional): Tutor name filter

### POST /api/requests

Create a new tutoring request

**Body:**

```json
{
  "requester_user_id": 1,
  "tutor_id": 2,
  "post_id": 1,
  "course_code": "CSC 648",
  "student_contact": "student@sfsu.edu",
  "message": "Need help with project"
}
```

### POST /api/tutor-applications

Submit a tutor application

**Body:**

```json
{
  "applicant_user_id": 1,
  "courses_applied": "CSC 648, CSC 642",
  "gpa": 3.8,
  "experience_text": "I have 2 years of tutoring experience"
}
```

## Development Workflow

### Adding a New API Endpoint

1. **Create Backend Route** (`backend/src/routes/yourRoute.js`):

```javascript
import { Router } from "express";
import db from "../db/knex.js";

const router = Router();

router.get("/", async (req, res) => {
  // Your logic here
  res.json({ data: "your data" });
});

export default router;
```

2. **Register Route in Backend** (`backend/src/index.js`):

```javascript
import yourRoute from "./routes/yourRoute.js";
app.use("/api/your-route", yourRoute);
```

3. **Create Frontend BFF Proxy** (`frontend/src/app/api/your-route/route.js`):

```javascript
export async function GET(request) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
  const response = await fetch(`${backendUrl}/api/your-route`);
  const data = await response.json();
  return Response.json(data);
}
```

4. **Use in Frontend** (from any component/page):

```javascript
const response = await fetch("/api/your-route");
const data = await response.json();
```

## Deployment to AWS EC2

### Backend Deployment

```bash
# On EC2
cd application/backend
npm install
npm run db:setup
npm run build  # if you add a build step
npm start
```

### Frontend Deployment

```bash
# On EC2
cd application/frontend
npm install
npm run build
npm start
```

### Using PM2 (Process Manager)

```bash
# Install PM2
sudo npm install -g pm2

# Start backend
cd application/backend
pm2 start npm --name "tutorlink-backend" -- start

# Start frontend
cd application/frontend
pm2 start npm --name "tutorlink-frontend" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### Nginx Configuration (Optional)

```nginx
# Frontend (port 3000) - Main domain
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend (port 3001) - API subdomain (optional)
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

## Troubleshooting

### Frontend can't reach backend

**Error**: "Failed to connect to backend"

**Solution**:

1. Ensure backend is running: `cd backend && npm run dev`
2. Check `BACKEND_URL` in `frontend/.env.local`
3. Verify CORS settings in `backend/src/index.js`

### Database connection errors

**Solution**:

1. Ensure MySQL is running
2. Verify credentials in `backend/.env`
3. Test connection: `cd backend && npm run migrate`

### Port already in use

**Solution**:

```bash
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9
```

## Team

See the frontend application for team member information at http://localhost:3000

## License

This project is for educational purposes as part of CSC 648 - Software Engineering course at San Francisco State University.
