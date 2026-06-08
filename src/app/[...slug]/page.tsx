import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryblokStory } from "@storyblok/react/rsc";
import type { ISbStoryData } from "@storyblok/react/rsc";

import { getStoryblokStory } from "@/lib/storyblok-page";

// Re-fetch from Storyblok at most once per minute (incremental static
// regeneration). Allow slugs not generated at build time to render on demand.
export const revalidate = 60;
export const dynamicParams = true;

type PageParams = { slug: string[] };
type SearchParams = { _storyblok?: string };

// SEO fields an editor may add to a story's content (Phase 2). Read defensively
// so pages without them still render.
type SeoContent = {
  seo_title?: string;
  seo_description?: string;
};

function seoOf(story: ISbStoryData): SeoContent {
  const content = story.content as SeoContent | undefined;
  return {
    seo_title: content?.seo_title,
    seo_description: content?.seo_description,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryblokStory(slug.join("/"), false);
  if (!story) return {};
  const seo = seoOf(story);
  return {
    title: seo.seo_title || story.name,
    description: seo.seo_description || undefined,
  };
}

// Public catch-all: any published Storyblok story is reachable at its own path
// (e.g. a story with slug `landing-pinterest-1` renders at `/landing-pinterest-1`).
// Matches multi-segment slugs too. Static routes (`/about`, `/admin`, `/blog`,
// `/login`, …) are more specific and always take precedence over this route.
export default async function StoryblokPublicPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const { _storyblok } = await searchParams;

  const story = await getStoryblokStory(slug.join("/"), _storyblok !== undefined);
  if (!story) notFound();

  return <StoryblokStory story={story} />;
}
