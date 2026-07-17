# TutorLink Backend API

Express.js backend API with MySQL database using Knex.js ORM.

## Structure

```
backend/
├── src/
│   ├── routes/                 # API route handlers
│   │   ├── courses.js         # Course search endpoints
│   │   ├── tutorPosts.js      # Tutor post endpoints
│   │   ├── requests.js        # Tutoring request endpoints
│   │   └── tutorApplications.js # Application endpoints
│   ├── db/
│   │   ├── knex.js            # Database connection
│   │   ├── migrations/        # Database schema migrations
│   │   │   ├── 001_create_user_account.js
│   │   │   ├── 002_create_course.js
│   │   │   ├── 003_create_tutor_post.js
│   │   │   ├── 004_create_tutoring_request.js
│   │   │   └── 005_create_tutor_application.js
│   │   └── seeds/             # Database seed data
│   │       └── 001_courses.js
│   └── index.js               # Express server entry point
├── knexfile.js                # Knex configuration
└── package.json
```

## Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**

   Create `.env`:

   ```bash
   PORT=3001
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_NAME=tutoring_db
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

3. **Set Up Database**

   Create MySQL database:

   ```sql
   CREATE DATABASE tutoring_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

   Run migrations and seeds:

   ```bash
   npm run db:setup
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

   Runs on: http://localhost:3001

## Available Scripts

```bash
npm run dev              # Start development server
npm run start            # Start production server
npm run migrate          # Run database migrations
npm run migrate:rollback # Rollback last migration
npm run seed             # Seed database with initial data
npm run db:setup         # Run migrations + seeds
```

## API Endpoints

All endpoints use the `/api` prefix.

### GET /api/health

Health check with database connectivity test

**Response:**

```json
{
  "status": "ok",
  "db": "connected"
}
```

### GET /api/courses

Get all courses or search by query

**Query Parameters:**

- `query` (optional): Search by course code, department, or course name

**Example:**

```bash
curl http://localhost:3001/api/courses?query=CSC
```

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

### GET /api/tutor-posts

Get tutor posts filtered by course or tutor name

**Query Parameters:**

- `course` (optional): Filter by course code
- `name` (optional): Filter by tutor name

**Example:**

```bash
curl "http://localhost:3001/api/tutor-posts?course=CSC%20648&name=John"
```

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
  "message": "Need help with my project"
}
```

**Response:**

```json
{
  "request_id": 123
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

**Response:**

```json
{
  "application_id": 456
}
```

## Database Schema

### Tables

1. **user_account** - User information
2. **course** - Available courses
3. **tutor_post** - Tutor availability posts
4. **tutoring_request** - Student requests for tutoring
5. **tutor_application** - Applications to become a tutor

### Creating New Migrations

```bash
npx knex migrate:make your_migration_name --knexfile knexfile.js
```

Edit the generated file in `src/db/migrations/`, then run:

```bash
npm run migrate
```

### Creating New Seeds

```bash
npx knex seed:make your_seed_name --knexfile knexfile.js
```

Edit the generated file in `src/db/seeds/`, then run:

```bash
npm run seed
```

## CORS Configuration

The backend allows requests from:

- `http://localhost:3000` (frontend dev server)
- The URL specified in `FRONTEND_URL` environment variable (production)

To modify CORS settings, edit `src/index.js`:

```javascript
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL].filter(Boolean),
    credentials: true,
  })
);
```

## Tech Stack

- **Express.js 4** - Web framework
- **Knex.js 3** - SQL query builder
- **MySQL2** - MySQL database driver
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

## Testing

Test the backend directly:

```bash
# Health check
curl http://localhost:3001/api/health

# Get courses
curl http://localhost:3001/api/courses

# Search courses
curl http://localhost:3001/api/courses?query=CSC

# Create a request (POST)
curl -X POST http://localhost:3001/api/requests \
  -H "Content-Type: application/json" \
  -d '{"requester_user_id":1,"tutor_id":2,"post_id":1,"course_code":"CSC 648","student_contact":"test@test.com"}'
```

## Deployment

See the main application README for AWS EC2 deployment instructions.

## Troubleshooting

### Database connection errors

1. Check MySQL is running: `mysql.server status`
2. Verify credentials in `.env`
3. Test connection: `npm run migrate`

### Port already in use

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Migration errors

```bash
# Rollback and retry
npm run migrate:rollback
npm run migrate
```
