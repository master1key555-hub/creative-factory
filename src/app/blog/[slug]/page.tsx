import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { formatDate, readingTime } from "@/lib/utils";
import { LikeButton } from "@/components/like-button";
import { CommentsSection } from "@/components/comments-section";
import { ShareButtons } from "@/components/share-buttons";
import { PostCard } from "@/components/post-card";
import type { Post, Comment } from "@/lib/types";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("posts")
    .select("title, excerpt, seo_title, seo_description, cover_url, og_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (!data) return { title: "Essay" };
  return {
    title: data.seo_title || data.title,
    description: data.seo_description || data.excerpt || undefined,
    openGraph: {
      title: data.seo_title || data.title,
      description: data.seo_description || data.excerpt || undefined,
      images: data.og_image_url || data.cover_url
        ? [data.og_image_url || data.cover_url!]
        : [],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const typed = post as Post;

  // Fire-and-forget view increment via security-definer RPC
  void supabase.rpc("increment_post_views", { post_slug: typed.slug });

  const [likesRes, commentsRes, profile, relatedRes] = await Promise.all([
    supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", typed.id),
    supabase
      .from("comments")
      .select("*")
      .eq("post_id", typed.id)
      .order("created_at", { ascending: false }),
    getCurrentProfile().catch(() => null),
    supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .neq("id", typed.id)
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  const likesCount = likesRes.count ?? 0;
  const comments = commentsRes.data;
  const related = relatedRes.data;

  let liked = false;
  if (profile) {
    const { data: l } = await supabase
      .from("likes")
      .select("user_id")
      .eq("post_id", typed.id)
      .eq("user_id", profile.id)
      .maybeSingle();
    liked = !!l;
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 sm:py-24">
      <header className="mb-10 text-center">
        {typed.tags.length > 0 && (
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
            {typed.tags.join(" · ")}
          </p>
        )}
        <h1 className="serif text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
          {typed.title}
        </h1>
        {typed.excerpt && (
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            {typed.excerpt}
          </p>
        )}
        <div className="mt-8 flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <span>{typed.author_name || "Creative Factory"}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(typed.published_at || typed.created_at)}</span>
          <span aria-hidden="true">·</span>
          <span>{readingTime(typed.content)} min read</span>
        </div>
      </header>

      {typed.cover_url && (
        <div className="relative aspect-[16/9] mb-12 overflow-hidden rounded-lg bg-muted">
          <Image
            src={typed.cover_url}
            alt={typed.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose-content text-foreground">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {typed.content}
        </ReactMarkdown>
      </div>

      <hr className="gold-divider my-12" />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <LikeButton
          postId={typed.id}
          postSlug={typed.slug}
          initialLikes={likesCount}
          initialLiked={liked}
          loggedIn={!!profile}
        />
        <ShareButtons title={typed.title} slug={typed.slug} />
      </div>

      <hr className="gold-divider my-12" />

      <CommentsSection
        postId={typed.id}
        postSlug={typed.slug}
        comments={(comments || []) as Comment[]}
        loggedIn={!!profile}
        currentUserId={profile?.id || null}
        isAdmin={profile?.role === "admin"}
      />

      {related && related.length > 0 && (
        <>
          <hr className="gold-divider my-16" />
          <section>
            <h2 className="serif text-2xl font-semibold mb-8">Read next</h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {(related as Post[]).map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        </>
      )}

      <div className="mt-16 text-center">
        <Link
          href="/blog"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          ← Back to the Journal
        </Link>
      </div>
    </article>
  );
}
