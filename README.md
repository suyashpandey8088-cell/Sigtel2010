# SIG-TEL 2.0 — Railway Signalling & Telecommunications

A complete, production-oriented website for **Sigtel Signal & Telecommunication Pvt Ltd** (Navi Mumbai, incorporated 2010): a cinematic, scroll-driven experience built around the company's two disciplines — railway signalling and telecom networks.

The site is a real application, not a mock-up: every route renders, the enquiry form stores and notifies, and enquiries + the project register are managed from a session-protected admin area.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 3 with a custom design-token layer (`app/globals.css`) |
| Motion | GSAP + ScrollTrigger (pinned/horizontal storytelling, scroll-linked reveals), Framer Motion (entrances, tabs, transitions), Lenis smooth scrolling |
| Drawing | Hand-built SVG engineering plate (live section, no WebGL); Three.js available for a 3D model |
| Data | PostgreSQL (`pg`) in production; a file-backed store for local/preview. Prisma schema included as the canonical model |
| Auth | Signed, HttpOnly session cookie (HMAC-SHA256), scrypt password hashing, role-based authorisation |
| Email | Resend (optional) with logged fallback |
| Media | Local optimised images via `next/image` + `sharp`; Cloudinary host is allow-listed if you migrate media |
| Deployment | Vercel (or any Node host) + managed PostgreSQL (Neon / Supabase / RDS) |

---

## Getting started

```bash
npm install
cp .env.example .env.local     # optional for local development
npm run dev                    # http://localhost:3000
npm run build && npm start     # production build
```

Without environment variables the app runs on the local JSON store at `.data/store.json`, seeded from the verified content set in `lib/content/`. This makes the whole site — including admin — work out of the box.

### Admin

| | |
| --- | --- |
| URL | `/admin` (redirects to `/admin/login`) |
| Email | `admin@sig-tel.com` (override with `ADMIN_EMAIL`) |
| Password | set by `ADMIN_PASSWORD` in the deployment environment; the local fallback is `SigTel@2010` |

Change these before going live, and set a strong `AUTH_SECRET` (`openssl rand -base64 48`). Login attempts are rate limited; sessions expire after 8 hours.

Roles: `ADMIN` can create/edit/delete projects; `EDITOR` can read and manage enquiry status. Role checks are enforced server-side in the API routes, not only in the UI.

---

## Database

Set `DATABASE_URL` to any PostgreSQL instance and the app switches to `lib/db/pg-store.ts` automatically; tables are created on first query. You can also apply them explicitly:

```bash
psql "$DATABASE_URL" -f prisma/schema.sql   # schema
npm run db:seed                             # seed the works register
```

If your provider exposes more than one reachable endpoint (Supabase does: the
direct host is IPv6-only, the IPv4 pooler is a different hostname), list the rest
in `DATABASE_FALLBACK_URLS` — the store keeps the first endpoint that answers.
Supabase also enables row-level security on new tables; the app connects as its
own role, so run `ALTER TABLE "Project" DISABLE ROW LEVEL SECURITY;` for each of
the three tables (or add policies for that role).

`prisma/schema.prisma` documents the same three models (`Project`, `Enquiry`, `AdminUser`) and can be used with Prisma Client for scripts or internal tooling (`npx prisma generate && npx prisma db push`). The runtime data layer uses `pg` directly so the site has no engine-binary dependency at build time.

### Without a database

`DATABASE_URL` is optional. If it is absent — or if a query fails because the
database is unreachable — pages keep serving the published works register from
`lib/content/projects.ts` instead of erroring. The file store never throws: on
read-only filesystems (Vercel, containers) it keeps the snapshot in memory and
logs a single warning. Writes (enquiries, admin edits) are only durable when a
database is configured, so **production should always set `DATABASE_URL`**.

When a PostgreSQL database is connected and the `Project` table is empty, the app
seeds it from the published register on first use — no manual seed step needed.

Enquiry attachments are written to `.data/uploads` and can be downloaded from the admin dashboard through an authenticated route. **On serverless hosting use object storage** (S3 / R2 / Cloudinary) for uploads — the bundled approach is filesystem-based.

---

## Content & verification policy

Every company fact on this site is drawn from SIG-TEL's published company information:

- incorporation year (2010), office and registered office addresses, phone, email, GSTIN;
- the published works register (titles, clients, divisions, locations, status);
- published capability layers for signalling and telecom.

No statistics, client logos, certifications, approvals, project values or client quotations have been invented. Photography is AI-generated for illustration and is labelled as such where it could be mistaken for a site record. Before publishing, replace the illustrative imagery with licensed site photography if available, and confirm the status of ongoing works.

Content lives in:

```
lib/content/site.ts           company, credentials, capabilities, process, clients, states, FAQs
lib/content/projects.ts       the 19-work register with case-study narrative
lib/content/infrastructure-3d.ts   component copy + positioning for the live section
```

