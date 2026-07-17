# TutorLink - Next.js BFF Architecture

This project follows the **Backend For Frontend (BFF)** pattern, where the backend API is integrated directly into the Next.js application.

## Project Structure

```
application/about-team/
├── src/
│   ├── app/
│   │   ├── api/                    # Next.js API Routes (BFF)
│   │   │   ├── health/
│   │   │   │   └── route.js        # Health check endpoint
│   │   │   ├── courses/
│   │   │   │   └── route.js        # Course search API
│   │   │   ├── tutor-posts/
│   │   │   │   └── route.js        # Tutor post listings
│   │   │   ├── requests/
│   │   │   │   └── route.js        # Tutoring requests
│   │   │   └── tutor-applications/
│   │   │       └── route.js        # Tutor applications
│   │   ├── member/                 # Team member pages
│   │   └── page.js                 # Home page
│   ├── lib/
│   │   └── db.js                   # Database connection (Knex)
│   └── components/                 # React components
├── server/                         # Database layer
│   ├── migrations/                 # Knex migrations
│   └── seeds/                      # Database seed data
├── knexfile.js                     # Knex configuration
└── package.json                    # Unified dependencies
```

## Key Features

- **Unified Codebase**: Frontend and backend in one Next.js project
- **Next.js API Routes**: Replaces Express.js with native Next.js handlers
- **Database Integration**: Knex.js ORM with MySQL
- **Single Deployment**: Deploy as one application to EC2

## Environment Variables

Create a `.env.local` file in the root of this directory:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=tutoring_db

# Node Environment
NODE_ENV=development
```

## Available Scripts

### Development

```bash
npm run dev          # Start Next.js development server (port 3000)
```

### Database Management

```bash
npm run migrate      # Run database migrations
npm run migrate:rollback  # Rollback last migration
npm run seed         # Seed database with initial data
npm run db:setup     # Run migrations and seeds
```

### Production

```bash
npm run build        # Build for production
npm start            # Start production server
```

## API Endpoints

All API endpoints are available at `/api/*`:

### GET `/api/health`

Health check with database connectivity test

### GET `/api/courses?query=CSC`

Search for courses by code, department, or name

### GET `/api/tutor-posts?course=CSC%20648&name=elena`

Get tutor posts filtered by course and/or tutor name

### POST `/api/requests`

Create a new tutoring request

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

### POST `/api/tutor-applications`

Submit a tutor application

```json
{
  "applicant_user_id": 1,
  "courses_applied": "CSC 648, CSC 642",
  "gpa": 3.8,
  "experience_text": "I have 2 years of tutoring experience"
}
```

## Database Setup

1. Install MySQL (if not already installed)
2. Create a database: `CREATE DATABASE tutoring_db;`
3. Configure `.env.local` with your database credentials
4. Run migrations and seeds:
   ```bash
   npm run db:setup
   ```

## Deployment to AWS EC2

1. **Install Node.js** on EC2:

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Install MySQL** on EC2:

   ```bash
   sudo apt-get install mysql-server
   ```

3. **Clone repository** and navigate to this directory:

   ```bash
   cd application/about-team
   ```

4. **Install dependencies**:

   ```bash
   npm install
   ```

5. **Set up environment variables**:

   ```bash
   nano .env.local
   # Add your production database credentials
   ```

6. **Run database setup**:

   ```bash
   npm run db:setup
   ```

7. **Build and start**:

   ```bash
   npm run build
   npm start
   ```

8. **Configure as a service** (optional, using PM2):
   ```bash
   sudo npm install -g pm2
   pm2 start npm --name "tutorlink" -- start
   pm2 save
   pm2 startup
   ```

## Why BFF Pattern?

The Backend For Frontend pattern offers several advantages:

1. **Single Deployment**: One application to build and deploy
2. **Type Safety**: Share types between frontend and backend (if using TypeScript)
3. **Simplified Development**: No CORS issues, unified tooling
4. **Performance**: API routes run in the same process as the frontend
5. **Better DX**: Easier to develop and maintain

## Migration from Separate Server

This project was migrated from a separate Express.js server to Next.js API routes:

- ✅ Express routes → Next.js API route handlers
- ✅ Middleware → Per-route logic in API handlers
- ✅ Database connection → Shared through `src/lib/db.js`
- ✅ Migrations & seeds → Kept in `server/` directory
- ✅ Dependencies → Merged into main `package.json`

## Team Members

See the main application for team member information.
