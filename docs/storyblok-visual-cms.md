# Storyblok visual CMS

Storyblok is a cloud headless CMS with a **Visual Editor**: you edit pages while
seeing your real site, and click blocks in-context to change them. This repo
ships an integration scaffold so pages designed in Storyblok render on the site.

Nothing here changes the existing site. Storyblok pages are served under
`/cms/*` and the rest of the app (home, blog, auth, admin) is untouched.

## How it works

```
Storyblok (cloud editor) ──API──► Next.js (/cms/[[...slug]]) ──► Netlify (live site)
```

- Blocks ("bloks") are defined once in code (see `src/components/storyblok/`).
- You add/fill/reorder those blocks visually in Storyblok.
- The page renders at `/cms/<slug>` (the story with slug `home` renders at `/cms`).

## Configuration

Set these environment variables (locally in `.env.local`, and on Netlify):

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_STORYBLOK_TOKEN` | Storyblok **Preview** access token (read-only, safe to expose) |
| `NEXT_PUBLIC_STORYBLOK_REGION` | `eu` (default), or `us` / `ap` / `ca` if your space is in that region |

Without a token, `/cms` shows a friendly "not connected" page (build still works).

## Account setup (one time)

1. Sign up at https://app.storyblok.com (free plan is enough).
2. **Create new space** → blank / start from scratch. Note the **region** you pick.
3. **Settings → Access Tokens** → copy the **Preview** token.
4. Put the token (and region, if not EU) into the env variables above.

## Blocks included

Defined in `src/lib/storyblok.ts` and `src/components/storyblok/`:

| Storyblok block name | Fields | Purpose |
| --- | --- | --- |
| `page` | `body` (Blocks) | Content-type page; container for the blocks below |
| `hero` | `eyebrow`, `heading`, `subheading` (Text) | Big centered intro |
| `text` | `text` (Textarea), `align` (Text) | Paragraph |
| `image` | `image` (Asset), `alt`, `caption` (Text) | Picture |
| `button` | `label` (Text), `link` (Link) | Call-to-action |
| `columns` | `columns` (Blocks) | Two-column row of nested blocks |

In Storyblok, create matching blocks under **Block Library** with the same
technical names and fields, then build a Story (e.g. slug `home`) using them.

## Live editing (Visual Editor)

1. In Storyblok: **Settings → Visual Editor** → set the preview URL to your site,
   e.g. `https://pinsite.netlify.app/cms/` (must be HTTPS).
2. Open a Story → left = fields, right = your real site. Edits appear live.
3. **Publish** to make changes visible to public visitors.

> The `/cms` route serves the **draft** version inside the editor (it appends a
> `_storyblok` param) and the **published** version to public visitors.

## Auto-rebuild on publish (optional)

If serving statically, connect a Netlify **Build hook** to a Storyblok
**Webhook** ("Story published") so publishing rebuilds the site. With the
`revalidate = 60` ISR setting in the route, this is optional.
