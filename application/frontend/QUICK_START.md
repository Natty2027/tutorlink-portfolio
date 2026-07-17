# Quick Start Guide

## For Team Members

This is a **Next.js full-stack application** with integrated backend (BFF pattern). Everything you need is in this directory.

### First Time Setup

1. **Install Dependencies**

   ```bash
   cd application/about-team
   npm install
   ```

2. **Configure Environment**

   Create `.env.local` file:

   ```bash
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_username
   DB_PASS=your_password
   DB_NAME=tutoring_db
   NODE_ENV=development
   ```

3. **Set Up Database**

   Make sure MySQL is running, then:

   ```bash
   # Create database first in MySQL:
   # CREATE DATABASE tutoring_db;

   npm run migrate    # Run migrations
   npm run seed       # Seed initial data
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

   Access the app at: http://localhost:3000

### Common Commands

```bash
# Development
npm run dev                 # Start dev server (port 3000)

# Building
npm run build              # Build for production
npm start                  # Start production server

# Database
npm run migrate            # Run new migrations
npm run migrate:rollback   # Rollback last migration
npm run seed               # Seed database
npm run db:setup           # Run migrations + seeds

# Code Quality
npm run lint               # Run ESLint
```

### Project Structure Overview

```
application/about-team/
├── src/
│   ├── app/
│   │   ├── api/              # 🔥 Backend API routes
│   │   │   ├── health/       # Health check
│   │   │   ├── courses/      # Course search
│   │   │   ├── tutor-posts/  # Tutor listings
│   │   │   ├── requests/     # Tutoring requests
│   │   │   └── tutor-applications/
│   │   ├── page.js           # Home page
│   │   └── member/[id]/      # Team member pages
│   ├── components/           # React components
│   ├── data/                 # Static data
│   └── lib/
│       └── db.js             # 🔥 Database connection
├── server/
│   ├── migrations/           # 🔥 Database migrations
│   └── seeds/                # 🔥 Database seeds
├── public/                   # Static assets
├── knexfile.js              # 🔥 Database config
└── package.json             # All dependencies

🔥 = Backend/Database related
```

### API Endpoints

All accessible at `http://localhost:3000/api/*`

- `GET /api/health` - Health check
- `GET /api/courses?query=CSC` - Search courses
- `GET /api/tutor-posts?course=CSC&name=John` - Get tutor posts
- `POST /api/requests` - Create tutoring request
- `POST /api/tutor-applications` - Submit tutor application

### Making Changes

#### Adding a New API Route

1. Create `src/app/api/your-route/route.js`
2. Export `GET`, `POST`, `PUT`, or `DELETE` functions
3. Use `db` from `src/lib/db.js` for database queries

Example:

```javascript
import db from "../../../lib/db.js";

export async function GET(request) {
  const data = await db("your_table").select("*");
  return Response.json(data);
}
```

#### Creating a New Migration

```bash
npx knex migrate:make your_migration_name --knexfile knexfile.js
```

Edit the generated file in `server/migrations/`

#### Creating Frontend Pages

Add files in `src/app/`:

- `page.js` - Regular page
- `[id]/page.js` - Dynamic route
- `layout.js` - Layout wrapper

### Troubleshooting

**Port 3000 already in use?**

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

**Database connection error?**

- Check MySQL is running: `mysql.server status`
- Verify `.env.local` credentials
- Ensure database exists: `CREATE DATABASE tutoring_db;`

**Migration errors?**

```bash
# Rollback and try again
npm run migrate:rollback
npm run migrate
```

**Module not found errors?**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Testing Your Changes

1. **Test API endpoints**:

   ```bash
   curl http://localhost:3000/api/health
   curl http://localhost:3000/api/courses?query=CSC
   ```

2. **Test in browser**:
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api/health

### Before Committing

1. Test your changes locally
2. Run linter: `npm run lint`
3. Test API endpoints still work
4. Update documentation if needed

### Deployment to EC2

See `SERVER_README.md` for detailed deployment instructions.

Quick version:

```bash
# On EC2
cd application/about-team
npm install
npm run db:setup
npm run build
npm start
```

### Need Help?

- **Full Documentation**: See `SERVER_README.md`
- **Migration Info**: See `MIGRATION_NOTES.md`
- **Architecture Overview**: See `application/README.md`

### What Changed from Separate Server?

If you're looking for the old Express server files:

- ❌ `/server/index.js` - Removed (replaced by Next.js)
- ❌ `/server/routes/` - Removed (replaced by `src/app/api/`)
- ✅ Database migrations & seeds - Moved to `application/about-team/server/`
- ✅ All dependencies - Merged into one `package.json`

The backend is now integrated into the Next.js app using the **BFF (Backend For Frontend)** pattern.
