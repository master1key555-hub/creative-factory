import type { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import {
  STORYBLOK_TOKEN,
  isStoryblokConfigured,
  storyblokCdnBase,
} from "@/lib/storyblok-config";

async function siteOrigin() {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = host.includes("localhost") ? "http" : "https";
  return `${proto}://${host}`;
}

// Slugs already emitted as static entries above, or served by their own
// non-Storyblok routes — skip them so the sitemap has no duplicates.
const RESERVED_SLUGS = new Set([
  "home",
  "about",
  "contact",
  "privacy",
  "terms",
  "blog",
  "admin",
  "login",
  "register",
  "profile",
  "forgot-password",
  "reset-password",
]);

type SbStory = {
  full_slug?: string;
  published_at?: string;
  content?: { noindex?: boolean };
};

// Fetches published stories straight from the Storyblok CDN. Uses a bare
// `fetch` (not `@/lib/storyblok`) so the component registry stays out of this
// route's bundle.
async function storyblokUrls(origin: string): Promise<MetadataRoute.Sitemap> {
  if (!isStoryblokConfigured) return [];
  try {
    const url =
      `${storyblokCdnBase()}/v2/cdn/stories` +
      `?version=published&per_page=100&token=${STORYBLOK_TOKEN}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = (await res.json()) as { stories?: SbStory[] };
    const stories = data.stories ?? [];
    return stories
      .filter((s) => {
        const slug = s.full_slug;
        if (!slug || RESERVED_SLUGS.has(slug)) return false;
        return !s.content?.noindex;
      })
      .map((s) => ({
        url: `${origin}/${s.full_slug}`,
        lastModified: s.published_at || undefined,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await siteOrigin();
  const staticUrls: MetadataRoute.Sitemap = [
    "",
    "/blog",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${origin}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const storyUrls = await storyblokUrls(origin);

  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("status", "published");
    const postUrls: MetadataRoute.Sitemap = (data || []).map((p) => ({
      url: `${origin}/blog/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    return [...staticUrls, ...storyUrls, ...postUrls];
  } catch {
    return [...staticUrls, ...storyUrls];
  }
}
