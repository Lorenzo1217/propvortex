# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PropVortex is a premium construction project management platform for residential home builders. It's a Next.js 15 application with TypeScript, using Clerk for authentication, Prisma with PostgreSQL for the database, and Cloudinary for image management.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (includes Prisma generation and DB push)
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Database operations
npx prisma generate    # Generate Prisma client
npx prisma db push     # Push schema changes to database
npx prisma studio      # Open Prisma Studio GUI
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Authentication**: Clerk (with middleware protection)
- **Database**: PostgreSQL via Prisma ORM (hosted on Neon)
- **Styling**: Tailwind CSS v4 with PostCSS
- **UI Components**: Custom components built on Radix UI primitives
- **Rich Text**: TipTap editor
- **File Storage**: Cloudinary for image uploads
- **Forms**: React Hook Form with Zod validation

### Directory Structure
- `src/app/` - Next.js App Router pages and API routes
  - `(auth)/` - Authentication pages (login, signup)
  - `(dashboard)/` - Protected dashboard routes
  - `api/` - API endpoints (upload, webhooks)
- `src/components/` - React components
  - `ui/` - Reusable UI primitives based on Radix UI
  - `report-sections/` - Report-specific components
- `src/lib/` - Utilities and server-side code
  - `actions/` - Server actions for data mutations
  - `services/` - External service integrations
- `prisma/` - Database schema and migrations

### Key Patterns

1. **Authentication Flow**: 
   - Clerk middleware protects routes automatically
   - User sync via webhook at `/api/webhooks/clerk`
   - Helper functions in `src/lib/user-helpers.ts`

2. **Database Access**:
   - Prisma client singleton in `src/lib/db.ts`
   - Server actions in `src/lib/actions/` for data mutations
   - JSON fields for flexible report data structure

3. **Image Handling**:
   - Upload endpoint at `/api/upload/route.ts`
   - Cloudinary integration for storage
   - Photo model tracks metadata and associations

4. **Report System**:
   - Reports contain structured JSON data for flexibility
   - Weekly reports with work items, issues, budget, and client actions
   - Weather data integration via external API

5. **Component Architecture**:
   - UI components follow compound component pattern
   - Form components integrated with React Hook Form
   - Consistent use of Radix UI for accessibility

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `CLERK_*` - Clerk authentication keys
- `CLOUDINARY_*` - Cloudinary API credentials
- `WEATHERAPI_KEY` - Weather API key (optional)

### Next.js 15 Specific Considerations
- All route params are async and must be awaited
- Server components by default
- Form actions use server actions pattern
- ESLint errors are ignored during builds (see next.config.ts)