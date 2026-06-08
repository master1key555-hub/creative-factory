import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryblokStory } from "@storyblok/react/rsc";

import { getStoryblokStory } from "@/lib/storyblok-page";
import { storyblokMetadata } from "@/lib/storyblok-seo";

// Re-fetch from Storyblok at most once per minute (incremental static
// regeneration). Allow slugs not generated at build time to render on demand.
export const revalidate = 60;
export const dynamicParams = true;

type PageParams = { slug: string[] };
type SearchParams = { _storyblok?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryblokStory(slug.join("/"), false);
  return storyblokMetadata(story);
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
