# Creative Factory

A premium, dynamic blog & CMS built with Next.js + Supabase. Editorial design,
admin panel, authentication (email/password + Google OAuth), comments, likes,
newsletter, cookie consent — every part editable from `/admin`.

100% free hosting stack: **Vercel** (frontend) + **Supabase** (database, auth,
storage).

---

## Quick start

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **Sign in with GitHub**.
2. **New project**: name `creative-factory`, pick a region close to you,
   save the database password.
3. Wait ~2 minutes for it to provision.
4. Open **SQL Editor** → **New query** → paste the contents of
   `supabase/migrations/001_initial_schema.sql` → **Run**. This creates all
   tables, RLS policies, helper functions, the `media` storage bucket, and
   seeds 3 sample posts plus default `/about`, `/privacy`, `/terms` pages.
5. **Project Settings → API** — copy these values for the next step:
   - `Project URL`
   - `anon public` key
   - `service_role` key (click **Reveal**)
6. **Authentication → Providers**:
   - **Email**: enable, turn ON "Confirm email".
   - **Google** (optional, can be added later): toggle on, create OAuth
     credentials in [Google Cloud Console](https://console.cloud.google.com),
     paste the Client ID/Secret, and add the Supabase callback URL
     (`https://<your-ref>.supabase.co/auth/v1/callback`) as the redirect URI.
7. **Authentication → URL Configuration**:
   - Site URL: your production URL (e.g. `https://your-app.vercel.app`).
     For local dev only: `http://localhost:3000`.
   - Redirect URLs: add both your production URL and
     `http://localhost:3000/auth/callback`.

### 2. Run locally

```bash
cp .env.example .env.local
# fill .env.local with the three values from step 1.5
npm install
npm run dev
```

Open <http://localhost:3000>.

### 3. First admin login

1. Go to `/register` and sign up with **master1key555@gmail.com** (the
   schema's `handle_new_user()` trigger auto-promotes that email to admin).
2. Click the verification link in your inbox.
3. You'll be redirected to `/profile`. Click **Admin** in the header
   (now visible) to enter the admin panel.

### 4. Deploy to Vercel

1. Push the repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) → **Import** the repo.
3. Add the three environment variables from `.env.example`.
4. **Deploy**. Vercel will give you a URL like `creative-factory.vercel.app`.
5. Go back to **Supabase → Authentication → URL Configuration** and add the
   Vercel URL to **Site URL** and **Redirect URLs**.

---

## What's included

### Public pages
- `/` — Hero, featured essay, latest grid
- `/blog` — Paginated essay list with search + tag filter
- `/blog/[slug]` — Single essay with comments, likes, share buttons,
  related posts, view counter
- `/about`, `/privacy`, `/terms` — Editable from `/admin/pages`
- `/contact` — Contact form (submissions go to `/admin/submissions`)
- `/sitemap.xml`, `/robots.txt`, `/rss.xml` — Auto-generated

### Auth
- `/login`, `/register` — Email/password **and** Google OAuth on the same form
- `/forgot-password`, `/reset-password` — Email-link password reset
- `/profile` — Edit name, avatar URL, change password
- Email verification required for password sign-ups
- `master1key555@gmail.com` auto-promoted to admin role

### Admin panel (`/admin`)
- **Dashboard** — counts, recent posts, recent submissions
- **Posts** — full CRUD, Markdown editor, cover image upload,
  tags, draft/published toggle, SEO fields, OG image
- **Pages** — edit About, Privacy, Terms in Markdown
- **Users** — promote/demote admin, suspend/unsuspend
- **Subscribers** — list, export CSV, remove
- **Submissions** — view, mark read, reply via mailto, delete
- **Settings** — brand name, tagline, logo, social URLs (Instagram,
  Telegram, Facebook, Twitter, Pinterest), footer text, brand colors,
  default OG image

### Site features
- **Dark mode** toggle (persists in localStorage)
- **Cookie consent** banner with Accept / Reject / Customize options
  (GDPR-style; analytics/marketing cookies only load after explicit consent)
- **Newsletter** subscription in footer (stored in `subscribers` table,
  exportable as CSV from admin)
- **Premium design** — Playfair Display headings, Inter body,
  charcoal / cream / gold / burgundy palette, generous whitespace
- **Responsive** — mobile, tablet, desktop
- **Image optimization** via Next.js `<Image>`
- **SEO** — per-post titles/descriptions, OpenGraph tags, Twitter cards

### Tech stack
- **Next.js 16** (App Router) + TypeScript + TailwindCSS 4
- **Supabase**: Postgres + Auth + Storage
- **next-themes** for dark mode
- **react-markdown** + **remark-gfm** for Markdown rendering
- **lucide-react** for icons, plus inline SVGs for brand icons
- **Vercel** for hosting (free tier)

---

## File structure

```
src/
  app/
    page.tsx              # Home
    layout.tsx            # Root layout (header + footer + cookie banner)
    blog/                 # Blog list + post detail
    admin/                # Admin panel (protected by layout)
    login, register, ... # Auth pages
    auth/callback/        # OAuth + email-link callback
    sitemap.ts, robots.ts, rss.xml/
  components/             # UI + feature components
    ui/                   # Button, Input, Textarea, Label, Card
    admin/                # Post form, page form, settings form
    auth/                 # Login form, register form
  lib/
    supabase/             # Browser, server, proxy clients
    actions/              # Server Actions (auth, posts, pages, comments, ...)
    auth.ts               # getCurrentUser / requireAdmin helpers
    settings.ts           # getSiteSettings()
    types.ts              # TypeScript types
    utils.ts              # cn, slugify, formatDate, readingTime, excerpt
  proxy.ts                # Auth session refresh (was middleware.ts in <Next 16)
supabase/
  migrations/
    001_initial_schema.sql
```

---

## Customization

- **Brand colors** — `src/app/globals.css` (CSS variables) or override
  per-deploy from `/admin/settings`.
- **Typography** — `src/app/layout.tsx` (`Playfair_Display`, `Inter`).
- **Header / footer links** — `src/components/header.tsx`,
  `src/components/footer.tsx`.
- **Social icons** — `src/components/brand-icons.tsx` (inline SVGs because
  lucide-react removed brand icons in v0.500+).
- **Admin email** — change the literal `master1key555@gmail.com` in
  `supabase/migrations/001_initial_schema.sql` (function `handle_new_user`)
  and `src/lib/utils.ts` (`ADMIN_EMAIL`).

---

## Optional: email sending via Resend

Supabase's free tier sends ~3 emails/hour from a shared sender. For
production-grade transactional email, sign up at [resend.com](https://resend.com)
(free 3000/mo, 100/day) and configure it as your Supabase SMTP provider:
**Project Settings → Auth → SMTP Settings**.

---

## License

MIT.
