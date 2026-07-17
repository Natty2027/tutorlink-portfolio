# Migration from Separate Server to Next.js BFF

## What Changed?

### Before (Separate Server Architecture)

```
project-root/
├── application/about-team/     # Next.js frontend only
│   └── package.json            # Frontend dependencies
└── server/                     # Separate Express backend
    ├── index.js                # Express server
    ├── routes/                 # Express route handlers
    ├── migrations/             # Database migrations
    └── package.json            # Backend dependencies
```

### After (Next.js BFF Architecture)

```
project-root/
└── application/about-team/     # Unified Next.js full-stack app
    ├── src/
    │   ├── app/api/            # Next.js API routes (replaces Express)
    │   └── lib/db.js           # Database connection
    ├── server/                 # Database layer only
    │   ├── migrations/         # Database migrations
    │   └── seeds/              # Database seeds
    ├── knexfile.js             # Knex configuration
    └── package.json            # All dependencies unified
```

## Key Changes

### 1. Express Routes → Next.js API Routes

**Before (Express):**

```javascript
// server/routes/courses.js
import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
  const q = req.query.query;
  // ... logic
  res.json(rows);
});

export default router;
```

**After (Next.js):**

```javascript
// src/app/api/courses/route.js
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("query");
  // ... logic
  return Response.json(rows);
}
```

### 2. Database Connection

**Before:**

```javascript
// server/db.js (used only by Express)
import knex from "knex";
import config from "./knexfile.js";
const db = knex(config[env]);
```

**After:**

```javascript
// src/lib/db.js (shared across app)
import knex from "knex";
import config from "../../knexfile.js";
const db = knex(config[env]);
```

### 3. Package.json Scripts

**Before:**

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:next\" \"npm run dev:server\"",
    "dev:next": "next dev",
    "dev:server": "cd server && npm run dev"
  }
}
```

**After:**

```json
{
  "scripts": {
    "dev": "next dev",
    "migrate": "knex migrate:latest",
    "seed": "knex seed:run"
  }
}
```

### 4. Dependencies

Merged backend dependencies into main package.json:

- `express` → Removed (using Next.js API routes)
- `cors` → Removed (no longer needed)
- `knex` → Kept (database ORM)
- `mysql2` → Kept (database driver)
- `dotenv` → Kept (environment variables)

### 5. CORS Configuration

**Before:**

```javascript
// Needed CORS since frontend and backend were separate
app.use(cors({ origin: ["http://localhost:3000"] }));
```

**After:**

```javascript
// No CORS needed! Frontend and backend on same origin
// API routes at /api/* automatically available to frontend
```

## Benefits of Migration

1. **Simpler Deployment**:

   - Only one application to deploy
   - Single `npm install` and `npm start`

2. **No CORS Issues**:

   - Frontend can call `/api/*` directly
   - No need for CORS configuration

3. **Better Performance**:

   - API routes run in same Node.js process
   - No network overhead between frontend and backend

4. **Easier Development**:

   - Single dev server (`npm run dev`)
   - Unified dependency management
   - Better integration between frontend and backend

5. **AWS EC2 Ready**:
   - Single port to expose (3000)
   - Simpler nginx/reverse proxy configuration
   - Single PM2 process to manage

## Migration Steps Performed

1. ✅ Copied `server/` folder into `application/about-team/`
2. ✅ Created Next.js API routes to replace Express routes
3. ✅ Created `src/lib/db.js` for database connection
4. ✅ Moved `knexfile.js` to project root
5. ✅ Merged dependencies from server's `package.json`
6. ✅ Updated npm scripts for database management
7. ✅ Removed old `server/` folder from root
8. ✅ Updated documentation

## What Stays in server/ Folder?

The `server/` folder now contains only database-related files:

- `migrations/` - Database schema migrations
- `seeds/` - Database seed data

The old Express server files (`index.js`, `routes/`) are no longer needed as they've been replaced by Next.js API routes.

## Environment Variables

Create `.env.local` in `application/about-team/`:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=tutoring_db
NODE_ENV=development
```

## Testing the Migration

1. Install dependencies:

   ```bash
   cd application/about-team
   npm install
   ```

2. Set up database:

   ```bash
   npm run migrate
   npm run seed
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

4. Test API endpoints:
   - http://localhost:3000/api/health
   - http://localhost:3000/api/courses
   - http://localhost:3000/api/tutor-posts

## Rollback (if needed)

If you need to rollback to the old structure:

1. The old server code is still in git history
2. Checkout the commit before this migration
3. Run `git checkout HEAD~1 server/`

## Questions?

If you have questions about the migration or the new structure, refer to:

- `SERVER_README.md` - Comprehensive documentation
- `application/README.md` - Overview of the application structure
- Next.js API Routes docs: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