---

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Cinematic scroll experience: intro → hero → identity → interactive live-section plate → divisions → horizontal process → projects → India map → credentials → about → CTA |
| `/signalling` | Signalling division: five capability layers, plant, signalling works |
| `/telecommunications` | Telecom division: five layers, network stack, telecom works |
| `/projects` | Filterable works register (all / signalling / telecom / completed / ongoing) |
| `/projects/[slug]` | Case study: overview, scope, challenges, approach, equipment, results, gallery, related work |
| `/infrastructure` | Capability map, proof-at-handover documentation, delivery model, coverage map |
| `/about` | Company story, ways of working, industries served, states |
| `/contact` | Enquiry form, contact details, FAQs |
| `/privacy` | Privacy policy |
| `/admin`, `/admin/login` | Dashboard: enquiries, project CRUD, publish/unpublish |
| `/sitemap.xml`, `/robots.txt` | Generated SEO routes |

API: `POST /api/contact` · `POST /api/admin/login` · `POST /api/admin/logout` · `GET|POST /api/admin/projects` · `PATCH|DELETE /api/admin/projects/[id]` · `GET /api/admin/enquiries` · `PATCH /api/admin/enquiries/[id]` · `GET /api/admin/enquiries/[id]/attachment`

---

## Forms, spam protection, notifications

- Server-side validation with Zod (`lib/validation.ts`) plus client-side error display.
- Spam protection: honeypot field, minimum completion time, in-memory IP rate limiting (6 per 10 minutes), optional Cloudflare Turnstile (`TURNSTILE_SECRET_KEY`).
- Optional attachment: max 5 MB, stored outside the public web root, downloadable only by authenticated staff.
- Email notification via Resend when `RESEND_API_KEY` is set; otherwise the enquiry is stored and the notification is written to the server log.
- Success and error states, `aria-live` announcements.
- Admin edits call `revalidatePath`, so the public register updates immediately.

---

## SEO, performance, accessibility

- Per-page metadata, canonical URLs, Open Graph/Twitter cards, JSON-LD `Organization` + `WebSite` graph, per-project `CreativeWork` schema.
- Generated sitemap and robots (admin/API disallowed).
- Self-hosted fonts (`@fontsource`) — no third-party font requests; `next/image` with AVIF/WebP; SVG favicon.
- Section 04 is a hand-drawn SVG engineering plate (`components/home/live-section-diagram.tsx`): ten annotated components, live aspect sequence and level-crossing barriers in CSS only, no WebGL, no image assets. It is server-rendered and complete before hydration; small screens pan the plate horizontally rather than shrinking it. `components/three/railway-scene.tsx` holds the earlier R3F scene, currently unused.
- Motion respects `prefers-reduced-motion`; Lenis is disabled, GSAP timelines are skipped and the loader is bypassed.
- Semantic landmarks, skip link, visible focus states, keyboard-operable map markers and component selector, ARIA labels on controls.

---

## Project structure

```
app/
  (routes)                 home, divisions, projects, infrastructure, about, contact, privacy
  api/                     contact + admin endpoints
  admin/                   login + dashboard
  sitemap.ts, robots.ts, not-found.tsx, template.tsx
components/
  home/                    hero, identity, live-section plate, divisions, process, map, credentials, CTA
  projects/                cards + filterable showcase
  page/                    page hero, layer accordion, CTA band
  layout/                  header, overlay menu, footer
  three/                   R3F railway scene
  ui/                      reveal, counter, magnetic button, cursor, ticker, mobile CTA
  admin/                   dashboard + project editor
lib/
  content/                 verified content
  db/                      store interface, PostgreSQL + local implementations
  auth.ts, validation.ts, mailer.ts, rate-limit.ts, project-mapper.ts, revalidate.ts
prisma/                    schema.prisma, schema.sql, seed.ts
```

---

## Health check

`GET /api/health` returns the active data layer, whether the database actually
responds, the number of published projects and which optional services are
configured (booleans only — no secrets). Use it after a deploy instead of
guessing from rendered pages.

```json
{"ok":true,"driver":"postgresql","database":"up","projects":19,
 "configured":{"databaseUrl":true,"authSecret":true,"adminLogin":true,"mail":false,"siteUrl":true}}
```

## Deployment notes

1. Deploy to Vercel and add a managed PostgreSQL instance; set `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`.
2. Run `psql "$DATABASE_URL" -f prisma/schema.sql` (or let the app create tables) and `npm run db:seed` if you want the register pre-populated.
3. Configure `RESEND_API_KEY` + `ENQUIRY_FROM_EMAIL` for enquiry notifications (verify the sending domain).
4. Optional: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` or `NEXT_PUBLIC_GA_ID` for analytics; `TURNSTILE_SECRET_KEY` for captcha.
5. Replace the illustrative imagery and confirm the status of ongoing works before launch.
