import type { ISbStoryData } from "@storyblok/react/rsc";

import { getStoryblokApi, isStoryblokConfigured } from "@/lib/storyblok";

// Fetches a Storyblok story for a public route. Returns null when Storyblok is
// not configured, the story is missing, or the request fails — callers then
// render their built-in fallback so a Storyblok outage never breaks the page.
//
// `preferDraft` is true inside the Visual Editor (it appends `_storyblok`); the
// published version is served to public visitors in production.
export async function getStoryblokStory(
  slug: string,
  preferDraft: boolean,
): Promise<ISbStoryData | null> {
  if (!isStoryblokConfigured) return null;

  const version =
    preferDraft || process.env.NODE_ENV !== "production"
      ? "draft"
      : "published";

  try {
    const api = getStoryblokApi();
    const { data } = await api.get(`cdn/stories/${slug}`, { version });
    return (data?.story as ISbStoryData) ?? null;
  } catch {
    return null;
  }
}
