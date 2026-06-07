import Link from "next/link";
import { StoryblokStory } from "@storyblok/react/rsc";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/settings";
import { PostCard } from "@/components/post-card";
import type { Post } from "@/lib/types";
import { getStoryblokStory } from "@/lib/storyblok-page";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ _storyblok?: string }>;
}) {
  const { _storyblok } = await searchParams;
  const story = await getStoryblokStory("home", _storyblok !== undefined);
  if (story) return <StoryblokStory story={story} />;

  const supabase = await createSupabaseServerClient();
  const [{ data: posts }, settings] = await Promise.all([
    supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(7),
    getSiteSettings(),
  ]);

  const list = (posts || []) as Post[];
  const featured = list[0];
  const rest = list.slice(1);

  return (
    <div>
      {/* Hero */}
      <section className="relative border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 sm:py-28 md:py-36">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">
            The Journal of {settings.site_name}
          </p>
          <h1 className="serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] max-w-4xl">
            {settings.tagline || "Where ideas become iconic."}
          </h1>
          <p className="mt-8 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            A studio and a publication for work that lasts. Essays on craft,
            notes from the studio, and dispatches from the field.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/blog"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Read the Journal
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 items-center justify-center rounded-md border border-border px-8 text-sm font-medium hover:bg-muted transition-colors"
            >
              About us
            </Link>
          </div>
        </div>
      </section>

      {/* Featured + Latest */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 sm:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">
              Featured
            </p>
            <h2 className="serif text-3xl sm:text-4xl font-semibold">
              The latest essay
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex text-sm font-medium hover:text-primary transition-colors"
          >
            All essays →
          </Link>
        </div>

        {featured ? (
          <PostCard post={featured} variant="featured" />
        ) : (
          <p className="text-muted-foreground">
            No essays yet. Check back soon.
          </p>
        )}

        {rest.length > 0 && (
          <>
            <hr className="gold-divider my-16" />
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">
                  Recent
                </p>
                <h2 className="serif text-3xl sm:text-4xl font-semibold">
                  From the archive
                </h2>
              </div>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
