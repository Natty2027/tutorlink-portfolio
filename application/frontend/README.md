# TutorLink Frontend

Next.js frontend application with BFF (Backend For Frontend) API layer.

## Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/              # BFF Layer - Proxies requests to backend
│   │   │   ├── health/
│   │   │   ├── courses/
│   │   │   ├── tutor-posts/
│   │   │   ├── requests/
│   │   │   └── tutor-applications/
│   │   ├── member/[id]/      # Team member pages
│   │   ├── page.js           # Home page
│   │   ├── layout.js         # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/           # Reusable React components
│   │   └── TeamCard.js
│   └── data/                 # Static data
│       └── teamData.js
├── public/                   # Static assets
├── next.config.mjs          # Next.js configuration
└── package.json
```

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   
   Create `.env.local`:
   ```bash
   BACKEND_URL=http://localhost:3001
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Runs on: http://localhost:3000

## BFF Layer

The API routes in `src/app/api/` act as a Backend For Frontend layer. They:

- Receive requests from the browser
- Forward them to the backend Express API
- Return the response

### Example BFF Route

```javascript
// src/app/api/courses/route.js
export async function GET(request) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
  const response = await fetch(`${backendUrl}/api/courses`);
  const data = await response.json();
  return Response.json(data);
}
```

## Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Using the API in Components

```javascript
// Example: Fetching courses in a component
export default async function CoursesPage() {
  const response = await fetch('/api/courses?query=CSC');
  const courses = await response.json();
  
  return (
    <div>
      {courses.map(course => (
        <div key={course.course_code}>{course.course_name}</div>
      ))}
    </div>
  );
}
```

## Environment Variables

### Development (.env.local)
```bash
BACKEND_URL=http://localhost:3001
```

### Production (.env.production)
```bash
BACKEND_URL=https://your-backend-domain.com
```

## Building for Production

```bash
npm run build
npm run start
```

## Deployment

See the main application README for deployment instructions.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **Radix UI** - Accessible UI components
- **Lucide React** - Icons

## Next.js Configuration

The `next.config.mjs` includes webpack configuration to ignore optional Knex database drivers that we don't use (since the backend handles all database operations).
