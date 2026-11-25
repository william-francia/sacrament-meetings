# Sacrament Meeting Planner

A Next.js application for viewing, printing, and managing Sunday meeting programs. [Production site](https://sacrament-meetings-two-flax.vercel.app/).

## Features and stack

The public site lists meeting programs, supports server-side search and pagination, shows the current Sunday program, and offers a print view. Administrators can create, edit, and delete meetings through protected Server Actions and accessible forms. Built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Zod, and PostgreSQL on Neon.

## Architecture and routes

`app/(public)` contains the home, meeting list, current meeting redirect, and detail pages. `app/(admin)` contains the protected create and edit screens. `app/api/meetings` exposes read-only JSON routes. `components/MeetingForm.tsx` supplies the shared form; `lib/actions.ts` validates and authorizes mutations; `lib/meetings-db.ts` contains parameterized SQL; `lib/auth.ts` checks the signed admin cookie.

| Route | Purpose |
| --- | --- |
| `/` | Home |
| `/meetings` | Search and pagination |
| `/meetings/current` | Current Sunday program |
| `/meetings/[id]` | Program and print view |
| `/admin/login` | Administrator sign-in |
| `/meetings/new` | Protected creation |
| `/meetings/[id]/edit` | Protected editing |
| `/api/meetings` and `/api/meetings/[id]` | Read-only JSON |

## Local setup

Run `npm ci`, set environment variables in `.env.local`, then run `npm run dev`. Do not commit `.env.local`. The required names are `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` (at least 32 characters). Without all admin values, login and mutations remain unavailable. Use a strong unique password and a separately generated random session secret. Serve production over HTTPS. Configure a dedicated Neon development branch or database before trying any writes locally; this repository does not provision one.

## Database

The existing `public.meetings` table has a positive integer ID, unique `date`, meeting type, presiding and conducting names, hymn JSONB fields, prayer names, announcements TEXT[], and ward business and speaker JSONB arrays. The database type constraint also permits historical `special` values, which are rendered as `general` for the four-type W04 form. The form does not offer `special` for new records. Keep schema and credentials private.

## Validation and errors

Zod validates all submitted fields on the server. API IDs must fit PostgreSQL INTEGER; date filters must be real ISO dates. Duplicate dates and missing records get explicit messages. Each Server Action checks the signed admin session. Error boundaries offer a retry action; the edit route has a not-found page. Deletion requires an additional confirmation.

## Testing

Run `npm run lint`, `npm run build`, and `npx tsc --noEmit`. For mutation tests, use an isolated database and a configured admin account. Do not test writes against the production database.

## Production deployment

Set the four environment variables securely in Vercel, point `DATABASE_URL` to the intended Neon database, and verify admin access and CRUD against a separate Preview database first. Deploy to Production only after validating the write path and access controls. The public read-only site remains available when admin credentials are absent.

## Future improvements

Add a managed identity provider with individual administrator accounts, audit logs, and automated database-backed tests. Expand visual and keyboard checks across mobile and print views.
