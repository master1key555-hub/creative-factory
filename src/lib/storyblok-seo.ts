import type { Metadata } from "next";
import type { ISbStoryData } from "@storyblok/react/rsc";

// SEO fields an editor can fill on a Storyblok story (added to the `page`
// schema under an "SEO" tab). All optional — pages without them fall back to
// the story name / page-level defaults.
type Asset = { filename?: string; alt?: string };
type SeoFields = {
  seo_title?: string;
  seo_description?: string;
  og_image?: Asset | string;
  // Vertical 2:3 image preferred for Pinterest/social previews when present.
  pinterest_image?: Asset | string;
  canonical_url?: string;
  noindex?: boolean;
};

function assetUrl(a?: Asset | string): string | undefined {
  if (!a) return undefined;
  if (typeof a === "string") return a || undefined;
  return a.filename || undefined;
}

type Fallback = {
  title?: string;
  description?: string;
};

// Builds Next.js Metadata from a Storyblok story's SEO fields, preferring the
// Pinterest image as the social card when set. `fallback` supplies values when
// a story is missing or a field is empty.
export function storyblokMetadata(
  story: ISbStoryData | null,
  fallback: Fallback = {},
): Metadata {
  const c = (story?.content as SeoFields | undefined) ?? {};
  const title = c.seo_title || story?.name || fallback.title;
  const description = c.seo_description || fallback.description;
  const social = assetUrl(c.pinterest_image) || assetUrl(c.og_image);
  const images = social ? [social] : [];

  const meta: Metadata = {
    title,
    description,
    openGraph: { title: title ?? undefined, description, images, type: "website" },
    twitter: {
      card: "summary_large_image",
      title: title ?? undefined,
      description,
      images,
    },
  };
  if (c.canonical_url) meta.alternates = { canonical: c.canonical_url };
  if (c.noindex) meta.robots = { index: false, follow: false };
  return meta;
}
