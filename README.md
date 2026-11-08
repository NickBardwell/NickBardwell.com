# LSUA Club Hub

A responsive student organization directory for LSU Alexandria, with 59 supplied club, program, and resource entries, illustrated cards, detail dialogs, search, categories, local bookmarks, applications, new-club proposals, status history, and an administrator review queue. Listings appear alphabetically; membership counts are not displayed or used for ranking.

## Live website

https://lsua-club-hub-nbardwell.fairjive2.chatgpt.site

The live URL is hosted on Sites; uploading the source to GitHub does not itself provision hosting on NickBardwell.com. GitHub Pages alone cannot run the database and protected review workflow.

## Stack

React 19 + TypeScript, Vinext/Vite, Cloudflare Workers, Drizzle, and Cloudflare D1. Icons and decorative illustrations are built with Lucide SVGs and CSS; no external image service is required.

## Run locally

Requires Node 22.13+ and npm.

1. `npm run install:ci`
2. `npm run build`
3. `node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_graceful_outlaw_kid.sql`
4. `npm run dev`

Use the printed local URL. Local sign-in is a development-only test identity; it is never included in production. Local and production databases are separate. Do not run `tests/local-api.mjs` against a production URL: it intentionally creates local QA requests. Run the suite once against a fresh migrated local database.

## Checks

- `node --test tests/domain.test.mjs`
- `node tests/local-api.mjs` (development server running; fresh local DB)
- `node node_modules/typescript/bin/tsc --noEmit`
- `npm run build`

## Student workflow

Browse without signing in. Open an organization for its description, source, and related website. Apply after signing in with ChatGPT and providing an LSUA contact email. Applications are stored in D1 and stay pending until reviewed. Applicants see only their own requests and history, can reply to information requests, and can withdraw pending requests.

The LSUA email field is domain-validated, not university-verified. The app does not request university passwords and does not implement university SSO.

Where a reviewer has verified a self-enrollment link, the detail dialog offers an Involve handoff. Club Hub cannot directly enroll people in Involve; reviewers must complete or verify the official enrollment step and explicitly confirm it before marking an application approved.

## New organizations

Students submit a club name, mission, category, and optional advisor. They consent to publishing the name, mission, and category after approval. Reviewers confirm Student Life recognition before approving; an approved proposal becomes a directory entry. Applicant names, email addresses, and advisor details are not published in the directory.

## Administrator setup

Set the server runtime variable `CLUB_HUB_ADMIN_EMAILS` to a comma-separated allowlist of the reviewers’ authenticated ChatGPT email addresses. No administrator address or credentials are embedded in the repository. Sign in with an allowlisted account to see Review queue. Reviewers can request information, approve confirmed outcomes, decline applications, and configure verified self-join links or manual-review paths.

The initial hosted deployment has the site owner’s connected-account email configured privately. To delegate review to Student Life, update the runtime allowlist with their agreed sign-in emails. Do not publish that configuration in source.

Status flow: submitted → under review → more information / approved / not approved. An information reply returns a request to review. Only the applicant can withdraw; confirmed outcomes are final. Every change produces a status-history entry. A unique active application key prevents duplicate requests per signed-in user and club.

## Deployment

The tracked `.openai/hosting.json` identifies the Sites project and D1 binding. Publish through the Sites source and version workflow; production migrations are applied by the hosting service. Keep `.env`, `.dev.vars`, local databases, credentials, node_modules, and build output out of Git.

For a standalone Cloudflare deployment, configure an authenticated edge that strips untrusted `oai-authenticated-user-*` request headers and injects verified identity, or replace `app/chatgpt-auth.ts` with your own verified authentication adapter. Do not deploy the Worker directly to an unprotected public endpoint and trust visitor-supplied identity headers. Sites supplies this trusted boundary for the included hosted deployment.

## Reference quality and launch limits

Descriptions come from the LSUA/organization pages linked in `lib/clubs.ts` and the supplied student reference. Unverified listings, the LSU Baton Rouge fallback, and older references are labeled. The Second Act’s exact identity remains unconfirmed. The inaccessible SharePoint document may contain additional clubs; 59 is the number of supplied directory entries, not a verified campus-wide total.

This is an independent student project, not an official university enrollment system. Campus-specific approval rules and join methods still need Student Life confirmation. Notifications appear in the site; outgoing email and automatic Involve synchronization are not configured. Never submit sensitive misconduct reports through club applications; use the Title IX office’s official channel.

## Main files

- `components/hub.tsx` — directory, dialogs, forms, tracking, and review interface
- `app/globals.css` — responsive visual design
- `lib/clubs.ts` — supplied directory and source references
- `app/api/` — authenticated requests and reviewer endpoints
- `db/schema.ts`, `drizzle/` — persistent schema and migration
- `lib/access.ts`, `lib/workflow.ts` — server authorization and workflow rules

## Image/icon license

Lucide icons are distributed under the ISC license in the installed `lucide-react` package. Custom composition, decorative art, and Club Hub branding are original site code. University branding is referenced descriptively; no official logo or endorsement is implied.

