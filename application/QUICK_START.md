# Quick Start Guide - BFF Architecture

This guide will help you get the TutorLink application running with the Backend For Frontend (BFF) architecture.

## Architecture Overview

```
┌─────────────────┐
│   Browser       │
│  (User)         │
└────────┬────────┘
         │
         ↓ HTTP Request
┌─────────────────────────┐
│   Frontend (Next.js)    │
│   Port: 3000            │
│                         │
│   ┌─────────────────┐   │
│   │  UI Components  │   │
│   └────────┬────────┘   │
│            │            │
│   ┌────────↓────────┐   │
│   │  BFF API Layer  │───┼──→ Proxies to Backend
│   │  /api/courses   │   │
│   │  /api/health    │   │
│   └─────────────────┘   │
└─────────────────────────┘
         │
         ↓ Internal HTTP Call
┌─────────────────────────┐
│   Backend (Express)     │
│   Port: 3001            │
│                         │
│   ┌─────────────────┐   │
│   │  API Routes     │   │
│   └────────┬────────┘   │
│            │            │
│   ┌────────↓────────┐   │
│   │  Database       │   │
│   │  (MySQL)        │   │
│   └─────────────────┘   │
└─────────────────────────┘
```

## Prerequisites

✅ Node.js 18 or higher  
✅ MySQL 8.0 or higher  
✅ MySQL Workbench (or MySQL CLI)  
✅ npm or yarn  

## Step-by-Step Setup

### 1. Set Up Database

Open MySQL Workbench and create the database:

```sql
CREATE DATABASE tutoring_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Set Up Backend

```bash
# Navigate to backend folder
cd application/backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASS=your_password
DB_NAME=tutoring_db
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
EOF

# Edit .env with your actual database credentials
nano .env  # or use your preferred editor

# Run database migrations and seeds
npm run db:setup

# Start backend server
npm run dev
```

**Expected output:**
```
✅ Backend API listening on http://localhost:3001
```

### 3. Set Up Frontend

**Open a new terminal window** (keep backend running), then:

```bash
# Navigate to frontend folder
cd application/frontend

# Install dependencies
npm install

# Create .env.local file
echo "BACKEND_URL=http://localhost:3001" > .env.local

# Start frontend server
npm run dev
```

**Expected output:**
```
  ▲ Next.js 15.5.3
  - Local:        http://localhost:3000
  - Ready in XXXms
```

### 4. Test the Application

Open your browser and test these URLs:

#### Frontend
- **Home Page**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health
- **Courses API**: http://localhost:3000/api/courses

#### Backend (Direct Access)
- **Root**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health
- **Courses API**: http://localhost:3001/api/courses

## Verification Checklist

✅ Backend is running on port 3001  
✅ Frontend is running on port 3000  
✅ Health check returns `{"status":"ok","db":"connected"}`  
✅ Courses API returns array of courses  
✅ No CORS errors in browser console  

## Common Issues & Solutions

### Issue: "Port 3001 already in use"

```bash
# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Restart backend
cd application/backend && npm run dev
```

### Issue: "Unknown database 'tutoring_db'"

```sql
-- In MySQL Workbench, run:
CREATE DATABASE tutoring_db;
```

Then run migrations:
```bash
cd application/backend
npm run migrate
npm run seed
```

### Issue: "Failed to connect to backend"

1. Verify backend is running:
   ```bash
   curl http://localhost:3001/api/health
   ```

2. Check `frontend/.env.local` has:
   ```
   BACKEND_URL=http://localhost:3001
   ```

3. Restart frontend:
   ```bash
   cd application/frontend
   npm run dev
   ```

### Issue: Database connection error

1. Verify MySQL is running:
   ```bash
   mysql.server status
   ```

2. Test database credentials:
   ```bash
   mysql -u your_username -p
   # Enter password when prompted
   # Then try: USE tutoring_db;
   ```

3. Check `backend/.env` has correct credentials

## Understanding the Flow

### Example: Fetching Courses

1. **Browser** makes request:
   ```javascript
   fetch('/api/courses?query=CSC')
   ```

2. **Frontend BFF** receives request at `frontend/src/app/api/courses/route.js`:
   ```javascript
   export async function GET(request) {
     const backendUrl = process.env.BACKEND_URL;
     const response = await fetch(`${backendUrl}/api/courses?query=CSC`);
     return Response.json(await response.json());
   }
   ```

3. **Backend** receives request at `backend/src/routes/courses.js`:
   ```javascript
   router.get("/", async (req, res) => {
     const q = req.query.query;
     const rows = await db('course')
       .where('course_code', 'like', `%${q}%`)
       .select('*');
     res.json(rows);
   });
   ```

4. **Database** returns results to Backend

5. **Backend** sends JSON to Frontend BFF

6. **Frontend BFF** sends JSON to Browser

## Development Workflow

### Making Changes to Backend

1. Edit files in `backend/src/`
2. Backend auto-reloads (using nodemon or manually restart)
3. Test at `http://localhost:3001/api/...`

### Making Changes to Frontend

1. Edit files in `frontend/src/`
2. Frontend auto-reloads (Next.js Fast Refresh)
3. Test at `http://localhost:3000`

### Adding New API Endpoint

1. **Create backend route**: `backend/src/routes/newRoute.js`
2. **Register in backend**: Add to `backend/src/index.js`
3. **Create frontend BFF**: `frontend/src/app/api/new-route/route.js`
4. **Use in component**: `fetch('/api/new-route')`

## Project Structure Reference

```
application/
├── backend/              # Express API (Port 3001)
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── db/          # Database config & migrations
│   │   └── index.js     # Express server
│   └── package.json
│
├── frontend/            # Next.js App (Port 3000)
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/    # BFF layer (proxies to backend)
│   │   │   └── page.js # UI pages
│   │   └── components/ # React components
│   └── package.json
│
└── README.md           # Main documentation
```

## Next Steps

- Read `application/README.md` for detailed documentation
- Explore `backend/README.md` for backend API details
- Check `frontend/README.md` for frontend development guide

## Need Help?

- Check the main README: `application/README.md`
- Review API documentation in `backend/README.md`
- Test endpoints using curl or Postman
- Check browser console for frontend errors
- Check terminal output for backend errors

Happy coding! 🚀

