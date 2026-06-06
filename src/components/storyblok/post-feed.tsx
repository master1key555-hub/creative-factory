import Link from "next/link";
import { storyblokEditable, type SbBlokData } from "@storyblok/react/rsc";

import { PostCard } from "@/components/post-card";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { Post } from "@/lib/types";

interface PostFeedBlok extends SbBlokData {
  featured_eyebrow?: string;
  featured_title?: string;
  archive_eyebrow?: string;
  archive_title?: string;
  all_label?: string;
  limit?: number | string;
}

// Dynamic block: renders the latest published posts from the database (the same
// feed as the homepage). Content stays managed in /admin; only the surrounding
// labels are editable in Storyblok.
export default async function PostFeed({ blok }: { blok: PostFeedBlok }) {
  const limit = Number(blok.limit) > 0 ? Number(blok.limit) : 7;

  let list: Post[] = [];
  try {
    const supabase = createSupabasePublicClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);
    list = (data || []) as Post[];
  } catch {
    list = [];
  }

  const featured = list[0];
  const rest = list.slice(1);

  return (
    <section
      {...storyblokEditable(blok)}
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 sm:py-20"
    >
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">
            {blok.featured_eyebrow || "Featured"}
          </p>
          <h2 className="serif text-3xl sm:text-4xl font-semibold">
            {blok.featured_title || "The latest essay"}
          </h2>
        </div>
        <Link
          href="/blog"
          className="hidden sm:inline-flex text-sm font-medium hover:text-primary transition-colors"
        >
          {blok.all_label || "All essays →"}
        </Link>
      </div>

      {featured ? (
        <PostCard post={featured} variant="featured" />
      ) : (
        <p className="text-muted-foreground">No essays yet. Check back soon.</p>
      )}

      {rest.length > 0 && (
        <>
          <hr className="gold-divider my-16" />
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">
                {blok.archive_eyebrow || "Recent"}
              </p>
              <h2 className="serif text-3xl sm:text-4xl font-semibold">
                {blok.archive_title || "From the archive"}
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
  );
}
