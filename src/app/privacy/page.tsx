import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { StoryblokStory } from "@storyblok/react/rsc";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import type { Page } from "@/lib/types";
import { getStoryblokStory } from "@/lib/storyblok-page";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage();
  return {
    title: page?.seo_title || page?.title || "Privacy",
    description: page?.seo_description || undefined,
  };
}

async function getPage(): Promise<Page | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", "privacy")
    .maybeSingle();
  return data as Page | null;
}

export default async function PrivacyPage({
  searchParams,
}: {
  searchParams: Promise<{ _storyblok?: string }>;
}) {
  const { _storyblok } = await searchParams;
  const story = await getStoryblokStory("privacy", _storyblok !== undefined);
  if (story) return <StoryblokStory story={story} />;

  const page = await getPage();
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 sm:py-24">
      <h1 className="serif text-5xl font-semibold mb-10">
        {page?.title || "Privacy"}
      </h1>
      <div className="prose-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {page?.content || "_Page content not set._"}
        </ReactMarkdown>
      </div>
    </article>
  );
}
