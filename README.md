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

## Account requests

The existing environment administrator remains the sole approver. Account requests are disabled unless `ENABLE_ACCOUNT_REQUESTS=true`; keep this unset in production until the flow has been tested. Apply `migrations/001_account_requests.sql` to an isolated Neon development branch first, and point the local `DATABASE_URL` to that branch before enabling and testing registration. The migration adds a separate account request table and does not modify existing meetings. Requests store `scrypt` password hashes; newly registered accounts cannot sign in or manage meetings until the environment administrator approves them at `/admin/requests`. Approved accounts may use their username or email to sign in. Apply the reviewed migration to production only as a separate, authorized deployment step.

To confirm the local branch, select `w04-testing` in the Neon project's branch selector, copy its connection string from **Connection Details**, and compare its host and database name with the local `DATABASE_URL` without sharing the password. Replace the local value only after confirming the branch. Then apply the migration and set `ENABLE_ACCOUNT_REQUESTS=true` locally. Do not set the flag in Vercel Production until the production database has the reviewed schema and the complete flow has passed testing.

Password recovery is available for registered accounts only after the account-request migration and transactional email are configured. Set `ENABLE_ACCOUNT_REQUESTS=true`, `RESEND_API_KEY`, `RESET_EMAIL_FROM` (a verified sender), and `APP_BASE_URL` (the HTTPS origin). The server sends links through Resend; reset tokens are random, stored only as SHA-256 hashes, expire after 30 minutes, and are consumed once. Requests are capped at three tokens per account per hour. Until configured, the recovery page clearly reports that online recovery is unavailable. The existing environment administrator changes their password through environment configuration.
