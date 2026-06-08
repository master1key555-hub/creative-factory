# Headless WordPress integration

This repo can pull content from a **headless WordPress** site (WordPress as the
editing UI, Next.js as the frontend) over a GraphQL API. The integration lives
in:

- `src/lib/wordpress.ts` — the `wpQuery` helper + a tested `getHomepage()` query.
- `src/app/wp-demo/page.tsx` — an example page that renders the content.

The whole stack below was set up and tested live (Docker WordPress + the three
plugins + an ACF field group + a sample page); the query and code here are the
exact ones that returned data.

## 1. Environment variable

Add to `.env.local` (this file is gitignored):

```bash
WORDPRESS_GRAPHQL_URL=https://your-wordpress-site.com/graphql
# For local Docker WordPress this is usually:
# WORDPRESS_GRAPHQL_URL=http://localhost:8080/graphql
```

> A WordPress that only lives on your laptop (LocalWP / `localhost`) works for
> local development, but a deployed site (e.g. Netlify) needs a WordPress that
> is reachable on the public internet.

## 2. WordPress plugins (THREE, not two)

Install and activate:

1. **WPGraphQL** — exposes WordPress over a `/graphql` endpoint.
2. **Advanced Custom Fields (ACF)** — lets you define editable fields.
3. **WPGraphQL for ACF** — the bridge that makes ACF fields appear in GraphQL.

> The third plugin is the one people forget. Without it, ACF fields **will not
> show up in the GraphQL schema** and the frontend gets `null`.

## 3. ACF field group

Create a field group (here named **Homepage Fields**) applied to the `Page`
post type with these settings:

- **Show in GraphQL**: enabled on the field group.
- **GraphQL Field Name**: `homepageFields` (this becomes the GraphQL key).
- Each field also has **show_in_graphql** enabled.

Fields used by the demo:

| Field label | Field name    | Type | GraphQL key   |
| ----------- | ------------- | ---- | ------------- |
| Heading     | `heading`     | Text | `heading`     |
| Video URL   | `video_url`   | URL  | `videoUrl`    |
| Button Text | `button_text` | Text | `buttonText`  |
| Button Link | `button_link` | URL  | `buttonLink`  |

Then create a Page with slug `home` and fill the fields in.

## 4. Tested GraphQL query

This is the exact query `getHomepage()` runs (verified in GraphiQL):

```graphql
query HomePage($uri: ID!) {
  page(id: $uri, idType: URI) {
    title
    uri
    homepageFields {
      heading
      videoUrl
      buttonText
      buttonLink
    }
  }
}
```

Variables: `{ "uri": "/home/" }`. Verified response:

```json
{
  "data": {
    "page": {
      "title": "Home",
      "uri": "/home/",
      "homepageFields": {
        "heading": "Добро пожаловать в Creative Factory",
        "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "buttonText": "Смотреть видео",
        "buttonLink": "https://pinterest.com"
      }
    }
  }
}
```

## 5. Caching / revalidation

`wpQuery` uses `fetch` with `next: { revalidate, tags }`. In Next.js 16 `fetch`
is **not** cached by default, so the helper opts into ISR (default 60s). For
instant updates after publishing in WordPress, call `revalidateTag` from a
WordPress webhook / route handler using the tags set in `getHomepage()`
(`wordpress:page`).

## 6. Try it

```bash
npm run dev
# open http://localhost:3000/wp-demo
```

If `WORDPRESS_GRAPHQL_URL` isn't set, the page shows a friendly "not connected"
message instead of crashing.
