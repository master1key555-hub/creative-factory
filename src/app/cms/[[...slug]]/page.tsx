import { notFound } from "next/navigation";
import { StoryblokStory } from "@storyblok/react/rsc";
import type { ISbStoryData } from "@storyblok/react/rsc";

import { getStoryblokApi, isStoryblokConfigured } from "@/lib/storyblok";

// Re-fetch from Storyblok at most once per minute (incremental static
// regeneration). Allow paths not generated at build time to render on demand.
export const revalidate = 60;
export const dynamicParams = true;

type PageParams = { slug?: string[] };
type SearchParams = { _storyblok?: string };

function NotConfigured() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <p className="text-sm font-medium uppercase tracking-widest text-primary">
        Storyblok
      </p>
      <div className="mt-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="serif text-3xl font-semibold">
          Storyblok is not connected yet
        </h1>
        <p className="mt-3 text-muted-foreground">
          Set <code>NEXT_PUBLIC_STORYBLOK_TOKEN</code> (and{" "}
          <code>NEXT_PUBLIC_STORYBLOK_REGION</code> if your space is not in the
          EU) in your environment, then reload. See{" "}
          <code>docs/storyblok-visual-cms.md</code> for setup.
        </p>
      </div>
    </div>
  );
}

async function fetchStory(slug: string, version: "draft" | "published") {
  const api = getStoryblokApi();
  const { data } = await api.get(`cdn/stories/${slug}`, { version });
  return data.story as ISbStoryData;
}

export default async function StoryblokCmsPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<SearchParams>;
}) {
  if (!isStoryblokConfigured) {
    return <NotConfigured />;
  }

  const { slug } = await params;
  const { _storyblok } = await searchParams;
  const path = slug && slug.length > 0 ? slug.join("/") : "home";

  // Serve drafts inside the Visual Editor (it appends `_storyblok`) and in
  // development; serve the published version to public visitors in production.
  const version =
    _storyblok !== undefined || process.env.NODE_ENV !== "production"
      ? "draft"
      : "published";

  let story: ISbStoryData;
  try {
    story = await fetchStory(path, version);
  } catch {
    notFound();
  }

  return <StoryblokStory story={story} />;
}
