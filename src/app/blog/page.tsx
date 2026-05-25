import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PostCard } from "@/components/post-card";
import { BlogSearch } from "@/components/blog-search";
import type { Post } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal",
  description: "Essays, studio notes, and dispatches from Creative Factory.",
};

const PAGE_SIZE = 9;

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const q = (params.q || "").trim();
  const tag = (params.tag || "").trim();

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (q) {
    query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%,excerpt.ilike.%${q}%`);
  }
  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data: posts, count } = await query.range(from, to);

  const list = (posts || []) as Post[];
  const total = count || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Collect unique tags for the filter row (top 8)
  const { data: tagSample } = await supabase
    .from("posts")
    .select("tags")
    .eq("status", "published")
    .limit(50);
  const tagCounts = new Map<string, number>();
  (tagSample || []).forEach((row: { tags: string[] }) =>
    (row.tags || []).forEach((t) =>
      tagCounts.set(t, (tagCounts.get(t) || 0) + 1),
    ),
  );
  const allTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([t]) => t);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 sm:py-24">
      <header className="mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
          The Journal
        </p>
        <h1 className="serif text-5xl sm:text-6xl font-semibold">
          {q ? `Results for "${q}"` : tag ? `Tagged "${tag}"` : "All essays"}
        </h1>
      </header>

      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <BlogSearch defaultValue={q} />
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                !tag
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary"
              }`}
            >
              All
            </Link>
            {allTags.map((t) => (
              <Link
                key={t}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  tag === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary"
                }`}
              >
                {t}
              </Link>
            ))}
          </div>
        )}
      </div>

      {list.length === 0 ? (
        <p className="text-muted-foreground">No essays found.</p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          className="mt-16 flex items-center justify-center gap-2"
          aria-label="Pagination"
        >
          {page > 1 && (
            <Link
              href={{
                pathname: "/blog",
                query: { ...(q && { q }), ...(tag && { tag }), page: page - 1 },
              }}
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
            >
              ← Previous
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={{
                pathname: "/blog",
                query: { ...(q && { q }), ...(tag && { tag }), page: page + 1 },
              }}
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
            >
              Next →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
